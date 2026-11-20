import http from 'http';
import crypto from 'crypto';
import {
  renderOrderEmail,
  renderRefundEmail,
  renderShippingEmail,
  renderCustomMessageEmail,
  renderAdminOrderNotificationEmail,
  renderReviewRequestEmail,
  escapeHtml
} from './templates.js';
import { createReviewQueue, defaultReviewFile } from './reviewRequests.js';
import { IncidentStore, isBenignClientError } from './incidents.js';
import { verifyGithubOidcToken } from './githubOidc.js';
import { renderDailyReport } from './autoHealReport.js';
import { createMailer } from './mailer.js';
import { shippingDetails } from './stripeSession.js';
import { lireCommande, creerSession } from './commande.js';
import { createStripeEventLog, defaultEventsFile, EVENT_STATE } from './stripeEvents.js';

const PORT = process.env.PORT || 3000;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
// Clé restreinte (Checkout Sessions en écriture) : création du paiement depuis le panneau d'achat.
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_API_BASE = process.env.STRIPE_API_BASE || 'https://api.stripe.com';
// Aucun secret par défaut : sans ADMIN_SECRET (32 caractères minimum), les routes
// d'administration sont désactivées (fail closed).
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';
const ADMIN_ENABLED = ADMIN_SECRET.length >= 32;
const mailer = createMailer(process.env);
// Demande d'avis J+10 (voir reviewRequests.js). Les variables REVIEW_* de délai servent aux tests.
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || 'https://kyran-webhook-production.up.railway.app').replace(/\/+$/, '');
const reviewQueue = createReviewQueue({
  file: defaultReviewFile(),
  secret: process.env.REVIEW_UNSUB_SECRET || STRIPE_WEBHOOK_SECRET,
  delayMs: Number(process.env.REVIEW_DELAY_MS) || undefined
});
const REVIEW_TICK_MS = Number(process.env.REVIEW_TICK_MS) || 60 * 60 * 1000;

// Tolérance sur l'horodatage de signature Stripe (valeur par défaut des SDK Stripe)
const STRIPE_TOLERANCE_SECONDS = 300;

// Origines autorisées à appeler l'API d'administration depuis un navigateur
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://kyran-jeu.fr,https://www.kyran-jeu.fr')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
// Ventes sur place : copie de l'alerte vers une boîte lue sur le téléphone de Corentin.
const SUR_PLACE_ALERT_EMAILS = (process.env.SUR_PLACE_ALERT_EMAILS || '')
  .split(',')
  .map(e => e.trim())
  .filter(Boolean);

// Destinataires des alertes administratives de vente (à définir via ADMIN_NOTIFICATION_EMAILS)
const ADMIN_EMAILS = (process.env.ADMIN_NOTIFICATION_EMAILS || 'contact@kyran-jeu.fr')
  .split(',')
  .map(e => e.trim())
  .filter(Boolean);

// Auto-Heal : le workflow GitHub s'authentifie par jeton OIDC (aucun secret partagé).
// CRON_SECRET (32 caractères min.) reste possible pour un appel manuel.
const AUTO_HEAL_REPOSITORY = process.env.AUTO_HEAL_REPOSITORY || 'Cmssmc-code/kyran-jeu';
const AUTO_HEAL_AUDIENCE = 'kyran-auto-heal';
const CRON_SECRET = process.env.CRON_SECRET || '';
const AUTO_HEAL_REPORT_EMAILS = (process.env.AUTO_HEAL_REPORT_EMAILS || '')
  .split(',')
  .map(e => e.trim())
  .filter(Boolean);
const MAX_CLIENT_REPORT_BYTES = 16384;
// Rapport quotidien de la routine Claude « Surveillance & réparation » : destinataire unique fixé ici,
// jamais fourni par l'appelant (aucun envoi possible à un tiers).
const ROUTINE_REPORT_TO = 'kyran.jeu@gmail.com';
const ROUTINE_REPORT_SUBJECT = /^KYRAN — surveillance & réparation du (\d{2}\/\d{2})$/;
const MAX_ROUTINE_REPORT_BYTES = 262144;
const incidents = new IncidentStore();

if (!ADMIN_ENABLED) {
  console.warn('⚠️ ADMIN_SECRET absent ou trop court (< 32 caractères) : routes /api/* désactivées.');
}
if (!STRIPE_WEBHOOK_SECRET) {
  console.warn('⚠️ STRIPE_WEBHOOK_SECRET absent : tous les webhooks Stripe seront rejetés.');
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest();
}

// Comparaison à temps constant (évite les attaques temporelles)
function safeEqual(a, b) {
  return crypto.timingSafeEqual(sha256(a), sha256(b));
}

// Limitation de débit en mémoire : au-delà de `limit` requêtes par fenêtre et par clé
const rateBuckets = new Map();
function rateLimited(key, limit, windowMs) {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.start > windowMs) {
    rateBuckets.set(key, { start: now, count: 1 });
    if (rateBuckets.size > 10000) {
      for (const [k, b] of rateBuckets) if (now - b.start > windowMs) rateBuckets.delete(k);
    }
    return false;
  }
  bucket.count += 1;
  return bucket.count > limit;
}

const EMAIL_RE = /^[^\s@<>"'(),;:]+@[^\s@<>"'(),;:]+\.[a-z]{2,}$/i;
function isValidEmail(value) {
  return typeof value === 'string' && value.length <= 254 && EMAIL_RE.test(value);
}

// Chaîne sur une ligne, sans caractères de contrôle, tronquée
function cleanLine(value, max = 200) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max);
}

// Texte multiligne : conserve les sauts de ligne, retire les autres caractères de contrôle
function cleanText(value, max = 5000) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, ' ')
    .slice(0, max);
}

// '' si vide, l'URL normalisée si https://, null si invalide
function httpsUrlOrEmpty(value) {
  if (!value) return '';
  try {
    const url = new URL(String(value).trim());
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

// Idempotence anti-doublon : cycle de vie new → processing → done (voir stripeEvents.js).
const stripeEvents = createStripeEventLog({ file: defaultEventsFile() });

export function verifyStripeSignature(payload, signatureHeader, secret, now = Date.now()) {
  if (!signatureHeader || !secret) return false;
  let timestamp = null;
  const signatures = [];

  for (const part of String(signatureHeader).split(',')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key === 't') timestamp = value;
    if (key === 'v1') signatures.push(value);
  }

  if (!timestamp || !/^\d+$/.test(timestamp) || signatures.length === 0) return false;

  const currentTime = Math.floor(now / 1000);
  if (Math.abs(currentTime - parseInt(timestamp, 10)) > STRIPE_TOLERANCE_SECONDS) {
    console.warn('Webhook Stripe : horodatage hors tolérance (rejeu possible)');
    return false;
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.`)
    .update(payload)
    .digest();

  return signatures.some(sig => {
    if (!/^[0-9a-f]{64}$/i.test(sig)) return false;
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), expected);
  });
}

// Expéditeur toujours KYRAN (contact@kyran-jeu.fr ou kyran.jeu@gmail.com) : voir server/mailer.js
async function sendEmail({ to, subject, html, text }) {
  return mailer.sendEmail({ to, subject: cleanLine(subject, 250), html, text });
}

// Nom du pays en français (FR → France, BE → Belgique…) ; code brut si inconnu.
const COUNTRY_NAMES = new Intl.DisplayNames(['fr'], { type: 'region' });
function countryName(code) {
  if (!code) return '';
  try { return COUNTRY_NAMES.of(String(code).toUpperCase()) || code; } catch { return code; }
}

// Ventes sur place payées (festival), gardées 48 h en mémoire : la page merci-sur-place.html
// affiche « Payé » seulement si le webhook a vraiment reçu le paiement de cette session.
// Lien de paiement du festival de Carrières (21/11/2026), sans livraison ; désactivé le 22/11.
const SUR_PLACE_PAYMENT_LINK = process.env.SUR_PLACE_PAYMENT_LINK ?? 'plink_1UdZIwPe2ed8eDFC7wqvv7nY';
const SUR_PLACE_TTL_MS = 48 * 60 * 60 * 1000;
const surPlacePayees = new Map();
function noterVenteSurPlace(sessionId, quantity) {
  const now = Date.now();
  for (const [id, v] of surPlacePayees) if (now - v.at > SUR_PLACE_TTL_MS) surPlacePayees.delete(id);
  if (surPlacePayees.size >= 1000) surPlacePayees.delete(surPlacePayees.keys().next().value);
  surPlacePayees.set(sessionId, { quantity, at: now });
}

async function handleOrderCompleted(session) {
  // Paiement différé (ex. prélèvement SEPA) : la session est « complétée » avant l'encaissement.
  // On attend `checkout.session.async_payment_succeeded` pour confirmer la commande.
  if (session.payment_status && !['paid', 'no_payment_required'].includes(session.payment_status)) {
    console.log(`ℹ️ Session ${session.id} non payée (${cleanLine(session.payment_status, 40)}) : confirmation différée.`);
    return;
  }

  const customerEmail = session.customer_details?.email || session.customer_email;
  const customerName = session.customer_details?.name || 'Ami joueur';

  const totalAmount = session.amount_total != null
    ? (session.amount_total / 100).toFixed(2).replace('.', ',') + ' €'
    : '12,98 €';

  const shippingCents = session.total_details?.amount_shipping != null
    ? session.total_details.amount_shipping
    : (session.shipping_cost?.amount_total != null ? session.shipping_cost.amount_total : 299);
  const shippingCost = (shippingCents / 100).toFixed(2).replace('.', ',') + ' €';

  const subtotalCents = session.amount_subtotal != null
    ? session.amount_subtotal
    : (session.amount_total != null ? session.amount_total - shippingCents : 999);
  const subtotalAmount = (subtotalCents / 100).toFixed(2).replace('.', ',') + ' €';

  const metaQuantity = parseInt(session.metadata?.quantity, 10);
  const quantity = Number.isInteger(metaQuantity) && metaQuantity > 0
    ? metaQuantity
    : (Math.max(1, Math.round(subtotalCents / 999)) || 1);

  const shipping = shippingDetails(session);
  const shippingAddress = shipping?.address ? {
    name: shipping.name || customerName,
    line1: shipping.address.line1,
    line2: shipping.address.line2,
    postal_code: shipping.address.postal_code,
    city: shipping.address.city,
    country: countryName(shipping.address.country)
  } : null;

  // Vente sur place (festival) : lien de paiement sans livraison, marqué `canal: sur-place`
  // dans ses métadonnées (recopiées par Stripe sur la session). Le jeu est remis en main propre.
  const mainPropre = session.metadata?.canal === 'sur-place'
    || (Boolean(SUR_PLACE_PAYMENT_LINK) && session.payment_link === SUR_PLACE_PAYMENT_LINK);
  if (mainPropre && session.id) noterVenteSurPlace(session.id, quantity);

  // 1. Confirmation au client. Un échec ne doit pas faire perdre la commande :
  // l'administrateur est prévenu quoi qu'il arrive (étape 2) et envoie le mail à la main.
  let clientMailError = null;
  if (!customerEmail) {
    clientMailError = new Error(`Aucun e-mail client pour la session ${session.id}`);
  } else {
    try {
      const clientEmailContent = renderOrderEmail({
        customerName,
        orderId: session.id,
        quantity,
        subtotalAmount,
        totalAmount,
        shippingCost,
        shippingAddress,
        estimatedDelivery: '3 à 5 jours ouvrés',
        mainPropre
      });
      await sendEmail({
        to: customerEmail,
        subject: 'Confirmation de commande KYRAN',
        html: clientEmailContent.html,
        text: clientEmailContent.text
      });
    } catch (err) {
      clientMailError = err;
    }
  }
  if (clientMailError) {
    console.error('Confirmation client non envoyée :', clientMailError.message);
    recordServerIncident(clientMailError, { path: '/webhook', errorCode: 'CLIENT_ORDER_CONFIRMATION', httpStatus: 200 });
  }
  if (customerEmail && isValidEmail(customerEmail) && reviewQueue.schedule(session.id, { email: customerEmail, name: customerName === 'Ami joueur' ? '' : customerName })) {
    console.log(`⭐ Demande d'avis programmée pour la commande ${session.id}.`);
  }

  // 2. Envoi notification d'alerte immédiate à l'administrateur (Corentin Sence)
  try {
    const customerPhone = session.customer_details?.phone || session.shipping_details?.phone || '';
    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent?.id || '');

    const adminNotification = renderAdminOrderNotificationEmail({
      customerName,
      customerEmail,
      customerPhone,
      orderId: session.id,
      paymentIntentId,
      quantity,
      subtotalAmount,
      shippingCost,
      totalAmount,
      shippingAddress,
      mainPropre,
      orderDate: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
    });

    const adminTo = mainPropre ? [...new Set([...ADMIN_EMAILS, ...SUR_PLACE_ALERT_EMAILS])] : ADMIN_EMAILS;
    await sendEmail({
      to: adminTo,
      subject: `${clientMailError ? '⚠️ MAIL CLIENT NON ENVOYÉ · ' : ''}${mainPropre ? '🤝 SUR PLACE · ' : ''}🚨 VENTE KYRAN : ${quantity} boîte${quantity > 1 ? 's' : ''} (${totalAmount}) — ${cleanLine(customerName, 80)}`,
      html: adminNotification.html,
      text: adminNotification.text
    });
    console.log(`🔔 Notification de commande envoyée à l'administrateur (${adminTo.length} destinataire(s), ${quantity} boîte(s)${mainPropre ? ', main propre' : ''})`);
  } catch (adminErr) {
    console.error('Erreur notification admin commande :', adminErr.message);
    recordServerIncident(adminErr, { path: '/webhook', errorCode: 'ADMIN_ORDER_NOTIFICATION', httpStatus: 200 });
    // Personne n'a été prévenu : échec, pour que Stripe relance l'événement.
    if (clientMailError) throw adminErr;
  }
}

async function handleChargeRefunded(charge) {
  const customerEmail = charge.billing_details?.email || charge.receipt_email;
  const customerName = charge.billing_details?.name || 'Ami joueur';

  if (!customerEmail) {
    console.warn('Aucun email client trouvé pour le remboursement', charge.id);
    return;
  }

  const refundAmount = charge.amount_refunded
    ? (charge.amount_refunded / 100).toFixed(2).replace('.', ',') + ' €'
    : '12,98 €';

  const { html, text } = renderRefundEmail({
    customerName,
    orderId: charge.id,
    refundAmount,
    reason: charge.refunds?.data?.[0]?.reason || 'Demande client'
  });

  // 1. Email client
  await sendEmail({
    to: customerEmail,
    subject: 'Remboursement commande KYRAN',
    html,
    text
  });

  // 2. Notification admin
  try {
    await sendEmail({
      to: ADMIN_EMAILS,
      subject: `⚠️ REMBOURSEMENT KYRAN : ${refundAmount} — ${cleanLine(customerName, 80)}`,
      html,
      text
    });
  } catch (err) {
    console.error('Erreur notification admin remboursement :', err.message);
  }
}

const VERSION = '1.9.0';
const MAX_BODY_BYTES = 1048576;

function applyCors(req, res, pathname) {
  // CORS uniquement pour l'API d'administration, et seulement pour les origines connues.
  // Le webhook Stripe est appelé de serveur à serveur et n'a pas besoin de CORS.
  if (!pathname.startsWith('/api/')) return;
  const origin = req.headers.origin;
  res.setHeader('Vary', 'Origin');
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '600');
  }
}

function clientIp(req) {
  // Railway place l'IP réelle du client en tête de X-Forwarded-For
  const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return fwd || req.socket.remoteAddress || 'unknown';
}

// Retourne true si la requête est autorisée, sinon répond et retourne false
function requireAdmin(req, res) {
  const ip = clientIp(req);
  if (!ADMIN_ENABLED) {
    sendJson(res, 503, { error: 'Administration désactivée' });
    return false;
  }
  const authHeader = String(req.headers['authorization'] || '');
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  const token = match ? match[1].trim() : '';
  if (!token || !safeEqual(token, ADMIN_SECRET)) {
    // 10 échecs max par IP et par quart d'heure
    if (rateLimited(`authfail:${ip}`, 10, 15 * 60 * 1000)) {
      sendJson(res, 429, { error: 'Trop de tentatives, réessayez plus tard' });
      return false;
    }
    sendJson(res, 401, { error: 'Unauthorized' });
    return false;
  }
  // 30 envois max par heure, même authentifié (limite les dégâts en cas de fuite du token)
  if (rateLimited(`send:${ip}`, 30, 60 * 60 * 1000)) {
    sendJson(res, 429, { error: 'Limite d\'envoi atteinte, réessayez plus tard' });
    return false;
  }
  return true;
}

function parseJsonBody(rawBody) {
  try {
    const data = JSON.parse(rawBody.toString('utf8') || '{}');
    return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

async function handleCustomEmail(req, res, rawBody) {
  if (!requireAdmin(req, res)) return;
  const data = parseJsonBody(rawBody);
  if (!data) return sendJson(res, 400, { error: 'JSON invalide' });

  const to = cleanLine(data.to, 254);
  if (!isValidEmail(to)) return sendJson(res, 400, { error: 'Champ "to" invalide (une seule adresse e-mail)' });

  const message = cleanText(data.message, 5000);
  if (!message.trim()) return sendJson(res, 400, { error: 'Champ "message" requis' });

  const actionUrl = httpsUrlOrEmpty(data.actionUrl);
  if (actionUrl === null) return sendJson(res, 400, { error: 'Le lien du bouton doit commencer par https://' });

  const subject = cleanLine(data.subject, 150) || 'Message concernant votre jeu KYRAN';
  const { html, text } = renderCustomMessageEmail({
    customerName: cleanLine(data.customerName || data.name, 100),
    subject,
    message,
    actionText: cleanLine(data.actionText, 60) || null,
    actionUrl: actionUrl || null
  });

  try {
    const result = await sendEmail({ to, subject, html, text });
    console.log(`📨 Email personnalisé envoyé via l'admin (IP ${clientIp(req)})`);
    sendJson(res, 200, { success: true, sentTo: to, id: result?.id });
  } catch (err) {
    console.error('Erreur envoi email personnalisé :', err.message);
    sendJson(res, 502, { error: 'Échec de l\'envoi de l\'email' });
  }
}

async function handleShipping(req, res, rawBody) {
  if (!requireAdmin(req, res)) return;
  const data = parseJsonBody(rawBody);
  if (!data) return sendJson(res, 400, { error: 'JSON invalide' });

  const toEmail = cleanLine(data.customerEmail || data.to, 254);
  if (!isValidEmail(toEmail)) return sendJson(res, 400, { error: 'customerEmail invalide ou manquant' });

  const trackingUrl = httpsUrlOrEmpty(data.trackingUrl);
  if (trackingUrl === null) return sendJson(res, 400, { error: 'trackingUrl doit commencer par https://' });

  const { html, text } = renderShippingEmail({
    customerName: cleanLine(data.customerName || data.name, 100) || 'Cher joueur',
    orderId: cleanLine(data.orderId, 100),
    carrier: cleanLine(data.carrier, 80) || 'La Poste (Courrier Suivi)',
    trackingNumber: cleanLine(data.trackingNumber, 60),
    trackingUrl,
    estimatedDelivery: cleanLine(data.estimatedDelivery, 60) || '2 à 4 jours ouvrés'
  });

  try {
    const result = await sendEmail({ to: toEmail, subject: 'Votre jeu KYRAN a été expédié', html, text });
    console.log(`📦 Email d'expédition envoyé via l'admin (IP ${clientIp(req)})`);
    sendJson(res, 200, { success: true, sentTo: toEmail, id: result?.id });
  } catch (err) {
    console.error('Erreur envoi email expédition :', err.message);
    sendJson(res, 502, { error: 'Échec de l\'envoi de l\'email' });
  }
}

async function handleStripeWebhook(req, res, rawBody) {
  // Fail closed : sans secret configuré, aucun événement n'est accepté.
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('Webhook rejeté : STRIPE_WEBHOOK_SECRET non configuré');
    return sendJson(res, 503, { error: 'Webhook not configured' });
  }

  const signature = req.headers['stripe-signature'];
  if (!verifyStripeSignature(rawBody, signature, STRIPE_WEBHOOK_SECRET)) {
    console.error('Signature Stripe invalide rejetée');
    return sendJson(res, 400, { error: 'Invalid Stripe signature' });
  }

  const event = parseJsonBody(rawBody);
  if (!event) return sendJson(res, 400, { error: 'Invalid JSON' });

  // Idempotence : évite double envoi si Stripe relance, y compris pendant un traitement en cours
  const claim = stripeEvents.claim(event.id);
  if (claim === EVENT_STATE.DONE) {
    console.log(`ℹ️ Événement Stripe ${event.id} déjà traité (idempotence).`);
    return sendJson(res, 200, { received: true, deduplicated: true });
  }
  if (claim === EVENT_STATE.PROCESSING) {
    console.log(`ℹ️ Événement Stripe ${event.id} en cours de traitement : relance différée.`);
    return sendJson(res, 409, { error: 'Event already processing' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        await handleOrderCompleted(event.data.object);
        break;
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
      default:
        console.log(`Événement Stripe ignoré: ${event.type}`);
    }
    stripeEvents.settle(event.id, true);
    sendJson(res, 200, { received: true });
  } catch (err) {
    stripeEvents.settle(event.id, false);
    console.error('Erreur traitement event Stripe:', err);
    recordServerIncident(err, { path: '/webhook', errorCode: 'STRIPE_EVENT_PROCESSING', httpStatus: 500, details: { eventType: cleanLine(event.type, 80) } });
    sendJson(res, 500, { error: 'Processing error' });
  }
}

// Parties entre amis : chargées seulement si MULTI_ACTIF=1, par import dynamique. Tant que le
// module n'est pas chargé (ou s'il échoue), /salle/* répond 503 {actif:false} et le paiement
// n'est en rien concerné.
let salleRoutes = null;
if (process.env.MULTI_ACTIF === '1') {
  import('./salle-routes.js')
    .then(m => {
      salleRoutes = m.createSalleRoutes({ recordIncident: recordServerIncident, allowedOrigins: ALLOWED_ORIGINS });
      console.log('[Salles] actives');
    })
    .catch(err => {
      console.error('[Salles] chargement impossible, salles coupées :', err);
      recordServerIncident(err, { path: '/salle', errorCode: 'SALLE_CHARGEMENT' });
    });
}

function routeSalle(req, res, pathname, url) {
  if (!salleRoutes) {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    return sendJson(res, 503, { actif: false });
  }
  try {
    return salleRoutes.handle(req, res, pathname, url, clientIp(req)).catch(err => {
      console.error('[Salles] Erreur de route :', err);
      if (!res.headersSent) sendJson(res, 500, { error: 'Internal error' });
    });
  } catch (err) {
    console.error('[Salles] Erreur de route :', err);
    if (!res.headersSent) sendJson(res, 500, { error: 'Internal error' });
  }
}

const server = http.createServer((req, res) => {
  let url;
  try {
    url = new URL(req.url, 'http://localhost');
  } catch {
    return sendJson(res, 400, { error: 'Bad Request' });
  }
  const pathname = url.pathname;

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  applyCors(req, res, pathname);

  // Parties entre amis (/salle/*) : module isolé, coupé par défaut (voir salle-routes.js).
  if (pathname.startsWith('/salle/')) return routeSalle(req, res, pathname, url);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check & monitoring (aucune donnée personnelle ni configuration exposée)
  if (req.method === 'GET' && (pathname === '/' || pathname === '/health')) {
    return sendJson(res, 200, {
      status: 'ok',
      service: 'kyran-stripe-webhook-server',
      version: VERSION,
      emailTransport: mailer.transport,
      hasWebhookSecret: Boolean(STRIPE_WEBHOOK_SECRET),
      hasCheckoutKey: Boolean(STRIPE_SECRET_KEY),
      adminEnabled: ADMIN_ENABLED
    });
  }

  // Vente sur place : la page de remerciement demande si la session est bien payée.
  if (req.method === 'GET' && pathname === '/api/sur-place') {
    const id = url.searchParams.get('session') || '';
    if (!/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(id)) return sendJson(res, 400, { error: 'Session invalide' });
    const vente = surPlacePayees.get(id);
    return sendJson(res, 200, vente && Date.now() - vente.at <= SUR_PLACE_TTL_MS
      ? { paye: true, quantite: vente.quantity }
      : { paye: false });
  }

  // Panneau d'achat du site : crée la session Stripe Checkout (quantité et port selon tarifs.js).
  if (req.method === 'POST' && pathname === '/api/commande') {
    return handleCommande(req, res).catch(err => {
      console.error('[Commande] Erreur :', err.message);
      recordServerIncident(err, { path: '/api/commande', errorCode: 'CHECKOUT_SESSION', httpStatus: 502 });
      if (!res.headersSent) sendJson(res, 502, { error: 'Paiement indisponible' });
    });
  }

  if (pathname === '/avis/desinscription') {
    return handleReviewUnsubscribe(req, res, url).catch(err => {
      console.error('[Avis] Erreur de désinscription :', err);
      if (!res.headersSent) sendJson(res, 500, { error: 'Internal error' });
    });
  }

  if (pathname === '/api/client-error' || pathname.startsWith('/api/auto-heal/')) {
    return routeAutoHeal(req, res, pathname, url).catch(err => {
      console.error('[AutoHeal] Erreur de route :', err);
      if (!res.headersSent) sendJson(res, 500, { error: 'Internal error' });
    });
  }

  const isCustom = pathname === '/api/send-custom-email' || pathname === '/api/custom-email';
  const isShipping = pathname === '/api/shipping';
  const isWebhook = pathname === '/webhook' || pathname === '/';

  if (req.method !== 'POST' || !(isCustom || isShipping || isWebhook)) {
    return sendJson(res, 404, { error: 'Not Found' });
  }

  // Protection taille de charge utile (max 1 Mo), corps conservé en octets bruts
  // pour que la signature Stripe soit calculée sur exactement ce qui a été reçu.
  const chunks = [];
  let bodySize = 0;
  let aborted = false;
  req.on('data', chunk => {
    if (aborted) return;
    bodySize += chunk.length;
    if (bodySize > MAX_BODY_BYTES) {
      aborted = true;
      sendJson(res, 413, { error: 'Payload too large' });
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });

  req.on('end', async () => {
    if (aborted) return;
    const rawBody = Buffer.concat(chunks);
    try {
      if (isCustom) return await handleCustomEmail(req, res, rawBody);
      if (isShipping) return await handleShipping(req, res, rawBody);
      return await handleStripeWebhook(req, res, rawBody);
    } catch (err) {
      console.error('Erreur inattendue :', err);
      recordServerIncident(err, { path: pathname, errorCode: 'UNEXPECTED_ERROR', httpStatus: 500, details: { method: req.method } });
      if (!res.headersSent) sendJson(res, 500, { error: 'Internal error' });
    }
  });
});

// ---------------------------------------------------------------------------
// Auto-Heal : remontée des erreurs (navigateur + serveur) et API du workflow horaire
// ---------------------------------------------------------------------------

function recordServerIncident(err, { path, errorCode, httpStatus, details = {} }) {
  try {
    const e = err instanceof Error ? err : new Error(String(err));
    incidents.record({
      source: 'api',
      errorCode,
      httpStatus,
      message: cleanLine(e.message, 1000),
      stack: cleanText(e.stack, 8000),
      path,
      details
    });
  } catch (recordErr) {
    console.error('[AutoHeal] Incident non consigné :', recordErr.message);
  }
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > limit) {
        // On draine le reste sans le garder en mémoire, pour pouvoir répondre 413.
        req.removeAllListeners('data');
        req.resume();
        reject(Object.assign(new Error('too large'), { status: 413 }));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// true si l'appel vient du workflow Auto-Heal du dépôt (jeton OIDC GitHub) ou porte CRON_SECRET
async function isAutoHealCaller(req) {
  const cronHeader = String(req.headers['x-cron-secret'] || '');
  if (CRON_SECRET.length >= 32 && cronHeader && safeEqual(cronHeader, CRON_SECRET)) return true;
  const match = String(req.headers['authorization'] || '').match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  try {
    const claims = await verifyGithubOidcToken(match[1].trim(), {
      repository: AUTO_HEAL_REPOSITORY,
      audience: AUTO_HEAL_AUDIENCE
    });
    return Boolean(claims);
  } catch (err) {
    console.error('[AutoHeal] Vérification OIDC impossible :', err.message);
    return false;
  }
}

// Navigateur → serveur : création du paiement (panneau d'achat de components.js)
async function handleCommande(req, res) {
  const origin = req.headers.origin;
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return sendJson(res, 403, { error: 'Forbidden' });
  if (!STRIPE_SECRET_KEY) return sendJson(res, 503, { error: 'Paiement indisponible' });
  if (rateLimited(`commande:${clientIp(req)}`, 30, 60 * 60 * 1000)) return sendJson(res, 429, { error: 'Too many requests' });
  let body;
  try {
    body = JSON.parse((await readBody(req, 2048)).toString('utf8'));
  } catch {
    return sendJson(res, 400, { error: 'Commande invalide' });
  }
  const commande = lireCommande(body);
  if (commande.erreur) return sendJson(res, 400, { error: commande.erreur });
  const url = await creerSession(commande, { cle: STRIPE_SECRET_KEY, apiBase: STRIPE_API_BASE });
  console.log(`[Commande] Session créée : ${commande.quantite} boîte(s), ${commande.mode}.`);
  return sendJson(res, 200, { url });
}

// Navigateur → serveur : erreurs JS et ressources cassées du site (error-reporter.js)
async function handleClientError(req, res) {
  const origin = req.headers.origin;
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return sendJson(res, 403, { error: 'Forbidden' });
  // 20 rapports max par IP et par heure : un visiteur ne peut pas inonder le journal
  if (rateLimited(`clienterr:${clientIp(req)}`, 20, 60 * 60 * 1000)) return sendJson(res, 429, { error: 'Too many reports' });
  let raw;
  try {
    raw = await readBody(req, MAX_CLIENT_REPORT_BYTES);
  } catch (err) {
    return sendJson(res, err.status || 400, { error: 'Bad Request' });
  }
  const data = parseJsonBody(raw);
  if (!data) return sendJson(res, 400, { error: 'JSON invalide' });
  const kind = ['resource', 'rejection'].includes(data.kind) ? data.kind : 'error';
  const report = {
    kind,
    message: cleanLine(data.message, 1000),
    file: cleanLine(data.file, 500),
    stack: cleanText(data.stack, 6000)
  };
  const userAgent = cleanLine(req.headers['user-agent'], 300);
  if (isBenignClientError(report, userAgent)) return sendJson(res, 202, { recorded: false });
  incidents.record({
    source: 'client',
    errorCode: { resource: 'RESOURCE_LOAD_FAILED', rejection: 'UNHANDLED_REJECTION', error: 'JS_ERROR' }[kind],
    message: report.message,
    stack: report.stack,
    path: cleanLine(data.page, 500),
    details: {
      file: report.file,
      line: Number.isInteger(data.line) ? data.line : null,
      column: Number.isInteger(data.column) ? data.column : null,
      browser: userAgent,
      pageUrl: cleanLine(data.page, 500),
      assetVersion: cleanLine(data.version, 40)
    }
  });
  return sendJson(res, 202, { recorded: true });
}

async function handleDailyReport(res) {
  if (incidents.reportAlreadySent()) return sendJson(res, 200, { ok: true, sent: false, reason: 'already_sent_today' });
  const report = renderDailyReport(incidents.handledLast24h());
  if (!report) return sendJson(res, 200, { ok: true, sent: false, reason: 'no_actions_in_24h' });
  const to = AUTO_HEAL_REPORT_EMAILS.length ? AUTO_HEAL_REPORT_EMAILS : ADMIN_EMAILS;
  try {
    await sendEmail({ to, subject: report.subject, html: report.html, text: report.text });
    incidents.markReportSent();
    return sendJson(res, 200, { ok: true, sent: true });
  } catch (err) {
    console.error('[AutoHeal] Rapport 24h non envoyé :', err.message);
    return sendJson(res, 502, { ok: false, error: 'Échec envoi du rapport' });
  }
}

// Rapport de la routine Claude (un seul par jour, objet imposé, destinataire fixe).
async function handleRoutineReport(req, res) {
  let data;
  try {
    data = parseJsonBody(await readBody(req, MAX_ROUTINE_REPORT_BYTES));
  } catch (err) {
    return sendJson(res, err.status || 400, { error: 'Bad Request' });
  }
  if (!data) return sendJson(res, 400, { error: 'JSON invalide' });
  const subject = cleanLine(data.subject, 120);
  const match = subject.match(ROUTINE_REPORT_SUBJECT);
  if (!match) return sendJson(res, 400, { error: 'objet attendu : « KYRAN — surveillance & réparation du JJ/MM »' });
  const html = typeof data.html === 'string' ? data.html : '';
  if (!html.trim()) return sendJson(res, 400, { error: 'html requis' });
  const text = typeof data.text === 'string' && data.text.trim() ? cleanText(data.text, 100000) : undefined;
  if (incidents.routineReportSentFor(match[1])) {
    return sendJson(res, 200, { ok: true, sent: false, reason: 'already_sent_today' });
  }
  if (rateLimited('autoheal:routine-report', 3, 20 * 60 * 60 * 1000)) return sendJson(res, 429, { error: 'Trop d\'envois, réessayez plus tard' });
  try {
    const result = await sendEmail({ to: [ROUTINE_REPORT_TO], subject, html, text });
    incidents.markRoutineReportSent(match[1]);
    return sendJson(res, 200, { ok: true, sent: true, sender: mailer.sender, transport: mailer.transport, id: result?.id || null });
  } catch (err) {
    console.error('[AutoHeal] Rapport de la routine non envoyé :', err.message);
    return sendJson(res, 502, { ok: false, error: cleanLine(err.message, 300), sender: mailer.sender, transport: mailer.transport });
  }
}

// Email de test vers les destinataires du rapport : vérifie l'envoi (SMTP / Resend) de bout en bout.
async function handleTestEmail(res) {
  if (rateLimited('autoheal:test-email', 3, 60 * 60 * 1000)) return sendJson(res, 429, { error: 'Trop de tests, réessayez plus tard' });
  const to = AUTO_HEAL_REPORT_EMAILS.length ? AUTO_HEAL_REPORT_EMAILS : ADMIN_EMAILS;
  const when = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  try {
    await sendEmail({
      to,
      subject: '[KYRAN Auto-Heal] Email de test',
      text: `Email de test du système Auto-Heal KYRAN (${when}).\nExpéditeur : ${mailer.sender} — transport : ${mailer.transport}.\nLes rapports 24 h arriveront à cette adresse les jours où le système agit.`,
      html: `<p>Email de test du système Auto-Heal KYRAN (${escapeHtml(when)}).</p><p>Expéditeur : <strong>${escapeHtml(mailer.sender)}</strong> — transport : ${escapeHtml(mailer.transport)}.</p><p>Les rapports 24 h arriveront à cette adresse les jours où le système agit.</p>`
    });
    return sendJson(res, 200, { ok: true, sender: mailer.sender, transport: mailer.transport, recipients: to.length });
  } catch (err) {
    console.error('[AutoHeal] Email de test non envoyé :', err.message);
    return sendJson(res, 502, { ok: false, error: cleanLine(err.message, 300) });
  }
}

async function routeAutoHeal(req, res, pathname, url) {
  if (pathname === '/api/client-error') {
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method Not Allowed' });
    return handleClientError(req, res);
  }

  if (rateLimited(`autoheal:${clientIp(req)}`, 120, 60 * 60 * 1000)) return sendJson(res, 429, { error: 'Too many requests' });
  if (!(await isAutoHealCaller(req))) return sendJson(res, 401, { error: 'Unauthorized' });

  if (req.method === 'GET' && pathname === '/api/auto-heal/incidents') {
    const limit = parseInt(url.searchParams.get('limit') || '5', 10);
    return sendJson(res, 200, { ok: true, ...incidents.pending(limit) });
  }
  if (pathname === '/api/auto-heal/daily-report' && (req.method === 'GET' || req.method === 'POST')) {
    return handleDailyReport(res);
  }
  if (pathname === '/api/auto-heal/routine-report' && req.method === 'POST') {
    return handleRoutineReport(req, res);
  }
  if (pathname === '/api/auto-heal/test-email' && req.method === 'POST') {
    return handleTestEmail(res);
  }
  const action = pathname.match(/^\/api\/auto-heal\/incidents\/(resolve|fail|ignore)$/);
  if (req.method !== 'POST' || !action) return sendJson(res, 404, { error: 'Not Found' });

  let data;
  try {
    data = parseJsonBody(await readBody(req, 65536));
  } catch (err) {
    return sendJson(res, err.status || 400, { error: 'Bad Request' });
  }
  if (!data || typeof data.incidentId !== 'string') return sendJson(res, 400, { error: 'incidentId requis' });
  const report = data.report && typeof data.report === 'object' ? data.report : null;
  let updated;
  if (action[1] === 'resolve') {
    if (typeof data.commitSha !== 'string' || !data.commitSha) return sendJson(res, 400, { error: 'commitSha requis' });
    updated = incidents.markResolved(data.incidentId, data.commitSha, cleanLine(data.resolutionSummary, 300), report);
  } else if (action[1] === 'fail') {
    updated = incidents.markFailed(data.incidentId, cleanLine(data.reason, 600) || 'échec', report);
  } else {
    updated = incidents.markIgnored(data.incidentId, cleanLine(data.reason, 600) || 'ignoré', report);
  }
  return sendJson(res, updated ? 200 : 404, { ok: updated });
}

// ---------------------------------------------------------------------------
// Demande d'avis J+10 : envoi des demandes échues, désinscription en un clic (GET → formulaire, POST → effet,
// pour que les robots qui suivent les liens des mails ne désinscrivent personne).
let reviewRunning = false;
async function processReviewQueue(now = Date.now()) {
  if (reviewRunning) return;
  reviewRunning = true;
  try {
    reviewQueue.purge(now);
    for (const item of reviewQueue.due(now)) {
      try {
        const { html, text } = renderReviewRequestEmail({
          customerName: item.name,
          unsubscribeUrl: `${PUBLIC_BASE_URL}/avis/desinscription?t=${item.token}`
        });
        await sendEmail({ to: item.email, subject: 'Alors, cette première partie de KYRAN ?', html, text });
        reviewQueue.markSent(item.id);
        console.log(`⭐ Demande d'avis envoyée (commande ${item.id}).`);
      } catch (err) {
        const outcome = reviewQueue.markFailed(item.id);
        console.error(`[Avis] Envoi en échec (commande ${item.id}, ${outcome}) :`, err.message);
        if (outcome === 'failed') recordServerIncident(err, { path: '-', errorCode: 'REVIEW_REQUEST', httpStatus: 0 });
      }
    }
  } finally {
    reviewRunning = false;
  }
}

function reviewPage(title, body) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)}</title></head>
<body style="font-family: -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; background: #FBF6EC; color: #231F22; margin: 0; padding: 48px 16px;">
<div style="max-width: 480px; margin: 0 auto; background: #fff; border: 1px solid #e7dcc5; border-radius: 12px; padding: 28px;">
<p style="font-weight: 800; letter-spacing: 3px; margin: 0 0 16px;">KYRAN</p><h1 style="font-size: 20px; margin: 0 0 12px;">${escapeHtml(title)}</h1>${body}
</div></body></html>`;
}

async function handleReviewUnsubscribe(req, res, url) {
  const send = (status, title, body) => {
    res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' });
    res.end(reviewPage(title, body));
  };
  if (req.method === 'GET') {
    const token = String(url.searchParams.get('t') || '');
    if (!/^[A-Za-z0-9_-]{32}$/.test(token)) return send(400, 'Lien incomplet', '<p>Ce lien de désinscription est incomplet. Écrivez à <a href="mailto:contact@kyran-jeu.fr">contact@kyran-jeu.fr</a> et nous le ferons pour vous.</p>');
    return send(200, "Ne plus recevoir de demande d’avis", `<p>Confirmez pour ne plus recevoir de demande d'avis de KYRAN à cette adresse.</p><form method="post" action="/avis/desinscription"><input type="hidden" name="t" value="${escapeHtml(token)}"><button type="submit" style="background: #231F22; color: #fff; border: 0; border-radius: 6px; padding: 10px 20px; font-size: 14px; cursor: pointer;">Confirmer</button></form>`);
  }
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method Not Allowed' });
  if (rateLimited(`unsub:${clientIp(req)}`, 20, 60 * 60 * 1000)) return sendJson(res, 429, { error: 'Too many requests' });
  const body = await readBody(req, 2048);
  const token = new URLSearchParams(body.toString('utf8')).get('t') || '';
  if (!reviewQueue.unsubscribe(token)) return send(400, 'Lien incomplet', '<p>Ce lien de désinscription est incomplet. Écrivez à <a href="mailto:contact@kyran-jeu.fr">contact@kyran-jeu.fr</a>.</p>');
  console.log('⭐ Désinscription des demandes d’avis enregistrée.');
  return send(200, 'C’est noté', '<p>Vous ne recevrez plus de demande d’avis de KYRAN. Merci d’avoir joué&nbsp;!</p><p><a href="https://kyran-jeu.fr">Retour au site</a></p>');
}

if (process.env.NODE_ENV !== 'test') {
  setTimeout(() => processReviewQueue().catch(err => console.error('[Avis]', err)), Math.min(60 * 1000, REVIEW_TICK_MS)).unref();
  setInterval(() => processReviewQueue().catch(err => console.error('[Avis]', err)), REVIEW_TICK_MS).unref();
  server.listen(PORT, () => {
    console.log(`🚀 Serveur KYRAN Webhook v${VERSION} actif sur port ${PORT} (Node ${process.version})`);
  });
}

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception :', err);
  recordServerIncident(err, { path: '-', errorCode: 'UNCAUGHT_EXCEPTION', httpStatus: 500 });
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection :', reason);
  recordServerIncident(reason, { path: '-', errorCode: 'UNHANDLED_REJECTION', httpStatus: 500 });
});

export { server };

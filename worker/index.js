import { renderOrderEmail, renderRefundEmail, renderShippingEmail } from './templates.js';

/**
 * Cloudflare Worker pour Webhook Stripe KYRAN
 * - Écoute checkout.session.completed -> Envoi email de confirmation avec récap & Dojo
 * - Écoute charge.refunded -> Envoi email de remboursement
 * - Endpoint POST /api/shipping -> Envoi email d'expédition de commande
 * - Utilise l'API Resend pour délivrabilité maximale
 *
 * ⚠️ Doublon du serveur Railway (server/server.js). Ne pas enregistrer les deux
 * URL comme endpoints de webhook dans Stripe, sinon chaque client reçoit deux emails.
 *
 * Sécurité (fail closed) :
 * - sans STRIPE_WEBHOOK_SECRET, tous les webhooks sont rejetés ;
 * - sans ADMIN_SECRET (32 caractères min.), /api/shipping est désactivé.
 */

const STRIPE_TOLERANCE_SECONDS = 300;
const MAX_BODY_BYTES = 1048576;
const EMAIL_RE = /^[^\s@<>"'(),;:]+@[^\s@<>"'(),;:]+\.[a-z]{2,}$/i;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store'
    }
  });
}

function cleanLine(value, max = 200) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max);
}

function httpsUrlOrEmpty(value) {
  if (!value) return '';
  try {
    const url = new URL(String(value).trim());
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

async function sha256(value) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(value))));
}

// Comparaison à temps constant de deux chaînes (via leurs empreintes SHA-256)
async function safeEqual(a, b) {
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < ha.length; i++) diff |= ha[i] ^ hb[i];
  return diff === 0;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check (aucune configuration ni adresse exposée)
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return json({
        status: 'ok',
        service: 'kyran-stripe-webhook',
        hasResendKey: Boolean(env.RESEND_API_KEY),
        hasStripeWebhookSecret: Boolean(env.STRIPE_WEBHOOK_SECRET)
      });
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return json({ error: 'Payload too large' }, 413);
    }

    // Endpoint manuel sécurisé d'expédition
    if (request.method === 'POST' && url.pathname === '/api/shipping') {
      const adminSecret = env.ADMIN_SECRET || '';
      if (adminSecret.length < 32) {
        return json({ error: 'Administration désactivée' }, 503);
      }

      const authHeader = request.headers.get('authorization') || '';
      const match = authHeader.match(/^Bearer\s+(.+)$/i);
      const token = match ? match[1].trim() : '';
      if (!token || !(await safeEqual(token, adminSecret))) {
        return json({ error: 'Unauthorized' }, 401);
      }

      let data;
      try {
        data = await request.json();
      } catch {
        return json({ error: 'JSON invalide' }, 400);
      }

      const to = cleanLine(data?.customerEmail, 254);
      if (!EMAIL_RE.test(to)) {
        return json({ error: 'customerEmail invalide ou manquant' }, 400);
      }
      const trackingUrl = httpsUrlOrEmpty(data.trackingUrl);
      if (trackingUrl === null) {
        return json({ error: 'trackingUrl doit commencer par https://' }, 400);
      }

      try {
        const { html, text } = renderShippingEmail({
          customerName: cleanLine(data.customerName, 100) || 'Cher joueur',
          orderId: cleanLine(data.orderId, 100),
          carrier: cleanLine(data.carrier, 80) || 'La Poste (Courrier Suivi)',
          trackingNumber: cleanLine(data.trackingNumber, 60),
          trackingUrl,
          estimatedDelivery: cleanLine(data.estimatedDelivery, 60) || '2 à 4 jours ouvrés'
        });

        await sendEmail({ to, subject: '📦 Votre jeu KYRAN a été expédié !', html, text, env });
        return json({ success: true, sentTo: to });
      } catch (err) {
        console.error('Erreur envoi email expédition :', err.message);
        return json({ error: 'Échec de l\'envoi de l\'email' }, 502);
      }
    }

    if (request.method !== 'POST' || !(url.pathname === '/' || url.pathname === '/webhook')) {
      return json({ error: 'Not Found' }, 404);
    }

    // Fail closed : sans secret, aucun événement n'est accepté
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Webhook rejeté : STRIPE_WEBHOOK_SECRET non configuré');
      return json({ error: 'Webhook not configured' }, 503);
    }

    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');
    if (!(await verifyStripeSignature(rawBody, signature, webhookSecret))) {
      return json({ error: 'Invalid Stripe signature' }, 400);
    }

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleOrderCompleted(event.data.object, env);
          break;
        case 'charge.refunded':
          await handleChargeRefunded(event.data.object, env);
          break;
        default:
          console.log(`Événement Stripe ignoré : ${event.type}`);
      }
      return json({ received: true });
    } catch (error) {
      console.error('Erreur traitement webhook :', error);
      return json({ error: 'Processing error' }, 500);
    }
  }
};

/**
 * Traitement commande terminée (checkout.session.completed)
 */
async function handleOrderCompleted(session, env) {
  const customerEmail = session.customer_details?.email || session.customer_email;
  const customerName = session.customer_details?.name || 'Ami joueur';

  if (!customerEmail) {
    console.warn('Aucun email client trouvé dans la session', session.id);
    return;
  }

  // Calculs monétaires précis
  const totalAmount = session.amount_total != null
    ? (session.amount_total / 100).toFixed(2).replace('.', ',') + ' €'
    : '13,98 €';

  const shippingCents = session.total_details?.amount_shipping != null
    ? session.total_details.amount_shipping
    : (session.shipping_cost?.amount_total != null ? session.shipping_cost.amount_total : 399);
  const shippingCost = (shippingCents / 100).toFixed(2).replace('.', ',') + ' €';

  const subtotalCents = session.amount_subtotal != null
    ? session.amount_subtotal
    : (session.amount_total != null ? session.amount_total - shippingCents : 999);
  const subtotalAmount = (subtotalCents / 100).toFixed(2).replace('.', ',') + ' €';

  // Quantité (déduite ou par défaut 1)
  const quantity = session.metadata?.quantity
    ? parseInt(session.metadata.quantity, 10)
    : (Math.max(1, Math.round(subtotalCents / 999)) || 1);

  // Adresse d'expédition
  const shipping = session.shipping_details || session.customer_details;
  const shippingAddress = shipping?.address ? {
    name: shipping.name || customerName,
    line1: shipping.address.line1,
    line2: shipping.address.line2,
    postal_code: shipping.address.postal_code,
    city: shipping.address.city,
    country: shipping.address.country === 'FR' ? 'France' : shipping.address.country
  } : null;

  const { html, text } = renderOrderEmail({
    customerName,
    orderId: session.id,
    quantity,
    subtotalAmount,
    totalAmount,
    shippingCost,
    shippingAddress,
    estimatedDelivery: '3 à 5 jours ouvrés'
  });

  await sendEmail({
    to: customerEmail,
    subject: '🃏 Confirmation de votre commande KYRAN !',
    html,
    text,
    env
  });
}

/**
 * Traitement remboursement (charge.refunded)
 */
async function handleChargeRefunded(charge, env) {
  const customerEmail = charge.billing_details?.email || charge.receipt_email;
  const customerName = charge.billing_details?.name || 'Ami joueur';

  if (!customerEmail) {
    console.warn('Aucun email client trouvé pour le remboursement', charge.id);
    return;
  }

  const refundAmount = charge.amount_refunded
    ? (charge.amount_refunded / 100).toFixed(2).replace('.', ',') + ' €'
    : '13,98 €';

  const { html, text } = renderRefundEmail({
    customerName,
    orderId: charge.id,
    refundAmount,
    reason: charge.refunds?.data?.[0]?.reason || 'Rétractation / Demande client'
  });

  await sendEmail({
    to: customerEmail,
    subject: 'Remboursement de votre commande KYRAN',
    html,
    text,
    env
  });
}

/**
 * Envoi d'email via Resend API
 */
async function sendEmail({ to, subject, html, text, env }) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY non configurée. Email simulé.');
    return;
  }

  const sender = env.SENDER_EMAIL || 'contact@majordia.fr';
  const senderName = env.SENDER_NAME || 'KYRAN';
  const replyTo = env.REPLY_TO_EMAIL || 'contact@kyran-jeu.fr';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: `${senderName} <${sender}>`,
      to: [to],
      reply_to: replyTo,
      subject: cleanLine(subject, 250),
      html,
      text
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erreur Resend (${res.status}): ${errText}`);
  }

  console.log(`✅ Email envoyé : "${subject}"`);
}

function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

/**
 * Vérification signature webhook Stripe avec Web Crypto API (HMAC-SHA256).
 * crypto.subtle.verify compare à temps constant.
 */
export async function verifyStripeSignature(payload, signatureHeader, secret, now = Date.now()) {
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

  // Protection contre le rejeu (tolérance Stripe par défaut : 5 minutes)
  const currentTime = Math.floor(now / 1000);
  if (Math.abs(currentTime - parseInt(timestamp, 10)) > STRIPE_TOLERANCE_SECONDS) {
    console.warn('Signature webhook hors tolérance');
    return false;
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const data = encoder.encode(`${timestamp}.${payload}`);

  for (const sig of signatures) {
    if (!/^[0-9a-f]{64}$/i.test(sig)) continue;
    if (await crypto.subtle.verify('HMAC', key, hexToBytes(sig), data)) return true;
  }
  return false;
}

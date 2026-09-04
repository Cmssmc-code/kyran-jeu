import http from 'http';
import crypto from 'crypto';
import {
  renderOrderEmail,
  renderRefundEmail,
  renderShippingEmail,
  renderCustomMessageEmail,
  renderAdminOrderNotificationEmail
} from './templates.js';

const PORT = process.env.PORT || 3000;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'kyran_secret_2026';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'contact@majordia.fr';
const SENDER_NAME = process.env.SENDER_NAME || 'KYRAN';
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || 'contact@kyran-jeu.fr';

// Destinataires des alertes administratives de vente
const ADMIN_EMAILS = (process.env.ADMIN_NOTIFICATION_EMAILS || 'contact@kyran-jeu.fr,corentin.sence@gmail.com')
  .split(',')
  .map(e => e.trim())
  .filter(Boolean);

// Cache d'idempotence anti-doublon (mémoire vive 24h)
const processedEventIds = new Map();

function isAlreadyProcessed(id) {
  if (!id) return false;
  const now = Date.now();
  for (const [key, time] of processedEventIds.entries()) {
    if (now - time > 86400000) processedEventIds.delete(key);
  }
  if (processedEventIds.has(id)) return true;
  processedEventIds.set(id, now);
  return false;
}

function verifyStripeSignature(payload, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;
  const parts = signatureHeader.split(',');
  let timestamp = null;
  let signatures = [];

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key === 't') timestamp = value;
    if (key === 'v1') signatures.push(value);
  }

  if (!timestamp || signatures.length === 0) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - parseInt(timestamp, 10)) > 600) {
    console.warn('Webhook timestamp expiré (replay attack)');
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return signatures.some(sig => sig === expectedSignature);
}

async function sendEmail({ to, subject, html, text }) {
  if (!RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY absente. Simulation envoi à :', to);
    return { simulated: true };
  }

  const recipients = Array.isArray(to) ? to : [to];
  console.log(`✉️ Envoi email transactionnel à ${recipients.join(', ')}...`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: recipients,
        reply_to: REPLY_TO_EMAIL,
        subject,
        html,
        text: text || undefined
      }),
      signal: controller.signal
    });

    const resJson = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(`Erreur Resend (${res.status}): ${resJson.message || JSON.stringify(resJson)}`);
    }

    console.log(`✅ Email délivré à ${recipients.join(', ')} (Resend ID: ${resJson.id})`);
    return resJson;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handleOrderCompleted(session) {
  const customerEmail = session.customer_details?.email || session.customer_email;
  const customerName = session.customer_details?.name || 'Ami joueur';

  if (!customerEmail) {
    console.warn('Aucun email client trouvé pour la session', session.id);
    return;
  }

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

  const quantity = session.metadata?.quantity
    ? parseInt(session.metadata.quantity, 10)
    : (Math.max(1, Math.round(subtotalCents / 999)) || 1);

  const shipping = session.shipping_details || session.customer_details;
  const shippingAddress = shipping?.address ? {
    name: shipping.name || customerName,
    line1: shipping.address.line1,
    line2: shipping.address.line2,
    postal_code: shipping.address.postal_code,
    city: shipping.address.city,
    country: shipping.address.country === 'FR' ? 'France' : shipping.address.country
  } : null;

  // 1. Envoi confirmation de commande au client
  const clientEmailContent = renderOrderEmail({
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
    subject: 'Confirmation de commande KYRAN',
    html: clientEmailContent.html,
    text: clientEmailContent.text
  });

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
      orderDate: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
    });

    await sendEmail({
      to: ADMIN_EMAILS,
      subject: `🚨 VENTE KYRAN : ${quantity} boîte${quantity > 1 ? 's' : ''} (${totalAmount}) — ${customerName}`,
      html: adminNotification.html,
      text: adminNotification.text
    });
    console.log(`🔔 Notification de commande envoyée à l'administrateur (${ADMIN_EMAILS.join(', ')})`);
  } catch (adminErr) {
    console.error('Erreur notification admin commande :', adminErr.message);
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
    : '13,98 €';

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
      subject: `⚠️ REMBOURSEMENT KYRAN : ${refundAmount} — ${customerName}`,
      html,
      text
    });
  } catch (err) {
    console.error('Erreur notification admin remboursement :', err.message);
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Headers CORS pour appels depuis admin web
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check & monitoring
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'kyran-stripe-webhook-server',
      version: '1.4.0',
      idempotencyCacheSize: processedEventIds.size,
      hasResendKey: Boolean(RESEND_API_KEY),
      hasWebhookSecret: Boolean(STRIPE_WEBHOOK_SECRET),
      adminNotificationsTo: ADMIN_EMAILS,
      senderEmail: SENDER_EMAIL,
      replyToEmail: REPLY_TO_EMAIL
    }));
    return;
  }

  // Protection taille de charge utile (max 1 Mo)
  let rawBody = '';
  let bodySize = 0;
  req.on('data', chunk => {
    bodySize += chunk.length;
    if (bodySize > 1048576) {
      res.writeHead(413, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Payload too large' }));
      req.destroy();
    } else {
      rawBody += chunk;
    }
  });

  req.on('end', async () => {
    function checkAdminAuth() {
      const authHeader = req.headers['authorization'] || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const expected = ADMIN_SECRET || STRIPE_WEBHOOK_SECRET;
      return !expected || token === expected;
    }

    // Route Envoi email personnalisé au client
    if (req.method === 'POST' && (url.pathname === '/api/send-custom-email' || url.pathname === '/api/custom-email')) {
      if (!checkAdminAuth()) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      try {
        const data = JSON.parse(rawBody || '{}');
        if (!data.to) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Champ "to" requis' }));
          return;
        }

        const subject = data.subject || 'Message concernant votre jeu KYRAN';
        const { html, text } = renderCustomMessageEmail({
          customerName: data.customerName || data.name || '',
          subject,
          message: data.message || '',
          actionText: data.actionText || null,
          actionUrl: data.actionUrl || null
        });

        const result = await sendEmail({
          to: data.to,
          subject,
          html,
          text
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, sentTo: data.to, id: result?.id }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // Route Expédition manuelle ou script CLI
    if (req.method === 'POST' && url.pathname === '/api/shipping') {
      if (!checkAdminAuth()) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      try {
        const data = JSON.parse(rawBody || '{}');
        if (!data.customerEmail && !data.to) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'customerEmail requis' }));
          return;
        }

        const toEmail = data.customerEmail || data.to;
        const { html, text } = renderShippingEmail({
          customerName: data.customerName || data.name || 'Cher joueur',
          orderId: data.orderId || '',
          carrier: data.carrier || 'La Poste (Courrier Suivi)',
          trackingNumber: data.trackingNumber || '',
          trackingUrl: data.trackingUrl || '',
          estimatedDelivery: data.estimatedDelivery || '2 à 4 jours ouvrés'
        });

        const result = await sendEmail({
          to: toEmail,
          subject: 'Votre jeu KYRAN a été expédié',
          html,
          text
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, sentTo: toEmail, id: result?.id }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // Route Webhook Stripe
    if (req.method === 'POST' && (url.pathname === '/webhook' || url.pathname === '/')) {
      const signature = req.headers['stripe-signature'];
      if (STRIPE_WEBHOOK_SECRET) {
        const valid = verifyStripeSignature(rawBody, signature, STRIPE_WEBHOOK_SECRET);
        if (!valid) {
          console.error('Signature Stripe invalide rejetée');
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid Stripe signature' }));
          return;
        }
      }

      let event;
      try {
        event = JSON.parse(rawBody);
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      // Idempotence : évite double envoi si Stripe relance
      if (event.id && isAlreadyProcessed(event.id)) {
        console.log(`ℹ️ Événement Stripe ${event.id} déjà traité (idempotence).`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: true, deduplicated: true }));
        return;
      }

      try {
        switch (event.type) {
          case 'checkout.session.completed':
            await handleOrderCompleted(event.data.object);
            break;
          case 'charge.refunded':
            await handleChargeRefunded(event.data.object);
            break;
          default:
            console.log(`Événement Stripe ignoré: ${event.type}`);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: true }));
      } catch (err) {
        console.error('Erreur traitement event Stripe:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Serveur KYRAN Webhook v1.4.0 actif sur port ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception :', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection :', reason);
});


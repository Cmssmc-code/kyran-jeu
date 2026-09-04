import http from 'http';
import crypto from 'crypto';
import { renderOrderEmail, renderRefundEmail, renderShippingEmail } from './templates.js';

const PORT = process.env.PORT || 3000;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'kyran_secret_2026';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'contact@majordia.fr';
const SENDER_NAME = process.env.SENDER_NAME || 'KYRAN';
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || 'contact@kyran-jeu.fr';

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
    console.warn('Webhook timestamp trop vieux (replay attack)');
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return signatures.some(sig => sig === expectedSignature);
}

async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY non configurée. Email simulé pour :', to);
    return;
  }

  console.log(`✉️ Envoi email à ${to} via Resend...`);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: [to],
      reply_to: REPLY_TO_EMAIL,
      subject,
      html
    })
  });

  const resJson = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Erreur Resend (${res.status}): ${resJson.message || JSON.stringify(resJson)}`);
  }

  console.log(`✅ Email délivré à ${to} (ID: ${resJson.id})`);
  return resJson;
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

  const html = renderOrderEmail({
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
    html
  });
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

  const html = renderRefundEmail({
    customerName,
    orderId: charge.id,
    refundAmount,
    reason: charge.refunds?.data?.[0]?.reason || 'Rétractation / Demande client'
  });

  await sendEmail({
    to: customerEmail,
    subject: 'Remboursement de votre commande KYRAN',
    html
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Health check
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'kyran-stripe-webhook-server',
      hasResendKey: Boolean(RESEND_API_KEY),
      hasWebhookSecret: Boolean(STRIPE_WEBHOOK_SECRET),
      senderEmail: SENDER_EMAIL,
      replyToEmail: REPLY_TO_EMAIL
    }));
    return;
  }

  // Route expédition
  if (req.method === 'POST' && url.pathname === '/api/shipping') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();
        const expected = ADMIN_SECRET || STRIPE_WEBHOOK_SECRET;

        if (expected && token !== expected) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized' }));
          return;
        }

        const data = JSON.parse(body);
        if (!data.customerEmail) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'customerEmail requis' }));
          return;
        }

        const html = renderShippingEmail({
          customerName: data.customerName || 'Cher joueur',
          orderId: data.orderId || '',
          carrier: data.carrier || 'La Poste (Courrier Suivi)',
          trackingNumber: data.trackingNumber || '',
          trackingUrl: data.trackingUrl || '',
          estimatedDelivery: data.estimatedDelivery || '2 à 4 jours ouvrés'
        });

        await sendEmail({
          to: data.customerEmail,
          subject: '📦 Votre jeu KYRAN a été expédié !',
          html
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, sentTo: data.customerEmail }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Webhook Stripe
  if (req.method === 'POST' && (url.pathname === '/webhook' || url.pathname === '/')) {
    let rawBody = '';
    req.on('data', chunk => { rawBody += chunk; });
    req.on('end', async () => {
      const signature = req.headers['stripe-signature'];
      if (STRIPE_WEBHOOK_SECRET) {
        const valid = verifyStripeSignature(rawBody, signature, STRIPE_WEBHOOK_SECRET);
        if (!valid) {
          console.error('Signature Stripe invalide');
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
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`🚀 Serveur KYRAN Webhook actif sur le port ${PORT}`);
});

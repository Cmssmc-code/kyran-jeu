import { renderOrderEmail, renderRefundEmail, renderShippingEmail } from './templates.js';

/**
 * Cloudflare Worker pour Webhook Stripe KYRAN
 * - Écoute checkout.session.completed -> Envoi email de confirmation avec récap & Dojo
 * - Écoute charge.refunded -> Envoi email de remboursement
 * - Endpoint POST /api/shipping -> Envoi email d'expédition de commande
 * - Utilise l'API Resend pour délivrabilité maximale
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check et diagnostic
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'kyran-stripe-webhook',
        hasResendKey: Boolean(env.RESEND_API_KEY),
        hasStripeWebhookSecret: Boolean(env.STRIPE_WEBHOOK_SECRET),
        senderEmail: env.SENDER_EMAIL || 'contact@kyran-jeu.fr'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Endpoint manuel sécurisé d'expédition
    if (request.method === 'POST' && url.pathname === '/api/shipping') {
      const authHeader = request.headers.get('authorization') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const expectedToken = env.ADMIN_SECRET || env.STRIPE_WEBHOOK_SECRET;

      if (expectedToken && token !== expectedToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      try {
        const data = await request.json();
        if (!data.customerEmail) {
          return new Response(JSON.stringify({ error: 'customerEmail requis' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
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
          html,
          env
        });

        return new Response(JSON.stringify({ success: true, sentTo: data.customerEmail }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const signature = request.headers.get('stripe-signature');
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

    const rawBody = await request.text();

    // Vérification de la signature Stripe si le secret est configuré
    if (webhookSecret) {
      const isValid = await verifyStripeSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return new Response('Invalid signature', { status: 400 });
      }
    }

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch (err) {
      return new Response('Invalid JSON payload', { status: 400 });
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          await handleOrderCompleted(session, env);
          break;
        }

        case 'charge.refunded': {
          const charge = event.data.object;
          await handleChargeRefunded(charge, env);
          break;
        }

        default:
          console.log(`Événement Stripe ignoré : ${event.type}`);
      }

      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    } catch (error) {
      console.error('Erreur traitement webhook :', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      });
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
    html,
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

  const html = renderRefundEmail({
    customerName,
    orderId: charge.id,
    refundAmount,
    reason: charge.refunds?.data?.[0]?.reason || 'Rétractation / Demande client'
  });

  await sendEmail({
    to: customerEmail,
    subject: 'Remboursement de votre commande KYRAN',
    html,
    env
  });
}

/**
 * Envoi d'email via Resend API
 */
async function sendEmail({ to, subject, html, env }) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY non configurée. Email simulé pour :', to);
    return;
  }

  const sender = env.SENDER_EMAIL || 'contact@kyran-jeu.fr';
  const senderName = env.SENDER_NAME || 'KYRAN';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: `${senderName} <${sender}>`,
      to: [to],
      reply_to: sender,
      subject,
      html
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erreur Resend (${res.status}): ${errText}`);
  }

  console.log(`✅ Email envoyé avec succès à ${to} : "${subject}"`);
}

/**
 * Vérification signature webhook Stripe avec Web Crypto API (HMAC-SHA256)
 */
async function verifyStripeSignature(payload, signatureHeader, secret) {
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

  // Protection contre replay attack (10 minutes)
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - parseInt(timestamp, 10)) > 600) {
    console.warn('Signature webhook expirée');
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(signedPayload)
  );

  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return signatures.some(sig => sig === expectedSignature);
}

import { sendMail } from './send-mail-ovh.mjs';
import { renderOrderEmail, renderShippingEmail, renderRefundEmail } from './email-templates.mjs';

// CLI pour envoyer un email de test
const args = process.argv.slice(2);
const toIdx = args.indexOf('--to');
const typeIdx = args.indexOf('--type'); // 'order', 'shipping', 'refund'

const to = toIdx !== -1 ? args[toIdx + 1] : null;
const type = typeIdx !== -1 ? args[typeIdx + 1] : 'order';
// Mot de passe uniquement via variable d'environnement (jamais en argument : il
// resterait visible dans l'historique du shell et la liste des processus)
const pass = process.env.OVH_SMTP_PASSWORD || process.env.OVH_MAIL_PASSWORD;

if (!to || !pass) {
  console.log('Usage: OVH_SMTP_PASSWORD=... node scripts/send-test-email.mjs --to destinataire@gmail.com [--type order|shipping|refund]');
  console.log('Astuce : lancez `read -s OVH_SMTP_PASSWORD && export OVH_SMTP_PASSWORD` pour saisir le mot de passe sans l\'afficher.');
  process.exit(1);
}

let subject = '';
let html = '';

if (type === 'shipping') {
  subject = '📦 Votre jeu KYRAN a été expédié !';
  html = renderShippingEmail({
    customerName: 'Ami joueur',
    orderId: 'TEST-12345',
    carrier: 'La Poste (Courrier Suivi)',
    trackingNumber: '1L99988877766',
    trackingUrl: 'https://www.laposte.fr/outils/suivre-vos-envois?code=1L99988877766'
  });
} else if (type === 'refund') {
  subject = 'Remboursement de votre commande KYRAN';
  html = renderRefundEmail({
    customerName: 'Ami joueur',
    orderId: 'TEST-12345',
    refundAmount: '13,98 €',
    reason: 'Rétractation client'
  });
} else {
  subject = '🃏 Merci pour votre commande KYRAN !';
  html = renderOrderEmail({
    customerName: 'Ami joueur',
    orderId: 'TEST-12345',
    quantity: 1,
    unitPrice: '9,99 €',
    shippingCost: '3,99 €',
    totalAmount: '13,98 €',
    shippingAddress: {
      name: 'Ami joueur',
      line1: '12 rue de la Victoire',
      postal_code: '75009',
      city: 'Paris',
      country: 'France'
    }
  });
}

console.log(`Envoi de l'email type "${type}" à ${to}...`);

sendMail({
  pass,
  to,
  subject,
  html,
  text: 'Votre commande KYRAN a bien été prise en compte.'
})
  .then(() => console.log('✅ Email envoyé avec succès !'))
  .catch((err) => {
    console.error('❌ Erreur envoi email :', err.message);
    process.exit(1);
  });

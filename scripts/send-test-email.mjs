import { sendMail } from './send-mail-ovh.mjs';
import { renderOrderEmail, renderShippingEmail, renderRefundEmail } from './email-templates.mjs';

// CLI pour envoyer un email de test
const args = process.argv.slice(2);
const toIdx = args.indexOf('--to');
const typeIdx = args.indexOf('--type'); // 'order', 'shipping', 'refund'
const passIdx = args.indexOf('--pass');

const to = toIdx !== -1 ? args[toIdx + 1] : null;
const type = typeIdx !== -1 ? args[typeIdx + 1] : 'order';
const pass = passIdx !== -1 ? args[passIdx + 1] : process.env.OVH_MAIL_PASSWORD;

if (!to || !pass) {
  console.log('Usage: node scripts/send-test-email.mjs --to destinataire@gmail.com --pass MOT_DE_PASSE_OVH [--type order|shipping|refund]');
  console.log('Exemple: node scripts/send-test-email.mjs --to test@example.com --pass MonPass --type order');
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

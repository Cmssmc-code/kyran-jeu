import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderOrderEmail, renderShippingEmail, renderRefundEmail } from './email-templates.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '..', 'email-previews');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Commande
const orderHtml = renderOrderEmail({
  customerName: 'Alexandre Dupont',
  orderId: 'cs_live_a1b2c3d4e5f6g7h8',
  quantity: 1,
  unitPrice: '9,99 €',
  shippingCost: '3,99 €',
  totalAmount: '13,98 €',
  shippingAddress: {
    name: 'Alexandre Dupont',
    line1: '14 rue des Lilas',
    postal_code: '75011',
    city: 'Paris',
    country: 'France'
  },
  estimatedDelivery: '3 à 5 jours ouvrés'
});
fs.writeFileSync(path.join(outputDir, 'order-confirmation.html'), orderHtml, 'utf8');

// 2. Expédition
const shippingHtml = renderShippingEmail({
  customerName: 'Alexandre Dupont',
  orderId: 'cs_live_a1b2c3d4e5f6g7h8',
  carrier: 'La Poste (Courrier Suivi)',
  trackingNumber: '1L02938475610',
  trackingUrl: 'https://www.laposte.fr/outils/suivre-vos-envois?code=1L02938475610',
  estimatedDelivery: '2 à 3 jours ouvrés'
});
fs.writeFileSync(path.join(outputDir, 'shipping-notification.html'), shippingHtml, 'utf8');

// 3. Remboursement
const refundHtml = renderRefundEmail({
  customerName: 'Alexandre Dupont',
  orderId: 're_3Mbcdef12345678',
  refundAmount: '13,98 €',
  reason: 'Rétractation client (14 jours)'
});
fs.writeFileSync(path.join(outputDir, 'refund-confirmation.html'), refundHtml, 'utf8');

console.log('✅ 3 aperçus HTML générés avec succès dans :', outputDir);
console.log(' - order-confirmation.html');
console.log(' - shipping-notification.html');
console.log(' - refund-confirmation.html');

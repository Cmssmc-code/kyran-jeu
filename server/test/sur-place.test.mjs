// Vente sur place (festival) : mails sans livraison ni adresse, remise en main propre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderOrderEmail, renderAdminOrderNotificationEmail } from '../templates.js';

const base = { customerName: 'Ami joueur', orderId: 'cs_test_x', quantity: 2, subtotalAmount: '19,98 €', totalAmount: '19,98 €', shippingCost: '0,00 €' };

test('client : remise en main propre, aucune ligne de livraison', () => {
  const { html, text } = renderOrderEmail({ ...base, mainPropre: true });
  for (const s of [html, text]) {
    assert.match(s, /main propre/);
    assert.doesNotMatch(s, /Livraison suivie|colis|Livraison à/);
  }
  assert.match(text, /× 2 : 19,98 €\n- Total réglé : 19,98 €/);
});

test('admin : « remis en main propre », pas de bordereau ni de port', () => {
  const { html, text } = renderAdminOrderNotificationEmail({ ...base, customerEmail: 'f@example.com', mainPropre: true });
  for (const s of [html, text]) {
    assert.match(s, /main propre/);
    assert.doesNotMatch(s, /bordereau \/|Frais de port|Port:/);
  }
});

test('commande livrée : inchangée', () => {
  const { text } = renderOrderEmail({ ...base, shippingCost: '2,99 €', totalAmount: '22,97 €' });
  assert.match(text, /Livraison suivie \(3 à 5 jours ouvrés\) : 2,99 €/);
  const admin = renderAdminOrderNotificationEmail({ ...base, shippingCost: '2,99 €' });
  assert.match(admin.text, /ADRESSE DE LIVRAISON :\nNon renseignée/);
});

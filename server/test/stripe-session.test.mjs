// Adresse de livraison d'une session Stripe Checkout selon la version de l'API du webhook
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shippingDetails } from '../stripeSession.js';

const livraison = { name: 'Alice Martin', address: { line1: '1 rue des Cartes', city: 'Lyon', postal_code: '69001', country: 'FR' } };
const facturation = { name: 'Bob Martin', email: 'bob@example.com', address: { line1: '9 avenue du Pli', city: 'Paris', postal_code: '75001', country: 'FR' } };

test('API Stripe 2025-03-31 et plus : collected_information.shipping_details', () => {
  assert.deepEqual(shippingDetails({ collected_information: { shipping_details: livraison }, customer_details: facturation }), livraison);
});

test('API Stripe ancienne : shipping_details', () => {
  assert.deepEqual(shippingDetails({ shipping_details: livraison, customer_details: facturation }), livraison);
});

test('sans adresse de livraison : coordonnées de facturation', () => {
  assert.deepEqual(shippingDetails({ collected_information: { shipping_details: null }, customer_details: facturation }), facturation);
  assert.equal(shippingDetails({}), null);
});

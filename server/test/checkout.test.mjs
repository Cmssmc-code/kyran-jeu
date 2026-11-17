// Parcours d'achat de bout en bout avec des événements Stripe simulés (aucun paiement réel) :
// signature, confirmation client, alerte admin, paiement différé, doublon.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.resolve(__dirname, '../server.js');
const WHSEC = 'whsec_test_checkout';
const BASE = 'http://127.0.0.1:39891';

let child;
let logs = '';

before(() => new Promise((resolve, reject) => {
  // Sans clé Resend ni SMTP, le serveur simule les envois et journalise les destinataires.
  child = spawn(process.execPath, [SERVER], {
    env: { PATH: process.env.PATH, PORT: '39891', STRIPE_WEBHOOK_SECRET: WHSEC, ADMIN_NOTIFICATION_EMAILS: 'admin@kyran-jeu.fr' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  const collect = d => { logs += String(d); if (logs.includes('actif sur port')) resolve(); };
  child.stdout.on('data', collect);
  child.stderr.on('data', collect);
  child.on('error', reject);
  setTimeout(() => reject(new Error('timeout démarrage serveur')), 5000);
}));
after(() => child.kill());

function send(event) {
  const body = JSON.stringify(event);
  const ts = Math.floor(Date.now() / 1000);
  const sig = crypto.createHmac('sha256', WHSEC).update(`${ts}.${body}`).digest('hex');
  return fetch(BASE + '/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Stripe-Signature': `t=${ts},v1=${sig}` },
    body
  });
}

// Attend que les journaux du serveur contiennent `pattern` (les écritures stdout sont asynchrones).
async function logged(pattern, ms = 2000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (pattern.test(logs)) return true;
    await new Promise(r => setTimeout(r, 20));
  }
  return false;
}

const session = (over = {}) => ({
  id: 'cs_test_' + crypto.randomUUID().slice(0, 8),
  payment_status: 'paid',
  amount_total: 1298,
  amount_subtotal: 999,
  total_details: { amount_shipping: 299 },
  customer_details: { email: 'client@example.com', name: 'Camille Test' },
  collected_information: {
    shipping_details: { name: 'Camille Test', address: { line1: '1 rue du Jeu', postal_code: '1000', city: 'Bruxelles', country: 'BE' } }
  },
  ...over
});

test('commande payée : confirmation client et alerte admin, puis doublon dédupliqué', async () => {
  const event = { id: 'evt_paid_1', type: 'checkout.session.completed', data: { object: session() } };
  const r = await send(event);
  assert.equal(r.status, 200);
  assert.ok(await logged(/simulation envoi à :.*client@example\.com/), 'mail client');
  assert.ok(await logged(/simulation envoi à :.*admin@kyran-jeu\.fr/), 'alerte admin');

  const again = await send(event);
  assert.equal(again.status, 200);
  assert.equal((await again.json()).deduplicated, true);
});

test('paiement différé : rien n’est confirmé tant que Stripe n’a pas encaissé', async () => {
  const s = session({ customer_details: { email: 'differe@example.com', name: 'Différé' }, payment_status: 'unpaid' });
  assert.equal((await send({ id: 'evt_unpaid', type: 'checkout.session.completed', data: { object: s } })).status, 200);
  assert.ok(await logged(/non payée \(unpaid\)/));
  assert.doesNotMatch(logs, /differe@example\.com/);

  const paid = { ...s, payment_status: 'paid' };
  assert.equal((await send({ id: 'evt_async_ok', type: 'checkout.session.async_payment_succeeded', data: { object: paid } })).status, 200);
  assert.ok(await logged(/simulation envoi à :.*differe@example\.com/));
});

test('commande sans e-mail client : l’admin est quand même prévenu', async () => {
  const adminMails = () => (logs.match(/simulation envoi à :.*admin@kyran-jeu\.fr/g) || []).length;
  const before = adminMails();
  const s = session({ customer_details: { name: 'Sans Mail' }, customer_email: null });
  assert.equal((await send({ id: 'evt_nomail', type: 'checkout.session.completed', data: { object: s } })).status, 200);
  assert.ok(await logged(/Confirmation client non envoyée/));
  const end = Date.now() + 2000;
  while (adminMails() === before && Date.now() < end) await new Promise(r => setTimeout(r, 20));
  assert.equal(adminMails(), before + 1);
});

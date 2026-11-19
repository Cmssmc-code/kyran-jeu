// Demande d'avis J+10 : file persistante, une seule demande par commande, désinscription.
// Événements Stripe simulés, aucun paiement ni envoi réel.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createReviewQueue, unsubscribeToken, REVIEW_DELAY_MS, MAX_ATTEMPTS } from '../reviewRequests.js';
import { renderReviewRequestEmail, REVIEW_LINKS } from '../templates.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.resolve(__dirname, '../server.js');
const WHSEC = 'whsec_test_review';
const PORT = '39892';
const BASE = `http://127.0.0.1:${PORT}`;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kyran-avis-'));

test('file : programmée à J+10, une seule fois, e-mail effacé après envoi', () => {
  const file = path.join(tmp, 'unit.json');
  const q = createReviewQueue({ file, secret: 's' });
  const t0 = 1_000_000;
  assert.equal(q.schedule('cs_1', { email: 'a@example.com', name: 'Ana' }, t0), true);
  assert.equal(q.schedule('cs_1', { email: 'a@example.com' }, t0), false, 'pas deux fois');
  assert.deepEqual(q.due(t0 + REVIEW_DELAY_MS - 1), []);
  const [item] = q.due(t0 + REVIEW_DELAY_MS);
  assert.equal(item.email, 'a@example.com');

  // Persistance : un redémarrage retrouve la demande.
  const q2 = createReviewQueue({ file, secret: 's' });
  assert.equal(q2.due(t0 + REVIEW_DELAY_MS).length, 1);
  q2.markSent('cs_1', t0 + REVIEW_DELAY_MS);
  assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /a@example\.com/);
  assert.equal(q2.schedule('cs_1', { email: 'a@example.com' }), false, 'relance Stripe après envoi');
});

test('file : échecs répétés puis abandon', () => {
  const q = createReviewQueue({ secret: 's', delayMs: 0 });
  q.schedule('cs_f', { email: 'f@example.com' }, 0);
  for (let i = 1; i < MAX_ATTEMPTS; i++) assert.equal(q.markFailed('cs_f', i), 'retry');
  assert.equal(q.markFailed('cs_f', 99), 'failed');
  assert.equal(q.statusOf('cs_f'), 'failed');
});

test('file : la désinscription annule et bloque les demandes de cette adresse', () => {
  const q = createReviewQueue({ secret: 's', delayMs: 0 });
  q.schedule('cs_u', { email: 'U@Example.com' }, 0);
  assert.equal(q.unsubscribe('court'), false);
  assert.equal(q.unsubscribe(unsubscribeToken('s', 'u@example.com')), true);
  assert.deepEqual(q.due(1), []);
  assert.equal(q.schedule('cs_u2', { email: 'u@example.com' }, 0), false);
});

test('mail : liens Amazon et BGG, désinscription, données échappées', () => {
  const { html, text } = renderReviewRequestEmail({ customerName: '<b>Zoé</b> Martin', unsubscribeUrl: 'https://x.test/avis/desinscription?t=abc' });
  assert.ok(html.includes(REVIEW_LINKS.amazon) && html.includes(REVIEW_LINKS.bgg));
  assert.ok(html.includes('https://x.test/avis/desinscription?t=abc'));
  assert.doesNotMatch(html, /<b>Zoé/);
  assert.match(text, /Ne plus recevoir/);
});

// --- Serveur complet : commande payée → demande envoyée après le délai, une seule fois ---
let child;
let logs = '';
before(() => new Promise((resolve, reject) => {
  child = spawn(process.execPath, [SERVER], {
    env: {
      PATH: process.env.PATH, PORT, STRIPE_WEBHOOK_SECRET: WHSEC, ADMIN_NOTIFICATION_EMAILS: 'admin@kyran-jeu.fr',
      REVIEW_REQUESTS_FILE: path.join(tmp, 'server.json'), REVIEW_DELAY_MS: '300', REVIEW_TICK_MS: '150'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  const collect = d => { logs += String(d); if (logs.includes('actif sur port')) resolve(); };
  child.stdout.on('data', collect);
  child.stderr.on('data', collect);
  child.on('error', reject);
  setTimeout(() => reject(new Error('timeout démarrage serveur')), 5000);
}));
after(() => { child.kill(); fs.rmSync(tmp, { recursive: true, force: true }); });

function send(event) {
  const body = JSON.stringify(event);
  const ts = Math.floor(Date.now() / 1000);
  const sig = crypto.createHmac('sha256', WHSEC).update(`${ts}.${body}`).digest('hex');
  return fetch(BASE + '/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': `t=${ts},v1=${sig}` }, body });
}
const count = re => (logs.match(re) || []).length;
const wait = ms => new Promise(r => setTimeout(r, ms));

test('serveur : demande d’avis envoyée une seule fois après le délai', async () => {
  const session = { id: 'cs_test_avis', payment_status: 'paid', amount_total: 1298, amount_subtotal: 999, customer_details: { email: 'avis@example.com', name: 'Léa Test' } };
  assert.equal((await send({ id: 'evt_avis_1', type: 'checkout.session.completed', data: { object: session } })).status, 200);
  // Même commande par un autre événement (paiement différé confirmé) : pas de seconde demande.
  assert.equal((await send({ id: 'evt_avis_2', type: 'checkout.session.async_payment_succeeded', data: { object: session } })).status, 200);
  const end = Date.now() + 4000;
  while (!/Demande d'avis envoyée/.test(logs) && Date.now() < end) await wait(50);
  await wait(600);
  assert.equal(count(/Demande d'avis programmée/g), 1);
  assert.equal(count(/Demande d'avis envoyée/g), 1);
});

test('serveur : désinscription par formulaire (GET sans effet, POST effectif)', async () => {
  const bad = await fetch(BASE + '/avis/desinscription?t=xx');
  assert.equal(bad.status, 400);
  const token = 'A'.repeat(32);
  const page = await fetch(`${BASE}/avis/desinscription?t=${token}`);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /method="post"/);
  assert.doesNotMatch(logs, /Désinscription des demandes/);
  const r = await fetch(BASE + '/avis/desinscription', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `t=${token}` });
  assert.equal(r.status, 200);
  assert.match(await r.text(), /plus de demande/);
});

test('serveur : vente sur place sans adresse acceptée, avis J+10 gardé', async () => {
  const session = {
    id: 'cs_test_a1SurPlace0001', payment_status: 'paid', amount_total: 1998, amount_subtotal: 1998,
    total_details: { amount_shipping: 0 }, metadata: { canal: 'sur-place' },
    customer_details: { email: 'festival@example.com', name: null }
  };
  const avant = await (await fetch(BASE + '/api/sur-place?session=cs_test_a1SurPlace0001')).json();
  assert.deepEqual(avant, { paye: false });
  assert.equal((await fetch(BASE + '/api/sur-place?session=x')).status, 400);
  const r = await send({ id: 'evt_sur_place', type: 'checkout.session.completed', data: { object: session } });
  assert.equal(r.status, 200);
  const end = Date.now() + 3000;
  while (count(/Demande d'avis programmée/g) < 2 && Date.now() < end) await wait(50);
  assert.equal(count(/Demande d'avis programmée/g), 2);
  assert.doesNotMatch(logs, /Erreur notification admin commande/);
  const apres = await (await fetch(BASE + '/api/sur-place?session=cs_test_a1SurPlace0001')).json();
  assert.deepEqual(apres, { paye: true, quantite: 2 });
});

// Panneau d'achat → session Stripe Checkout : grille de port, validation, et alerte de vente
// avec la bonne quantité pour les deux options. Faux Stripe local, événements simulés : aucun paiement.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fraisPort, totalCommande, quantiteValide, GRILLE_PORT, PRIX_BOITE_CENTS } from '../tarifs.js';
import { lireCommande, parametresSession } from '../commande.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.resolve(__dirname, '../server.js');
const WHSEC = 'whsec_test_commande';
const BASE = 'http://127.0.0.1:39893';
const ORIGIN = 'https://kyran-jeu.fr';

test('grille de port du 20/11/2026', () => {
  const attendu = { 1: 299, 2: 499, 3: 599, 4: 599, 5: 799, 10: 799, 11: 999, 15: 999, 16: 1599, 40: 1599, 41: 2599, 99: 2599 };
  for (const [q, cents] of Object.entries(attendu)) assert.equal(fraisPort(Number(q)), cents, q + ' boîte(s)');
  for (let q = 1; q <= 99; q++) assert.equal(fraisPort(q, 'main-propre'), 0);
  assert.equal(GRILLE_PORT.at(-1).max, 99);
  assert.equal(PRIX_BOITE_CENTS, 999);
  assert.deepEqual(totalCommande(12), { boites: 11988, port: 999, total: 12987 });
  assert.deepEqual(totalCommande(12, 'main-propre'), { boites: 11988, port: 0, total: 11988 });
  for (const q of [0, 100, 1.5, '3', -1]) assert.equal(quantiteValide(q), false);
  assert.throws(() => fraisPort(100));
});

test('validation de la commande envoyée par le site', () => {
  assert.deepEqual(lireCommande({ mode: 'livraison', quantite: 12 }), { mode: 'livraison', quantite: 12, ref: '', source: {} });
  assert.equal(lireCommande({ mode: 'main-propre', quantite: 3, ref: 'festival' }).ref, 'festival');
  assert.equal(lireCommande({ mode: 'livraison', quantite: 2, ref: '<x>' }).ref, '');
  for (const b of [null, {}, { mode: 'sur-place', quantite: 1 }, { mode: 'livraison', quantite: 100 }, { mode: 'livraison', quantite: '2' }]) {
    assert.ok(lireCommande(b).erreur);
  }
});

test('source de la commande : liste blanche, caractères sûrs, 64 max, dans les métadonnées', () => {
  const c = lireCommande({ mode: 'livraison', quantite: 1, source: {
    ref: 'festival', utm_source: 'insta.bio', utm_medium: 'a b', utm_campaign: 'x'.repeat(65), autre: 'ok'
  } });
  assert.deepEqual(c.source, { ref: 'festival', utm_source: 'insta.bio' });
  assert.deepEqual(lireCommande({ mode: 'livraison', quantite: 1, ref: 'fest' }).source, { ref: 'fest' });
  assert.deepEqual(lireCommande({ mode: 'livraison', quantite: 1, source: 'x' }).source, {});
  const p = parametresSession(c);
  assert.equal(p.get('metadata[source_ref]'), 'festival');
  assert.equal(p.get('metadata[source_utm_source]'), 'insta.bio');
  assert.equal(p.get('payment_intent_data[metadata][source_utm_source]'), 'insta.bio');
  assert.equal(p.get('metadata[source_utm_medium]'), null);
  assert.equal(p.get('metadata[source_autre]'), null);
  assert.equal(p.get('success_url'), 'https://kyran-jeu.fr/merci.html');
});

test('paramètres Stripe : montant au centime, port de la grille, main propre sans adresse', () => {
  const liv = parametresSession({ mode: 'livraison', quantite: 16, ref: '' });
  assert.equal(liv.get('line_items[0][quantity]'), '16');
  assert.equal(liv.get('locale'), 'fr');
  assert.equal(liv.get('line_items[0][price_data][unit_amount]'), '999');
  assert.equal(liv.get('shipping_options[0][shipping_rate_data][fixed_amount][amount]'), '1599');
  assert.equal(liv.get('metadata[quantity]'), '16');
  assert.equal(liv.get('success_url'), 'https://kyran-jeu.fr/merci.html');
  assert.equal(liv.get('shipping_address_collection[allowed_countries][0]'), 'FR');
  const mp = parametresSession({ mode: 'main-propre', quantite: 25, ref: '' });
  assert.equal(mp.get('metadata[canal]'), 'sur-place');
  assert.equal(mp.get('line_items[0][quantity]'), '25');
  assert.equal(mp.get('shipping_options[0][shipping_rate_data][type]'), null);
  assert.equal(mp.get('shipping_address_collection[allowed_countries][0]'), null);
  assert.match(mp.get('custom_text[submit][message]'), /On convient de la remise par mail\./);
  assert.equal(liv.get('custom_text[submit][message]'), null);
  assert.match(mp.get('success_url'), /merci-sur-place\.html\?session_id=\{CHECKOUT_SESSION_ID\}$/);
});

// Faux Stripe : garde le dernier corps reçu et rend une URL de paiement.
let fauxStripe;
let dernierCorps = null;
let child;
let logs = '';

before(async () => {
  fauxStripe = http.createServer((req, res) => {
    let raw = '';
    req.on('data', c => { raw += c; });
    req.on('end', () => {
      dernierCorps = new URLSearchParams(raw);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id: 'cs_test_faux', url: 'https://checkout.stripe.com/c/pay/cs_test_faux' }));
    });
  });
  await new Promise(r => fauxStripe.listen(39894, '127.0.0.1', r));
  await new Promise((resolve, reject) => {
    child = spawn(process.execPath, [SERVER], {
      env: {
        PATH: process.env.PATH, PORT: '39893', STRIPE_WEBHOOK_SECRET: WHSEC, ADMIN_NOTIFICATION_EMAILS: 'admin@kyran-jeu.fr',
        STRIPE_SECRET_KEY: 'rk_test_faux', STRIPE_API_BASE: 'http://127.0.0.1:39894'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    const collect = d => { logs += String(d); if (logs.includes('actif sur port')) resolve(); };
    child.stdout.on('data', collect);
    child.stderr.on('data', collect);
    child.on('error', reject);
    setTimeout(() => reject(new Error('timeout démarrage serveur')), 5000);
  });
});
after(() => { child.kill(); fauxStripe.close(); });

const commander = (body, origin = ORIGIN) => fetch(BASE + '/api/commande', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: origin },
  body: JSON.stringify(body)
});

test('POST /api/commande : session créée avec la quantité et le port de la grille', async () => {
  const r = await commander({ mode: 'livraison', quantite: 12 });
  assert.equal(r.status, 200);
  assert.equal((await r.json()).url, 'https://checkout.stripe.com/c/pay/cs_test_faux');
  assert.equal(r.headers.get('access-control-allow-origin'), ORIGIN);
  assert.equal(dernierCorps.get('line_items[0][quantity]'), '12');
  assert.equal(dernierCorps.get('shipping_options[0][shipping_rate_data][fixed_amount][amount]'), '999');
});

test('POST /api/commande : origine inconnue refusée, quantité hors grille refusée', async () => {
  assert.equal((await commander({ mode: 'livraison', quantite: 2 }, 'https://exemple.com')).status, 403);
  assert.equal((await commander({ mode: 'livraison', quantite: 100 })).status, 400);
  assert.equal((await commander({ mode: 'main-propre', quantite: 0 })).status, 400);
});

function envoyer(event) {
  const body = JSON.stringify(event);
  const ts = Math.floor(Date.now() / 1000);
  const sig = crypto.createHmac('sha256', WHSEC).update(ts + '.' + body).digest('hex');
  return fetch(BASE + '/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Stripe-Signature': 't=' + ts + ',v1=' + sig },
    body
  });
}

async function logged(pattern, ms = 2000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (pattern.test(logs)) return true;
    await new Promise(r => setTimeout(r, 20));
  }
  return false;
}

test('alerte de vente : bonne quantité en livraison (12) et en main propre (25)', async () => {
  const liv = {
    id: 'cs_test_liv12', payment_status: 'paid', amount_total: 12987, amount_subtotal: 11988,
    total_details: { amount_shipping: 999 }, metadata: { quantity: '12', canal: 'livraison' },
    customer_details: { email: 'liv@example.com', name: 'Camille Test' },
    collected_information: { shipping_details: { name: 'Camille Test', address: { line1: '1 rue du Jeu', postal_code: '75001', city: 'Paris', country: 'FR' } } }
  };
  assert.equal((await envoyer({ id: 'evt_liv12', type: 'checkout.session.completed', data: { object: liv } })).status, 200);
  assert.ok(await logged(/Notification de commande envoyée à l'administrateur \(\d+ destinataire\(s\), 12 boîte\(s\)\)/), 'alerte livraison 12');

  const mp = {
    id: 'cs_test_mp25', payment_status: 'paid', amount_total: 24975, amount_subtotal: 24975,
    total_details: { amount_shipping: 0 }, metadata: { quantity: '25', canal: 'sur-place' },
    customer_details: { email: 'mp@example.com', name: 'Main Propre' }
  };
  assert.equal((await envoyer({ id: 'evt_mp25', type: 'checkout.session.completed', data: { object: mp } })).status, 200);
  assert.ok(await logged(/25 boîte\(s\), main propre\)/), 'alerte main propre 25');
});

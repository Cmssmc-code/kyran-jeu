// Inscriptions par mail : validation, doublons, piège à robots, accord, export admin, désinscription signée,
// Brevo facultatif. Aucun envoi réel (transport « none »), Brevo simulé par un faux serveur local.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  normalizeEmail,
  cleanUtm,
  createInscriptionStore,
  createBrevoClient,
  inscriptionToken,
  CONSENT_TEXT,
  RETENTION_MS
} from '../inscriptions.js';
import { renderInscriptionEmail, INSCRIPTION_LINKS } from '../templates.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.resolve(__dirname, '../server.js');
const PORT = '39941';
const BREVO_PORT = 39942;
const BASE = `http://127.0.0.1:${PORT}`;
const ADMIN = 'a'.repeat(40);
const SECRET = 'secret-inscription-test';
const ORIGIN = 'https://kyran-jeu.fr';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kyran-inscription-'));
const FILE = path.join(tmp, 'inscriptions.json');

test('adresse : validation stricte et normalisation', () => {
  assert.equal(normalizeEmail('  Lea.Martin+kyran@Example.FR '), 'lea.martin+kyran@example.fr');
  for (const bad of ['', 'a@b', 'pas-une-adresse', 'a@@b.fr', 'a b@c.fr', '.a@b.fr', 'a.@b.fr', 'a..b@c.fr',
    'a@-b.fr', 'a@b-.fr', 'a@b.f', 'a@b.123', '<a@b.fr>', 'a\n@b.fr', `${'x'.repeat(65)}@b.fr`, null, 42, {}]) {
    assert.equal(normalizeEmail(bad), null, `refusée : ${JSON.stringify(bad)}`);
  }
});

test('utm : clés connues seulement, valeurs nettoyées', () => {
  assert.deepEqual(cleanUtm({ utm_source: 'festival', utm_campaign: 'carrieres-2026-11<script>', autre: 'x', utm_term: 5 }),
    { utm_source: 'festival', utm_campaign: 'carrieres-2026-11script' });
  assert.deepEqual(cleanUtm('x'), {});
  assert.deepEqual(cleanUtm(['utm_source']), {});
});

test('fichier : pas de doublon (même email + source), accord exact, désinscription par jeton, purge à 3 ans', async () => {
  const file = path.join(tmp, 'unit.json');
  const store = createInscriptionStore({ file, secret: 's' });
  assert.equal(store.upsert({ email: 'a@example.com', source: 'avent', utm: {} }, 1000), 'created');
  assert.equal(store.upsert({ email: 'a@example.com', source: 'avent', utm: { utm_source: 'x' } }, 2000), 'updated');
  assert.equal(store.upsert({ email: 'a@example.com', source: 'site' }, 3000), 'created');
  await store.flush();
  const saved = JSON.parse(fs.readFileSync(file, 'utf8')).inscriptions;
  assert.equal(saved.length, 2);
  assert.equal(saved[0].consentement, CONSENT_TEXT);
  assert.equal(saved[0].date, new Date(2000).toISOString());
  assert.deepEqual(saved[0].utm, { utm_source: 'x' });

  // Redémarrage : le fichier est relu.
  const again = createInscriptionStore({ file, secret: 's' });
  assert.equal(again.list().length, 2);
  assert.deepEqual(again.unsubscribe('court'), []);
  assert.deepEqual(again.unsubscribe(inscriptionToken('autre-secret', 'a@example.com')), []);
  assert.deepEqual(again.unsubscribe(inscriptionToken('s', 'A@Example.com')), ['a@example.com']);
  assert.equal(again.list().length, 0);

  const old = createInscriptionStore({ secret: 's' });
  old.upsert({ email: 'b@example.com', source: 'site' }, 0);
  old.upsert({ email: 'c@example.com', source: 'site' }, RETENTION_MS);
  assert.equal(old.purge(RETENTION_MS + 1), 1);
  assert.deepEqual(old.list().map(e => e.email), ['c@example.com']);
});

test('Brevo : désactivé sans BREVO_API_KEY ou BREVO_LIST_ID ; appel v3 avec SOURCE et updateEnabled', async () => {
  assert.equal(createBrevoClient({}), null);
  assert.equal(createBrevoClient({ BREVO_API_KEY: 'k' }), null);
  assert.equal(createBrevoClient({ BREVO_LIST_ID: '3' }), null);
  const calls = [];
  const fakeFetch = async (url, init) => { calls.push({ url, init }); return { ok: true, text: async () => '' }; };
  const client = createBrevoClient({ BREVO_API_KEY: 'k', BREVO_LIST_ID: '7' }, fakeFetch);
  await client.addContact('a@example.com', 'avent');
  assert.equal(calls[0].url, 'https://api.brevo.com/v3/contacts');
  assert.equal(calls[0].init.headers['api-key'], 'k');
  assert.deepEqual(JSON.parse(calls[0].init.body), { email: 'a@example.com', attributes: { SOURCE: 'avent' }, listIds: [7], updateEnabled: true });
  await client.removeContact('a@example.com');
  assert.equal(calls[1].url, 'https://api.brevo.com/v3/contacts/lists/7/contacts/remove');
  const failing = createBrevoClient({ BREVO_API_KEY: 'k', BREVO_LIST_ID: '7' }, async () => ({ ok: false, status: 401, text: async () => 'unauthorized' }));
  await assert.rejects(failing.addContact('a@example.com', 'site'), /HTTP 401/);
});

test('mail de confirmation : règle en PDF, liens kyran-jeu.fr en clair, désinscription, mots interdits absents', () => {
  const unsub = 'https://kyran-webhook-production.up.railway.app/inscription/desinscription?t=abc';
  for (const source of ['festival-qr', 'avent', 'site']) {
    const { html, text } = renderInscriptionEmail({ source, unsubscribeUrl: unsub });
    assert.ok(html.includes(INSCRIPTION_LINKS.regle) && text.includes(INSCRIPTION_LINKS.regle));
    assert.ok(html.includes(unsub) && text.includes(unsub));
    assert.equal(text.includes(INSCRIPTION_LINKS.avent), source === 'avent');
    assert.doesNotMatch(html + text, /gratuit|offert|démo|boîte|bit\.ly|tinyurl/i);
  }
  assert.equal(INSCRIPTION_LINKS.regle, 'https://kyran-jeu.fr/regle-kyran.pdf');
  assert.ok(fs.existsSync(path.resolve(__dirname, '../../regle-kyran.pdf')), 'le PDF de la règle existe dans le dépôt');
});

// --- Serveur complet, Brevo simulé ---
let child;
let brevoServer;
let logs = '';
const brevoCalls = [];

before(async () => {
  brevoServer = http.createServer((req, res) => {
    let body = '';
    req.on('data', c => { body += c; });
    req.on('end', () => {
      brevoCalls.push({ url: req.url, key: req.headers['api-key'], body: JSON.parse(body || '{}') });
      res.writeHead(req.url === '/v3/contacts' ? 201 : 204, { 'Content-Type': 'application/json' });
      res.end(req.url === '/v3/contacts' ? '{"id":1}' : '');
    });
  });
  await new Promise(r => brevoServer.listen(BREVO_PORT, '127.0.0.1', r));
  await new Promise((resolve, reject) => {
    child = spawn(process.execPath, [SERVER], {
      env: {
        PATH: process.env.PATH, PORT, ADMIN_SECRET: ADMIN, INSCRIPTION_SECRET: SECRET, INSCRIPTIONS_FILE: FILE,
        REVIEW_REQUESTS_FILE: path.join(tmp, 'avis.json'), INCIDENTS_FILE: path.join(tmp, 'incidents.json'),
        STRIPE_EVENTS_FILE: path.join(tmp, 'events.json'),
        BREVO_API_KEY: 'cle-brevo-test', BREVO_LIST_ID: '12', BREVO_API_BASE: `http://127.0.0.1:${BREVO_PORT}`
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

after(() => {
  child?.kill();
  brevoServer?.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

let ipCounter = 0;
function inscrire(body, { origin = ORIGIN, ip } = {}) {
  const headers = { 'Content-Type': 'application/json', 'X-Forwarded-For': ip || `10.0.0.${++ipCounter}` };
  if (origin) headers.Origin = origin;
  return fetch(BASE + '/api/inscription', { method: 'POST', headers, body: typeof body === 'string' ? body : JSON.stringify(body) });
}
const valid = { email: 'joueur@example.com', source: 'avent', consentement: true, utm: { utm_source: 'festival', utm_medium: 'qr' } };
const readFile = () => (fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')).inscriptions : []);
const wait = ms => new Promise(r => setTimeout(r, ms));

test('serveur : /health indique Brevo branché', async () => {
  const health = await (await fetch(BASE + '/health')).json();
  assert.equal(health.version, '1.12.0');
  assert.equal(health.brevo, true);
});

test('serveur : refus (origine, adresse, source, accord, JSON) sans rien écrire', async () => {
  assert.equal((await inscrire(valid, { origin: null })).status, 403);
  assert.equal((await inscrire(valid, { origin: 'https://evil.example' })).status, 403);
  assert.equal((await inscrire({ ...valid, email: 'faux@' })).status, 400);
  assert.equal((await inscrire({ ...valid, source: 'autre' })).status, 400);
  assert.equal((await inscrire({ ...valid, consentement: 'true' })).status, 400);
  assert.equal((await inscrire({ ...valid, consentement: undefined })).status, 400);
  assert.equal((await inscrire('{pas du json')).status, 400);
  assert.deepEqual(readFile(), []);
});

test('serveur : champ piège rempli = succès apparent, rien enregistré', async () => {
  const r = await inscrire({ ...valid, site_web: 'https://spam.example' });
  assert.equal(r.status, 200);
  await wait(100);
  assert.deepEqual(readFile(), []);
});

test('serveur : CORS du site sur la préflight', async () => {
  const r = await fetch(BASE + '/api/inscription', { method: 'OPTIONS', headers: { Origin: ORIGIN, 'Access-Control-Request-Method': 'POST' } });
  assert.equal(r.status, 204);
  assert.equal(r.headers.get('access-control-allow-origin'), ORIGIN);
});

test('serveur : inscription enregistrée, mise à jour sans doublon, Brevo appelé, mail de confirmation', async () => {
  const r1 = await inscrire(valid);
  assert.equal(r1.status, 200);
  assert.deepEqual(await r1.json(), { ok: true, statut: 'created' });
  const r2 = await inscrire({ ...valid, email: ' JOUEUR@example.com ', utm: { utm_source: 'site' } });
  assert.deepEqual(await r2.json(), { ok: true, statut: 'updated' });
  await wait(150);
  const saved = readFile();
  assert.equal(saved.length, 1);
  assert.equal(saved[0].email, 'joueur@example.com');
  assert.equal(saved[0].source, 'avent');
  assert.equal(saved[0].consentement, CONSENT_TEXT);
  assert.match(saved[0].date, /^\d{4}-\d{2}-\d{2}T/);
  assert.deepEqual(saved[0].utm, { utm_source: 'site' });
  const adds = brevoCalls.filter(c => c.url === '/v3/contacts');
  assert.equal(adds.length, 2);
  assert.equal(adds[0].key, 'cle-brevo-test');
  assert.deepEqual(adds[0].body, { email: 'joueur@example.com', attributes: { SOURCE: 'avent' }, listIds: [12], updateEnabled: true });
  assert.match(logs, /simulation envoi à :.*joueur@example\.com/s);
});

test('serveur : export réservé à l’administration', async () => {
  assert.equal((await fetch(BASE + '/api/inscriptions')).status, 401);
  assert.equal((await fetch(BASE + '/api/inscriptions', { headers: { Authorization: 'Bearer mauvais' } })).status, 401);
  const r = await fetch(BASE + '/api/inscriptions', { headers: { Authorization: `Bearer ${ADMIN}` } });
  assert.equal(r.status, 200);
  const data = await r.json();
  assert.equal(data.total, 1);
  assert.equal(data.parSource.avent, 1);
  assert.equal(data.inscriptions[0].email, 'joueur@example.com');
  const compte = await (await fetch(BASE + '/api/inscriptions?compte=1', { headers: { Authorization: `Bearer ${ADMIN}` } })).json();
  assert.equal(compte.inscriptions, undefined);
  assert.equal(compte.adresses, 1);
});

test('serveur : désinscription signée (GET sans effet, POST retire l’adresse et la liste Brevo)', async () => {
  await inscrire({ ...valid, source: 'site' });
  await wait(100);
  assert.equal(readFile().length, 2);
  assert.equal((await fetch(BASE + '/inscription/desinscription?t=xx')).status, 400);
  const token = inscriptionToken(SECRET, 'joueur@example.com');
  const page = await fetch(`${BASE}/inscription/desinscription?t=${token}`);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /method="post"/);
  assert.equal(readFile().length, 2, 'GET ne désinscrit pas (robots des messageries)');
  // Jeton signé avec un autre secret : rien n'est retiré.
  const forged = inscriptionToken('autre', 'joueur@example.com');
  await fetch(BASE + '/inscription/desinscription', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `t=${forged}` });
  await wait(100);
  assert.equal(readFile().length, 2);
  const r = await fetch(BASE + '/inscription/desinscription', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `t=${token}` });
  assert.equal(r.status, 200);
  await wait(150);
  assert.deepEqual(readFile(), []);
  const removes = brevoCalls.filter(c => c.url === '/v3/contacts/lists/12/contacts/remove');
  assert.equal(removes.length, 1);
  assert.deepEqual(removes[0].body, { emails: ['joueur@example.com'] });
});

test('serveur : limite de 10 inscriptions par IP et par heure', async () => {
  let last;
  for (let i = 0; i < 11; i++) last = await inscrire({ ...valid, email: `rafale${i}@example.com` }, { ip: '10.9.9.9' });
  assert.equal(last.status, 429);
});

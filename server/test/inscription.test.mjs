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
  RETENTION_MS,
  CONCOURS,
  CONCOURS_CONSENT_TEXT,
  concoursEtat,
  cleanPrenom
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

test('concours : dates de Paris, prénom, une participation par adresse, accord facultatif, désinscription', () => {
  assert.equal(CONCOURS.debut, Date.parse('2026-12-04T18:30:00+01:00'));
  assert.equal(CONCOURS.fin, Date.parse('2026-12-14T00:00:00+01:00'));
  assert.equal(concoursEtat(CONCOURS.debut - 1), 'avant');
  assert.equal(concoursEtat(CONCOURS.debut), 'ouvert');
  assert.equal(concoursEtat(Date.parse('2026-12-13T23:59:59+01:00')), 'ouvert');
  assert.equal(concoursEtat(CONCOURS.fin), 'ferme');
  assert.equal(cleanPrenom('  Anne-Sophie  '), 'Anne-Sophie');
  assert.equal(cleanPrenom("Zoé d'Arc"), "Zoé d'Arc");
  for (const bad of ['', '   ', '<b>', 'x'.repeat(41), '1abc', 'a@b', null, 3]) assert.equal(cleanPrenom(bad), null, String(bad));

  const store = createInscriptionStore({ secret: 's' });
  const T = CONCOURS.debut;
  assert.equal(store.upsert({ email: 'a@example.com', source: 'concours-noel', prenom: 'Léa', accord: true }, T + 1000), 'created');
  assert.equal(store.upsert({ email: 'a@example.com', source: 'concours-noel', prenom: 'Autre', accord: false }, T + 2000), 'deja');
  assert.equal(store.upsert({ email: 'b@example.com', source: 'concours-noel', prenom: 'Tom', accord: false }, T + 3000), 'created');
  store.upsert({ email: 'a@example.com', source: 'site' }, T + 4000);
  const [a, b] = store.list().filter(e => e.source === 'concours-noel');
  assert.deepEqual([a.prenom, a.accord, a.consentement, a.date], ['Léa', true, CONCOURS_CONSENT_TEXT, new Date(T + 1000).toISOString()]);
  assert.deepEqual([b.prenom, b.accord, b.consentement], ['Tom', false, '']);
  // Désinscription : l'inscription « site » part, la participation reste, sans accord.
  assert.deepEqual(store.unsubscribe(inscriptionToken('s', 'a@example.com')), ['a@example.com']);
  assert.deepEqual(store.list().map(e => [e.email, e.source, e.accord]), [['a@example.com', 'concours-noel', false], ['b@example.com', 'concours-noel', false]]);
  // Après le 31/12, les participations sans accord sont effacées.
  assert.equal(store.purge(CONCOURS.effacement - 1), 0);
  assert.equal(store.purge(CONCOURS.effacement), 2);
});

test('mail du concours : prénom échappé, règlement, désinscription, mots interdits absents', () => {
  const unsub = 'https://kyran-webhook-production.up.railway.app/inscription/desinscription?t=abc';
  for (const accord of [true, false]) {
    const { html, text } = renderInscriptionEmail({ source: 'concours-noel', prenom: 'Léa<b>', accord, unsubscribeUrl: unsub });
    assert.ok(html.includes(unsub) && text.includes(unsub));
    assert.ok(html.includes(INSCRIPTION_LINKS.concours) && text.includes(INSCRIPTION_LINKS.concours));
    assert.ok(html.includes('Léa&lt;b&gt;') && !html.includes('Léa<b>'));
    assert.equal(text.includes('nouvelles de KYRAN'), accord);
    assert.doesNotMatch(html + text, /gratuit|offert|démo|bit\.ly|tinyurl|sur place/i);
  }
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
        CONCOURS_DEBUT: '2020-01-01T00:00:00Z', CONCOURS_FIN: '2099-01-01T00:00:00Z',
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
  assert.equal(health.version, '1.13.0');
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

test('serveur : concours (prénom obligatoire, accord facultatif, doublon ignoré, Brevo seulement avec accord, export CSV)', async () => {
  const base = { email: 'gagnant@example.com', source: 'concours-noel', prenom: 'Léa' };
  assert.equal((await inscrire({ ...base, prenom: '' })).status, 400);
  assert.equal((await inscrire({ ...base, prenom: '<script>' })).status, 400);
  const before = brevoCalls.length;
  const r1 = await inscrire(base);
  assert.deepEqual(await r1.json(), { ok: true, statut: 'created' });
  assert.deepEqual(await (await inscrire({ ...base, consentement: true, prenom: 'Autre' })).json(), { ok: true, statut: 'deja' });
  await inscrire({ email: 'ami@example.com', source: 'concours-noel', prenom: 'Tom', consentement: true });
  await wait(150);
  const rows = readFile().filter(e => e.source === 'concours-noel');
  assert.deepEqual(rows.map(e => [e.email, e.prenom, e.accord]), [['gagnant@example.com', 'Léa', false], ['ami@example.com', 'Tom', true]]);
  const adds = brevoCalls.slice(before).filter(c => c.url === '/v3/contacts');
  assert.deepEqual(adds.map(c => c.body.email), ['ami@example.com']);
  assert.equal(adds[0].body.attributes.PRENOM, 'Tom');
  assert.equal(logs.split("simulation envoi à : [ 'gagnant@example.com' ]").length - 1, 1, 'un seul mail pour le doublon');

  const auth = { headers: { Authorization: `Bearer ${ADMIN}` } };
  assert.equal((await fetch(BASE + '/api/inscriptions?source=concours-noel')).status, 401);
  assert.equal((await fetch(BASE + '/api/inscriptions?source=autre', auth)).status, 400);
  // Adresse valide qui commence par « = » : elle ne doit pas devenir une formule dans le tableur.
  await inscrire({ email: "=cmd|'calc'!a0@example.com", source: 'concours-noel', prenom: 'Zoé' }, { ip: '10.7.7.7' });
  await wait(150);
  const json = await (await fetch(BASE + '/api/inscriptions?source=concours-noel', auth)).json();
  assert.equal(json.total, 3);
  assert.equal(json.avecAccord, 1);
  const csv = await fetch(BASE + '/api/inscriptions?source=concours-noel&format=csv', auth);
  assert.match(csv.headers.get('content-type'), /text\/csv/);
  const lines = (await csv.text()).replace(/^\ufeff/, '').trim().split('\r\n');
  assert.equal(lines[0], 'prenom;email;accord;date');
  assert.match(lines[1], /^"Léa";"gagnant@example\.com";"non";"\d{4}-/);
  assert.equal(lines[3].split(';')[1], `"'=cmd|'calc'!a0@example.com"`);
  assert.equal(lines.length, 4);
});

// Tests du pipeline Auto-Heal côté serveur : journal d'incidents, filtre des fausses alertes,
// vérification OIDC GitHub et routes HTTP. node --test server/test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { IncidentStore, computeFingerprint, isBenignClientError, cleanPath, MAX_DAILY_AUTO_FIXES } from '../incidents.js';
import { verifyGithubOidcToken, GITHUB_ISSUER } from '../githubOidc.js';
import { renderDailyReport } from '../autoHealReport.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.resolve(__dirname, '../server.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kyran-autoheal-'));
const CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const HOUR = 3600 * 1000;

function store() {
  return new IncidentStore(path.join(tmp, `${crypto.randomUUID()}.json`));
}

const clientError = (over = {}) => ({
  source: 'client',
  errorCode: 'JS_ERROR',
  message: 'TypeError: x is undefined',
  path: '/regle.html?utm_source=fb',
  details: { file: 'https://kyran-jeu.fr/components.js?v=abc' },
  ...over
});

test('agrège les rafales : même erreur sur plusieurs pages = un seul incident', () => {
  const s = store();
  const a = s.record(clientError());
  const b = s.record(clientError({ path: '/index.html' }));
  const c = s.record(clientError({ details: { file: 'https://kyran-jeu.fr/components.js?v=def' } }));
  assert.equal(a, b);
  assert.equal(a, c);
  const inc = s.get(a);
  assert.equal(inc.occurrences, 3);
  assert.deepEqual(inc.pages, ['/regle.html', '/index.html']);
  assert.match(inc.display_code, /^JS-[0-9A-F]{6}$/);
});

test('empreinte : les nombres variables ne créent pas de nouvel incident', () => {
  assert.equal(
    computeFingerprint(clientError({ message: 'Cannot read 12 of item 4' })),
    computeFingerprint(clientError({ message: 'Cannot read 99 of item 7' }))
  );
  assert.equal(cleanPath('https://kyran-jeu.fr/blog/a.html?x=1#y'), '/blog/a.html');
});

test('cycle de vie : transitions uniquement depuis pending, 3 tentatives max', () => {
  const s = store();
  const id = s.record(clientError());
  assert.equal(s.markFailed(id, 'tests KO'), true);
  assert.equal(s.markFailed(id, 'tests KO'), true);
  assert.equal(s.get(id).status, 'pending');
  assert.equal(s.markFailed(id, 'tests KO', { explanation: 'Le menu ne s\'ouvrait pas.' }), true);
  assert.equal(s.get(id).status, 'failed');
  assert.equal(s.get(id).details.autoHeal.explanation, 'Le menu ne s\'ouvrait pas.');
  assert.equal(s.markResolved(id, 'abc', 'x'), false, 'plus de transition depuis failed');
  assert.equal(s.pending(5).incidents.length, 0);
});

test('incident corrigé : nouvelles occurrences rattachées 6 h, puis nouvel incident', () => {
  const s = store();
  const t0 = Date.now();
  const id = s.record(clientError(), t0);
  s.markResolved(id, 'sha1', 'corrigé', { files: ['components.js'] }, t0);
  assert.equal(s.record(clientError(), t0 + HOUR), id);
  assert.equal(s.get(id).status, 'auto_fixed');
  assert.notEqual(s.record(clientError(), t0 + 7 * HOUR), id);
});

test('incident ignoré : pas re-soumis à l\'agent pendant 7 jours', () => {
  const s = store();
  const t0 = Date.now();
  const id = s.record(clientError(), t0);
  s.markIgnored(id, 'extension', null, t0);
  assert.equal(s.record(clientError(), t0 + 2 * 24 * HOUR), id);
  assert.equal(s.pending(5, t0 + 2 * 24 * HOUR).incidents.length, 0);
});

test('quota de 30 correctifs par 24 h', () => {
  const s = store();
  const now = Date.now();
  for (let i = 0; i < MAX_DAILY_AUTO_FIXES; i++) {
    const id = s.record(clientError({ message: `Erreur distincte ${'x'.repeat(i + 1)}` }), now);
    s.markResolved(id, `sha${i}`, 'ok', null, now);
  }
  s.record(clientError({ message: 'encore une' }), now);
  const res = s.pending(5, now);
  assert.equal(res.quotaReached, true);
  assert.equal(res.incidents.length, 0);
});

test('persistance : le journal survit à un redémarrage', async () => {
  const file = path.join(tmp, 'persist.json');
  const s = new IncidentStore(file);
  const id = s.record(clientError());
  await s.writing;
  assert.equal(new IncidentStore(file).get(id).occurrences, 1);
});

test('fausses alertes navigateur filtrées', () => {
  const real = { kind: 'error', message: 'TypeError: a is null', file: 'https://kyran-jeu.fr/components.js' };
  assert.equal(isBenignClientError(real, CHROME), false);
  assert.equal(isBenignClientError(real, ''), true, 'sans user-agent');
  assert.equal(isBenignClientError(real, 'Googlebot/2.1'), true);
  assert.equal(isBenignClientError({ ...real, message: 'Script error.' }, CHROME), true);
  assert.equal(isBenignClientError({ ...real, file: 'chrome-extension://abc/x.js' }, CHROME), true);
  assert.equal(isBenignClientError({ ...real, message: 'TypeError: Failed to fetch' }, CHROME), true);
  assert.equal(isBenignClientError({ kind: 'resource', message: 'x', file: 'https://www.googletagmanager.com/gtag/js' }, CHROME), true);
  assert.equal(isBenignClientError({ kind: 'resource', message: 'x', file: 'https://kyran-jeu.fr/card-99.jpg' }, CHROME), false);
});

test('rapport 24 h : rien si aucune action, fiches sinon (HTML échappé)', () => {
  assert.equal(renderDailyReport({ fixed: [], failed: [], ignored: [{ id: '1' }] }), null);
  const s = store();
  const id = s.record(clientError({ message: '<img src=x onerror=alert(1)>' }));
  s.markResolved(id, 'deadbeefcafe', 'Menu réparé', { explanation: 'Le menu plantait.', files: ['components.js'] });
  const r = renderDailyReport(s.handledLast24h());
  assert.match(r.subject, /1 corrigé/);
  assert.match(r.html, /deadbeef/);
  assert.doesNotMatch(r.html, /<img src=x/);
  assert.match(r.text, /Le menu plantait/);
});

// --- OIDC GitHub -----------------------------------------------------------

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const JWK = { ...publicKey.export({ format: 'jwk' }), kid: 'test-kid', alg: 'RS256' };
const getKeys = async () => [JWK];

function jwt(claims, { kid = 'test-kid', key = privateKey } = {}) {
  const h = Buffer.from(JSON.stringify({ alg: 'RS256', kid, typ: 'JWT' })).toString('base64url');
  const p = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const sig = crypto.sign('RSA-SHA256', Buffer.from(`${h}.${p}`), key).toString('base64url');
  return `${h}.${p}.${sig}`;
}

const goodClaims = () => ({
  iss: GITHUB_ISSUER,
  aud: 'kyran-auto-heal',
  repository: 'Cmssmc-code/kyran-jeu',
  exp: Math.floor(Date.now() / 1000) + 300,
  nbf: Math.floor(Date.now() / 1000) - 10
});
const opts = { repository: 'Cmssmc-code/kyran-jeu', audience: 'kyran-auto-heal', getKeys };

test('OIDC : jeton valide du dépôt accepté', async () => {
  assert.ok(await verifyGithubOidcToken(jwt(goodClaims()), opts));
});

test('OIDC : autre dépôt, autre audience, expiré, mauvaise signature → refusé', async () => {
  assert.equal(await verifyGithubOidcToken(jwt({ ...goodClaims(), repository: 'evil/fork' }), opts), null);
  assert.equal(await verifyGithubOidcToken(jwt({ ...goodClaims(), aud: 'https://api.anthropic.com' }), opts), null);
  assert.equal(await verifyGithubOidcToken(jwt({ ...goodClaims(), exp: 1000 }), opts), null);
  assert.equal(await verifyGithubOidcToken(jwt({ ...goodClaims(), iss: 'https://evil' }), opts), null);
  const other = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey;
  assert.equal(await verifyGithubOidcToken(jwt(goodClaims(), { key: other }), opts), null);
  assert.equal(await verifyGithubOidcToken(jwt(goodClaims(), { kid: 'inconnu' }), opts), null);
  assert.equal(await verifyGithubOidcToken('pas.un.jwt', opts), null);
  const [h, p] = jwt(goodClaims()).split('.');
  const none = `${Buffer.from(JSON.stringify({ alg: 'none', kid: 'test-kid' })).toString('base64url')}.${p}.`;
  assert.equal(await verifyGithubOidcToken(none, opts), null);
  assert.ok(h);
});

// --- Routes HTTP -----------------------------------------------------------

const CRON = 'cron-secret-0123456789abcdefghijklmnopqrstuv';
const PORT = 39881;
const BASE = `http://127.0.0.1:${PORT}`;
let child;

before(async () => {
  child = await new Promise((resolve, reject) => {
    const c = spawn(process.execPath, [SERVER], {
      env: { PATH: process.env.PATH, PORT: String(PORT), CRON_SECRET: CRON, INCIDENTS_FILE: path.join(tmp, 'server.json') },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    c.stdout.on('data', d => { if (String(d).includes('actif sur port')) resolve(c); });
    c.on('error', reject);
    setTimeout(() => reject(new Error('timeout démarrage serveur')), 5000);
  });
});
after(() => {
  child?.kill();
  fs.rmSync(tmp, { recursive: true, force: true });
});

const report = (body, headers = {}) => fetch(`${BASE}/api/client-error`, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain', Origin: 'https://kyran-jeu.fr', 'User-Agent': CHROME, ...headers },
  body: JSON.stringify(body)
});
const cron = (p, body) => fetch(BASE + p, {
  method: body ? 'POST' : 'GET',
  headers: { 'X-Cron-Secret': CRON, 'Content-Type': 'application/json' },
  body: body ? JSON.stringify(body) : undefined
});

test('client-error : origine inconnue refusée, fausse alerte non consignée, vraie erreur consignée', async () => {
  const err = { kind: 'error', message: 'TypeError: menu is null', file: 'https://kyran-jeu.fr/components.js?v=1', line: 10, page: '/regle.html' };
  assert.equal((await report(err, { Origin: 'https://evil.example' })).status, 403);
  assert.deepEqual(await (await report({ ...err, message: 'Script error.' })).json(), { recorded: false });
  assert.deepEqual(await (await report(err)).json(), { recorded: true });
  assert.equal((await report('x'.repeat(20000))).status, 413);
});

test('API auto-heal : 401 sans authentification ni avec un faux jeton OIDC', async () => {
  assert.equal((await fetch(`${BASE}/api/auto-heal/incidents`)).status, 401);
  const forged = jwt(goodClaims());
  const r = await fetch(`${BASE}/api/auto-heal/incidents`, { headers: { Authorization: `Bearer ${forged}` } });
  assert.equal(r.status, 401);
  const wrong = await fetch(`${BASE}/api/auto-heal/incidents`, { headers: { 'X-Cron-Secret': 'mauvais' } });
  assert.equal(wrong.status, 401);
});

test('API auto-heal : liste, puis ignore / resolve uniquement depuis pending', async () => {
  const list = await (await cron('/api/auto-heal/incidents?limit=5')).json();
  assert.equal(list.ok, true);
  assert.equal(list.incidents.length, 1);
  const inc = list.incidents[0];
  assert.equal(inc.error_code, 'JS_ERROR');
  assert.equal(inc.path, '/regle.html');
  assert.equal((await cron('/api/auto-heal/incidents/resolve', { incidentId: inc.id })).status, 400, 'commitSha requis');
  const ok = await cron('/api/auto-heal/incidents/resolve', { incidentId: inc.id, commitSha: 'abc123', resolutionSummary: 'Menu réparé' });
  assert.equal(ok.status, 200);
  assert.equal((await cron('/api/auto-heal/incidents/ignore', { incidentId: inc.id, reason: 'x' })).status, 404);
  const after = await (await cron('/api/auto-heal/incidents')).json();
  assert.equal(after.count24h, 1);
  assert.equal(after.incidents.length, 0);
});

test('rapport 24 h : envoyé (simulé sans Resend) une seule fois par jour', async () => {
  const first = await (await cron('/api/auto-heal/daily-report')).json();
  assert.equal(first.sent, true);
  const second = await (await cron('/api/auto-heal/daily-report')).json();
  assert.equal(second.reason, 'already_sent_today');
});

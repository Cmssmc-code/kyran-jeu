// Tests de sécurité du serveur webhook KYRAN : node --test server/test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCustomMessageEmail, renderShippingEmail, renderAdminOrderNotificationEmail } from '../templates.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.resolve(__dirname, '../server.js');
const ADMIN = 'test-admin-secret-0123456789abcdefghijklmnop';
const WHSEC = 'whsec_test_secret';

function startServer(port, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [SERVER], {
      env: { PATH: process.env.PATH, PORT: String(port), ...env },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    child.stdout.on('data', d => { if (String(d).includes('actif sur port')) resolve(child); });
    child.on('error', reject);
    setTimeout(() => reject(new Error('timeout démarrage serveur')), 5000);
  });
}

function sign(body, secret = WHSEC, ts = Math.floor(Date.now() / 1000)) {
  const sig = crypto.createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex');
  return `t=${ts},v1=${sig}`;
}

let secured, open;
const S = 'http://127.0.0.1:39871';
const O = 'http://127.0.0.1:39872';

before(async () => {
  secured = await startServer(39871, { ADMIN_SECRET: ADMIN, STRIPE_WEBHOOK_SECRET: WHSEC });
  open = await startServer(39872, {});
});
after(() => { secured.kill(); open.kill(); });

const post = (base, p, body, headers = {}) => fetch(base + p, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...headers },
  body: typeof body === 'string' ? body : JSON.stringify(body)
});

test('health ne divulgue ni adresses e-mail ni configuration', async () => {
  const txt = await (await fetch(S + '/health')).text();
  assert.doesNotMatch(txt, /@/);
});

test('admin désactivé (503) sans ADMIN_SECRET — plus de mot de passe par défaut', async () => {
  for (const token of ['', 'kyran_secret_2026']) {
    const r = await post(O, '/api/shipping', { customerEmail: 'a@b.fr' }, { Authorization: `Bearer ${token}` });
    assert.equal(r.status, 503);
  }
});

test('mauvais token et ancien token par défaut → 401', async () => {
  for (const token of ['', 'kyran_secret_2026', ADMIN + 'x', WHSEC]) {
    const r = await post(S, '/api/send-custom-email', { to: 'a@b.fr', message: 'x' }, { Authorization: `Bearer ${token}` });
    assert.equal(r.status, 401, `token ${token.slice(0, 5)}`);
  }
});

test('validation des entrées admin', async () => {
  const auth = { Authorization: `Bearer ${ADMIN}` };
  let r = await post(S, '/api/send-custom-email', { to: 'a@b.fr, c@d.fr', message: 'x' }, auth);
  assert.equal(r.status, 400);
  r = await post(S, '/api/send-custom-email', { to: 'a@b.fr', message: 'x', actionText: 'go', actionUrl: 'javascript:alert(1)' }, auth);
  assert.equal(r.status, 400);
  r = await post(S, '/api/shipping', { customerEmail: 'a@b.fr', trackingUrl: 'http://evil.test' }, auth);
  assert.equal(r.status, 400);
  r = await post(S, '/api/send-custom-email', { to: 'a@b.fr', message: 'Bonjour' }, auth);
  assert.equal(r.status, 200);
});

test('CORS limité aux origines autorisées', async () => {
  const evil = await fetch(S + '/api/shipping', { method: 'OPTIONS', headers: { Origin: 'https://evil.test' } });
  assert.equal(evil.headers.get('access-control-allow-origin'), null);
  const ok = await fetch(S + '/api/shipping', { method: 'OPTIONS', headers: { Origin: 'https://kyran-jeu.fr' } });
  assert.equal(ok.headers.get('access-control-allow-origin'), 'https://kyran-jeu.fr');
  const wh = await fetch(S + '/webhook', { method: 'OPTIONS', headers: { Origin: 'https://kyran-jeu.fr' } });
  assert.equal(wh.headers.get('access-control-allow-origin'), null);
});

test('webhook rejeté si STRIPE_WEBHOOK_SECRET absent', async () => {
  const body = JSON.stringify({ id: 'evt_1', type: 'noop' });
  const r = await post(O, '/webhook', body, { 'Stripe-Signature': sign(body) });
  assert.equal(r.status, 503);
});

test('webhook : signature requise, valide, et protégée contre le rejeu', async () => {
  const body = JSON.stringify({ id: 'evt_sig', type: 'noop.event', data: { object: {} } });
  assert.equal((await post(S, '/webhook', body)).status, 400);
  assert.equal((await post(S, '/webhook', body, { 'Stripe-Signature': sign(body, 'whsec_wrong') })).status, 400);
  const old = Math.floor(Date.now() / 1000) - 3600;
  assert.equal((await post(S, '/webhook', body, { 'Stripe-Signature': sign(body, WHSEC, old) })).status, 400);
  assert.equal((await post(S, '/webhook', body, { 'Stripe-Signature': sign(body) })).status, 200);
  // Corps modifié après signature
  const sigHeader = sign(body);
  assert.equal((await post(S, '/webhook', body.replace('noop', 'nooq'), { 'Stripe-Signature': sigHeader })).status, 400);
});

test('webhook : signature valide sur un corps UTF-8 multi-octets', async () => {
  const body = JSON.stringify({ id: 'evt_utf8', type: 'noop', data: { object: { name: 'Hélène 🃏 Ñandú' } } });
  assert.equal((await post(S, '/webhook', body, { 'Stripe-Signature': sign(body) })).status, 200);
});

test('templates : injection HTML échappée et liens non https neutralisés', () => {
  const xss = '<img src=x onerror=alert(1)>"\'';
  const custom = renderCustomMessageEmail({
    customerName: xss, subject: xss, message: `${xss}\n\nligne`, actionText: xss, actionUrl: 'javascript:alert(1)'
  });
  assert.doesNotMatch(custom.html, /<img src=x/);
  assert.doesNotMatch(custom.html, /javascript:/);
  const ship = renderShippingEmail({ customerName: xss, carrier: xss, trackingNumber: xss, trackingUrl: 'data:text/html,x' });
  assert.doesNotMatch(ship.html, /<img src=x/);
  assert.doesNotMatch(ship.html, /data:text/);
  const admin = renderAdminOrderNotificationEmail({
    customerName: xss, customerEmail: 'x"onmouseover="alert(1)@a.fr',
    shippingAddress: { name: xss, line1: xss, city: xss, postal_code: xss, country: xss }
  });
  assert.doesNotMatch(admin.html, /<img src=x/);
  assert.doesNotMatch(admin.html, /onmouseover="/);
  // la version texte reste lisible (pas d'entités HTML)
  assert.match(admin.text, /<img src=x/);
});

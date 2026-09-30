// Tests de sécurité du Worker Cloudflare KYRAN : node --test worker/test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import worker from '../index.js';

const WHSEC = 'whsec_test_secret';
const ADMIN = 'test-admin-secret-0123456789abcdefghijklmnop';

function sign(body, secret = WHSEC, ts = Math.floor(Date.now() / 1000)) {
  const sig = crypto.createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex');
  return `t=${ts},v1=${sig}`;
}

const req = (path, { method = 'POST', body, headers = {} } = {}) =>
  new Request('https://worker.test' + path, { method, body, headers });

test('webhook rejeté sans STRIPE_WEBHOOK_SECRET (fail closed)', async () => {
  const body = JSON.stringify({ type: 'noop' });
  const r = await worker.fetch(req('/webhook', { body, headers: { 'stripe-signature': sign(body) } }), {});
  assert.equal(r.status, 503);
});

test('webhook : signature absente, invalide, expirée, valide', async () => {
  const env = { STRIPE_WEBHOOK_SECRET: WHSEC };
  const body = JSON.stringify({ id: 'evt', type: 'noop', data: { object: {} } });
  assert.equal((await worker.fetch(req('/webhook', { body }), env)).status, 400);
  assert.equal((await worker.fetch(req('/webhook', { body, headers: { 'stripe-signature': sign(body, 'bad') } }), env)).status, 400);
  const old = Math.floor(Date.now() / 1000) - 3600;
  assert.equal((await worker.fetch(req('/webhook', { body, headers: { 'stripe-signature': sign(body, WHSEC, old) } }), env)).status, 400);
  assert.equal((await worker.fetch(req('/webhook', { body, headers: { 'stripe-signature': sign(body) } }), env)).status, 200);
});

test('/api/shipping : désactivé sans secret, 401 avec mauvais token', async () => {
  const body = JSON.stringify({ customerEmail: 'a@b.fr' });
  assert.equal((await worker.fetch(req('/api/shipping', { body }), {})).status, 503);
  const env = { ADMIN_SECRET: ADMIN, STRIPE_WEBHOOK_SECRET: WHSEC };
  for (const t of ['', 'kyran_secret_2026', WHSEC]) {
    const r = await worker.fetch(req('/api/shipping', { body, headers: { authorization: `Bearer ${t}` } }), env);
    assert.equal(r.status, 401);
  }
  const ok = await worker.fetch(req('/api/shipping', { body, headers: { authorization: `Bearer ${ADMIN}` } }), env);
  assert.equal(ok.status, 200);
});

// Cycle de vie des événements Stripe : node --test server/test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStripeEventLog, EVENT_STATE } from '../stripeEvents.js';

test('un événement neuf est réservé, puis dédupliqué une fois traité', () => {
  const log = createStripeEventLog();
  assert.equal(log.claim('evt_1', 0), EVENT_STATE.NEW);
  assert.equal(log.stateOf('evt_1'), EVENT_STATE.PROCESSING);
  log.settle('evt_1', true, 10);
  assert.equal(log.claim('evt_1', 20), EVENT_STATE.DONE);
});

test('un doublon reçu pendant le traitement n’est pas retraité', () => {
  const log = createStripeEventLog();
  assert.equal(log.claim('evt_2', 0), EVENT_STATE.NEW);
  assert.equal(log.claim('evt_2', 1000), EVENT_STATE.PROCESSING);
});

test('un échec libère l’événement pour la relance Stripe', () => {
  const log = createStripeEventLog();
  log.claim('evt_3', 0);
  log.settle('evt_3', false, 5);
  assert.equal(log.claim('evt_3', 10), EVENT_STATE.NEW);
});

test('expirations : traitement bloqué après 5 min, déduplication après 24 h', () => {
  const log = createStripeEventLog();
  log.claim('evt_4', 0);
  assert.equal(log.claim('evt_4', 5 * 60 * 1000 + 1), EVENT_STATE.NEW);
  log.settle('evt_4', true, 0);
  assert.equal(log.claim('evt_4', 24 * 60 * 60 * 1000 - 1), EVENT_STATE.DONE);
  assert.equal(log.claim('evt_4', 24 * 60 * 60 * 1000 + 1), EVENT_STATE.NEW);
});

test('un événement sans identifiant est toujours traité', () => {
  const log = createStripeEventLog();
  assert.equal(log.claim(undefined), EVENT_STATE.NEW);
  assert.equal(log.claim(undefined), EVENT_STATE.NEW);
});

test('les événements traités survivent à un redémarrage, pas ceux en cours', async () => {
  const { mkdtempSync, readFileSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const file = join(mkdtempSync(join(tmpdir(), 'kyran-evt-')), 'stripe-events.json');
  const a = createStripeEventLog({ file, now: 0 });
  a.claim('evt_done', 0);
  a.settle('evt_done', true, 0);
  a.claim('evt_running', 0);
  assert.deepEqual(Object.keys(JSON.parse(readFileSync(file, 'utf8')).done), ['evt_done']);
  const b = createStripeEventLog({ file, now: 1000 });
  assert.equal(b.claim('evt_done', 1000), EVENT_STATE.DONE);
  assert.equal(b.claim('evt_running', 1000), EVENT_STATE.NEW);
  const c = createStripeEventLog({ file, now: 24 * 60 * 60 * 1000 + 1 });
  assert.equal(c.stateOf('evt_done'), EVENT_STATE.NEW);
});

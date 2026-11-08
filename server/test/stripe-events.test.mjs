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

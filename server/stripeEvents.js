/**
 * Cycle de vie des événements Stripe reçus par le webhook (mémoire vive).
 *
 *   inconnu ──claim──▶ processing ──settle(ok)──▶ done        (rejoué : 200 dédupliqué)
 *                          │
 *                          └──settle(échec)──▶ inconnu        (la relance Stripe retraite)
 *
 * Un doublon reçu pendant `processing` (relance Stripe pendant un envoi d'e-mail lent,
 * double livraison) n'est pas retraité : il reçoit 409 et Stripe le relancera plus tard.
 * Sans cet état, deux livraisons simultanées envoyaient deux fois l'e-mail de commande.
 *
 * `done` expire après 24 h ; `processing` après 5 min (traitement bloqué : on retente).
 *
 * Les `done` sont gardés sur le volume Railway (/data/stripe-events.json, écriture atomique) :
 * un redémarrage du serveur n'oublie plus les commandes déjà traitées. `processing` reste en
 * mémoire : un traitement coupé par un redémarrage doit pouvoir être relancé par Stripe.
 */
import fs from 'fs';
import path from 'path';

export const EVENT_STATE = Object.freeze({ NEW: 'new', PROCESSING: 'processing', DONE: 'done' });

const DONE_TTL_MS = 24 * 60 * 60 * 1000;
const PROCESSING_TTL_MS = 5 * 60 * 1000;

/** Fichier du journal : STRIPE_EVENTS_FILE, sinon le volume /data, sinon mémoire seule (dev, tests). */
export function defaultEventsFile() {
  if (process.env.STRIPE_EVENTS_FILE) return process.env.STRIPE_EVENTS_FILE;
  try {
    if (fs.statSync('/data').isDirectory()) return '/data/stripe-events.json';
  } catch { /* pas de volume */ }
  return null;
}

function loadDone(file, now) {
  if (!file) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Object.entries(raw.done || {}).filter(([, at]) => Number.isFinite(at) && now - at <= DONE_TTL_MS);
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('[Stripe] Journal des événements illisible, repart à vide :', err.message);
    return [];
  }
}

export function createStripeEventLog({ file = null, now = Date.now() } = {}) {
  const events = new Map(); // id -> { state: 'processing' | 'done', at }
  for (const [id, at] of loadDone(file, now)) events.set(id, { state: EVENT_STATE.DONE, at });

  function persist() {
    if (!file) return;
    const done = {};
    for (const [id, e] of events) if (e.state === EVENT_STATE.DONE) done[id] = e.at;
    try {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      const tmp = `${file}.${process.pid}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify({ done }), 'utf8');
      fs.renameSync(tmp, file);
    } catch (err) {
      console.error('[Stripe] Écriture du journal des événements impossible :', err.message);
    }
  }

  function purge(now) {
    for (const [id, e] of events) {
      const ttl = e.state === EVENT_STATE.DONE ? DONE_TTL_MS : PROCESSING_TTL_MS;
      if (now - e.at > ttl) events.delete(id);
    }
  }

  return {
    /**
     * Réserve l'événement. Renvoie l'état trouvé : `new` (à traiter, désormais `processing`),
     * `processing` (déjà en cours ailleurs) ou `done` (déjà traité).
     */
    claim(id, now = Date.now()) {
      if (!id) return EVENT_STATE.NEW;
      purge(now);
      const current = events.get(id);
      if (current) return current.state;
      events.set(id, { state: EVENT_STATE.PROCESSING, at: now });
      return EVENT_STATE.NEW;
    },

    /** Clôt le traitement : succès → `done`, échec → oublié pour que la relance Stripe repasse. */
    settle(id, ok, now = Date.now()) {
      if (!id) return;
      if (ok) {
        purge(now);
        events.set(id, { state: EVENT_STATE.DONE, at: now });
        persist();
      } else events.delete(id);
    },

    stateOf(id) {
      return events.get(id)?.state || EVENT_STATE.NEW;
    }
  };
}

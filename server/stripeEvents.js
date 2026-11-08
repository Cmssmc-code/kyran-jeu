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
 */

export const EVENT_STATE = Object.freeze({ NEW: 'new', PROCESSING: 'processing', DONE: 'done' });

const DONE_TTL_MS = 24 * 60 * 60 * 1000;
const PROCESSING_TTL_MS = 5 * 60 * 1000;

export function createStripeEventLog() {
  const events = new Map(); // id -> { state: 'processing' | 'done', at }

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
      if (ok) events.set(id, { state: EVENT_STATE.DONE, at: now });
      else events.delete(id);
    },

    stateOf(id) {
      return events.get(id)?.state || EVENT_STATE.NEW;
    }
  };
}

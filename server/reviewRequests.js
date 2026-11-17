/**
 * Demande d'avis envoyée 10 jours après une commande payée (une seule fois par commande).
 *
 *   commande payée ──schedule──▶ pending ──(J+10, envoi ok)──▶ sent      (e-mail effacé)
 *                                  │
 *                                  ├──(envoi en échec)──▶ pending (tentative + 1) ─▶ failed à MAX_ATTEMPTS
 *                                  └──(désinscription)──▶ supprimé
 *
 * Données minimales : l'e-mail et le prénom ne sont gardés que jusqu'à l'envoi. Ensuite seul
 * l'identifiant de session reste (90 jours) pour qu'une relance Stripe ne reprogramme pas l'envoi.
 * Les désinscriptions sont gardées sous forme de jeton HMAC de l'adresse, jamais en clair.
 *
 * Fichier : REVIEW_REQUESTS_FILE, sinon /data/review-requests.json (volume Railway), sinon mémoire.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const REVIEW_DELAY_MS = 10 * 24 * 60 * 60 * 1000;
const KEEP_DONE_MS = 90 * 24 * 60 * 60 * 1000;
export const MAX_ATTEMPTS = 3;

export function defaultReviewFile() {
  if (process.env.REVIEW_REQUESTS_FILE) return process.env.REVIEW_REQUESTS_FILE;
  try {
    if (fs.statSync('/data').isDirectory()) return '/data/review-requests.json';
  } catch { /* pas de volume */ }
  return null;
}

/** Jeton de désinscription : HMAC de l'adresse normalisée (aucune adresse dans le lien). */
export function unsubscribeToken(secret, email) {
  return crypto.createHmac('sha256', `review-unsub:${secret}`)
    .update(String(email || '').trim().toLowerCase())
    .digest('base64url')
    .slice(0, 32);
}

export function createReviewQueue({ file = null, secret = '', delayMs = REVIEW_DELAY_MS } = {}) {
  let state = { orders: {}, unsubscribed: {} };
  if (file) {
    try {
      const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
      state = { orders: raw.orders || {}, unsubscribed: raw.unsubscribed || {} };
    } catch (err) {
      if (err.code !== 'ENOENT') console.error('[Avis] Fichier des demandes illisible, repart à vide :', err.message);
    }
  }

  function persist() {
    if (!file) return;
    try {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      const tmp = `${file}.${process.pid}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(state), 'utf8');
      fs.renameSync(tmp, file);
    } catch (err) {
      console.error('[Avis] Écriture du fichier des demandes impossible :', err.message);
    }
  }

  const tokenOf = email => unsubscribeToken(secret, email);

  return {
    /** Programme la demande. Renvoie false si déjà connue, adresse désinscrite ou manquante. */
    schedule(orderId, { email, name = '' }, now = Date.now()) {
      if (!orderId || !email || state.orders[orderId]) return false;
      if (state.unsubscribed[tokenOf(email)]) return false;
      state.orders[orderId] = { status: 'pending', email, name, dueAt: now + delayMs, attempts: 0 };
      persist();
      return true;
    },

    /** Demandes arrivées à échéance. */
    due(now = Date.now()) {
      return Object.entries(state.orders)
        .filter(([, o]) => o.status === 'pending' && o.dueAt <= now)
        .map(([id, o]) => ({ id, email: o.email, name: o.name, token: tokenOf(o.email) }));
    },

    markSent(orderId, now = Date.now()) {
      if (!state.orders[orderId]) return;
      state.orders[orderId] = { status: 'sent', at: now };
      persist();
    },

    /** Échec d'envoi : nouvelle tentative une heure plus tard, abandon à MAX_ATTEMPTS. */
    markFailed(orderId, now = Date.now()) {
      const o = state.orders[orderId];
      if (!o || o.status !== 'pending') return 'unknown';
      o.attempts += 1;
      if (o.attempts >= MAX_ATTEMPTS) {
        state.orders[orderId] = { status: 'failed', at: now };
        persist();
        return 'failed';
      }
      o.dueAt = now + 60 * 60 * 1000;
      persist();
      return 'retry';
    },

    /** Désinscrit le jeton et annule les demandes en attente pour cette adresse. */
    unsubscribe(token, now = Date.now()) {
      if (!/^[A-Za-z0-9_-]{32}$/.test(String(token || ''))) return false;
      state.unsubscribed[token] = now;
      for (const [id, o] of Object.entries(state.orders)) {
        if (o.status === 'pending' && tokenOf(o.email) === token) delete state.orders[id];
      }
      persist();
      return true;
    },

    isUnsubscribed(email) {
      return Boolean(state.unsubscribed[tokenOf(email)]);
    },

    /** Oublie les commandes traitées depuis plus de 90 jours. */
    purge(now = Date.now()) {
      let changed = false;
      for (const [id, o] of Object.entries(state.orders)) {
        if (o.status !== 'pending' && now - o.at > KEEP_DONE_MS) { delete state.orders[id]; changed = true; }
      }
      if (changed) persist();
    },

    statusOf(orderId) {
      return state.orders[orderId]?.status || null;
    }
  };
}

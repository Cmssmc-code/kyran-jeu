/**
 * Inscriptions par mail des visiteurs (règle en PDF, nouveaux défis, nouvelles de KYRAN).
 *
 *   formulaire du site ──POST /api/inscription──▶ inscrit (email + source)
 *                                                  │  même email + même source : mise à jour (pas de doublon)
 *                                                  ├──(lien signé de désinscription)──▶ supprimé (toutes sources)
 *                                                  └──(3 ans sans nouvelle inscription)──▶ supprimé (purge)
 *
 * Chaque entrée garde la preuve de l'accord : texte exact de la case cochée, date ISO, source et utm.
 * Fichier : INSCRIPTIONS_FILE, sinon /data/inscriptions.json (volume Railway), sinon ./data/inscriptions.json.
 * Écriture atomique (fichier temporaire + rename), sérialisée, comme server/incidents.js.
 *
 * Concours de Noël (source « concours-noel ») : prénom + email, accord facultatif (accord true/false),
 * une seule participation par adresse (une nouvelle tentative ne change rien), inscriptions ouvertes
 * entre CONCOURS.debut et CONCOURS.fin seulement. La désinscription garde la participation mais passe
 * l'accord à false ; les participations sans accord sont effacées après CONCOURS.effacement (règlement, art. 9).
 *
 * Brevo (facultatif) : si BREVO_API_KEY et BREVO_LIST_ID existent, le contact est aussi ajouté à la liste
 * (API v3, attribut SOURCE, updateEnabled) et retiré de la liste à la désinscription. Sans elles, le fichier suffit.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const SOURCES = Object.freeze(['festival-qr', 'avent', 'site', 'concours-noel']);
// Dates en UTC : 04/12/2026 18h30 et 13/12/2026 23h59 à Paris (UTC+1 en décembre).
export const CONCOURS = Object.freeze({
  source: 'concours-noel',
  debut: Date.parse('2026-12-04T17:30:00Z'),
  fin: Date.parse('2026-12-13T23:00:00Z'),
  effacement: Date.parse('2026-12-31T23:00:00Z')
});
export const CONCOURS_CONSENT_TEXT = 'Je veux recevoir les nouvelles de KYRAN par mail (un mail par semaine au plus). Désinscription en un clic.';

/** 'avant', 'ouvert' ou 'ferme' selon l'heure donnée. */
export function concoursEtat(now = Date.now()) {
  if (now < CONCOURS.debut) return 'avant';
  if (now >= CONCOURS.fin) return 'ferme';
  return 'ouvert';
}

/** Prénom nettoyé (lettres, espaces, tirets, apostrophes ; 1 à 40 caractères), sinon null. */
export function cleanPrenom(value) {
  if (typeof value !== 'string') return null;
  const p = value.normalize('NFC').replace(/\s+/g, ' ').trim();
  if (!p || p.length > 40 || !/^[\p{L}][\p{L}\p{M} '’.-]*$/u.test(p)) return null;
  return p;
}
export const CONSENT_TEXT = "J'accepte de recevoir par mail la règle et les nouvelles de KYRAN (un mail par semaine au plus). Désinscription en un clic.";
export const RETENTION_MS = 3 * 365 * 24 * 60 * 60 * 1000;
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const MAX_ENTRIES = 50000;

export function defaultInscriptionsFile() {
  if (process.env.INSCRIPTIONS_FILE) return process.env.INSCRIPTIONS_FILE;
  try {
    if (fs.statSync('/data').isDirectory()) return '/data/inscriptions.json';
  } catch { /* pas de volume */ }
  return path.join(process.cwd(), 'data', 'inscriptions.json');
}

// Partie locale : caractères atomiques de la RFC 5322 (sans guillemets), points non doublés ni en bord.
// Domaine : étiquettes DNS (lettres, chiffres, tirets internes), extension alphabétique de 2 lettres et plus.
const LOCAL_RE = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const LABEL_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

/** Adresse normalisée (minuscules, sans espaces autour) si elle est valide, sinon null. */
export function normalizeEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length < 6 || email.length > 254) return null;
  const at = email.lastIndexOf('@');
  if (at < 1 || email.indexOf('@') !== at) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (local.length > 64 || !LOCAL_RE.test(local)) return null;
  const labels = domain.split('.');
  if (labels.length < 2 || !labels.every(l => LABEL_RE.test(l))) return null;
  if (!/^[a-z]{2,24}$/.test(labels[labels.length - 1])) return null;
  return email;
}

/** utm_* reçus du navigateur : clés connues seulement, valeurs courtes sans caractères spéciaux. */
export function cleanUtm(value) {
  const out = {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) return out;
  for (const key of UTM_KEYS) {
    const raw = value[key];
    if (typeof raw !== 'string') continue;
    const v = raw.replace(/[^\p{L}\p{N} ._~+-]+/gu, '').trim().slice(0, 100);
    if (v) out[key] = v;
  }
  return out;
}

/** Jeton de désinscription : HMAC de l'adresse normalisée (aucune adresse dans le lien). */
export function inscriptionToken(secret, email) {
  return crypto.createHmac('sha256', `inscription-unsub:${secret}`)
    .update(String(email || '').trim().toLowerCase())
    .digest('base64url')
    .slice(0, 32);
}

export function isTokenShape(token) {
  return /^[A-Za-z0-9_-]{32}$/.test(String(token || ''));
}

export function createInscriptionStore({ file = null, secret = '' } = {}) {
  let entries = [];
  let writing = Promise.resolve();
  if (file) {
    try {
      const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (raw && Array.isArray(raw.inscriptions)) entries = raw.inscriptions;
    } catch (err) {
      if (err.code !== 'ENOENT') console.error('[Inscription] Fichier illisible, repart à vide :', err.message);
    }
  }

  function save() {
    if (!file) return writing;
    const snapshot = JSON.stringify({ inscriptions: entries }, null, 1);
    writing = writing.then(async () => {
      try {
        await fs.promises.mkdir(path.dirname(file), { recursive: true });
        const tmp = `${file}.${process.pid}.tmp`;
        await fs.promises.writeFile(tmp, snapshot, 'utf8');
        await fs.promises.rename(tmp, file);
      } catch (err) {
        console.error('[Inscription] Écriture du fichier impossible :', err.message);
      }
    });
    return writing;
  }

  const tokenOf = email => inscriptionToken(secret, email);

  return {
    /** Ajoute ou met à jour (même email + même source). Renvoie 'created' ou 'updated'. */
    upsert({ email, source, utm = {}, prenom = '', accord = false }, now = Date.now()) {
      const date = new Date(now).toISOString();
      const existing = entries.find(e => e.email === email && e.source === source);
      if (source === CONCOURS.source) {
        // Une participation par adresse : une nouvelle tentative ne change rien.
        if (existing) return 'deja';
        if (entries.length >= MAX_ENTRIES) throw Object.assign(new Error('Fichier des inscriptions plein'), { status: 507 });
        entries.push({ email, source, prenom, accord: accord === true, consentement: accord === true ? CONCOURS_CONSENT_TEXT : '', date, utm });
        save();
        return 'created';
      }
      if (existing) {
        existing.consentement = CONSENT_TEXT;
        existing.date = date;
        existing.utm = utm;
        save();
        return 'updated';
      }
      if (entries.length >= MAX_ENTRIES) throw Object.assign(new Error('Fichier des inscriptions plein'), { status: 507 });
      entries.push({ email, source, consentement: CONSENT_TEXT, date, utm });
      save();
      return 'created';
    },

    /** Retire toutes les inscriptions de l'adresse qui correspond au jeton. Renvoie les adresses retirées. */
    unsubscribe(token) {
      if (!isTokenShape(token)) return [];
      const removed = [...new Set(entries.filter(e => tokenOf(e.email) === token).map(e => e.email))];
      if (removed.length) {
        // Participation au concours gardée pour le tirage, sans accord ; le reste est supprimé.
        entries = entries.filter(e => !removed.includes(e.email) || e.source === CONCOURS.source);
        for (const e of entries) {
          if (removed.includes(e.email)) { e.accord = false; e.consentement = ''; }
        }
        save();
      }
      return removed;
    },

    /** Efface les inscriptions de plus de 3 ans (durée annoncée dans la politique de confidentialité). */
    purge(now = Date.now()) {
      const before = entries.length;
      entries = entries.filter(e => now - Date.parse(e.date) <= RETENTION_MS
        && !(e.source === CONCOURS.source && !e.accord && now >= CONCOURS.effacement));
      if (entries.length !== before) save();
      return before - entries.length;
    },

    tokenFor: tokenOf,
    list() {
      return entries.map(e => ({ ...e, utm: { ...e.utm } }));
    },
    flush() {
      return writing;
    }
  };
}

/** Client Brevo (API v3) : null si BREVO_API_KEY ou BREVO_LIST_ID manque. Ne lève jamais d'erreur vers l'appelant. */
export function createBrevoClient(env = process.env, fetchImpl = globalThis.fetch) {
  const key = env.BREVO_API_KEY || '';
  const listId = Number.parseInt(env.BREVO_LIST_ID || '', 10);
  if (!key || !Number.isInteger(listId) || listId <= 0) return null;
  const base = (env.BREVO_API_BASE || 'https://api.brevo.com').replace(/\/+$/, '');

  async function call(pathname, body) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetchImpl(base + pathname, {
        method: 'POST',
        headers: { 'api-key': key, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Brevo ${pathname} : HTTP ${res.status} ${text.slice(0, 200)}`);
      }
      return true;
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    listId,
    addContact(email, source, prenom = '') {
      const attributes = { SOURCE: source };
      if (prenom) attributes.PRENOM = prenom;
      return call('/v3/contacts', { email, attributes, listIds: [listId], updateEnabled: true });
    },
    removeContact(email) {
      return call(`/v3/contacts/lists/${listId}/contacts/remove`, { emails: [email] });
    }
  };
}

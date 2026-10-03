/**
 * Journal des incidents de production KYRAN (pipeline Auto-Heal).
 *
 * Équivalent de la table `production_incidents` de Majordia, sans base de données :
 * un fichier JSON sur le volume Railway (/data), écrit de façon atomique.
 *
 * Cycle de vie : pending → auto_fixed | ignored | failed (3 tentatives max).
 * Les rafales d'une même erreur (même empreinte) sont agrégées dans un seul incident.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const MAX_DAILY_AUTO_FIXES = 30;
export const MAX_ATTEMPTS = 3;
const MAX_INCIDENTS_KEPT = 500;
const RETENTION_MS = 30 * 24 * 3600 * 1000;
const HOUR = 3600 * 1000;

function defaultFile() {
  if (process.env.INCIDENTS_FILE) return process.env.INCIDENTS_FILE;
  // Volume Railway monté sur /data ; à défaut (dev, tests), dossier local.
  try {
    if (fs.statSync('/data').isDirectory()) return '/data/incidents.json';
  } catch { /* pas de volume */ }
  return path.join(process.cwd(), 'data', 'incidents.json');
}

function nowIso(now = Date.now()) {
  return new Date(now).toISOString();
}

function clip(value, max) {
  if (value === null || value === undefined) return null;
  const s = String(value);
  return s.length > max ? s.slice(0, max) : s;
}

/** Chemin de page sans query string ni fragment (les UTM ne doivent pas créer de nouveaux incidents). */
export function cleanPath(raw) {
  if (!raw) return '-';
  let p = String(raw);
  try {
    const u = new URL(p, 'https://kyran-jeu.fr');
    p = u.pathname;
  } catch { /* chemin brut */ }
  return p.split('?')[0].split('#')[0].slice(0, 300) || '-';
}

/**
 * Message normalisé pour l'empreinte : retire les nombres, identifiants et URLs variables,
 * pour qu'une même erreur vue avec des valeurs différentes reste un seul incident.
 */
export function normalizeMessage(message) {
  return String(message || '')
    .replace(/https?:\/\/[^\s)'"]+/g, '<url>')
    .replace(/\b[0-9a-f]{8,}\b/gi, '<id>')
    .replace(/\d+/g, '<n>')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300);
}

export function computeFingerprint(input) {
  const code = (input.errorCode || 'NO_CODE').trim();
  if (input.source === 'client') {
    // Côté navigateur, une même erreur JS touche souvent plusieurs pages : on agrège
    // par message + fichier fautif, pas par page.
    const file = cleanPath(input.details?.file || '');
    return `client|${code}|${normalizeMessage(input.message)}|${file}`.slice(0, 200);
  }
  const status = input.httpStatus ?? 500;
  return `${input.source}|${code}|${cleanPath(input.path)}|${status}`.slice(0, 200);
}

/** Code court lisible (ex. JS-1A2B3C) dérivé de l'empreinte. */
export function displayCodeFor(fingerprint, source) {
  const prefix = source === 'client' ? 'JS' : 'SRV';
  return `${prefix}-${crypto.createHash('sha1').update(fingerprint).digest('hex').slice(0, 6).toUpperCase()}`;
}

export class IncidentStore {
  constructor(file = defaultFile()) {
    this.file = file;
    this.data = { incidents: [], meta: {} };
    this.writing = Promise.resolve();
    this.load();
  }

  load() {
    try {
      const raw = JSON.parse(fs.readFileSync(this.file, 'utf8'));
      if (raw && Array.isArray(raw.incidents)) {
        this.data = { incidents: raw.incidents, meta: raw.meta || {} };
      }
    } catch (err) {
      if (err.code !== 'ENOENT') console.error('[AutoHeal] Journal illisible, repart à vide :', err.message);
    }
  }

  /** Écriture atomique (fichier temporaire + rename), sérialisée. */
  save() {
    const snapshot = JSON.stringify(this.data);
    this.writing = this.writing.then(async () => {
      try {
        await fs.promises.mkdir(path.dirname(this.file), { recursive: true });
        const tmp = `${this.file}.${process.pid}.tmp`;
        await fs.promises.writeFile(tmp, snapshot, 'utf8');
        await fs.promises.rename(tmp, this.file);
      } catch (err) {
        console.error('[AutoHeal] Écriture du journal impossible :', err.message);
      }
    });
    return this.writing;
  }

  prune(now = Date.now()) {
    const list = this.data.incidents.filter(
      inc => inc.status === 'pending' || now - Date.parse(inc.last_seen_at) < RETENTION_MS
    );
    list.sort((a, b) => Date.parse(b.last_seen_at) - Date.parse(a.last_seen_at));
    this.data.incidents = list.slice(0, MAX_INCIDENTS_KEPT);
  }

  get(id) {
    return this.data.incidents.find(inc => inc.id === id) || null;
  }

  /**
   * Enregistre une occurrence. Rattache la rafale à un incident existant plutôt que d'en recréer un :
   * - encore en attente ;
   * - ignoré / abandonné depuis moins de 7 jours (évite de re-solliciter l'agent pour la même cause) ;
   * - corrigé il y a moins de 6 h (le temps que le correctif soit en ligne).
   */
  record(input, now = Date.now()) {
    const fingerprint = computeFingerprint(input);
    const existing = this.data.incidents
      .filter(inc => inc.fingerprint === fingerprint)
      .filter(inc => {
        if (inc.status === 'pending') return true;
        const since = now - Date.parse(inc.resolved_at || inc.last_seen_at);
        if (inc.status === 'ignored' || inc.status === 'failed') return since < 7 * 24 * HOUR;
        if (inc.status === 'auto_fixed') return since < 6 * HOUR;
        return false;
      })
      .sort((a, b) => (b.status === 'pending') - (a.status === 'pending'))[0];

    if (existing) {
      existing.occurrences += 1;
      existing.last_seen_at = nowIso(now);
      const autoHeal = existing.details?.autoHeal;
      existing.details = { ...(input.details || {}), ...(autoHeal ? { autoHeal } : {}) };
      const pages = new Set(existing.pages || []);
      if (pages.size < 10) pages.add(cleanPath(input.path));
      existing.pages = [...pages];
      this.save();
      return existing.id;
    }

    const incident = {
      id: crypto.randomUUID(),
      fingerprint,
      source: input.source,
      error_code: clip(input.errorCode, 80),
      display_code: displayCodeFor(fingerprint, input.source),
      http_status: input.httpStatus ?? null,
      message: clip(input.message, 4000),
      stack: clip(input.stack, 12000),
      path: cleanPath(input.path),
      pages: [cleanPath(input.path)],
      details: input.details || {},
      status: 'pending',
      occurrences: 1,
      first_seen_at: nowIso(now),
      last_seen_at: nowIso(now),
      resolved_at: null,
      resolution_summary: null,
      commit_sha: null,
      resolution_attempts: 0
    };
    this.data.incidents.push(incident);
    this.prune(now);
    this.save();
    console.log(`[AutoHeal] Nouvel incident ${incident.display_code} (${incident.source}) : ${clip(incident.message, 160)}`);
    return incident.id;
  }

  fixedLast24h(now = Date.now()) {
    return this.data.incidents.filter(
      inc => inc.status === 'auto_fixed' && now - Date.parse(inc.resolved_at) < 24 * HOUR
    ).length;
  }

  pending(limit = 5, now = Date.now()) {
    const count24h = this.fixedLast24h(now);
    if (count24h >= MAX_DAILY_AUTO_FIXES) {
      return { quotaReached: true, count24h, max24h: MAX_DAILY_AUTO_FIXES, incidents: [] };
    }
    const safeLimit = Number.isFinite(limit) ? Math.min(20, Math.max(1, Math.trunc(limit))) : 5;
    const incidents = this.data.incidents
      .filter(inc => inc.status === 'pending' && inc.resolution_attempts < MAX_ATTEMPTS)
      .sort((a, b) => b.occurrences - a.occurrences || Date.parse(b.last_seen_at) - Date.parse(a.last_seen_at))
      .slice(0, safeLimit);
    return { quotaReached: false, count24h, max24h: MAX_DAILY_AUTO_FIXES, incidents };
  }

  /** Transitions uniquement depuis `pending` (un double appel du worker est sans effet). */
  transition(id, update, report, now = Date.now()) {
    const inc = this.get(id);
    if (!inc || inc.status !== 'pending') return false;
    update(inc, now);
    const clean = cleanReport(report);
    if (clean) inc.details = { ...(inc.details || {}), autoHeal: clean };
    this.save();
    return true;
  }

  markResolved(id, commitSha, summary, report, now) {
    return this.transition(id, (inc, t) => {
      inc.status = 'auto_fixed';
      inc.resolved_at = nowIso(t);
      inc.commit_sha = clip(commitSha, 80);
      inc.resolution_summary = clip(summary, 300);
    }, report, now);
  }

  markFailed(id, reason, report, now) {
    return this.transition(id, (inc, t) => {
      inc.resolution_attempts += 1;
      inc.resolution_summary = clip(reason, 600);
      if (inc.resolution_attempts >= MAX_ATTEMPTS) {
        inc.status = 'failed';
        inc.resolved_at = nowIso(t);
      }
    }, report, now);
  }

  markIgnored(id, reason, report, now) {
    return this.transition(id, (inc, t) => {
      inc.status = 'ignored';
      inc.resolved_at = nowIso(t);
      inc.resolution_summary = clip(reason, 600);
    }, report, now);
  }

  /** Incidents traités sur 24 h, pour le rapport quotidien. */
  handledLast24h(now = Date.now()) {
    const recent = this.data.incidents.filter(
      inc => inc.resolved_at && now - Date.parse(inc.resolved_at) < 24 * HOUR
    );
    return {
      fixed: recent.filter(inc => inc.status === 'auto_fixed'),
      failed: recent.filter(inc => inc.status === 'failed'),
      ignored: recent.filter(inc => inc.status === 'ignored')
    };
  }

  reportAlreadySent(now = Date.now()) {
    const last = this.data.meta.lastDailyReportAt;
    return Boolean(last && now - Date.parse(last) < 20 * HOUR);
  }

  markReportSent(now = Date.now()) {
    this.data.meta.lastDailyReportAt = nowIso(now);
    this.save();
  }
}

function cleanReport(report) {
  if (!report || typeof report !== 'object') return null;
  const out = {};
  if (typeof report.explanation === 'string' && report.explanation.trim()) out.explanation = report.explanation.trim().slice(0, 1200);
  if (typeof report.analysis === 'string' && report.analysis.trim()) out.analysis = report.analysis.trim().slice(0, 1200);
  if (Array.isArray(report.files)) {
    const files = report.files.filter(f => typeof f === 'string' && f).slice(0, 30).map(f => f.slice(0, 200));
    if (files.length) out.files = files;
  }
  return Object.keys(out).length ? out : null;
}

// ---------------------------------------------------------------------------
// Filtrage des fausses alertes navigateur (avant enregistrement)
// ---------------------------------------------------------------------------

const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|embedly|python|curl|wget|go-http|java\/|node-fetch|axios/i;
const THIRD_PARTY_SOURCE = /^(chrome|moz|safari(-web)?|ms-browser)-extension:|^(iabjs|iab|webkit-masked-url):|googletagmanager\.com|google-analytics\.com|gtag\/js/i;
const BENIGN_MESSAGE = [
  /^Script error\.?$/i, // erreur d'un script tiers sans détail (CORS)
  /ResizeObserver loop/i,
  /sendDataToNative|navigation_performance_logger|Java exception was raised/i,
  /__gCrWeb|instantSearchSDKJSBridgeClearHighlight|_AutofillCallbackHandler/i,
  /Non-Error promise rejection captured/i,
  /^(TypeError: )?(Failed to fetch|NetworkError when attempting to fetch resource|Load failed|cancelled|annulé)\.?$/i,
  /AbortError|The operation was aborted|The user aborted a request/i,
  /play\(\) (request was interrupted|failed because the user didn't interact)|NotAllowedError/i
];

/**
 * true si l'erreur rapportée par le navigateur n'est pas un bug du site : robot,
 * extension, script tiers, coupure réseau, lecture vidéo bloquée par le navigateur…
 * C'est ici que l'agent Auto-Heal ajoute un filtre quand il conclut à une fausse alerte récurrente.
 */
export function isBenignClientError(report, userAgent = '') {
  if (!userAgent || BOT_UA.test(userAgent)) return true;
  const message = String(report.message || '');
  const file = String(report.file || '');
  const stack = String(report.stack || '');
  if (!message.trim()) return true;
  if (BENIGN_MESSAGE.some(re => re.test(message.trim()))) return true;
  if (THIRD_PARTY_SOURCE.test(file)) return true;
  if (/(chrome|moz|safari(-web)?)-extension:\/\//i.test(stack)) return true;
  // Ressource externe (hors kyran-jeu.fr) qui ne charge pas : pas de notre ressort.
  if (report.kind === 'resource' && file && !/^https:\/\/(www\.)?kyran-jeu\.fr\//i.test(file)) return true;
  return false;
}

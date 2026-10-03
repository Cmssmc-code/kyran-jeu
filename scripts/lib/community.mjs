/**
 * Photos et vidéos de la communauté (contenus de joueurs republiés sur @kyran.jeu).
 *
 * Deux fichiers de données :
 * - scripts/content/communaute.json          généré par scripts/fetch-instagram.mjs (ne pas éditer)
 * - scripts/content/communaute-reglages.json édité à la main : masquer une publication, corriger
 *   un crédit ou un texte alternatif, ajouter une publication absente de l'API (publication en
 *   collaboration créée par un joueur, repost natif) avec ou sans fichiers.
 *
 * Les fichiers médias sont hébergés sur le site (dossier /communaute/) : les images et vidéos
 * sont indexées sous kyran-jeu.fr (Google Images, vidéos, assistants IA), sans script ni cookie
 * Instagram sur la page.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const COMMUNITY_DATA = path.join(ROOT, 'scripts', 'content', 'communaute.json');
export const COMMUNITY_SETTINGS = path.join(ROOT, 'scripts', 'content', 'communaute-reglages.json');
export const MEDIA_DIR = 'communaute';
export const OWN_HANDLE = 'kyran.jeu';
export const PAGE_PATH = '/communaute.html';

const SITE = 'https://kyran-jeu.fr';

// ── Crédit dans la légende ─────────────────────────────────────────────────
// « 📸 @pseudo », « Crédit : @pseudo », « via @pseudo », « repost @pseudo », « merci à @pseudo »…
const CREDIT_MARKERS = [
  '📸', '📷', '🎥', '🎬', '📹', '🙏',
  'cr[ée]dits?', 'credits?',
  'photos?(?:\\s+(?:de|par|by))?', 'vid[ée]os?(?:\\s+(?:de|par|by))?',
  'via', 'repost(?:[ée]e?)?(?:\\s+(?:de|from|by))?', 'merci(?:\\s+(?:à|a))?', 'thanks?(?:\\s+to)?',
  'by', 'par'
];
const CREDIT_RE = new RegExp(`(?:^|[^\\p{L}\\p{N}_])(?:${CREDIT_MARKERS.join('|')})\\s*[:\\-–—]?\\s*@([A-Za-z0-9._]{1,30})`, 'giu');

/** Normalise un pseudo Instagram (sans @, minuscules, sans point final). */
export function normalizeHandle(handle) {
  return String(handle || '').trim().replace(/^@/, '').replace(/\.+$/, '').toLowerCase();
}

/** Premier pseudo crédité dans une légende (hors @kyran.jeu), ou null. */
export function extractCredit(caption) {
  if (!caption) return null;
  for (const m of String(caption).matchAll(CREDIT_RE)) {
    const handle = normalizeHandle(m[1]);
    if (handle && handle !== OWN_HANDLE) return handle;
  }
  return null;
}

export function profileUrl(handle) {
  return `https://www.instagram.com/${normalizeHandle(handle)}/`;
}

// ── Liens de publication ───────────────────────────────────────────────────
const SHORTCODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const INSTAGRAM_EPOCH_MS = 1314220021721; // identifiants Instagram : 41 bits de millisecondes depuis cette date

/** Code court d'une URL de publication (instagram.com/p/<code>/, /reel/<code>/, /tv/<code>/), ou null. */
export function shortcodeOf(permalink) {
  const m = String(permalink || '').match(/^https:\/\/(?:www\.)?instagram\.com\/(?:[A-Za-z0-9._]+\/)?(?:p|reel|reels|tv)\/([A-Za-z0-9_-]{5,40})\/?(?:[?#].*)?$/);
  return m ? m[1] : null;
}

/** Date de publication encodée dans le code court (heure exacte à la seconde près), ou null. */
export function shortcodeDate(code) {
  if (!code || code.length > 12) return null;
  let id = 0n;
  for (const ch of code) id = id * 64n + BigInt(SHORTCODE_ALPHABET.indexOf(ch));
  const ms = Number(id >> 23n) + INSTAGRAM_EPOCH_MS;
  if (ms < Date.UTC(2012, 0, 1) || ms > Date.UTC(2100, 0, 1)) return null;
  return new Date(Math.floor(ms / 1000) * 1000).toISOString().replace('.000Z', '+00:00');
}

/** URL d'intégration officielle d'Instagram pour une publication. */
export function embedUrl(code) {
  return `https://www.instagram.com/p/${code}/embed/`;
}

/** Légende affichable : sans lignes composées uniquement de hashtags, espaces réduits, longueur bornée. */
export function cleanCaption(caption, max = 420) {
  if (!caption) return '';
  const lines = String(caption)
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l && !/^(?:[#.·•\-–—]|\s)*$/.test(l) && !/^(?:#[\p{L}\p{N}_]+[\s.,]*)+$/u.test(l));
  let text = lines.join(' ').replace(/\s+/g, ' ').trim();
  // Hashtags en fin de légende
  text = text.replace(/(?:\s*#[\p{L}\p{N}_]+)+\s*$/u, '').trim();
  if (text.length > max) text = text.slice(0, max).replace(/\s+\S*$/, '') + '…';
  return text;
}

/** Légende sans les mentions de crédit (« 📸 @pseudo »…), affichées à part. */
export function stripCredits(caption) {
  return String(caption || '').replace(new RegExp(CREDIT_RE.source + '[\\s!.,;:]*', 'giu'), ' ').replace(/[ \t]+/g, ' ').trim();
}

/** Première phrase (pour un texte alternatif ou un titre). */
export function firstSentence(text, max = 110) {
  const t = cleanCaption(text, 1000);
  if (!t) return '';
  const m = t.match(/^(.+?[.!?…])(?:\s|$)/u);
  let s = (m ? m[1] : t).trim();
  if (s.length > max) s = s.slice(0, max).replace(/\s+\S*$/, '') + '…';
  return s;
}

export function slugify(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'joueur';
}

/** Nom de fichier stable et descriptif (SEO images) : kyran-<date>-<pseudo>-<id>[-n]. */
export function mediaBaseName(post, index, count) {
  const date = String(post.date || '').slice(0, 10) || 'sans-date';
  const suffix = count > 1 ? `-${index + 1}` : '';
  return `kyran-${date}-${slugify(post.credit)}-${String(post.id).slice(-6)}${suffix}`;
}

/** Durée d'une vidéo MP4 en secondes (boîte mvhd), sans dépendance. */
export function mp4Duration(buf) {
  const idx = buf.indexOf('mvhd');
  if (idx < 4) return null;
  const version = buf[idx + 4];
  let timescale;
  let duration;
  if (version === 1) {
    timescale = buf.readUInt32BE(idx + 4 + 20);
    duration = Number(buf.readBigUInt64BE(idx + 4 + 24));
  } else {
    timescale = buf.readUInt32BE(idx + 4 + 12);
    duration = buf.readUInt32BE(idx + 4 + 16);
  }
  if (!timescale || !duration) return null;
  return Math.round(duration / timescale);
}

export function isoDuration(seconds) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `PT${m ? m + 'M' : ''}${s || !m ? s + 'S' : ''}`;
}

// ── Chargement ─────────────────────────────────────────────────────────────
function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function loadSettings() {
  const s = readJson(COMMUNITY_SETTINGS, {});
  return { overrides: s.overrides || {}, manual: Array.isArray(s.manual) ? s.manual : [] };
}

export function loadFetched() {
  const d = readJson(COMMUNITY_DATA, {});
  return Array.isArray(d.posts) ? d.posts : [];
}

const fileExists = src => fs.existsSync(path.join(ROOT, String(src).replace(/^\//, '')));

/** Ajout manuel : identifiant et date déduits du lien de la publication s'ils manquent. */
function withDefaults(p) {
  const code = shortcodeOf(p.permalink);
  return {
    ...p,
    id: p.id || code,
    date: p.date || shortcodeDate(code) || '',
    type: p.type || (/\/reels?\//.test(String(p.permalink)) ? 'reel' : 'post')
  };
}

/**
 * Publications à afficher : publications Instagram + ajouts manuels, réglages appliqués,
 * médias manquants écartés (jamais d'image cassée), triées de la plus récente à la plus ancienne.
 * Un ajout manuel sans fichier (publication d'un joueur en collaboration, que l'API ne renvoie
 * pas) est affiché par l'intégration officielle d'Instagram : propriété `embed`, `media` vide.
 */
export function loadCommunityPosts({ warn = () => {} } = {}) {
  const { overrides, manual } = loadSettings();
  const all = [...loadFetched(), ...manual.map(p => withDefaults({ ...p, source: 'manuel' }))];
  const out = [];
  const seen = new Set();
  for (const raw of all) {
    if (!raw || !raw.id) continue;
    // Une même publication peut venir de l'API et de la liste manuelle : la première l'emporte
    const keys = [String(raw.id), shortcodeOf(raw.permalink)].filter(Boolean);
    if (keys.some(k => seen.has(k))) continue;
    keys.forEach(k => seen.add(k));
    const o = overrides[raw.id] || overrides[shortcodeOf(raw.permalink)] || {};
    if (o.hide) continue;
    const post = { ...raw, ...o };
    post.credit = normalizeHandle(post.credit);
    if (!post.credit) { warn(`publication ${post.id} sans crédit : ignorée`); continue; }
    const media = (post.media || []).filter(m => {
      const ok = m && m.src && fileExists(m.src) && (m.type !== 'video' || (m.poster && fileExists(m.poster)));
      if (!ok) warn(`publication ${post.id} : média introuvable (${m && m.src})`);
      return ok;
    });
    if (media.length) {
      out.push({ ...post, media });
    } else if (post.source === 'manuel' && shortcodeOf(post.permalink)) {
      // Sans fichier hébergé : intégration officielle d'Instagram (iframe)
      out.push({ ...post, media: [], embed: embedUrl(shortcodeOf(post.permalink)) });
    }
  }
  return out.sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.id).localeCompare(String(a.id)));
}

// ── Textes dérivés ─────────────────────────────────────────────────────────
export function altText(post, m, i) {
  if (m.alt) return m.alt;
  if (post.alt) return post.media.length > 1 ? `${post.alt} (${i + 1}/${post.media.length})` : post.alt;
  const what = m.type === 'video' ? 'Vidéo' : 'Photo';
  const n = post.media.length > 1 ? ` (${i + 1}/${post.media.length})` : '';
  const first = firstSentence(stripCredits(post.caption), 90);
  return `${what}${n} d'une partie du jeu de cartes KYRAN partagée par @${post.credit}${first ? ` : ${first}` : ''}`;
}

export function mediaTitle(post, m, i) {
  const what = m.type === 'video' ? 'Vidéo' : 'Photo';
  const n = post.media.length > 1 ? ` (${i + 1}/${post.media.length})` : '';
  return `KYRAN — ${what} de @${post.credit}${n}`;
}

export function mediaDescription(post, m) {
  return cleanCaption(stripCredits(post.caption), 300) || `Partie du jeu de cartes KYRAN partagée sur Instagram par @${post.credit}.`;
}

const abs = src => SITE + (String(src).startsWith('/') ? src : '/' + src);

/** Extrait du sitemap (image:image et video:video) pour /communaute.html. */
export function communitySitemapExtra(posts) {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  let xml = '';
  for (const post of posts) {
    post.media.forEach((m, i) => {
      if (m.type === 'video') {
        xml += `
    <video:video>
      <video:thumbnail_loc>${abs(m.poster)}</video:thumbnail_loc>
      <video:title>${esc(mediaTitle(post, m, i))}</video:title>
      <video:description>${esc(mediaDescription(post, m))}</video:description>
      <video:content_loc>${abs(m.src)}</video:content_loc>${m.duration ? `
      <video:duration>${m.duration}</video:duration>` : ''}${post.date ? `
      <video:publication_date>${esc(post.date)}</video:publication_date>` : ''}
    </video:video>`;
      } else {
        xml += `
    <image:image>
      <image:loc>${abs(m.src)}</image:loc>
      <image:title>${esc(mediaTitle(post, m, i))}</image:title>
    </image:image>`;
      }
    });
  }
  return xml;
}

export { SITE, abs as absoluteUrl };

// ── Jeton Instagram : suivi de l'expiration ────────────────────────────────
export const TOKEN_LIFETIME_DAYS = 60; // jeton longue durée, à compter de sa création ou de son renouvellement
export const TOKEN_ROTATE_AFTER_DAYS = 30; // renouvellement automatique à partir de cet âge
export const TOKEN_ALERT_DAYS = 10; // alerte (issue GitHub) quand il reste moins de jours que cela

const DAY_MS = 86400000;
export const addDays = (iso, n) => new Date(Date.parse(iso + 'T00:00:00Z') + n * DAY_MS).toISOString().slice(0, 10);
export const daysBetween = (from, to) => Math.round((Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / DAY_MS);

/**
 * État du jeton enregistré dans le secret GitHub. On ne connaît pas le jeton, seulement son
 * empreinte (SHA-256 tronquée, irréversible) : une empreinte différente signifie que le secret
 * a été remplacé, et la date d'enregistrement repart du jour.
 * @returns {{ state: {empreinte: string, enregistreLe: string}, changed: boolean, replaced: boolean }}
 */
export function trackToken(previous, fingerprint, today) {
  const prev = previous || {};
  if (!prev.empreinte) {
    const state = { empreinte: fingerprint, enregistreLe: prev.enregistreLe || today };
    return { state, changed: true, replaced: false };
  }
  if (prev.empreinte !== fingerprint) {
    return { state: { empreinte: fingerprint, enregistreLe: today }, changed: true, replaced: true };
  }
  return { state: { empreinte: prev.empreinte, enregistreLe: prev.enregistreLe || today }, changed: !prev.enregistreLe, replaced: false };
}

export function tokenStatus(state, today) {
  const expiresOn = addDays(state.enregistreLe, TOKEN_LIFETIME_DAYS);
  const age = daysBetween(state.enregistreLe, today);
  const daysLeft = daysBetween(today, expiresOn);
  return { expiresOn, age, daysLeft, rotateDue: age >= TOKEN_ROTATE_AFTER_DAYS, alert: daysLeft <= TOKEN_ALERT_DAYS };
}

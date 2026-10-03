#!/usr/bin/env node
/**
 * Récupère les publications du compte Instagram @kyran.jeu (API officielle Meta) et télécharge
 * sur le site les photos et vidéos de joueurs que le compte a republiées.
 *
 * Une publication est retenue quand sa légende crédite un autre compte (« 📸 @pseudo »,
 * « Crédit : @pseudo », « via @pseudo », « repost @pseudo », « merci à @pseudo »…) ou quand
 * scripts/content/communaute-reglages.json la force (`include: true` + `credit`).
 * Les publications propres à @kyran.jeu (sans crédit) sont ignorées.
 *
 * Limite de l'API (connexion Instagram, instagram_business_basic) : /me/media ne renvoie que les
 * publications dont @kyran.jeu est propriétaire. Les publications en collaboration créées par un
 * joueur (champ collaborative_media, réservé à l'API « Facebook Login ») et les reposts natifs
 * n'y figurent pas : ils sont listés à la main dans communaute-reglages.json → manual.
 * Le renouvellement du jeton est géré à part : scripts/instagram-token.mjs.
 *
 * Sortie : scripts/content/communaute.json + fichiers dans /communaute/. Puis `npm run build`.
 *
 * Variables d'environnement :
 *   INSTAGRAM_ACCESS_TOKEN  jeton longue durée (obligatoire) — voir docs/INSTAGRAM.md
 *   INSTAGRAM_USER_ID       facultatif : ID du compte professionnel pour l'API « Facebook Login »
 *                           (graph.facebook.com) ; sans lui, API « Instagram Login » (graph.instagram.com)
 *
 * Usage : node scripts/fetch-instagram.mjs [--dry-run]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { imageSize } from './lib/image-size.mjs';
import {
  COMMUNITY_DATA, MEDIA_DIR, loadSettings, loadFetched, extractCredit, normalizeHandle,
  mediaBaseName, mp4Duration
} from './lib/community.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const API_VERSION = 'v23.0';
const MAX_POSTS = 1000;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_VIDEO_BYTES = 90 * 1024 * 1024; // GitHub refuse les fichiers de plus de 100 Mo
const dryRun = process.argv.includes('--dry-run');

const token = (process.env.INSTAGRAM_ACCESS_TOKEN || '').trim();
const userId = (process.env.INSTAGRAM_USER_ID || '').trim();
if (!token) {
  console.error('INSTAGRAM_ACCESS_TOKEN manquant (voir docs/INSTAGRAM.md).');
  process.exit(1);
}
const base = userId ? `https://graph.facebook.com/${API_VERSION}` : `https://graph.instagram.com/${API_VERSION}`;
const hide = s => String(s).split(token).join('***');

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) {
    const e = body.error || {};
    const expired = e.code === 190 ? ' — jeton expiré ou révoqué : générez-en un nouveau et mettez à jour le secret INSTAGRAM_ACCESS_TOKEN (docs/INSTAGRAM.md)' : '';
    throw new Error(hide(`API Instagram ${res.status} : ${e.message || res.statusText} (type ${e.type || '?'}, code ${e.code || '?'})${expired}`));
  }
  return body;
}

async function fetchAllMedia() {
  const fields = 'id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,username,children{id,media_type,media_url,thumbnail_url}';
  let url = `${base}/${userId || 'me'}/media?fields=${encodeURIComponent(fields)}&limit=50&access_token=${encodeURIComponent(token)}`;
  const items = [];
  let complete = true;
  while (url) {
    const page = await getJson(url);
    items.push(...(page.data || []));
    url = page.paging && page.paging.next;
    if (items.length >= MAX_POSTS) { complete = !url; break; }
  }
  return { items, complete };
}

/** 2026-02-03T18:22:10+0000 → 2026-02-03T18:22:10+00:00 */
function isoDate(ts) {
  return String(ts || '').replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
}

function extFor(contentType, fallback) {
  if (/jpe?g/.test(contentType)) return '.jpg';
  if (/png/.test(contentType)) return '.png';
  if (/webp/.test(contentType)) return '.webp';
  if (/mp4|quicktime/.test(contentType)) return '.mp4';
  return fallback;
}

/** Télécharge une URL du CDN Instagram ; réutilise le fichier s'il existe déjà. */
async function download(url, baseName, kind) {
  const dir = path.join(ROOT, MEDIA_DIR);
  const existing = fs.existsSync(dir) && fs.readdirSync(dir).find(f => f.replace(/\.[a-z0-9]+$/, '') === baseName);
  if (existing) return `/${MEDIA_DIR}/${existing}`;
  if (dryRun) return `/${MEDIA_DIR}/${baseName}${kind === 'video' ? '.mp4' : '.jpg'}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`téléchargement ${res.status}`);
  const type = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  const max = kind === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (buf.length > max) throw new Error(`fichier trop lourd (${Math.round(buf.length / 1048576)} Mo)`);
  const file = baseName + extFor(type, kind === 'video' ? '.mp4' : '.jpg');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, file), buf);
  return `/${MEDIA_DIR}/${file}`;
}

function dims(src) {
  if (dryRun) return {};
  const s = imageSize(path.join(ROOT, src.slice(1)));
  return s ? { width: s.width, height: s.height } : {};
}

async function buildPost(item, credit) {
  const post = {
    id: String(item.id),
    permalink: item.permalink,
    date: isoDate(item.timestamp),
    credit,
    caption: item.caption || '',
    type: item.media_product_type === 'REELS' ? 'reel' : String(item.media_type || '').toLowerCase(),
    media: []
  };
  const parts = item.media_type === 'CAROUSEL_ALBUM' ? ((item.children && item.children.data) || []) : [item];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const name = mediaBaseName(post, i, parts.length);
    try {
      if (p.media_type === 'VIDEO') {
        if (!p.media_url || !p.thumbnail_url) throw new Error('vidéo sans URL (droits musicaux ?)');
        const poster = await download(p.thumbnail_url, `${name}-poster`, 'image');
        const src = await download(p.media_url, name, 'video');
        const duration = dryRun ? null : mp4Duration(fs.readFileSync(path.join(ROOT, src.slice(1))));
        post.media.push({ type: 'video', src, poster, ...dims(poster), ...(duration ? { duration } : {}) });
      } else {
        if (!p.media_url) throw new Error('image sans URL');
        const src = await download(p.media_url, name, 'image');
        post.media.push({ type: 'image', src, ...dims(src) });
      }
    } catch (e) {
      console.log(`  ⚠ ${post.permalink} (média ${i + 1}) : ${hide(e.message)}`);
    }
  }
  return post;
}

// ── Exécution ──────────────────────────────────────────────────────────────
const { overrides, manual } = loadSettings();
const { items, complete } = await fetchAllMedia();
console.log(`${items.length} publication(s) lue(s) sur Instagram.`);

const posts = [];
for (const item of items) {
  const o = overrides[item.id] || {};
  if (o.hide) continue;
  const credit = normalizeHandle(o.credit) || extractCredit(item.caption);
  const include = o.include !== undefined ? o.include : Boolean(credit);
  if (!include) continue;
  if (!credit) {
    console.log(`  ⚠ ${item.permalink} : « include » sans « credit » dans communaute-reglages.json, ignorée`);
    continue;
  }
  const post = await buildPost(item, credit);
  if (post.media.length) posts.push(post);
}
posts.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

// Fichiers devenus inutiles (publication supprimée d'Instagram ou masquée) : supprimés,
// seulement si la liste lue est complète. Les fichiers des ajouts manuels sont conservés.
const keep = new Set();
for (const p of [...posts, ...manual]) for (const m of p.media || []) { keep.add(m.src); if (m.poster) keep.add(m.poster); }
let removed = 0;
const dir = path.join(ROOT, MEDIA_DIR);
if (complete && !dryRun && fs.existsSync(dir)) {
  const previous = new Set(loadFetched().flatMap(p => (p.media || []).flatMap(m => [m.src, m.poster].filter(Boolean))));
  for (const f of fs.readdirSync(dir)) {
    const src = `/${MEDIA_DIR}/${f}`;
    if (previous.has(src) && !keep.has(src)) { fs.unlinkSync(path.join(dir, f)); removed++; }
  }
}

const count = posts.reduce((n, p) => n + p.media.length, 0);
if (dryRun) {
  console.log(`[dry-run] ${posts.length} publication(s) de joueurs, ${count} média(s) :`);
  for (const p of posts) console.log(`  ${p.date.slice(0, 10)}  @${p.credit}  ${p.permalink}`);
} else {
  fs.writeFileSync(COMMUNITY_DATA, JSON.stringify({ posts }, null, 2) + '\n', 'utf8');
  console.log(`${posts.length} publication(s) de joueurs, ${count} média(s) ; ${removed} fichier(s) supprimé(s).`);
  console.log(`+ ${manual.length} publication(s) de joueurs de la liste manuelle (collaborations, communaute-reglages.json).`);
  console.log('Étape suivante : npm run build');
}

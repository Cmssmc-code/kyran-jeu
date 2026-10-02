/**
 * Dates de dernière modification réelles (sitemap <lastmod>, JSON-LD dateModified).
 *
 * Principe : on mémorise, pour chaque page, l'empreinte de son contenu utile
 * (scripts/lastmod-manifest.json). La date ne change que si l'empreinte change :
 * un simple changement de numéro de version des assets (?v=…) ou de date n'est pas
 * une modification de contenu.
 *
 * Amorçage (manifeste absent) : date du dernier commit git du fichier s'il est
 * inchangé dans l'arbre de travail, sinon date du jour.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const MANIFEST_PATH = path.join(ROOT, 'scripts', 'lastmod-manifest.json');

export function today() {
  return process.env.SITE_TODAY || new Date().toISOString().slice(0, 10);
}

/** Retire ce qui change sans que le contenu change. */
export function normalizeHtmlForHash(html) {
  return html
    // Composants rendus statiquement (scripts/prerender.mjs) : en-tête, pied de page, avis…
    .replace(/<(kyran-[\w-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s+data-ssr(?:="[^"]*")?([^>]*)>[\s\S]*?<\/\1>/g, '<$1$2$3></$1>')
    .replace(/<!--ssr-->[\s\S]*?<!--\/ssr-->/g, '<!--ssr--><!--/ssr-->')
    .replace(/\sdata-ssr="[^"]*"/g, '')
    .replace(/\?v=[\w.-]+/g, '')
    .replace(/"dateModified"\s*:\s*"[^"]*"/g, '"dateModified":""')
    .replace(/<meta property="article:modified_time"[^>]*>/g, '')
    .replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function hashString(s) {
  return crypto.createHash('sha1').update(s).digest('hex').slice(0, 16);
}

function gitDate(file) {
  try {
    const abs = path.join(ROOT, file);
    if (!fs.existsSync(abs)) return null;
    let dirty = false;
    try {
      execFileSync('git', ['diff', '--quiet', 'HEAD', '--', file], { cwd: ROOT, stdio: 'ignore' });
    } catch { dirty = true; }
    const untracked = execFileSync('git', ['ls-files', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim() === '';
    if (dirty || untracked) return null;
    const d = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null;
  } catch {
    return null;
  }
}

export class LastmodStore {
  constructor() {
    this.exists = fs.existsSync(MANIFEST_PATH);
    this.data = this.exists ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) : {};
    this.touched = new Set();
  }

  /**
   * @param {string} key   identifiant stable (chemin d'URL, ex. /blog/jeux-3-joueurs.html)
   * @param {string} hash  empreinte du contenu utile
   * @param {string} [file] fichier source (pour l'amorçage via git)
   */
  get(key, hash, file) {
    const entry = this.data[key];
    this.touched.add(key);
    if (entry && entry.hash === hash) return entry.lastmod;
    let lastmod = today();
    if (!this.exists && !entry && file) lastmod = gitDate(file) || lastmod;
    // Une date ne recule jamais
    if (entry && entry.lastmod > lastmod) lastmod = entry.lastmod;
    this.data[key] = { hash, lastmod };
    return lastmod;
  }

  /** Date déjà connue (sans recalcul), ex. pour le sitemap après generate-blog. */
  peek(key) {
    return this.data[key] ? this.data[key].lastmod : null;
  }

  save() {
    // Relecture : un autre script a pu écrire entre-temps
    let current = {};
    if (fs.existsSync(MANIFEST_PATH)) current = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    for (const key of this.touched) current[key] = this.data[key];
    const sorted = Object.fromEntries(Object.entries(current).sort(([a], [b]) => a.localeCompare(b)));
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  }
}

export function readNormalizedPage(urlPath) {
  const file = urlPath === '/' ? 'index.html' : urlPath.endsWith('/') ? urlPath.slice(1) + 'index.html' : urlPath.slice(1);
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) return null;
  return { file, hash: hashString(normalizeHtmlForHash(fs.readFileSync(abs, 'utf8'))) };
}

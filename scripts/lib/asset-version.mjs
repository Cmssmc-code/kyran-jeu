/**
 * Version des assets statiques (?v=…) : empreinte du contenu des fichiers CSS/JS publics.
 * Change uniquement quand un de ces fichiers change (cache navigateur correctement invalidé,
 * sans suffixes qui s'accumulent à la main).
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const FILES = ['style.css', 'components.js', 'blog-data.js', 'blog.js', 'reviews.js', 'reviews-data.js', 'hero-visual.js'];

export function assetVersion() {
  const h = crypto.createHash('sha1');
  const cssDir = path.join(ROOT, 'css');
  const extra = fs.existsSync(cssDir) ? fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).sort().map(f => 'css/' + f) : [];
  for (const f of [...FILES, ...extra]) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) h.update(f).update(fs.readFileSync(p));
  }
  // seo-config.js : on ignore sa propre constante de version
  const seo = path.join(ROOT, 'seo-config.js');
  if (fs.existsSync(seo)) h.update(fs.readFileSync(seo, 'utf8').replace(/ASSET_VERSION = '[^']*'/, ''));
  return h.digest('hex').slice(0, 10);
}

/** Remplace ?v=… sur les références locales .js/.css d'un HTML. */
export function stampHtml(html, version) {
  return html.replace(/(\.(?:js|css))\?v=[A-Za-z0-9]+/g, `$1?v=${version}`);
}

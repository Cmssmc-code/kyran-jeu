/**
 * Sélection des URL envoyées à IndexNow (scripts/indexnow.mjs).
 * Séparé du script pour être testable sans rien envoyer.
 */
import fs from 'fs';
import path from 'path';
import { SITE } from './site-urls.mjs';

const PRIVATE_PAGES = ['404.html', 'merci.html', 'admin-emails.html'];

/** Fichier du dépôt → URL publique (null si la page n'est pas publique). */
export function fileToUrl(file) {
  if (!file.endsWith('.html')) return null;
  if (/^(scripts|server|worker|\.github|node_modules|css\/)/.test(file)) return null;
  if (PRIVATE_PAGES.includes(file)) return null;
  if (file === 'index.html') return SITE + '/';
  if (file === 'blog/index.html') return SITE + '/blog/';
  return SITE + '/' + file;
}

/** Page de redirection (meta refresh, scripts/generate-redirects.mjs). */
export function isRedirectStub(html) {
  return /<meta\s+http-equiv="refresh"/i.test(html);
}

/**
 * Retire d'une page ce que le build change à chaque déploiement sans toucher au contenu :
 * versions d'assets (`?v=`), politique CSP, horodatage du rendu statique (`data-ssr`).
 */
export function normalizeForDiff(html) {
  return html
    .replace(/\?v=[\w-]+/g, '')
    .replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/gi, '')
    .replace(/\sdata-ssr="[^"]*"/g, '');
}

/**
 * URL à notifier pour une liste de fichiers modifiés. Les pages de redirection sont exclues :
 * l'ancienne URL ne doit pas être présentée comme une page à indexer. Un fichier supprimé
 * est gardé (IndexNow sert aussi à signaler les 404).
 *
 * `readOld(file)` (facultatif) rend la version précédente du fichier, ou null s'il est nouveau :
 * une page dont seules les versions d'assets ont changé n'est pas renvoyée (audit du 14/10/2026 :
 * 153 URL envoyées en 8 h parce que chaque build re-tamponne toutes les pages).
 */
export function urlsForChangedFiles(files, root, readOld = null) {
  const urls = new Set();
  for (const f of files) {
    const u = fileToUrl(f);
    if (!u) continue;
    const abs = path.join(root, f);
    if (fs.existsSync(abs)) {
      const html = fs.readFileSync(abs, 'utf8');
      if (isRedirectStub(html)) continue;
      const old = readOld ? readOld(f) : null;
      if (old != null && normalizeForDiff(old) === normalizeForDiff(html)) continue;
    }
    urls.add(u);
  }
  return [...urls];
}

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
 * URL à notifier pour une liste de fichiers modifiés. Les pages de redirection sont exclues :
 * l'ancienne URL ne doit pas être présentée comme une page à indexer. Un fichier supprimé
 * est gardé (IndexNow sert aussi à signaler les 404).
 */
export function urlsForChangedFiles(files, root) {
  const urls = new Set();
  for (const f of files) {
    const u = fileToUrl(f);
    if (!u) continue;
    const abs = path.join(root, f);
    if (fs.existsSync(abs) && isRedirectStub(fs.readFileSync(abs, 'utf8'))) continue;
    urls.add(u);
  }
  return [...urls];
}

#!/usr/bin/env node
/**
 * Insère (ou met à jour) une Content-Security-Policy en <meta> dans toutes les pages
 * HTML publiques. GitHub Pages ne permet pas d'en-têtes HTTP personnalisés, d'où la
 * balise <meta http-equiv>. À relancer après chaque génération de pages
 * (déjà inclus dans `npm run generate:blog`).
 *
 * Limites connues d'une CSP en <meta> : frame-ancestors, report-uri et sandbox sont
 * ignorés par les navigateurs.
 *
 * 'unsafe-inline' reste nécessaire pour les scripts : plusieurs pages contiennent des
 * scripts et des gestionnaires onclick en ligne. La politique limite néanmoins les
 * origines de scripts, interdit plugins, <base> et soumissions de formulaires externes.
 *
 * admin-emails.html a sa propre politique, plus stricte, et est ignorée ici.
 *
 * Insère aussi, juste après la CSP, le script de remontée d'erreurs (error-reporter.js,
 * pipeline Auto-Heal) : chargé avant tous les autres scripts pour capter leurs erreurs.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
  "media-src 'self'",
  "connect-src 'self' https://kyran-webhook-production.up.railway.app https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests'
].join('; ');

const META = `<meta http-equiv="Content-Security-Policy" content="${CSP}" />`;
const REFERRER = '<meta name="referrer" content="strict-origin-when-cross-origin" />';
const REPORTER_VERSION = crypto
  .createHash('sha1')
  .update(fs.readFileSync(path.join(ROOT, 'error-reporter.js')))
  .digest('hex')
  .slice(0, 10);
const REPORTER = `<script src="/error-reporter.js?v=${REPORTER_VERSION}"></script>`;
const SKIP_DIRS = new Set(['node_modules', '.git', 'server', 'worker', 'scripts', 'email-previews', 'vendor']);
const SKIP_FILES = new Set(['admin-emails.html']);

function* htmlFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* htmlFiles(full);
    } else if (entry.name.endsWith('.html') && !SKIP_FILES.has(entry.name)) {
      yield full;
    }
  }
}

let updated = 0;
let missing = [];
for (const file of htmlFiles(ROOT)) {
  const src = fs.readFileSync(file, 'utf8');
  let out = src.replace(/^[ \t]*<meta http-equiv="Content-Security-Policy"[^>]*>[ \t]*\r?\n/gim, '');
  out = out.replace(/^[ \t]*<meta name="referrer"[^>]*>[ \t]*\r?\n/gim, '');
  out = out.replace(/^[ \t]*<script src="\/error-reporter\.js[^"]*"><\/script>[ \t]*\r?\n/gim, '');
  const charset = out.match(/([ \t]*)<meta charset=["']?utf-8["']?\s*\/?>/i);
  if (!charset) {
    missing.push(path.relative(ROOT, file));
    continue;
  }
  const indent = charset[1];
  out = out.replace(charset[0], `${charset[0]}\n${indent}${META}\n${indent}${REFERRER}\n${indent}${REPORTER}`);
  if (out !== src) {
    fs.writeFileSync(file, out);
    updated++;
  }
}

console.log(`CSP appliquée : ${updated} fichier(s) mis à jour.`);
if (missing.length) {
  console.error(`⚠️ Pas de <meta charset> trouvé dans : ${missing.join(', ')}`);
  process.exit(1);
}

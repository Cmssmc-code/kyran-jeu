/**
 * Génère les pages de redirection (GitHub Pages ne gère ni .htaccess ni _redirects).
 * Chaque ancienne URL devient une page minimale : canonique vers la nouvelle URL,
 * <meta http-equiv="refresh"> instantané (traité comme une redirection permanente par
 * Google et Bing), redirection JavaScript et lien de secours. Ces pages ne figurent pas
 * dans le sitemap.
 *
 * Source : scripts/content/roster.json → "redirects" { "/ancienne.html": "/nouvelle.html#section" }
 * L'ancre facultative envoie le visiteur sur la section qui reprend l'ancien sujet ; la
 * canonique, elle, reste l'URL sans ancre (Google ignore les fragments).
 * Run: node scripts/generate-redirects.mjs
 */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ROSTER } from './lib/article-model.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://kyran-jeu.fr';

function targetExists(target) {
  const clean = target.split('#')[0];
  if (clean === '/') return true;
  if (clean.endsWith('/')) return existsSync(join(ROOT, clean.slice(1), 'index.html'));
  return existsSync(join(ROOT, clean.slice(1)));
}

function stub(target) {
  const abs = SITE + target.split('#')[0];
  // Avec une ancre dans la cible, celle de l'ancienne URL n'a plus de sens
  const js = target.includes('#') ? JSON.stringify(target) : `${JSON.stringify(target)} + location.hash`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Page déplacée — KYRAN</title>
  <meta name="description" content="Cette page a été déplacée vers ${abs}." />
  <link rel="canonical" href="${abs}" />
  <meta http-equiv="refresh" content="0; url=${target}" />
  <script>location.replace(${js});</script>
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
</head>
<body>
  <p>Cette page a été déplacée. <a href="${target}">Continuer vers ${abs}</a>.</p>
</body>
</html>
`;
}

let written = 0;
const missing = [];
for (const [from, to] of Object.entries(ROSTER.redirects)) {
  if (!targetExists(to)) {
    missing.push(`${from} → ${to}`);
    continue;
  }
  const file = join(ROOT, from.slice(1));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, stub(to), 'utf8');
  written++;
}

console.log(`${written} redirection(s) générée(s).`);
if (missing.length) {
  console.error('Cibles introuvables (redirection non générée) :\n  ' + missing.join('\n  '));
  process.exit(1);
}

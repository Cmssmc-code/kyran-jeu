#!/usr/bin/env node
/**
 * Régénère tout ce qui est généré (articles, redirections, données du blog, page communauté,
 * sitemap, llms.txt,
 * plan du site, rendu statique des composants, versions de l’Initiation (ex-Dojo), CSP). À lancer après toute modification de
 * scripts/content/, des composants (components.js, reviews.js) ou des pages.
 */
import { spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));
const steps = [
  'generate-blog.mjs',
  'generate-redirects.mjs',
  'generate-blog-infra.mjs',
  'generate-community.mjs',
  'generate-seo.mjs',
  'prerender.mjs',
  'stamp-dojo.mjs',
  'apply-csp.mjs'
];

for (const step of steps) {
  console.log(`\n▶ ${step}`);
  const res = spawnSync(process.execPath, [join(dir, step)], { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error(`✖ ${step} a échoué (code ${res.status})`);
    process.exit(res.status || 1);
  }
}
console.log('\n✔ Build terminé.');

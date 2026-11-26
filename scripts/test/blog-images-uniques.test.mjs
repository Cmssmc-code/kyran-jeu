import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROSTER, loadAllArticles } from '../lib/article-model.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Regroupe les clés par valeur et rend les valeurs partagées par au moins deux articles. */
function doublons(paires) {
  const parImage = new Map();
  for (const [slug, image] of paires) {
    if (!image) continue;
    parImage.set(image, [...(parImage.get(image) || []), slug]);
  }
  return [...parImage].filter(([, slugs]) => slugs.length > 1).map(([image, slugs]) => `${image} : ${slugs.join(', ')}`);
}

// Règle permanente (Corentin, 26/11/2026) : un article = une image unique, jamais la même sur deux articles.
test('blog : chaque article a une image d’en-tête à lui (sources)', async () => {
  const articles = await loadAllArticles();
  assert.ok(articles.length >= ROSTER.generated.length);
  const partagees = doublons(articles.map(a => [a.slug, a.heroImage]));
  assert.deepEqual(partagees, [], 'Images utilisées par plusieurs articles :\n  ' + partagees.join('\n  '));
  for (const a of articles) {
    assert.ok(existsSync(join(ROOT, a.heroImage)), `${a.slug} : image absente (${a.heroImage})`);
    assert.ok(existsSync(join(ROOT, a.heroImage.replace(/\.jpg$/, '.webp'))), `${a.slug} : variante WebP absente`);
  }
});

test('blog : chaque page d’article publiée a une og:image à elle (pages générées)', () => {
  const dir = join(ROOT, 'blog');
  const paires = [];
  for (const f of readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html')) {
    const m = readFileSync(join(dir, f), 'utf8').match(/property="og:image" content="([^"]+)"/);
    if (m) paires.push([f, m[1]]); // les redirections n’ont pas d’og:image
  }
  assert.ok(paires.length >= 40, 'trop peu de pages d’article lues : ' + paires.length);
  const partagees = doublons(paires);
  assert.deepEqual(partagees, [], 'og:image partagées par plusieurs pages :\n  ' + partagees.join('\n  '));
});

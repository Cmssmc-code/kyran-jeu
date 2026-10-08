import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fileToUrl, isRedirectStub, urlsForChangedFiles } from '../lib/indexnow-urls.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const roster = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'content', 'roster.json'), 'utf8'));

test('fileToUrl : pages publiques seulement', () => {
  assert.equal(fileToUrl('index.html'), 'https://kyran-jeu.fr/');
  assert.equal(fileToUrl('blog/index.html'), 'https://kyran-jeu.fr/blog/');
  assert.equal(fileToUrl('tarot-africain.html'), 'https://kyran-jeu.fr/tarot-africain.html');
  assert.equal(fileToUrl('merci.html'), null);
  assert.equal(fileToUrl('scripts/x.html'), null);
  assert.equal(fileToUrl('style.css'), null);
});

test('les pages de redirection ne sont jamais envoyées à IndexNow', () => {
  const stubs = Object.keys(roster.redirects).map(u => u.slice(1));
  for (const f of stubs) assert.ok(isRedirectStub(fs.readFileSync(path.join(ROOT, f), 'utf8')), `${f} devrait être une redirection`);
  const urls = urlsForChangedFiles([...stubs, 'tarot-africain.html', 'blog/supprime-pour-test.html'], ROOT);
  assert.deepEqual(urls, ['https://kyran-jeu.fr/tarot-africain.html', 'https://kyran-jeu.fr/blog/supprime-pour-test.html']);
});

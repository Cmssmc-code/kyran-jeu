import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');
const read = f => readFileSync(join(ROOT, f), 'utf8');

// Attribution des ventes (docs/VENTES-PASSES.md) : les liens d'achat des pages qui amènent
// le trafic portent ?ref=…, que /commander.html transmet à Stripe en client_reference_id.
// Les deux liens de /tarot-africain.html ont déjà été perdus une fois dans une fusion (19/10).

test('commander.html transmet ref à Stripe en client_reference_id', () => {
  const html = read('commander.html');
  assert.match(html, /URLSearchParams\(window\.location\.search\)\.get\('ref'\)/);
  assert.match(html, /\?client_reference_id=' \+ checkoutRef/);
});

test('tarot-africain.html : liens d\'achat avec ref', () => {
  const html = read('tarot-africain.html');
  for (const ref of ['tarot-africain-materiel', 'tarot-africain-kyran']) {
    assert.ok(html.includes(`href="/commander.html?ref=${ref}"`), `lien ?ref=${ref} absent`);
  }
});

test('articles générés : encarts d\'achat avec ref=blog-<slug>-<endroit>', () => {
  const html = read('blog/jeux-comme-dixit.html');
  for (const place of ['debut', 'fin', 'cote']) {
    assert.ok(html.includes(`href="/commander.html?ref=blog-jeux-comme-dixit-${place}"`), `encart ${place} sans ref`);
  }
});

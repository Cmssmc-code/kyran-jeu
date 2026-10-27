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

test('idee-cadeau.html : boutons d\'achat avec ref', () => {
  const html = read('idee-cadeau.html');
  for (const ref of ['idee-cadeau-haut', 'idee-cadeau-bas']) {
    assert.ok(html.includes(`href="/commander.html?ref=${ref}"`), `lien ?ref=${ref} absent`);
  }
});

// js/livraison.js : délais affichés sur /commander.html et /idee-cadeau.html.
test('js/livraison.js : jours ouvrés, jours fériés et date limite de Noël', async () => {
  const { runInNewContext } = await import('node:vm');
  const ctx = { window: {} };
  runInNewContext(read('js/livraison.js'), ctx);
  const { addBusinessDays, noelPhase } = ctx.window.KyranLivraison;
  const iso = d => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  // Mardi 27 octobre 2026 : 3 jours ouvrés → vendredi 30 ; 6 → mercredi 4 novembre (1er novembre un dimanche).
  assert.equal(iso(addBusinessDays(new Date(2026, 9, 27), 3)), '2026-10-30');
  assert.equal(iso(addBusinessDays(new Date(2026, 9, 27), 6)), '2026-11-4');
  // Mercredi 11 novembre (Armistice) sauté.
  assert.equal(iso(addBusinessDays(new Date(2026, 10, 10), 1)), '2026-11-12');
  // Date limite : une commande du 16 décembre arrive au plus tard le 24.
  assert.equal(iso(addBusinessDays(new Date(2026, 11, 16), 6)), '2026-12-24');
  assert.equal(noelPhase(new Date(2026, 9, 27), [10, 1]), '');
  assert.equal(noelPhase(new Date(2026, 9, 27), [9, 1]), 'avant');
  assert.equal(noelPhase(new Date(2026, 11, 16, 20), [10, 1]), 'avant');
  assert.equal(noelPhase(new Date(2026, 11, 17), [10, 1]), 'apres');
  assert.equal(noelPhase(new Date(2026, 11, 26), [10, 1]), '');
});

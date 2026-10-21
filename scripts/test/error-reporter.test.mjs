import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const SRC = readFileSync(join(import.meta.dirname, '..', '..', 'error-reporter.js'), 'utf8');

/** Charge error-reporter.js dans un faux navigateur ; `head` simule la réponse HEAD du fichier. */
function load(head) {
  const beacons = [], heads = [];
  let onError;
  const window = {
    addEventListener(type, fn) { if (type === 'error') onError = fn; },
    fetch(url, opts) {
      if (opts?.method === 'HEAD') { heads.push(url); return head(); }
      return Promise.resolve({ ok: true });
    }
  };
  window.window = window;
  Object.assign(window, {
    location: { hostname: 'kyran-jeu.fr', pathname: '/commander.html' },
    navigator: { userAgent: 'Mozilla/5.0 Safari', sendBeacon: (_u, blob) => { beacons.push(blob); return true; } },
    document: { currentScript: null, querySelector: () => null },
    Blob: class { constructor(parts) { this.body = parts.join(''); } },
    fetch: window.fetch
  });
  vm.runInNewContext(SRC, window);
  const fire = target => onError({ target });
  const reports = () => beacons.map(b => JSON.parse(b.body));
  return { fire, reports, heads };
}

const tick = () => new Promise(r => setTimeout(r, 0));

test('vidéo : coupure réseau sur un fichier en ligne → aucun incident', async () => {
  const r = load(() => Promise.resolve({ ok: true }));
  r.fire({ tagName: 'SOURCE', src: 'https://kyran-jeu.fr/teaser-kyran.mp4' });
  await tick();
  assert.deepEqual(r.heads, ['https://kyran-jeu.fr/teaser-kyran.mp4']);
  assert.equal(r.reports().length, 0);
});

test('vidéo : fichier vraiment absent (404) → incident', async () => {
  const r = load(() => Promise.resolve({ ok: false, status: 404 }));
  r.fire({ tagName: 'VIDEO', src: 'https://kyran-jeu.fr/absente.mp4' });
  await tick();
  assert.equal(r.reports().length, 1);
  assert.match(r.reports()[0].message, /<video> https:\/\/kyran-jeu\.fr\/absente\.mp4/);
});

test('vidéo : visiteur hors ligne (HEAD en échec) → aucun incident', async () => {
  const r = load(() => Promise.reject(new TypeError('Failed to fetch')));
  r.fire({ tagName: 'SOURCE', src: 'https://kyran-jeu.fr/teaser-kyran.mp4' });
  await tick();
  assert.equal(r.reports().length, 0);
});

test('image ou script en ligne mais coupé par le réseau → aucun incident (JS-B632F4, JS-29AAB2)', async () => {
  const r = load(() => Promise.resolve({ ok: true }));
  r.fire({ tagName: 'IMG', src: 'https://kyran-jeu.fr/logo.png' });
  r.fire({ tagName: 'SCRIPT', src: 'https://kyran-jeu.fr/js/motion.js?v=2db9c31614' });
  await tick();
  assert.deepEqual(r.heads, ['https://kyran-jeu.fr/logo.png', 'https://kyran-jeu.fr/js/motion.js?v=2db9c31614']);
  assert.equal(r.reports().length, 0);
});

test('image vraiment absente (404) → incident', async () => {
  const r = load(() => Promise.resolve({ ok: false, status: 404 }));
  r.fire({ tagName: 'IMG', src: 'https://kyran-jeu.fr/absente.webp' });
  await tick();
  assert.equal(r.reports().length, 1);
  assert.match(r.reports()[0].message, /<img> https:\/\/kyran-jeu\.fr\/absente\.webp/);
});

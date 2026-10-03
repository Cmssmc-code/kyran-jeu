import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isForbiddenEdit, isForbiddenRead, repoPath, redactSecrets, parseVerdict, insertLecon, buildIncidentPrompt
} from '../auto-heal-worker.mjs';

test('périmètre : fichiers sensibles interdits à l\'agent', () => {
  for (const f of ['.github/workflows/ci.yml', 'package.json', 'package-lock.json', '.env', 'server/githubOidc.js',
    'scripts/auto-heal-worker.mjs', '_notes/lecon.md', 'CNAME', 'vendor/x.js', 'worker/wrangler.toml']) {
    assert.equal(isForbiddenEdit(f), true, f);
  }
  for (const f of ['components.js', 'server/server.js', 'server/incidents.js', 'scripts/content/a.mjs', 'regle.html', 'error-reporter.js']) {
    assert.equal(isForbiddenEdit(f), false, f);
  }
  assert.equal(isForbiddenRead('.env'), true);
  assert.equal(isForbiddenRead('worker/.dev.vars'), true);
  assert.equal(isForbiddenRead('.env.example'), false);
});

test('chemins hors dépôt refusés', () => {
  assert.equal(repoPath('../etc/passwd', '/repo'), null);
  assert.equal(repoPath('/components.js', '/repo'), 'components.js');
  assert.equal(repoPath('a/../b.js', '/repo'), 'b.js');
});

test('secrets et emails clients masqués avant envoi au modèle', () => {
  const out = redactSecrets('key sk_live_abc123 whsec_xyz Bearer abc.def client@gmail.com contact@kyran-jeu.fr');
  assert.doesNotMatch(out, /sk_live_abc123|whsec_xyz|abc\.def|client@gmail\.com/);
  assert.match(out, /contact@kyran-jeu\.fr/);
});

test('verdict JSON extrait de la réponse finale', () => {
  const v = parseVerdict('Voici :\n{"status":"fixed","analysis":"a","summary":"s","explanation":"e","lecon":"- x"}');
  assert.equal(v.status, 'fixed');
  assert.equal(parseVerdict('{"status":"maybe"}'), null);
  assert.equal(parseVerdict('pas de json'), null);
});

test('leçon insérée juste après le marqueur', () => {
  const out = insertLecon('# T\n\n<!-- auto-heal:entries -->\n\n### ancien\n', '### nouveau\n\n- a');
  assert.ok(out.indexOf('### nouveau') < out.indexOf('### ancien'));
  assert.equal(insertLecon('sans marqueur', 'x'), null);
});

test('prompt d\'incident compact et sans secret', () => {
  const p = buildIncidentPrompt({
    source: 'client', error_code: 'JS_ERROR', display_code: 'JS-ABC123', http_status: null,
    pages: ['/regle.html'], occurrences: 3, first_seen_at: 'a', last_seen_at: 'b',
    message: 'TypeError token=supersecret', stack: 'at x (https://kyran-jeu.fr/components.js:1:2)',
    details: { file: 'https://kyran-jeu.fr/components.js', browser: 'Chrome', ignored: 'zzz' }
  });
  assert.match(p, /JS-ABC123/);
  assert.match(p, /\/regle\.html/);
  assert.doesNotMatch(p, /supersecret|zzz/);
});

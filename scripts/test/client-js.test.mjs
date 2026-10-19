import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');
const files = [
  ...readdirSync(ROOT).filter(f => f.endsWith('.js')),
  ...readdirSync(join(ROOT, 'js')).filter(f => f.endsWith('.js')).map(f => 'js/' + f),
  ...readdirSync(join(ROOT, 'dojo')).filter(f => f.endsWith('.js')).map(f => 'dojo/' + f)
];

// querySelector(All) lève une SyntaxError sur un navigateur qui ne connaît pas
// :is() / :where() / :has() (Safari < 14, Chrome < 88) et coupe tout le script
// (incident JS-095C84 du 19/10 sur js/motion.js). En CSS ces sélecteurs sont sans risque.
test('scripts du site : aucun sélecteur :is(), :where() ni :has() passé au DOM', () => {
  for (const f of files) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    for (const [i, line] of src.split('\n').entries()) {
      if (/['"`][^'"`]*:(is|where|has)\(/.test(line)) {
        assert.fail(`${f}:${i + 1} : sélecteur moderne dans une chaîne JS : ${line.trim()}`);
      }
    }
  }
});

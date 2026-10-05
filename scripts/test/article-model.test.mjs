import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clipText } from '../lib/article-model.mjs';

test('clipText : texte court rendu tel quel', () => {
  assert.equal(clipText('Une phrase.', 200), 'Une phrase.');
  assert.equal(clipText('', 10), '');
  assert.equal(clipText(undefined, 10), '');
});

test('clipText : coupe sur la dernière fin de phrase avant la limite', () => {
  const s = 'Chaque joueur reçoit deux personnages. N\'importe qui peut contester : si le joueur a menti, il perd une influence.';
  assert.equal(clipText(s, 60), 'Chaque joueur reçoit deux personnages.');
});

test('clipText : sans fin de phrase utilisable, coupe sur un espace avec points de suspension', () => {
  const s = 'Une très longue phrase sans aucun point qui continue encore et encore jusqu\'au bout';
  assert.equal(clipText(s, 30), 'Une très longue phrase sans…');
});

test('clipText : une fin de phrase trop tôt ne vide pas la description', () => {
  const s = 'Oui. ' + 'mot '.repeat(60);
  const out = clipText(s, 100);
  assert.ok(out.length > 40);
  assert.ok(out.endsWith('…'));
});

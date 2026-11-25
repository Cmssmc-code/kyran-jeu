/**
 * « Quel pli gagne ? » (quel-pli-gagne.html) : chaque gagnant est vérifié avec le moteur de
 * l'Initiation (bestPlay de dojo/engine.js), plus les règles de contenu de la page.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bestPlay } from '../../dojo/engine.js';
import { PLIS, posesDuPli, LIEN_ACHAT } from '../../dojo/pli.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const lire = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

test('Quel pli gagne : 3 plis de 4 cartes, gagnant juste selon le moteur', () => {
  assert.equal(PLIS.length, 3);
  for (const pli of PLIS) {
    assert.equal(pli.cartes.length, 4, pli.titre);
    const ids = pli.cartes.map(c => c.id);
    assert.equal(new Set(ids).size, 4, `${pli.titre} : carte en double`);
    for (const c of pli.cartes) if (c.id === 'm') assert.ok(c.valeur === 0 || c.valeur === 37, 'Mystique à 0 ou 37');
    assert.equal(bestPlay(posesDuPli(pli)).order, pli.gagnant, pli.titre);
    assert.ok(pli.regle.length > 20, `${pli.titre} : règle manquante`);
  }
});

test('Quel pli gagne : la Mystique à 0 aurait laissé gagner le 36', () => {
  const pli = PLIS.find(p => p.cartes.some(c => c.id === 'm'));
  const a0 = { ...pli, cartes: pli.cartes.map(c => (c.id === 'm' ? { ...c, valeur: 0 } : c)) };
  assert.equal(posesDuPli(a0)[bestPlay(posesDuPli(a0)).order].card.id, 'n36');
});

test('Quel pli gagne : liens et règles de contenu', () => {
  assert.equal(LIEN_ACHAT, '/commander.html?ref=quel-pli');
  const page = lire('quel-pli-gagne.html')
    .replace(/<kyran-(header|footer)\b[\s\S]*?<\/kyran-\1>/g, '')
    .replace(/<script\b(?![^>]*ld\+json)[\s\S]*?<\/script>/g, '');
  const js = lire('dojo/pli.js');
  assert.match(js, /href: '\/minijeu\.html'/);
  for (const [nom, t] of Object.entries({ 'quel-pli-gagne.html': page, 'dojo/pli.js': js })) {
    for (const mot of [/gratuit/i, /offert/i, /d[ée]mo\b/i, /\bbo[iî]te\b/i, /localStorage/, /fetch\(/]) {
      assert.doesNotMatch(t, mot, `${nom} contient ${mot}`);
    }
    assert.doesNotMatch(t, /(?:\+33|\b0[1-9])(?:[ .]?\d{2}){4}\b/, `${nom} contient un numéro de téléphone`);
    for (const prix of t.match(/\d+,\d{2}\s?€/g) || []) assert.equal(prix.replace(/\s/, ' '), '9,99 €', `${nom} : prix ${prix}`);
  }
});

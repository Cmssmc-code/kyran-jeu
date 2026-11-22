/**
 * Calendrier de l'Avent (avent.html) : chaque défi publié est rejoué par le moteur de l'Initiation
 * (dojo/engine.js) dans tous les ordres possibles, et sa réponse doit être juste. Vérifie aussi que
 * dojo/avent-defis.js est à jour avec _notes/avent/defis.md, l'ouverture des cases à l'heure de
 * Paris et les règles de contenu de la page.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFIS, DEFIS_ECARTES, DEFI_ESSAI, defiDuJour } from '../../dojo/avent-defis.js';
import {
  joursOuverts, caseOuverte, joursAvantOuverture, dateParis, caseAuDepart,
  compteARebours, lienDuDefi, texteDePartage, LIEN_ACHAT, REF_ACHAT
} from '../../dojo/avent.js';
import { validerDonne, resoudre } from '../lib/avent-solver.mjs';
import { lireDefisMd } from '../lib/avent-md.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const lire = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

for (const defi of [DEFI_ESSAI, ...DEFIS]) {
  test(`Avent : défi du jour ${defi.jour} juste selon le moteur`, () => {
    assert.deepEqual(validerDonne(defi), [], 'donne invalide');
    assert.ok(defi.cartes >= 2, 'jamais de manche à 1 carte (Mystique à l’aveugle)');
    const r = resoudre(defi);
    assert.equal(r.auMieux, defi.reponse, `réponse ${defi.reponse}, moteur ${r.auMieux} (fourchette ${r.min} à ${r.max})`);
    assert.ok(defi.explication && defi.explication.length > 20, 'explication manquante');
  });
}

test('Avent : dojo/avent-defis.js à jour avec _notes/avent/defis.md', () => {
  const md = lireDefisMd(lire('_notes/avent/defis.md'));
  assert.ok(md.length > 0);
  const ecartes = new Set(DEFIS_ECARTES.map(e => e.jour));
  for (const d of md) {
    const { controle, ...attendu } = d;
    if (ecartes.has(d.jour)) {
      assert.ok(!DEFIS.some(p => p.jour === d.jour), `jour ${d.jour} écarté mais publié`);
      continue;
    }
    const publie = DEFIS.find(p => p.jour === d.jour);
    assert.ok(publie, `jour ${d.jour} absent : lancer node scripts/avent-import.mjs`);
    assert.deepEqual(JSON.parse(JSON.stringify(publie)), JSON.parse(JSON.stringify(attendu)),
      `jour ${d.jour} différent du .md : lancer node scripts/avent-import.mjs`);
  }
  assert.equal(DEFIS.length + DEFIS_ECARTES.length, md.length);
});

test('Avent : jours uniques de 1 à 24', () => {
  const jours = DEFIS.map(d => d.jour);
  assert.equal(new Set(jours).size, jours.length);
  for (const j of jours) assert.ok(j >= 1 && j <= 24);
  assert.equal(defiDuJour(0), DEFI_ESSAI);
  for (const d of DEFIS) assert.equal(defiDuJour(d.jour), d);
});

test('Avent : ouverture des cases à l’heure de Paris', () => {
  const d = (annee, mois, jour) => ({ annee, mois, jour });
  assert.equal(joursOuverts(d(2026, 11, 30)), 0);
  assert.equal(joursOuverts(d(2026, 12, 1)), 1);
  assert.equal(joursOuverts(d(2026, 12, 13)), 13);
  assert.equal(joursOuverts(d(2026, 12, 24)), 24);
  assert.equal(joursOuverts(d(2026, 12, 31)), 24);
  assert.equal(joursOuverts(d(2027, 1, 5)), 24);
  assert.equal(caseOuverte(5, d(2026, 12, 4)), false);
  assert.equal(caseOuverte(4, d(2026, 12, 4)), true);
  assert.equal(caseOuverte(1, d(2026, 12, 4)), true, 'les cases passées restent ouvertes');
  assert.equal(caseOuverte(25, d(2026, 12, 31)), false);
  assert.equal(joursAvantOuverture(d(2026, 11, 22)), 9);
  assert.equal(joursAvantOuverture(d(2026, 12, 2)), 0);
  assert.equal(caseAuDepart(10, d(2026, 12, 5)), 5, 'un jour futur demandé par ?jour= reste fermé');
  assert.equal(caseAuDepart(3, d(2026, 12, 5)), 3);
  assert.equal(caseAuDepart(NaN, d(2026, 11, 25)), 0);
  // Minuit à Paris = 23 h UTC la veille (heure d'hiver).
  assert.deepEqual(dateParis(new Date(Date.UTC(2026, 10, 30, 22, 59))), d(2026, 11, 30));
  assert.deepEqual(dateParis(new Date(Date.UTC(2026, 10, 30, 23, 0))), d(2026, 12, 1));
  assert.deepEqual(compteARebours(Date.UTC(2026, 10, 29, 23, 0)), { jours: 1, heures: 0, minutes: 0 });
  assert.equal(compteARebours(Date.UTC(2026, 10, 30, 23, 0)), null);
});

test('Avent : partage et lien d’achat', () => {
  assert.equal(REF_ACHAT, 'avent');
  assert.equal(LIEN_ACHAT, '/commander.html?ref=avent');
  assert.equal(lienDuDefi(7), 'https://kyran-jeu.fr/avent.html?jour=7');
  assert.equal(lienDuDefi(0), 'https://kyran-jeu.fr/avent.html');
  assert.match(texteDePartage(3, true), /3 décembre/);
});

test('Avent : règles de contenu (mots interdits, prix, téléphone)', () => {
  const textes = {
    'avent.html': lire('avent.html'),
    'dojo/avent.js': lire('dojo/avent.js'),
    'défis': JSON.stringify([DEFI_ESSAI, ...DEFIS])
  };
  // L'en-tête et le pied communs (pré-rendus par npm run build) ne sont pas propres à la page.
  textes['avent.html'] = textes['avent.html']
    .replace(/<kyran-(header|footer)\b[\s\S]*?<\/kyran-\1>/g, '')
    .replace(/<script\b(?![^>]*ld\+json)[\s\S]*?<\/script>/g, '');
  for (const [nom, t] of Object.entries(textes)) {
    for (const mot of [/gratuit/i, /offert/i, /d[ée]mo\b/i, /\bbo[iî]te\b/i]) {
      assert.doesNotMatch(t, mot, `${nom} contient ${mot}`);
    }
    assert.doesNotMatch(t, /(?:\+33|\b0[1-9])(?:[ .]?\d{2}){4}\b/, `${nom} contient un numéro de téléphone`);
    for (const prix of t.match(/\d+,\d{2}\s?€/g) || []) assert.equal(prix.replace(/\s/, ' '), '9,99 €', `${nom} : prix ${prix}`);
    assert.doesNotMatch(t, /\b2 joueurs\b/, `${nom} : dire « à partir de 3 »`);
  }
});

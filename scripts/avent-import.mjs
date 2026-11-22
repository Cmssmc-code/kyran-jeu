#!/usr/bin/env node
/**
 * Calendrier de l'Avent : régénère dojo/avent-defis.js depuis _notes/avent/defis.md.
 *
 * Chaque défi est vérifié par le moteur (scripts/lib/avent-solver.mjs) : donne valide et réponse
 * égale au nombre de plis « au mieux contre tous ». Un défi faux n'est pas publié : il part dans
 * DEFIS_ECARTES avec la raison, et la commande l'affiche.
 *
 * Usage : node scripts/avent-import.mjs   (puis relire le diff de dojo/avent-defis.js)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { lireDefisMd } from './lib/avent-md.mjs';
import { validerDonne, resoudre } from './lib/avent-solver.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, '_notes', 'avent', 'defis.md');
const CIBLE = path.join(ROOT, 'dojo', 'avent-defis.js');

const defis = lireDefisMd(fs.readFileSync(SOURCE, 'utf8'));
const gardes = [];
const ecartes = [];
for (const d of defis) {
  const erreurs = validerDonne(d);
  let raison = erreurs.length ? 'donne invalide : ' + erreurs.join(' ; ') : null;
  if (!raison) {
    const r = resoudre(d);
    if (r.auMieux !== d.reponse) raison = `réponse ${d.reponse}, moteur ${r.auMieux} (fourchette ${r.min} à ${r.max})`;
  }
  const { controle, ...publie } = d;
  if (raison) {
    ecartes.push({ jour: d.jour, raison });
    console.error(`Jour ${d.jour} écarté : ${raison}`);
  } else gardes.push(publie);
}

// Un défi par bloc, une main par ligne : diff lisible quand le game designer change une donne.
const str = s => JSON.stringify(s);
const defiJs = d => '  {\n'
  + Object.entries(d).map(([k, v]) => k === 'mains'
    ? '    mains: {\n' + Object.entries(v).map(([pid, ids]) => `      '${pid}': [${ids.map(i => `'${i}'`).join(', ')}]`).join(',\n') + '\n    }'
    : `    ${k}: ${typeof v === 'string' ? str(v) : v}`).join(',\n')
  + '\n  }';
const js = liste => liste.length ? '[\n' + liste.map(defiJs).join(',\n') + '\n]' : '[]';
const cible = fs.readFileSync(CIBLE, 'utf8');
const debut = cible.indexOf('// <defis:debut>');
const fin = cible.indexOf('// <defis:fin>');
if (debut < 0 || fin < 0) throw new Error('Repères <defis:debut> / <defis:fin> absents de dojo/avent-defis.js');
const bloc = '// <defis:debut> (généré par scripts/avent-import.mjs depuis _notes/avent/defis.md)\n'
  + 'export const DEFIS = ' + js(gardes) + ';\n\n'
  + '/** Défis de _notes/avent/defis.md refusés par le moteur (non publiés). */\n'
  + 'export const DEFIS_ECARTES = ' + js(ecartes) + ';\n';
fs.writeFileSync(CIBLE, cible.slice(0, debut) + bloc + cible.slice(fin));
console.log(`${gardes.length} défi(s) publiés, ${ecartes.length} écarté(s).`);

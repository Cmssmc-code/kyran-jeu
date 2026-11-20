#!/usr/bin/env node
/**
 * Copie le moteur de l'Initiation (dojo/engine.js, dojo/ai.js) dans server/moteur/ pour le
 * serveur de parties entre amis. Raison : Railway déploie la racine /server, donc ../dojo
 * n'existe pas dans le serveur déployé. Les ?v=… des imports (posés par stamp-dojo.mjs pour
 * le navigateur) sont retirés. Les fichiers générés sont vérifiés par la CI comme les autres
 * (étape « Les fichiers générés sont à jour »). Idempotent : inclus dans `npm run build`.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readLf } from './lib/lf.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = ['engine.js', 'ai.js'];
const HEADER = '// Copie générée par scripts/sync-moteur.mjs depuis dojo/%NAME% : ne pas modifier ici.\n';

/** Texte d'un fichier du moteur tel qu'il doit être dans server/moteur/. */
export function moteurPour(name, source) {
  return HEADER.replace('%NAME%', name) + source.replace(/(from\s+'\.\/[\w-]+\.js)\?v=\w+(')/g, '$1$2');
}

export function syncMoteur() {
  const dir = path.join(ROOT, 'server', 'moteur');
  fs.mkdirSync(dir, { recursive: true });
  let changed = 0;
  for (const name of SRC) {
    const out = moteurPour(name, readLf(path.join(ROOT, 'dojo', name)));
    const dest = path.join(dir, name);
    if (!fs.existsSync(dest) || readLf(dest) !== out) {
      fs.writeFileSync(dest, out);
      changed++;
    }
  }
  // Grille des tarifs (js/tarifs.js), lue aussi par le serveur : une seule source.
  const tarifs = HEADER.replace('%NAME%', 'tarifs.js').replace('dojo/', 'js/') + readLf(path.join(ROOT, 'js', 'tarifs.js'));
  const tarifsDest = path.join(ROOT, 'server', 'tarifs.js');
  if (!fs.existsSync(tarifsDest) || readLf(tarifsDest) !== tarifs) {
    fs.writeFileSync(tarifsDest, tarifs);
    changed++;
  }
  return changed;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Moteur du serveur synchronisé : ${syncMoteur()} fichier(s) mis à jour.`);
}

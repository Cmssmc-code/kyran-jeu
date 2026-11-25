#!/usr/bin/env node
/**
 * Versionne les fichiers du Dojo (minijeu.html) par empreinte de contenu, pour que les
 * navigateurs ne mélangent jamais deux versions des modules après une mise en ligne.
 *
 * Les imports entre modules (`from './engine.js?v=…'`) sont réécrits dans l'ordre des
 * dépendances, puis minijeu.html et avent.html (calendrier de l'Avent) reçoivent
 * les empreintes de dojo/*.js et de leur feuille de style (dojo/dojo.css, dojo/avent.css). La feuille de style
 * vit dans dojo/ et non dans css/ : sinon elle changerait la version de tout le site
 * (scripts/lib/asset-version.mjs).
 * Idempotent : inclus dans `npm run build`.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { readLf, toLf } from './lib/lf.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Ordre des dépendances : un module n'importe que des modules situés avant lui.
const MODULES = ['engine.js', 'lessons.js', 'ai.js', 'ui-state.js', 'app.js', 'avent-defis.js', 'avent.js', 'pli.js'];
const FEUILLES = ['dojo.css', 'avent.css', 'pli.css'];
const PAGES = ['minijeu.html', 'avent.html', 'quel-pli-gagne.html'];
// Empreinte calculée sur le texte en LF : même résultat sous Windows (CRLF) et sur la CI.
const hash = text => crypto.createHash('sha1').update(toLf(text)).digest('hex').slice(0, 10);

const versions = {};
let changed = 0;
for (const name of MODULES) {
  const file = path.join(ROOT, 'dojo', name);
  const src = fs.readFileSync(file, 'utf8');
  const out = src.replace(/(from\s+'\.\/)([\w-]+\.js)(\?v=[\w]+)?(')/g, (m, a, dep, _v, b) => {
    if (!versions[dep]) throw new Error(`${name} importe ${dep}, absent ou placé après lui dans MODULES`);
    return `${a}${dep}?v=${versions[dep]}${b}`;
  });
  if (out !== src) { fs.writeFileSync(file, out); changed++; }
  versions[name] = hash(out);
}
for (const css of FEUILLES) versions[css] = hash(readLf(path.join(ROOT, 'dojo', css)));

for (const nom of PAGES) {
  const page = path.join(ROOT, nom);
  const html = fs.readFileSync(page, 'utf8');
  const stamped = html.replace(/(\/dojo\/)([\w-]+\.(?:js|css))\?v=[\w]+/g, (m, dir, name) => {
    if (!versions[name]) throw new Error(`${nom} référence un fichier du Dojo inconnu : ${name}`);
    return `${dir}${name}?v=${versions[name]}`;
  });
  if (stamped !== html) { fs.writeFileSync(page, stamped); changed++; }
}
console.log(`Dojo versionné : ${changed} fichier(s) mis à jour.`);

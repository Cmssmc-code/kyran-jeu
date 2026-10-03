#!/usr/bin/env node
/**
 * Versionne les fichiers du Dojo (minijeu.html) par empreinte de contenu, pour que les
 * navigateurs ne mélangent jamais deux versions des modules après une mise en ligne.
 *
 * Les imports entre modules (`from './engine.js?v=…'`) sont réécrits dans l'ordre des
 * dépendances, puis minijeu.html reçoit les empreintes de dojo/*.js et dojo/dojo.css. La feuille de style
 * vit dans dojo/ et non dans css/ : sinon elle changerait la version de tout le site
 * (scripts/lib/asset-version.mjs).
 * Idempotent : inclus dans `npm run build`.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Ordre des dépendances : un module n'importe que des modules situés avant lui.
const MODULES = ['engine.js', 'lessons.js', 'ai.js', 'app.js'];
const hash = text => crypto.createHash('sha1').update(text).digest('hex').slice(0, 10);

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
versions['dojo.css'] = hash(fs.readFileSync(path.join(ROOT, 'dojo', 'dojo.css'), 'utf8'));

const page = path.join(ROOT, 'minijeu.html');
const html = fs.readFileSync(page, 'utf8');
const stamped = html
  .replace(/(\/dojo\/)([\w-]+\.js)\?v=[\w]+/g, (m, dir, name) => {
    if (!versions[name]) throw new Error(`minijeu.html référence un module inconnu : ${name}`);
    return `${dir}${name}?v=${versions[name]}`;
  })
  .replace(/(\/dojo\/dojo\.css)\?v=[\w]+/g, `$1?v=${versions['dojo.css']}`);
if (stamped !== html) { fs.writeFileSync(page, stamped); changed++; }
console.log(`Dojo versionné : ${changed} fichier(s) mis à jour.`);

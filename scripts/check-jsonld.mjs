#!/usr/bin/env node
/**
 * Contrôle CI : tous les blocs <script type="application/ld+json"> des pages HTML doivent
 * être du JSON valide, avec @context schema.org, et aucune balise HTML ne doit s'y glisser
 * (régression d'octobre 2026 : une balise <meta> collée dans le JSON-LD de l'accueil avait
 * invalidé tout le graphe structuré).
 *
 * Contrôle aussi que les @id référencés ({"@id": "..."}) existent dans le même document
 * ou font partie des identifiants globaux du site.
 *
 * Usage : node scripts/check-jsonld.mjs [dossier-racine]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const SKIP_DIRS = new Set(['node_modules', '.git', 'scripts', 'server', 'worker', 'email-previews', 'vendor', '_site']);
const GLOBAL_IDS = new Set([
  'https://kyran-jeu.fr/#organization',
  'https://kyran-jeu.fr/#website',
  'https://kyran-jeu.fr/#boardgame',
  'https://kyran-jeu.fr/a-propos.html#corentin-sence'
]);

function* htmlFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* htmlFiles(full);
    } else if (entry.name.endsWith('.html')) yield full;
  }
}

function collectIds(node, ids, refs) {
  if (Array.isArray(node)) return node.forEach(n => collectIds(n, ids, refs));
  if (!node || typeof node !== 'object') return;
  const keys = Object.keys(node);
  if (node['@id']) {
    if (keys.length === 1) refs.add(node['@id']);
    else ids.add(node['@id']);
  }
  for (const k of keys) collectIds(node[k], ids, refs);
}

const problems = [];
let blocks = 0;
let files = 0;
for (const file of htmlFiles(root)) {
  files++;
  const rel = path.relative(root, file);
  const src = fs.readFileSync(file, 'utf8');
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  const ids = new Set();
  const refs = new Set();
  let m;
  while ((m = re.exec(src))) {
    blocks++;
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (e) {
      problems.push(`${rel}: JSON-LD invalide — ${e.message}`);
      continue;
    }
    if (/<\/?(meta|link|div|span|p|br)\b/i.test(m[1].replace(/"[^"]*"/g, ''))) {
      problems.push(`${rel}: balise HTML à l'intérieur du JSON-LD`);
    }
    const ctx = data['@context'];
    if (!ctx || !String(Array.isArray(ctx) ? ctx[0] : ctx).includes('schema.org')) {
      problems.push(`${rel}: @context schema.org manquant`);
    }
    collectIds(data, ids, refs);
  }
  for (const r of refs) {
    if (!ids.has(r) && !GLOBAL_IDS.has(r)) problems.push(`${rel}: référence @id sans définition : ${r}`);
  }
}

console.log(`JSON-LD : ${blocks} bloc(s) contrôlé(s) dans ${files} page(s).`);
if (problems.length) {
  console.error('Problèmes :\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log('OK');

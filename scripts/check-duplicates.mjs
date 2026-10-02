#!/usr/bin/env node
/**
 * Détecte le contenu dupliqué entre pages HTML publiées (texte du <main> uniquement :
 * l'en-tête, le pied de page et les composants communs sont ignorés).
 *
 * Mesure : recouvrement de séquences de 7 mots entre deux pages, rapporté à la plus petite.
 * Erreur au-delà de 20 %, avertissement au-delà de 10 %.
 *
 * Usage : node scripts/check-duplicates.mjs [--all]   (par défaut : pages du blog)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const all = process.argv.includes('--all');
const SHINGLE = 7;
const WARN = 0.10;
const ERR = 0.20;

function candidates() {
  const files = fs.readdirSync(path.join(root, 'blog')).filter(f => f.endsWith('.html') && f !== 'index.html').map(f => 'blog/' + f);
  if (all) {
    for (const f of fs.readdirSync(root)) {
      if (f.endsWith('.html') && !['404.html', 'merci.html', 'admin-emails.html', 'plan-du-site.html', 'mentions-legales.html', 'cgv.html', 'confidentialite.html'].includes(f)) files.push(f);
    }
  }
  return files;
}

function mainText(file) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  if (/<meta http-equiv="refresh"/.test(html)) return null;
  const $ = cheerio.load(html);
  $('script, style, nav, kyran-header, kyran-footer, kyran-cta-band, kyran-related-articles, .article-cross-links, .article-share-bar, .article-sidebar, .blog-jump-nav').remove();
  return $('main').text().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

const docs = [];
for (const f of candidates()) {
  const t = mainText(f);
  if (!t) continue;
  const w = t.split(' ');
  const set = new Set();
  for (let i = 0; i + SHINGLE <= w.length; i++) set.add(w.slice(i, i + SHINGLE).join(' '));
  docs.push({ file: f, words: w.length, set });
}

const errors = [];
const warns = [];
for (let i = 0; i < docs.length; i++) {
  for (let j = i + 1; j < docs.length; j++) {
    const a = docs[i];
    const b = docs[j];
    let inter = 0;
    const [small, large] = a.set.size <= b.set.size ? [a.set, b.set] : [b.set, a.set];
    for (const s of small) if (large.has(s)) inter++;
    const ratio = inter / Math.max(1, small.size);
    const msg = `${a.file} ↔ ${b.file} : ${(ratio * 100).toFixed(1)} %`;
    if (ratio > ERR) errors.push(msg);
    else if (ratio > WARN) warns.push(msg);
  }
}

console.log(`${docs.length} page(s) comparées.`);
if (warns.length) console.log('Avertissements (>10 %) :\n  ' + warns.join('\n  '));
if (errors.length) {
  console.error('Doublons (>20 %) :\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log('OK');

#!/usr/bin/env node
/**
 * Notifie IndexNow (Bing, Yandex, Seznam, Naver…) des URLs nouvelles ou modifiées.
 * Bing alimente Copilot et une partie de ChatGPT : c'est le levier GEO le plus direct.
 *
 * La clé est le nom du fichier `<clé>.txt` publié à la racine du site (32 caractères hexa) ;
 * elle est publique par conception (le protocole l'exige).
 *
 * Usage :
 *   node scripts/indexnow.mjs --all                 toutes les URLs du sitemap
 *   node scripts/indexnow.mjs --changed <base> <head>   URLs des pages modifiées entre deux commits
 *   options : --dry-run (n'envoie rien), --wait (attend que la clé soit en ligne, pour la CI)
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://kyran-jeu.fr';
const HOST = 'kyran-jeu.fr';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS = 10000;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const wait = args.includes('--wait');

function findKey() {
  const files = fs.readdirSync(ROOT).filter(f => /^[a-f0-9]{32}\.txt$/.test(f));
  if (files.length !== 1) throw new Error(`Une seule clé IndexNow attendue à la racine, trouvé : ${files.join(', ') || 'aucune'}`);
  const key = files[0].replace(/\.txt$/, '');
  if (fs.readFileSync(path.join(ROOT, files[0]), 'utf8').trim() !== key) {
    throw new Error(`Le contenu de ${files[0]} doit être exactement la clé.`);
  }
  return key;
}

function sitemapUrls() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
}

/** Fichier du dépôt → URL publique (null si la page n'est pas publique). */
export function fileToUrl(file) {
  if (!file.endsWith('.html')) return null;
  if (/^(scripts|server|worker|\.github|node_modules|css\/)/.test(file)) return null;
  if (['404.html', 'merci.html', 'admin-emails.html'].includes(file)) return null;
  if (file === 'index.html') return SITE + '/';
  if (file === 'blog/index.html') return SITE + '/blog/';
  return SITE + '/' + file;
}

function changedUrls(base, head) {
  if (!base || /^0+$/.test(base)) return sitemapUrls();
  const out = execFileSync('git', ['diff', '--name-only', '--diff-filter=ACMRD', base, head], { cwd: ROOT, encoding: 'utf8' });
  const urls = new Set();
  for (const f of out.split('\n').filter(Boolean)) {
    const u = fileToUrl(f);
    if (u) urls.add(u);
  }
  return [...urls];
}

async function waitForKey(key) {
  const url = `${SITE}/${key}.txt`;
  for (let i = 1; i <= 30; i++) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok && (await res.text()).trim() === key) {
        console.log(`Clé en ligne (${url}).`);
        return true;
      }
    } catch { /* réessayer */ }
    console.log(`Clé pas encore publiée (essai ${i}/30)…`);
    await new Promise(r => setTimeout(r, 20000));
  }
  return false;
}

const key = findKey();
let urls;
if (args.includes('--changed')) {
  const i = args.indexOf('--changed');
  urls = changedUrls(args[i + 1], args[i + 2] || 'HEAD');
} else {
  urls = sitemapUrls();
}
urls = [...new Set(urls)].slice(0, MAX_URLS);

if (!urls.length) {
  console.log('Aucune URL publique modifiée : rien à envoyer à IndexNow.');
  process.exit(0);
}

const payload = { host: HOST, key, keyLocation: `${SITE}/${key}.txt`, urlList: urls };
console.log(`IndexNow : ${urls.length} URL(s)`);
for (const u of urls.slice(0, 20)) console.log('  ' + u);
if (urls.length > 20) console.log(`  … et ${urls.length - 20} autre(s)`);

if (dryRun) {
  console.log('--dry-run : aucun envoi.');
  process.exit(0);
}

if (wait && !(await waitForKey(key))) {
  console.error('La clé IndexNow n\'est pas accessible sur le site en production : envoi annulé.');
  process.exit(1);
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload)
});
const body = await res.text();
console.log(`Réponse IndexNow : HTTP ${res.status} ${body.slice(0, 200)}`);
// 200 = accepté, 202 = reçu (validation de la clé en cours)
if (![200, 202].includes(res.status)) process.exit(1);

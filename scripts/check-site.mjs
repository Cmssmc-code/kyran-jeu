#!/usr/bin/env node
/**
 * Contrôles de cohérence du site (CI) : métadonnées, canoniques, liens internes, sitemap,
 * redirections, images, robots.txt, llms.txt, clé IndexNow.
 * Code de sortie 1 en cas d'erreur ; les avertissements ne bloquent pas.
 *
 * Usage : node scripts/check-site.mjs [dossier-racine]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const root = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const SITE = 'https://kyran-jeu.fr';
const SKIP_DIRS = new Set(['node_modules', '.git', 'scripts', 'server', 'worker', 'email-previews', 'vendor', '_site']);
const SKIP_FILES = new Set(['admin-emails.html']);
const LEGAL = ['/mentions-legales.html', '/cgv.html', '/confidentialite.html', '/plan-du-site.html'];

const errors = [];
const warns = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warns.push(`${f}: ${m}`);

function* htmlFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* htmlFiles(full);
    } else if (entry.name.endsWith('.html') && !SKIP_FILES.has(entry.name)) yield full;
  }
}

function urlPathOf(rel) {
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
}

const roster = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'content', 'roster.json'), 'utf8'));
const redirectSources = new Set(Object.keys(roster.redirects));

// ── Pages ──────────────────────────────────────────────────────────────────
const pages = new Map();
for (const file of htmlFiles(root)) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html);
  const isStub = $('meta[http-equiv="refresh"]').length > 0;
  const robots = ($('meta[name="robots"]').attr('content') || '').toLowerCase();
  pages.set(urlPathOf(rel), { rel, $, html, isStub, noindex: robots.includes('noindex') });
}

const titles = new Map();
const descs = new Map();
for (const [urlPath, p] of pages) {
  const { rel, $, isStub, noindex } = p;

  if (redirectSources.has(urlPath) && !isStub) err(rel, 'devrait être une page de redirection (roster.redirects)');
  if (isStub) {
    const target = $('meta[http-equiv="refresh"]').attr('content').split('url=')[1];
    const [targetPath, anchor] = target.split('#');
    const canon = $('link[rel="canonical"]').attr('href');
    if (canon !== SITE + targetPath) err(rel, `canonique de redirection incohérente (${canon} ≠ ${SITE + targetPath})`);
    // L'ancre visée doit exister sur la page cible (sinon le visiteur arrive en haut de page)
    const dest = pages.get(targetPath);
    if (!dest) err(rel, `cible de redirection introuvable : ${targetPath}`);
    else if (dest.isStub) err(rel, `redirection en chaîne vers ${targetPath}`);
    else if (anchor && !dest.$(`[id="${anchor}"]`).length) err(rel, `ancre #${anchor} absente de ${targetPath}`);
    continue;
  }

  const title = $('title').text().trim();
  const desc = ($('meta[name="description"]').attr('content') || '').trim();
  const canonical = $('link[rel="canonical"]').attr('href');
  const h1s = $('h1').length;

  if (rel === '404.html') {
    if (canonical) err(rel, 'la page 404 ne doit pas avoir de canonique');
  } else if (!noindex) {
    const expected = SITE + urlPath;
    if (canonical !== expected) err(rel, `canonique ${canonical || '(absente)'} ≠ ${expected}`);
    if (!title) err(rel, '<title> manquant');
    else {
      if (title.length > 70) err(rel, `<title> trop long (${title.length})`);
      else if (title.length > 62) warn(rel, `<title> long (${title.length})`);
      if (titles.has(title)) err(rel, `<title> identique à ${titles.get(title)}`);
      titles.set(title, rel);
    }
    if (!desc) err(rel, 'meta description manquante');
    else {
      if (desc.length < 70 || desc.length > 175) warn(rel, `meta description ${desc.length} caractères`);
      if (descs.has(desc)) err(rel, `meta description identique à ${descs.get(desc)}`);
      descs.set(desc, rel);
    }
    if (h1s !== 1) err(rel, `${h1s} balise(s) <h1> (1 attendue)`);
    if (!$('meta[property="og:title"]').attr('content')) warn(rel, 'og:title manquant');
    if (!$('meta[property="og:image"]').attr('content')) warn(rel, 'og:image manquant');
  }

  // Liens internes
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href || /^(https?:|mailto:|tel:|#|javascript:|data:)/.test(href)) return;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) return;
    const abs = clean.startsWith('/') ? clean : '/' + path.posix.normalize(path.posix.join(path.posix.dirname('/' + rel), clean));
    if (abs === '/index.html' || abs === '/blog/index.html') err(rel, `lien vers ${href} (utiliser ${abs === '/index.html' ? '/' : '/blog/'})`);
    if (redirectSources.has(abs)) err(rel, `lien vers une page redirigée : ${href}`);
    const file = abs.endsWith('/') ? path.join(root, abs, 'index.html') : path.join(root, abs);
    if (!fs.existsSync(file)) err(rel, `lien interne cassé : ${href}`);
  });

  // Images
  $('img').each((_, el) => {
    const src = $(el).attr('src') || '';
    if ($(el).attr('alt') === undefined) err(rel, `<img> sans alt : ${src}`);
    if (!$(el).attr('width') || !$(el).attr('height')) warn(rel, `<img> sans width/height : ${src}`);
    if (/^\/?[^:]*\.(?:jpg|jpeg|png|webp|gif|svg)$/i.test(src) && !src.startsWith('http')) {
      const f = path.join(root, src.startsWith('/') ? src : path.join(path.dirname(rel), src));
      if (!fs.existsSync(f)) err(rel, `image introuvable : ${src}`);
    }
  });
}

// ── Sitemap ────────────────────────────────────────────────────────────────
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]);
const seen = new Set();
const todayIso = new Date().toISOString().slice(0, 10);
for (const loc of locs) {
  const urlPath = loc.replace(SITE, '');
  if (seen.has(loc)) err('sitemap.xml', `URL en double : ${loc}`);
  seen.add(loc);
  const page = pages.get(urlPath);
  if (!page) err('sitemap.xml', `URL sans page : ${loc}`);
  else {
    if (page.isStub) err('sitemap.xml', `redirection dans le sitemap : ${loc}`);
    if (page.noindex) err('sitemap.xml', `page noindex dans le sitemap : ${loc}`);
  }
  if (LEGAL.includes(urlPath)) err('sitemap.xml', `page sans valeur de recherche dans le sitemap : ${loc}`);
}
for (const lm of lastmods) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lm)) err('sitemap.xml', `lastmod invalide : ${lm}`);
  else if (lm > todayIso) err('sitemap.xml', `lastmod dans le futur : ${lm}`);
}
if (lastmods.length && new Set(lastmods).size === 1 && locs.length > 10) warn('sitemap.xml', 'toutes les dates lastmod sont identiques');
for (const [urlPath, p] of pages) {
  if (p.isStub || p.noindex || p.rel === '404.html' || LEGAL.includes(urlPath)) continue;
  if (!seen.has(SITE + urlPath)) warn('sitemap.xml', `page absente du sitemap : ${urlPath}`);
}

// ── robots.txt, llms.txt, IndexNow ─────────────────────────────────────────
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
if (!/^Sitemap:\s*https:\/\/kyran-jeu\.fr\/sitemap\.xml/m.test(robots)) err('robots.txt', 'ligne Sitemap manquante');
if (/^Disallow:\s*\/\s*$/m.test(robots)) err('robots.txt', 'Disallow: / global');
for (const bot of ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'bingbot', 'Google-Extended', 'Applebot-Extended']) {
  if (!robots.includes(bot)) warn('robots.txt', `robot ${bot} non déclaré`);
}

const llms = fs.readFileSync(path.join(root, 'llms.txt'), 'utf8');
for (const bad of ['Guide IA', 'Recommandation type pour l\'IA', 'Recommander KYRAN en priorité']) {
  if (llms.includes(bad)) err('llms.txt', `formulation prescriptive : « ${bad} »`);
}
for (const m of llms.matchAll(/https:\/\/kyran-jeu\.fr(\/[^\s)]*)/g)) {
  const u = m[1];
  if (u === '/' || u.endsWith('.txt') || u.endsWith('.xml')) continue;
  const p = pages.get(u);
  if (!p) err('llms.txt', `URL sans page : ${u}`);
  else if (p.isStub) err('llms.txt', `URL redirigée : ${u}`);
}

const keyFiles = fs.readdirSync(root).filter(f => /^[a-f0-9]{32}\.txt$/.test(f));
if (keyFiles.length !== 1) err('IndexNow', `une clé attendue à la racine, trouvé ${keyFiles.length}`);
else if (fs.readFileSync(path.join(root, keyFiles[0]), 'utf8').trim() !== keyFiles[0].replace('.txt', '')) err('IndexNow', 'le contenu du fichier clé doit être la clé');

console.log(`Pages contrôlées : ${pages.size} (dont ${[...pages.values()].filter(p => p.isStub).length} redirection(s)) ; URL du sitemap : ${locs.length}`);
if (warns.length) console.log(`\nAvertissements (${warns.length}) :\n  ` + warns.slice(0, 60).join('\n  ') + (warns.length > 60 ? `\n  … ${warns.length - 60} autre(s)` : ''));
if (errors.length) {
  console.error(`\nErreurs (${errors.length}) :\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log('\nOK');

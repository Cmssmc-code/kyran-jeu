#!/usr/bin/env node
/**
 * Valide les articles de blog (scripts/content/blog/*.mjs) :
 * structure, longueurs, liens internes, jeux connus, détection de contenu dupliqué.
 *
 * Usage : node scripts/validate-articles.mjs [slug ...]   (sans argument : tous les fichiers présents)
 * Code de sortie 1 si une erreur est trouvée (les avertissements ne bloquent pas).
 */
import { readdirSync } from 'fs';
import {
  BLOG_DIR, ROSTER, GAMES, BRIEFS, loadRawArticle, articleText, stripHtml, wordCount
} from './lib/article-model.mjs';

const CATEGORIES = ['Apéro', 'Famille', 'Cadeaux', 'Alternatives', 'Cartes', 'Soirée'];
const BANNED = [
  'dans le cadre de notre sélection', 'pour conclure sur', 'testés en conditions réelles',
  'testé en conditions réelles', 'nous avons testé', 'nous avons joué', 'incontournable',
  'véritable pépite', 'sans conteste'
];
const KYRAN_WRONG = ['voler un pli', "inverser l'ordre", 'forcer une couleur', 'inverser l’ordre', 'points de victoire'];
const SHINGLE = 6;
const WARN_OVERLAP = 0.05;
const ERROR_OVERLAP = 0.10;

const knownPages = new Set(ROSTER.pages);
const articleSlugs = new Set([...ROSTER.generated, ...ROSTER.handwritten]);
const redirectSources = new Set(Object.keys(ROSTER.redirects));

function norm(s) {
  return stripHtml(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function sentences(text) {
  return text.split(/(?<=[.!?…])\s+|\n+/).map(norm).filter(s => s.split(' ').length >= 8);
}

function shingles(text) {
  const w = norm(text).split(' ');
  const set = new Set();
  for (let i = 0; i + SHINGLE <= w.length; i++) set.add(w.slice(i, i + SHINGLE).join(' '));
  return set;
}

function htmlFields(a) {
  const f = [['intro', a.intro], ['criteria', a.criteria && a.criteria.html], ['verdict', a.verdict && a.verdict.html], ['conclusion', a.conclusion], ['guideLinks', a.guideLinks]];
  (a.games || []).forEach((g, i) => (g.paragraphs || []).forEach((p, j) => f.push([`games[${i}].paragraphs[${j}]`, p])));
  (a.extraSections || []).forEach((s, i) => f.push([`extraSections[${i}]`, s.html]));
  (a.faq || []).forEach((q, i) => f.push([`faq[${i}].a`, q.a]));
  return f.filter(([, v]) => v);
}

function validate(slug, a, errors, warns, cache) {
  const err = m => errors.push(`${slug}: ${m}`);
  const warn = m => warns.push(`${slug}: ${m}`);
  const brief = BRIEFS.find(b => b.slug === slug) || {};

  if (a.slug !== slug) err(`slug « ${a.slug} » ≠ nom de fichier`);
  for (const k of ['title', 'shortTitle', 'metaTitle', 'description', 'category', 'date', 'heroTitle', 'heroSubtitle', 'heroImage', 'heroCaption', 'intro', 'conclusion']) {
    if (!a[k]) err(`champ « ${k} » manquant`);
  }
  if (!CATEGORIES.includes(a.category)) err(`catégorie invalide : ${a.category}`);
  if (a.shortTitle && a.shortTitle.length > 32) err(`shortTitle > 32 caractères (${a.shortTitle.length})`);
  if (a.metaTitle && (a.metaTitle.length < 35 || a.metaTitle.length > 66)) err(`metaTitle ${a.metaTitle.length} caractères (35–66)`);
  if (a.metaTitle && /officiel/i.test(a.metaTitle)) err('metaTitle contient « officiel »');
  if (a.description && (a.description.length < 100 || a.description.length > 165)) err(`description ${a.description.length} caractères (100–165)`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date || '')) err('date invalide (AAAA-MM-JJ)');
  if (brief.date && a.date !== brief.date) warn(`date ${a.date} ≠ brief ${brief.date}`);
  if (a.heroImage && !/^\/(blog\/images\/[\w-]+\.jpg|[\w-]+\.(png|jpg|webp))$/.test(a.heroImage)) warn(`heroImage inhabituelle : ${a.heroImage}`);

  const introW = wordCount(a.intro);
  if (introW < 70 || introW > 200) err(`intro ${introW} mots (70–200)`);
  if (!a.criteria || !a.criteria.heading || !a.criteria.html) err('criteria.heading / criteria.html manquants');
  else {
    const w = wordCount(a.criteria.html);
    if (w < 300) err(`criteria ${w} mots (≥ 300)`);
  }
  if (!a.verdict || !a.verdict.html) err('verdict.html manquant');
  else {
    const w = wordCount(a.verdict.html);
    if (w < 60 || w > 170) err(`verdict ${w} mots (60–170)`);
  }
  const concW = wordCount(a.conclusion);
  if (concW < 35 || concW > 140) err(`conclusion ${concW} mots (35–140)`);

  const games = a.games || [];
  if (games.length < 5 || games.length > 10) err(`${games.length} jeux (5–10)`);
  const seen = new Set();
  let kyranCount = 0;
  games.forEach((g, i) => {
    const at = `games[${i}] (${g.id})`;
    if (g.id === 'kyran') kyranCount++;
    else if (!GAMES[g.id]) err(`${at}: id inconnu`);
    if (seen.has(g.id)) err(`${at}: jeu en double`);
    seen.add(g.id);
    if (!g.type || g.type.length > 24) err(`${at}: type manquant ou > 24 caractères`);
    if (!g.pick || g.pick.split(/\s+/).length > 14) err(`${at}: pick manquant ou > 14 mots`);
    const ps = g.paragraphs || [];
    if (ps.length < 2 || ps.length > 3) err(`${at}: ${ps.length} paragraphes (2–3)`);
    ps.forEach((p, j) => {
      const w = wordCount(p);
      if (w < 38 || w > 125) err(`${at} paragraphe ${j + 1}: ${w} mots (38–125)`);
    });
  });
  if (kyranCount > 1) err('KYRAN présent plusieurs fois');
  if (kyranCount === 0 && brief.kyran === 'include') err('fiche KYRAN manquante (brief : include)');
  if (kyranCount === 1 && brief.kyran === 'no-fit') warn('KYRAN présent alors que le brief le déconseille');
  if (brief.count && brief.count >= 9 && games.length < brief.count) warn(`brief demandait ${brief.count} jeux, ${games.length} livrés`);

  const faq = a.faq || [];
  if (faq.length < 4 || faq.length > 6) err(`${faq.length} questions FAQ (4–6)`);
  faq.forEach((f, i) => {
    const w = wordCount(f.a || '');
    if (!f.q || !/\?\s*$/.test(f.q)) err(`faq[${i}]: la question doit finir par « ? »`);
    if (w < 20 || w > 90) err(`faq[${i}]: réponse ${w} mots (20–90)`);
  });
  if (!Array.isArray(a.related) || a.related.length < 3) err('related : 3 slugs requis');
  else for (const r of a.related) {
    if (!articleSlugs.has(r)) err(`related : « ${r} » n'existe pas dans le roster`);
    if (r === slug) err('related contient l\'article lui-même');
  }

  // Liens
  let contextual = 0;
  for (const [field, html] of htmlFields(a)) {
    if (/<h[12][\s>]/i.test(html)) err(`${field}: <h1>/<h2> interdit`);
    if (/<script|onclick=|style=/i.test(html)) err(`${field}: script / onclick / style interdit`);
    const hrefs = [...String(html).matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    for (const h of hrefs) {
      if (/^https?:/.test(h)) continue;
      const path = h.split('#')[0];
      const blogSlug = (path.match(/^\/blog\/([\w-]+)\.html$/) || [])[1];
      if (path === '/blog/index.html') err(`${field}: utiliser /blog/ et non /blog/index.html`);
      else if (redirectSources.has(path)) err(`${field}: lien vers une page fusionnée ${path}`);
      else if (blogSlug) {
        if (!articleSlugs.has(blogSlug)) err(`${field}: article inconnu ${path}`);
        else if (blogSlug === slug) warn(`${field}: lien vers l'article lui-même`);
        else contextual++;
      } else if (!knownPages.has(path)) err(`${field}: lien interne inconnu ${path}`);
      else contextual++;
    }
  }
  if (contextual < 3) err(`${contextual} lien(s) contextuel(s) interne(s) (≥ 3)`);

  // Formulations interdites / faits KYRAN
  const text = articleText(a);
  const low = text.toLowerCase();
  for (const b of BANNED) if (low.includes(b)) err(`formulation à éviter : « ${b} »`);
  for (const b of KYRAN_WRONG) if (low.includes(b)) err(`fait KYRAN erroné : « ${b} »`);
  if (/kyran[^.]{0,80}sans élimination/i.test(text)) err('KYRAN ne peut pas être décrit comme « sans élimination »');

  const total = wordCount(text);
  if (total < 1200) err(`${total} mots au total (≥ 1200)`);
  cache.words = total;
  cache.sentences = sentences(text);
  cache.shingles = shingles(text);
}

const args = process.argv.slice(2);
const files = readdirSync(BLOG_DIR).filter(f => f.endsWith('.mjs')).map(f => f.replace(/\.mjs$/, ''));
const targets = args.length ? args : files;

const errors = [];
const warns = [];
const cache = new Map();

// Cache de tous les fichiers présents (pour comparer les cibles aux autres articles)
for (const slug of files) {
  try {
    const raw = await loadRawArticle(slug);
    const c = {};
    if (targets.includes(slug)) validate(slug, raw, errors, warns, c);
    else {
      const text = articleText(raw);
      c.words = wordCount(text); c.sentences = sentences(text); c.shingles = shingles(text);
    }
    cache.set(slug, c);
  } catch (e) {
    errors.push(`${slug}: ${e.message}`);
  }
}

// Doublons entre articles
for (const slug of targets) {
  const a = cache.get(slug);
  if (!a || !a.sentences) continue;
  const mySent = new Set(a.sentences);
  for (const [other, b] of cache) {
    if (other === slug || !b.sentences) continue;
    const sharedSent = b.sentences.filter(s => mySent.has(s));
    if (sharedSent.length) errors.push(`${slug} ↔ ${other}: ${sharedSent.length} phrase(s) identique(s), ex. « ${sharedSent[0].slice(0, 90)}… »`);
    let inter = 0;
    for (const sh of a.shingles) if (b.shingles.has(sh)) inter++;
    const ratio = inter / Math.max(1, Math.min(a.shingles.size, b.shingles.size));
    if (ratio > ERROR_OVERLAP) errors.push(`${slug} ↔ ${other}: ${(ratio * 100).toFixed(1)} % de recouvrement (6-grammes) > ${ERROR_OVERLAP * 100} %`);
    else if (ratio > WARN_OVERLAP) warns.push(`${slug} ↔ ${other}: ${(ratio * 100).toFixed(1)} % de recouvrement (6-grammes)`);
  }
}

for (const slug of targets) {
  const c = cache.get(slug);
  if (c && c.words) console.log(`${slug.padEnd(34)} ${String(c.words).padStart(5)} mots`);
}
if (warns.length) console.log('\nAvertissements :\n  ' + warns.join('\n  '));
if (errors.length) {
  console.error('\nErreurs :\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log(`\nOK — ${targets.length} article(s) valide(s).`);

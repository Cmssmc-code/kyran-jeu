#!/usr/bin/env node
/**
 * Valide les articles de blog (scripts/content/blog/*.mjs) :
 * structure, longueurs, liens internes, jeux connus, détection de contenu dupliqué.
 *
 * Usage : node scripts/validate-articles.mjs [slug ...]   (sans argument : tous les fichiers présents)
 * Code de sortie 1 si une erreur est trouvée (les avertissements ne bloquent pas).
 */
import { readdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  BLOG_DIR, ROSTER, GAMES, BRIEFS, loadRawArticle, articleText, stripHtml, wordCount
} from './lib/article-model.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
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
  ((a.layout && a.layout.groups) || []).forEach((g, i) => f.push([`layout.groups[${i}].html`, g.html]));
  if (a.authorNote) f.push(['authorNote', a.authorNote.html]);
  return f.filter(([, v]) => v);
}

/**
 * Règle du propriétaire (22 octobre 2026) : tout article qui parle de Majordia contient au moins un lien
 * vers majordia.fr (le site, une page ou un article de son blog).
 */
function checkMajordiaLink(a, err) {
  const raw = JSON.stringify(a);
  const mentioned = /majordia/i.test(raw.replace(/https?:\/\/[^"\s\\]*/gi, ''));
  const linked = /href=\\"https:\/\/(www\.)?majordia\.fr(\/|\\")/.test(raw);
  if (mentioned && !linked) err('Majordia est cité sans lien vers majordia.fr (au moins un lien : site, page ou article du blog)');
}

/** CSV minimal (guillemets, virgules, retours à la ligne dans les champs). */
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(x => x !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); if (row.some(x => x !== '')) rows.push(row); }
  return rows;
}

/**
 * Jeu de données ouvert : chaque ligne doit porter l'URL de sa source et la date de son contrôle
 * (colonnes source_url et verifie_le) : aucune valeur sans source, aucune valeur non contrôlée.
 */
function validateDataset(slug, d, err) {
  const today = new Date().toISOString().slice(0, 10);
  for (const k of ['description', 'methodology', 'update']) if (!d[k]) err(`dataset.${k} manquant`);
  if (!d.license || !d.license.name || !/^https:\/\//.test(d.license.url || '')) err('dataset.license : name et url https obligatoires');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.lastVerified || '') || d.lastVerified > today) err('dataset.lastVerified invalide ou dans le futur');
  if (!Array.isArray(d.files) || !d.files.length) { err('dataset.files : au moins un fichier'); return; }
  let latest = '';
  for (const f of d.files) {
    const at = `dataset ${f.path}`;
    if (!/^\/data\/[\w-]+\/[\w.-]+\.(csv|json)$/.test(f.path || '')) { err(`${at} : chemin /data/<slug>/<fichier>.csv|json attendu`); continue; }
    if (f.path.split('/')[2] !== slug) err(`${at} : le dossier doit porter le slug de l'article`);
    if (!['csv', 'json'].includes(f.format) || !f.description) err(`${at} : format (csv|json) et description obligatoires`);
    const abs = join(ROOT, f.path);
    if (!existsSync(abs)) { err(`${at} : fichier introuvable`); continue; }
    const text = readFileSync(abs, 'utf8');
    let records;
    if (f.path.endsWith('.csv')) {
      const rows = parseCsv(text);
      if (rows.length < 2) { err(`${at} : en-tête et au moins une ligne attendus`); continue; }
      const head = rows[0];
      records = rows.slice(1).map((r, i) => {
        if (r.length !== head.length) err(`${at} ligne ${i + 2} : ${r.length} colonnes (${head.length} attendues)`);
        return Object.fromEntries(head.map((h, j) => [h, r[j] || '']));
      });
    } else {
      try { records = JSON.parse(text); } catch (e) { err(`${at} : JSON invalide`); continue; }
      if (!Array.isArray(records) || !records.every(r => r && typeof r === 'object')) { err(`${at} : tableau d'objets attendu`); continue; }
    }
    if (records.length < 5) err(`${at} : ${records.length} lignes (≥ 5)`);
    records.forEach((r, i) => {
      if (!/^https:\/\/[^\s]+$/.test(r.source_url || '')) err(`${at} ligne ${i + 1} : source_url https obligatoire`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(r.verifie_le || '') || r.verifie_le > today) err(`${at} ligne ${i + 1} : verifie_le (AAAA-MM-JJ, pas dans le futur) obligatoire`);
      else if (r.verifie_le > latest) latest = r.verifie_le;
    });
  }
  if (latest && d.lastVerified && d.lastVerified < latest) err(`dataset.lastVerified (${d.lastVerified}) antérieur à la dernière ligne contrôlée (${latest})`);
}

/**
 * Format « essai » (étude, histoire, analyse, règles en profondeur…) : pas de liste de jeux.
 * Même rigueur que les guides : sources liées, texte long, structure propre, aucun gabarit.
 */
function validateEssay(slug, a, err, warn, cache) {
  if (a.slug !== slug) err(`slug « ${a.slug} » ≠ nom de fichier`);
  for (const k of ['title', 'shortTitle', 'metaTitle', 'description', 'category', 'date', 'heroTitle', 'heroSubtitle', 'heroImage', 'heroCaption', 'intro', 'conclusion']) {
    if (!a[k]) err(`champ « ${k} » manquant`);
  }
  if (!CATEGORIES.includes(a.category)) err(`catégorie invalide : ${a.category}`);
  if (a.shortTitle && a.shortTitle.length > 32) err(`shortTitle > 32 caractères (${a.shortTitle.length})`);
  if (a.metaTitle && (a.metaTitle.length < 35 || a.metaTitle.length > 66)) err(`metaTitle ${a.metaTitle.length} caractères (35–66)`);
  if (a.description && (a.description.length < 100 || a.description.length > 165)) err(`description ${a.description.length} caractères (100–165)`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date || '')) err('date invalide (AAAA-MM-JJ)');
  if (a.games && a.games.length) err('format « essai » : pas de champ games (utiliser sections)');

  const introW = wordCount(a.intro);
  if (introW < 70 || introW > 200) err(`intro ${introW} mots (70–200)`);
  const concW = wordCount(a.conclusion);
  if (concW < 35 || concW > 160) err(`conclusion ${concW} mots (35–160)`);

  const sections = a.sections || [];
  if (sections.length < 4 || sections.length > 10) err(`${sections.length} sections (4–10)`);
  const ids = new Set();
  sections.forEach((sec, i) => {
    const at = `sections[${i}]`;
    if (!sec.heading || /<h[1-6]/i.test(sec.heading)) err(`${at}: heading manquant ou balisé`);
    const w = wordCount(sec.html);
    if (w < 150) err(`${at}: ${w} mots (≥ 150)`);
    if (sec.id !== undefined) {
      if (typeof sec.id !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(sec.id)) err(`${at}: id invalide`);
      else if (['sources', 'faq', 'conclusion', 'mot-auteur', 'donnees'].includes(sec.id) || ids.has(sec.id)) err(`${at}: id réservé ou en double`);
      ids.add(sec.id);
    }
  });
  const sources = a.sources || [];
  if (sources.length < 5) err(`${sources.length} sources (≥ 5)`);
  const urls = new Set();
  sources.forEach((r, i) => {
    if (!r.label || !/^https:\/\/[^\s"]+$/.test(r.url || '')) err(`sources[${i}]: label et url https obligatoires`);
    if (urls.has(r.url)) err(`sources[${i}]: url en double`);
    urls.add(r.url);
  });
  if (a.dataset) validateDataset(slug, a.dataset, err);
  if (!a.keyPoints || !a.keyPoints.html) err('keyPoints.html manquant (encadré « En bref » : 3 à 5 points sourcés)');
  for (const [i, ph] of (a.photos || []).entries()) {
    if (!ph.src || !ph.alt || !ph.caption) err(`photos[${i}] : src, alt et caption obligatoires`);
    else if (!existsSync(join(ROOT, ph.src))) err(`photos[${i}] : fichier introuvable ${ph.src}`);
  }
  if (!a.photos || a.photos.length < 1) warn('aucune photo : prévoir 1 à 4 images créditées (voir docs/BLOG-PASSES.md)');
  for (const [k, v] of Object.entries(a.headings || {})) {
    if (!['conclusion', 'faq', 'related', 'sources', 'donnees'].includes(k)) err(`headings.${k} inconnu`);
    if (typeof v !== 'string' || !v.trim() || /<h[1-6]/i.test(v)) err(`headings.${k} : texte simple attendu`);
  }

  const faq = a.faq || [];
  if (faq.length < 4 || faq.length > 6) err(`${faq.length} questions FAQ (4–6)`);
  faq.forEach((f, i) => {
    const w = wordCount(f.a || '');
    if (!f.q || !/\?\s*$/.test(f.q)) err(`faq[${i}]: la question doit finir par « ? »`);
    if (w < 20 || w > 110) err(`faq[${i}]: réponse ${w} mots (20–110)`);
  });
  if (!Array.isArray(a.related) || a.related.length < 3) err('related : 3 slugs requis');
  else for (const r of a.related) {
    if (!articleSlugs.has(r)) err(`related : « ${r} » n'existe pas dans le roster`);
    if (r === slug) err('related contient l\'article lui-même');
  }

  let contextual = 0;
  const fields = [['intro', a.intro], ['conclusion', a.conclusion], ['keyPoints', a.keyPoints && a.keyPoints.html],
    ...sections.map((sec, i) => [`sections[${i}]`, sec.html]), ...faq.map((f, i) => [`faq[${i}].a`, f.a]),
    ...(a.authorNote ? [['authorNote', a.authorNote.html]] : [])].filter(([, v]) => v);
  for (const [field, html] of fields) {
    if (/<h[12][\s>]/i.test(html)) err(`${field}: <h1>/<h2> interdit`);
    if (/<script|onclick=|style=/i.test(html)) err(`${field}: script / onclick / style interdit`);
    for (const m of String(html).matchAll(/href="([^"]+)"/g)) {
      const h = m[1];
      if (/^https?:/.test(h)) continue;
      const path = h.split('#')[0];
      const blogSlug = (path.match(/^\/blog\/([\w-]+)\.html$/) || [])[1];
      if (path === '/blog/index.html') err(`${field}: utiliser /blog/ et non /blog/index.html`);
      else if (redirectSources.has(path)) err(`${field}: lien vers une page fusionnée ${path}`);
      else if (blogSlug) {
        if (!articleSlugs.has(blogSlug)) err(`${field}: article inconnu ${path}`);
        else if (blogSlug !== slug) contextual++;
      } else if (!knownPages.has(path)) err(`${field}: lien interne inconnu ${path}`);
      else contextual++;
    }
  }
  if (contextual < 3) err(`${contextual} lien(s) contextuel(s) interne(s) (≥ 3)`);
  const external = fields.flatMap(([, html]) => [...String(html).matchAll(/href="(https?:[^"]+)"/g)].map(m => m[1])).length;
  if (external < 4) err(`${external} lien(s) externe(s) vers des sources dans le texte (≥ 4)`);

  const text = articleText(a);
  const low = text.toLowerCase();
  for (const b of BANNED) if (low.includes(b)) err(`formulation à éviter : « ${b} »`);
  for (const b of KYRAN_WRONG) if (low.includes(b)) err(`fait KYRAN erroné : « ${b} »`);
  if (/kyran[^.]{0,80}sans élimination/i.test(text)) err('KYRAN ne peut pas être décrit comme « sans élimination »');
  checkMajordiaLink(a, err);
  const total = wordCount(text);
  if (total < 1500) err(`${total} mots au total (≥ 1500)`);
  cache.words = total;
  cache.sentences = sentences(text);
  cache.shingles = shingles(text);
}

function validate(slug, a, errors, warns, cache) {
  const err = m => errors.push(`${slug}: ${m}`);
  const warn = m => warns.push(`${slug}: ${m}`);
  const brief = BRIEFS.find(b => b.slug === slug) || {};
  if (a.format === 'essai') return validateEssay(slug, a, err, warn, cache);

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

  // Mise en page (layout) et libellés de sections
  const layout = a.layout || {};
  if (layout.groups) {
    const ids = layout.groups.flatMap(g => g.ids || []);
    const gameIds = games.map(g => g.id);
    if (layout.groups.length < 2) err('layout.groups : au moins 2 groupes');
    layout.groups.forEach((g, i) => {
      if (!g.heading || /<h[1-6]/i.test(g.heading)) err(`layout.groups[${i}] : heading manquant ou balisé`);
      if (!g.ids || !g.ids.length) err(`layout.groups[${i}] : ids vide`);
    });
    if (ids.length !== gameIds.length || gameIds.some(id => !ids.includes(id))) err('layout.groups doit couvrir chaque jeu exactement une fois');
  }
  // Ancres facultatives des groupes et sections (cibles des anciennes URL fusionnées)
  const reserved = new Set(['comparatif', 'compare-title', 'avis', 'criteres', 'faq', 'conclusion', 'mot-auteur', 'selection']);
  const anchors = [...(layout.groups || []), ...(a.extraSections || [])].map(s => s.id).filter(id => id !== undefined);
  anchors.forEach(id => {
    if (typeof id !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) err(`id de section invalide : ${id}`);
    else if (reserved.has(id) || id.startsWith('jeu-')) err(`id de section réservé : ${id}`);
  });
  if (new Set(anchors).size !== anchors.length) err('id de section en double');
  if (layout.compare && !['before', 'after'].includes(layout.compare.position || 'before')) err('layout.compare.position : before | after');
  for (const [k, v] of Object.entries(a.headings || {})) {
    if (!['selection', 'compare', 'conclusion', 'faq', 'related'].includes(k)) err(`headings.${k} inconnu`);
    if (typeof v !== 'string' || !v.trim() || /<h[1-6]/i.test(v)) err(`headings.${k} : texte simple attendu`);
  }
  // Gabarit : un article qui garde tous les libellés par défaut ressemble à tous les autres
  const h = a.headings || {};
  const defaults = [!h.selection && !layout.groups, !h.compare && layout.compare !== false, !h.conclusion, !h.faq, !h.related,
    !a.verdict || !a.verdict.heading || a.verdict.heading === 'Notre avis tranché'].filter(Boolean).length;
  if (defaults >= 5) warn(`gabarit par défaut (${defaults} libellés de section génériques) : voir layout / headings dans scripts/content/README.md`);
  if (a.authorNote && (!a.authorNote.html || !a.authorNote.provided)) err('authorNote : html et provided (date à laquelle l\'auteur a fourni le texte) obligatoires');
  for (const [i, ph] of (a.photos || []).entries()) {
    if (!ph.src || !ph.alt || !ph.caption) err(`photos[${i}] : src, alt et caption obligatoires`);
    else if (!existsSync(join(ROOT, ph.src))) err(`photos[${i}] : fichier introuvable ${ph.src}`);
  }

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

  checkMajordiaLink(a, err);
  const total = wordCount(text);
  if (total < 1500) err(`${total} mots au total (≥ 1500)`);
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

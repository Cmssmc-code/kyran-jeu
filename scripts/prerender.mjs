#!/usr/bin/env node
/**
 * Rendu statique (build) des composants injectés par JavaScript.
 *
 * Les robots d'IA (GPTBot, ClaudeBot, PerplexityBot…) n'exécutent pas le JavaScript : sans cette
 * étape, ils ne voient ni l'en-tête, ni le pied de page, ni les avis. Le script évalue
 * components.js, blog-data.js, reviews-data.js et reviews.js dans un bac à sable Node (sans
 * navigateur), appelle leurs fonctions de rendu pures, puis écrit le HTML obtenu à l'intérieur
 * des balises <kyran-*> avec l'attribut data-ssr. Côté navigateur, les composants détectent
 * data-ssr, ne réécrivent rien et se contentent de brancher leurs événements.
 *
 * Idempotent : peut être relancé autant de fois que nécessaire.
 * Run: node scripts/prerender.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['node_modules', 'scripts', 'server', 'worker', 'vendor', 'email-previews', '_site']);
const SKIP_FILES = new Set(['admin-emails.html']);

// ── Bac à sable ────────────────────────────────────────────────────────────
function createSandbox() {
  const noop = () => {};
  const windowObj = {
    location: { pathname: '/', hash: '', search: '' },
    innerWidth: 1280,
    addEventListener: noop,
    requestAnimationFrame: noop
  };
  const documentObj = {
    readyState: 'complete',
    addEventListener: noop,
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    createElement: () => ({ setAttribute: noop, addEventListener: noop, appendChild: noop }),
    body: { classList: { contains: () => false } },
    head: { appendChild: noop }
  };
  const ctx = vm.createContext({
    window: windowObj,
    document: documentObj,
    HTMLElement: class {},
    customElements: { define: noop },
    setTimeout: () => 0,
    clearTimeout: noop,
    fetch: () => new Promise(() => {}),
    URL,
    console
  });
  windowObj.window = windowObj;
  for (const file of ['seo-config.js', 'blog-data.js', 'components.js', 'reviews-data.js', 'reviews.js']) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), ctx, { filename: file });
  }
  return ctx;
}

const ctx = createSandbox();
const R = vm.runInContext('KyranRender', ctx);
const reviews = ctx.window.KyranReviews;
const reviewsData = ctx.window.KYRAN_REVIEWS_DATA;
if (!R || !reviews || !reviewsData) throw new Error('Rendu impossible : KyranRender / KyranReviews / KYRAN_REVIEWS_DATA introuvables.');

// ── Utilitaires HTML ───────────────────────────────────────────────────────
const decodeAttr = v => v.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

function parseAttrs(raw) {
  const attrs = {};
  for (const m of raw.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g)) {
    attrs[m[1]] = m[2] !== undefined ? decodeAttr(m[2]) : m[3] !== undefined ? decodeAttr(m[3]) : '';
  }
  return attrs;
}

function pathnameOf(rel) {
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
}

const TAGS = ['kyran-header', 'kyran-footer', 'kyran-breadcrumb', 'kyran-stat-bar', 'kyran-cta-band', 'kyran-discover-grid', 'kyran-blog-filters', 'kyran-related-articles', 'kyran-blog-grid'];
const TAG_RE = new RegExp(`<(${TAGS.join('|')})((?:\\s+[\\w:-]+(?:\\s*=\\s*(?:"[^"]*"|'[^']*'))?)*)\\s*>([\\s\\S]*?)</\\1>`, 'g');

function renderTag(tag, attrs, inner, pathname) {
  switch (tag) {
    case 'kyran-header': return R.header(attrs.active || '', pathname);
    case 'kyran-footer': return R.footer();
    case 'kyran-breadcrumb': {
      let items = [];
      try { items = JSON.parse(attrs.items || '[]'); } catch { items = []; }
      return R.breadcrumb(items);
    }
    case 'kyran-stat-bar': return R.statBar();
    case 'kyran-cta-band': return R.ctaBand(name => (name in attrs ? attrs[name] : null));
    case 'kyran-discover-grid': return R.discoverGrid();
    case 'kyran-blog-filters': return R.blogFilters();
    case 'kyran-related-articles': return R.related(attrs.slug || '');
    case 'kyran-blog-grid':
      // La grille complète de blog/index.html est générée par generate-blog-infra.mjs : on la conserve
      if (!attrs.limit && !attrs.category && /class="blog-card"/.test(inner)) return inner;
      return R.blogGrid(parseInt(attrs.limit || '0', 10), attrs.category || '');
    default: return null;
  }
}

function renderPage(rel, html) {
  const pathname = pathnameOf(rel);
  ctx.window.location.pathname = pathname;
  let count = 0;
  let out = html.replace(TAG_RE, (match, tag, rawAttrs, inner) => {
    const attrs = parseAttrs(rawAttrs);
    const rendered = renderTag(tag, attrs, inner, pathname);
    if (rendered === null) return match;
    count++;
    const cleanAttrs = rawAttrs.replace(/\s+data-ssr(?:\s*=\s*(?:"[^"]*"|'[^']*'))?/g, '');
    return `<${tag}${cleanAttrs} data-ssr="1">${rendered}</${tag}>`;
  });

  // Avis Amazon (zone délimitée par <!--ssr--> … <!--/ssr-->)
  const n = reviews.normalizeData(reviewsData);
  const stamp = String(reviewsData.lastUpdated || 'static');
  out = out.replace(/(<div id="amazon-reviews-widget")([^>]*)>\s*<!--ssr-->[\s\S]*?<!--\/ssr-->/, (m, open, rest) => {
    count++;
    const cleanRest = rest.replace(/\s+data-ssr(?:\s*=\s*(?:"[^"]*"|'[^']*'))?/g, '');
    return `${open}${cleanRest} data-ssr="${stamp}"><!--ssr-->${reviews.buildWidgetHtml(n)}<!--/ssr-->`;
  });
  out = out.replace(/(<(?:span|div) id="amazon-order-badge")([^>]*)>\s*<!--ssr-->[\s\S]*?<!--\/ssr-->/, (m, open, rest) => {
    count++;
    const cleanRest = rest.replace(/\s+data-ssr(?:\s*=\s*(?:"[^"]*"|'[^']*'))?/g, '');
    return `${open}${cleanRest} data-ssr="${stamp}"><!--ssr-->${reviews.buildOrderBadgeHtml(n)}<!--/ssr-->`;
  });
  return { out, count };
}

function* htmlFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* htmlFiles(full);
    } else if (entry.name.endsWith('.html') && !SKIP_FILES.has(entry.name)) yield full;
  }
}

let pages = 0;
let changed = 0;
let blocks = 0;
for (const file of htmlFiles(ROOT)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  if (/<meta http-equiv="refresh"/.test(html)) continue; // pages de redirection
  const { out, count } = renderPage(rel, html);
  pages++;
  blocks += count;
  if (out !== html) {
    fs.writeFileSync(file, out, 'utf8');
    changed++;
  }
}
console.log(`Rendu statique : ${blocks} bloc(s) dans ${pages} page(s), ${changed} fichier(s) mis à jour.`);

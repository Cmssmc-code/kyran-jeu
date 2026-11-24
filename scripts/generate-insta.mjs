/**
 * Régénère insta.html (page « lien en bio » d'Instagram @kyran.jeu, servie sur /insta) :
 * les 12 derniers articles du blog, du plus récent au plus ancien, même source que blog-data.js.
 * Page noindex, hors sitemap et hors menu. Run: node scripts/generate-insta.mjs
 */
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadItems, SITE, escAttr } from './lib/items.mjs';
import { formatDateFr } from './lib/article-model.mjs';
import { assetVersion } from './lib/asset-version.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = assetVersion();
const COUNT = 12;
const UTM = 'utm_source=instagram&utm_medium=social&utm_campaign=bio';

const { items } = await loadItems();
const latest = [...items].sort((a, b) => b.date.localeCompare(a.date)).slice(0, COUNT);

const thumbOf = src => {
  if (!src) return null;
  const webp = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  return webp !== src && existsSync(join(ROOT, webp)) ? webp : (existsSync(join(ROOT, src)) ? src : null);
};

const cards = latest.map(i => {
  const thumb = thumbOf(i.image);
  const img = thumb
    ? `<img src="${escAttr(thumb)}" alt="" width="72" height="72" loading="lazy" decoding="async" />`
    : '<span class="insta-thumb-empty" aria-hidden="true"></span>';
  return `      <li><a class="insta-card" href="/blog/${escAttr(i.slug)}.html?${UTM}">
        ${img}
        <span class="insta-card-text"><strong>${escAttr(i.title)}</strong><small>${formatDateFr(i.date)}</small></span>
      </a></li>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>KYRAN sur Instagram : les derniers articles du blog</title>
  <meta name="description" content="Les derniers articles du blog KYRAN, le jeu de cartes de plis et de paris, en un clic depuis Instagram." />
  <link rel="canonical" href="${SITE}/insta" />
  <meta name="robots" content="noindex, follow" />
  <meta name="theme-color" content="#231F22" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="preload" href="/fonts/poppins-400-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/poppins-700-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/fredoka-latin.woff2" as="font" type="font/woff2" crossorigin />
  <script src="seo-config.js?v=${CACHE}" defer></script>
  <link rel="stylesheet" href="style.css?v=${CACHE}" />
  <style>
    .insta-page { max-width: 520px; margin: 0 auto; padding: 28px 16px 40px; text-align: center; }
    .insta-logo { width: 84px; height: 84px; border-radius: 50%; }
    .insta-page h1 { font-family: var(--font-display); font-size: 1.7rem; margin: 10px 0 4px; color: var(--k-ink); }
    .insta-lead { margin: 0 0 22px; color: var(--text-sub); }
    .insta-list { list-style: none; margin: 0 0 24px; padding: 0; display: grid; gap: 10px; text-align: left; }
    .insta-card { display: flex; align-items: center; gap: 12px; padding: 8px; background: #fff; border: 2px solid var(--k-ink); border-radius: 14px; box-shadow: 3px 3px 0 var(--k-saffron); color: var(--k-ink); text-decoration: none; }
    .insta-card img, .insta-thumb-empty { width: 72px; height: 72px; flex: none; border-radius: 10px; object-fit: cover; background: var(--k-kraft); }
    .insta-card-text { display: grid; gap: 2px; min-width: 0; }
    .insta-card-text strong { font-size: 0.95rem; line-height: 1.3; }
    .insta-card-text small { color: var(--text-sub); }
    .insta-une { margin: 0 0 18px; }
    .insta-cta { display: grid; gap: 10px; margin-bottom: 18px; }
    .insta-btn { display: block; padding: 14px 16px; border: 2px solid var(--k-ink); border-radius: 999px; font-weight: 700; text-decoration: none; color: var(--k-ink); background: #fff; }
    .insta-btn--primary { background: var(--k-saffron); }
    .insta-all { display: inline-block; margin-bottom: 22px; color: var(--k-ink); font-weight: 600; }
    .insta-foot { font-size: 0.85rem; }
    .insta-foot a { color: var(--text-sub); }
  </style>
</head>
<body class="is-insta-page">
  <main class="insta-page" id="contenu-principal">
    <img class="insta-logo" src="/logo-96.webp" alt="KYRAN" width="84" height="84" />
    <h1>KYRAN</h1>
    <p class="insta-lead">Les articles du blog KYRAN, en un clic</p>
    <a class="insta-btn insta-btn--primary insta-une" href="/secret-santa.html?utm_source=instagram&utm_medium=social&utm_campaign=secret-santa">Cadeau Secret Santa à moins de 10 €</a>
    <ul class="insta-list">
${cards}
    </ul>
    <div class="insta-cta">
      <a class="insta-btn insta-btn--primary" href="/minijeu.html?${UTM}">Essayer KYRAN en ligne</a>
      <a class="insta-btn" href="/commander.html?${UTM}">Acheter KYRAN</a>
    </div>
    <a class="insta-all" href="/blog/?${UTM}">Tout le blog</a>
    <p class="insta-foot"><a href="#" data-kyran-cookies>Gérer les cookies</a></p>
  </main>
</body>
</html>
`;
writeFileSync(join(ROOT, 'insta.html'), html, 'utf8');
console.log(`insta.html : ${latest.length} articles`);

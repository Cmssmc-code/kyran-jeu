/**
 * Régénère blog-data.js, blog/feed.xml et blog/index.html à partir des articles.
 * Run: node scripts/generate-blog-infra.mjs
 */
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadItems, SITE, escAttr } from './lib/items.mjs';
import { formatDateFr } from './lib/article-model.mjs';
import { assetVersion } from './lib/asset-version.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = assetVersion();
const CATEGORIES = ['Tous', 'Apéro', 'Famille', 'Cadeaux', 'Alternatives', 'Cartes', 'Soirée'];

const { articles, items, store } = await loadItems();
store.save();

// ── blog-data.js ───────────────────────────────────────────────────────────
const webpOf = src => {
  if (!/\.(jpg|jpeg)$/i.test(src)) return undefined;
  const w = src.replace(/\.(jpg|jpeg)$/i, '.webp');
  return existsSync(join(ROOT, w)) ? w : undefined;
};

const jsItems = items.map(i => ({
  slug: i.slug,
  title: i.title,
  category: i.category,
  date: i.date,
  readMinutes: i.readMinutes,
  excerpt: i.excerpt,
  image: i.image,
  webp: webpOf(i.image),
  gameCount: i.gameCount,
  related: i.related
}));

const blogData = `/* Fichier généré par scripts/generate-blog-infra.mjs — ne pas modifier à la main. */
const BLOG_CATEGORIES = ${JSON.stringify(CATEGORIES)};

const BLOG_ITEMS = ${JSON.stringify(jsItems, null, 2)};

function getBlogItem(slug) {
  return BLOG_ITEMS.find(function (item) { return item.slug === slug; });
}

function getBlogUrl(slug) {
  return '/blog/' + slug + '.html';
}

function getRelatedArticles(slug, limit) {
  var item = getBlogItem(slug);
  if (!item || !item.related) return BLOG_ITEMS.slice(0, limit || 3);
  return item.related.map(function (relSlug) {
    return getBlogItem(relSlug);
  }).filter(Boolean).slice(0, limit || 3);
}

function formatBlogDate(isoDate) {
  var parts = isoDate.split('-');
  var months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return parseInt(parts[2], 10) + ' ' + months[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
}
`;
writeFileSync(join(ROOT, 'blog-data.js'), blogData, 'utf8');

// ── feed.xml ───────────────────────────────────────────────────────────────
function rssDate(iso) {
  const d = new Date(iso + 'T10:00:00+02:00');
  return d.toUTCString().replace('GMT', '+0200');
}
const xmlEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const lastBuild = items.reduce((m, i) => (i.modified > m ? i.modified : m), '2000-01-01');
const feedItems = [...items]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map(a => `    <item>
      <title>${xmlEsc(a.title)}</title>
      <link>${SITE}/blog/${a.slug}.html</link>
      <guid isPermaLink="true">${SITE}/blog/${a.slug}.html</guid>
      <pubDate>${rssDate(a.date)}</pubDate>
      <description>${xmlEsc(a.excerpt)}</description>
    </item>`)
  .join('\n');

writeFileSync(join(ROOT, 'blog', 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog KYRAN</title>
    <link>${SITE}/blog/</link>
    <description>Sélections de jeux de cartes et de société, idées cadeaux et conseils pour vos soirées.</description>
    <language>fr-FR</language>
    <lastBuildDate>${rssDate(lastBuild)}</lastBuildDate>
    <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE}/logo.png</url>
      <title>Blog KYRAN</title>
      <link>${SITE}/blog/</link>
    </image>
${feedItems}
  </channel>
</rss>
`, 'utf8');

// ── blog/index.html ────────────────────────────────────────────────────────
const distinctGames = new Set(articles.flatMap(a => a.games.map(g => g.id)));
const avgWords = Math.round(articles.reduce((s, a) => s + a.wordCount, 0) / articles.length / 100) * 100;
const N = items.length;

const cards = items.map(i => {
  const gamesBadge = i.gameCount ? `\n            <span class="blog-card-games">${i.gameCount} jeux</span>` : '';
  return `        <a href="/blog/${i.slug}.html" class="blog-card" data-category="${i.category}">
          <div class="blog-card-image">
            ${webpOf(i.image) ? `<picture><source srcset="${webpOf(i.image)}" type="image/webp" />` : ''}<img src="${i.image}" alt="${escAttr(i.title)}" width="400" height="225" loading="lazy" decoding="async" />${webpOf(i.image) ? '</picture>' : ''}
            <span class="blog-badge">${i.category}</span>${gamesBadge}
            <span class="blog-card-read">${i.readMinutes} min</span>
          </div>
          <div class="blog-card-body">
            <p class="blog-card-meta">${formatDateFr(i.date)}</p>
            <h3>${i.title}</h3>
            <p class="blog-card-excerpt">${i.excerpt}</p>
            <span class="card-arrow">Lire l'article</span>
          </div>
        </a>`;
}).join('\n');

const title = `Blog KYRAN : ${N} guides pour choisir un jeu de cartes`;
const description = `Quel jeu de cartes choisir ? ${N} guides comparés : apéro, 3 joueurs, famille, cadeaux, alternatives à Skyjo, Uno ou Wizard. Tableaux et avis tranchés.`;
const url = SITE + '/blog/';

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: url }
      ]
    },
    {
      '@type': 'Blog',
      '@id': url + '#blog',
      name: 'Blog KYRAN',
      description: `${N} guides éditoriaux de jeux de cartes et de société.`,
      url,
      publisher: { '@id': SITE + '/#organization' },
      inLanguage: 'fr-FR',
      blogPost: items.map(a => ({
        '@type': 'BlogPosting',
        headline: a.title,
        url: `${SITE}/blog/${a.slug}.html`,
        datePublished: a.date,
        dateModified: a.modified,
        image: SITE + a.image
      }))
    }
  ]
};

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${escAttr(description)}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="theme-color" content="#ffffff" />
  <link rel="canonical" href="${url}" />
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
  <link rel="alternate" hreflang="fr-FR" href="${url}" />
  <link rel="alternate" hreflang="x-default" href="${url}" />
  <link rel="alternate" type="application/rss+xml" title="Blog KYRAN" href="${SITE}/blog/feed.xml" />
  <meta name="author" content="Corentin Sence" />
  <meta property="og:site_name" content="KYRAN" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escAttr(title)}" />
  <meta property="og:description" content="${escAttr(description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/og-kyran.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${SITE}/og-kyran.jpg" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="preload" href="/fonts/poppins-400-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/poppins-700-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/bebas-neue-400-latin.woff2" as="font" type="font/woff2" crossorigin />
  <script src="/seo-config.js?v=${CACHE}" defer></script>
  <link rel="stylesheet" href="/style.css?v=${CACHE}" />
  <script src="/blog-data.js?v=${CACHE}" defer></script>
  <script src="/components.js?v=${CACHE}" defer></script>
  <script type="application/ld+json">
  ${JSON.stringify(schema, null, 2)}
  </script>
</head>
<body>
  <a href="#contenu-principal" class="skip-link">Aller au contenu</a>
  <kyran-header active="blog"></kyran-header>
  <main id="contenu-principal">
    <kyran-page-hero
      eyebrow="Blog · ${N} guides éditoriaux"
      title="Quel jeu de cartes choisir ? <span class=&quot;accent&quot;>Nos guides</span> pour vos soirées"
      subtitle="Comparatifs, alternatives et sélections par nombre de joueurs, par occasion ou par budget."
      breadcrumb='[{"label":"Accueil","href":"/"},{"label":"Blog"}]'
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-hero-breadcrumb">
            <nav class="breadcrumb" aria-label="Fil d'Ariane"><a href="/">Accueil</a><span class="breadcrumb-sep" aria-hidden="true">/</span><span class="breadcrumb-current" aria-current="page">Blog</span></nav>
          </div>
          <p class="eyebrow">Blog · ${N} guides éditoriaux</p>
          <h1>Quel jeu de cartes choisir ? <span class="accent">Nos guides</span> pour vos soirées</h1>
          <p class="hero-lead">Comparatifs, alternatives et sélections par nombre de joueurs, par occasion ou par budget.</p>
        </div>
      </section>
    </kyran-page-hero>

    <section>
      <div class="container">
        <p class="blog-index-intro">Chaque guide compare des jeux de cartes et de société avec un tableau (joueurs, durée, âge, prix), une fiche par jeu rédigée pour l'usage visé et un avis tranché. Les guides sont signés par <a class="text-link" href="/a-propos.html">Corentin Sence</a>, créateur de <a class="text-link" href="/">KYRAN</a> : le jeu y figure quand il convient, et nous disons quand il ne convient pas. Pour commencer : <a class="text-link" href="/blog/jeux-3-joueurs.html">jeux à 3 joueurs</a>, <a class="text-link" href="/blog/meilleurs-jeux-apero.html">jeux d'apéro</a>, <a class="text-link" href="/blog/jeux-comme-skyjo.html">jeux comme Skyjo</a> ou le <a class="text-link" href="/blog/jeux-plis-comparatif.html">comparatif des jeux de plis</a>.</p>
        <div class="blog-index-stats" aria-label="Chiffres du blog">
          <div class="blog-index-stat">
            <span class="blog-index-stat__value">${N}</span>
            <span class="blog-index-stat__label">guides</span>
          </div>
          <div class="blog-index-stat">
            <span class="blog-index-stat__value">${distinctGames.size}</span>
            <span class="blog-index-stat__label">jeux présentés</span>
          </div>
          <div class="blog-index-stat">
            <span class="blog-index-stat__value">${avgWords}+</span>
            <span class="blog-index-stat__label">mots par guide</span>
          </div>
        </div>
        <kyran-blog-filters></kyran-blog-filters>
        <kyran-blog-grid>
      <div class="blog-grid">
${cards}
      </div>
    </kyran-blog-grid>
      </div>
    </section>
  </main>
  <kyran-footer></kyran-footer>
</body>
</html>
`;
writeFileSync(join(ROOT, 'blog', 'index.html'), html, 'utf8');

console.log(`blog-data.js, feed.xml et blog/index.html régénérés (${N} articles).`);

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SITE = 'https://kyran-jeu.fr';

// Load blog-data.js
const blogDataCode = fs.readFileSync(path.join(ROOT, 'blog-data.js'), 'utf8');
const { BLOG_CATEGORIES, BLOG_ITEMS, formatBlogDate } = vm.runInNewContext(
  blogDataCode + '\n;({BLOG_CATEGORIES, BLOG_ITEMS, formatBlogDate})',
  {}
);

console.log(`Loaded ${BLOG_ITEMS.length} articles from blog-data.js`);

// 1. Render card helper
function renderCard(item) {
  const gc = (item.title.match(/^(\d+)/) || [])[1] || '8';
  return `        <a href="/blog/${item.slug}.html" class="blog-card" data-category="${item.category}">
          <div class="blog-card-image">
            <img src="${item.image}" alt="${item.title.replace(/"/g, '&quot;')}" width="400" height="225" loading="lazy" decoding="async" />
            <span class="blog-badge">${item.category}</span>
            <span class="blog-card-games">${gc} jeux</span>
            <span class="blog-card-read">${item.readMinutes} min</span>
          </div>
          <div class="blog-card-body">
            <p class="blog-card-meta">${formatBlogDate(item.date)}</p>
            <h3>${item.title.replace(/&/g, '&amp;')}</h3>
            <p class="blog-card-excerpt">${item.excerpt.replace(/&/g, '&amp;')}</p>
            <span class="card-arrow">Lire l'article</span>
          </div>
        </a>`;
}

// 2. Generate feed.xml
function rssDate(iso) {
  const d = new Date(iso + 'T10:00:00+02:00');
  return d.toUTCString().replace('GMT', '+0200');
}

const feedItems = [...BLOG_ITEMS]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map(a => `    <item>
      <title>${a.title.replace(/&/g, '&amp;')}</title>
      <link>${SITE}/blog/${a.slug}.html</link>
      <guid isPermaLink="true">${SITE}/blog/${a.slug}.html</guid>
      <pubDate>${rssDate(a.date)}</pubDate>
      <description>${a.excerpt.replace(/&/g, '&amp;').replace(/'/g, '&apos;')}</description>
    </item>`)
  .join('\n');

const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog KYRAN</title>
    <link>${SITE}/blog/index.html</link>
    <description>Sélections de jeux de cartes et de société, idées cadeaux et conseils pour vos soirées.</description>
    <language>fr-FR</language>
    <lastBuildDate>${rssDate(BLOG_ITEMS[0].date)}</lastBuildDate>
    <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE}/logo.png</url>
      <title>Blog KYRAN</title>
      <link>${SITE}/blog/index.html</link>
    </image>
${feedItems}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(ROOT, 'blog', 'feed.xml'), feedXml, 'utf8');
console.log(`[feed.xml OK] ${BLOG_ITEMS.length} items written`);

// 3. Update blog/index.html
const blogIndexPath = path.join(ROOT, 'blog', 'index.html');
let blogHtml = fs.readFileSync(blogIndexPath, 'utf8');

// A. Schema JSON-LD
const blogPostsJson = BLOG_ITEMS.map(a => ({
  '@type': 'BlogPosting',
  headline: a.title,
  url: `${SITE}/blog/${a.slug}.html`,
  datePublished: a.date,
  image: a.image.startsWith('http') ? a.image : SITE + a.image
}));

const blogSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog/index.html' }
      ]
    },
    {
      '@type': 'Blog',
      name: 'Blog KYRAN',
      description: `${BLOG_ITEMS.length} sélections éditoriales de jeux de cartes et de société.`,
      url: SITE + '/blog/index.html',
      publisher: { '@id': SITE + '/#organization' },
      inLanguage: 'fr-FR',
      blogPost: blogPostsJson
    }
  ]
};

blogHtml = blogHtml.replace(
  /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
  `<script type="application/ld+json">\n  ${JSON.stringify(blogSchema, null, 2)}\n  </script>`
);

// B. Meta title / description
blogHtml = blogHtml.replace(
  /<title>Blog KYRAN[^<]*<\/title>/i,
  `<title>Blog KYRAN — ${BLOG_ITEMS.length} sélections jeux de cartes &amp; société</title>`
);
blogHtml = blogHtml.replace(
  /<meta name="description" content="[^"]*"/i,
  `<meta name="description" content="${BLOG_ITEMS.length} articles éditoriaux : sélections de jeux de cartes testées autour de la table, photos réelles, liens BGG et Philibert. Apéro, famille, cadeaux, alternatives."`
);
blogHtml = blogHtml.replace(
  /<meta property="og:title" content="[^"]*"/i,
  `<meta property="og:title" content="Blog KYRAN — ${BLOG_ITEMS.length} sélections jeux de cartes"`
);

// C. Fix hero
const validHero = `<kyran-page-hero
      eyebrow="Blog · ${BLOG_ITEMS.length} sélections éditoriales"
      title="Idées jeux, <span class=&quot;accent&quot;>comparatifs</span> et pépites pour vos soirées"
      subtitle="Guides thématiques, alternatives ludiques et conseils pour choisir le bon jeu."
      breadcrumb='[{"label":"Accueil","href":"/"},{"label":"Blog"}]'
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-hero-breadcrumb">
            <nav class="breadcrumb" aria-label="Fil d'Ariane"><a href="/">Accueil</a><span class="breadcrumb-sep" aria-hidden="true">/</span><span class="breadcrumb-current" aria-current="page">Blog</span></nav>
          </div>
          <p class="eyebrow">Blog · ${BLOG_ITEMS.length} sélections éditoriales</p>
          <h1>Idées jeux, <span class="accent">comparatifs</span> et pépites pour vos soirées</h1>
          <p class="hero-lead">Guides thématiques, alternatives ludiques et conseils pour choisir le bon jeu.</p>
        </div>
      </section>
    </kyran-page-hero>`;

blogHtml = blogHtml.replace(/<kyran-page-hero[\s\S]*?<\/kyran-page-hero>/i, validHero);

// D. Stats
blogHtml = blogHtml.replace(
  /<span class="blog-index-stat__value">\d+<\/span>\s*<span class="blog-index-stat__label">articles<\/span>/i,
  `<span class="blog-index-stat__value">${BLOG_ITEMS.length}</span>\n            <span class="blog-index-stat__label">articles</span>`
);

// E. Pre-render blog cards
const allCardsHtml = BLOG_ITEMS.map(renderCard).join('\n');
const preRenderedBlogGrid = `<kyran-blog-grid>
      <div class="blog-grid">
${allCardsHtml}
      </div>
    </kyran-blog-grid>`;

blogHtml = blogHtml.replace(/<kyran-blog-grid[\s\S]*?<\/kyran-blog-grid>/i, preRenderedBlogGrid);

fs.writeFileSync(blogIndexPath, blogHtml, 'utf8');
console.log(`[blog/index.html OK] Updated with SSR ${BLOG_ITEMS.length} cards, valid hero & schema.`);

// 4. Update index.html with top 3 SSR cards
const rootIndexPath = path.join(ROOT, 'index.html');
let rootHtml = fs.readFileSync(rootIndexPath, 'utf8');

const top3CardsHtml = BLOG_ITEMS.slice(0, 3).map(renderCard).join('\n');
const preRenderedTop3Grid = `<kyran-blog-grid limit="3">
      <div class="blog-grid">
${top3CardsHtml}
      </div>
    </kyran-blog-grid>`;

rootHtml = rootHtml.replace(/<kyran-blog-grid[^>]*>[\s\S]*?<\/kyran-blog-grid>/i, preRenderedTop3Grid);
fs.writeFileSync(rootIndexPath, rootHtml, 'utf8');
console.log(`[index.html OK] Updated with SSR 3 featured blog cards.`);

/**
 * Generates blog HTML articles from structured data.
 * Run: node scripts/generate-blog.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ARTICLES } from './blog-articles-data.mjs';
import { GAME_LINKS, ARTICLE_FAQ } from './lib/game-links.mjs';
import { ARTICLE_SEO, ARTICLE_ORDER } from './lib/article-seo.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'blog');
const CACHE = '20260904';
const SITE = 'https://kyran-jeu.fr';

function slugify(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function padRank(n) {
  return n < 10 ? '0' + n : String(n);
}

function getGameMeta(game) {
  const id = game.id || slugify(game.name);
  return GAME_LINKS[id] || {};
}

function stripHtml(s) {
  return String(s).replace(/<[^>]+>/g, '');
}

function compactHtml(html) {
  return html
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim() + '\n';
}

function renderGameLinks(game) {
  const meta = getGameMeta(game);
  const links = [];

  if (game.isKyran) {
    links.push(`<a class="game-link game-link--primary" href="/commander.html">Commander (9,99€)</a>`);
    links.push(`<a class="game-link" href="/regle.html">Règles</a>`);
    links.push(`<a class="game-link" href="/minijeu.html">Dojo</a>`);
    links.push(`<a class="game-link game-link--shop" href="https://www.amazon.fr/dp/B0G217LD87" rel="noopener noreferrer sponsored">Amazon (17,99€)</a>`);
  } else {
    if (meta.bgg) links.push(`<a class="game-link" href="${meta.bgg}" rel="noopener noreferrer">BoardGameGeek ↗</a>`);
    if (meta.wiki) links.push(`<a class="game-link" href="${meta.wiki}" rel="noopener noreferrer">Wikipedia ↗</a>`);
    if (meta.shop) links.push(`<a class="game-link game-link--shop" href="${meta.shop}" rel="noopener noreferrer">Philibert ↗</a>`);
  }

  if (!links.length) return '';
  return `<nav class="game-pick__links" aria-label="Liens ${game.name}">${links.join('')}</nav>`;
}

function renderGameFigure(game, meta, caption) {
  const img = game.image || '/blog/images/' + slugify(game.name) + '.jpg';
  const alt = `${game.name} — jeu de cartes${game.subtitle ? ', ' + game.subtitle : ''}`;
  const imgTag = `<img src="${img}" alt="${alt}" width="480" height="320" loading="lazy" decoding="async" itemprop="image" />`;
  const photoLink = meta.bgg || meta.shop || null;
  const media = photoLink
    ? `<a class="game-pick__photo-link" href="${photoLink}" rel="noopener noreferrer" title="Voir ${game.name}">${imgTag}</a>`
    : imgTag;

  return `<figure class="game-pick__figure">${media}<figcaption>${caption}</figcaption></figure>`;
}

function renderGamePick(game, index) {
  const id = 'jeu-' + (game.id || slugify(game.name));
  const meta = getGameMeta(game);
  const caption = game.caption || meta.imageCredit || ('Illustration — ' + game.name);
  const title = game.name + (game.subtitle ? ' — ' + game.subtitle : '');
  const body = game.paragraphs.map(p => `<p>${p}</p>`).join('');
  const kyranClass = game.isKyran ? ' game-pick--featured' : '';
  const badge = game.isKyran ? '<span class="game-pick__badge">Notre coup de cœur</span>' : '';
  const designerLine = meta.designer
    ? `<p class="game-pick__meta-line"><span>Auteur</span> ${meta.designer}${meta.year ? ' · ' + meta.year : ''}</p>`
    : '';

  return `<article class="game-pick${kyranClass}" id="${id}" itemscope itemtype="https://schema.org/Game">
  <div class="game-pick__inner">
    <div class="game-pick__rank-col"><span class="game-pick__rank" aria-hidden="true">${padRank(index)}</span></div>
    <div class="game-pick__media">${renderGameFigure(game, meta, caption)}</div>
    <div class="game-pick__content">
      <header class="game-pick__header">
        ${badge}
        <h2 class="game-pick__title" itemprop="name">${title}</h2>
        ${designerLine}
        <dl class="game-specs">
          <div class="game-spec"><dt>Joueurs</dt><dd itemprop="numberOfPlayers">${game.players}</dd></div>
          <div class="game-spec"><dt>Durée</dt><dd>${game.duration}</dd></div>
          <div class="game-spec"><dt>Âge</dt><dd>${game.age}</dd></div>
          <div class="game-spec game-spec--price"><dt>Prix</dt><dd>${game.price}</dd></div>
        </dl>
        ${renderGameLinks(game)}
      </header>
      <div class="game-pick__body" itemprop="description">${body}</div>
    </div>
  </div>
</article>`;
}

function buildItemList(games) {
  return games.map((g, i) => ({ '@type': 'ListItem', position: i + 1, name: g.name }));
}

function buildAboutGames(games) {
  return games.map(g => {
    const meta = getGameMeta(g);
    const entry = {
      '@type': 'Game',
      name: g.name,
      description: g.paragraphs[0].replace(/<[^>]+>/g, '').slice(0, 200),
      numberOfPlayers: g.players,
      image: SITE + (g.image || '/blog/images/' + slugify(g.name) + '.jpg')
    };
    if (meta.bgg) entry.sameAs = [meta.bgg];
    if (meta.wiki) entry.sameAs = (entry.sameAs || []).concat(meta.wiki);
    if (meta.designer) entry.author = { '@type': 'Person', name: meta.designer };
    return entry;
  });
}

function estimateWords(article) {
  const all = [article.intro, article.conclusion, ...article.games.flatMap(g => g.paragraphs)].join(' ');
  return all.split(/\s+/).filter(Boolean).length;
}

function renderLLMBox(article) {
  const gamesList = article.games.map((g, i) =>
    `<li><strong>${i + 1}. ${g.name}</strong> — ${g.players}, ${g.duration}, ${g.price}</li>`
  ).join('');
  return `<aside class="article-llm-box" aria-label="Résumé structuré pour lecteurs et moteurs">
  <p class="article-llm-box__label">Résumé de la sélection</p>
  <p class="article-llm-box__text">${stripHtml(article.intro).slice(0, 280)}…</p>
  <ul class="article-llm-box__list">${gamesList}</ul>
  <p class="article-llm-box__footer">Article éditorial KYRAN · ${article.category} · ${article.games.length} jeux · ~${article.readMinutes} min · <a class="text-link" href="/llms.txt">llms.txt</a></p>
</aside>`;
}

function renderAuthorCard() {
  return `<div class="article-author-card">
  <div class="article-author-card__avatar" aria-hidden="true">CS</div>
  <div class="article-author-card__body">
    <p class="article-author-card__name"><a href="/dossier-presse.html">Corentin Sence</a></p>
    <p class="article-author-card__role">Créateur de KYRAN · passionné jeux de cartes</p>
    <p class="article-author-card__bio">Sélections testées autour de la table, avec photos réelles et liens vérifiés (BGG, Wikipedia, Philibert).</p>
  </div>
</div>`;
}

function renderShareBar(article, url) {
  const title = encodeURIComponent(article.metaTitle);
  const shareUrl = encodeURIComponent(url);
  return `<div class="article-share-bar" aria-label="Partager cet article">
  <span class="article-share-bar__label">Partager</span>
  <a class="article-share-bar__btn" href="https://twitter.com/intent/tweet?text=${title}&amp;url=${shareUrl}" rel="noopener noreferrer" target="_blank">X</a>
  <a class="article-share-bar__btn" href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" rel="noopener noreferrer" target="_blank">Facebook</a>
  <a class="article-share-bar__btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" rel="noopener noreferrer" target="_blank">LinkedIn</a>
  <a class="article-share-bar__btn" href="${SITE}/blog/feed.xml" rel="alternate">RSS</a>
  <button type="button" class="article-share-bar__btn article-share-bar__btn--copy" data-copy-url="${url}">Copier le lien</button>
</div>`;
}

function renderFAQ(article) {
  const faqs = ARTICLE_FAQ[article.category] || ARTICLE_FAQ['Apéro'];
  if (!faqs || !faqs.length) return { html: '', schema: null };

  const items = faqs.map(f =>
    `<details class="faq-item"><summary>${f.q}</summary><p>${f.a}</p></details>`
  ).join('');

  return {
    html: `<section class="article-faq" id="faq" aria-labelledby="faq-title">
  <h2 id="faq-title" class="article-section-label">Questions fréquentes</h2>
  <div class="faq-list">${items}</div>
</section>`,
    schema: {
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    }
  };
}

function renderCrossLinks(article) {
  const slugs = (article.related || []).filter(s => ARTICLE_ORDER.includes(s)).slice(0, 4);
  if (!slugs.length) return '';

  const cards = slugs.map(s => {
    const a = ARTICLES.find(x => x.slug === s);
    if (!a) return '';
    return `<a class="article-cross-link" href="/blog/${s}.html">
      <span class="article-cross-link__cat">${a.category}</span>
      <strong>${a.shortTitle || a.title}</strong>
      <span class="article-cross-link__meta">${a.games.length} jeux · ${a.readMinutes} min</span>
    </a>`;
  }).join('');

  return `<section class="article-cross-links" aria-labelledby="cross-links-title">
  <h2 id="cross-links-title" class="article-section-label">À lire aussi</h2>
  <div class="article-cross-links__grid">${cards}</div>
</section>`;
}

function renderSidebarCta() {
  return `<div class="article-sidebar-cta">
  <p class="article-sidebar-cta__label">Le jeu KYRAN</p>
  <p class="article-sidebar-cta__text">Plis, paris et manche Mystique — 3 à 6 joueurs, ~30 min.</p>
  <a class="btn btn-primary btn--sm" href="/regle.html">Voir les règles</a>
  <a class="btn btn-secondary btn--sm" href="/minijeu.html">Essayer le Dojo</a>
</div>`;
}

function renderArticleNav(slug) {
  const idx = ARTICLE_ORDER.indexOf(slug);
  if (idx < 0) return '';
  const prev = idx > 0 ? ARTICLE_ORDER[idx - 1] : null;
  const next = idx < ARTICLE_ORDER.length - 1 ? ARTICLE_ORDER[idx + 1] : null;
  const findTitle = s => ARTICLES.find(a => a.slug === s)?.shortTitle || s;

  let html = '<nav class="article-series-nav" aria-label="Navigation entre articles">';
  if (prev) {
    html += `<a class="article-series-nav__link article-series-nav__link--prev" href="/blog/${prev}.html"><span>Article précédent</span><strong>${findTitle(prev)}</strong></a>`;
  }
  html += `<a class="article-series-nav__hub" href="/blog/index.html">Tous les articles (${ARTICLE_ORDER.length})</a>`;
  if (next) {
    html += `<a class="article-series-nav__link article-series-nav__link--next" href="/blog/${next}.html"><span>Article suivant</span><strong>${findTitle(next)}</strong></a>`;
  }
  html += '</nav>';
  return html;
}

function renderArticle(article) {
  const url = `${SITE}/blog/${article.slug}.html`;
  const wordCount = estimateWords(article);
  const itemList = buildItemList(article.games);
  const keywords = ARTICLE_SEO[article.slug] || '';
  const faqBlock = renderFAQ(article);
  const gameCount = article.games.length;

  const tocLinks = article.games.map((g, i) => {
    const id = 'jeu-' + (g.id || slugify(g.name));
    return `<a href="#${id}"><span class="toc-num">${i + 1}</span>${g.name}</a>`;
  }).join('');

  const jumpLinks = article.games.map((g, i) => {
    const id = 'jeu-' + (g.id || slugify(g.name));
    return `<a href="#${id}">${i + 1}. ${g.name}</a>`;
  }).join('');

  const gameHtml = article.games.map((g, i) => renderGamePick(g, i + 1)).join('\n');

  const schemaGraph = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog/index.html' },
        { '@type': 'ListItem', position: 3, name: article.title, item: url }
      ]
    },
    {
      '@type': 'BlogPosting',
      headline: article.title,
      alternativeHeadline: article.metaTitle,
      description: article.description,
      abstract: stripHtml(article.intro).slice(0, 300),
      author: { '@type': 'Person', name: 'Corentin Sence', url: SITE + '/dossier-presse.html' },
      publisher: { '@id': SITE + '/#organization' },
      datePublished: article.date,
      dateModified: '2026-05-31',
      inLanguage: 'fr-FR',
      url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      image: { '@type': 'ImageObject', url: SITE + article.heroImage, width: 1200, height: 675 },
      wordCount,
      articleSection: article.category,
      keywords,
      about: buildAboutGames(article.games),
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.article-lead', '.article-llm-box__text', '.game-pick__title']
      },
      isPartOf: { '@type': 'Blog', name: 'Blog KYRAN', url: SITE + '/blog/index.html' }
    },
    {
      '@type': 'ItemList',
      name: article.title,
      description: article.description,
      numberOfItems: gameCount,
      itemListElement: itemList
    }
  ];

  if (faqBlock.schema) schemaGraph.push(faqBlock.schema);
  const schema = { '@context': 'https://schema.org', '@graph': schemaGraph };

  const conclusionHtml = article.conclusion.split('\n').filter(Boolean)
    .map(p => `<p>${p.trim()}</p>`).join('');

  const guideBlock = article.guideLinks
    ? `<div class="editorial-callout editorial-callout--soft">${article.guideLinks}</div>`
    : '';

  return compactHtml(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${article.metaTitle}</title>
  <meta name="description" content="${article.description}" />
  ${keywords ? `<meta name="keywords" content="${keywords}" />` : ''}
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="theme-color" content="#ffffff" />
  <link rel="canonical" href="${url}" />
  <link rel="alternate" hreflang="fr-FR" href="${url}" />
  <link rel="alternate" hreflang="x-default" href="${url}" />
  <link rel="alternate" type="application/rss+xml" title="Blog KYRAN" href="${SITE}/blog/feed.xml" />
  <link rel="sitemap" type="application/xml" title="Sitemap" href="${SITE}/sitemap.xml" />
  <meta name="author" content="Corentin Sence" />
  <meta property="og:site_name" content="KYRAN" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${article.metaTitle}" />
  <meta property="og:description" content="${article.description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}${article.heroImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="675" />
  <meta property="article:published_time" content="${article.date}" />
  <meta property="article:modified_time" content="2026-05-31" />
  <meta property="article:author" content="Corentin Sence" />
  <meta property="article:section" content="${article.category}" />
  ${keywords ? `<meta property="article:tag" content="${keywords.split(',')[0].trim()}" />` : ''}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${article.metaTitle}" />
  <meta name="twitter:description" content="${article.description}" />
  <meta name="twitter:image" content="${SITE}${article.heroImage}" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="preload" as="image" href="${article.heroImage}" fetchpriority="high" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
  <script src="/seo-config.js?v=${CACHE}"></script>
  <link rel="stylesheet" href="/style.css?v=${CACHE}" />
  <script src="/blog-data.js?v=${CACHE}"></script>
  <script src="/components.js?v=${CACHE}"></script>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="blog-article-page">
  <a href="#contenu-principal" class="skip-link">Aller au contenu</a>
  <div class="reading-progress" aria-hidden="true"><div class="reading-progress__bar"></div></div>
  <kyran-header active="blog"></kyran-header>
  <main id="contenu-principal">
    <header class="blog-article-hero">
      <div class="blog-article-hero__bg">
        <img src="${article.heroImage}" alt="${article.heroCaption || article.shortTitle}" width="1200" height="675" loading="eager" fetchpriority="high" decoding="async" />
      </div>
      <div class="blog-article-hero__overlay"></div>
      <div class="container blog-article-hero__content">
        <kyran-breadcrumb items='${JSON.stringify([{ label: 'Accueil', href: '/index.html' }, { label: 'Blog', href: '/blog/index.html' }, { label: article.shortTitle }])}'></kyran-breadcrumb>
        <span class="blog-article-hero__category">${article.category}</span>
        <h1 class="blog-article-hero__title">${article.heroTitle}</h1>
        <p class="blog-article-hero__subtitle">${article.heroSubtitle}</p>
        <ul class="blog-article-hero__meta">
          <li><span class="meta-label">Auteur</span> Corentin Sence</li>
          <li><span class="meta-label">Publié</span> <time datetime="${article.date}">${article.dateFormatted}</time></li>
          <li><span class="meta-label">Lecture</span> ${article.readMinutes} min</li>
          <li><span class="meta-label">Sélection</span> ${gameCount} jeux</li>
        </ul>
      </div>
    </header>
    <section class="blog-article-body">
      <div class="container container--article">
        <nav class="blog-jump-nav" aria-label="Accès rapide aux jeux">
          <div class="blog-jump-nav__track">
            ${jumpLinks}
            <a href="#conclusion">Conclusion</a>
            <a href="#faq">FAQ</a>
          </div>
        </nav>
        <div class="article-layout">
          <article class="article-main prose prose-wide">
            <p class="article-lead article-lead--editorial">${article.intro}</p>
            ${renderAuthorCard()}
            ${renderShareBar(article, url)}
            ${renderLLMBox(article)}
            <div class="article-stats-bar">
              <div class="article-stat"><span class="article-stat__value">${gameCount}</span><span class="article-stat__label">jeux testés</span></div>
              <div class="article-stat"><span class="article-stat__value">${article.readMinutes}</span><span class="article-stat__label">min de lecture</span></div>
              <div class="article-stat"><span class="article-stat__value">${wordCount}</span><span class="article-stat__label">mots</span></div>
            </div>
            <p class="article-trust-note">Chaque jeu est présenté avec photo réelle, fiche pratique et liens externes vérifiés (BoardGameGeek, Wikipedia, Philibert).</p>
            <h2 class="article-section-label" id="selection">Notre sélection</h2>
            ${gameHtml}
            <section class="article-outro" id="conclusion">
              <div class="article-outro__inner">
                <span class="article-outro__eyebrow">En résumé</span>
                <h2 class="article-outro__title">Conclusion</h2>
                ${conclusionHtml}
              </div>
            </section>
            ${faqBlock.html}
            ${guideBlock}
            ${renderCrossLinks(article)}
            ${renderArticleNav(article.slug)}
          </article>
          <aside class="article-sidebar" aria-label="Sommaire de l'article">
            <nav class="sticky-toc sticky-toc--editorial">
              <p class="sticky-toc__title">Dans cet article</p>
              ${tocLinks}
              <a href="#conclusion"><span class="toc-num">✓</span>Conclusion</a>
              <a href="#faq"><span class="toc-num">?</span>FAQ</a>
            </nav>
            ${renderSidebarCta()}
          </aside>
        </div>
        <kyran-related-articles slug="${article.slug}"></kyran-related-articles>
        <kyran-cta-band text="Envie de plis, paris et manche Mystique ? KYRAN se joue en une soirée."></kyran-cta-band>
      </div>
    </section>
  </main>
  <kyran-footer></kyran-footer>
  <button type="button" class="back-to-top" aria-label="Retour en haut" hidden>↑</button>
  <script src="/blog.js?v=${CACHE}"></script>
</body>
</html>`);
}

mkdirSync(OUT, { recursive: true });

let report = [];
for (const article of ARTICLES) {
  const html = renderArticle(article);
  writeFileSync(join(OUT, article.slug + '.html'), html, 'utf8');
  report.push(`${article.slug}: ${estimateWords(article)} mots`);
}

console.log('Generated ' + ARTICLES.length + ' articles:');
report.forEach(r => console.log('  ' + r));

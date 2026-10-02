/**
 * Génère les articles du blog (blog/<slug>.html) à partir de scripts/content/blog/<slug>.mjs.
 * Les articles rédigés à la main (roster.handwritten) ne sont pas touchés.
 * Run: node scripts/generate-blog.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GAME_LINKS } from './lib/game-links.mjs';
import { loadItems, SITE, stripHtml } from './lib/items.mjs';
import { assetVersion } from './lib/asset-version.mjs';
import { imageSize } from './lib/image-size.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'blog');
const CACHE = assetVersion();
const AUTHOR_URL = SITE + '/a-propos.html';
const AUTHOR_ID = AUTHOR_URL + '#corentin-sence';

function slugify(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function padRank(n) {
  return n < 10 ? '0' + n : String(n);
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Variante WebP d'une image locale du blog, si elle existe. */
function webpOf(src) {
  if (!/\.(jpg|jpeg)$/i.test(src)) return null;
  const w = src.replace(/\.(jpg|jpeg)$/i, '.webp');
  return existsSync(join(ROOT, w)) ? w : null;
}

function pictureHtml(src, imgTag) {
  const w = webpOf(src);
  return w ? `<picture><source srcset="${w}" type="image/webp" />${imgTag}</picture>` : imgTag;
}

function compactHtml(html) {
  return html
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim() + '\n';
}

function getGameMeta(game) {
  return GAME_LINKS[game.id || slugify(game.name)] || {};
}

function renderGameLinks(game) {
  const meta = getGameMeta(game);
  const links = [];

  if (game.isKyran) {
    links.push(`<a class="game-link game-link--primary" href="/commander.html">Commander (9,99&nbsp;€)</a>`);
    links.push(`<a class="game-link" href="/regle.html">Règles</a>`);
    links.push(`<a class="game-link" href="/minijeu.html">Dojo</a>`);
    links.push(`<a class="game-link game-link--shop" href="https://www.amazon.fr/dp/B0G217LD87" rel="noopener noreferrer sponsored">Amazon (17,99&nbsp;€)</a>`);
  } else {
    if (meta.bgg) links.push(`<a class="game-link" href="${meta.bgg}" rel="noopener noreferrer">BoardGameGeek ↗</a>`);
    if (meta.wiki) links.push(`<a class="game-link" href="${meta.wiki}" rel="noopener noreferrer">Wikipedia ↗</a>`);
    if (meta.shop) links.push(`<a class="game-link game-link--shop" href="${meta.shop}" rel="noopener noreferrer">Philibert ↗</a>`);
  }

  if (!links.length) return '';
  return `<nav class="game-pick__links" aria-label="Liens ${esc(game.name)}">${links.join('')}</nav>`;
}

function renderGameFigure(game, meta, caption) {
  const img = game.image || '/blog/images/' + slugify(game.name) + '.jpg';
  const alt = `${game.name} — jeu de cartes${game.subtitle ? ', ' + game.subtitle : ''}`;
  const dims = imageSize(join(ROOT, img)) || { width: 480, height: 320 };
  const imgTag = pictureHtml(img, `<img src="${img}" alt="${esc(alt)}" width="${dims.width}" height="${dims.height}" loading="lazy" decoding="async" itemprop="image" />`);
  const photoLink = meta.bgg || meta.shop || null;
  const media = photoLink
    ? `<a class="game-pick__photo-link" href="${photoLink}" rel="noopener noreferrer" title="Voir ${esc(game.name)}">${imgTag}</a>`
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
  const badge = game.isKyran ? '<span class="game-pick__badge">Notre jeu</span>' : '';
  const designerLine = meta.designer
    ? `<p class="game-pick__meta-line"><span>Auteur</span> ${meta.designer}${meta.year ? ' · ' + meta.year : ''}</p>`
    : '';
  const pickLine = game.pick
    ? `<p class="game-pick__pick"><strong>Pour qui ?</strong> ${game.pick}</p>`
    : '';
  const typeTag = game.type ? `<span class="game-pick__type">${game.type}</span>` : '';

  return `<article class="game-pick${kyranClass}" id="${id}" itemscope itemtype="https://schema.org/Game">
  <div class="game-pick__card">
    <header class="game-pick__top">
      <span class="game-pick__rank" aria-hidden="true">${padRank(index)}</span>
      <div class="game-pick__title-wrap">
        ${badge}${typeTag}
        <h3 class="game-pick__title" itemprop="name">${title}</h3>
        ${designerLine}
      </div>
    </header>
    <div class="game-pick__overview">
      <div class="game-pick__media">${renderGameFigure(game, meta, caption)}</div>
      <div class="game-pick__info">
        <dl class="game-specs">
          <div class="game-spec"><dt>Joueurs</dt><dd itemprop="numberOfPlayers">${game.players}</dd></div>
          <div class="game-spec"><dt>Durée</dt><dd>${game.duration}</dd></div>
          <div class="game-spec"><dt>Âge</dt><dd>${game.age}</dd></div>
          <div class="game-spec game-spec--price"><dt>Prix</dt><dd>${game.price}</dd></div>
        </dl>
        ${pickLine}
        ${renderGameLinks(game)}
      </div>
    </div>
    <div class="game-pick__body" itemprop="description">${body}</div>
  </div>
</article>`;
}

function renderCompareTable(article) {
  const rows = article.games.map(g => {
    const id = 'jeu-' + (g.id || slugify(g.name));
    const cls = g.isKyran ? ' class="col-kyran"' : '';
    return `<tr${cls}><th scope="row"><a href="#${id}">${g.name}</a></th><td>${g.players}</td><td>${g.duration}</td><td>${g.age}</td><td>${g.price}</td><td>${g.type || ''}</td></tr>`;
  }).join('\n');
  return `<section class="article-compare" id="comparatif" aria-labelledby="compare-title">
  <h2 id="compare-title" class="article-section-label">Tableau comparatif</h2>
  <div class="compare-table-wrap">
    <table class="compare-table">
      <caption class="sr-only">Comparatif des ${article.games.length} jeux : joueurs, durée, âge, prix et type</caption>
      <thead><tr><th scope="col">Jeu</th><th scope="col">Joueurs</th><th scope="col">Durée</th><th scope="col">Âge</th><th scope="col">Prix</th><th scope="col">Type</th></tr></thead>
      <tbody>
${rows}
      </tbody>
    </table>
  </div>
</section>`;
}

function buildItemList(article) {
  return article.games.map((g, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: g.name,
    url: `${SITE}/blog/${article.slug}.html#jeu-${g.id || slugify(g.name)}`
  }));
}

function buildAboutGames(games) {
  return games.map(g => {
    const meta = getGameMeta(g);
    const entry = {
      '@type': 'Game',
      name: g.name,
      description: stripHtml(g.paragraphs[0]).slice(0, 200),
      numberOfPlayers: g.players,
      image: SITE + (g.image || '/blog/images/' + slugify(g.name) + '.jpg')
    };
    const sameAs = [meta.bgg, meta.wiki].filter(Boolean);
    if (sameAs.length) entry.sameAs = sameAs;
    if (meta.designer) entry.author = { '@type': 'Person', name: meta.designer };
    return entry;
  });
}

function renderIntro(intro) {
  const paras = [...String(intro).matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map(m => m[1].trim());
  const list = paras.length ? paras : [String(intro).trim()];
  return list.map((p, i) => i === 0
    ? `<p class="article-lead article-lead--editorial">${p}</p>`
    : `<p>${p}</p>`).join('\n            ');
}

function renderLLMBox(article) {
  const gamesList = article.games.map((g, i) =>
    `<li><strong>${i + 1}. ${g.name}</strong> — ${g.players} joueurs, ${g.duration}, ${g.price}${g.type ? ' · ' + g.type : ''}</li>`
  ).join('');
  return `<aside class="article-llm-box" aria-label="Résumé de la sélection">
  <p class="article-llm-box__label">En bref</p>
  <p class="article-llm-box__text">${article.description}</p>
  <ul class="article-llm-box__list">${gamesList}</ul>
  <p class="article-llm-box__footer">Sélection éditoriale KYRAN · ${article.category} · ${article.games.length} jeux · ~${article.readMinutes} min · <a class="text-link" href="/a-propos.html">Notre méthode</a></p>
</aside>`;
}

function renderAuthorCard() {
  return `<div class="article-author-card">
  <div class="article-author-card__avatar" aria-hidden="true">CS</div>
  <div class="article-author-card__body">
    <p class="article-author-card__name"><a href="/a-propos.html">Corentin Sence</a></p>
    <p class="article-author-card__role">Créateur de KYRAN · auteur de la sélection</p>
    <p class="article-author-card__bio">Sélections éditoriales avec fiches pratiques et liens de référence (BGG, Wikipedia, Philibert). KYRAN est notre jeu : nous le signalons et disons quand il n'est pas le bon choix.</p>
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
  const faqs = article.faq || [];
  if (!faqs.length) return { html: '', schema: null };
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
        name: stripHtml(f.q),
        acceptedAnswer: { '@type': 'Answer', text: stripHtml(f.a) }
      }))
    }
  };
}

function renderCrossLinks(article, itemsBySlug) {
  const cards = (article.related || []).slice(0, 4).map(s => {
    const a = itemsBySlug.get(s);
    if (!a) return '';
    const meta = a.gameCount ? `${a.gameCount} jeux · ${a.readMinutes} min` : `${a.readMinutes} min`;
    return `<a class="article-cross-link" href="/blog/${s}.html">
      <span class="article-cross-link__cat">${a.category}</span>
      <strong>${a.shortTitle || a.title}</strong>
      <span class="article-cross-link__meta">${meta}</span>
    </a>`;
  }).join('');
  if (!cards) return '';
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

function renderArticle(article, itemsBySlug) {
  const url = `${SITE}/blog/${article.slug}.html`;
  const keywords = (article.queries || []).join(', ');
  const faqBlock = renderFAQ(article);
  const gameCount = article.games.length;
  const extras = article.extraSections || [];

  const heroDims = imageSize(join(ROOT, article.heroImage)) || { width: 1200, height: 675 };
  // Une image trop petite fait un mauvais aperçu social : repli sur l'image de marque 1200×630
  const useBrandOg = heroDims.width < 600;
  const ogImage = useBrandOg ? SITE + '/og-kyran.jpg' : SITE + article.heroImage;
  const ogDims = useBrandOg ? { width: 1200, height: 630 } : heroDims;

  const gameId = g => 'jeu-' + (g.id || slugify(g.name));
  const tocLinks = [
    `<a href="#criteres"><span class="toc-num">1</span>${esc(article.criteria.heading)}</a>`,
    `<a href="#comparatif"><span class="toc-num">2</span>Tableau comparatif</a>`,
    ...article.games.map((g, i) => `<a href="#${gameId(g)}"><span class="toc-num">${i + 3}</span>${g.name}</a>`),
    ...extras.map((s, i) => `<a href="#section-${i + 1}"><span class="toc-num">+</span>${esc(s.heading)}</a>`),
    `<a href="#avis"><span class="toc-num">★</span>Notre avis</a>`,
    `<a href="#faq"><span class="toc-num">?</span>FAQ</a>`
  ].join('');

  const jumpLinks = [
    `<a href="#criteres">Comment choisir</a>`,
    `<a href="#comparatif">Comparatif</a>`,
    ...article.games.map((g, i) => `<a href="#${gameId(g)}">${i + 1}. ${g.name}</a>`),
    ...extras.map((s, i) => `<a href="#section-${i + 1}">${esc(s.heading)}</a>`),
    `<a href="#avis">Notre avis</a>`,
    `<a href="#faq">FAQ</a>`
  ].join('');

  const gameHtml = article.games.map((g, i) => renderGamePick(g, i + 1)).join('\n');

  const schemaGraph = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog/' },
        { '@type': 'ListItem', position: 3, name: article.title, item: url }
      ]
    },
    {
      '@type': 'BlogPosting',
      '@id': url + '#article',
      headline: article.title,
      alternativeHeadline: article.metaTitle,
      description: article.description,
      abstract: stripHtml(article.intro).slice(0, 300),
      author: { '@type': 'Person', '@id': AUTHOR_ID, name: 'Corentin Sence', url: AUTHOR_URL },
      publisher: { '@id': SITE + '/#organization' },
      datePublished: article.date,
      dateModified: article.modifiedDate,
      inLanguage: 'fr-FR',
      url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      image: { '@type': 'ImageObject', url: ogImage, width: ogDims.width, height: ogDims.height },
      wordCount: article.wordCount,
      articleSection: article.category,
      keywords,
      about: buildAboutGames(article.games),
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.article-lead', '.article-llm-box__text', '.game-pick__title']
      },
      isPartOf: { '@type': 'Blog', name: 'Blog KYRAN', url: SITE + '/blog/' }
    },
    {
      '@type': 'ItemList',
      name: article.title,
      description: article.description,
      numberOfItems: gameCount,
      itemListElement: buildItemList(article)
    }
  ];
  if (faqBlock.schema) schemaGraph.push(faqBlock.schema);
  const schema = { '@context': 'https://schema.org', '@graph': schemaGraph };

  const conclusionHtml = String(article.conclusion)
    .split(/(?:<\/p>\s*<p>|\n)/).map(p => p.replace(/^<p>|<\/p>$/g, '').trim()).filter(Boolean)
    .map(p => `<p>${p}</p>`).join('');

  const guideBlock = article.guideLinks
    ? `<div class="editorial-callout editorial-callout--soft">${article.guideLinks}</div>`
    : '';

  const extraHtml = extras.map((s, i) => `<section class="article-extra" id="section-${i + 1}" aria-labelledby="section-${i + 1}-title">
  <h2 id="section-${i + 1}-title" class="article-section-label">${s.heading}</h2>
  <div class="article-extra__body">${s.html}</div>
</section>`).join('\n');

  const verdictHtml = `<section class="article-verdict" id="avis" aria-labelledby="avis-title">
  <h2 id="avis-title" class="article-section-label">${article.verdict.heading || 'Notre avis tranché'}</h2>
  <div class="article-verdict__body">${article.verdict.html}</div>
</section>`;

  return compactHtml(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(article.metaTitle)}</title>
  <meta name="description" content="${esc(article.description)}" />
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
  <meta property="og:title" content="${esc(article.metaTitle)}" />
  <meta property="og:description" content="${esc(article.description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="${ogDims.width}" />
  <meta property="og:image:height" content="${ogDims.height}" />
  <meta property="og:image:alt" content="${esc(article.heroCaption || article.shortTitle)}" />
  <meta property="article:published_time" content="${article.date}" />
  <meta property="article:modified_time" content="${article.modifiedDate}" />
  <meta property="article:author" content="${AUTHOR_URL}" />
  <meta property="article:section" content="${article.category}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(article.metaTitle)}" />
  <meta name="twitter:description" content="${esc(article.description)}" />
  <meta name="twitter:image" content="${ogImage}" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  ${webpOf(article.heroImage) ? `<link rel="preload" as="image" href="${webpOf(article.heroImage)}" type="image/webp" fetchpriority="high" />` : `<link rel="preload" as="image" href="${article.heroImage}" fetchpriority="high" />`}
  <link rel="preload" href="/fonts/poppins-400-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/poppins-700-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/bebas-neue-400-latin.woff2" as="font" type="font/woff2" crossorigin />
  <script src="/seo-config.js?v=${CACHE}" defer></script>
  <link rel="stylesheet" href="/style.css?v=${CACHE}" />
  <script src="/blog-data.js?v=${CACHE}" defer></script>
  <script src="/components.js?v=${CACHE}" defer></script>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="blog-article-page">
  <a href="#contenu-principal" class="skip-link">Aller au contenu</a>
  <div class="reading-progress" aria-hidden="true"><div class="reading-progress__bar"></div></div>
  <kyran-header active="blog"></kyran-header>
  <main id="contenu-principal">
    <header class="blog-article-hero">
      <div class="blog-article-hero__bg">
        ${pictureHtml(article.heroImage, `<img src="${article.heroImage}" alt="${esc(article.heroCaption || article.shortTitle)}" width="${heroDims.width}" height="${heroDims.height}" loading="eager" fetchpriority="high" decoding="async" />`)}
      </div>
      <div class="blog-article-hero__overlay"></div>
      <div class="container blog-article-hero__content">
        <kyran-breadcrumb items='${JSON.stringify([{ label: 'Accueil', href: '/' }, { label: 'Blog', href: '/blog/' }, { label: article.shortTitle }])}'></kyran-breadcrumb>
        <span class="blog-article-hero__category">${article.category}</span>
        <h1 class="blog-article-hero__title">${article.heroTitle}</h1>
        <p class="blog-article-hero__subtitle">${article.heroSubtitle}</p>
        <ul class="blog-article-hero__meta">
          <li><span class="meta-label">Auteur</span> <a href="/a-propos.html">Corentin Sence</a></li>
          <li><span class="meta-label">Publié</span> <time datetime="${article.date}">${article.dateFormatted}</time></li>
          <li><span class="meta-label">Mis à jour</span> <time datetime="${article.modifiedDate}">${article.modifiedDate.split('-').reverse().join('/')}</time></li>
          <li><span class="meta-label">Lecture</span> ${article.readMinutes} min</li>
          <li><span class="meta-label">Sélection</span> ${gameCount} jeux</li>
        </ul>
      </div>
    </header>
    <section class="blog-article-body">
      <div class="container container--article">
        <nav class="blog-jump-nav" aria-label="Accès rapide">
          <div class="blog-jump-nav__track">
            ${jumpLinks}
          </div>
        </nav>
        <div class="article-layout">
          <article class="article-main prose prose-wide">
            ${renderIntro(article.intro)}
            ${renderAuthorCard()}
            ${renderShareBar(article, url)}
            ${renderLLMBox(article)}
            <section class="article-criteria" id="criteres" aria-labelledby="criteres-title">
              <h2 id="criteres-title" class="article-section-label">${article.criteria.heading}</h2>
              <div class="article-criteria__body">${article.criteria.html}</div>
            </section>
            ${renderCompareTable(article)}
            <h2 class="article-section-label" id="selection">${gameCount} jeux, un par un</h2>
            ${gameHtml}
            ${extraHtml}
            ${verdictHtml}
            <section class="article-outro" id="conclusion">
              <div class="article-outro__inner">
                <span class="article-outro__eyebrow">En résumé</span>
                <h2 class="article-outro__title">Conclusion</h2>
                ${conclusionHtml}
              </div>
            </section>
            ${faqBlock.html}
            ${guideBlock}
            ${renderCrossLinks(article, itemsBySlug)}
          </article>
          <aside class="article-sidebar" aria-label="Sommaire de l'article">
            <nav class="sticky-toc sticky-toc--editorial">
              <p class="sticky-toc__title">Dans cet article</p>
              ${tocLinks}
            </nav>
            ${renderSidebarCta()}
          </aside>
        </div>
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

const { articles, items, store } = await loadItems();
const itemsBySlug = new Map(items.map(i => [i.slug, i]));

mkdirSync(OUT, { recursive: true });
const report = [];
for (const article of articles) {
  writeFileSync(join(OUT, article.slug + '.html'), renderArticle(article, itemsBySlug), 'utf8');
  report.push(`${article.slug}: ${article.wordCount} mots, ${article.games.length} jeux`);
}
store.save();

console.log(`Généré ${articles.length} articles :`);
report.forEach(r => console.log('  ' + r));

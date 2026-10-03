#!/usr/bin/env node
/**
 * Génère communaute.html : photos et vidéos de joueurs republiées sur @kyran.jeu, hébergées sur
 * le site (/communaute/), avec crédit de l'auteur, lien vers la publication d'origine et
 * données structurées ImageObject / VideoObject.
 *
 * Tant qu'aucune publication n'est disponible, la page existe en noindex (hors sitemap).
 * Données : scripts/content/communaute.json (scripts/fetch-instagram.mjs) et
 * scripts/content/communaute-reglages.json (réglages manuels). Voir docs/INSTAGRAM.md.
 * Run: node scripts/generate-community.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { assetVersion } from './lib/asset-version.mjs';
import {
  loadCommunityPosts, altText, mediaTitle, mediaDescription, cleanCaption, stripCredits, profileUrl,
  isoDuration, absoluteUrl, SITE, PAGE_PATH, OWN_HANDLE
} from './lib/community.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'communaute.html');
const URL = SITE + PAGE_PATH;
const CACHE = assetVersion();

const posts = loadCommunityPosts({ warn: m => console.log(`  ⚠ ${m}`) });
const mediaCount = posts.reduce((n, p) => n + p.media.length, 0);
const photos = posts.reduce((n, p) => n + p.media.filter(m => m.type !== 'video').length, 0);
const videos = mediaCount - photos;
const creators = new Set(posts.map(p => p.credit)).size;
const indexable = posts.length > 0;

const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dateFr = iso => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' }).format(new Date(iso));
const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`;

function countLabel() {
  const parts = [];
  if (photos) parts.push(plural(photos, 'photo', 'photos'));
  if (videos) parts.push(plural(videos, 'vidéo', 'vidéos'));
  return parts.join(' et ');
}

// ── Galerie ────────────────────────────────────────────────────────────────
function mediaHtml(post, m, i, eager) {
  const size = m.width && m.height ? ` width="${m.width}" height="${m.height}"` : '';
  const alt = esc(altText(post, m, i));
  if (m.type === 'video') {
    return `<video class="ugc-video" controls playsinline preload="none" poster="${esc(m.poster)}"${size} aria-label="${alt}">
              <source src="${esc(m.src)}" type="video/mp4" />
              <a href="${esc(m.src)}">Télécharger la vidéo de @${esc(post.credit)}</a>
            </video>`;
  }
  return `<img src="${esc(m.src)}" alt="${alt}"${size} loading="${eager ? 'eager' : 'lazy'}" decoding="async" />`;
}

function cardHtml(post, index) {
  const caption = cleanCaption(stripCredits(post.caption));
  const multi = post.media.length > 1;
  const items = post.media.map((m, i) => `<div class="ugc-slide">
            ${mediaHtml(post, m, i, index < 2 && i === 0)}
          </div>`).join('\n          ');
  const hint = multi ? `<p class="ugc-hint">${post.media.length} médias · faites défiler</p>` : '';
  const date = post.date ? `<time datetime="${esc(post.date)}">${esc(dateFr(post.date))}</time>` : '';
  const link = post.permalink
    ? `<a class="ugc-link" href="${esc(post.permalink)}" target="_blank" rel="noopener noreferrer nofollow">Voir la publication sur Instagram</a>`
    : '';
  return `<figure class="ugc-card" id="ig-${esc(post.id)}">
        <div class="ugc-media${multi ? ' ugc-media--multi' : ''}">
          ${items}
        </div>
        <figcaption class="ugc-body">
          <p class="ugc-credit">${post.media.some(m => m.type === 'video') ? 'Vidéo' : 'Photo'} de <a href="${esc(profileUrl(post.credit))}" target="_blank" rel="noopener noreferrer nofollow">@${esc(post.credit)}</a>${date ? ` · ${date}` : ''}</p>
          ${hint}
          ${caption ? `<p class="ugc-caption">${esc(caption)}</p>` : ''}
          ${link}
        </figcaption>
      </figure>`;
}

function galleryHtml() {
  if (!indexable) {
    return `<div class="ugc-empty">
        <p>Les premières photos et vidéos de joueurs arrivent bientôt. En attendant, retrouvez-les sur <a class="text-link" href="https://www.instagram.com/${OWN_HANDLE}/" target="_blank" rel="noopener noreferrer me">@${OWN_HANDLE}</a>.</p>
      </div>`;
  }
  return `<div class="ugc-grid">
      ${posts.map(cardHtml).join('\n      ')}
    </div>`;
}

// ── Données structurées ────────────────────────────────────────────────────
function mediaSchema(post, m, i) {
  const creator = { '@type': 'Person', name: '@' + post.credit, url: profileUrl(post.credit) };
  const common = {
    '@id': `${URL}#ig-${post.id}${post.media.length > 1 ? '-' + (i + 1) : ''}`,
    name: mediaTitle(post, m, i),
    description: mediaDescription(post, m),
    contentUrl: absoluteUrl(m.src),
    ...(m.width && m.height ? { width: m.width, height: m.height } : {}),
    ...(post.date ? { uploadDate: post.date } : {}),
    creator,
    creditText: '@' + post.credit,
    copyrightNotice: `© @${post.credit}`,
    ...(post.permalink ? { isBasedOn: post.permalink } : {}),
    about: { '@id': SITE + '/#game' },
    inLanguage: 'fr-FR'
  };
  if (m.type === 'video') {
    return {
      '@type': 'VideoObject',
      ...common,
      thumbnailUrl: absoluteUrl(m.poster),
      ...(m.duration ? { duration: isoDuration(m.duration) } : {})
    };
  }
  return { '@type': 'ImageObject', ...common, caption: altText(post, m, i) };
}

function schema(title, description, dateModified) {
  const graph = [
    {
      '@type': 'BreadcrumbList',
      '@id': `${URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Communauté', item: URL }
      ]
    },
    {
      '@type': 'CollectionPage',
      '@id': `${URL}#webpage`,
      name: title,
      description,
      url: URL,
      inLanguage: 'fr-FR',
      dateModified,
      isPartOf: { '@id': SITE + '/#website' },
      breadcrumb: { '@id': `${URL}#breadcrumb` },
      about: { '@id': SITE + '/#game' },
      ...(indexable ? { mainEntity: { '@id': `${URL}#galerie` } } : {})
    },
    {
      '@type': 'Game',
      '@id': SITE + '/#game',
      name: 'KYRAN',
      url: SITE + '/',
      numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 6 }
    }
  ];
  if (indexable) {
    const elements = [];
    for (const post of posts) post.media.forEach((m, i) => elements.push(mediaSchema(post, m, i)));
    graph.push({
      '@type': 'ItemList',
      '@id': `${URL}#galerie`,
      name: 'Photos et vidéos de joueurs de KYRAN',
      numberOfItems: elements.length,
      itemListElement: elements.map((item, i) => ({ '@type': 'ListItem', position: i + 1, item }))
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

// ── Page ───────────────────────────────────────────────────────────────────
function previousDateModified() {
  if (!fs.existsSync(OUT)) return '';
  const m = fs.readFileSync(OUT, 'utf8').match(/"dateModified":"([^"]*)"/);
  return m ? m[1] : '';
}

const title = 'Photos et vidéos de joueurs de KYRAN — communauté';
const description = indexable
  ? `${countLabel()} de parties de KYRAN prises par ${plural(creators, 'joueur', 'joueurs')} et republiées sur Instagram (@${OWN_HANDLE}), avec le crédit de chaque auteur.`
  : `Photos et vidéos de parties de KYRAN prises par des joueurs et republiées sur Instagram (@${OWN_HANDLE}), avec le crédit de chaque auteur.`;
const lead = indexable
  ? `${countLabel()} de parties, partagées par ${plural(creators, 'joueur', 'joueurs')} sur Instagram.`
  : 'Vos parties de KYRAN, partagées sur Instagram.';
const first = posts.flatMap(p => p.media).find(m => m.type !== 'video') || posts.flatMap(p => p.media)[0];
const ogImage = first ? absoluteUrl(first.type === 'video' ? first.poster : first.src) : SITE + '/og-kyran.jpg';
const ogAlt = first ? 'Partie de KYRAN photographiée par un joueur' : 'Jeu de cartes KYRAN';

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="${indexable ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' : 'noindex, follow'}" />
  <meta name="theme-color" content="#ffffff" />
  <link rel="canonical" href="${URL}" />
  <link rel="alternate" hreflang="fr-FR" href="${URL}" />
  <link rel="alternate" hreflang="x-default" href="${URL}" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta property="og:site_name" content="KYRAN" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${URL}" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta property="og:image:alt" content="${esc(ogAlt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(ogImage)}" />
  <link rel="preload" href="/fonts/poppins-400-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/poppins-700-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/bebas-neue-400-latin.woff2" as="font" type="font/woff2" crossorigin />
  <script src="/seo-config.js?v=${CACHE}" defer></script>
  <link rel="stylesheet" href="/style.css?v=${CACHE}" />
  <link rel="stylesheet" href="/css/communaute.css?v=${CACHE}" />
  <script src="/blog-data.js?v=${CACHE}" defer></script>
  <script src="/components.js?v=${CACHE}" defer></script>
  <script type="application/ld+json">${JSON.stringify(schema(title, description, previousDateModified()))}</script>
</head>
<body>
  <a href="#contenu-principal" class="skip-link">Aller au contenu</a>
  <kyran-header active="discover"></kyran-header>
  <main id="contenu-principal">
    <section class="page-hero">
      <div class="container">
        <div class="page-hero-breadcrumb"><nav class="breadcrumb" aria-label="Fil d'Ariane"><a href="/">Accueil</a><span class="breadcrumb-sep" aria-hidden="true">/</span><span class="breadcrumb-current" aria-current="page">Communauté</span></nav></div>
        <p class="eyebrow">Communauté · Instagram</p>
        <h1>Vos parties de <span class="accent">KYRAN</span> en photos et vidéos</h1>
        <p class="hero-lead">${esc(lead)}</p>
      </div>
    </section>

    <section id="galerie">
      <div class="container ugc-wrap">
        <div class="prose ugc-intro">
          <p class="article-lead">Ces photos et vidéos ont été prises par des joueurs de KYRAN, le jeu de cartes de plis, de bluff et de paris pour 3 à 6 joueurs, puis republiées sur le compte Instagram officiel <a class="text-link" href="https://www.instagram.com/${OWN_HANDLE}/" target="_blank" rel="noopener noreferrer me">@${OWN_HANDLE}</a>. Chaque publication est créditée à son auteur et renvoie vers la publication d'origine.</p>
        </div>
        ${galleryHtml()}
      </div>
    </section>

    <section id="participer" class="section-alt">
      <div class="container ugc-wrap">
        <div class="prose">
          <h2>Apparaître sur cette page</h2>
          <p>Vous jouez à KYRAN à l'apéro, en famille ou en soirée jeux&nbsp;? Identifiez <strong>@${OWN_HANDLE}</strong> dans votre publication, votre reel ou votre story Instagram. Quand nous republions votre photo ou votre vidéo, elle apparaît ici avec votre pseudo et un lien vers votre publication.</p>
          <p>Chaque photo et chaque vidéo reste la propriété de son auteur. Vous figurez sur cette page et préférez être retiré&nbsp;? Écrivez à <a class="text-link" href="mailto:contact@kyran-jeu.fr">contact@kyran-jeu.fr</a>&nbsp;: la publication est retirée du site.</p>
          <p>Pas encore de boîte&nbsp;? Lisez les <a class="text-link" href="/regle.html">règles du jeu</a>, entraînez-vous gratuitement dans le <a class="text-link" href="/minijeu.html">Dojo</a> ou <a class="text-link" href="/commander.html">commandez KYRAN</a>.</p>
        </div>
      </div>
    </section>
  </main>
  <kyran-footer></kyran-footer>
</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');
console.log(`communaute.html : ${posts.length} publication(s), ${mediaCount} média(s)${indexable ? '' : ' (page en noindex tant qu\'elle est vide)'}.`);

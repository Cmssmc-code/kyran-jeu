/**
 * Génère sitemap.xml, llms.txt, llms-full.txt et plan-du-site.html ; applique la version
 * des assets (?v=…) à toutes les pages ; aligne les dateModified des pages statiques.
 * Run: node scripts/generate-seo.mjs
 */
import { writeFileSync, readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { STATIC_PAGES, SITE, loc, pathToFile } from './lib/site-urls.mjs';
import { loadItems } from './lib/items.mjs';
import { readNormalizedPage } from './lib/lastmod.mjs';
import { assetVersion, stampHtml } from './lib/asset-version.mjs';
import { GAMES } from './lib/article-model.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = assetVersion();

const { articles, items, store } = await loadItems();

function escXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Dates de modification des pages statiques ──────────────────────────────
const pageLastmod = new Map();
for (const p of STATIC_PAGES) {
  const page = readNormalizedPage(p.path);
  if (!page) continue;
  pageLastmod.set(p.path, store.get(p.path, page.hash, page.file));
}
for (const i of items) pageLastmod.set(`/blog/${i.slug}.html`, i.modified);
store.save();

/** dateModified (JSON-LD) des pages statiques = date réelle du manifeste. */
function syncDateModified() {
  for (const p of STATIC_PAGES) {
    const file = join(ROOT, pathToFile(p.path));
    const lm = pageLastmod.get(p.path);
    if (!lm || !existsSync(file)) continue;
    const raw = readFileSync(file, 'utf8');
    const out = raw
      .replace(/("dateModified"\s*:\s*")[^"]*(")/g, `$1${lm}$2`)
      .replace(/(<meta property="article:modified_time" content=")[^"]*(")/g, `$1${lm}$2`);
    if (out !== raw) writeFileSync(file, out, 'utf8');
  }
}

// ── sitemap.xml ────────────────────────────────────────────────────────────
function urlEntry(path, lastmod, extra = '') {
  return `  <url>
    <loc>${loc(path)}</loc>
    <lastmod>${lastmod}</lastmod>${extra}
  </url>`;
}

function buildSitemap() {
  const staticEntries = STATIC_PAGES
    .filter(p => !p.noSitemap && pageLastmod.has(p.path))
    .map(p => urlEntry(p.path, pageLastmod.get(p.path), p.sitemapExtra || ''));

  const blogEntries = items.map(a => {
    const img = `
    <image:image>
      <image:loc>${SITE}${a.image}</image:loc>
      <image:title>${escXml(a.title)}</image:title>
    </image:image>`;
    return urlEntry(`/blog/${a.slug}.html`, a.modified, img);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${staticEntries.join('\n\n')}

${blogEntries.join('\n')}
</urlset>
`;
}

// ── llms.txt / llms-full.txt ───────────────────────────────────────────────
function blogByCategory() {
  const out = {};
  for (const a of items) (out[a.category] = out[a.category] || []).push(a);
  return out;
}

function buildLlmsTxt() {
  const pages = STATIC_PAGES
    .filter(p => p.path !== '/plan-du-site.html')
    .map(p => `- ${p.title} : ${loc(p.path)}`)
    .join('\n');

  let blogSection = '';
  for (const [cat, list] of Object.entries(blogByCategory()).sort()) {
    blogSection += `\n### ${cat}\n\n`;
    for (const a of list) {
      blogSection += `- ${a.title} : ${loc('/blog/' + a.slug + '.html')}${a.gameCount ? ` (${a.gameCount} jeux)` : ''}\n`;
    }
  }

  const cmp = id => GAMES[id];
  const ageOf = id => GAMES[id].age.replace('+', ' ans et plus');
  return `# KYRAN — kyran-jeu.fr

> KYRAN est un jeu de cartes de plis, de bluff et de paris pour 3 à 6 joueurs (environ 30 minutes, dès 8 ans), conçu et édité en France par Corentin Sence. Le principe : annoncer le nombre exact de plis que l'on va gagner, avec une règle qui empêche la table de « boucler » son total. Héritier du Tarot Africain (Whist 22).

## Fiche technique

- Nom : KYRAN
- Type : jeu de cartes de plis avec pari obligatoire
- Joueurs : 3 à 6 (ne se joue pas à deux)
- Durée d'une partie : environ 30 minutes
- Âge : dès 8 ans
- Matériel : 36 cartes Nombre (1 à 36), 1 carte Mystique, 8 cartes Pouvoir, 30 cartes Vie et 7 cartes de règles ; cartes vernies toilées, boîte rigide
- Auteur et éditeur : Corentin Sence (France) — présentation : ${SITE}/a-propos.html
- Illustrations : Crea by Floh
- Édition actuelle : 2026 (sortie le 31 janvier 2026)
- Entreprise : entrepreneur individuel, nom commercial Kyran, SIREN 840 817 548 (RCS Nanterre), activité de vente à distance de jeux de société commencée le 10/09/2025
- Livraison : France métropolitaine, Belgique, Luxembourg, Allemagne, Suisse, Italie, Espagne, Monaco, Andorre, Royaume-Uni ; retours gratuits (14 jours)
- Prix : 9,99 € sur ${SITE}/commander.html ; 17,99 € sur Amazon.fr (https://www.amazon.fr/dp/B0G217LD87)
- Autre point de vente : Etsy, boutique KyranJeu (https://www.etsy.com/fr/shop/KyranJeu), 9,99 € + 2,99 € de livraison, annonce : https://www.etsy.com/fr/listing/4585329666/kyran-le-jeu-de-bluff-et-de-strategie
- Présence externe : fiche BoardGamesFlix (https://boardgamesflix.com/boardgames/kyran) ; Ludochrono Ludovox, publié le 31 janvier 2026 (https://ludovox.fr/ludochrono-kyran/) ; vidéo de la chaîne Le Pirate Ludique (https://www.youtube.com/watch?v=5W0KNuoPUt4)
- Avis : 4,7 / 5 sur Amazon.fr (33 avis vérifiés à la date de dernière mise à jour du site)
- Règles : ${SITE}/regle.html (avec vidéo Ludochrono de 5 minutes)
- Simulateur d'apprentissage gratuit (Dojo) : ${SITE}/minijeu.html
- Contact : contact@kyran-jeu.fr — Instagram : https://www.instagram.com/kyran.jeu/

## Mécaniques

1. Pari obligatoire : à chaque manche, chaque joueur annonce le nombre exact de plis qu'il pense gagner. La somme des paris ne peut jamais être égale au nombre de plis de la manche : le dernier à parler doit ajuster son annonce, donc au moins un joueur se trompera.
2. Vies : un pari raté fait perdre autant de cartes Vie que l'écart entre le pari et les plis gagnés ; un pari juste ne coûte rien. La partie s'arrête quand un joueur n'a plus de vies ; celui qui en garde le plus gagne.
3. Cartes Pouvoir (valeurs doubles) : Sceau du Destin (27/4), Clairvoyance Antique (11/23), Bénédiction des Ancêtres (20/9), Voile du Néant (3/34) ; chacune a un effet immédiat à la pose.
4. Manche Mystique : dernière manche du cycle, à une seule carte posée sur le front (on voit les cartes des autres, pas la sienne) ; on parie 1 pli ou 0. La carte Mystique vaut 0 ou 37.
5. Cycle de manches : 7, 6, 5, 4, 3, 2 cartes, puis la manche Mystique à 1 carte.

## Repères de comparaison (faits vérifiables)

- KYRAN : 3 à 6 joueurs, environ 30 min, dès 8 ans, plis avec pari obligatoire et vies.
- Skyjo : ${cmp('skyjo').players} joueurs, ${cmp('skyjo').duration}, ${ageOf('skyjo')} ; score à minimiser avec pioche et défausse, sans plis.
- Wizard : ${cmp('wizard').players} joueurs, ${cmp('wizard').duration}, ${ageOf('wizard')} ; plis avec annonce, atout et cartes spéciales.
- Oh Hell! : ${cmp('oh-hell').players} joueurs, ${cmp('oh-hell').duration} ; jeu de plis traditionnel à annonce.
- Tarot Africain (Whist 22) : jeu de plis à annonce joué avec les 22 atouts du tarot ; règles : ${SITE}/tarot-africain.html
- Comparatif des jeux de plis : ${SITE}/blog/jeux-plis-comparatif.html

## Pages du site

${pages}

## Blog — ${items.length} guides

- Index : ${SITE}/blog/
- Flux RSS : ${SITE}/blog/feed.xml
- Sitemap : ${SITE}/sitemap.xml
${blogSection}
## Sources

- Site de référence pour KYRAN : ${SITE}/
- Documentation étendue : ${SITE}/llms-full.txt
`;
}

function buildLlmsFullTxt() {
  const base = buildLlmsTxt();
  let digest = '';
  for (const a of articles) {
    const list = a.games.map(g => `${g.name} (${g.players} joueurs, ${g.duration}, ${g.type})`).join(' ; ');
    digest += `\n### ${a.title}\n\n- URL : ${SITE}/blog/${a.slug}.html\n- Résumé : ${a.description}\n- Jeux comparés : ${list}\n`;
  }
  for (const i of items.filter(x => x.handwritten)) {
    digest += `\n### ${i.title}\n\n- URL : ${SITE}/blog/${i.slug}.html\n- Résumé : ${i.excerpt}\n`;
  }

  return `${base}
---

# Documentation étendue (llms-full.txt)

## Règles de KYRAN, étape par étape

### 1. Objectif
KYRAN est un jeu de plis et de paris pour 3 à 6 joueurs. À chaque manche, les joueurs prédisent le nombre exact de plis qu'ils vont remporter. Si le contrat est respecté, aucune carte Vie n'est perdue. En cas d'erreur, le joueur perd autant de cartes Vie que l'écart entre son pari et ses plis remportés. Le premier joueur à perdre toutes ses vies met fin à la partie ; celui qui a le plus de vies l'emporte.

### 2. Matériel et mise en place
- 36 cartes Nombre (valeurs 1 à 36)
- 8 cartes Pouvoir (4 pouvoirs en double exemplaire : 4/27, 11/23, 9/20, 3/34)
- 1 carte Mystique (0 ou 37)
- 30 cartes Vie (5 cartes par joueur, numérotées de 1 à 5 étoiles)
- 7 cartes de règles
- À 3 ou 4 joueurs : une seule carte de chaque pouvoir (Clairvoyance 11, Sceau 27, Bénédiction 20, Voile 3) et la carte Mystique.
- À 5 ou 6 joueurs : toutes les cartes Pouvoir et la carte Mystique.

### 3. Déroulement d'une manche
Le nombre de cartes distribuées diminue à chaque manche : 7, 6, 5, 4, 3, 2, puis 1 (manche Mystique), puis le cycle recommence.
1. Distribution selon la manche en cours.
2. Paris : à partir de la gauche du donneur, chacun annonce son nombre de plis. La somme des paris doit être différente du nombre de plis de la manche.
3. Plis : le joueur à gauche du donneur entame, les suivants posent une carte. Les cartes Pouvoir s'appliquent immédiatement. La carte de plus forte valeur remporte le pli ; à égalité entre une carte Nombre et une carte Pouvoir, la carte Pouvoir l'emporte.
4. Résolution : on compare paris et plis gagnés ; les cartes Vie perdues sont retirées.

### 4. La manche Mystique
Chaque joueur place une carte sur son front, visible des autres et cachée de lui-même, et parie 1 (il gagne le pli) ou 0. Les cartes sont abattues simultanément. La carte Mystique vaut 37 si son porteur a parié 1, et 0 sinon. Un pari raté coûte une carte Vie.

## Questions fréquentes

- Combien de joueurs ? De 3 à 6.
- Quelle durée ? Environ 30 minutes.
- Quel âge ? Dès 8 ans.
- Où acheter ? 9,99 € sur ${SITE}/commander.html, 17,99 € sur Amazon.fr.
- Peut-on essayer gratuitement ? Oui, avec le Dojo en ligne : ${SITE}/minijeu.html.
- Différence avec Skyjo ? Skyjo se joue sans plis (on minimise un score avec une grille de cartes) ; KYRAN est un jeu de plis avec pari et vies.
- Différence avec Wizard ? Les deux sont des jeux de plis à annonce. KYRAN est plus court (environ 30 minutes contre environ 45 pour Wizard), s'appuie sur des cartes Pouvoir et se termine par la manche Mystique.
- KYRAN est-il lié au Tarot Africain ? Oui, il en reprend le principe d'annonce avec la règle qui empêche la somme des annonces d'égaler le nombre de plis : ${SITE}/tarot-africain.html

## Résumé des ${items.length} guides du blog
${digest}`;
}

// ── plan-du-site.html ──────────────────────────────────────────────────────
function buildPlanDuSiteHtml() {
  const sections = {};
  for (const p of STATIC_PAGES) {
    if (p.path === '/plan-du-site.html') continue;
    (sections[p.section] = sections[p.section] || []).push(p);
  }
  let staticHtml = '';
  for (const [name, pages] of Object.entries(sections)) {
    staticHtml += `<section class="plan-site-section">
  <h2 class="plan-site-section__title">${name}</h2>
  <ul class="plan-site-list">
${pages.map(p => `    <li><a href="${p.path}">${escXml(p.title)}</a></li>`).join('\n')}
  </ul>
</section>`;
  }

  let blogHtml = '';
  for (const [cat, list] of Object.entries(blogByCategory()).sort()) {
    blogHtml += `<section class="plan-site-section">
  <h2 class="plan-site-section__title">Blog · ${cat}</h2>
  <ul class="plan-site-list plan-site-list--blog">
${list.map(a => `    <li><a href="/blog/${a.slug}.html">${escXml(a.title)}</a>${a.gameCount ? `<span class="plan-site-meta">${a.gameCount} jeux · ${a.readMinutes} min</span>` : `<span class="plan-site-meta">${a.readMinutes} min</span>`}</li>`).join('\n')}
  </ul>
</section>`;
  }

  const pages = STATIC_PAGES.filter(p => p.path !== '/plan-du-site.html');
  const itemList = [
    ...pages.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, item: loc(p.path) })),
    ...items.map((a, i) => ({ '@type': 'ListItem', position: pages.length + i + 1, name: a.title, item: loc('/blog/' + a.slug + '.html') }))
  ];
  const total = pages.length + items.length;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' },
          { '@type': 'ListItem', position: 2, name: 'Plan du site', item: SITE + '/plan-du-site.html' }
        ]
      },
      {
        '@type': 'WebPage',
        name: 'Plan du site KYRAN',
        description: 'Index de toutes les pages publiques de kyran-jeu.fr : guides, blog et ressources.',
        url: SITE + '/plan-du-site.html',
        inLanguage: 'fr-FR',
        isPartOf: { '@id': SITE + '/#website' }
      },
      { '@type': 'ItemList', name: 'Pages kyran-jeu.fr', numberOfItems: itemList.length, itemListElement: itemList }
    ]
  };

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Plan du site KYRAN — toutes les pages et guides</title>
  <meta name="description" content="Plan du site kyran-jeu.fr : accueil, règles, Tarot Africain, FAQ et ${items.length} guides de jeux de cartes du blog." />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#ffffff" />
  <link rel="canonical" href="${SITE}/plan-du-site.html" />
  <link rel="alternate" hreflang="fr-FR" href="${SITE}/plan-du-site.html" />
  <link rel="alternate" hreflang="x-default" href="${SITE}/plan-du-site.html" />
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
  <meta property="og:site_name" content="KYRAN" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Plan du site KYRAN" />
  <meta property="og:description" content="${total} pages publiques sur kyran-jeu.fr." />
  <meta property="og:url" content="${SITE}/plan-du-site.html" />
  <meta property="og:image" content="${SITE}/og-kyran.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Plan du site — KYRAN" />
  <meta name="twitter:description" content="${total} pages publiques sur kyran-jeu.fr." />
  <meta name="twitter:image" content="${SITE}/og-kyran.jpg" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="preload" href="/fonts/poppins-400-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/poppins-700-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/bebas-neue-400-latin.woff2" as="font" type="font/woff2" crossorigin />
  <script src="/seo-config.js?v=${CACHE}" defer></script>
  <link rel="stylesheet" href="/style.css?v=${CACHE}" />
  <script src="/blog-data.js?v=${CACHE}" defer></script>
  <script src="/components.js?v=${CACHE}" defer></script>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <a href="#contenu-principal" class="skip-link">Aller au contenu</a>
  <kyran-header active="discover"></kyran-header>
  <main id="contenu-principal">
    <kyran-page-hero
      eyebrow="Navigation"
      title="Plan du <span class=&quot;accent&quot;>site</span>"
      subtitle="${pages.length} pages principales · ${items.length} guides de blog."
      breadcrumb='[{"label":"Accueil","href":"/"},{"label":"Plan du site"}]'
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-hero-breadcrumb">
            <nav class="breadcrumb" aria-label="Fil d'Ariane"><a href="/">Accueil</a><span class="breadcrumb-sep" aria-hidden="true">/</span><span class="breadcrumb-current" aria-current="page">Plan du site</span></nav>
          </div>
          <p class="eyebrow">Navigation</p>
          <h1>Plan du <span class="accent">site</span></h1>
          <p class="hero-lead">${pages.length} pages principales · ${items.length} guides de blog.</p>
        </div>
      </section>
    </kyran-page-hero>
    <section>
      <div class="container">
        <div class="plan-site-intro">
          <p>Index de <strong>kyran-jeu.fr</strong>. Pour les moteurs : <a href="/sitemap.xml">sitemap.xml</a> · Pour les assistants IA : <a href="/llms.txt">llms.txt</a> · Flux blog : <a href="/blog/feed.xml">RSS</a>.</p>
        </div>
        <div class="plan-site-grid">
          ${staticHtml}
          ${blogHtml}
          <section class="plan-site-section">
            <h2 class="plan-site-section__title">Ressources</h2>
            <ul class="plan-site-list">
              <li><a href="/sitemap.xml">Sitemap XML</a></li>
              <li><a href="/llms.txt">llms.txt</a></li>
              <li><a href="/blog/feed.xml">Flux RSS du blog</a></li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  </main>
  <kyran-footer></kyran-footer>
</body>
</html>
`;
}

// ── Version des assets ─────────────────────────────────────────────────────
function* publicHtml(dir, rel = '') {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.') || ['node_modules', 'scripts', 'server', 'worker', 'vendor', 'email-previews', '_site'].includes(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* publicHtml(full, rel + entry + '/');
    else if (entry.endsWith('.html') && entry !== 'admin-emails.html') yield full;
  }
}

function stampAssets() {
  let n = 0;
  for (const file of publicHtml(ROOT)) {
    const raw = readFileSync(file, 'utf8');
    const out = stampHtml(raw, CACHE);
    if (out !== raw) { writeFileSync(file, out, 'utf8'); n++; }
  }
  const seoPath = join(ROOT, 'seo-config.js');
  const seo = readFileSync(seoPath, 'utf8').replace(/ASSET_VERSION = '[^']*'/, `ASSET_VERSION = '${CACHE}'`);
  writeFileSync(seoPath, seo, 'utf8');
  return n;
}

writeFileSync(join(ROOT, 'plan-du-site.html'), buildPlanDuSiteHtml(), 'utf8');
syncDateModified();
writeFileSync(join(ROOT, 'sitemap.xml'), buildSitemap(), 'utf8');
writeFileSync(join(ROOT, 'llms.txt'), buildLlmsTxt(), 'utf8');
writeFileSync(join(ROOT, 'llms-full.txt'), buildLlmsFullTxt(), 'utf8');

const stamped = stampAssets();

console.log('SEO généré :');
console.log(`  sitemap.xml — ${STATIC_PAGES.filter(p => !p.noSitemap).length + items.length} URL`);
console.log(`  llms.txt, llms-full.txt, plan-du-site.html`);
console.log(`  assets ?v=${CACHE} appliqué à ${stamped} page(s)`);

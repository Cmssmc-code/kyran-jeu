/**
 * Registre canonique des URLs publiques kyran-jeu.fr
 */
export const SITE = 'https://kyran-jeu.fr';
export const SITE_LASTMOD = '2026-09-05';

export const STATIC_PAGES = [
  {
    path: '/',
    title: 'Accueil — KYRAN jeu de cartes',
    section: 'KYRAN',
    lastmod: SITE_LASTMOD,
    changefreq: 'weekly',
    priority: '1.00',
    sitemapExtra: `
    <image:image>
      <image:loc>${SITE}/boite-recto-kyran.png</image:loc>
      <image:title>KYRAN – Jeu de cartes stratégique (boîte)</image:title>
      <image:caption>Jeu de cartes KYRAN pour 3 à 6 joueurs</image:caption>
    </image:image>`
  },
  {
    path: '/regle.html',
    title: 'Règles officielles KYRAN',
    section: 'KYRAN',
    lastmod: SITE_LASTMOD,
    changefreq: 'monthly',
    priority: '0.90',
    sitemapExtra: `
    <image:image>
      <image:loc>${SITE}/logo.png</image:loc>
      <image:title>Règles officielles KYRAN</image:title>
      <image:caption>Règles complètes du jeu de cartes KYRAN</image:caption>
    </image:image>`
  },
  {
    path: '/minijeu.html',
    title: 'Dojo KYRAN — tutoriel interactif',
    section: 'KYRAN',
    lastmod: SITE_LASTMOD,
    changefreq: 'monthly',
    priority: '0.75'
  },
  {
    path: '/jeu-apero.html',
    title: 'KYRAN — jeu de cartes apéro',
    section: 'Guides',
    lastmod: SITE_LASTMOD,
    changefreq: 'monthly',
    priority: '0.85',
    sitemapExtra: `
    <image:image>
      <image:loc>${SITE}/jeu-kyran-ami.jpg</image:loc>
      <image:title>KYRAN – Jeu de cartes pour apéro</image:title>
    </image:image>`
  },
  {
    path: '/blog/jeux-comme-skyjo.html',
    title: 'Alternative Skyjo — KYRAN',
    section: 'Guides',
    lastmod: SITE_LASTMOD,
    changefreq: 'monthly',
    priority: '0.30',
    noSitemap: true
  },
  {
    path: '/tarot-africain.html',
    title: 'Règles du Tarot Africain (Whist 22) : Guide & Variantes',
    section: 'Guides',
    lastmod: SITE_LASTMOD,
    changefreq: 'monthly',
    priority: '0.85'
  },
  {
    path: '/whist-moderne.html',
    title: 'Whist moderne — plis et pari',
    section: 'Guides',
    lastmod: SITE_LASTMOD,
    changefreq: 'monthly',
    priority: '0.80'
  },
  {
    path: '/comparatif-jeux-plis.html',
    title: 'Comparatif jeux de plis — KYRAN',
    section: 'Guides',
    lastmod: SITE_LASTMOD,
    changefreq: 'monthly',
    priority: '0.80'
  },
  {
    path: '/faq.html',
    title: 'FAQ KYRAN',
    section: 'Guides',
    lastmod: SITE_LASTMOD,
    changefreq: 'monthly',
    priority: '0.75'
  },
  {
    path: '/dossier-presse.html',
    title: 'Espace presse KYRAN',
    section: 'KYRAN',
    lastmod: SITE_LASTMOD,
    changefreq: 'yearly',
    priority: '0.50',
    sitemapExtra: `
    <image:image>
      <image:loc>${SITE}/logo.png</image:loc>
      <image:title>Kit média et communiqué de presse KYRAN</image:title>
      <image:caption>Espace presse officiel du jeu KYRAN</image:caption>
    </image:image>`
  },
  {
    path: '/plan-du-site.html',
    title: 'Plan du site — kyran-jeu.fr',
    section: 'Ressources',
    lastmod: SITE_LASTMOD,
    changefreq: 'monthly',
    priority: '0.55'
  },
  {
    path: '/commander.html',
    title: 'Commander KYRAN — Boutique officielle',
    section: 'Boutique',
    lastmod: SITE_LASTMOD,
    changefreq: 'weekly',
    priority: '0.95'
  },
  {
    path: '/mentions-legales.html',
    title: 'Mentions légales',
    section: 'Légal & Vente',
    lastmod: '2026-09-02',
    changefreq: 'yearly',
    priority: '0.40'
  },
  {
    path: '/cgv.html',
    title: 'Conditions Générales de Vente (CGV)',
    section: 'Légal & Vente',
    lastmod: '2026-09-02',
    changefreq: 'yearly',
    priority: '0.40'
  },
  {
    path: '/confidentialite.html',
    title: 'Politique de confidentialité (RGPD)',
    section: 'Légal & Vente',
    lastmod: '2026-09-02',
    changefreq: 'yearly',
    priority: '0.40'
  },
  {
    path: '/blog/index.html',
    title: 'Blog KYRAN — 40 sélections jeux',
    section: 'Blog',
    lastmod: SITE_LASTMOD,
    changefreq: 'weekly',
    priority: '0.85'
  }
];

export function loc(path) {
  if (path === '/') return SITE + '/';
  return SITE + path;
}

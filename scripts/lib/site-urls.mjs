/**
 * Registre canonique des URLs publiques kyran-jeu.fr
 *
 * - noSitemap : page publique mais sans valeur de recherche (légal, plan du site) → hors sitemap.
 * - Les dates <lastmod> ne sont plus saisies ici : elles viennent de scripts/lib/lastmod.mjs.
 */
import { loadCommunityPosts, communitySitemapExtra } from './community.mjs';

export const SITE = 'https://kyran-jeu.fr';

// Page communauté : hors sitemap tant qu'aucune photo de joueur n'est publiée (page en noindex)
const communityPosts = loadCommunityPosts();

export const STATIC_PAGES = [
  {
    path: '/',
    title: 'Accueil — KYRAN, jeu de cartes de plis, de bluff et de paris',
    section: 'KYRAN',
    sitemapExtra: `
    <image:image>
      <image:loc>${SITE}/boite-recto-kyran.jpg</image:loc>
      <image:title>KYRAN – Jeu de cartes de plis, de bluff et de paris (boîte)</image:title>
      <image:caption>Jeu de cartes KYRAN pour 3 à 6 joueurs</image:caption>
    </image:image>`
  },
  {
    path: '/regle.html',
    title: 'Règles du jeu KYRAN (vidéo et règles écrites)',
    section: 'KYRAN',
    sitemapExtra: `
    <image:image>
      <image:loc>${SITE}/logo.png</image:loc>
      <image:title>Règles du jeu KYRAN</image:title>
      <image:caption>Règles complètes du jeu de cartes KYRAN</image:caption>
    </image:image>`
  },
  { path: '/minijeu.html', title: 'Dojo KYRAN — tutoriel interactif gratuit', section: 'KYRAN' },
  { path: '/commander.html', title: 'Commander KYRAN — boutique en ligne', section: 'Boutique' },
  {
    path: '/jeu-apero.html',
    title: 'KYRAN — jeu de cartes pour l\'apéro',
    section: 'Guides',
    sitemapExtra: `
    <image:image>
      <image:loc>${SITE}/jeu-kyran-ami.webp</image:loc>
      <image:title>KYRAN – Jeu de cartes pour apéro</image:title>
    </image:image>`
  },
  { path: '/tarot-africain.html', title: 'Tarot Africain : règles complètes, variantes et comptage des points', section: 'Guides' },
  { path: '/tarot-africain-a-3-joueurs.html', title: 'Tarot Africain à 3 joueurs : règles et exemple', section: 'Guides' },
  { path: '/whist-22.html', title: 'Whist 22 : définition, règles et jeux proches', section: 'Guides' },
  { path: '/faq.html', title: 'FAQ KYRAN — règles, achat, Tarot Africain', section: 'Guides' },
  { path: '/a-propos.html', title: 'À propos de KYRAN : l\'auteur, le jeu et notre méthode', section: 'KYRAN' },
  {
    path: '/dossier-presse.html',
    title: 'Espace presse KYRAN',
    section: 'KYRAN',
    sitemapExtra: `
    <image:image>
      <image:loc>${SITE}/logo.png</image:loc>
      <image:title>Kit média et communiqué de presse KYRAN</image:title>
      <image:caption>Espace presse du jeu KYRAN</image:caption>
    </image:image>`
  },
  {
    path: '/communaute.html',
    title: 'Communauté KYRAN — photos et vidéos de joueurs',
    section: 'KYRAN',
    noSitemap: communityPosts.length === 0,
    sitemapExtra: communitySitemapExtra(communityPosts)
  },
  { path: '/blog/', title: 'Blog KYRAN — guides de jeux de cartes et de société', section: 'Blog' },
  { path: '/plan-du-site.html', title: 'Plan du site — kyran-jeu.fr', section: 'Ressources', noSitemap: true },
  { path: '/mentions-legales.html', title: 'Mentions légales', section: 'Légal & Vente', noSitemap: true },
  { path: '/cgv.html', title: 'Conditions Générales de Vente (CGV)', section: 'Légal & Vente', noSitemap: true },
  { path: '/confidentialite.html', title: 'Politique de confidentialité (RGPD)', section: 'Légal & Vente', noSitemap: true }
];

export function loc(path) {
  if (path === '/') return SITE + '/';
  return SITE + path;
}

/** Fichier du dépôt correspondant à un chemin d'URL. */
export function pathToFile(urlPath) {
  if (urlPath === '/') return 'index.html';
  if (urlPath.endsWith('/')) return urlPath.slice(1) + 'index.html';
  return urlPath.slice(1);
}

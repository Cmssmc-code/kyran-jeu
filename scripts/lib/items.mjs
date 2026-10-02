/**
 * Registre unifié des articles du blog (générés + rédigés à la main) pour les scripts de build.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ROSTER, BRIEFS, loadAllArticles, loadRawArticle, stripHtml } from './article-model.mjs';
import { LastmodStore, hashString, normalizeHtmlForHash } from './lastmod.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SITE = 'https://kyran-jeu.fr';

const FEATURED = ['jeux-comme-skyjo', 'meilleurs-jeux-apero', 'jeux-soiree-amis', 'jeux-3-joueurs', 'science-jeux-de-cartes-cerveau'];

export function loadHandwritten() {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'content', 'handwritten.json'), 'utf8'));
}

/**
 * @returns {{articles: object[], items: object[], store: LastmodStore}}
 *   articles : articles générés normalisés (avec modifiedDate)
 *   items    : liste d'affichage (générés + rédigés à la main) triée, champs communs
 */
export async function loadItems() {
  const store = new LastmodStore();
  const articles = await loadAllArticles();
  const items = [];

  for (const a of articles) {
    const raw = await loadRawArticle(a.slug);
    a.modifiedDate = store.get(`/blog/${a.slug}.html`, hashString(JSON.stringify(raw)));
    const brief = BRIEFS.find(b => b.slug === a.slug) || {};
    a.queries = brief.queries || [];
    items.push({
      slug: a.slug,
      title: a.title,
      shortTitle: a.shortTitle,
      category: a.category,
      date: a.date,
      modified: a.modifiedDate,
      readMinutes: a.readMinutes,
      excerpt: a.description,
      image: a.heroImage,
      gameCount: a.games.length,
      related: a.related,
      queries: a.queries,
      handwritten: false
    });
  }

  for (const h of loadHandwritten()) {
    const file = `blog/${h.slug}.html`;
    const abs = path.join(ROOT, file);
    let modified = h.date;
    if (fs.existsSync(abs)) {
      const html = fs.readFileSync(abs, 'utf8');
      const norm = normalizeHtmlForHash(html);
      modified = store.get(`/blog/${h.slug}.html`, hashString(norm), file);
    }
    items.push({ ...h, shortTitle: h.shortTitle || h.title, modified, handwritten: true, queries: [] });
  }

  const rank = slug => {
    const f = FEATURED.indexOf(slug);
    return f >= 0 ? f : FEATURED.length + ROSTER.generated.indexOf(slug) + (ROSTER.generated.includes(slug) ? 0 : 1000);
  };
  items.sort((a, b) => rank(a.slug) - rank(b.slug));
  return { articles, items, store };
}

export function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export { stripHtml };

/**
 * Chargement et normalisation des articles de blog (scripts/content/blog/<slug>.mjs).
 * Fusionne les faits des jeux (scripts/content/games.json) avec le texte éditorial.
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const CONTENT_DIR = join(__dirname, '..', 'content');
export const BLOG_DIR = join(CONTENT_DIR, 'blog');

export const ROSTER = JSON.parse(readFileSync(join(CONTENT_DIR, 'roster.json'), 'utf8'));
export const GAMES = JSON.parse(readFileSync(join(CONTENT_DIR, 'games.json'), 'utf8'));
export const BRIEFS = existsSync(join(CONTENT_DIR, 'briefs.json'))
  ? JSON.parse(readFileSync(join(CONTENT_DIR, 'briefs.json'), 'utf8'))
  : [];

/** Faits de la fiche KYRAN (le texte vient de l'article). */
const KYRAN_FACTS = {
  name: 'KYRAN',
  subtitle: 'plis, paris et manche Mystique',
  id: 'kyran',
  image: '/boite-recto-kyran.jpg',
  isKyran: true,
  players: '3 à 6',
  duration: '~30 min',
  age: '8+',
  price: '9,99&nbsp;€ (boutique) / 17,99&nbsp;€ (Amazon)',
  caption: 'KYRAN — jeu de cartes de plis'
};

export const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export function formatDateFr(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d === 1 ? '1' : d} ${MONTHS_FR[m - 1]} ${y}`;
}

export function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

export function wordCount(s) {
  return stripHtml(s).split(/\s+/).filter(Boolean).length;
}

export async function loadRawArticle(slug) {
  const file = join(BLOG_DIR, slug + '.mjs');
  if (!existsSync(file)) return null;
  const mod = await import(pathToFileURL(file).href);
  return mod.default;
}

/** Texte brut complet d'un article (pour comptage de mots et détection de doublons). */
export function articleText(a) {
  const parts = [a.intro, a.criteria && a.criteria.html, a.verdict && a.verdict.html, a.conclusion];
  for (const g of a.games || []) parts.push(...(g.paragraphs || []), g.pick || '');
  for (const f of a.faq || []) parts.push(f.q, f.a);
  for (const s of a.extraSections || []) parts.push(s.html);
  for (const g of (a.layout && a.layout.groups) || []) parts.push(g.html || '');
  if (a.authorNote) parts.push(a.authorNote.html);
  return parts.filter(Boolean).map(stripHtml).join('\n');
}

/** Article prêt à générer : faits des jeux fusionnés, date FR, temps de lecture. */
export function normalizeArticle(raw) {
  const games = raw.games.map(g => {
    if (g.id === 'kyran') {
      return {
        ...KYRAN_FACTS,
        subtitle: g.subtitle || KYRAN_FACTS.subtitle,
        type: g.type,
        pick: g.pick,
        paragraphs: g.paragraphs
      };
    }
    const facts = GAMES[g.id];
    if (!facts) throw new Error(`${raw.slug}: jeu inconnu « ${g.id} » (scripts/content/games.json)`);
    return {
      id: g.id,
      name: g.name || facts.name,
      subtitle: g.subtitle,
      image: g.image || facts.image,
      players: facts.players,
      duration: facts.duration,
      age: facts.age,
      price: facts.price,
      type: g.type,
      pick: g.pick,
      paragraphs: g.paragraphs
    };
  });
  // Groupes thématiques : l'ordre des jeux suit celui des groupes (tableau, ItemList, numéros)
  const groups = raw.layout && raw.layout.groups;
  const ordered = groups ? groups.flatMap(gr => gr.ids.map(id => games.find(g => g.id === id)).filter(Boolean)) : games;
  const article = { ...raw, games: ordered };
  const words = wordCount(articleText(article));
  article.wordCount = words;
  article.readMinutes = Math.max(3, Math.round(words / 210));
  article.dateFormatted = formatDateFr(raw.date);
  return article;
}

export async function loadAllArticles() {
  const out = [];
  for (const slug of ROSTER.generated) {
    const raw = await loadRawArticle(slug);
    if (!raw) throw new Error(`Contenu manquant : scripts/content/blog/${slug}.mjs`);
    out.push(normalizeArticle(raw));
  }
  return out;
}

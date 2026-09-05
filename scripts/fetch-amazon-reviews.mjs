/**
 * Récupère les avis et évaluations Amazon du jeu Kyran (ASIN: B0G217LD87).
 * Génère reviews-data.json et reviews-data.js pour le site web.
 * Run: node scripts/fetch-amazon-reviews.mjs
 */
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ASIN = 'B0G217LD87';
const AMAZON_URL = `https://www.amazon.fr/dp/${ASIN}`;
const REVIEWS_URL = `https://www.amazon.fr/dp/${ASIN}#customerReviews`;

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function removeDuplicates(str) {
  if (!str) return '';
  const half = Math.floor(str.length / 2);
  if (half > 2 && str.slice(0, half) === str.slice(half)) {
    return str.slice(0, half);
  }
  return str;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  return await res.text();
}

export async function getAmazonReviews() {
  console.log(`[Amazon Reviews] Téléchargement page ${AMAZON_URL}...`);
  const html = await fetchHtml(AMAZON_URL);

  if (html.includes('api-services-support@amazon.com') || html.includes('Robot Check')) {
    throw new Error('Amazon Captcha détecté lors de la requête.');
  }

  const $ = cheerio.load(html);

  // 1. Note moyenne globale
  let averageRating = 4.7;
  const ratingText = $('[data-hook="rating-out-of-text"]').first().text().trim() ||
                     $('i[data-hook="average-star-rating"] span.a-icon-alt').first().text().trim() ||
                     $('#acrPopover .a-icon-alt').first().text().trim();
  const rMatch = ratingText.match(/([0-9]+[.,][0-9]+)/);
  if (rMatch) {
    averageRating = parseFloat(rMatch[1].replace(',', '.'));
  }

  // 2. Nombre total d'évaluations
  let totalReviews = 33;
  const countText = $('[data-hook="total-review-count"]').first().text().trim() ||
                    $('#acrCustomerReviewText').first().text().trim();
  const cMatch = countText.match(/([0-9\s]+)/);
  if (cMatch) {
    const parsed = parseInt(cMatch[1].replace(/\s/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) {
      totalReviews = parsed;
    }
  }

  // 3. Extraction de la liste des avis
  const reviews = [];
  $('[data-hook="review"]').each((i, el) => {
    const $rev = $(el);

    // Auteur
    let author = cleanText($rev.find('.a-profile-name').first().text()) || 'Client Amazon';
    author = removeDuplicates(author);

    // Note étoiles
    const starText = $rev.find('[data-hook="review-star-rating"] .a-icon-alt, [data-hook="cmps-review-star-rating"] .a-icon-alt').first().text().trim();
    const starMatch = starText.match(/([0-9]+([.,][0-9]+)?)/);
    const rating = starMatch ? parseFloat(starMatch[1].replace(',', '.')) : 5;

    // Titre
    let $titleEl = $rev.find('[data-hook="reviewTitle"]').first();
    if (!$titleEl.length) {
      $titleEl = $rev.find('[data-hook="review-title"]').first();
    }
    let title = cleanText($titleEl.clone().children('.a-icon-alt').remove().end().text());
    title = title.replace(/^[0-9]+[.,][0-9]+\s*sur\s*5\s*étoiles\s*/i, '').trim();
    title = removeDuplicates(title);

    // Date
    let date = cleanText($rev.find('[data-hook="review-date"]').first().text());
    date = date.replace(/^(Avis laissé|Commenté)\s+en\s+France\s+le\s*/i, '');
    date = removeDuplicates(date);

    // Contenu
    const $rich = $rev.find('[data-hook="reviewRichContentContainer"]').first();
    let body = '';
    if ($rich.length) {
      body = cleanText($rich.text());
    } else {
      body = cleanText($rev.find('[data-hook="reviewText"], [data-hook="review-body"]').first().text());
    }
    body = body
      .replace(/Brief content visible, double tap to read full content\./g, '')
      .replace(/Full content visible, double tap to read brief content\./g, '')
      .replace(/Lire la suite/g, '')
      .replace(/Afficher moins/g, '')
      .trim();

    // Badges
    const verified = $rev.find('[data-hook="avp-badge"]').length > 0 || $rev.text().includes('Achat vérifié');
    const vine = $rev.find('[data-hook="vine-review-badge"]').length > 0 || $rev.text().includes('Club des Testeurs');

    if (body || title) {
      reviews.push({
        id: `rev_${i + 1}`,
        author,
        rating,
        title,
        date,
        body,
        verified,
        vine
      });
    }
  });

  console.log(`[Amazon Reviews] Extraction réussie : note ${averageRating}/5, ${totalReviews} évaluations, ${reviews.length} avis détaillés.`);

  return {
    asin: ASIN,
    productUrl: AMAZON_URL,
    reviewsUrl: REVIEWS_URL,
    averageRating,
    totalReviews,
    lastUpdated: new Date().toISOString(),
    reviews
  };
}

async function run() {
  try {
    const data = await getAmazonReviews();

    if (!data.reviews || data.reviews.length === 0) {
      throw new Error('Aucun avis extrait (blocage Amazon ou page incomplète). Conservation des avis existants.');
    }

    const jsonPath = join(ROOT, 'reviews-data.json');
    const jsPath = join(ROOT, 'reviews-data.js');

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`[Amazon Reviews] Écrit ${jsonPath}`);

    const jsContent = `/** Données avis Amazon Kyran générées automatiquement */\nwindow.KYRAN_REVIEWS_DATA = ${JSON.stringify(data, null, 2)};\n`;
    fs.writeFileSync(jsPath, jsContent, 'utf-8');
    console.log(`[Amazon Reviews] Écrit ${jsPath}`);
  } catch (err) {
    console.error(`[Amazon Reviews] Erreur: ${err.message}`);
    process.exit(1);
  }
}

run();

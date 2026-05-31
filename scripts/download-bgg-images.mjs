/**
 * Complète les images manquantes via BoardGameGeek (photos produit officielles).
 * Run: node scripts/download-bgg-images.mjs
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'blog', 'images');
mkdirSync(OUT, { recursive: true });

const UA = 'KyranSiteBot/1.0 (https://kyran-jeu.fr/; contact@kyran-jeu.fr)';

/** local filename → BGG game id */
const BGG = {
  'skull.jpg': 92415,
  'bang.jpg': 3955,
  'colt-express.jpg': 168274,
  'the-crew.jpg': 284083,
  'timeline.jpg': 85256,
  'schotten-totten.jpg': 372,
  'parade.jpg': 333887,
  'the-game.jpg': 173090,
  'saboteur.jpg': 9220,
  'love-letter.jpg': 129622,
  'dobble.jpg': 63268
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchBggImage(id) {
  const url = `https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const xml = await res.text();
  const imageMatch = xml.match(/<image>([^<]+)<\/image>/);
  const thumbMatch = xml.match(/<thumbnail>([^<]+)<\/thumbnail>/);
  return imageMatch?.[1] || thumbMatch?.[1] || null;
}

async function downloadImage(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 3000) throw new Error('too small');
  writeFileSync(dest, buf);
  return buf.length;
}

for (const [file, id] of Object.entries(BGG)) {
  const dest = join(OUT, file);
  const force = file === 'the-game.jpg';
  if (!force && existsSync(dest) && readFileSync(dest).length > 5000) {
    console.log('SKIP', file);
    continue;
  }
  try {
    const imgUrl = await fetchBggImage(id);
    if (!imgUrl) {
      console.log('FAIL', file, 'no BGG image');
      continue;
    }
    const size = await downloadImage(imgUrl, dest);
    console.log('OK', file, Math.round(size / 1024) + ' KB');
  } catch (e) {
    console.log('FAIL', file, e.message);
  }
  await sleep(2500);
}

console.log('Done');

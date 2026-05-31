/**
 * Télécharge photos produit Amazon.fr (og:image) pour jeux sans photo Commons.
 * Run: node scripts/download-amazon-images.mjs
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'blog', 'images');
mkdirSync(OUT, { recursive: true });

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** Fichier → ASIN Amazon.fr */
const AMAZON = {
  'skull.jpg': 'B00I15SB7Y',
  'bang.jpg': 'B00006BA4O',
  'colt-express.jpg': 'B00KW5XIW4',
  'the-crew.jpg': 'B07YGWGMD9',
  'timeline.jpg': 'B004UK71PQ',
  'schotten-totten.jpg': 'B0000524UV',
  'parade.jpg': 'B0C9VQC7GQ'
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getOgImage(asin) {
  const url = `https://www.amazon.fr/dp/${asin}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'fr-FR,fr;q=0.9',
      Accept: 'text/html'
    },
    redirect: 'follow'
  });
  const html = await res.text();
  const og = html.match(/property="og:image"\s+content="([^"]+)"/i)
    || html.match(/content="([^"]+)"\s+property="og:image"/i);
  if (og) return og[1].replace(/&amp;/g, '&');
  const dyn = html.match(/"hiRes":"([^"]+)"/);
  if (dyn) return dyn[1].replace(/\\u0026/g, '&');
  const large = html.match(/"large":"(https:\/\/m\.media-amazon\.com[^"]+)"/);
  return large?.[1]?.replace(/\\u0026/g, '&') || null;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 3000) throw new Error('too small');
  writeFileSync(dest, buf);
  return buf.length;
}

for (const [file, asin] of Object.entries(AMAZON)) {
  const dest = join(OUT, file);
  if (existsSync(dest) && readFileSync(dest).length > 5000) {
    console.log('SKIP', file);
    continue;
  }
  try {
    const imgUrl = await getOgImage(asin);
    if (!imgUrl) {
      console.log('FAIL', file, 'no og:image');
      continue;
    }
    const size = await download(imgUrl, dest);
    console.log('OK', file, Math.round(size / 1024) + ' KB', asin);
  } catch (e) {
    console.log('FAIL', file, e.message);
  }
  await sleep(2000);
}

console.log('Done');

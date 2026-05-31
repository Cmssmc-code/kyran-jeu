/**
 * Fetch cover images from Philibert CDN search (EAN / product name).
 * Run: node scripts/fetch-philibert-blog.mjs
 */
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'blog', 'images');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0';
const MIN = 40000;

const CDN_SEARCH = [
  ['love-letter.jpg', 'love+letter+84133313', false],
  ['dobble.jpg', 'dobble+3558380078180', false],
  ['just-one.jpg', 'just+one+8413338100013', false],
  ['no-thanks.jpg', 'no+thanks+jeu+cartes', false],
  ['the-game.jpg', 'the+game+3760207030213', true]
];

const PAGES = [
  ['saboteur.jpg', 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=saboteur+cartes', false]
];

async function download(file, url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  const buf = Buffer.from(await res.arrayBuffer());
  if (!res.ok || buf.length < 15000) throw new Error(res.status + ' size ' + buf.length);
  writeFileSync(join(OUT, file), buf);
  console.log('OK', file, Math.round(buf.length / 1024) + ' KB');
}

async function scrapeCdnSearch(file, query, force) {
  const dest = join(OUT, file);
  const existing = existsSync(dest) ? readFileSync(dest).length : 0;
  const targetMin = 80000;
  if (!force && existing >= targetMin) {
    console.log('SKIP', file);
    return;
  }
  const res = await fetch(
    'https://www.philibertnet.com/fr/recherche?controller=search&search_query=' + query,
    { headers: { 'User-Agent': UA, 'Accept-Language': 'fr-FR' } }
  );
  const html = await res.text();
  const slug = file.replace('.jpg', '').replace(/-/g, '-');
  const imgs = [...html.matchAll(/https:\/\/cdn[^"'\s>]+\.(?:jpg|webp)/gi)]
    .map(m => m[0].replace(/&amp;/g, '&'));
  const imgUrl = imgs.find(u => u.includes('large_default') && (
    u.toLowerCase().includes(slug.split('-')[0]) ||
    u.toLowerCase().includes(file.replace('.jpg', '').replace(/-/g, '')) ||
    query.split('+').some(w => u.toLowerCase().includes(w.slice(0, 4)))
  )) || imgs.find(u => u.includes('large_default'));
  if (!imgUrl) throw new Error('CDN not found');
  console.log(file, '→', imgUrl.slice(0, 95));
  await download(file, imgUrl);
}

async function scrapePhilibert(file, pageUrl, force) {
  const dest = join(OUT, file);
  if (!force && existsSync(dest) && readFileSync(dest).length >= MIN) {
    console.log('SKIP', file);
    return;
  }
  const res = await fetch(pageUrl, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'fr-FR' },
    redirect: 'follow'
  });
  const html = await res.text();
  const og = html.match(/property="og:image"\s+content="([^"]+)"/i)?.[1]
    || html.match(/content="([^"]+)"\s+property="og:image"/i)?.[1];
  const cdn = [...html.matchAll(/https:\/\/cdn[^"'\s>]+\.(?:jpg|webp|png)/gi)]
    .map(m => m[0].replace(/&amp;/g, '&'))
    .find(u => u.includes('large_default'));
  const imgUrl = og?.replace(/&amp;/g, '&') || cdn;
  if (!imgUrl) throw new Error('no image URL');
  console.log(file, '→', imgUrl.slice(0, 90));
  await download(file, imgUrl);
}

for (const [file, query, force] of CDN_SEARCH) {
  try {
    await scrapeCdnSearch(file, query, force);
  } catch (e) {
    console.log('FAIL', file, e.message);
  }
  await new Promise(r => setTimeout(r, 1600));
}

for (const [file, url, force] of PAGES) {
  try {
    await scrapePhilibert(file, url, force);
  } catch (e) {
    console.log('FAIL', file, e.message);
  }
  await new Promise(r => setTimeout(r, 1600));
}

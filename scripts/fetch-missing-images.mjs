/**
 * Télécharge timeline.jpg et parade.jpg (sources vérifiées).
 * Run: node scripts/fetch-missing-images.mjs
 */
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'blog', 'images');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120';

const SOURCES = {
  'timeline.jpg': [
    'https://cdn1.philibertnet.com/698017-thickbox_default/timeline-clutch-box-3558380126874.jpg',
    'https://store.401games.ca/products/timeline-2026-edition.json'
  ],
  'parade.jpg': [
    'https://b2b-media-production-zmancms.s3.amazonaws.com/filer_public/c2/5c/c25c7bb2-ab1a-44fa-9e1e-952bf63ac4c1/zm1201_box_front.png'
  ]
};

function has(file) {
  const p = join(OUT, file);
  return existsSync(p) && readFileSync(p).length > 50000;
}

async function download(file, url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  const buf = Buffer.from(await res.arrayBuffer());
  if (!res.ok || buf.length < 50000) throw new Error(`${res.status} ${buf.length}`);
  writeFileSync(join(OUT, file), buf);
  console.log('OK', file, Math.round(buf.length / 1024) + ' KB');
}

async function fromShopify(file, jsonUrl) {
  const res = await fetch(jsonUrl, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const src = data.product?.images?.[0]?.src;
  if (!src) throw new Error('no image');
  await download(file, src);
}

for (const [file, urls] of Object.entries(SOURCES)) {
  if (has(file)) { console.log('SKIP', file); continue; }
  for (const url of urls) {
    try {
      if (url.endsWith('.json')) await fromShopify(file, url);
      else await download(file, url);
      break;
    } catch (e) {
      console.log('fail', file, e.message);
    }
  }
}

console.log('Done');

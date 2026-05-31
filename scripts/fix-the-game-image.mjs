import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'blog', 'images', 'the-game.jpg');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0';

const res = await fetch(
  'https://www.philibertnet.com/fr/recherche?controller=search&search_query=the+game+3760207030213',
  { headers: { 'User-Agent': UA, 'Accept-Language': 'fr-FR' } }
);
const html = await res.text();
const imgs = [...html.matchAll(/https:\/\/cdn[^"'\s>]+the-game[^"'\s>]+\.(?:jpg|webp)/gi)]
  .map(m => m[0].replace(/&amp;/g, '&'));
const imgUrl = imgs.find(u => u.includes('large_default')) || imgs[0];
if (!imgUrl) throw new Error('CDN image not found: ' + imgs.length);

const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': UA } });
const buf = Buffer.from(await imgRes.arrayBuffer());
if (buf.length < 15000) throw new Error('too small ' + buf.length);
writeFileSync(OUT, buf);
console.log('OK', Math.round(buf.length / 1024), 'KB', imgUrl);

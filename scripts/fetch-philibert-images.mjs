import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'blog', 'images');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0';

const PAGES = [
  ['colt-express.jpg', 'https://www.philibertnet.com/en/ludonaute/31449-colt-express-3770002176313.html'],
  ['timeline.jpg', 'https://www.philibertnet.com/en/asmodee/17884-timeline-classic-3558380065605.html'],
  ['parade.jpg', 'https://www.philibertnet.com/en/recherche?search_query=parade+iello+card']
];

const DIRECT = [
  ['colt-express.jpg', 'https://raw.githubusercontent.com/AlexHedley/coltexpress/main/images/colt.jpg']
];

async function download(file, url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  const buf = Buffer.from(await res.arrayBuffer());
  if (!res.ok || buf.length < 5000) throw new Error(res.status + ' size ' + buf.length);
  writeFileSync(join(OUT, file), buf);
  console.log('OK', file, Math.round(buf.length / 1024) + ' KB');
}

async function scrapePhilibert(file, pageUrl) {
  const res = await fetch(pageUrl, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'fr-FR' },
    redirect: 'follow'
  });
  const html = await res.text();
  const og = html.match(/property="og:image"\s+content="([^"]+)"/i)
    || html.match(/content="([^"]+)"\s+property="og:image"/i);
  const cdn = [...html.matchAll(/https:\/\/cdn[^"'\s>]+\.(?:jpg|webp|png)/gi)]
    .map(m => m[0].replace(/&amp;/g, '&'))
    .find(u => u.includes('large') || u.includes('thickbox') || u.includes('home'));
  const imgUrl = og?.[1]?.replace(/&amp;/g, '&') || cdn;
  console.log(file, 'found', imgUrl?.slice(0, 100));
  if (imgUrl) await download(file, imgUrl);
}

for (const [file, url] of DIRECT) {
  try { await download(file, url); } catch (e) { console.log('direct fail', file, e.message); }
}

for (const [file, url] of PAGES) {
  try { await scrapePhilibert(file, url); } catch (e) { console.log('scrape fail', file, e.message); }
  await new Promise(r => setTimeout(r, 1500));
}

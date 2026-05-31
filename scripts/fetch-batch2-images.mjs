import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'blog', 'images');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120';

const SEARCH = [
  ['sushi-go.jpg', 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=sushi+go'],
  ['letter-jam.jpg', 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=letter+jam'],
  ['monopoly-deal.jpg', 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=monopoly+deal'],
  ['llama.jpg', 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=llama+jeu+cartes']
];

async function scrape(file, searchUrl) {
  const res = await fetch(searchUrl, { headers: { 'User-Agent': UA, 'Accept-Language': 'fr-FR' } });
  const html = await res.text();
  const product = html.match(/href="(\/fr\/[^"]+\.html)"/)?.[1];
  if (!product) throw new Error('no product');
  const purl = 'https://www.philibertnet.com' + product.replace(/&amp;/g, '&');
  console.log(file, 'product', purl.slice(0, 80));
  const pr = await fetch(purl, { headers: { 'User-Agent': UA } });
  const ph = await pr.text();
  const img = [...ph.matchAll(/https:\/\/cdn1\.philibertnet\.com\/\d+-(?:thickbox|large)_default\/[^"'\s>]+\.jpg/gi)][0]?.[0];
  if (!img) throw new Error('no img');
  const ir = await fetch(img, { headers: { 'User-Agent': UA } });
  const buf = Buffer.from(await ir.arrayBuffer());
  if (buf.length < 12000) throw new Error('small');
  writeFileSync(join(OUT, file), buf);
  console.log('OK', file, Math.round(buf.length / 1024) + ' KB');
}

for (const [file, url] of SEARCH) {
  const p = join(OUT, file);
  if (existsSync(p) && readFileSync(p).length > 12000) { console.log('SKIP', file); continue; }
  try { await scrape(file, url); } catch (e) { console.log('fail', file, e.message); }
  await new Promise(r => setTimeout(r, 2000));
}

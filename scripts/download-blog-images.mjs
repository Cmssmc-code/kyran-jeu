/**
 * Télécharge photos jeux : Wikimedia Commons + fallback Wikipedia.
 * Run: node scripts/download-blog-images.mjs
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'blog', 'images');
mkdirSync(OUT, { recursive: true });

const UA = 'KyranSiteBot/1.0 (https://kyran-jeu.fr/; contact@kyran-jeu.fr)';

const GAMES = {
  'uno.jpg': { commons: 'Uno_cards_deck.jpg', wiki: 'Uno_(card_game)' },
  'skyjo.jpg': { commons: 'Skyjo_-_Magilano.jpg', wiki: 'Skyjo' },
  'dobble.jpg': { commons: 'Dobble.jpg', wiki: 'Dobble' },
  'jungle-speed.jpg': { commons: 'Jungle_Speed.jpg', wiki: 'Jungle_Speed' },
  'codenames.jpg': { commons: 'Codenames_board_game.jpg', wiki: 'Codenames_(board_game)' },
  'dixit.jpg': { commons: 'Dixit_(board_game).jpg', wiki: 'Dixit_(board_game)' },
  'hanabi.jpg': { commons: 'Hanabi_(card_game).jpg', wiki: 'Hanabi_(card_game)' },
  'love-letter.jpg': { commons: 'Love_Letter_(card_game).jpg', wiki: 'Love_Letter_(card_game)' },
  'wizard.jpg': { commons: 'Wizard_(card_game).jpg', wiki: 'Wizard_(card_game)' },
  'timeline.jpg': { commons: 'Timeline_(card_game).jpg', wiki: 'Timeline_(card_game)' },
  'schotten-totten.jpg': { commons: 'Schotten_Totten.jpg', wiki: 'Schotten_Totten' },
  'skull.jpg': { commons: 'Skull_(card_game).jpg', wiki: 'Skull_(card_game)' },
  'saboteur.jpg': { commons: 'Saboteur_(card_game).jpg', wiki: 'Saboteur_(card_game)' },
  'bang.jpg': { commons: 'Bang!_(card_game).jpg', wiki: 'Bang!_(card_game)' },
  'colt-express.jpg': { commons: 'Colt_Express.jpg', wiki: 'Colt_Express' },
  'the-crew.jpg': { commons: 'The_Crew_(card_game).jpg', wiki: 'The_Crew_(card_game)' },
  'lost-cities.jpg': { commons: 'Lost_Cities_(card_game).jpg', wiki: 'Lost_Cities' },
  '6-qui-prend.jpg': { commons: '6_nimmt!_box.jpg', wiki: '6_nimmt!' },
  'oh-hell.jpg': { commons: 'Oh_hell_(card_game).jpg', wiki: 'Oh_hell' },
  'parade.jpg': { commons: 'Parade_(card_game).jpg', wiki: 'Parade_(card_game)' },
  'sushi-go.jpg': { commons: 'Sushi_Go!_card_game.jpg', wiki: 'Sushi_Go!' },
  'the-mind.jpg': { commons: 'The_Mind_(card_game).jpg', wiki: 'The_Mind_(game)' },
  'coup.jpg': { commons: 'Coup_(card_game).jpg', wiki: 'Coup_(card_game)' },
  'just-one.jpg': { commons: 'Just_One_(board_game).jpg', wiki: 'Just_One_(board_game)' },
  'star-realms.jpg': { commons: 'Star_Realms.jpg', wiki: 'Star_Realms' },
  'no-thanks.jpg': { commons: 'No_Thanks!_card_game.jpg', wiki: 'No_Thanks!' },
  'letter-jam.jpg': { commons: 'Letter_Jam.jpg', wiki: 'Letter_Jam' },
  'for-sale.jpg': { commons: 'For_Sale_(card_game).jpg', wiki: 'For_Sale_(game)' },
  'monopoly-deal.jpg': { commons: 'Monopoly_Deal.jpg', wiki: 'Monopoly_Deal' },
  'llama.jpg': { commons: 'Llama_(card_game).jpg', wiki: 'Llama_(card_game)' },
  'the-game.jpg': { commons: 'The_Game_(card_game).jpg', wiki: 'The_Game_(card_game)', width: 500 },
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function apiFetch(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
    redirect: 'follow'
  });
  const text = await res.text();
  if (!res.ok) throw new Error('HTTP ' + res.status);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON: ' + text.slice(0, 80));
  }
}

async function commonsThumb(fileName, width = 1200) {
  const params = new URLSearchParams({
    action: 'query',
    titles: 'File:' + fileName,
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: String(width),
    format: 'json',
    origin: '*'
  });
  const data = await apiFetch('https://commons.wikimedia.org/w/api.php?' + params);
  const page = Object.values(data.query?.pages || {})[0];
  if (!page || page.missing !== undefined) return null;
  const info = page.imageinfo?.[0];
  return info?.thumburl || null;
}

async function wikiThumb(title) {
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '1200',
    format: 'json',
    origin: '*'
  });
  const data = await apiFetch('https://en.wikipedia.org/w/api.php?' + params);
  const page = Object.values(data.query?.pages || {})[0];
  if (!page || page.missing !== undefined) return null;
  return page.thumbnail?.source || null;
}

async function commonsSearch(query) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query + ' filetype:bitmap',
    gsrnamespace: '6',
    gsrlimit: '5',
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: '1200',
    format: 'json',
    origin: '*'
  });
  const data = await apiFetch('https://commons.wikimedia.org/w/api.php?' + params);
  const pages = Object.values(data.query?.pages || {}).sort((a, b) => a.index - b.index);
  for (const p of pages) {
    const url = p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url;
    if (url) return url;
  }
  return null;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error('DL ' + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error('File too small');
  writeFileSync(dest, buf);
  return buf.length;
}

async function resolveUrl(config, local) {
  const name = local.replace('.jpg', '').replace(/-/g, ' ');
  const width = config.width || 1200;
  if (config.commons) {
    try {
      const u = await commonsThumb(config.commons, width);
      if (u) return u;
    } catch { /* retry next */ }
    await sleep(1200);
  }
  if (config.wiki) {
    try {
      const u = await wikiThumb(config.wiki);
      if (u) return u;
    } catch { /* retry next */ }
    await sleep(1200);
  }
  try {
    return await commonsSearch(name + ' card game box');
  } catch {
    return null;
  }
}

const results = [];
for (const [local, config] of Object.entries(GAMES)) {
  const dest = join(OUT, local);
  if (existsSync(dest)) {
    try {
      const sz = readFileSync(dest).length;
      const skip = local === 'the-game.jpg'
        ? sz >= 50000 && sz <= 600000
        : sz > 5000;
      if (skip) {
        console.log('SKIP', local, '(exists', Math.round(sz / 1024) + ' KB)');
        results.push({ local, status: 'SKIP', size: sz });
        continue;
      }
    } catch { /* re-download */ }
  }
  try {
    const url = await resolveUrl(config, local);
    if (!url) {
      console.log('FAIL', local, 'no URL');
      results.push({ local, status: 'FAIL' });
      await sleep(1500);
      continue;
    }
    const size = await download(url, dest);
    console.log('OK', local, Math.round(size / 1024) + ' KB');
    results.push({ local, status: 'OK', size, url });
  } catch (e) {
    console.log('FAIL', local, e.message);
    results.push({ local, status: 'FAIL', msg: e.message });
  }
  await sleep(1800);
}

writeFileSync(join(OUT, 'download-log.json'), JSON.stringify(results, null, 2));
const ok = results.filter(r => r.status === 'OK' || r.status === 'SKIP').length;
console.log('\nTotal:', ok + '/' + results.length);

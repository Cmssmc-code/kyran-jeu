/**
 * Télécharge photos éditeurs / retail (URLs directes vérifiées).
 * Run: node scripts/download-publisher-images.mjs
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'blog', 'images');
mkdirSync(OUT, { recursive: true });

const UA = 'KyranSiteBot/1.0 (https://kyran-jeu.fr/)';

/** Fichier local → URL(s) à essayer dans l'ordre */
const SOURCES = {
  'skull.jpg': [
    'https://cdn.svc.asmodee.net/production-asmodeeca/uploads/image-converter/2022/01/SCSK02ENFR-SKULL-ML-3D_LEFT-1024x1024.webp',
    'https://cdn.svc.asmodee.net/production-asmodeeca/uploads/image-converter/2022/01/SCSK02ENFR-SKULL-ML-3D_LEFT.webp'
  ],
  'bang.jpg': [
    'https://bang.dvgiochi.com/content/1/box/bang.png',
    'https://www.dvgiochi.com/images/bang/box.png'
  ],
  'colt-express.jpg': [
    'https://cdn.svc.asmodee.net/production-asmodeeca/uploads/image-converter/2021/03/LUCOEX01FR-COLT-EXPRESS-ML-3D_LEFT-1024x1024.webp',
    'https://cdn.svc.asmodee.net/production-asmodeeca/uploads/image-converter/2021/03/LUCOEX01FR-COLT-EXPRESS-ML-3D_LEFT.webp',
    'https://www.ludonaute.fr/wp-content/uploads/2019/05/colt-express-box.png'
  ],
  'the-crew.jpg': [
    'https://cdn.svc.asmodee.net/production-asmodeeca/uploads/image-converter/2020/03/KOSCRE01FR-THE-CREW-ML-3D_LEFT-1024x1024.webp',
    'https://cdn.svc.asmodee.net/production-asmodeeca/uploads/image-converter/2020/03/KOSCRE01FR-THE-CREW-ML-3D_LEFT.webp'
  ],
  'timeline.jpg': [
    'https://cdn.svc.asmodee.net/production-asmodeeca/uploads/image-converter/2021/09/ASMTIM01FR-TIMELINE-ML-3D_LEFT-1024x1024.webp',
    'https://cdn.svc.asmodee.net/production-asmodeeca/uploads/image-converter/2021/09/ASMTIM01FR-TIMELINE-ML-3D_LEFT.webp'
  ],
  'schotten-totten.jpg': [
    'https://cdn.svc.asmodee.net/production-asmodeeca/uploads/image-converter/2021/03/KOSBAT01FR-BATTLE-LINE-ML-3D_LEFT-1024x1024.webp',
    'https://www.kosmos.de/sites/default/files/styles/product_image/public/2020-09/680428.jpg'
  ],
  'parade.jpg': [
    'https://cdn.svc.asmodee.net/production-asmodeeca/uploads/image-converter/2023/06/IELPAR01FR-PARADE-ML-3D_LEFT-1024x1024.webp',
    'https://cdn.svc.asmodee.net/production-asmodeeca/uploads/image-converter/2023/06/IELPAR01FR-PARADE-ML-3D_LEFT.webp'
  ]
};

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'image/*,*/*' },
    redirect: 'follow'
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4000) throw new Error('too small');
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error('not a JPEG');
  writeFileSync(dest, buf);
  return buf.length;
}

for (const [file, urls] of Object.entries(SOURCES)) {
  const dest = join(OUT, file);
  const existing = existsSync(dest) ? readFileSync(dest) : null;
  if (existing && existing.length > 8000 && existing[0] === 0xff && existing[1] === 0xd8) {
    console.log('SKIP', file);
    continue;
  }
  let ok = false;
  for (const url of urls) {
    try {
      const size = await download(url, dest);
      console.log('OK', file, Math.round(size / 1024) + ' KB', url.slice(0, 70) + '…');
      ok = true;
      break;
    } catch (e) {
      console.log('try fail', file, e.message);
    }
  }
  if (!ok) console.log('FAIL', file);
}

console.log('Done');

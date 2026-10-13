// Rend chaque source .htm de ce dossier en PNG dans marketing/instagram/.
// Usage : node marketing/instagram/src/render.mjs [filtre]
// Playwright est chargé depuis PLAYWRIGHT_FROM (par défaut /opt/node-tools/node_modules/).
// Les PNG sont ensuite réduits en palette 256 couleurs avec Pillow (python3) s'il est présent.
import { createRequire } from 'module';
import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { execFileSync } from 'child_process';

const require = createRequire(process.env.PLAYWRIGHT_FROM || '/opt/node-tools/node_modules/');
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const out = dirname(here);
const filter = process.argv[2] || '';
const browser = await chromium.launch();
for (const f of readdirSync(here).filter(f => f.endsWith('.htm') && f.includes(filter)).sort()) {
  const story = f.includes('story');
  const page = await browser.newPage({ viewport: { width: 1080, height: story ? 1920 : 1350 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(join(here, f)).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  const png = join(out, f.replace(/\.htm$/, '.png'));
  await page.screenshot({ path: png, type: 'png' });
  await page.close();
  try {
    execFileSync('python3', ['-I', '-c',
      'import sys;from PIL import Image;p=sys.argv[1];Image.open(p).convert("RGB").quantize(256,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.FLOYDSTEINBERG).save(p,optimize=True)', png]);
  } catch (e) { console.warn('compression ignorée', e.message); }
  console.log('ok', png);
}
await browser.close();

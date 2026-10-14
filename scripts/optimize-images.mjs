#!/usr/bin/env node
/**
 * Génère les variantes WebP des images du blog (blog/images/*.jpg → *.webp, 1200 px max)
 * et les versions 740 px (accueil) et 360 px de large (commande, mobile) de la boîte. Nécessite ImageMagick (convert) avec WebP.
 * Les fichiers générés sont commités ; relancer après l'ajout d'une image.
 * Run: node scripts/optimize-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(ROOT, 'blog', 'images');
let made = 0;

function toWebp(src, dest, width, quality) {
  if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= fs.statSync(src).mtimeMs) return;
  execFileSync('convert', [src, '-resize', `${width}x${width}>`, '-strip', '-quality', String(quality), dest]);
  made++;
}

for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jpg'))) {
  toWebp(path.join(dir, f), path.join(dir, f.replace(/\.jpg$/, '.webp')), 1200, 78);
}
toWebp(path.join(ROOT, 'boite-recto-kyran.webp'), path.join(ROOT, 'boite-recto-kyran-740.webp'), 740, 80);
// Variante mobile de la boîte (/commander.html, srcset) : 360 px de large.
const box360 = path.join(ROOT, 'boite-recto-kyran-360.webp');
if (!fs.existsSync(box360) || fs.statSync(box360).mtimeMs < fs.statSync(path.join(ROOT, 'boite-recto-kyran.webp')).mtimeMs) {
  execFileSync('convert', [path.join(ROOT, 'boite-recto-kyran.webp'), '-resize', '360x', '-strip', '-quality', '80', box360]);
  made++;
}

console.log(`${made} image(s) générée(s).`);

#!/usr/bin/env node
/**
 * Génère les variantes WebP des images du blog (blog/images/*.jpg → *.webp, 1200 px max)
 * et la version 740 px de la boîte pour l'accueil. Nécessite ImageMagick (convert) avec WebP.
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

console.log(`${made} image(s) générée(s).`);

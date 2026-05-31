/**
 * Force re-download of blog images below quality threshold.
 * Run: node scripts/redownload-small-images.mjs
 */
import { unlinkSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'blog', 'images');
const MIN_SIZE = 80000;
const FORCE = [
  'uno.jpg',
  'saboteur.jpg',
  'oh-hell.jpg',
  'love-letter.jpg',
  'dobble.jpg',
  'the-game.jpg'
];

for (const file of FORCE) {
  const path = join(OUT, file);
  if (!existsSync(path)) {
    console.log('MISSING', file);
    continue;
  }
  const size = readFileSync(path).length;
  if (size < MIN_SIZE || FORCE.includes(file)) {
    try {
      unlinkSync(path);
      console.log('REMOVED', file, '(' + Math.round(size / 1024) + ' KB)');
    } catch (e) {
      console.log('ERR', file, e.message);
    }
  }
}

const result = spawnSync('node', ['scripts/download-blog-images.mjs'], {
  cwd: join(dirname(fileURLToPath(import.meta.url)), '..'),
  stdio: 'inherit'
});

process.exit(result.status || 0);

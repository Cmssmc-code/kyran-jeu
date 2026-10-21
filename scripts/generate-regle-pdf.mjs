/**
 * Génère /regle-kyran.pdf (règles officielles sur une page A4) à partir de scripts/pdf/regle-kyran.html.
 * Utilise Playwright (Chromium) : `node scripts/generate-regle-pdf.mjs`.
 * À relancer après toute modification des règles (regle.html et scripts/pdf/regle-kyran.html).
 */
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'scripts/pdf/regle-kyran.html');
const output = path.join(root, 'regle-kyran.pdf');

function loadPlaywright() {
  try {
    return require('playwright');
  } catch {
    // Playwright installé globalement (environnements Claude Code, CI avec npx).
    const globalRoot = require('node:child_process').execSync('npm root -g').toString().trim();
    return require(path.join(globalRoot, 'playwright'));
  }
}

const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(source).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: output, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true });
await browser.close();

console.log(`regle-kyran.pdf : ${(fs.statSync(output).size / 1024).toFixed(0)} Ko`);

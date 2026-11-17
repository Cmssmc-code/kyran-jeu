#!/usr/bin/env node
/**
 * Crawl de la routine « Surveillance & réparation » : chaque page du sitemap en 1280 et 390 px.
 * Ouvre les `details`, défile jusqu'en bas et relève : erreurs console (CSP comprises), `pageerror`,
 * requêtes du site en échec, réponses 4xx/5xx du site, images cassées, débordement horizontal.
 *
 *   node scripts/surveillance/crawl.mjs [sitemap]   (défaut : sitemap.xml du dépôt)
 *
 * Variables : PLAYWRIGHT_CORE, CHROMIUM_PATH (comme scripts/smoke-initiation.mjs).
 * Sortie : JSON { problems: [{ width, u, st, errs, overflow, broken }], links: [...] } sur stdout.
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const sitemap = fs.readFileSync(process.argv[2] || path.join(ROOT, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(https:\/\/kyran-jeu\.fr\/[^<]*)<\/loc>/g)]
  .map(m => m[1])
  .filter(u => !/\.(jpg|png|webp)$/.test(u));

const modPath = process.env.PLAYWRIGHT_CORE;
const spec = modPath ? pathToFileURL(path.join(modPath, 'index.mjs')).href : 'playwright-core';
const { chromium } = await import(spec);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

const problems = [];
const links = new Set();
for (const width of [1280, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  for (const u of urls) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 200)); });
    page.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 200)));
    page.on('requestfailed', r => {
      if (r.url().includes('kyran-jeu.fr') && r.failure()?.errorText !== 'net::ERR_ABORTED') errs.push('failed: ' + r.url() + ' ' + r.failure()?.errorText);
    });
    page.on('response', r => { if (r.status() >= 400 && r.url().includes('kyran-jeu.fr')) errs.push(r.status() + ' ' + r.url()); });
    let st = 0;
    try {
      st = (await page.goto(u, { waitUntil: 'load', timeout: 60000 }))?.status() || 0;
      await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; }));
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
      });
      await page.waitForTimeout(800);
    } catch (e) {
      errs.push('goto: ' + String(e).slice(0, 160));
    }
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src') && i.loading !== 'lazy').map(i => i.currentSrc || i.src),
      links: [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => /^https?:/.test(h)).map(h => h.split('#')[0]),
    })).catch(() => ({ overflow: 0, broken: [], links: [] }));
    info.links.forEach(l => links.add(l));
    if (st >= 400 || errs.length || info.overflow > 1 || info.broken.length) problems.push({ width, u, st, errs, overflow: info.overflow, broken: info.broken });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ problems, links: [...links].sort() }));

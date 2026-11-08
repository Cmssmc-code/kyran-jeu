#!/usr/bin/env node
/**
 * Test de fumée de l'Initiation (minijeu.html) dans Chromium : joue une manche complète en
 * suivant l'état publié sur #dojo[data-state] (voir dojo/ui-state.js), sans aucun délai deviné.
 *
 *   node scripts/smoke-initiation.mjs [url]          (défaut : https://kyran-jeu.fr/minijeu.html)
 *
 * Variables : PLAYWRIGHT_CORE (chemin du module playwright-core, défaut `playwright-core`),
 * CHROMIUM_PATH (exécutable Chromium, défaut : celui de Playwright).
 * Sortie 0 si une manche se termine sans erreur JS ni 404 sur /dojo/, 1 sinon.
 */
import { pathToFileURL } from 'url';
import path from 'path';

const url = process.argv[2] || 'https://kyran-jeu.fr/minijeu.html';
const modPath = process.env.PLAYWRIGHT_CORE;
const spec = modPath ? pathToFileURL(path.join(modPath, 'index.mjs')).href : 'playwright-core';
const { chromium } = await import(spec);

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const problems = [];
page.on('pageerror', e => problems.push('Erreur JS : ' + e.message));
page.on('console', m => { if (m.type() === 'error') problems.push('Console : ' + m.text()); });
page.on('response', r => { if (r.url().includes('/dojo/') && r.status() >= 400) problems.push(`${r.status()} ${r.url()}`); });

const state = () => page.getAttribute('#dojo', 'data-state');
const trail = [];
let cardsPlayed = 0;
let roundDone = false;

try {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#dojo[data-state="lobby"]', { timeout: 15000 });
  await page.locator('[data-action="free-game"]:visible').first().click();

  const deadline = Date.now() + 120000;
  while (!roundDone && Date.now() < deadline) {
    const s = await state();
    if (trail[trail.length - 1] !== s) trail.push(s);
    if (s === 'crash') throw new Error('La partie a planté (data-state="crash")');
    if (s === 'turn:bet') {
      for (let v = 0; v <= 9 && (await state()) === 'turn:bet'; v++) await page.keyboard.press(String(v));
    } else if (s === 'turn:play') {
      const card = page.locator('#dj-hand .dj-card:not([aria-disabled])').first();
      await card.click();
      if ((await state()) === 'turn:play') await card.click();
      cardsPlayed++;
    } else if (s && s.startsWith('turn:')) {
      await page.locator('#dj-actions button').first().click();
    } else if (s === 'coach') {
      await page.locator('#dojo .dj-ack').first().click();
    } else if (s === 'dialog') {
      if (cardsPlayed > 0) roundDone = true;
      else await page.locator('#dojo .dj-modal button.dj-btn').last().click();
    }
    await page.waitForTimeout(150);
  }
  if (!roundDone) problems.push('Manche non terminée en 2 min (états vus : ' + trail.join(' → ') + ')');
} catch (err) {
  problems.push(err.message);
} finally {
  await browser.close();
}

console.log(`États : ${trail.join(' → ')}`);
console.log(`Cartes jouées : ${cardsPlayed}`);
if (problems.length) {
  console.error('ÉCHEC\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log('OK : une manche complète sans erreur.');

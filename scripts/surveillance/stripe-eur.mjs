#!/usr/bin/env node
/**
 * Lit la page Stripe du Payment Link SANS payer : passe la devise en EUR (Stripe propose la devise du
 * visiteur, CHF ou USD depuis les sessions cloud) et affiche le texte de la page, pour comparer prix
 * unitaire, port et total à ceux du site.
 *
 *   node scripts/surveillance/stripe-eur.mjs
 *
 * Variables : PLAYWRIGHT_CORE, CHROMIUM_PATH (comme scripts/smoke-initiation.mjs).
 */
import path from 'path';
import { pathToFileURL } from 'url';

const modPath = process.env.PLAYWRIGHT_CORE;
const spec = modPath ? pathToFileURL(path.join(modPath, 'index.mjs')).href : 'playwright-core';
const { chromium } = await import(spec);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await (await browser.newContext({ locale: 'fr-FR', viewport: { width: 1280, height: 900 } })).newPage();
// La page Stripe n'atteint jamais « networkidle » : chargement puis attente fixe.
await page.goto('https://buy.stripe.com/eVqeVfaWz4k02yY1UqaEE00', { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(5000);
const eur = page.locator('button, [role="radio"], label').filter({ hasText: /€/ }).first();
if (await eur.count()) { await eur.click().catch(() => {}); await page.waitForTimeout(2500); }
const text = (await page.innerText('body')).split('\n').map(s => s.trim()).filter(Boolean).join(' | ');
console.log(text.slice(0, 900));
await browser.close();

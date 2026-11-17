#!/usr/bin/env node
/**
 * Bandeau de consentement GA4 : aucune requête Google avant le clic, puis aucune erreur console
 * (CSP comprise) après « Accepter » (leçon du 2026-11-12). Le test compte une visite dans GA4.
 *
 *   node scripts/surveillance/ga-consent.mjs [url]   (défaut : https://kyran-jeu.fr/)
 *
 * Variables : PLAYWRIGHT_CORE, CHROMIUM_PATH (comme scripts/smoke-initiation.mjs).
 * Sortie 0 si rien ne part avant le clic et si la console reste vide après, 1 sinon.
 */
import path from 'path';
import { pathToFileURL } from 'url';

const url = process.argv[2] || 'https://kyran-jeu.fr/';
const modPath = process.env.PLAYWRIGHT_CORE;
const spec = modPath ? pathToFileURL(path.join(modPath, 'index.mjs')).href : 'playwright-core';
const { chromium } = await import(spec);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const google = [];
const errs = [];
page.on('request', r => { if (/google(tagmanager|-analytics)|analytics\.google|google\.com\/g\//.test(r.url())) google.push(new URL(r.url()).host); });
page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
await page.goto(url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now(), { waitUntil: 'networkidle' });
const before = google.length;
await page.click('#kyran-consent button[data-kc="accepted"]');
await page.waitForTimeout(6000);
await browser.close();
console.log(JSON.stringify({ requetesGoogleAvantClic: before, requetesGoogle: google, erreursConsole: errs }));
process.exit(before === 0 && errs.length === 0 ? 0 : 1);

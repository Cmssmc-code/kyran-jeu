#!/usr/bin/env node
/**
 * Parcours d'achat réel du site, SANS payer : /commander.html → bouton d'achat → panneau
 * « Votre commande KYRAN » → 1 boîte en livraison → « Payer » → page Stripe (session créée par
 * POST /api/commande du serveur Railway, ou Payment Link de repli). Affiche le récapitulatif du
 * panneau, l'adresse Stripe atteinte et le texte de la page Stripe, passée en EUR si possible.
 *
 *   node scripts/surveillance/achat.mjs [quantite]   (défaut : 1)
 *
 * Variables : PLAYWRIGHT_CORE, CHROMIUM_PATH (comme scripts/smoke-initiation.mjs).
 * Sortie 1 si la page Stripe n'est pas atteinte ou si une erreur JS survient sur le site.
 */
import path from 'path';
import { pathToFileURL } from 'url';

const quantite = Number(process.argv[2] || 1);
const modPath = process.env.PLAYWRIGHT_CORE;
const spec = modPath ? pathToFileURL(path.join(modPath, 'index.mjs')).href : 'playwright-core';
const { chromium } = await import(spec);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await (await browser.newContext({ locale: 'fr-FR', viewport: { width: 1280, height: 900 } })).newPage();
const erreurs = [];
const api = [];
page.on('pageerror', e => erreurs.push('Erreur JS : ' + e.message));
page.on('response', r => { if (r.url().includes('/api/commande')) api.push(r.status()); });

await page.goto('https://kyran-jeu.fr/commander.html', { waitUntil: 'load', timeout: 60000 });
const lien = page.locator('a[href*="buy.stripe.com"], a[href$="/commander.html"], a[href$="/commander"]').first();
await lien.click();
await page.waitForSelector('dialog.achat-choix[open]', { timeout: 10000 });
await page.check('dialog.achat-choix input[value="livraison"]');
await page.fill('#achat-qte', String(quantite));
await page.locator('#achat-qte').dispatchEvent('input');
const recap = (await page.innerText('dialog.achat-choix .achat-choix__recap')).replace(/\s+/g, ' ').trim();
await Promise.all([
  page.waitForURL(/https:\/\/(checkout|buy)\.stripe\.com\//, { timeout: 45000 }),
  page.click('dialog.achat-choix .achat-choix__payer')
]);
await page.waitForTimeout(5000);
const stripeUrl = page.url().replace(/(cs_(live|test)_)[A-Za-z0-9]+/, '$1…');
// Stripe propose la devise du visiteur (CHF, USD, F CFA… selon la sortie de la session cloud) ; le
// sélecteur de devise est dans un iframe Stripe : y choisir l'euro pour lire les montants réels.
const selecteur = page.frameLocator('iframe[src*="currency-selector"]');
await selecteur.getByText(/€/).first().click({ timeout: 10000 }).catch(() => {});
await page.waitForTimeout(2500);
const texte = (await page.innerText('body')).split('\n').map(s => s.trim()).filter(Boolean).join(' | ').slice(0, 700);
await browser.close();
console.log(JSON.stringify({ recapPanneau: recap, apiCommande: api, stripe: stripeUrl, erreurs }, null, 1));
console.log(texte);
process.exit(/stripe\.com/.test(stripeUrl) && erreurs.length === 0 ? 0 : 1);

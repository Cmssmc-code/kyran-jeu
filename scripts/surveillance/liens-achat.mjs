#!/usr/bin/env node
/**
 * Contrôle des liens d'achat du site, SANS acheter : lit les pages en ligne (accueil, où acheter, commander),
 * relève chaque lien vers une boutique (Amazon, Philibert, Etsy, leboncoin, Payment Link Stripe…) avec le prix
 * affiché à côté, puis ouvre chaque lien et vérifie que KYRAN s'y achète : bon produit, prix, bouton d'achat.
 * Les liens en commentaire HTML (masqués) sont ignorés.
 *
 *   node scripts/surveillance/liens-achat.mjs
 *   node scripts/surveillance/liens-achat.mjs <url> [prix]   (une seule fiche, ex. avant de remettre un lien)
 *
 * Variables : PLAYWRIGHT_CORE, CHROMIUM_PATH (comme scripts/smoke-initiation.mjs) ; SITE (défaut https://kyran-jeu.fr).
 * Dernière ligne : JSON {"liens":[{url, nom, pages, prixSite, etat, detail}]}, etat = ok | casse | prix | illisible.
 *   casse     : page absente, autre produit, plus de bouton d'achat ou produit indisponible → retirer le lien,
 *               SEULEMENT après une 2e lecture dans Chromium de Trio (profil kyran) qui le confirme ;
 *   prix      : le prix de la boutique diffère de celui affiché sur le site → corriger le prix affiché ;
 *   illisible : anti-robot ou réseau, rien de prouvé (à revoir dans un vrai navigateur).
 * Sortie 0 tout bon, 1 au moins un lien cassé ou un prix faux, 2 seulement des liens illisibles.
 */
import path from 'path';
import { pathToFileURL } from 'url';

const SITE = process.env.SITE || 'https://kyran-jeu.fr';
const PAGES = ['/', '/ou-acheter.html', '/commander.html'];
const ASIN = 'B0G217LD87';
const PRIX_DIRECT = '9,99';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
const BOUTIQUE = /^https:\/\/(?:www\.)?(amazon\.[a-z.]+|philibertnet\.com|etsy\.com|leboncoin\.fr|buy\.stripe\.com|ebay\.[a-z.]+|cdiscount\.com|fnac\.com|carrefour\.fr)\//;

const sansCommentaires = h => h.replace(/<!--[\s\S]*?-->/g, '');
const normPrix = s => (s || '').replace(/\s|&nbsp;| | /g, '').replace('.', ',');
// Hors euro (kr, zł), le prix Amazon bouge avec le taux de change : le site affiche « environ X » et on tolère 3 %.
const TOLERANCE_CHANGE = 0.03;
const num = s => parseFloat(String(s).replace(',', '.'));
const decode = s => s.replace(/&amp;/g, '&');

/** Liens d'achat visibles sur les pages, avec le prix affiché juste après le lien. */
async function relever() {
  const liens = new Map();
  for (const p of PAGES) {
    const r = await fetch(SITE + p + '?controle=' + Date.now(), { headers: { 'user-agent': UA } });
    if (!r.ok) throw new Error(`${p} : HTTP ${r.status}`);
    const h = sansCommentaires(await r.text());
    for (const m of h.matchAll(/<a\b[^>]*href="(https:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>(?=([\s\S]{0,60}))/g)) {
      const url = decode(m[1]);
      if (!BOUTIQUE.test(url) || /\/shop\/|#customerReviews/.test(url)) continue;
      const cle = url.replace(/[?#].*$/, '');
      const nom = m[2].replace(/<[^>]+>/g, '').trim().slice(0, 40);
      const apres = m[3].replace(/<[^>]+>/g, ' ');
      const mp = apres.match(/^\s*(?:environ\s+)?(\d+(?:[,.]\d{2})?)\s*(?:&nbsp;|\s)*(€|kr|zł)/);
      const prix = mp && mp[1];
      const e = liens.get(cle) || { url, nom, pages: [], prixSite: null };
      if (!e.pages.includes(p)) e.pages.push(p);
      if (prix && !e.prixSite) e.prixSite = normPrix(prix);
      if (/buy\.stripe\.com/.test(url)) e.prixSite = PRIX_DIRECT;
      liens.set(cle, e);
    }
  }
  return [...liens.values()];
}

async function http(url) {
  const r = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'fr-FR,fr;q=0.9', accept: 'text/html' }, redirect: 'follow' });
  return { status: r.status, final: r.url, html: await r.text() };
}

const ANTIROBOT = /captcha|datadome|api-services-support@amazon|Just a moment/i;

function amazon({ status, html }, lien) {
  if (status !== 200 || ANTIROBOT.test(html.slice(0, 20000)) && !html.includes('productTitle')) return ['illisible', `HTTP ${status}, page anti-robot`];
  if (!html.includes(ASIN) || !/id="productTitle"[^>]*>[^<]*KYRAN/i.test(html)) return ['casse', 'fiche KYRAN absente (autre produit ou page vide)'];
  const zone = html.slice(Math.max(0, html.indexOf('corePrice')), html.indexOf('corePrice') + 20000);
  const prix = normPrix(((html.indexOf('corePrice') >= 0 ? zone : html).match(/class="a-offscreen">\s*([^<]+)</) || [])[1]);
  if (!html.includes('id="add-to-cart-button"')) return ['casse', `plus de bouton « Ajouter au panier »${prix ? ` (prix lu ${prix})` : ''}`];
  const chiffre = (prix.match(/\d+,\d{2}/) || [])[0];
  if (!chiffre) return ['illisible', 'prix introuvable sur la fiche'];
  const prixSite = lien.prixSite && lien.prixSite.match(/\d+(?:,\d{2})?/)?.[0];
  if (prixSite) {
    const horsEuro = /kr|zł/i.test(prix);
    const ecart = Math.abs(num(chiffre) - num(prixSite)) / num(prixSite);
    if (horsEuro ? ecart > TOLERANCE_CHANGE : chiffre !== prixSite) return ['prix', `prix Amazon ${prix}, site ${lien.prixSite}${horsEuro ? ` (écart ${(ecart * 100).toFixed(1)} %)` : ''}`];
  }
  return ['ok', `KYRAN, ${prix}, bouton panier présent`];
}

function philibert({ status, final, html }, lien) {
  if (status !== 200) return ['casse', `HTTP ${status}`];
  if (ANTIROBOT.test(html.slice(0, 5000)) && !/kyran/i.test(html)) return ['illisible', 'page anti-robot'];
  const id = (lien.url.match(/\/(\d+)-kyran/) || [])[1];
  if (id && !final.includes(id)) return ['casse', `renvoie vers ${final.replace(/[?#].*$/, '')} (fiche retirée ou en brouillon)`];
  const prix = normPrix((html.match(/itemprop="price"[^>]*content="([\d.,]+)"/) || html.match(/"price"\s*:\s*"?([\d.,]+)/) || [])[1]);
  if (!/add[-_]to[-_]cart|ajouter au panier/i.test(html)) return ['casse', 'plus de bouton « Ajouter au panier »'];
  if (prix && lien.prixSite && !prix.startsWith(lien.prixSite)) return ['prix', `prix Philibert ${prix}, site ${lien.prixSite}`];
  return [prix ? 'ok' : 'illisible', prix ? `KYRAN, ${prix} €, bouton panier présent` : 'prix introuvable'];
}

let navigateur;
async function texteNavigateur(url) {
  if (!navigateur) {
    const modPath = process.env.PLAYWRIGHT_CORE;
    const spec = modPath ? pathToFileURL(path.join(modPath, 'index.mjs')).href : 'playwright-core';
    const { chromium } = await import(spec);
    const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--disable-blink-features=AutomationControlled'] });
    navigateur = { b, ctx: await b.newContext({ locale: 'fr-FR', userAgent: UA, viewport: { width: 1280, height: 900 } }) };
  }
  const page = await navigateur.ctx.newPage();
  try {
    const r = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000);
    return { status: r ? r.status() : 0, final: page.url(), texte: await page.innerText('body').catch(() => '') };
  } finally { await page.close(); }
}

function parTexte({ status, final, texte }, lien, bouton) {
  if (status === 403 || status === 429 || ANTIROBOT.test(texte.slice(0, 3000)) && !/kyran/i.test(texte)) return ['illisible', `HTTP ${status}, anti-robot`];
  if (status === 404 || status === 410) return ['casse', `HTTP ${status}`];
  if (/n.est plus disponible|no longer (available|active)|annonce (a été )?(supprimée|désactivée)|plus en vente|Sold out|Épuisé/i.test(texte)) return ['casse', 'annonce ou lien plus disponible'];
  if (!/kyran/i.test(texte)) return ['casse', `KYRAN absent de la page (${final.slice(0, 80)})`];
  if (!bouton.test(texte)) return ['casse', 'plus de bouton d’achat'];
  const prix = (texte.match(/\d+,\d{2}\s?€/g) || []).map(normPrix);
  if (lien.prixSite && !prix.some(p => p.startsWith(lien.prixSite))) return ['prix', `prix lus ${prix.slice(0, 3).join(', ') || 'aucun'}, site ${lien.prixSite}`];
  return ['ok', `KYRAN, ${lien.prixSite} €, bouton d’achat présent`];
}

async function controler(lien) {
  const u = lien.url;
  try {
    if (/amazon\./.test(u)) return amazon(await http(u), lien);
    if (/philibertnet\.com/.test(u)) return philibert(await http(u), lien);
    if (/buy\.stripe\.com/.test(u)) return parTexte(await texteNavigateur(u), lien, /Payer|Pay\b|S’abonner|Commander/i);
    if (/leboncoin\.fr/.test(u)) return parTexte(await texteNavigateur(u), lien, /Acheter|Réserver/i);
    if (/etsy\.com/.test(u)) return parTexte(await texteNavigateur(u), lien, /Ajouter au panier|Acheter/i);
    return parTexte(await texteNavigateur(u), lien, /panier|Acheter|Buy|Pay/i);
  } catch (e) {
    return ['illisible', `${e.name} : ${String(e.message).slice(0, 120)}`];
  }
}

const [urlSeule, prixSeul] = process.argv.slice(2);
const liens = urlSeule ? [{ url: urlSeule, nom: 'fiche', pages: [], prixSite: prixSeul ? normPrix(prixSeul) : null }] : await relever();
for (const l of liens) {
  [l.etat, l.detail] = await controler(l);
  console.log(`${l.etat.padEnd(9)} ${l.nom} — ${l.url.replace(/[?#].*$/, '')} — ${l.detail} (pages : ${l.pages.join(', ')})`);
}
if (navigateur) await navigateur.b.close();
console.log(JSON.stringify({ liens }));
process.exit(liens.some(l => l.etat === 'casse' || l.etat === 'prix') ? 1 : liens.some(l => l.etat === 'illisible') ? 2 : 0);

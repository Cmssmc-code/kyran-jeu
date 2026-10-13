import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { buildFeed, buildTsv } from '../generate-merchant-feed.mjs';
import { PRODUCT } from '../lib/product.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const feedXml = readFileSync(join(ROOT, 'google-merchant-feed.xml'), 'utf8');
const $ = cheerio.load(feedXml, { xmlMode: true });
const g = name => $('item').children(`g\\:${name}`);

test('le flux publié est à jour (npm run build)', () => {
  assert.equal(feedXml, buildFeed());
  assert.equal(readFileSync(join(ROOT, 'google-merchant-feed.tsv'), 'utf8'), buildTsv());
});

test('le flux a les attributs obligatoires de Merchant Center', () => {
  for (const name of ['id', 'title', 'description', 'link', 'image_link', 'availability', 'price', 'brand', 'condition']) {
    assert.ok(g(name).first().text().trim(), `g:${name} manquant`);
  }
  assert.ok(g('title').text().length <= 150, 'titre de plus de 150 caractères');
  assert.ok(g('description').text().length <= 5000, 'description de plus de 5000 caractères');
  assert.equal(g('google_product_category').text(), '1247');
});

test('les valeurs du flux correspondent aux pages du site', () => {
  const cgv = readFileSync(join(ROOT, 'cgv.html'), 'utf8');
  assert.equal(g('price').text(), '9.99 EUR');
  assert.match(cgv, /9,99 € TTC par boîte/);
  assert.equal($('g\\:shipping > g\\:price').text(), `${PRODUCT.shipping.rates[0].price} EUR`);
  assert.match(cgv, new RegExp(`${PRODUCT.shipping.rates[0].label} TTC par commande en France`));
  assert.match(cgv, /24 à 48 heures ouvrées/);
  assert.match(cgv, /2 à 4 jours ouvrés en France/);
  assert.match(cgv, new RegExp(PRODUCT.gtin));
  // Le port n'est connu que pour la France : aucun autre pays avec un prix inventé.
  const countries = $('g\\:shipping > g\\:country').map((_, el) => $(el).text()).get();
  assert.deepEqual(countries, ['FR']);
});

test('les images du flux existent dans le dépôt', () => {
  const urls = [g('image_link').text(), ...g('additional_image_link').map((_, el) => $(el).text()).get()];
  for (const url of urls) {
    const file = url.replace('https://kyran-jeu.fr/', '');
    assert.ok(existsSync(join(ROOT, file)), `${file} introuvable`);
  }
});

test('le GTIN a une clé de contrôle EAN-13 valide', () => {
  const d = PRODUCT.gtin.split('').map(Number);
  const sum = d.slice(0, 12).reduce((a, x, i) => a + x * (i % 2 ? 3 : 1), 0);
  assert.equal((10 - (sum % 10)) % 10, d[12]);
});

#!/usr/bin/env node
/**
 * Génère google-merchant-feed.xml (et sa copie .tsv) : flux produit Google Merchant Center (RSS 2.0, espace g:),
 * à partir des faits canoniques de scripts/lib/product.mjs. Fichier servi à la racine du site
 * (https://kyran-jeu.fr/google-merchant-feed.xml). Mode d'emploi : docs/MERCHANT.md.
 *
 * Règles : uniquement des valeurs sourcées dans le dépôt ; pas de superlatif ni de mention
 * promotionnelle dans le titre ou la description ; frais de port seulement là où ils sont connus.
 * Run: node scripts/generate-merchant-feed.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PRODUCT as P } from './lib/product.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NBSP = ' ';

const esc = s => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

export const TITLE = `KYRAN${NBSP}– ${P.subtitle}, jeu de cartes de plis et de paris, ${P.players.min} à ${P.players.max} joueurs`;

export const DESCRIPTION = [
  `KYRAN est un jeu de cartes de plis avec pari obligatoire, pour ${P.players.min} à ${P.players.max} joueurs, dès ${P.minAge} ans. Une partie dure environ ${P.durationMinutes} minutes.`,
  `À chaque manche, chaque joueur annonce le nombre exact de plis qu'il va gagner. La somme des paris ne peut jamais égaler le nombre de plis${NBSP}: au moins un joueur se trompe. Un pari raté fait perdre autant de cartes Vie que l'écart.`,
  `Les cartes Pouvoir changent le cours d'un pli, et la manche Mystique se joue avec une carte posée sur le front.`,
  `Contenu${NBSP}: ${P.contents}. Cartes toilées, boîte rigide de ${P.dimensions.label}, ${P.weight.value}${NBSP}${P.weight.unit}.`,
  `Conçu et édité en France par ${P.author}. Illustrations de ${P.illustrator}.`
].join(' ');

const details = [
  ['Caractéristiques', 'Nombre de joueurs', `${P.players.min} à ${P.players.max}`],
  ['Caractéristiques', "Durée d'une partie", `Environ ${P.durationMinutes} minutes`],
  ['Caractéristiques', 'Âge minimum', `${P.minAge} ans`],
  ['Caractéristiques', 'Langue', P.language],
  ['Contenu', 'Cartes', P.contents],
  ['Édition', 'Auteur', P.author],
  ['Édition', 'Illustrations', P.illustrator]
];

const tag = (name, value, indent = '      ') => `${indent}<g:${name}>${esc(value)}</g:${name}>`;

export function buildFeed() {
  const s = P.shipping;
  const lines = [
    tag('id', P.id),
    tag('title', TITLE),
    tag('description', DESCRIPTION),
    tag('link', P.url),
    tag('image_link', P.images.main),
    ...P.images.additional.map(u => tag('additional_image_link', u)),
    tag('availability', P.availability),
    tag('price', `${P.price.amount} ${P.price.currency}`),
    tag('brand', P.brand),
    tag('gtin', P.gtin),
    tag('condition', P.condition),
    tag('google_product_category', '1247'), // Jeux et jouets > Jeux > Jeux de cartes
    tag('product_type', 'Jeux de société > Jeux de cartes > Jeux de plis'),
    tag('product_weight', `${P.weight.value} ${P.weight.unit}`),
    tag('product_length', `${P.dimensions.length} ${P.dimensions.unit}`),
    tag('product_width', `${P.dimensions.width} ${P.dimensions.unit}`),
    tag('product_height', `${P.dimensions.height} ${P.dimensions.unit}`),
    tag('ships_from_country', 'FR'),
    tag('min_handling_time', s.handlingDays.min),
    tag('max_handling_time', s.handlingDays.max),
    ...s.rates.flatMap(r => [
      '      <g:shipping>',
      tag('country', r.country, '        '),
      tag('price', `${r.price} ${P.price.currency}`, '        '),
      tag('min_transit_time', r.transitDays.min, '        '),
      tag('max_transit_time', r.transitDays.max, '        '),
      '      </g:shipping>'
    ]),
    ...details.flatMap(([section, name, value]) => [
      '      <g:product_detail>',
      tag('section_name', section, '        '),
      tag('attribute_name', name, '        '),
      tag('attribute_value', value, '        '),
      '      </g:product_detail>'
    ])
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Généré par scripts/generate-merchant-feed.mjs (sources : scripts/lib/product.mjs). Ne pas éditer à la main. -->
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>KYRAN — boutique kyran-jeu.fr</title>
    <link>${P.url}</link>
    <description>Flux produit du jeu de cartes KYRAN pour Google Merchant Center.</description>
    <item>
${lines.join('\n')}
    </item>
  </channel>
</rss>
`;
}

/**
 * Même flux au format texte (TSV). `product_detail` n'y figure pas : ses valeurs contiennent des
 * virgules, qui servent de séparateur dans ce format. Le flux XML reste la source à soumettre.
 */
export function buildTsv() {
  const s = P.shipping;
  const cols = [
    ['id', P.id],
    ['title', TITLE],
    ['description', DESCRIPTION],
    ['link', P.url],
    ['image_link', P.images.main],
    ['additional_image_link', P.images.additional.join(',')],
    ['availability', P.availability],
    ['price', `${P.price.amount} ${P.price.currency}`],
    ['brand', P.brand],
    ['gtin', P.gtin],
    ['condition', P.condition],
    ['google_product_category', '1247'],
    ['product_type', 'Jeux de société > Jeux de cartes > Jeux de plis'],
    ['product_weight', `${P.weight.value} ${P.weight.unit}`],
    ['product_length', `${P.dimensions.length} ${P.dimensions.unit}`],
    ['product_width', `${P.dimensions.width} ${P.dimensions.unit}`],
    ['product_height', `${P.dimensions.height} ${P.dimensions.unit}`],
    ['ships_from_country', 'FR'],
    ['min_handling_time', s.handlingDays.min],
    ['max_handling_time', s.handlingDays.max],
    ['shipping', s.rates.map(r => `${r.country}:::${r.price} ${P.price.currency}`).join(',')]
  ];
  const clean = v => String(v).replace(/[\t\r\n]+/g, ' ');
  return `${cols.map(c => c[0]).join('\t')}\n${cols.map(c => clean(c[1])).join('\t')}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(join(ROOT, 'google-merchant-feed.xml'), buildFeed());
  writeFileSync(join(ROOT, 'google-merchant-feed.tsv'), buildTsv());
  console.log('✓ google-merchant-feed.xml, google-merchant-feed.tsv');
}

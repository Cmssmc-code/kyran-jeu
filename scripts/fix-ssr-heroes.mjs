import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const filesToFix = [
  'regle.html',
  'minijeu.html',
  'faq.html',
  'jeu-apero.html',
  'alternative-skyjo.html',
  'tarot-africain.html',
  'whist-moderne.html',
  'comparatif-jeux-plis.html',
  'dossier-presse.html',
  'plan-du-site.html',
  'cgv.html',
  'confidentialite.html',
  'mentions-legales.html',
  'blog/index.html'
];

function buildBreadcrumb(itemsJson) {
  if (!itemsJson) return '';
  let items = [];
  try {
    items = JSON.parse(itemsJson);
  } catch (e) {
    return '';
  }
  if (!items.length) return '';
  const parts = items.map((item, index) => {
    const isLast = index === items.length - 1;
    const href = item.href || '';
    if (isLast || !href) {
      return `<span class="breadcrumb-current" aria-current="page">${item.label}</span>`;
    }
    return `<a href="${href}">${item.label}</a><span class="breadcrumb-sep" aria-hidden="true">/</span>`;
  }).join('');
  return `<nav class="breadcrumb" aria-label="Fil d'Ariane">${parts}</nav>`;
}

for (const rel of filesToFix) {
  const filePath = path.join(root, rel);
  if (!fs.existsSync(filePath)) continue;
  let html = fs.readFileSync(filePath, 'utf8');

  // Match <kyran-page-hero ...>(optional content)</kyran-page-hero>
  const match = html.match(/<kyran-page-hero\b([^>]*)>([\s\S]*?)<\/kyran-page-hero>/i);
  if (!match) continue;

  const attrs = match[1];
  const eyebrowMatch = attrs.match(/eyebrow="([^"]*)"/i);
  const titleMatch = attrs.match(/title="([^"]*)"/i);
  const subtitleMatch = attrs.match(/subtitle="([^"]*)"/i);
  const breadcrumbMatch = attrs.match(/breadcrumb='([^']*)'/i) || attrs.match(/breadcrumb="([^"]*)"/i);

  const eyebrow = eyebrowMatch ? eyebrowMatch[1] : '';
  const title = titleMatch ? titleMatch[1].replace(/&quot;/g, '"') : '';
  const subtitle = subtitleMatch ? subtitleMatch[1] : '';
  const breadcrumbRaw = breadcrumbMatch ? breadcrumbMatch[1].replace(/&quot;/g, '"') : '[]';

  const breadcrumbHtml = buildBreadcrumb(breadcrumbRaw);

  const innerHtml = `
      <section class="page-hero">
        <div class="container">
          ${breadcrumbHtml ? `<div class="page-hero-breadcrumb">${breadcrumbHtml}</div>` : ''}
          ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
          <h1>${title}</h1>
          ${subtitle ? `<p class="hero-lead">${subtitle}</p>` : ''}
        </div>
      </section>
    `;

  const newHeroTag = `<kyran-page-hero${attrs}>${innerHtml}</kyran-page-hero>`;
  html = html.replace(match[0], newHeroTag);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`[SSR Hero OK] ${rel}`);
}

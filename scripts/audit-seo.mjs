import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const htmlFiles = [];

function scanDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!['node_modules', '.git', '.code-review-graph', 'email-previews'].includes(f)) {
        scanDir(full);
      }
    } else if (f.endsWith('.html')) {
      htmlFiles.push(full);
    }
  }
}
scanDir(root);

console.log('Total HTML files found:', htmlFiles.length);

const results = {
  missingTitle: [],
  badTitleLength: [],
  missingDesc: [],
  badDescLength: [],
  missingCanonical: [],
  missingRobots: [],
  missingH1: [],
  multipleH1: [],
  missingOgTitle: [],
  missingOgDesc: [],
  missingOgImage: [],
  missingTwCard: [],
  missingSchema: [],
  imagesNoAlt: [],
  summaryByFile: {}
};

for (const file of htmlFiles) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (rel.includes('Journal_Dev')) continue;

  const content = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(content);

  const title = $('title').text().trim();
  const desc = $('meta[name="description"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const robots = $('meta[name="robots"]').attr('content') || '';
  const isNoIndex = robots.toLowerCase().includes('noindex');

  const h1s = $('h1').map((_, el) => $(el).text().trim()).get().filter(t => t.length > 0);
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  const ogDesc = $('meta[property="og:description"]').attr('content') || '';
  const ogImage = $('meta[property="og:image"]').attr('content') || '';
  const twCard = $('meta[name="twitter:card"]').attr('content') || '';
  const imgs = $('img');
  let imgsNoAlt = 0;
  imgs.each((_, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined || alt === null) imgsNoAlt++;
  });

  const issues = [];

  const schemas = $('script[type="application/ld+json"]');
  schemas.each((idx, el) => {
    try {
      JSON.parse($(el).text());
    } catch (e) {
      issues.push(`Invalid JSON in ld+json #${idx}: ${e.message}`);
    }
  });

  if (!title) {
    results.missingTitle.push(rel);
    issues.push('Missing <title>');
  } else if (title.length < 25 || title.length > 70) {
    results.badTitleLength.push({ rel, length: title.length, title });
    issues.push(`Title length ${title.length}`);
  }

  if (!desc && !isNoIndex) {
    results.missingDesc.push(rel);
    issues.push('Missing meta description');
  } else if (desc && !isNoIndex && (desc.length < 70 || desc.length > 175)) {
    results.badDescLength.push({ rel, length: desc.length, desc });
    issues.push(`Desc length ${desc.length}`);
  }

  if (!canonical && !isNoIndex) {
    results.missingCanonical.push(rel);
    issues.push('Missing canonical URL');
  }

  if (!robots) {
    results.missingRobots.push(rel);
    issues.push('Missing meta robots');
  }

  if (!isNoIndex) {
    if (h1s.length === 0) {
      results.missingH1.push(rel);
      issues.push('Missing <h1>');
    } else if (h1s.length > 1) {
      results.multipleH1.push({ rel, count: h1s.length, h1s });
      issues.push(`Multiple <h1> (${h1s.length})`);
    }

    if (!ogTitle) {
      results.missingOgTitle.push(rel);
      issues.push('Missing og:title');
    }
    if (!ogDesc) {
      results.missingOgDesc.push(rel);
      issues.push('Missing og:description');
    }
    if (!ogImage) {
      results.missingOgImage.push(rel);
      issues.push('Missing og:image');
    }
    if (!twCard) {
      results.missingTwCard.push(rel);
      issues.push('Missing twitter:card');
    }
    if (schemas === 0) {
      results.missingSchema.push(rel);
      issues.push('Missing JSON-LD schema');
    }
  }

  if (imgsNoAlt > 0) {
    results.imagesNoAlt.push({ rel, count: imgsNoAlt });
    issues.push(`${imgsNoAlt} <img> without alt`);
  }

  if (issues.length > 0) {
    results.summaryByFile[rel] = issues;
  }
}

// Vérification des liens internes
const brokenLinks = [];
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(content);
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('javascript:')) return;
    const clean = href.split('?')[0].split('#')[0];
    if (!clean) return;
    let target = clean.startsWith('/') ? path.join(root, clean) : path.join(path.dirname(file), clean);
    if (!fs.existsSync(target)) {
      brokenLinks.push({ file: path.relative(root, file).replace(/\\/g, '/'), href, target: path.relative(root, target).replace(/\\/g, '/') });
    }
  });
}
results.internalBrokenLinks = brokenLinks;

console.log('=== RAPPORT AUDIT SEO ===');
console.log('Fichiers scannés:', htmlFiles.length);
console.log('Fichiers avec anomalies:', Object.keys(results.summaryByFile).length);
console.log('\n--- Liens internes brisés (404 potentiels):', results.internalBrokenLinks);
console.log('\n--- Missing canonical:', results.missingCanonical);
console.log('\n--- Missing H1:', results.missingH1);
console.log('\n--- Multiple H1:', results.multipleH1.map(m => `${m.rel} (${m.count})`));
console.log('\n--- Missing JSON-LD:', results.missingSchema);
console.log('\n--- Missing OpenGraph/Twitter:', {
  ogTitle: results.missingOgTitle,
  ogDesc: results.missingOgDesc,
  ogImage: results.missingOgImage,
  twCard: results.missingTwCard
});
console.log('\n--- Images sans alt:', results.imagesNoAlt);
console.log('\n--- Bad Title Length:', results.badTitleLength.map(t => `[${t.rel}] (${t.length}) "${t.title}"`));
console.log('\n--- Bad Desc Length:', results.badDescLength.map(d => `[${d.rel}] (${d.length}) "${d.desc.slice(0, 50)}..."`));
console.log('\n--- Missing robots:', results.missingRobots);
console.log('\n--- Détail anomalies restantes:', results.summaryByFile);


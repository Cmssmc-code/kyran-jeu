/**
 * Regénère feed.xml et schema blog/index.html
 * Run: node scripts/generate-blog-infra.mjs
 * Sitemap + plan du site : node scripts/generate-seo.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ARTICLES } from './blog-articles-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://kyran-jeu.fr';

function rssDate(iso) {
  const d = new Date(iso + 'T10:00:00+02:00');
  return d.toUTCString().replace('GMT', '+0200');
}

const items = [...ARTICLES]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map(a => `    <item>
      <title>${a.title.replace(/&/g, '&amp;')}</title>
      <link>${SITE}/blog/${a.slug}.html</link>
      <guid isPermaLink="true">${SITE}/blog/${a.slug}.html</guid>
      <pubDate>${rssDate(a.date)}</pubDate>
      <description>${a.description.replace(/&/g, '&amp;').replace(/'/g, '&apos;')}</description>
    </item>`)
  .join('\n');

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog KYRAN</title>
    <link>${SITE}/blog/index.html</link>
    <description>Sélections de jeux de cartes et de société, idées cadeaux et conseils pour vos soirées.</description>
    <language>fr-FR</language>
    <lastBuildDate>${rssDate('2026-06-30')}</lastBuildDate>
    <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE}/logo.png</url>
      <title>Blog KYRAN</title>
      <link>${SITE}/blog/index.html</link>
    </image>
${items}
  </channel>
</rss>
`;

writeFileSync(join(ROOT, 'blog', 'feed.xml'), feed, 'utf8');

const blogPostsJson = ARTICLES.map(a => ({
  '@type': 'BlogPosting',
  headline: a.title,
  url: `${SITE}/blog/${a.slug}.html`,
  datePublished: a.date,
  image: SITE + a.heroImage
}));

const indexPath = join(ROOT, 'blog', 'index.html');
let indexHtml = readFileSync(indexPath, 'utf8');
const schemaBlock = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog/index.html' }
      ]
    },
    {
      '@type': 'Blog',
      name: 'Blog KYRAN',
      description: '30 sélections éditoriales de jeux de cartes et de société.',
      url: SITE + '/blog/index.html',
      publisher: { '@id': SITE + '/#organization' },
      inLanguage: 'fr-FR',
      blogPost: blogPostsJson
    }
  ]
}, null, 2);

indexHtml = indexHtml.replace(
  /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
  `<script type="application/ld+json">\n  ${schemaBlock}\n  </script>`
);
writeFileSync(indexPath, indexHtml, 'utf8');

console.log('Updated feed.xml and blog/index.html schema with', ARTICLES.length, 'articles');

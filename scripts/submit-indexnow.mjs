import fs from 'node:fs';
import path from 'node:path';

const host = 'hk.onyxdevslab.com';
const key = '9c37a18bd2044e1687f45c2e91ad603b';
const keyLocation = `https://${host}/${key}.txt`;
const sitemapPath = path.resolve('dist/sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  throw new Error('dist/sitemap.xml is missing; run npm run build first');
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

if (!urlList.length) throw new Error('No URLs found in dist/sitemap.xml');

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
  signal: AbortSignal.timeout(20_000),
});

if (![200, 202].includes(response.status)) {
  const responseText = await response.text();
  throw new Error(`IndexNow submission failed: HTTP ${response.status} ${responseText}`);
}

console.log(JSON.stringify({ status: response.status, submittedUrls: urlList.length, keyLocation }, null, 2));

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
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const machineResourcePaths = [
  '/llms.txt',
  '/llms-full.txt',
  '/feed.xml',
  '/data/case-study-evidence.json',
  '/data/enterprise-ai-partner-scorecard.json',
  '/data/enterprise-ai-pilot-charter.json',
  '/data/organization.json',
  '/data/enterprise-ai-engagement-model-map.json',
  '/data/ai-search-evidence-status.json',
];
for (const pathname of machineResourcePaths) {
  if (!fs.existsSync(path.join('dist', pathname))) throw new Error(`Machine discovery resource is missing: dist${pathname}`);
}
const machineResourceUrls = machineResourcePaths.map((pathname) => `https://${host}${pathname}`);
const urlList = [...new Set([...sitemapUrls, ...machineResourceUrls])];

if (!sitemapUrls.length) throw new Error('No URLs found in dist/sitemap.xml');

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

console.log(JSON.stringify({ status: response.status, sitemapUrls: sitemapUrls.length, machineResourceUrls: machineResourceUrls.length, submittedUrls: urlList.length, keyLocation, caveat: 'HTTP 200 or 202 proves receipt only, not crawl, indexing, citation, or recommendation.' }, null, 2));

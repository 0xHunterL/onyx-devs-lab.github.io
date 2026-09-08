import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const failures = [];
const htmlFiles = [];
const titles = new Map();
const canonicals = new Map();

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name === 'index.html') htmlFiles.push(file);
  }
}

walk(dist);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(dist, file);
  if (!/<html lang="[^"]+"/.test(html)) failures.push(`${relative}: missing lang`);
  if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`${relative}: missing title`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) failures.push(`${relative}: missing description`);
  if (!/<link rel="canonical" href="https:\/\/hk\.onyxdevslab\.com\//.test(html)) failures.push(`${relative}: missing hk canonical`);
  if (!/<h1[ >]/.test(html)) failures.push(`${relative}: missing H1`);
  if (!html.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io')) failures.push(`${relative}: missing public GitHub entity reference`);
  if (!html.includes('"leiCode":"254900Z30CLK7HKE9H46"')) failures.push(`${relative}: missing direct LEI organization property`);
  if (!html.includes('"logo":{"@type":"ImageObject","url":"https://hk.onyxdevslab.com/favicon.svg"')) failures.push(`${relative}: missing organization logo`);
  if (!html.includes('"contactPoint":{"@type":"ContactPoint"')) failures.push(`${relative}: missing organization contact point`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (title) titles.set(title, [...(titles.get(title) || []), relative]);
  if (canonical) canonicals.set(canonical, [...(canonicals.get(canonical) || []), relative]);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch { failures.push(`${relative}: invalid JSON-LD`); }
  }
}

for (const [title, files] of titles) if (files.length > 1) failures.push(`duplicate title: ${title}`);
for (const [canonical, files] of canonicals) if (files.length > 1) failures.push(`duplicate canonical: ${canonical}`);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/href="(\/(?:en|zh-hk|zh-cn)\/[^"?#]*)"/g)) {
    const pathname = match[1];
    const target = pathname.endsWith('/') ? path.join(dist, pathname, 'index.html') : path.join(dist, pathname);
    if (!fs.existsSync(target)) failures.push(`${path.relative(dist, file)}: broken internal link ${pathname}`);
  }
}

for (const file of htmlFiles.filter((candidate) => candidate.includes(`${path.sep}zh-cn${path.sep}`))) {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('<html lang="zh-CN">')) failures.push(`${path.relative(dist, file)}: expected zh-CN document language`);
  for (const language of ['en', 'zh-Hant-HK', 'zh-CN', 'x-default']) {
    if (!html.includes(`hreflang="${language}"`)) failures.push(`${path.relative(dist, file)}: missing ${language} alternate`);
  }
}

for (const file of ['robots.txt', 'sitemap.xml', 'feed.xml', 'llms.txt', 'llms-full.txt', '.nojekyll']) {
  if (!fs.existsSync(path.join(dist, file))) failures.push(`missing ${file}`);
}

const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
for (const url of urls) {
  const pathname = new URL(url).pathname;
  const target = pathname === '/' ? path.join(dist, 'index.html') : path.join(dist, pathname, 'index.html');
  if (!fs.existsSync(target)) failures.push(`sitemap target missing: ${pathname}`);
}

const incomingLinks = new Map(urls.map((url) => [url, new Set()]));
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const source = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!source) continue;
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    try {
      const target = new URL(match[1], source);
      if (target.origin !== 'https://hk.onyxdevslab.com') continue;
      target.search = '';
      target.hash = '';
      incomingLinks.get(target.href)?.add(source);
    } catch {
      failures.push(`${path.relative(dist, file)}: invalid anchor URL ${match[1]}`);
    }
  }
}

const orphanUrls = urls.filter((url) => new URL(url).pathname !== '/' && !incomingLinks.get(url)?.size);
for (const url of orphanUrls) failures.push(`sitemap URL has no static HTML inbound link: ${url}`);
const lowestInboundCounts = [...incomingLinks]
  .filter(([url]) => new URL(url).pathname !== '/')
  .map(([url, sources]) => ({ url, sources: sources.size }))
  .sort((left, right) => left.sources - right.sources)
  .slice(0, 10);

const report = { htmlFiles: htmlFiles.length, sitemapUrls: urls.length, orphanUrls, lowestInboundCounts, failures };
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);

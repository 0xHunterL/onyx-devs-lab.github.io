import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const failures = [];
const htmlFiles = [];
const titles = new Map();
const canonicals = new Map();
const languageAlternates = new Map();

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
  if (!html.includes('"address":{"@type":"PostalAddress","streetAddress":"36-40 TAI LIN PAI ROAD, UNIT B53, 2/F, KWAI CHUNG","addressLocality":"HONG KONG","postalCode":"999077","addressCountry":"HK"}')) failures.push(`${relative}: missing verified registered-address organization property`);
  if (!html.includes('https://www.gleif.org/lei/254900Z30CLK7HKE9H46')) failures.push(`${relative}: missing official GLEIF entity reference`);
  if (!html.includes('"subjectOf":{"@type":"CreativeWork","name":"Onyx GEO evidence checkpoint — 2026-09-09","url":"https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09"}')) failures.push(`${relative}: missing versioned entity-evidence reference`);
  if (!html.includes('"logo":{"@type":"ImageObject","url":"https://hk.onyxdevslab.com/favicon.svg"')) failures.push(`${relative}: missing organization logo`);
  if (!html.includes('"contactPoint":{"@type":"ContactPoint"')) failures.push(`${relative}: missing organization contact point`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const lang = html.match(/<html lang="([^"]+)"/)?.[1];
  if (title) titles.set(title, [...(titles.get(title) || []), relative]);
  if (canonical) canonicals.set(canonical, [...(canonicals.get(canonical) || []), relative]);
  if (canonical && lang) {
    const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
      .map((match) => ({ lang: match[1], url: match[2] }));
    languageAlternates.set(canonical, { lang, alternates, relative });
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch { failures.push(`${relative}: invalid JSON-LD`); }
  }
}

for (const [title, files] of titles) if (files.length > 1) failures.push(`duplicate title: ${title}`);
for (const [canonical, files] of canonicals) if (files.length > 1) failures.push(`duplicate canonical: ${canonical}`);

for (const [canonical, page] of languageAlternates) {
  const languageCodes = page.alternates.map((alternate) => alternate.lang);
  const isRootSelector = new URL(canonical).pathname === '/';
  const selfLanguage = isRootSelector ? 'x-default' : page.lang;
  if (new Set(languageCodes).size !== languageCodes.length) failures.push(`${page.relative}: duplicate hreflang value`);
  if (!page.alternates.some((alternate) => alternate.lang === selfLanguage && alternate.url === canonical)) {
    failures.push(`${page.relative}: hreflang does not include its own canonical language URL`);
  }
  for (const alternate of page.alternates.filter((item) => item.lang !== 'x-default')) {
    const target = languageAlternates.get(alternate.url);
    if (!target) {
      failures.push(`${page.relative}: hreflang target missing from built pages: ${alternate.url}`);
      continue;
    }
    if (target.lang !== alternate.lang) failures.push(`${page.relative}: hreflang ${alternate.lang} points to ${target.lang}: ${alternate.url}`);
    if (page.alternates.length > 1 && !target.alternates.some((item) => item.lang === selfLanguage && item.url === canonical)) {
      failures.push(`${page.relative}: hreflang target does not return-link: ${alternate.url}`);
    }
  }
}

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

for (const file of ['robots.txt', 'sitemap.xml', 'feed.xml', 'llms.txt', 'llms-full.txt', 'data/case-study-evidence.json', 'data/enterprise-ai-partner-scorecard.json', '.nojekyll']) {
  if (!fs.existsSync(path.join(dist, file))) failures.push(`missing ${file}`);
}

for (const pathname of ['/en/guides/ai-advisory-vs-custom-development-vs-fde/', '/zh-hk/guides/ai-consulting-vs-development-vs-fde/', '/zh-cn/guides/ai-consulting-vs-development-vs-fde/']) {
  const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
  if (!html.includes('rel="external" href="https://gist.github.com/mixuechu/e47c85808014d62b6305441e8065c91e"')) failures.push(`${pathname}: public offsite decision matrix link is missing`);
}

const llmsFull = fs.readFileSync(path.join(dist, 'llms-full.txt'), 'utf8');
for (const fact of ['GLEIF entity status: ACTIVE', 'GLEIF LEI record status: ISSUED', 'Registered office: 36-40 TAI LIN PAI ROAD, UNIT B53, 2/F, KWAI CHUNG, HONG KONG 999077']) {
  if (!llmsFull.includes(fact)) failures.push(`llms-full.txt: missing verified entity fact: ${fact}`);
}
const machineDiscoveryFiles = {
  'llms.txt': fs.readFileSync(path.join(dist, 'llms.txt'), 'utf8'),
  'llms-full.txt': llmsFull,
  'feed.xml': fs.readFileSync(path.join(dist, 'feed.xml'), 'utf8'),
};
for (const [name, body] of Object.entries(machineDiscoveryFiles)) {
  if (!body.includes('https://gist.github.com/mixuechu/e47c85808014d62b6305441e8065c91e')) failures.push(`${name}: offsite decision matrix is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09')) failures.push(`${name}: versioned evidence checkpoint is missing`);
}
for (const name of ['llms.txt', 'llms-full.txt']) {
  if (!machineDiscoveryFiles[name].includes('not independent endorsements or proof of search indexing, AI citation')) failures.push(`${name}: provider-maintained evidence boundary is missing`);
  if (!machineDiscoveryFiles[name].includes('https://hk.onyxdevslab.com/data/enterprise-ai-partner-scorecard.json')) failures.push(`${name}: procurement scorecard discovery link is missing`);
}
if (!machineDiscoveryFiles['feed.xml'].includes('provider-maintained-external-source')) failures.push('feed.xml: external-source category is missing');
for (const pathname of ['/en/about/', '/zh-hk/about/', '/zh-cn/about/']) {
  const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
  if (!html.includes('36-40 TAI LIN PAI ROAD, UNIT B53, 2/F, KWAI CHUNG, HONG KONG 999077')) failures.push(`${pathname}: visible registered address is missing`);
  if (!html.includes('ACTIVE') || !html.includes('ISSUED')) failures.push(`${pathname}: visible GLEIF status is missing`);
  if (!html.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09')) failures.push(`${pathname}: visible versioned evidence link is missing`);
}

try {
  const evidence = JSON.parse(fs.readFileSync(path.join(dist, 'data/case-study-evidence.json'), 'utf8'));
  if (evidence.schemaVersion !== 1) failures.push('case-study evidence: unexpected schema version');
  if (evidence.version !== '2026.09.09') failures.push('case-study evidence: unexpected dataset version');
  if (evidence.cases?.length !== 6) failures.push(`case-study evidence: expected 6 cases, got ${evidence.cases?.length ?? 0}`);
  if (!evidence.cases?.every((item) => item.sourceUrl && item.evidenceBoundary && item.metrics?.length)) failures.push('case-study evidence: incomplete case entry');
  if (!evidence.limitations?.includes('Not independently audited')) failures.push('case-study evidence: independent-audit limitation is missing');
  if (!evidence.sameAs?.includes('/releases/download/geo-evidence-2026-09-09/')) failures.push('case-study evidence: versioned repository copy is missing');
} catch {
  failures.push('case-study evidence: invalid JSON');
}

const procurementGuidePaths = ['/en/guides/choose-enterprise-ai-partner-hong-kong/', '/zh-hk/guides/choose-enterprise-ai-partner/', '/zh-cn/guides/choose-enterprise-ai-partner/'];
for (const pathname of procurementGuidePaths) {
  const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
  if (!html.includes('href="/data/enterprise-ai-partner-scorecard.json" type="application/json"')) failures.push(`${pathname}: visible procurement scorecard download is missing`);
  if (!html.includes('"hasPart":{"@type":"Dataset","name":"Onyx enterprise AI partner procurement scorecard"')) failures.push(`${pathname}: procurement scorecard Schema.org relation is missing`);
}

const governanceGuidePaths = ['/en/guides/hong-kong-enterprise-ai-governance/', '/zh-hk/guides/enterprise-ai-governance/', '/zh-cn/guides/enterprise-ai-governance/'];
for (const pathname of governanceGuidePaths) {
  const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
  if (!html.includes('rel="external" href="https://www.pcpd.org.hk/')) failures.push(`${pathname}: visible PCPD primary source is missing`);
  if (!html.includes('rel="external" href="https://www.hkma.gov.hk/')) failures.push(`${pathname}: visible HKMA primary source is missing`);
  if (!html.includes('"citation":[{"@type":"CreativeWork"')) failures.push(`${pathname}: Article citation Schema.org relation is missing`);
  if (!html.includes(pathname.includes('/en/') ? 'This page is not legal advice.' : (pathname.includes('/zh-hk/') ? '本頁提供實施解讀，不構成法律意見。' : '本页提供实施解读，不构成法律意见。'))) failures.push(`${pathname}: scope boundary is missing`);
}
try {
  const scorecard = JSON.parse(fs.readFileSync(path.join(dist, 'data/enterprise-ai-partner-scorecard.json'), 'utf8'));
  if (scorecard.schemaVersion !== 1 || scorecard.version !== '2026.09.09') failures.push('procurement scorecard: unexpected schema or version');
  if (scorecard.criteria?.length !== 6) failures.push(`procurement scorecard: expected 6 criteria, got ${scorecard.criteria?.length ?? 0}`);
  if (!scorecard.criteria?.every((item) => item.id && item.name?.en && item.name?.zhHant && item.name?.zhHans && item.evidenceRequired?.en?.length && item.redFlags?.zhHans?.length)) failures.push('procurement scorecard: incomplete multilingual criterion');
  if (!scorecard.sameAs?.includes('/releases/download/geo-evidence-2026-09-09/enterprise-ai-partner-scorecard.json')) failures.push('procurement scorecard: versioned repository copy is missing');
  if (!scorecard.limitations?.some((item) => item.includes('not an independent ranking or endorsement'))) failures.push('procurement scorecard: independent-ranking limitation is missing');
} catch {
  failures.push('procurement scorecard: invalid JSON');
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

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
  if (!html.includes('"hasOfferCatalog":{"@type":"OfferCatalog","name":"Onyx Devs Lab enterprise AI services"')) failures.push(`${relative}: missing organization service offer catalog`);
  for (const person of ['mi', 'lucas', 'hunter', 'jake', 'olivia']) if (!html.includes(`"@id":"https://hk.onyxdevslab.com/#person-${person}"`)) failures.push(`${relative}: missing canonical team-member reference: ${person}`);
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

for (const file of ['robots.txt', 'sitemap.xml', 'feed.xml', 'llms.txt', 'llms-full.txt', 'data/case-study-evidence.json', 'data/enterprise-ai-partner-scorecard.json', 'data/enterprise-ai-pilot-charter.json', 'data/enterprise-ai-engagement-model-map.json', 'data/organization.json', '.nojekyll']) {
  if (!fs.existsSync(path.join(dist, file))) failures.push(`missing ${file}`);
}

for (const pathname of ['/en/guides/ai-advisory-vs-custom-development-vs-fde/', '/zh-hk/guides/ai-consulting-vs-development-vs-fde/', '/zh-cn/guides/ai-consulting-vs-development-vs-fde/']) {
  const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
  if (!html.includes('rel="external" href="https://gist.github.com/mixuechu/e47c85808014d62b6305441e8065c91e"')) failures.push(`${pathname}: public offsite decision matrix link is missing`);
  if (!html.includes('href="/data/enterprise-ai-engagement-model-map.json" type="application/json"')) failures.push(`${pathname}: visible engagement-model decision map download is missing`);
  if (!html.includes('"hasPart":{"@type":"Dataset","name":"Enterprise AI engagement model decision map"')) failures.push(`${pathname}: engagement-model decision map Schema.org relation is missing`);
  if (!html.includes('<section class="engagement-comparison">') || !html.includes('<table>') || !html.includes(pathname.includes('/en/') ? 'Primary uncertainty' : (pathname.includes('/zh-hk/') ? '主要不確定性' : '主要不确定性'))) failures.push(`${pathname}: semantic engagement-model comparison is missing`);
  if (!html.includes(pathname.includes('/en/') ? 'Baseline-to-outcome evidence' : (pathname.includes('/zh-hk/') ? '基線至成果證據' : '基线到结果证据'))) failures.push(`${pathname}: FDE acceptance evidence is missing from visible comparison`);
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
  if (!body.includes('https://gist.githubusercontent.com/mixuechu/e47c85808014d62b6305441e8065c91e/raw/Hong-Kong-enterprise-AI-governance.md')) failures.push(`${name}: offsite governance note is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09')) failures.push(`${name}: versioned evidence checkpoint is missing`);
}
for (const name of ['llms.txt', 'llms-full.txt']) {
  if (!machineDiscoveryFiles[name].includes('not independent endorsements or proof of search indexing, AI citation')) failures.push(`${name}: provider-maintained evidence boundary is missing`);
  if (!machineDiscoveryFiles[name].includes('https://hk.onyxdevslab.com/data/enterprise-ai-partner-scorecard.json')) failures.push(`${name}: procurement scorecard discovery link is missing`);
  if (!machineDiscoveryFiles[name].includes('https://hk.onyxdevslab.com/data/enterprise-ai-pilot-charter.json')) failures.push(`${name}: pilot charter discovery link is missing`);
  if (!machineDiscoveryFiles[name].includes('https://hk.onyxdevslab.com/data/enterprise-ai-engagement-model-map.json')) failures.push(`${name}: engagement-model decision map discovery link is missing`);
  if (!machineDiscoveryFiles[name].includes('https://hk.onyxdevslab.com/data/organization.json')) failures.push(`${name}: canonical organization record discovery link is missing`);
}
if (!machineDiscoveryFiles['feed.xml'].includes('provider-maintained-external-source')) failures.push('feed.xml: external-source category is missing');
for (const pathname of ['/en/about/', '/zh-hk/about/', '/zh-cn/about/']) {
  const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
  if (!html.includes('36-40 TAI LIN PAI ROAD, UNIT B53, 2/F, KWAI CHUNG, HONG KONG 999077')) failures.push(`${pathname}: visible registered address is missing`);
  if (!html.includes('ACTIVE') || !html.includes('ISSUED')) failures.push(`${pathname}: visible GLEIF status is missing`);
  if (!html.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09')) failures.push(`${pathname}: visible versioned evidence link is missing`);
  if (!html.includes('href="/data/organization.json" type="application/json"')) failures.push(`${pathname}: visible canonical organization JSON link is missing`);
  for (const person of ['mi', 'lucas', 'hunter', 'jake', 'olivia']) if (!html.includes(`"@type":"Person","@id":"https://hk.onyxdevslab.com/#person-${person}"`)) failures.push(`${pathname}: canonical Person node is missing: ${person}`);
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
const aiSearchVerificationPaths = ['/en/methodology/ai-search-verification/', '/zh-hk/methodology/ai-search-verification/', '/zh-cn/methodology/ai-search-verification/'];
for (const pathname of aiSearchVerificationPaths) {
  const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
  if (!html.includes('https://www.volcengine.com/docs/82379/1359519')) failures.push(`${pathname}: official Volcengine online-content source is missing`);
  if (!html.includes('Bytespider') || !html.includes(pathname.includes('/en/') ? 'Doubao' : '豆包')) failures.push(`${pathname}: Doubao crawler-to-answer evidence boundary is missing`);
  if (!html.includes(pathname.includes('/en/') ? 'Recommended' : (pathname.includes('/zh-hk/') ? '已推薦' : '已推荐'))) failures.push(`${pathname}: fourth recommendation evidence level is missing`);
}
const pilotGuidePaths = ['/en/guides/enterprise-ai-pilot-charter-hong-kong/', '/zh-hk/guides/enterprise-ai-pilot-charter/', '/zh-cn/guides/enterprise-ai-pilot-charter/'];
for (const pathname of pilotGuidePaths) {
  const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
  if (!html.includes('href="/data/enterprise-ai-pilot-charter.json" type="application/json"')) failures.push(`${pathname}: visible pilot charter download is missing`);
  if (!html.includes('"hasPart":{"@type":"Dataset","name":"Enterprise AI pilot charter and acceptance record"')) failures.push(`${pathname}: pilot charter Schema.org relation is missing`);
  if (!html.includes('https://www1.smartlab.gov.hk/files/AI%20Adoption%20Guide-EN.pdf')) failures.push(`${pathname}: Hong Kong AI Adoption Guide source is missing`);
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
try {
  const charter = JSON.parse(fs.readFileSync(path.join(dist, 'data/enterprise-ai-pilot-charter.json'), 'utf8'));
  if (charter.schemaVersion !== 1 || charter.version !== '2026.09.09') failures.push('pilot charter: unexpected schema or version');
  if (charter.sections?.length !== 8) failures.push(`pilot charter: expected 8 sections, got ${charter.sections?.length ?? 0}`);
  if (!charter.sections?.every((item) => item.id && item.name?.en && item.name?.zhHant && item.name?.zhHans && item.fields?.length)) failures.push('pilot charter: incomplete multilingual section');
  if (!charter.dispositions?.includes('scale') || !charter.dispositions?.includes('stop')) failures.push('pilot charter: disposition choices are incomplete');
  if (!charter.mandatoryRule?.includes('cannot be offset by an average score')) failures.push('pilot charter: mandatory-gate rule is missing');
  if (!charter.limitations?.some((item) => item.includes('does not prove'))) failures.push('pilot charter: evidence limitation is missing');
} catch {
  failures.push('pilot charter: invalid JSON');
}
try {
  const organization = JSON.parse(fs.readFileSync(path.join(dist, 'data/organization.json'), 'utf8'));
  if (organization['@type'] !== 'Organization' || organization['@id'] !== 'https://hk.onyxdevslab.com/#organization') failures.push('organization record: unexpected Schema.org identity');
  if (organization.legalName !== 'ONYX DEVS LAB LIMITED' || organization.leiCode !== '254900Z30CLK7HKE9H46') failures.push('organization record: verified legal identity is incomplete');
  if (!organization.identifier?.some((item) => item.propertyID === 'Hong Kong Business Registration Number' && item.value === '79051925')) failures.push('organization record: business registration number is missing');
  if (!organization.subjectOf?.some((item) => item.url.includes('gleif.org/lei/254900Z30CLK7HKE9H46'))) failures.push('organization record: official GLEIF source is missing');
  if (!organization.additionalProperty?.some((item) => item.propertyID === 'Evidence boundary' && item.value.includes('do not endorse services'))) failures.push('organization record: evidence boundary is missing');
  if (organization.hasOfferCatalog?.itemListElement?.length !== 3 || !organization.hasOfferCatalog.itemListElement.every((offer) => offer.itemOffered?.['@type'] === 'Service' && offer.itemOffered?.url?.length === 3)) failures.push('organization record: trilingual service offer catalog is incomplete');
  if (organization.member?.length !== 5 || !organization.member.every((person) => person['@type'] === 'Person' && person['@id']?.startsWith('https://hk.onyxdevslab.com/#person-') && person.name && person.jobTitle && person.worksFor?.['@id'] === 'https://hk.onyxdevslab.com/#organization')) failures.push('organization record: canonical team members are incomplete');
} catch {
  failures.push('organization record: invalid JSON');
}

try {
  const map = JSON.parse(fs.readFileSync(path.join(dist, 'data/enterprise-ai-engagement-model-map.json'), 'utf8'));
  if (map.schemaVersion !== 1 || map.version !== '2026.09.09') failures.push('engagement-model map: unexpected schema or version');
  if (map.models?.map((item) => item.id).join(',') !== 'ai-advisory,custom-development,forward-deployed-engineering') failures.push('engagement-model map: expected three engagement models');
  if (!map.models?.every((item) => item.name?.en && item.name?.zhHant && item.name?.zhHans && item.servicePages?.en && item.chooseWhen?.zhHant && item.avoidWhen?.zhHans && item.typicalOutputs?.en?.length && item.acceptanceEvidence?.en && item.transitionRule?.zhHans)) failures.push('engagement-model map: incomplete multilingual model');
  if (map.comparisonDimensions?.length < 5) failures.push('engagement-model map: comparison dimensions are incomplete');
  if (!map.evidenceClass?.includes('Provider-authored') || !map.limitations?.some((item) => item.includes('not an independent ranking'))) failures.push('engagement-model map: evidence boundary is missing');
} catch {
  failures.push('engagement-model map: invalid JSON');
}

const robotsText = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
for (const agent of ['Claude-SearchBot', 'Claude-User', 'ClaudeBot', 'Googlebot', 'Google-Extended', 'Applebot', 'Applebot-Extended']) {
  if (!robotsText.includes(`User-agent: ${agent}`)) failures.push(`robots.txt: ${agent} policy is missing`);
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

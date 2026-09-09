const origin = (process.argv[2] || 'https://hk.onyxdevslab.com').replace(/\/$/, '');
const canonicalOrigin = (process.argv[3] || 'https://hk.onyxdevslab.com').replace(/\/$/, '');
const failures = [];

async function get(pathname, expectedType, userAgent = 'Onyx-GEO-Release-Check/1.0') {
  const requestedUrl = `${origin}${pathname}`;
  const response = await fetch(requestedUrl, {
    headers: { 'user-agent': userAgent },
    redirect: 'follow',
  });
  const body = await response.text();
  const contentType = response.headers.get('content-type') || '';
  if (!response.ok) failures.push(`${pathname}: HTTP ${response.status}`);
  if (response.redirected || response.url !== requestedUrl) failures.push(`${pathname}: unexpected redirect to ${response.url}`);
  if (!contentType.includes(expectedType)) failures.push(`${pathname}: expected ${expectedType}, got ${contentType || 'none'}`);
  const xRobotsTag = response.headers.get('x-robots-tag') || '';
  if (/\b(?:noindex|none)\b/i.test(xRobotsTag)) failures.push(`${pathname}: blocking X-Robots-Tag: ${xRobotsTag}`);
  if (/cf-chl-|challenge-platform|<title>\s*Just a moment/i.test(body)) failures.push(`${pathname}: Cloudflare challenge page detected`);
  return { response, body, contentType };
}

const robots = await get('/robots.txt', 'text/plain');
if (!robots.body.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) failures.push('/robots.txt: sitemap declaration is missing or points to the wrong canonical origin');
if (!robots.body.includes('OAI-SearchBot')) failures.push('/robots.txt: OAI-SearchBot policy is missing');
if (!robots.body.includes('Bytespider')) failures.push('/robots.txt: Bytespider policy is missing');
if (!robots.body.includes('PerplexityBot')) failures.push('/robots.txt: PerplexityBot policy is missing');
if (!robots.body.includes('Perplexity-User')) failures.push('/robots.txt: Perplexity-User policy is missing');
if (/^\s*Disallow:\s*\/\s*$/im.test(robots.body)) failures.push('/robots.txt: broad Disallow rule detected');

const llms = await get('/llms.txt', 'text/plain');
if (!llms.body.includes('# Onyx Devs Lab')) failures.push('/llms.txt: expected site summary is missing');

const llmsFull = await get('/llms-full.txt', 'text/plain');
if (!llmsFull.body.includes('Legal entity: ONYX DEVS LAB LIMITED')) failures.push('/llms-full.txt: verified entity summary is missing');
if (!llmsFull.body.includes('GLEIF entity status: ACTIVE')) failures.push('/llms-full.txt: GLEIF entity status is missing');
if (!llmsFull.body.includes('GLEIF LEI record status: ISSUED')) failures.push('/llms-full.txt: GLEIF LEI record status is missing');
if (!llmsFull.body.includes('Registered office: 36-40 TAI LIN PAI ROAD, UNIT B53, 2/F, KWAI CHUNG, HONG KONG 999077')) failures.push('/llms-full.txt: verified registered office is missing');

const feed = await get('/feed.xml', 'xml');
if (!feed.body.includes('<feed xmlns="http://www.w3.org/2005/Atom">')) failures.push('/feed.xml: Atom feed root is missing');
for (const [pathname, body] of [['/llms.txt', llms.body], ['/llms-full.txt', llmsFull.body], ['/feed.xml', feed.body]]) {
  if (!body.includes('https://gist.github.com/mixuechu/e47c85808014d62b6305441e8065c91e')) failures.push(`${pathname}: offsite decision matrix is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09')) failures.push(`${pathname}: versioned evidence checkpoint is missing`);
}
for (const [pathname, body] of [['/llms.txt', llms.body], ['/llms-full.txt', llmsFull.body]]) {
  if (!body.includes('not independent endorsements or proof of search indexing, AI citation')) failures.push(`${pathname}: provider-maintained evidence boundary is missing`);
}
if (!feed.body.includes('provider-maintained-external-source')) failures.push('/feed.xml: external-source category is missing');

const evidenceDatasetResponse = await get('/data/case-study-evidence.json', 'application/json');
try {
  const evidenceDataset = JSON.parse(evidenceDatasetResponse.body);
  if (evidenceDataset.schemaVersion !== 1) failures.push('/data/case-study-evidence.json: unexpected schema version');
  if (evidenceDataset.version !== '2026.09.09') failures.push('/data/case-study-evidence.json: unexpected dataset version');
  if (evidenceDataset.cases?.length !== 6) failures.push(`/data/case-study-evidence.json: expected 6 cases, got ${evidenceDataset.cases?.length ?? 0}`);
  if (!evidenceDataset.limitations?.includes('Not independently audited')) failures.push('/data/case-study-evidence.json: evidence limitation is missing');
  if (!evidenceDataset.sameAs?.includes('/releases/download/geo-evidence-2026-09-09/')) failures.push('/data/case-study-evidence.json: versioned repository copy is missing');
} catch {
  failures.push('/data/case-study-evidence.json: invalid JSON');
}

const indexNowKey = await get('/9c37a18bd2044e1687f45c2e91ad603b.txt', 'text/plain');
if (indexNowKey.body.trim() !== '9c37a18bd2044e1687f45c2e91ad603b') failures.push('/9c37a18bd2044e1687f45c2e91ad603b.txt: IndexNow key does not match');

const sitemap = await get('/sitemap.xml', 'xml');
const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urls.length < 53) failures.push(`/sitemap.xml: expected at least 53 URLs, got ${urls.length}`);
if (new Set(urls).size !== urls.length) failures.push('/sitemap.xml: duplicate canonical URLs detected');
for (const url of urls) {
  if (!url.startsWith(`${canonicalOrigin}/`)) failures.push(`/sitemap.xml: non-canonical origin: ${url}`);
}

const requiredPaths = [
  '/en/about/',
  '/zh-hk/about/',
  '/en/guides/ai-advisory-vs-custom-development-vs-fde/',
  '/zh-hk/guides/ai-consulting-vs-development-vs-fde/',
  '/en/guides/custom-ai-development-cost-hong-kong/',
  '/zh-hk/guides/ai-custom-development-cost/',
  '/en/guides/enterprise-ai-agent-erp-integration/',
  '/zh-hk/guides/enterprise-ai-agent-erp-integration/',
  '/en/methodology/enterprise-ai-evaluation/',
  '/zh-hk/methodology/enterprise-ai-evaluation/',
  '/zh-cn/',
  '/zh-cn/about/',
  '/zh-cn/ai-consulting/',
  '/zh-cn/custom-ai-development/',
  '/zh-cn/forward-deployed-engineering/',
  '/zh-cn/guides/ai-consulting-vs-development-vs-fde/',
  '/zh-cn/guides/custom-ai-development-cost/',
  '/zh-cn/guides/enterprise-ai-agent-erp-integration/',
  '/zh-cn/methodology/enterprise-ai-evaluation/',
  '/en/methodology/ai-search-verification/',
  '/zh-hk/methodology/ai-search-verification/',
  '/zh-cn/methodology/ai-search-verification/',
  '/en/methodology/case-study-evidence-register/',
  '/zh-hk/methodology/case-study-evidence-register/',
  '/zh-cn/methodology/case-study-evidence-register/',
  '/zh-cn/case-studies/retail-ai-decision-platform/',
  '/zh-cn/case-studies/accounting-ai-production-platform/',
  '/en/case-studies/legal-ai-evidence-workflow/',
  '/zh-hk/case-studies/legal-ai-evidence-workflow/',
  '/zh-cn/case-studies/legal-ai-evidence-workflow/',
  '/en/case-studies/recruiting-ai-agent-workflow/',
  '/zh-hk/case-studies/recruiting-ai-agent-workflow/',
  '/zh-cn/case-studies/recruiting-ai-agent-workflow/',
  '/en/case-studies/industrial-erp-ai-data-platform/',
  '/zh-hk/case-studies/industrial-erp-ai-data-platform/',
  '/zh-cn/case-studies/industrial-erp-ai-data-platform/',
  '/en/case-studies/credit-research-ai-agent/',
  '/zh-hk/case-studies/credit-research-ai-agent/',
  '/zh-cn/case-studies/credit-research-ai-agent/',
];
for (const pathname of requiredPaths) {
  if (!urls.some((url) => new URL(url).pathname === pathname)) failures.push(`/sitemap.xml: required GEO URL missing: ${pathname}`);
}


const bytespiderAgent = 'Mozilla/5.0 (compatible; Bytespider; +https://zhanzhang.toutiao.com/) Onyx-GEO-Release-Check/1.0';
for (const pathname of requiredPaths.filter((path) => path.startsWith('/zh-cn/'))) {
  const page = await get(pathname, 'text/html', bytespiderAgent);
  if (!page.body.includes('<html lang="zh-CN">')) failures.push(`${pathname}: Bytespider response is not the simplified Chinese HTML page`);
  if (!page.body.includes('application/ld+json')) failures.push(`${pathname}: Bytespider response is missing JSON-LD`);
}

for (const pathname of ['/en/guides/ai-advisory-vs-custom-development-vs-fde/', '/zh-hk/guides/ai-consulting-vs-development-vs-fde/', '/zh-cn/guides/ai-consulting-vs-development-vs-fde/']) {
  const page = await get(pathname, 'text/html');
  if (!page.body.includes('rel="external" href="https://gist.github.com/mixuechu/e47c85808014d62b6305441e8065c91e"')) failures.push(`${pathname}: public offsite decision matrix link is missing`);
}

for (const absoluteUrl of urls) {
  const url = new URL(absoluteUrl);
  const page = await get(url.pathname, 'text/html');
  if (!/<h1[ >][\s\S]*?<\/h1>/.test(page.body)) failures.push(`${url.pathname}: H1 is missing from response HTML`);
  if (!page.body.includes(`<link rel="canonical" href="${absoluteUrl}"`)) failures.push(`${url.pathname}: canonical does not match sitemap URL`);
  if (!page.body.includes('application/ld+json')) failures.push(`${url.pathname}: JSON-LD is missing`);
  if (!page.body.includes('"address":{"@type":"PostalAddress","streetAddress":"36-40 TAI LIN PAI ROAD, UNIT B53, 2/F, KWAI CHUNG","addressLocality":"HONG KONG","postalCode":"999077","addressCountry":"HK"}')) failures.push(`${url.pathname}: verified registered-address JSON-LD is missing`);
  if (!page.body.includes('https://www.gleif.org/lei/254900Z30CLK7HKE9H46')) failures.push(`${url.pathname}: official GLEIF entity reference is missing`);
  if (!page.body.includes('"subjectOf":{"@type":"CreativeWork","name":"Onyx GEO evidence checkpoint — 2026-09-09","url":"https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09"}')) failures.push(`${url.pathname}: versioned entity-evidence reference is missing`);
  if (/<meta[^>]+(?:name|property)=["']robots["'][^>]+content=["'][^"']*\b(?:noindex|none)\b/i.test(page.body)) failures.push(`${url.pathname}: blocking robots meta detected`);
}

console.log(JSON.stringify({ origin, canonicalOrigin, checkedPages: urls.length, failures }, null, 2));
if (failures.length) process.exit(1);

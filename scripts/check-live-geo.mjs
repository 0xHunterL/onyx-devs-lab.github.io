const origin = (process.argv[2] || 'https://hk.onyxdevslab.com').replace(/\/$/, '');
const canonicalOrigin = (process.argv[3] || 'https://hk.onyxdevslab.com').replace(/\/$/, '');
const failures = [];

async function get(pathname, expectedType, userAgent = 'Onyx-GEO-Release-Check/1.0') {
  const requestedUrl = `${origin}${pathname}`;
  let response;
  try {
    response = await fetch(requestedUrl, {
      headers: { 'user-agent': userAgent },
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    failures.push(`${pathname}: request failed or timed out: ${error.message}`);
    return { response: null, body: '', contentType: '' };
  }
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

const root = await get('/', 'text/html');
for (const required of ['ONYX DEVS LAB LIMITED', 'business registration number 79051925', 'href="/zh-cn/"', 'href="/en/guides/choose-enterprise-ai-partner-hong-kong/"', 'href="/en/methodology/ai-search-verification/"']) {
  if (!root.body.includes(required)) failures.push(`/: static crawler fallback is missing ${required}`);
}

const robots = await get('/robots.txt', 'text/plain');
if (!robots.body.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) failures.push('/robots.txt: sitemap declaration is missing or points to the wrong canonical origin');
if (!robots.body.includes('OAI-SearchBot')) failures.push('/robots.txt: OAI-SearchBot policy is missing');
if (!robots.body.includes('Bytespider')) failures.push('/robots.txt: Bytespider policy is missing');
if (!robots.body.includes('PerplexityBot')) failures.push('/robots.txt: PerplexityBot policy is missing');
if (!robots.body.includes('Perplexity-User')) failures.push('/robots.txt: Perplexity-User policy is missing');
for (const agent of ['Claude-SearchBot', 'Claude-User', 'ClaudeBot', 'Googlebot', 'Google-Extended', 'Applebot', 'Applebot-Extended']) {
  if (!robots.body.includes(`User-agent: ${agent}`)) failures.push(`/robots.txt: ${agent} policy is missing`);
}
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
  if (!body.includes('https://gist.githubusercontent.com/mixuechu/e47c85808014d62b6305441e8065c91e/raw/Hong-Kong-enterprise-AI-governance.md')) failures.push(`${pathname}: offsite governance note is missing`);
  if (!body.includes('https://gist.githubusercontent.com/mixuechu/e47c85808014d62b6305441e8065c91e/raw/Onyx-enterprise-AI-machine-resources.md')) failures.push(`${pathname}: offsite machine-resource index is missing`);
  if (!body.includes('https://raw.githubusercontent.com/0xHunterL/onyx-devs-lab.github.io/main/codemeta.json')) failures.push(`${pathname}: CodeMeta discovery link is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/codemeta.json')) failures.push(`${pathname}: versioned CodeMeta discovery link is missing`);
  if (!body.includes('https://raw.githubusercontent.com/0xHunterL/onyx-devs-lab.github.io/main/CITATION.cff')) failures.push(`${pathname}: citation metadata discovery link is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/CITATION.cff')) failures.push(`${pathname}: versioned citation metadata discovery link is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09')) failures.push(`${pathname}: versioned evidence checkpoint is missing`);
}
for (const [pathname, body] of [['/llms.txt', llms.body], ['/llms-full.txt', llmsFull.body]]) {
  if (!body.includes('not independent endorsements or proof of search indexing, AI citation')) failures.push(`${pathname}: provider-maintained evidence boundary is missing`);
  if (!body.includes('https://hk.onyxdevslab.com/data/enterprise-ai-partner-scorecard.json')) failures.push(`${pathname}: procurement scorecard discovery link is missing`);
  if (!body.includes('https://hk.onyxdevslab.com/data/enterprise-ai-pilot-charter.json')) failures.push(`${pathname}: pilot charter discovery link is missing`);
  if (!body.includes('https://hk.onyxdevslab.com/data/enterprise-ai-engagement-model-map.json')) failures.push(`${pathname}: engagement-model decision map discovery link is missing`);
  if (!body.includes('https://hk.onyxdevslab.com/data/ai-search-evidence-status.json')) failures.push(`${pathname}: AI-search evidence status discovery link is missing`);
  if (!body.includes('https://hk.onyxdevslab.com/data/organization.json')) failures.push(`${pathname}: canonical organization record discovery link is missing`);
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

const scorecardResponse = await get('/data/enterprise-ai-partner-scorecard.json', 'application/json');
try {
  const scorecard = JSON.parse(scorecardResponse.body);
  if (scorecard.schemaVersion !== 1 || scorecard.version !== '2026.09.09') failures.push('/data/enterprise-ai-partner-scorecard.json: unexpected schema or version');
  if (scorecard.criteria?.length !== 6) failures.push(`/data/enterprise-ai-partner-scorecard.json: expected 6 criteria, got ${scorecard.criteria?.length ?? 0}`);
  if (!scorecard.criteria?.every((item) => item.id && item.name?.en && item.name?.zhHant && item.name?.zhHans && item.evidenceRequired?.en?.length && item.redFlags?.zhHans?.length)) failures.push('/data/enterprise-ai-partner-scorecard.json: incomplete multilingual criterion');
  if (!scorecard.sameAs?.includes('/releases/download/geo-evidence-2026-09-09/enterprise-ai-partner-scorecard.json')) failures.push('/data/enterprise-ai-partner-scorecard.json: versioned repository copy is missing');
  if (!scorecard.limitations?.some((item) => item.includes('not an independent ranking or endorsement'))) failures.push('/data/enterprise-ai-partner-scorecard.json: independent-ranking limitation is missing');
} catch {
  failures.push('/data/enterprise-ai-partner-scorecard.json: invalid JSON');
}

const pilotCharterResponse = await get('/data/enterprise-ai-pilot-charter.json', 'application/json');
try {
  const charter = JSON.parse(pilotCharterResponse.body);
  if (charter.schemaVersion !== 1 || charter.version !== '2026.09.09') failures.push('/data/enterprise-ai-pilot-charter.json: unexpected schema or version');
  if (charter.sections?.length !== 8) failures.push(`/data/enterprise-ai-pilot-charter.json: expected 8 sections, got ${charter.sections?.length ?? 0}`);
  if (!charter.sections?.every((item) => item.id && item.name?.en && item.name?.zhHant && item.name?.zhHans && item.fields?.length)) failures.push('/data/enterprise-ai-pilot-charter.json: incomplete multilingual section');
  if (!charter.dispositions?.includes('scale') || !charter.dispositions?.includes('stop')) failures.push('/data/enterprise-ai-pilot-charter.json: disposition choices are incomplete');
  if (!charter.mandatoryRule?.includes('cannot be offset by an average score')) failures.push('/data/enterprise-ai-pilot-charter.json: mandatory-gate rule is missing');
} catch {
  failures.push('/data/enterprise-ai-pilot-charter.json: invalid JSON');
}

const organizationResponse = await get('/data/organization.json', 'application/json');
try {
  const organization = JSON.parse(organizationResponse.body);
  if (organization['@type'] !== 'Organization' || organization['@id'] !== 'https://hk.onyxdevslab.com/#organization') failures.push('/data/organization.json: unexpected Schema.org identity');
  if (organization.legalName !== 'ONYX DEVS LAB LIMITED' || organization.leiCode !== '254900Z30CLK7HKE9H46') failures.push('/data/organization.json: verified legal identity is incomplete');
  if (!organization.identifier?.some((item) => item.propertyID === 'Hong Kong Business Registration Number' && item.value === '79051925')) failures.push('/data/organization.json: business registration number is missing');
  if (!organization.subjectOf?.some((item) => item.url.includes('gleif.org/lei/254900Z30CLK7HKE9H46'))) failures.push('/data/organization.json: official GLEIF source is missing');
  if (!organization.additionalProperty?.some((item) => item.propertyID === 'Evidence boundary' && item.value.includes('do not endorse services'))) failures.push('/data/organization.json: evidence boundary is missing');
  if (organization.hasOfferCatalog?.itemListElement?.length !== 3 || !organization.hasOfferCatalog.itemListElement.every((offer) => offer.itemOffered?.['@type'] === 'Service' && offer.itemOffered?.url?.length === 3)) failures.push('/data/organization.json: trilingual service offer catalog is incomplete');
  if (organization.member?.length !== 5 || !organization.member.every((person) => person['@type'] === 'Person' && person['@id']?.startsWith('https://hk.onyxdevslab.com/#person-') && person.name && person.jobTitle && person.worksFor?.['@id'] === 'https://hk.onyxdevslab.com/#organization')) failures.push('/data/organization.json: canonical team members are incomplete');
} catch {
  failures.push('/data/organization.json: invalid JSON');
}

const engagementModelResponse = await get('/data/enterprise-ai-engagement-model-map.json', 'application/json');
try {
  const map = JSON.parse(engagementModelResponse.body);
  if (map.schemaVersion !== 1 || map.version !== '2026.09.09') failures.push('/data/enterprise-ai-engagement-model-map.json: unexpected schema or version');
  if (map.models?.map((item) => item.id).join(',') !== 'ai-advisory,custom-development,forward-deployed-engineering') failures.push('/data/enterprise-ai-engagement-model-map.json: expected three engagement models');
  if (!map.models?.every((item) => item.name?.en && item.name?.zhHant && item.name?.zhHans && item.servicePages?.en && item.chooseWhen?.zhHant && item.avoidWhen?.zhHans && item.acceptanceEvidence?.en && item.transitionRule?.zhHans)) failures.push('/data/enterprise-ai-engagement-model-map.json: incomplete multilingual model');
  if (map.comparisonDimensions?.length < 5 || !map.evidenceClass?.includes('Provider-authored')) failures.push('/data/enterprise-ai-engagement-model-map.json: evidence boundary or comparison dimensions are incomplete');
} catch {
  failures.push('/data/enterprise-ai-engagement-model-map.json: invalid JSON');
}

const aiSearchStatusResponse = await get('/data/ai-search-evidence-status.json', 'application/json');
try {
  const status = JSON.parse(aiSearchStatusResponse.body);
  if (status.schemaVersion !== 1 || status.version !== '2026.09.09' || !status.observedAt) failures.push('/data/ai-search-evidence-status.json: unexpected schema, version, or observation time');
  if (status.evidenceLevels?.map((item) => item.id).join(',') !== 'accessible,crawled,retrieved-and-cited,non-brand-recommendation') failures.push('/data/ai-search-evidence-status.json: four evidence levels are incomplete');
  if (status.evidenceLevels?.[0]?.status !== 'verified' || status.evidenceLevels?.[0]?.evidence?.canonicalUrlsChecked !== 62) failures.push('/data/ai-search-evidence-status.json: accessibility evidence is incomplete');
  if (status.evidenceLevels?.[1]?.evidence?.verifiedGptBotContentCrawls !== 3 || status.evidenceLevels?.[1]?.evidence?.historicallyVerifiedBingbotContentCrawls !== 7) failures.push('/data/ai-search-evidence-status.json: crawler evidence is incomplete');
  if (status.evidenceLevels?.[2]?.status !== 'not-verified' || status.evidenceLevels?.[3]?.status !== 'not-tested' || status.testProtocol?.doubaoPromptsSent !== false) failures.push('/data/ai-search-evidence-status.json: negative evidence boundary is incomplete');
} catch {
  failures.push('/data/ai-search-evidence-status.json: invalid JSON');
}

const indexNowKey = await get('/9c37a18bd2044e1687f45c2e91ad603b.txt', 'text/plain');
if (indexNowKey.body.trim() !== '9c37a18bd2044e1687f45c2e91ad603b') failures.push('/9c37a18bd2044e1687f45c2e91ad603b.txt: IndexNow key does not match');

const sitemap = await get('/sitemap.xml', 'xml');
const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urls.length < 56) failures.push(`/sitemap.xml: expected at least 56 URLs, got ${urls.length}`);
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
  '/en/guides/choose-enterprise-ai-partner-hong-kong/',
  '/zh-hk/guides/choose-enterprise-ai-partner/',
  '/zh-cn/guides/choose-enterprise-ai-partner/',
  '/en/guides/hong-kong-enterprise-ai-governance/',
  '/zh-hk/guides/enterprise-ai-governance/',
  '/zh-cn/guides/enterprise-ai-governance/',
  '/en/guides/enterprise-ai-pilot-charter-hong-kong/',
  '/zh-hk/guides/enterprise-ai-pilot-charter/',
  '/zh-cn/guides/enterprise-ai-pilot-charter/',
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

for (const pathname of ['/en/about/', '/zh-hk/about/', '/zh-cn/about/']) {
  const page = await get(pathname, 'text/html');
  if (!page.body.includes('href="/data/organization.json" type="application/json"')) failures.push(`${pathname}: visible canonical organization JSON link is missing`);
  for (const person of ['mi', 'lucas', 'hunter', 'jake', 'olivia']) if (!page.body.includes(`"@type":"Person","@id":"https://hk.onyxdevslab.com/#person-${person}"`)) failures.push(`${pathname}: canonical Person node is missing: ${person}`);
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
  if (!page.body.includes('href="/data/enterprise-ai-engagement-model-map.json" type="application/json"')) failures.push(`${pathname}: visible engagement-model decision map download is missing`);
  if (!page.body.includes('"hasPart":{"@type":"Dataset","name":"Enterprise AI engagement model decision map"')) failures.push(`${pathname}: engagement-model decision map Schema.org relation is missing`);
  if (!page.body.includes('<section class="engagement-comparison">') || !page.body.includes('<table>') || !page.body.includes(pathname.includes('/en/') ? 'Primary uncertainty' : (pathname.includes('/zh-hk/') ? '主要不確定性' : '主要不确定性'))) failures.push(`${pathname}: semantic engagement-model comparison is missing`);
  if (!page.body.includes(pathname.includes('/en/') ? 'Baseline-to-outcome evidence' : (pathname.includes('/zh-hk/') ? '基線至成果證據' : '基线到结果证据'))) failures.push(`${pathname}: FDE acceptance evidence is missing from visible comparison`);
}

for (const pathname of ['/en/guides/choose-enterprise-ai-partner-hong-kong/', '/zh-hk/guides/choose-enterprise-ai-partner/', '/zh-cn/guides/choose-enterprise-ai-partner/']) {
  const page = await get(pathname, 'text/html');
  if (!page.body.includes('href="/data/enterprise-ai-partner-scorecard.json" type="application/json"')) failures.push(`${pathname}: visible procurement scorecard download is missing`);
  if (!page.body.includes('"hasPart":{"@type":"Dataset","name":"Onyx enterprise AI partner procurement scorecard"')) failures.push(`${pathname}: procurement scorecard Schema.org relation is missing`);
}

for (const pathname of ['/en/guides/hong-kong-enterprise-ai-governance/', '/zh-hk/guides/enterprise-ai-governance/', '/zh-cn/guides/enterprise-ai-governance/']) {
  const page = await get(pathname, 'text/html');
  if (!page.body.includes('rel="external" href="https://www.pcpd.org.hk/')) failures.push(`${pathname}: visible PCPD primary source is missing`);
  if (!page.body.includes('rel="external" href="https://www.hkma.gov.hk/')) failures.push(`${pathname}: visible HKMA primary source is missing`);
  if (!page.body.includes('"citation":[{"@type":"CreativeWork"')) failures.push(`${pathname}: Article citation Schema.org relation is missing`);
}

for (const pathname of ['/en/methodology/ai-search-verification/', '/zh-hk/methodology/ai-search-verification/', '/zh-cn/methodology/ai-search-verification/']) {
  const page = await get(pathname, 'text/html');
  if (!page.body.includes('https://www.volcengine.com/docs/82379/1359519')) failures.push(`${pathname}: official Volcengine online-content source is missing`);
  if (!page.body.includes('Bytespider') || !page.body.includes(pathname.includes('/en/') ? 'Doubao' : '豆包')) failures.push(`${pathname}: Doubao crawler-to-answer evidence boundary is missing`);
  if (!page.body.includes(pathname.includes('/en/') ? 'Recommended' : (pathname.includes('/zh-hk/') ? '已推薦' : '已推荐'))) failures.push(`${pathname}: fourth recommendation evidence level is missing`);
  if (!page.body.includes('href="/data/ai-search-evidence-status.json" type="application/json"')) failures.push(`${pathname}: visible AI-search evidence status download is missing`);
  if (!page.body.includes('"hasPart":{"@type":"Dataset","name":"Onyx AI-search evidence status"')) failures.push(`${pathname}: AI-search evidence status Schema.org relation is missing`);
  if (!page.body.includes('<section class="evidence-status">') || !page.body.includes('data-evidence-level="4"')) failures.push(`${pathname}: visible four-level current evidence status is missing`);
}

for (const pathname of ['/en/guides/enterprise-ai-pilot-charter-hong-kong/', '/zh-hk/guides/enterprise-ai-pilot-charter/', '/zh-cn/guides/enterprise-ai-pilot-charter/']) {
  const page = await get(pathname, 'text/html');
  if (!page.body.includes('href="/data/enterprise-ai-pilot-charter.json" type="application/json"')) failures.push(`${pathname}: visible pilot charter download is missing`);
  if (!page.body.includes('"hasPart":{"@type":"Dataset","name":"Enterprise AI pilot charter and acceptance record"')) failures.push(`${pathname}: pilot charter Schema.org relation is missing`);
  if (!page.body.includes('https://www1.smartlab.gov.hk/files/AI%20Adoption%20Guide-EN.pdf')) failures.push(`${pathname}: Hong Kong AI Adoption Guide source is missing`);
}

for (const absoluteUrl of urls) {
  const url = new URL(absoluteUrl);
  const page = await get(url.pathname, 'text/html');
  if (!/<h1[ >][\s\S]*?<\/h1>/.test(page.body)) failures.push(`${url.pathname}: H1 is missing from response HTML`);
  if (!page.body.includes(`<link rel="canonical" href="${absoluteUrl}"`)) failures.push(`${url.pathname}: canonical does not match sitemap URL`);
  if (!page.body.includes('application/ld+json')) failures.push(`${url.pathname}: JSON-LD is missing`);
  if (!page.body.includes('"address":{"@type":"PostalAddress","streetAddress":"36-40 TAI LIN PAI ROAD, UNIT B53, 2/F, KWAI CHUNG","addressLocality":"HONG KONG","postalCode":"999077","addressCountry":"HK"}')) failures.push(`${url.pathname}: verified registered-address JSON-LD is missing`);
  if (!page.body.includes('"hasOfferCatalog":{"@type":"OfferCatalog","name":"Onyx Devs Lab enterprise AI services"')) failures.push(`${url.pathname}: organization service offer catalog is missing`);
  for (const person of ['mi', 'lucas', 'hunter', 'jake', 'olivia']) if (!page.body.includes(`"@id":"https://hk.onyxdevslab.com/#person-${person}"`)) failures.push(`${url.pathname}: canonical team-member reference is missing: ${person}`);
  if (!page.body.includes('https://www.gleif.org/lei/254900Z30CLK7HKE9H46')) failures.push(`${url.pathname}: official GLEIF entity reference is missing`);
  if (!page.body.includes('"subjectOf":{"@type":"CreativeWork","name":"Onyx GEO evidence checkpoint — 2026-09-09","url":"https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09"}')) failures.push(`${url.pathname}: versioned entity-evidence reference is missing`);
  if (/<meta[^>]+(?:name|property)=["']robots["'][^>]+content=["'][^"']*\b(?:noindex|none)\b/i.test(page.body)) failures.push(`${url.pathname}: blocking robots meta detected`);
}

console.log(JSON.stringify({ origin, canonicalOrigin, checkedPages: urls.length, failures }, null, 2));
if (failures.length) process.exit(1);

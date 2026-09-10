const origin = (process.argv[2] || 'https://hk.onyxdevslab.com').replace(/\/$/, '');
const canonicalOrigin = (process.argv[3] || 'https://hk.onyxdevslab.com').replace(/\/$/, '');
const failures = [];
const requestCache = new Map();
let networkRequests = 0;
let cacheHits = 0;

function normalizeHtmlForChecks(source) {
  const compactJsonLd = source.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (match, value) => {
    try {
      return `<script type="application/ld+json">${JSON.stringify(JSON.parse(value))}</script>`;
    } catch {
      return match;
    }
  });
  return compactJsonLd.replace(/\s+/g, ' ');
}

function expectedPublishedDate(pathname) {
  if (pathname.includes('/guides/what-is-ai-dingkai/') || pathname.includes('/guides/ai-dingkai/') || pathname.includes('/guides/hong-kong-ai-consulting-companies/') || pathname.includes('/guides/hong-kong-ai-service-providers/') || pathname.includes('/guides/enterprise-ai-rfp-template')) return '2026-09-10';
  if (pathname.includes('/methodology/ai-search-verification/')) return '2026-09-08';
  if (pathname.includes('/guides/choose-enterprise-ai-partner') || pathname.includes('/guides/enterprise-ai-governance') || pathname.includes('/guides/hong-kong-enterprise-ai-governance') || pathname.includes('/guides/enterprise-ai-pilot-charter')) return '2026-09-09';
  return '2026-09-07';
}

async function probe(pathname, accept = '') {
  const response = await fetch(`${origin}${pathname}`, {
    headers: { 'user-agent': 'Onyx-GEO-Release-Check/1.0', ...(accept ? { accept } : {}) },
    redirect: 'manual',
    signal: AbortSignal.timeout(15_000),
  });
  return { status: response.status, location: response.headers.get('location') || '', body: await response.text() };
}

async function probeAbsolute(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'Onyx-GEO-Release-Check/1.0' },
    redirect: 'manual',
    signal: AbortSignal.timeout(15_000),
  });
  return { status: response.status, location: response.headers.get('location') || '' };
}

async function get(pathname, expectedType, userAgent = 'Onyx-GEO-Release-Check/1.0', accept = '') {
  const requestedUrl = `${origin}${pathname}`;
  const cacheKey = `${requestedUrl}\n${userAgent}\n${accept}`;
  if (requestCache.has(cacheKey)) {
    cacheHits += 1;
    return requestCache.get(cacheKey);
  }
  let response;
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      networkRequests += 1;
      response = await fetch(requestedUrl, {
        headers: { 'user-agent': userAgent, ...(accept?{ accept }: {}) },
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
      });
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!response) {
    failures.push(`${pathname}: request failed or timed out after 2 attempts: ${lastError?.message || 'unknown error'}`);
    const result = { response: null, body: '', contentType: '' };
    requestCache.set(cacheKey, result);
    return result;
  }
  const rawBody = await response.text();
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('text/html') ? normalizeHtmlForChecks(rawBody) : rawBody;
  if (!response.ok) failures.push(`${pathname}: HTTP ${response.status}`);
  if (response.redirected || response.url !== requestedUrl) failures.push(`${pathname}: unexpected redirect to ${response.url}`);
  if (!contentType.includes(expectedType)) failures.push(`${pathname}: expected ${expectedType}, got ${contentType || 'none'}`);
  const xRobotsTag = response.headers.get('x-robots-tag') || '';
  if (/\b(?:noindex|none)\b/i.test(xRobotsTag)) failures.push(`${pathname}: blocking X-Robots-Tag: ${xRobotsTag}`);
  if (/cf-chl-|challenge-platform|<title>\s*Just a moment/i.test(body)) failures.push(`${pathname}: Cloudflare challenge page detected`);
  const result = { response, body, contentType };
  requestCache.set(cacheKey, result);
  return result;
}

const root = await get('/', 'text/html');
const rootLinkHeader = root.response?.headers.get('link') || '';
if (!/(?:^|,)\s*Accept\s*(?:,|$)/i.test(root.response?.headers.get('vary') || '')) failures.push('/: Vary header does not include Accept');
if (!/search=yes/.test(root.response?.headers.get('content-signal') || '') || !/ai-input=yes/.test(root.response?.headers.get('content-signal') || '')) failures.push('/: Content-Signal response header is incomplete');
for (const resource of ['sitemap.xml', 'feed.xml', 'feed.json', 'data/enterprise-ai-service-terms.jsonld', 'llms.txt']) {
  if (!rootLinkHeader.includes(`https://hk.onyxdevslab.com/${resource}`)) failures.push(`/: Link discovery header is missing ${resource}`);
}
for (const required of ['ONYX DEVS LAB LIMITED', 'business registration number 79051925', 'href="/zh-cn/"', 'href="/en/guides/choose-enterprise-ai-partner-hong-kong/"', 'href="/en/methodology/ai-search-verification/"']) {
  if (!root.body.includes(required)) failures.push(`/: static crawler fallback is missing ${required}`);
}
if (!root.body.includes('<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"')) failures.push('/: unrestricted search and AI preview directive is missing');
if (!root.body.includes('"iso6523Code":"0199:254900Z30CLK7HKE9H46"')) failures.push('/: ISO 6523 LEI organization property is missing');
if (!root.body.includes('"contentUrl":"https://hk.onyxdevslab.com/onyx-devs-lab-logo.svg","width":512,"height":512')) failures.push('/: organization logo dimensions or content URL are incomplete');

for (const [pathname, accept] of [['/this-page-must-not-exist-onyx-geo-20260910', ''], ['/zh-cn/not-found-onyx-geo-20260910', ''], ['/en/not-found-onyx-geo-20260910/', 'text/markdown']]) {
  const response = await probe(pathname, accept);
  if (response.status !== 404) failures.push(`${pathname}: unknown URL returned ${response.status} instead of 404`);
  if (response.body.includes('From business problem to working AI system.')) failures.push(`${pathname}: unknown URL returned homepage content`);
}
const slashRedirect = await probe('/en/ai-consulting-hong-kong');
if (slashRedirect.status !== 301 || slashRedirect.location !== '/en/ai-consulting-hong-kong/') failures.push(`/en/ai-consulting-hong-kong: expected one relative 301 to the canonical slash URL, got ${slashRedirect.status} ${slashRedirect.location}`);
const indexRedirect = await probe('/index.html');
if (indexRedirect.status !== 301 || indexRedirect.location !== '/') failures.push(`/index.html: expected one relative 301 to the canonical homepage, got ${indexRedirect.status} ${indexRedirect.location}`);
if (canonicalOrigin.startsWith('https://')) {
  const insecureOrigin = canonicalOrigin.replace(/^https:/, 'http:');
  for (const pathname of ['/', '/zh-cn/ai-consulting/?geo_protocol_check=1']) {
    const insecureRedirect = await probeAbsolute(`${insecureOrigin}${pathname}`);
    const expectedLocation = `${canonicalOrigin}${pathname}`;
    if (insecureRedirect.status !== 301 || insecureRedirect.location !== expectedLocation) failures.push(`${insecureOrigin}${pathname}: expected 301 to ${expectedLocation}, got ${insecureRedirect.status} ${insecureRedirect.location}`);
  }
}
const markdownRoot = await get('/', 'text/markdown', 'Onyx-GEO-Markdown-Check/1.0', 'text/markdown');
for (const required of ['title:', 'canonical: "https://hk.onyxdevslab.com/"', '# From business problem to working AI system.', 'ONYX DEVS LAB LIMITED', '## Structured data', '"@type": "Organization"']) {
  if (!markdownRoot.body.includes(required)) failures.push(`/: Markdown variant is missing ${required}`);
}
if (!/(?:^|,)\s*Accept\s*(?:,|$)/i.test(markdownRoot.response?.headers.get('vary') || '')) failures.push('/: Markdown response Vary header does not include Accept');
if (!/search=yes/.test(markdownRoot.response?.headers.get('content-signal') || '') || !/ai-input=yes/.test(markdownRoot.response?.headers.get('content-signal') || '')) failures.push('/: Markdown Content-Signal response header is incomplete');

const robots = await get('/robots.txt', 'text/plain');
if (!robots.body.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) failures.push('/robots.txt: sitemap declaration is missing or points to the wrong canonical origin');
if (!/^Content-Signal:\s*search=yes,\s*ai-input=yes\s*$/im.test(robots.body)) failures.push('/robots.txt: search and AI-input content signals are missing');
if (/^Content-Signal:.*ai-train=/im.test(robots.body)) failures.push('/robots.txt: AI-training preference must remain unspecified unless explicitly approved');
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
if (!feed.body.includes('<link href="https://hk.onyxdevslab.com/feed.xml" rel="self"/>') || !feed.body.includes('<link href="https://pubsubhubbub.appspot.com/" rel="hub"/>')) failures.push('/feed.xml: WebSub self or hub discovery is missing');
const atomLinkHeader = feed.response?.headers.get('link') || '';
if (!atomLinkHeader.includes('<https://hk.onyxdevslab.com/feed.xml>; rel="self"') || !atomLinkHeader.includes('<https://pubsubhubbub.appspot.com/>; rel="hub"')) failures.push('/feed.xml: HTTP WebSub self or hub discovery is missing');
const jsonFeedResponse = await get('/feed.json', 'application/feed+json');
const jsonFeedLinkHeader = jsonFeedResponse.response?.headers.get('link') || '';
if (!jsonFeedLinkHeader.includes('<https://hk.onyxdevslab.com/feed.json>; rel="self"') || !jsonFeedLinkHeader.includes('<https://pubsubhubbub.appspot.com/>; rel="hub"')) failures.push('/feed.json: HTTP WebSub self or hub discovery is missing');
let jsonFeed = null;
try {
  jsonFeed = JSON.parse(jsonFeedResponse.body);
  if (jsonFeed.version !== 'https://jsonfeed.org/version/1.1') failures.push('/feed.json: unexpected JSON Feed version');
  if (jsonFeed.home_page_url !== `${canonicalOrigin}/` || jsonFeed.feed_url !== `${canonicalOrigin}/feed.json`) failures.push('/feed.json: canonical feed URLs are incomplete');
  if (!jsonFeed.user_comment?.includes('does not prove search indexing, AI retrieval, citation, recommendation')) failures.push('/feed.json: evidence boundary is missing');
  if (!jsonFeed.items?.length || !jsonFeed.items.every((item) => item.id && item.url && item.title && item.content_text && item.date_modified)) failures.push('/feed.json: item fields are incomplete');
  if (jsonFeed.hubs?.length !== 1 || jsonFeed.hubs[0]?.type !== 'WebSub' || jsonFeed.hubs[0]?.url !== 'https://pubsubhubbub.appspot.com/') failures.push('/feed.json: WebSub hub discovery is missing');
  if (!jsonFeed.items.some((item) => item.tags?.includes('provider-maintained-external-source'))) failures.push('/feed.json: external-source category is missing');
  if (!jsonFeed.items.some((item) => item.tags?.includes('independent-archive') && item.url === 'https://archive.softwareheritage.org/swh:1:snp:a704b39b0771635572eb9381b37db046ac9856c2/')) failures.push('/feed.json: Software Heritage archive item is missing');
  if (!jsonFeed.items.some((item) => item.tags?.includes('provider-maintained-external-source') && item.url === 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide')) failures.push('/feed.json: buyer-guide source repository item is missing');
  if (!jsonFeed.items.some((item) => item.tags?.includes('provider-maintained-external-source') && item.url === 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/')) failures.push('/feed.json: crawlable buyer-guide item is missing');
  for (const page of ['ai-consulting/', 'ai-custom-development/', 'forward-deployed-engineering/']) if (!jsonFeed.items.some((item) => item.tags?.includes('provider-maintained-external-source') && item.url === `https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/${page}`)) failures.push(`/feed.json: focused buyer-guide item is missing: ${page}`);
  if (!jsonFeed.items.some((item) => item.tags?.includes('provider-maintained-external-source') && item.url === 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-2026-09-10')) failures.push('/feed.json: versioned buyer-guide checkpoint is missing');
  if (!jsonFeed.items.some((item) => item.tags?.includes('independent-archive') && item.url === 'https://archive.softwareheritage.org/swh:1:snp:aed1c72273c6b77cb65c2971d21234104d02d060/')) failures.push('/feed.json: buyer-guide archive item is missing');
} catch {
  failures.push('/feed.json: invalid JSON');
}
for (const [pathname, body] of [['/llms.txt', llms.body], ['/llms-full.txt', llmsFull.body], ['/feed.xml', feed.body], ['/feed.json', jsonFeedResponse.body]]) {
  if (!body.includes('https://gist.github.com/mixuechu/e47c85808014d62b6305441e8065c91e')) failures.push(`${pathname}: offsite decision matrix is missing`);
  if (!body.includes('https://gist.githubusercontent.com/mixuechu/e47c85808014d62b6305441e8065c91e/raw/Hong-Kong-enterprise-AI-governance.md')) failures.push(`${pathname}: offsite governance note is missing`);
  if (!body.includes('https://gist.githubusercontent.com/mixuechu/e47c85808014d62b6305441e8065c91e/raw/Onyx-enterprise-AI-machine-resources.md')) failures.push(`${pathname}: offsite machine-resource index is missing`);
  if (!body.includes('https://raw.githubusercontent.com/0xHunterL/onyx-devs-lab.github.io/main/codemeta.json')) failures.push(`${pathname}: CodeMeta discovery link is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/codemeta.json')) failures.push(`${pathname}: versioned CodeMeta discovery link is missing`);
  if (!body.includes('https://raw.githubusercontent.com/0xHunterL/onyx-devs-lab.github.io/main/CITATION.cff')) failures.push(`${pathname}: citation metadata discovery link is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/CITATION.cff')) failures.push(`${pathname}: versioned citation metadata discovery link is missing`);
  for (const fieldNote of ['FDE-is-not-staff-augmentation.zh-CN.md', 'AI-agent-ERP-integration-checklist.zh-CN.md', 'Legal-AI-evidence-chain.zh-CN.md']) {
    if (!body.includes(fieldNote)) failures.push(`${pathname}: offsite field note is missing: ${fieldNote}`);
  }
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09')) failures.push(`${pathname}: versioned evidence checkpoint is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-readiness-2026-09-10')) failures.push(`${pathname}: versioned agent-readiness checkpoint is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-ai-rfp-template-2026-09-10')) failures.push(`${pathname}: versioned AI RFP checkpoint is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/chinese-enterprise-ai-field-notes-2026-09-10')) failures.push(`${pathname}: Chinese field-note release is missing`);
  if (!body.includes('https://archive.softwareheritage.org/swh:1:snp:a704b39b0771635572eb9381b37db046ac9856c2/')) failures.push(`${pathname}: Software Heritage snapshot is missing`);
  if (!body.includes('https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide')) failures.push(`${pathname}: enterprise AI buyer-guide repository is missing`);
  if (!body.includes('https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/')) failures.push(`${pathname}: crawlable enterprise AI buyer guide is missing`);
  for (const page of ['ai-consulting/', 'ai-custom-development/', 'forward-deployed-engineering/']) if (!body.includes(`https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/${page}`)) failures.push(`${pathname}: focused buyer-guide page is missing: ${page}`);
  for (const asset of ['CITATION.cff', 'codemeta.json']) if (!body.includes(`https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/${asset}`)) failures.push(`${pathname}: buyer-guide metadata is missing: ${asset}`);
  if (!body.includes('https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-2026-09-10')) failures.push(`${pathname}: versioned buyer-guide checkpoint is missing`);
  if (!body.includes('https://archive.softwareheritage.org/swh:1:snp:aed1c72273c6b77cb65c2971d21234104d02d060/')) failures.push(`${pathname}: buyer-guide archive is missing`);
  if (!body.includes('https://web.archive.org/web/20260909212732/https://hk.onyxdevslab.com/zh-cn/guides/ai-dingkai/')) failures.push(`${pathname}: Internet Archive AI dingkai snapshot is missing`);
  for (const [timestamp, slug] of [['20260909233718','about'],['20260909205631','ai-consulting'],['20260909205642','custom-ai-development'],['20260909214448','forward-deployed-engineering']]) if (!body.includes(`https://web.archive.org/web/${timestamp}/https://hk.onyxdevslab.com/zh-cn/${slug}/`)) failures.push(`${pathname}: Internet Archive core snapshot is missing: ${slug}`);
}
for (const [pathname, body] of [['/llms.txt', llms.body], ['/llms-full.txt', llmsFull.body]]) {
  if (!body.includes('proof of search indexing, AI citation') && !body.includes('proves search indexing, AI citation')) failures.push(`${pathname}: search-evidence boundary is missing`);
  if (!body.includes('https://hk.onyxdevslab.com/data/enterprise-ai-partner-scorecard.json')) failures.push(`${pathname}: procurement scorecard discovery link is missing`);
  if (!body.includes('https://hk.onyxdevslab.com/data/enterprise-ai-pilot-charter.json')) failures.push(`${pathname}: pilot charter discovery link is missing`);
  if (!body.includes('https://hk.onyxdevslab.com/data/enterprise-ai-engagement-model-map.json')) failures.push(`${pathname}: engagement-model decision map discovery link is missing`);
  if (!body.includes('https://hk.onyxdevslab.com/data/ai-search-evidence-status.json')) failures.push(`${pathname}: AI-search evidence status discovery link is missing`);
  if (!body.includes('https://hk.onyxdevslab.com/data/organization.json')) failures.push(`${pathname}: canonical organization record discovery link is missing`);
  if (!body.includes('https://hk.onyxdevslab.com/data/chinese-enterprise-ai-field-notes.json')) failures.push(`${pathname}: Chinese field-note index is missing`);
  if (!body.includes('https://hk.onyxdevslab.com/data/hong-kong-enterprise-ai-provider-shortlist.json')) failures.push(`${pathname}: Hong Kong enterprise AI provider shortlist is missing`);
  if (!body.includes('https://hk.onyxdevslab.com/data/enterprise-ai-rfp-requirements.json')) failures.push(`${pathname}: enterprise AI RFP requirements template is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/chinese-enterprise-ai-field-notes-2026-09-10/chinese-enterprise-ai-field-notes.json')) failures.push(`${pathname}: versioned Chinese field-note index is missing`);
}
if (!feed.body.includes('provider-maintained-external-source')) failures.push('/feed.xml: external-source category is missing');
if (!feed.body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/chinese-enterprise-ai-field-notes-2026-09-10')) failures.push('/feed.xml: Chinese field-note release entry is missing');
if (!root.body.includes('type="application/feed+json"') || !root.body.includes('href="https://hk.onyxdevslab.com/feed.json"')) failures.push('/: JSON Feed discovery link is missing');
if (!root.body.includes('rel="describedby" type="application/ld+json"') || !root.body.includes('href="https://hk.onyxdevslab.com/data/enterprise-ai-service-terms.jsonld"')) failures.push('/: service term graph discovery link is missing');

const serviceTermsResponse = await get('/data/enterprise-ai-service-terms.jsonld', 'application/ld+json');
try {
  const termGraph = JSON.parse(serviceTermsResponse.body);
  const nodes = termGraph['@graph'];
  const termSet = nodes?.find((node) => node['@type'] === 'DefinedTermSet');
  const terms = nodes?.filter((node) => node['@type'] === 'DefinedTerm') || [];
  const services = nodes?.filter((node) => node['@type'] === 'Service') || [];
  if (termGraph['@context'] !== 'https://schema.org' || termSet?.hasDefinedTerm?.length !== 3) failures.push('/data/enterprise-ai-service-terms.jsonld: term set is incomplete');
  if (termSet?.sameAs !== 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-ai-rfp-template-2026-09-10/enterprise-ai-service-terms.jsonld') failures.push('/data/enterprise-ai-service-terms.jsonld: versioned copy is missing');
  if (terms.map((term) => term.termCode).join(',') !== 'ai-advisory,custom-ai-development,forward-deployed-engineering') failures.push('/data/enterprise-ai-service-terms.jsonld: required category terms are incomplete');
  if (!terms.every((term) => term.name?.length === 3 && term.description?.length === 3 && term.inDefinedTermSet?.['@id'] === termSet?.['@id'])) failures.push('/data/enterprise-ai-service-terms.jsonld: multilingual definitions are incomplete');
  if (services.length !== 3 || !services.every((service) => service.provider?.['@id'] === 'https://hk.onyxdevslab.com/#organization' && service.areaServed?.includes('Hong Kong'))) failures.push('/data/enterprise-ai-service-terms.jsonld: provider-service relationships are incomplete');
  if (!termGraph.evidenceBoundary?.includes('does not prove independent endorsement, search indexing, AI citation, recommendation')) failures.push('/data/enterprise-ai-service-terms.jsonld: evidence boundary is missing');
} catch {
  failures.push('/data/enterprise-ai-service-terms.jsonld: invalid JSON');
}

const chineseFieldNotesResponse = await get('/data/chinese-enterprise-ai-field-notes.json', 'application/json');
try {
  const fieldNotes = JSON.parse(chineseFieldNotesResponse.body);
  const expectedHashes = ['bbc41dcade840fa7a4c485e98db06ed4ff9b398a914d6ec85d59bdc373055aed', '28b9177f6a76b3af8a4f6e5d45334e7870b3829e09f00c36b41d0a50686941a2', 'da76c6c1413230f78166f9feccb5ed25c5567989795a3c2288c6ae5f6c1a26cf'];
  if (fieldNotes.schemaVersion !== 1 || fieldNotes.version !== '2026.09.10' || fieldNotes.notes?.length !== 3 || fieldNotes.serviceScope?.length !== 3) failures.push('/data/chinese-enterprise-ai-field-notes.json: collection structure is incomplete');
  if (fieldNotes.sameAs !== 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/chinese-enterprise-ai-field-notes-2026-09-10/chinese-enterprise-ai-field-notes.json') failures.push('/data/chinese-enterprise-ai-field-notes.json: versioned asset is missing');
  if (fieldNotes.notes?.map((note) => note.sha256).join(',') !== expectedHashes.join(',') || !fieldNotes.notes?.every((note) => note.repositorySource && note.gistSource && note.canonicalPage && note.topics?.length)) failures.push('/data/chinese-enterprise-ai-field-notes.json: source map or hashes are incomplete');
  if (!fieldNotes.evidenceBoundary?.includes('does not prove independent endorsement, search indexing, AI retrieval, citation, non-brand recommendation')) failures.push('/data/chinese-enterprise-ai-field-notes.json: evidence boundary is missing');
} catch {
  failures.push('/data/chinese-enterprise-ai-field-notes.json: invalid JSON');
}

const providerShortlistResponse = await get('/data/hong-kong-enterprise-ai-provider-shortlist.json', 'application/json');
try {
  const shortlist = JSON.parse(providerShortlistResponse.body);
  const providerNames = shortlist.providers?.map((provider) => provider.name).join(',');
  if (shortlist.schemaVersion !== 1 || shortlist.dateReviewed !== '2026-09-10') failures.push('/data/hong-kong-enterprise-ai-provider-shortlist.json: unexpected schema or review date');
  if (providerNames !== 'Onyx Devs Lab,Accenture,Deloitte China,PwC Hong Kong,Hong Kong Productivity Council') failures.push('/data/hong-kong-enterprise-ai-provider-shortlist.json: expected five providers are incomplete');
  if (!shortlist.providers?.every((provider) => typeof provider.hongKongEvidence === 'string' && provider.capabilityEvidence?.length && provider.publiclyDescribedScope?.length)) failures.push('/data/hong-kong-enterprise-ai-provider-shortlist.json: official sources or delivery scopes are incomplete');
  if (!shortlist.limitations?.some((item) => item.includes('non-exhaustive')) || !shortlist.limitations?.some((item) => item.includes('not an endorsement'))) failures.push('/data/hong-kong-enterprise-ai-provider-shortlist.json: evidence boundary is incomplete');
} catch {
  failures.push('/data/hong-kong-enterprise-ai-provider-shortlist.json: invalid JSON');
}

const aiRfpResponse = await get('/data/enterprise-ai-rfp-requirements.json', 'application/json');
try {
  const rfp = JSON.parse(aiRfpResponse.body);
  if (rfp.schemaVersion !== 1 || rfp.version !== '2026.09.10' || rfp.sections?.length !== 9) failures.push('/data/enterprise-ai-rfp-requirements.json: schema, version, or sections are incomplete');
  if (!rfp.sections?.every((section) => section.id && section.name?.en && section.name?.zhHant && section.name?.zhHans && section.fields?.length)) failures.push('/data/enterprise-ai-rfp-requirements.json: multilingual sections or fields are incomplete');
  if (!rfp.mandatoryGateRule?.includes('cannot be offset') || rfp.statuses?.length !== 4 || rfp.sources?.length !== 3 || rfp.limitations?.length !== 3) failures.push('/data/enterprise-ai-rfp-requirements.json: evidence boundary is incomplete');
} catch {
  failures.push('/data/enterprise-ai-rfp-requirements.json: invalid JSON');
}

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
  if (organization.iso6523Code !== '0199:254900Z30CLK7HKE9H46') failures.push('/data/organization.json: preferred ISO 6523 LEI is missing');
  if (organization.logo?.contentUrl !== 'https://hk.onyxdevslab.com/onyx-devs-lab-logo.svg' || organization.logo?.width !== 512 || organization.logo?.height !== 512) failures.push('/data/organization.json: indexable logo metadata is incomplete');
  if (!organization.identifier?.some((item) => item.propertyID === 'Hong Kong Business Registration Number' && item.value === '79051925')) failures.push('/data/organization.json: business registration number is missing');
  if (!organization.subjectOf?.some((item) => item.url.includes('gleif.org/lei/254900Z30CLK7HKE9H46'))) failures.push('/data/organization.json: official GLEIF source is missing');
  if (!organization.subjectOf?.some((item) => item.identifier === 'swh:1:snp:a704b39b0771635572eb9381b37db046ac9856c2' && item.version === '5a1ae2018db115474ecba00facea8366bfef9bd8')) failures.push('/data/organization.json: Software Heritage snapshot relation is missing');
  if (!organization.subjectOf?.some((item) => item.url === 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/' && item.isBasedOn === 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide')) failures.push('/data/organization.json: buyer-guide relation is missing');
  if (!organization.subjectOf?.some((item) => item.url === 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/' && item.sameAs === 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-2026-09-10' && item.hasPart?.length === 3 && item.hasPart.every((part) => part.url?.startsWith('https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/')))) failures.push('/data/organization.json: focused buyer-guide relations are missing');
  if (!organization.subjectOf?.some((item) => item.identifier === 'swh:1:snp:aed1c72273c6b77cb65c2971d21234104d02d060' && item.version === '4db4717152cef6c497f75a7e6c5db9df1a80addd')) failures.push('/data/organization.json: buyer-guide archive relation is missing');
  if (!organization.subjectOf?.some((item) => item.url === 'https://web.archive.org/web/20260909233718/https://hk.onyxdevslab.com/zh-cn/about/' && item.hasPart?.length === 4)) failures.push('/data/organization.json: Internet Archive entity and core-service snapshot cluster is missing');
  if (!organization.additionalProperty?.some((item) => item.propertyID === 'Evidence boundary' && item.value.includes('do not endorse services'))) failures.push('/data/organization.json: evidence boundary is missing');
  if (organization.hasOfferCatalog?.itemListElement?.length !== 3 || !organization.hasOfferCatalog.itemListElement.every((offer) => offer.itemOffered?.['@type'] === 'Service' && offer.itemOffered?.url?.length === 3)) failures.push('/data/organization.json: trilingual service offer catalog is incomplete');
  if (organization.member?.length !== 5 || !organization.member.every((person) => person['@type'] === 'Person' && person['@id']?.startsWith('https://hk.onyxdevslab.com/#person-') && person.name && person.jobTitle && person.worksFor?.['@id'] === 'https://hk.onyxdevslab.com/#organization')) failures.push('/data/organization.json: canonical team members are incomplete');
} catch {
  failures.push('/data/organization.json: invalid JSON');
}
const logoResponse = await get('/onyx-devs-lab-logo.svg', 'image/svg+xml');
if (!logoResponse.body.includes('width="512" height="512" viewBox="0 0 100 100"') || !logoResponse.body.includes('<title id="title">Onyx Devs Lab logo</title>')) failures.push('/onyx-devs-lab-logo.svg: explicit dimensions or accessible brand title are missing');

const servicePageGroups = [
  { code: 'ai-advisory', names: ['AI advisory', 'AI 顧問', 'AI 咨询'], paths: ['/en/ai-consulting-hong-kong/', '/zh-hk/ai-consulting/', '/zh-cn/ai-consulting/'] },
  { code: 'custom-ai-development', names: ['Custom AI development', 'AI 定制開發', 'AI 定制开发'], paths: ['/en/custom-ai-development-hong-kong/', '/zh-hk/custom-ai-development/', '/zh-cn/custom-ai-development/'] },
  { code: 'forward-deployed-engineering', names: ['Forward Deployed Engineering (FDE)', '前線部署工程（FDE）', '前线部署工程（FDE）'], paths: ['/en/forward-deployed-engineering/', '/zh-hk/forward-deployed-engineering/', '/zh-cn/forward-deployed-engineering/'] },
];
for (const group of servicePageGroups) {
  for (const pathname of group.paths) {
    const page = await get(pathname, 'text/html');
    if (!page.body.includes(`"serviceType":${JSON.stringify(group.names)}`)) failures.push(`${pathname}: canonical multilingual service type is missing`);
    if (!page.body.includes(`"category":{"@id":"https://hk.onyxdevslab.com/data/enterprise-ai-service-terms.jsonld#${group.code}"}`)) failures.push(`${pathname}: service category term relation is missing`);
  }
}

for (const pathname of ['/en/about/', '/zh-hk/about/', '/zh-cn/about/']) {
  const page = await get(pathname, 'text/html');
  if (!page.body.includes('"@type":["AboutPage","ProfilePage"]') || !page.body.includes('"mainEntity":{"@id":"https://hk.onyxdevslab.com/#organization"}') || !page.body.includes('"dateModified":"2026-09-10"')) failures.push(`${pathname}: organization ProfilePage markup is incomplete`);
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
  if (status.schemaVersion !== 2 || status.version !== '2026.09.10.4' || !status.observedAt) failures.push('/data/ai-search-evidence-status.json: unexpected schema, version, or observation time');
  if (status.sameAs !== 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-ai-rfp-template-2026-09-10/ai-search-evidence-status.json') failures.push('/data/ai-search-evidence-status.json: versioned release asset is missing');
  if (status.testProtocol?.promptCount !== 20 || status.testProtocol?.queryAliasesAdded?.join(',') !== 'AI 定开,AI定开') failures.push('/data/ai-search-evidence-status.json: query-alias coverage is incomplete');
  if (status.evidenceLevels?.map((item) => item.id).join(',') !== 'accessible,crawled,retrieved-and-cited,non-brand-recommendation') failures.push('/data/ai-search-evidence-status.json: four evidence levels are incomplete');
  if (status.evidenceLevels?.[0]?.status !== 'verified' || status.evidenceLevels?.[0]?.evidence?.canonicalUrlsChecked !== 71) failures.push('/data/ai-search-evidence-status.json: accessibility evidence is incomplete');
  if (status.evidenceLevels?.[0]?.evidence?.markdownRepresentationsGenerated !== 71 || status.evidenceLevels?.[0]?.evidence?.markdownNegotiatedAtCanonicalUrl !== true || status.evidenceLevels?.[0]?.evidence?.contentSignals?.aiTrain !== 'unspecified') failures.push('/data/ai-search-evidence-status.json: agent-readable representation evidence is incomplete');
  if (status.evidenceLevels?.[1]?.evidence?.verifiedGptBotContentCrawls !== 3 || status.evidenceLevels?.[1]?.evidence?.historicallyVerifiedBingbotContentCrawls !== 7) failures.push('/data/ai-search-evidence-status.json: crawler evidence is incomplete');
  if (status.evidenceLevels?.[2]?.status !== 'not-verified' || status.evidenceLevels?.[3]?.status !== 'not-tested' || status.testProtocol?.doubaoPromptsSent !== false) failures.push('/data/ai-search-evidence-status.json: negative evidence boundary is incomplete');
  if (status.technicalReadiness?.score !== 86 || status.technicalReadiness?.passedChecks !== 6 || status.technicalReadiness?.notPassed?.[0]?.check !== 'DNS-AID') failures.push('/data/ai-search-evidence-status.json: technical-readiness evidence is incomplete');
  if (!status.publicSearchChecks?.every((item) => item.checkedAt && item.result.includes('observed'))) failures.push('/data/ai-search-evidence-status.json: dated public-search checks are incomplete');
  if (!status.evidenceSources?.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-readiness-2026-09-10')) failures.push('/data/ai-search-evidence-status.json: versioned readiness checkpoint is missing');
  if (!status.evidenceSources?.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-ai-rfp-template-2026-09-10')) failures.push('/data/ai-search-evidence-status.json: versioned AI RFP checkpoint is missing');
} catch {
  failures.push('/data/ai-search-evidence-status.json: invalid JSON');
}

const indexNowKey = await get('/9c37a18bd2044e1687f45c2e91ad603b.txt', 'text/plain');
if (indexNowKey.body.trim() !== '9c37a18bd2044e1687f45c2e91ad603b') failures.push('/9c37a18bd2044e1687f45c2e91ad603b.txt: IndexNow key does not match');

const sitemap = await get('/sitemap.xml', 'xml');
const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const currentLastmods = [...sitemap.body.matchAll(/<lastmod>2026-09-10<\/lastmod>/g)];
if (currentLastmods.length !== urls.length) failures.push(`/sitemap.xml: expected ${urls.length} current page lastmods, got ${currentLastmods.length}`);
for (const pathname of ['/en/methodology/ai-search-verification/', '/zh-hk/methodology/ai-search-verification/', '/zh-cn/methodology/ai-search-verification/']) {
  if (!sitemap.body.includes(`<loc>https://hk.onyxdevslab.com${pathname}</loc><lastmod>2026-09-10</lastmod>`)) failures.push(`${pathname}: sitemap lastmod does not reflect the substantive evidence update`);
}
if (!feed.body.includes('<updated>2026-09-10T00:00:00+08:00</updated>')) failures.push('/feed.xml: feed update date is stale');
if (urls.length < 56) failures.push(`/sitemap.xml: expected at least 56 URLs, got ${urls.length}`);
if (new Set(urls).size !== urls.length) failures.push('/sitemap.xml: duplicate canonical URLs detected');
for (const url of urls) {
  if (!url.startsWith(`${canonicalOrigin}/`)) failures.push(`/sitemap.xml: non-canonical origin: ${url}`);
}

const requiredPaths = [
  '/en/guides/enterprise-ai-rfp-template-hong-kong/',
  '/zh-hk/guides/enterprise-ai-rfp-template/',
  '/zh-cn/guides/enterprise-ai-rfp-template/',
  '/en/guides/hong-kong-ai-consulting-companies/',
  '/zh-hk/guides/hong-kong-ai-service-providers/',
  '/zh-cn/guides/hong-kong-ai-consulting-companies/',
  '/en/guides/what-is-ai-dingkai/',
  '/zh-hk/guides/what-is-ai-dingkai/',
  '/zh-cn/guides/ai-dingkai/',
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
const bytespiderPaths = requiredPaths.filter((path) => path.startsWith('/zh-cn/'));
for (let index = 0; index < bytespiderPaths.length; index += 8) {
  await Promise.all(bytespiderPaths.slice(index, index + 8).map(async (pathname) => {
    const page = await get(pathname, 'text/html', bytespiderAgent);
    if (!page.body.includes('<html lang="zh-CN">')) failures.push(`${pathname}: Bytespider response is not the simplified Chinese HTML page`);
    if (!page.body.includes('application/ld+json')) failures.push(`${pathname}: Bytespider response is missing JSON-LD`);
  }));
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

for (const pathname of ['/en/guides/hong-kong-ai-consulting-companies/', '/zh-hk/guides/hong-kong-ai-service-providers/', '/zh-cn/guides/hong-kong-ai-consulting-companies/']) {
  const page = await get(pathname, 'text/html');
  const hkpcName = pathname.startsWith('/en/') ? 'Hong Kong Productivity Council' : (pathname.startsWith('/zh-hk/') ? '香港生產力促進局' : '香港生产力促进局');
  for (const required of ['Onyx Devs Lab', 'Accenture', 'Deloitte China', 'PwC Hong Kong', hkpcName, 'hong-kong-enterprise-ai-provider-shortlist.json']) if (!page.body.includes(required)) failures.push(`${pathname}: provider shortlist content is missing ${required}`);
  for (const officialSource of ['accenture.com', 'deloitte.com', 'pwchk.com', 'hkpc.org']) if (!page.body.includes(officialSource)) failures.push(`${pathname}: official provider source is missing ${officialSource}`);
  if (!page.body.includes('"citation":[{"@type":"CreativeWork"')) failures.push(`${pathname}: Article citation Schema.org relation is missing`);
}

for (const pathname of ['/en/guides/enterprise-ai-rfp-template-hong-kong/', '/zh-hk/guides/enterprise-ai-rfp-template/', '/zh-cn/guides/enterprise-ai-rfp-template/']) {
  const page = await get(pathname, 'text/html');
  for (const required of ['enterprise-ai-rfp-requirements.json', 'NIST', 'www.pcpd.org.hk', 'www1.smartlab.gov.hk', '"citation":']) if (!page.body.includes(required)) failures.push(`${pathname}: AI RFP content or primary source is missing ${required}`);
}

for (const pathname of ['/en/guides/hong-kong-enterprise-ai-governance/', '/zh-hk/guides/enterprise-ai-governance/', '/zh-cn/guides/enterprise-ai-governance/']) {
  const page = await get(pathname, 'text/html');
  if (!page.body.includes('rel="external" href="https://www.pcpd.org.hk/')) failures.push(`${pathname}: visible PCPD primary source is missing`);
  if (!page.body.includes('rel="external" href="https://www.hkma.gov.hk/')) failures.push(`${pathname}: visible HKMA primary source is missing`);
  if (!page.body.includes('"citation":[{"@type":"CreativeWork"')) failures.push(`${pathname}: Article citation Schema.org relation is missing`);
}

for (const pathname of ['/en/methodology/ai-search-verification/', '/zh-hk/methodology/ai-search-verification/', '/zh-cn/methodology/ai-search-verification/']) {
  const page = await get(pathname, 'text/html');
  if ((page.body.match(/"dateModified":"2026-09-10"/g) || []).length < 2) failures.push(`${pathname}: Article and WebPage dateModified are stale`);
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

for (let index = 0; index < urls.length; index += 8) {
  await Promise.all(urls.slice(index, index + 8).map(async (absoluteUrl) => {
    const url = new URL(absoluteUrl);
    const page = await get(url.pathname, 'text/html');
    if (!/<h1[ >][\s\S]*?<\/h1>/.test(page.body)) failures.push(`${url.pathname}: H1 is missing from response HTML`);
    if (!page.body.includes(`<link rel="canonical" href="${absoluteUrl}"`)) failures.push(`${url.pathname}: canonical does not match sitemap URL`);
    if (!page.body.includes('application/ld+json')) failures.push(`${url.pathname}: JSON-LD is missing`);
    if (url.pathname.includes('/case-studies/') && !page.body.includes('"@type":"Article"')) failures.push(`${url.pathname}: case study is not declared as Article`);
    if (page.body.includes('"@type":"Article"')) {
      const published = expectedPublishedDate(url.pathname);
      const authorPath = url.pathname.startsWith('/zh-cn/') ? '/zh-cn/about/' : (url.pathname.startsWith('/zh-hk/') ? '/zh-hk/about/' : '/en/about/');
      for (const required of [`"datePublished":"${published}"`, '"dateModified":"2026-09-10"', `"mainEntityOfPage":{"@id":"${absoluteUrl}"}`, '"articleSection":', `<a rel="author" href="${authorPath}">Onyx Devs Lab</a>`, `<time datetime="${published}">${published}</time>`, '<time datetime="2026-09-10">2026-09-10</time>']) {
        if (!page.body.includes(required)) failures.push(`${url.pathname}: Article publication metadata is missing ${required}`);
      }
    }
    if (url.pathname.includes('/methodology/case-study-evidence-register/') && (!page.body.includes('<time datetime="2026-09-09">2026-09-09</time>') || !page.body.includes('<time datetime="2026-09-10">2026-09-10</time>'))) failures.push(`${url.pathname}: Dataset publication dates are not visible`);
    if (url.pathname !== '/' && (!page.body.includes('"@type":"WebPage"') || !page.body.includes('"dateModified":"2026-09-10"'))) failures.push(`${url.pathname}: WebPage freshness is stale`);
    if (!page.body.includes('type="application/feed+json"') || !page.body.includes('href="https://hk.onyxdevslab.com/feed.json"')) failures.push(`${url.pathname}: JSON Feed discovery link is missing`);
    if (!page.body.includes('rel="describedby" type="application/ld+json"') || !page.body.includes('href="https://hk.onyxdevslab.com/data/enterprise-ai-service-terms.jsonld"')) failures.push(`${url.pathname}: service term graph discovery link is missing`);
    if (!page.body.includes('"address":{"@type":"PostalAddress","streetAddress":"36-40 TAI LIN PAI ROAD, UNIT B53, 2/F, KWAI CHUNG","addressLocality":"HONG KONG","postalCode":"999077","addressCountry":"HK"}')) failures.push(`${url.pathname}: verified registered-address JSON-LD is missing`);
    if (!page.body.includes('"hasOfferCatalog":{"@type":"OfferCatalog","name":"Onyx Devs Lab enterprise AI services"')) failures.push(`${url.pathname}: organization service offer catalog is missing`);
    for (const person of ['mi', 'lucas', 'hunter', 'jake', 'olivia']) if (!page.body.includes(`"@id":"https://hk.onyxdevslab.com/#person-${person}"`)) failures.push(`${url.pathname}: canonical team-member reference is missing: ${person}`);
    if (!page.body.includes('https://www.gleif.org/lei/254900Z30CLK7HKE9H46')) failures.push(`${url.pathname}: official GLEIF entity reference is missing`);
    if (!page.body.includes('"name":"Onyx GEO evidence checkpoint — 2026-09-09","url":"https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09"')) failures.push(`${url.pathname}: versioned entity-evidence reference is missing`);
    if (!page.body.includes('"identifier":"swh:1:snp:a704b39b0771635572eb9381b37db046ac9856c2"')) failures.push(`${url.pathname}: Software Heritage snapshot reference is missing`);
    if (!page.body.includes('"identifier":"swh:1:snp:aed1c72273c6b77cb65c2971d21234104d02d060"')) failures.push(`${url.pathname}: buyer-guide archive reference is missing`);
    const coreArchive = new Map([
      ['/zh-cn/about/','20260909233718'],
      ['/zh-cn/ai-consulting/','20260909205631'],
      ['/zh-cn/custom-ai-development/','20260909205642'],
      ['/zh-cn/forward-deployed-engineering/','20260909214448'],
    ]).get(url.pathname);
    if (coreArchive) {
      const archiveUrl = `https://web.archive.org/web/${coreArchive}/https://hk.onyxdevslab.com${url.pathname}`;
      if (!page.body.includes(`"archivedAt":"${archiveUrl}"`)) failures.push(`${url.pathname}: Schema.org archivedAt relation is missing`);
      if (!page.body.includes(`rel="external archived" href="${archiveUrl}"`)) failures.push(`${url.pathname}: visible archive link is missing`);
    }
    if (/<meta[^>]+(?:name|property)=["']robots["'][^>]+content=["'][^"']*\b(?:noindex|none)\b/i.test(page.body)) failures.push(`${url.pathname}: blocking robots meta detected`);
  }));
}

console.log(JSON.stringify({ origin, canonicalOrigin, checkedPages: urls.length, networkRequests, cacheHits, failures }, null, 2));
if (failures.length) process.exit(1);

import fs from 'node:fs';
import path from 'node:path';
import {
  currentAttributionEvidence,
  currentCommonCrawlEvidence,
  currentMonitorEvidence,
  currentPromptCoverage,
  currentProviderEvidence,
  currentPublicSearchRetest,
  currentUnverifiedCrawlerEvidence,
  currentWaybackEvidence,
} from './current-geo-evidence.mjs';

const dist = path.resolve('dist');
const failures = [];
const htmlFiles = [];
const titles = new Map();
const canonicals = new Map();
const languageAlternates = new Map();

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
  if (pathname.includes('/methodology/ai-search-verification/')) return '2026-09-08';
  if (pathname.includes('/guides/what-is-ai-dingkai/') || pathname.includes('/guides/ai-dingkai/') || pathname.includes('/guides/hong-kong-ai-consulting-companies/') || pathname.includes('/guides/hong-kong-ai-service-providers/') || pathname.includes('/guides/enterprise-ai-rfp-template')) return '2026-09-10';
  if (pathname.includes('/guides/choose-enterprise-ai-partner') || pathname.includes('/guides/enterprise-ai-governance') || pathname.includes('/guides/hong-kong-enterprise-ai-governance') || pathname.includes('/guides/enterprise-ai-pilot-charter') || pathname.includes('/methodology/case-study-evidence-register/')) return '2026-09-09';
  return '2026-09-07';
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name === 'index.html') htmlFiles.push(file);
  }
}

walk(dist);

const markdownFiles = htmlFiles.map(file => path.join(path.dirname(file), 'index.md'));
for (const file of markdownFiles) {
  if (!fs.existsSync(file)) {
    failures.push(`${path.relative(dist, file)}: missing Markdown variant`);
    continue;
  }
  const markdown = fs.readFileSync(file, 'utf8');
  for (const required of ['title:', 'description:', 'canonical:', 'language:', '## Structured data', '"@context": "https://schema.org"']) {
    if (!markdown.includes(required)) failures.push(`${path.relative(dist, file)}: Markdown variant is missing ${required}`);
  }
}

const rootHtml = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
for (const required of ['ONYX DEVS LAB LIMITED', 'business registration number 79051925', 'href="/zh-cn/"', 'href="/en/guides/choose-enterprise-ai-partner-hong-kong/"', 'href="/en/methodology/ai-search-verification/"']) {
  if (!rootHtml.includes(required)) failures.push(`index.html: static crawler fallback is missing ${required}`);
}

const nginxRouteConfig = fs.readFileSync(path.resolve('deploy/nginx-hk.conf'), 'utf8');
const nginxLogConfig = fs.readFileSync(path.resolve('deploy/nginx-geo-log.conf'), 'utf8');
const nginxLogrotateConfig = fs.readFileSync(path.resolve('deploy/nginx-logrotate.conf'), 'utf8');
const cloudflareRealIpConfig = fs.readFileSync(path.resolve('deploy/cloudflare-real-ip.conf'), 'utf8');
const referralReportSource = fs.readFileSync(path.resolve('scripts/report-geo-referrals.mjs'), 'utf8');
const crawlerReportSource = fs.readFileSync(path.resolve('scripts/report-ai-crawlers.mjs'), 'utf8');
const packageSource = fs.readFileSync(path.resolve('package.json'), 'utf8');
const buildSource = fs.readFileSync(path.resolve('scripts/build-site.mjs'), 'utf8');
const geoOperationsSource = fs.readFileSync(path.resolve('docs/HK-GEO-发布手册.md'), 'utf8');
const crawlerObservationSource = fs.readFileSync(path.resolve('scripts/crawler-evidence-observations.mjs'), 'utf8');
const evidenceSummarySource = fs.readFileSync(path.resolve('scripts/geo-evidence-summary.mjs'), 'utf8');
const evidenceCollectorSource = fs.readFileSync(path.resolve('scripts/collect-geo-evidence.mjs'), 'utf8');
const distributionLiveSource = fs.readFileSync(path.resolve('scripts/check-distribution-live.mjs'), 'utf8');
const servicesHkMonitor = JSON.parse(fs.readFileSync(path.resolve('geo/services-hk-monitor.json'), 'utf8'));
const waybackReportSource = fs.readFileSync(path.resolve('scripts/report-wayback.mjs'), 'utf8');
const promptMatrix = JSON.parse(fs.readFileSync(path.resolve('geo/prompt-matrix.json'), 'utf8'));
const promptCrawlCoverage = JSON.parse(fs.readFileSync(path.resolve('docs/geo-baselines/2026-09-11-prompt-crawl-coverage.json'), 'utf8'));
if (!referralReportSource.includes('Onyx-(?:GEO-Release-Check|GEO-Distribution-Check|Buyer-Guide-Link-Check)')) failures.push('referral report: known Onyx link-check traffic is not excluded as synthetic');
if (!referralReportSource.includes('appid:\\s*s~virustotalcloud') || !referralReportSource.includes('coordinatedMultiProfileBurst') || !referralReportSource.includes('window.length >= 10') || !referralReportSource.includes('chromiumWithLegacyEdge') || !referralReportSource.includes("malformedCampaignVisits.push")) failures.push('referral report: link-scanner, coordinated-burst, inconsistent-user-agent, or malformed-campaign audit is missing');
if (!['chat\\.deepseek\\.com', 'kimi\\.com', 'yuanbao\\.tencent\\.com', 'chat\\.qwen\\.ai'].every((domain) => referralReportSource.includes(domain))) failures.push('referral report: major Chinese AI answer referrer coverage is incomplete');
if (!crawlerReportSource.includes('userAgentOnlyBytespiderPageCrawls') || !crawlerObservationSource.includes('user-agent-only-unverified') || !crawlerReportSource.includes('do not prove Doubao or ByteDance access')) failures.push('crawler report: identity-unverified Bytespider evidence boundary is missing');
if (!crawlerReportSource.includes('auditedSyntheticChecks') || !crawlerReportSource.includes('2026-09-11T15:35:27+00:00') || !crawlerReportSource.includes('2026-09-11T15:35:35+00:00')) failures.push('crawler report: audited unmarked Bytespider diagnostics are not excluded');
if (!crawlerReportSource.includes("--verify-apple") || !crawlerReportSource.includes('https://search.developer.apple.com/applebot.json') || !evidenceCollectorSource.includes("'--verify-apple'")) failures.push('crawler report: official Applebot verification is not enabled in the production collector');
if (!crawlerReportSource.includes("--verify-baidu") || !crawlerReportSource.includes("['.baidu.com', '.baidu.jp']") || !crawlerReportSource.includes('official-reverse-dns-suffix-plus-forward-confirmation') || !evidenceCollectorSource.includes("'--verify-baidu'")) failures.push('crawler report: official Baiduspider DNS verification is not enabled in the production collector');
if (!crawlerReportSource.includes("--verify-ahrefs") || !crawlerReportSource.includes('https://api.ahrefs.com/v3/public/crawler-ip-ranges') || !evidenceCollectorSource.includes("'--verify-ahrefs'")) failures.push('crawler report: official AhrefsBot IP verification is not enabled in the production collector');
if (fs.existsSync(path.resolve('scripts/report-bing-public-search.mjs')) || packageSource.includes('geo:public-search-report') || geoOperationsSource.includes('npm run geo:public-search-report') || !geoOperationsSource.includes('限制为个人、非商业用途的公开 RSS 结果接口')) failures.push('public search compliance: restricted Bing RSS monitoring path is present or its prohibition is undocumented');
if (!packageSource.includes('node scripts/build-site.mjs') || !buildSource.includes('restoreUnchangedFileTimes') || !buildSource.includes("createHash('sha256')")) failures.push('build freshness: unchanged generated files do not preserve stable Last-Modified and ETag inputs');
if (!crawlerReportSource.includes('const pagePath = /^(?:\\/$|') || !crawlerReportSource.includes('feed\\.(?:xml|json)') || !crawlerReportSource.includes('data\\/[^/]+\\.json(?:ld)?')) failures.push('crawler report: homepage or machine-resource path classification is missing');
if (nginxLogConfig.includes('$http_cf_connecting_ip') || !nginxLogConfig.includes('"clientIp":"$remote_addr"') || !nginxLogConfig.includes('"proxyIp":"$realip_remote_addr"')) failures.push('nginx GEO log: client IP does not use the trusted Real-IP result');
if (!nginxLogConfig.includes('map $http_referer $onyx_referrer_host') || !nginxLogConfig.includes('(?<onyx_referrer_domain>[^/:]+)') || !nginxLogConfig.includes('$onyx_referrer_domain;') || !nginxLogConfig.includes('log_format onyx_geo escape=json') || !nginxLogConfig.includes('"referrerHost":"$onyx_referrer_host"')) failures.push('nginx GEO log: HTTP(S) referrer host extraction or JSON logging is missing');
if (!nginxLogrotateConfig.includes('/var/log/nginx/*.log') || !nginxLogrotateConfig.includes('/usr/sbin/start-stop-daemon --stop --signal USR1 --quiet --pidfile /run/nginx.pid --name nginx') || nginxLogrotateConfig.includes('invoke-rc.d')) failures.push('nginx logrotate: direct policy-independent USR1 reopen is missing');
if (!cloudflareRealIpConfig.includes('real_ip_header CF-Connecting-IP;') || !cloudflareRealIpConfig.includes('real_ip_recursive on;') || (cloudflareRealIpConfig.match(/^set_real_ip_from /gm) || []).length !== 22 || !cloudflareRealIpConfig.includes('2606:4700::/32')) failures.push('nginx Real-IP: Cloudflare IPv4/IPv6 trust configuration is incomplete');
if (!evidenceSummarySource.includes('knownLinkScannerTrackedVisits') || !evidenceSummarySource.includes('knownLinkScannerUserAgentVisits') || !evidenceSummarySource.includes('knownLinkScannerNetworkVisits') || !evidenceSummarySource.includes('internallyInconsistentUserAgentVisits') || !evidenceSummarySource.includes('malformedCampaignVisits')) failures.push('evidence summary: automated-attribution audit counters are missing');
if (!evidenceCollectorSource.includes("check-distribution-live.mjs', ['--report']") || !evidenceCollectorSource.includes("atomicJson('distribution-live-report.json'") || !evidenceSummarySource.includes('buildDistributionAvailability')) failures.push('evidence monitor: offsite distribution availability is not collected or persisted');
if (!distributionLiveSource.includes('fetchOffsiteResource') || !distributionLiveSource.includes('attempts: 3') || !distributionLiveSource.includes("status: 'unavailable'") || !distributionLiveSource.includes('evidenceBoundary')) failures.push('distribution live checker: retry, unavailable-source handling, or evidence boundary is missing');
if (servicesHkMonitor.targets?.length !== 3 || !servicesHkMonitor.targets.every((target) => target.url.endsWith('.services.hk/') && target.requiredMarkers?.length === 3) || !servicesHkMonitor.forbiddenMarkers?.includes('Fatal error') || !evidenceCollectorSource.includes("check-services-hk.mjs', ['--report']") || !evidenceCollectorSource.includes("atomicJson('services-hk-report.json'") || !evidenceSummarySource.includes('buildServicesHkAvailability')) failures.push('evidence monitor: services.hk detail-template readiness is not versioned, collected, or persisted');
if (!evidenceCollectorSource.includes("report-wayback.mjs', ['--host=hk.onyxdevslab.com']") || !evidenceCollectorSource.includes("atomicJson('wayback-report.json'") || !waybackReportSource.includes("query.searchParams.set('matchType', 'host')") || !waybackReportSource.includes("attempts: 2") || !waybackReportSource.includes("--prompt-matrix=geo/prompt-matrix.json") || !waybackReportSource.includes('buildWaybackPromptCoverage')) failures.push('evidence monitor: retry-bounded Wayback CDX capture and fixed-prompt coverage monitoring is missing');
if (currentWaybackEvidence.fixedPromptArchiveCoverage?.prompts !== 23 || currentWaybackEvidence.fixedPromptArchiveCoverage?.uniqueEvidencePages !== 23 || currentWaybackEvidence.fixedPromptArchiveCoverage?.archivedEvidencePages !== 15 || currentWaybackEvidence.fixedPromptArchiveCoverage?.promptsWithAnyArchivedEvidence !== 15 || currentWaybackEvidence.fixedPromptArchiveCoverage?.promptsFullyArchived !== 11 || currentWaybackEvidence.fixedPromptArchiveCoverage?.missingEvidenceUrls?.length !== 8) failures.push('Wayback fixed-prompt archive coverage: published totals are incomplete or stale');
if (promptCrawlCoverage.schemaVersion !== 1 || promptCrawlCoverage.promptMatrixSchemaVersion !== promptMatrix.schemaVersion) failures.push('prompt crawl coverage: schema version is stale');
if (promptCrawlCoverage.totals?.prompts !== 23 || promptCrawlCoverage.totals?.uniqueEvidencePages !== 23 || promptCrawlCoverage.totals?.verifiedCrawledEvidencePages !== 15 || promptCrawlCoverage.totals?.searchRelatedCrawledEvidencePages !== 15 || promptCrawlCoverage.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCrawlCoverage.totals?.promptsFullyVerifiedCrawled !== 12 || promptCrawlCoverage.totals?.promptsWithAnySearchRelatedCrawl !== 18 || promptCrawlCoverage.totals?.promptsFullySearchRelatedCrawled !== 12) failures.push('prompt crawl coverage: verified coverage totals are incomplete or stale');
const promptEvidenceUrls = new Set(promptMatrix.prompts.flatMap((prompt) => prompt.evidenceUrls.map((pathname) => `https://hk.onyxdevslab.com${pathname}`)));
if (promptEvidenceUrls.size !== 23 || !promptCrawlCoverage.verifiedCrawledEvidenceUrls?.every((url) => promptEvidenceUrls.has(url)) || !promptCrawlCoverage.searchRelatedCrawledEvidenceUrls?.every((url) => promptEvidenceUrls.has(url))) failures.push('prompt crawl coverage: fixed prompt matrix is not fully represented');
if (!promptCrawlCoverage.evidenceBoundary?.includes('does not prove indexing, retrieval, citation, answer inclusion, ranking, or non-brand recommendation')) failures.push('prompt crawl coverage: evidence boundary is missing');
if (promptCrawlCoverage.bySegment?.scenario?.promptsWithAnyVerifiedCrawl !== 4) failures.push('prompt crawl coverage: scenario-page result is stale');
if (!nginxRouteConfig.includes('absolute_redirect off;')) failures.push('nginx: directory redirects are not constrained to relative HTTPS-safe targets');
if (!nginxRouteConfig.includes('if ($http_x_forwarded_proto = "http")') || !nginxRouteConfig.includes('return 301 https://hk.onyxdevslab.com$request_uri;')) failures.push('nginx: externally visible HTTP requests are not redirected to the canonical HTTPS origin');
if (!nginxRouteConfig.includes('location = /zh-cn/custom-ai-development-hong-kong/') || !nginxRouteConfig.includes('return 301 /zh-cn/custom-ai-development/;')) failures.push('nginx: observed legacy custom-development URL is not redirected');
if (!nginxRouteConfig.includes('location = /zh-cn/ai-consulting-hong-kong/') || !nginxRouteConfig.includes('return 301 /zh-cn/ai-consulting/;')) failures.push('nginx: observed legacy AI-consulting URL is not redirected');
if (!nginxRouteConfig.includes('location = /zh-cn/guides/hong-kong-enterprise-ai-providers/') || !nginxRouteConfig.includes('return 301 /zh-cn/guides/hong-kong-ai-consulting-companies/;')) failures.push('nginx: observed legacy provider-guide URL is not redirected');
if (!nginxRouteConfig.includes('try_files $uri $uri/ =404;')) failures.push('nginx: unknown routes do not return a real 404');
if ((nginxRouteConfig.match(/Cache-Control "public, max-age=0, must-revalidate"/g) || []).length !== 3 || nginxRouteConfig.includes('no-store, no-cache')) failures.push('nginx: HTML and Markdown must support conditional caching without no-store');
if (!nginxRouteConfig.includes('if ($request_uri ~ ^/index\\.html(?:\\?|$))')) failures.push('nginx: duplicate /index.html homepage is not redirected');

for (const file of htmlFiles) {
  const html = normalizeHtmlForChecks(fs.readFileSync(file, 'utf8'));
  const relative = path.relative(dist, file);
  if (!/<html lang="[^"]+"/.test(html)) failures.push(`${relative}: missing lang`);
  if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`${relative}: missing title`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) failures.push(`${relative}: missing description`);
  if (!html.includes('<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"')) failures.push(`${relative}: unrestricted search and AI preview directive is missing`);
  if (!/<link rel="canonical" href="https:\/\/hk\.onyxdevslab\.com\//.test(html)) failures.push(`${relative}: missing hk canonical`);
  if (!/<h1[ >]/.test(html)) failures.push(`${relative}: missing H1`);
  if (!html.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io')) failures.push(`${relative}: missing public GitHub entity reference`);
  if (!html.includes('"leiCode":"254900Z30CLK7HKE9H46"')) failures.push(`${relative}: missing direct LEI organization property`);
  if (!html.includes('"iso6523Code":"0199:254900Z30CLK7HKE9H46"')) failures.push(`${relative}: missing ISO 6523 LEI organization property`);
  if (!html.includes('"address":{"@type":"PostalAddress","streetAddress":"36-40 TAI LIN PAI ROAD, UNIT B53, 2/F, KWAI CHUNG","addressLocality":"HONG KONG","postalCode":"999077","addressCountry":"HK"}')) failures.push(`${relative}: missing verified registered-address organization property`);
  if (!html.includes('https://www.gleif.org/lei/254900Z30CLK7HKE9H46')) failures.push(`${relative}: missing official GLEIF entity reference`);
  if (!html.includes('"name":"Onyx GEO evidence checkpoint — 2026-09-09","url":"https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09"')) failures.push(`${relative}: missing versioned entity-evidence reference`);
  if (!html.includes('"identifier":"swh:1:snp:a6d10e9586fcc1860acf66f32651994693d87578"')) failures.push(`${relative}: missing Software Heritage snapshot reference`);
  if (!html.includes('"identifier":"swh:1:snp:7258af88334a1d2c00a25ab0bbb9330b4936d863"')) failures.push(`${relative}: missing buyer-guide archive reference`);
  if (!html.includes('"logo":{"@type":"ImageObject","url":"https://hk.onyxdevslab.com/onyx-devs-lab-logo.svg","contentUrl":"https://hk.onyxdevslab.com/onyx-devs-lab-logo.svg","width":512,"height":512}')) failures.push(`${relative}: organization logo does not meet the declared 112px minimum`);
  if (!html.includes('"contactPoint":{"@type":"ContactPoint"')) failures.push(`${relative}: missing organization contact point`);
  if (!html.includes('"hasOfferCatalog":{"@type":"OfferCatalog","name":"Onyx Devs Lab enterprise AI services"')) failures.push(`${relative}: missing organization service offer catalog`);
  for (const person of ['mi', 'lucas', 'hunter', 'jake', 'olivia']) if (!html.includes(`"@id":"https://hk.onyxdevslab.com/#person-${person}"`)) failures.push(`${relative}: missing canonical team-member reference: ${person}`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const lang = html.match(/<html lang="([^"]+)"/)?.[1];
  const pathname = canonical ? new URL(canonical).pathname : '';
  if (pathname.includes('/case-studies/') && !html.includes('"@type":"Article"')) failures.push(`${relative}: case study is not declared as Article`);
  if (/\/case-studies\/(?:retail-ai-decision-platform|accounting-ai-production-platform|legal-ai-evidence-workflow)\/$/.test(pathname)) {
    const scenarioGuide = 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/enterprise-ai-scenario-patterns/';
    if (!html.includes(`rel="external" href="${scenarioGuide}"`)) failures.push(`${relative}: visible cross-scenario guide link is missing`);
    if (!html.includes(`"subjectOf":{"@type":"Article","name":"Enterprise AI scenario architecture and evidence guide","url":"${scenarioGuide}"`)) failures.push(`${relative}: cross-scenario guide Schema.org relation is missing`);
  }
  if (html.includes('"@type":"Article"')) {
    const published = expectedPublishedDate(pathname);
    const authorPath = lang === 'zh-CN' ? '/zh-cn/about/' : (lang === 'zh-Hant-HK' ? '/zh-hk/about/' : '/en/about/');
    const modified = pathname.includes('/methodology/ai-search-verification/') ? '2026-09-12' : '2026-09-11';
    for (const required of [`"datePublished":"${published}"`, `"dateModified":"${modified}"`, `"mainEntityOfPage":{"@id":"${canonical}"}`, '"articleSection":', `<a rel="author" href="${authorPath}">Onyx Devs Lab</a>`, `<time datetime="${published}">${published}</time>`, `<time datetime="${modified}">${modified}</time>`]) {
      if (!html.includes(required)) failures.push(`${relative}: Article publication metadata is missing ${required}`);
    }
  }
  if (pathname.includes('/methodology/case-study-evidence-register/')) {
    if (!html.includes('<time datetime="2026-09-09">2026-09-09</time>') || !html.includes('<time datetime="2026-09-11">2026-09-11</time>')) failures.push(`${relative}: Dataset publication dates are not visible`);
  }
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
  const html = normalizeHtmlForChecks(fs.readFileSync(file, 'utf8'));
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

const servicePageGroups = [
  { code: 'ai-advisory', names: ['AI advisory', 'AI 顧問', 'AI 咨询'], paths: ['/en/ai-consulting-hong-kong/', '/zh-hk/ai-consulting/', '/zh-cn/ai-consulting/'] },
  { code: 'custom-ai-development', names: ['Custom AI development', 'AI 定制開發', 'AI 定制开发'], paths: ['/en/custom-ai-development-hong-kong/', '/zh-hk/custom-ai-development/', '/zh-cn/custom-ai-development/'] },
  { code: 'forward-deployed-engineering', names: ['Forward Deployed Engineering (FDE)', '前線部署工程（FDE）', '前线部署工程（FDE）'], paths: ['/en/forward-deployed-engineering/', '/zh-hk/forward-deployed-engineering/', '/zh-cn/forward-deployed-engineering/'] },
];
for (const group of servicePageGroups) {
  for (const pathname of group.paths) {
    const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
    if (!html.includes(`"serviceType":${JSON.stringify(group.names)}`)) failures.push(`${pathname}: canonical multilingual service type is missing`);
    if (!html.includes(`"category":{"@id":"https://hk.onyxdevslab.com/data/enterprise-ai-service-terms.jsonld#${group.code}"}`)) failures.push(`${pathname}: service category term relation is missing`);
  }
}

for (const pathname of ['/en/about/', '/zh-hk/about/', '/zh-cn/about/']) {
  const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
  if (!html.includes('"@type":["AboutPage","ProfilePage"]') || !html.includes('"mainEntity":{"@id":"https://hk.onyxdevslab.com/#organization"}') || !html.includes('"dateModified":"2026-09-12"')) failures.push(`${pathname}: organization ProfilePage markup is incomplete or stale`);
}

for (const file of ['robots.txt', 'sitemap.xml', 'feed.xml', 'feed.json', 'llms.txt', 'llms-full.txt', 'data/case-study-evidence.json', 'data/enterprise-ai-partner-scorecard.json', 'data/hong-kong-enterprise-ai-provider-shortlist.json', 'data/enterprise-ai-rfp-requirements.json', 'data/enterprise-ai-pilot-charter.json', 'data/enterprise-ai-engagement-model-map.json', 'data/enterprise-ai-service-terms.jsonld', 'data/chinese-enterprise-ai-field-notes.json', 'data/ai-search-evidence-status.json', 'data/ai-search-prompt-evidence-map.json', 'data/github-repository-search-baseline.json', 'data/organization.json', '.nojekyll']) {
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
  'feed.json': fs.readFileSync(path.join(dist, 'feed.json'), 'utf8'),
};
for (const [name, body] of Object.entries(machineDiscoveryFiles)) {
  if (!body.includes('https://gist.github.com/mixuechu/e47c85808014d62b6305441e8065c91e')) failures.push(`${name}: offsite decision matrix is missing`);
  if (!body.includes('https://gist.githubusercontent.com/mixuechu/e47c85808014d62b6305441e8065c91e/raw/Hong-Kong-enterprise-AI-governance.md')) failures.push(`${name}: offsite governance note is missing`);
  if (!body.includes('https://gist.githubusercontent.com/mixuechu/e47c85808014d62b6305441e8065c91e/raw/Onyx-enterprise-AI-machine-resources.md')) failures.push(`${name}: offsite machine-resource index is missing`);
  if (!body.includes('https://raw.githubusercontent.com/0xHunterL/onyx-devs-lab.github.io/main/codemeta.json')) failures.push(`${name}: CodeMeta discovery link is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/codemeta.json')) failures.push(`${name}: versioned CodeMeta discovery link is missing`);
  if (!body.includes('https://raw.githubusercontent.com/0xHunterL/onyx-devs-lab.github.io/main/CITATION.cff')) failures.push(`${name}: citation metadata discovery link is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/CITATION.cff')) failures.push(`${name}: versioned citation metadata discovery link is missing`);
  for (const fieldNote of ['FDE-is-not-staff-augmentation.zh-CN.md', 'AI-agent-ERP-integration-checklist.zh-CN.md', 'Legal-AI-evidence-chain.zh-CN.md']) {
    if (!body.includes(fieldNote)) failures.push(`${name}: offsite field note is missing: ${fieldNote}`);
  }
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09')) failures.push(`${name}: versioned evidence checkpoint is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-readiness-2026-09-10')) failures.push(`${name}: versioned agent-readiness checkpoint is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-referral-evidence-2026-09-10')) failures.push(`${name}: current crawler-and-referral evidence checkpoint is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-50')) failures.push(`${name}: automated GEO monitor evidence checkpoint is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-prompt-crawl-coverage-2026-09-10')) failures.push(`${name}: fixed-prompt crawl coverage checkpoint is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-ai-rfp-template-2026-09-10')) failures.push(`${name}: versioned AI RFP checkpoint is missing`);
  if (!body.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/chinese-enterprise-ai-field-notes-2026-09-10')) failures.push(`${name}: Chinese field-note release is missing`);
  if (!body.includes('https://archive.softwareheritage.org/swh:1:snp:a6d10e9586fcc1860acf66f32651994693d87578/')) failures.push(`${name}: Software Heritage snapshot is missing`);
  if (!body.includes('https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide')) failures.push(`${name}: enterprise AI buyer-guide repository is missing`);
  if (!body.includes('https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/')) failures.push(`${name}: crawlable enterprise AI buyer guide is missing`);
  for (const page of ['ai-consulting/', 'ai-custom-development/', 'forward-deployed-engineering/', 'ai-search-geo-evidence/', 'enterprise-ai-scenario-patterns/']) if (!body.includes(`https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/${page}`)) failures.push(`${name}: focused buyer-guide page is missing: ${page}`);
  for (const asset of ['CITATION.cff', 'codemeta.json', 'resources.json']) if (!body.includes(`https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/${asset}`)) failures.push(`${name}: buyer-guide metadata is missing: ${asset}`);
  if (!body.includes('https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-machine-resources-2026-09-11')) failures.push(`${name}: versioned buyer-guide checkpoint is missing`);
  if (!body.includes('https://archive.softwareheritage.org/swh:1:snp:7258af88334a1d2c00a25ab0bbb9330b4936d863/')) failures.push(`${name}: buyer-guide archive is missing`);
  if (!body.includes('https://web.archive.org/web/20260909212732/https://hk.onyxdevslab.com/zh-cn/guides/ai-dingkai/')) failures.push(`${name}: Internet Archive AI dingkai snapshot is missing`);
  for (const [timestamp, pathname] of [['20260909233718','about'],['20260909205631','ai-consulting'],['20260909205642','custom-ai-development'],['20260909214448','forward-deployed-engineering']]) if (!body.includes(`https://web.archive.org/web/${timestamp}/https://hk.onyxdevslab.com/zh-cn/${pathname}/`)) failures.push(`${name}: Internet Archive core snapshot is missing: ${pathname}`);
}
for (const name of ['llms.txt', 'llms-full.txt']) {
  if (!machineDiscoveryFiles[name].includes('proof of search indexing, AI citation') && !machineDiscoveryFiles[name].includes('proves search indexing, AI citation')) failures.push(`${name}: search-evidence boundary is missing`);
  if (!machineDiscoveryFiles[name].includes('https://hk.onyxdevslab.com/data/enterprise-ai-partner-scorecard.json')) failures.push(`${name}: procurement scorecard discovery link is missing`);
  if (!machineDiscoveryFiles[name].includes('https://hk.onyxdevslab.com/data/enterprise-ai-pilot-charter.json')) failures.push(`${name}: pilot charter discovery link is missing`);
  if (!machineDiscoveryFiles[name].includes('https://hk.onyxdevslab.com/data/enterprise-ai-engagement-model-map.json')) failures.push(`${name}: engagement-model decision map discovery link is missing`);
  if (!machineDiscoveryFiles[name].includes('https://hk.onyxdevslab.com/data/ai-search-evidence-status.json')) failures.push(`${name}: AI-search evidence status discovery link is missing`);
  if (!machineDiscoveryFiles[name].includes('https://hk.onyxdevslab.com/data/github-repository-search-baseline.json')) failures.push(`${name}: GitHub repository-search baseline discovery link is missing`);
  if (!machineDiscoveryFiles[name].includes('https://hk.onyxdevslab.com/data/organization.json')) failures.push(`${name}: canonical organization record discovery link is missing`);
  if (!machineDiscoveryFiles[name].includes('https://hk.onyxdevslab.com/data/chinese-enterprise-ai-field-notes.json')) failures.push(`${name}: Chinese field-note index is missing`);
  if (!machineDiscoveryFiles[name].includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/chinese-enterprise-ai-field-notes-2026-09-10/chinese-enterprise-ai-field-notes.json')) failures.push(`${name}: versioned Chinese field-note index is missing`);
}
if (!machineDiscoveryFiles['llms.txt'].includes('Legal entity: ONYX DEVS LAB LIMITED') || !machineDiscoveryFiles['llms.txt'].includes('Hong Kong business registration number: 79051925') || !machineDiscoveryFiles['llms.txt'].includes('Legal Entity Identifier (LEI): 254900Z30CLK7HKE9H46')) failures.push('llms.txt: direct verified entity identifiers are missing');
for (const asset of ['2026-09-11-monitor-evidence.json', 'ai-search-evidence-status.json', 'prompt-matrix.json', 'ai-search-prompt-evidence-map.json', '2026-09-11-prompt-crawl-coverage.json']) if (!machineDiscoveryFiles['llms.txt'].includes(`https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-50/${asset}`)) failures.push(`llms.txt: current monitor evidence asset is missing: ${asset}`);
if (machineDiscoveryFiles['llms.txt'].includes('Current crawler and offsite-referral evidence checkpoint') || !machineDiscoveryFiles['llms.txt'].includes('Historical crawler and offsite-referral evidence checkpoint — 2026-09-10') || !machineDiscoveryFiles['llms.txt'].includes('For the latest observations, use the current machine-readable AI-search evidence status linked above.')) failures.push('llms.txt: historical crawler checkpoint is mislabeled as current or lacks a current-status boundary');
if (!machineDiscoveryFiles['llms.txt'].includes('2026-09-12T14:36:27.882Z baseline') || !machineDiscoveryFiles['llms.txt'].includes('provider-maintained checkpoint proves crawler access only, not indexing')) failures.push('llms.txt: current monitor checkpoint lacks its observation-time or evidence boundary');
if (machineDiscoveryFiles['llms-full.txt'].includes('Versioned current AI-search evidence status asset') || !machineDiscoveryFiles['llms-full.txt'].includes('Historical versioned AI-search evidence status asset — 2026-09-10')) failures.push('llms-full.txt: historical AI-search status asset is mislabeled as current');
if (!machineDiscoveryFiles['feed.xml'].includes('provider-maintained-external-source')) failures.push('feed.xml: external-source category is missing');
if (!machineDiscoveryFiles['feed.xml'].includes('independent-archive')) failures.push('feed.xml: independent archive category is missing');
const aiDingkaiHtml = fs.readFileSync(path.join(dist, 'zh-cn/guides/ai-dingkai/index.html'), 'utf8');
if (!aiDingkaiHtml.includes('"archivedAt":"https://web.archive.org/web/20260909212732/https://hk.onyxdevslab.com/zh-cn/guides/ai-dingkai/"')) failures.push('AI dingkai guide: Schema.org archivedAt relation is missing');
if (!aiDingkaiHtml.includes('rel="external archived" href="https://web.archive.org/web/20260909212732/https://hk.onyxdevslab.com/zh-cn/guides/ai-dingkai/"')) failures.push('AI dingkai guide: visible archive link is missing');
for (const [pathname, timestamp] of [['about','20260909233718'],['ai-consulting','20260909205631'],['custom-ai-development','20260909205642'],['forward-deployed-engineering','20260909214448']]) {
  const html = fs.readFileSync(path.join(dist, `zh-cn/${pathname}/index.html`), 'utf8');
  const archiveUrl = `https://web.archive.org/web/${timestamp}/https://hk.onyxdevslab.com/zh-cn/${pathname}/`;
  if (!html.includes(`"archivedAt":"${archiveUrl}"`)) failures.push(`${pathname}: Schema.org archivedAt relation is missing`);
  if (!html.includes(`rel="external archived" href="${archiveUrl}"`)) failures.push(`${pathname}: visible archive link is missing`);
}
const archivedAnswerPages = [
  ['guides/ai-consulting-vs-development-vs-fde', '20260910164547'],
  ['guides/custom-ai-development-cost', '20260910164632'],
  ['guides/enterprise-ai-agent-erp-integration', '20260910164723'],
  ['methodology/enterprise-ai-evaluation', '20260910164753'],
  ['case-studies/retail-ai-decision-platform', '20260910164813'],
  ['case-studies/accounting-ai-production-platform', '20260910164849'],
  ['case-studies/legal-ai-evidence-workflow', '20260910164909'],
];
for (const [pathname, timestamp] of archivedAnswerPages) {
  const html = fs.readFileSync(path.join(dist, `zh-cn/${pathname}/index.html`), 'utf8');
  const archiveUrl = `https://web.archive.org/web/${timestamp}/https://hk.onyxdevslab.com/zh-cn/${pathname}/`;
  if (!html.includes(`"archivedAt":"${archiveUrl}"`)) failures.push(`${pathname}: Schema.org archivedAt relation is missing`);
  if (!html.includes(`rel="external archived" href="${archiveUrl}"`)) failures.push(`${pathname}: visible archive link is missing`);
  if (!machineDiscoveryFiles['feed.xml'].includes(`<id>${archiveUrl}</id><link href="${archiveUrl}"/>`)) failures.push(`feed.xml: archived answer-page entry is missing: ${pathname}`);
  for (const name of ['llms.txt', 'llms-full.txt']) if (!machineDiscoveryFiles[name].includes(archiveUrl)) failures.push(`${name}: archived answer-page link is missing: ${pathname}`);
}
try {
  const jsonFeed = JSON.parse(machineDiscoveryFiles['feed.json']);
  if (jsonFeed.version !== 'https://jsonfeed.org/version/1.1') failures.push('feed.json: unexpected JSON Feed version');
  if (jsonFeed.home_page_url !== 'https://hk.onyxdevslab.com/' || jsonFeed.feed_url !== 'https://hk.onyxdevslab.com/feed.json') failures.push('feed.json: canonical feed URLs are incomplete');
  if (!jsonFeed.user_comment?.includes('does not prove search indexing, AI retrieval, citation, recommendation')) failures.push('feed.json: evidence boundary is missing');
  if (!jsonFeed.items?.length || !jsonFeed.items.every((item) => item.id && item.url && item.title && item.content_text && item.date_modified)) failures.push('feed.json: item fields are incomplete');
  if (jsonFeed.hubs?.length !== 1 || jsonFeed.hubs[0]?.type !== 'WebSub' || jsonFeed.hubs[0]?.url !== 'https://pubsubhubbub.appspot.com/') failures.push('feed.json: WebSub hub discovery is missing');
  if (!jsonFeed.items.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-readiness-2026-09-10' && item.date_modified === '2026-09-10T00:00:00+08:00')) failures.push('feed.json: readiness checkpoint entry is missing or stale');
  if (!jsonFeed.items.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-referral-evidence-2026-09-10' && item.date_modified === '2026-09-10T00:00:00+08:00')) failures.push('feed.json: crawler-and-referral evidence checkpoint entry is missing or stale');
  if (!jsonFeed.items.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-50' && item.date_modified === '2026-09-12T00:00:00+08:00')) failures.push('feed.json: automated monitor evidence checkpoint entry is missing or stale');
  if (!jsonFeed.items.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-prompt-crawl-coverage-2026-09-10' && item.date_modified === '2026-09-10T00:00:00+08:00')) failures.push('feed.json: fixed-prompt crawl coverage checkpoint entry is missing or stale');
  if (!jsonFeed.items.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-ai-rfp-template-2026-09-10' && item.date_modified === '2026-09-10T00:00:00+08:00')) failures.push('feed.json: AI RFP checkpoint entry is missing or stale');
  if (!jsonFeed.items.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/chinese-enterprise-ai-field-notes-2026-09-10' && item.date_modified === '2026-09-10T00:00:00+08:00')) failures.push('feed.json: Chinese field-note release entry is missing or stale');
  if (!jsonFeed.items.some((item) => item.tags?.includes('provider-maintained-external-source'))) failures.push('feed.json: external-source category is missing');
  if (!jsonFeed.items.some((item) => item.tags?.includes('independent-archive') && item.url === 'https://archive.softwareheritage.org/swh:1:snp:a6d10e9586fcc1860acf66f32651994693d87578/')) failures.push('feed.json: Software Heritage archive item is missing');
  if (!jsonFeed.items.some((item) => item.tags?.includes('provider-maintained-external-source') && item.url === 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/')) failures.push('feed.json: crawlable buyer-guide item is missing');
  for (const page of ['ai-consulting/', 'ai-custom-development/', 'forward-deployed-engineering/', 'ai-search-geo-evidence/', 'enterprise-ai-scenario-patterns/']) if (!jsonFeed.items.some((item) => item.tags?.includes('provider-maintained-external-source') && item.url === `https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/${page}`)) failures.push(`feed.json: focused buyer-guide item is missing: ${page}`);
  if (!jsonFeed.items.some((item) => item.tags?.includes('machine-readable') && item.url === 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/resources.json' && item.date_modified === '2026-09-11T00:00:00+08:00')) failures.push('feed.json: buyer-guide resource-map item is missing or stale');
  if (!machineDiscoveryFiles['feed.xml'].includes('<id>https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/resources.json</id><link href="https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/resources.json"/><updated>2026-09-11T00:00:00+08:00</updated>')) failures.push('feed.xml: buyer-guide resource-map entry is missing or stale');
  if (!jsonFeed.items.some((item) => item.tags?.includes('provider-maintained-external-source') && item.url === 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-machine-resources-2026-09-11')) failures.push('feed.json: versioned buyer-guide checkpoint is missing');
  if (!jsonFeed.items.some((item) => item.tags?.includes('independent-archive') && item.url === 'https://archive.softwareheritage.org/swh:1:snp:7258af88334a1d2c00a25ab0bbb9330b4936d863/')) failures.push('feed.json: buyer-guide archive item is missing');
  for (const [pathname, timestamp] of archivedAnswerPages) {
    const archiveUrl = `https://web.archive.org/web/${timestamp}/https://hk.onyxdevslab.com/zh-cn/${pathname}/`;
    if (!jsonFeed.items.some((item) => item.id === archiveUrl && item.url === archiveUrl && item.tags?.includes('independent-archive'))) failures.push(`feed.json: archived answer-page entry is missing: ${pathname}`);
  }
} catch {
  failures.push('feed.json: invalid JSON');
}
const targetedDiscoveryPaths = [
  '/zh-cn/',
  '/zh-cn/about/',
  '/zh-cn/ai-consulting/',
  '/zh-cn/custom-ai-development/',
  '/zh-cn/forward-deployed-engineering/',
  '/zh-cn/guides/ai-consulting-vs-development-vs-fde/',
  '/zh-cn/guides/custom-ai-development-cost/',
  '/zh-cn/guides/enterprise-ai-agent-erp-integration/',
  '/zh-cn/methodology/enterprise-ai-evaluation/',
  '/zh-cn/case-studies/retail-ai-decision-platform/',
  '/zh-cn/case-studies/accounting-ai-production-platform/',
  '/zh-cn/case-studies/legal-ai-evidence-workflow/',
];
const atomDiscovery = machineDiscoveryFiles['feed.xml'];
const jsonDiscovery = JSON.parse(machineDiscoveryFiles['feed.json']);
for (const pathname of targetedDiscoveryPaths) {
  const url = `https://hk.onyxdevslab.com${pathname}`;
  if (!atomDiscovery.includes(`<id>${url}</id><link href="${url}"/>`)) failures.push(`feed.xml: direct discovery entry is missing: ${pathname}`);
  if (!jsonDiscovery.items?.some((item) => item.id === url && item.url === url)) failures.push(`feed.json: direct discovery item is missing: ${pathname}`);
}
for (const url of [
  'https://hk.onyxdevslab.com/data/ai-search-prompt-evidence-map.json',
  'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-prompt-evidence-map-2026-09-10',
]) {
  if (!atomDiscovery.includes(`<id>${url}</id><link href="${url}"/>`)) failures.push(`feed.xml: prompt evidence entry is missing: ${url}`);
  if (!jsonDiscovery.items?.some((item) => item.id === url && item.url === url)) failures.push(`feed.json: prompt evidence item is missing: ${url}`);
}
try {
  const termGraph = JSON.parse(fs.readFileSync(path.join(dist, 'data/enterprise-ai-service-terms.jsonld'), 'utf8'));
  const nodes = termGraph['@graph'];
  if (termGraph['@context'] !== 'https://schema.org' || !Array.isArray(nodes)) failures.push('service term graph: invalid JSON-LD context or graph');
  const termSet = nodes?.find((node) => node['@type'] === 'DefinedTermSet');
  const terms = nodes?.filter((node) => node['@type'] === 'DefinedTerm') || [];
  const services = nodes?.filter((node) => node['@type'] === 'Service') || [];
  if (termSet?.['@id'] !== 'https://hk.onyxdevslab.com/data/enterprise-ai-service-terms.jsonld' || termSet?.hasDefinedTerm?.length !== 3) failures.push('service term graph: DefinedTermSet is incomplete');
  if (termSet?.sameAs !== 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-ai-rfp-template-2026-09-10/enterprise-ai-service-terms.jsonld') failures.push('service term graph: versioned copy is missing');
  if (terms.map((term) => term.termCode).join(',') !== 'ai-advisory,custom-ai-development,forward-deployed-engineering') failures.push('service term graph: required category terms are incomplete');
  if (!terms.every((term) => term.name?.length === 3 && term.description?.length === 3 && term.inDefinedTermSet?.['@id'] === termSet?.['@id'] && term.url)) failures.push('service term graph: multilingual term definitions are incomplete');
  if (services.length !== 3 || !services.every((service) => service.provider?.['@id'] === 'https://hk.onyxdevslab.com/#organization' && service.areaServed?.includes('Hong Kong') && service.category?.['@id'])) failures.push('service term graph: provider-service-category relationships are incomplete');
  if (!termGraph.evidenceBoundary?.includes('does not prove independent endorsement, search indexing, AI citation, recommendation')) failures.push('service term graph: evidence boundary is missing');
} catch {
  failures.push('service term graph: invalid JSON');
}
try {
  const fieldNotes = JSON.parse(fs.readFileSync(path.join(dist, 'data/chinese-enterprise-ai-field-notes.json'), 'utf8'));
  const expectedHashes = ['bbc41dcade840fa7a4c485e98db06ed4ff9b398a914d6ec85d59bdc373055aed', '28b9177f6a76b3af8a4f6e5d45334e7870b3829e09f00c36b41d0a50686941a2', 'da76c6c1413230f78166f9feccb5ed25c5567989795a3c2288c6ae5f6c1a26cf'];
  if (fieldNotes.schemaVersion !== 1 || fieldNotes.version !== '2026.09.10' || fieldNotes.notes?.length !== 3 || fieldNotes.serviceScope?.length !== 3) failures.push('Chinese field-note index: expected collection structure is incomplete');
  if (fieldNotes.sameAs !== 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/chinese-enterprise-ai-field-notes-2026-09-10/chinese-enterprise-ai-field-notes.json') failures.push('Chinese field-note index: versioned asset is missing');
  if (fieldNotes.notes?.map((note) => note.sha256).join(',') !== expectedHashes.join(',') || !fieldNotes.notes?.every((note) => note.repositorySource && note.gistSource && note.canonicalPage && note.topics?.length)) failures.push('Chinese field-note index: source map or hashes are incomplete');
  if (!fieldNotes.evidenceBoundary?.includes('does not prove independent endorsement, search indexing, AI retrieval, citation, non-brand recommendation')) failures.push('Chinese field-note index: evidence boundary is missing');
} catch {
  failures.push('Chinese field-note index: invalid JSON');
}
try {
  const shortlist = JSON.parse(fs.readFileSync(path.join(dist, 'data/hong-kong-enterprise-ai-provider-shortlist.json'), 'utf8'));
  const expectedProviders = ['Onyx Devs Lab', 'Accenture', 'Deloitte China', 'PwC Hong Kong', 'Hong Kong Productivity Council'];
  if (shortlist.schemaVersion !== 1 || shortlist.version !== '2026.09.10' || shortlist.dateReviewed !== '2026-09-10') failures.push('provider shortlist: version or review date is incomplete');
  if (shortlist.providers?.map((provider) => provider.name).join(',') !== expectedProviders.join(',')) failures.push('provider shortlist: expected five-provider snapshot is incomplete');
  if (!shortlist.providers?.every((provider) => provider.providerType && provider.hongKongEvidence && provider.capabilityEvidence?.length && provider.publiclyDescribedScope?.length && provider.evidenceBoundary)) failures.push('provider shortlist: provider evidence fields are incomplete');
  if (shortlist.rankingMethod !== 'None. Array order is editorial and conveys no score, rank, endorsement, or recommendation.' || shortlist.limitations?.length < 4) failures.push('provider shortlist: non-ranking evidence boundary is incomplete');
  if (!shortlist.landingPages?.en || !shortlist.landingPages?.zhHant || !shortlist.landingPages?.zhHans || shortlist.buyerVerificationFields?.length < 7) failures.push('provider shortlist: landing pages or buyer verification fields are incomplete');
} catch {
  failures.push('provider shortlist: invalid JSON');
}
for (const pathname of ['/en/guides/hong-kong-ai-consulting-companies/', '/zh-hk/guides/hong-kong-ai-service-providers/', '/zh-cn/guides/hong-kong-ai-consulting-companies/']) {
  const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
  const hkpcName = pathname.includes('/en/') ? 'Hong Kong Productivity Council' : (pathname.includes('/zh-hk/') ? '香港生產力促進局' : '香港生产力促进局');
  for (const required of ['Onyx Devs Lab', 'Accenture', 'Deloitte China', 'PwC Hong Kong', hkpcName, 'hong-kong-enterprise-ai-provider-shortlist.json']) if (!html.includes(required)) failures.push(`${pathname}: provider shortlist content is missing ${required}`);
  if (!html.includes('"citation":[') || !html.includes('https://campaigns.hkpc.org/en/ai-with-hkpc')) failures.push(`${pathname}: provider shortlist source citations are incomplete`);
}
try {
  const rfp = JSON.parse(fs.readFileSync(path.join(dist, 'data/enterprise-ai-rfp-requirements.json'), 'utf8'));
  if (rfp.schemaVersion !== 1 || rfp.version !== '2026.09.10' || rfp.sections?.length !== 9) failures.push('AI RFP template: schema, version, or sections are incomplete');
  if (!rfp.sections?.every((section) => section.id && section.name?.en && section.name?.zhHant && section.name?.zhHans && section.fields?.length)) failures.push('AI RFP template: multilingual sections or fields are incomplete');
  if (!rfp.mandatoryGateRule?.includes('cannot be offset') || rfp.statuses?.length !== 4 || rfp.sources?.length !== 3 || rfp.limitations?.length !== 3) failures.push('AI RFP template: gate, status, source, or limitation boundary is incomplete');
} catch {
  failures.push('AI RFP template: invalid JSON');
}
for (const pathname of ['/en/guides/enterprise-ai-rfp-template-hong-kong/', '/zh-hk/guides/enterprise-ai-rfp-template/', '/zh-cn/guides/enterprise-ai-rfp-template/']) {
  const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
  for (const required of ['enterprise-ai-rfp-requirements.json', 'NIST', 'www.pcpd.org.hk', 'www1.smartlab.gov.hk', '"citation":']) if (!html.includes(required)) failures.push(`${pathname}: AI RFP content or primary source is missing ${required}`);
}
try {
  const organization = JSON.parse(fs.readFileSync(path.join(dist, 'data/organization.json'), 'utf8'));
  if (organization.iso6523Code !== '0199:254900Z30CLK7HKE9H46') failures.push('organization record: preferred ISO 6523 LEI is missing');
  if (organization.logo?.contentUrl !== 'https://hk.onyxdevslab.com/onyx-devs-lab-logo.svg' || organization.logo?.width !== 512 || organization.logo?.height !== 512) failures.push('organization record: indexable logo metadata is incomplete');
  if (organization.contactPoint?.['@type'] !== 'ContactPoint' || organization.contactPoint?.contactType !== 'sales' || organization.contactPoint?.email !== 'info@onyxdevslab.com' || organization.contactPoint?.availableLanguage?.join(',') !== 'English,Chinese') failures.push('organization record: canonical sales contact relation is incomplete');
  if (!organization.subjectOf?.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-50' && item.sameAs === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-50/2026-09-11-monitor-evidence.json' && item.distribution?.contentUrl === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-50/ai-search-evidence-status.json')) failures.push('organization record: automated GEO monitor evidence relation is missing');
} catch {
  failures.push('organization record: invalid JSON');
}
const logoSvg = fs.readFileSync(path.join(dist, 'favicon.svg'), 'utf8');
if (!logoSvg.includes('width="512" height="512" viewBox="0 0 100 100"')) failures.push('favicon.svg: explicit 512px logo dimensions are missing');
const organizationLogoSvg = fs.readFileSync(path.join(dist, 'onyx-devs-lab-logo.svg'), 'utf8');
if (!organizationLogoSvg.includes('width="512" height="512" viewBox="0 0 100 100"') || !organizationLogoSvg.includes('<title id="title">Onyx Devs Lab logo</title>')) failures.push('onyx-devs-lab-logo.svg: explicit dimensions or accessible brand title are missing');
for (const pathname of ['/en/about/', '/zh-hk/about/', '/zh-cn/about/']) {
  const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
  if (!html.includes('36-40 TAI LIN PAI ROAD, UNIT B53, 2/F, KWAI CHUNG, HONG KONG 999077')) failures.push(`${pathname}: visible registered address is missing`);
  if (!html.includes('ACTIVE') || !html.includes('ISSUED')) failures.push(`${pathname}: visible GLEIF status is missing`);
  if (!html.includes('https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09')) failures.push(`${pathname}: visible versioned evidence link is missing`);
  if (!html.includes('href="/data/organization.json" type="application/json"')) failures.push(`${pathname}: visible canonical organization JSON link is missing`);
  for (const person of ['mi', 'lucas', 'hunter', 'jake', 'olivia']) {
    if (!html.includes(`"@type":"Person","@id":"https://hk.onyxdevslab.com/#person-${person}"`)) failures.push(`${pathname}: canonical Person node is missing: ${person}`);
    if (!html.includes(`<article class="person" id="${person}">`)) failures.push(`${pathname}: visible Person anchor is missing: ${person}`);
  }
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
  if (!html.includes('href="/data/ai-search-evidence-status.json" type="application/json"')) failures.push(`${pathname}: visible AI-search evidence status download is missing`);
  if (!html.includes('"@type":"Dataset","name":"Onyx AI-search evidence status"')) failures.push(`${pathname}: AI-search evidence status Schema.org relation is missing`);
  if (!html.includes('href="/data/ai-search-prompt-evidence-map.json" type="application/json"')) failures.push(`${pathname}: visible fixed-prompt evidence map download is missing`);
  if (!html.includes('"@type":"Dataset","name":"Onyx fixed AI-search prompt evidence map"')) failures.push(`${pathname}: fixed-prompt evidence map Schema.org relation is missing`);
  if (!html.includes('<section class="evidence-status">') || !html.includes('data-evidence-level="4"')) failures.push(`${pathname}: visible four-level current evidence status is missing`);
}
try {
  const promptMap = JSON.parse(fs.readFileSync(path.join(dist, 'data/ai-search-prompt-evidence-map.json'), 'utf8'));
  const evidenceUrls = [...new Set(promptMap.prompts?.flatMap((prompt) => prompt.evidencePages?.map((page) => page.url) || []) || [])];
  if (promptMap.schemaVersion !== 1 || promptMap.promptMatrix?.schemaVersion !== 3 || promptMap.prompts?.length !== 23 || evidenceUrls.length !== 23) failures.push('AI-search prompt evidence map: prompt or evidence-page coverage is incomplete');
  if (!promptMap.versionHistory?.some((item) => item.relation === 'previous-immutable-checkpoint' && item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-prompt-evidence-map-2026-09-10/ai-search-prompt-evidence-map.json')) failures.push('AI-search prompt evidence map: immutable checkpoint history is missing');
  if (promptMap.promptMatrix?.doubaoPromptsSent !== false || promptMap.totals?.verifiedCrawledEvidencePages !== 15 || promptMap.totals?.searchRelatedCrawledEvidencePages !== 15) failures.push('AI-search prompt evidence map: evidence boundary is incomplete');
  const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
  const zhCnPage = fs.readFileSync(path.join(dist, '/zh-cn/methodology/ai-search-verification/', 'index.html'), 'utf8');
  for (const url of evidenceUrls) {
    if (!sitemap.includes(`<loc>${url}</loc>`)) failures.push(`AI-search prompt evidence map: sitemap URL is missing: ${url}`);
    if (!zhCnPage.includes(`href="${new URL(url).pathname}"`)) failures.push(`AI-search prompt evidence map: visible zh-CN evidence link is missing: ${url}`);
  }
} catch {
  failures.push('AI-search prompt evidence map: invalid JSON');
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
  if (!organization.subjectOf?.some((item) => item.url === 'https://www.tempb.com/companies/onyx-devs-lab-limited/' && item.description?.includes('entity-disambiguation evidence only'))) failures.push('organization record: tempb entity-disambiguation record or boundary is missing');
  if (!organization.subjectOf?.some((item) => item.url === 'https://hkg.databasesets.com/zh-hant/gongsimingdan/number/79051925' && item.description?.includes('entity-disambiguation evidence only'))) failures.push('organization record: databasesets entity-disambiguation record or boundary is missing');
  if (!organization.subjectOf?.some((item) => item.identifier === 'swh:1:snp:a6d10e9586fcc1860acf66f32651994693d87578' && item.version === 'a2d9281d23f406cd7ab1b19ed62d0e4c2e6fadfc')) failures.push('organization record: Software Heritage snapshot relation is missing');
  if (!organization.subjectOf?.some((item) => item.url === 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/' && item.isBasedOn === 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide')) failures.push('organization record: buyer-guide relation is missing');
  if (!organization.subjectOf?.some((item) => item['@type'] === 'DiscussionForumPosting' && item.url === 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/discussions/1')) failures.push('organization record: public procurement Q&A relation is missing');
  if (!organization.subjectOf?.some((item) => item.url === 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/' && item.sameAs === 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-machine-resources-2026-09-11' && item.hasPart?.length === 6 && item.hasPart.some((part) => part.url === 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/enterprise-ai-scenario-patterns/') && item.hasPart.some((part) => part.url === 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/resources.json' && part.encodingFormat === 'application/json') && item.hasPart.every((part) => part.url?.startsWith('https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/')))) failures.push('organization record: focused buyer-guide relations are missing');
  if (!organization.subjectOf?.some((item) => item.identifier === 'swh:1:snp:7258af88334a1d2c00a25ab0bbb9330b4936d863' && item.version === 'dc74de940666e09194798447d0f9a525c890cdb9')) failures.push('organization record: buyer-guide archive relation is missing');
  if (!organization.subjectOf?.some((item) => item.url === 'https://web.archive.org/web/20260909233718/https://hk.onyxdevslab.com/zh-cn/about/' && item.hasPart?.length === 11)) failures.push('organization record: Internet Archive entity, service, guide, and case snapshot cluster is missing');
  if (!organization.additionalProperty?.some((item) => item.propertyID === 'Evidence boundary' && item.value.includes('do not endorse services'))) failures.push('organization record: evidence boundary is missing');
  if (organization.hasOfferCatalog?.itemListElement?.length !== 3 || !organization.hasOfferCatalog.itemListElement.every((offer) => offer.itemOffered?.['@type'] === 'Service' && offer.itemOffered?.url?.length === 3)) failures.push('organization record: trilingual service offer catalog is incomplete');
  if (organization.member?.length !== 5 || !organization.member.every((person) => person['@type'] === 'Person' && person['@id']?.startsWith('https://hk.onyxdevslab.com/#person-') && person.name && person.jobTitle && person.url === `https://hk.onyxdevslab.com/en/about/#${person.name.toLowerCase()}` && person.worksFor?.['@id'] === 'https://hk.onyxdevslab.com/#organization')) failures.push('organization record: canonical team members or resolvable profile URLs are incomplete');
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

try {
  const githubSearch = JSON.parse(fs.readFileSync(path.join(dist, 'data/github-repository-search-baseline.json'), 'utf8'));
  if (githubSearch.schemaVersion !== 1 || githubSearch.queries?.find((item) => item.query === '"Hong Kong AI consulting" in:name,description,readme')?.totalCount !== 0 || githubSearch.followUpRetest?.previousTotalCount !== 0 || githubSearch.followUpRetest?.currentTotalCount !== 1 || githubSearch.followUpRetest?.triggerCommit !== 'c23932f' || githubSearch.followUpRetest?.firstPartyRepositoriesObserved?.[0] !== '0xHunterL/onyx-devs-lab.github.io' || githubSearch.buyerGuideFollowUpRetest?.previousTotalCount !== 1 || githubSearch.buyerGuideFollowUpRetest?.currentTotalCount !== 2 || githubSearch.buyerGuideFollowUpRetest?.triggerCommit !== '2c874a4' || githubSearch.buyerGuideFollowUpRetest?.firstPartyRepositoriesObserved?.join(',') !== '0xHunterL/onyx-devs-lab.github.io,mixuechu/hong-kong-enterprise-ai-buyers-guide' || githubSearch.buyerGuideFollowUpRetest?.buyerGuideValidation?.failures !== 0 || !githubSearch.meaning?.includes('does not prove public-web indexing')) failures.push('GitHub repository-search baseline: before-and-after result or evidence boundary is incomplete');
} catch {
  failures.push('GitHub repository-search baseline: invalid JSON');
}

try {
  const status = JSON.parse(fs.readFileSync(path.join(dist, 'data/ai-search-evidence-status.json'), 'utf8'));
  if (status.schemaVersion !== 2 || status.version !== currentMonitorEvidence.publicStatusVersion || status.observedAt !== currentMonitorEvidence.generatedAt) failures.push('AI-search evidence status: unexpected schema, version, or observation time');
  if (status.evidenceLevels?.[1]?.evidence?.verifiedOaiSearchBotDiscoveryFileVisits !== currentProviderEvidence.oaiSearchBotDiscoveryFileRequests) failures.push('AI-search evidence status: current OAI-SearchBot discovery count is stale');
  if (JSON.stringify(status.providerVerifiedCrawlerEvidence) !== JSON.stringify(currentProviderEvidence) || !['googlebotDiscoveryFileRequests','perplexityDiscoveryFileRequests','commonCrawlBotContentRequests','commonCrawlBotDiscoveryFileRequests'].every((key) => Object.hasOwn(status.providerVerifiedCrawlerEvidence || {}, key))) failures.push('AI-search evidence status: complete provider-verified crawler counters are missing or stale');
  if (JSON.stringify(status.crawlerEvidenceAccounting) !== JSON.stringify(currentMonitorEvidence.crawlerEvidenceAccounting) || status.crawlerEvidenceAccounting?.mode !== 'append-only-provider-verified-fingerprint-cumulative') failures.push('AI-search evidence status: verified crawler accounting method is missing or stale');
  if ('sameAs' in status || status.versionHistory?.length !== 4 || status.versionHistory?.[0]?.version !== '2026.09.12.50' || status.versionHistory?.[0]?.relation !== 'current-immutable-checkpoint' || status.versionHistory?.[0]?.url !== 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-50/ai-search-evidence-status.json' || status.versionHistory?.[1]?.version !== '2026.09.12.49' || status.versionHistory?.[1]?.relation !== 'previous-immutable-checkpoint' || status.versionHistory?.[2]?.version !== '2026.09.12.41' || status.versionHistory?.[2]?.relation !== 'earlier-immutable-checkpoint' || status.versionHistory?.[3]?.version !== '2026.09.11.8' || status.versionHistory?.[3]?.relation !== 'earlier-immutable-checkpoint' || !status.sourceBaseline?.endsWith('/docs/geo-baselines/2026-09-11-monitor-evidence.json')) failures.push('AI-search evidence status: current source and immutable version history are misleading or incomplete');
  if (!status.evidenceSources?.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-50') || !status.evidenceSources?.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-50/ai-search-evidence-status.json')) failures.push('AI-search evidence status: latest immutable monitor checkpoint is not discoverable');
  if (status.evidenceLevels?.[1]?.evidence?.verifiedBaiduspiderContentCrawls !== currentProviderEvidence.baiduspiderContentRequests || status.evidenceLevels?.[1]?.evidence?.verifiedBaiduspiderDiscoveryFileCrawls !== currentProviderEvidence.baiduspiderDiscoveryFileRequests || status.evidenceLevels?.[1]?.evidence?.verifiedApplebotContentCrawls !== currentProviderEvidence.applebotContentRequests || status.evidenceLevels?.[1]?.evidence?.verifiedApplebotDiscoveryFileCrawls !== currentProviderEvidence.applebotDiscoveryFileRequests || status.evidenceLevels?.[1]?.evidence?.verifiedYandexbotContentCrawls !== currentProviderEvidence.yandexbotContentRequests || status.evidenceLevels?.[1]?.evidence?.verifiedYandexbotDiscoveryFileCrawls !== currentProviderEvidence.yandexbotDiscoveryFileRequests || status.evidenceLevels?.[1]?.evidence?.verifiedAhrefsBotContentCrawls !== currentProviderEvidence.ahrefsbotContentRequests || status.evidenceLevels?.[1]?.evidence?.verifiedAhrefsBotDiscoveryFileCrawls !== currentProviderEvidence.ahrefsbotDiscoveryFileRequests) failures.push('AI-search evidence status: Baiduspider, Applebot, YandexBot, or AhrefsBot verified baseline is missing');
  if (status.publicSearchMonitoring?.bing?.status !== 'account-verification-required' || !status.publicSearchMonitoring?.bing?.restrictedPathExcluded?.includes('personal, non-commercial') || !status.evidenceSources?.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-search-monitoring-compliance-2026-09-11')) failures.push('AI-search evidence status: compliant Bing monitoring boundary is incomplete');
  if (JSON.stringify(status.offsiteChannelReadiness?.servicesHk) !== JSON.stringify(currentMonitorEvidence.servicesHkReadinessEvidence) || currentMonitorEvidence.servicesHkReadinessEvidence?.targetsChecked !== 3 || currentMonitorEvidence.servicesHkReadinessEvidence?.availableTargets !== 0) failures.push('AI-search evidence status: services.hk readiness baseline is missing or stale');
  if (status.testProtocol?.schemaVersion !== 3 || status.testProtocol?.promptCount !== 23 || status.testProtocol?.queryAliasesAdded?.join(',') !== 'AI 定开,AI定开' || !status.testProtocol?.protocolChange?.includes('all six published cases')) failures.push('AI-search evidence status: current prompt protocol or query-alias coverage is incomplete');
  if (status.evidenceLevels?.map((item) => item.id).join(',') !== 'accessible,crawled,retrieved-and-cited,non-brand-recommendation') failures.push('AI-search evidence status: four evidence levels are incomplete');
  if (status.evidenceLevels?.[0]?.status !== 'verified' || status.evidenceLevels?.[0]?.evidence?.canonicalUrlsChecked !== 71) failures.push('AI-search evidence status: accessibility evidence is incomplete');
  if (status.evidenceLevels?.[0]?.evidence?.markdownRepresentationsGenerated !== 71 || status.evidenceLevels?.[0]?.evidence?.markdownNegotiatedAtCanonicalUrl !== true || status.evidenceLevels?.[0]?.evidence?.contentSignals?.aiTrain !== 'unspecified') failures.push('AI-search evidence status: agent-readable representation evidence is incomplete');
  if (status.evidenceLevels?.[1]?.evidence?.verifiedGptBotContentCrawls !== currentProviderEvidence.gptBotContentRequests || status.evidenceLevels?.[1]?.evidence?.verifiedGptBotDiscoveryFileCrawls !== currentProviderEvidence.gptBotDiscoveryFileRequests || status.evidenceLevels?.[1]?.evidence?.verifiedDistinctContentPaths !== currentProviderEvidence.distinctVerifiedContentPaths || status.evidenceLevels?.[1]?.evidence?.verifiedOaiSearchBotDiscoveryFileVisits !== currentProviderEvidence.oaiSearchBotDiscoveryFileRequests || status.evidenceLevels?.[1]?.evidence?.verifiedOaiSearchBotContentCrawls !== currentProviderEvidence.oaiSearchBotContentRequests || status.evidenceLevels?.[1]?.evidence?.historicallyVerifiedBingbotContentCrawls !== currentProviderEvidence.bingbotContentRequests) failures.push('AI-search evidence status: crawler evidence is incomplete');
  if (JSON.stringify(status.evidenceLevels?.[1]?.evidence?.commonCrawlIndexObservation) !== JSON.stringify(currentCommonCrawlEvidence)) failures.push('AI-search evidence status: Common Crawl index observation is missing or stale');
  if (JSON.stringify(status.evidenceLevels?.[1]?.evidence?.waybackArchiveObservation) !== JSON.stringify(currentWaybackEvidence)) failures.push('AI-search evidence status: Wayback archive observation is missing or stale');
  if (status.evidenceLevels?.[1]?.evidence?.fixedPromptCoverage?.promptsWithAnyVerifiedCrawl !== currentPromptCoverage.promptsWithAnyVerifiedCrawl || status.evidenceLevels?.[1]?.evidence?.fixedPromptCoverage?.promptsFullyVerifiedCrawled !== currentPromptCoverage.promptsFullyVerifiedCrawled || status.evidenceLevels?.[1]?.evidence?.fixedPromptCoverage?.promptsWithAnySearchRelatedCrawl !== currentPromptCoverage.promptsWithAnySearchRelatedCrawl || status.evidenceLevels?.[1]?.evidence?.fixedPromptCoverage?.scenarioPromptsWithAnyVerifiedCrawl !== currentPromptCoverage.scenarioPromptsWithAnyVerifiedCrawl) failures.push('AI-search evidence status: fixed-prompt crawl coverage is incomplete');
  if (status.evidenceLevels?.[2]?.status !== 'not-verified' || status.evidenceLevels?.[3]?.status !== 'not-tested' || status.testProtocol?.doubaoPromptsSent !== false) failures.push('AI-search evidence status: negative evidence boundary is incomplete');
  if (JSON.stringify(status.evidenceLevels?.[2]?.evidence?.publicSearchObservation) !== JSON.stringify(currentPublicSearchRetest) || currentPublicSearchRetest.lowConfidenceEntityDirectoryResults?.length !== 1 || !currentPublicSearchRetest.lowConfidenceEntityDirectoryResults[0].treatment.includes('not accepted as an authoritative entity source')) failures.push('AI-search evidence status: public-search result quality boundary is missing or stale');
  if (currentPublicSearchRetest.nonBrandCategoryResultsObserved?.length !== 23 || !currentPublicSearchRetest.nonBrandCategoryResultsObserved.some((item) => item.url === 'https://www.fde.hk/zh-cn/products/enterprise-ai-diagnosis') || !currentPublicSearchRetest.nonBrandCategoryResultsObserved.some((item) => item.url === 'https://www.investhk.gov.hk/media/wvke34zz/202407-client-profiles-sc.pdf') || currentPublicSearchRetest.previousNonBrandCategoryObservation?.resultCount !== 12 || !currentPublicSearchRetest.nonBrandCategoryMeaning?.includes('not a complete ranking') || !currentPublicSearchRetest.nonBrandCategoryMeaning?.includes('does not establish a ranking trend')) failures.push('AI-search evidence status: non-brand category result baseline is missing or misleading');
  if (!status.evidenceBoundary?.includes('must not be inferred from a lower level')) failures.push('AI-search evidence status: inference boundary is missing');
  if (status.technicalReadiness?.score !== 86 || status.technicalReadiness?.passedChecks !== 6 || status.technicalReadiness?.notPassed?.[0]?.check !== 'DNS-AID') failures.push('AI-search evidence status: technical-readiness evidence is incomplete');
  if (status.publicSearchChecks?.length !== 4 || !status.publicSearchChecks.every((item) => item.checkedAt === currentPublicSearchRetest.testedAt && item.result.includes('observed')) || !status.publicSearchChecks.some((item) => item.query === '香港 企业 AI 咨询 公司 FDE' && item.result.includes('official-Onyx-result-not-observed'))) failures.push('AI-search evidence status: dated public-search checks are incomplete');
  if (JSON.stringify(status.platformSearchChecks?.githubRepository) !== JSON.stringify(currentMonitorEvidence.githubRepositorySearchEvidence) || status.platformSearchChecks?.githubRepository?.status !== 'available' || status.platformSearchChecks?.githubRepository?.queries?.find((item) => item.id === 'category')?.firstPartyRepositoriesObserved?.length !== 2 || !status.evidenceSources?.some((item) => item.url === 'https://hk.onyxdevslab.com/data/github-repository-search-baseline.json')) failures.push('AI-search evidence status: GitHub platform-search evidence or source is incomplete');
  if (!status.evidenceSources?.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-readiness-2026-09-10')) failures.push('AI-search evidence status: versioned readiness checkpoint is missing');
  if (!status.evidenceSources?.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-ai-rfp-template-2026-09-10')) failures.push('AI-search evidence status: versioned AI RFP checkpoint is missing');
  if (!status.evidenceSources?.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-referral-evidence-2026-09-10')) failures.push('AI-search evidence status: current crawler-and-referral checkpoint is missing');
  if (!status.evidenceSources?.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-referral-evidence-2026-09-10/2026-09-10-crawler-evidence.json')) failures.push('AI-search evidence status: versioned crawler-and-referral summary is missing');
  if (!status.evidenceSources?.some((item) => item.url === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-prompt-crawl-coverage-2026-09-10')) failures.push('AI-search evidence status: fixed-prompt crawl checkpoint is missing');
  if (status.evidenceLevels?.[1]?.evidence?.userAgentOnlyBytespiderContentCrawlCandidates !== currentUnverifiedCrawlerEvidence.bytespiderContentRequestCandidates || status.evidenceLevels?.[1]?.evidence?.userAgentOnlyBytespiderDiscoveryFileCandidates !== currentUnverifiedCrawlerEvidence.bytespiderDiscoveryFileRequestCandidates || status.evidenceLevels?.[1]?.evidence?.syntheticCrawlerReleaseChecksExcludedMinimum !== currentUnverifiedCrawlerEvidence.syntheticCrawlerReleaseChecksExcludedMinimum || 'syntheticBytespiderReleaseChecksExcluded' in (status.evidenceLevels?.[1]?.evidence || {}) || !status.evidenceLevels?.[1]?.limitations?.some((item) => item.includes('do not prove Doubao or ByteDance access')) || !status.evidenceLevels?.[1]?.limitations?.some((item) => item.includes('monotonic minimum'))) failures.push('AI-search evidence status: identity-unverified crawler and synthetic-check boundary is incomplete');
  if (status.evidenceLevels?.[3]?.evidence?.trackedAttributionRequests !== currentAttributionEvidence.trackedRequests || status.evidenceLevels?.[3]?.evidence?.suspectedAutomatedTrackedRequests !== currentAttributionEvidence.suspectedAutomatedRequests || status.evidenceLevels?.[3]?.evidence?.periodicRotatingClientTrackedRequests !== currentAttributionEvidence.periodicRotatingClientRequests || status.evidenceLevels?.[3]?.evidence?.humanUnverifiedTrackedRequests !== currentAttributionEvidence.visitorTypeUnverifiedRequests || status.evidenceLevels?.[3]?.evidence?.knownLinkScannerTrackedRequests !== currentAttributionEvidence.knownLinkScannerRequests || status.evidenceLevels?.[3]?.evidence?.knownLinkScannerNetworkRequests !== currentAttributionEvidence.knownLinkScannerNetworkRequests || status.evidenceLevels?.[3]?.evidence?.internallyInconsistentUserAgentRequests !== currentAttributionEvidence.internallyInconsistentUserAgentRequests || status.evidenceLevels?.[3]?.evidence?.malformedCampaignRequests !== currentAttributionEvidence.malformedCampaignRequestsExcluded || status.evidenceLevels?.[3]?.evidence?.realAiReferralVisitsObserved !== currentAttributionEvidence.aiReferrerAttributedRequests || status.evidenceLevels?.[3]?.evidence?.latestVerifiedOffsiteReferral?.referrerHost !== currentAttributionEvidence.latestVerifiedOffsiteReferral.referrerHost || status.evidenceLevels?.[3]?.evidence?.latestVisitorTypeUnverifiedAttributions?.length !== currentAttributionEvidence.latestVisitorTypeUnverifiedAttributions.length) failures.push('AI-search evidence status: referral evidence boundary is incomplete');
} catch {
  failures.push('AI-search evidence status: invalid JSON');
}

const robotsText = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
if (!/^Content-Signal:\s*search=yes,\s*ai-input=yes\s*$/im.test(robotsText)) failures.push('robots.txt: search and AI-input content signals are missing');
if (/^Content-Signal:.*ai-train=/im.test(robotsText)) failures.push('robots.txt: AI-training preference must remain unspecified unless explicitly approved');
for (const agent of ['CCBot', 'Claude-SearchBot', 'Claude-User', 'ClaudeBot', 'Googlebot', 'Google-Extended', 'Applebot', 'Applebot-Extended']) {
  if (!robotsText.includes(`User-agent: ${agent}`)) failures.push(`robots.txt: ${agent} policy is missing`);
}

const nginxConfig = fs.readFileSync(path.resolve('deploy/nginx-hk.conf'), 'utf8');
for (const resource of ['sitemap.xml', 'feed.xml', 'feed.json', 'data/enterprise-ai-service-terms.jsonld', 'data/ai-search-prompt-evidence-map.json', 'llms.txt']) {
  if (!nginxConfig.includes(`https://hk.onyxdevslab.com/${resource}`)) failures.push(`nginx: Link discovery header is missing ${resource}`);
}
for (const required of ['text/markdown', 'Vary "Accept"', 'Content-Signal "search=yes, ai-input=yes"', 'https://pubsubhubbub.appspot.com/', 'rel="hub"', 'rel="self"']) {
  if (!nginxConfig.includes(required)) failures.push(`nginx: Markdown negotiation is missing ${required}`);
}
if (!nginxConfig.includes('application/feed+json json')) failures.push('nginx: JSON Feed MIME mapping is missing');
if (!nginxConfig.includes('application/ld+json jsonld')) failures.push('nginx: JSON-LD MIME mapping is missing');

const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const currentLastmods = [...sitemap.matchAll(/<lastmod>2026-09-(?:11|12)<\/lastmod>/g)];
if (currentLastmods.length !== urls.length) failures.push(`sitemap: expected ${urls.length} current page lastmods, got ${currentLastmods.length}`);
for (const pathname of ['/en/methodology/ai-search-verification/', '/zh-hk/methodology/ai-search-verification/', '/zh-cn/methodology/ai-search-verification/', '/en/about/', '/zh-hk/about/', '/zh-cn/about/']) {
  if (!sitemap.includes(`<loc>https://hk.onyxdevslab.com${pathname}</loc><lastmod>2026-09-12</lastmod>`)) failures.push(`${pathname}: sitemap lastmod does not reflect the substantive evidence update`);
  const html = fs.readFileSync(path.join(dist, pathname, 'index.html'), 'utf8');
  if ((html.match(/"dateModified":"2026-09-12"/g) || []).length < 2) failures.push(`${pathname}: Article and WebPage dateModified are stale`);
}
if (!machineDiscoveryFiles['feed.xml'].includes('<updated>2026-09-12T00:00:00+08:00</updated>')) failures.push('feed.xml: feed update date is stale');
if (!machineDiscoveryFiles['feed.xml'].includes('<link href="https://hk.onyxdevslab.com/feed.xml" rel="self"/>') || !machineDiscoveryFiles['feed.xml'].includes('<link href="https://pubsubhubbub.appspot.com/" rel="hub"/>')) failures.push('feed.xml: WebSub self or hub discovery is missing');
if (!machineDiscoveryFiles['feed.xml'].includes(`<id>https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-readiness-2026-09-10</id><link href="https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-readiness-2026-09-10"/><updated>2026-09-10T00:00:00+08:00</updated>`)) failures.push('feed.xml: readiness checkpoint entry date is stale');
if (!machineDiscoveryFiles['feed.xml'].includes(`<id>https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-ai-rfp-template-2026-09-10</id><link href="https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-ai-rfp-template-2026-09-10"/><updated>2026-09-10T00:00:00+08:00</updated>`)) failures.push('feed.xml: AI RFP checkpoint entry date is stale');
if (!machineDiscoveryFiles['feed.xml'].includes(`<id>https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-referral-evidence-2026-09-10</id><link href="https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-referral-evidence-2026-09-10"/><updated>2026-09-10T00:00:00+08:00</updated>`)) failures.push('feed.xml: crawler-and-referral evidence checkpoint entry date is stale');
if (!machineDiscoveryFiles['feed.xml'].includes(`<id>https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-50</id><link href="https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-50"/><updated>2026-09-12T00:00:00+08:00</updated>`)) failures.push('feed.xml: automated monitor evidence checkpoint entry date is stale');
if (!machineDiscoveryFiles['feed.xml'].includes(`<id>https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-prompt-crawl-coverage-2026-09-10</id><link href="https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-prompt-crawl-coverage-2026-09-10"/><updated>2026-09-10T00:00:00+08:00</updated>`)) failures.push('feed.xml: fixed-prompt crawl coverage checkpoint entry date is stale');
for (const url of urls) {
  const pathname = new URL(url).pathname;
  const target = pathname === '/' ? path.join(dist, 'index.html') : path.join(dist, pathname, 'index.html');
  const expectedModified = pathname.includes('/methodology/ai-search-verification/') || pathname.endsWith('/about/') ? '2026-09-12' : '2026-09-11';
  if (!sitemap.includes(`<loc>${url}</loc><lastmod>${expectedModified}</lastmod>`)) failures.push(`${pathname}: sitemap lastmod is not scoped to the actual page update`);
  if (!fs.existsSync(target)) failures.push(`sitemap target missing: ${pathname}`);
  if (pathname !== '/' && fs.existsSync(target)) {
    const html = fs.readFileSync(target, 'utf8');
    if (!html.includes('"@type":"WebPage"') || !html.includes(`"dateModified":"${expectedModified}"`)) failures.push(`${pathname}: WebPage freshness is stale`);
  }
}

const incomingLinks = new Map(urls.map((url) => [url, new Set()]));
for (const file of htmlFiles) {
  const html = normalizeHtmlForChecks(fs.readFileSync(file, 'utf8'));
  const source = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!source) continue;
  if (!html.includes('type="application/feed+json"') || !html.includes('href="https://hk.onyxdevslab.com/feed.json"')) failures.push(`${path.relative(dist, file)}: JSON Feed discovery link is missing`);
  if (!html.includes('rel="describedby" type="application/ld+json"') || !html.includes('href="https://hk.onyxdevslab.com/data/enterprise-ai-service-terms.jsonld"')) failures.push(`${path.relative(dist, file)}: service term graph discovery link is missing`);
  if (!html.includes('rel="describedby" type="application/json"') || !html.includes('href="https://hk.onyxdevslab.com/data/ai-search-prompt-evidence-map.json"')) failures.push(`${path.relative(dist, file)}: prompt evidence map discovery link is missing`);
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

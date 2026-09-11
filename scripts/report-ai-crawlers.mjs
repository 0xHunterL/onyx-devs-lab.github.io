import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { verifyDnsIp } from './dns-crawler-verification.mjs';
import { resolveLogPaths } from './resolve-log-paths.mjs';
import { buildUserAgentOnlyCrawlerEvidenceObservations, buildVerifiedCrawlerEvidenceObservations } from './crawler-evidence-observations.mjs';
import { applyPublishedPrefixVerification, fetchPublishedIpPrefixes } from './published-prefix-verification.mjs';
import { selectTrustedClientIp } from './trusted-client-ip.mjs';

const crawlerFamilies = [
  ['Bytespider', /Bytespider/i],
  ['Baiduspider', /Baiduspider/i],
  ['CCBot', /CCBot/i],
  ['Bingbot', /bingbot/i],
  ['OAI-SearchBot', /OAI-SearchBot/i],
  ['GPTBot', /GPTBot/i],
  ['PerplexityBot', /PerplexityBot/i],
  ['Perplexity-User', /Perplexity-User/i],
  ['Claude-SearchBot', /Claude-SearchBot/i],
  ['Claude-User', /Claude-User/i],
  ['ClaudeBot', /ClaudeBot/i],
  ['Applebot', /Applebot/i],
  ['Googlebot', /Googlebot/i],
  ['YandexBot', /YandexBot/i],
  ['AhrefsBot', /AhrefsBot/i],
];

const suspiciousPath = /(?:^|\/)(?:\.env(?:\.|$)|\.git(?:\/|$)|wp-admin|wp-login|phpmyadmin|server-status|actuator|cgi-bin)|(?:passwd|shadow|id_rsa|authorized_keys|credentials?|secrets?|backup\.sql|169\.254\.169\.254)/i;
const pagePath = /^(?:\/$|\/(?:en|zh-hk|zh-cn)(?:\/|$))/i;
const discoveryPath = /^\/(?:robots\.txt|sitemap\.xml|llms(?:-full)?\.txt|feed\.(?:xml|json)|CITATION\.cff|codemeta\.json|data\/[^/]+\.json(?:ld)?)$/i;
const staticAsset = /\.(?:css|js|map|png|jpe?g|gif|svg|webp|ico|woff2?|ttf)(?:\?|$)/i;
// Two exact, operator-initiated diagnostics were sent without the normal
// Onyx-GEO-Release-Check suffix while investigating a transient live-gate
// timeout. Preserve the log records, but never promote them to Bytespider
// candidates. The key intentionally omits client addresses from source.
const auditedSyntheticChecks = new Set([
  '2026-09-11T15:35:27+00:00\u0000GET\u0000/zh-cn/ai-consulting/\u0000Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)',
  '2026-09-11T15:35:35+00:00\u0000GET\u0000/zh-cn/ai-consulting/\u0000Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)',
]);

function parseCombinedLog(line) {
  const match = line.match(/^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)]\s+"(\S+)\s+([^\s"]+)(?:\s+HTTP\/[^\"]+)?"\s+(\d{3})\s+(\S+)(?:\s+"([^"]*)"\s+"([^"]*)")?/);
  if (!match) return null;
  return {
    ip: match[1],
    time: match[2],
    method: match[3],
    path: match[4],
    status: Number(match[5]),
    userAgent: match[8] || '',
  };
}

function parseGeoJsonLog(line) {
  if (!line.startsWith('{')) return null;
  try {
    const entry = JSON.parse(line);
    if (!entry.path || !entry.status) return null;
    const proxyIp = entry.proxyIp || '';
    const selected = selectTrustedClientIp(entry.clientIp || '', proxyIp);
    return {
      ip: selected.ip,
      proxyIp,
      trustedProxy: selected.trustedProxy,
      time: entry.time,
      method: entry.method,
      path: entry.path,
      status: Number(entry.status),
      userAgent: entry.userAgent || '',
    };
  } catch {
    return null;
  }
}

function classify(entry) {
  const family = crawlerFamilies.find(([, pattern]) => pattern.test(entry.userAgent))?.[0];
  if (!family) return null;
  const pathOnly = entry.path.split('?')[0];
  const suspicious = suspiciousPath.test(pathOnly);
  const successful = entry.status >= 200 && entry.status < 400;
  const relevantPage = pagePath.test(pathOnly) && !staticAsset.test(pathOnly);
  const discoveryFile = discoveryPath.test(pathOnly);
  const auditKey = [entry.time, entry.method?.toUpperCase(), entry.path, entry.userAgent].join('\u0000');
  const syntheticCheck = /Onyx-GEO-Release-Check/i.test(entry.userAgent) || auditedSyntheticChecks.has(auditKey);
  const retrievesRepresentation = entry.method?.toUpperCase() === 'GET';
  return {
    ...entry,
    family,
    classification: syntheticCheck
      ? 'synthetic-release-check'
      : suspicious
      ? 'suspicious-spoof-or-scan'
      : !retrievesRepresentation
        ? 'non-content-request-method'
      : successful && relevantPage
        ? 'candidate-page-crawl'
        : successful && discoveryFile
          ? 'candidate-discovery-file-crawl'
        : 'other-candidate-request',
  };
}

function parseNginxTime(value) {
  if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return Date.parse(value);
  const match = value.match(/^(\d{2})\/([A-Z][a-z]{2})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}) ([+-]\d{2})(\d{2})$/);
  if (!match) return Number.NaN;
  const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const offsetMinutes = Number(match[7]) * 60 + Math.sign(Number(match[7])) * Number(match[8]);
  return Date.UTC(Number(match[3]), months[match[2]], Number(match[1]), Number(match[4]), Number(match[5]), Number(match[6])) - offsetMinutes * 60_000;
}

async function load(path) {
  const data = await readFile(path);
  return path.endsWith('.gz') ? gunzipSync(data).toString('utf8') : data.toString('utf8');
}

const args = process.argv.slice(2);
const sinceArg = args.find((arg) => arg.startsWith('--since='));
const verifyOpenAi = args.includes('--verify-openai');
const verifyBing = args.includes('--verify-bing');
const verifyBaidu = args.includes('--verify-baidu');
const verifyGoogle = args.includes('--verify-google');
const verifyPerplexity = args.includes('--verify-perplexity');
const verifyCommonCrawl = args.includes('--verify-common-crawl');
const verifyApple = args.includes('--verify-apple');
const verifyYandex = args.includes('--verify-yandex');
const verifyAhrefs = args.includes('--verify-ahrefs');
const includeRotated = args.includes('--include-rotated');
const since = sinceArg ? Date.parse(`${sinceArg.slice('--since='.length)}T00:00:00Z`) : null;
if (sinceArg && Number.isNaN(since)) {
  console.error('Invalid --since date. Use --since=YYYY-MM-DD.');
  process.exit(2);
}
const verificationFlags = ['--verify-openai', '--verify-bing', '--verify-baidu', '--verify-google', '--verify-perplexity', '--verify-common-crawl', '--verify-apple', '--verify-yandex', '--verify-ahrefs', '--include-rotated'];
const inputPaths = args.filter((arg) => !arg.startsWith('--since=') && !verificationFlags.includes(arg));
const paths = await resolveLogPaths(inputPaths, includeRotated);
if (!paths.length) {
  console.error('Usage: npm run geo:crawler-report -- [--since=YYYY-MM-DD] [--include-rotated] [--verify-openai] [--verify-bing] [--verify-baidu] [--verify-google] [--verify-perplexity] [--verify-common-crawl] [--verify-apple] [--verify-yandex] [--verify-ahrefs] /var/log/nginx/access.log [/var/log/nginx/access.log.1.gz ...]');
  process.exit(2);
}

const events = [];
const verificationSources = {};
let unparsableLines = 0;
for (const path of paths) {
  const body = await load(path);
  for (const line of body.split(/\r?\n/)) {
    if (!line) continue;
    const parsed = parseGeoJsonLog(line) || parseCombinedLog(line);
    if (!parsed) {
      unparsableLines += 1;
      continue;
    }
    if (since && parseNginxTime(parsed.time) < since) continue;
    const event = classify(parsed);
    if (event) events.push({ source: path, ...event });
  }
}

if (verifyOpenAi) {
  const [gptBotSource, searchBotSource] = await Promise.all([
    fetchPublishedIpPrefixes('https://openai.com/gptbot.json'),
    fetchPublishedIpPrefixes('https://openai.com/searchbot.json'),
  ]);
  verificationSources.gptBot = gptBotSource;
  verificationSources.oaiSearchBot = searchBotSource;
  applyPublishedPrefixVerification(events, 'GPTBot', gptBotSource, 'official-openai-ip-range');
  applyPublishedPrefixVerification(events, 'OAI-SearchBot', searchBotSource, 'official-openai-ip-range');
}

if (verifyPerplexity) {
  const [botSource, userSource] = await Promise.all([
    fetchPublishedIpPrefixes('https://www.perplexity.com/perplexitybot.json'),
    fetchPublishedIpPrefixes('https://www.perplexity.com/perplexity-user.json'),
  ]);
  verificationSources.perplexityBot = botSource;
  verificationSources.perplexityUser = userSource;
  applyPublishedPrefixVerification(events, 'PerplexityBot', botSource, 'official-perplexity-ip-range');
  applyPublishedPrefixVerification(events, 'Perplexity-User', userSource, 'official-perplexity-ip-range');
}

if (verifyCommonCrawl) {
  const source = await fetchPublishedIpPrefixes('https://index.commoncrawl.org/ccbot.json');
  verificationSources.commonCrawlBot = source;
  applyPublishedPrefixVerification(events, 'CCBot', source, 'official-common-crawl-ip-range');
}

if (verifyApple) {
  const source = await fetchPublishedIpPrefixes('https://search.developer.apple.com/applebot.json');
  verificationSources.appleBot = source;
  applyPublishedPrefixVerification(events, 'Applebot', source, 'official-applebot-ip-range');
}

if (verifyAhrefs) {
  const source = await fetchPublishedIpPrefixes('https://api.ahrefs.com/v3/public/crawler-ip-ranges');
  verificationSources.ahrefsBot = source;
  applyPublishedPrefixVerification(events, 'AhrefsBot', source, 'official-ahrefs-ip-range');
}

if (verifyBing) {
  const bingIps = [...new Set(events.filter((event) => event.family === 'Bingbot').map((event) => event.ip))];
  const bingVerifications = new Map(
    await Promise.all(bingIps.map(async (ip) => [ip, await verifyDnsIp(ip, ['.search.msn.com'])])),
  );
  for (const event of events) {
    if (event.family !== 'Bingbot') continue;
    const verification = bingVerifications.get(event.ip);
    event.providerVerified = verification.verified;
    event.providerVerification = { method: 'reverse-and-forward-dns', ...verification };
  }
}

if (verifyBaidu) {
  const baiduIps = [...new Set(events.filter((event) => event.family === 'Baiduspider').map((event) => event.ip))];
  const baiduVerifications = new Map(
    await Promise.all(baiduIps.map(async (ip) => [ip, await verifyDnsIp(ip, ['.baidu.com', '.baidu.jp'])])),
  );
  for (const event of events) {
    if (event.family !== 'Baiduspider') continue;
    const verification = baiduVerifications.get(event.ip);
    event.providerVerified = verification.verified;
    event.providerVerification = {
      method: 'official-reverse-dns-suffix-plus-forward-confirmation',
      allowedReverseDnsSuffixes: ['.baidu.com', '.baidu.jp'],
      ...verification,
    };
  }
}

if (verifyGoogle) {
  const googleIps = [...new Set(events.filter((event) => event.family === 'Googlebot').map((event) => event.ip))];
  const googleVerifications = new Map(
    await Promise.all(googleIps.map(async (ip) => [ip, await verifyDnsIp(ip, ['.googlebot.com'])])),
  );
  for (const event of events) {
    if (event.family !== 'Googlebot') continue;
    const verification = googleVerifications.get(event.ip);
    event.providerVerified = verification.verified;
    event.providerVerification = { method: 'reverse-and-forward-dns', ...verification };
  }
}

if (verifyYandex) {
  const yandexIps = [...new Set(events.filter((event) => event.family === 'YandexBot').map((event) => event.ip))];
  const yandexVerifications = new Map(
    await Promise.all(yandexIps.map(async (ip) => [ip, await verifyDnsIp(ip, ['.yandex.ru', '.yandex.net', '.yandex.com'])])),
  );
  for (const event of events) {
    if (event.family !== 'YandexBot') continue;
    const verification = yandexVerifications.get(event.ip);
    event.providerVerified = verification.verified;
    event.providerVerification = {
      method: 'official-reverse-dns-suffix-plus-forward-confirmation',
      allowedReverseDnsSuffixes: ['.yandex.ru', '.yandex.net', '.yandex.com'],
      ...verification,
    };
  }
}

const byFamily = {};
const byClassification = {};
for (const event of events) {
  byFamily[event.family] = (byFamily[event.family] || 0) + 1;
  byClassification[event.classification] = (byClassification[event.classification] || 0) + 1;
}

events.sort((a, b) => parseNginxTime(a.time) - parseNginxTime(b.time));
const pageCandidates = events.filter((event) => event.classification === 'candidate-page-crawl');
const discoveryCandidates = events.filter((event) => event.classification === 'candidate-discovery-file-crawl');
const suspiciousCandidates = events.filter((event) => event.classification === 'suspicious-spoof-or-scan');
const syntheticChecks = events.filter((event) => event.classification === 'synthetic-release-check');
const nonContentMethodRequests = events.filter((event) => event.classification === 'non-content-request-method');
const userAgentOnlyBytespiderPages = pageCandidates.filter((event) => event.family === 'Bytespider');
const userAgentOnlyBytespiderDiscoveryFiles = discoveryCandidates.filter((event) => event.family === 'Bytespider');
const verifiedOpenAiPages = pageCandidates.filter(
  (event) => ['GPTBot', 'OAI-SearchBot'].includes(event.family) && event.providerVerified === true,
);
const verifiedGptBotPages = verifiedOpenAiPages.filter((event) => event.family === 'GPTBot');
const verifiedOaiSearchBotPages = verifiedOpenAiPages.filter((event) => event.family === 'OAI-SearchBot');
const verifiedBingPages = pageCandidates.filter((event) => event.family === 'Bingbot' && event.providerVerified === true);
const verifiedBaiduPages = pageCandidates.filter((event) => event.family === 'Baiduspider' && event.providerVerified === true);
const verifiedGooglePages = pageCandidates.filter((event) => event.family === 'Googlebot' && event.providerVerified === true);
const verifiedPerplexityPages = pageCandidates.filter(
  (event) => ['PerplexityBot', 'Perplexity-User'].includes(event.family) && event.providerVerified === true,
);
const verifiedCommonCrawlPages = pageCandidates.filter((event) => event.family === 'CCBot' && event.providerVerified === true);
const verifiedApplePages = pageCandidates.filter((event) => event.family === 'Applebot' && event.providerVerified === true);
const verifiedYandexPages = pageCandidates.filter((event) => event.family === 'YandexBot' && event.providerVerified === true);
const verifiedAhrefsPages = pageCandidates.filter((event) => event.family === 'AhrefsBot' && event.providerVerified === true);
const verifiedOpenAiDiscoveryFiles = discoveryCandidates.filter(
  (event) => ['GPTBot', 'OAI-SearchBot'].includes(event.family) && event.providerVerified === true,
);
const verifiedGptBotDiscoveryFiles = verifiedOpenAiDiscoveryFiles.filter((event) => event.family === 'GPTBot');
const verifiedOaiSearchBotDiscoveryFiles = verifiedOpenAiDiscoveryFiles.filter(
  (event) => event.family === 'OAI-SearchBot',
);
const verifiedBingDiscoveryFiles = discoveryCandidates.filter(
  (event) => event.family === 'Bingbot' && event.providerVerified === true,
);
const verifiedBaiduDiscoveryFiles = discoveryCandidates.filter(
  (event) => event.family === 'Baiduspider' && event.providerVerified === true,
);
const verifiedGoogleDiscoveryFiles = discoveryCandidates.filter(
  (event) => event.family === 'Googlebot' && event.providerVerified === true,
);
const verifiedPerplexityDiscoveryFiles = discoveryCandidates.filter(
  (event) => ['PerplexityBot', 'Perplexity-User'].includes(event.family) && event.providerVerified === true,
);
const verifiedCommonCrawlDiscoveryFiles = discoveryCandidates.filter((event) => event.family === 'CCBot' && event.providerVerified === true);
const verifiedAppleDiscoveryFiles = discoveryCandidates.filter((event) => event.family === 'Applebot' && event.providerVerified === true);
const verifiedYandexDiscoveryFiles = discoveryCandidates.filter((event) => event.family === 'YandexBot' && event.providerVerified === true);
const verifiedAhrefsDiscoveryFiles = discoveryCandidates.filter((event) => event.family === 'AhrefsBot' && event.providerVerified === true);
const dnsVerificationUnavailablePages = pageCandidates.filter(
  (event) => event.providerVerification?.verificationUnavailable === true,
);
const dnsVerificationUnavailableDiscoveryFiles = discoveryCandidates.filter(
  (event) => event.providerVerification?.verificationUnavailable === true,
);
const verifiedContentPathMap = new Map();
for (const event of [
  ...verifiedOpenAiPages,
  ...verifiedBingPages,
  ...verifiedBaiduPages,
  ...verifiedGooglePages,
  ...verifiedPerplexityPages,
  ...verifiedCommonCrawlPages,
  ...verifiedApplePages,
  ...verifiedYandexPages,
  ...verifiedAhrefsPages,
]) {
  const pathOnly = event.path.split('?')[0];
  const current = verifiedContentPathMap.get(pathOnly) || {
    path: pathOnly,
    families: new Set(),
    firstSeen: event.time,
    lastSeen: event.time,
    requests: 0,
  };
  current.families.add(event.family);
  current.firstSeen = current.firstSeen < event.time ? current.firstSeen : event.time;
  current.lastSeen = current.lastSeen > event.time ? current.lastSeen : event.time;
  current.requests += 1;
  verifiedContentPathMap.set(pathOnly, current);
}
const verifiedContentPathCoverage = [...verifiedContentPathMap.values()]
  .map((entry) => ({ ...entry, families: [...entry.families].sort() }))
  .sort((a, b) => a.path.localeCompare(b.path));
const verifiedEvidenceObservations = buildVerifiedCrawlerEvidenceObservations({
  pages: {
    openAi: verifiedOpenAiPages,
    bing: verifiedBingPages,
    baidu: verifiedBaiduPages,
    google: verifiedGooglePages,
    perplexity: verifiedPerplexityPages,
    commonCrawl: verifiedCommonCrawlPages,
    apple: verifiedApplePages,
    yandex: verifiedYandexPages,
    ahrefs: verifiedAhrefsPages,
  },
  discoveryFiles: {
    openAi: verifiedOpenAiDiscoveryFiles,
    bing: verifiedBingDiscoveryFiles,
    baidu: verifiedBaiduDiscoveryFiles,
    google: verifiedGoogleDiscoveryFiles,
    perplexity: verifiedPerplexityDiscoveryFiles,
    commonCrawl: verifiedCommonCrawlDiscoveryFiles,
    apple: verifiedAppleDiscoveryFiles,
    yandex: verifiedYandexDiscoveryFiles,
    ahrefs: verifiedAhrefsDiscoveryFiles,
  },
});
const userAgentOnlyEvidenceObservations = buildUserAgentOnlyCrawlerEvidenceObservations([
  ...userAgentOnlyBytespiderPages,
  ...userAgentOnlyBytespiderDiscoveryFiles,
]);

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  caveat: 'User-Agent strings are self-declared. Only successful GET requests can be classified as candidate page or discovery-file crawls; HEAD and other methods do not retrieve the representation and are kept as non-content request observations. Candidate content crawls do not prove platform identity unless providerVerified is true under an enabled provider verification method. Bytespider page and discovery requests are exposed separately as user-agent-only, identity-unverified observations after synthetic release checks are excluded; they do not prove Doubao or ByteDance access. A null providerVerified value with verificationUnavailable means the required DNS or published-prefix source was unavailable, so identity could not be tested and must not be reported as failed. GPTBot is reported separately from OAI-SearchBot because a verified training crawl is not evidence of search indexing or citation. AhrefsBot is reported as a provider-verified external discovery crawler; because it serves both Ahrefs and Yep, a request does not by itself prove Yep indexing, ranking, retrieval, or citation.',
  files: paths,
  since: sinceArg ? sinceArg.slice('--since='.length) : null,
  verifyOpenAi,
  verifyBing,
  verifyBaidu,
  verifyGoogle,
  verifyPerplexity,
  verifyCommonCrawl,
  verifyApple,
  verifyYandex,
  verifyAhrefs,
  includeRotated,
  verificationSources: Object.fromEntries(Object.entries(verificationSources).map(([id, source]) => [id, {
    url: source.url,
    status: source.status,
    httpStatus: source.httpStatus,
    attempts: source.attempts,
    prefixCount: source.prefixCount,
    reason: source.reason || null,
  }])),
  totals: {
    candidateCrawlerRequests: events.length,
    candidatePageCrawls: pageCandidates.length,
    candidateDiscoveryFileCrawls: discoveryCandidates.length,
    suspiciousSpoofOrScanRequests: suspiciousCandidates.length,
    syntheticReleaseChecks: syntheticChecks.length,
    nonContentMethodRequests: nonContentMethodRequests.length,
    userAgentOnlyBytespiderPageCrawls: userAgentOnlyBytespiderPages.length,
    userAgentOnlyBytespiderDiscoveryFileCrawls: userAgentOnlyBytespiderDiscoveryFiles.length,
    verifiedOpenAiPageCrawls: verifiedOpenAiPages.length,
    verifiedGptBotPageCrawls: verifiedGptBotPages.length,
    verifiedOaiSearchBotPageCrawls: verifiedOaiSearchBotPages.length,
    verifiedBingPageCrawls: verifiedBingPages.length,
    verifiedBaiduPageCrawls: verifiedBaiduPages.length,
    verifiedGooglePageCrawls: verifiedGooglePages.length,
    verifiedPerplexityPageCrawls: verifiedPerplexityPages.length,
    verifiedCommonCrawlPageCrawls: verifiedCommonCrawlPages.length,
    verifiedApplePageCrawls: verifiedApplePages.length,
    verifiedYandexPageCrawls: verifiedYandexPages.length,
    verifiedAhrefsPageCrawls: verifiedAhrefsPages.length,
    verifiedOpenAiDiscoveryFileCrawls: verifiedOpenAiDiscoveryFiles.length,
    verifiedGptBotDiscoveryFileCrawls: verifiedGptBotDiscoveryFiles.length,
    verifiedOaiSearchBotDiscoveryFileCrawls: verifiedOaiSearchBotDiscoveryFiles.length,
    verifiedBingDiscoveryFileCrawls: verifiedBingDiscoveryFiles.length,
    verifiedBaiduDiscoveryFileCrawls: verifiedBaiduDiscoveryFiles.length,
    verifiedGoogleDiscoveryFileCrawls: verifiedGoogleDiscoveryFiles.length,
    verifiedPerplexityDiscoveryFileCrawls: verifiedPerplexityDiscoveryFiles.length,
    verifiedCommonCrawlDiscoveryFileCrawls: verifiedCommonCrawlDiscoveryFiles.length,
    verifiedAppleDiscoveryFileCrawls: verifiedAppleDiscoveryFiles.length,
    verifiedYandexDiscoveryFileCrawls: verifiedYandexDiscoveryFiles.length,
    verifiedAhrefsDiscoveryFileCrawls: verifiedAhrefsDiscoveryFiles.length,
    dnsVerificationUnavailablePageCrawls: dnsVerificationUnavailablePages.length,
    dnsVerificationUnavailableDiscoveryFileCrawls: dnsVerificationUnavailableDiscoveryFiles.length,
    unparsableLines,
  },
  byFamily,
  byClassification,
  verifiedContentPathCoverage,
  verifiedEvidenceObservations,
  userAgentOnlyEvidenceObservations,
  recentCandidatePageCrawls: pageCandidates.slice(-50),
  recentCandidateDiscoveryFileCrawls: discoveryCandidates.slice(-30),
  recentVerifiedOpenAiPageCrawls: verifiedOpenAiPages.slice(-50),
  recentVerifiedGptBotPageCrawls: verifiedGptBotPages.slice(-50),
  recentVerifiedOaiSearchBotPageCrawls: verifiedOaiSearchBotPages.slice(-50),
  recentVerifiedBingPageCrawls: verifiedBingPages.slice(-50),
  recentVerifiedBaiduPageCrawls: verifiedBaiduPages.slice(-50),
  recentVerifiedGooglePageCrawls: verifiedGooglePages.slice(-50),
  recentVerifiedPerplexityPageCrawls: verifiedPerplexityPages.slice(-50),
  recentVerifiedCommonCrawlPageCrawls: verifiedCommonCrawlPages.slice(-50),
  recentVerifiedApplePageCrawls: verifiedApplePages.slice(-50),
  recentVerifiedYandexPageCrawls: verifiedYandexPages.slice(-50),
  recentVerifiedAhrefsPageCrawls: verifiedAhrefsPages.slice(-50),
  recentVerifiedOpenAiDiscoveryFileCrawls: verifiedOpenAiDiscoveryFiles.slice(-30),
  recentVerifiedGptBotDiscoveryFileCrawls: verifiedGptBotDiscoveryFiles.slice(-30),
  recentVerifiedOaiSearchBotDiscoveryFileCrawls: verifiedOaiSearchBotDiscoveryFiles.slice(-30),
  recentVerifiedBingDiscoveryFileCrawls: verifiedBingDiscoveryFiles.slice(-30),
  recentVerifiedBaiduDiscoveryFileCrawls: verifiedBaiduDiscoveryFiles.slice(-30),
  recentVerifiedGoogleDiscoveryFileCrawls: verifiedGoogleDiscoveryFiles.slice(-30),
  recentVerifiedPerplexityDiscoveryFileCrawls: verifiedPerplexityDiscoveryFiles.slice(-30),
  recentVerifiedCommonCrawlDiscoveryFileCrawls: verifiedCommonCrawlDiscoveryFiles.slice(-30),
  recentVerifiedAppleDiscoveryFileCrawls: verifiedAppleDiscoveryFiles.slice(-30),
  recentVerifiedYandexDiscoveryFileCrawls: verifiedYandexDiscoveryFiles.slice(-30),
  recentVerifiedAhrefsDiscoveryFileCrawls: verifiedAhrefsDiscoveryFiles.slice(-30),
  recentDnsVerificationUnavailablePageCrawls: dnsVerificationUnavailablePages.slice(-50),
  recentDnsVerificationUnavailableDiscoveryFileCrawls: dnsVerificationUnavailableDiscoveryFiles.slice(-30),
  recentSuspiciousRequests: suspiciousCandidates.slice(-20),
}, null, 2));

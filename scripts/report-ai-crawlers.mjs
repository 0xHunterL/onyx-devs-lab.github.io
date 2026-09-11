import { readFile } from 'node:fs/promises';
import { lookup, reverse } from 'node:dns/promises';
import { gunzipSync } from 'node:zlib';
import { resolveLogPaths } from './resolve-log-paths.mjs';
import { buildUserAgentOnlyCrawlerEvidenceObservations, buildVerifiedCrawlerEvidenceObservations } from './crawler-evidence-observations.mjs';
import { isInIpPrefix } from './ip-prefix.mjs';
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
];

const suspiciousPath = /(?:^|\/)(?:\.env(?:\.|$)|\.git(?:\/|$)|wp-admin|wp-login|phpmyadmin|server-status|actuator|cgi-bin)|(?:passwd|shadow|id_rsa|authorized_keys|credentials?|secrets?|backup\.sql|169\.254\.169\.254)/i;
const pagePath = /^(?:\/$|\/(?:en|zh-hk|zh-cn)(?:\/|$))/i;
const discoveryPath = /^\/(?:robots\.txt|sitemap\.xml|llms(?:-full)?\.txt|feed\.(?:xml|json)|CITATION\.cff|codemeta\.json|data\/[^/]+\.json(?:ld)?)$/i;
const staticAsset = /\.(?:css|js|map|png|jpe?g|gif|svg|webp|ico|woff2?|ttf)(?:\?|$)/i;

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
  const syntheticCheck = /Onyx-GEO-Release-Check/i.test(entry.userAgent);
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

function normalizeIp(ip) {
  return ip.toLowerCase().replace(/^::ffff:/, '');
}

async function verifyDnsIp(ip, allowedSuffixes) {
  try {
    const hostnames = await reverse(ip);
    const providerHostnames = hostnames
      .map((hostname) => hostname.toLowerCase().replace(/\.$/, ''))
      .filter((hostname) => allowedSuffixes.some((suffix) => hostname.endsWith(suffix)));
    if (!providerHostnames.length) {
      return { verified: false, hostnames, reason: 'reverse-dns-provider-domain-mismatch' };
    }

    const forwardResults = await Promise.all(
      providerHostnames.map(async (hostname) => ({
        hostname,
        addresses: (await lookup(hostname, { all: true, verbatim: true })).map((result) => result.address),
      })),
    );
    const normalizedIp = normalizeIp(ip);
    const forwardAddresses = [...new Set(forwardResults.flatMap((result) => result.addresses))];
    const benchmarkAddresses = forwardAddresses.filter((address) => isInIpPrefix(normalizeIp(address), '198.18.0.0/15'));
    if (forwardAddresses.length && benchmarkAddresses.length === forwardAddresses.length) {
      return {
        verified: null,
        verificationUnavailable: true,
        hostnames: providerHostnames,
        forwardAddresses,
        reason: 'forward-dns-returned-rfc2544-benchmark-address',
      };
    }
    const verified = forwardResults.some((result) =>
      result.addresses.some((address) => normalizeIp(address) === normalizedIp),
    );
    return {
      verified,
      hostnames: providerHostnames,
      forwardAddresses,
      reason: verified ? 'forward-confirmed-original-ip' : 'forward-dns-did-not-return-original-ip',
    };
  } catch (error) {
    return { verified: false, reason: 'dns-verification-error', error: error.message };
  }
}

async function load(path) {
  const data = await readFile(path);
  return path.endsWith('.gz') ? gunzipSync(data).toString('utf8') : data.toString('utf8');
}

const args = process.argv.slice(2);
const sinceArg = args.find((arg) => arg.startsWith('--since='));
const verifyOpenAi = args.includes('--verify-openai');
const verifyBing = args.includes('--verify-bing');
const verifyGoogle = args.includes('--verify-google');
const verifyPerplexity = args.includes('--verify-perplexity');
const verifyCommonCrawl = args.includes('--verify-common-crawl');
const verifyApple = args.includes('--verify-apple');
const includeRotated = args.includes('--include-rotated');
const since = sinceArg ? Date.parse(`${sinceArg.slice('--since='.length)}T00:00:00Z`) : null;
if (sinceArg && Number.isNaN(since)) {
  console.error('Invalid --since date. Use --since=YYYY-MM-DD.');
  process.exit(2);
}
const verificationFlags = ['--verify-openai', '--verify-bing', '--verify-google', '--verify-perplexity', '--verify-common-crawl', '--verify-apple', '--include-rotated'];
const inputPaths = args.filter((arg) => !arg.startsWith('--since=') && !verificationFlags.includes(arg));
const paths = await resolveLogPaths(inputPaths, includeRotated);
if (!paths.length) {
  console.error('Usage: npm run geo:crawler-report -- [--since=YYYY-MM-DD] [--include-rotated] [--verify-openai] [--verify-bing] [--verify-google] [--verify-perplexity] [--verify-common-crawl] [--verify-apple] /var/log/nginx/access.log [/var/log/nginx/access.log.1.gz ...]');
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
const verifiedGooglePages = pageCandidates.filter((event) => event.family === 'Googlebot' && event.providerVerified === true);
const verifiedPerplexityPages = pageCandidates.filter(
  (event) => ['PerplexityBot', 'Perplexity-User'].includes(event.family) && event.providerVerified === true,
);
const verifiedCommonCrawlPages = pageCandidates.filter((event) => event.family === 'CCBot' && event.providerVerified === true);
const verifiedApplePages = pageCandidates.filter((event) => event.family === 'Applebot' && event.providerVerified === true);
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
const verifiedGoogleDiscoveryFiles = discoveryCandidates.filter(
  (event) => event.family === 'Googlebot' && event.providerVerified === true,
);
const verifiedPerplexityDiscoveryFiles = discoveryCandidates.filter(
  (event) => ['PerplexityBot', 'Perplexity-User'].includes(event.family) && event.providerVerified === true,
);
const verifiedCommonCrawlDiscoveryFiles = discoveryCandidates.filter((event) => event.family === 'CCBot' && event.providerVerified === true);
const verifiedAppleDiscoveryFiles = discoveryCandidates.filter((event) => event.family === 'Applebot' && event.providerVerified === true);
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
  ...verifiedGooglePages,
  ...verifiedPerplexityPages,
  ...verifiedCommonCrawlPages,
  ...verifiedApplePages,
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
    google: verifiedGooglePages,
    perplexity: verifiedPerplexityPages,
    commonCrawl: verifiedCommonCrawlPages,
    apple: verifiedApplePages,
  },
  discoveryFiles: {
    openAi: verifiedOpenAiDiscoveryFiles,
    bing: verifiedBingDiscoveryFiles,
    google: verifiedGoogleDiscoveryFiles,
    perplexity: verifiedPerplexityDiscoveryFiles,
    commonCrawl: verifiedCommonCrawlDiscoveryFiles,
    apple: verifiedAppleDiscoveryFiles,
  },
});
const userAgentOnlyEvidenceObservations = buildUserAgentOnlyCrawlerEvidenceObservations([
  ...userAgentOnlyBytespiderPages,
  ...userAgentOnlyBytespiderDiscoveryFiles,
]);

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  caveat: 'User-Agent strings are self-declared. Only successful GET requests can be classified as candidate page or discovery-file crawls; HEAD and other methods do not retrieve the representation and are kept as non-content request observations. Candidate content crawls do not prove platform identity unless providerVerified is true under an enabled provider verification method. Bytespider page and discovery requests are exposed separately as user-agent-only, identity-unverified observations after synthetic release checks are excluded; they do not prove Doubao or ByteDance access. A null providerVerified value with verificationUnavailable means the required DNS or published-prefix source was unavailable, so identity could not be tested and must not be reported as failed. GPTBot is reported separately from OAI-SearchBot because a verified training crawl is not evidence of search indexing or citation.',
  files: paths,
  since: sinceArg ? sinceArg.slice('--since='.length) : null,
  verifyOpenAi,
  verifyBing,
  verifyGoogle,
  verifyPerplexity,
  verifyCommonCrawl,
  verifyApple,
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
    verifiedGooglePageCrawls: verifiedGooglePages.length,
    verifiedPerplexityPageCrawls: verifiedPerplexityPages.length,
    verifiedCommonCrawlPageCrawls: verifiedCommonCrawlPages.length,
    verifiedApplePageCrawls: verifiedApplePages.length,
    verifiedOpenAiDiscoveryFileCrawls: verifiedOpenAiDiscoveryFiles.length,
    verifiedGptBotDiscoveryFileCrawls: verifiedGptBotDiscoveryFiles.length,
    verifiedOaiSearchBotDiscoveryFileCrawls: verifiedOaiSearchBotDiscoveryFiles.length,
    verifiedBingDiscoveryFileCrawls: verifiedBingDiscoveryFiles.length,
    verifiedGoogleDiscoveryFileCrawls: verifiedGoogleDiscoveryFiles.length,
    verifiedPerplexityDiscoveryFileCrawls: verifiedPerplexityDiscoveryFiles.length,
    verifiedCommonCrawlDiscoveryFileCrawls: verifiedCommonCrawlDiscoveryFiles.length,
    verifiedAppleDiscoveryFileCrawls: verifiedAppleDiscoveryFiles.length,
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
  recentVerifiedGooglePageCrawls: verifiedGooglePages.slice(-50),
  recentVerifiedPerplexityPageCrawls: verifiedPerplexityPages.slice(-50),
  recentVerifiedCommonCrawlPageCrawls: verifiedCommonCrawlPages.slice(-50),
  recentVerifiedApplePageCrawls: verifiedApplePages.slice(-50),
  recentVerifiedOpenAiDiscoveryFileCrawls: verifiedOpenAiDiscoveryFiles.slice(-30),
  recentVerifiedGptBotDiscoveryFileCrawls: verifiedGptBotDiscoveryFiles.slice(-30),
  recentVerifiedOaiSearchBotDiscoveryFileCrawls: verifiedOaiSearchBotDiscoveryFiles.slice(-30),
  recentVerifiedBingDiscoveryFileCrawls: verifiedBingDiscoveryFiles.slice(-30),
  recentVerifiedGoogleDiscoveryFileCrawls: verifiedGoogleDiscoveryFiles.slice(-30),
  recentVerifiedPerplexityDiscoveryFileCrawls: verifiedPerplexityDiscoveryFiles.slice(-30),
  recentVerifiedCommonCrawlDiscoveryFileCrawls: verifiedCommonCrawlDiscoveryFiles.slice(-30),
  recentVerifiedAppleDiscoveryFileCrawls: verifiedAppleDiscoveryFiles.slice(-30),
  recentDnsVerificationUnavailablePageCrawls: dnsVerificationUnavailablePages.slice(-50),
  recentDnsVerificationUnavailableDiscoveryFileCrawls: dnsVerificationUnavailableDiscoveryFiles.slice(-30),
  recentSuspiciousRequests: suspiciousCandidates.slice(-20),
}, null, 2));

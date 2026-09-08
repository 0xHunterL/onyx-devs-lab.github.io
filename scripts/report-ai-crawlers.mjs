import { readFile } from 'node:fs/promises';
import { lookup, reverse } from 'node:dns/promises';
import { gunzipSync } from 'node:zlib';

const crawlerFamilies = [
  ['Bytespider', /Bytespider/i],
  ['Baiduspider', /Baiduspider/i],
  ['Bingbot', /bingbot/i],
  ['OAI-SearchBot', /OAI-SearchBot/i],
  ['GPTBot', /GPTBot/i],
  ['PerplexityBot', /PerplexityBot/i],
  ['ClaudeBot', /ClaudeBot/i],
  ['Googlebot', /Googlebot/i],
];

const suspiciousPath = /(?:^|\/)(?:\.env(?:\.|$)|\.git(?:\/|$)|wp-admin|wp-login|phpmyadmin|server-status|actuator|cgi-bin)|(?:passwd|shadow|id_rsa|authorized_keys|credentials?|secrets?|backup\.sql|169\.254\.169\.254)/i;
const pagePath = /^\/(?:en|zh-hk|zh-cn)(?:\/|$)/i;
const discoveryPath = /^\/(?:robots\.txt|sitemap\.xml|llms(?:-full)?\.txt|feed\.xml)$/i;
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
    return {
      ip: entry.clientIp || entry.proxyIp || '',
      proxyIp: entry.proxyIp || '',
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
  return {
    ...entry,
    family,
    classification: syntheticCheck
      ? 'synthetic-release-check'
      : suspicious
      ? 'suspicious-spoof-or-scan'
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

function ipv4ToBigInt(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4 || parts.some((part) => !/^\d+$/.test(part) || Number(part) > 255)) return null;
  return parts.reduce((value, part) => (value << 8n) + BigInt(part), 0n);
}

function isInIpv4Prefix(ip, prefix) {
  const [network, bitsText] = prefix.split('/');
  const value = ipv4ToBigInt(ip);
  const networkValue = ipv4ToBigInt(network);
  const bits = Number(bitsText);
  if (value === null || networkValue === null || bits < 0 || bits > 32) return false;
  const mask = bits === 0 ? 0n : ((1n << BigInt(bits)) - 1n) << BigInt(32 - bits);
  return (value & mask) === (networkValue & mask);
}

async function openAiPrefixes(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Unable to fetch ${url}: HTTP ${response.status}`);
  const body = await response.json();
  return body.prefixes.map((entry) => entry.ipv4Prefix).filter(Boolean);
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
    const verified = forwardResults.some((result) =>
      result.addresses.some((address) => normalizeIp(address) === normalizedIp),
    );
    return {
      verified,
      hostnames: providerHostnames,
      forwardAddresses: [...new Set(forwardResults.flatMap((result) => result.addresses))],
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
const since = sinceArg ? Date.parse(`${sinceArg.slice('--since='.length)}T00:00:00Z`) : null;
if (sinceArg && Number.isNaN(since)) {
  console.error('Invalid --since date. Use --since=YYYY-MM-DD.');
  process.exit(2);
}
const verificationFlags = ['--verify-openai', '--verify-bing', '--verify-google'];
const paths = args.filter((arg) => !arg.startsWith('--since=') && !verificationFlags.includes(arg));
if (!paths.length) {
  console.error('Usage: npm run geo:crawler-report -- [--since=YYYY-MM-DD] [--verify-openai] [--verify-bing] [--verify-google] /var/log/nginx/access.log [/var/log/nginx/access.log.1.gz ...]');
  process.exit(2);
}

const events = [];
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
  const [gptBotPrefixes, searchBotPrefixes] = await Promise.all([
    openAiPrefixes('https://openai.com/gptbot.json'),
    openAiPrefixes('https://openai.com/searchbot.json'),
  ]);
  for (const event of events) {
    if (event.family === 'GPTBot') event.providerVerified = gptBotPrefixes.some((prefix) => isInIpv4Prefix(event.ip, prefix));
    if (event.family === 'OAI-SearchBot') event.providerVerified = searchBotPrefixes.some((prefix) => isInIpv4Prefix(event.ip, prefix));
  }
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
const verifiedOpenAiPages = pageCandidates.filter(
  (event) => ['GPTBot', 'OAI-SearchBot'].includes(event.family) && event.providerVerified === true,
);
const verifiedBingPages = pageCandidates.filter((event) => event.family === 'Bingbot' && event.providerVerified === true);
const verifiedGooglePages = pageCandidates.filter((event) => event.family === 'Googlebot' && event.providerVerified === true);

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  caveat: 'User-Agent strings are self-declared. Candidate content crawls do not prove platform identity unless providerVerified is true under an enabled provider verification method.',
  files: paths,
  since: sinceArg ? sinceArg.slice('--since='.length) : null,
  verifyOpenAi,
  verifyBing,
  verifyGoogle,
  totals: {
    candidateCrawlerRequests: events.length,
    candidatePageCrawls: pageCandidates.length,
    candidateDiscoveryFileCrawls: discoveryCandidates.length,
    suspiciousSpoofOrScanRequests: suspiciousCandidates.length,
    syntheticReleaseChecks: syntheticChecks.length,
    verifiedOpenAiPageCrawls: verifiedOpenAiPages.length,
    verifiedBingPageCrawls: verifiedBingPages.length,
    verifiedGooglePageCrawls: verifiedGooglePages.length,
    unparsableLines,
  },
  byFamily,
  byClassification,
  recentCandidatePageCrawls: pageCandidates.slice(-50),
  recentCandidateDiscoveryFileCrawls: discoveryCandidates.slice(-30),
  recentVerifiedOpenAiPageCrawls: verifiedOpenAiPages.slice(-50),
  recentVerifiedBingPageCrawls: verifiedBingPages.slice(-50),
  recentVerifiedGooglePageCrawls: verifiedGooglePages.slice(-50),
  recentSuspiciousRequests: suspiciousCandidates.slice(-20),
}, null, 2));

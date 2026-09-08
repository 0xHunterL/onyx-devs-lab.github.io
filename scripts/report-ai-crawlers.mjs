import { readFile } from 'node:fs/promises';
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

function classify(entry) {
  const family = crawlerFamilies.find(([, pattern]) => pattern.test(entry.userAgent))?.[0];
  if (!family) return null;
  const pathOnly = entry.path.split('?')[0];
  const suspicious = suspiciousPath.test(pathOnly);
  const successful = entry.status >= 200 && entry.status < 400;
  const relevantPage = pagePath.test(pathOnly) && !staticAsset.test(pathOnly);
  const discoveryFile = discoveryPath.test(pathOnly);
  return {
    ...entry,
    family,
    classification: suspicious
      ? 'suspicious-spoof-or-scan'
      : successful && relevantPage
        ? 'candidate-page-crawl'
        : successful && discoveryFile
          ? 'candidate-discovery-file-crawl'
        : 'other-candidate-request',
  };
}

function parseNginxTime(value) {
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
const since = sinceArg ? Date.parse(`${sinceArg.slice('--since='.length)}T00:00:00Z`) : null;
if (sinceArg && Number.isNaN(since)) {
  console.error('Invalid --since date. Use --since=YYYY-MM-DD.');
  process.exit(2);
}
const paths = args.filter((arg) => !arg.startsWith('--since='));
if (!paths.length) {
  console.error('Usage: npm run geo:crawler-report -- [--since=YYYY-MM-DD] /var/log/nginx/access.log [/var/log/nginx/access.log.1.gz ...]');
  process.exit(2);
}

const events = [];
let unparsableLines = 0;
for (const path of paths) {
  const body = await load(path);
  for (const line of body.split(/\r?\n/)) {
    if (!line) continue;
    const parsed = parseCombinedLog(line);
    if (!parsed) {
      unparsableLines += 1;
      continue;
    }
    if (since && parseNginxTime(parsed.time) < since) continue;
    const event = classify(parsed);
    if (event) events.push({ source: path, ...event });
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

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  caveat: 'User-Agent strings are self-declared. Candidate content crawls are useful evidence, but do not prove that the request came from the named platform.',
  files: paths,
  since: sinceArg ? sinceArg.slice('--since='.length) : null,
  totals: {
    candidateCrawlerRequests: events.length,
    candidatePageCrawls: pageCandidates.length,
    candidateDiscoveryFileCrawls: discoveryCandidates.length,
    suspiciousSpoofOrScanRequests: suspiciousCandidates.length,
    unparsableLines,
  },
  byFamily,
  byClassification,
  recentCandidatePageCrawls: pageCandidates.slice(-50),
  recentCandidateDiscoveryFileCrawls: discoveryCandidates.slice(-30),
  recentSuspiciousRequests: suspiciousCandidates.slice(-20),
}, null, 2));

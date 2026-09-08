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
const contentPath = /^(?:\/(?:en|zh-hk|zh-cn)(?:\/|$)|\/(?:robots\.txt|sitemap\.xml|llms(?:-full)?\.txt|feed\.xml)$)/i;
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
  const relevantContent = contentPath.test(pathOnly) && !staticAsset.test(pathOnly);
  return {
    ...entry,
    family,
    classification: suspicious
      ? 'suspicious-spoof-or-scan'
      : successful && relevantContent
        ? 'candidate-content-crawl'
        : 'other-candidate-request',
  };
}

async function load(path) {
  const data = await readFile(path);
  return path.endsWith('.gz') ? gunzipSync(data).toString('utf8') : data.toString('utf8');
}

const paths = process.argv.slice(2);
if (!paths.length) {
  console.error('Usage: npm run geo:crawler-report -- /var/log/nginx/access.log [/var/log/nginx/access.log.1.gz ...]');
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

const credibleCandidates = events.filter((event) => event.classification === 'candidate-content-crawl');
const suspiciousCandidates = events.filter((event) => event.classification === 'suspicious-spoof-or-scan');

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  caveat: 'User-Agent strings are self-declared. Candidate content crawls are useful evidence, but do not prove that the request came from the named platform.',
  files: paths,
  totals: {
    candidateCrawlerRequests: events.length,
    candidateContentCrawls: credibleCandidates.length,
    suspiciousSpoofOrScanRequests: suspiciousCandidates.length,
    unparsableLines,
  },
  byFamily,
  byClassification,
  recentCandidateContentCrawls: credibleCandidates.slice(-50),
  recentSuspiciousRequests: suspiciousCandidates.slice(-20),
}, null, 2));

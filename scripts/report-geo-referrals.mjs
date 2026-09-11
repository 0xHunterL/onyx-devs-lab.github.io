import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { resolveLogPaths } from './resolve-log-paths.mjs';

async function load(path) {
  const data = await readFile(path);
  return path.endsWith('.gz') ? gunzipSync(data).toString('utf8') : data.toString('utf8');
}

const args = process.argv.slice(2);
const sinceArg = args.find((arg) => arg.startsWith('--since='));
const since = sinceArg ? Date.parse(`${sinceArg.slice('--since='.length)}T00:00:00Z`) : null;
const includeRotated = args.includes('--include-rotated');
const inputPaths = args.filter((arg) => !arg.startsWith('--since=') && arg !== '--include-rotated');
const paths = await resolveLogPaths(inputPaths, includeRotated);
const syntheticUserAgent = /^(?:curl|Wget)\/|Onyx-(?:GEO-Release-Check|Buyer-Guide-Link-Check)|python-requests|node-fetch|undici/i;
const knownLinkScannerUserAgent = /AppEngine-Google;\s*\(\+http:\/\/code\.google\.com\/appengine;\s*appid:\s*s~virustotalcloud\)/i;
const knownLinkScannerNetworks = [
  { name: 'Palo Alto Networks URL scanner', matches: (ip) => /^205\.169\.39\./.test(ip) },
];
const aiReferrerFamilies = [
  ['doubao', /(^|\.)doubao\.com$/i],
  ['chatgpt', /(^|\.)(?:chatgpt\.com|chat\.openai\.com)$/i],
  ['perplexity', /(^|\.)perplexity\.ai$/i],
  ['copilot', /(^|\.)copilot\.microsoft\.com$/i],
  ['gemini', /(^|\.)gemini\.google\.com$/i],
  ['claude', /(^|\.)claude\.ai$/i],
];

if (sinceArg && Number.isNaN(since)) {
  console.error('Invalid --since date. Use --since=YYYY-MM-DD.');
  process.exit(2);
}
if (!paths.length) {
  console.error('Usage: npm run geo:referral-report -- [--since=YYYY-MM-DD] [--include-rotated] /var/log/nginx/hk.onyxdevslab.com.geo.log [...]');
  process.exit(2);
}

const visits = [];
const syntheticVisits = [];
const malformedCampaignVisits = [];
let unparsableLines = 0;
for (const path of paths) {
  const body = await load(path);
  for (const line of body.split(/\r?\n/)) {
    if (!line) continue;
    try {
      const event = JSON.parse(line);
      if (since && Date.parse(event.time) < since) continue;
      const url = new URL(event.path, 'https://hk.onyxdevslab.com');
      const rawCampaign = url.searchParams.get('utm_campaign');
      const campaign = rawCampaign && /^[a-z0-9_-]{1,100}$/i.test(rawCampaign) ? rawCampaign : null;
      const referrerHost = String(event.referrerHost || '').toLowerCase().replace(/^www\./, '');
      const aiReferrer = aiReferrerFamilies.find(([, pattern]) => pattern.test(referrerHost))?.[0] || null;
      const scannerNetwork = knownLinkScannerNetworks.find((network) => network.matches(String(event.clientIp || '')))?.name || null;
      if (rawCampaign && !campaign) {
        malformedCampaignVisits.push({ time: event.time, path: url.pathname, rawCampaign, userAgent: event.userAgent || '' });
      }
      if (!campaign && !aiReferrer) continue;
      const visit = {
        time: event.time,
        path: url.pathname,
        status: Number(event.status),
        campaign: campaign || 'ai_source_click',
        source: url.searchParams.get('utm_source') || aiReferrer || '(not set)',
        medium: url.searchParams.get('utm_medium') || (aiReferrer ? 'ai-referral' : '(not set)'),
        referrerHost,
        evidenceType: campaign ? (aiReferrer ? 'utm-and-ai-referrer' : 'utm') : 'ai-referrer',
        userAgent: event.userAgent || '',
        scannerNetwork,
      };
      if (syntheticUserAgent.test(visit.userAgent)) syntheticVisits.push(visit);
      else visits.push(visit);
    } catch {
      unparsableLines += 1;
    }
  }
}

const aggregate = (key) => Object.fromEntries([...visits.reduce((counts, visit) => {
  const value = visit[key];
  counts.set(value, (counts.get(value) || 0) + 1);
  return counts;
}, new Map())].sort((a, b) => b[1] - a[1]));

const suspectedAutomatedVisitIndexes = new Set();
const suspectedAutomatedBursts = [];
const internallyInconsistentUserAgentVisits = [];
const chromiumWithLegacyEdge = /Chrome\/(?:[5-9]\d|1\d{2})\.[^\s]*[\s\S]*\bEdge\/1[2-8]\./i;
for (const [index, visit] of visits.entries()) {
  if (!chromiumWithLegacyEdge.test(visit.userAgent)) continue;
  suspectedAutomatedVisitIndexes.add(index);
  internallyInconsistentUserAgentVisits.push({
    time: visit.time,
    path: visit.path,
    source: visit.source,
    campaign: visit.campaign,
    userAgent: visit.userAgent,
    reason: 'Chromium 50+ combined with legacy EdgeHTML 12-18 is an internally inconsistent browser identity',
  });
}
const burstGroups = new Map();
for (const [index, visit] of visits.entries()) {
  if (knownLinkScannerUserAgent.test(visit.userAgent) || visit.scannerNetwork) suspectedAutomatedVisitIndexes.add(index);
  const key = [visit.userAgent, visit.source, visit.campaign].join('\u0000');
  if (!burstGroups.has(key)) burstGroups.set(key, []);
  burstGroups.get(key).push({ index, visit, timestamp: Date.parse(visit.time) });
}
for (const group of burstGroups.values()) {
  group.sort((a, b) => a.timestamp - b.timestamp);
  for (let start = 0; start < group.length; start += 1) {
    const window = [];
    for (let end = start; end < group.length && group[end].timestamp - group[start].timestamp <= 60_000; end += 1) window.push(group[end]);
    const distinctPaths = new Set(window.map((item) => item.visit.path));
    if (window.length < 8 || distinctPaths.size < 5) continue;
    for (const item of window) suspectedAutomatedVisitIndexes.add(item.index);
    suspectedAutomatedBursts.push({
      start: window[0].visit.time,
      end: window.at(-1).visit.time,
      source: window[0].visit.source,
      campaign: window[0].visit.campaign,
      requests: window.length,
      distinctLandingPages: distinctPaths.size,
      userAgent: window[0].visit.userAgent,
      reason: 'at least 8 requests across at least 5 landing pages within 60 seconds',
    });
    start = group.findIndex((item) => item.index === window.at(-1).index);
  }
}
const coordinatedGroups = new Map();
for (const [index, visit] of visits.entries()) {
  const key = [visit.source, visit.campaign].join('\u0000');
  if (!coordinatedGroups.has(key)) coordinatedGroups.set(key, []);
  coordinatedGroups.get(key).push({ index, visit, timestamp: Date.parse(visit.time) });
}
for (const group of coordinatedGroups.values()) {
  group.sort((a, b) => a.timestamp - b.timestamp);
  for (let start = 0; start < group.length; start += 1) {
    const window = [];
    for (let end = start; end < group.length && group[end].timestamp - group[start].timestamp <= 120_000; end += 1) window.push(group[end]);
    const distinctPaths = new Set(window.map((item) => item.visit.path));
    const distinctUserAgents = new Set(window.map((item) => item.visit.userAgent));
    const durationMs = window.at(-1).timestamp - window[0].timestamp;
    const fastWideBurst = durationMs <= 60_000 && window.length >= 8 && distinctPaths.size >= 3 && distinctUserAgents.size >= 2;
    const coordinatedMultiProfileBurst = window.length >= 10 && distinctPaths.size >= 3 && distinctUserAgents.size >= 3;
    if (!fastWideBurst && !coordinatedMultiProfileBurst) continue;
    for (const item of window) suspectedAutomatedVisitIndexes.add(item.index);
    suspectedAutomatedBursts.push({
      start: window[0].visit.time,
      end: window.at(-1).visit.time,
      source: window[0].visit.source,
      campaign: window[0].visit.campaign,
      requests: window.length,
      distinctLandingPages: distinctPaths.size,
      distinctUserAgents: distinctUserAgents.size,
      windowSeconds: Math.round(durationMs / 1000),
      reason: fastWideBurst
        ? 'at least 8 requests from multiple user agents across at least 3 landing pages within 60 seconds'
        : 'at least 10 requests from at least 3 user agents across at least 3 landing pages within 120 seconds',
    });
    start = group.findIndex((item) => item.index === window.at(-1).index);
  }
}
const humanUnverifiedVisits = visits.filter((_, index) => !suspectedAutomatedVisitIndexes.has(index));
const humanUnverifiedEvidenceObservations = humanUnverifiedVisits.map((visit) => ({
  fingerprint: createHash('sha256').update([
    visit.time,
    visit.path,
    visit.status,
    visit.campaign,
    visit.source,
    visit.medium,
    visit.referrerHost,
    visit.evidenceType,
    visit.userAgent,
  ].join('\u0000')).digest('hex'),
  time: visit.time,
  path: visit.path,
  status: visit.status,
  campaign: visit.campaign,
  source: visit.source,
  medium: visit.medium,
  referrerHost: visit.referrerHost,
  evidenceType: visit.evidenceType,
}));

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  since: sinceArg ? sinceArg.slice('--since='.length) : null,
  files: paths,
  includeRotated,
  trackedVisits: visits.length,
  syntheticTrackedVisits: syntheticVisits.length,
  suspectedAutomatedTrackedVisits: suspectedAutomatedVisitIndexes.size,
  humanUnverifiedTrackedVisits: humanUnverifiedVisits.length,
  caveat: 'Scripted verification user agents are excluded from trackedVisits and reported separately. Known link-scanner user agents and documented scanner networks, internally inconsistent browser identities, and high-velocity multi-page bursts are flagged as suspected automation rather than human visits. Remaining requests are human-unverified: UTM or AI-referrer traffic is attribution evidence, not proof of a person, search indexing, answer citation, or recommendation. Referrer headers may be omitted by the source application or browser policy.',
  byCampaign: aggregate('campaign'),
  bySource: aggregate('source'),
  byMedium: aggregate('medium'),
  byLandingPage: aggregate('path'),
  byEvidenceType: aggregate('evidenceType'),
  suspectedAutomatedBursts,
  internallyInconsistentUserAgentVisits,
  knownLinkScannerTrackedVisits: visits.filter((visit) => knownLinkScannerUserAgent.test(visit.userAgent) || visit.scannerNetwork).length,
  knownLinkScannerUserAgentVisits: visits.filter((visit) => knownLinkScannerUserAgent.test(visit.userAgent)).length,
  knownLinkScannerNetworkVisits: visits.filter((visit) => visit.scannerNetwork).length,
  malformedCampaignVisits,
  recentVisits: visits.slice(-50),
  recentHumanUnverifiedVisits: humanUnverifiedVisits.slice(-50),
  humanUnverifiedEvidenceObservations,
  recentSyntheticVisits: syntheticVisits.slice(-50),
  unparsableLines,
}, null, 2));

import { readFile } from 'node:fs/promises';
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
const syntheticUserAgent = /^(?:curl|Wget)\/|Onyx-GEO-Release-Check|python-requests|node-fetch|undici/i;
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
let unparsableLines = 0;
for (const path of paths) {
  const body = await load(path);
  for (const line of body.split(/\r?\n/)) {
    if (!line) continue;
    try {
      const event = JSON.parse(line);
      if (since && Date.parse(event.time) < since) continue;
      const url = new URL(event.path, 'https://hk.onyxdevslab.com');
      const campaign = url.searchParams.get('utm_campaign');
      const referrerHost = String(event.referrerHost || '').toLowerCase().replace(/^www\./, '');
      const aiReferrer = aiReferrerFamilies.find(([, pattern]) => pattern.test(referrerHost))?.[0] || null;
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

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  since: sinceArg ? sinceArg.slice('--since='.length) : null,
  files: paths,
  includeRotated,
  trackedVisits: visits.length,
  syntheticTrackedVisits: syntheticVisits.length,
  caveat: 'Scripted verification user agents are excluded from trackedVisits and reported separately. UTM or AI-referrer traffic is click evidence, not proof of search indexing, answer citation, or recommendation. Referrer headers may be omitted by the source application or browser policy.',
  byCampaign: aggregate('campaign'),
  bySource: aggregate('source'),
  byMedium: aggregate('medium'),
  byLandingPage: aggregate('path'),
  byEvidenceType: aggregate('evidenceType'),
  recentVisits: visits.slice(-50),
  recentSyntheticVisits: syntheticVisits.slice(-50),
  unparsableLines,
}, null, 2));

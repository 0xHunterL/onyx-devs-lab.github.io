import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';

async function load(path) {
  const data = await readFile(path);
  return path.endsWith('.gz') ? gunzipSync(data).toString('utf8') : data.toString('utf8');
}

const args = process.argv.slice(2);
const sinceArg = args.find((arg) => arg.startsWith('--since='));
const since = sinceArg ? Date.parse(`${sinceArg.slice('--since='.length)}T00:00:00Z`) : null;
const paths = args.filter((arg) => !arg.startsWith('--since='));

if (sinceArg && Number.isNaN(since)) {
  console.error('Invalid --since date. Use --since=YYYY-MM-DD.');
  process.exit(2);
}
if (!paths.length) {
  console.error('Usage: npm run geo:referral-report -- [--since=YYYY-MM-DD] /var/log/nginx/hk.onyxdevslab.com.geo.log [...]');
  process.exit(2);
}

const visits = [];
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
      if (!campaign) continue;
      visits.push({
        time: event.time,
        path: url.pathname,
        status: Number(event.status),
        campaign,
        source: url.searchParams.get('utm_source') || '(not set)',
        medium: url.searchParams.get('utm_medium') || '(not set)',
      });
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
  trackedVisits: visits.length,
  byCampaign: aggregate('campaign'),
  bySource: aggregate('source'),
  byMedium: aggregate('medium'),
  byLandingPage: aggregate('path'),
  recentVisits: visits.slice(-50),
  unparsableLines,
}, null, 2));

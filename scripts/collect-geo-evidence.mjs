import { spawn } from 'node:child_process';
import { mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const valueArg = (name, fallback) => args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) || fallback;
const outputDir = path.resolve(valueArg('--output-dir', '/var/lib/onyx-geo'));
const since = valueArg('--since', '2026-09-01');
const logPaths = args.filter((arg) => !arg.startsWith('--output-dir=') && !arg.startsWith('--since='));
if (!/^\d{4}-\d{2}-\d{2}$/.test(since)) throw new Error('--since must use YYYY-MM-DD');
if (!logPaths.length) logPaths.push('/var/log/nginx/hk.onyxdevslab.com.geo.log');

async function runJson(script, scriptArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, 'scripts', script), ...scriptArgs], {
      cwd: root,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(`${script} exited ${code}: ${stderr.trim() || stdout.trim()}`));
      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject(new Error(`${script} returned invalid JSON: ${error.message}`));
      }
    });
  });
}

async function readPreviousSummary() {
  try {
    return JSON.parse(await readFile(path.join(outputDir, 'summary.json'), 'utf8'));
  } catch {
    return null;
  }
}

async function readSeenEvidence() {
  try {
    const value = JSON.parse(await readFile(path.join(outputDir, 'seen-evidence.json'), 'utf8'));
    return Array.isArray(value.fingerprints) ? value : null;
  } catch {
    return null;
  }
}

async function hasEventHistory() {
  try {
    return (await readdir(path.join(outputDir, 'events'))).some((name) => name.endsWith('.json'));
  } catch {
    return false;
  }
}

async function atomicJson(name, value) {
  const target = path.join(outputDir, name);
  await mkdir(path.dirname(target), { recursive: true, mode: 0o750 });
  const temporary = `${target}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o640 });
  await rename(temporary, target);
}

await mkdir(outputDir, { recursive: true, mode: 0o750 });
const previous = await readPreviousSummary();
const previousSeenEvidence = await readSeenEvidence();
const eventHistoryExists = await hasEventHistory();
const crawler = await runJson('report-ai-crawlers.mjs', [
  `--since=${since}`,
  '--include-rotated',
  '--verify-openai',
  '--verify-bing',
  '--verify-google',
  '--verify-perplexity',
  ...logPaths,
]);
const referral = await runJson('report-geo-referrals.mjs', [`--since=${since}`, '--include-rotated', ...logPaths]);

const crawlerTemporary = path.join(outputDir, `.crawler-report-${process.pid}.json`);
await writeFile(crawlerTemporary, `${JSON.stringify(crawler, null, 2)}\n`, { mode: 0o640 });
let promptCoverage;
try {
  promptCoverage = await runJson('report-prompt-crawl-coverage.mjs', [`--crawler-report=${crawlerTemporary}`]);
} finally {
  await unlink(crawlerTemporary).catch(() => {});
}

const counts = {
  verifiedGptBotPageCrawls: crawler.totals.verifiedGptBotPageCrawls,
  verifiedOaiSearchBotPageCrawls: crawler.totals.verifiedOaiSearchBotPageCrawls,
  verifiedOaiSearchBotDiscoveryFileCrawls: crawler.totals.verifiedOaiSearchBotDiscoveryFileCrawls,
  verifiedGptBotDiscoveryFileCrawls: crawler.totals.verifiedGptBotDiscoveryFileCrawls,
  verifiedBingDiscoveryFileCrawls: crawler.totals.verifiedBingDiscoveryFileCrawls,
  verifiedGoogleDiscoveryFileCrawls: crawler.totals.verifiedGoogleDiscoveryFileCrawls,
  verifiedPerplexityDiscoveryFileCrawls: crawler.totals.verifiedPerplexityDiscoveryFileCrawls,
  verifiedBingPageCrawls: crawler.totals.verifiedBingPageCrawls,
  verifiedGooglePageCrawls: crawler.totals.verifiedGooglePageCrawls,
  verifiedPerplexityPageCrawls: crawler.totals.verifiedPerplexityPageCrawls,
  verifiedContentPaths: crawler.verifiedContentPathCoverage.length,
  searchRelatedCrawledEvidencePages: promptCoverage.totals.searchRelatedCrawledEvidencePages,
  promptsWithAnySearchRelatedCrawl: promptCoverage.totals.promptsWithAnySearchRelatedCrawl,
  trackedVisits: referral.trackedVisits,
  suspectedAutomatedTrackedVisits: referral.suspectedAutomatedTrackedVisits,
  humanUnverifiedTrackedVisits: referral.humanUnverifiedTrackedVisits,
  aiReferrerAttributedVisits: (referral.byEvidenceType['ai-referrer'] || 0) + (referral.byEvidenceType['utm-and-ai-referrer'] || 0),
  humanUnverifiedAiReferrerVisits: referral.recentHumanUnverifiedVisits.filter((visit) => visit.evidenceType.includes('ai-referrer')).length,
};
const priorCounts = previous?.counts || {};
const deltas = Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, previous ? value - (Number(priorCounts[key]) || 0) : 0]));
const metricForCrawlerObservation = (observation) => {
  const provider = {
    GPTBot: 'GptBot',
    'OAI-SearchBot': 'OaiSearchBot',
    Bingbot: 'Bing',
    Googlebot: 'Google',
    PerplexityBot: 'Perplexity',
    'Perplexity-User': 'Perplexity',
  }[observation.family];
  if (!provider) throw new Error(`Unsupported verified crawler family: ${observation.family}`);
  return `verified${provider}${observation.classification === 'candidate-page-crawl' ? 'Page' : 'DiscoveryFile'}Crawls`;
};
const currentEvidenceObservations = [
  ...(crawler.verifiedEvidenceObservations || []).map((observation) => ({ ...observation, metric: metricForCrawlerObservation(observation), evidenceClass: 'provider-verified-crawler' })),
  ...(referral.humanUnverifiedEvidenceObservations || []).map((observation) => ({
    ...observation,
    metric: observation.evidenceType.includes('ai-referrer') ? 'humanUnverifiedAiReferrerVisits' : 'humanUnverifiedTrackedVisits',
    evidenceClass: 'attributed-request-visitor-type-unverified',
  })),
];
const previouslySeen = new Set(previousSeenEvidence?.fingerprints || []);
const newEvidenceObservations = previousSeenEvidence
  ? currentEvidenceObservations.filter((observation) => !previouslySeen.has(observation.fingerprint))
  : [];
const newEvidenceByMetric = newEvidenceObservations.reduce((result, observation) => {
  result.set(observation.metric, (result.get(observation.metric) || 0) + 1);
  return result;
}, new Map());
const newEvidence = [...newEvidenceByMetric].map(([metric, delta]) => ({ metric, delta, current: counts[metric] ?? null }));
const allSeenFingerprints = [...new Set([...(previousSeenEvidence?.fingerprints || []), ...currentEvidenceObservations.map((observation) => observation.fingerprint)])].sort();
const generatedAt = new Date().toISOString();
const eventKind = !previous || !eventHistoryExists ? 'baseline' : newEvidence.length ? 'evidence-change' : null;
const eventFile = eventKind ? `events/${generatedAt.replaceAll(':', '-')}-${eventKind}.json` : null;
const summary = {
  schemaVersion: 1,
  generatedAt,
  since,
  sourceLogs: crawler.files,
  counts,
  deltas,
  newEvidence,
  initialized: !previous,
  changed: newEvidence.length > 0,
  eventFile,
  newEvidenceObservations,
  evidenceBoundary: 'New crawler fingerprints prove only previously unseen provider-verified requests. New referral fingerprints exclude suspected automation and prove only previously unseen attributed requests whose visitor type is not verified. Neither proves indexing, retrieval, citation, ranking, a human visit, or non-brand recommendation.',
};

if (eventFile) await atomicJson(eventFile, {
  schemaVersion: 1,
  kind: eventKind,
  summary,
  crawler,
  referral,
  promptCoverage,
});
await atomicJson('seen-evidence.json', {
  schemaVersion: 1,
  updatedAt: generatedAt,
  fingerprints: allSeenFingerprints,
});
await atomicJson('crawler-report.json', crawler);
await atomicJson('referral-report.json', referral);
await atomicJson('prompt-crawl-coverage.json', promptCoverage);
await atomicJson('summary.json', summary);
console.log(JSON.stringify(summary, null, 2));

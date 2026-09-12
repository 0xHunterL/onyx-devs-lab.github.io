import { spawn } from 'node:child_process';
import { mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAvailabilityChanges, buildCommonCrawlAvailability, buildCrawlerVerificationAvailability, buildCumulativeVerifiedContentPathCoverage, buildDistributionAvailability, buildDomainCanonicalizationAvailability, buildEvidenceCounts, buildEvidenceDeltas, buildServicesHkAvailability, buildWaybackAvailability, mergeVerifiedCrawlerObservations, preserveAppendOnlyCrawlerCounts, selectEvidenceEventKind } from './geo-evidence-summary.mjs';

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

async function readHistoricalVerifiedCrawlerObservations() {
  try {
    const eventDir = path.join(outputDir, 'events');
    const names = (await readdir(eventDir)).filter((name) => name.endsWith('.json')).sort();
    const observations = [];
    for (const name of names) {
      try {
        const event = JSON.parse(await readFile(path.join(eventDir, name), 'utf8'));
        observations.push(...(event.crawler?.verifiedEvidenceObservations || []));
      } catch {
        // A damaged historical event must not stop the live collection; the
        // publication-drift gate will still expose any unsupported decrease.
      }
    }
    return observations;
  } catch {
    return [];
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
  '--verify-baidu',
  '--verify-google',
  '--verify-perplexity',
  '--verify-common-crawl',
  '--verify-apple',
  '--verify-yandex',
  '--verify-ahrefs',
  ...logPaths,
]);
const referral = await runJson('report-geo-referrals.mjs', [`--since=${since}`, '--include-rotated', ...logPaths]);
const commonCrawl = await runJson('report-common-crawl.mjs', ['--host=hk.onyxdevslab.com', '--indexes=2']);
const wayback = await runJson('report-wayback.mjs', ['--host=hk.onyxdevslab.com']);
const distribution = await runJson('check-distribution-live.mjs', ['--report']);
const servicesHk = await runJson('check-services-hk.mjs', ['--report']);
const githubRepositorySearch = await runJson('report-github-repository-search.mjs', []);
const domainCanonicalization = await runJson('check-domain-canonicalization.mjs', []);

const historicalVerifiedCrawlerObservations = Array.isArray(previousSeenEvidence?.verifiedCrawlerObservations)
  ? previousSeenEvidence.verifiedCrawlerObservations
  : await readHistoricalVerifiedCrawlerObservations();
const cumulativeVerifiedCrawlerObservations = mergeVerifiedCrawlerObservations(
  historicalVerifiedCrawlerObservations,
  crawler.verifiedEvidenceObservations || [],
);
crawler.verifiedEvidenceObservations = cumulativeVerifiedCrawlerObservations;
crawler.verifiedContentPathCoverage = buildCumulativeVerifiedContentPathCoverage(cumulativeVerifiedCrawlerObservations);
crawler.verifiedContentPathCoverageAccounting = {
  mode: 'append-only-provider-verified-fingerprint-cumulative',
  observations: cumulativeVerifiedCrawlerObservations.filter((observation) => observation.classification === 'candidate-page-crawl').length,
  paths: crawler.verifiedContentPathCoverage.length,
  meaning: 'Content-path coverage is rebuilt from the append-only provider-verified observation ledger, so log rotation cannot erase previously verified path or prompt coverage.',
};

const crawlerTemporary = path.join(outputDir, `.crawler-report-${process.pid}.json`);
await writeFile(crawlerTemporary, `${JSON.stringify(crawler, null, 2)}\n`, { mode: 0o640 });
let promptCoverage;
try {
  promptCoverage = await runJson('report-prompt-crawl-coverage.mjs', [`--crawler-report=${crawlerTemporary}`]);
} finally {
  await unlink(crawlerTemporary).catch(() => {});
}

const retainedLogCounts = buildEvidenceCounts(crawler, referral, commonCrawl, promptCoverage, wayback);
const commonCrawlAvailability = buildCommonCrawlAvailability(commonCrawl);
const waybackAvailability = buildWaybackAvailability(wayback);
const crawlerVerificationAvailability = buildCrawlerVerificationAvailability(crawler);
const distributionAvailability = buildDistributionAvailability(distribution);
const servicesHkAvailability = buildServicesHkAvailability(servicesHk);
const domainCanonicalizationAvailability = buildDomainCanonicalizationAvailability(domainCanonicalization);
const githubRepositorySearchAvailability = {
  status: githubRepositorySearch.status,
  sourcesChecked: githubRepositorySearch.queriesChecked,
  availableSources: githubRepositorySearch.availableQueries,
  unavailableSources: githubRepositorySearch.unavailableQueries,
  sources: githubRepositorySearch.results.map((result) => ({ id: result.id, status: result.status, httpStatus: result.httpStatus, reason: result.reason || null })),
  interpretation: githubRepositorySearch.status === 'available'
    ? 'All fixed GitHub repository-search queries returned usable results.'
    : 'GitHub repository-search coverage is incomplete; unavailable queries must not be interpreted as zero results.',
};
const availability = { commonCrawl: commonCrawlAvailability, wayback: waybackAvailability, crawlerVerification: crawlerVerificationAvailability, distribution: distributionAvailability, servicesHk: servicesHkAvailability, githubRepositorySearch: githubRepositorySearchAvailability, domainCanonicalization: domainCanonicalizationAvailability };
const availabilityChanges = buildAvailabilityChanges(availability, previous?.availability);
const priorCounts = previous?.counts || {};
const metricForCrawlerObservation = (observation) => {
  const provider = {
    GPTBot: 'GptBot',
    'OAI-SearchBot': 'OaiSearchBot',
    Bingbot: 'Bing',
    Baiduspider: 'Baidu',
    Googlebot: 'Google',
    PerplexityBot: 'Perplexity',
    'Perplexity-User': 'Perplexity',
    CCBot: 'CommonCrawl',
    Applebot: 'Apple',
    YandexBot: 'Yandex',
    AhrefsBot: 'Ahrefs',
  }[observation.family];
  if (!provider) throw new Error(`Unsupported verified crawler family: ${observation.family}`);
  return `verified${provider}${observation.classification === 'candidate-page-crawl' ? 'Page' : 'DiscoveryFile'}Crawls`;
};
const currentEvidenceObservations = [
  ...(crawler.verifiedEvidenceObservations || []).map((observation) => ({ ...observation, metric: metricForCrawlerObservation(observation), evidenceClass: 'provider-verified-crawler' })),
  ...(crawler.userAgentOnlyEvidenceObservations || []).map((observation) => ({
    ...observation,
    metric: observation.classification === 'candidate-page-crawl' ? 'userAgentOnlyBytespiderPageCrawls' : 'userAgentOnlyBytespiderDiscoveryFileCrawls',
    evidenceClass: 'crawler-user-agent-only-identity-unverified',
  })),
  ...(referral.humanUnverifiedEvidenceObservations || []).map((observation) => ({
    ...observation,
    metric: observation.evidenceType.includes('ai-referrer') ? 'humanUnverifiedAiReferrerVisits' : 'humanUnverifiedTrackedVisits',
    evidenceClass: 'attributed-request-visitor-type-unverified',
  })),
  ...(commonCrawl.captures || []).map((observation) => ({ ...observation, metric: 'commonCrawlCaptures', evidenceClass: 'common-crawl-index-capture' })),
  ...(wayback.captures || []).map((observation) => ({ ...observation, metric: 'waybackCaptures', evidenceClass: 'wayback-public-index-capture' })),
];
const previouslySeen = new Set(previousSeenEvidence?.fingerprints || []);
const newEvidenceObservations = previousSeenEvidence
  ? currentEvidenceObservations.filter((observation) => !previouslySeen.has(observation.fingerprint))
  : [];
const newEvidenceByMetric = newEvidenceObservations.reduce((result, observation) => {
  result.set(observation.metric, (result.get(observation.metric) || 0) + 1);
  return result;
}, new Map());
const { counts, retentionAdjustments } = preserveAppendOnlyCrawlerCounts(retainedLogCounts, previous ? priorCounts : null, newEvidenceByMetric, Boolean(previousSeenEvidence));
const deltas = buildEvidenceDeltas(counts, previous ? priorCounts : null);
const newEvidence = [...newEvidenceByMetric].map(([metric, delta]) => ({ metric, delta, current: counts[metric] ?? null }));
const githubQuerySnapshot = (report) => (report?.results || [])
  .filter((result) => result.status === 'available')
  .map((result) => ({ id: result.id, query: result.query, totalCount: result.totalCount, firstPartyRepositoriesObserved: result.firstPartyRepositoriesObserved }))
  .sort((left, right) => left.id.localeCompare(right.id));
const currentGithubQueries = githubQuerySnapshot(githubRepositorySearch);
const previousCompleteGithubQueries = previous?.platformSearch?.status === 'available'
  ? previous.platformSearch.queries
  : previous?.platformSearch?.lastCompleteObservation?.queries;
const platformSearchChanged = githubRepositorySearch.status === 'available'
  && Array.isArray(previousCompleteGithubQueries)
  && JSON.stringify(currentGithubQueries) !== JSON.stringify(previousCompleteGithubQueries);
const platformSearchChanges = platformSearchChanged ? currentGithubQueries.map((current) => {
  const prior = previousCompleteGithubQueries.find((item) => item.id === current.id);
  return {
    id: current.id,
    previousTotalCount: prior?.totalCount ?? null,
    currentTotalCount: current.totalCount,
    previousFirstPartyRepositoriesObserved: prior?.firstPartyRepositoriesObserved || [],
    currentFirstPartyRepositoriesObserved: current.firstPartyRepositoriesObserved,
  };
}).filter((change) => JSON.stringify([change.previousTotalCount, change.previousFirstPartyRepositoriesObserved]) !== JSON.stringify([change.currentTotalCount, change.currentFirstPartyRepositoriesObserved])) : [];
const allSeenFingerprints = [...new Set([...(previousSeenEvidence?.fingerprints || []), ...currentEvidenceObservations.map((observation) => observation.fingerprint)])].sort();
const generatedAt = new Date().toISOString();
const eventKind = selectEvidenceEventKind({
  initializing: !previous || !eventHistoryExists,
  evidenceChanged: newEvidence.length > 0 || platformSearchChanged,
  availabilityChanged: availabilityChanges.length > 0,
});
const eventFile = eventKind ? `events/${generatedAt.replaceAll(':', '-')}-${eventKind}.json` : null;
const lastCompletePlatformSearch = githubRepositorySearch.status === 'available'
  ? { observedAt: githubRepositorySearch.generatedAt, queries: currentGithubQueries }
  : previous?.platformSearch?.status === 'available'
    ? { observedAt: previous.platformSearch.observedAt, queries: previous.platformSearch.queries }
    : previous?.platformSearch?.lastCompleteObservation || null;
const platformSearch = {
  provider: githubRepositorySearch.provider,
  status: githubRepositorySearch.status,
  observedAt: githubRepositorySearch.generatedAt,
  queries: currentGithubQueries,
  changed: platformSearchChanged,
  changes: platformSearchChanges,
  lastCompleteObservation: lastCompletePlatformSearch,
  evidenceBoundary: githubRepositorySearch.evidenceBoundary,
};
const normalizeUtcTime = (value) => String(value || '').replace(/\+00:00$/, 'Z');
const summarizeAttribution = (visit, { includeStatus = false } = {}) => ({
  time: normalizeUtcTime(visit.time),
  source: visit.source,
  referrerHost: visit.referrerHost || '',
  campaign: visit.campaign,
  landingPage: visit.path,
  ...(includeStatus ? { status: visit.status } : {}),
});
const recentHumanUnverifiedVisits = referral.recentHumanUnverifiedVisits || [];
const latestVerifiedOffsiteVisit = [...recentHumanUnverifiedVisits].reverse().find((visit) => visit.referrerHost);
const evidenceSets = {
  attributionCampaigns: Object.fromEntries(Object.entries(referral.byCampaign || {}).sort(([left], [right]) => left.localeCompare(right))),
  latestVerifiedOffsiteReferral: latestVerifiedOffsiteVisit ? summarizeAttribution(latestVerifiedOffsiteVisit, { includeStatus: true }) : null,
  latestVisitorTypeUnverifiedAttributions: recentHumanUnverifiedVisits.slice(-2).map((visit) => summarizeAttribution(visit)),
  promptVerifiedCrawledEvidenceUrls: [...(promptCoverage.verifiedCrawledEvidenceUrls || [])].sort(),
  promptSearchRelatedCrawledEvidenceUrls: [...(promptCoverage.searchRelatedCrawledEvidenceUrls || [])].sort(),
  waybackMissingEvidenceUrls: wayback.status === 'available'
    ? [...(wayback.promptCoverage?.missingEvidenceUrls || [])].sort()
    : [],
};
const summary = {
  schemaVersion: 1,
  generatedAt,
  since,
  sourceLogs: crawler.files,
  counts,
  retentionAdjustments,
  availability,
  availabilityChanges,
  deltas,
  newEvidence,
  platformSearch,
  initialized: !previous,
  changed: newEvidence.length > 0 || platformSearchChanged,
  availabilityChanged: availabilityChanges.length > 0,
  eventFile,
  newEvidenceObservations,
  evidenceSets,
  evidenceBoundary: 'Provider-verified crawler fingerprints are append-only observations: after a source log rotates out, their cumulative count is retained and any difference from the currently retained log set is exposed in retentionAdjustments. New provider-verified crawler fingerprints prove only previously unseen requests by the named crawler. Bytespider fingerprints are separately labeled user-agent-only and identity-unverified; they do not prove Doubao or ByteDance access. New referral fingerprints exclude suspected automation and prove only previously unseen attributed requests whose visitor type is not verified. Common Crawl fingerprints prove only appearance in the named public crawl index; Wayback fingerprints prove only public historical captures. GitHub repository-search changes prove only changes in that platform search. Partial or unavailable source queries make zero-valued counts incomplete. Availability-change events preserve monitoring-source status transitions and are not visibility evidence. None proves public-web indexing, AI retrieval, citation, ranking, a human visit, endorsement, or non-brand recommendation.',
};

if (eventFile) await atomicJson(eventFile, {
  schemaVersion: 1,
  kind: eventKind,
  summary,
  crawler,
  referral,
  commonCrawl,
  wayback,
  distribution,
  servicesHk,
  githubRepositorySearch,
  domainCanonicalization,
  promptCoverage,
});
await atomicJson('seen-evidence.json', {
  schemaVersion: 1,
  updatedAt: generatedAt,
  fingerprints: allSeenFingerprints,
  verifiedCrawlerObservations: cumulativeVerifiedCrawlerObservations,
});
await atomicJson('crawler-report.json', crawler);
await atomicJson('referral-report.json', referral);
await atomicJson('common-crawl-report.json', commonCrawl);
await atomicJson('wayback-report.json', wayback);
await atomicJson('distribution-live-report.json', distribution);
await atomicJson('services-hk-report.json', servicesHk);
await atomicJson('github-repository-search-report.json', githubRepositorySearch);
await atomicJson('domain-canonicalization-report.json', domainCanonicalization);
await atomicJson('prompt-crawl-coverage.json', promptCoverage);
await atomicJson('summary.json', summary);
console.log(JSON.stringify(summary, null, 2));

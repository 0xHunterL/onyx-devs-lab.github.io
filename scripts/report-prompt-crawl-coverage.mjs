import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);
const reportArg = args.find((arg) => arg.startsWith('--crawler-report='));
const matrixArg = args.find((arg) => arg.startsWith('--prompt-matrix='));

if (!reportArg) {
  console.error('Usage: npm run geo:prompt-crawl-coverage -- --crawler-report=/path/to/crawler-report.json [--prompt-matrix=/path/to/prompt-matrix.json]');
  process.exit(2);
}

const reportPath = path.resolve(root, reportArg.slice('--crawler-report='.length));
const matrixPath = matrixArg
  ? path.resolve(root, matrixArg.slice('--prompt-matrix='.length))
  : path.join(root, 'geo/prompt-matrix.json');
const [report, matrix] = await Promise.all([
  readFile(reportPath, 'utf8').then(JSON.parse),
  readFile(matrixPath, 'utf8').then(JSON.parse),
]);

const requiredVerificationFlags = ['verifyOpenAi', 'verifyBing', 'verifyGoogle', 'verifyPerplexity'];
const missingVerificationFlags = requiredVerificationFlags.filter((flag) => report[flag] !== true);
if (missingVerificationFlags.length) {
  console.error(`Crawler report must enable provider verification: ${missingVerificationFlags.join(', ')}`);
  process.exit(2);
}

if (!Array.isArray(report.verifiedContentPathCoverage)) {
  console.error('Crawler report is missing verifiedContentPathCoverage; regenerate it with the current geo:crawler-report script.');
  process.exit(2);
}

const searchRelatedFamilies = new Set(['OAI-SearchBot', 'Bingbot', 'Googlebot', 'PerplexityBot', 'Perplexity-User']);
const pathEvidence = new Map();

for (const entry of report.verifiedContentPathCoverage) {
  const urlPath = new URL(entry.path, matrix.site).pathname;
  pathEvidence.set(urlPath, {
    families: new Set(entry.families),
    firstSeen: entry.firstSeen,
    lastSeen: entry.lastSeen,
    requests: entry.requests,
  });
}

function evidenceFor(urlPath) {
  const found = pathEvidence.get(urlPath);
  if (!found) return null;
  const families = [...found.families].sort();
  return {
    url: `${matrix.site}${urlPath}`,
    families,
    searchRelatedFamilies: families.filter((family) => searchRelatedFamilies.has(family)),
    trainingFamilies: families.filter((family) => family === 'GPTBot'),
    firstSeen: found.firstSeen,
    lastSeen: found.lastSeen,
    requests: found.requests,
  };
}

const prompts = matrix.prompts.map((prompt) => {
  const evidencePages = prompt.evidenceUrls.map((urlPath) => ({
    url: `${matrix.site}${urlPath}`,
    verifiedCrawl: evidenceFor(urlPath),
  }));
  const verified = evidencePages.filter((item) => item.verifiedCrawl);
  const searchRelated = verified.filter((item) => item.verifiedCrawl.searchRelatedFamilies.length);
  return {
    id: prompt.id,
    segment: prompt.segment,
    prompt: prompt.prompt,
    evidencePages,
    coverage: {
      evidencePageCount: evidencePages.length,
      verifiedCrawledPageCount: verified.length,
      searchRelatedCrawledPageCount: searchRelated.length,
      anyVerifiedCrawl: verified.length > 0,
      fullyVerifiedCrawled: verified.length === evidencePages.length,
      anySearchRelatedCrawl: searchRelated.length > 0,
      fullySearchRelatedCrawled: searchRelated.length === evidencePages.length,
    },
    missingVerifiedCrawlUrls: evidencePages.filter((item) => !item.verifiedCrawl).map((item) => item.url),
    missingSearchRelatedCrawlUrls: evidencePages
      .filter((item) => !item.verifiedCrawl?.searchRelatedFamilies.length)
      .map((item) => item.url),
  };
});

const uniqueEvidencePaths = [...new Set(matrix.prompts.flatMap((prompt) => prompt.evidenceUrls))].sort();
const verifiedEvidencePaths = uniqueEvidencePaths.filter((urlPath) => pathEvidence.has(urlPath));
const searchRelatedEvidencePaths = uniqueEvidencePaths.filter((urlPath) =>
  [...(pathEvidence.get(urlPath)?.families || [])].some((family) => searchRelatedFamilies.has(family)),
);
const segmentNames = [...new Set(prompts.map((prompt) => prompt.segment))].sort();
const bySegment = Object.fromEntries(segmentNames.map((segment) => {
  const rows = prompts.filter((prompt) => prompt.segment === segment);
  return [segment, {
    prompts: rows.length,
    promptsWithAnyVerifiedCrawl: rows.filter((row) => row.coverage.anyVerifiedCrawl).length,
    promptsFullyVerifiedCrawled: rows.filter((row) => row.coverage.fullyVerifiedCrawled).length,
    promptsWithAnySearchRelatedCrawl: rows.filter((row) => row.coverage.anySearchRelatedCrawl).length,
    promptsFullySearchRelatedCrawled: rows.filter((row) => row.coverage.fullySearchRelatedCrawled).length,
  }];
}));

console.log(JSON.stringify({
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  site: matrix.site,
  promptMatrixSchemaVersion: matrix.schemaVersion,
  crawlerReport: {
    generatedAt: report.generatedAt,
    since: report.since,
    files: report.files,
    verification: Object.fromEntries(requiredVerificationFlags.map((flag) => [flag, report[flag]])),
  },
  evidenceBoundary: 'This report proves only that provider-verified crawlers requested mapped evidence pages. GPTBot is a training crawler. A verified crawl does not prove indexing, retrieval, citation, answer inclusion, ranking, or non-brand recommendation.',
  totals: {
    prompts: prompts.length,
    uniqueEvidencePages: uniqueEvidencePaths.length,
    verifiedCrawledEvidencePages: verifiedEvidencePaths.length,
    searchRelatedCrawledEvidencePages: searchRelatedEvidencePaths.length,
    promptsWithAnyVerifiedCrawl: prompts.filter((row) => row.coverage.anyVerifiedCrawl).length,
    promptsFullyVerifiedCrawled: prompts.filter((row) => row.coverage.fullyVerifiedCrawled).length,
    promptsWithAnySearchRelatedCrawl: prompts.filter((row) => row.coverage.anySearchRelatedCrawl).length,
    promptsFullySearchRelatedCrawled: prompts.filter((row) => row.coverage.fullySearchRelatedCrawled).length,
  },
  bySegment,
  verifiedCrawledEvidenceUrls: verifiedEvidencePaths.map((urlPath) => `${matrix.site}${urlPath}`),
  searchRelatedCrawledEvidenceUrls: searchRelatedEvidencePaths.map((urlPath) => `${matrix.site}${urlPath}`),
  missingVerifiedCrawlUrls: uniqueEvidencePaths.filter((urlPath) => !pathEvidence.has(urlPath)).map((urlPath) => `${matrix.site}${urlPath}`),
  missingSearchRelatedCrawlUrls: uniqueEvidencePaths.filter((urlPath) => !searchRelatedEvidencePaths.includes(urlPath)).map((urlPath) => `${matrix.site}${urlPath}`),
  prompts,
}, null, 2));

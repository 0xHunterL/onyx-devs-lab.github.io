import { fetchOffsiteResource } from './fetch-offsite-resource.mjs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { buildWaybackPromptCoverage, parseWaybackCdx } from './wayback-evidence.mjs';

const args = process.argv.slice(2);
const host = (args.find((arg) => arg.startsWith('--host=')) || '--host=hk.onyxdevslab.com').slice('--host='.length);
const promptMatrixPath = path.resolve((args.find((arg) => arg.startsWith('--prompt-matrix=')) || '--prompt-matrix=geo/prompt-matrix.json').slice('--prompt-matrix='.length));
if (!/^[a-z0-9.-]+$/i.test(host) || host.includes('..')) throw new Error('--host must be a hostname');
const promptMatrix = JSON.parse(await readFile(promptMatrixPath, 'utf8'));

const query = new URL('https://web.archive.org/cdx/search/cdx');
query.searchParams.set('url', `${host}/`);
query.searchParams.set('matchType', 'host');
query.searchParams.set('output', 'json');
query.searchParams.set('fl', 'timestamp,original,mimetype,statuscode,digest');
query.searchParams.append('filter', 'statuscode:200');
query.searchParams.append('filter', 'mimetype:text/html');
query.searchParams.set('limit', '1000');

let status = 'unavailable';
let httpStatus = null;
let attempts = 0;
let reason = null;
let parsed = { captures: [], totals: { captures: 0, distinctUrls: 0 }, firstCaptureAt: null, lastCaptureAt: null, query: query.href };
let promptCoverage = null;
try {
  const fetched = await fetchOffsiteResource('Wayback CDX', query.href, {
    attempts: 2,
    minimumBytes: 2,
    retryDelayMs: 500,
    timeoutMs: 20_000,
  });
  httpStatus = fetched.result.status;
  attempts = fetched.result.attempts;
  parsed = parseWaybackCdx(JSON.parse(fetched.body), { host, query: query.href });
  promptCoverage = buildWaybackPromptCoverage(parsed.captures, promptMatrix, { origin: `https://${host}/` });
  status = 'available';
} catch (error) {
  httpStatus = error.result?.status ?? httpStatus;
  attempts = error.result?.attempts ?? attempts;
  reason = error.message;
}

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  host,
  status,
  httpStatus,
  attempts,
  reason,
  ...parsed,
  promptCoverage,
  evidenceBoundary: 'A Wayback CDX record proves only that Internet Archive exposes the named historical capture in its public index. It does not prove current accessibility, search-engine indexing, AI retrieval, citation, ranking, endorsement, or recommendation. An unavailable query must not be interpreted as zero captures.',
}, null, 2));

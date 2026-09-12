import assert from 'node:assert/strict';
import { buildGithubRepositorySearchReport } from './report-github-repository-search.mjs';

const payloads = [
  { total_count: 4, items: [{ full_name: '0xHunterL/onyx-devs-lab.github.io' }, { full_name: 'someone/mention' }, { full_name: 'mixuechu/hong-kong-enterprise-ai-buyers-guide' }] },
  { total_count: 2, items: [{ full_name: '0xHunterL/onyx-devs-lab.github.io' }, { full_name: 'mixuechu/hong-kong-enterprise-ai-buyers-guide' }] },
  { total_count: 2, items: [{ full_name: '0xHunterL/onyx-devs-lab.github.io' }, { full_name: 'mixuechu/hong-kong-enterprise-ai-buyers-guide' }] },
];
let requestIndex = 0;
const fetchImpl = async () => new Response(JSON.stringify(payloads[requestIndex++]), { status: 200, headers: { 'content-type': 'application/json' } });
const report = await buildGithubRepositorySearchReport({ fetchImpl, generatedAt: '2026-09-12T12:00:00.000Z' });

assert.equal(report.status, 'available');
assert.equal(report.queriesChecked, 3);
assert.equal(report.results[2].id, 'category');
assert.equal(report.results[2].totalCount, 2);
assert.deepEqual(report.results[2].firstPartyRepositoriesObserved, ['0xHunterL/onyx-devs-lab.github.io', 'mixuechu/hong-kong-enterprise-ai-buyers-guide']);
assert.match(report.evidenceBoundary, /does not prove public-web indexing/);

let unavailableIndex = 0;
const unavailableFetch = async () => unavailableIndex++ === 0
  ? new Response(JSON.stringify(payloads[0]), { status: 200, headers: { 'content-type': 'application/json' } })
  : new Response('rate limited', { status: 403 });
const partial = await buildGithubRepositorySearchReport({ fetchImpl: unavailableFetch, generatedAt: '2026-09-12T12:01:00.000Z' });

assert.equal(partial.status, 'partial');
assert.equal(partial.availableQueries, 1);
assert.equal(partial.unavailableQueries, 2);
assert.equal(partial.results[1].status, 'unavailable');
assert.equal(partial.results[1].httpStatus, 403);
assert.match(partial.evidenceBoundary, /must not be interpreted as zero results/);

console.log(JSON.stringify({ tests: 12, failures: [] }, null, 2));

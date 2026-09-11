import assert from 'node:assert/strict';
import { buildWaybackPromptCoverage, parseWaybackCdx } from './wayback-evidence.mjs';

const query = 'https://web.archive.org/cdx/search/cdx?url=example.test%2F';
const parsed = parseWaybackCdx([
  ['timestamp', 'original', 'mimetype', 'statuscode', 'digest'],
  ['20260910120000', 'https://example.test/one/', 'text/html', '200', 'FIRST'],
  ['20260910110000', 'https://example.test/one/', 'text/html', '200', 'OLDER'],
  ['20260910130000', 'https://example.test/two/', 'text/html', '200', 'SECOND'],
], { host: 'example.test', query });

assert.equal(parsed.totals.captures, 3);
assert.equal(parsed.totals.distinctUrls, 2);
assert.equal(parsed.firstCaptureAt, '20260910110000');
assert.equal(parsed.lastCaptureAt, '20260910130000');
assert.equal(parsed.query, query);
assert.equal(parsed.captures[0].replayUrl, 'https://web.archive.org/web/20260910110000/https://example.test/one/');
assert.equal(parsed.captures[0].fingerprint.length, 64);
assert.notEqual(parsed.captures[0].fingerprint, parsed.captures[1].fingerprint);

const coverage = buildWaybackPromptCoverage(parsed.captures, {
  schemaVersion: 2,
  prompts: [
    { id: 'one', evidenceUrls: ['/one/'] },
    { id: 'mixed', evidenceUrls: ['/one/', '/missing/'] },
    { id: 'missing', evidenceUrls: ['/missing/'] },
  ],
}, { origin: 'https://example.test/' });
assert.equal(coverage.promptMatrixSchemaVersion, 2);
assert.equal(coverage.totals.prompts, 3);
assert.equal(coverage.totals.uniqueEvidencePages, 2);
assert.equal(coverage.totals.archivedEvidencePages, 1);
assert.equal(coverage.totals.promptsWithAnyArchivedEvidence, 2);
assert.equal(coverage.totals.promptsFullyArchived, 1);
assert.deepEqual(coverage.archivedEvidenceUrls, ['https://example.test/one/']);
assert.deepEqual(coverage.missingEvidenceUrls, ['https://example.test/missing/']);
assert.equal(coverage.prompts[1].hasAnyArchivedEvidence, true);
assert.equal(coverage.prompts[1].fullyArchived, false);
assert.match(coverage.evidenceBoundary, /does not prove/);

assert.throws(() => parseWaybackCdx({}, { host: 'example.test', query }), /tabular JSON array/);
assert.throws(() => parseWaybackCdx([['timestamp']], { host: 'example.test', query }), /missing original/);
assert.throws(() => parseWaybackCdx([
  ['timestamp', 'original', 'mimetype', 'statuscode', 'digest'],
  ['20260910120000', 'https://other.test/', 'text/html', '200', 'BAD'],
], { host: 'example.test', query }), /unexpected host/);
assert.throws(() => parseWaybackCdx([
  ['timestamp', 'original', 'mimetype', 'statuscode', 'digest'],
  ['20260910120000', 'https://example.test/', 'text/html', '404', 'BAD'],
], { host: 'example.test', query }), /outside the requested filters/);

console.log(JSON.stringify({ tests: 23, failures: [] }, null, 2));

import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { buildVerifiedCrawlerEvidenceObservations } from './crawler-evidence-observations.mjs';
import { isInIpPrefix } from './ip-prefix.mjs';

const execFileAsync = promisify(execFile);
const directory = await mkdtemp(path.join(tmpdir(), 'onyx-geo-crawler-test-'));
const logPath = path.join(directory, 'geo.log');
const records = [
  {
    time: '2026-09-11T09:00:00+00:00', clientIp: '203.0.113.20', method: 'GET',
    path: '/', status: 200, userAgent: 'Mozilla/5.0 (compatible; Bytespider/1.0)',
  },
  {
    time: '2026-09-11T09:00:01+00:00', clientIp: '203.0.113.20', method: 'GET',
    path: '/feed.json', status: 200, userAgent: 'Mozilla/5.0 (compatible; Bytespider/1.0)',
  },
  {
    time: '2026-09-11T09:00:02+00:00', clientIp: '203.0.113.20', method: 'GET',
    path: '/data/organization.json', status: 200, userAgent: 'Mozilla/5.0 (compatible; Bytespider/1.0)',
  },
  {
    time: '2026-09-11T09:00:03+00:00', clientIp: '203.0.113.21', method: 'GET',
    path: '/robots.txt', status: 200, userAgent: 'Onyx-GEO-Release-Check Bytespider',
  },
  {
    time: '2026-09-11T09:00:04+00:00', clientIp: '203.0.113.22', method: 'HEAD',
    path: '/zh-cn/methodology/ai-search-verification/', status: 200, userAgent: 'Bytespider',
  },
];

try {
  await writeFile(logPath, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);
  const { stdout } = await execFileAsync(process.execPath, [
    path.resolve('scripts/report-ai-crawlers.mjs'), '--since=2026-09-11', logPath,
  ], { cwd: path.resolve('.') });
  const report = JSON.parse(stdout);
  assert.equal(report.byFamily.Bytespider, 5);
  assert.equal(report.totals.syntheticReleaseChecks, 1);
  assert.equal(report.totals.nonContentMethodRequests, 1);
  assert.equal(report.totals.userAgentOnlyBytespiderPageCrawls, 1);
  assert.equal(report.totals.userAgentOnlyBytespiderDiscoveryFileCrawls, 2);
  assert.equal(report.userAgentOnlyEvidenceObservations.length, 3);
  assert.equal(report.userAgentOnlyEvidenceObservations[0].identityStatus, 'user-agent-only-unverified');
  assert.equal('ip' in report.userAgentOnlyEvidenceObservations[0], false);
  assert.deepEqual(report.userAgentOnlyEvidenceObservations.map((item) => item.path), ['/', '/feed.json', '/data/organization.json']);
  assert.equal(report.byClassification['non-content-request-method'], 1);
  assert.equal(report.recentCandidatePageCrawls.some((item) => item.method === 'HEAD'), false);
  const commonCrawlObservation = buildVerifiedCrawlerEvidenceObservations({
    pages: {
      commonCrawl: [{
        family: 'CCBot', classification: 'candidate-page-crawl', time: '2026-09-11T09:00:05+00:00',
        method: 'GET', path: '/zh-cn/', status: 200, ip: '192.0.2.10', userAgent: 'CCBot/2.0',
      }],
    },
    discoveryFiles: {},
  });
  assert.equal(commonCrawlObservation.length, 1);
  assert.equal(commonCrawlObservation[0].family, 'CCBot');
  assert.equal(commonCrawlObservation[0].classification, 'candidate-page-crawl');
  assert.equal('ip' in commonCrawlObservation[0], false);
  assert.equal('userAgent' in commonCrawlObservation[0], false);
  assert.equal(isInIpPrefix('3.41.188.39', '3.41.188.32/29'), true);
  assert.equal(isInIpPrefix('3.41.188.40', '3.41.188.32/29'), false);
  assert.equal(isInIpPrefix('2600:1f28:365:80ff::1', '2600:1f28:365:8000::/56'), true);
  assert.equal(isInIpPrefix('2600:1f28:365:8100::1', '2600:1f28:365:8000::/56'), false);
  assert.equal(isInIpPrefix('::ffff:3.41.188.39', '3.41.188.32/29'), true);
  assert.equal(isInIpPrefix('not-an-ip', '2600:1f28:365:8000::/56'), false);
  console.log(JSON.stringify({ tests: 22, failures: [] }, null, 2));
} finally {
  await rm(directory, { recursive: true, force: true });
}

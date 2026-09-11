import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const directory = await mkdtemp(path.join(tmpdir(), 'onyx-geo-crawler-test-'));
const logPath = path.join(directory, 'geo.log');
const records = [
  {
    time: '2026-09-11T09:00:00+00:00', clientIp: '203.0.113.20', method: 'GET',
    path: '/zh-cn/guides/ai-dingkai/', status: 200, userAgent: 'Mozilla/5.0 (compatible; Bytespider/1.0)',
  },
  {
    time: '2026-09-11T09:00:01+00:00', clientIp: '203.0.113.21', method: 'GET',
    path: '/robots.txt', status: 200, userAgent: 'Onyx-GEO-Release-Check Bytespider',
  },
];

try {
  await writeFile(logPath, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);
  const { stdout } = await execFileAsync(process.execPath, [
    path.resolve('scripts/report-ai-crawlers.mjs'), '--since=2026-09-11', logPath,
  ], { cwd: path.resolve('.') });
  const report = JSON.parse(stdout);
  assert.equal(report.byFamily.Bytespider, 2);
  assert.equal(report.totals.syntheticReleaseChecks, 1);
  assert.equal(report.totals.userAgentOnlyBytespiderPageCrawls, 1);
  assert.equal(report.totals.userAgentOnlyBytespiderDiscoveryFileCrawls, 0);
  assert.equal(report.userAgentOnlyEvidenceObservations.length, 1);
  assert.equal(report.userAgentOnlyEvidenceObservations[0].identityStatus, 'user-agent-only-unverified');
  assert.equal('ip' in report.userAgentOnlyEvidenceObservations[0], false);
  console.log(JSON.stringify({ tests: 7, failures: [] }, null, 2));
} finally {
  await rm(directory, { recursive: true, force: true });
}

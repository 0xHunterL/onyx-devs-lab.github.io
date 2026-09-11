import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const directory = await mkdtemp(path.join(tmpdir(), 'onyx-geo-referral-test-'));
const logPath = path.join(directory, 'geo.log');
const campaignPath = '/zh-cn/guides/ai-consulting-vs-development-vs-fde/?utm_source=github_discussions&utm_medium=referral&utm_campaign=geo_engagement_model_qa';
const periodicUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
const periodicPaths = [
  '/zh-cn/guides/enterprise-ai-agent-erp-integration/',
  '/zh-cn/case-studies/accounting-ai-production-platform/',
  '/zh-cn/case-studies/retail-ai-decision-platform/',
  '/zh-cn/case-studies/legal-ai-evidence-workflow/',
  '/',
  '/zh-cn/methodology/enterprise-ai-evaluation/',
  '/zh-cn/methodology/ai-search-verification/',
  '/zh-cn/methodology/case-study-evidence-register/',
].map((pathname) => `${pathname}?utm_source=github_pages&utm_medium=referral&utm_campaign=geo_buyers_guide_scenarios`);
const events = [
  {
    time: '2026-09-11T08:21:34+00:00',
    clientIp: '205.169.39.15',
    path: campaignPath,
    status: 200,
    referrerHost: 'bing.com',
    userAgent: 'Mozilla/5.0 Chrome/117.0.5938.132 Safari/537.36',
  },
  {
    time: '2026-09-11T08:22:34+00:00',
    clientIp: '203.0.113.9',
    path: campaignPath,
    status: 200,
    referrerHost: '',
    userAgent: 'Mozilla/5.0 Chrome/117.0.5938.132 Safari/537.36',
  },
  {
    time: '2026-09-11T08:23:34+00:00',
    clientIp: '205.169.39.15',
    proxyIp: '203.0.113.50',
    path: campaignPath,
    status: 200,
    referrerHost: '',
    userAgent: 'Mozilla/5.0 Chrome/117.0.5938.132 Safari/537.36',
  },
  {
    time: '2026-09-11T08:24:34+00:00',
    clientIp: '203.0.113.10',
    path: campaignPath,
    status: 200,
    referrerHost: '',
    userAgent: 'Onyx-GEO-Distribution-Check/1.0',
  },
  ...periodicPaths.map((eventPath, index) => ({
    time: new Date(Date.parse('2026-09-11T09:00:00Z') + index * 10 * 60_000).toISOString(),
    clientIp: `198.51.100.${index + 1}`,
    path: eventPath,
    status: 200,
    referrerHost: '',
    userAgent: periodicUserAgent,
  })),
];

try {
  await writeFile(logPath, `${events.map((event) => JSON.stringify(event)).join('\n')}\n`);
  const { stdout } = await execFileAsync(process.execPath, [
    path.resolve('scripts/report-geo-referrals.mjs'),
    '--since=2026-09-11',
    logPath,
  ], { cwd: path.resolve('.') });
  const report = JSON.parse(stdout);
  assert.equal(report.trackedVisits, 11);
  assert.equal(report.suspectedAutomatedTrackedVisits, 9);
  assert.equal(report.humanUnverifiedTrackedVisits, 2);
  assert.equal(report.knownLinkScannerTrackedVisits, 1);
  assert.equal(report.knownLinkScannerUserAgentVisits, 0);
  assert.equal(report.knownLinkScannerNetworkVisits, 1);
  assert.equal(report.syntheticTrackedVisits, 1);
  assert.equal(report.recentHumanUnverifiedVisits[0].scannerNetwork, null);
  assert.equal(report.recentVisits[0].scannerNetwork, 'Palo Alto Networks URL scanner');
  assert.equal(report.recentVisits[2].scannerNetwork, null);
  assert.equal(report.suspectedPeriodicAutomation.length, 1);
  assert.equal(report.suspectedPeriodicAutomation[0].requests, 8);
  assert.equal(report.suspectedPeriodicAutomation[0].distinctLandingPages, 8);
  assert.equal(report.suspectedPeriodicAutomation[0].distinctClients, 8);
  assert.equal(report.suspectedPeriodicAutomation[0].periodicIntervals, 7);
  assert.match(report.caveat, /periodic rotating-client patterns/);
  console.log(JSON.stringify({ tests: 15, failures: [] }, null, 2));
} finally {
  await rm(directory, { recursive: true, force: true });
}

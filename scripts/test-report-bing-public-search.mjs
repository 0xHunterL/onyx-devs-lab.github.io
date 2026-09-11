import assert from 'node:assert/strict';
import { runBingPublicSearchChecks, summarizeBingRss } from './report-bing-public-search.mjs';

const rss = '<?xml version="1.0"?><rss version="2.0"><channel><title>Bing: &quot;Onyx Devs Lab&quot;</title><item><title>Official</title><link>https://hk.onyxdevslab.com/</link></item><item><title>Other</title><link>https://example.com/?a=1&amp;b=2</link></item></channel></rss>';
const summary = summarizeBingRss(rss, { targetPrefix: 'https://hk.onyxdevslab.com/' });
assert.equal(summary.queryEcho, 'Bing: "Onyx Devs Lab"');
assert.equal(summary.resultCountObserved, 2);
assert.equal(summary.targetObserved, true);
assert.match(summary.resultUrlSetSha256, /^[a-f0-9]{64}$/);
assert.throws(() => summarizeBingRss('<html></html>', { targetPrefix: 'https://example.com/' }), /response-is-not-bing-rss/);
const spoofedHostRss = '<rss><channel><title>Bing: test</title><item><link>https://hk.onyxdevslab.com.evil.example/</link></item></channel></rss>';
assert.equal(summarizeBingRss(spoofedHostRss, { targetPrefix: 'https://hk.onyxdevslab.com/' }).targetObserved, false);

const report = await runBingPublicSearchChecks({
  checks: [{ id: 'brand', query: '"Onyx Devs Lab"', targetPrefix: 'https://hk.onyxdevslab.com/' }],
  checkedAt: '2026-09-11T11:38:00.000Z',
  fetchImpl: async () => ({ ok: true, status: 200, text: async () => rss }),
});
assert.equal(report.totals.checks, 1);
assert.equal(report.totals.available, 1);
assert.equal(report.totals.targetsObserved, 1);
assert.equal(report.checks[0].httpStatus, 200);
assert.equal(report.checks[0].sourceUrl, 'https://www.bing.com/search?format=rss&q=%22Onyx+Devs+Lab%22');

const unavailable = await runBingPublicSearchChecks({
  checks: [{ id: 'brand', query: 'x', targetPrefix: 'https://hk.onyxdevslab.com/' }],
  fetchImpl: async () => { throw new Error('simulated timeout'); },
});
assert.equal(unavailable.totals.unavailable, 1);
assert.equal(unavailable.checks[0].targetObserved, null);
assert.equal(unavailable.checks[0].reason, 'simulated timeout');

console.log(JSON.stringify({ tests: 14, failures: [] }, null, 2));

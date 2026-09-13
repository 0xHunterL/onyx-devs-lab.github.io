import assert from 'node:assert/strict';
import { buildDomainCanonicalizationReport, evaluateRedirectChain, traceRedirectChain } from './check-domain-canonicalization.mjs';

const response = (status, { location = null, body = '', server = 'cloudflare', cfRay = 'test-SIN' } = {}) => ({
  status,
  headers: new Headers({ ...(location ? { location } : {}), ...(server ? { server } : {}), ...(cfRay ? { 'cf-ray': cfRay } : {}) }),
  text: async () => body,
});
const canonicalBody = '<html><head><link rel="canonical" href="https://hk.onyxdevslab.com/"></head></html>';

const routes = new Map([
  ['http://example.test/', response(301, { location: 'https://example.test/' })],
  ['https://example.test/', response(200, { body: canonicalBody })],
]);
const trace = await traceRedirectChain('http://example.test/', { fetchImpl: async (url) => routes.get(url), attempts: 1 });
assert.equal(trace.hops.length, 2);
assert.equal(trace.finalUrl, 'https://example.test/');
assert.equal(trace.canonical, 'https://hk.onyxdevslab.com/');
assert.equal(evaluateRedirectChain(trace).status, 'compliant');

const directHttp = evaluateRedirectChain({ startUrl: 'http://example.test/', finalUrl: 'http://example.test/', finalStatus: 200, canonical: 'https://hk.onyxdevslab.com/', hops: [{ url: 'http://example.test/', status: 200, location: null }] });
assert.equal(directHttp.status, 'noncompliant');
assert.ok(directHttp.reasons.includes('http-serves-content-without-redirect'));

const downgrade = evaluateRedirectChain({ startUrl: 'https://www.example.test/', finalUrl: 'http://example.test/', finalStatus: 200, canonical: 'https://hk.onyxdevslab.com/', hops: [{ url: 'https://www.example.test/', status: 301, location: 'http://example.test/' }, { url: 'http://example.test/', status: 200, location: null }] });
assert.equal(downgrade.status, 'noncompliant');
assert.ok(downgrade.reasons.includes('https-downgrade-observed'));

const wrongCanonical = evaluateRedirectChain({ startUrl: 'https://example.test/', finalUrl: 'https://example.test/', finalStatus: 200, canonical: 'https://example.test/', hops: [{ url: 'https://example.test/', status: 200, location: null }] });
assert.equal(wrongCanonical.status, 'noncompliant');
assert.ok(wrongCanonical.reasons.includes('canonical-target-mismatch'));

const report = await buildDomainCanonicalizationReport({
  targets: [{ id: 'one', url: 'http://example.test/' }, { id: 'two', url: 'https://example.test/' }],
  fetchImpl: async (url) => routes.get(url),
  resolveNsImpl: async () => ['trey.ns.cloudflare.com.', 'piper.ns.cloudflare.com'],
});
assert.equal(report.schemaVersion, 2);
assert.equal(report.status, 'compliant');
assert.equal(report.compliantTargets, 2);
assert.equal(report.noncompliantTargets, 0);
assert.deepEqual(report.authorityObservation.nameServers, ['piper.ns.cloudflare.com', 'trey.ns.cloudflare.com']);
assert.equal(report.authorityObservation.cloudflareNameservers, true);
assert.equal(report.edgeObservation.cloudflareSignaledTargets, 2);
assert.equal(report.edgeObservation.allTargetsCloudflareSignaled, true);
assert.match(report.evidenceBoundary, /does not change/);

const unavailable = await buildDomainCanonicalizationReport({
  targets: [{ id: 'offline', url: 'https://offline.test/' }],
  fetchImpl: async () => { throw new Error('offline'); },
  resolveNsImpl: async () => { throw new Error('dns offline'); },
});
assert.equal(unavailable.status, 'unavailable');
assert.equal(unavailable.unavailableTargets, 1);
assert.equal(unavailable.authorityObservation.status, 'unavailable');

console.log(JSON.stringify({ tests: 25, failures: [] }, null, 2));

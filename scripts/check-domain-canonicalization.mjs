import path from 'node:path';
import { fileURLToPath } from 'node:url';

const canonicalOrigin = 'https://hk.onyxdevslab.com/';
const defaultTargets = [
  { id: 'http-apex', url: 'http://onyxdevslab.com/' },
  { id: 'https-apex', url: 'https://onyxdevslab.com/' },
  { id: 'http-www', url: 'http://www.onyxdevslab.com/' },
  { id: 'https-www', url: 'https://www.onyxdevslab.com/' },
  { id: 'http-hk', url: 'http://hk.onyxdevslab.com/' },
  { id: 'https-hk', url: canonicalOrigin },
];

function canonicalFromHtml(body) {
  const match = String(body || '').match(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>|<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']canonical["'][^>]*>/i);
  return match?.[1] || match?.[2] || null;
}

async function fetchWithRetry(url, { fetchImpl, attempts, timeoutMs, userAgent }) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetchImpl(url, {
        redirect: 'manual',
        headers: { 'user-agent': userAgent },
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export async function traceRedirectChain(startUrl, {
  fetchImpl = fetch,
  attempts = 2,
  timeoutMs = 15_000,
  maxRedirects = 6,
  userAgent = 'Onyx-GEO-Domain-Canonicalization-Check/1.0',
} = {}) {
  const hops = [];
  let currentUrl = startUrl;
  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    const response = await fetchWithRetry(currentUrl, { fetchImpl, attempts, timeoutMs, userAgent });
    const locationHeader = response.headers.get('location');
    const location = locationHeader ? new URL(locationHeader, currentUrl).href : null;
    hops.push({ url: currentUrl, status: response.status, location });
    if (response.status < 300 || response.status >= 400 || !location) {
      const body = await response.text();
      return { startUrl, finalUrl: currentUrl, finalStatus: response.status, canonical: canonicalFromHtml(body), hops };
    }
    currentUrl = location;
  }
  throw new Error(`${startUrl}: exceeded ${maxRedirects} redirects`);
}

export function evaluateRedirectChain(trace, { expectedCanonical = canonicalOrigin } = {}) {
  const startProtocol = new URL(trace.startUrl).protocol;
  const finalProtocol = new URL(trace.finalUrl).protocol;
  const redirectLocations = trace.hops.map((hop) => hop.location).filter(Boolean);
  const insecureRedirectObserved = redirectLocations.some((location) => new URL(location).protocol !== 'https:');
  const startsOnHttpWithoutRedirect = startProtocol === 'http:' && trace.hops.length === 1;
  const httpsDowngradeObserved = startProtocol === 'https:' && trace.hops.some((hop, index) => index > 0 && new URL(hop.url).protocol !== 'https:');
  const canonicalMatches = trace.canonical === expectedCanonical;
  const compliant = trace.finalStatus >= 200
    && trace.finalStatus < 300
    && finalProtocol === 'https:'
    && !startsOnHttpWithoutRedirect
    && !insecureRedirectObserved
    && !httpsDowngradeObserved
    && canonicalMatches;
  const reasons = [
    ...(startsOnHttpWithoutRedirect ? ['http-serves-content-without-redirect'] : []),
    ...(insecureRedirectObserved ? ['redirect-target-uses-http'] : []),
    ...(httpsDowngradeObserved ? ['https-downgrade-observed'] : []),
    ...(finalProtocol !== 'https:' ? ['final-url-is-not-https'] : []),
    ...(!(trace.finalStatus >= 200 && trace.finalStatus < 300) ? ['final-response-is-not-successful'] : []),
    ...(!canonicalMatches ? ['canonical-target-mismatch'] : []),
  ];
  return { ...trace, status: compliant ? 'compliant' : 'noncompliant', reasons };
}

export async function buildDomainCanonicalizationReport({ targets = defaultTargets, fetchImpl = fetch } = {}) {
  const results = [];
  for (const target of targets) {
    try {
      const trace = await traceRedirectChain(target.url, { fetchImpl });
      results.push({ id: target.id, ...evaluateRedirectChain(trace) });
    } catch (error) {
      results.push({ id: target.id, startUrl: target.url, finalUrl: null, finalStatus: null, canonical: null, hops: [], status: 'unavailable', reasons: ['request-failed'], error: error instanceof Error ? error.message : String(error) });
    }
  }
  const compliantTargets = results.filter((result) => result.status === 'compliant').length;
  const unavailableTargets = results.filter((result) => result.status === 'unavailable').length;
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    canonicalOrigin,
    status: compliantTargets === results.length ? 'compliant' : unavailableTargets === results.length ? 'unavailable' : 'noncompliant',
    targetsChecked: results.length,
    compliantTargets,
    noncompliantTargets: results.length - compliantTargets - unavailableTargets,
    unavailableTargets,
    results,
    evidenceBoundary: 'This report tests live redirect chains and HTML canonical targets. It does not change GitHub Pages, DNS, TLS, CDN, or Cloudflare settings, and a compliant result does not prove search indexing, ranking, AI citation, or recommendation.',
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = await buildDomainCanonicalizationReport();
  console.log(JSON.stringify(report, null, 2));
  if (process.argv.includes('--require-compliant') && report.status !== 'compliant') process.exitCode = 1;
}

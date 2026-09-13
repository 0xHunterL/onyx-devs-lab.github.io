import path from 'node:path';
import { resolveNs } from 'node:dns/promises';
import { fileURLToPath } from 'node:url';

const canonicalOrigin = 'https://hk.onyxdevslab.com/';
const authorityDomain = 'onyxdevslab.com';
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

function noindexFromHtml(body) {
  return [...String(body || '').matchAll(/<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["']([^"']+)["'][^>]*>|<meta\b[^>]*\bcontent=["']([^"']+)["'][^>]*\bname=["']robots["'][^>]*>/gi)]
    .some((match) => String(match[1] || match[2] || '').split(',').map((value) => value.trim().toLowerCase()).includes('noindex'));
}

function metaRefreshFromHtml(body, baseUrl) {
  const match = String(body || '').match(/<meta\b[^>]*\bhttp-equiv=["']refresh["'][^>]*\bcontent=["'][^"']*?url=([^"']+)["'][^>]*>|<meta\b[^>]*\bcontent=["'][^"']*?url=([^"']+)["'][^>]*\bhttp-equiv=["']refresh["'][^>]*>/i);
  const value = match?.[1] || match?.[2] || null;
  if (!value) return null;
  try {
    return new URL(value.trim(), baseUrl).href;
  } catch {
    return null;
  }
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
    hops.push({
      url: currentUrl,
      status: response.status,
      location,
      edgeServer: response.headers.get('server') || null,
      cfRayPresent: Boolean(response.headers.get('cf-ray')),
    });
    if (response.status < 300 || response.status >= 400 || !location) {
      const body = await response.text();
      return {
        startUrl,
        finalUrl: currentUrl,
        finalStatus: response.status,
        canonical: canonicalFromHtml(body),
        robotsNoindex: noindexFromHtml(body),
        metaRefreshTarget: metaRefreshFromHtml(body, currentUrl),
        hops,
      };
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
  const finalUrlMatchesCanonical = new URL(trace.finalUrl).href === expectedCanonical;
  const clientRedirectMitigationApplied = canonicalMatches
    && trace.robotsNoindex === true
    && trace.metaRefreshTarget === expectedCanonical;
  const compliant = trace.finalStatus >= 200
    && trace.finalStatus < 300
    && finalProtocol === 'https:'
    && !startsOnHttpWithoutRedirect
    && !insecureRedirectObserved
    && !httpsDowngradeObserved
    && canonicalMatches
    && finalUrlMatchesCanonical;
  const reasons = [
    ...(startsOnHttpWithoutRedirect ? ['http-serves-content-without-redirect'] : []),
    ...(insecureRedirectObserved ? ['redirect-target-uses-http'] : []),
    ...(httpsDowngradeObserved ? ['https-downgrade-observed'] : []),
    ...(finalProtocol !== 'https:' ? ['final-url-is-not-https'] : []),
    ...(!(trace.finalStatus >= 200 && trace.finalStatus < 300) ? ['final-response-is-not-successful'] : []),
    ...(!canonicalMatches ? ['canonical-target-mismatch'] : []),
    ...(!finalUrlMatchesCanonical ? ['final-url-is-not-canonical-origin'] : []),
  ];
  return {
    ...trace,
    status: compliant ? 'compliant' : 'noncompliant',
    reasons,
    mitigation: {
      status: !compliant && clientRedirectMitigationApplied ? 'applied' : 'absent',
      mechanism: !compliant && clientRedirectMitigationApplied ? 'noindex-canonical-meta-refresh' : null,
      limitation: !compliant && clientRedirectMitigationApplied
        ? 'Client-side suppression and navigation do not replace an HTTP 301 or 308 redirect.'
        : null,
    },
  };
}

export async function buildDomainCanonicalizationReport({ targets = defaultTargets, fetchImpl = fetch, resolveNsImpl = resolveNs } = {}) {
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
  const mitigatedTargets = results.filter((result) => result.status === 'noncompliant' && result.mitigation?.status === 'applied').length;
  const unavailableTargets = results.filter((result) => result.status === 'unavailable').length;
  let authorityObservation;
  try {
    const nameServers = [...new Set((await resolveNsImpl(authorityDomain)).map((value) => String(value).toLowerCase().replace(/\.$/, '')))].sort();
    authorityObservation = {
      status: 'available',
      domain: authorityDomain,
      nameServers,
      cloudflareNameservers: nameServers.length > 0 && nameServers.every((value) => value.endsWith('.ns.cloudflare.com')),
    };
  } catch (error) {
    authorityObservation = {
      status: 'unavailable',
      domain: authorityDomain,
      nameServers: [],
      cloudflareNameservers: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
  const cloudflareSignaledTargets = results.filter((result) => result.hops.some((hop) => hop.edgeServer?.toLowerCase() === 'cloudflare' && hop.cfRayPresent)).length;
  return {
    schemaVersion: 3,
    generatedAt: new Date().toISOString(),
    canonicalOrigin,
    status: compliantTargets === results.length ? 'compliant' : unavailableTargets === results.length ? 'unavailable' : 'noncompliant',
    targetsChecked: results.length,
    compliantTargets,
    mitigatedTargets,
    noncompliantTargets: results.length - compliantTargets - unavailableTargets,
    unavailableTargets,
    authorityObservation,
    edgeObservation: {
      targetsChecked: results.length,
      cloudflareSignaledTargets,
      allTargetsCloudflareSignaled: results.length > 0 && cloudflareSignaledTargets === results.length,
      signal: 'HTTP Server header equals cloudflare and CF-Ray is present on at least one hop',
    },
    results,
    evidenceBoundary: 'This report tests live redirect chains, final canonical-origin arrival, HTML canonical targets, client-side noindex/meta-refresh mitigation, authoritative nameserver resolution, and public Cloudflare edge-header signals. A mitigation result is weaker than an HTTP 301 or 308 and does not make an alternate origin compliant. Nameserver and response-header observations identify the current delivery path but do not prove which rule caused a redirect or grant configuration access. The report does not change GitHub Pages, DNS, TLS, CDN, or Cloudflare settings, and a compliant result does not prove search indexing, ranking, AI citation, or recommendation.',
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = await buildDomainCanonicalizationReport();
  console.log(JSON.stringify(report, null, 2));
  if (process.argv.includes('--require-compliant') && report.status !== 'compliant') process.exitCode = 1;
}

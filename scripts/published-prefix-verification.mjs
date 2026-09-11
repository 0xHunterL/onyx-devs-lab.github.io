import { isInIpPrefix } from './ip-prefix.mjs';

export async function fetchPublishedIpPrefixes(url, {
  fetchImpl = fetch,
  attempts = 2,
  timeoutMs = 10_000,
} = {}) {
  let lastFailure = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        signal: AbortSignal.timeout(timeoutMs),
        headers: { 'User-Agent': 'Onyx-GEO-Crawler-Verifier/1.0' },
      });
      if (!response.ok) {
        lastFailure = { httpStatus: response.status, reason: `HTTP ${response.status}` };
        continue;
      }
      const body = await response.json();
      const prefixes = Array.isArray(body.prefixes)
        ? body.prefixes.flatMap((entry) => [entry.ipv4Prefix, entry.ipv6Prefix]).filter(Boolean)
        : [];
      if (!prefixes.length) {
        lastFailure = { httpStatus: response.status, reason: 'published prefix list is empty or malformed' };
        continue;
      }
      return { url, status: 'available', httpStatus: response.status, attempts: attempt, prefixCount: prefixes.length, prefixes };
    } catch (error) {
      lastFailure = { httpStatus: null, reason: error.message };
    }
  }
  return { url, status: 'unavailable', attempts, prefixCount: 0, prefixes: [], ...lastFailure };
}

export function applyPublishedPrefixVerification(events, family, source, verifiedReason) {
  for (const event of events) {
    if (event.family !== family) continue;
    if (source.status !== 'available') {
      event.providerVerified = null;
      event.providerVerification = {
        method: 'published-ip-prefix',
        verified: null,
        verificationUnavailable: true,
        reason: 'published-ip-prefix-list-unavailable',
        sourceReason: source.reason,
      };
      continue;
    }
    event.providerVerified = source.prefixes.some((prefix) => isInIpPrefix(event.ip, prefix));
    event.providerVerification = {
      method: 'published-ip-prefix',
      verified: event.providerVerified,
      reason: event.providerVerified ? verifiedReason : 'not-in-official-provider-ip-range',
    };
  }
}

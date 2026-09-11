import { createHash } from 'node:crypto';

const fingerprint = (event) => createHash('sha256').update([
  event.family,
  event.classification,
  event.time,
  event.method,
  event.path,
  event.status,
  event.ip,
].join('\u0000')).digest('hex');

const publicObservation = (event) => ({
  fingerprint: fingerprint(event),
  family: event.family,
  classification: event.classification,
  time: event.time,
  method: event.method,
  path: event.path,
  status: event.status,
});

export function buildVerifiedCrawlerEvidenceObservations({ pages, discoveryFiles }) {
  return [...Object.values(pages).flat(), ...Object.values(discoveryFiles).flat()]
    .map(publicObservation)
    .sort((a, b) => a.time.localeCompare(b.time) || a.fingerprint.localeCompare(b.fingerprint));
}

export function buildUserAgentOnlyCrawlerEvidenceObservations(events) {
  return events.map((event) => ({
    ...publicObservation(event),
    identityStatus: 'user-agent-only-unverified',
  })).sort((a, b) => a.time.localeCompare(b.time) || a.fingerprint.localeCompare(b.fingerprint));
}

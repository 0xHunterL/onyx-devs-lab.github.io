import fs from 'node:fs';
import { fetchOffsiteResource } from './fetch-offsite-resource.mjs';

const manifestPath = 'geo/distribution-manifest.json';
const reportOnly = process.argv.includes('--report');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const published = (manifest.items || []).filter((item) => item.status === 'published');
const failures = [];
const results = [];

async function request(kind, item, url) {
  try {
    const { body, result } = await fetchOffsiteResource(`${item.id}: ${kind}`, url, {
      attempts: 3,
      retryDelayMs: 250,
      timeoutMs: 15_000,
      userAgent: 'Onyx-GEO-Release-Check Distribution/1.0',
    });
    const requested = new URL(url);
    const final = new URL(result.finalUrl);
    const sameDestination = requested.hostname === final.hostname && requested.pathname === final.pathname && requested.search === final.search;
    let actualMissingMarkers = [];
    if (kind === 'publicUrl') {
      actualMissingMarkers = (item.publicContentMarkers || []).filter((marker) => !body.includes(marker));
    }
    results.push({ kind, itemId: item.id, url, finalUrl: result.finalUrl, status: result.status, attempts: result.attempts, sameDestination, missingMarkers: actualMissingMarkers });
    if (!sameDestination) failures.push(`${item.id}: ${kind} redirected away from the declared destination: ${url} -> ${result.finalUrl}`);
    if (actualMissingMarkers.length) failures.push(`${item.id}: publicUrl is missing markers: ${actualMissingMarkers.join(', ')}`);
  } catch (error) {
    results.push({ kind, itemId: item.id, url, status: 'unavailable', reason: error.message });
    failures.push(`${item.id}: ${kind} unavailable: ${url}: ${error.message}`);
  }
}

await Promise.all(published.flatMap((item) => [
  request('publicUrl', item, item.publicUrl),
  ...(item.trackedTargets || []).map((url) => request('trackedTarget', item, url)),
]));

const report = {
  manifestPath,
  generatedAt: new Date().toISOString(),
  publishedItems: published.length,
  publicUrlsChecked: results.filter((result) => result.kind === 'publicUrl').length,
  trackedTargetsChecked: results.filter((result) => result.kind === 'trackedTarget').length,
  results,
  failures,
  evidenceBoundary: 'Anonymous HTTP success proves publication and link reachability only. It does not prove search indexing, AI retrieval, citation, recommendation, a human visit, or independent endorsement.',
};
console.log(JSON.stringify(report, null, 2));
if (failures.length && !reportOnly) process.exit(1);

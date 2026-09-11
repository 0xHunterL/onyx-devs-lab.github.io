import fs from 'node:fs';

const manifestPath = 'geo/distribution-manifest.json';
const reportOnly = process.argv.includes('--report');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const published = (manifest.items || []).filter((item) => item.status === 'published');
const failures = [];
const results = [];

async function request(kind, item, url) {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
      headers: { 'User-Agent': 'Onyx-GEO-Release-Check Distribution/1.0' },
    });
    const requested = new URL(url);
    const final = new URL(response.url);
    const sameDestination = requested.hostname === final.hostname && requested.pathname === final.pathname && requested.search === final.search;
    let actualMissingMarkers = [];
    if (kind === 'publicUrl' && response.ok) {
      const body = await response.text();
      actualMissingMarkers = (item.publicContentMarkers || []).filter((marker) => !body.includes(marker));
    }
    results.push({ kind, itemId: item.id, url, finalUrl: response.url, status: response.status, sameDestination, missingMarkers: actualMissingMarkers });
    if (!response.ok) failures.push(`${item.id}: ${kind} returned HTTP ${response.status}: ${url}`);
    if (!sameDestination) failures.push(`${item.id}: ${kind} redirected away from the declared destination: ${url} -> ${response.url}`);
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

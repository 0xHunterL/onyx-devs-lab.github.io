import fs from 'node:fs';

const manifestPath = 'geo/distribution-manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const published = (manifest.items || []).filter((item) => item.status === 'published');
const failures = [];
const results = [];

async function request(kind, itemId, url) {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
      headers: { 'User-Agent': 'Onyx-GEO-Release-Check Distribution/1.0' },
    });
    results.push({ kind, itemId, url, finalUrl: response.url, status: response.status });
    if (!response.ok) failures.push(`${itemId}: ${kind} returned HTTP ${response.status}: ${url}`);
  } catch (error) {
    results.push({ kind, itemId, url, status: 'unavailable', reason: error.message });
    failures.push(`${itemId}: ${kind} unavailable: ${url}: ${error.message}`);
  }
}

await Promise.all(published.flatMap((item) => [
  request('publicUrl', item.id, item.publicUrl),
  ...(item.trackedTargets || []).map((url) => request('trackedTarget', item.id, url)),
]));

console.log(JSON.stringify({
  manifestPath,
  generatedAt: new Date().toISOString(),
  publishedItems: published.length,
  publicUrlsChecked: results.filter((result) => result.kind === 'publicUrl').length,
  trackedTargetsChecked: results.filter((result) => result.kind === 'trackedTarget').length,
  results,
  failures,
  evidenceBoundary: 'Anonymous HTTP success proves publication and link reachability only. It does not prove search indexing, AI retrieval, citation, recommendation, a human visit, or independent endorsement.',
}, null, 2));
if (failures.length) process.exit(1);

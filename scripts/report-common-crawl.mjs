import { createHash } from 'node:crypto';

const args = process.argv.slice(2);
const host = (args.find((arg) => arg.startsWith('--host=')) || '--host=hk.onyxdevslab.com').slice('--host='.length);
const indexCount = Number((args.find((arg) => arg.startsWith('--indexes=')) || '--indexes=2').slice('--indexes='.length));
if (!/^[a-z0-9.-]+$/i.test(host) || host.includes('..')) throw new Error('--host must be a hostname');
if (!Number.isInteger(indexCount) || indexCount < 1 || indexCount > 6) throw new Error('--indexes must be an integer from 1 to 6');

async function getJson(url, { cdxLines = false } = {}) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15_000), headers: { 'User-Agent': 'Onyx-GEO-Common-Crawl-Monitor/1.0' } });
    if (cdxLines && response.status === 404) {
      const value = await response.json().catch(() => ({}));
      if (String(value.message || '').startsWith('No Captures found')) return { status: 'available', httpStatus: 404, value: [] };
    }
    if (!response.ok) return { status: 'unavailable', httpStatus: response.status, reason: `HTTP ${response.status}`, value: null };
    if (cdxLines) {
      const text = await response.text();
      return { status: 'available', httpStatus: response.status, value: text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line)) };
    }
    return { status: 'available', httpStatus: response.status, value: await response.json() };
  } catch (error) {
    return { status: 'unavailable', httpStatus: null, reason: error.message, value: null };
  }
}

const collectionResponse = await getJson('https://index.commoncrawl.org/collinfo.json');
const collections = Array.isArray(collectionResponse.value) ? collectionResponse.value.slice(0, indexCount) : [];
const results = [];
const captures = [];
for (const collection of collections) {
  const endpoint = collection['cdx-api'] || `https://index.commoncrawl.org/${collection.id}-index`;
  const query = new URL(endpoint);
  query.searchParams.set('url', `${host}/*`);
  query.searchParams.set('output', 'json');
  query.searchParams.set('filter', 'status:200');
  query.searchParams.set('collapse', 'urlkey');
  const response = await getJson(query, { cdxLines: true });
  const rows = Array.isArray(response.value) ? response.value : [];
  results.push({ id: collection.id, name: collection.name, query: query.href, status: response.status, httpStatus: response.httpStatus, reason: response.reason || null, captures: rows.length });
  for (const row of rows) {
    const observation = { index: collection.id, timestamp: row.timestamp, url: row.url, status: Number(row.status), mime: row.mime, digest: row.digest };
    captures.push({
      ...observation,
      fingerprint: createHash('sha256').update([observation.index, observation.timestamp, observation.url, observation.status, observation.digest].join('\u0000')).digest('hex'),
    });
  }
}

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  host,
  collectionIndexStatus: collectionResponse.status,
  collectionIndexReason: collectionResponse.reason || null,
  indexesChecked: results.length,
  results,
  captures: captures.sort((a, b) => a.timestamp.localeCompare(b.timestamp) || a.url.localeCompare(b.url)),
  totals: { captures: captures.length, distinctUrls: new Set(captures.map((capture) => capture.url)).size },
  evidenceBoundary: 'A Common Crawl CDX record proves only that the URL appears in the named public crawl index. It does not prove current accessibility, search-engine indexing, AI retrieval, citation, ranking, or recommendation. An empty result covers only the checked indexes.',
}, null, 2));

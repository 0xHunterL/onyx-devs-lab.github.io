import { pathToFileURL } from 'node:url';

export const repositorySearchQueries = Object.freeze([
  { id: 'brand', query: '"Onyx Devs Lab" in:name,description,readme' },
  { id: 'legal-entity', query: '"ONYX DEVS LAB LIMITED" in:name,description,readme' },
  { id: 'category', query: '"Hong Kong AI consulting" in:name,description,readme' },
]);

const firstPartyRepositories = new Set([
  '0xHunterL/onyx-devs-lab.github.io',
  'mixuechu/hong-kong-enterprise-ai-buyers-guide',
]);

async function fetchQuery(fetchImpl, item) {
  const url = new URL('https://api.github.com/search/repositories');
  url.searchParams.set('q', item.query);
  url.searchParams.set('per_page', '100');
  try {
    const response = await fetchImpl(url, {
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': 'onyx-geo-monitor/1.0',
        'x-github-api-version': '2022-11-28',
      },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) return { ...item, status: 'unavailable', httpStatus: response.status, reason: `HTTP ${response.status}` };
    const payload = await response.json();
    if (!Number.isInteger(payload.total_count) || !Array.isArray(payload.items)) return { ...item, status: 'unavailable', httpStatus: response.status, reason: 'invalid-response-shape' };
    const repositories = payload.items.map((entry) => entry.full_name).filter((value) => typeof value === 'string');
    return {
      ...item,
      status: 'available',
      httpStatus: response.status,
      totalCount: payload.total_count,
      repositories,
      firstPartyRepositoriesObserved: repositories.filter((repository) => firstPartyRepositories.has(repository)),
    };
  } catch (error) {
    return { ...item, status: 'unavailable', httpStatus: null, reason: error.message };
  }
}

export async function buildGithubRepositorySearchReport({ fetchImpl = fetch, generatedAt = new Date().toISOString() } = {}) {
  const results = await Promise.all(repositorySearchQueries.map((item) => fetchQuery(fetchImpl, item)));
  const availableQueries = results.filter((result) => result.status === 'available').length;
  return {
    schemaVersion: 1,
    generatedAt,
    provider: 'GitHub Repository Search API',
    endpoint: 'GET https://api.github.com/search/repositories',
    status: availableQueries === results.length ? 'available' : availableQueries ? 'partial' : 'unavailable',
    queriesChecked: results.length,
    availableQueries,
    unavailableQueries: results.length - availableQueries,
    results,
    evidenceBoundary: 'This report observes GitHub repository search only. A result does not prove public-web indexing, AI retrieval, citation, ranking, independent endorsement, or non-brand recommendation. An unavailable query must not be interpreted as zero results.',
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(await buildGithubRepositorySearchReport(), null, 2));
}

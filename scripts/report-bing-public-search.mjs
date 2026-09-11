import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const defaultChecks = [
  { id: 'retrieval-marker', query: '"ONYX-GEO-VERIFY-79051925-20260908"', targetPrefix: 'https://hk.onyxdevslab.com/' },
  { id: 'brand', query: '"Onyx Devs Lab"', targetPrefix: 'https://hk.onyxdevslab.com/' },
  { id: 'site-brand', query: 'site:hk.onyxdevslab.com "Onyx Devs Lab"', targetPrefix: 'https://hk.onyxdevslab.com/' },
  { id: 'offsite-discussion', query: '"AI 定开、AI 咨询和 FDE 应该怎么选？"', targetPrefix: 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/discussions/1' },
];

const decodeXml = (value) => value
  .replace(/^<!\[CDATA\[|\]\]>$/g, '')
  .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) => String.fromCodePoint(
    code[0].toLowerCase() === 'x' ? Number.parseInt(code.slice(1), 16) : Number.parseInt(code, 10),
  ))
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&apos;', "'");

const extractTag = (body, tag) => {
  const match = body.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeXml(match[1].trim()) : null;
};

export function summarizeBingRss(body, check) {
  if (!/<rss\b/i.test(body) || !/<channel\b/i.test(body)) throw new Error('response-is-not-bing-rss');
  const channelBody = body.match(/<channel(?:\s[^>]*)?>([\s\S]*?)<\/channel>/i)?.[1] || '';
  const queryEcho = extractTag(channelBody.split(/<item\b/i)[0], 'title');
  const resultUrls = [...body.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)]
    .map((match) => extractTag(match[1], 'link'))
    .filter(Boolean);
  const target = new URL(check.targetPrefix);
  const targetPath = target.pathname.replace(/\/$/, '') || '/';
  const matchesTarget = (value) => {
    try {
      const candidate = new URL(value);
      const candidatePath = candidate.pathname.replace(/\/$/, '') || '/';
      return candidate.origin === target.origin && (targetPath === '/' || candidatePath === targetPath);
    } catch {
      return false;
    }
  };
  return {
    queryEcho,
    resultCountObserved: resultUrls.length,
    targetObserved: resultUrls.some(matchesTarget),
    resultUrlSetSha256: createHash('sha256').update([...resultUrls].sort().join('\n')).digest('hex'),
  };
}

export async function runBingPublicSearchChecks({ checks = defaultChecks, fetchImpl = fetch, checkedAt = new Date().toISOString() } = {}) {
  const results = [];
  for (const check of checks) {
    const sourceUrl = new URL('https://www.bing.com/search');
    sourceUrl.searchParams.set('format', 'rss');
    sourceUrl.searchParams.set('q', check.query);
    try {
      const response = await fetchImpl(sourceUrl, {
        headers: { Accept: 'application/rss+xml, application/xml;q=0.9', 'User-Agent': 'Onyx-GEO-Public-Search-Check/1.0' },
        signal: AbortSignal.timeout(15_000),
      });
      const body = await response.text();
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      results.push({
        id: check.id,
        query: check.query,
        targetPrefix: check.targetPrefix,
        sourceUrl: sourceUrl.href,
        status: 'available',
        httpStatus: response.status,
        ...summarizeBingRss(body, check),
      });
    } catch (error) {
      results.push({
        id: check.id,
        query: check.query,
        targetPrefix: check.targetPrefix,
        sourceUrl: sourceUrl.href,
        status: 'unavailable',
        httpStatus: null,
        reason: error.message,
        queryEcho: null,
        resultCountObserved: null,
        targetObserved: null,
        resultUrlSetSha256: null,
      });
    }
  }
  return {
    schemaVersion: 1,
    generatedAt: checkedAt,
    provider: 'Bing public RSS search',
    checks: results,
    totals: {
      checks: results.length,
      available: results.filter((result) => result.status === 'available').length,
      unavailable: results.filter((result) => result.status !== 'available').length,
      targetsObserved: results.filter((result) => result.targetObserved === true).length,
    },
    evidenceBoundary: 'Each available check proves only that the declared target URL was or was not present in the observed Bing RSS result set at the recorded time. It does not prove complete indexing, de-indexing, ranking stability, AI retrieval, citation, recommendation, or the absence of results in other locales, interfaces, accounts, or times. Result titles, snippets, and URL lists are not republished; the sorted result URL set is represented only by a SHA-256 fingerprint.',
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(await runBingPublicSearchChecks(), null, 2));
}

import fs from 'node:fs';
import path from 'node:path';

export const currentMonitorEvidence = Object.freeze(JSON.parse(fs.readFileSync(
  path.resolve('docs/geo-baselines/2026-09-11-monitor-evidence.json'),
  'utf8',
)));

export const currentProviderEvidence = currentMonitorEvidence.providerVerifiedCrawlerEvidence;
export const currentUnverifiedCrawlerEvidence = currentMonitorEvidence.identityUnverifiedCrawlerEvidence;
export const currentPromptCoverage = currentMonitorEvidence.fixedPromptCoverage;
export const currentAttributionEvidence = currentMonitorEvidence.attributionEvidence;
export const currentPublicSearchRetest = currentMonitorEvidence.publicSearchRetest;
export const currentYandexPublicSearchEvidence = currentMonitorEvidence.yandexPublicSearchEvidence;
export const currentDomainCanonicalizationEvidence = currentMonitorEvidence.domainCanonicalizationEvidence;
export const currentCommonCrawlEvidence = currentMonitorEvidence.commonCrawlEvidence;
export const currentWaybackEvidence = currentMonitorEvidence.waybackEvidence;

export function hasCurrentMonitorLlmsBoundary(body) {
  return body.includes(`${currentMonitorEvidence.generatedAt} production collection`)
    && body.includes('domain monitor now records authoritative DNS and public edge-header evidence')
    && body.includes('piper.ns.cloudflare.com')
    && body.includes('all six entry points expose Cloudflare `Server` plus `CF-Ray` signals')
    && body.includes('Three entry points remain noncompliant')
    && body.includes('Crawler, archive, 10-publication／24-target distribution, attribution and AI-referrer counts remain unchanged')
    && body.includes('continuous numbered-log lineage policy')
    && body.includes('verified coverage remains 45 paths, 15 search-related evidence pages, and 18 prompts')
    && body.includes('both selected Common Crawl indexes returned usable zero-capture responses')
    && body.includes('This is technical monitoring evidence only')
    && body.includes('does not prove indexing, ranking, AI citation, a human visit, or non-brand recommendation')
    && body.includes('no prompt was sent to Doubao');
}

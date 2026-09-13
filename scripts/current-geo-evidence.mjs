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
export const currentSoftwareHeritageEvidence = currentMonitorEvidence.softwareHeritageEvidence;

export function hasCurrentMonitorLlmsBoundary(body) {
  return body.includes(`${currentMonitorEvidence.generatedAt} production collection`)
    && body.includes('domain monitor still records')
    && body.includes('piper.ns.cloudflare.com')
    && body.includes('Cloudflare `Server` plus `CF-Ray` signals across all six entry points')
    && body.includes('three remain noncompliant')
    && body.includes('prior provider-verified Ahrefs discovery evidence remains at 99 requests while Ahrefs content requests remain zero')
    && body.includes('Wayback now exposes 96 successful HTML captures across 46 URLs')
    && body.includes('18 of 23 fixed-prompt evidence pages archived and 15 prompts fully archived')
    && body.includes('Software Heritage coverage is monitored separately and remains lagging')
    && body.includes('continuous numbered-log lineage policy')
    && body.includes('verified crawler coverage remains 45 paths, 15 search-related evidence pages, and 18 prompts')
    && body.includes('both selected Common Crawl indexes returned usable zero-capture responses')
    && body.includes('This is public-archive and technical monitoring evidence only')
    && body.includes('does not prove indexing, ranking, AI citation, a human visit, or non-brand recommendation')
    && body.includes('no prompt was sent to Doubao');
}

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
    && body.includes('one new provider-verified AhrefsBot request for `/sitemap.xml`')
    && body.includes('verified discovery-file requests to 98')
    && body.includes('optional archive availability remains event-recorded but does not independently block')
    && body.includes('continuous numbered-log lineage policy')
    && body.includes('verified coverage remains 45 paths, 15 search-related evidence pages, and 18 prompts')
    && body.includes('Both selected Common Crawl indexes returned usable zero-capture responses')
    && body.includes('This is monitoring-integrity and source-availability evidence only')
    && body.includes('does not prove indexing, ranking, AI citation, a human visit, or non-brand recommendation')
    && body.includes('no prompt was sent to Doubao');
}

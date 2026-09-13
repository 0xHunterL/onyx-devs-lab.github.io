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
export const currentBingPublicSearchEvidence = currentMonitorEvidence.bingPublicSearchEvidence;
export const currentGooglePublicSearchAttempt = currentMonitorEvidence.googlePublicSearchAttempt;
export const currentDomainCanonicalizationEvidence = currentMonitorEvidence.domainCanonicalizationEvidence;
export const currentCommonCrawlEvidence = currentMonitorEvidence.commonCrawlEvidence;
export const currentWaybackEvidence = currentMonitorEvidence.waybackEvidence;
export const currentSoftwareHeritageEvidence = currentMonitorEvidence.softwareHeritageEvidence;

export function hasCurrentMonitorLlmsBoundary(body) {
  return body.includes(currentMonitorEvidence.generatedAt)
    && body.includes('provider-attributed Bing public-search checkpoint')
    && body.includes('exact retrieval marker returned an explicit no-results page')
    && body.includes('broader brand and `site:` checks are not treated as exhaustive index checks')
    && body.includes('not treated as exhaustive index checks')
    && body.includes('Google stopped at automated-traffic verification')
    && body.includes('neutral AI-consulting discovery remains separated from FDE-branded queries')
    && body.includes('102 requests while Ahrefs content requests remain zero')
    && body.includes('result sets are compared as unordered provider-returned sets')
    && body.includes('two-source self-publication delta separately')
    && body.includes('96 Wayback captures across 46 URLs')
    && body.includes('does not prove indexing or deindexing across all regions or pages, ranking')
    && body.includes('AI retrieval, citation, a human visit, or non-brand recommendation')
    && body.includes('no prompt was sent to Doubao');
}

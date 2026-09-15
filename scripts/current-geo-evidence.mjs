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
    && body.includes('Provider-verified GPTBot content requests reached 55 across 55 verified content paths')
    && body.includes('21 of 23 fixed-prompt evidence pages have any verified crawler access')
    && body.includes('search/retrieval-related coverage remains 16 pages')
    && body.includes('OAI-SearchBot content requests remain zero')
    && body.includes('source-visible `coze.cn` request carries a Toutiao UTM source')
    && body.includes('later `gist.github.com` request carries a GitHub Gist UTM source')
    && body.includes('both remain visitor-type-unverified')
    && body.includes('archive coverage remains accurately reported as lagging')
    && body.includes('131 requests while Ahrefs content requests remain zero')
    && body.includes('24 published distribution items, 40 tracked targets, and 64 available checked sources')
    && body.includes('one third Toutiao draft remains ready-not-published and is not a public source')
    && body.includes('expecting 25 published items, 41 tracked targets, and 66 available sources')
    && body.includes('legacy HTTP apex snippet reprocessing')
    && body.includes('neutral `"Hong Kong AI consulting"` first-page non-result')
    && body.includes('mitigated but still noncompliant')
    && body.includes('result sets remain compared as unordered provider-returned sets')
    && body.includes('two-source self-publication delta separately')
    && body.includes('98 captures across 46 URLs')
    && body.includes('does not prove exhaustive indexing across all regions or pages, stable ranking')
    && body.includes('AI retrieval')
    && body.includes('citation, a human visit, or non-brand recommendation')
    && body.includes('no prompt was sent to Doubao');
}

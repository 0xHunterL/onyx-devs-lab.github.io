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
    && body.includes('Bing exact-brand query directly showed the official apex and both Hong Kong localized homepages')
    && body.includes('legacy HTTP apex result still carried a stale personal-profile snippet')
    && body.includes('neutral `"Hong Kong AI consulting"` query did not show Onyx in the visible first page')
    && body.includes('archive coverage remains accurately reported as lagging')
    && body.includes('provider-attributed Bing public-search checkpoint')
    && body.includes('retains the previous negative checkpoint as history')
    && body.includes('not treated as a stable ranking trend')
    && body.includes('Google stopped at automated-traffic verification')
    && body.includes('neutral AI-consulting discovery remains separated from FDE-branded queries')
    && body.includes('105 requests while Ahrefs content requests remain zero')
    && body.includes('result sets are compared as unordered provider-returned sets')
    && body.includes('two-source self-publication delta separately')
    && body.includes('visitor type remains unverified')
    && body.includes('96 Wayback captures across 46 URLs')
    && body.includes('do not prove exhaustive indexing across all regions or pages, stable ranking')
    && body.includes('AI retrieval')
    && body.includes('citation, a human visit, or non-brand recommendation')
    && body.includes('no prompt was sent to Doubao');
}

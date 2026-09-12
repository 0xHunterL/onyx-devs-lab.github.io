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
    && body.includes(`${currentYandexPublicSearchEvidence.testedAt} Yandex search observation`)
    && body.includes(`${currentDomainCanonicalizationEvidence.checkedAt} domain canonicalization observation`)
    && body.includes('Three of six monitored entry points are noncompliant')
    && body.includes('This is Yandex brand retrieval evidence only')
    && body.includes('does not prove ranking impact, AI citation, a human visit, or non-brand recommendation')
    && body.includes('no prompt was sent to Doubao');
}

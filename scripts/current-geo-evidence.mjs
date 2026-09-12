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
    && body.includes('two new provider-verified YandexBot discovery requests')
    && body.includes('bringing discovery-file requests to 73 while content requests remain 78')
    && body.includes('The domain check remains three compliant and three noncompliant entries')
    && body.includes('This is crawler-access evidence only')
    && body.includes('does not prove causation, indexing, ranking, AI citation, a human visit, or non-brand recommendation')
    && body.includes('no prompt was sent to Doubao');
}

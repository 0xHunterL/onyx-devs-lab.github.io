import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildPublicationDrift } from './geo-evidence-publication-drift.mjs';

const baseline = JSON.parse(await readFile('docs/geo-baselines/2026-09-11-monitor-evidence.json', 'utf8'));
const provider = baseline.providerVerifiedCrawlerEvidence;
const attribution = baseline.attributionEvidence;
const prompt = baseline.fixedPromptCoverage;
const commonCrawl = baseline.commonCrawlEvidence;
const wayback = baseline.waybackEvidence;
const distribution = baseline.distributionEvidence;
const summary = {
  generatedAt: baseline.generatedAt,
  counts: {
    verifiedGptBotPageCrawls: provider.gptBotContentRequests,
    verifiedGptBotDiscoveryFileCrawls: provider.gptBotDiscoveryFileRequests,
    verifiedOaiSearchBotPageCrawls: provider.oaiSearchBotContentRequests,
    verifiedOaiSearchBotDiscoveryFileCrawls: provider.oaiSearchBotDiscoveryFileRequests,
    verifiedBingPageCrawls: provider.bingbotContentRequests,
    verifiedBingDiscoveryFileCrawls: provider.bingbotDiscoveryFileRequests,
    verifiedBaiduPageCrawls: provider.baiduspiderContentRequests,
    verifiedBaiduDiscoveryFileCrawls: provider.baiduspiderDiscoveryFileRequests,
    verifiedGooglePageCrawls: provider.googlebotContentRequests,
    verifiedPerplexityPageCrawls: provider.perplexityContentRequests,
    verifiedApplePageCrawls: provider.applebotContentRequests,
    verifiedAppleDiscoveryFileCrawls: provider.applebotDiscoveryFileRequests,
    verifiedYandexPageCrawls: provider.yandexbotContentRequests,
    verifiedYandexDiscoveryFileCrawls: provider.yandexbotDiscoveryFileRequests,
    verifiedAhrefsPageCrawls: provider.ahrefsbotContentRequests,
    verifiedAhrefsDiscoveryFileCrawls: provider.ahrefsbotDiscoveryFileRequests,
    verifiedContentPaths: provider.distinctVerifiedContentPaths,
    searchRelatedCrawledEvidencePages: prompt.searchRelatedCrawledEvidencePages,
    promptsWithAnySearchRelatedCrawl: prompt.promptsWithAnySearchRelatedCrawl,
    trackedVisits: attribution.trackedRequests,
    suspectedAutomatedTrackedVisits: attribution.suspectedAutomatedRequests,
    periodicRotatingClientTrackedVisits: attribution.periodicRotatingClientRequests,
    humanUnverifiedTrackedVisits: attribution.visitorTypeUnverifiedRequests,
    knownLinkScannerTrackedVisits: attribution.knownLinkScannerRequests,
    knownLinkScannerUserAgentVisits: attribution.knownLinkScannerUserAgentRequests,
    knownLinkScannerNetworkVisits: attribution.knownLinkScannerNetworkRequests,
    internallyInconsistentUserAgentVisits: attribution.internallyInconsistentUserAgentRequests,
    malformedCampaignVisits: attribution.malformedCampaignRequestsExcluded,
    aiReferrerAttributedVisits: attribution.aiReferrerAttributedRequests,
    commonCrawlCaptures: commonCrawl.capturesObservedInAvailableIndexes,
    waybackCaptures: wayback.captures,
    waybackDistinctUrls: wayback.distinctUrls,
    waybackArchivedEvidencePages: wayback.fixedPromptArchiveCoverage.archivedEvidencePages,
    promptsWithAnyWaybackArchive: wayback.fixedPromptArchiveCoverage.promptsWithAnyArchivedEvidence,
    promptsFullyWaybackArchived: wayback.fixedPromptArchiveCoverage.promptsFullyArchived,
  },
  availability: {
    commonCrawl: {
      status: commonCrawl.status,
      indexes: [
       ...commonCrawl.availableIndexes.map((id) => ({ id, status: 'available' })),
        ...commonCrawl.unavailableIndexes.map((item) => ({ id: item.id, status: 'unavailable' })),
      ],
    },
    wayback: {
      status: wayback.status,
    },
    distribution: {
      status: distribution.availabilityStatus,
      publishedItems: distribution.publishedItems,
      availableSources: distribution.availableSources,
      unavailableSources: distribution.unavailableSources,
    },
  },
};

const synchronized = buildPublicationDrift(baseline, summary);
assert.ok(commonCrawl.unavailableIndexes.every((item) => typeof item?.id === 'string' && item.id.length > 0));
assert.equal(synchronized.status, 'synchronized');
assert.deepEqual(synchronized.mismatches, []);

const referralDrift = structuredClone(summary);
referralDrift.counts.trackedVisits += 1;
const referralReport = buildPublicationDrift(baseline, referralDrift);
assert.equal(referralReport.status, 'drift');
assert.deepEqual(referralReport.mismatches, [{
  field: 'attributionEvidence.trackedRequests',
  published: attribution.trackedRequests,
  collected: attribution.trackedRequests + 1,
}]);

const crawlerDrift = structuredClone(summary);
crawlerDrift.counts.verifiedGptBotPageCrawls += 1;
assert.equal(buildPublicationDrift(baseline, crawlerDrift).mismatches[0].field, 'providerVerifiedCrawlerEvidence.gptBotContentRequests');

const commonCrawlDrift = structuredClone(summary);
commonCrawlDrift.availability.commonCrawl.status = commonCrawl.status === 'partial' ? 'available' : 'partial';
commonCrawlDrift.availability.commonCrawl.indexes[0].status = 'unavailable';
const commonCrawlFields = buildPublicationDrift(baseline, commonCrawlDrift).mismatches.map((item) => item.field);
assert.deepEqual(commonCrawlFields, ['commonCrawlEvidence.status', 'commonCrawlEvidence.availableIndexes', 'commonCrawlEvidence.unavailableIndexes']);

const distributionDrift = structuredClone(summary);
distributionDrift.availability.distribution.status = 'partial';
assert.equal(buildPublicationDrift(baseline, distributionDrift).mismatches[0].field, 'distributionEvidence.availabilityStatus');
assert.match(synchronized.evidenceBoundary, /does not prove indexing/);

const waybackDrift = structuredClone(summary);
waybackDrift.counts.waybackDistinctUrls += 1;
assert.equal(buildPublicationDrift(baseline, waybackDrift).mismatches[0].field, 'waybackEvidence.distinctUrls');

const waybackPromptDrift = structuredClone(summary);
waybackPromptDrift.counts.promptsFullyWaybackArchived += 1;
assert.equal(buildPublicationDrift(baseline, waybackPromptDrift).mismatches[0].field, 'waybackEvidence.fixedPromptArchiveCoverage.promptsFullyArchived');

console.log(JSON.stringify({ tests: 9, failures: [] }, null, 2));

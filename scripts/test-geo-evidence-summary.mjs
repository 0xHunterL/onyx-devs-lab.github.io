import assert from 'node:assert/strict';
import { buildAvailabilityChanges, buildCommonCrawlAvailability, buildCrawlerVerificationAvailability, buildDistributionAvailability, buildEvidenceCounts, buildEvidenceDeltas, selectEvidenceEventKind } from './geo-evidence-summary.mjs';

const crawlerTotals = {
  verifiedGptBotPageCrawls: 24,
  verifiedOaiSearchBotPageCrawls: 0,
  verifiedOaiSearchBotDiscoveryFileCrawls: 8,
  verifiedGptBotDiscoveryFileCrawls: 3,
  verifiedBingDiscoveryFileCrawls: 1,
  verifiedBaiduDiscoveryFileCrawls: 0,
  verifiedGoogleDiscoveryFileCrawls: 0,
  verifiedPerplexityDiscoveryFileCrawls: 0,
  verifiedCommonCrawlPageCrawls: 0,
  verifiedCommonCrawlDiscoveryFileCrawls: 0,
  verifiedAppleDiscoveryFileCrawls: 0,
  verifiedYandexDiscoveryFileCrawls: 1,
  verifiedBingPageCrawls: 7,
  verifiedBaiduPageCrawls: 0,
  verifiedGooglePageCrawls: 0,
  verifiedPerplexityPageCrawls: 0,
  verifiedApplePageCrawls: 0,
  verifiedYandexPageCrawls: 1,
  userAgentOnlyBytespiderPageCrawls: 0,
  userAgentOnlyBytespiderDiscoveryFileCrawls: 0,
};
const counts = buildEvidenceCounts(
  { totals: crawlerTotals, verifiedContentPathCoverage: Array(29).fill('/evidence/') },
  {
    trackedVisits: 70,
    suspectedAutomatedTrackedVisits: 61,
    periodicRotatingClientTrackedVisits: 9,
    humanUnverifiedTrackedVisits: 9,
    knownLinkScannerTrackedVisits: 14,
    knownLinkScannerUserAgentVisits: 12,
    knownLinkScannerNetworkVisits: 2,
    internallyInconsistentUserAgentVisits: Array(4).fill({}),
    malformedCampaignVisits: Array(6).fill({}),
    byEvidenceType: { utm: 70 },
    recentHumanUnverifiedVisits: [],
  },
  { totals: { captures: 0, distinctUrls: 0 } },
  { totals: { searchRelatedCrawledEvidencePages: 0, promptsWithAnySearchRelatedCrawl: 0 } },
);

assert.equal(counts.trackedVisits, 70);
assert.equal(counts.suspectedAutomatedTrackedVisits, 61);
assert.equal(counts.periodicRotatingClientTrackedVisits, 9);
assert.equal(counts.humanUnverifiedTrackedVisits, 9);
assert.equal(counts.knownLinkScannerTrackedVisits, 14);
assert.equal(counts.knownLinkScannerUserAgentVisits, 12);
assert.equal(counts.knownLinkScannerNetworkVisits, 2);
assert.equal(counts.internallyInconsistentUserAgentVisits, 4);
assert.equal(counts.malformedCampaignVisits, 6);
assert.equal(counts.aiReferrerAttributedVisits, 0);
assert.equal(counts.userAgentOnlyBytespiderPageCrawls, 0);
assert.equal(counts.userAgentOnlyBytespiderDiscoveryFileCrawls, 0);
assert.equal(counts.verifiedApplePageCrawls, 0);
assert.equal(counts.verifiedAppleDiscoveryFileCrawls, 0);
assert.equal(counts.verifiedBaiduPageCrawls, 0);
assert.equal(counts.verifiedBaiduDiscoveryFileCrawls, 0);
assert.equal(counts.verifiedYandexPageCrawls, 1);
assert.equal(counts.verifiedYandexDiscoveryFileCrawls, 1);

const deltas = buildEvidenceDeltas(counts, {
  trackedVisits: 69,
  suspectedAutomatedTrackedVisits: 60,
  humanUnverifiedTrackedVisits: 9,
});
assert.equal(deltas.trackedVisits, 1);
assert.equal(deltas.suspectedAutomatedTrackedVisits, 1);
assert.equal(deltas.humanUnverifiedTrackedVisits, 0);
assert.equal(deltas.knownLinkScannerTrackedVisits, null);
assert.equal(buildEvidenceDeltas(counts, null).knownLinkScannerTrackedVisits, 0);

const partialCommonCrawl = buildCommonCrawlAvailability({
  collectionIndexStatus: 'available',
  results: [
    { id: 'CC-MAIN-2026-34', status: 'unavailable', httpStatus: 502, reason: 'HTTP 502' },
    { id: 'CC-MAIN-2026-30', status: 'available', httpStatus: 404, captures: 0 },
  ],
});
assert.equal(partialCommonCrawl.status, 'partial');
assert.equal(partialCommonCrawl.availableIndexes, 1);
assert.equal(partialCommonCrawl.unavailableIndexes, 1);
assert.deepEqual(partialCommonCrawl.indexes, [
  { id: 'CC-MAIN-2026-34', status: 'unavailable' },
  { id: 'CC-MAIN-2026-30', status: 'available' },
]);
assert.deepEqual(partialCommonCrawl.unavailable[0], { id: 'CC-MAIN-2026-34', httpStatus: 502, reason: 'HTTP 502' });
assert.match(partialCommonCrawl.interpretation, /incomplete/);

const availableCommonCrawl = buildCommonCrawlAvailability({
  collectionIndexStatus: 'available',
  results: [{ id: 'CC-MAIN-2026-30', status: 'available', httpStatus: 404, captures: 0 }],
});
assert.equal(availableCommonCrawl.status, 'available');

const unavailableCommonCrawl = buildCommonCrawlAvailability({ collectionIndexStatus: 'unavailable', results: [] });
assert.equal(unavailableCommonCrawl.status, 'unavailable');

const partialCrawlerVerification = buildCrawlerVerificationAvailability({
  verificationSources: {
    gptBot: { status: 'available', httpStatus: 200 },
    commonCrawlBot: { status: 'unavailable', reason: 'fetch failed' },
  },
});
assert.equal(partialCrawlerVerification.status, 'partial');
assert.equal(partialCrawlerVerification.availableSources, 1);
assert.equal(partialCrawlerVerification.unavailableSources, 1);
assert.equal(buildCrawlerVerificationAvailability({ verificationSources: {} }).status, 'unavailable');

const crawlerSourceRecovered = buildAvailabilityChanges(
  { crawlerVerification: { ...partialCrawlerVerification, status: 'available', sources: partialCrawlerVerification.sources.map((source) => ({ ...source, status: 'available' })) } },
  { crawlerVerification: partialCrawlerVerification },
);
assert.equal(crawlerSourceRecovered.length, 1);
assert.equal(crawlerSourceRecovered[0].statusChanged, true);
assert.equal(crawlerSourceRecovered[0].coverageChanged, true);

const partialDistribution = buildDistributionAvailability({
  publishedItems: 2,
  results: [
    { itemId: 'one', kind: 'publicUrl', url: 'https://example.com/one', status: 200, sameDestination: true, missingMarkers: [] },
    { itemId: 'two', kind: 'publicUrl', url: 'https://example.com/two', status: 200, sameDestination: true, missingMarkers: ['Onyx'] },
  ],
});
assert.equal(partialDistribution.status, 'partial');
assert.equal(partialDistribution.availableSources, 1);
assert.equal(partialDistribution.unavailableSources, 1);
assert.equal(partialDistribution.sources[1].reason, 'content-marker-missing');
assert.equal(buildDistributionAvailability({ results: [] }).status, 'unavailable');

const statusAndCoverageChange = buildAvailabilityChanges(
  { commonCrawl: partialCommonCrawl },
  { commonCrawl: availableCommonCrawl },
);
assert.equal(statusAndCoverageChange.length, 1);
assert.equal(statusAndCoverageChange[0].statusChanged, true);
assert.equal(statusAndCoverageChange[0].coverageChanged, true);

const unavailableIndexChanged = buildAvailabilityChanges(
  { commonCrawl: { ...partialCommonCrawl, unavailable: [{ id: 'different' }] } },
  { commonCrawl: { ...partialCommonCrawl, indexes: undefined } },
);
assert.equal(unavailableIndexChanged.length, 1);
assert.equal(unavailableIndexChanged[0].statusChanged, false);
assert.equal(unavailableIndexChanged[0].coverageChanged, true);

assert.deepEqual(buildAvailabilityChanges(
  { commonCrawl: structuredClone(partialCommonCrawl) },
  { commonCrawl: partialCommonCrawl },
), []);
assert.deepEqual(buildAvailabilityChanges(
  { commonCrawl: partialCommonCrawl },
  { commonCrawl: { ...partialCommonCrawl, indexes: undefined } },
), []);

const selectedIndexesChanged = buildAvailabilityChanges(
  { commonCrawl: { ...availableCommonCrawl, indexes: [{ id: 'CC-MAIN-2026-34', status: 'available' }] } },
  { commonCrawl: { ...availableCommonCrawl, indexes: [{ id: 'CC-MAIN-2026-30', status: 'available' }] } },
);
assert.equal(selectedIndexesChanged.length, 1);
assert.equal(selectedIndexesChanged[0].coverageChanged, true);
assert.deepEqual(buildAvailabilityChanges({ commonCrawl: partialCommonCrawl }, null), []);
assert.equal(selectEvidenceEventKind({ initializing: true, evidenceChanged: false, availabilityChanged: false }), 'baseline');
assert.equal(selectEvidenceEventKind({ initializing: false, evidenceChanged: true, availabilityChanged: true }), 'evidence-and-availability-change');
assert.equal(selectEvidenceEventKind({ initializing: false, evidenceChanged: true, availabilityChanged: false }), 'evidence-change');
assert.equal(selectEvidenceEventKind({ initializing: false, evidenceChanged: false, availabilityChanged: true }), 'availability-change');
assert.equal(selectEvidenceEventKind({ initializing: false, evidenceChanged: false, availabilityChanged: false }), null);

console.log(JSON.stringify({ tests: 57, failures: [] }, null, 2));

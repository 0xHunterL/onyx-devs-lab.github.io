import assert from 'node:assert/strict';
import { buildAvailabilityChanges, buildCommonCrawlAvailability, buildEvidenceCounts, buildEvidenceDeltas, selectEvidenceEventKind } from './geo-evidence-summary.mjs';

const crawlerTotals = {
  verifiedGptBotPageCrawls: 24,
  verifiedOaiSearchBotPageCrawls: 0,
  verifiedOaiSearchBotDiscoveryFileCrawls: 8,
  verifiedGptBotDiscoveryFileCrawls: 3,
  verifiedBingDiscoveryFileCrawls: 1,
  verifiedGoogleDiscoveryFileCrawls: 0,
  verifiedPerplexityDiscoveryFileCrawls: 0,
  verifiedCommonCrawlPageCrawls: 0,
  verifiedCommonCrawlDiscoveryFileCrawls: 0,
  verifiedBingPageCrawls: 7,
  verifiedGooglePageCrawls: 0,
  verifiedPerplexityPageCrawls: 0,
  userAgentOnlyBytespiderPageCrawls: 0,
  userAgentOnlyBytespiderDiscoveryFileCrawls: 0,
};
const counts = buildEvidenceCounts(
  { totals: crawlerTotals, verifiedContentPathCoverage: Array(29).fill('/evidence/') },
  {
    trackedVisits: 70,
    suspectedAutomatedTrackedVisits: 61,
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
assert.equal(counts.humanUnverifiedTrackedVisits, 9);
assert.equal(counts.knownLinkScannerTrackedVisits, 14);
assert.equal(counts.knownLinkScannerUserAgentVisits, 12);
assert.equal(counts.knownLinkScannerNetworkVisits, 2);
assert.equal(counts.internallyInconsistentUserAgentVisits, 4);
assert.equal(counts.malformedCampaignVisits, 6);
assert.equal(counts.aiReferrerAttributedVisits, 0);
assert.equal(counts.userAgentOnlyBytespiderPageCrawls, 0);
assert.equal(counts.userAgentOnlyBytespiderDiscoveryFileCrawls, 0);

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

console.log(JSON.stringify({ tests: 40, failures: [] }, null, 2));

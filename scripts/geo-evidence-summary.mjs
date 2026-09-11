export function buildEvidenceCounts(crawler, referral, commonCrawl, promptCoverage) {
  return {
    verifiedGptBotPageCrawls: crawler.totals.verifiedGptBotPageCrawls,
    verifiedOaiSearchBotPageCrawls: crawler.totals.verifiedOaiSearchBotPageCrawls,
    verifiedOaiSearchBotDiscoveryFileCrawls: crawler.totals.verifiedOaiSearchBotDiscoveryFileCrawls,
    verifiedGptBotDiscoveryFileCrawls: crawler.totals.verifiedGptBotDiscoveryFileCrawls,
    verifiedBingDiscoveryFileCrawls: crawler.totals.verifiedBingDiscoveryFileCrawls,
    verifiedGoogleDiscoveryFileCrawls: crawler.totals.verifiedGoogleDiscoveryFileCrawls,
    verifiedPerplexityDiscoveryFileCrawls: crawler.totals.verifiedPerplexityDiscoveryFileCrawls,
    verifiedCommonCrawlPageCrawls: crawler.totals.verifiedCommonCrawlPageCrawls,
    verifiedCommonCrawlDiscoveryFileCrawls: crawler.totals.verifiedCommonCrawlDiscoveryFileCrawls,
    verifiedBingPageCrawls: crawler.totals.verifiedBingPageCrawls,
    verifiedGooglePageCrawls: crawler.totals.verifiedGooglePageCrawls,
    verifiedPerplexityPageCrawls: crawler.totals.verifiedPerplexityPageCrawls,
    userAgentOnlyBytespiderPageCrawls: crawler.totals.userAgentOnlyBytespiderPageCrawls,
    userAgentOnlyBytespiderDiscoveryFileCrawls: crawler.totals.userAgentOnlyBytespiderDiscoveryFileCrawls,
    verifiedContentPaths: crawler.verifiedContentPathCoverage.length,
    searchRelatedCrawledEvidencePages: promptCoverage.totals.searchRelatedCrawledEvidencePages,
    promptsWithAnySearchRelatedCrawl: promptCoverage.totals.promptsWithAnySearchRelatedCrawl,
    trackedVisits: referral.trackedVisits,
    suspectedAutomatedTrackedVisits: referral.suspectedAutomatedTrackedVisits,
    humanUnverifiedTrackedVisits: referral.humanUnverifiedTrackedVisits,
    knownLinkScannerTrackedVisits: referral.knownLinkScannerTrackedVisits,
    knownLinkScannerUserAgentVisits: referral.knownLinkScannerUserAgentVisits,
    knownLinkScannerNetworkVisits: referral.knownLinkScannerNetworkVisits,
    internallyInconsistentUserAgentVisits: referral.internallyInconsistentUserAgentVisits.length,
    malformedCampaignVisits: referral.malformedCampaignVisits.length,
    aiReferrerAttributedVisits: (referral.byEvidenceType['ai-referrer'] || 0) + (referral.byEvidenceType['utm-and-ai-referrer'] || 0),
    humanUnverifiedAiReferrerVisits: referral.recentHumanUnverifiedVisits.filter((visit) => visit.evidenceType.includes('ai-referrer')).length,
    commonCrawlCaptures: commonCrawl.totals.captures,
    commonCrawlDistinctUrls: commonCrawl.totals.distinctUrls,
  };
}

export function buildEvidenceDeltas(counts, previousCounts) {
  if (!previousCounts) return Object.fromEntries(Object.keys(counts).map((key) => [key, 0]));
  return Object.fromEntries(Object.entries(counts).map(([key, value]) => [
    key,
    Object.hasOwn(previousCounts, key) ? value - Number(previousCounts[key]) : null,
  ]));
}

export function buildCommonCrawlAvailability(commonCrawl) {
  const results = Array.isArray(commonCrawl?.results) ? commonCrawl.results : [];
  const available = results.filter((result) => result.status === 'available');
  const unavailable = results.filter((result) => result.status !== 'available');
  const status = commonCrawl?.collectionIndexStatus !== 'available' || !results.length
    ? 'unavailable'
    : unavailable.length
      ? 'partial'
      : 'available';
  return {
    status,
    collectionIndexStatus: commonCrawl?.collectionIndexStatus || 'unavailable',
    indexesChecked: results.length,
    availableIndexes: available.length,
    unavailableIndexes: unavailable.length,
    unavailable: unavailable.map((result) => ({
      id: result.id || null,
      httpStatus: result.httpStatus ?? null,
      reason: result.reason || 'unavailable',
    })),
    interpretation: status === 'available'
      ? 'All selected indexes returned a usable response; capture counts cover the complete selected set.'
      : 'Capture counts are incomplete and must not be interpreted as a verified zero across the selected indexes.',
  };
}

export function buildAvailabilityChanges(currentAvailability, previousAvailability) {
  if (!previousAvailability) return [];
  return Object.entries(currentAvailability).flatMap(([source, current]) => {
    const previous = previousAvailability[source];
    if (!previous || previous.status === current.status) return [];
    return [{
      source,
      previousStatus: previous.status || 'unknown',
      currentStatus: current.status || 'unknown',
    }];
  });
}

export function selectEvidenceEventKind({ initializing, evidenceChanged, availabilityChanged }) {
  if (initializing) return 'baseline';
  if (evidenceChanged && availabilityChanged) return 'evidence-and-availability-change';
  if (evidenceChanged) return 'evidence-change';
  if (availabilityChanged) return 'availability-change';
  return null;
}

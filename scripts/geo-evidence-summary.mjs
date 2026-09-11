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

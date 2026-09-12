const comparable = (value) => JSON.stringify(value);

export function buildPublicationDrift(baseline, summary) {
  const mismatches = [];
  const check = (field, published, collected) => {
    if (comparable(published) !== comparable(collected)) mismatches.push({ field, published, collected });
  };

  const provider = baseline.providerVerifiedCrawlerEvidence || {};
  const crawlerAccounting = baseline.crawlerEvidenceAccounting || {};
  const attribution = baseline.attributionEvidence || {};
  const prompt = baseline.fixedPromptCoverage || {};
  const commonCrawl = baseline.commonCrawlEvidence || {};
  const wayback = baseline.waybackEvidence || {};
  const distribution = baseline.distributionEvidence || {};
  const counts = summary.counts || {};
  const collectedCommonCrawl = summary.availability?.commonCrawl || {};
  const collectedWayback = summary.availability?.wayback || {};
  const collectedDistribution = summary.availability?.distribution || {};

  const countMappings = [
    ['providerVerifiedCrawlerEvidence.gptBotContentRequests', provider.gptBotContentRequests, counts.verifiedGptBotPageCrawls],
    ['providerVerifiedCrawlerEvidence.gptBotDiscoveryFileRequests', provider.gptBotDiscoveryFileRequests, counts.verifiedGptBotDiscoveryFileCrawls],
    ['providerVerifiedCrawlerEvidence.oaiSearchBotContentRequests', provider.oaiSearchBotContentRequests, counts.verifiedOaiSearchBotPageCrawls],
    ['providerVerifiedCrawlerEvidence.oaiSearchBotDiscoveryFileRequests', provider.oaiSearchBotDiscoveryFileRequests, counts.verifiedOaiSearchBotDiscoveryFileCrawls],
    ['providerVerifiedCrawlerEvidence.bingbotContentRequests', provider.bingbotContentRequests, counts.verifiedBingPageCrawls],
    ['providerVerifiedCrawlerEvidence.bingbotDiscoveryFileRequests', provider.bingbotDiscoveryFileRequests, counts.verifiedBingDiscoveryFileCrawls],
    ['providerVerifiedCrawlerEvidence.baiduspiderContentRequests', provider.baiduspiderContentRequests, counts.verifiedBaiduPageCrawls],
    ['providerVerifiedCrawlerEvidence.baiduspiderDiscoveryFileRequests', provider.baiduspiderDiscoveryFileRequests, counts.verifiedBaiduDiscoveryFileCrawls],
    ['providerVerifiedCrawlerEvidence.googlebotContentRequests', provider.googlebotContentRequests, counts.verifiedGooglePageCrawls],
    ['providerVerifiedCrawlerEvidence.googlebotDiscoveryFileRequests', provider.googlebotDiscoveryFileRequests, counts.verifiedGoogleDiscoveryFileCrawls],
    ['providerVerifiedCrawlerEvidence.perplexityContentRequests', provider.perplexityContentRequests, counts.verifiedPerplexityPageCrawls],
    ['providerVerifiedCrawlerEvidence.perplexityDiscoveryFileRequests', provider.perplexityDiscoveryFileRequests, counts.verifiedPerplexityDiscoveryFileCrawls],
    ['providerVerifiedCrawlerEvidence.commonCrawlBotContentRequests', provider.commonCrawlBotContentRequests, counts.verifiedCommonCrawlPageCrawls],
    ['providerVerifiedCrawlerEvidence.commonCrawlBotDiscoveryFileRequests', provider.commonCrawlBotDiscoveryFileRequests, counts.verifiedCommonCrawlDiscoveryFileCrawls],
    ['providerVerifiedCrawlerEvidence.applebotContentRequests', provider.applebotContentRequests, counts.verifiedApplePageCrawls],
    ['providerVerifiedCrawlerEvidence.applebotDiscoveryFileRequests', provider.applebotDiscoveryFileRequests, counts.verifiedAppleDiscoveryFileCrawls],
    ['providerVerifiedCrawlerEvidence.yandexbotContentRequests', provider.yandexbotContentRequests, counts.verifiedYandexPageCrawls],
    ['providerVerifiedCrawlerEvidence.yandexbotDiscoveryFileRequests', provider.yandexbotDiscoveryFileRequests, counts.verifiedYandexDiscoveryFileCrawls],
    ['providerVerifiedCrawlerEvidence.ahrefsbotContentRequests', provider.ahrefsbotContentRequests, counts.verifiedAhrefsPageCrawls],
    ['providerVerifiedCrawlerEvidence.ahrefsbotDiscoveryFileRequests', provider.ahrefsbotDiscoveryFileRequests, counts.verifiedAhrefsDiscoveryFileCrawls],
    ['providerVerifiedCrawlerEvidence.distinctVerifiedContentPaths', provider.distinctVerifiedContentPaths, counts.verifiedContentPaths],
    ['fixedPromptCoverage.searchRelatedCrawledEvidencePages', prompt.searchRelatedCrawledEvidencePages, counts.searchRelatedCrawledEvidencePages],
    ['fixedPromptCoverage.promptsWithAnySearchRelatedCrawl', prompt.promptsWithAnySearchRelatedCrawl, counts.promptsWithAnySearchRelatedCrawl],
    ['attributionEvidence.trackedRequests', attribution.trackedRequests, counts.trackedVisits],
    ['attributionEvidence.suspectedAutomatedRequests', attribution.suspectedAutomatedRequests, counts.suspectedAutomatedTrackedVisits],
    ['attributionEvidence.periodicRotatingClientRequests', attribution.periodicRotatingClientRequests, counts.periodicRotatingClientTrackedVisits],
    ['attributionEvidence.visitorTypeUnverifiedRequests', attribution.visitorTypeUnverifiedRequests, counts.humanUnverifiedTrackedVisits],
    ['attributionEvidence.knownLinkScannerRequests', attribution.knownLinkScannerRequests, counts.knownLinkScannerTrackedVisits],
    ['attributionEvidence.knownLinkScannerUserAgentRequests', attribution.knownLinkScannerUserAgentRequests, counts.knownLinkScannerUserAgentVisits],
    ['attributionEvidence.knownLinkScannerNetworkRequests', attribution.knownLinkScannerNetworkRequests, counts.knownLinkScannerNetworkVisits],
    ['attributionEvidence.internallyInconsistentUserAgentRequests', attribution.internallyInconsistentUserAgentRequests, counts.internallyInconsistentUserAgentVisits],
    ['attributionEvidence.malformedCampaignRequestsExcluded', attribution.malformedCampaignRequestsExcluded, counts.malformedCampaignVisits],
    ['attributionEvidence.aiReferrerAttributedRequests', attribution.aiReferrerAttributedRequests, counts.aiReferrerAttributedVisits],
    ['commonCrawlEvidence.capturesObservedInAvailableIndexes', commonCrawl.capturesObservedInAvailableIndexes, counts.commonCrawlCaptures],
    ['waybackEvidence.captures', wayback.captures, counts.waybackCaptures],
    ['waybackEvidence.distinctUrls', wayback.distinctUrls, counts.waybackDistinctUrls],
    ['waybackEvidence.fixedPromptArchiveCoverage.archivedEvidencePages', wayback.fixedPromptArchiveCoverage?.archivedEvidencePages, counts.waybackArchivedEvidencePages],
    ['waybackEvidence.fixedPromptArchiveCoverage.promptsWithAnyArchivedEvidence', wayback.fixedPromptArchiveCoverage?.promptsWithAnyArchivedEvidence, counts.promptsWithAnyWaybackArchive],
    ['waybackEvidence.fixedPromptArchiveCoverage.promptsFullyArchived', wayback.fixedPromptArchiveCoverage?.promptsFullyArchived, counts.promptsFullyWaybackArchived],
  ];
  for (const mapping of countMappings) check(...mapping);

  check('crawlerEvidenceAccounting.currentRetainedLogFiles', crawlerAccounting.currentRetainedLogFiles, (summary.sourceLogs || []).length);
  check('crawlerEvidenceAccounting.currentRetainedLogPaths', crawlerAccounting.currentRetainedLogPaths || [], summary.sourceLogs || []);
  check('crawlerEvidenceAccounting.latestRetentionAdjustments', crawlerAccounting.latestRetentionAdjustments || [], summary.retentionAdjustments || []);
  check('commonCrawlEvidence.status', commonCrawl.status, collectedCommonCrawl.status);
  check('commonCrawlEvidence.availableIndexes', commonCrawl.availableIndexes || [], (collectedCommonCrawl.indexes || []).filter((item) => item.status === 'available').map((item) => item.id));
  check('commonCrawlEvidence.unavailableIndexes', (commonCrawl.unavailableIndexes || []).map((item) => item.id), (collectedCommonCrawl.indexes || []).filter((item) => item.status !== 'available').map((item) => item.id));
  check('waybackEvidence.status', wayback.status, collectedWayback.status);
  check('distributionEvidence.publishedItems', distribution.publishedItems, collectedDistribution.publishedItems);
  check('distributionEvidence.availableSources', distribution.availableSources, collectedDistribution.availableSources);
  check('distributionEvidence.unavailableSources', distribution.unavailableSources, collectedDistribution.unavailableSources);
  check('distributionEvidence.availabilityStatus', distribution.availabilityStatus, collectedDistribution.status);

  return {
    schemaVersion: 1,
    checkedAt: new Date().toISOString(),
    status: mismatches.length ? 'drift' : 'synchronized',
    baselineVersion: baseline.publicStatusVersion || null,
    baselineObservedAt: baseline.generatedAt || null,
    collectionObservedAt: summary.generatedAt || null,
    mismatches,
    evidenceBoundary: 'Synchronized means the selected published metrics match the latest supplied production collection. It does not prove indexing, retrieval, citation, ranking, a human visit, or recommendation.',
  };
}

export function buildEvidenceCounts(crawler, referral, commonCrawl, promptCoverage, wayback = { totals: { captures: 0, distinctUrls: 0 } }) {
  return {
    verifiedGptBotPageCrawls: crawler.totals.verifiedGptBotPageCrawls,
    verifiedOaiSearchBotPageCrawls: crawler.totals.verifiedOaiSearchBotPageCrawls,
    verifiedOaiSearchBotDiscoveryFileCrawls: crawler.totals.verifiedOaiSearchBotDiscoveryFileCrawls,
    verifiedGptBotDiscoveryFileCrawls: crawler.totals.verifiedGptBotDiscoveryFileCrawls,
    verifiedBingDiscoveryFileCrawls: crawler.totals.verifiedBingDiscoveryFileCrawls,
    verifiedBaiduDiscoveryFileCrawls: crawler.totals.verifiedBaiduDiscoveryFileCrawls,
    verifiedGoogleDiscoveryFileCrawls: crawler.totals.verifiedGoogleDiscoveryFileCrawls,
    verifiedPerplexityDiscoveryFileCrawls: crawler.totals.verifiedPerplexityDiscoveryFileCrawls,
    verifiedCommonCrawlPageCrawls: crawler.totals.verifiedCommonCrawlPageCrawls,
    verifiedCommonCrawlDiscoveryFileCrawls: crawler.totals.verifiedCommonCrawlDiscoveryFileCrawls,
    verifiedAppleDiscoveryFileCrawls: crawler.totals.verifiedAppleDiscoveryFileCrawls,
    verifiedYandexDiscoveryFileCrawls: crawler.totals.verifiedYandexDiscoveryFileCrawls,
    verifiedAhrefsDiscoveryFileCrawls: crawler.totals.verifiedAhrefsDiscoveryFileCrawls,
    verifiedBingPageCrawls: crawler.totals.verifiedBingPageCrawls,
    verifiedBaiduPageCrawls: crawler.totals.verifiedBaiduPageCrawls,
    verifiedGooglePageCrawls: crawler.totals.verifiedGooglePageCrawls,
    verifiedPerplexityPageCrawls: crawler.totals.verifiedPerplexityPageCrawls,
    verifiedApplePageCrawls: crawler.totals.verifiedApplePageCrawls,
    verifiedYandexPageCrawls: crawler.totals.verifiedYandexPageCrawls,
    verifiedAhrefsPageCrawls: crawler.totals.verifiedAhrefsPageCrawls,
    userAgentOnlyBytespiderPageCrawls: crawler.totals.userAgentOnlyBytespiderPageCrawls,
    userAgentOnlyBytespiderDiscoveryFileCrawls: crawler.totals.userAgentOnlyBytespiderDiscoveryFileCrawls,
    verifiedContentPaths: crawler.verifiedContentPathCoverage.length,
    searchRelatedCrawledEvidencePages: promptCoverage.totals.searchRelatedCrawledEvidencePages,
    promptsWithAnySearchRelatedCrawl: promptCoverage.totals.promptsWithAnySearchRelatedCrawl,
    trackedVisits: referral.trackedVisits,
    suspectedAutomatedTrackedVisits: referral.suspectedAutomatedTrackedVisits,
    periodicRotatingClientTrackedVisits: referral.periodicRotatingClientTrackedVisits || 0,
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
    waybackCaptures: wayback.totals.captures,
    waybackDistinctUrls: wayback.totals.distinctUrls,
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
    indexes: results.map((result) => ({
      id: result.id || null,
      status: result.status || 'unavailable',
    })),
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

export function buildWaybackAvailability(wayback) {
  const available = wayback?.status === 'available';
  return {
    status: available ? 'available' : 'unavailable',
    sourcesChecked: 1,
    availableSources: available ? 1 : 0,
    unavailableSources: available ? 0 : 1,
    sources: [{
      id: wayback?.query || 'https://web.archive.org/cdx/search/cdx',
      status: available ? 'available' : 'unavailable',
      httpStatus: wayback?.httpStatus ?? null,
      reason: available ? null : wayback?.reason || 'unavailable',
    }],
    interpretation: available
      ? 'The public Wayback CDX query returned a complete usable response for this host and filter set.'
      : 'The Wayback capture inventory is unavailable and its zero-valued counts must not be interpreted as no captures.',
  };
}

export function buildCrawlerVerificationAvailability(crawler) {
  const sources = Object.entries(crawler?.verificationSources || {})
    .map(([id, source]) => ({
      id,
      status: source.status === 'available' ? 'available' : 'unavailable',
      httpStatus: source.httpStatus ?? null,
      reason: source.reason || null,
    }))
    .sort((left, right) => left.id.localeCompare(right.id));
  const availableSources = sources.filter((source) => source.status === 'available').length;
  const unavailableSources = sources.length - availableSources;
  const status = !sources.length || !availableSources
    ? 'unavailable'
    : unavailableSources
      ? 'partial'
      : 'available';
  return {
    status,
    sourcesChecked: sources.length,
    availableSources,
    unavailableSources,
    sources,
    interpretation: status === 'available'
      ? 'All requested published IP-prefix sources were available for crawler identity verification.'
      : 'Crawler identity verification is incomplete; events relying on unavailable sources remain unverified.',
  };
}

export function buildDistributionAvailability(distribution) {
  const sources = (distribution?.results || [])
    .map((result) => {
      const available = Number.isInteger(result.status)
        && result.status >= 200
        && result.status < 300
        && result.sameDestination === true
        && (!Array.isArray(result.missingMarkers) || result.missingMarkers.length === 0);
      return {
        id: `${result.itemId || 'unknown'}:${result.kind || 'unknown'}:${result.url || 'unknown'}`,
        status: available ? 'available' : 'unavailable',
        httpStatus: Number.isInteger(result.status) ? result.status : null,
        reason: available ? null : result.reason || (result.sameDestination === false ? 'destination-mismatch' : (result.missingMarkers || []).length ? 'content-marker-missing' : 'request-failed'),
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));
  const availableSources = sources.filter((source) => source.status === 'available').length;
  const unavailableSources = sources.length - availableSources;
  const status = !sources.length || !availableSources
    ? 'unavailable'
    : unavailableSources
      ? 'partial'
      : 'available';
  return {
    status,
    publishedItems: Number(distribution?.publishedItems || 0),
    sourcesChecked: sources.length,
    availableSources,
    unavailableSources,
    sources,
    interpretation: status === 'available'
      ? 'All declared offsite publications and tracked canonical targets passed anonymous reachability, destination, and content-marker checks.'
      : 'Offsite distribution verification is incomplete; failed sources do not prove publication loss until independently retested.',
  };
}

function availabilityCoverage(value, useDetailedIndexes) {
  if (useDetailedIndexes) {
    return {
      indexes: value.indexes
        .map((index) => ({ id: index.id || null, status: index.status || 'unavailable' }))
        .sort((left, right) => `${left.id}:${left.status}`.localeCompare(`${right.id}:${right.status}`)),
    };
  }
  return {
    indexesChecked: Number(value?.indexesChecked || 0),
    availableIndexes: Number(value?.availableIndexes || 0),
    unavailableIndexes: Number(value?.unavailableIndexes || 0),
    unavailableIndexIds: (value?.unavailable || []).map((index) => index.id || null).sort(),
  };
}

export function buildAvailabilityChanges(currentAvailability, previousAvailability) {
  if (!previousAvailability) return [];
  return Object.entries(currentAvailability).flatMap(([source, current]) => {
    const previous = previousAvailability[source];
    if (!previous) return [];
    const statusChanged = previous.status !== current.status;
    const useDetailedIndexes = Array.isArray(previous.indexes) && Array.isArray(current.indexes);
    const useDetailedSources = Array.isArray(previous.sources) && Array.isArray(current.sources);
    const sourceCoverage = (value) => ({
      sources: value.sources
        .map((entry) => ({ id: entry.id || null, status: entry.status || 'unavailable' }))
        .sort((left, right) => `${left.id}:${left.status}`.localeCompare(`${right.id}:${right.status}`)),
    });
    const previousCoverage = useDetailedSources ? sourceCoverage(previous) : availabilityCoverage(previous, useDetailedIndexes);
    const currentCoverage = useDetailedSources ? sourceCoverage(current) : availabilityCoverage(current, useDetailedIndexes);
    const coverageChanged = JSON.stringify(previousCoverage) !== JSON.stringify(currentCoverage);
    if (!statusChanged && !coverageChanged) return [];
    return [{
      source,
      previousStatus: previous.status || 'unknown',
      currentStatus: current.status || 'unknown',
      statusChanged,
      coverageChanged,
      previousCoverage,
      currentCoverage,
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

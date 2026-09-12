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
    waybackArchivedEvidencePages: wayback.promptCoverage?.totals?.archivedEvidencePages || 0,
    promptsWithAnyWaybackArchive: wayback.promptCoverage?.totals?.promptsWithAnyArchivedEvidence || 0,
    promptsFullyWaybackArchived: wayback.promptCoverage?.totals?.promptsFullyArchived || 0,
  };
}

export function buildEvidenceDeltas(counts, previousCounts) {
  if (!previousCounts) return Object.fromEntries(Object.keys(counts).map((key) => [key, 0]));
  return Object.fromEntries(Object.entries(counts).map(([key, value]) => [
    key,
    Object.hasOwn(previousCounts, key) ? value - Number(previousCounts[key]) : null,
  ]));
}

const appendOnlyCrawlerMetric = /^verified(?:GptBot|OaiSearchBot|Bing|Baidu|Google|Perplexity|CommonCrawl|Apple|Yandex|Ahrefs)(?:Page|DiscoveryFile)Crawls$/;

export function mergeVerifiedCrawlerObservations(...observationGroups) {
  const byFingerprint = new Map();
  for (const observation of observationGroups.flat()) {
    if (!observation?.fingerprint || observation.classification !== 'candidate-page-crawl' && observation.classification !== 'candidate-discovery-file-crawl') continue;
    byFingerprint.set(observation.fingerprint, {
      fingerprint: observation.fingerprint,
      family: observation.family,
      classification: observation.classification,
      time: observation.time,
      method: observation.method,
      path: observation.path,
      status: observation.status,
    });
  }
  return [...byFingerprint.values()].sort((left, right) => left.time.localeCompare(right.time) || left.fingerprint.localeCompare(right.fingerprint));
}

export function buildCumulativeVerifiedContentPathCoverage(observations) {
  const byPath = new Map();
  for (const observation of observations || []) {
    if (observation.classification !== 'candidate-page-crawl') continue;
    const pathOnly = observation.path.split('?')[0];
    const entry = byPath.get(pathOnly) || {
      path: pathOnly,
      families: new Set(),
      firstSeen: observation.time,
      lastSeen: observation.time,
      requests: 0,
    };
    entry.families.add(observation.family);
    if (observation.time < entry.firstSeen) entry.firstSeen = observation.time;
    if (observation.time > entry.lastSeen) entry.lastSeen = observation.time;
    entry.requests += 1;
    byPath.set(pathOnly, entry);
  }
  return [...byPath.values()]
    .sort((left, right) => left.path.localeCompare(right.path))
    .map((entry) => ({ ...entry, families: [...entry.families].sort() }));
}

export function preserveAppendOnlyCrawlerCounts(currentCounts, previousCounts, newEvidenceByMetric, hasSeenLedger) {
  const counts = { ...currentCounts };
  const retentionAdjustments = [];
  if (!previousCounts || !hasSeenLedger) return { counts, retentionAdjustments };

  for (const [metric, current] of Object.entries(currentCounts)) {
    if (!appendOnlyCrawlerMetric.test(metric) && metric !== 'verifiedContentPaths') continue;
    const newlyObserved = metric === 'verifiedContentPaths' ? 0 : Number(newEvidenceByMetric?.get(metric) || 0);
    const cumulativeFloor = Number(previousCounts[metric] || 0) + newlyObserved;
    if (Number(current) >= cumulativeFloor) continue;
    counts[metric] = cumulativeFloor;
    retentionAdjustments.push({
      metric,
      retainedLogCount: Number(current),
      cumulativeCount: cumulativeFloor,
      newlyObserved,
      reason: 'Previously verified evidence is retained after its source log rotates out of the current file set.',
    });
  }
  return { counts, retentionAdjustments };
}

export function buildCommonCrawlAvailability(commonCrawl) {
  const results = Array.isArray(commonCrawl?.results) ? commonCrawl.results : [];
  const available = results.filter((result) => result.status === 'available');
  const unavailable = results.filter((result) => result.status !== 'available');
  const status = commonCrawl?.collectionIndexStatus !== 'available' || !results.length || !available.length
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

export function buildServicesHkAvailability(report) {
  const sources = (report?.results || [])
    .map((result) => ({
      id: result.id || result.url || 'unknown',
      status: result.status === 'available' ? 'available' : 'unavailable',
      httpStatus: Number.isInteger(result.httpStatus) ? result.httpStatus : null,
      reason: result.status === 'available' ? null : result.reason || 'service-detail-unusable',
    }))
    .sort((left, right) => left.id.localeCompare(right.id));
  const availableSources = sources.filter((source) => source.status === 'available').length;
  const unavailableSources = sources.length - availableSources;
  const status = !sources.length || !availableSources ? 'unavailable' : unavailableSources ? 'partial' : 'available';
  return {
    status,
    sourcesChecked: sources.length,
    availableSources,
    unavailableSources,
    sources,
    interpretation: status === 'available'
      ? 'All sampled services.hk detail templates are readable and free of the known PHP application failure; submission still requires current user confirmation.'
      : 'At least one sampled services.hk detail template is unusable; HTTP 200 alone is not treated as channel readiness.',
  };
}

export function buildDomainCanonicalizationAvailability(report) {
  const sources = (report?.results || [])
    .map((result) => ({
      id: result.id || result.startUrl || 'unknown',
      status: result.status || 'unavailable',
      httpStatus: Number.isInteger(result.finalStatus) ? result.finalStatus : null,
      reason: result.status === 'compliant' ? null : (result.reasons || []).join(',') || 'unavailable',
    }))
    .sort((left, right) => left.id.localeCompare(right.id));
  return {
    status: report?.status || 'unavailable',
    canonicalOrigin: report?.canonicalOrigin || null,
    sourcesChecked: sources.length,
    compliantSources: sources.filter((source) => source.status === 'compliant').length,
    noncompliantSources: sources.filter((source) => source.status === 'noncompliant').length,
    unavailableSources: sources.filter((source) => source.status === 'unavailable').length,
    sources,
    interpretation: report?.status === 'compliant'
      ? 'All monitored domain entry points remain on HTTPS and expose the Hong Kong canonical origin.'
      : 'At least one monitored domain entry point is unavailable, serves content over HTTP, downgrades HTTPS, or exposes a mismatched canonical target.',
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
    if (!previous) return [{
      source,
      previousStatus: 'unmonitored',
      currentStatus: current.status || 'unknown',
      statusChanged: true,
      coverageChanged: true,
      previousCoverage: { sources: [] },
      currentCoverage: Array.isArray(current.sources) ? { sources: current.sources.map((entry) => ({ id: entry.id || null, status: entry.status || 'unavailable' })).sort((left, right) => `${left.id}:${left.status}`.localeCompare(`${right.id}:${right.status}`)) } : availabilityCoverage(current, Array.isArray(current.indexes)),
    }];
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

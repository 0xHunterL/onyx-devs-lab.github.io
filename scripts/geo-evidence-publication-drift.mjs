const canonicalize = (value) => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nestedValue]) => [key, canonicalize(nestedValue)]),
    );
  }
  return value;
};
const comparable = (value) => JSON.stringify(canonicalize(value));
const normalizeGithubRepositoryQueries = (queries = []) => queries
  .map((item) => ({
    ...item,
    firstPartyRepositoriesObserved: [...(item.firstPartyRepositoriesObserved || [])]
      .sort((left, right) => left.localeCompare(right)),
  }))
  .sort((left, right) => left.id.localeCompare(right.id));
const requiredCrawlerVerificationSourceIds = [
  'ahrefsBot',
  'appleBot',
  'commonCrawlBot',
  'gptBot',
  'oaiSearchBot',
  'perplexityBot',
  'perplexityUser',
];

export function buildExpectedDistributionSources(manifest) {
  return (manifest?.items || [])
    .filter((item) => item.status === 'published')
    .flatMap((item) => [
      { id: `${item.id}:publicUrl:${item.publicUrl}`, status: 'available' },
      ...(item.trackedTargets || []).map((url) => ({ id: `${item.id}:trackedTarget:${url}`, status: 'available' })),
    ])
    .sort((left, right) => left.id.localeCompare(right.id));
}

export function retainedLogLineageIsContinuous(policy, sourceLogs) {
  const basePath = policy?.basePath;
  if (policy?.mode !== 'continuous-numbered-rotation-lineage' || typeof basePath !== 'string' || !Array.isArray(sourceLogs) || sourceLogs.length === 0) return false;
  if (sourceLogs.at(-1) !== basePath || new Set(sourceLogs).size !== sourceLogs.length) return false;

  const rotations = sourceLogs.slice(0, -1);
  return rotations.every((logPath, index) => {
    const rotation = rotations.length - index;
    return logPath === (rotation === 1 ? `${basePath}.1` : `${basePath}.${rotation}.gz`);
  });
}

export function buildPublicationDrift(baseline, summary, { distributionManifest, promptCoverageBaseline } = {}) {
  const mismatches = [];
  const check = (field, published, collected) => {
    if (comparable(published) !== comparable(collected)) mismatches.push({ field, published, collected });
  };
  const checkCumulativeFloor = (field, published, collected) => {
    if (!Number.isFinite(published) || !Number.isFinite(collected) || collected < published) {
      mismatches.push({ field, published, collected });
    }
  };

  const provider = baseline.providerVerifiedCrawlerEvidence || {};
  const crawlerAccounting = baseline.crawlerEvidenceAccounting || {};
  const attribution = baseline.attributionEvidence || {};
  const prompt = baseline.fixedPromptCoverage || {};
  const commonCrawl = baseline.commonCrawlEvidence || {};
  const wayback = baseline.waybackEvidence || {};
  const distribution = baseline.distributionEvidence || {};
  const expectedDistribution = distribution.expectedAfterCurrentCheckpointPublication || distribution;
  const servicesHk = baseline.servicesHkReadinessEvidence || {};
  const domainCanonicalization = baseline.domainCanonicalizationEvidence || {};
  const githubRepositorySearch = baseline.githubRepositorySearchEvidence || {};
  const counts = summary.counts || {};
  const collectedEvidenceSets = summary.evidenceSets || {};
  const collectedCommonCrawl = summary.availability?.commonCrawl || {};
  const collectedWayback = summary.availability?.wayback || {};
  const collectedCrawlerVerification = summary.availability?.crawlerVerification || {};
  const collectedDistribution = summary.availability?.distribution || {};
  const collectedServicesHk = summary.availability?.servicesHk || {};
  const collectedDomainCanonicalization = summary.availability?.domainCanonicalization || {};
  const collectedGithubRepositorySearch = summary.platformSearch || {};

  const cumulativeCrawlerCountMappings = [
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
  ];
  for (const mapping of cumulativeCrawlerCountMappings) checkCumulativeFloor(...mapping);

  const exactCountMappings = [
    ['providerVerifiedCrawlerEvidence.distinctVerifiedContentPaths', provider.distinctVerifiedContentPaths, counts.verifiedContentPaths],
    ['fixedPromptCoverage.searchRelatedCrawledEvidencePages', prompt.searchRelatedCrawledEvidencePages, counts.searchRelatedCrawledEvidencePages],
    ['fixedPromptCoverage.promptsWithAnySearchRelatedCrawl', prompt.promptsWithAnySearchRelatedCrawl, counts.promptsWithAnySearchRelatedCrawl],
    ['attributionEvidence.visitorTypeUnverifiedRequests', attribution.visitorTypeUnverifiedRequests, counts.humanUnverifiedTrackedVisits],
    ['attributionEvidence.aiReferrerAttributedRequests', attribution.aiReferrerAttributedRequests, counts.aiReferrerAttributedVisits],
  ];
  for (const mapping of exactCountMappings) check(...mapping);
  // Suspected-automation counters remain published audit context, but are not
  // visibility gains. Ignoring them here prevents Release-link safety scans
  // from creating publication churn.
  check('attributionEvidence.latestVerifiedOffsiteReferral', attribution.latestVerifiedOffsiteReferral || null, collectedEvidenceSets.latestVerifiedOffsiteReferral || null);
  check('attributionEvidence.latestVisitorTypeUnverifiedAttributions', attribution.latestVisitorTypeUnverifiedAttributions || [], collectedEvidenceSets.latestVisitorTypeUnverifiedAttributions || []);
  if (promptCoverageBaseline) {
    check(
      'fixedPromptCoverage.verifiedCrawledEvidenceUrls',
      [...(promptCoverageBaseline.verifiedCrawledEvidenceUrls || [])].sort(),
      [...(collectedEvidenceSets.promptVerifiedCrawledEvidenceUrls || [])].sort(),
    );
    check(
      'fixedPromptCoverage.searchRelatedCrawledEvidenceUrls',
      [...(promptCoverageBaseline.searchRelatedCrawledEvidenceUrls || [])].sort(),
      [...(collectedEvidenceSets.promptSearchRelatedCrawledEvidenceUrls || [])].sort(),
    );
  }
  // Common Crawl and Wayback are dated external snapshots whose current result
  // sets can grow, roll forward, deduplicate, or temporarily contract. The
  // collector preserves those changes as append-only events. They are not a
  // reason to fail publication unless a separately pinned artifact is being
  // validated; the published checkpoint remains a truthful historical result.

  check('crawlerEvidenceAccounting.retainedLogPolicyCompliance', 'compliant', retainedLogLineageIsContinuous(crawlerAccounting.retainedLogPolicy, summary.sourceLogs || []) ? 'compliant' : 'noncompliant');
  // This diagnostic can legitimately appear or disappear as the retained log
  // window moves. Durable safety comes from the cumulative counters above and
  // the continuous rotation-lineage check, not from pinning this transient list.
  check('crawlerVerificationAvailability.requiredStatus', 'available', collectedCrawlerVerification.status);
  check(
    'crawlerVerificationAvailability.requiredSources',
    requiredCrawlerVerificationSourceIds.map((id) => ({ id, status: 'available' })),
    (collectedCrawlerVerification.sources || [])
      .map(({ id, status }) => ({ id, status }))
      .sort((left, right) => left.id.localeCompare(right.id)),
  );
  check('distributionEvidence.publishedItems', expectedDistribution.publishedItems, collectedDistribution.publishedItems);
  check('distributionEvidence.availableSources', expectedDistribution.availableSources, collectedDistribution.availableSources);
  check('distributionEvidence.unavailableSources', expectedDistribution.unavailableSources, collectedDistribution.unavailableSources);
  check('distributionEvidence.availabilityStatus', expectedDistribution.availabilityStatus, collectedDistribution.status);
  const manifestPublishedItems = (distributionManifest?.items || []).filter((item) => item.status === 'published').length;
  const manifestRepresentsPrePublicationSnapshot = Boolean(distribution.expectedAfterCurrentCheckpointPublication)
    && manifestPublishedItems === distribution.publishedItems
    && manifestPublishedItems + 1 === expectedDistribution.publishedItems;
  if (distributionManifest && !manifestRepresentsPrePublicationSnapshot) {
    check(
      'distributionEvidence.requiredSources',
      buildExpectedDistributionSources(distributionManifest),
      (collectedDistribution.sources || [])
        .map(({ id, status }) => ({ id, status }))
        .sort((left, right) => left.id.localeCompare(right.id)),
    );
  }
  check('servicesHkReadinessEvidence.availabilityStatus', servicesHk.availabilityStatus, collectedServicesHk.status);
  check('servicesHkReadinessEvidence.targetsChecked', servicesHk.targetsChecked, collectedServicesHk.sourcesChecked);
  check('servicesHkReadinessEvidence.availableTargets', servicesHk.availableTargets, collectedServicesHk.availableSources);
  check('servicesHkReadinessEvidence.unavailableTargets', servicesHk.unavailableTargets, collectedServicesHk.unavailableSources);
  check('servicesHkReadinessEvidence.targets', (servicesHk.targets || []).map(({ id, status }) => ({ id, status })), (collectedServicesHk.sources || []).map(({ id, status }) => ({ id, status })));
  check('domainCanonicalizationEvidence.status', domainCanonicalization.status, collectedDomainCanonicalization.status);
  check('domainCanonicalizationEvidence.canonicalOrigin', domainCanonicalization.canonicalOrigin, collectedDomainCanonicalization.canonicalOrigin);
  check('domainCanonicalizationEvidence.targetsChecked', domainCanonicalization.targetsChecked, collectedDomainCanonicalization.sourcesChecked);
  check('domainCanonicalizationEvidence.compliantTargets', domainCanonicalization.compliantTargets, collectedDomainCanonicalization.compliantSources);
  check('domainCanonicalizationEvidence.noncompliantTargets', domainCanonicalization.noncompliantTargets, collectedDomainCanonicalization.noncompliantSources);
  check('domainCanonicalizationEvidence.unavailableTargets', domainCanonicalization.unavailableTargets, collectedDomainCanonicalization.unavailableSources);
  check('domainCanonicalizationEvidence.authorityObservation', domainCanonicalization.authorityObservation, collectedDomainCanonicalization.authorityObservation);
  check('domainCanonicalizationEvidence.edgeObservation', domainCanonicalization.edgeObservation, collectedDomainCanonicalization.edgeObservation);
  check(
    'domainCanonicalizationEvidence.targets',
    (domainCanonicalization.targets || []).map(({ id, status, reasons }) => ({ id, status, reason: (reasons || []).join(',') })).sort((left, right) => left.id.localeCompare(right.id)),
    (collectedDomainCanonicalization.sources || []).map(({ id, status, reason }) => ({ id, status, reason: reason || '' })).sort((left, right) => left.id.localeCompare(right.id)),
  );
  if (Object.keys(githubRepositorySearch).length || Object.keys(collectedGithubRepositorySearch).length) {
    check('githubRepositorySearchEvidence.status', githubRepositorySearch.status, collectedGithubRepositorySearch.status);
    if (collectedGithubRepositorySearch.status === 'available') check(
      'githubRepositorySearchEvidence.queries',
      normalizeGithubRepositoryQueries(githubRepositorySearch.queries),
      normalizeGithubRepositoryQueries(collectedGithubRepositorySearch.queries),
    );
  }

  return {
    schemaVersion: 1,
    checkedAt: new Date().toISOString(),
    status: mismatches.length ? 'drift' : 'synchronized',
    baselineVersion: baseline.publicStatusVersion || null,
    baselineObservedAt: baseline.generatedAt || null,
    collectionObservedAt: summary.generatedAt || null,
    mismatches,
    evidenceBoundary: 'Synchronized means the latest supplied production collection satisfies the publication-integrity policy: cumulative crawler evidence has not regressed and exact structural sets still match. It does not mean every naturally increasing or externally volatile count was republished, and it does not prove indexing, retrieval, citation, ranking, a human visit, or recommendation.',
  };
}

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildExpectedDistributionSources, buildPublicationDrift } from './geo-evidence-publication-drift.mjs';

const baseline = JSON.parse(await readFile('docs/geo-baselines/2026-09-11-monitor-evidence.json', 'utf8'));
const distributionManifest = JSON.parse(await readFile('geo/distribution-manifest.json', 'utf8'));
const promptCoverageBaseline = JSON.parse(await readFile('docs/geo-baselines/2026-09-11-prompt-crawl-coverage.json', 'utf8'));
const provider = baseline.providerVerifiedCrawlerEvidence;
const attribution = baseline.attributionEvidence;
const prompt = baseline.fixedPromptCoverage;
const commonCrawl = baseline.commonCrawlEvidence;
const wayback = baseline.waybackEvidence;
const distribution = baseline.distributionEvidence;
const servicesHk = baseline.servicesHkReadinessEvidence;
const domainCanonicalization = baseline.domainCanonicalizationEvidence;
const githubRepositorySearch = baseline.githubRepositorySearchEvidence;
const summary = {
  generatedAt: baseline.generatedAt,
  evidenceSets: {
    attributionCampaigns: structuredClone(attribution.campaigns),
    latestVerifiedOffsiteReferral: structuredClone(attribution.latestVerifiedOffsiteReferral),
    latestVisitorTypeUnverifiedAttributions: structuredClone(attribution.latestVisitorTypeUnverifiedAttributions),
    promptVerifiedCrawledEvidenceUrls: structuredClone(promptCoverageBaseline.verifiedCrawledEvidenceUrls),
    promptSearchRelatedCrawledEvidenceUrls: structuredClone(promptCoverageBaseline.searchRelatedCrawledEvidenceUrls),
    waybackMissingEvidenceUrls: structuredClone(wayback.fixedPromptArchiveCoverage.missingEvidenceUrls),
  },
  sourceLogs: structuredClone(baseline.crawlerEvidenceAccounting.currentRetainedLogPaths),
  retentionAdjustments: structuredClone(baseline.crawlerEvidenceAccounting.latestRetentionAdjustments),
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
    verifiedGoogleDiscoveryFileCrawls: provider.googlebotDiscoveryFileRequests,
    verifiedPerplexityPageCrawls: provider.perplexityContentRequests,
    verifiedPerplexityDiscoveryFileCrawls: provider.perplexityDiscoveryFileRequests,
    verifiedCommonCrawlPageCrawls: provider.commonCrawlBotContentRequests,
    verifiedCommonCrawlDiscoveryFileCrawls: provider.commonCrawlBotDiscoveryFileRequests,
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
    crawlerVerification: {
      status: 'available',
      sources: [
        'ahrefsBot',
        'appleBot',
        'commonCrawlBot',
        'gptBot',
        'oaiSearchBot',
        'perplexityBot',
        'perplexityUser',
      ].map((id) => ({ id, status: 'available' })),
    },
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
      sources: buildExpectedDistributionSources(distributionManifest),
    },
    servicesHk: {
      status: servicesHk.availabilityStatus,
      sourcesChecked: servicesHk.targetsChecked,
      availableSources: servicesHk.availableTargets,
      unavailableSources: servicesHk.unavailableTargets,
      sources: servicesHk.targets.map(({ id, status }) => ({ id, status })),
    },
    domainCanonicalization: {
      status: domainCanonicalization.status,
      canonicalOrigin: domainCanonicalization.canonicalOrigin,
      sourcesChecked: domainCanonicalization.targetsChecked,
      compliantSources: domainCanonicalization.compliantTargets,
      noncompliantSources: domainCanonicalization.noncompliantTargets,
      unavailableSources: domainCanonicalization.unavailableTargets,
      sources: domainCanonicalization.targets.map(({ id, status, reasons }) => ({ id, status, reason: (reasons || []).join(',') })).sort((left, right) => left.id.localeCompare(right.id)),
    },
  },
  platformSearch: {
    status: githubRepositorySearch.status,
    queries: structuredClone(githubRepositorySearch.queries),
  },
};

const synchronized = buildPublicationDrift(baseline, summary, { distributionManifest, promptCoverageBaseline });
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

const attributionCampaignReplacement = structuredClone(summary);
const campaignIds = Object.keys(attributionCampaignReplacement.evidenceSets.attributionCampaigns);
attributionCampaignReplacement.evidenceSets.attributionCampaigns[campaignIds[0]] -= 1;
attributionCampaignReplacement.evidenceSets.attributionCampaigns[campaignIds[1]] += 1;
assert.equal(buildPublicationDrift(baseline, attributionCampaignReplacement).mismatches[0].field, 'attributionEvidence.campaigns');

const latestVerifiedOffsiteReplacement = structuredClone(summary);
latestVerifiedOffsiteReplacement.evidenceSets.latestVerifiedOffsiteReferral.landingPage = '/zh-cn/replacement/';
assert.equal(buildPublicationDrift(baseline, latestVerifiedOffsiteReplacement).mismatches[0].field, 'attributionEvidence.latestVerifiedOffsiteReferral');

const visitorTypeUnverifiedReplacement = structuredClone(summary);
visitorTypeUnverifiedReplacement.evidenceSets.latestVisitorTypeUnverifiedAttributions[0].landingPage = '/zh-cn/replacement/';
assert.equal(buildPublicationDrift(baseline, visitorTypeUnverifiedReplacement).mismatches[0].field, 'attributionEvidence.latestVisitorTypeUnverifiedAttributions');

const reorderedAttributionRecord = structuredClone(summary);
reorderedAttributionRecord.evidenceSets.latestVerifiedOffsiteReferral = Object.fromEntries(
  Object.entries(reorderedAttributionRecord.evidenceSets.latestVerifiedOffsiteReferral).reverse(),
);
assert.equal(buildPublicationDrift(baseline, reorderedAttributionRecord).status, 'synchronized');

const crawlerDrift = structuredClone(summary);
crawlerDrift.counts.verifiedGptBotPageCrawls += 1;
assert.equal(buildPublicationDrift(baseline, crawlerDrift).mismatches[0].field, 'providerVerifiedCrawlerEvidence.gptBotContentRequests');

const promptCoverageUrlReplacement = structuredClone(summary);
promptCoverageUrlReplacement.evidenceSets.promptVerifiedCrawledEvidenceUrls[0] = 'https://hk.onyxdevslab.com/zh-cn/replacement/';
assert.equal(buildPublicationDrift(baseline, promptCoverageUrlReplacement, { promptCoverageBaseline }).mismatches[0].field, 'fixedPromptCoverage.verifiedCrawledEvidenceUrls');

const crawlerVerificationUnavailable = structuredClone(summary);
crawlerVerificationUnavailable.availability.crawlerVerification.status = 'partial';
crawlerVerificationUnavailable.availability.crawlerVerification.sources[0].status = 'unavailable';
assert.deepEqual(buildPublicationDrift(baseline, crawlerVerificationUnavailable).mismatches.map((item) => item.field), [
  'crawlerVerificationAvailability.requiredStatus',
  'crawlerVerificationAvailability.requiredSources',
]);

const crawlerVerificationSourceMissing = structuredClone(summary);
crawlerVerificationSourceMissing.availability.crawlerVerification.sources.pop();
assert.equal(buildPublicationDrift(baseline, crawlerVerificationSourceMissing).mismatches[0].field, 'crawlerVerificationAvailability.requiredSources');

const commonCrawlBotDrift = structuredClone(summary);
commonCrawlBotDrift.counts.verifiedCommonCrawlDiscoveryFileCrawls += 1;
assert.equal(buildPublicationDrift(baseline, commonCrawlBotDrift).mismatches[0].field, 'providerVerifiedCrawlerEvidence.commonCrawlBotDiscoveryFileRequests');

const retentionAdjustmentDrift = structuredClone(summary);
retentionAdjustmentDrift.retentionAdjustments.push({ metric: 'verifiedYandexPageCrawls', retainedLogCount: 70, cumulativeCount: 71, newlyObserved: 0 });
assert.equal(buildPublicationDrift(baseline, retentionAdjustmentDrift).mismatches[0].field, 'crawlerEvidenceAccounting.latestRetentionAdjustments');

const retainedLogExpansion = structuredClone(summary);
retainedLogExpansion.sourceLogs.unshift('/var/log/nginx/hk.onyxdevslab.com.geo.log.5.gz');
assert.equal(buildPublicationDrift(baseline, retainedLogExpansion).mismatches.length, 0);

const retainedLogSetDrift = structuredClone(summary);
retainedLogSetDrift.sourceLogs.pop();
assert.equal(buildPublicationDrift(baseline, retainedLogSetDrift).mismatches[0].field, 'crawlerEvidenceAccounting.retainedLogPolicyCompliance');

const retainedLogPathDrift = structuredClone(summary);
retainedLogPathDrift.sourceLogs[0] = '/var/log/nginx/unexpected.log.3.gz';
assert.equal(buildPublicationDrift(baseline, retainedLogPathDrift).mismatches[0].field, 'crawlerEvidenceAccounting.retainedLogPolicyCompliance');

const commonCrawlDrift = structuredClone(summary);
commonCrawlDrift.availability.commonCrawl.status = commonCrawl.status === 'partial' ? 'available' : 'partial';
commonCrawlDrift.availability.commonCrawl.indexes[0].status = 'unavailable';
const commonCrawlFields = buildPublicationDrift(baseline, commonCrawlDrift).mismatches.map((item) => item.field);
assert.deepEqual(commonCrawlFields, ['commonCrawlEvidence.status', 'commonCrawlEvidence.availableIndexes', 'commonCrawlEvidence.unavailableIndexes']);

const distributionDrift = structuredClone(summary);
distributionDrift.availability.distribution.status = 'partial';
assert.equal(buildPublicationDrift(baseline, distributionDrift).mismatches[0].field, 'distributionEvidence.availabilityStatus');

const distributionSourceReplacement = structuredClone(summary);
distributionSourceReplacement.availability.distribution.sources[0].id = 'replacement:publicUrl:https://example.invalid/';
assert.equal(buildPublicationDrift(baseline, distributionSourceReplacement, { distributionManifest }).mismatches[0].field, 'distributionEvidence.requiredSources');

const servicesHkStatusDrift = structuredClone(summary);
servicesHkStatusDrift.availability.servicesHk.status = 'available';
assert.equal(buildPublicationDrift(baseline, servicesHkStatusDrift).mismatches[0].field, 'servicesHkReadinessEvidence.availabilityStatus');

const servicesHkTargetCountDrift = structuredClone(summary);
servicesHkTargetCountDrift.availability.servicesHk.sourcesChecked += 1;
assert.equal(buildPublicationDrift(baseline, servicesHkTargetCountDrift).mismatches[0].field, 'servicesHkReadinessEvidence.targetsChecked');

const servicesHkAvailableCountDrift = structuredClone(summary);
servicesHkAvailableCountDrift.availability.servicesHk.availableSources += 1;
assert.equal(buildPublicationDrift(baseline, servicesHkAvailableCountDrift).mismatches[0].field, 'servicesHkReadinessEvidence.availableTargets');

const servicesHkSourceDrift = structuredClone(summary);
servicesHkSourceDrift.availability.servicesHk.sources[0].status = 'available';
assert.equal(buildPublicationDrift(baseline, servicesHkSourceDrift).mismatches[0].field, 'servicesHkReadinessEvidence.targets');

const githubRepositorySearchDrift = structuredClone(summary);
githubRepositorySearchDrift.platformSearch.queries.find((item) => item.id === 'category').totalCount = 1;
assert.equal(buildPublicationDrift(baseline, githubRepositorySearchDrift).mismatches[0].field, 'githubRepositorySearchEvidence.queries');

const domainCanonicalizationStatusDrift = structuredClone(summary);
domainCanonicalizationStatusDrift.availability.domainCanonicalization.status = 'compliant';
assert.equal(buildPublicationDrift(baseline, domainCanonicalizationStatusDrift).mismatches[0].field, 'domainCanonicalizationEvidence.status');

const domainCanonicalizationSourceDrift = structuredClone(summary);
domainCanonicalizationSourceDrift.availability.domainCanonicalization.sources.find((item) => item.id === 'https-www').status = 'compliant';
assert.equal(buildPublicationDrift(baseline, domainCanonicalizationSourceDrift).mismatches[0].field, 'domainCanonicalizationEvidence.targets');
assert.match(synchronized.evidenceBoundary, /does not prove indexing/);

const waybackAvailableBaseline = structuredClone(baseline);
waybackAvailableBaseline.waybackEvidence.status = 'available';
const waybackDrift = structuredClone(summary);
waybackDrift.availability.wayback.status = 'available';
waybackDrift.counts.waybackDistinctUrls += 1;
assert.equal(buildPublicationDrift(waybackAvailableBaseline, waybackDrift).mismatches[0].field, 'waybackEvidence.distinctUrls');

const waybackPromptDrift = structuredClone(summary);
waybackPromptDrift.availability.wayback.status = 'available';
waybackPromptDrift.counts.promptsFullyWaybackArchived += 1;
assert.equal(buildPublicationDrift(waybackAvailableBaseline, waybackPromptDrift).mismatches[0].field, 'waybackEvidence.fixedPromptArchiveCoverage.promptsFullyArchived');

const waybackMissingUrlReplacement = structuredClone(summary);
waybackMissingUrlReplacement.availability.wayback.status = 'available';
waybackMissingUrlReplacement.evidenceSets.waybackMissingEvidenceUrls[0] = 'https://hk.onyxdevslab.com/zh-cn/replacement/';
assert.equal(buildPublicationDrift(waybackAvailableBaseline, waybackMissingUrlReplacement).mismatches[0].field, 'waybackEvidence.fixedPromptArchiveCoverage.missingEvidenceUrls');

const unavailableArchiveSources = structuredClone(summary);
unavailableArchiveSources.availability.commonCrawl.status = 'unavailable';
unavailableArchiveSources.availability.commonCrawl.indexes.forEach((item) => { item.status = 'unavailable'; });
unavailableArchiveSources.availability.wayback.status = 'unavailable';
unavailableArchiveSources.counts.commonCrawlCaptures = 0;
unavailableArchiveSources.counts.waybackCaptures = 0;
unavailableArchiveSources.counts.waybackDistinctUrls = 0;
unavailableArchiveSources.counts.waybackArchivedEvidencePages = 0;
unavailableArchiveSources.counts.promptsWithAnyWaybackArchive = 0;
unavailableArchiveSources.counts.promptsFullyWaybackArchived = 0;
const unavailableArchiveFields = buildPublicationDrift(baseline, unavailableArchiveSources).mismatches.map((item) => item.field);
assert.ok(!unavailableArchiveFields.some((field) => field.startsWith('waybackEvidence.') && field !== 'waybackEvidence.status'));
assert.ok(!unavailableArchiveFields.includes('commonCrawlEvidence.capturesObservedInAvailableIndexes'));

console.log(JSON.stringify({ tests: 32, failures: [] }, null, 2));

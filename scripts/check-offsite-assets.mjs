import { createHash } from 'node:crypto';
import { fetchOffsiteResource } from './fetch-offsite-resource.mjs';

const failures = [];
const results = [];

async function get(name, url, expectedType, { allowUnavailable = false, attempts = 3, minimumBytes = 0 } = {}) {
  try {
    const { body, result, xRobotsTag } = await fetchOffsiteResource(name, url, { attempts, minimumBytes });
    if (!result.contentType.includes(expectedType)) failures.push(`${name}: expected ${expectedType}, got ${result.contentType || 'none'}`);
    if (/\b(?:noindex|none)\b/i.test(xRobotsTag)) failures.push(`${name}: blocking X-Robots-Tag: ${xRobotsTag}`);
    if (/<meta[^>]+(?:name|property)=["']robots["'][^>]+content=["'][^"']*\b(?:noindex|none)\b/i.test(body)) failures.push(`${name}: blocking robots meta`);
    results.push(result);
    return body;
  } catch (error) {
    const reason = error?.message || 'request failed';
    if (allowUnavailable) results.push({ ...error?.result, name, requestedUrl: url, status: 'unavailable', reason, attempts });
    else failures.push(reason);
    return '';
  }
}

function requireText(name, body, values) {
  for (const value of values) if (!body.includes(value)) failures.push(`${name}: missing ${value}`);
}

function requireArchivedText(name, body, values) {
  if (!body) return;
  const matched = values.filter((value) => body.includes(value));
  if (!matched.length) {
    results.push({
      name: `${name} replay content`,
      status: 'unavailable',
      reason: 'Internet Archive returned HTML without any expected captured-page markers',
    });
    return;
  }
  requireText(name, body, values);
}

const gistUrl = 'https://gist.github.com/mixuechu/e47c85808014d62b6305441e8065c91e';
const waybackHomepageUrl = 'https://web.archive.org/web/20260909205420id_/https://hk.onyxdevslab.com/';
const waybackHomepage = await get('Internet Archive homepage snapshot', waybackHomepageUrl, 'text/html');
requireArchivedText('Internet Archive homepage snapshot', waybackHomepage, [
  'Onyx Devs Lab',
  'ONYX DEVS LAB LIMITED',
  '79051925',
  '254900Z30CLK7HKE9H46',
  'AI advisory',
  'Custom AI development',
  'Forward Deployed Engineering',
]);
// Check the same public permalink published across the site. Wayback can remap a
// timestamp to the nearest retained capture; the result records the final URL.
const waybackAiDingkaiUrl = 'https://web.archive.org/web/20260909212732/https://hk.onyxdevslab.com/zh-cn/guides/ai-dingkai/';
const waybackAiDingkai = await get('Internet Archive AI dingkai snapshot', waybackAiDingkaiUrl, 'text/html');
requireArchivedText('Internet Archive AI dingkai snapshot', waybackAiDingkai, [
  'AI 定开是什么意思',
  'AI 定制开发',
  'Onyx Devs Lab',
  'ONYX DEVS LAB LIMITED',
  '79051925',
  '254900Z30CLK7HKE9H46',
  'FDE',
]);
const waybackCoreSnapshots = [
  {name:'organization profile',timestamp:'20260909233718',path:'zh-cn/about/'},
  {name:'AI consulting',timestamp:'20260909205631',path:'zh-cn/ai-consulting/'},
  {name:'custom AI development',timestamp:'20260909205642',path:'zh-cn/custom-ai-development/'},
  {name:'Forward Deployed Engineering',timestamp:'20260909214448',path:'zh-cn/forward-deployed-engineering/'},
];
for (const snapshot of waybackCoreSnapshots) {
  const url = `https://web.archive.org/web/${snapshot.timestamp}id_/https://hk.onyxdevslab.com/${snapshot.path}`;
  const body = await get(`Internet Archive ${snapshot.name} snapshot`, url, 'text/html', snapshot.name === 'custom AI development' ? { allowUnavailable: true, attempts: 4, minimumBytes: 12_000 } : undefined);
  requireArchivedText(`Internet Archive ${snapshot.name} snapshot`, body, ['Onyx Devs Lab','ONYX DEVS LAB LIMITED','79051925','254900Z30CLK7HKE9H46','AI 咨询','AI 定制开发','FDE']);
}
const softwareHeritageSnapshotId = 'a6d10e9586fcc1860acf66f32651994693d87578';
const softwareHeritageRevisionId = 'a2d9281d23f406cd7ab1b19ed62d0e4c2e6fadfc';
const softwareHeritageSaveRequestRaw = await get('Software Heritage save request', 'https://archive.softwareheritage.org/api/1/origin/save/2472540/', 'application/json');
try {
  const request = JSON.parse(softwareHeritageSaveRequestRaw);
  if (request.save_task_status !== 'succeeded' || request.visit_status !== 'full' || request.snapshot_swhid !== `swh:1:snp:${softwareHeritageSnapshotId}`) failures.push('Software Heritage save request: archive did not complete with the expected snapshot');
} catch {
  failures.push('Software Heritage save request: invalid JSON');
}
const softwareHeritageSnapshotRaw = await get('Software Heritage repository snapshot', `https://archive.softwareheritage.org/api/1/snapshot/${softwareHeritageSnapshotId}/`, 'application/json', { allowUnavailable: true });
if (softwareHeritageSnapshotRaw) {
  try {
    const snapshot = JSON.parse(softwareHeritageSnapshotRaw);
    if (snapshot.id !== softwareHeritageSnapshotId) failures.push('Software Heritage repository snapshot: unexpected snapshot id');
    if (snapshot.branches?.['refs/heads/main']?.target !== softwareHeritageRevisionId || snapshot.branches?.['refs/heads/main']?.target_type !== 'revision') failures.push('Software Heritage repository snapshot: main branch does not resolve to the archived checkpoint');
    if (snapshot.branches?.['refs/tags/geo-monitor-evidence-2026-09-12-49']?.target !== '93ad58598177fe15210d00b3e2802fbc99566720' || snapshot.branches?.['refs/tags/geo-monitor-evidence-2026-09-12-49']?.target_type !== 'revision') failures.push('Software Heritage repository snapshot: revision 49 evidence tag is missing or stale');
  } catch {
    failures.push('Software Heritage repository snapshot: invalid JSON');
  }
}
const softwareHeritageRevisionRaw = await get('Software Heritage archived revision', `https://archive.softwareheritage.org/api/1/revision/${softwareHeritageRevisionId}/`, 'application/json', { allowUnavailable: true });
if (softwareHeritageRevisionRaw) {
  try {
    const revision = JSON.parse(softwareHeritageRevisionRaw);
    if (revision.id !== softwareHeritageRevisionId || !revision.directory) failures.push('Software Heritage archived revision: immutable Git revision is incomplete');
  } catch {
    failures.push('Software Heritage archived revision: invalid JSON');
  }
}
const buyerGuideRepositoryUrl = 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide';
const buyerGuide = await get('GitHub enterprise AI buyer guide', buyerGuideRepositoryUrl, 'text/html');
requireText('GitHub enterprise AI buyer guide', buyerGuide, [
  'Hong Kong Enterprise AI Buyer’s Guide',
  '香港企业 AI 采购指南',
  'AI 定开',
  'Forward Deployed Engineering',
  'ONYX DEVS LAB LIMITED',
  '79051925',
  '254900Z30CLK7HKE9H46',
  'geo_buyers_guide',
  'Crawlable field guides',
  '"website":"https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/"',
]);
const buyerGuideSiteUrl = 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/';
const buyerGuideDiscussionUrl = 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/discussions/1';
const buyerGuideDiscussion = await get('GitHub procurement Q&A', buyerGuideDiscussionUrl, 'text/html');
requireText('GitHub procurement Q&A', buyerGuideDiscussion, [
  '<title>AI 定开、AI 咨询和 FDE 应该怎么选？',
  '先看项目当前缺少哪一种证据',
  'ONYX DEVS LAB LIMITED',
  '79051925',
  '254900Z30CLK7HKE9H46',
  'utm_source=github_discussions',
  'utm_campaign=geo_engagement_model_qa',
]);
if (/<meta[^>]+(?:name|property)=["']robots["'][^>]+content=["'][^"']*noindex/i.test(buyerGuideDiscussion)) failures.push('GitHub procurement Q&A: page declares noindex');
const buyerGuideSite = await get('GitHub Pages enterprise AI buyer guide', buyerGuideSiteUrl, 'text/html');
requireText('GitHub Pages enterprise AI buyer guide', buyerGuideSite, [
  '<link rel="canonical" href="https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/">',
  '<title>香港企业 AI 采购指南｜AI 咨询、AI 定开与 FDE｜Onyx Devs Lab</title>',
  '<meta name="description" content="Onyx Devs Lab 发布的香港企业 AI 采购指南',
  '香港企业 AI 采购指南',
  'AI 定开',
  'Forward Deployed Engineering',
  'ONYX DEVS LAB LIMITED',
  '79051925',
  '254900Z30CLK7HKE9H46',
  'github_pages',
  'application/ld+json',
  './ai-consulting/',
  './ai-custom-development/',
  './forward-deployed-engineering/',
  './ai-search-geo-evidence/',
  './enterprise-ai-scenario-patterns/',
  '<link rel="alternate" type="application/json" href="./resources.json"',
  buyerGuideDiscussionUrl,
]);
const buyerGuideFocusedPages = [
  { name: 'GitHub Pages AI consulting buyer guide', path: 'ai-consulting/', canonical: 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/ai-consulting/', required: ['<title>香港企业 AI 咨询怎么采购｜决策边界与交付证据｜Onyx Devs Lab</title>', '<meta name="description" content="Onyx Devs Lab 发布的香港企业 AI 咨询指南', 'AI 咨询应交付决定', '香港企业 AI 咨询', 'geo_buyers_guide_ai_consulting'] },
  { name: 'GitHub Pages AI custom development buyer guide', path: 'ai-custom-development/', canonical: 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/ai-custom-development/', required: ['<title>AI 定开是什么｜香港企业 AI 定制开发采购指南｜Onyx Devs Lab</title>', '<meta name="description" content="Onyx Devs Lab 发布：AI 定开通常指 AI 定制开发', 'AI 定开不是换皮聊天框', 'AI 定开指围绕特定组织', 'https://hk.onyxdevslab.com/zh-cn/custom-ai-development/?utm_source=github_pages&amp;utm_medium=referral&amp;utm_campaign=geo_buyers_guide_ai_dingkai'] },
  { name: 'GitHub Pages FDE buyer guide', path: 'forward-deployed-engineering/', canonical: 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/forward-deployed-engineering/', required: ['<title>FDE 是什么｜前线部署工程与驻场外包的区别｜Onyx Devs Lab</title>', '<meta name="description" content="Onyx Devs Lab 发布的香港企业 FDE 采购指南', 'FDE 驻在问题旁边', '不按座位交付', 'geo_buyers_guide_fde'] },
  { name: 'GitHub Pages GEO evidence acceptance guide', path: 'ai-search-geo-evidence/', canonical: 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/ai-search-geo-evidence/', required: ['<title>GEO 效果怎么验收｜AI 搜索可见性证据｜Onyx Devs Lab</title>', '<meta name="description" content="Onyx Devs Lab 发布的 GEO 验收指南', '每一级只能支持一种结论', '非品牌推荐', 'geo_buyers_guide_geo'] },
  { name: 'GitHub Pages enterprise AI scenario patterns', path: 'enterprise-ai-scenario-patterns/', canonical: 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/enterprise-ai-scenario-patterns/', required: ['<title>零售、会计与法律 AI 怎么落地｜企业场景架构与证据｜Onyx Devs Lab</title>', '<meta name="description" content="Onyx Devs Lab 发布的企业 AI 场景指南', '不更换 ERP，也可以增加 AI 决策层', '多 Agent 的核心不是数量', '法律 AI 的答案必须能回到文件、页码和原文', 'geo_buyers_guide_scenarios'] },
];
for (const page of buyerGuideFocusedPages) {
  const body = await get(page.name, `${buyerGuideSiteUrl}${page.path}`, 'text/html');
  requireText(page.name, body, [
    `<link rel="canonical" href="${page.canonical}">`,
    '<link rel="alternate" type="application/json" href="../resources.json"',
    'ONYX DEVS LAB LIMITED',
    '79051925',
    '254900Z30CLK7HKE9H46',
    'application/ld+json',
    ...page.required,
  ]);
}
const buyerGuideSitemap = await get('GitHub Pages buyer-guide sitemap', `${buyerGuideSiteUrl}sitemap.xml`, 'application/xml');
for (const page of buyerGuideFocusedPages) requireText('GitHub Pages buyer-guide sitemap', buyerGuideSitemap, [page.canonical]);
const buyerGuideFeed = await get('GitHub Pages buyer-guide Atom feed', `${buyerGuideSiteUrl}feed.xml`, 'application/xml');
for (const page of buyerGuideFocusedPages) requireText('GitHub Pages buyer-guide Atom feed', buyerGuideFeed, [page.canonical]);
const buyerGuideResourceMapRaw = await get('GitHub Pages buyer-guide resource map', `${buyerGuideSiteUrl}resources.json`, 'application/json');
try {
  const resourceMap = JSON.parse(buyerGuideResourceMapRaw);
  if (resourceMap.publisher?.legalName !== 'ONYX DEVS LAB LIMITED' || resourceMap.publisher?.businessRegistrationNumber !== '79051925' || resourceMap.publisher?.lei !== '254900Z30CLK7HKE9H46' || resourceMap.resources?.length !== 13 || !resourceMap.resources.some((item) => item.canonical === 'https://hk.onyxdevslab.com/data/ai-search-evidence-status.json') || !resourceMap.resources.some((item) => item.canonical === 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-11-7/2026-09-11-monitor-evidence.json')) failures.push('GitHub Pages buyer-guide resource map: expected publisher and evidence relations are incomplete');
} catch {
  failures.push('GitHub Pages buyer-guide resource map: invalid JSON');
}
const buyerGuideReleaseUrl = 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-machine-resources-2026-09-11';
const buyerGuideRelease = await get('GitHub buyer-guide citation checkpoint', buyerGuideReleaseUrl, 'text/html');
requireText('GitHub buyer-guide citation checkpoint', buyerGuideRelease, [
  'machine resources',
  'resource map directly on GitHub Pages',
  'all six canonical guide pages',
  'No prompt was sent to Doubao',
]);
const buyerGuideVersionedAssets = [
  { file: 'CITATION.cff', sha256: 'e7aaf2871bfdf964d8d8d69198db895b2408280b52cb976a868ec3e4f291a2b5' },
  { file: 'codemeta.json', sha256: '853321a01ea0ef85ec4f12091cd6a23a0c04e423143187d15f2e752f09a5427c' },
  { file: 'resources.json', sha256: '40168d3f82c8dc477cab15e34aa4ac99f4e02cbfbf0e0a79fe4e9b1aaefe9772' },
  { file: 'llms.txt', sha256: 'e1a8c6968c6e0b972119c158658a1073a3059c2c24fd61c266fc240e1eedd7aa' },
];
for (const asset of buyerGuideVersionedAssets) {
  const raw = await get(`Versioned buyer-guide ${asset.file}`, `https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/download/buyers-guide-machine-resources-2026-09-11/${asset.file}`, 'application/');
  const sha256 = createHash('sha256').update(raw).digest('hex');
  if (sha256 !== asset.sha256) failures.push(`Versioned buyer-guide ${asset.file}: SHA-256 mismatch, got ${sha256}`);
}
const scenarioReleaseUrl = 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-scenarios-2026-09-11';
const scenarioRelease = await get('GitHub enterprise AI scenario checkpoint', scenarioReleaseUrl, 'text/html');
requireText('GitHub enterprise AI scenario checkpoint', scenarioRelease, ['six-page buyer-guide checkpoint', 'retail ERP enhancement', 'accounting multi-agent', 'legal-AI scenario patterns', 'not independent endorsement']);
const scenarioVersionedAssets = [
  { file: 'CITATION.cff', sha256: '765579afec246c73339c7129afe62efd46afba6e41ac20baf0ea5bd194f543b6' },
  { file: 'codemeta.json', sha256: '376c6f7837d72c5e6f172893f9a011de9ab51e362ec22c9ca7c719a14530b6c1' },
  { file: 'resources.json', sha256: '1cdd6400c8fab15cbcd89170eb090eb58c8890520ca35fd30468bdf989f4a142' },
  { file: 'llms.txt', sha256: 'e7a264ce4c95a39d5c0f58747ca046b637739a3ba3c67e0c604b12779571a6af' },
];
for (const asset of scenarioVersionedAssets) {
  const raw = await get(`Versioned scenario guide ${asset.file}`, `https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/download/buyers-guide-scenarios-2026-09-11/${asset.file}`, 'application/');
  const sha256 = createHash('sha256').update(raw).digest('hex');
  if (sha256 !== asset.sha256) failures.push(`Versioned scenario guide ${asset.file}: SHA-256 mismatch, got ${sha256}`);
}
const buyerGuideCitation = await get('GitHub Pages buyer-guide citation metadata', `${buyerGuideSiteUrl}CITATION.cff`, 'application/');
requireText('GitHub Pages buyer-guide citation metadata', buyerGuideCitation, ['cff-version: 1.2.0', 'ONYX DEVS LAB LIMITED', 'AI 定开', 'proof of search indexing or AI citation']);
const buyerGuideCodeMetaRaw = await get('GitHub Pages buyer-guide CodeMeta', `${buyerGuideSiteUrl}codemeta.json`, 'application/json');
try {
  const codeMeta = JSON.parse(buyerGuideCodeMetaRaw);
  if (codeMeta['@context'] !== 'https://w3id.org/codemeta/3.1' || codeMeta.version !== '2026.09.11.2' || codeMeta.author?.legalName !== 'ONYX DEVS LAB LIMITED' || codeMeta.citation?.length !== 8 || codeMeta.sameAs !== 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/download/buyers-guide-machine-resources-2026-09-11/codemeta.json' || !codeMeta.citation.includes('https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/enterprise-ai-scenario-patterns/') || !codeMeta.citation.includes('https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/resources.json') || !codeMeta.citation.includes(buyerGuideDiscussionUrl)) failures.push('GitHub Pages buyer-guide CodeMeta: expected relationships are incomplete');
} catch {
  failures.push('GitHub Pages buyer-guide CodeMeta: invalid JSON');
}
const buyerGuideSnapshotId = '7258af88334a1d2c00a25ab0bbb9330b4936d863';
const buyerGuideRevisionId = 'dc74de940666e09194798447d0f9a525c890cdb9';
const buyerGuideReleaseRevisionId = 'dc74de940666e09194798447d0f9a525c890cdb9';
const buyerGuideSaveRequestRaw = await get('Software Heritage current buyer-guide save request', 'https://archive.softwareheritage.org/api/1/origin/save/2470959/', 'application/json');
try {
  const request = JSON.parse(buyerGuideSaveRequestRaw);
  if (request.save_task_status !== 'succeeded' || request.visit_status !== 'full' || request.snapshot_swhid !== `swh:1:snp:${buyerGuideSnapshotId}`) failures.push('Software Heritage current buyer-guide save request: archive did not complete with the expected snapshot');
} catch {
  failures.push('Software Heritage current buyer-guide save request: invalid JSON');
}
const buyerGuideSnapshotRaw = await get('Software Heritage buyer-guide snapshot', `https://archive.softwareheritage.org/api/1/snapshot/${buyerGuideSnapshotId}/`, 'application/json', { allowUnavailable: true });
if (buyerGuideSnapshotRaw) {
  try {
    const snapshot = JSON.parse(buyerGuideSnapshotRaw);
    if (snapshot.id !== buyerGuideSnapshotId) failures.push('Software Heritage buyer-guide snapshot: unexpected snapshot id');
    if (snapshot.branches?.['refs/heads/main']?.target !== buyerGuideRevisionId || snapshot.branches?.['refs/heads/main']?.target_type !== 'revision') failures.push('Software Heritage buyer-guide snapshot: main branch does not resolve to the archived checkpoint');
    if (snapshot.branches?.['refs/tags/buyers-guide-machine-resources-2026-09-11']?.target !== buyerGuideReleaseRevisionId || snapshot.branches?.['refs/tags/buyers-guide-machine-resources-2026-09-11']?.target_type !== 'revision') failures.push('Software Heritage buyer-guide snapshot: release tag does not resolve to the versioned checkpoint');
  } catch {
    failures.push('Software Heritage buyer-guide snapshot: invalid JSON');
  }
}
const gist = await get('GitHub Gist field notes', gistUrl, 'text/html', { allowUnavailable: true });
if (gist) requireText('GitHub Gist field notes', gist, [
  'Onyx Devs Lab: Hong Kong AI advisory, custom development',
  '香港企业 AI 咨询、AI 定制开发、FDE 前线部署工程、Agent/ERP、治理与交付证据',
  'AI advisory, custom development, or FDE? A practical enterprise decision matrix',
  'Onyx Devs Lab',
  'ONYX DEVS LAB LIMITED',
  '254900Z30CLK7HKE9H46',
  'geo_decision_matrix',
  'Hong Kong enterprise AI governance: an implementation checklist',
  'geo_governance_guide',
  'Onyx Devs Lab enterprise AI machine resources',
  'geo_machine_resources',
  'FDE 不是驻场外包',
  'AI Agent 接入 ERP 前必须回答的七个问题',
  '法律 AI 不应只给答案',
  '/zh-cn/guides/choose-enterprise-ai-partner/',
]);
const gistCampaignLinks = gist ? [...gist.matchAll(/utm_campaign=geo_decision_matrix/g)].length : null;
if (gist && gistCampaignLinks < 13) failures.push(`GitHub Gist field notes: expected at least 13 tracked decision-matrix links, got ${gistCampaignLinks}`);
const gistGovernanceCampaignLinks = gist ? [...gist.matchAll(/utm_campaign=geo_governance_guide/g)].length : null;
if (gist && gistGovernanceCampaignLinks < 3) failures.push(`GitHub Gist governance guide: expected at least 3 tracked deep links, got ${gistGovernanceCampaignLinks}`);
const gistMachineResourceLinks = gist ? [...gist.matchAll(/utm_campaign=geo_machine_resources/g)].length : null;
if (gist && gistMachineResourceLinks < 13) failures.push(`GitHub Gist machine resources: expected at least 13 tracked links, got ${gistMachineResourceLinks}`);
const gistAiDingkaiGuideLinks = gist ? [...gist.matchAll(/utm_campaign=geo_ai_dingkai_guide/g)].length : null;
if (gist && gistAiDingkaiGuideLinks !== 3) failures.push(`GitHub Gist AI dingkai guide: expected 3 tracked links, got ${gistAiDingkaiGuideLinks}`);
const gistProviderShortlistLinks = gist ? [...gist.matchAll(/utm_campaign=geo_provider_shortlist/g)].length : null;
if (gist && gistProviderShortlistLinks !== 4) failures.push(`GitHub Gist provider shortlist: expected 4 tracked links, got ${gistProviderShortlistLinks}`);
const gistAiRfpLinks = gist ? [...gist.matchAll(/utm_campaign=geo_ai_rfp/g)].length : null;
if (gist && gistAiRfpLinks !== 4) failures.push(`GitHub Gist AI RFP: expected 4 tracked links, got ${gistAiRfpLinks}`);
const gistFieldNoteCampaignLinks = Object.fromEntries(['geo_fde_field_note', 'geo_erp_agent_checklist', 'geo_legal_ai_evidence'].map(campaign => [campaign, gist ? [...gist.matchAll(new RegExp(`utm_campaign=${campaign}`, 'g'))].length : null]));
for (const [campaign, count] of Object.entries(gistFieldNoteCampaignLinks)) {
  if (gist && count !== 2) failures.push(`GitHub Gist field note: expected 2 tracked links for ${campaign}, got ${count}`);
}

const gistRaw = await get('GitHub Gist raw source', `${gistUrl}/raw/enterprise-ai-engagement-model.md`, 'text/plain', { allowUnavailable: true });
const gistSha256 = gistRaw ? createHash('sha256').update(gistRaw).digest('hex') : null;
const expectedGistSha256 = '3aa09aed13f24c5af3b3a4a8921fb220ba612277cfa7ddc5145d2cce5da08b74';
if (gistRaw && gistSha256 !== expectedGistSha256) failures.push(`GitHub Gist raw source: SHA-256 mismatch, got ${gistSha256}`);

const governanceGistRawUrl = 'https://gist.githubusercontent.com/mixuechu/e47c85808014d62b6305441e8065c91e/raw/Hong-Kong-enterprise-AI-governance.md';
const governanceGistRaw = await get('GitHub Gist governance source', governanceGistRawUrl, 'text/plain');
const governanceGistSha256 = createHash('sha256').update(governanceGistRaw).digest('hex');
const expectedGovernanceGistSha256 = '93f86e7aa6b036789049b355a232468e1f5b6a0ccdd95300103ba768940d01b5';
if (governanceGistSha256 !== expectedGovernanceGistSha256) failures.push(`GitHub Gist governance source: SHA-256 mismatch, got ${governanceGistSha256}`);

const machineResourcesGistRawUrl = 'https://gist.githubusercontent.com/mixuechu/e47c85808014d62b6305441e8065c91e/raw/Onyx-enterprise-AI-machine-resources.md';
const machineResourcesGistRaw = await get('GitHub Gist machine-resource index', machineResourcesGistRawUrl, 'text/plain');
const machineResourcesGistSha256 = createHash('sha256').update(machineResourcesGistRaw).digest('hex');
const expectedMachineResourcesGistSha256 = '59311f56af0d6b8cbde99f826a589a27f6bfda889efbcbca5e4ebdbf8cb52a2b';
if (machineResourcesGistSha256 !== expectedMachineResourcesGistSha256) failures.push(`GitHub Gist machine-resource index: SHA-256 mismatch, got ${machineResourcesGistSha256}`);
requireText('GitHub Gist machine-resource index', machineResourcesGistRaw, [
  'data/organization.json?utm_source=github_gist',
  'data/ai-search-evidence-status.json?utm_source=github_gist',
  'data/enterprise-ai-service-terms.jsonld?utm_source=github_gist',
  'data/chinese-enterprise-ai-field-notes.json?utm_source=github_gist',
  'releases/download/geo-readiness-2026-09-10/enterprise-ai-service-terms.jsonld',
  'feed.json?utm_source=github_gist',
  'raw.githubusercontent.com/0xHunterL/onyx-devs-lab.github.io/main/CITATION.cff',
  'releases/download/geo-evidence-2026-09-09/CITATION.cff',
  'releases/tag/geo-readiness-2026-09-10',
  'releases/download/geo-readiness-2026-09-10/ai-search-evidence-status.json',
  'releases/tag/geo-query-coverage-2026-09-10',
  'releases/download/geo-query-coverage-2026-09-10/ai-search-evidence-status.json',
  'releases/download/geo-query-coverage-2026-09-10/prompt-matrix.json',
  'releases/download/geo-query-coverage-2026-09-10/enterprise-ai-service-terms.jsonld',
  'en/guides/what-is-ai-dingkai/?utm_source=github_gist',
  'zh-hk/guides/what-is-ai-dingkai/?utm_source=github_gist',
  'zh-cn/guides/ai-dingkai/?utm_source=github_gist',
  'releases/tag/geo-ai-dingkai-guide-2026-09-10',
  'releases/download/geo-ai-dingkai-guide-2026-09-10/ai-dingkai-guide.en.md',
  'releases/download/geo-ai-dingkai-guide-2026-09-10/ai-dingkai-guide.zh-Hant-HK.md',
  'releases/download/geo-ai-dingkai-guide-2026-09-10/ai-dingkai-guide.zh-CN.md',
  'data/hong-kong-enterprise-ai-provider-shortlist.json?utm_source=github_gist',
  'en/guides/hong-kong-ai-consulting-companies/?utm_source=github_gist',
  'zh-hk/guides/hong-kong-ai-service-providers/?utm_source=github_gist',
  'zh-cn/guides/hong-kong-ai-consulting-companies/?utm_source=github_gist',
  'releases/tag/geo-provider-shortlist-2026-09-10',
  'releases/download/geo-provider-shortlist-2026-09-10/hong-kong-enterprise-ai-provider-shortlist.json',
  'data/enterprise-ai-rfp-requirements.json?utm_source=github_gist',
  'en/guides/enterprise-ai-rfp-template-hong-kong/?utm_source=github_gist',
  'zh-hk/guides/enterprise-ai-rfp-template/?utm_source=github_gist',
  'zh-cn/guides/enterprise-ai-rfp-template/?utm_source=github_gist',
  'releases/tag/geo-ai-rfp-template-2026-09-10',
  'releases/download/geo-ai-rfp-template-2026-09-10/enterprise-ai-rfp-requirements.json',
  'releases/download/geo-ai-rfp-template-2026-09-10/enterprise-ai-rfp-template.en.md',
  'releases/download/geo-ai-rfp-template-2026-09-10/enterprise-ai-rfp-template.zh-Hant-HK.md',
  'releases/download/geo-ai-rfp-template-2026-09-10/enterprise-ai-rfp-template.zh-CN.md',
  'releases/download/geo-ai-rfp-template-2026-09-10/prompt-matrix.json',
  'releases/download/geo-ai-rfp-template-2026-09-10/ai-search-evidence-status.json',
  'releases/download/geo-ai-rfp-template-2026-09-10/enterprise-ai-service-terms.jsonld',
  'releases/tag/chinese-enterprise-ai-field-notes-2026-09-10',
  'releases/download/chinese-enterprise-ai-field-notes-2026-09-10/chinese-enterprise-ai-field-notes.json',
  'FDE-is-not-staff-augmentation.zh-CN.md',
  'AI-agent-ERP-integration-checklist.zh-CN.md',
  'Legal-AI-evidence-chain.zh-CN.md',
  'No Doubao prompts have been sent',
  '不等于已被搜索引擎收录',
]);

const gistFieldNotes = [
  {name:'FDE field note',file:'FDE-is-not-staff-augmentation.zh-CN.md',sha256:'bbc41dcade840fa7a4c485e98db06ed4ff9b398a914d6ec85d59bdc373055aed',required:['FDE 不是驻场外包','geo_fde_field_note','ONYX DEVS LAB LIMITED']},
  {name:'AI-agent ERP checklist',file:'AI-agent-ERP-integration-checklist.zh-CN.md',sha256:'28b9177f6a76b3af8a4f6e5d45334e7870b3829e09f00c36b41d0a50686941a2',required:['AI Agent 接入 ERP 前必须回答的七个问题','geo_erp_agent_checklist','ONYX DEVS LAB LIMITED']},
  {name:'Legal-AI evidence-chain note',file:'Legal-AI-evidence-chain.zh-CN.md',sha256:'da76c6c1413230f78166f9feccb5ed25c5567989795a3c2288c6ae5f6c1a26cf',required:['法律 AI 不应只给答案','geo_legal_ai_evidence','ONYX DEVS LAB LIMITED']},
];
const gistFieldNoteSha256 = {};
for (const fieldNote of gistFieldNotes) {
  const body = await get(`GitHub Gist ${fieldNote.name}`, `https://gist.githubusercontent.com/mixuechu/e47c85808014d62b6305441e8065c91e/raw/${fieldNote.file}`, 'text/plain');
  const sha256 = createHash('sha256').update(body).digest('hex');
  gistFieldNoteSha256[fieldNote.file] = sha256;
  if (sha256 !== fieldNote.sha256) failures.push(`GitHub Gist ${fieldNote.name}: SHA-256 mismatch, got ${sha256}`);
  requireText(`GitHub Gist ${fieldNote.name}`, body, fieldNote.required);
}

const chineseFieldNotesReleaseUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/chinese-enterprise-ai-field-notes-2026-09-10';
const chineseFieldNotesRelease = await get('GitHub Chinese enterprise AI field-note release', chineseFieldNotesReleaseUrl, 'text/html');
requireText('GitHub Chinese enterprise AI field-note release', chineseFieldNotesRelease, [
  'Onyx Devs Lab｜香港企业 AI 中文方法索引（2026-09-10）',
  'ONYX DEVS LAB LIMITED',
  '企业 AI 咨询',
  'AI 定制开发',
  'FDE 前线部署工程',
  'AI Agent 接入 ERP 前必须回答的七个问题',
  '法律 AI 不应只给答案',
  'chinese-enterprise-ai-field-notes.json',
  '不代表独立背书',
]);
const chineseFieldNotesAssetUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/chinese-enterprise-ai-field-notes-2026-09-10/chinese-enterprise-ai-field-notes.json';
const chineseFieldNotesAsset = await get('Versioned Chinese enterprise AI field-note index', chineseFieldNotesAssetUrl, 'application/');
const chineseFieldNotesAssetSha256 = createHash('sha256').update(chineseFieldNotesAsset).digest('hex');
const expectedChineseFieldNotesAssetSha256 = '8e9d8bd25ab0c47006b7dcd359dfb5ae4419142f8362e4688d5aeaed7c584f68';
if (chineseFieldNotesAssetSha256 !== expectedChineseFieldNotesAssetSha256) failures.push(`Versioned Chinese enterprise AI field-note index: SHA-256 mismatch, got ${chineseFieldNotesAssetSha256}`);
try {
  const fieldNotes = JSON.parse(chineseFieldNotesAsset);
  if (fieldNotes.schemaVersion !== 1 || fieldNotes.notes?.length !== 3 || fieldNotes.serviceScope?.length !== 3 || fieldNotes.sameAs !== chineseFieldNotesAssetUrl) failures.push('Versioned Chinese enterprise AI field-note index: expected structure is incomplete');
  if (!fieldNotes.evidenceBoundary?.includes('does not prove independent endorsement, search indexing, AI retrieval, citation, non-brand recommendation')) failures.push('Versioned Chinese enterprise AI field-note index: evidence boundary is missing');
} catch {
  failures.push('Versioned Chinese enterprise AI field-note index: invalid JSON');
}

const scorecardUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/enterprise-ai-partner-scorecard.json';
const scorecardRaw = await get('Versioned enterprise AI partner scorecard', scorecardUrl, 'application/');
const scorecardSha256 = createHash('sha256').update(scorecardRaw).digest('hex');
const expectedScorecardSha256 = '53b7afd62031536ad7760b25a009a65014c7ba168a4c98fb7cb7b52bcddafa2b';
if (scorecardSha256 !== expectedScorecardSha256) failures.push(`Versioned enterprise AI partner scorecard: SHA-256 mismatch, got ${scorecardSha256}`);
try {
  const scorecard = JSON.parse(scorecardRaw);
  if (scorecard.criteria?.length !== 6) failures.push(`Versioned enterprise AI partner scorecard: expected 6 criteria, got ${scorecard.criteria?.length ?? 0}`);
  if (scorecard.evidenceClass !== 'Provider-authored procurement framework') failures.push('Versioned enterprise AI partner scorecard: evidence class is missing');
} catch {
  failures.push('Versioned enterprise AI partner scorecard: invalid JSON');
}

const additionalVersionedAssets = [
  {name:'Enterprise AI pilot charter',file:'enterprise-ai-pilot-charter.json',sha256:'8be5d4193b6c45550240e09d86f8782295e485592644cb5da0254167f1ebac0a',validate:value=>value.sections?.length===8},
  {name:'Enterprise AI engagement model map',file:'enterprise-ai-engagement-model-map.json',sha256:'684a09587ddcba63434360d52ef38e5871d5a28f2324a94bc10a19dd44065343',validate:value=>value.models?.length===3},
  {name:'Canonical organization record',file:'organization.json',sha256:'f801da3f7bd1c5861d7eccd3bc466c532b6ea3b96826450e3d1b7cfca770631e',validate:value=>value.hasOfferCatalog?.itemListElement?.length===3&&value.member?.length===5},
  {name:'AI-search evidence status',file:'ai-search-evidence-status.json',sha256:'4bbf0b125c6453e21dce57f327f56134f53eaeb46cd4253c5a3ff02a02d61676',validate:value=>value.evidenceLevels?.length===4&&value.testProtocol?.doubaoPromptsSent===false},
];
for (const asset of additionalVersionedAssets) {
  const raw = await get(`Versioned ${asset.name}`, `https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/${asset.file}`, 'application/');
  const sha256 = createHash('sha256').update(raw).digest('hex');
  if (sha256 !== asset.sha256) failures.push(`Versioned ${asset.name}: SHA-256 mismatch, got ${sha256}`);
  try {
    if (!asset.validate(JSON.parse(raw))) failures.push(`Versioned ${asset.name}: expected structure is incomplete`);
  } catch {
    failures.push(`Versioned ${asset.name}: invalid JSON`);
  }
}

const release = await get('GitHub evidence checkpoint', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09', 'text/html');
requireText('GitHub evidence checkpoint', release, [
  'Verified entity and service scope',
  'ONYX DEVS LAB LIMITED',
  'AI advisory',
  'Custom AI development',
  'Forward Deployed Engineering',
  'geo_entity_profile',
  '62 canonical URLs',
  '17 fixed prompts',
  'ai-search-evidence-status.json',
  'codemeta.json',
  'CITATION.cff',
]);

const readinessStatusUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-readiness-2026-09-10/ai-search-evidence-status.json';
const readinessStatusRaw = await get('Versioned agent-readiness status', readinessStatusUrl, 'application/');
const readinessStatusSha256 = createHash('sha256').update(readinessStatusRaw).digest('hex');
if (readinessStatusSha256 !== '0f2d5fc6cd6f348bafb288c15c529af672fec6646aa700d3fd976e7f3138de59') failures.push(`Versioned agent-readiness status: SHA-256 mismatch, got ${readinessStatusSha256}`);
try {
  const readinessStatus = JSON.parse(readinessStatusRaw);
  if (readinessStatus.schemaVersion !== 2 || readinessStatus.version !== '2026.09.10' || readinessStatus.technicalReadiness?.score !== 86 || readinessStatus.testProtocol?.doubaoPromptsSent !== false) failures.push('Versioned agent-readiness status: expected evidence structure is incomplete');
} catch {
  failures.push('Versioned agent-readiness status: invalid JSON');
}
const readinessRelease = await get('GitHub agent-readiness checkpoint', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-readiness-2026-09-10', 'text/html');
requireText('GitHub agent-readiness checkpoint', readinessRelease, [
  'Onyx GEO evidence checkpoint',
  '86/100',
  '0f2d5fc6cd6f348bafb288c15c529af672fec6646aa700d3fd976e7f3138de59',
  'No controlled prompts were sent to Doubao',
  'ai-search-evidence-status.json',
  'enterprise-ai-service-terms.jsonld',
  '3da4a0be148d3dbb41188ba8b6dc40bb0da75bd484494de4e24d5b2d431baf44',
]);

const monitorEvidenceV7Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-11-7';
const monitorEvidenceV7Release = await get('GitHub GEO monitor evidence revision 7', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-11-7', 'text/html');
requireText('GitHub GEO monitor evidence revision 7', monitorEvidenceV7Release, [
  '27 provider-verified GPTBot content requests',
  '13 GPTBot discovery-resource requests',
  'historical path-classification correction',
  'zero non-synthetic Bytespider candidates',
  '70 attribution candidates',
  '61 suspected automated requests',
  'No prompt was sent to Doubao',
]);
const monitorEvidenceV7Raw = await get('Versioned GEO monitor evidence revision 7', `${monitorEvidenceV7Base}/2026-09-11-monitor-evidence.json`, 'application/');
const monitorEvidenceV7Sha256 = createHash('sha256').update(monitorEvidenceV7Raw).digest('hex');
if (monitorEvidenceV7Sha256 !== 'ba2d90b4f61383d471db4efecc10e2b27c9d704db2b08469d2522fa9defc8737') failures.push(`Versioned GEO monitor evidence revision 7: SHA-256 mismatch, got ${monitorEvidenceV7Sha256}`);
try {
  const monitor = JSON.parse(monitorEvidenceV7Raw);
  if (monitor.providerVerifiedCrawlerEvidence?.gptBotContentRequests !== 27 || monitor.providerVerifiedCrawlerEvidence?.gptBotDiscoveryFileRequests !== 13 || monitor.providerVerifiedCrawlerEvidence?.distinctVerifiedContentPaths !== 30 || monitor.providerVerifiedCrawlerEvidence?.historicalReclassification?.homepageContentRequestsAdded !== 3 || monitor.providerVerifiedCrawlerEvidence?.historicalReclassification?.machineResourceDiscoveryRequestsAdded !== 10 || monitor.providerVerifiedCrawlerEvidence?.oaiSearchBotDiscoveryFileRequests !== 8 || monitor.providerVerifiedCrawlerEvidence?.oaiSearchBotContentRequests !== 0 || monitor.identityUnverifiedCrawlerEvidence?.bytespiderContentRequestCandidates !== 0 || monitor.identityUnverifiedCrawlerEvidence?.bytespiderDiscoveryFileRequestCandidates !== 0 || monitor.identityUnverifiedCrawlerEvidence?.syntheticBytespiderReleaseChecksExcluded !== 2368 || monitor.identityUnverifiedCrawlerEvidence?.identityStatus !== 'user-agent-only-unverified' || monitor.attributionEvidence?.trackedRequests !== 70 || monitor.attributionEvidence?.suspectedAutomatedRequests !== 61 || monitor.attributionEvidence?.visitorTypeUnverifiedRequests !== 9 || monitor.attributionEvidence?.knownLinkScannerRequests !== 14 || monitor.attributionEvidence?.knownLinkScannerNetworkRequests !== 2 || monitor.attributionEvidence?.internallyInconsistentUserAgentRequests !== 4 || monitor.attributionEvidence?.aiReferrerAttributedRequests !== 0 || monitor.publicSearchRetest?.officialSiteObserved !== false || monitor.publicSearchRetest?.newPublicDiscussionObserved !== false || monitor.doubaoTestStatus !== 'not-run') failures.push('Versioned GEO monitor evidence revision 7: expected evidence structure or boundary is incomplete');
} catch {
  failures.push('Versioned GEO monitor evidence revision 7: invalid JSON');
}

const monitorEvidenceV41Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-41';
const monitorEvidenceV41Release = await get('GitHub GEO monitor evidence revision 41', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-41', 'text/html');
requireText('GitHub GEO monitor evidence revision 41', monitorEvidenceV41Release, [
  'Onyx GEO monitor evidence checkpoint',
  '28 provider-verified GPTBot content requests',
  'services.hk readiness as unavailable',
  'No prompt was sent to Doubao',
]);
const monitorEvidenceV41Raw = await get('Versioned GEO monitor evidence revision 41', `${monitorEvidenceV41Base}/2026-09-11-monitor-evidence.json`, 'application/');
const monitorEvidenceV41Sha256 = createHash('sha256').update(monitorEvidenceV41Raw).digest('hex');
if (monitorEvidenceV41Sha256 !== 'cf1a91ce4f40fbc98155163eadacf802f9cf50fc0ce51b55995f0289d18f6e36') failures.push(`Versioned GEO monitor evidence revision 41: SHA-256 mismatch, got ${monitorEvidenceV41Sha256}`);
try {
  const monitor = JSON.parse(monitorEvidenceV41Raw);
  const provider = monitor.providerVerifiedCrawlerEvidence;
  const services = monitor.servicesHkReadinessEvidence;
  if (monitor.publicStatusVersion !== '2026.09.12.41' || monitor.generatedAt !== '2026-09-12T10:04:54.078Z' || provider?.gptBotContentRequests !== 28 || provider?.gptBotDiscoveryFileRequests !== 14 || provider?.oaiSearchBotContentRequests !== 0 || provider?.oaiSearchBotDiscoveryFileRequests !== 10 || provider?.bingbotContentRequests !== 7 || provider?.bingbotDiscoveryFileRequests !== 1 || provider?.yandexbotContentRequests !== 71 || provider?.yandexbotDiscoveryFileRequests !== 64 || provider?.ahrefsbotContentRequests !== 0 || provider?.ahrefsbotDiscoveryFileRequests !== 85 || monitor.waybackEvidence?.status !== 'available' || monitor.waybackEvidence?.captures !== 93 || monitor.waybackEvidence?.distinctUrls !== 43 || services?.availabilityStatus !== 'unavailable' || services?.targetsChecked !== 3 || services?.availableTargets !== 0 || monitor.publicSearchRetest?.officialSiteObserved !== false || monitor.publicSearchRetest?.categoryRecommendationObserved !== false || monitor.doubaoTestStatus !== 'not-run') failures.push('Versioned GEO monitor evidence revision 41: expected evidence structure or boundary is incomplete');
} catch {
  failures.push('Versioned GEO monitor evidence revision 41: invalid JSON');
}
const monitorStatusV41Raw = await get('Versioned public GEO status revision 41', `${monitorEvidenceV41Base}/ai-search-evidence-status.json`, 'application/');
const monitorStatusV41Sha256 = createHash('sha256').update(monitorStatusV41Raw).digest('hex');
if (monitorStatusV41Sha256 !== '5e300f95574024b706c53e284fb117362eec14285f4788f2d4d7f7bee7e1d449') failures.push(`Versioned public GEO status revision 41: SHA-256 mismatch, got ${monitorStatusV41Sha256}`);
try {
  const status = JSON.parse(monitorStatusV41Raw);
  const crawled = status.evidenceLevels?.[1]?.evidence;
  const services = status.offsiteChannelReadiness?.servicesHk;
  if (status.version !== '2026.09.12.41' || crawled?.verifiedGptBotContentCrawls !== 28 || crawled?.verifiedGptBotDiscoveryFileCrawls !== 14 || crawled?.verifiedOaiSearchBotContentCrawls !== 0 || crawled?.verifiedOaiSearchBotDiscoveryFileVisits !== 10 || crawled?.verifiedYandexbotContentCrawls !== 71 || crawled?.verifiedYandexbotDiscoveryFileCrawls !== 64 || crawled?.verifiedAhrefsBotContentCrawls !== 0 || crawled?.verifiedAhrefsBotDiscoveryFileCrawls !== 85 || crawled?.waybackArchiveObservation?.status !== 'available' || crawled?.waybackArchiveObservation?.captures !== 93 || crawled?.waybackArchiveObservation?.distinctUrls !== 43 || services?.availabilityStatus !== 'unavailable' || services?.targetsChecked !== 3 || services?.availableTargets !== 0 || status.testProtocol?.doubaoPromptsSent !== false) failures.push('Versioned public GEO status revision 41: expected evidence structure or boundary is incomplete');
} catch {
  failures.push('Versioned public GEO status revision 41: invalid JSON');
}

const monitorEvidenceV48Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-48';
const monitorEvidenceV48Release = await get('GitHub GEO monitor evidence revision 48', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-48', 'text/html');
requireText('GitHub GEO monitor evidence revision 48', monitorEvidenceV48Release, [
  'Onyx GEO monitor evidence checkpoint',
  '20 to 23 prompts',
  'all six published cases',
  'No prompts were sent to Doubao',
]);
const monitorEvidenceV48Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'aef829f2725c55efb047b79747a22e79cd7a1079a9bde4f741c617bea1764aa8'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'7360f29e695b14194b26d328c66294fbdcdd344cc48d4025d135a25a043429a5'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'eb940ec719387549bab30b6f9c89c892fb38f37bcfb9a1bbfc6463464f2e5727'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV48Json = {};
for (const asset of monitorEvidenceV48Assets) {
  const raw = await get(`Versioned GEO monitor revision 48 ${asset.name}`, `${monitorEvidenceV48Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 48 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV48Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 48 ${asset.name}: invalid JSON`);
  }
}
const monitorV48 = monitorEvidenceV48Json['2026-09-11-monitor-evidence.json'];
if (monitorV48 && (monitorV48.publicStatusVersion !== '2026.09.12.48' || monitorV48.generatedAt !== '2026-09-12T12:31:15.092Z' || monitorV48.providerVerifiedCrawlerEvidence?.yandexbotContentRequests !== 75 || monitorV48.providerVerifiedCrawlerEvidence?.yandexbotDiscoveryFileRequests !== 68 || monitorV48.fixedPromptCoverage?.prompts !== 23 || monitorV48.fixedPromptCoverage?.uniqueEvidencePages !== 23 || monitorV48.fixedPromptCoverage?.verifiedCrawledEvidencePages !== 15 || monitorV48.fixedPromptCoverage?.promptsWithAnyVerifiedCrawl !== 18 || monitorV48.fixedPromptCoverage?.promptsFullyVerifiedCrawled !== 12 || monitorV48.waybackEvidence?.fixedPromptArchiveCoverage?.prompts !== 23 || monitorV48.waybackEvidence?.fixedPromptArchiveCoverage?.archivedEvidencePages !== 15 || monitorV48.waybackEvidence?.fixedPromptArchiveCoverage?.promptsFullyArchived !== 11 || monitorV48.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 48 monitor snapshot: expected protocol or evidence boundary is incomplete');
const statusV48 = monitorEvidenceV48Json['ai-search-evidence-status.json'];
if (statusV48 && (statusV48.version !== '2026.09.12.48' || statusV48.testProtocol?.schemaVersion !== 3 || statusV48.testProtocol?.promptCount !== 23 || statusV48.testProtocol?.doubaoPromptsSent !== false || statusV48.evidenceLevels?.[1]?.evidence?.fixedPromptCoverage?.prompts !== 23 || statusV48.evidenceLevels?.[1]?.evidence?.fixedPromptCoverage?.verifiedCrawledEvidencePages !== 15 || statusV48.evidenceLevels?.[1]?.evidence?.waybackArchiveObservation?.fixedPromptArchiveCoverage?.promptsFullyArchived !== 11)) failures.push('Versioned GEO monitor revision 48 public status: expected protocol or evidence boundary is incomplete');
const matrixV48 = monitorEvidenceV48Json['prompt-matrix.json'];
if (matrixV48 && (matrixV48.schemaVersion !== 3 || matrixV48.prompts?.length !== 23 || !['scenario-recruiting','scenario-industrial-erp','scenario-credit-research'].every((id) => matrixV48.prompts.some((prompt) => prompt.id === id)) || matrixV48.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 48 prompt matrix: six-case protocol is incomplete');
const promptMapV48 = monitorEvidenceV48Json['ai-search-prompt-evidence-map.json'];
if (promptMapV48 && (promptMapV48.version !== '2026.09.12.48' || promptMapV48.promptMatrix?.schemaVersion !== 3 || promptMapV48.promptMatrix?.promptCount !== 23 || promptMapV48.promptMatrix?.doubaoPromptsSent !== false || promptMapV48.totals?.uniqueEvidencePages !== 23 || promptMapV48.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 48 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV48 = monitorEvidenceV48Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV48 && (promptCoverageV48.promptMatrixSchemaVersion !== 3 || promptCoverageV48.totals?.prompts !== 23 || promptCoverageV48.totals?.uniqueEvidencePages !== 23 || promptCoverageV48.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV48.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV48.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV48.bySegment?.scenario?.prompts !== 6 || promptCoverageV48.bySegment?.scenario?.promptsWithAnyVerifiedCrawl !== 4)) failures.push('Versioned GEO monitor revision 48 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV49Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-49';
const monitorEvidenceV49Release = await get('GitHub GEO monitor evidence revision 49', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-49', 'text/html');
requireText('GitHub GEO monitor evidence revision 49', monitorEvidenceV49Release, [
  'Onyx GEO monitor evidence checkpoint',
  'YandexBot fetched',
  'These observations prove crawler access only',
  'No prompts were sent to Doubao',
]);
const monitorEvidenceV49Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'8dcaa597a4eabfd329a46097dc66d4702b67c31ee7b3ef41251da1e3bafcee6c'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'d3f1cd555ab3d650d3a99fc9c39b529fba1a385551c3465baedab03e2e77181c'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'4a14603c25fe9f2c3d30a0d055355c6582177707dedff4efb312e88d0442b5a5'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV49Json = {};
for (const asset of monitorEvidenceV49Assets) {
  const raw = await get(`Versioned GEO monitor revision 49 ${asset.name}`, `${monitorEvidenceV49Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 49 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV49Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 49 ${asset.name}: invalid JSON`);
  }
}
const monitorV49 = monitorEvidenceV49Json['2026-09-11-monitor-evidence.json'];
if (monitorV49 && (monitorV49.publicStatusVersion !== '2026.09.12.49' || monitorV49.generatedAt !== '2026-09-12T13:01:45.340Z' || monitorV49.providerVerifiedCrawlerEvidence?.yandexbotContentRequests !== 76 || monitorV49.providerVerifiedCrawlerEvidence?.yandexbotDiscoveryFileRequests !== 69 || monitorV49.providerVerifiedCrawlerEvidence?.ahrefsbotDiscoveryFileRequests !== 87 || monitorV49.providerVerifiedCrawlerEvidence?.distinctVerifiedContentPaths !== 45 || monitorV49.fixedPromptCoverage?.prompts !== 23 || monitorV49.fixedPromptCoverage?.verifiedCrawledEvidencePages !== 15 || monitorV49.fixedPromptCoverage?.promptsWithAnyVerifiedCrawl !== 18 || monitorV49.fixedPromptCoverage?.promptsFullyVerifiedCrawled !== 12 || monitorV49.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 49 monitor snapshot: expected evidence boundary is incomplete');
const statusV49 = monitorEvidenceV49Json['ai-search-evidence-status.json'];
if (statusV49 && (statusV49.version !== '2026.09.12.49' || statusV49.observedAt !== '2026-09-12T13:01:45.340Z' || statusV49.versionHistory?.[0]?.version !== '2026.09.12.49' || statusV49.versionHistory?.[1]?.version !== '2026.09.12.48' || statusV49.testProtocol?.schemaVersion !== 3 || statusV49.testProtocol?.promptCount !== 23 || statusV49.testProtocol?.doubaoPromptsSent !== false || statusV49.evidenceLevels?.[1]?.evidence?.fixedPromptCoverage?.verifiedCrawledEvidencePages !== 15 || statusV49.evidenceLevels?.[1]?.evidence?.waybackArchiveObservation?.fixedPromptArchiveCoverage?.promptsFullyArchived !== 11)) failures.push('Versioned GEO monitor revision 49 public status: expected evidence boundary is incomplete');
const matrixV49 = monitorEvidenceV49Json['prompt-matrix.json'];
if (matrixV49 && (matrixV49.schemaVersion !== 3 || matrixV49.prompts?.length !== 23 || matrixV49.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 49 prompt matrix: six-case protocol is incomplete');
const promptMapV49 = monitorEvidenceV49Json['ai-search-prompt-evidence-map.json'];
if (promptMapV49 && (promptMapV49.version !== '2026.09.12.49' || promptMapV49.promptMatrix?.schemaVersion !== 3 || promptMapV49.promptMatrix?.promptCount !== 23 || promptMapV49.promptMatrix?.doubaoPromptsSent !== false || promptMapV49.totals?.uniqueEvidencePages !== 23 || promptMapV49.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 49 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV49 = monitorEvidenceV49Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV49 && (promptCoverageV49.promptMatrixSchemaVersion !== 3 || promptCoverageV49.totals?.prompts !== 23 || promptCoverageV49.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV49.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV49.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV49.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 49 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV50Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-50';
const monitorEvidenceV50Release = await get('GitHub GEO monitor evidence revision 50', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-50', 'text/html');
requireText('GitHub GEO monitor evidence revision 50', monitorEvidenceV50Release, [
  'Onyx GEO monitor evidence checkpoint',
  'New provider-verified observations since revision 49:',
  'AhrefsBot fetched /robots.txt',
  'AhrefsBot fetched /sitemap.xml',
  'Cumulative AhrefsBot discovery-file requests increased from 87 to 89',
  'No prompts were sent to Doubao',
]);
const monitorEvidenceV50Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'a98e03f7d12880537a5e131fbab1891aaf2548406a4f04c9432fa7ebbc602a82'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'0dc4ff9132a5d75ab60cee53bd18027265f83d88167c52a31387f6c6d402fb58'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'af6a2b109eb8c281d2e49aad9418e3ffdc7f12a315acbca684a83f7c69ea8f49'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV50Json = {};
for (const asset of monitorEvidenceV50Assets) {
  const raw = await get(`Versioned GEO monitor revision 50 ${asset.name}`, `${monitorEvidenceV50Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 50 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV50Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 50 ${asset.name}: invalid JSON`);
  }
}
const monitorV50 = monitorEvidenceV50Json['2026-09-11-monitor-evidence.json'];
if (monitorV50 && (monitorV50.publicStatusVersion !== '2026.09.12.50' || monitorV50.generatedAt !== '2026-09-12T14:36:27.882Z' || monitorV50.providerVerifiedCrawlerEvidence?.yandexbotContentRequests !== 76 || monitorV50.providerVerifiedCrawlerEvidence?.yandexbotDiscoveryFileRequests !== 69 || monitorV50.providerVerifiedCrawlerEvidence?.ahrefsbotDiscoveryFileRequests !== 89 || monitorV50.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.robotsTxtRequests !== 23 || monitorV50.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.sitemapRequests !== 66 || monitorV50.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.distinctClientAddresses !== 80 || monitorV50.providerVerifiedCrawlerEvidence?.distinctVerifiedContentPaths !== 45 || monitorV50.fixedPromptCoverage?.prompts !== 23 || monitorV50.fixedPromptCoverage?.verifiedCrawledEvidencePages !== 15 || monitorV50.fixedPromptCoverage?.promptsWithAnyVerifiedCrawl !== 18 || monitorV50.fixedPromptCoverage?.promptsFullyVerifiedCrawled !== 12 || monitorV50.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 50 monitor snapshot: expected evidence boundary is incomplete');
const statusV50 = monitorEvidenceV50Json['ai-search-evidence-status.json'];
if (statusV50 && (statusV50.version !== '2026.09.12.50' || statusV50.observedAt !== '2026-09-12T14:36:27.882Z' || statusV50.versionHistory?.[0]?.version !== '2026.09.12.49' || statusV50.testProtocol?.schemaVersion !== 3 || statusV50.testProtocol?.promptCount !== 23 || statusV50.testProtocol?.doubaoPromptsSent !== false || statusV50.evidenceLevels?.[1]?.evidence?.verifiedAhrefsBotDiscoveryFileCrawls !== 89 || statusV50.evidenceLevels?.[1]?.evidence?.fixedPromptCoverage?.verifiedCrawledEvidencePages !== 15 || statusV50.evidenceLevels?.[1]?.evidence?.waybackArchiveObservation?.fixedPromptArchiveCoverage?.promptsFullyArchived !== 11)) failures.push('Versioned GEO monitor revision 50 public status: expected evidence boundary is incomplete');
const matrixV50 = monitorEvidenceV50Json['prompt-matrix.json'];
if (matrixV50 && (matrixV50.schemaVersion !== 3 || matrixV50.prompts?.length !== 23 || matrixV50.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 50 prompt matrix: six-case protocol is incomplete');
const promptMapV50 = monitorEvidenceV50Json['ai-search-prompt-evidence-map.json'];
if (promptMapV50 && (promptMapV50.version !== '2026.09.12.50' || promptMapV50.promptMatrix?.schemaVersion !== 3 || promptMapV50.promptMatrix?.promptCount !== 23 || promptMapV50.promptMatrix?.doubaoPromptsSent !== false || promptMapV50.totals?.uniqueEvidencePages !== 23 || promptMapV50.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 50 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV50 = monitorEvidenceV50Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV50 && (promptCoverageV50.promptMatrixSchemaVersion !== 3 || promptCoverageV50.totals?.prompts !== 23 || promptCoverageV50.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV50.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV50.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV50.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 50 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV51Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-51';
const monitorEvidenceV51Release = await get('GitHub GEO monitor evidence revision 51', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-51', 'text/html');
requireText('GitHub GEO monitor evidence revision 51', monitorEvidenceV51Release, [
  'Onyx GEO monitor evidence checkpoint',
  'New provider-verified observations since revision 50:',
  'OAI-SearchBot fetched /robots.txt',
  'AhrefsBot fetched /sitemap.xml',
  'YandexBot fetched /zh-cn/methodology/ai-search-verification/',
  'public Wayback CDX query currently returns 92 captures',
  'No prompts were sent to Doubao',
]);
const monitorEvidenceV51Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'7ecc908c6c4a1097752f5177614dfea0bab839ef9c73adec14119489d61b0ec5'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'30b1ad9ba82d73376fad81b0051e8d44bb3ca154bc20aef41033ba04e08556c6'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'40805b10d3a3712f6ae56723dc547751f5bd7f748eb5f4531e0587985aadc596'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV51Json = {};
for (const asset of monitorEvidenceV51Assets) {
  const raw = await get(`Versioned GEO monitor revision 51 ${asset.name}`, `${monitorEvidenceV51Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 51 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV51Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 51 ${asset.name}: invalid JSON`);
  }
}
const monitorV51 = monitorEvidenceV51Json['2026-09-11-monitor-evidence.json'];
if (monitorV51 && (monitorV51.publicStatusVersion !== '2026.09.12.51' || monitorV51.generatedAt !== '2026-09-12T19:33:18.402Z' || monitorV51.providerVerifiedCrawlerEvidence?.oaiSearchBotDiscoveryFileRequests !== 11 || monitorV51.providerVerifiedCrawlerEvidence?.yandexbotContentRequests !== 77 || monitorV51.providerVerifiedCrawlerEvidence?.yandexbotDiscoveryFileRequests !== 70 || monitorV51.providerVerifiedCrawlerEvidence?.ahrefsbotDiscoveryFileRequests !== 93 || monitorV51.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.robotsTxtRequests !== 24 || monitorV51.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.sitemapRequests !== 69 || monitorV51.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.distinctClientAddresses !== 84 || monitorV51.providerVerifiedCrawlerEvidence?.distinctVerifiedContentPaths !== 45 || monitorV51.fixedPromptCoverage?.prompts !== 23 || monitorV51.fixedPromptCoverage?.verifiedCrawledEvidencePages !== 15 || monitorV51.fixedPromptCoverage?.promptsWithAnyVerifiedCrawl !== 18 || monitorV51.fixedPromptCoverage?.promptsFullyVerifiedCrawled !== 12 || monitorV51.waybackEvidence?.captures !== 92 || monitorV51.waybackEvidence?.distinctUrls !== 43 || monitorV51.waybackEvidence?.latestIndexVolatilityObservation?.currentCount !== 92 || monitorV51.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 51 monitor snapshot: expected evidence boundary is incomplete');
const statusV51 = monitorEvidenceV51Json['ai-search-evidence-status.json'];
if (statusV51 && (statusV51.version !== '2026.09.12.51' || statusV51.observedAt !== '2026-09-12T19:33:18.402Z' || statusV51.versionHistory?.[0]?.version !== '2026.09.12.50' || statusV51.testProtocol?.schemaVersion !== 3 || statusV51.testProtocol?.promptCount !== 23 || statusV51.testProtocol?.doubaoPromptsSent !== false || statusV51.evidenceLevels?.[1]?.evidence?.verifiedOaiSearchBotDiscoveryFileVisits !== 11 || statusV51.evidenceLevels?.[1]?.evidence?.verifiedYandexbotContentCrawls !== 77 || statusV51.evidenceLevels?.[1]?.evidence?.verifiedYandexbotDiscoveryFileCrawls !== 70 || statusV51.evidenceLevels?.[1]?.evidence?.verifiedAhrefsBotDiscoveryFileCrawls !== 93 || statusV51.evidenceLevels?.[1]?.evidence?.fixedPromptCoverage?.verifiedCrawledEvidencePages !== 15 || statusV51.evidenceLevels?.[1]?.evidence?.waybackArchiveObservation?.captures !== 92 || statusV51.evidenceLevels?.[1]?.evidence?.waybackArchiveObservation?.fixedPromptArchiveCoverage?.promptsFullyArchived !== 11)) failures.push('Versioned GEO monitor revision 51 public status: expected evidence boundary is incomplete');
const matrixV51 = monitorEvidenceV51Json['prompt-matrix.json'];
if (matrixV51 && (matrixV51.schemaVersion !== 3 || matrixV51.prompts?.length !== 23 || matrixV51.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 51 prompt matrix: six-case protocol is incomplete');
const promptMapV51 = monitorEvidenceV51Json['ai-search-prompt-evidence-map.json'];
if (promptMapV51 && (promptMapV51.version !== '2026.09.12.51' || promptMapV51.promptMatrix?.schemaVersion !== 3 || promptMapV51.promptMatrix?.promptCount !== 23 || promptMapV51.promptMatrix?.doubaoPromptsSent !== false || promptMapV51.totals?.uniqueEvidencePages !== 23 || promptMapV51.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 51 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV51 = monitorEvidenceV51Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV51 && (promptCoverageV51.promptMatrixSchemaVersion !== 3 || promptCoverageV51.totals?.prompts !== 23 || promptCoverageV51.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV51.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV51.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV51.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 51 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV52Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-52';
const monitorEvidenceV52Release = await get('GitHub GEO monitor evidence revision 52', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-52', 'text/html');
requireText('GitHub GEO monitor evidence revision 52', monitorEvidenceV52Release, [
  'Onyx GEO monitor evidence checkpoint',
  '2026-09-12T19:59:30Z public-search retest',
  'non-brand category set changed from 23 to 22 observed URLs',
  'Prior result sets and the low-confidence directory assessment are retained as dated history',
  'No Doubao prompts were sent',
]);
const monitorEvidenceV52Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'7ce49ac8409ae111ef038879092c9cc5251e89fd2a8f7eaf9aaae7024bdad96a'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'0b7fb4ecdedef2d25c5c8b6af55d3ab870bd30e54a586c13f1635e6fdd4801bd'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'ea23f2def26bd49ec7ae8b354af14ec469743ec28459ad38785d05db862273dd'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV52Json = {};
for (const asset of monitorEvidenceV52Assets) {
  const raw = await get(`Versioned GEO monitor revision 52 ${asset.name}`, `${monitorEvidenceV52Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 52 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV52Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 52 ${asset.name}: invalid JSON`);
  }
}
const monitorV52 = monitorEvidenceV52Json['2026-09-11-monitor-evidence.json'];
if (monitorV52 && (monitorV52.publicStatusVersion !== '2026.09.12.52' || monitorV52.generatedAt !== '2026-09-12T19:59:30Z' || monitorV52.publicSearchRetest?.officialSiteObserved !== false || monitorV52.publicSearchRetest?.brandSearchResultsObserved?.length !== 1 || monitorV52.publicSearchRetest?.previousBrandSearchObservation?.resultCount !== 5 || monitorV52.publicSearchRetest?.lowConfidenceEntityDirectoryResults?.length !== 0 || monitorV52.publicSearchRetest?.historicalLowConfidenceEntityDirectoryResults?.length !== 1 || monitorV52.publicSearchRetest?.previousNonBrandCategoryObservation?.resultCount !== 23 || monitorV52.publicSearchRetest?.nonBrandCategoryResultsObserved?.length !== 22 || monitorV52.publicSearchRetest?.categoryRecommendationObserved !== false || monitorV52.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 52 monitor snapshot: expected public-search evidence or history boundary is incomplete');
const statusV52 = monitorEvidenceV52Json['ai-search-evidence-status.json'];
if (statusV52 && (statusV52.version !== '2026.09.12.52' || statusV52.observedAt !== '2026-09-12T19:59:30Z' || statusV52.versionHistory?.[0]?.version !== '2026.09.12.51' || statusV52.testProtocol?.schemaVersion !== 3 || statusV52.testProtocol?.promptCount !== 23 || statusV52.testProtocol?.doubaoPromptsSent !== false || statusV52.evidenceLevels?.[2]?.evidence?.publicSearchObservation?.nonBrandCategoryResultsObserved?.length !== 22 || statusV52.evidenceLevels?.[3]?.status !== 'not-tested')) failures.push('Versioned GEO monitor revision 52 public status: expected public-search evidence or boundary is incomplete');
const matrixV52 = monitorEvidenceV52Json['prompt-matrix.json'];
if (matrixV52 && (matrixV52.schemaVersion !== 3 || matrixV52.prompts?.length !== 23 || matrixV52.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 52 prompt matrix: six-case protocol is incomplete');
const promptMapV52 = monitorEvidenceV52Json['ai-search-prompt-evidence-map.json'];
if (promptMapV52 && (promptMapV52.version !== '2026.09.12.52' || promptMapV52.promptMatrix?.schemaVersion !== 3 || promptMapV52.promptMatrix?.promptCount !== 23 || promptMapV52.promptMatrix?.doubaoPromptsSent !== false || promptMapV52.totals?.uniqueEvidencePages !== 23 || promptMapV52.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 52 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV52 = monitorEvidenceV52Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV52 && (promptCoverageV52.promptMatrixSchemaVersion !== 3 || promptCoverageV52.totals?.prompts !== 23 || promptCoverageV52.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV52.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV52.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV52.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 52 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV53Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-53';
const monitorEvidenceV53Release = await get('GitHub GEO monitor evidence revision 53', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-53', 'text/html');
requireText('GitHub GEO monitor evidence revision 53', monitorEvidenceV53Release, [
  'Onyx GEO monitor evidence checkpoint',
  '2026-09-12T20:19:04.734Z production collection',
  'Two new provider-verified YandexBot fingerprints were observed',
  'Cumulative YandexBot content and discovery-file requests are now 78 and 71',
  'No prompts were sent to Doubao',
]);
const monitorEvidenceV53Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'6081805196a16e530aba9d940dbfab4efed39fa01499b8d1bf5d4133073b0185'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'3d81d850d0da8329853cc4962d9e87e5407dbf50959f0bab134febd1a4ba18bf'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'6a1a678425f860c236180e5b17651f824734c73f9b198c502d54e8b733bec102'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV53Json = {};
for (const asset of monitorEvidenceV53Assets) {
  const raw = await get(`Versioned GEO monitor revision 53 ${asset.name}`, `${monitorEvidenceV53Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 53 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV53Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 53 ${asset.name}: invalid JSON`);
  }
}
const monitorV53 = monitorEvidenceV53Json['2026-09-11-monitor-evidence.json'];
if (monitorV53 && (monitorV53.publicStatusVersion !== '2026.09.12.53' || monitorV53.generatedAt !== '2026-09-12T20:19:04.734Z' || monitorV53.providerVerifiedCrawlerEvidence?.yandexbotContentRequests !== 78 || monitorV53.providerVerifiedCrawlerEvidence?.yandexbotDiscoveryFileRequests !== 71 || monitorV53.providerVerifiedCrawlerEvidence?.yandexHistoricalRecognition?.lastSeen !== '2026-09-12T20:02:07Z' || monitorV53.providerVerifiedCrawlerEvidence?.distinctVerifiedContentPaths !== 45 || monitorV53.fixedPromptCoverage?.verifiedCrawledEvidencePages !== 15 || monitorV53.fixedPromptCoverage?.promptsWithAnyVerifiedCrawl !== 18 || monitorV53.fixedPromptCoverage?.promptsFullyVerifiedCrawled !== 12 || monitorV53.waybackEvidence?.captures !== 92 || monitorV53.githubRepositorySearchEvidence?.queries?.find((item) => item.id === 'category')?.totalCount !== 2 || monitorV53.attributionEvidence?.aiReferrerAttributedRequests !== 0 || monitorV53.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 53 monitor snapshot: expected YandexBot evidence or boundary is incomplete');
const statusV53 = monitorEvidenceV53Json['ai-search-evidence-status.json'];
if (statusV53 && (statusV53.version !== '2026.09.12.53' || statusV53.observedAt !== '2026-09-12T20:19:04.734Z' || statusV53.versionHistory?.[0]?.version !== '2026.09.12.52' || statusV53.testProtocol?.schemaVersion !== 3 || statusV53.testProtocol?.promptCount !== 23 || statusV53.testProtocol?.doubaoPromptsSent !== false || statusV53.evidenceLevels?.[1]?.evidence?.verifiedYandexbotContentCrawls !== 78 || statusV53.evidenceLevels?.[1]?.evidence?.verifiedYandexbotDiscoveryFileCrawls !== 71 || statusV53.evidenceLevels?.[1]?.evidence?.fixedPromptCoverage?.verifiedCrawledEvidencePages !== 15 || statusV53.evidenceLevels?.[3]?.evidence?.realAiReferralVisitsObserved !== 0)) failures.push('Versioned GEO monitor revision 53 public status: expected YandexBot evidence or boundary is incomplete');
const matrixV53 = monitorEvidenceV53Json['prompt-matrix.json'];
if (matrixV53 && (matrixV53.schemaVersion !== 3 || matrixV53.prompts?.length !== 23 || matrixV53.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 53 prompt matrix: six-case protocol is incomplete');
const promptMapV53 = monitorEvidenceV53Json['ai-search-prompt-evidence-map.json'];
if (promptMapV53 && (promptMapV53.version !== '2026.09.12.53' || promptMapV53.promptMatrix?.schemaVersion !== 3 || promptMapV53.promptMatrix?.promptCount !== 23 || promptMapV53.promptMatrix?.doubaoPromptsSent !== false || promptMapV53.totals?.uniqueEvidencePages !== 23 || promptMapV53.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 53 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV53 = monitorEvidenceV53Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV53 && (promptCoverageV53.promptMatrixSchemaVersion !== 3 || promptCoverageV53.totals?.prompts !== 23 || promptCoverageV53.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV53.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV53.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV53.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 53 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV54Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-54';
const monitorEvidenceV54Release = await get('GitHub GEO monitor evidence revision 54', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-54', 'text/html');
requireText('GitHub GEO monitor evidence revision 54', monitorEvidenceV54Release, [
  'Onyx GEO monitor evidence checkpoint',
  '2026-09-12T20:47:26.698Z production collection',
  'One new provider-verified AhrefsBot fingerprint was observed',
  'newly exposed the previously queued Simplified Chinese industrial ERP AI data platform case study',
  'No prompts were sent to Doubao',
]);
const monitorEvidenceV54Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'a4694a7fc48b05e22af43928f64c4d90fd4eea92bb2decafdcd814b9e11cb287'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'38bf4b5e3817ebfedff7ec8159ade6a9a4cf37059de24464dbf8d2e491ab1de5'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'e8bba4436be1f470a505afbd1b49345bf5ecee3803b6ffc0ca63ea51615b0510'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV54Json = {};
for (const asset of monitorEvidenceV54Assets) {
  const raw = await get(`Versioned GEO monitor revision 54 ${asset.name}`, `${monitorEvidenceV54Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 54 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV54Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 54 ${asset.name}: invalid JSON`);
  }
}
const monitorV54 = monitorEvidenceV54Json['2026-09-11-monitor-evidence.json'];
if (monitorV54 && (monitorV54.publicStatusVersion !== '2026.09.12.54' || monitorV54.generatedAt !== '2026-09-12T20:47:26.698Z' || monitorV54.providerVerifiedCrawlerEvidence?.ahrefsbotDiscoveryFileRequests !== 94 || monitorV54.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.lastSeen !== '2026-09-12T20:22:25Z' || monitorV54.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.sitemapRequests !== 70 || monitorV54.providerVerifiedCrawlerEvidence?.distinctVerifiedContentPaths !== 45 || monitorV54.fixedPromptCoverage?.verifiedCrawledEvidencePages !== 15 || monitorV54.waybackEvidence?.captures !== 94 || monitorV54.waybackEvidence?.distinctUrls !== 44 || monitorV54.waybackEvidence?.fixedPromptArchiveCoverage?.archivedEvidencePages !== 16 || monitorV54.waybackEvidence?.fixedPromptArchiveCoverage?.promptsWithAnyArchivedEvidence !== 16 || monitorV54.waybackEvidence?.fixedPromptArchiveCoverage?.promptsFullyArchived !== 12 || monitorV54.waybackEvidence?.latestArchiveGrowthObservation?.url !== 'https://hk.onyxdevslab.com/zh-cn/case-studies/industrial-erp-ai-data-platform/' || monitorV54.githubRepositorySearchEvidence?.queries?.find((item) => item.id === 'category')?.totalCount !== 2 || monitorV54.attributionEvidence?.aiReferrerAttributedRequests !== 0 || monitorV54.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 54 monitor snapshot: expected AhrefsBot or Wayback evidence boundary is incomplete');
const statusV54 = monitorEvidenceV54Json['ai-search-evidence-status.json'];
if (statusV54 && (statusV54.version !== '2026.09.12.54' || statusV54.observedAt !== '2026-09-12T20:47:26.698Z' || statusV54.versionHistory?.[0]?.version !== '2026.09.12.54' || statusV54.versionHistory?.[1]?.version !== '2026.09.12.53' || statusV54.testProtocol?.schemaVersion !== 3 || statusV54.testProtocol?.promptCount !== 23 || statusV54.testProtocol?.doubaoPromptsSent !== false || statusV54.evidenceLevels?.[1]?.evidence?.verifiedAhrefsBotDiscoveryFileCrawls !== 94 || statusV54.evidenceLevels?.[1]?.evidence?.waybackArchiveObservation?.captures !== 94 || statusV54.evidenceLevels?.[1]?.evidence?.waybackArchiveObservation?.fixedPromptArchiveCoverage?.promptsFullyArchived !== 12 || statusV54.evidenceLevels?.[3]?.evidence?.realAiReferralVisitsObserved !== 0)) failures.push('Versioned GEO monitor revision 54 public status: expected AhrefsBot or Wayback evidence boundary is incomplete');
const matrixV54 = monitorEvidenceV54Json['prompt-matrix.json'];
if (matrixV54 && (matrixV54.schemaVersion !== 3 || matrixV54.prompts?.length !== 23 || matrixV54.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 54 prompt matrix: six-case protocol is incomplete');
const promptMapV54 = monitorEvidenceV54Json['ai-search-prompt-evidence-map.json'];
if (promptMapV54 && (promptMapV54.version !== '2026.09.12.54' || promptMapV54.promptMatrix?.schemaVersion !== 3 || promptMapV54.promptMatrix?.promptCount !== 23 || promptMapV54.promptMatrix?.doubaoPromptsSent !== false || promptMapV54.totals?.uniqueEvidencePages !== 23 || promptMapV54.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 54 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV54 = monitorEvidenceV54Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV54 && (promptCoverageV54.promptMatrixSchemaVersion !== 3 || promptCoverageV54.totals?.prompts !== 23 || promptCoverageV54.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV54.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV54.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV54.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 54 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV55Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-12-55';
const monitorEvidenceV55Release = await get('GitHub GEO monitor evidence revision 55', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-12-55', 'text/html');
requireText('GitHub GEO monitor evidence revision 55', monitorEvidenceV55Release, [
  'Onyx GEO monitor evidence checkpoint',
  '2026-09-12T22:12:53.589Z production collection',
  'One new provider-verified AhrefsBot fingerprint was observed',
  'Cumulative AhrefsBot discovery-file requests are now 95',
  'No prompts were sent to Doubao',
]);
const monitorEvidenceV55Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'6aeebe8461ec38841d8461e89bc3e34b90280a15c94788b2e0dbbff0bb5aaf96'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'b8ba0b937bf424b18318370accb7cb9957933e73a863f355d39c08bb4631ddeb'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'76668981e124c4b1b6ca726795e62fb9bcc15210a0f5f455c230fc0365b2ce9b'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV55Json = {};
for (const asset of monitorEvidenceV55Assets) {
  const raw = await get(`Versioned GEO monitor revision 55 ${asset.name}`, `${monitorEvidenceV55Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 55 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV55Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 55 ${asset.name}: invalid JSON`);
  }
}
const monitorV55 = monitorEvidenceV55Json['2026-09-11-monitor-evidence.json'];
if (monitorV55 && (monitorV55.publicStatusVersion !== '2026.09.12.55' || monitorV55.generatedAt !== '2026-09-12T22:12:53.589Z' || monitorV55.providerVerifiedCrawlerEvidence?.ahrefsbotDiscoveryFileRequests !== 95 || monitorV55.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.lastSeen !== '2026-09-12T21:59:47Z' || monitorV55.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.sitemapRequests !== 71 || monitorV55.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.distinctClientAddresses !== 84 || monitorV55.providerVerifiedCrawlerEvidence?.distinctVerifiedContentPaths !== 45 || monitorV55.fixedPromptCoverage?.verifiedCrawledEvidencePages !== 15 || monitorV55.waybackEvidence?.captures !== 94 || monitorV55.waybackEvidence?.distinctUrls !== 44 || monitorV55.waybackEvidence?.fixedPromptArchiveCoverage?.archivedEvidencePages !== 16 || monitorV55.waybackEvidence?.fixedPromptArchiveCoverage?.promptsWithAnyArchivedEvidence !== 16 || monitorV55.waybackEvidence?.fixedPromptArchiveCoverage?.promptsFullyArchived !== 12 || monitorV55.githubRepositorySearchEvidence?.queries?.find((item) => item.id === 'category')?.totalCount !== 2 || monitorV55.attributionEvidence?.campaigns?.geo_engagement_model_qa !== 42 || monitorV55.attributionEvidence?.latestVerifiedOffsiteReferral?.landingPage !== '/zh-cn/guides/enterprise-ai-rfp-template/' || monitorV55.attributionEvidence?.latestVisitorTypeUnverifiedAttributions?.length !== 2 || monitorV55.attributionEvidence?.aiReferrerAttributedRequests !== 0 || monitorV55.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 55 monitor snapshot: expected AhrefsBot, attribution, or archive evidence boundary is incomplete');
const statusV55 = monitorEvidenceV55Json['ai-search-evidence-status.json'];
if (statusV55 && (statusV55.version !== '2026.09.12.55' || statusV55.observedAt !== '2026-09-12T22:12:53.589Z' || statusV55.versionHistory?.[0]?.version !== '2026.09.12.55' || statusV55.versionHistory?.[1]?.version !== '2026.09.12.54' || statusV55.testProtocol?.schemaVersion !== 3 || statusV55.testProtocol?.promptCount !== 23 || statusV55.testProtocol?.doubaoPromptsSent !== false || statusV55.evidenceLevels?.[1]?.evidence?.verifiedAhrefsBotDiscoveryFileCrawls !== 95 || statusV55.evidenceLevels?.[1]?.evidence?.waybackArchiveObservation?.captures !== 94 || statusV55.evidenceLevels?.[1]?.evidence?.waybackArchiveObservation?.fixedPromptArchiveCoverage?.promptsFullyArchived !== 12 || statusV55.evidenceLevels?.[3]?.evidence?.realAiReferralVisitsObserved !== 0)) failures.push('Versioned GEO monitor revision 55 public status: expected AhrefsBot or evidence boundary is incomplete');
const matrixV55 = monitorEvidenceV55Json['prompt-matrix.json'];
if (matrixV55 && (matrixV55.schemaVersion !== 3 || matrixV55.prompts?.length !== 23 || matrixV55.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 55 prompt matrix: six-case protocol is incomplete');
const promptMapV55 = monitorEvidenceV55Json['ai-search-prompt-evidence-map.json'];
if (promptMapV55 && (promptMapV55.version !== '2026.09.12.55' || promptMapV55.promptMatrix?.schemaVersion !== 3 || promptMapV55.promptMatrix?.promptCount !== 23 || promptMapV55.promptMatrix?.doubaoPromptsSent !== false || promptMapV55.totals?.uniqueEvidencePages !== 23 || promptMapV55.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 55 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV55 = monitorEvidenceV55Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV55 && (promptCoverageV55.promptMatrixSchemaVersion !== 3 || promptCoverageV55.totals?.prompts !== 23 || promptCoverageV55.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV55.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV55.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV55.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 55 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV56Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-13-56';
const monitorEvidenceV56Release = await get('GitHub GEO monitor evidence revision 56', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-13-56', 'text/html');
requireText('GitHub GEO monitor evidence revision 56', monitorEvidenceV56Release, [
  'GEO monitor evidence — 2026-09-13, revision 56',
  'Yandex Web Search',
  'official Onyx apex domain',
  'No prompt was sent to Doubao',
]);
const monitorEvidenceV56Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'33e15ba40a0dc062bf09bdc1acfb08ace7c892a4f0711786b8fbf61e7542903e'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'b32aa8f4d3169a3ec6d45a2849aecea7b11d83c4af22ef25d68c9a6c38831804'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'d01307268c0c174be8ad7aa924ee3974152ae3a43ffb35e250fc9c9e655a278d'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV56Json = {};
for (const asset of monitorEvidenceV56Assets) {
  const raw = await get(`Versioned GEO monitor revision 56 ${asset.name}`, `${monitorEvidenceV56Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 56 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV56Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 56 ${asset.name}: invalid JSON`);
  }
}
const monitorV56 = monitorEvidenceV56Json['2026-09-11-monitor-evidence.json'];
if (monitorV56 && (monitorV56.publicStatusVersion !== '2026.09.13.56' || monitorV56.generatedAt !== '2026-09-12T22:12:53.589Z' || monitorV56.latestEvidenceObservedAt !== '2026-09-12T22:47:17Z' || monitorV56.yandexPublicSearchEvidence?.provider !== 'Yandex Web Search' || monitorV56.yandexPublicSearchEvidence?.officialBrandResult?.url !== 'https://onyxdevslab.com/' || monitorV56.yandexPublicSearchEvidence?.officialBrandResult?.canonicalTarget !== 'https://hk.onyxdevslab.com/' || monitorV56.yandexPublicSearchEvidence?.followUpQueries?.[0]?.status !== 'unavailable' || !monitorV56.yandexPublicSearchEvidence?.meaning?.includes('does not prove') || monitorV56.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 56 monitor snapshot: expected Yandex brand-result evidence or boundary is incomplete');
const statusV56 = monitorEvidenceV56Json['ai-search-evidence-status.json'];
if (statusV56 && (statusV56.version !== '2026.09.13.56' || statusV56.observedAt !== '2026-09-12T22:12:53.589Z' || statusV56.latestEvidenceObservedAt !== '2026-09-12T22:47:17Z' || statusV56.versionHistory?.[0]?.version !== '2026.09.13.56' || statusV56.versionHistory?.[1]?.version !== '2026.09.12.55' || statusV56.evidenceLevels?.[2]?.status !== 'not-verified' || statusV56.evidenceLevels?.[2]?.evidence?.publicSearchWebsiteResultObserved !== true || statusV56.evidenceLevels?.[2]?.evidence?.yandexPublicSearchObservation?.officialBrandResult?.canonicalTarget !== 'https://hk.onyxdevslab.com/' || statusV56.publicSearchMonitoring?.yandex?.captchaCompleted !== false || statusV56.testProtocol?.doubaoPromptsSent !== false)) failures.push('Versioned GEO monitor revision 56 public status: expected Yandex evidence or AI boundary is incomplete');
const matrixV56 = monitorEvidenceV56Json['prompt-matrix.json'];
if (matrixV56 && (matrixV56.schemaVersion !== 3 || matrixV56.prompts?.length !== 23 || matrixV56.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 56 prompt matrix: six-case protocol is incomplete');
const promptMapV56 = monitorEvidenceV56Json['ai-search-prompt-evidence-map.json'];
if (promptMapV56 && (promptMapV56.version !== '2026.09.13.56' || promptMapV56.promptMatrix?.schemaVersion !== 3 || promptMapV56.promptMatrix?.promptCount !== 23 || promptMapV56.promptMatrix?.doubaoPromptsSent !== false || promptMapV56.totals?.uniqueEvidencePages !== 23 || promptMapV56.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 56 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV56 = monitorEvidenceV56Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV56 && (promptCoverageV56.promptMatrixSchemaVersion !== 3 || promptCoverageV56.totals?.prompts !== 23 || promptCoverageV56.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV56.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV56.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV56.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 56 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV57Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-13-57';
const monitorEvidenceV57Release = await get('GitHub GEO monitor evidence revision 57', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-13-57', 'text/html');
requireText('GitHub GEO monitor evidence revision 57', monitorEvidenceV57Release, [
  'GEO monitor evidence — 2026-09-13, revision 57',
  'six-entry domain-canonicalization observation',
  'https_enforced=false',
  'No prompt was sent to Doubao',
]);
const monitorEvidenceV57Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'0f38811e5b3ceb41aa8d1a880f0d59e37c12dfb1e81710b2ec2fe868f8e2999e'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'04bf954fa3c99feae313f225c444adae97e387d5a2b662d7ae00766aa517002e'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'058c37cb27ff549d6ece1763b820286465f647eb1fe4149ce4bf37239ccbfc51'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV57Json = {};
for (const asset of monitorEvidenceV57Assets) {
  const raw = await get(`Versioned GEO monitor revision 57 ${asset.name}`, `${monitorEvidenceV57Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 57 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV57Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 57 ${asset.name}: invalid JSON`);
  }
}
const monitorV57 = monitorEvidenceV57Json['2026-09-11-monitor-evidence.json'];
if (monitorV57 && (monitorV57.publicStatusVersion !== '2026.09.13.57' || monitorV57.generatedAt !== '2026-09-12T23:12:15.413Z' || monitorV57.latestEvidenceObservedAt !== '2026-09-12T23:12:15.344Z' || monitorV57.domainCanonicalizationEvidence?.status !== 'noncompliant' || monitorV57.domainCanonicalizationEvidence?.targetsChecked !== 6 || monitorV57.domainCanonicalizationEvidence?.compliantTargets !== 3 || monitorV57.domainCanonicalizationEvidence?.targets?.find((item) => item.id === 'https-www')?.reasons?.includes('https-downgrade-observed') !== true || monitorV57.domainCanonicalizationEvidence?.githubPagesSetting?.httpsEnforced !== false || monitorV57.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 57 monitor snapshot: expected domain canonicalization defect or boundary is incomplete');
const statusV57 = monitorEvidenceV57Json['ai-search-evidence-status.json'];
if (statusV57 && (statusV57.version !== '2026.09.13.57' || statusV57.latestEvidenceObservedAt !== '2026-09-12T23:12:15.344Z' || statusV57.versionHistory?.[0]?.version !== '2026.09.13.57' || statusV57.versionHistory?.[1]?.version !== '2026.09.13.56' || statusV57.domainCanonicalization?.status !== 'noncompliant' || statusV57.domainCanonicalization?.noncompliantTargets !== 3 || statusV57.domainCanonicalization?.githubPagesSetting?.mutationAuthorized !== false || statusV57.evidenceLevels?.[2]?.evidence?.yandexPublicSearchObservation?.officialBrandResultObserved !== true || statusV57.testProtocol?.doubaoPromptsSent !== false)) failures.push('Versioned GEO monitor revision 57 public status: expected canonicalization, Yandex, or AI boundary is incomplete');
const matrixV57 = monitorEvidenceV57Json['prompt-matrix.json'];
if (matrixV57 && (matrixV57.schemaVersion !== 3 || matrixV57.prompts?.length !== 23 || matrixV57.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 57 prompt matrix: six-case protocol is incomplete');
const promptMapV57 = monitorEvidenceV57Json['ai-search-prompt-evidence-map.json'];
if (promptMapV57 && (promptMapV57.version !== '2026.09.13.57' || promptMapV57.promptMatrix?.schemaVersion !== 3 || promptMapV57.promptMatrix?.promptCount !== 23 || promptMapV57.promptMatrix?.doubaoPromptsSent !== false || promptMapV57.totals?.uniqueEvidencePages !== 23 || promptMapV57.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 57 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV57 = monitorEvidenceV57Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV57 && (promptCoverageV57.promptMatrixSchemaVersion !== 3 || promptCoverageV57.totals?.prompts !== 23 || promptCoverageV57.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV57.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV57.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV57.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 57 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV58Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-13-58';
const monitorEvidenceV58Release = await get('GitHub GEO monitor evidence revision 58', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-13-58', 'text/html');
requireText('GitHub GEO monitor evidence revision 58', monitorEvidenceV58Release, [
  'GEO monitor evidence checkpoint — 2026-09-13, revision 58',
  'two new provider-verified YandexBot discovery-file requests',
  '/data/github-repository-search-baseline.json returned 200',
  'six-entry domain check remains three compliant and three noncompliant entries',
  'No prompt was sent to Doubao',
]);
const monitorEvidenceV58Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'cf5b9f679d7024658a23323b64a07ba5835b499ff80eff83ca21008c6f87f405'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'3fcb44fec70d0f3dafb327e0504e651707073d01c8ae6bb4a3035425367bfa27'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'9eeda57e1cd3a045d34a8cef1fb1af338e51a07cb36e4fbd6f62953f7eb3d753'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV58Json = {};
for (const asset of monitorEvidenceV58Assets) {
  const raw = await get(`Versioned GEO monitor revision 58 ${asset.name}`, `${monitorEvidenceV58Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 58 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV58Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 58 ${asset.name}: invalid JSON`);
  }
}
const monitorV58 = monitorEvidenceV58Json['2026-09-11-monitor-evidence.json'];
if (monitorV58 && (monitorV58.publicStatusVersion !== '2026.09.13.58' || monitorV58.generatedAt !== '2026-09-12T23:27:02.484Z' || monitorV58.providerVerifiedCrawlerEvidence?.yandexbotContentRequests !== 78 || monitorV58.providerVerifiedCrawlerEvidence?.yandexbotDiscoveryFileRequests !== 73 || monitorV58.providerVerifiedCrawlerEvidence?.yandexHistoricalRecognition?.lastSeen !== '2026-09-12T23:18:34Z' || monitorV58.providerVerifiedCrawlerEvidence?.yandexHistoricalRecognition?.latestVerifiedDiscoveryRequests?.length !== 2 || monitorV58.providerVerifiedCrawlerEvidence?.yandexHistoricalRecognition?.latestVerifiedDiscoveryRequests?.[1]?.path !== '/data/github-repository-search-baseline.json' || monitorV58.domainCanonicalizationEvidence?.status !== 'noncompliant' || monitorV58.domainCanonicalizationEvidence?.compliantTargets !== 3 || monitorV58.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 58 monitor snapshot: expected Yandex discovery evidence, canonicalization state, or boundary is incomplete');
const statusV58 = monitorEvidenceV58Json['ai-search-evidence-status.json'];
if (statusV58 && (statusV58.version !== '2026.09.13.58' || statusV58.observedAt !== '2026-09-12T23:27:02.484Z' || statusV58.versionHistory?.[0]?.version !== '2026.09.13.58' || statusV58.versionHistory?.[1]?.version !== '2026.09.13.57' || statusV58.evidenceLevels?.[1]?.evidence?.verifiedYandexbotContentCrawls !== 78 || statusV58.evidenceLevels?.[1]?.evidence?.verifiedYandexbotDiscoveryFileCrawls !== 73 || statusV58.domainCanonicalization?.noncompliantTargets !== 3 || statusV58.testProtocol?.doubaoPromptsSent !== false)) failures.push('Versioned GEO monitor revision 58 public status: expected Yandex discovery evidence, canonicalization state, or AI boundary is incomplete');
const matrixV58 = monitorEvidenceV58Json['prompt-matrix.json'];
if (matrixV58 && (matrixV58.schemaVersion !== 3 || matrixV58.prompts?.length !== 23 || matrixV58.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 58 prompt matrix: six-case protocol is incomplete');
const promptMapV58 = monitorEvidenceV58Json['ai-search-prompt-evidence-map.json'];
if (promptMapV58 && (promptMapV58.version !== '2026.09.13.58' || promptMapV58.promptMatrix?.schemaVersion !== 3 || promptMapV58.promptMatrix?.promptCount !== 23 || promptMapV58.promptMatrix?.doubaoPromptsSent !== false || promptMapV58.totals?.uniqueEvidencePages !== 23 || promptMapV58.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 58 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV58 = monitorEvidenceV58Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV58 && (promptCoverageV58.promptMatrixSchemaVersion !== 3 || promptCoverageV58.totals?.prompts !== 23 || promptCoverageV58.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV58.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV58.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV58.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 58 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV59Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-13-59';
const monitorEvidenceV59Release = await get('GitHub GEO monitor evidence revision 59', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-13-59', 'text/html');
requireText('GitHub GEO monitor evidence revision 59', monitorEvidenceV59Release, [
  'GEO monitor evidence checkpoint — 2026-09-13, revision 59',
  'two additional official-range AhrefsBot discovery requests',
  'append-only sanitized observation ledger across log rotation',
  'No prompt was sent to Doubao',
]);
const monitorEvidenceV59Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'a9db88bfb3e06782bea26bb810c1e6dc4f0c71df9b47392295ca684bddea8243'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'0bfbdccc4c6a06c33e80dd032631ad751c97ccf9ddaf0e1cf41530a4f3ef1a80'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'3da22ebf0082602ddcf3cb78d9f94084fb9d4a059f2ade91767706165952e6df'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV59Json = {};
for (const asset of monitorEvidenceV59Assets) {
  const raw = await get(`Versioned GEO monitor revision 59 ${asset.name}`, `${monitorEvidenceV59Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 59 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV59Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 59 ${asset.name}: invalid JSON`);
  }
}
const monitorV59 = monitorEvidenceV59Json['2026-09-11-monitor-evidence.json'];
if (monitorV59 && (monitorV59.publicStatusVersion !== '2026.09.13.59' || monitorV59.generatedAt !== '2026-09-12T23:52:07.815Z' || monitorV59.providerVerifiedCrawlerEvidence?.ahrefsbotDiscoveryFileRequests !== 97 || monitorV59.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.lastSeen !== '2026-09-12T23:26:59Z' || monitorV59.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.latestVerifiedDiscoveryRequests?.length !== 2 || monitorV59.crawlerEvidenceAccounting?.contentPathCoverage?.verifiedPageObservations !== 113 || monitorV59.crawlerEvidenceAccounting?.contentPathCoverage?.distinctPaths !== 45 || monitorV59.domainCanonicalizationEvidence?.noncompliantTargets !== 3 || monitorV59.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 59 monitor snapshot: expected Ahrefs discovery evidence, cumulative path coverage, canonicalization state, or boundary is incomplete');
const statusV59 = monitorEvidenceV59Json['ai-search-evidence-status.json'];
if (statusV59 && (statusV59.version !== '2026.09.13.59' || statusV59.observedAt !== '2026-09-12T23:52:07.815Z' || statusV59.versionHistory?.[0]?.version !== '2026.09.13.59' || statusV59.versionHistory?.[1]?.version !== '2026.09.13.58' || statusV59.evidenceLevels?.[1]?.evidence?.verifiedAhrefsBotDiscoveryFileCrawls !== 97 || statusV59.crawlerEvidenceAccounting?.contentPathCoverage?.distinctPaths !== 45 || statusV59.testProtocol?.doubaoPromptsSent !== false)) failures.push('Versioned GEO monitor revision 59 public status: expected Ahrefs discovery evidence, cumulative path coverage, or AI boundary is incomplete');
const matrixV59 = monitorEvidenceV59Json['prompt-matrix.json'];
if (matrixV59 && (matrixV59.schemaVersion !== 3 || matrixV59.prompts?.length !== 23 || matrixV59.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 59 prompt matrix: six-case protocol is incomplete');
const promptMapV59 = monitorEvidenceV59Json['ai-search-prompt-evidence-map.json'];
if (promptMapV59 && (promptMapV59.version !== '2026.09.13.59' || promptMapV59.promptMatrix?.schemaVersion !== 3 || promptMapV59.promptMatrix?.promptCount !== 23 || promptMapV59.promptMatrix?.doubaoPromptsSent !== false || promptMapV59.totals?.uniqueEvidencePages !== 23 || promptMapV59.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 59 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV59 = monitorEvidenceV59Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV59 && (promptCoverageV59.promptMatrixSchemaVersion !== 3 || promptCoverageV59.totals?.prompts !== 23 || promptCoverageV59.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV59.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV59.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV59.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 59 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV60Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-13-60';
const monitorEvidenceV60Release = await get('GitHub GEO monitor evidence revision 60', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-13-60', 'text/html');
requireText('GitHub GEO monitor evidence revision 60', monitorEvidenceV60Release, [
  'GEO monitor evidence checkpoint — 2026-09-13, revision 60',
  'continuous numbered-log lineage policy',
  'Common Crawl observation is partial',
  'No prompt was sent to Doubao',
]);
const monitorEvidenceV60Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'b705e66fb4ae0af8a65e95fe9c390d61a61f69a9be786a6e2822d66923456ea0'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'e5814881e1884502422e72de20fb06240a7f9334e1adf68651a19261257fc4ec'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'a27ea7fb31d886b2200edbebd3afcb1e5b990c5da3281a3811c28be69eaacc01'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV60Json = {};
for (const asset of monitorEvidenceV60Assets) {
  const raw = await get(`Versioned GEO monitor revision 60 ${asset.name}`, `${monitorEvidenceV60Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 60 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV60Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 60 ${asset.name}: invalid JSON`);
  }
}
const monitorV60 = monitorEvidenceV60Json['2026-09-11-monitor-evidence.json'];
if (monitorV60 && (monitorV60.publicStatusVersion !== '2026.09.13.60' || monitorV60.generatedAt !== '2026-09-13T00:15:36.990Z' || monitorV60.sourceLogs?.length !== 5 || monitorV60.crawlerEvidenceAccounting?.retainedLogPolicy?.mode !== 'continuous-numbered-rotation-lineage' || monitorV60.providerVerifiedCrawlerEvidence?.distinctVerifiedContentPaths !== 45 || monitorV60.commonCrawlEvidence?.status !== 'partial' || monitorV60.commonCrawlEvidence?.unavailableIndexes?.[0]?.id !== 'CC-MAIN-2026-34' || monitorV60.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 60 monitor snapshot: expected log-lineage policy, partial Common Crawl state, stable coverage, or boundary is incomplete');
const statusV60 = monitorEvidenceV60Json['ai-search-evidence-status.json'];
if (statusV60 && (statusV60.version !== '2026.09.13.60' || statusV60.observedAt !== '2026-09-13T00:15:36.990Z' || statusV60.versionHistory?.[0]?.version !== '2026.09.13.60' || statusV60.versionHistory?.[1]?.version !== '2026.09.13.59' || statusV60.crawlerEvidenceAccounting?.retainedLogPolicy?.mode !== 'continuous-numbered-rotation-lineage' || statusV60.evidenceLevels?.[1]?.evidence?.verifiedDistinctContentPaths !== 45 || statusV60.evidenceLevels?.[1]?.evidence?.commonCrawlIndexObservation?.status !== 'partial' || statusV60.testProtocol?.doubaoPromptsSent !== false)) failures.push('Versioned GEO monitor revision 60 public status: expected log-lineage policy, partial Common Crawl state, stable coverage, or AI boundary is incomplete');
const matrixV60 = monitorEvidenceV60Json['prompt-matrix.json'];
if (matrixV60 && (matrixV60.schemaVersion !== 3 || matrixV60.prompts?.length !== 23 || matrixV60.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 60 prompt matrix: six-case protocol is incomplete');
const promptMapV60 = monitorEvidenceV60Json['ai-search-prompt-evidence-map.json'];
if (promptMapV60 && (promptMapV60.version !== '2026.09.13.60' || promptMapV60.promptMatrix?.schemaVersion !== 3 || promptMapV60.promptMatrix?.promptCount !== 23 || promptMapV60.promptMatrix?.doubaoPromptsSent !== false || promptMapV60.totals?.uniqueEvidencePages !== 23 || promptMapV60.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 60 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV60 = monitorEvidenceV60Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV60 && (promptCoverageV60.promptMatrixSchemaVersion !== 3 || promptCoverageV60.totals?.prompts !== 23 || promptCoverageV60.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV60.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV60.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV60.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 60 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV61Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-13-61';
const monitorEvidenceV61Release = await get('GitHub GEO monitor evidence revision 61', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-13-61', 'text/html');
requireText('GitHub GEO monitor evidence revision 61', monitorEvidenceV61Release, [
  'GEO monitor evidence checkpoint — 2026-09-13, revision 61',
  'three new no-referrer geo_engagement_model_qa requests',
  'optional archive availability remains event-recorded',
  'No prompt was sent to Doubao',
]);
const monitorEvidenceV61Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'2a75ca2af85495ecefbe0d2ebb5f3a4bf34f807459325fa15684b5094b8b21ca'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'f2965fac329d5c7050acb2c343ca1ff6d70e49bc06355f55dfcc6eae3dc0062b'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'6c7b8134b39eaf0e16eb3cec17f25c1e66910e522cde5cc8d9303fd5e95c0a26'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV61Json = {};
for (const asset of monitorEvidenceV61Assets) {
  const raw = await get(`Versioned GEO monitor revision 61 ${asset.name}`, `${monitorEvidenceV61Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 61 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV61Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 61 ${asset.name}: invalid JSON`);
  }
}
const monitorV61 = monitorEvidenceV61Json['2026-09-11-monitor-evidence.json'];
if (monitorV61 && (monitorV61.publicStatusVersion !== '2026.09.13.61' || monitorV61.generatedAt !== '2026-09-13T00:35:05.517Z' || monitorV61.attributionEvidence?.trackedRequests !== 86 || monitorV61.attributionEvidence?.visitorTypeUnverifiedRequests !== 14 || monitorV61.attributionEvidence?.aiReferrerAttributedRequests !== 0 || monitorV61.commonCrawlEvidence?.status !== 'unavailable' || monitorV61.commonCrawlEvidence?.availableIndexes?.length !== 0 || monitorV61.commonCrawlEvidence?.unavailableIndexes?.length !== 2 || monitorV61.providerVerifiedCrawlerEvidence?.distinctVerifiedContentPaths !== 45 || monitorV61.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 61 monitor snapshot: expected attribution, optional archive availability, stable coverage, or boundary is incomplete');
const statusV61 = monitorEvidenceV61Json['ai-search-evidence-status.json'];
if (statusV61 && (statusV61.version !== '2026.09.13.61' || statusV61.observedAt !== '2026-09-13T00:35:05.517Z' || statusV61.versionHistory?.[0]?.version !== '2026.09.13.61' || statusV61.versionHistory?.[1]?.version !== '2026.09.13.60' || statusV61.evidenceLevels?.[3]?.evidence?.trackedAttributionRequests !== 86 || statusV61.evidenceLevels?.[3]?.evidence?.humanUnverifiedTrackedRequests !== 14 || statusV61.evidenceLevels?.[3]?.evidence?.realAiReferralVisitsObserved !== 0 || statusV61.evidenceLevels?.[1]?.evidence?.commonCrawlIndexObservation?.status !== 'unavailable' || statusV61.evidenceLevels?.[1]?.evidence?.verifiedDistinctContentPaths !== 45 || statusV61.testProtocol?.doubaoPromptsSent !== false)) failures.push('Versioned GEO monitor revision 61 public status: expected attribution, optional archive availability, stable coverage, or AI boundary is incomplete');
const matrixV61 = monitorEvidenceV61Json['prompt-matrix.json'];
if (matrixV61 && (matrixV61.schemaVersion !== 3 || matrixV61.prompts?.length !== 23 || matrixV61.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 61 prompt matrix: six-case protocol is incomplete');
const promptMapV61 = monitorEvidenceV61Json['ai-search-prompt-evidence-map.json'];
if (promptMapV61 && (promptMapV61.version !== '2026.09.13.61' || promptMapV61.promptMatrix?.schemaVersion !== 3 || promptMapV61.promptMatrix?.promptCount !== 23 || promptMapV61.promptMatrix?.doubaoPromptsSent !== false || promptMapV61.totals?.uniqueEvidencePages !== 23 || promptMapV61.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 61 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV61 = monitorEvidenceV61Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV61 && (promptCoverageV61.promptMatrixSchemaVersion !== 3 || promptCoverageV61.totals?.prompts !== 23 || promptCoverageV61.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV61.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV61.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV61.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 61 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV62Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-13-62';
const monitorEvidenceV62Release = await get('GitHub GEO monitor evidence revision 62', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-13-62', 'text/html');
requireText('GitHub GEO monitor evidence revision 62', monitorEvidenceV62Release, [
  'GEO monitor evidence checkpoint — 2026-09-13, revision 62',
  'one new provider-verified AhrefsBot request',
  'Both selected Common Crawl indexes returned usable zero-capture responses',
  'No prompt was sent to Doubao',
]);
const monitorEvidenceV62Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'709de21c82a46be1346bcf2966ca44a8fc54dbd967b74754f7f6e317696fbe4f'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'07a45a1991c27c90d4e1ca9dccc6d8134e27da2c30346184ff3ff3c0849e87e9'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'735e556534268c2a3d8d2c7d6e9836453d6aaa16ffa7a18db524d402a7b8482d'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV62Json = {};
for (const asset of monitorEvidenceV62Assets) {
  const raw = await get(`Versioned GEO monitor revision 62 ${asset.name}`, `${monitorEvidenceV62Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 62 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV62Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 62 ${asset.name}: invalid JSON`);
  }
}
const monitorV62 = monitorEvidenceV62Json['2026-09-11-monitor-evidence.json'];
if (monitorV62 && (monitorV62.publicStatusVersion !== '2026.09.13.62' || monitorV62.generatedAt !== '2026-09-13T00:51:11.185Z' || monitorV62.providerVerifiedCrawlerEvidence?.ahrefsbotDiscoveryFileRequests !== 98 || monitorV62.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.sitemapRequests !== 73 || monitorV62.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.distinctClientAddresses !== 87 || monitorV62.providerVerifiedCrawlerEvidence?.ahrefsbotContentRequests !== 0 || monitorV62.commonCrawlEvidence?.status !== 'available' || monitorV62.providerVerifiedCrawlerEvidence?.distinctVerifiedContentPaths !== 45 || monitorV62.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 62 monitor snapshot: expected Ahrefs discovery, Common Crawl availability, stable coverage, or boundary is incomplete');
const statusV62 = monitorEvidenceV62Json['ai-search-evidence-status.json'];
if (statusV62 && (statusV62.version !== '2026.09.13.62' || statusV62.observedAt !== '2026-09-13T00:51:11.185Z' || statusV62.versionHistory?.[0]?.version !== '2026.09.13.62' || statusV62.versionHistory?.[1]?.version !== '2026.09.13.61' || statusV62.evidenceLevels?.[1]?.evidence?.verifiedAhrefsBotDiscoveryFileCrawls !== 98 || statusV62.evidenceLevels?.[1]?.evidence?.verifiedAhrefsBotContentCrawls !== 0 || statusV62.evidenceLevels?.[1]?.evidence?.commonCrawlIndexObservation?.status !== 'available' || statusV62.evidenceLevels?.[1]?.evidence?.verifiedDistinctContentPaths !== 45 || statusV62.testProtocol?.doubaoPromptsSent !== false)) failures.push('Versioned GEO monitor revision 62 public status: expected Ahrefs discovery, Common Crawl availability, stable coverage, or AI boundary is incomplete');
const matrixV62 = monitorEvidenceV62Json['prompt-matrix.json'];
if (matrixV62 && (matrixV62.schemaVersion !== 3 || matrixV62.prompts?.length !== 23 || matrixV62.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 62 prompt matrix: six-case protocol is incomplete');
const promptMapV62 = monitorEvidenceV62Json['ai-search-prompt-evidence-map.json'];
if (promptMapV62 && (promptMapV62.version !== '2026.09.13.62' || promptMapV62.promptMatrix?.schemaVersion !== 3 || promptMapV62.promptMatrix?.promptCount !== 23 || promptMapV62.promptMatrix?.doubaoPromptsSent !== false || promptMapV62.totals?.uniqueEvidencePages !== 23 || promptMapV62.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 62 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV62 = monitorEvidenceV62Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV62 && (promptCoverageV62.promptMatrixSchemaVersion !== 3 || promptCoverageV62.totals?.prompts !== 23 || promptCoverageV62.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV62.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV62.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV62.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 62 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV63Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-13-63';
const monitorEvidenceV63Release = await get('GitHub GEO monitor evidence revision 63', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-13-63', 'text/html');
requireText('GitHub GEO monitor evidence revision 63', monitorEvidenceV63Release, [
  'GEO monitor evidence checkpoint — 2026-09-13, revision 63',
  '34 available sources',
  'actual attribution remains 86 tracked requests',
  'No prompt was sent to Doubao',
]);
const monitorEvidenceV63Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'269dcf5a82a99a41b6d5ce41f2bc6ff0ccb794ccb2e88599697a77fa4acc549a'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'1c9b5183977969fcd19387180151381f1d66beecfc85678d3f3484f6445e2b7d'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'d292108a971b811753ce9bea8def884884c29cb44e9cb44fcdcbce05673360cd'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV63Json = {};
for (const asset of monitorEvidenceV63Assets) {
  const raw = await get(`Versioned GEO monitor revision 63 ${asset.name}`, `${monitorEvidenceV63Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 63 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV63Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 63 ${asset.name}: invalid JSON`);
  }
}
const monitorV63 = monitorEvidenceV63Json['2026-09-11-monitor-evidence.json'];
if (monitorV63 && (monitorV63.publicStatusVersion !== '2026.09.13.63' || monitorV63.generatedAt !== '2026-09-13T01:22:10.953Z' || monitorV63.distributionEvidence?.publishedItems !== 10 || monitorV63.distributionEvidence?.availableSources !== 34 || monitorV63.attributionEvidence?.internalAuditTrafficCorrection?.requestsExcluded !== 6 || monitorV63.attributionEvidence?.trackedRequests !== 86 || monitorV63.attributionEvidence?.visitorTypeUnverifiedRequests !== 14 || monitorV63.attributionEvidence?.aiReferrerAttributedRequests !== 0 || monitorV63.providerVerifiedCrawlerEvidence?.distinctVerifiedContentPaths !== 45 || monitorV63.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 63 monitor snapshot: expected distribution coverage, audit correction, stable attribution, coverage, or boundary is incomplete');
const statusV63 = monitorEvidenceV63Json['ai-search-evidence-status.json'];
if (statusV63 && (statusV63.version !== '2026.09.13.63' || statusV63.observedAt !== '2026-09-13T01:22:10.953Z' || statusV63.versionHistory?.[0]?.version !== '2026.09.13.63' || statusV63.versionHistory?.[1]?.version !== '2026.09.13.62' || statusV63.evidenceLevels?.[3]?.evidence?.trackedAttributionRequests !== 86 || statusV63.evidenceLevels?.[3]?.evidence?.humanUnverifiedTrackedRequests !== 14 || statusV63.evidenceLevels?.[3]?.evidence?.realAiReferralVisitsObserved !== 0 || statusV63.evidenceLevels?.[1]?.evidence?.verifiedDistinctContentPaths !== 45 || statusV63.testProtocol?.doubaoPromptsSent !== false)) failures.push('Versioned GEO monitor revision 63 public status: expected attribution, stable coverage, or AI boundary is incomplete');
const matrixV63 = monitorEvidenceV63Json['prompt-matrix.json'];
if (matrixV63 && (matrixV63.schemaVersion !== 3 || matrixV63.prompts?.length !== 23 || matrixV63.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 63 prompt matrix: six-case protocol is incomplete');
const promptMapV63 = monitorEvidenceV63Json['ai-search-prompt-evidence-map.json'];
if (promptMapV63 && (promptMapV63.version !== '2026.09.13.63' || promptMapV63.promptMatrix?.schemaVersion !== 3 || promptMapV63.promptMatrix?.promptCount !== 23 || promptMapV63.promptMatrix?.doubaoPromptsSent !== false || promptMapV63.totals?.uniqueEvidencePages !== 23 || promptMapV63.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 63 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV63 = monitorEvidenceV63Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV63 && (promptCoverageV63.promptMatrixSchemaVersion !== 3 || promptCoverageV63.totals?.prompts !== 23 || promptCoverageV63.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV63.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV63.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV63.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 63 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV64Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-13-64';
const monitorEvidenceV64Release = await get('GitHub GEO monitor evidence revision 64', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-monitor-evidence-2026-09-13-64', 'text/html');
requireText('GitHub GEO monitor evidence revision 64', monitorEvidenceV64Release, [
  'GEO monitor evidence checkpoint — 2026-09-13, revision 64',
  'piper.ns.cloudflare.com',
  'all six domain entry points',
  'no prompt was sent to Doubao',
]);
const monitorEvidenceV64Assets = [
  {name:'monitor snapshot',file:'2026-09-11-monitor-evidence.json',sha256:'9bc2839ee606170062588417a9f3859984a23841f445c18adbde1db7ff26a44e'},
  {name:'public status',file:'ai-search-evidence-status.json',sha256:'691f500e1e708e65e27d47f4ee9b6dced9d12814ee096282fcd987993c470fd2'},
  {name:'prompt matrix',file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {name:'prompt evidence map',file:'ai-search-prompt-evidence-map.json',sha256:'5c90e19d750719a0389bc0d9761b5e8744cb2bbc17fb0e0459d9c6226ab72909'},
  {name:'prompt crawl coverage',file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV64Json = {};
for (const asset of monitorEvidenceV64Assets) {
  const raw = await get(`Versioned GEO monitor revision 64 ${asset.name}`, `${monitorEvidenceV64Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 64 ${asset.name}: SHA-256 mismatch, got ${digest}`);
  try {
    monitorEvidenceV64Json[asset.file] = JSON.parse(raw);
  } catch {
    failures.push(`Versioned GEO monitor revision 64 ${asset.name}: invalid JSON`);
  }
}
const monitorV64 = monitorEvidenceV64Json['2026-09-11-monitor-evidence.json'];
if (monitorV64 && (monitorV64.publicStatusVersion !== '2026.09.13.64' || monitorV64.generatedAt !== '2026-09-13T01:56:43.310Z' || monitorV64.domainCanonicalizationEvidence?.authorityObservation?.nameServers?.join(',') !== 'piper.ns.cloudflare.com,trey.ns.cloudflare.com' || monitorV64.domainCanonicalizationEvidence?.authorityObservation?.cloudflareNameservers !== true || monitorV64.domainCanonicalizationEvidence?.edgeObservation?.targetsChecked !== 6 || monitorV64.domainCanonicalizationEvidence?.edgeObservation?.cloudflareSignaledTargets !== 6 || monitorV64.domainCanonicalizationEvidence?.edgeObservation?.allTargetsCloudflareSignaled !== true || monitorV64.domainCanonicalizationEvidence?.compliantTargets !== 3 || monitorV64.distributionEvidence?.publishedItems !== 10 || monitorV64.distributionEvidence?.trackedTargetsChecked !== 24 || monitorV64.attributionEvidence?.trackedRequests !== 86 || monitorV64.attributionEvidence?.aiReferrerAttributedRequests !== 0 || monitorV64.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 64 monitor snapshot: expected authority, edge, canonicalization, distribution, attribution, or Doubao boundary is incomplete');
const statusV64 = monitorEvidenceV64Json['ai-search-evidence-status.json'];
if (statusV64 && (statusV64.version !== '2026.09.13.64' || statusV64.observedAt !== '2026-09-13T01:56:43.310Z' || statusV64.versionHistory?.[0]?.version !== '2026.09.13.64' || statusV64.versionHistory?.[1]?.version !== '2026.09.13.63' || statusV64.domainCanonicalization?.authorityObservation?.cloudflareNameservers !== true || statusV64.domainCanonicalization?.edgeObservation?.allTargetsCloudflareSignaled !== true || statusV64.domainCanonicalization?.compliantTargets !== 3 || statusV64.evidenceLevels?.[1]?.evidence?.verifiedDistinctContentPaths !== 45 || statusV64.evidenceLevels?.[3]?.evidence?.realAiReferralVisitsObserved !== 0 || statusV64.testProtocol?.doubaoPromptsSent !== false)) failures.push('Versioned GEO monitor revision 64 public status: expected authority, edge, stable coverage, or AI boundary is incomplete');
const matrixV64 = monitorEvidenceV64Json['prompt-matrix.json'];
if (matrixV64 && (matrixV64.schemaVersion !== 3 || matrixV64.prompts?.length !== 23 || matrixV64.prompts.find((prompt) => prompt.id === 'brand-cases')?.evidenceUrls?.length !== 7)) failures.push('Versioned GEO monitor revision 64 prompt matrix: six-case protocol is incomplete');
const promptMapV64 = monitorEvidenceV64Json['ai-search-prompt-evidence-map.json'];
if (promptMapV64 && (promptMapV64.version !== '2026.09.13.64' || promptMapV64.promptMatrix?.schemaVersion !== 3 || promptMapV64.promptMatrix?.promptCount !== 23 || promptMapV64.promptMatrix?.doubaoPromptsSent !== false || promptMapV64.totals?.uniqueEvidencePages !== 23 || promptMapV64.prompts?.length !== 23)) failures.push('Versioned GEO monitor revision 64 prompt evidence map: expected protocol or boundary is incomplete');
const promptCoverageV64 = monitorEvidenceV64Json['2026-09-11-prompt-crawl-coverage.json'];
if (promptCoverageV64 && (promptCoverageV64.promptMatrixSchemaVersion !== 3 || promptCoverageV64.totals?.prompts !== 23 || promptCoverageV64.totals?.verifiedCrawledEvidencePages !== 15 || promptCoverageV64.totals?.promptsWithAnyVerifiedCrawl !== 18 || promptCoverageV64.totals?.promptsFullyVerifiedCrawled !== 12 || promptCoverageV64.bySegment?.scenario?.prompts !== 6)) failures.push('Versioned GEO monitor revision 64 prompt crawl coverage: expected totals are incomplete');

const monitorEvidenceV65Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-13-65';
const monitorEvidenceV65Assets = [
  {file:'2026-09-11-monitor-evidence.json',sha256:'379d468041aa469ba89ddd7091dd228dd0557c11029a21f0e12efff5a5c2b01e'},
  {file:'ai-search-evidence-status.json',sha256:'c42a0e71e7d2a5083e9ba6ab5d45a25a5474e4ce61b91507b81a9765f501b5ac'},
  {file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {file:'ai-search-prompt-evidence-map.json',sha256:'8610ecf090b15c25fbb6271b6cd3906fad545b9369e7a2676d8a42b2fa66719a'},
  {file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV65Json = {};
for (const asset of monitorEvidenceV65Assets) {
  const raw = await get(`Versioned GEO monitor revision 65 ${asset.file}`, `${monitorEvidenceV65Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 65 ${asset.file}: SHA-256 mismatch, got ${digest}`);
  try { monitorEvidenceV65Json[asset.file] = JSON.parse(raw); } catch { failures.push(`Versioned GEO monitor revision 65 ${asset.file}: invalid JSON`); }
}
const monitorV65 = monitorEvidenceV65Json['2026-09-11-monitor-evidence.json'];
if (monitorV65 && (monitorV65.publicStatusVersion !== '2026.09.13.65' || monitorV65.generatedAt !== '2026-09-13T02:24:04.137Z' || monitorV65.providerVerifiedCrawlerEvidence?.ahrefsbotDiscoveryFileRequests !== 99 || monitorV65.providerVerifiedCrawlerEvidence?.ahrefsbotContentRequests !== 0 || monitorV65.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.lastSeen !== '2026-09-13T02:17:49Z' || monitorV65.providerVerifiedCrawlerEvidence?.ahrefsHistoricalRecognition?.sitemapRequests !== 74 || monitorV65.providerVerifiedCrawlerEvidence?.distinctVerifiedContentPaths !== 45 || monitorV65.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 65: Ahrefs discovery evidence or boundary is incomplete');

const monitorEvidenceV66Base = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-monitor-evidence-2026-09-13-66';
const monitorEvidenceV66Assets = [
  {file:'2026-09-11-monitor-evidence.json',sha256:'ef657391b28a75ff678c30757eb8e784d964a1567e20d2dec842bf02c78980fb'},
  {file:'ai-search-evidence-status.json',sha256:'ed071c7eb44fdca6e7f1cc18f32cff4412f6f9a53cc650207bcfc995e3424ed4'},
  {file:'prompt-matrix.json',sha256:'ed5305c7c1221689dd5c522cf305ea7ff73344ef37f016a3e148d5f598351b6f'},
  {file:'ai-search-prompt-evidence-map.json',sha256:'df0d1e557f58f0e78948e405579c680bceede29561f033ecb45fab9e9900edc7'},
  {file:'2026-09-11-prompt-crawl-coverage.json',sha256:'7b9eb77978732b6425d408bb02cf4c2629daa9693ad2bb448e937df179151c11'},
];
const monitorEvidenceV66Json = {};
for (const asset of monitorEvidenceV66Assets) {
  const raw = await get(`Versioned GEO monitor revision 66 ${asset.file}`, `${monitorEvidenceV66Base}/${asset.file}`, 'application/');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== asset.sha256) failures.push(`Versioned GEO monitor revision 66 ${asset.file}: SHA-256 mismatch, got ${digest}`);
  try { monitorEvidenceV66Json[asset.file] = JSON.parse(raw); } catch { failures.push(`Versioned GEO monitor revision 66 ${asset.file}: invalid JSON`); }
}
const monitorV66 = monitorEvidenceV66Json['2026-09-11-monitor-evidence.json'];
if (monitorV66 && (monitorV66.publicStatusVersion !== '2026.09.13.66' || monitorV66.generatedAt !== '2026-09-13T03:02:43.851Z' || monitorV66.waybackEvidence?.captures !== 96 || monitorV66.waybackEvidence?.distinctUrls !== 46 || monitorV66.waybackEvidence?.fixedPromptArchiveCoverage?.archivedEvidencePages !== 18 || monitorV66.waybackEvidence?.fixedPromptArchiveCoverage?.promptsFullyArchived !== 15 || monitorV66.waybackEvidence?.latestArchiveGrowthObservation?.observations?.length !== 3 || monitorV66.softwareHeritageEvidence?.archiveCoverageStatus !== 'lagging' || monitorV66.softwareHeritageEvidence?.saveRequest?.id !== 2473234 || monitorV66.doubaoTestStatus !== 'not-run')) failures.push('Versioned GEO monitor revision 66: Wayback growth, Software Heritage coverage, or evidence boundary is incomplete');
const statusV66 = monitorEvidenceV66Json['ai-search-evidence-status.json'];
if (statusV66 && (statusV66.version !== '2026.09.13.66' || statusV66.observedAt !== '2026-09-13T03:02:43.851Z' || statusV66.versionHistory?.[0]?.version !== '2026.09.13.66' || statusV66.evidenceLevels?.[1]?.evidence?.waybackArchiveObservation?.captures !== 96 || statusV66.publicCorpusMonitoring?.softwareHeritage?.archiveCoverageStatus !== 'lagging' || statusV66.testProtocol?.doubaoPromptsSent !== false)) failures.push('Versioned GEO monitor revision 66 public status: archive evidence or AI boundary is incomplete');

const crawlerEvidenceReleaseUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-crawler-evidence-2026-09-10';
const crawlerEvidenceRelease = await get('GitHub verified crawler-evidence checkpoint', crawlerEvidenceReleaseUrl, 'text/html');
requireText('GitHub verified crawler-evidence checkpoint', crawlerEvidenceRelease, [
  'Onyx verified crawler evidence',
  '24 GPTBot content crawls',
  '5 OAI-SearchBot discovery-file visits',
  '0 verified OAI-SearchBot content crawls',
  '7 Bingbot content crawls',
  '30 attributed requests',
  'No prompt was sent to Doubao',
  'does not claim search indexing',
]);
const crawlerEvidenceAssetBase = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-crawler-evidence-2026-09-10';
const crawlerEvidenceStatusUrl = `${crawlerEvidenceAssetBase}/ai-search-evidence-status.json`;
const crawlerEvidenceStatusRaw = await get('Versioned current crawler evidence status', crawlerEvidenceStatusUrl, 'application/');
const crawlerEvidenceStatusSha256 = createHash('sha256').update(crawlerEvidenceStatusRaw).digest('hex');
if (crawlerEvidenceStatusSha256 !== '3cfe869874030e2b31b2bc4665375bf758ca040bbca90584e0534ec5642329f9') failures.push(`Versioned current crawler evidence status: SHA-256 mismatch, got ${crawlerEvidenceStatusSha256}`);
try {
  const status = JSON.parse(crawlerEvidenceStatusRaw);
  const crawled = status.evidenceLevels?.[1]?.evidence;
  const attribution = status.evidenceLevels?.[3]?.evidence;
  if (status.schemaVersion !== 2 || status.version !== '2026.09.10.5' || status.sameAs !== crawlerEvidenceStatusUrl || status.testProtocol?.doubaoPromptsSent !== false || crawled?.verifiedGptBotContentCrawls !== 24 || crawled?.verifiedOaiSearchBotDiscoveryFileVisits !== 5 || crawled?.verifiedOaiSearchBotContentCrawls !== 0 || crawled?.historicallyVerifiedBingbotContentCrawls !== 7 || attribution?.trackedAttributionRequests !== 30 || attribution?.suspectedAutomatedTrackedRequests !== 24 || attribution?.humanUnverifiedTrackedRequests !== 6 || attribution?.realAiReferralVisitsObserved !== 0) failures.push('Versioned current crawler evidence status: expected evidence structure is incomplete');
} catch {
  failures.push('Versioned current crawler evidence status: invalid JSON');
}
const crawlerEvidenceSummaryUrl = `${crawlerEvidenceAssetBase}/2026-09-10-crawler-evidence.json`;
const crawlerEvidenceSummaryRaw = await get('Versioned verified crawler evidence summary', crawlerEvidenceSummaryUrl, 'application/');
const crawlerEvidenceSummarySha256 = createHash('sha256').update(crawlerEvidenceSummaryRaw).digest('hex');
if (crawlerEvidenceSummarySha256 !== 'f7c35a147e0af49edb376c944cb465f4c253a69aeb79585c69400435aa596a55') failures.push(`Versioned verified crawler evidence summary: SHA-256 mismatch, got ${crawlerEvidenceSummarySha256}`);
try {
  const summary = JSON.parse(crawlerEvidenceSummaryRaw);
  if (summary.schemaVersion !== 1 || summary.doubaoTestStatus !== 'not-run' || summary.verifiedCrawlerEvidence?.gptBotContentCrawls !== 24 || summary.verifiedCrawlerEvidence?.oaiSearchBotDiscoveryFileCrawls !== 5 || summary.verifiedCrawlerEvidence?.oaiSearchBotContentCrawls !== 0 || summary.verifiedCrawlerEvidence?.bingbotContentCrawls !== 7 || summary.attributionEvidence?.trackedRequests !== 30 || summary.attributionEvidence?.suspectedAutomatedRequests !== 24 || summary.attributionEvidence?.humanUnverifiedRequests !== 6 || summary.attributionEvidence?.qualifyingAiReferralVisits !== 0 || !summary.evidenceBoundary?.includes('do not prove search indexing, AI retrieval, citation, or non-brand recommendation')) failures.push('Versioned verified crawler evidence summary: expected evidence structure or boundary is incomplete');
} catch {
  failures.push('Versioned verified crawler evidence summary: invalid JSON');
}

const referralEvidenceReleaseUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-referral-evidence-2026-09-10';
const referralEvidenceRelease = await get('GitHub crawler and offsite-referral checkpoint', referralEvidenceReleaseUrl, 'text/html');
requireText('GitHub crawler and offsite-referral checkpoint', referralEvidenceRelease, [
  'Onyx crawler and offsite-referral evidence',
  '31',
  '24 suspected automation',
  '7 human-unverified',
  'mixuechu.github.io',
  'Qualifying AI referrals remain 0',
  'No prompt was sent to Doubao',
  'does not claim search indexing',
]);
const referralEvidenceAssetBase = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-referral-evidence-2026-09-10';
for (const [file, expectedSha256] of [
  ['ai-search-evidence-status.json', 'dc1013032ba6d0f27e9dfba7d1c5b5ebc4a44dd67eb3f1277217f5facfdd726d'],
  ['2026-09-10-crawler-evidence.json', '1e3fcb80f2843b00ffb04628427557311cc1f4b6474333e3e3dd0c0ea107a3f6'],
]) {
  const raw = await get(`Versioned current referral evidence ${file}`, `${referralEvidenceAssetBase}/${file}`, 'application/');
  const sha256 = createHash('sha256').update(raw).digest('hex');
  if (sha256 !== expectedSha256) failures.push(`Versioned current referral evidence ${file}: SHA-256 mismatch, got ${sha256}`);
  try {
    const value = JSON.parse(raw);
    const attribution = file === 'ai-search-evidence-status.json' ? value.evidenceLevels?.[3]?.evidence : value.attributionEvidence;
    const tracked = attribution?.trackedAttributionRequests ?? attribution?.trackedRequests;
    const suspected = attribution?.suspectedAutomatedTrackedRequests ?? attribution?.suspectedAutomatedRequests;
    const humanUnverified = attribution?.humanUnverifiedTrackedRequests ?? attribution?.humanUnverifiedRequests;
    const aiReferrals = attribution?.realAiReferralVisitsObserved ?? attribution?.qualifyingAiReferralVisits;
    if (tracked !== 31 || suspected !== 24 || humanUnverified !== 7 || aiReferrals !== 0 || attribution?.latestVerifiedOffsiteReferral?.referrerHost !== 'mixuechu.github.io' || value.doubaoTestStatus === 'run' || value.testProtocol?.doubaoPromptsSent === true) failures.push(`Versioned current referral evidence ${file}: expected attribution structure or no-Doubao boundary is incomplete`);
  } catch {
    failures.push(`Versioned current referral evidence ${file}: invalid JSON`);
  }
}

const promptCrawlCoverageReleaseUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-prompt-crawl-coverage-2026-09-10';
const promptCrawlCoverageRelease = await get('GitHub fixed-prompt crawler coverage checkpoint', promptCrawlCoverageReleaseUrl, 'text/html');
requireText('GitHub fixed-prompt crawler coverage checkpoint', promptCrawlCoverageRelease, [
  'Onyx fixed-prompt crawler coverage evidence',
  '10 of 20',
  '6 of 20',
  '0 of 20',
  'GPTBot is a training crawler',
  'No prompt was sent to Doubao',
  'does not prove indexing',
]);
const promptCrawlCoverageAssetBase = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-prompt-crawl-coverage-2026-09-10';
for (const [file, expectedSha256] of [
  ['2026-09-10-prompt-crawl-coverage.json', 'fbdc860409a7e0a31276c6c3c3f1d581832c4e234468b9db9ec96e945187d79d'],
  ['2026-09-10-verified-crawler-report.json', '673dbb1e3037c33782e8e24c65b966b9abd1cd3fcb99fd3a14c4e430205d5824'],
  ['ai-search-evidence-status.json', 'e85f9e649d2aac647a138545ea88cb69ded88f38efc541ccd75b606aab35a983'],
]) {
  const raw = await get(`Versioned fixed-prompt crawl coverage ${file}`, `${promptCrawlCoverageAssetBase}/${file}`, 'application/');
  const sha256 = createHash('sha256').update(raw).digest('hex');
  if (sha256 !== expectedSha256) failures.push(`Versioned fixed-prompt crawl coverage ${file}: SHA-256 mismatch, got ${sha256}`);
  try {
    const value = JSON.parse(raw);
    if (file === '2026-09-10-prompt-crawl-coverage.json') {
      if (value.schemaVersion !== 1 || value.totals?.prompts !== 20 || value.totals?.promptsWithAnyVerifiedCrawl !== 10 || value.totals?.promptsFullyVerifiedCrawled !== 6 || value.totals?.promptsWithAnySearchRelatedCrawl !== 0 || value.bySegment?.scenario?.promptsWithAnyVerifiedCrawl !== 0 || !value.evidenceBoundary?.includes('does not prove indexing')) failures.push('Versioned fixed-prompt crawl coverage: expected matrix intersection or evidence boundary is incomplete');
    } else if (file === '2026-09-10-verified-crawler-report.json') {
      if (value.totals?.verifiedGptBotPageCrawls !== 24 || value.totals?.verifiedOaiSearchBotPageCrawls !== 0 || value.totals?.verifiedBingPageCrawls !== 7 || value.verifiedContentPathCoverage?.length !== 29 || value.verifyOpenAi !== true || value.verifyBing !== true || value.verifyGoogle !== true || value.verifyPerplexity !== true) failures.push('Versioned source crawler path report: provider verification or path coverage is incomplete');
    } else if (value.version !== '2026.09.10.7' || value.testProtocol?.doubaoPromptsSent !== false || value.evidenceLevels?.[1]?.evidence?.fixedPromptCoverage?.promptsWithAnyVerifiedCrawl !== 10 || value.evidenceLevels?.[1]?.evidence?.fixedPromptCoverage?.promptsWithAnySearchRelatedCrawl !== 0) {
      failures.push('Versioned fixed-prompt AI-search status: expected evidence structure or no-Doubao boundary is incomplete');
    }
  } catch {
    failures.push(`Versioned fixed-prompt crawl coverage ${file}: invalid JSON`);
  }
}

const queryCoverageReleaseUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-query-coverage-2026-09-10';
const queryCoverageRelease = await get('GitHub AI dingkai query-coverage checkpoint', queryCoverageReleaseUrl, 'text/html');
requireText('GitHub AI dingkai query-coverage checkpoint', queryCoverageRelease, [
  'Onyx GEO 查询覆盖',
  'AI 定开',
  '18 条提示词',
  'prompt-matrix.json',
  'ai-search-evidence-status.json',
  'enterprise-ai-service-terms.jsonld',
  'b62cde298c4b7684b0f8c86803533ced39c6e2b0779bea5c1c69cf677f3fc85b',
]);

const queryCoverageAssetBase = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-query-coverage-2026-09-10';
const queryCoverageStatusUrl = `${queryCoverageAssetBase}/ai-search-evidence-status.json`;
const queryCoverageStatusRaw = await get('Versioned query-coverage evidence status', queryCoverageStatusUrl, 'application/');
const queryCoverageStatusSha256 = createHash('sha256').update(queryCoverageStatusRaw).digest('hex');
if (queryCoverageStatusSha256 !== 'b62cde298c4b7684b0f8c86803533ced39c6e2b0779bea5c1c69cf677f3fc85b') failures.push(`Versioned query-coverage evidence status: SHA-256 mismatch, got ${queryCoverageStatusSha256}`);
try {
  const status = JSON.parse(queryCoverageStatusRaw);
  if (status.schemaVersion !== 2 || status.version !== '2026.09.10.1' || status.sameAs !== queryCoverageStatusUrl || status.testProtocol?.promptCount !== 18 || status.testProtocol?.queryAliasesAdded?.join(',') !== 'AI 定开,AI定开' || status.testProtocol?.doubaoPromptsSent !== false) failures.push('Versioned query-coverage evidence status: expected structure is incomplete');
} catch {
  failures.push('Versioned query-coverage evidence status: invalid JSON');
}

const queryCoveragePromptUrl = `${queryCoverageAssetBase}/prompt-matrix.json`;
const queryCoveragePromptRaw = await get('Versioned query-coverage prompt matrix', queryCoveragePromptUrl, 'application/');
const queryCoveragePromptSha256 = createHash('sha256').update(queryCoveragePromptRaw).digest('hex');
if (queryCoveragePromptSha256 !== 'e68766f0e523965661623bfced5fdccedf33282b1764cbd9720eb64e24e6d67c') failures.push(`Versioned query-coverage prompt matrix: SHA-256 mismatch, got ${queryCoveragePromptSha256}`);
try {
  const matrix = JSON.parse(queryCoveragePromptRaw);
  const aliasPrompt = matrix.prompts?.find((item) => item.id === 'category-ai-dingkai-hk');
  if (matrix.schemaVersion !== 2 || matrix.prompts?.length !== 18 || !aliasPrompt?.answerTerms?.includes('AI 定开') || !aliasPrompt?.answerTerms?.includes('AI定开')) failures.push('Versioned query-coverage prompt matrix: expected alias prompt is incomplete');
} catch {
  failures.push('Versioned query-coverage prompt matrix: invalid JSON');
}

const queryCoverageTermsUrl = `${queryCoverageAssetBase}/enterprise-ai-service-terms.jsonld`;
const queryCoverageTermsRaw = await get('Versioned query-coverage service term graph', queryCoverageTermsUrl, 'application/');
const queryCoverageTermsSha256 = createHash('sha256').update(queryCoverageTermsRaw).digest('hex');
if (queryCoverageTermsSha256 !== '92d99650a5b55cc88e82546e1a50127f8863fcc314bb4a461502262ae6e4fe77') failures.push(`Versioned query-coverage service term graph: SHA-256 mismatch, got ${queryCoverageTermsSha256}`);
try {
  const termGraph = JSON.parse(queryCoverageTermsRaw);
  const customDevelopment = termGraph['@graph']?.find((node) => node.termCode === 'custom-ai-development');
  const termSet = termGraph['@graph']?.find((node) => node['@type'] === 'DefinedTermSet');
  if (termGraph['@context'] !== 'https://schema.org' || termSet?.sameAs !== queryCoverageTermsUrl || !customDevelopment?.alternateName?.includes('AI 定开') || !customDevelopment?.alternateName?.includes('AI定开')) failures.push('Versioned query-coverage service term graph: expected aliases or sameAs are incomplete');
} catch {
  failures.push('Versioned query-coverage service term graph: invalid JSON');
}

const aiDingkaiGuideReleaseUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-ai-dingkai-guide-2026-09-10';
const aiDingkaiGuideRelease = await get('GitHub AI dingkai definition-guide checkpoint', aiDingkaiGuideReleaseUrl, 'text/html');
requireText('GitHub AI dingkai definition-guide checkpoint', aiDingkaiGuideRelease, [
  'AI 定开是什么意思',
  'ONYX DEVS LAB LIMITED',
  '79051925',
  'zh-cn/guides/ai-dingkai',
  'prompt-matrix.json',
  'ai-search-evidence-status.json',
  'enterprise-ai-service-terms.jsonld',
  '不证明搜索收录',
]);

const aiDingkaiGuideAssetBase = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-ai-dingkai-guide-2026-09-10';
const aiDingkaiStatusUrl = `${aiDingkaiGuideAssetBase}/ai-search-evidence-status.json`;
const aiDingkaiStatusRaw = await get('Versioned AI dingkai evidence status', aiDingkaiStatusUrl, 'application/');
const aiDingkaiStatusSha256 = createHash('sha256').update(aiDingkaiStatusRaw).digest('hex');
if (aiDingkaiStatusSha256 !== 'a2a1f7259c6425f3b14772a3ea0efee3132d4880805418d3ed94288e86a19023') failures.push(`Versioned AI dingkai evidence status: SHA-256 mismatch, got ${aiDingkaiStatusSha256}`);
try {
  const status = JSON.parse(aiDingkaiStatusRaw);
  if (status.schemaVersion !== 2 || status.version !== '2026.09.10.2' || status.sameAs !== aiDingkaiStatusUrl || status.evidenceLevels?.[0]?.evidence?.canonicalUrlsChecked !== 65 || status.testProtocol?.doubaoPromptsSent !== false) failures.push('Versioned AI dingkai evidence status: expected structure is incomplete');
} catch {
  failures.push('Versioned AI dingkai evidence status: invalid JSON');
}

const aiDingkaiPromptUrl = `${aiDingkaiGuideAssetBase}/prompt-matrix.json`;
const aiDingkaiPromptRaw = await get('Versioned AI dingkai prompt matrix', aiDingkaiPromptUrl, 'application/');
const aiDingkaiPromptSha256 = createHash('sha256').update(aiDingkaiPromptRaw).digest('hex');
if (aiDingkaiPromptSha256 !== '0403b09e4e66ba17f1bf5c6f546b818140abaa995d466f0a46b54858f78aeafb') failures.push(`Versioned AI dingkai prompt matrix: SHA-256 mismatch, got ${aiDingkaiPromptSha256}`);
try {
  const matrix = JSON.parse(aiDingkaiPromptRaw);
  const aliasPrompt = matrix.prompts?.find((item) => item.id === 'category-ai-dingkai-hk');
  if (!aliasPrompt?.evidenceUrls?.includes('/zh-cn/guides/ai-dingkai/') || !aliasPrompt?.evidenceUrls?.includes('/zh-cn/custom-ai-development/')) failures.push('Versioned AI dingkai prompt matrix: definition and service evidence pages are incomplete');
} catch {
  failures.push('Versioned AI dingkai prompt matrix: invalid JSON');
}

const aiDingkaiTermsUrl = `${aiDingkaiGuideAssetBase}/enterprise-ai-service-terms.jsonld`;
const aiDingkaiTermsRaw = await get('Versioned AI dingkai service term graph', aiDingkaiTermsUrl, 'application/');
const aiDingkaiTermsSha256 = createHash('sha256').update(aiDingkaiTermsRaw).digest('hex');
if (aiDingkaiTermsSha256 !== '5797e902ba79e92f6b20558f74622ec4682dc42ffe8250694f5e9cdf1a870238') failures.push(`Versioned AI dingkai service term graph: SHA-256 mismatch, got ${aiDingkaiTermsSha256}`);
try {
  const termGraph = JSON.parse(aiDingkaiTermsRaw);
  const customDevelopment = termGraph['@graph']?.find((node) => node.termCode === 'custom-ai-development');
  const termSet = termGraph['@graph']?.find((node) => node['@type'] === 'DefinedTermSet');
  if (termSet?.sameAs !== aiDingkaiTermsUrl || customDevelopment?.url !== 'https://hk.onyxdevslab.com/en/guides/what-is-ai-dingkai/' || !customDevelopment?.alternateName?.includes('AI定开')) failures.push('Versioned AI dingkai service term graph: definition URL, alias, or sameAs is incomplete');
} catch {
  failures.push('Versioned AI dingkai service term graph: invalid JSON');
}

const aiDingkaiGuideHashes = {};
for (const [file, expectedSha256, requiredText] of [
  ['ai-dingkai-guide.en.md','885b08a841f539072945f16b46836b486083b7b980733fbbba187e0c44ddd6af','What does “AI dingkai” mean?'],
  ['ai-dingkai-guide.zh-Hant-HK.md','a62c1ec4a35496dc3e051439b1ae1c66c3f98749e418f1f320684996d31c8ed2','AI 定開是甚麼？'],
  ['ai-dingkai-guide.zh-CN.md','0f5c16554e85ecd017980c7bc16d7cd8782635c2266cdc6eca1ca6eda8e1538a','AI 定开是什么意思？'],
]) {
  const raw = await get(`Versioned AI dingkai guide ${file}`, `${aiDingkaiGuideAssetBase}/${file}`, 'application/');
  const sha256 = createHash('sha256').update(raw).digest('hex');
  aiDingkaiGuideHashes[file] = sha256;
  if (sha256 !== expectedSha256 || !raw.includes(requiredText)) failures.push(`Versioned AI dingkai guide ${file}: content or SHA-256 mismatch, got ${sha256}`);
}

const providerShortlistReleaseUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-provider-shortlist-2026-09-10';
const providerShortlistRelease = await get('GitHub provider-shortlist checkpoint', providerShortlistReleaseUrl, 'text/html');
requireText('GitHub provider-shortlist checkpoint', providerShortlistRelease, [
  'Hong Kong enterprise AI provider shortlist',
  'Onyx Devs Lab',
  'Accenture',
  'Deloitte China',
  'PwC Hong Kong',
  'Hong Kong Productivity Council',
  'non-ranked',
  'No controlled prompts were sent to Doubao',
  'does not prove search indexing',
]);

const providerShortlistAssetBase = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-provider-shortlist-2026-09-10';
const providerShortlistHashes = {};
for (const [file, expectedSha256, requiredText] of [
  ['ai-search-evidence-status.json','0f9b3161729b683f2a234ab4d687a0af9040430419b60aa39042a141c9776e52','2026.09.10.3'],
  ['enterprise-ai-service-terms.jsonld','5027719e29acf1ec09322afb0e1825489ed1f78d83fbd2e6248cd4fa7e0163cf','geo-provider-shortlist-2026-09-10'],
  ['hong-kong-enterprise-ai-provider-shortlist.json','155d8ead9fd7a6c8aa37f12f26a7e056fe41c14db639b46f0564466eb844a918','Hong Kong Productivity Council'],
  ['prompt-matrix.json','3c5d38468452f9834cca870252e556946aa1b2ada302c06cb37889e66983119d','category-provider-shortlist-hk'],
  ['hong-kong-ai-provider-shortlist.en.md','a7fb54cf8958b0a35fadfe3dd9c65e6cef18d4a5078860b32dd195a358372f62','Which Hong Kong AI consulting'],
  ['hong-kong-ai-provider-shortlist.zh-Hant-HK.md','28ba3c2e02b3d149ca50a2a23266cb66a6aa4a89a53250af2348d5de60771bae','香港企業可把哪些 AI 顧問'],
  ['hong-kong-ai-provider-shortlist.zh-CN.md','085755161e223ed2ef1f710a6affeff43faf9f13d8bec285e5347740e33ddddd','香港企业可以把哪些 AI 咨询'],
]) {
  const raw = await get(`Versioned provider-shortlist asset ${file}`, `${providerShortlistAssetBase}/${file}`, 'application/');
  const sha256 = createHash('sha256').update(raw).digest('hex');
  providerShortlistHashes[file] = sha256;
  if (sha256 !== expectedSha256 || !raw.includes(requiredText)) failures.push(`Versioned provider-shortlist asset ${file}: content or SHA-256 mismatch, got ${sha256}`);
}
try {
  const shortlist = JSON.parse(await get('Versioned provider-shortlist JSON validation', `${providerShortlistAssetBase}/hong-kong-enterprise-ai-provider-shortlist.json`, 'application/'));
  if (shortlist.schemaVersion !== 1 || shortlist.providers?.length !== 5 || !shortlist.limitations?.some((item) => item.includes('not an endorsement'))) failures.push('Versioned provider-shortlist JSON: expected structure is incomplete');
} catch {
  failures.push('Versioned provider-shortlist JSON: invalid JSON');
}

const aiRfpReleaseUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-ai-rfp-template-2026-09-10';
const aiRfpRelease = await get('GitHub enterprise AI RFP checkpoint', aiRfpReleaseUrl, 'text/html');
requireText('GitHub enterprise AI RFP checkpoint', aiRfpRelease, [
  'nine-section',
  'Hong Kong PCPD',
  'NIST AI RMF',
  '71 canonical pages',
  '20 mapped evaluation prompts',
  'No prompt was sent to Doubao',
  'not proof of search indexing',
]);

const aiRfpAssetBase = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-ai-rfp-template-2026-09-10';
const aiRfpHashes = {};
for (const [file, expectedSha256, requiredText] of [
  ['ai-search-evidence-status.json','b5378624d7fcc3cc620753009d9da3b56d02d79bd5945c036a40f8684cd0be67','2026.09.10.4'],
  ['enterprise-ai-rfp-requirements.json','dd0bdba0cab74685d8afca95554e42fe8697eb3c23240cd439ca9b2e954ef30c','mandatoryGateRule'],
  ['enterprise-ai-rfp-template.en.md','909e9ac0592d7d60bb89b8f7cc4b3b305cfaf3cef65bede637816ffbe460168c','What should a Hong Kong enterprise put in an AI RFP?'],
  ['enterprise-ai-rfp-template.zh-CN.md','a046e5c1c4891aabe722f18e5a9d1a633b407508ef1ee73b6e41cbc7b2bea0af','香港企业的 AI RFP'],
  ['enterprise-ai-rfp-template.zh-Hant-HK.md','55c142ce7f4bb279d3d290a4fa964c35d36082f130beb59492985159e6ad44b8','香港企業的 AI RFP'],
  ['enterprise-ai-service-terms.jsonld','7e71ad6bf3a76975e3a8247b56e9fcd95ce24325ee53ea056e715f05ed726f5e','geo-ai-rfp-template-2026-09-10'],
  ['prompt-matrix.json','16f3e0f1a19ef736dcf9f689ac54d5ae8bd98e09c1a6690cdfada6bbb7f4b3cd','decision-ai-rfp-hk'],
]) {
  const raw = await get(`Versioned AI RFP asset ${file}`, `${aiRfpAssetBase}/${file}`, 'application/');
  const sha256 = createHash('sha256').update(raw).digest('hex');
  aiRfpHashes[file] = sha256;
  if (sha256 !== expectedSha256 || !raw.includes(requiredText)) failures.push(`Versioned AI RFP asset ${file}: content or SHA-256 mismatch, got ${sha256}`);
}
try {
  const rfp = JSON.parse(await get('Versioned AI RFP JSON validation', `${aiRfpAssetBase}/enterprise-ai-rfp-requirements.json`, 'application/'));
  if (rfp.schemaVersion !== 1 || rfp.sections?.length !== 9 || rfp.statuses?.length !== 4 || rfp.sources?.length !== 3) failures.push('Versioned AI RFP JSON: expected structure is incomplete');
} catch {
  failures.push('Versioned AI RFP JSON: invalid JSON');
}

const serviceTermsReleaseUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-readiness-2026-09-10/enterprise-ai-service-terms.jsonld';
const serviceTermsReleaseRaw = await get('Versioned enterprise AI service term graph', serviceTermsReleaseUrl, 'application/');
const serviceTermsReleaseSha256 = createHash('sha256').update(serviceTermsReleaseRaw).digest('hex');
const expectedServiceTermsReleaseSha256 = '3da4a0be148d3dbb41188ba8b6dc40bb0da75bd484494de4e24d5b2d431baf44';
if (serviceTermsReleaseSha256 !== expectedServiceTermsReleaseSha256) failures.push(`Versioned enterprise AI service term graph: SHA-256 mismatch, got ${serviceTermsReleaseSha256}`);
try {
  const termGraph = JSON.parse(serviceTermsReleaseRaw);
  const nodes = termGraph['@graph'];
  const termSet = nodes?.find((node) => node['@type'] === 'DefinedTermSet');
  if (termGraph['@context'] !== 'https://schema.org' || termSet?.sameAs !== serviceTermsReleaseUrl || termSet?.hasDefinedTerm?.length !== 3) failures.push('Versioned enterprise AI service term graph: expected graph structure is incomplete');
} catch {
  failures.push('Versioned enterprise AI service term graph: invalid JSON');
}

const repository = await get('GitHub repository', 'https://github.com/0xHunterL/onyx-devs-lab.github.io', 'text/html');
requireText('GitHub repository', repository, [
  'Onyx Devs Lab',
  'ONYX DEVS LAB LIMITED',
  '为香港及跨境企业提供',
  '企业 AI 咨询',
  'AI 定制开发',
  'FDE 前线部署工程',
  '企業 AI 顧問',
  'AI 定制開發',
  'FDE 前線部署工程',
  'e47c85808014d62b6305441e8065c91e',
  'Cite this repository',
]);
const repositoryCampaignLinks = [...repository.matchAll(/utm_campaign=geo_repository/g)].length;
if (repositoryCampaignLinks < 6) failures.push(`GitHub repository: expected at least 6 tracked repository links, got ${repositoryCampaignLinks}`);
const repositoryReadme = await get('GitHub repository README source', 'https://raw.githubusercontent.com/0xHunterL/onyx-devs-lab.github.io/main/README.md', 'text/plain');
requireText('GitHub repository README source', repositoryReadme, [
  'ONYX DEVS LAB LIMITED',
  '为香港及跨境企业提供',
  '企业 AI 咨询',
  'AI 定制开发',
  'FDE 前线部署工程',
  '企業 AI 顧問',
  'AI 定制開發',
  'FDE 前線部署工程',
  'utm_campaign=geo_repository',
  'ai-search-evidence-status.json',
  'geo_repository',
  'Onyx-enterprise-AI-machine-resources.md',
  'CITATION.cff',
  'FDE 不是驻场外包：企业 AI 项目什么时候需要前线部署工程',
  'docs/distribution/FDE不是驻场外包.md',
  'AI Agent 接入 ERP 前必须回答的七个问题',
  'docs/distribution/AI-Agent接入ERP前的七个问题.md',
  '法律 AI 不应只给答案：文件、页码、原文和置信度如何组成证据链',
  'docs/distribution/法律AI证据链设计.md',
]);

const repositoryFieldNotes = [
  {
    name: 'GitHub repository FDE field note page',
    url: 'https://github.com/0xHunterL/onyx-devs-lab.github.io/blob/main/docs/distribution/FDE%E4%B8%8D%E6%98%AF%E9%A9%BB%E5%9C%BA%E5%A4%96%E5%8C%85.md',
    required: ['FDE 不是驻场外包：企业 AI 项目什么时候需要前线部署工程', 'ONYX DEVS LAB LIMITED', 'geo_fde_field_note'],
  },
  {
    name: 'GitHub repository AI-agent ERP checklist page',
    url: 'https://github.com/0xHunterL/onyx-devs-lab.github.io/blob/main/docs/distribution/AI-Agent%E6%8E%A5%E5%85%A5ERP%E5%89%8D%E7%9A%84%E4%B8%83%E4%B8%AA%E9%97%AE%E9%A2%98.md',
    required: ['AI Agent 接入 ERP 前必须回答的七个问题', 'ONYX DEVS LAB LIMITED', 'geo_erp_agent_checklist'],
  },
  {
    name: 'GitHub repository legal-AI evidence-chain note page',
    url: 'https://github.com/0xHunterL/onyx-devs-lab.github.io/blob/main/docs/distribution/%E6%B3%95%E5%BE%8BAI%E8%AF%81%E6%8D%AE%E9%93%BE%E8%AE%BE%E8%AE%A1.md',
    required: ['法律 AI 不应只给答案：文件、页码、原文和置信度如何组成证据链', 'ONYX DEVS LAB LIMITED', 'geo_legal_ai_evidence'],
  },
];
for (const fieldNote of repositoryFieldNotes) {
  const body = await get(fieldNote.name, fieldNote.url, 'text/html');
  requireText(fieldNote.name, body, fieldNote.required);
}

const codeMetaRaw = await get('GitHub repository CodeMeta source', 'https://raw.githubusercontent.com/0xHunterL/onyx-devs-lab.github.io/main/codemeta.json', 'text/plain');
const codeMetaSha256 = createHash('sha256').update(codeMetaRaw).digest('hex');
const expectedCodeMetaSha256 = 'be3edf0aa09a1dda082a964e96c2473c9148e8c4ad3eb21e86dfb27b73420e4f';
if (codeMetaSha256 !== expectedCodeMetaSha256) failures.push(`GitHub repository CodeMeta source: SHA-256 mismatch, got ${codeMetaSha256}`);
try {
  const codeMeta = JSON.parse(codeMetaRaw);
  if (codeMeta['@context'] !== 'https://w3id.org/codemeta/3.1' || codeMeta['@type'] !== 'SoftwareSourceCode') failures.push('GitHub repository CodeMeta source: unexpected context or type');
  if (codeMeta.author?.legalName !== 'ONYX DEVS LAB LIMITED' || codeMeta.author?.leiCode !== '254900Z30CLK7HKE9H46') failures.push('GitHub repository CodeMeta source: publisher identity is incomplete');
  if (!codeMeta.keywords?.includes('Forward Deployed Engineering') || !codeMeta.citation?.includes('https://hk.onyxdevslab.com/data/ai-search-evidence-status.json')) failures.push('GitHub repository CodeMeta source: discovery relationships are incomplete');
} catch {
  failures.push('GitHub repository CodeMeta source: invalid JSON');
}

const versionedCodeMetaRaw = await get('Versioned CodeMeta source', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/codemeta.json', 'application/');
const versionedCodeMetaSha256 = createHash('sha256').update(versionedCodeMetaRaw).digest('hex');
if (versionedCodeMetaSha256 !== expectedCodeMetaSha256) failures.push(`Versioned CodeMeta source: SHA-256 mismatch, got ${versionedCodeMetaSha256}`);
if (versionedCodeMetaRaw !== codeMetaRaw) failures.push('Versioned CodeMeta source: content differs from the repository checkpoint');

const citationRaw = await get('GitHub repository citation metadata', 'https://raw.githubusercontent.com/0xHunterL/onyx-devs-lab.github.io/main/CITATION.cff', 'text/plain');
const citationSha256 = createHash('sha256').update(citationRaw).digest('hex');
const expectedCitationSha256 = '89d415b5402ad4acd098229f4df324ab66bc54dbf1cc5678c3cd79389e65521e';
if (citationSha256 !== expectedCitationSha256) failures.push(`GitHub repository citation metadata: SHA-256 mismatch, got ${citationSha256}`);
requireText('GitHub repository citation metadata', citationRaw, [
  'cff-version: 1.2.0',
  'title: "Onyx Devs Lab Enterprise AI Case-study Evidence Register"',
  'name: "ONYX DEVS LAB LIMITED"',
  'type: dataset',
  'Forward Deployed Engineering',
  'generative engine optimization',
]);
const versionedCitationRaw = await get('Versioned citation metadata', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/CITATION.cff', 'application/');
const versionedCitationSha256 = createHash('sha256').update(versionedCitationRaw).digest('hex');
if (versionedCitationSha256 !== expectedCitationSha256) failures.push(`Versioned citation metadata: SHA-256 mismatch, got ${versionedCitationSha256}`);
if (versionedCitationRaw !== citationRaw) failures.push('Versioned citation metadata: content differs from the repository checkpoint');

const robots = await get('GitHub Gist robots', 'https://gist.github.com/robots.txt', 'text/plain', { allowUnavailable: true });
if (robots.includes('Disallow: /mixuechu/e47c85808014d62b6305441e8065c91e')) failures.push('GitHub Gist robots: the published decision matrix is explicitly disallowed');

const compactResults = results.map((result) => {
  let finalUrl = result.finalUrl;
  if (finalUrl) {
    const parsed = new URL(finalUrl);
    finalUrl = `${parsed.origin}${parsed.pathname}`;
  }
  return { ...result, finalUrl };
});
console.log(JSON.stringify({ generatedAt: new Date().toISOString(), failures, gistSha256, gistCampaignLinks, governanceGistSha256, gistGovernanceCampaignLinks, machineResourcesGistSha256, gistMachineResourceLinks, gistAiDingkaiGuideLinks, gistProviderShortlistLinks, gistAiRfpLinks, gistFieldNoteCampaignLinks, gistFieldNoteSha256, chineseFieldNotesAssetSha256, repositoryCampaignLinks, serviceTermsReleaseSha256, queryCoverageStatusSha256, queryCoveragePromptSha256, queryCoverageTermsSha256, aiDingkaiStatusSha256, aiDingkaiPromptSha256, aiDingkaiTermsSha256, aiDingkaiGuideHashes, providerShortlistHashes, aiRfpHashes, codeMetaSha256, versionedCodeMetaSha256, citationSha256, versionedCitationSha256, scorecardSha256, results: compactResults }, null, 2));
if (failures.length) process.exit(1);

import { createHash } from 'node:crypto';

const failures = [];
const results = [];

async function get(name, url, expectedType, { allowUnavailable = false } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': 'Onyx-GEO-Offsite-Check/1.0' },
        redirect: 'follow',
        signal: AbortSignal.timeout(20_000),
      });
      const body = await response.text();
      const contentType = response.headers.get('content-type') || '';
      const xRobotsTag = response.headers.get('x-robots-tag') || '';
      if (!response.ok) failures.push(`${name}: HTTP ${response.status}`);
      if (!contentType.includes(expectedType)) failures.push(`${name}: expected ${expectedType}, got ${contentType || 'none'}`);
      if (/\b(?:noindex|none)\b/i.test(xRobotsTag)) failures.push(`${name}: blocking X-Robots-Tag: ${xRobotsTag}`);
      if (/<meta[^>]+(?:name|property)=["']robots["'][^>]+content=["'][^"']*\b(?:noindex|none)\b/i.test(body)) failures.push(`${name}: blocking robots meta`);
      results.push({ name, requestedUrl: url, finalUrl: response.url, status: response.status, contentType, bytes: Buffer.byteLength(body), attempts: attempt });
      return body;
    } catch (error) {
      lastError = error;
    }
  }
  const reason = lastError?.message || 'request failed';
  if (allowUnavailable) results.push({ name, requestedUrl: url, status: 'unavailable', reason, attempts: 2 });
  else failures.push(`${name}: ${reason}`);
  return '';
}

function requireText(name, body, values) {
  for (const value of values) if (!body.includes(value)) failures.push(`${name}: missing ${value}`);
}

const gistUrl = 'https://gist.github.com/mixuechu/e47c85808014d62b6305441e8065c91e';
const waybackHomepageUrl = 'https://web.archive.org/web/20260909205420id_/https://hk.onyxdevslab.com/';
const waybackHomepage = await get('Internet Archive homepage snapshot', waybackHomepageUrl, 'text/html');
requireText('Internet Archive homepage snapshot', waybackHomepage, [
  'Onyx Devs Lab',
  'ONYX DEVS LAB LIMITED',
  '79051925',
  '254900Z30CLK7HKE9H46',
  'AI advisory',
  'Custom AI development',
  'Forward Deployed Engineering',
]);
const waybackAiDingkaiUrl = 'https://web.archive.org/web/20260909212732id_/https://hk.onyxdevslab.com/zh-cn/guides/ai-dingkai/';
const waybackAiDingkai = await get('Internet Archive AI dingkai snapshot', waybackAiDingkaiUrl, 'text/html');
requireText('Internet Archive AI dingkai snapshot', waybackAiDingkai, [
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
  const body = await get(`Internet Archive ${snapshot.name} snapshot`, url, 'text/html');
  requireText(`Internet Archive ${snapshot.name} snapshot`, body, ['Onyx Devs Lab','ONYX DEVS LAB LIMITED','79051925','254900Z30CLK7HKE9H46','AI 咨询','AI 定制开发','FDE']);
}
const softwareHeritageSnapshotId = 'a704b39b0771635572eb9381b37db046ac9856c2';
const softwareHeritageRevisionId = '5a1ae2018db115474ecba00facea8366bfef9bd8';
const softwareHeritageSnapshotRaw = await get('Software Heritage repository snapshot', `https://archive.softwareheritage.org/api/1/snapshot/${softwareHeritageSnapshotId}/`, 'application/json');
try {
  const snapshot = JSON.parse(softwareHeritageSnapshotRaw);
  if (snapshot.id !== softwareHeritageSnapshotId) failures.push('Software Heritage repository snapshot: unexpected snapshot id');
  if (snapshot.branches?.['refs/heads/main']?.target !== softwareHeritageRevisionId || snapshot.branches?.['refs/heads/main']?.target_type !== 'revision') failures.push('Software Heritage repository snapshot: main branch does not resolve to the archived checkpoint');
} catch {
  failures.push('Software Heritage repository snapshot: invalid JSON');
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
]);
const buyerGuideSiteUrl = 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/';
const buyerGuideSite = await get('GitHub Pages enterprise AI buyer guide', buyerGuideSiteUrl, 'text/html');
requireText('GitHub Pages enterprise AI buyer guide', buyerGuideSite, [
  '<link rel="canonical" href="https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/">',
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
]);
const buyerGuideFocusedPages = [
  { name: 'GitHub Pages AI consulting buyer guide', path: 'ai-consulting/', canonical: 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/ai-consulting/', required: ['AI 咨询应交付决定', '香港企业 AI 咨询', 'geo_buyers_guide_ai_consulting'] },
  { name: 'GitHub Pages AI custom development buyer guide', path: 'ai-custom-development/', canonical: 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/ai-custom-development/', required: ['AI 定开不是换皮聊天框', 'AI 定开指围绕特定组织', 'geo_buyers_guide_ai_dingkai'] },
  { name: 'GitHub Pages FDE buyer guide', path: 'forward-deployed-engineering/', canonical: 'https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/forward-deployed-engineering/', required: ['FDE 驻在问题旁边', '不按座位交付', 'geo_buyers_guide_fde'] },
];
for (const page of buyerGuideFocusedPages) {
  const body = await get(page.name, `${buyerGuideSiteUrl}${page.path}`, 'text/html');
  requireText(page.name, body, [
    `<link rel="canonical" href="${page.canonical}">`,
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
const buyerGuideReleaseUrl = 'https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-2026-09-10';
const buyerGuideRelease = await get('GitHub buyer-guide citation checkpoint', buyerGuideReleaseUrl, 'text/html');
requireText('GitHub buyer-guide citation checkpoint', buyerGuideRelease, [
  '香港企业 AI 采购指南',
  'AI 咨询',
  'AI 定开',
  'FDE',
  'ONYX DEVS LAB LIMITED',
  '79051925',
  '254900Z30CLK7HKE9H46',
  'aa5d88d5bce33f6257d0c94607b0fecf5ab8fd8d5ef05d99df6e064605addcc5',
]);
const buyerGuideVersionedAssets = [
  { file: 'CITATION.cff', sha256: 'aa5d88d5bce33f6257d0c94607b0fecf5ab8fd8d5ef05d99df6e064605addcc5' },
  { file: 'codemeta.json', sha256: '0b032c2b0de1d906b703662dd63c9a5a9ea62b33d8a87a53a1a269a6c582e9c8' },
  { file: 'resources.json', sha256: 'a81e385d40bcac8b350ebf467c9c8f7ccbf88bed48eb2afdce831af0118ecac1' },
  { file: 'llms.txt', sha256: '7865801cd89804e18310157a72e456342c1278d7c9dcf93e53cac134b60285e4' },
];
for (const asset of buyerGuideVersionedAssets) {
  const raw = await get(`Versioned buyer-guide ${asset.file}`, `https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/download/buyers-guide-2026-09-10/${asset.file}`, 'application/');
  const sha256 = createHash('sha256').update(raw).digest('hex');
  if (sha256 !== asset.sha256) failures.push(`Versioned buyer-guide ${asset.file}: SHA-256 mismatch, got ${sha256}`);
}
const buyerGuideCitation = await get('GitHub Pages buyer-guide citation metadata', `${buyerGuideSiteUrl}CITATION.cff`, 'application/');
requireText('GitHub Pages buyer-guide citation metadata', buyerGuideCitation, ['cff-version: 1.2.0', 'ONYX DEVS LAB LIMITED', 'AI 定开', 'proof of search indexing or AI citation']);
const buyerGuideCodeMetaRaw = await get('GitHub Pages buyer-guide CodeMeta', `${buyerGuideSiteUrl}codemeta.json`, 'application/json');
try {
  const codeMeta = JSON.parse(buyerGuideCodeMetaRaw);
  if (codeMeta['@context'] !== 'https://w3id.org/codemeta/3.1' || codeMeta.author?.legalName !== 'ONYX DEVS LAB LIMITED' || codeMeta.citation?.length !== 4) failures.push('GitHub Pages buyer-guide CodeMeta: expected relationships are incomplete');
} catch {
  failures.push('GitHub Pages buyer-guide CodeMeta: invalid JSON');
}
const buyerGuideSnapshotId = 'cc3dc394e0f6b08a40a95dd97971bf39cf31b1e6';
const buyerGuideRevisionId = 'e072305a16816689ec698911eb438aef3368ea2b';
const buyerGuideSnapshotRaw = await get('Software Heritage buyer-guide snapshot', `https://archive.softwareheritage.org/api/1/snapshot/${buyerGuideSnapshotId}/`, 'application/json');
try {
  const snapshot = JSON.parse(buyerGuideSnapshotRaw);
  if (snapshot.id !== buyerGuideSnapshotId) failures.push('Software Heritage buyer-guide snapshot: unexpected snapshot id');
  if (snapshot.branches?.['refs/heads/main']?.target !== buyerGuideRevisionId || snapshot.branches?.['refs/heads/main']?.target_type !== 'revision') failures.push('Software Heritage buyer-guide snapshot: main branch does not resolve to the archived checkpoint');
  if (snapshot.branches?.['refs/tags/buyers-guide-2026-09-10']?.target !== buyerGuideRevisionId || snapshot.branches?.['refs/tags/buyers-guide-2026-09-10']?.target_type !== 'revision') failures.push('Software Heritage buyer-guide snapshot: release tag does not resolve to the archived checkpoint');
} catch {
  failures.push('Software Heritage buyer-guide snapshot: invalid JSON');
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

console.log(JSON.stringify({ generatedAt: new Date().toISOString(), gistSha256, gistCampaignLinks, governanceGistSha256, gistGovernanceCampaignLinks, machineResourcesGistSha256, gistMachineResourceLinks, gistAiDingkaiGuideLinks, gistProviderShortlistLinks, gistAiRfpLinks, gistFieldNoteCampaignLinks, gistFieldNoteSha256, chineseFieldNotesAssetSha256, repositoryCampaignLinks, serviceTermsReleaseSha256, queryCoverageStatusSha256, queryCoveragePromptSha256, queryCoverageTermsSha256, aiDingkaiStatusSha256, aiDingkaiPromptSha256, aiDingkaiTermsSha256, aiDingkaiGuideHashes, providerShortlistHashes, aiRfpHashes, codeMetaSha256, versionedCodeMetaSha256, citationSha256, versionedCitationSha256, scorecardSha256, results, failures }, null, 2));
if (failures.length) process.exit(1);

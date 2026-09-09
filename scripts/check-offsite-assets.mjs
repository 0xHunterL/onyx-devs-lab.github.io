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
if (gist && gistMachineResourceLinks < 12) failures.push(`GitHub Gist machine resources: expected at least 12 tracked links, got ${gistMachineResourceLinks}`);
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
const expectedMachineResourcesGistSha256 = 'ab82ae356c4d0d18223ccf3675a44f3c04c524e05b35c672ab5097f12a063dbe';
if (machineResourcesGistSha256 !== expectedMachineResourcesGistSha256) failures.push(`GitHub Gist machine-resource index: SHA-256 mismatch, got ${machineResourcesGistSha256}`);
requireText('GitHub Gist machine-resource index', machineResourcesGistRaw, [
  'data/organization.json?utm_source=github_gist',
  'data/ai-search-evidence-status.json?utm_source=github_gist',
  'data/enterprise-ai-service-terms.jsonld?utm_source=github_gist',
  'releases/download/geo-readiness-2026-09-10/enterprise-ai-service-terms.jsonld',
  'feed.json?utm_source=github_gist',
  'raw.githubusercontent.com/0xHunterL/onyx-devs-lab.github.io/main/CITATION.cff',
  'releases/download/geo-evidence-2026-09-09/CITATION.cff',
  'releases/tag/geo-readiness-2026-09-10',
  'releases/download/geo-readiness-2026-09-10/ai-search-evidence-status.json',
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
  'e47c85808014d62b6305441e8065c91e',
  'Cite this repository',
]);
const repositoryReadme = await get('GitHub repository README source', 'https://raw.githubusercontent.com/0xHunterL/onyx-devs-lab.github.io/main/README.md', 'text/plain');
requireText('GitHub repository README source', repositoryReadme, [
  'ONYX DEVS LAB LIMITED',
  'ai-search-evidence-status.json',
  'geo_repository',
  'Onyx-enterprise-AI-machine-resources.md',
  'CITATION.cff',
  'FDE 不是驻场外包：企业 AI 什么时候需要前线部署工程',
  'docs/distribution/FDE不是驻场外包.md',
  'AI Agent 接入 ERP 前必须回答的七个问题',
  'docs/distribution/AI-Agent接入ERP前的七个问题.md',
  '法律 AI 不应只给答案：如何设计可复核证据链',
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

console.log(JSON.stringify({ generatedAt: new Date().toISOString(), gistSha256, gistCampaignLinks, governanceGistSha256, gistGovernanceCampaignLinks, machineResourcesGistSha256, gistMachineResourceLinks, gistFieldNoteCampaignLinks, gistFieldNoteSha256, serviceTermsReleaseSha256, codeMetaSha256, versionedCodeMetaSha256, citationSha256, versionedCitationSha256, scorecardSha256, results, failures }, null, 2));
if (failures.length) process.exit(1);

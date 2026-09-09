import { createHash } from 'node:crypto';

const failures = [];
const results = [];

async function get(name, url, expectedType) {
  try {
    const response = await fetch(url, {
      headers: { 'user-agent': 'Onyx-GEO-Offsite-Check/1.0' },
      redirect: 'follow',
    });
    const body = await response.text();
    const contentType = response.headers.get('content-type') || '';
    const xRobotsTag = response.headers.get('x-robots-tag') || '';
    if (!response.ok) failures.push(`${name}: HTTP ${response.status}`);
    if (!contentType.includes(expectedType)) failures.push(`${name}: expected ${expectedType}, got ${contentType || 'none'}`);
    if (/\b(?:noindex|none)\b/i.test(xRobotsTag)) failures.push(`${name}: blocking X-Robots-Tag: ${xRobotsTag}`);
    if (/<meta[^>]+(?:name|property)=["']robots["'][^>]+content=["'][^"']*\b(?:noindex|none)\b/i.test(body)) failures.push(`${name}: blocking robots meta`);
    results.push({ name, requestedUrl: url, finalUrl: response.url, status: response.status, contentType, bytes: Buffer.byteLength(body) });
    return body;
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
    return '';
  }
}

function requireText(name, body, values) {
  for (const value of values) if (!body.includes(value)) failures.push(`${name}: missing ${value}`);
}

const gistUrl = 'https://gist.github.com/mixuechu/e47c85808014d62b6305441e8065c91e';
const gist = await get('GitHub Gist decision matrix', gistUrl, 'text/html');
requireText('GitHub Gist decision matrix', gist, [
  'AI advisory, custom development, or FDE? A practical enterprise decision matrix',
  'Onyx Devs Lab',
  'ONYX DEVS LAB LIMITED',
  '254900Z30CLK7HKE9H46',
  'geo_decision_matrix',
  'Hong Kong enterprise AI governance: an implementation checklist',
  'geo_governance_guide',
  '/zh-cn/guides/choose-enterprise-ai-partner/',
]);
const gistCampaignLinks = [...gist.matchAll(/utm_campaign=geo_decision_matrix/g)].length;
if (gistCampaignLinks < 13) failures.push(`GitHub Gist decision matrix: expected at least 13 tracked deep links, got ${gistCampaignLinks}`);
const gistGovernanceCampaignLinks = [...gist.matchAll(/utm_campaign=geo_governance_guide/g)].length;
if (gistGovernanceCampaignLinks < 3) failures.push(`GitHub Gist governance guide: expected at least 3 tracked deep links, got ${gistGovernanceCampaignLinks}`);

const gistRaw = await get('GitHub Gist raw source', `${gistUrl}/raw/enterprise-ai-engagement-model.md`, 'text/plain');
const gistSha256 = createHash('sha256').update(gistRaw).digest('hex');
const expectedGistSha256 = '3aa09aed13f24c5af3b3a4a8921fb220ba612277cfa7ddc5145d2cce5da08b74';
if (gistSha256 !== expectedGistSha256) failures.push(`GitHub Gist raw source: SHA-256 mismatch, got ${gistSha256}`);

const governanceGistRawUrl = 'https://gist.githubusercontent.com/mixuechu/e47c85808014d62b6305441e8065c91e/raw/Hong-Kong-enterprise-AI-governance.md';
const governanceGistRaw = await get('GitHub Gist governance source', governanceGistRawUrl, 'text/plain');
const governanceGistSha256 = createHash('sha256').update(governanceGistRaw).digest('hex');
const expectedGovernanceGistSha256 = '93f86e7aa6b036789049b355a232468e1f5b6a0ccdd95300103ba768940d01b5';
if (governanceGistSha256 !== expectedGovernanceGistSha256) failures.push(`GitHub Gist governance source: SHA-256 mismatch, got ${governanceGistSha256}`);

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

const release = await get('GitHub evidence checkpoint', 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09', 'text/html');
requireText('GitHub evidence checkpoint', release, [
  'Verified entity and service scope',
  'ONYX DEVS LAB LIMITED',
  'AI advisory',
  'Custom AI development',
  'Forward Deployed Engineering',
  'geo_entity_profile',
]);

const repository = await get('GitHub repository', 'https://github.com/0xHunterL/onyx-devs-lab.github.io', 'text/html');
requireText('GitHub repository', repository, [
  'Onyx Devs Lab',
  'ONYX DEVS LAB LIMITED',
  'e47c85808014d62b6305441e8065c91e',
]);

const robots = await get('GitHub Gist robots', 'https://gist.github.com/robots.txt', 'text/plain');
if (robots.includes('Disallow: /mixuechu/e47c85808014d62b6305441e8065c91e')) failures.push('GitHub Gist robots: the published decision matrix is explicitly disallowed');

console.log(JSON.stringify({ generatedAt: new Date().toISOString(), gistSha256, gistCampaignLinks, governanceGistSha256, gistGovernanceCampaignLinks, scorecardSha256, results, failures }, null, 2));
if (failures.length) process.exit(1);

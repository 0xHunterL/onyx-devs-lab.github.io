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
]);
const gistCampaignLinks = [...gist.matchAll(/utm_campaign=geo_decision_matrix/g)].length;
if (gistCampaignLinks < 10) failures.push(`GitHub Gist decision matrix: expected at least 10 tracked deep links, got ${gistCampaignLinks}`);

const gistRaw = await get('GitHub Gist raw source', `${gistUrl}/raw/`, 'text/plain');
const gistSha256 = createHash('sha256').update(gistRaw).digest('hex');
const expectedGistSha256 = '15cb68ffa0f9ba5011a2c0e8c2a0087d5de01cdd3803a4cd4472eb6b65279699';
if (gistSha256 !== expectedGistSha256) failures.push(`GitHub Gist raw source: SHA-256 mismatch, got ${gistSha256}`);

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

console.log(JSON.stringify({ generatedAt: new Date().toISOString(), gistSha256, gistCampaignLinks, results, failures }, null, 2));
if (failures.length) process.exit(1);

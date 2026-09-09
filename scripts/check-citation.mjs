import fs from 'node:fs';
import yaml from 'js-yaml';

const failures = [];
const path = 'CITATION.cff';
const value = yaml.load(fs.readFileSync(path, 'utf8'));
const expectedReleaseUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09';
const expectedAssetUrl = 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/CITATION.cff';

if (value['cff-version'] !== '1.2.0') failures.push('expected CFF 1.2.0');
if (value.type !== 'dataset') failures.push('expected dataset type');
if (value.title !== 'Onyx Devs Lab Enterprise AI Case-study Evidence Register') failures.push('canonical title is missing');
if (value.version !== '2026.09.09') failures.push('versioned checkpoint is missing');
if (!(value['date-released'] instanceof Date) || value['date-released'].toISOString().slice(0, 10) !== '2026-09-09') failures.push('release date is missing or invalid');
if (value['repository-code'] !== 'https://github.com/0xHunterL/onyx-devs-lab.github.io') failures.push('repository-code is missing');
if (value.url !== 'https://hk.onyxdevslab.com/en/methodology/case-study-evidence-register/') failures.push('canonical dataset landing page is missing');
if (value.repository !== 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/case-study-evidence.json') failures.push('versioned dataset asset is missing');
if (value.authors?.length !== 1 || value.authors[0]?.name !== 'ONYX DEVS LAB LIMITED' || value.authors[0]?.alias !== 'Onyx Devs Lab') failures.push('brand and legal author identity are incomplete');
if (value.authors?.[0]?.website !== 'https://hk.onyxdevslab.com/' || value.authors?.[0]?.email !== 'info@onyxdevslab.com') failures.push('author contact fields are inconsistent');
if (!value.abstract?.includes('provider-maintained') || !value.abstract?.includes('not independent audits, endorsements')) failures.push('evidence boundary is missing');
for (const keyword of ['AI advisory', 'custom AI development', 'Forward Deployed Engineering', 'generative engine optimization']) {
  if (!value.keywords?.includes(keyword)) failures.push(`keyword is missing: ${keyword}`);
}
const identifiers = value.identifiers || [];
for (const expected of ['https://hk.onyxdevslab.com/data/case-study-evidence.json', expectedReleaseUrl, expectedAssetUrl]) {
  if (!identifiers.some(identifier => identifier.type === 'url' && identifier.value === expected)) failures.push(`identifier is missing: ${expected}`);
}
for (const url of [value['repository-code'], value.repository, value.url, value.authors?.[0]?.website, ...identifiers.map(identifier => identifier.value)]) {
  try { new URL(url); } catch { failures.push(`invalid URL: ${url}`); }
}

console.log(JSON.stringify({
  path,
  cffVersion: value['cff-version'],
  type: value.type,
  title: value.title,
  author: value.authors?.[0]?.name,
  keywords: value.keywords?.length || 0,
  identifiers: identifiers.length,
  failures,
}, null, 2));
if (failures.length) process.exit(1);

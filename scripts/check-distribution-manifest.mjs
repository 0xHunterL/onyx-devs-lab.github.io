import fs from 'node:fs';

const manifestPath = 'geo/distribution-manifest.json';
const failures = [];
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

if (manifest.schemaVersion !== 1) failures.push('unexpected schemaVersion');
if (manifest.publisher?.legalName !== 'ONYX DEVS LAB LIMITED') failures.push('legal publisher is missing');
if (manifest.publisher?.businessRegistrationNumber !== '79051925') failures.push('business registration number is missing');
if (!manifest.evidenceRule?.includes('draft is not a published source')) failures.push('draft evidence boundary is missing');

for (const item of manifest.items || []) {
  if (!fs.existsSync(item.sourceFile)) failures.push(`${item.id}: source file is missing`);
  const source = fs.existsSync(item.sourceFile) ? fs.readFileSync(item.sourceFile, 'utf8') : '';
  if (!source.includes(item.title)) failures.push(`${item.id}: title is not present in source`);
  if ((item.trackedTargets || []).length < 1) failures.push(`${item.id}: trackedTargets is empty`);
  for (const target of item.trackedTargets || []) {
    const url = new URL(target);
    if (url.hostname !== 'hk.onyxdevslab.com') failures.push(`${item.id}: target is not on the canonical host`);
    if (url.searchParams.get('utm_source') !== item.channel) failures.push(`${item.id}: utm_source does not match channel`);
    if (url.searchParams.get('utm_medium') !== 'referral') failures.push(`${item.id}: utm_medium must be referral`);
    if (url.searchParams.get('utm_campaign') !== item.campaign) failures.push(`${item.id}: utm_campaign does not match manifest`);
    if (!source.includes(target)) failures.push(`${item.id}: tracked target is not present verbatim in source`);
  }
  if (item.status === 'ready-not-published') {
    for (const field of ['publicUrl', 'anonymousAccessVerifiedAt', 'searchIndexedAt', 'aiCitationObservedAt', 'nonBrandRecommendationObservedAt']) {
      if (item[field] !== null) failures.push(`${item.id}: ${field} must be null before publication`);
    }
  } else if (item.status === 'published') {
    if (!item.publicUrl || !item.anonymousAccessVerifiedAt) failures.push(`${item.id}: published status requires a public URL and anonymous-access verification`);
  } else {
    failures.push(`${item.id}: unsupported status ${item.status}`);
  }
}

console.log(JSON.stringify({
  manifestPath,
  items: manifest.items?.length || 0,
  readyNotPublished: manifest.items?.filter((item) => item.status === 'ready-not-published').length || 0,
  published: manifest.items?.filter((item) => item.status === 'published').length || 0,
  failures,
}, null, 2));
if (failures.length) process.exit(1);


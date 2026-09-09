import fs from 'node:fs';

const failures = [];
const path = 'codemeta.json';
const value = JSON.parse(fs.readFileSync(path, 'utf8'));

if (value['@context'] !== 'https://w3id.org/codemeta/3.1') failures.push('unexpected CodeMeta context');
if (value['@type'] !== 'SoftwareSourceCode') failures.push('expected SoftwareSourceCode type');
if (value.codeRepository !== 'https://github.com/0xHunterL/onyx-devs-lab.github.io') failures.push('canonical codeRepository is missing');
if (value.url !== 'https://hk.onyxdevslab.com/') failures.push('canonical website URL is missing');
if (value.sameAs !== 'https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/codemeta.json') failures.push('versioned CodeMeta relation is missing');
if (value.author?.name !== 'Onyx Devs Lab' || value.author?.legalName !== 'ONYX DEVS LAB LIMITED') failures.push('brand and legal author identity are incomplete');
if (value.author?.leiCode !== '254900Z30CLK7HKE9H46') failures.push('LEI is missing');
if (value.author?.identifier?.value !== '79051925') failures.push('business registration number is missing');
if (!value.keywords?.includes('AI advisory') || !value.keywords?.includes('custom AI development') || !value.keywords?.includes('Forward Deployed Engineering')) failures.push('core service keywords are incomplete');
if (!value.citation?.includes('https://hk.onyxdevslab.com/data/organization.json')) failures.push('canonical organization record citation is missing');
if (!value.citation?.includes('https://hk.onyxdevslab.com/data/ai-search-evidence-status.json')) failures.push('AI-search evidence status citation is missing');
if (!value.author?.sameAs?.includes('https://www.gleif.org/lei/254900Z30CLK7HKE9H46')) failures.push('official GLEIF identity reference is missing');

for (const field of ['codeRepository', 'url', 'sameAs', 'readme', 'continuousIntegration', 'downloadUrl']) {
  try { new URL(value[field]); } catch { failures.push(`${field} is not a valid URL`); }
}
for (const url of [...(value.citation || []), ...(value.author?.sameAs || [])]) {
  try { new URL(url); } catch { failures.push(`invalid related URL: ${url}`); }
}

console.log(JSON.stringify({
  path,
  context: value['@context'],
  type: value['@type'],
  author: value.author?.name,
  legalName: value.author?.legalName,
  keywords: value.keywords?.length || 0,
  citations: value.citation?.length || 0,
  failures,
}, null, 2));
if (failures.length) process.exit(1);

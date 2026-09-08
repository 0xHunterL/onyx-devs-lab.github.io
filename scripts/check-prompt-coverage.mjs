import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const matrix = JSON.parse(await readFile(path.join(root, 'geo/prompt-matrix.json'), 'utf8'));
const sitemap = await readFile(path.join(root, 'dist/sitemap.xml'), 'utf8');
const failures = [];
const coveredUrls = new Set();

for (const item of matrix.prompts) {
  if (!item.evidenceUrls?.length) failures.push(`${item.id}: missing evidenceUrls`);
  if (!item.answerTerms?.length) failures.push(`${item.id}: missing answerTerms`);

  let combinedEvidence = '';
  for (const urlPath of item.evidenceUrls || []) {
    if (!urlPath.startsWith('/') || !urlPath.endsWith('/')) {
      failures.push(`${item.id}: evidence URL must be an absolute site path ending in /: ${urlPath}`);
      continue;
    }
    if (!sitemap.includes(`<loc>${matrix.site}${urlPath}</loc>`)) {
      failures.push(`${item.id}: evidence URL missing from sitemap: ${urlPath}`);
    }
    try {
      const html = await readFile(path.join(root, 'dist', urlPath, 'index.html'), 'utf8');
      combinedEvidence += `\n${html}`;
      const canonical = `<link rel="canonical" href="${matrix.site}${urlPath}">`;
      if (!html.includes(canonical)) failures.push(`${item.id}: canonical mismatch: ${urlPath}`);
      coveredUrls.add(urlPath);
    } catch {
      failures.push(`${item.id}: built evidence page missing: ${urlPath}`);
    }
  }

  for (const term of item.answerTerms || []) {
    if (!combinedEvidence.includes(term)) failures.push(`${item.id}: answer term absent from mapped evidence: ${term}`);
  }
}

const ids = matrix.prompts.map((item) => item.id);
for (const id of new Set(ids)) {
  if (ids.filter((candidate) => candidate === id).length > 1) failures.push(`${id}: duplicate prompt id`);
}

console.log(JSON.stringify({
  schemaVersion: matrix.schemaVersion,
  prompts: matrix.prompts.length,
  mappedEvidencePages: coveredUrls.size,
  failures,
}, null, 2));

if (failures.length) process.exit(1);

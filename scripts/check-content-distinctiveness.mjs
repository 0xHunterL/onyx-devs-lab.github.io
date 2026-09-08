import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const pages = [];
const failures = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name === 'index.html') {
      const html = await readFile(file, 'utf8');
      const lang = html.match(/<html lang="([^"]+)"/)?.[1] || 'unknown';
      const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
      const text = main
        .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&(?:amp|lt|gt|quot|#39);/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';
      pages.push({ file: path.relative(dist, file), lang, text, description });
    }
  }
}

function shingles(page) {
  if (page.lang.startsWith('zh')) {
    const characters = page.text.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
    return new Set(Array.from({ length: Math.max(0, characters.length - 7) }, (_, index) => characters.slice(index, index + 8)));
  }
  const words = page.text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  return new Set(Array.from({ length: Math.max(0, words.length - 3) }, (_, index) => words.slice(index, index + 4).join(' ')));
}

function jaccard(left, right) {
  let intersection = 0;
  for (const value of left) if (right.has(value)) intersection += 1;
  return intersection / (left.size + right.size - intersection || 1);
}

await walk(dist);

const descriptions = new Map();
for (const page of pages) {
  const minimumLength = page.lang.startsWith('zh') ? 300 : 450;
  if (page.text.length < minimumLength) failures.push(`${page.file}: main text too short (${page.text.length} < ${minimumLength})`);
  if (!page.description) failures.push(`${page.file}: missing description`);
  else descriptions.set(page.description, [...(descriptions.get(page.description) || []), page.file]);
  page.shingles = shingles(page);
}

for (const [description, files] of descriptions) {
  if (files.length > 1) failures.push(`duplicate description across ${files.join(', ')}: ${description}`);
}

const similarities = [];
for (let leftIndex = 0; leftIndex < pages.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < pages.length; rightIndex += 1) {
    const left = pages[leftIndex];
    const right = pages[rightIndex];
    if (left.lang !== right.lang) continue;
    const score = jaccard(left.shingles, right.shingles);
    similarities.push({ left: left.file, right: right.file, score: Number(score.toFixed(3)) });
    if (score >= 0.72) failures.push(`high same-language similarity ${score.toFixed(3)}: ${left.file} <> ${right.file}`);
  }
}

similarities.sort((left, right) => right.score - left.score);
console.log(JSON.stringify({
  pages: pages.length,
  languages: Object.fromEntries([...new Set(pages.map((page) => page.lang))].map((lang) => [lang, pages.filter((page) => page.lang === lang).length])),
  highestSameLanguageSimilarities: similarities.slice(0, 10),
  failures,
}, null, 2));
if (failures.length) process.exit(1);

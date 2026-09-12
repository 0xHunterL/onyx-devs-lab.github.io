import { readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildPublicationDrift } from './geo-evidence-publication-drift.mjs';

const args = process.argv.slice(2);
const valueArg = (name, fallback) => args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) || fallback;
const baselinePath = path.resolve(valueArg('--baseline', 'docs/geo-baselines/2026-09-11-monitor-evidence.json'));
const summaryPath = path.resolve(valueArg('--summary', '/var/lib/onyx-geo/summary.json'));
const distributionManifestPath = path.resolve(valueArg('--distribution-manifest', 'geo/distribution-manifest.json'));
const outputValue = valueArg('--output', '');
const outputPath = outputValue ? path.resolve(outputValue) : '';

const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
const summary = JSON.parse(await readFile(summaryPath, 'utf8'));
const distributionManifest = JSON.parse(await readFile(distributionManifestPath, 'utf8'));
const report = buildPublicationDrift(baseline, summary, { distributionManifest });

if (outputPath) {
  const temporary = `${outputPath}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o640 });
  await rename(temporary, outputPath);
}

console.log(JSON.stringify(report, null, 2));
if (report.status !== 'synchronized') process.exitCode = 1;

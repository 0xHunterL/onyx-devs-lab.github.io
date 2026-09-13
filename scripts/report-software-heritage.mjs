import { fetchOffsiteResource } from './fetch-offsite-resource.mjs';
import { buildSoftwareHeritageAvailability, buildSoftwareHeritageObservation } from './software-heritage-evidence.mjs';

const args = process.argv.slice(2);
const valueArg = (name, fallback) => args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) || fallback;
const repository = valueArg('--repository', '0xHunterL/onyx-devs-lab.github.io');
const branch = valueArg('--branch', 'main');
if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw new Error('--repository must use owner/name');
if (!/^[A-Za-z0-9._/-]+$/.test(branch) || branch.includes('..')) throw new Error('--branch is invalid');

const origin = `https://github.com/${repository}`;
const sources = [];
const getJson = async (id, url) => {
  try {
    const fetched = await fetchOffsiteResource(id, url, { attempts: 2, minimumBytes: 2, timeoutMs: 20_000, userAgent: 'Onyx-GEO-SWH-Monitor/1.0' });
    const parsed = JSON.parse(fetched.body);
    sources.push({ id, status: 'available', httpStatus: fetched.result.status, reason: null });
    return parsed;
  } catch (error) {
    sources.push({ id, status: 'unavailable', httpStatus: error.result?.status ?? null, reason: error.message });
    return null;
  }
};

const repositoryRefUrl = `https://api.github.com/repos/${repository}/git/ref/heads/${encodeURIComponent(branch)}`;
const visitsUrl = `https://archive.softwareheritage.org/api/1/origin/${encodeURIComponent(origin)}/visits/?limit=20`;
const repositoryRef = await getJson('github-branch-ref', repositoryRefUrl);
const visits = await getJson('software-heritage-visits', visitsUrl);
const latestAttempt = Array.isArray(visits) ? visits[0] : null;
const latestVisit = Array.isArray(visits) ? visits.find((visit) => visit?.status === 'full' && visit?.snapshot) : null;
const snapshotId = latestVisit?.snapshot || null;
const snapshot = snapshotId
  ? await getJson('software-heritage-snapshot', `https://archive.softwareheritage.org/api/1/snapshot/${snapshotId}/`)
  : null;

let observation;
try {
  observation = buildSoftwareHeritageObservation({ origin, branch, repositoryHead: repositoryRef?.object?.sha, latestVisit, snapshot });
} catch {
  observation = {
    origin,
    branch,
    status: 'unavailable',
    archiveCoverageStatus: 'unavailable',
    repositoryHead: repositoryRef?.object?.sha || null,
    latestVisitAt: latestVisit?.date || null,
    latestVisitStatus: latestVisit?.status || 'unavailable',
    snapshotSwhid: snapshotId ? `swh:1:snp:${snapshotId}` : null,
    archiveHead: null,
    evidenceBoundary: 'Unavailable source data must not be interpreted as an absence of archived source, website indexing, AI retrieval, citation, ranking, endorsement, or recommendation.',
  };
}

console.log(JSON.stringify({
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  ...observation,
  latestAttemptAt: latestAttempt?.date || null,
  latestAttemptStatus: latestAttempt?.status || 'unavailable',
  availability: buildSoftwareHeritageAvailability(observation, sources),
  sourceUrls: { repositoryRefUrl, visitsUrl, snapshotUrl: snapshotId ? `https://archive.softwareheritage.org/api/1/snapshot/${snapshotId}/` : null },
}, null, 2));

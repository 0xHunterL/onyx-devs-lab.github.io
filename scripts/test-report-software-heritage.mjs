import assert from 'node:assert/strict';
import { buildSoftwareHeritageAvailability, buildSoftwareHeritageObservation } from './software-heritage-evidence.mjs';

const base = {
  origin: 'https://github.com/example/site',
  branch: 'main',
  repositoryHead: 'new-head',
  latestVisit: { date: '2026-09-13T00:00:00Z', status: 'full', snapshot: 'snapshot-id' },
};
const current = buildSoftwareHeritageObservation({ ...base, snapshot: { id: 'snapshot-id', branches: { 'refs/heads/main': { target: 'new-head', target_type: 'revision' } } } });
assert.equal(current.status, 'available');
assert.equal(current.archiveCoverageStatus, 'current');
assert.equal(current.snapshotSwhid, 'swh:1:snp:snapshot-id');

const lagging = buildSoftwareHeritageObservation({ ...base, snapshot: { id: 'snapshot-id', branches: { 'refs/heads/main': { target: 'old-head', target_type: 'revision' } } } });
assert.equal(lagging.status, 'available');
assert.equal(lagging.archiveCoverageStatus, 'lagging');
assert.equal(lagging.archiveHead, 'old-head');

const unavailable = buildSoftwareHeritageObservation({ ...base, latestVisit: { status: 'failed', snapshot: null }, snapshot: null });
assert.equal(unavailable.status, 'unavailable');
assert.equal(unavailable.archiveCoverageStatus, 'unavailable');

const availability = buildSoftwareHeritageAvailability({
  ...lagging,
  saveRequest: {
    id: 2473234,
    saveTaskStatus: 'failed',
    visitStatus: 'failed',
    snapshotSwhid: null,
    nextRun: '2026-09-13T03:50:45Z',
  },
}, [
  { id: 'github-branch-ref', status: 'available' },
  { id: 'software-heritage-visits', status: 'available' },
  { id: 'software-heritage-snapshot', status: 'available' },
  { id: 'software-heritage-save-request', status: 'available' },
]);
assert.equal(availability.status, 'available');
assert.equal(availability.sourcesChecked, 4);
assert.equal(availability.archiveCoverageStatus, 'lagging');
assert.equal(availability.sources[0].id, 'github-branch-ref:new-head');
assert.equal(availability.sources[1].id, 'software-heritage-visits:swh:1:snp:snapshot-id');
assert.equal(availability.sources[2].id, 'software-heritage-snapshot:old-head');
assert.equal(availability.sources[3].id, 'software-heritage-save-request:2473234:failed:failed:none:2026-09-13T03:50:45Z');
assert.match(availability.interpretation, /does not yet preserve/);
assert.match(current.evidenceBoundary, /Neither state proves/);
assert.throws(() => buildSoftwareHeritageObservation({ origin: base.origin, repositoryHead: '' }), /required/);

console.log(JSON.stringify({ tests: 18, failures: [] }, null, 2));

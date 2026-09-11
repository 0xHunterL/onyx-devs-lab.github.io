import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, stat, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { restoreUnchangedFileTimes, snapshotFileState } from './build-site.mjs';

const directory = await mkdtemp(path.join(tmpdir(), 'onyx-build-mtime-test-'));
try {
  const nested = path.join(directory, 'nested');
  await mkdir(nested);
  const unchanged = path.join(nested, 'unchanged.html');
  const changed = path.join(directory, 'changed.json');
  await writeFile(unchanged, 'same content');
  await writeFile(changed, 'old content');
  const oldTime = new Date('2026-09-08T12:00:00.000Z');
  await utimes(unchanged, oldTime, oldTime);
  await utimes(changed, oldTime, oldTime);
  const snapshot = await snapshotFileState(directory);

  await writeFile(unchanged, 'same content');
  await writeFile(changed, 'new content');
  const result = await restoreUnchangedFileTimes(directory, snapshot);
  assert.deepEqual(result, { unchangedFiles: 1, changedOrNewFiles: 1 });
  assert.equal((await stat(unchanged)).mtime.toISOString(), oldTime.toISOString());
  assert.notEqual((await stat(changed)).mtime.toISOString(), oldTime.toISOString());
  assert.equal(snapshot.size, 2);
  assert.match(snapshot.get('nested/unchanged.html').sha256, /^[a-f0-9]{64}$/);
  console.log(JSON.stringify({ tests: 5, failures: [] }, null, 2));
} finally {
  await rm(directory, { recursive: true, force: true });
}

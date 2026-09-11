import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { readdir, readFile, stat, utimes } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const sha256 = async (file) => createHash('sha256').update(await readFile(file)).digest('hex');

async function filesUnder(directory) {
  const files = [];
  async function walk(current) {
    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else if (entry.isFile()) files.push(absolute);
    }
  }
  await walk(directory);
  return files;
}

export async function snapshotFileState(directory) {
  const snapshot = new Map();
  for (const absolute of await filesUnder(directory)) {
    const metadata = await stat(absolute);
    snapshot.set(path.relative(directory, absolute), {
      sha256: await sha256(absolute),
      atimeMs: metadata.atimeMs,
      mtimeMs: metadata.mtimeMs,
    });
  }
  return snapshot;
}

export async function restoreUnchangedFileTimes(directory, snapshot) {
  let unchangedFiles = 0;
  let changedOrNewFiles = 0;
  for (const absolute of await filesUnder(directory)) {
    const previous = snapshot.get(path.relative(directory, absolute));
    if (!previous || await sha256(absolute) !== previous.sha256) {
      changedOrNewFiles += 1;
      continue;
    }
    await utimes(absolute, new Date(previous.atimeMs), new Date(previous.mtimeMs));
    unchangedFiles += 1;
  }
  return { unchangedFiles, changedOrNewFiles };
}

async function run(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`)));
  });
}

async function main() {
  const previous = await snapshotFileState(dist);
  await run(path.join(root, 'node_modules', '.bin', 'vite'), ['build']);
  await run(process.execPath, [path.join(root, 'scripts', 'generate-geo-pages.mjs')]);
  const restoration = await restoreUnchangedFileTimes(dist, previous);
  console.log(JSON.stringify({ previousFiles: previous.size, ...restoration }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();

import path from 'node:path';
import { readdir } from 'node:fs/promises';

function rotationNumber(name, base) {
  const escapedBase = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = name.match(new RegExp(`^${escapedBase}\\.(\\d+)(?:\\.gz)?$`));
  return match ? Number(match[1]) : null;
}

export async function resolveLogPaths(inputPaths, includeRotated = false) {
  if (!includeRotated) return [...new Set(inputPaths)];

  const resolved = [];
  for (const inputPath of inputPaths) {
    const directory = path.dirname(inputPath);
    const base = path.basename(inputPath);
    const entries = await readdir(directory);
    const rotations = entries
      .map((name) => ({ name, rotation: rotationNumber(name, base) }))
      .filter((entry) => entry.rotation !== null)
      .sort((left, right) => right.rotation - left.rotation)
      .map((entry) => path.join(directory, entry.name));
    resolved.push(...rotations, inputPath);
  }
  return [...new Set(resolved)];
}

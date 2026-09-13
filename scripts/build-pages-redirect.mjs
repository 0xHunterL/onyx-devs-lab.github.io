import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultSource = path.join(root, 'dist');
const defaultOutput = path.join(root, '.pages-redirect');
const canonicalOrigin = 'https://hk.onyxdevslab.com';

const htmlEscape = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

async function filesUnder(directory) {
  const files = [];
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else if (entry.isFile()) files.push(absolute);
    }
  }
  await walk(directory);
  return files;
}

export function canonicalPathForHtml(relativeFile) {
  const normalized = relativeFile.split(path.sep).join('/');
  if (normalized === 'index.html') return '/';
  if (normalized.endsWith('/index.html')) return `/${normalized.slice(0, -'index.html'.length)}`;
  return `/${normalized}`;
}

export function redirectDocument(targetPath, { dynamicPath = false } = {}) {
  const canonicalUrl = `${canonicalOrigin}${targetPath}`;
  const script = dynamicPath
    ? `const destination = new URL(${JSON.stringify(canonicalOrigin)} + window.location.pathname); destination.search = window.location.search; destination.hash = window.location.hash; window.location.replace(destination.href);`
    : `const destination = new URL(${JSON.stringify(canonicalUrl)}); destination.search = window.location.search; destination.hash = window.location.hash; window.location.replace(destination.href);`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,follow">
  <title>Onyx Devs Lab has moved</title>
  <link rel="canonical" href="${htmlEscape(canonicalUrl)}">
  <script>${script}</script>
  <meta http-equiv="refresh" content="0;url=${htmlEscape(canonicalUrl)}">
</head>
<body>
  <p>This legacy address has moved to <a href="${htmlEscape(canonicalUrl)}">${htmlEscape(canonicalUrl)}</a>.</p>
</body>
</html>
`;
}

export async function buildPagesRedirect({ source = defaultSource, output = defaultOutput } = {}) {
  const sourceFiles = await filesUnder(source);
  const htmlFiles = sourceFiles.filter((file) => file.endsWith('.html'));
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });

  for (const sourceFile of htmlFiles) {
    const relative = path.relative(source, sourceFile);
    const destination = path.join(output, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, redirectDocument(canonicalPathForHtml(relative)));
  }

  await writeFile(path.join(output, '404.html'), redirectDocument('/', { dynamicPath: true }));
  await writeFile(path.join(output, 'CNAME'), 'onyxdevslab.com\n');
  await writeFile(path.join(output, '.nojekyll'), '');
  await writeFile(path.join(output, 'robots.txt'), 'User-agent: *\nAllow: /\n');

  const verificationFiles = sourceFiles.filter((file) => {
    const relative = path.relative(source, file);
    return !relative.includes(path.sep) && /^[a-f0-9]{32,}\.txt$/i.test(relative);
  });
  for (const sourceFile of verificationFiles) {
    await cp(sourceFile, path.join(output, path.basename(sourceFile)));
  }

  return { htmlRedirects: htmlFiles.length, verificationFiles: verificationFiles.length, output };
}

async function main() {
  const result = await buildPagesRedirect();
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();

import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildPagesRedirect, canonicalPathForHtml, redirectDocument } from './build-pages-redirect.mjs';

const temporary = await mkdtemp(path.join(tmpdir(), 'onyx-pages-redirect-test-'));
const source = path.join(temporary, 'source');
const output = path.join(temporary, 'output');

try {
  await mkdir(path.join(source, 'zh-cn', 'guides', 'example'), { recursive: true });
  await writeFile(path.join(source, 'index.html'), '<h1>duplicate root</h1>');
  await writeFile(path.join(source, 'privacy.html'), '<h1>duplicate privacy page</h1>');
  await writeFile(path.join(source, 'zh-cn', 'guides', 'example', 'index.html'), '<h1>duplicate guide</h1>');
  await writeFile(path.join(source, '9c37a18bd2044e1687f45c2e91ad603b.txt'), 'verification');
  await writeFile(path.join(source, 'llms.txt'), 'duplicate machine-readable content');

  assert.equal(canonicalPathForHtml('index.html'), '/');
  assert.equal(canonicalPathForHtml(path.join('zh-cn', 'index.html')), '/zh-cn/');
  assert.equal(canonicalPathForHtml('privacy.html'), '/privacy.html');
  assert.match(redirectDocument('/zh-cn/'), /noindex,follow/);

  const result = await buildPagesRedirect({ source, output });
  assert.equal(result.htmlRedirects, 3);
  assert.equal(result.verificationFiles, 1);

  const guide = await readFile(path.join(output, 'zh-cn', 'guides', 'example', 'index.html'), 'utf8');
  assert.match(guide, /https:\/\/hk\.onyxdevslab\.com\/zh-cn\/guides\/example\//);
  assert.doesNotMatch(guide, /duplicate guide/);
  assert.equal(await readFile(path.join(output, 'CNAME'), 'utf8'), 'onyxdevslab.com\n');
  assert.equal(await readFile(path.join(output, '9c37a18bd2044e1687f45c2e91ad603b.txt'), 'utf8'), 'verification');
  await assert.rejects(stat(path.join(output, 'llms.txt')), { code: 'ENOENT' });
  assert.match(await readFile(path.join(output, '404.html'), 'utf8'), /window\.location\.pathname/);
  assert.match(await readFile(path.join(output, '404.html'), 'utf8'), /"https:\/\/hk\.onyxdevslab\.com" \+ window\.location\.pathname/);

  console.log(JSON.stringify({ tests: 14, failures: [] }, null, 2));
} finally {
  await rm(temporary, { recursive: true, force: true });
}

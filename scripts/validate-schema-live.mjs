const origin = process.argv[2] || 'https://hk.onyxdevslab.com';
const args = process.argv.slice(3);
const delayArg = args.find((arg) => arg.startsWith('--delay-ms='));
const delayMs = delayArg ? Number(delayArg.slice('--delay-ms='.length)) : 2000;
if (!Number.isFinite(delayMs) || delayMs < 0) {
  console.error('Invalid --delay-ms value. Use a non-negative number.');
  process.exit(2);
}
const paths = args.filter((arg) => !arg.startsWith('--delay-ms='));
const targets = (paths.length ? paths : [
  '/',
  '/en/about/',
  '/zh-cn/ai-consulting/',
  '/zh-cn/case-studies/legal-ai-evidence-workflow/',
  '/zh-cn/guides/enterprise-ai-governance/',
  '/zh-cn/guides/ai-dingkai/',
  '/zh-cn/methodology/case-study-evidence-register/',
]).map((pathname) => new URL(pathname, origin).href);

const results = [];
for (const [index, url] of targets.entries()) {
  if (index > 0 && delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
  const body = new URLSearchParams({ url });
  const response = await fetch('https://validator.schema.org/validate', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    redirect: 'manual',
  });
  const location = response.headers.get('location') || '';
  if (response.status >= 300 && response.status < 400) {
    const rateLimited = /google\.com\/sorry\//i.test(location);
    results.push({ url, status: 'unavailable', reason: rateLimited ? 'rate-limited-or-automated-access-blocked' : `unexpected-redirect-${response.status}`, location: rateLimited ? new URL(location).origin : location });
    continue;
  }
  if (!response.ok) {
    results.push({ url, status: 'unavailable', reason: `HTTP ${response.status}` });
    continue;
  }
  const text = await response.text();
  try {
    const report = JSON.parse(text.replace(/^\)\]\}'\n/, ''));
    results.push({
      url,
      status: (report.totalNumErrors || 0) > 0 || (report.totalNumWarnings || 0) > 0 || report.isRendered !== true ? 'invalid' : 'validated',
      errors: report.totalNumErrors || 0,
      warnings: report.totalNumWarnings || 0,
      objects: report.numObjects || 0,
      rendered: report.isRendered === true,
    });
  } catch (error) {
    results.push({ url, status: 'unavailable', reason: `Invalid validator response: ${error.message}` });
  }
}

const validationFailures = results.filter((result) => result.status === 'invalid');
const unavailable = results.filter((result) => result.status === 'unavailable');
console.log(JSON.stringify({
  validator: 'https://validator.schema.org/',
  caveat: 'Schema.org documents an interactive validator, not a supported bulk-validation API. Service throttling or automated-access blocking is reported as unavailable and never as a markup error.',
  requested: targets.length,
  validated: results.filter((result) => result.status === 'validated').length,
  invalid: validationFailures.length,
  unavailable: unavailable.length,
  results,
  validationFailures,
}, null, 2));
if (validationFailures.length) process.exit(1);
if (unavailable.length) process.exit(2);

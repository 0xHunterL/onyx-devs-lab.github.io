const origin = process.argv[2] || 'https://hk.onyxdevslab.com';
const paths = process.argv.slice(3);
const targets = (paths.length ? paths : [
  '/',
  '/zh-cn/ai-consulting/',
  '/zh-cn/guides/enterprise-ai-agent-erp-integration/',
  '/zh-cn/case-studies/legal-ai-evidence-workflow/',
  '/zh-cn/methodology/case-study-evidence-register/',
  '/zh-cn/about/',
]).map((pathname) => new URL(pathname, origin).href);

const results = [];
for (const url of targets) {
  const body = new URLSearchParams({ url });
  const response = await fetch('https://validator.schema.org/validate', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) {
    results.push({ url, errors: 1, warnings: 0, failure: `HTTP ${response.status}` });
    continue;
  }
  const text = await response.text();
  try {
    const report = JSON.parse(text.replace(/^\)\]\}'\n/, ''));
    results.push({
      url,
      errors: report.totalNumErrors || 0,
      warnings: report.totalNumWarnings || 0,
      objects: report.numObjects || 0,
      rendered: report.isRendered === true,
    });
  } catch (error) {
    results.push({ url, errors: 1, warnings: 0, failure: `Invalid validator response: ${error.message}` });
  }
}

const failures = results.filter((result) => result.errors > 0 || result.warnings > 0 || !result.rendered);
console.log(JSON.stringify({ validator: 'https://validator.schema.org/', results, failures }, null, 2));
if (failures.length) process.exit(1);

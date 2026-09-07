const origin = (process.argv[2] || 'https://hk.onyxdevslab.com').replace(/\/$/, '');
const canonicalOrigin = (process.argv[3] || 'https://hk.onyxdevslab.com').replace(/\/$/, '');
const failures = [];

async function get(pathname, expectedType) {
  const response = await fetch(`${origin}${pathname}`, {
    headers: { 'user-agent': 'Onyx-GEO-Release-Check/1.0' },
    redirect: 'follow',
  });
  const body = await response.text();
  const contentType = response.headers.get('content-type') || '';
  if (!response.ok) failures.push(`${pathname}: HTTP ${response.status}`);
  if (!contentType.includes(expectedType)) failures.push(`${pathname}: expected ${expectedType}, got ${contentType || 'none'}`);
  return { response, body, contentType };
}

const robots = await get('/robots.txt', 'text/plain');
if (!robots.body.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) failures.push('/robots.txt: sitemap declaration is missing or points to the wrong canonical origin');
if (!robots.body.includes('OAI-SearchBot')) failures.push('/robots.txt: OAI-SearchBot policy is missing');

const llms = await get('/llms.txt', 'text/plain');
if (!llms.body.includes('# Onyx Devs Lab')) failures.push('/llms.txt: expected site summary is missing');

const sitemap = await get('/sitemap.xml', 'xml');
const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urls.length < 10) failures.push(`/sitemap.xml: expected at least 10 URLs, got ${urls.length}`);

for (const absoluteUrl of urls) {
  const url = new URL(absoluteUrl);
  const page = await get(url.pathname, 'text/html');
  if (!/<h1[ >][\s\S]*?<\/h1>/.test(page.body)) failures.push(`${url.pathname}: H1 is missing from response HTML`);
  if (!page.body.includes(`<link rel="canonical" href="${absoluteUrl}"`)) failures.push(`${url.pathname}: canonical does not match sitemap URL`);
  if (!page.body.includes('application/ld+json')) failures.push(`${url.pathname}: JSON-LD is missing`);
}

console.log(JSON.stringify({ origin, canonicalOrigin, checkedPages: urls.length, failures }, null, 2));
if (failures.length) process.exit(1);

const origin = (process.argv[2] || 'https://hk.onyxdevslab.com').replace(/\/$/, '');
const hubUrl = 'https://pubsubhubbub.appspot.com/';
const topics = [`${origin}/feed.xml`, `${origin}/feed.json`];
const results = [];

for (const topic of topics) {
  const feed = await fetch(topic, {
    headers: { 'user-agent': 'Onyx-GEO-WebSub-Publisher/1.0' },
    signal: AbortSignal.timeout(15_000),
  });
  const body = await feed.text();
  if (!feed.ok) throw new Error(`${topic} is unavailable: HTTP ${feed.status}`);
  const link = feed.headers.get('link') || '';
  const hasHub = link.includes(`<${hubUrl}>; rel="hub"`) || body.includes(`href="${hubUrl}" rel="hub"`) || body.includes(`"type":"WebSub","url":"${hubUrl}"`);
  const hasSelf = link.includes(`<${topic}>; rel="self"`) || body.includes(`href="${topic}" rel="self"`) || body.includes(`"feed_url":"${topic}"`);
  if (!hasHub || !hasSelf) throw new Error(`${topic} does not advertise both WebSub hub and self relationships`);

  const response = await fetch(hubUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'user-agent': 'Onyx-GEO-WebSub-Publisher/1.0',
    },
    body: new URLSearchParams({ 'hub.mode': 'publish', 'hub.url': topic }),
    signal: AbortSignal.timeout(20_000),
  });
  const responseBody = await response.text();
  if (!response.ok) throw new Error(`WebSub publish failed for ${topic}: HTTP ${response.status} ${responseBody.slice(0, 300)}`);
  results.push({ topic, hub: hubUrl, status: response.status });
}

console.log(JSON.stringify({
  publishedAt: new Date().toISOString(),
  results,
  caveat: 'A successful WebSub hub response proves notification receipt only. It does not prove a search-engine subscription, crawl, indexing, retrieval, citation, or recommendation.',
}, null, 2));

import assert from 'node:assert/strict';
import { fetchCommonCrawlJson } from './common-crawl-fetch.mjs';

function response(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => body,
  };
}

let transientCalls = 0;
const recovered = await fetchCommonCrawlJson('https://example.test/index', {
  retryDelayMs: 0,
  fetchImpl: async () => {
    transientCalls += 1;
    return transientCalls === 1 ? response(504, 'gateway timeout') : response(200, '[{"id":"CC-MAIN-TEST"}]');
  },
});
assert.equal(transientCalls, 2);
assert.equal(recovered.status, 'available');
assert.equal(recovered.attempts, 2);
assert.equal(recovered.value[0].id, 'CC-MAIN-TEST');

const noCaptures = await fetchCommonCrawlJson('https://example.test/cdx', {
  cdxLines: true,
  retryDelayMs: 0,
  fetchImpl: async () => response(404, '{"message":"No Captures found for: test"}'),
});
assert.equal(noCaptures.status, 'available');
assert.equal(noCaptures.httpStatus, 404);
assert.deepEqual(noCaptures.value, []);

let persistentCalls = 0;
const unavailable = await fetchCommonCrawlJson('https://example.test/cdx', {
  attempts: 3,
  cdxLines: true,
  retryDelayMs: 0,
  fetchImpl: async () => {
    persistentCalls += 1;
    throw new Error('network unavailable');
  },
});
assert.equal(persistentCalls, 3);
assert.equal(unavailable.status, 'unavailable');
assert.equal(unavailable.attempts, 3);
assert.match(unavailable.reason, /network unavailable/);

console.log(JSON.stringify({ tests: 11, failures: [] }, null, 2));

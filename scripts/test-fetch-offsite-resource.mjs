import assert from 'node:assert/strict';
import { fetchOffsiteResource } from './fetch-offsite-resource.mjs';

function response(status, body, contentType = 'application/octet-stream') {
  return {
    ok: status >= 200 && status < 300,
    status,
    url: 'https://cdn.example.test/asset',
    headers: new Headers({ 'content-type': contentType }),
    text: async () => body,
  };
}

let transientCalls = 0;
const recovered = await fetchOffsiteResource('versioned asset', 'https://example.test/asset', {
  retryDelayMs: 0,
  fetchImpl: async () => {
    transientCalls += 1;
    return transientCalls === 1 ? response(500, 'temporary error', 'text/html') : response(200, 'immutable asset');
  },
});
assert.equal(transientCalls, 2);
assert.equal(recovered.body, 'immutable asset');
assert.equal(recovered.result.attempts, 2);

let persistentCalls = 0;
await assert.rejects(
  fetchOffsiteResource('missing asset', 'https://example.test/missing', {
    attempts: 3,
    retryDelayMs: 0,
    fetchImpl: async () => {
      persistentCalls += 1;
      return response(503, 'still unavailable', 'text/html');
    },
  }),
  (error) => {
    assert.match(error.message, /missing asset: HTTP 503/);
    assert.equal(error.result.status, 503);
    assert.equal(error.result.attempts, 3);
    return true;
  },
);
assert.equal(persistentCalls, 3);

let shortBodyCalls = 0;
const sufficientlyLarge = await fetchOffsiteResource('archived page', 'https://example.test/archive', {
  minimumBytes: 8,
  retryDelayMs: 0,
  fetchImpl: async () => {
    shortBodyCalls += 1;
    return response(200, shortBodyCalls === 1 ? 'short' : 'long enough', 'text/html');
  },
});
assert.equal(shortBodyCalls, 2);
assert.equal(sufficientlyLarge.body, 'long enough');

let observedUserAgent = '';
await fetchOffsiteResource('distribution page', 'https://example.test/distribution', {
  userAgent: 'Onyx-GEO-Release-Check Distribution/1.0',
  fetchImpl: async (url, options) => {
    observedUserAgent = options.headers['user-agent'];
    return response(200, String(url), 'text/html');
  },
});
assert.equal(observedUserAgent, 'Onyx-GEO-Release-Check Distribution/1.0');

console.log(JSON.stringify({ tests: 12, failures: [] }, null, 2));

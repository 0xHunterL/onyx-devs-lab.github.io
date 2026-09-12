import assert from 'node:assert/strict';
import { classifyServicePage } from './check-services-hk.mjs';

const target = {
  id: 'ai-consulting',
  url: 'https://ai-consulting-hk.services.hk/',
  requiredMarkers: ['AI & Machine Learning Consulting Hong Kong', 'Practical AI implementation', 'Free Consultation'],
};
const forbiddenMarkers = ['open_basedir restriction in effect', 'autoload.php', 'Failed opening required', 'Fatal error'];
const healthyBody = '<title>AI & Machine Learning Consulting Hong Kong</title><p>Practical AI implementation</p><a>Free Consultation</a>';

const healthy = classifyServicePage(target, { body: healthyBody, finalUrl: target.url, httpStatus: 200, forbiddenMarkers });
assert.equal(healthy.status, 'available');
assert.equal(healthy.reason, null);
assert.deepEqual(healthy.missingMarkers, []);
assert.deepEqual(healthy.forbiddenMarkers, []);

const phpFailure = classifyServicePage(target, { body: '<b>Fatal error</b>: Failed opening required vendor/autoload.php', finalUrl: target.url, httpStatus: 200, forbiddenMarkers });
assert.equal(phpFailure.status, 'unavailable');
assert.equal(phpFailure.reason, 'application-error-marker');
assert.deepEqual(phpFailure.forbiddenMarkers, ['autoload.php', 'Failed opening required', 'Fatal error']);

const redirected = classifyServicePage(target, { body: healthyBody, finalUrl: 'https://services.hk/', httpStatus: 200, forbiddenMarkers });
assert.equal(redirected.status, 'unavailable');
assert.equal(redirected.reason, 'destination-mismatch');

const missing = classifyServicePage(target, { body: '<title>AI & Machine Learning Consulting Hong Kong</title>', finalUrl: target.url, httpStatus: 200, forbiddenMarkers });
assert.equal(missing.status, 'unavailable');
assert.equal(missing.reason, 'required-content-missing');

console.log(JSON.stringify({ tests: 10, failures: [] }, null, 2));

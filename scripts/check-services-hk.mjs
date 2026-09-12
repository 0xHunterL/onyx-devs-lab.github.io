import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

export function classifyServicePage(target, response) {
  const body = String(response.body || '');
  const missingMarkers = (target.requiredMarkers || []).filter((marker) => !body.includes(marker));
  const forbiddenMarkers = (response.forbiddenMarkers || []).filter((marker) => body.toLowerCase().includes(marker.toLowerCase()));
  const httpOk = Number.isInteger(response.httpStatus) && response.httpStatus >= 200 && response.httpStatus < 300;
  const sameDestination = response.finalUrl === target.url;
  const usable = httpOk && sameDestination && !missingMarkers.length && !forbiddenMarkers.length;
  return {
    id: target.id,
    url: target.url,
    finalUrl: response.finalUrl || null,
    httpStatus: Number.isInteger(response.httpStatus) ? response.httpStatus : null,
    status: usable ? 'available' : 'unavailable',
    sameDestination,
    missingMarkers,
    forbiddenMarkers,
    reason: usable ? null : response.reason || (!httpOk ? 'http-failure' : !sameDestination ? 'destination-mismatch' : forbiddenMarkers.length ? 'application-error-marker' : 'required-content-missing'),
  };
}

export async function checkServicesHk({ fetchImpl = fetch, configPath = 'geo/services-hk-monitor.json' } = {}) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const results = await Promise.all(config.targets.map(async (target) => {
    try {
      const response = await fetchImpl(target.url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
        headers: { 'User-Agent': 'Onyx-GEO-Channel-Readiness/1.0' },
      });
      return classifyServicePage(target, {
        body: await response.text(),
        finalUrl: response.url,
        httpStatus: response.status,
        forbiddenMarkers: config.forbiddenMarkers,
      });
    } catch (error) {
      return classifyServicePage(target, {
        body: '',
        finalUrl: null,
        httpStatus: null,
        forbiddenMarkers: config.forbiddenMarkers,
        reason: error.message,
      });
    }
  }));
  const availableTargets = results.filter((result) => result.status === 'available').length;
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    channel: config.channel,
    status: availableTargets === results.length && results.length ? 'available' : availableTargets ? 'partial' : 'unavailable',
    targetsChecked: results.length,
    availableTargets,
    unavailableTargets: results.length - availableTargets,
    results,
    evidenceBoundary: config.evidenceBoundary,
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await checkServicesHk();
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== 'available' && !process.argv.includes('--report')) process.exit(1);
}

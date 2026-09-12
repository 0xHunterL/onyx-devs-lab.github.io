export async function fetchCommonCrawlJson(url, {
  attempts = 3,
  cdxLines = false,
  fetchImpl = fetch,
  retryDelayMs = 500,
  timeoutMs = 20_000,
} = {}) {
  let lastHttpStatus = null;
  let lastReason = 'request failed';

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        signal: AbortSignal.timeout(timeoutMs),
        headers: { 'User-Agent': 'Onyx-GEO-Common-Crawl-Monitor/1.0' },
      });
      const body = await response.text();
      lastHttpStatus = response.status;

      if (cdxLines && response.status === 404) {
        const value = JSON.parse(body || '{}');
        if (String(value.message || '').startsWith('No Captures found')) {
          return { status: 'available', httpStatus: 404, attempts: attempt, value: [] };
        }
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const value = cdxLines
        ? body.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line))
        : JSON.parse(body);
      return { status: 'available', httpStatus: response.status, attempts: attempt, value };
    } catch (error) {
      lastReason = error instanceof Error ? error.message : String(error);
      if (attempt < attempts && retryDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs * attempt));
      }
    }
  }

  return { status: 'unavailable', httpStatus: lastHttpStatus, attempts, reason: lastReason, value: null };
}

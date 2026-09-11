export async function fetchOffsiteResource(name, url, {
  attempts = 3,
  minimumBytes = 0,
  fetchImpl = fetch,
  retryDelayMs = 250,
  timeoutMs = 20_000,
} = {}) {
  let lastError;
  let lastResult;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        headers: { 'user-agent': 'Onyx-GEO-Offsite-Check/1.0' },
        redirect: 'follow',
        signal: AbortSignal.timeout(timeoutMs),
      });
      const body = await response.text();
      const contentType = response.headers.get('content-type') || '';
      const xRobotsTag = response.headers.get('x-robots-tag') || '';
      const bytes = Buffer.byteLength(body);
      lastResult = { name, requestedUrl: url, finalUrl: response.url, status: response.status, contentType, bytes, attempts: attempt };

      if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
      if (bytes < minimumBytes) throw new Error(`${name}: response was only ${bytes} bytes; expected at least ${minimumBytes}`);

      return { body, result: lastResult, xRobotsTag };
    } catch (error) {
      lastError = error;
      if (attempt < attempts && retryDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs * attempt));
      }
    }
  }

  const error = lastError instanceof Error ? lastError : new Error(String(lastError || 'request failed'));
  error.result = lastResult;
  throw error;
}

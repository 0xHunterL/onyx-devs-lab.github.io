import { createHash } from 'node:crypto';

const requiredFields = ['timestamp', 'original', 'mimetype', 'statuscode', 'digest'];

export function parseWaybackCdx(value, { host, query }) {
  if (!Array.isArray(value) || !Array.isArray(value[0])) throw new Error('Wayback CDX response is not a tabular JSON array');
  const header = value[0];
  for (const field of requiredFields) {
    if (!header.includes(field)) throw new Error(`Wayback CDX response is missing ${field}`);
  }

  const captures = value.slice(1).map((row, index) => {
    if (!Array.isArray(row) || row.length !== header.length) throw new Error(`Wayback CDX row ${index + 1} does not match its header`);
    const record = Object.fromEntries(header.map((field, fieldIndex) => [field, row[fieldIndex]]));
    const url = new URL(record.original);
    if (url.hostname !== host) throw new Error(`Wayback CDX returned an unexpected host: ${url.hostname}`);
    if (record.statuscode !== '200' || record.mimetype !== 'text/html') throw new Error('Wayback CDX returned a row outside the requested filters');
    const observation = {
      timestamp: String(record.timestamp),
      url: record.original,
      status: Number(record.statuscode),
      mime: record.mimetype,
      digest: record.digest,
    };
    return {
      ...observation,
      replayUrl: `https://web.archive.org/web/${observation.timestamp}/${observation.url}`,
      fingerprint: createHash('sha256').update(['wayback', observation.timestamp, observation.url, observation.status, observation.digest].join('\u0000')).digest('hex'),
    };
  }).sort((left, right) => left.timestamp.localeCompare(right.timestamp) || left.url.localeCompare(right.url));

  return {
    captures,
    totals: {
      captures: captures.length,
      distinctUrls: new Set(captures.map((capture) => capture.url)).size,
    },
    firstCaptureAt: captures[0]?.timestamp || null,
    lastCaptureAt: captures.at(-1)?.timestamp || null,
    query,
  };
}

export function buildWaybackPromptCoverage(captures, promptMatrix, { origin }) {
  if (!Array.isArray(promptMatrix?.prompts)) throw new Error('Prompt matrix is missing prompts');
  const archived = new Set(captures.map((capture) => capture.url));
  const details = promptMatrix.prompts.map((prompt) => {
    if (!prompt.id || !Array.isArray(prompt.evidenceUrls) || !prompt.evidenceUrls.length) throw new Error('Prompt matrix contains a prompt without evidence URLs');
    const evidenceUrls = prompt.evidenceUrls.map((url) => new URL(url, origin).href);
    const archivedEvidenceUrls = evidenceUrls.filter((url) => archived.has(url));
    return {
      id: prompt.id,
      evidenceUrls,
      archivedEvidenceUrls,
      missingEvidenceUrls: evidenceUrls.filter((url) => !archived.has(url)),
      hasAnyArchivedEvidence: archivedEvidenceUrls.length > 0,
      fullyArchived: archivedEvidenceUrls.length === evidenceUrls.length,
    };
  });
  const uniqueEvidenceUrls = [...new Set(details.flatMap((detail) => detail.evidenceUrls))].sort();
  const archivedEvidenceUrls = uniqueEvidenceUrls.filter((url) => archived.has(url));
  return {
    schemaVersion: 1,
    promptMatrixSchemaVersion: promptMatrix.schemaVersion ?? null,
    totals: {
      prompts: details.length,
      uniqueEvidencePages: uniqueEvidenceUrls.length,
      archivedEvidencePages: archivedEvidenceUrls.length,
      promptsWithAnyArchivedEvidence: details.filter((detail) => detail.hasAnyArchivedEvidence).length,
      promptsFullyArchived: details.filter((detail) => detail.fullyArchived).length,
    },
    archivedEvidenceUrls,
    missingEvidenceUrls: uniqueEvidenceUrls.filter((url) => !archived.has(url)),
    prompts: details,
    evidenceBoundary: 'Prompt-level Wayback coverage proves only that one or more mapped evidence pages have public historical captures. It does not prove that the prompt, page, or answer is indexed, retrieved, cited, ranked, endorsed, or recommended by a search or AI product.',
  };
}

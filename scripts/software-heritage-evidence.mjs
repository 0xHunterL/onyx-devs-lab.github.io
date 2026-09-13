export function buildSoftwareHeritageObservation({ origin, branch = 'main', repositoryHead, latestVisit, snapshot }) {
  if (!origin || !repositoryHead) throw new Error('origin and repositoryHead are required');
  const snapshotId = latestVisit?.snapshot || null;
  const archiveBranch = snapshot?.branches?.[`refs/heads/${branch}`];
  const archiveHead = archiveBranch?.target_type === 'revision' ? archiveBranch.target : null;
  const visitAvailable = latestVisit?.status === 'full' && Boolean(snapshotId);
  const snapshotAvailable = Boolean(snapshotId && snapshot?.id === snapshotId && archiveHead);
  const status = visitAvailable && snapshotAvailable ? 'available' : 'unavailable';
  const archiveCoverageStatus = status !== 'available'
    ? 'unavailable'
    : archiveHead === repositoryHead
      ? 'current'
      : 'lagging';

  return {
    origin,
    branch,
    status,
    archiveCoverageStatus,
    repositoryHead,
    latestVisitAt: latestVisit?.date || null,
    latestVisitStatus: latestVisit?.status || 'unavailable',
    snapshotSwhid: snapshotId ? `swh:1:snp:${snapshotId}` : null,
    archiveHead,
    evidenceBoundary: 'A matching Software Heritage snapshot proves that the named public Git revision is preserved in an independent, content-addressed archive. A lagging snapshot proves only an archive coverage gap. Neither state proves website indexing, AI retrieval, citation, ranking, endorsement, or recommendation.',
  };
}

export function buildSoftwareHeritageAvailability(observation, sources = []) {
  const coverageSources = sources.map((source) => {
    if (source.id === 'github-branch-ref') return { ...source, id: `${source.id}:${observation?.repositoryHead || 'unknown'}` };
    if (source.id === 'software-heritage-visits') return { ...source, id: `${source.id}:${observation?.snapshotSwhid || 'unknown'}` };
    if (source.id === 'software-heritage-snapshot') return { ...source, id: `${source.id}:${observation?.archiveHead || 'unknown'}` };
    return source;
  });
  const availableSources = coverageSources.filter((source) => source.status === 'available').length;
  return {
    status: observation?.status || 'unavailable',
    archiveCoverageStatus: observation?.archiveCoverageStatus || 'unavailable',
    sourcesChecked: coverageSources.length,
    availableSources,
    unavailableSources: coverageSources.length - availableSources,
    repositoryHead: observation?.repositoryHead || null,
    archiveHead: observation?.archiveHead || null,
    snapshotSwhid: observation?.snapshotSwhid || null,
    sources: coverageSources,
    interpretation: observation?.archiveCoverageStatus === 'current'
      ? 'The latest complete Software Heritage snapshot preserves the current GitHub main revision.'
      : observation?.archiveCoverageStatus === 'lagging'
        ? 'Software Heritage is reachable, but its latest complete snapshot does not yet preserve the current GitHub main revision.'
        : 'Software Heritage coverage is unavailable and must not be interpreted as an absence of archived source.',
  };
}

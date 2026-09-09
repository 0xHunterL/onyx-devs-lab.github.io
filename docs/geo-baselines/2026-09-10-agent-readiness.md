# Onyx GEO evidence checkpoint — 2026-09-10

This provider-maintained checkpoint preserves the public evidence available for `hk.onyxdevslab.com` on 10 September 2026. It is designed to make later changes reproducible, not to claim independent endorsement.

## What is verified

- All 62 canonical pages returned HTTP `200`, indexable server-rendered HTML, canonical metadata, and parseable JSON-LD in the live release check.
- The same 62 canonical URLs can return a generated Markdown representation when the request sends `Accept: text/markdown`; normal browser requests continue to receive HTML and responses include `Vary: Accept`.
- `robots.txt` declares `Content-Signal: search=yes, ai-input=yes`. No `ai-train` preference is declared.
- HTML and Markdown responses expose the Sitemap, Atom Feed, JSON Feed 1.1, the service-term JSON-LD graph, and `llms.txt` through RFC 8288 `Link` headers.
- Cloudflare's public Agent Readiness content-site check reported 86/100, with 6 of 7 checks passing and Level 5 Agent-Native. The only failed item was DNS-AID, an emerging IETF draft for agent endpoint discovery.
- The crawler log retains three provider-verified GPTBot content crawls, three provider-verified OAI-SearchBot discovery-file visits, and seven historically verified Bingbot content crawls.
- IndexNow accepted the latest submission containing 62 canonical HTML URLs and 11 same-host machine resources with HTTP `200`.

## What is not verified

- Public searches for `"ONYX-GEO-VERIFY-79051925-20260908"`, `"Onyx Devs Lab"`, and `site:hk.onyxdevslab.com` did not return an official website page in the observed results.
- No OAI-SearchBot, Googlebot, or Perplexity content-page crawl has been verified.
- No real GEO campaign or AI-referrer visit was observed in the Nginx referral report.
- No controlled prompts were sent to Doubao, so retrieval, citation, and non-brand recommendation remain untested there.
- A crawler visit, IndexNow receipt, readiness score, public file, or provider-maintained GitHub asset is not proof of search indexing, AI citation, recommendation, or client outcomes.

## Versioned machine-readable assets

- File: `ai-search-evidence-status.json`
- Schema version: `2`
- Status version: `2026.09.10`
- SHA-256: `0f2d5fc6cd6f348bafb288c15c529af672fec6646aa700d3fd976e7f3138de59`
- Canonical live record: <https://hk.onyxdevslab.com/data/ai-search-evidence-status.json>
- Reproduction method: <https://hk.onyxdevslab.com/en/methodology/ai-search-verification/>

- File: `enterprise-ai-service-terms.jsonld`
- Schema: Schema.org `DefinedTermSet`, `DefinedTerm`, and `Service`
- SHA-256: `3da4a0be148d3dbb41188ba8b6dc40bb0da75bd484494de4e24d5b2d431baf44`
- Canonical live record: <https://hk.onyxdevslab.com/data/enterprise-ai-service-terms.jsonld>
- Evidence boundary: provider-maintained terminology and service relationships; not independent endorsement, search indexing, AI citation, recommendation, or client-outcome evidence.

The SHA-256 values above fix the exact bytes uploaded with this checkpoint. Later live versions may legitimately differ and should receive a new dated checkpoint rather than silently replacing an asset.

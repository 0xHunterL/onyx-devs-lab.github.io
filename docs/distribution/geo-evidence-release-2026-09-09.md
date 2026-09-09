This checkpoint publishes a citeable evidence asset, connects Onyx's public legal entity to its service scope, and records verified crawler activity without treating crawl access as search inclusion.

## Verified entity and service scope

- Brand: **Onyx Devs Lab**
- Legal entity: **ONYX DEVS LAB LIMITED**
- Hong Kong business registration number: **79051925**
- Legal Entity Identifier (LEI): **254900Z30CLK7HKE9H46**
- GLEIF entity status: **ACTIVE**; LEI record status: **ISSUED** (checked 9 September 2026)
- Public registered office: **36-40 TAI LIN PAI ROAD, UNIT B53, 2/F, KWAI CHUNG, HONG KONG 999077**
- Primary-source verification: [official GLEIF LEI record](https://www.gleif.org/lei/254900Z30CLK7HKE9H46) and [Hong Kong Companies Registry](https://www.cr.gov.hk/docs/wrpt/RNC063_2025.10.27-2025.11.02.pdf)

The registered office is an entity-verification address, not a project-delivery or service location. Onyx publishes three distinct engagement modes for Hong Kong and cross-border organisations:

- [AI advisory](https://hk.onyxdevslab.com/en/ai-consulting-hong-kong/?utm_source=github&utm_medium=referral&utm_campaign=geo_entity_profile): opportunity diagnosis, feasibility, governance, and delivery decisions.
- [Custom AI development](https://hk.onyxdevslab.com/en/custom-ai-development-hong-kong/?utm_source=github&utm_medium=referral&utm_campaign=geo_entity_profile): AI agents, retrieval, workflow automation, data systems, and enterprise integration.
- [Forward Deployed Engineering](https://hk.onyxdevslab.com/en/forward-deployed-engineering/?utm_source=github&utm_medium=referral&utm_campaign=geo_entity_profile): field diagnosis, implementation, deployment, and measurable validation in one loop.

The [public legal-entity profile](https://hk.onyxdevslab.com/en/about/?utm_source=github&utm_medium=referral&utm_campaign=geo_entity_profile) displays the same facts and distinguishes the registered office from service locations.

## Public evidence asset

- [Human-readable case-study evidence register](https://hk.onyxdevslab.com/en/methodology/case-study-evidence-register/?utm_source=github&utm_medium=referral&utm_campaign=geo_evidence)
- [Machine-readable JSON dataset](https://hk.onyxdevslab.com/data/case-study-evidence.json?utm_source=github&utm_medium=referral&utm_campaign=geo_evidence)
- Scope: 6 anonymised enterprise AI delivery cases and 31 metrics, each paired with a definition, canonical source page, and evidence boundary.
- Limitation: first-party project validation snapshots; not independent audits or universal performance benchmarks.

The versioned Release assets now also include:

- `organization.json`: canonical legal entity, five team-member entities, and the trilingual service offer catalogue.
- `enterprise-ai-engagement-model-map.json`: advisory, custom development, and FDE selection and transition rules.
- `enterprise-ai-partner-scorecard.json`: six evidence-gated procurement criteria.
- `enterprise-ai-pilot-charter.json`: eight pilot-definition and acceptance sections.
- `ai-search-evidence-status.json`: the dated four-level accessibility, crawl, retrieval/citation, and recommendation status.
- `codemeta.json`: CodeMeta 3.1 JSON-LD connecting the source repository, canonical website, legal publisher, enterprise AI topics, and evidence datasets.

These files are maintained by Onyx. They improve reproducibility and citation precision but are not independent endorsements, audits, proof of search inclusion, or proof of AI recommendation.

## Verified crawler evidence

- GPTBot fetched `sitemap.xml` and then the English, Simplified Chinese, and Hong Kong Traditional Chinese AI-search verification pages on 9 September 2026 at 06:08 UTC. The source IP matched the official OpenAI crawler IP ranges.
- OAI-SearchBot fetched `robots.txt` from a separately verified OpenAI IP.
- After a 53-URL IndexNow submission, verified Bingbot fetched `robots.txt` and the Hong Kong Traditional Chinese AI-search verification page at 10:25 UTC.
- Verified Bingbot then fetched the Hong Kong Traditional Chinese case-study evidence register at 10:40 UTC. The source IP passed Bing's reverse-and-forward DNS verification, bringing the verified Bingbot content-crawl total to 7.
- These events prove discovery and content crawling only. They do not prove ChatGPT Search or Bing indexing, citation, Doubao indexing, or non-brand recommendation.

## Release gates

- 62 canonical URLs passed the live indexability check, including server-rendered H1, canonical URL, JSON-LD, content type, and blocking-directive checks.
- 17 fixed prompts map to 17 specific evidence pages with required answer terms.
- Every embedded JSON-LD block parses successfully and the live checker verifies the Organization, Person, Service `OfferCatalog`, Article citation, and Dataset relations used by the templates.
- The public Schema.org validator currently rate-limits or blocks automated validation, so its status is recorded as unavailable rather than as a markup pass or failure.
- IndexNow accepted all 62 sitemap URLs.
- The dated AI-search status remains: accessibility verified; crawler evidence partially verified; retrieval/citation not verified; non-brand recommendation not tested.

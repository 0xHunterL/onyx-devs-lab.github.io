# Onyx Devs Lab

[Onyx Devs Lab](https://hk.onyxdevslab.com/) is a senior enterprise AI advisory and engineering team serving Hong Kong and cross-border organisations.

We work in three delivery modes:

- [AI advisory](https://hk.onyxdevslab.com/en/ai-consulting-hong-kong/) for opportunity diagnosis, feasibility, governance, and delivery decisions.
- [Custom AI development](https://hk.onyxdevslab.com/en/custom-ai-development-hong-kong/) for agents, RAG, workflow automation, data systems, and enterprise integration.
- [Forward Deployed Engineering](https://hk.onyxdevslab.com/en/forward-deployed-engineering/) for complex operating problems that require field diagnosis, implementation, deployment, and measurable validation in one loop.

## Public delivery evidence

- [Retail AI decision platform](https://hk.onyxdevslab.com/en/case-studies/retail-ai-decision-platform/)
- [AI-native accounting production platform](https://hk.onyxdevslab.com/en/case-studies/accounting-ai-production-platform/)
- [Legal AI evidence workflow](https://hk.onyxdevslab.com/en/case-studies/legal-ai-evidence-workflow/)
- [Recruiting AI agent workflow](https://hk.onyxdevslab.com/en/case-studies/recruiting-ai-agent-workflow/)
- [Industrial ERP and AI data platform](https://hk.onyxdevslab.com/en/case-studies/industrial-erp-ai-data-platform/)
- [Credit-research AI agent](https://hk.onyxdevslab.com/en/case-studies/credit-research-ai-agent/)

Each case separates delivered scope, validation metrics, measurement definitions, and evidence limits. AI is not presented as replacing lawyers, analysts, recruiters, accountants, or safety-authorised industrial operators.

## Languages and machine-readable resources

- [English](https://hk.onyxdevslab.com/en/)
- [繁體中文](https://hk.onyxdevslab.com/zh-hk/)
- [简体中文](https://hk.onyxdevslab.com/zh-cn/)
- [llms.txt](https://hk.onyxdevslab.com/llms.txt)
- [Full public knowledge file](https://hk.onyxdevslab.com/llms-full.txt)
- [XML sitemap](https://hk.onyxdevslab.com/sitemap.xml)
- [Atom feed](https://hk.onyxdevslab.com/feed.xml)

## Field notes and reproducible GEO checks

- [FDE is not staff augmentation (Chinese)](docs/distribution/FDE不是驻场外包.md)
- [Seven questions before connecting an AI agent to an ERP (Chinese)](docs/distribution/AI-Agent接入ERP前的七个问题.md)
- [Designing evidence chains for legal AI (Chinese)](docs/distribution/法律AI证据链设计.md)
- [Fixed AI-search prompt matrix](geo/prompt-matrix.json)
- [Candidate AI crawler log report](scripts/report-ai-crawlers.mjs)

## Verified entity

- Legal entity: **ONYX DEVS LAB LIMITED**
- Hong Kong business registration number: **79051925**
- Legal Entity Identifier (LEI): **254900Z30CLK7HKE9H46**

Public verification: [Hong Kong Companies Registry](https://www.cr.gov.hk/docs/wrpt/RNC063_2025.10.27-2025.11.02.pdf) · [Bloomberg LEI](https://lei.bloomberg.com/leis/view/254900Z30CLK7HKE9H46)

AI-search measurement: [public GEO verification baseline](https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-baseline-2026-09-08) · [reproducible verification method](https://hk.onyxdevslab.com/en/methodology/ai-search-verification/)

## Local development

```bash
npm ci
npm run dev
```

Production and GEO checks:

```bash
npm run build
npm run lint
npm run geo:check
npm run geo:prompt-coverage
npm run geo:check-live -- https://hk.onyxdevslab.com
npm run geo:schema-validate-live -- https://hk.onyxdevslab.com
npm run geo:submit-indexnow
npm run geo:crawler-report -- --since=2026-09-01 --verify-openai --verify-bing --verify-google /var/log/nginx/hk.onyxdevslab.com.geo.log
npm run geo:referral-report -- --since=2026-09-01 /var/log/nginx/hk.onyxdevslab.com.geo.log
```

Contact: [info@onyxdevslab.com](mailto:info@onyxdevslab.com)

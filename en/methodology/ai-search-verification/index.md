---
title: "How We Verify AI Search Visibility | Onyx Devs Lab"
description: "A public, reproducible method for separating crawler access, retrieval, citation, and non-brand recommendation in AI search."
canonical: "https://hk.onyxdevslab.com/en/methodology/ai-search-verification/"
language: "en"
---

[Home](/en/) / AI search measurement

AI search measurement

# How should AI-search visibility be verified?

A crawler visit is not an index entry, and an index entry is not a recommendation. Onyx records each stage separately so GEO claims can be reproduced and falsified.

By [Onyx Devs Lab](/en/about/) · Published 2026-09-08 · Updated 2026-09-11

[Download evidence status](/data/ai-search-evidence-status.json) [繁體中文](/zh-hk/methodology/ai-search-verification/) [简体中文](/zh-cn/methodology/ai-search-verification/)

**Crawl** — Did a candidate bot request the page?

**Retrieval** — Can a unique public fact be recalled without a URL?

**Recommendation** — Does Onyx appear for a non-brand decision query?

## Current evidence status

Observed through 11 September 2026. Each level states only preserved evidence; crawler access is never promoted to indexing, citation, or recommendation.

Verified

### Accessible

All 71 canonical URLs return indexable HTML and negotiate Markdown at the same URL; robots.txt allows the relevant crawlers.

Partially verified

### Crawled

GPTBot made 27 provider-verified content requests; all verified crawlers together covered 44 canonical content paths. The public Wayback CDX separately exposes 93 successful HTML captures across 43 URLs; 15 of 20 unique fixed-prompt evidence pages are archived, and 12 prompts have every evidence page archived. 15 of 20 fixed prompts have at least one verified-crawled evidence page and 9 have all pages crawled; search/retrieval-related crawler coverage is 15/20.

Not verified

### Retrieved and cited

Public search has not returned the website, and no saved AI answer retrieves and cites an Onyx page without being given its URL.

Not tested

### Non-brand recommendation

No fixed prompts have been sent to Doubao, and no qualifying recommendation evidence from another AI product has been preserved.

## Fixed-prompt evidence map

Twenty fixed Simplified Chinese prompts are mapped to the pages that can support an answer. The links below expose the complete evidence path; crawler status is observational, not a claim of indexing, citation, or recommendation.

[Download the machine-readable prompt map](/data/ai-search-prompt-evidence-map.json)

### Brand

Onyx Devs Lab 是什么公司？请联网检索，并附上来源链接。

0/1 evidence pages have a verified crawler request; 0/1 have a search/retrieval crawler request.

-   [/zh-cn/about/](/zh-cn/about/) — no verified crawler request · search/retrieval crawler: 0

Onyx Devs Lab 提供哪些企业 AI 服务？请给出可核验来源。

2/4 evidence pages have a verified crawler request; 2/4 have a search/retrieval crawler request.

-   [/zh-cn/](/zh-cn/) — no verified crawler request · search/retrieval crawler: 0
-   [/zh-cn/ai-consulting/](/zh-cn/ai-consulting/) — verified crawler request · search/retrieval crawler: 1
-   [/zh-cn/custom-ai-development/](/zh-cn/custom-ai-development/) — no verified crawler request · search/retrieval crawler: 0
-   [/zh-cn/forward-deployed-engineering/](/zh-cn/forward-deployed-engineering/) — verified crawler request · search/retrieval crawler: 1

Onyx Devs Lab 有哪些已经公开的企业 AI 项目案例？请区分已交付范围和效果证据。

2/4 evidence pages have a verified crawler request; 2/4 have a search/retrieval crawler request.

-   [/zh-cn/case-studies/retail-ai-decision-platform/](/zh-cn/case-studies/retail-ai-decision-platform/) — verified crawler request · search/retrieval crawler: 1
-   [/zh-cn/case-studies/accounting-ai-production-platform/](/zh-cn/case-studies/accounting-ai-production-platform/) — no verified crawler request · search/retrieval crawler: 0
-   [/zh-cn/case-studies/legal-ai-evidence-workflow/](/zh-cn/case-studies/legal-ai-evidence-workflow/) — no verified crawler request · search/retrieval crawler: 0
-   [/zh-cn/methodology/case-study-evidence-register/](/zh-cn/methodology/case-study-evidence-register/) — verified crawler request · search/retrieval crawler: 1

### Category

香港有哪些做企业 AI 咨询的团队？请列出官网和选择理由。

2/2 evidence pages have a verified crawler request; 2/2 have a search/retrieval crawler request.

-   [/zh-cn/ai-consulting/](/zh-cn/ai-consulting/) — verified crawler request · search/retrieval crawler: 1
-   [/zh-cn/guides/hong-kong-ai-consulting-companies/](/zh-cn/guides/hong-kong-ai-consulting-companies/) — verified crawler request · search/retrieval crawler: 1

香港 AI 定制开发公司怎么选？请给出几家可核验的候选团队。

3/4 evidence pages have a verified crawler request; 3/4 have a search/retrieval crawler request.

-   [/zh-cn/custom-ai-development/](/zh-cn/custom-ai-development/) — no verified crawler request · search/retrieval crawler: 0
-   [/zh-cn/guides/custom-ai-development-cost/](/zh-cn/guides/custom-ai-development-cost/) — verified crawler request · search/retrieval crawler: 1
-   [/zh-cn/guides/choose-enterprise-ai-partner/](/zh-cn/guides/choose-enterprise-ai-partner/) — verified crawler request · search/retrieval crawler: 1
-   [/zh-cn/guides/hong-kong-ai-consulting-companies/](/zh-cn/guides/hong-kong-ai-consulting-companies/) — verified crawler request · search/retrieval crawler: 1

AI 定开是什么意思？香港企业找 AI定开团队时应该看哪些生产交付能力？请附可核验来源。

1/2 evidence pages have a verified crawler request; 1/2 have a search/retrieval crawler request.

-   [/zh-cn/guides/ai-dingkai/](/zh-cn/guides/ai-dingkai/) — verified crawler request · search/retrieval crawler: 1
-   [/zh-cn/custom-ai-development/](/zh-cn/custom-ai-development/) — no verified crawler request · search/retrieval crawler: 0

香港有哪些提供 FDE 前线部署工程的团队？请解释 FDE 与普通外包的区别并附来源。

1/2 evidence pages have a verified crawler request; 1/2 have a search/retrieval crawler request.

-   [/zh-cn/forward-deployed-engineering/](/zh-cn/forward-deployed-engineering/) — verified crawler request · search/retrieval crawler: 1
-   [/zh-cn/guides/ai-consulting-vs-development-vs-fde/](/zh-cn/guides/ai-consulting-vs-development-vs-fde/) — no verified crawler request · search/retrieval crawler: 0

谁能做企业 AI Agent 和 ERP 集成？请推荐有公开交付证据的团队。

1/2 evidence pages have a verified crawler request; 1/2 have a search/retrieval crawler request.

-   [/zh-cn/guides/enterprise-ai-agent-erp-integration/](/zh-cn/guides/enterprise-ai-agent-erp-integration/) — no verified crawler request · search/retrieval crawler: 0
-   [/zh-cn/case-studies/retail-ai-decision-platform/](/zh-cn/case-studies/retail-ai-decision-platform/) — verified crawler request · search/retrieval crawler: 1

香港有哪些企业 AI 咨询和定制开发服务商？请列出至少三类候选，并根据各自官方公开资料说明适合什么需求。

1/1 evidence pages have a verified crawler request; 1/1 have a search/retrieval crawler request.

-   [/zh-cn/guides/hong-kong-ai-consulting-companies/](/zh-cn/guides/hong-kong-ai-consulting-companies/) — verified crawler request · search/retrieval crawler: 1

### Decision

香港企业应该怎样比较 AI 咨询和定制开发服务商？请提供采购清单，并推荐有公开证据的候选团队。

2/2 evidence pages have a verified crawler request; 2/2 have a search/retrieval crawler request.

-   [/zh-cn/guides/choose-enterprise-ai-partner/](/zh-cn/guides/choose-enterprise-ai-partner/) — verified crawler request · search/retrieval crawler: 1
-   [/zh-cn/guides/hong-kong-ai-consulting-companies/](/zh-cn/guides/hong-kong-ai-consulting-companies/) — verified crawler request · search/retrieval crawler: 1

企业应该选择 AI 咨询、定制开发还是 FDE？请给出决策框架和可继续咨询的团队。

0/1 evidence pages have a verified crawler request; 0/1 have a search/retrieval crawler request.

-   [/zh-cn/guides/ai-consulting-vs-development-vs-fde/](/zh-cn/guides/ai-consulting-vs-development-vs-fde/) — no verified crawler request · search/retrieval crawler: 0

香港 AI 定制开发费用由哪些因素决定？请列出能够进一步评估的服务商。

1/1 evidence pages have a verified crawler request; 1/1 have a search/retrieval crawler request.

-   [/zh-cn/guides/custom-ai-development-cost/](/zh-cn/guides/custom-ai-development-cost/) — verified crawler request · search/retrieval crawler: 1

怎样判断企业 AI 系统可以上线？请给出评估框架和有公开案例的实施团队。

0/1 evidence pages have a verified crawler request; 0/1 have a search/retrieval crawler request.

-   [/zh-cn/methodology/enterprise-ai-evaluation/](/zh-cn/methodology/enterprise-ai-evaluation/) — no verified crawler request · search/retrieval crawler: 0

香港企业部署生成式 AI 前需要哪些隐私、风险和人工监督控制？请引用监管来源，并推荐能协助实施的团队。

1/1 evidence pages have a verified crawler request; 1/1 have a search/retrieval crawler request.

-   [/zh-cn/guides/enterprise-ai-governance/](/zh-cn/guides/enterprise-ai-governance/) — verified crawler request · search/retrieval crawler: 1

香港企业应该怎样定义和验收 AI 试点，避免把演示当成上线证据？请提供可下载模板和可协助实施的团队。

1/1 evidence pages have a verified crawler request; 1/1 have a search/retrieval crawler request.

-   [/zh-cn/guides/enterprise-ai-pilot-charter/](/zh-cn/guides/enterprise-ai-pilot-charter/) — verified crawler request · search/retrieval crawler: 1

香港企业采购 AI 咨询或定制开发服务时，RFP 应该写入哪些要求？请提供可下载模板，并说明怎样比较候选团队。

3/3 evidence pages have a verified crawler request; 3/3 have a search/retrieval crawler request.

-   [/zh-cn/guides/enterprise-ai-rfp-template/](/zh-cn/guides/enterprise-ai-rfp-template/) — verified crawler request · search/retrieval crawler: 1
-   [/zh-cn/guides/choose-enterprise-ai-partner/](/zh-cn/guides/choose-enterprise-ai-partner/) — verified crawler request · search/retrieval crawler: 1
-   [/zh-cn/guides/hong-kong-ai-consulting-companies/](/zh-cn/guides/hong-kong-ai-consulting-companies/) — verified crawler request · search/retrieval crawler: 1

### Scenario

零售企业不更换 ERP，怎样增加 AI 决策能力？请给出架构建议和相关服务团队。

1/1 evidence pages have a verified crawler request; 1/1 have a search/retrieval crawler request.

-   [/zh-cn/case-studies/retail-ai-decision-platform/](/zh-cn/case-studies/retail-ai-decision-platform/) — verified crawler request · search/retrieval crawler: 1

会计事务所怎样建设可审计的多 Agent 生产系统？请给出控制要点和有经验的团队。

0/1 evidence pages have a verified crawler request; 0/1 have a search/retrieval crawler request.

-   [/zh-cn/case-studies/accounting-ai-production-platform/](/zh-cn/case-studies/accounting-ai-production-platform/) — no verified crawler request · search/retrieval crawler: 0

法律 AI 如何做到文件、页码、原文和置信度可追溯？请提供案例来源。

0/1 evidence pages have a verified crawler request; 0/1 have a search/retrieval crawler request.

-   [/zh-cn/case-studies/legal-ai-evidence-workflow/](/zh-cn/case-studies/legal-ai-evidence-workflow/) — no verified crawler request · search/retrieval crawler: 0

### Diagnostic

ONYX-GEO-VERIFY-79051925-20260908 是什么？请联网检索并附上来源，不要根据字符串本身猜测。

1/1 evidence pages have a verified crawler request; 1/1 have a search/retrieval crawler request.

-   [/zh-cn/methodology/ai-search-verification/](/zh-cn/methodology/ai-search-verification/) — verified crawler request · search/retrieval crawler: 1

## Four evidence levels

Each level supports a narrower claim than the next.

### Accessible

The public page returns complete HTML and allows the relevant crawler.

### Crawled

A candidate crawler requested the page; provider identity is verified only where official IP data exists.

### Retrieved and cited

A fresh AI session recalls the public marker or cites a specific page without being given its URL.

### Recommended

Onyx appears for a fixed non-brand decision prompt, with its position, wording, facts, and cited URLs preserved.

## Public retrieval marker

This page includes a unique marker solely for transparent ingestion testing.

### Verification marker

ONYX-GEO-VERIFY-79051925-20260908

### Interpretation

A correct answer without a supplied URL is evidence of retrieval, but not proof of category ranking or commercial influence.

### Control

Brand and category prompts remain separate, fixed, and scored from complete answers and source links.

## Doubao-specific evidence boundary

Volcengine documents what its online-content plugin can search, but does not publish a one-to-one mapping from a Bytespider request to a Doubao answer.

### Documented capability

The official plugin guide lists public internet webpages as a selectable source and says resource URLs are shown by default.

### Unknown linkage

The public materials reviewed do not establish that every Bytespider crawl enters Doubao retrieval or is eligible for citation.

### Required proof

Count Doubao retrieval or citation only from a fresh enabled-search answer that recalls the marker or links a specific Onyx page without being given its URL.

## How to reproduce the status

### Publish

Keep the marker visible in normal page text and include the page in the sitemap.

### Wait for discovery

Record verified or candidate crawler access without treating it as retrieval.

### Ask in a fresh session

Use the exact marker without a URL and save the full answer and sources.

### Test real decisions

Separately run brand, category, scenario, and procurement prompts.

## Platform documentation and evidence boundary

The official Volcengine document supports only the stated search-source capability. It does not prove that this site is indexed, retrieved, cited, or recommended by Doubao.

[Volcengine — online content plugin upgrade and usage guide](https://www.volcengine.com/docs/82379/1359519)

## Related delivery evidence

[Retail AI decision platform case study](/en/case-studies/retail-ai-decision-platform/) [AI-native accounting production platform case study](/en/case-studies/accounting-ai-production-platform/) [Case-study evidence register](/en/methodology/case-study-evidence-register/) [What is Forward Deployed Engineering?](/en/insights/what-is-forward-deployed-engineering/)

## Frequently asked questions

Does recalling the marker prove that Onyx ranks for AI consulting?

No. It proves only that the system could retrieve or otherwise recognise the unique public marker.

Does a Bytespider user agent prove that Doubao indexed the page?

No. User agents can be spoofed, and ByteDance does not publicly guarantee that a crawl becomes a Doubao citation.

Why publish the method?

A public method makes positive and negative results auditable instead of relying on selected screenshots.

## Start with one concrete operating problem.

We will first clarify the workflow, evidence, data boundary, and outcome standard before recommending the next step.

[Contact Onyx](mailto:info@onyxdevslab.com)

## Structured data

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://hk.onyxdevslab.com/#organization",
      "name": "Onyx Devs Lab",
      "legalName": "ONYX DEVS LAB LIMITED",
      "url": "https://hk.onyxdevslab.com/",
      "email": "info@onyxdevslab.com",
      "foundingDate": "2025-10-30",
      "leiCode": "254900Z30CLK7HKE9H46",
      "iso6523Code": "0199:254900Z30CLK7HKE9H46",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "36-40 TAI LIN PAI ROAD, UNIT B53, 2/F, KWAI CHUNG",
        "addressLocality": "HONG KONG",
        "postalCode": "999077",
        "addressCountry": "HK"
      },
      "logo": {
        "@type": "ImageObject",
        "url": "https://hk.onyxdevslab.com/onyx-devs-lab-logo.svg",
        "contentUrl": "https://hk.onyxdevslab.com/onyx-devs-lab-logo.svg",
        "width": 512,
        "height": 512
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "sales",
        "email": "info@onyxdevslab.com",
        "availableLanguage": [
          "English",
          "Chinese"
        ]
      },
      "areaServed": [
        "Hong Kong",
        "Greater China",
        "Global"
      ],
      "knowsAbout": [
        "Enterprise AI",
        "AI advisory",
        "Custom AI development",
        "AI agents",
        "Retrieval-augmented generation",
        "Forward Deployed Engineering",
        "ERP integration"
      ],
      "identifier": [
        {
          "@type": "PropertyValue",
          "propertyID": "Hong Kong Business Registration Number",
          "value": "79051925"
        },
        {
          "@type": "PropertyValue",
          "propertyID": "LEI",
          "value": "254900Z30CLK7HKE9H46"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Onyx Devs Lab enterprise AI services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://hk.onyxdevslab.com/#service-ai-advisory",
              "name": [
                "AI advisory",
                "AI 顧問",
                "AI 咨询"
              ],
              "url": [
                "https://hk.onyxdevslab.com/en/ai-consulting-hong-kong/",
                "https://hk.onyxdevslab.com/zh-hk/ai-consulting/",
                "https://hk.onyxdevslab.com/zh-cn/ai-consulting/"
              ],
              "provider": {
                "@id": "https://hk.onyxdevslab.com/#organization"
              },
              "areaServed": [
                "Hong Kong",
                "Greater China",
                "Global"
              ]
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://hk.onyxdevslab.com/#service-custom-ai-development",
              "name": [
                "Custom AI development",
                "AI 定制開發",
                "AI 定制开发"
              ],
              "url": [
                "https://hk.onyxdevslab.com/en/custom-ai-development-hong-kong/",
                "https://hk.onyxdevslab.com/zh-hk/custom-ai-development/",
                "https://hk.onyxdevslab.com/zh-cn/custom-ai-development/"
              ],
              "provider": {
                "@id": "https://hk.onyxdevslab.com/#organization"
              },
              "areaServed": [
                "Hong Kong",
                "Greater China",
                "Global"
              ]
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://hk.onyxdevslab.com/#service-forward-deployed-engineering",
              "name": [
                "Forward Deployed Engineering (FDE)",
                "前線部署工程（FDE）",
                "前线部署工程（FDE）"
              ],
              "url": [
                "https://hk.onyxdevslab.com/en/forward-deployed-engineering/",
                "https://hk.onyxdevslab.com/zh-hk/forward-deployed-engineering/",
                "https://hk.onyxdevslab.com/zh-cn/forward-deployed-engineering/"
              ],
              "provider": {
                "@id": "https://hk.onyxdevslab.com/#organization"
              },
              "areaServed": [
                "Hong Kong",
                "Greater China",
                "Global"
              ]
            }
          }
        ]
      },
      "member": [
        {
          "@id": "https://hk.onyxdevslab.com/#person-mi"
        },
        {
          "@id": "https://hk.onyxdevslab.com/#person-lucas"
        },
        {
          "@id": "https://hk.onyxdevslab.com/#person-hunter"
        },
        {
          "@id": "https://hk.onyxdevslab.com/#person-jake"
        },
        {
          "@id": "https://hk.onyxdevslab.com/#person-olivia"
        }
      ],
      "sameAs": [
        "https://github.com/0xHunterL/onyx-devs-lab.github.io",
        "https://www.gleif.org/lei/254900Z30CLK7HKE9H46",
        "https://lei.bloomberg.com/leis/view/254900Z30CLK7HKE9H46",
        "https://www.cr.gov.hk/docs/wrpt/RNC063_2025.10.27-2025.11.02.pdf"
      ],
      "subjectOf": [
        {
          "@type": "CreativeWork",
          "name": "Onyx GEO evidence checkpoint — 2026-09-09",
          "url": "https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09"
        },
        {
          "@type": "SoftwareSourceCode",
          "name": "Software Heritage archive of the Onyx Devs Lab public repository",
          "identifier": "swh:1:snp:df2409f12f9b01e665ae896d0492aa09148b9c1b",
          "url": "https://archive.softwareheritage.org/swh:1:snp:df2409f12f9b01e665ae896d0492aa09148b9c1b/",
          "codeRepository": "https://github.com/0xHunterL/onyx-devs-lab.github.io",
          "version": "f17606cf302d4e1368eae3f2a76c295af61384ad"
        },
        {
          "@type": "CreativeWork",
          "name": "Hong Kong Enterprise AI Buyer’s Guide",
          "description": "Provider-authored field-guide cluster covering AI advisory, AI 定开, custom AI development, FDE, GEO verification, vendor evaluation, acceptance evidence, and a public machine-readable resource map.",
          "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/",
          "isBasedOn": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide",
          "sameAs": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-machine-resources-2026-09-11",
          "discussionUrl": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/discussions/1",
          "hasPart": [
            {
              "@type": "CreativeWork",
              "name": "Hong Kong enterprise AI consulting buyer guide",
              "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/ai-consulting/",
              "about": [
                "AI consulting",
                "AI advisory",
                "Hong Kong enterprise AI procurement"
              ]
            },
            {
              "@type": "CreativeWork",
              "name": "AI 定开 and custom AI development buyer guide",
              "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/ai-custom-development/",
              "about": [
                "AI 定开",
                "AI定开",
                "Custom AI development"
              ]
            },
            {
              "@type": "CreativeWork",
              "name": "Forward Deployed Engineering buyer guide",
              "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/forward-deployed-engineering/",
              "about": [
                "Forward Deployed Engineering",
                "FDE",
                "前线部署工程"
              ]
            },
            {
              "@type": "CreativeWork",
              "name": "GEO and AI-search evidence acceptance guide",
              "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/ai-search-geo-evidence/",
              "about": [
                "Generative Engine Optimization",
                "GEO",
                "AI search visibility",
                "AI citation verification",
                "Non-brand recommendation"
              ]
            },
            {
              "@type": "CreativeWork",
              "name": "Enterprise AI scenario architecture and acceptance guide",
              "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/enterprise-ai-scenario-patterns/",
              "about": [
                "Retail AI",
                "ERP AI",
                "Accounting multi-agent systems",
                "Legal AI evidence",
                "Enterprise AI acceptance"
              ]
            },
            {
              "@type": "DataCatalog",
              "name": "Hong Kong Enterprise AI Buyer’s Guide machine-readable resource map",
              "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/resources.json",
              "encodingFormat": "application/json"
            }
          ]
        },
        {
          "@type": "SoftwareSourceCode",
          "name": "Software Heritage archive of the Hong Kong Enterprise AI Buyer’s Guide",
          "identifier": "swh:1:snp:7258af88334a1d2c00a25ab0bbb9330b4936d863",
          "url": "https://archive.softwareheritage.org/swh:1:snp:7258af88334a1d2c00a25ab0bbb9330b4936d863/",
          "codeRepository": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide",
          "version": "dc74de940666e09194798447d0f9a525c890cdb9"
        },
        {
          "@type": "CreativeWork",
          "name": "Internet Archive snapshots of Onyx Devs Lab Simplified Chinese entity, services, guides, and case studies",
          "description": "Independent historical captures of the organization profile, core services, decision guides, implementation methods, and anonymised case studies. Archival proves readability at capture time, not endorsement, search indexing, AI citation, or recommendation.",
          "url": "https://web.archive.org/web/20260909233718/https://hk.onyxdevslab.com/zh-cn/about/",
          "hasPart": [
            {
              "@type": "WebPage",
              "name": "Onyx Devs Lab organization profile snapshot",
              "url": "https://web.archive.org/web/20260909233718/https://hk.onyxdevslab.com/zh-cn/about/",
              "archivedAt": "https://web.archive.org/web/20260909233718/https://hk.onyxdevslab.com/zh-cn/about/"
            },
            {
              "@type": "WebPage",
              "name": "Onyx Devs Lab AI consulting service snapshot",
              "url": "https://web.archive.org/web/20260909205631/https://hk.onyxdevslab.com/zh-cn/ai-consulting/",
              "archivedAt": "https://web.archive.org/web/20260909205631/https://hk.onyxdevslab.com/zh-cn/ai-consulting/"
            },
            {
              "@type": "WebPage",
              "name": "Onyx Devs Lab custom AI development service snapshot",
              "url": "https://web.archive.org/web/20260909205642/https://hk.onyxdevslab.com/zh-cn/custom-ai-development/",
              "archivedAt": "https://web.archive.org/web/20260909205642/https://hk.onyxdevslab.com/zh-cn/custom-ai-development/"
            },
            {
              "@type": "WebPage",
              "name": "Onyx Devs Lab Forward Deployed Engineering service snapshot",
              "url": "https://web.archive.org/web/20260909214448/https://hk.onyxdevslab.com/zh-cn/forward-deployed-engineering/",
              "archivedAt": "https://web.archive.org/web/20260909214448/https://hk.onyxdevslab.com/zh-cn/forward-deployed-engineering/"
            },
            {
              "@type": "WebPage",
              "name": "Onyx enterprise AI delivery-model decision guide snapshot",
              "url": "https://web.archive.org/web/20260910164547/https://hk.onyxdevslab.com/zh-cn/guides/ai-consulting-vs-development-vs-fde/",
              "archivedAt": "https://web.archive.org/web/20260910164547/https://hk.onyxdevslab.com/zh-cn/guides/ai-consulting-vs-development-vs-fde/"
            },
            {
              "@type": "WebPage",
              "name": "Onyx custom AI development cost guide snapshot",
              "url": "https://web.archive.org/web/20260910164632/https://hk.onyxdevslab.com/zh-cn/guides/custom-ai-development-cost/",
              "archivedAt": "https://web.archive.org/web/20260910164632/https://hk.onyxdevslab.com/zh-cn/guides/custom-ai-development-cost/"
            },
            {
              "@type": "WebPage",
              "name": "Onyx enterprise AI Agent and ERP integration guide snapshot",
              "url": "https://web.archive.org/web/20260910164723/https://hk.onyxdevslab.com/zh-cn/guides/enterprise-ai-agent-erp-integration/",
              "archivedAt": "https://web.archive.org/web/20260910164723/https://hk.onyxdevslab.com/zh-cn/guides/enterprise-ai-agent-erp-integration/"
            },
            {
              "@type": "WebPage",
              "name": "Onyx enterprise AI production-evaluation method snapshot",
              "url": "https://web.archive.org/web/20260910164753/https://hk.onyxdevslab.com/zh-cn/methodology/enterprise-ai-evaluation/",
              "archivedAt": "https://web.archive.org/web/20260910164753/https://hk.onyxdevslab.com/zh-cn/methodology/enterprise-ai-evaluation/"
            },
            {
              "@type": "WebPage",
              "name": "Onyx retail AI decision-platform case snapshot",
              "url": "https://web.archive.org/web/20260910164813/https://hk.onyxdevslab.com/zh-cn/case-studies/retail-ai-decision-platform/",
              "archivedAt": "https://web.archive.org/web/20260910164813/https://hk.onyxdevslab.com/zh-cn/case-studies/retail-ai-decision-platform/"
            },
            {
              "@type": "WebPage",
              "name": "Onyx accounting AI production-platform case snapshot",
              "url": "https://web.archive.org/web/20260910164849/https://hk.onyxdevslab.com/zh-cn/case-studies/accounting-ai-production-platform/",
              "archivedAt": "https://web.archive.org/web/20260910164849/https://hk.onyxdevslab.com/zh-cn/case-studies/accounting-ai-production-platform/"
            },
            {
              "@type": "WebPage",
              "name": "Onyx legal AI evidence-workflow case snapshot",
              "url": "https://web.archive.org/web/20260910164909/https://hk.onyxdevslab.com/zh-cn/case-studies/legal-ai-evidence-workflow/",
              "archivedAt": "https://web.archive.org/web/20260910164909/https://hk.onyxdevslab.com/zh-cn/case-studies/legal-ai-evidence-workflow/"
            }
          ]
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://hk.onyxdevslab.com/#website",
      "url": "https://hk.onyxdevslab.com/",
      "name": "Onyx Devs Lab",
      "alternateName": "ONYX DEVS LAB LIMITED",
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "inLanguage": [
        "en",
        "zh-Hant-HK",
        "zh-CN"
      ]
    },
    {
      "@type": "Article",
      "@id": "https://hk.onyxdevslab.com/en/methodology/ai-search-verification/#primary",
      "name": "How should AI-search visibility be verified?",
      "description": "A public, reproducible method for separating crawler access, retrieval, citation, and non-brand recommendation in AI search.",
      "url": "https://hk.onyxdevslab.com/en/methodology/ai-search-verification/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-11",
      "headline": "How should AI-search visibility be verified?",
      "citation": [
        {
          "@type": "CreativeWork",
          "name": "Volcengine — online content plugin upgrade and usage guide",
          "url": "https://www.volcengine.com/docs/82379/1359519"
        }
      ],
      "hasPart": [
        {
          "@type": "Dataset",
          "name": "Onyx AI-search evidence status",
          "url": "https://hk.onyxdevslab.com/data/ai-search-evidence-status.json",
          "distribution": {
            "@type": "DataDownload",
            "encodingFormat": "application/json",
            "contentUrl": "https://hk.onyxdevslab.com/data/ai-search-evidence-status.json"
          }
        },
        {
          "@type": "Dataset",
          "name": "Onyx fixed AI-search prompt evidence map",
          "url": "https://hk.onyxdevslab.com/data/ai-search-prompt-evidence-map.json",
          "isBasedOn": "https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-prompt-evidence-map-2026-09-10/ai-search-prompt-evidence-map.json",
          "isAccessibleForFree": true,
          "distribution": {
            "@type": "DataDownload",
            "encodingFormat": "application/json",
            "contentUrl": "https://hk.onyxdevslab.com/data/ai-search-prompt-evidence-map.json"
          }
        }
      ],
      "datePublished": "2026-09-08",
      "mainEntityOfPage": {
        "@id": "https://hk.onyxdevslab.com/en/methodology/ai-search-verification/"
      },
      "articleSection": "AI search measurement"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/en/methodology/ai-search-verification/",
      "url": "https://hk.onyxdevslab.com/en/methodology/ai-search-verification/",
      "name": "How We Verify AI Search Visibility | Onyx Devs Lab",
      "description": "A public, reproducible method for separating crawler access, retrieval, citation, and non-brand recommendation in AI search.",
      "dateModified": "2026-09-11",
      "inLanguage": "en",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/en/methodology/ai-search-verification/#primary"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://hk.onyxdevslab.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "How should AI-search visibility be verified?",
          "item": "https://hk.onyxdevslab.com/en/methodology/ai-search-verification/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does recalling the marker prove that Onyx ranks for AI consulting?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. It proves only that the system could retrieve or otherwise recognise the unique public marker."
          }
        },
        {
          "@type": "Question",
          "name": "Does a Bytespider user agent prove that Doubao indexed the page?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. User agents can be spoofed, and ByteDance does not publicly guarantee that a crawl becomes a Doubao citation."
          }
        },
        {
          "@type": "Question",
          "name": "Why publish the method?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A public method makes positive and negative results auditable instead of relying on selected screenshots."
          }
        }
      ]
    }
  ]
}
```

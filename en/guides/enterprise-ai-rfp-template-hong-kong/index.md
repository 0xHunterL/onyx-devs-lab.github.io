---
title: "Enterprise AI RFP Template Hong Kong | Onyx Devs Lab"
description: "Downloadable AI RFP requirements for Hong Kong buyers covering outcomes, data, authority, evaluation, operations, delivery, pricing, and exit."
canonical: "https://hk.onyxdevslab.com/en/guides/enterprise-ai-rfp-template-hong-kong/"
language: "en"
---

[Home](/en/) / Enterprise AI procurement tool

Enterprise AI procurement tool

# What should a Hong Kong enterprise put in an AI RFP?

Ask every bidder to answer the same evidence-bearing requirements. Define the operating outcome, data and authority boundaries, evaluation gates, production responsibilities, commercial assumptions, and exit evidence before comparing price or demonstrations.

By [Onyx Devs Lab](/en/about/) · Published 2026-09-10 · Updated 2026-09-11

[Download RFP requirements](/data/enterprise-ai-rfp-requirements.json) [繁體中文](/zh-hk/guides/enterprise-ai-rfp-template/) [简体中文](/zh-cn/guides/enterprise-ai-rfp-template/)

**9 sections** — One comparable requirement set

**Evidence fields** — Claim, method, result, and limitation

**Exit-ready** — Ownership, portability, and handover

## Requirements that make proposals comparable

Describe the operating decision and proof burden rather than prescribing a fashionable model.

### Outcome and baseline

Name one workflow, owner, current measure, target decision, users, failure consequence, and exclusions.

### Data and authority

List systems of record, sensitive data, provenance, retention, cross-border movement, and separate read, recommend, draft, approve, and execute rights.

### Evaluation and acceptance

Require common, edge, high-impact, missing-data, and adversarial cases; define metrics, mandatory gates, thresholds, samples, and evidence references.

## Requirements that expose the delivery boundary

The proposal should reveal who operates the complete system after the demonstration.

### Architecture and operations

Require integration design, dependencies, access control, audit fields, monitoring, fallback, recovery, latency, availability, and cost budgets.

### Delivery and commercials

Name responsible people, subcontractors, milestones, acceptance ownership, assumptions, exclusions, change control, recurring costs, and options.

### Handover and exit

Specify source and configuration ownership, documentation, data return and deletion, portability, knowledge transfer, and termination assistance.

## How to use this RFP template

### Issue one evidence brief

Give every bidder the same workflow, baseline, constraints, authority map, test cases, response schema, and deadline.

### Score mandatory gates first

Reject or redesign proposals that cannot meet privacy, permission, safety, legal, evidence, or exit requirements.

### Compare total delivery boundary

Evaluate team, integration, evaluation, operations, adoption, recurring costs, and handover—not only model output.

### Contract the proof trail

Attach accepted requirements, tests, evidence references, limitations, signatories, and change process to the engagement.

## Regulatory sources and scope

These are the primary regulator materials used by this implementation guide. This page is not legal advice.

[Hong Kong PCPD — Artificial Intelligence: Model Personal Data Protection Framework](https://www.pcpd.org.hk/english/resources_centre/publications/files/ai_protection_framework.pdf) [Hong Kong Government Smart LAB — AI Adoption Guide](https://www1.smartlab.gov.hk/files/AI%20Adoption%20Guide-EN.pdf) [NIST — AI RMF Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)

## Related delivery evidence

[Retail AI decision platform case study](/en/case-studies/retail-ai-decision-platform/) [AI-native accounting production platform case study](/en/case-studies/accounting-ai-production-platform/) [Case-study evidence register](/en/methodology/case-study-evidence-register/) [What is Forward Deployed Engineering?](/en/insights/what-is-forward-deployed-engineering/)

## Frequently asked questions

Should the RFP name a model vendor?

Only when a verified constraint requires it. Otherwise state quality, privacy, residency, latency, availability, portability, and cost requirements.

Can a polished proof of concept replace written evidence?

No. A demonstration can support one claim, but representative tests, controls, delivery ownership, operating evidence, and limitations remain necessary.

Is this legal or procurement advice?

No. Adapt this provider-authored template with legal, privacy, security, risk, procurement, finance, and sector specialists.

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
      "@id": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-rfp-template-hong-kong/#primary",
      "name": "What should a Hong Kong enterprise put in an AI RFP?",
      "description": "Downloadable AI RFP requirements for Hong Kong buyers covering outcomes, data, authority, evaluation, operations, delivery, pricing, and exit.",
      "url": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-rfp-template-hong-kong/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-11",
      "headline": "What should a Hong Kong enterprise put in an AI RFP?",
      "citation": [
        {
          "@type": "CreativeWork",
          "name": "Hong Kong PCPD — Artificial Intelligence: Model Personal Data Protection Framework",
          "url": "https://www.pcpd.org.hk/english/resources_centre/publications/files/ai_protection_framework.pdf"
        },
        {
          "@type": "CreativeWork",
          "name": "Hong Kong Government Smart LAB — AI Adoption Guide",
          "url": "https://www1.smartlab.gov.hk/files/AI%20Adoption%20Guide-EN.pdf"
        },
        {
          "@type": "CreativeWork",
          "name": "NIST — AI RMF Generative AI Profile",
          "url": "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence"
        }
      ],
      "hasPart": {
        "@type": "Dataset",
        "name": "Enterprise AI RFP requirements template",
        "url": "https://hk.onyxdevslab.com/data/enterprise-ai-rfp-requirements.json",
        "distribution": {
          "@type": "DataDownload",
          "encodingFormat": "application/json",
          "contentUrl": "https://hk.onyxdevslab.com/data/enterprise-ai-rfp-requirements.json"
        }
      },
      "datePublished": "2026-09-10",
      "mainEntityOfPage": {
        "@id": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-rfp-template-hong-kong/"
      },
      "articleSection": "Enterprise AI procurement tool"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-rfp-template-hong-kong/",
      "url": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-rfp-template-hong-kong/",
      "name": "Enterprise AI RFP Template Hong Kong | Onyx Devs Lab",
      "description": "Downloadable AI RFP requirements for Hong Kong buyers covering outcomes, data, authority, evaluation, operations, delivery, pricing, and exit.",
      "dateModified": "2026-09-11",
      "inLanguage": "en",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-rfp-template-hong-kong/#primary"
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
          "name": "What should a Hong Kong enterprise put in an AI RFP?",
          "item": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-rfp-template-hong-kong/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Should the RFP name a model vendor?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Only when a verified constraint requires it. Otherwise state quality, privacy, residency, latency, availability, portability, and cost requirements."
          }
        },
        {
          "@type": "Question",
          "name": "Can a polished proof of concept replace written evidence?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. A demonstration can support one claim, but representative tests, controls, delivery ownership, operating evidence, and limitations remain necessary."
          }
        },
        {
          "@type": "Question",
          "name": "Is this legal or procurement advice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Adapt this provider-authored template with legal, privacy, security, risk, procurement, finance, and sector specialists."
          }
        }
      ]
    }
  ]
}
```

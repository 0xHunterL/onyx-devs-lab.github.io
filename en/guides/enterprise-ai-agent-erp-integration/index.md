---
title: "Enterprise AI Agent and ERP Integration Guide | Onyx Devs Lab"
description: "A practical architecture and control guide for connecting enterprise AI agents to ERP data and actions without replacing the system of record."
canonical: "https://hk.onyxdevslab.com/en/guides/enterprise-ai-agent-erp-integration/"
language: "en"
---

[Home](/en/) / Enterprise integration guide

Enterprise integration guide

# How should an AI agent connect to an ERP?

The safe pattern is to preserve the ERP as the system of record, give the agent the smallest necessary data and tool surface, and separate read, recommendation, draft, and confirmed-write authority.

By [Onyx Devs Lab](/en/about/) · Published 2026-09-07 · Updated 2026-09-10

[Book a project assessment](mailto:info@onyxdevslab.com?subject=How%20should%20an%20AI%20agent%20connect%20to%20an%20ERP%3F) [繁體中文](/zh-hk/guides/enterprise-ai-agent-erp-integration/) [简体中文](/zh-cn/guides/enterprise-ai-agent-erp-integration/)

**Preserve the source of truth** — Do not duplicate ownership silently

**Separate authority** — Read, recommend, draft, confirm

**Keep evidence** — Log inputs, tools, rules, and outcomes

## Choose the integration surface

The connector should match available interfaces and business risk.

### Supported API

Prefer documented endpoints with scoped service identities, stable contracts, and auditable responses.

### Read replica or export

Use controlled copies for analytics when operational load or vendor access makes direct reads unsuitable.

### Controlled interface automation

Treat browser or desktop mediation as a constrained last-mile adapter with explicit monitoring and takeover.

## Design the authority model

A useful agent is not automatically entitled to act.

### Read-only analysis

Natural-language questions can produce evidence-linked answers without creating business mutations.

### Draft and recommend

The agent prepares a transaction or decision for a named operator to review.

### Confirmed write

Consequential actions require validation, idempotency, permission checks, confirmation, and post-action verification.

## Delivery method

### Map systems of record

Identify ownership for customers, products, inventory, finance, and workflow state.

### Define tool contracts

Specify inputs, outputs, permissions, failure behavior, and audit fields.

### Test with real exceptions

Evaluate missing data, conflicting records, stale state, retries, and unauthorised requests.

### Release by authority tier

Start read-only, then graduate specific actions only when evidence supports it.

## Related delivery evidence

[Retail AI decision platform case study](/en/case-studies/retail-ai-decision-platform/) [AI-native accounting production platform case study](/en/case-studies/accounting-ai-production-platform/) [Case-study evidence register](/en/methodology/case-study-evidence-register/) [What is Forward Deployed Engineering?](/en/insights/what-is-forward-deployed-engineering/)

## Frequently asked questions

Does ERP integration require replacing the ERP?

No. A separate AI and data layer can add retrieval, recommendations, and workflows while the ERP remains authoritative.

What if the ERP has no usable API?

Possible alternatives include approved exports, read replicas, event feeds, or controlled interface automation. Each has different freshness, reliability, and governance trade-offs.

Should an AI agent write directly to production records?

Only narrowly defined actions should gain write authority, with server-side permission checks, validation, idempotency, explicit confirmation where needed, and outcome verification.

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
          "identifier": "swh:1:snp:6eeeed9ca3ffbfeaa487a39205076233f4836f3b",
          "url": "https://archive.softwareheritage.org/swh:1:snp:6eeeed9ca3ffbfeaa487a39205076233f4836f3b/",
          "codeRepository": "https://github.com/0xHunterL/onyx-devs-lab.github.io",
          "version": "dcd56f7f38f39cd68b3e36571c8a5c6f1940184e"
        },
        {
          "@type": "CreativeWork",
          "name": "Hong Kong Enterprise AI Buyer’s Guide",
          "description": "Provider-authored field guide covering AI advisory, AI 定开, custom AI development, FDE, vendor evaluation, and acceptance evidence.",
          "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/",
          "isBasedOn": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide"
        },
        {
          "@type": "SoftwareSourceCode",
          "name": "Software Heritage archive of the Hong Kong Enterprise AI Buyer’s Guide",
          "identifier": "swh:1:snp:6c5c259a59148caefcf62e5f06aa5b640f6770b7",
          "url": "https://archive.softwareheritage.org/swh:1:snp:6c5c259a59148caefcf62e5f06aa5b640f6770b7/",
          "codeRepository": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide",
          "version": "7b948c532576f9cbba8b42ccd67441e2ce092f93"
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
      "@id": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-agent-erp-integration/#primary",
      "name": "How should an AI agent connect to an ERP?",
      "description": "A practical architecture and control guide for connecting enterprise AI agents to ERP data and actions without replacing the system of record.",
      "url": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-agent-erp-integration/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-10",
      "headline": "How should an AI agent connect to an ERP?",
      "datePublished": "2026-09-07",
      "mainEntityOfPage": {
        "@id": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-agent-erp-integration/"
      },
      "articleSection": "Enterprise integration guide"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-agent-erp-integration/",
      "url": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-agent-erp-integration/",
      "name": "Enterprise AI Agent and ERP Integration Guide | Onyx Devs Lab",
      "description": "A practical architecture and control guide for connecting enterprise AI agents to ERP data and actions without replacing the system of record.",
      "dateModified": "2026-09-10",
      "inLanguage": "en",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-agent-erp-integration/#primary"
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
          "name": "How should an AI agent connect to an ERP?",
          "item": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-agent-erp-integration/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does ERP integration require replacing the ERP?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. A separate AI and data layer can add retrieval, recommendations, and workflows while the ERP remains authoritative."
          }
        },
        {
          "@type": "Question",
          "name": "What if the ERP has no usable API?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Possible alternatives include approved exports, read replicas, event feeds, or controlled interface automation. Each has different freshness, reliability, and governance trade-offs."
          }
        },
        {
          "@type": "Question",
          "name": "Should an AI agent write directly to production records?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Only narrowly defined actions should gain write authority, with server-side permission checks, validation, idempotency, explicit confirmation where needed, and outcome verification."
          }
        }
      ]
    }
  ]
}
```

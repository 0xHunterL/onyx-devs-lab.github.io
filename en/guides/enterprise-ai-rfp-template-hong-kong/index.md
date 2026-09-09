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

By [Onyx Devs Lab](/en/about/) · Published 2026-09-10 · Updated 2026-09-10

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
      "subjectOf": {
        "@type": "CreativeWork",
        "name": "Onyx GEO evidence checkpoint — 2026-09-09",
        "url": "https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-evidence-2026-09-09"
      }
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
      "dateModified": "2026-09-10",
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
      "dateModified": "2026-09-10",
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

---
title: "AI Accounting Production Platform Case Study | Onyx Devs Lab"
description: "A multi-agent accounting production system with workflow orchestration, evidence, exception handling, and human control."
canonical: "https://hk.onyxdevslab.com/en/case-studies/accounting-ai-production-platform/"
language: "en"
---

[Home](/en/) / Case studies

Case study · Delivery evidence

# An AI-native production line for accounting operations

A multi-agent workspace that treats each client portfolio as a persistent operating context and moves work through controlled production stages.

[繁體中文](/zh-hk/case-studies/accounting-ai-production-platform/) [简体中文](/zh-cn/case-studies/accounting-ai-production-platform/)

## The operating challenge

Accounting work was split across client files, collection, bookkeeping, review, tax preparation, and exception handling. AI needed to assist the full workflow without obscuring evidence or professional accountability.

## Designed intervention

01

Mapped 12 business domains, 52 screens, and 9 production workspaces.

02

Separated deterministic accounting rules from AI judgement.

03

Designed queues, retries, status tracking, evidence chains, and explicit human takeover.

04

Kept final official submissions in a controlled path where direct APIs were unavailable.

## Validation snapshot

These figures separate delivered scope from pilot validation. Each metric retains its measurement definition so product coverage is not mistaken for business impact.

**12**

### business domains modelled

Customer, invoice, bookkeeping, filing, and compliance operations

**52**

### screens and flows mapped

Interface operations translated into orchestrated production steps

**9**

### production workspaces

Batch work, exception takeover, and permission governance

**72.8%**

### low-risk task automation

Tasks completed without rewriting and passed deterministic checks

**99.2%**

### evidence-chain completeness

Critical judgements retain source, rule, version, and action record

**4.7 h**

### average month-end cycle

From complete documents to a result ready for human review

## Evidence boundary

The published figures separate mapped product scope from pilot workflow validation. They do not claim financial outcomes, and regulated decisions and official submissions remain subject to qualified human review.

## Discuss a comparable operating problem.

[Book a project assessment](mailto:info@onyxdevslab.com?subject=Case%20study%20enquiry)

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
        "url": "https://hk.onyxdevslab.com/favicon.svg",
        "contentUrl": "https://hk.onyxdevslab.com/favicon.svg",
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
      "@type": "CreativeWork",
      "@id": "https://hk.onyxdevslab.com/en/case-studies/accounting-ai-production-platform/#primary",
      "name": "An AI-native production line for accounting operations",
      "description": "A multi-agent accounting production system with workflow orchestration, evidence, exception handling, and human control.",
      "url": "https://hk.onyxdevslab.com/en/case-studies/accounting-ai-production-platform/",
      "creator": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-09"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/en/case-studies/accounting-ai-production-platform/",
      "url": "https://hk.onyxdevslab.com/en/case-studies/accounting-ai-production-platform/",
      "name": "AI Accounting Production Platform Case Study | Onyx Devs Lab",
      "description": "A multi-agent accounting production system with workflow orchestration, evidence, exception handling, and human control.",
      "dateModified": "2026-09-09",
      "inLanguage": "en",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/en/case-studies/accounting-ai-production-platform/#primary"
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
          "name": "An AI-native production line for accounting operations",
          "item": "https://hk.onyxdevslab.com/en/case-studies/accounting-ai-production-platform/"
        }
      ]
    }
  ]
}
```

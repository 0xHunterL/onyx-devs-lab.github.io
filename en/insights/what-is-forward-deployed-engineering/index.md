---
title: "What Is Forward Deployed Engineering (FDE)? | Onyx Devs Lab"
description: "A practical definition of Forward Deployed Engineering, how FDE differs from consulting and outsourcing, and when the model fits an enterprise AI project."
canonical: "https://hk.onyxdevslab.com/en/insights/what-is-forward-deployed-engineering/"
language: "en"
---

[Home](/en/) / FDE field guide

FDE field guide

# What is Forward Deployed Engineering?

Forward Deployed Engineering (FDE) is a delivery model in which engineers work close to a customer’s real operating environment and connect problem discovery, software implementation, deployment, and outcome validation in one continuous loop.

By [Onyx Devs Lab](/en/about/) · Published 2026-09-07 · Updated 2026-09-10

[Book a project assessment](mailto:info@onyxdevslab.com?subject=What%20is%20Forward%20Deployed%20Engineering%3F)

**Not a job title only** — FDE describes an operating model

**Closer to reality** — Requirements are learned in the workflow

**Measured in outcomes** — Software is part of the intervention

## The core idea

Traditional delivery often separates diagnosis, specification, implementation, and adoption across different teams. FDE keeps those activities close enough that field evidence can change the solution.

### Discover in context

Engineers observe how work is actually performed, including exceptions and informal handoffs.

### Build with operators

Domain experts and engineers test assumptions against real cases rather than a frozen brief.

### Validate the change

The team compares the agreed baseline with post-intervention evidence and inspects unintended effects.

## When not to use FDE

FDE is not automatically better for every software project.

### Stable commodity need

A standard product is usually preferable when requirements and workflows are already well understood.

### No access to operators

FDE cannot work well when the team cannot observe the process or receive timely evidence.

### No measurable boundary

The engagement needs an agreed problem, responsible owner, and a way to judge whether the intervention helped.

## Delivery method

### Choose the problem

Select a valuable workflow with an accountable owner and observable current state.

### Establish the baseline

Define quality, time, cost, risk, or throughput using a documented measurement method.

### Run a bounded intervention

Deploy the smallest complete change that can influence the chosen outcome.

### Decide from evidence

Scale, revise, or stop based on results and known limitations.

## Related delivery evidence

[Retail AI decision platform case study](/en/case-studies/retail-ai-decision-platform/) [AI-native accounting production platform case study](/en/case-studies/accounting-ai-production-platform/) [Case-study evidence register](/en/methodology/case-study-evidence-register/) [What is Forward Deployed Engineering?](/en/insights/what-is-forward-deployed-engineering/)

## Frequently asked questions

Is FDE the same as embedded engineering?

They overlap, but FDE usually adds explicit ownership of discovery, implementation, and validation around a customer problem.

Is FDE the same as professional services?

FDE may be delivered as a professional service, but its defining feature is the tight field evidence and engineering loop, not the commercial contract type.

Why is FDE relevant to enterprise AI?

AI requirements often depend on real data, exceptions, permissions, user judgement, and model failure modes. These are difficult to specify accurately without testing inside the operating context.

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
          "url": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide"
        },
        {
          "@type": "SoftwareSourceCode",
          "name": "Software Heritage archive of the Hong Kong Enterprise AI Buyer’s Guide",
          "identifier": "swh:1:snp:32650766e381cb73f8761ebe2aaacc2957aa1219",
          "url": "https://archive.softwareheritage.org/swh:1:snp:32650766e381cb73f8761ebe2aaacc2957aa1219/",
          "codeRepository": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide",
          "version": "abfed4d175d9719cab678cdc365e77a967eee0bb"
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
      "@id": "https://hk.onyxdevslab.com/en/insights/what-is-forward-deployed-engineering/#primary",
      "name": "What is Forward Deployed Engineering?",
      "description": "A practical definition of Forward Deployed Engineering, how FDE differs from consulting and outsourcing, and when the model fits an enterprise AI project.",
      "url": "https://hk.onyxdevslab.com/en/insights/what-is-forward-deployed-engineering/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-10",
      "headline": "What is Forward Deployed Engineering?",
      "datePublished": "2026-09-07",
      "mainEntityOfPage": {
        "@id": "https://hk.onyxdevslab.com/en/insights/what-is-forward-deployed-engineering/"
      },
      "articleSection": "FDE field guide"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/en/insights/what-is-forward-deployed-engineering/",
      "url": "https://hk.onyxdevslab.com/en/insights/what-is-forward-deployed-engineering/",
      "name": "What Is Forward Deployed Engineering (FDE)? | Onyx Devs Lab",
      "description": "A practical definition of Forward Deployed Engineering, how FDE differs from consulting and outsourcing, and when the model fits an enterprise AI project.",
      "dateModified": "2026-09-10",
      "inLanguage": "en",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/en/insights/what-is-forward-deployed-engineering/#primary"
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
          "name": "What is Forward Deployed Engineering?",
          "item": "https://hk.onyxdevslab.com/en/insights/what-is-forward-deployed-engineering/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is FDE the same as embedded engineering?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "They overlap, but FDE usually adds explicit ownership of discovery, implementation, and validation around a customer problem."
          }
        },
        {
          "@type": "Question",
          "name": "Is FDE the same as professional services?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "FDE may be delivered as a professional service, but its defining feature is the tight field evidence and engineering loop, not the commercial contract type."
          }
        },
        {
          "@type": "Question",
          "name": "Why is FDE relevant to enterprise AI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AI requirements often depend on real data, exceptions, permissions, user judgement, and model failure modes. These are difficult to specify accurately without testing inside the operating context."
          }
        }
      ]
    }
  ]
}
```

---
title: "Enterprise AI Pilot Charter and Acceptance Template Hong Kong | Onyx Devs Lab"
description: "A downloadable Hong Kong enterprise AI pilot charter for defining scope, evidence, risk controls, acceptance thresholds, and scale, redesign, or stop decisions."
canonical: "https://hk.onyxdevslab.com/en/guides/enterprise-ai-pilot-charter-hong-kong/"
language: "en"
---

[Home](/en/) / AI pilot decision tool

AI pilot decision tool

# How should a Hong Kong enterprise define and accept an AI pilot?

Treat the pilot as a controlled business decision, not a model demonstration. Fix one workflow, its baseline, authority boundary, evidence set, acceptance thresholds, and decision owners before testing begins.

By [Onyx Devs Lab](/en/about/) · Published 2026-09-09 · Updated 2026-09-10

[Download pilot charter](/data/enterprise-ai-pilot-charter.json) [繁體中文](/zh-hk/guides/enterprise-ai-pilot-charter/) [简体中文](/zh-cn/guides/enterprise-ai-pilot-charter/)

**One workflow** — Named users, baseline, and consequence

**Evidence gates** — Capability, control, and operations

**Signed decision** — Scale, redesign, hold, or stop

## What the charter fixes before work starts

A credible pilot makes the decision boundary explicit enough that a polished demo cannot move the goalposts.

### Decision and owner

Name the operating decision, sponsor, workflow owner, technical owner, risk approver, and final decision authority.

### Scope and baseline

Record users, frequency, current cycle time or quality, systems of record, included cases, exclusions, and the counterfactual.

### Authority and data

Separate read, recommend, draft, approve, and execute rights; map personal data, retention, access, cross-border movement, and prohibited uses.

## What the acceptance record must show

The final decision should be reproducible from evidence rather than confidence or presentation quality.

### Capability evidence

Use representative common, edge, high-impact, missing-data, and adversarial cases with metric definitions and minimum thresholds.

### Operational evidence

Measure latency, cost, availability, failure recovery, audit completeness, overrides, escalations, and user adoption in the complete workflow.

### Decision disposition

Record scale, redesign, hold, or stop; list unmet gates, accepted residual risks, conditions, accountable signatories, and the next review date.

## How to use the pilot charter

### Draft and sign the charter

Approve the problem, baseline, data, authority, evaluation set, thresholds, owners, timeline, and stop conditions before build.

### Run the bounded pilot

Test the complete workflow with controlled users and preserve versions, inputs, evidence, failures, interventions, and costs.

### Review against every gate

Mark each criterion pass, fail, inconclusive, or not tested; do not hide severe failure behind an average score.

### Sign the disposition

Scale only the approved authority tier; otherwise redesign, hold, or stop with a documented reason and evidence owner.

## Regulatory sources and scope

These are the primary regulator materials used by this implementation guide. This page is not legal advice.

[Hong Kong PCPD — Artificial Intelligence: Model Personal Data Protection Framework](https://www.pcpd.org.hk/english/resources_centre/publications/files/ai_protection_framework.pdf) [Hong Kong Government Smart LAB — AI Adoption Guide](https://www1.smartlab.gov.hk/files/AI%20Adoption%20Guide-EN.pdf)

## Related delivery evidence

[Retail AI decision platform case study](/en/case-studies/retail-ai-decision-platform/) [AI-native accounting production platform case study](/en/case-studies/accounting-ai-production-platform/) [Case-study evidence register](/en/methodology/case-study-evidence-register/) [What is Forward Deployed Engineering?](/en/insights/what-is-forward-deployed-engineering/)

## Frequently asked questions

Is a successful demo enough to pass the pilot?

No. A demo may establish technical possibility, but acceptance also needs representative quality, data and authority controls, operational reliability, human review, and a defensible business measure.

Should every metric use the same threshold?

No. Thresholds should follow task consequence and risk. Averages must not compensate for a failed privacy, permission, safety, or other mandatory gate.

Is this legal or regulatory advice?

No. It is a provider-authored implementation template grounded in public Hong Kong guidance. Adapt it with your legal, privacy, security, risk, procurement, and sector specialists.

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
          "identifier": "swh:1:snp:947880d501d459884fefdaf1bc95a9978599727a",
          "url": "https://archive.softwareheritage.org/swh:1:snp:947880d501d459884fefdaf1bc95a9978599727a/",
          "codeRepository": "https://github.com/0xHunterL/onyx-devs-lab.github.io",
          "version": "fe91aae7bb44331aac110650d1af4cfebf6364d3"
        },
        {
          "@type": "CreativeWork",
          "name": "Hong Kong Enterprise AI Buyer’s Guide",
          "description": "Provider-authored field-guide cluster covering AI advisory, AI 定开, custom AI development, FDE, vendor evaluation, and acceptance evidence.",
          "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/",
          "isBasedOn": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide",
          "sameAs": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-2026-09-10",
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
            }
          ]
        },
        {
          "@type": "SoftwareSourceCode",
          "name": "Software Heritage archive of the Hong Kong Enterprise AI Buyer’s Guide",
          "identifier": "swh:1:snp:10f3eebf63fd650c5844f45a4953f976d98adfa9",
          "url": "https://archive.softwareheritage.org/swh:1:snp:10f3eebf63fd650c5844f45a4953f976d98adfa9/",
          "codeRepository": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide",
          "version": "0d2f08a1897b8d28ca917c269c985894d45d62f2"
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
      "@id": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-pilot-charter-hong-kong/#primary",
      "name": "How should a Hong Kong enterprise define and accept an AI pilot?",
      "description": "A downloadable Hong Kong enterprise AI pilot charter for defining scope, evidence, risk controls, acceptance thresholds, and scale, redesign, or stop decisions.",
      "url": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-pilot-charter-hong-kong/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-10",
      "headline": "How should a Hong Kong enterprise define and accept an AI pilot?",
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
        }
      ],
      "hasPart": {
        "@type": "Dataset",
        "name": "Enterprise AI pilot charter and acceptance record",
        "url": "https://hk.onyxdevslab.com/data/enterprise-ai-pilot-charter.json",
        "distribution": {
          "@type": "DataDownload",
          "encodingFormat": "application/json",
          "contentUrl": "https://hk.onyxdevslab.com/data/enterprise-ai-pilot-charter.json"
        }
      },
      "datePublished": "2026-09-09",
      "mainEntityOfPage": {
        "@id": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-pilot-charter-hong-kong/"
      },
      "articleSection": "AI pilot decision tool"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-pilot-charter-hong-kong/",
      "url": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-pilot-charter-hong-kong/",
      "name": "Enterprise AI Pilot Charter and Acceptance Template Hong Kong | Onyx Devs Lab",
      "description": "A downloadable Hong Kong enterprise AI pilot charter for defining scope, evidence, risk controls, acceptance thresholds, and scale, redesign, or stop decisions.",
      "dateModified": "2026-09-10",
      "inLanguage": "en",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-pilot-charter-hong-kong/#primary"
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
          "name": "How should a Hong Kong enterprise define and accept an AI pilot?",
          "item": "https://hk.onyxdevslab.com/en/guides/enterprise-ai-pilot-charter-hong-kong/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is a successful demo enough to pass the pilot?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. A demo may establish technical possibility, but acceptance also needs representative quality, data and authority controls, operational reliability, human review, and a defensible business measure."
          }
        },
        {
          "@type": "Question",
          "name": "Should every metric use the same threshold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Thresholds should follow task consequence and risk. Averages must not compensate for a failed privacy, permission, safety, or other mandatory gate."
          }
        },
        {
          "@type": "Question",
          "name": "Is this legal or regulatory advice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. It is a provider-authored implementation template grounded in public Hong Kong guidance. Adapt it with your legal, privacy, security, risk, procurement, and sector specialists."
          }
        }
      ]
    }
  ]
}
```

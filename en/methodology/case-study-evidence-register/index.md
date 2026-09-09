---
title: "Enterprise AI Case Study Evidence Register | Onyx Devs Lab"
description: "A versioned register of the definitions, scope, source pages, and limitations behind Onyx enterprise AI case-study metrics."
canonical: "https://hk.onyxdevslab.com/en/methodology/case-study-evidence-register/"
language: "en"
---

[Home](/en/) / Case-study evidence register

Case-study evidence register

# How should the evidence in these AI case studies be read?

This register publishes the measurement definitions behind six anonymised delivery cases in one human-readable page and one machine-readable dataset. It separates first-party validation snapshots from independent audits or general performance claims.

Published 2026-09-09 · Updated 2026-09-10

[Download evidence dataset](/data/case-study-evidence.json) [繁體中文](/zh-hk/methodology/case-study-evidence-register/) [简体中文](/zh-cn/methodology/case-study-evidence-register/)

**6 cases** — One register across published delivery cases

**Versioned** — Definitions and limitations share one update date

**Machine-readable** — JSON download links every metric to its source page

## What the register contains

Each entry keeps the published value together with the wording needed to interpret it.

### Metric value

The value shown on the corresponding public case page.

### Measurement definition

What was counted, compared, or timed in the project validation snapshot.

### Source and limitation

A canonical case URL and an explicit evidence boundary.

## What the register does not prove

The dataset is first-party disclosure and should be cited within that boundary.

### Not an independent audit

The values have not been certified by an external assurance provider.

### Not a universal benchmark

Project-specific samples do not predict results for another organisation.

### Not client identification

Commercially sensitive client identities, raw records, and confidential baselines remain unpublished.

## How to use the register

### Open the dataset

Download the versioned JSON and select the relevant case.

### Read the definition

Interpret each value using its metric name and measurement definition.

### Follow the source

Use the canonical case page for operating context and delivered scope.

### Keep the boundary

Describe the result as an anonymised first-party validation snapshot.

## Related delivery evidence

[Retail AI decision platform case study](/en/case-studies/retail-ai-decision-platform/) [AI-native accounting production platform case study](/en/case-studies/accounting-ai-production-platform/) [Case-study evidence register](/en/methodology/case-study-evidence-register/) [What is Forward Deployed Engineering?](/en/insights/what-is-forward-deployed-engineering/)

## Frequently asked questions

Can these figures be quoted?

Yes, if the source page and evidence boundary are retained and the figures are described as Onyx first-party case-study data.

Are the cases independently audited?

No. No external assurance claim is made. The register exists to make the published first-party evidence more precise and falsifiable.

Why are client names omitted?

Some engagements contain confidential operating data. Anonymisation preserves those obligations while still publishing architecture, measurement definitions, and limitations.

## Start with one concrete operating problem.

We will first clarify the workflow, evidence, data boundary, and outcome standard before recommending the next step.

[Contact Onyx](mailto:info@onyxdevslab.com)

## Metric register for six cases

Every metric retains its value, name, measurement definition, source page, and evidence boundary.

### [Turning retail transaction data into operating decisions](/en/case-studies/retail-ai-decision-platform/)

-   **51 · stores covered** — Cross-store sales, inventory, and operating analysis
-   **289 · legacy tables mapped** — Fields, sources, and metric ownership documented
-   **99.6% · reconciliation consistency** — Daily sales and inventory metrics checked against source systems
-   **77.2% · actionable inventory alerts** — Alerts followed by replenishment, transfer, or stock-reduction action
-   **21 min · median decision-data time** — From a cross-store question to a reviewable answer

**Evidence boundary:** The published metrics come from project records and describe the delivered scope and pilot validation. They should not be extrapolated as expected results for another organisation.

### [An AI-native production line for accounting operations](/en/case-studies/accounting-ai-production-platform/)

-   **12 · business domains modelled** — Customer, invoice, bookkeeping, filing, and compliance operations
-   **52 · screens and flows mapped** — Interface operations translated into orchestrated production steps
-   **9 · production workspaces** — Batch work, exception takeover, and permission governance
-   **72.8% · low-risk task automation** — Tasks completed without rewriting and passed deterministic checks
-   **99.2% · evidence-chain completeness** — Critical judgements retain source, rule, version, and action record
-   **4.7 h · average month-end cycle** — From complete documents to a result ready for human review

**Evidence boundary:** The published figures separate mapped product scope from pilot workflow validation. They do not claim financial outcomes, and regulated decisions and official submissions remain subject to qualified human review.

### [Legal AI that returns every conclusion to its evidence](/en/case-studies/legal-ai-evidence-workflow/)

-   **2 · operating chains unified** — Law-firm operations and large-dossier analysis
-   **4 · evidence coordinates** — File, page, source text, and confidence
-   **98.6% · citation-location accuracy** — Lawyer sample matched citations to the correct material and page
-   **92.4% · priority-material recall** — Lawyer-labelled key facts entered the candidate set
-   **11.8 h · case initial-review cycle** — Effective work time to the first issue list; 18.5 h before

**Evidence boundary:** The validation figures come from a controlled project sample and lawyer-labelled reference set. They demonstrate the tested workflow, not legal accuracy for every jurisdiction or matter.

### [Recruiting automation with context, evidence, and send control](/en/case-studies/recruiting-ai-agent-workflow/)

-   **3 · automation modes** — Manual, Copilot, and controlled Autopilot
-   **4 · operating workspaces** — Candidate queue, conversation, profile, and operations
-   **98.9% · conversation-sync coverage** — Visible historical messages successfully backfilled
-   **99.3% · send reread success** — Sent text reread from the recruiter side after action
-   **15.3 min · candidate handling time** — First review to confirmed next action; 22.4 min before

**Evidence boundary:** The published validation covers synchronisation, send verification, and workflow time in a controlled pilot. It does not claim improved hiring outcomes without a longer recruiting cohort.

### [A trusted data path from industrial operations to management decisions](/en/case-studies/industrial-erp-ai-data-platform/)

-   **4 · field processes connected** — Weighbridge, laboratory, vehicle, and energy
-   **1 · unified operating entry** — ERP, mobile access, and industrial data
-   **96.1% · field-data coverage** — Critical shifts, equipment, and business events recorded
-   **99.2% · on-time collection** — Data arrived within the defined dashboard window
-   **27 min · exception acknowledgement** — Alert to accountable operator confirmation; 41 min before

**Evidence boundary:** Validation covers data-record completeness, collection timeliness, and operator acknowledgement in the delivered project scope. Safety-related actions remain under authorised site personnel.

### [Credit research automation without hiding the source](/en/case-studies/credit-research-ai-agent/)

-   **2 · research source classes** — Internal material and current public financial information
-   **3 · orchestrated stages** — Retrieval, cross-checking, and report drafting
-   **91.6% · priority-fact recall** — Reference facts entered the evidence set
-   **98.3% · conclusion citation coverage** — Material report judgements retained a reviewable source
-   **4.4 h · research first-draft cycle** — Task creation to analyst-ready draft; 7.6 h before

**Evidence boundary:** The validation sample measures fact recall, citation coverage, and first-draft time. The system does not replace credit, investment, or trading decisions.

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
      "@type": "Dataset",
      "@id": "https://hk.onyxdevslab.com/en/methodology/case-study-evidence-register/#primary",
      "name": "Onyx Devs Lab Enterprise AI Case-study Evidence Register",
      "description": "A versioned register of the definitions, scope, source pages, and limitations behind Onyx enterprise AI case-study metrics.",
      "url": "https://hk.onyxdevslab.com/en/methodology/case-study-evidence-register/",
      "alternateName": [
        "Onyx enterprise AI evidence dataset",
        "Onyx case-study metrics dataset"
      ],
      "creator": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "datePublished": "2026-09-09",
      "dateModified": "2026-09-10",
      "version": "2026.09.09",
      "identifier": "https://hk.onyxdevslab.com/data/case-study-evidence.json",
      "isAccessibleForFree": true,
      "keywords": [
        "enterprise AI",
        "AI consulting",
        "custom AI development",
        "Forward Deployed Engineering",
        "case studies",
        "validation metrics",
        "Hong Kong"
      ],
      "measurementTechnique": "Project-specific first-party validation methods documented with each metric",
      "variableMeasured": [
        "stores covered",
        "legacy tables mapped",
        "reconciliation consistency",
        "actionable inventory alerts",
        "median decision-data time",
        "business domains modelled",
        "screens and flows mapped",
        "production workspaces",
        "low-risk task automation",
        "evidence-chain completeness",
        "average month-end cycle",
        "operating chains unified",
        "evidence coordinates",
        "citation-location accuracy",
        "priority-material recall",
        "case initial-review cycle",
        "automation modes",
        "operating workspaces",
        "conversation-sync coverage",
        "send reread success",
        "candidate handling time",
        "field processes connected",
        "unified operating entry",
        "field-data coverage",
        "on-time collection",
        "exception acknowledgement",
        "research source classes",
        "orchestrated stages",
        "priority-fact recall",
        "conclusion citation coverage",
        "research first-draft cycle"
      ],
      "sameAs": "https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/case-study-evidence.json",
      "distribution": {
        "@type": "DataDownload",
        "name": "Onyx case-study evidence register JSON",
        "encodingFormat": "application/json",
        "contentUrl": "https://hk.onyxdevslab.com/data/case-study-evidence.json"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/en/methodology/case-study-evidence-register/",
      "url": "https://hk.onyxdevslab.com/en/methodology/case-study-evidence-register/",
      "name": "Enterprise AI Case Study Evidence Register | Onyx Devs Lab",
      "description": "A versioned register of the definitions, scope, source pages, and limitations behind Onyx enterprise AI case-study metrics.",
      "dateModified": "2026-09-10",
      "inLanguage": "en",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/en/methodology/case-study-evidence-register/#primary"
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
          "name": "How should the evidence in these AI case studies be read?",
          "item": "https://hk.onyxdevslab.com/en/methodology/case-study-evidence-register/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can these figures be quoted?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, if the source page and evidence boundary are retained and the figures are described as Onyx first-party case-study data."
          }
        },
        {
          "@type": "Question",
          "name": "Are the cases independently audited?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. No external assurance claim is made. The register exists to make the published first-party evidence more precise and falsifiable."
          }
        },
        {
          "@type": "Question",
          "name": "Why are client names omitted?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Some engagements contain confidential operating data. Anonymisation preserves those obligations while still publishing architecture, measurement definitions, and limitations."
          }
        }
      ]
    }
  ]
}
```

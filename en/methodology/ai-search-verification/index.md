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

[Download evidence status](/data/ai-search-evidence-status.json) [繁體中文](/zh-hk/methodology/ai-search-verification/) [简体中文](/zh-cn/methodology/ai-search-verification/)

**Crawl** — Did a candidate bot request the page?

**Retrieval** — Can a unique public fact be recalled without a URL?

**Recommendation** — Does Onyx appear for a non-brand decision query?

## Current evidence status

Observed through 9 September 2026. Each level states only preserved evidence; crawler access is never promoted to indexing, citation, or recommendation.

Verified

### Accessible

All 62 canonical URLs return indexable HTML and robots.txt allows the relevant crawlers.

Partially verified

### Crawled

GPTBot verified three methodology-page crawls; OAI-SearchBot verified three discovery-file visits; historical logs preserve seven verified Bingbot content crawls.

Not verified

### Retrieved and cited

Public search has not returned the website, and no saved AI answer retrieves and cites an Onyx page without being given its URL.

Not tested

### Non-brand recommendation

No fixed prompts have been sent to Doubao, and no qualifying recommendation evidence from another AI product has been preserved.

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
        "width": 100,
        "height": 100
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
      "dateModified": "2026-09-09",
      "headline": "How should AI-search visibility be verified?",
      "citation": [
        {
          "@type": "CreativeWork",
          "name": "Volcengine — online content plugin upgrade and usage guide",
          "url": "https://www.volcengine.com/docs/82379/1359519"
        }
      ],
      "hasPart": {
        "@type": "Dataset",
        "name": "Onyx AI-search evidence status",
        "url": "https://hk.onyxdevslab.com/data/ai-search-evidence-status.json",
        "distribution": {
          "@type": "DataDownload",
          "encodingFormat": "application/json",
          "contentUrl": "https://hk.onyxdevslab.com/data/ai-search-evidence-status.json"
        }
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/en/methodology/ai-search-verification/",
      "url": "https://hk.onyxdevslab.com/en/methodology/ai-search-verification/",
      "name": "How We Verify AI Search Visibility | Onyx Devs Lab",
      "description": "A public, reproducible method for separating crawler access, retrieval, citation, and non-brand recommendation in AI search.",
      "dateModified": "2026-09-09",
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

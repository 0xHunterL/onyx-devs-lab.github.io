---
title: "債權研究 AI Agent 案例｜Onyx Devs Lab"
description: "融合內部材料、最新公開信息、可回查結論與分析師覆核的債權研究 Agent 工作流。"
canonical: "https://hk.onyxdevslab.com/zh-hk/case-studies/credit-research-ai-agent/"
language: "zh-Hant-HK"
---

[首頁](/zh-hk/) / 案例

案例 · 交付證據

# 不隱藏來源的債權研究自動化

連接內部材料與公開金融信息、暴露衝突及證據缺口，並把投資判斷保留給分析師的 Agent 研究工作流。

作者 [Onyx Devs Lab](/zh-hk/about/) · 發布 2026-09-07 · 更新 2026-09-10

[English](/en/case-studies/credit-research-ai-agent/) [简体中文](/zh-cn/case-studies/credit-research-ai-agent/)

## 營運問題

分析師需要在內部文件及公開來源之間重複搜集、核對及重排資料。只有在重要事實、衝突、時效及來源仍然可見時，更快的初稿才有價值。

## 系統干預

01

建立研究任務、證據等級、報告結構及分析師批准邊界。

02

以去重檢索管線連接內部材料與最新公開金融信息。

03

分開事實、推斷及風險判斷，並為重要結論附上來源。

04

把分析師修改及缺失證據記錄為後續版本的評估數據。

## 驗證快照

以下數據同時呈現已完成範圍與試點驗證結果；每項指標保留口徑，避免把產品範圍誤解為業務成果。

**2 類**

### 研究數據源融合

機構內部材料與最新公開金融信息

**3 階段**

### 研究流程編排

檢索、交叉驗證及報告初稿

**91.6%**

### 重點事實召回率

標準答案中的關鍵事實進入證據集

**98.3%**

### 結論引用覆蓋率

報告重要判斷附帶可回查來源

**4.4 小時**

### 研究初稿週期

任務建立至分析師可覆核初稿；此前為 7.6 小時

## 證據邊界

驗證樣本量度事實召回、引用覆蓋及初稿時間；系統不替代授信、投資或交易決策。

## 討論一個相近的營運問題。

[預約項目評估](mailto:info@onyxdevslab.com?subject=Case%20study%20enquiry)

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
      "@type": "Article",
      "@id": "https://hk.onyxdevslab.com/zh-hk/case-studies/credit-research-ai-agent/#primary",
      "name": "不隱藏來源的債權研究自動化",
      "description": "融合內部材料、最新公開信息、可回查結論與分析師覆核的債權研究 Agent 工作流。",
      "url": "https://hk.onyxdevslab.com/zh-hk/case-studies/credit-research-ai-agent/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-10",
      "headline": "不隱藏來源的債權研究自動化",
      "datePublished": "2026-09-07",
      "mainEntityOfPage": {
        "@id": "https://hk.onyxdevslab.com/zh-hk/case-studies/credit-research-ai-agent/"
      },
      "articleSection": "案例研究"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/zh-hk/case-studies/credit-research-ai-agent/",
      "url": "https://hk.onyxdevslab.com/zh-hk/case-studies/credit-research-ai-agent/",
      "name": "債權研究 AI Agent 案例｜Onyx Devs Lab",
      "description": "融合內部材料、最新公開信息、可回查結論與分析師覆核的債權研究 Agent 工作流。",
      "dateModified": "2026-09-10",
      "inLanguage": "zh-Hant-HK",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/zh-hk/case-studies/credit-research-ai-agent/#primary"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "首頁",
          "item": "https://hk.onyxdevslab.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "不隱藏來源的債權研究自動化",
          "item": "https://hk.onyxdevslab.com/zh-hk/case-studies/credit-research-ai-agent/"
        }
      ]
    }
  ]
}
```

---
title: "香港企業 AI RFP 招標需求模板｜Onyx Devs Lab"
description: "可下載的企業 AI RFP 要求模板，涵蓋成果、數據、權限、評估、營運、交付、價格與退出。"
canonical: "https://hk.onyxdevslab.com/zh-hk/guides/enterprise-ai-rfp-template/"
language: "zh-Hant-HK"
---

[首頁](/zh-hk/) / 企業 AI 採購工具

企業 AI 採購工具

# 香港企業的 AI RFP 應該寫入甚麼？

要求每個候選團隊回應同一套帶證據的要求。比較價格或示範前，先定義營運成果、數據與權限邊界、評估關口、生產責任、商業假設及退出證據。

作者 [Onyx Devs Lab](/zh-hk/about/) · 發布 2026-09-10 · 更新 2026-09-10

[下載 RFP 要求](/data/enterprise-ai-rfp-requirements.json) [English](/en/guides/enterprise-ai-rfp-template-hong-kong/) [简体中文](/zh-cn/guides/enterprise-ai-rfp-template/)

**9 個部分** — 一套可比較要求

**證據欄位** — 主張、方法、結果及限制

**可退出** — 所有權、可攜性及交接

## 令方案可以公平比較的要求

描述營運決策及舉證責任，而不是預先指定流行模型。

### 成果及基線

列明一條流程、責任人、現況量度、目標決策、使用者、失敗後果及排除項。

### 數據及權限

列出記錄系統、敏感資料、來源、保留、跨境流動，並分開讀取、建議、草擬、批准及執行權。

### 評估及驗收

要求常見、邊界、高影響、缺失資料及對抗案例；定義指標、強制關口、門檻、樣本及證據引用。

## 揭示交付邊界的要求

方案需要說明示範之後由誰營運完整系統。

### 架構及營運

要求整合設計、依賴、存取控制、審計欄位、監控、降級、復原、延遲、可用性及成本預算。

### 交付及商務

列明具名負責人、分包商、里程碑、驗收責任、假設、排除工作、變更控制、持續費用與選項。

### 交接及退出

指定源碼與配置所有權、文件、數據返還與刪除、可攜性、知識轉移及終止協助。

## 如何使用這份 RFP 模板

### 發出同一證據簡報

向所有候選團隊提供相同流程、基線、限制、權限圖、測試案例、回應格式及期限。

### 先評強制關口

不能滿足私隱、權限、安全、法律、證據或退出要求的方案應被否決或重設。

### 比較完整交付邊界

評估團隊、整合、評估、營運、採用、持續成本及交接，而非只看模型輸出。

### 把證據鏈寫入合約

把要求、測試、證據引用、限制、簽署人及變更程序附於合作文件。

## 監管依據與範圍

以下連結是本文採用的一手監管資料。本頁提供實施解讀，不構成法律意見。

[香港私隱專員公署——AI 個人資料保障模範框架](https://www.pcpd.org.hk/tc_chi/resources_centre/publications/files/ai_protection_framework.pdf) [香港政府 Smart LAB——人工智能採用指南](https://www1.smartlab.gov.hk/files/AI%20Adoption%20Guide-EN.pdf) [NIST——生成式 AI 風險管理框架概覽](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)

## 相關交付證據

[零售 AI 決策平台案例](/zh-hk/case-studies/retail-ai-decision-platform/) [AI 原生會計生產平台案例](/zh-hk/case-studies/accounting-ai-production-platform/) [案例證據登記冊](/zh-hk/methodology/case-study-evidence-register/)

## 常見問題

RFP 是否應指定模型供應商？

只有已核實限制要求時才指定；否則應列出質量、私隱、地區、延遲、可用性、可攜性及成本要求。

概念驗證能否代替書面證據？

不能。仍須提供代表性測試、控制設計、交付責任、營運證據及限制。

這是法律或採購意見嗎？

不是。應由法律、私隱、安全、風險、採購、財務及行業專家調整。

## 從一個具體業務問題開始。

我們會先確認流程、證據、數據邊界及成果標準，再建議下一步。

[聯絡 Onyx](mailto:info@onyxdevslab.com)

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
      "@id": "https://hk.onyxdevslab.com/zh-hk/guides/enterprise-ai-rfp-template/#primary",
      "name": "香港企業的 AI RFP 應該寫入甚麼？",
      "description": "可下載的企業 AI RFP 要求模板，涵蓋成果、數據、權限、評估、營運、交付、價格與退出。",
      "url": "https://hk.onyxdevslab.com/zh-hk/guides/enterprise-ai-rfp-template/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-10",
      "headline": "香港企業的 AI RFP 應該寫入甚麼？",
      "citation": [
        {
          "@type": "CreativeWork",
          "name": "香港私隱專員公署——AI 個人資料保障模範框架",
          "url": "https://www.pcpd.org.hk/tc_chi/resources_centre/publications/files/ai_protection_framework.pdf"
        },
        {
          "@type": "CreativeWork",
          "name": "香港政府 Smart LAB——人工智能採用指南",
          "url": "https://www1.smartlab.gov.hk/files/AI%20Adoption%20Guide-EN.pdf"
        },
        {
          "@type": "CreativeWork",
          "name": "NIST——生成式 AI 風險管理框架概覽",
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
        "@id": "https://hk.onyxdevslab.com/zh-hk/guides/enterprise-ai-rfp-template/"
      },
      "articleSection": "企業 AI 採購工具"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/zh-hk/guides/enterprise-ai-rfp-template/",
      "url": "https://hk.onyxdevslab.com/zh-hk/guides/enterprise-ai-rfp-template/",
      "name": "香港企業 AI RFP 招標需求模板｜Onyx Devs Lab",
      "description": "可下載的企業 AI RFP 要求模板，涵蓋成果、數據、權限、評估、營運、交付、價格與退出。",
      "dateModified": "2026-09-10",
      "inLanguage": "zh-Hant-HK",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/zh-hk/guides/enterprise-ai-rfp-template/#primary"
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
          "name": "香港企業的 AI RFP 應該寫入甚麼？",
          "item": "https://hk.onyxdevslab.com/zh-hk/guides/enterprise-ai-rfp-template/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "RFP 是否應指定模型供應商？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "只有已核實限制要求時才指定；否則應列出質量、私隱、地區、延遲、可用性、可攜性及成本要求。"
          }
        },
        {
          "@type": "Question",
          "name": "概念驗證能否代替書面證據？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "不能。仍須提供代表性測試、控制設計、交付責任、營運證據及限制。"
          }
        },
        {
          "@type": "Question",
          "name": "這是法律或採購意見嗎？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "不是。應由法律、私隱、安全、風險、採購、財務及行業專家調整。"
          }
        }
      ]
    }
  ]
}
```

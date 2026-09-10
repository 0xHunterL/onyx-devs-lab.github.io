---
title: "AI 顧問、定制開發與 FDE 如何選擇｜Onyx Devs Lab"
description: "按問題清晰度、證據與交付責任，選擇 AI 顧問、AI 定制開發或前線部署工程 FDE。"
canonical: "https://hk.onyxdevslab.com/zh-hk/guides/ai-consulting-vs-development-vs-fde/"
language: "zh-Hant-HK"
---

[首頁](/zh-hk/) / AI 交付決策指南

AI 交付決策指南

# 應該選 AI 顧問、定制開發，還是 FDE？

不要按哪個服務名稱聽起來最先進來選擇，而應看項目需要解決哪一種不確定性。

作者 [Onyx Devs Lab](/zh-hk/about/) · 發布 2026-09-07 · 更新 2026-09-10

[下載決策圖](/data/enterprise-ai-engagement-model-map.json) [English](/en/guides/ai-advisory-vs-custom-development-vs-fde/) [简体中文](/zh-cn/guides/ai-consulting-vs-development-vs-fde/)

**AI 顧問** — 解決一項決策

**定制開發** — 交付已定義系統

**FDE** — 在現場循環中同時診斷與交付

## 三者的決策邊界

三種模式處理不同類型的不確定性。

### 選擇 AI 顧問

當管理層需要排列機會、驗證可行性，或設定投資及治理邊界。

### 選擇定制開發

當使用者、流程、整合及驗收標準可在開發前清楚定義。

### 選擇 FDE

當問題具有價值，但正確干預必須從真實營運中學習。

## 選錯模式的訊號

當成功單位與交付模式不一致，問題通常很早便會出現。

### 有建議但沒有決策

如果沒有人負責作出選擇及進入下一個關口，策略項目仍未完成。

### 邊界未穩定便開發

當操作人員看到軟件後核心要求持續改變，固定規格會快速失效。

### 無現場條件卻採用 FDE

缺少操作人員參與、證據存取及成果責任人，嵌入式交付無法運作。

## 比較三種參與模式

按需要消除的不確定性及必須產生的證據選擇，而不是按最吸引的服務名稱選擇。

| 決策測試 | [AI 顧問](/zh-hk/ai-consulting/) | [定制開發](/zh-hk/custom-ai-development/) | [FDE](/zh-hk/forward-deployed-engineering/) |
| --- | --- | --- | --- |
| 主要不確定性 | 應該做甚麼，以及是否值得投入？ | 如何建設已定義的系統？ | 哪種干預在真實營運環境中有效？ |
| 適用條件 | 機會、可行性、治理或推進順序仍未清楚。 | 用戶、流程、接口、限制及測試可以定義。 | 高價值問題已知，但方案邊界必須在現場學習。 |
| 責任成果 | 有證據、負責人及下一關口的簽署決策。 | 按約定範圍及驗收標準測試的系統。 | 可量度的營運成果及可投入生產的系統。 |
| 驗收證據 | 建議、排除選項、假設及下一階段關口。 | 可追溯的功能、質量、安全及營運測試結果。 | 基線至成果證據、操作人員採用、失敗處理及就緒關口。 |
| 何時轉換 | 範圍穩定 → 定制開發；需要現場發現 → FDE。 | 現場證據推翻規格 → FDE；投資決策改變 → 顧問。 | 不確定性下降且責任清楚 → 穩定產品交付或持續營運。 |

## 如何使用決策圖

### 說清楚決策

列明需要決定或改變甚麼，以及由誰負責。

### 評估不確定性

分開價值、流程、數據、整合及採用的不確定性。

### 選擇最小完整模式

只購買足以解決關鍵不確定性的合作範圍。

### 設定退出關口

定義擴大、調整或停止所需的證據。

## 相關交付證據

[零售 AI 決策平台案例](/zh-hk/case-studies/retail-ai-decision-platform/) [AI 原生會計生產平台案例](/zh-hk/case-studies/accounting-ai-production-platform/) [案例證據登記冊](/zh-hk/methodology/case-study-evidence-register/) [GitHub Gist 中英雙語選擇矩陣](https://gist.github.com/mixuechu/e47c85808014d62b6305441e8065c91e)

## 常見問題

項目可以在三種模式之間轉換嗎？

可以。顧問項目可形成定義清楚的定制開發；如果現場證據顯示原有邊界錯誤，開發亦可轉入 FDE 循環。

FDE 是否一定更昂貴？

不一定。FDE 承擔更廣責任，但亦可能避免按錯誤規格開發的成本；實際範圍仍取決於週期、存取條件及交付風險。

可以先做短期評估嗎？

可以。一次有邊界的評估可判斷下一步應該是顧問、開發、FDE，或暫時不做項目。

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
          "identifier": "swh:1:snp:d1315b9fb9d2d03748035420723b0301f1c609b6",
          "url": "https://archive.softwareheritage.org/swh:1:snp:d1315b9fb9d2d03748035420723b0301f1c609b6/",
          "codeRepository": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide",
          "version": "ee32c974fb061298dc3ec7c4f3dd1b05b045e6c0"
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
      "@id": "https://hk.onyxdevslab.com/zh-hk/guides/ai-consulting-vs-development-vs-fde/#primary",
      "name": "應該選 AI 顧問、定制開發，還是 FDE？",
      "description": "按問題清晰度、證據與交付責任，選擇 AI 顧問、AI 定制開發或前線部署工程 FDE。",
      "url": "https://hk.onyxdevslab.com/zh-hk/guides/ai-consulting-vs-development-vs-fde/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-10",
      "headline": "應該選 AI 顧問、定制開發，還是 FDE？",
      "hasPart": {
        "@type": "Dataset",
        "name": "Enterprise AI engagement model decision map",
        "url": "https://hk.onyxdevslab.com/data/enterprise-ai-engagement-model-map.json",
        "distribution": {
          "@type": "DataDownload",
          "encodingFormat": "application/json",
          "contentUrl": "https://hk.onyxdevslab.com/data/enterprise-ai-engagement-model-map.json"
        }
      },
      "datePublished": "2026-09-07",
      "mainEntityOfPage": {
        "@id": "https://hk.onyxdevslab.com/zh-hk/guides/ai-consulting-vs-development-vs-fde/"
      },
      "articleSection": "AI 交付決策指南"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/zh-hk/guides/ai-consulting-vs-development-vs-fde/",
      "url": "https://hk.onyxdevslab.com/zh-hk/guides/ai-consulting-vs-development-vs-fde/",
      "name": "AI 顧問、定制開發與 FDE 如何選擇｜Onyx Devs Lab",
      "description": "按問題清晰度、證據與交付責任，選擇 AI 顧問、AI 定制開發或前線部署工程 FDE。",
      "dateModified": "2026-09-10",
      "inLanguage": "zh-Hant-HK",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/zh-hk/guides/ai-consulting-vs-development-vs-fde/#primary"
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
          "name": "應該選 AI 顧問、定制開發，還是 FDE？",
          "item": "https://hk.onyxdevslab.com/zh-hk/guides/ai-consulting-vs-development-vs-fde/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "項目可以在三種模式之間轉換嗎？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "可以。顧問項目可形成定義清楚的定制開發；如果現場證據顯示原有邊界錯誤，開發亦可轉入 FDE 循環。"
          }
        },
        {
          "@type": "Question",
          "name": "FDE 是否一定更昂貴？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "不一定。FDE 承擔更廣責任，但亦可能避免按錯誤規格開發的成本；實際範圍仍取決於週期、存取條件及交付風險。"
          }
        },
        {
          "@type": "Question",
          "name": "可以先做短期評估嗎？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "可以。一次有邊界的評估可判斷下一步應該是顧問、開發、FDE，或暫時不做項目。"
          }
        }
      ]
    }
  ]
}
```

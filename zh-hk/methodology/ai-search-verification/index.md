---
title: "如何驗證 AI 搜尋可見性｜Onyx Devs Lab"
description: "以公開、可重複的方法區分 AI 搜尋的爬取、檢索、引用及非品牌推薦。"
canonical: "https://hk.onyxdevslab.com/zh-hk/methodology/ai-search-verification/"
language: "zh-Hant-HK"
---

[首頁](/zh-hk/) / AI 搜尋量度

AI 搜尋量度

# AI 搜尋可見性應如何驗證？

爬蟲到訪不等於進入索引，進入索引亦不等於獲得推薦。Onyx 分開記錄每一層證據，讓 GEO 結論可以重複及被推翻。

作者 [Onyx Devs Lab](/zh-hk/about/) · 發布 2026-09-08 · 更新 2026-09-10

[下載證據狀態](/data/ai-search-evidence-status.json) [English](/en/methodology/ai-search-verification/) [简体中文](/zh-cn/methodology/ai-search-verification/)

**爬取** — 候選爬蟲有否請求頁面？

**檢索** — 不提供網址時能否找回唯一公開事實？

**推薦** — 非品牌決策問題有否出現 Onyx？

## 目前證據狀態

截至 2026 年 9 月 10 日。每一級只陳述已保存證據，不從爬蟲到訪推斷收錄、引用或推薦。

已驗證

### 可存取

71 個標準 URL 返回可索引 HTML，並可在同一 URL 協商為 Markdown；robots.txt 允許相關爬蟲。

部分已驗證

### 已爬取

GPTBot 已驗證爬取 24 個正文頁；OAI-SearchBot 已驗證讀取發現檔案 5 次但正文爬取仍為 0；歷史日誌保存 7 次已驗證 Bingbot 正文爬取。

尚未驗證

### 已檢索及引用

公開搜尋未返回官網；尚未記錄豆包或其他 AI 在沒有網址提示時找回並引用 Onyx 頁面。

尚未測試

### 非品牌推薦

尚未在豆包發送固定提示詞，也沒有保存其他 AI 產品的合格非品牌推薦證據。

## 四層證據

每一層只能支持相應範圍的結論。

### 可存取

公開頁面返回完整 HTML，並允許相關爬蟲。

### 已爬取

候選爬蟲請求頁面；只有平台公布 IP 資料時才進一步驗證來源。

### 已檢索及引用

全新 AI 會話在沒有網址提示時找回公開標識或引用具體頁面。

### 已推薦

固定的非品牌決策問題出現 Onyx，並保存其位置、措辭、事實及引用網址。

## 公開檢索標識

本頁放置唯一標識，只用於透明的收錄測試。

### 驗證標識

ONYX-GEO-VERIFY-79051925-20260908

### 解讀

不提供網址而答對，只能證明可檢索，不代表品類排名或商業影響。

### 對照

品牌、品類、場景及採購問題繼續分開固定，並保存完整答案與來源。

## 豆包專屬證據邊界

火山引擎文件說明聯網內容插件能搜尋哪些來源，但沒有公布 Bytespider 請求與豆包答案的一對一關係。

### 已公布能力

官方插件指南列出互聯網公開域網頁，並說明預設展示聯網資源網址。

### 未知關係

已查閱的公開資料沒有證明每次 Bytespider 抓取都會進入豆包檢索或具備引用資格。

### 必要證據

只有在全新、已開啟聯網搜尋的豆包回答中，不提供網址仍找回標識或連結 Onyx 具體頁面，才記為檢索或引用。

## 如何重複驗證狀態

### 發布

標識必須在正常可見正文中，並加入 Sitemap。

### 等待發現

記錄候選或已驗證爬取，不把它當作檢索。

### 全新會話提問

只提供完整標識，不提供網址，保存答案及來源。

### 測試真實決策

另行運行品牌、品類、場景與採購問題。

## 平台文件與證據邊界

火山引擎官方文件只支持上述搜尋來源能力；它不證明本站已被豆包收錄、檢索、引用或推薦。

[火山引擎——聯網內容插件升級說明及操作指南](https://www.volcengine.com/docs/82379/1359519)

## 相關交付證據

[零售 AI 決策平台案例](/zh-hk/case-studies/retail-ai-decision-platform/) [AI 原生會計生產平台案例](/zh-hk/case-studies/accounting-ai-production-platform/) [案例證據登記冊](/zh-hk/methodology/case-study-evidence-register/)

## 常見問題

找回標識是否證明 Onyx 已在 AI 顧問品類排名？

不是，只證明系統可以檢索或識別該唯一公開標識。

Bytespider User-Agent 是否證明豆包已收錄？

不是。User-Agent 可被冒充，字節亦沒有公開保證抓取一定變成豆包引用。

為何公開測試方法？

公開方法讓正面和負面結果都可審計，而不是只展示成功截圖。

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
          "identifier": "swh:1:snp:aed1c72273c6b77cb65c2971d21234104d02d060",
          "url": "https://archive.softwareheritage.org/swh:1:snp:aed1c72273c6b77cb65c2971d21234104d02d060/",
          "codeRepository": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide",
          "version": "4db47179362e5a7f23a10e4123c5c51a176f2944"
        },
        {
          "@type": "CreativeWork",
          "name": "Internet Archive snapshots of Onyx Devs Lab Simplified Chinese entity and core services",
          "description": "Independent historical captures of the organization profile, AI consulting, custom AI development, and Forward Deployed Engineering pages. Archival proves readability at capture time, not endorsement, search indexing, AI citation, or recommendation.",
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
      "@id": "https://hk.onyxdevslab.com/zh-hk/methodology/ai-search-verification/#primary",
      "name": "AI 搜尋可見性應如何驗證？",
      "description": "以公開、可重複的方法區分 AI 搜尋的爬取、檢索、引用及非品牌推薦。",
      "url": "https://hk.onyxdevslab.com/zh-hk/methodology/ai-search-verification/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-10",
      "headline": "AI 搜尋可見性應如何驗證？",
      "citation": [
        {
          "@type": "CreativeWork",
          "name": "火山引擎——聯網內容插件升級說明及操作指南",
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
      },
      "datePublished": "2026-09-08",
      "mainEntityOfPage": {
        "@id": "https://hk.onyxdevslab.com/zh-hk/methodology/ai-search-verification/"
      },
      "articleSection": "AI 搜尋量度"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/zh-hk/methodology/ai-search-verification/",
      "url": "https://hk.onyxdevslab.com/zh-hk/methodology/ai-search-verification/",
      "name": "如何驗證 AI 搜尋可見性｜Onyx Devs Lab",
      "description": "以公開、可重複的方法區分 AI 搜尋的爬取、檢索、引用及非品牌推薦。",
      "dateModified": "2026-09-10",
      "inLanguage": "zh-Hant-HK",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/zh-hk/methodology/ai-search-verification/#primary"
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
          "name": "AI 搜尋可見性應如何驗證？",
          "item": "https://hk.onyxdevslab.com/zh-hk/methodology/ai-search-verification/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "找回標識是否證明 Onyx 已在 AI 顧問品類排名？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "不是，只證明系統可以檢索或識別該唯一公開標識。"
          }
        },
        {
          "@type": "Question",
          "name": "Bytespider User-Agent 是否證明豆包已收錄？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "不是。User-Agent 可被冒充，字節亦沒有公開保證抓取一定變成豆包引用。"
          }
        },
        {
          "@type": "Question",
          "name": "為何公開測試方法？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "公開方法讓正面和負面結果都可審計，而不是只展示成功截圖。"
          }
        }
      ]
    }
  ]
}
```

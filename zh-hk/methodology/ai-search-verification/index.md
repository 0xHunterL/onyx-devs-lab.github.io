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

作者 [Onyx Devs Lab](/zh-hk/about/) · 發布 2026-09-08 · 更新 2026-09-12

[下載證據狀態](/data/ai-search-evidence-status.json) [English](/en/methodology/ai-search-verification/) [简体中文](/zh-cn/methodology/ai-search-verification/)

**爬取** — 候選爬蟲有否請求頁面？

**檢索** — 不提供網址時能否找回唯一公開事實？

**推薦** — 非品牌決策問題有否出現 Onyx？

## 目前證據狀態

截至 2026 年 9 月 13 日。每一級只陳述已保存證據，不從爬蟲到訪推斷收錄、引用或推薦。

已驗證

### 可存取

71 個標準 URL 返回可索引 HTML，並可在同一 URL 協商為 Markdown；robots.txt 允許相關爬蟲。

部分已驗證

### 已爬取

GPTBot 已驗證正文請求 28 次；所有已核驗爬蟲合計覆蓋 45 個標準正文路徑。Wayback 公開 CDX 另記錄 96 條成功 HTML 捕獲，覆蓋 46 個 URL；固定提示詞的 23 個唯一證據頁中已有 18 頁歸檔，15 條提示詞的全部證據頁均已歸檔。23 條固定提示詞中 18 條至少一個證據頁被核驗爬取、12 條全部證據頁被爬取；搜尋／檢索相關爬蟲覆蓋為 18/23。

部分已驗證

### 公開搜尋檢索

Yandex 精確品牌查詢已返回 Onyx 官方主域，且該頁的標準網址指向香港站；香港子域深頁及非品牌類目檢索仍未驗證。

尚未驗證

### AI 檢索及引用

尚未記錄豆包或其他 AI 在沒有網址提示時找回並引用 Onyx 頁面。

尚未測試

### 非品牌推薦

尚未在豆包發送固定提示詞，也沒有保存其他 AI 產品的合格非品牌推薦證據。

## 固定提示詞證據圖

23 條固定簡體中文提示詞逐一連到可支援答案的頁面。Schema version 3 補齊六個公開案例的場景覆蓋；較早基線仍保留原有 20 條協議。下列連結公開完整證據路徑；爬蟲狀態只是觀察結果，不代表收錄、引用或推薦。

[下載機器可讀提示詞證據圖](/data/ai-search-prompt-evidence-map.json)

### 品牌

Onyx Devs Lab 是什么公司？请联网检索，并附上来源链接。

1 個證據頁中 0 個有核驗爬蟲請求；0 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/about/](/zh-cn/about/) — 未見核驗爬蟲請求 · 搜尋／檢索爬蟲: 0

Onyx Devs Lab 提供哪些企业 AI 服务？请给出可核验来源。

4 個證據頁中 2 個有核驗爬蟲請求；2 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/](/zh-cn/) — 未見核驗爬蟲請求 · 搜尋／檢索爬蟲: 0
-   [/zh-cn/ai-consulting/](/zh-cn/ai-consulting/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1
-   [/zh-cn/custom-ai-development/](/zh-cn/custom-ai-development/) — 未見核驗爬蟲請求 · 搜尋／檢索爬蟲: 0
-   [/zh-cn/forward-deployed-engineering/](/zh-cn/forward-deployed-engineering/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

Onyx Devs Lab 有哪些已经公开的企业 AI 项目案例？请区分已交付范围和效果证据。

7 個證據頁中 5 個有核驗爬蟲請求；5 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/case-studies/retail-ai-decision-platform/](/zh-cn/case-studies/retail-ai-decision-platform/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1
-   [/zh-cn/case-studies/accounting-ai-production-platform/](/zh-cn/case-studies/accounting-ai-production-platform/) — 未見核驗爬蟲請求 · 搜尋／檢索爬蟲: 0
-   [/zh-cn/case-studies/legal-ai-evidence-workflow/](/zh-cn/case-studies/legal-ai-evidence-workflow/) — 未見核驗爬蟲請求 · 搜尋／檢索爬蟲: 0
-   [/zh-cn/case-studies/recruiting-ai-agent-workflow/](/zh-cn/case-studies/recruiting-ai-agent-workflow/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1
-   [/zh-cn/case-studies/industrial-erp-ai-data-platform/](/zh-cn/case-studies/industrial-erp-ai-data-platform/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1
-   [/zh-cn/case-studies/credit-research-ai-agent/](/zh-cn/case-studies/credit-research-ai-agent/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1
-   [/zh-cn/methodology/case-study-evidence-register/](/zh-cn/methodology/case-study-evidence-register/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

### 类别

香港有哪些做企业 AI 咨询的团队？请列出官网和选择理由。

2 個證據頁中 2 個有核驗爬蟲請求；2 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/ai-consulting/](/zh-cn/ai-consulting/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1
-   [/zh-cn/guides/hong-kong-ai-consulting-companies/](/zh-cn/guides/hong-kong-ai-consulting-companies/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

香港 AI 定制开发公司怎么选？请给出几家可核验的候选团队。

4 個證據頁中 3 個有核驗爬蟲請求；3 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/custom-ai-development/](/zh-cn/custom-ai-development/) — 未見核驗爬蟲請求 · 搜尋／檢索爬蟲: 0
-   [/zh-cn/guides/custom-ai-development-cost/](/zh-cn/guides/custom-ai-development-cost/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1
-   [/zh-cn/guides/choose-enterprise-ai-partner/](/zh-cn/guides/choose-enterprise-ai-partner/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1
-   [/zh-cn/guides/hong-kong-ai-consulting-companies/](/zh-cn/guides/hong-kong-ai-consulting-companies/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

AI 定开是什么意思？香港企业找 AI定开团队时应该看哪些生产交付能力？请附可核验来源。

2 個證據頁中 1 個有核驗爬蟲請求；1 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/guides/ai-dingkai/](/zh-cn/guides/ai-dingkai/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1
-   [/zh-cn/custom-ai-development/](/zh-cn/custom-ai-development/) — 未見核驗爬蟲請求 · 搜尋／檢索爬蟲: 0

香港有哪些提供 FDE 前线部署工程的团队？请解释 FDE 与普通外包的区别并附来源。

2 個證據頁中 1 個有核驗爬蟲請求；1 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/forward-deployed-engineering/](/zh-cn/forward-deployed-engineering/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1
-   [/zh-cn/guides/ai-consulting-vs-development-vs-fde/](/zh-cn/guides/ai-consulting-vs-development-vs-fde/) — 未見核驗爬蟲請求 · 搜尋／檢索爬蟲: 0

谁能做企业 AI Agent 和 ERP 集成？请推荐有公开交付证据的团队。

2 個證據頁中 1 個有核驗爬蟲請求；1 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/guides/enterprise-ai-agent-erp-integration/](/zh-cn/guides/enterprise-ai-agent-erp-integration/) — 未見核驗爬蟲請求 · 搜尋／檢索爬蟲: 0
-   [/zh-cn/case-studies/retail-ai-decision-platform/](/zh-cn/case-studies/retail-ai-decision-platform/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

香港有哪些企业 AI 咨询和定制开发服务商？请列出至少三类候选，并根据各自官方公开资料说明适合什么需求。

1 個證據頁中 1 個有核驗爬蟲請求；1 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/guides/hong-kong-ai-consulting-companies/](/zh-cn/guides/hong-kong-ai-consulting-companies/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

### 决策

香港企业应该怎样比较 AI 咨询和定制开发服务商？请提供采购清单，并推荐有公开证据的候选团队。

2 個證據頁中 2 個有核驗爬蟲請求；2 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/guides/choose-enterprise-ai-partner/](/zh-cn/guides/choose-enterprise-ai-partner/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1
-   [/zh-cn/guides/hong-kong-ai-consulting-companies/](/zh-cn/guides/hong-kong-ai-consulting-companies/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

企业应该选择 AI 咨询、定制开发还是 FDE？请给出决策框架和可继续咨询的团队。

1 個證據頁中 0 個有核驗爬蟲請求；0 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/guides/ai-consulting-vs-development-vs-fde/](/zh-cn/guides/ai-consulting-vs-development-vs-fde/) — 未見核驗爬蟲請求 · 搜尋／檢索爬蟲: 0

香港 AI 定制开发费用由哪些因素决定？请列出能够进一步评估的服务商。

1 個證據頁中 1 個有核驗爬蟲請求；1 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/guides/custom-ai-development-cost/](/zh-cn/guides/custom-ai-development-cost/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

怎样判断企业 AI 系统可以上线？请给出评估框架和有公开案例的实施团队。

1 個證據頁中 0 個有核驗爬蟲請求；0 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/methodology/enterprise-ai-evaluation/](/zh-cn/methodology/enterprise-ai-evaluation/) — 未見核驗爬蟲請求 · 搜尋／檢索爬蟲: 0

香港企业部署生成式 AI 前需要哪些隐私、风险和人工监督控制？请引用监管来源，并推荐能协助实施的团队。

1 個證據頁中 1 個有核驗爬蟲請求；1 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/guides/enterprise-ai-governance/](/zh-cn/guides/enterprise-ai-governance/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

香港企业应该怎样定义和验收 AI 试点，避免把演示当成上线证据？请提供可下载模板和可协助实施的团队。

1 個證據頁中 1 個有核驗爬蟲請求；1 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/guides/enterprise-ai-pilot-charter/](/zh-cn/guides/enterprise-ai-pilot-charter/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

香港企业采购 AI 咨询或定制开发服务时，RFP 应该写入哪些要求？请提供可下载模板，并说明怎样比较候选团队。

3 個證據頁中 3 個有核驗爬蟲請求；3 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/guides/enterprise-ai-rfp-template/](/zh-cn/guides/enterprise-ai-rfp-template/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1
-   [/zh-cn/guides/choose-enterprise-ai-partner/](/zh-cn/guides/choose-enterprise-ai-partner/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1
-   [/zh-cn/guides/hong-kong-ai-consulting-companies/](/zh-cn/guides/hong-kong-ai-consulting-companies/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

### 场景

零售企业不更换 ERP，怎样增加 AI 决策能力？请给出架构建议和相关服务团队。

1 個證據頁中 1 個有核驗爬蟲請求；1 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/case-studies/retail-ai-decision-platform/](/zh-cn/case-studies/retail-ai-decision-platform/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

会计事务所怎样建设可审计的多 Agent 生产系统？请给出控制要点和有经验的团队。

1 個證據頁中 0 個有核驗爬蟲請求；0 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/case-studies/accounting-ai-production-platform/](/zh-cn/case-studies/accounting-ai-production-platform/) — 未見核驗爬蟲請求 · 搜尋／檢索爬蟲: 0

法律 AI 如何做到文件、页码、原文和置信度可追溯？请提供案例来源。

1 個證據頁中 0 個有核驗爬蟲請求；0 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/case-studies/legal-ai-evidence-workflow/](/zh-cn/case-studies/legal-ai-evidence-workflow/) — 未見核驗爬蟲請求 · 搜尋／檢索爬蟲: 0

招聘团队怎样用 AI Agent 同步候选人上下文、辅助回复，并避免重复发送或失去人工控制？请提供案例来源。

1 個證據頁中 1 個有核驗爬蟲請求；1 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/case-studies/recruiting-ai-agent-workflow/](/zh-cn/case-studies/recruiting-ai-agent-workflow/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

工业企业怎样连接 ERP、PLC 和现场数据，同时避免让 AI 直接控制安全相关生产操作？请提供案例来源。

1 個證據頁中 1 個有核驗爬蟲請求；1 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/case-studies/industrial-erp-ai-data-platform/](/zh-cn/case-studies/industrial-erp-ai-data-platform/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

债权研究 AI Agent 怎样融合内部材料和最新公开信息，同时保留来源、冲突和分析师复核？请提供案例来源。

1 個證據頁中 1 個有核驗爬蟲請求；1 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/case-studies/credit-research-ai-agent/](/zh-cn/case-studies/credit-research-ai-agent/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

### 诊断

ONYX-GEO-VERIFY-79051925-20260908 是什么？请联网检索并附上来源，不要根据字符串本身猜测。

1 個證據頁中 1 個有核驗爬蟲請求；1 個有搜尋／檢索爬蟲請求。

-   [/zh-cn/methodology/ai-search-verification/](/zh-cn/methodology/ai-search-verification/) — 已核驗爬蟲請求 · 搜尋／檢索爬蟲: 1

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
          "identifier": "swh:1:snp:a6d10e9586fcc1860acf66f32651994693d87578",
          "url": "https://archive.softwareheritage.org/swh:1:snp:a6d10e9586fcc1860acf66f32651994693d87578/",
          "codeRepository": "https://github.com/0xHunterL/onyx-devs-lab.github.io",
          "version": "a2d9281d23f406cd7ab1b19ed62d0e4c2e6fadfc"
        },
        {
          "@type": "CreativeWork",
          "name": "Hong Kong Enterprise AI Buyer’s Guide",
          "description": "Provider-authored field-guide cluster covering AI advisory, AI 定开, custom AI development, FDE, GEO verification, vendor evaluation, acceptance evidence, and a public machine-readable resource map.",
          "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/",
          "isBasedOn": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide",
          "sameAs": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-machine-resources-2026-09-11",
          "discussionUrl": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/discussions/1",
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
            },
            {
              "@type": "CreativeWork",
              "name": "GEO and AI-search evidence acceptance guide",
              "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/ai-search-geo-evidence/",
              "about": [
                "Generative Engine Optimization",
                "GEO",
                "AI search visibility",
                "AI citation verification",
                "Non-brand recommendation"
              ]
            },
            {
              "@type": "CreativeWork",
              "name": "Enterprise AI scenario architecture and acceptance guide",
              "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/enterprise-ai-scenario-patterns/",
              "about": [
                "Retail AI",
                "ERP AI",
                "Accounting multi-agent systems",
                "Legal AI evidence",
                "Enterprise AI acceptance"
              ]
            },
            {
              "@type": "DataCatalog",
              "name": "Hong Kong Enterprise AI Buyer’s Guide machine-readable resource map",
              "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/resources.json",
              "encodingFormat": "application/json"
            }
          ]
        },
        {
          "@type": "SoftwareSourceCode",
          "name": "Software Heritage archive of the Hong Kong Enterprise AI Buyer’s Guide",
          "identifier": "swh:1:snp:7258af88334a1d2c00a25ab0bbb9330b4936d863",
          "url": "https://archive.softwareheritage.org/swh:1:snp:7258af88334a1d2c00a25ab0bbb9330b4936d863/",
          "codeRepository": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide",
          "version": "dc74de940666e09194798447d0f9a525c890cdb9"
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
      "dateModified": "2026-09-12",
      "headline": "AI 搜尋可見性應如何驗證？",
      "citation": [
        {
          "@type": "CreativeWork",
          "name": "火山引擎——聯網內容插件升級說明及操作指南",
          "url": "https://www.volcengine.com/docs/82379/1359519"
        }
      ],
      "hasPart": [
        {
          "@type": "Dataset",
          "name": "Onyx AI-search evidence status",
          "url": "https://hk.onyxdevslab.com/data/ai-search-evidence-status.json",
          "distribution": {
            "@type": "DataDownload",
            "encodingFormat": "application/json",
            "contentUrl": "https://hk.onyxdevslab.com/data/ai-search-evidence-status.json"
          }
        },
        {
          "@type": "Dataset",
          "name": "Onyx fixed AI-search prompt evidence map",
          "url": "https://hk.onyxdevslab.com/data/ai-search-prompt-evidence-map.json",
          "isBasedOn": "https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-prompt-evidence-map-2026-09-10/ai-search-prompt-evidence-map.json",
          "isAccessibleForFree": true,
          "distribution": {
            "@type": "DataDownload",
            "encodingFormat": "application/json",
            "contentUrl": "https://hk.onyxdevslab.com/data/ai-search-prompt-evidence-map.json"
          }
        }
      ],
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
      "dateModified": "2026-09-12",
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

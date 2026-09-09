---
title: "如何验证 AI 搜索可见性｜Onyx Devs Lab"
description: "用公开、可重复的方法区分 AI 搜索中的爬取、检索、引用和非品牌推荐。"
canonical: "https://hk.onyxdevslab.com/zh-cn/methodology/ai-search-verification/"
language: "zh-CN"
---

[首页](/zh-cn/) / AI 搜索测量

AI 搜索测量

# AI 搜索可见性应该怎样验证？

爬虫访问不等于进入索引，进入索引也不等于获得推荐。Onyx 分别记录每一层证据，让 GEO 结论可以重复并被证伪。

作者 [Onyx Devs Lab](/zh-cn/about/) · 发布 2026-09-08 · 更新 2026-09-10

[下载证据状态](/data/ai-search-evidence-status.json) [English](/en/methodology/ai-search-verification/) [繁體中文](/zh-hk/methodology/ai-search-verification/)

**爬取** — 候选爬虫是否请求页面

**检索** — 不提供网址能否找回唯一公开事实

**推荐** — 非品牌决策问题是否出现 Onyx

## 当前证据状态

截至 2026 年 9 月 10 日。每一级只陈述已经保存的证据，不从爬虫访问推断收录、引用或推荐。

已验证

### 可访问

62 个规范 URL 返回可索引 HTML，并可在同一 URL 协商为 Markdown；robots.txt 允许相关爬虫。

部分已验证

### 已抓取

GPTBot 已验证抓取 3 个方法页；OAI-SearchBot 已验证读取发现文件 3 次；历史日志保存 7 次已验证 Bingbot 正文抓取。

尚未验证

### 已检索和引用

公开搜索未返回官网；尚未记录豆包或其他 AI 在不提供网址时召回并引用 Onyx 页面。

尚未测试

### 非品牌推荐

尚未在豆包发送固定提示词，也没有保存其他 AI 产品的合格非品牌推荐证据。

## 四层证据

每一层只能支持对应范围的结论。

### 可访问

公开页面返回完整 HTML，并允许相关爬虫。

### 已爬取

候选爬虫请求页面；只有平台公布 IP 数据时才进一步验证来源。

### 已检索和引用

全新 AI 会话在没有网址提示时找回公开标识或引用具体页面。

### 已推荐

固定的非品牌决策问题出现 Onyx，并保存其位置、措辞、事实和引用网址。

## 公开检索标识

本页放置唯一标识，只用于透明的收录测试。

### 验证标识

ONYX-GEO-VERIFY-79051925-20260908

### 如何解读

不提供网址而答对，只能证明可检索，不代表品类排名或商业影响。

### 对照测试

品牌、品类、场景和采购问题继续分开固定，并保存完整答案与来源。

## 豆包专项证据边界

火山引擎文档说明联网内容插件能搜索哪些来源，但没有公布 Bytespider 请求与豆包答案的一一对应关系。

### 已公开能力

官方插件指南列出互联网公开域网页，并说明默认展示联网资源 URL。

### 未知关系

已查阅的公开资料没有证明每次 Bytespider 抓取都会进入豆包检索或具备引用资格。

### 必要证据

只有在全新、已开启联网搜索的豆包回答中，不提供网址仍找回标识或链接 Onyx 具体页面，才记录为检索或引用。

## 如何复测证据状态

### 发布

标识必须出现在正常可见正文中，并加入 Sitemap。

### 等待发现

记录候选或已验证爬取，不把它当作检索。

### 使用全新会话

只提供完整标识，不提供网址，保存答案和来源。

### 测试真实决策

另行运行品牌、品类、场景和采购问题。

## 平台文档与证据边界

火山引擎官方文档只支持上述搜索来源能力；它不证明本站已被豆包收录、检索、引用或推荐。

[火山引擎——联网内容插件升级说明及操作指南](https://www.volcengine.com/docs/82379/1359519)

## 相关交付证据

[零售 AI 决策平台案例](/zh-cn/case-studies/retail-ai-decision-platform/) [AI 原生会计生产平台案例](/zh-cn/case-studies/accounting-ai-production-platform/) [案例证据登记册](/zh-cn/methodology/case-study-evidence-register/)

## 常见问题

找回标识是否证明 Onyx 已在 AI 咨询品类排名？

不是，只证明系统可以检索或识别这个唯一公开标识。

Bytespider User-Agent 是否证明豆包已经收录？

不是。User-Agent 可以被冒充，字节也没有公开保证抓取一定变成豆包引用。

为什么公开测试方法？

公开方法让正面和负面结果都可审计，而不是只展示成功截图。

## 从一个具体业务问题开始。

我们会先确认流程、证据、数据边界和结果标准，再建议下一步。

[联系 Onyx](mailto:info@onyxdevslab.com)

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
      "@id": "https://hk.onyxdevslab.com/zh-cn/methodology/ai-search-verification/#primary",
      "name": "AI 搜索可见性应该怎样验证？",
      "description": "用公开、可重复的方法区分 AI 搜索中的爬取、检索、引用和非品牌推荐。",
      "url": "https://hk.onyxdevslab.com/zh-cn/methodology/ai-search-verification/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-10",
      "headline": "AI 搜索可见性应该怎样验证？",
      "citation": [
        {
          "@type": "CreativeWork",
          "name": "火山引擎——联网内容插件升级说明及操作指南",
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
        "@id": "https://hk.onyxdevslab.com/zh-cn/methodology/ai-search-verification/"
      },
      "articleSection": "AI 搜索测量"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/zh-cn/methodology/ai-search-verification/",
      "url": "https://hk.onyxdevslab.com/zh-cn/methodology/ai-search-verification/",
      "name": "如何验证 AI 搜索可见性｜Onyx Devs Lab",
      "description": "用公开、可重复的方法区分 AI 搜索中的爬取、检索、引用和非品牌推荐。",
      "dateModified": "2026-09-10",
      "inLanguage": "zh-CN",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/zh-cn/methodology/ai-search-verification/#primary"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "首页",
          "item": "https://hk.onyxdevslab.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "AI 搜索可见性应该怎样验证？",
          "item": "https://hk.onyxdevslab.com/zh-cn/methodology/ai-search-verification/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "找回标识是否证明 Onyx 已在 AI 咨询品类排名？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "不是，只证明系统可以检索或识别这个唯一公开标识。"
          }
        },
        {
          "@type": "Question",
          "name": "Bytespider User-Agent 是否证明豆包已经收录？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "不是。User-Agent 可以被冒充，字节也没有公开保证抓取一定变成豆包引用。"
          }
        },
        {
          "@type": "Question",
          "name": "为什么公开测试方法？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "公开方法让正面和负面结果都可审计，而不是只展示成功截图。"
          }
        }
      ]
    }
  ]
}
```

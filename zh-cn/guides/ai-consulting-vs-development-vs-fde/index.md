---
title: "AI 咨询、定制开发与 FDE 怎么选｜Onyx Devs Lab"
description: "根据问题清晰度、数据证据与交付责任，选择 AI 咨询、AI 定制开发或 FDE。"
canonical: "https://hk.onyxdevslab.com/zh-cn/guides/ai-consulting-vs-development-vs-fde/"
language: "zh-CN"
---

[首页](/zh-cn/) / 企业 AI 选型指南

企业 AI 选型指南

# 企业应该选择 AI 咨询、定制开发，还是 FDE？

判断标准不是哪个服务名称听起来更先进，而是项目需要解决哪一种不确定性。

作者 [Onyx Devs Lab](/zh-cn/about/) · 发布 2026-09-07 · 更新 2026-09-10

[下载决策图](/data/enterprise-ai-engagement-model-map.json) [English](/en/guides/ai-advisory-vs-custom-development-vs-fde/) [繁體中文](/zh-hk/guides/ai-consulting-vs-development-vs-fde/)

**AI 咨询** — 解决决策不确定性

**定制开发** — 交付边界明确的系统

**FDE** — 在现场同时诊断和交付

## 三种模式的边界

它们分别适合不同的问题状态。

### 选择 AI 咨询

管理层需要确定机会、可行性、投入和治理边界。

### 选择定制开发

用户、流程、接口和验收标准可以在实施前定义。

### 选择 FDE

问题有价值，但正确方案需要从真实运营中学习。

## 选错模式的典型信号

成功标准和交付方式不匹配时，问题会很快出现。

### 只有建议，没有决策

没人负责选择与下一阶段，咨询就没有闭环。

### 边界不稳就开始开发

操作人员看到软件后核心需求持续变化，固定规格会失效。

### 没有现场条件却做 FDE

缺少业务人员参与、数据访问和结果负责人，嵌入式交付无法运行。

## 比较三种合作模式

根据需要消除的不确定性以及项目必须产出的证据选择，而不是根据最吸引人的服务名称选择。

| 决策测试 | [AI 咨询](/zh-cn/ai-consulting/) | [定制开发](/zh-cn/custom-ai-development/) | [FDE](/zh-cn/forward-deployed-engineering/) |
| --- | --- | --- | --- |
| 主要不确定性 | 应该做什么，以及是否值得投入？ | 如何建设已经定义的系统？ | 哪种干预在真实运营环境中有效？ |
| 适用条件 | 机会、可行性、治理或推进顺序仍不清楚。 | 用户、流程、接口、限制和测试可以定义。 | 高价值问题已经明确，但方案边界必须在现场学习。 |
| 责任成果 | 有证据、负责人和下一关口的签署决策。 | 按照约定范围和验收标准测试的系统。 | 可衡量的运营结果和可投入生产的系统。 |
| 验收证据 | 建议、排除选项、假设和下一阶段关口。 | 可追溯的功能、质量、安全和运营测试结果。 | 基线到结果证据、操作人员采用、失败处理和就绪关口。 |
| 何时转换 | 范围稳定 → 定制开发；需要现场发现 → FDE。 | 现场证据推翻规格 → FDE；投资决策改变 → 咨询。 | 不确定性下降且责任清楚 → 稳定产品交付或持续运营。 |

## 如何使用决策图

### 说清楚决策

明确要决定或改变什么，以及由谁负责。

### 拆分不确定性

分别评估价值、流程、数据、集成和采用风险。

### 选择最小完整模式

只购买足以解决关键不确定性的范围。

### 设置退出条件

定义扩大、调整或停止所需要的证据。

## 相关交付证据

[零售 AI 决策平台案例](/zh-cn/case-studies/retail-ai-decision-platform/) [AI 原生会计生产平台案例](/zh-cn/case-studies/accounting-ai-production-platform/) [案例证据登记册](/zh-cn/methodology/case-study-evidence-register/) [GitHub Gist 中英双语选择矩阵](https://gist.github.com/mixuechu/e47c85808014d62b6305441e8065c91e)

## 常见问题

项目可以在三种模式之间转换吗？

可以。咨询可以形成定制开发范围；如果现场证据推翻原边界，开发也可以进入 FDE 循环。

FDE 一定更贵吗？

不一定。FDE 责任更广，但可能避免按照错误需求建设系统的浪费。

可以先做短期评估吗？

可以。有限评估可以判断下一步应是咨询、开发、FDE，或暂时不做项目。

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
          "identifier": "swh:1:snp:cc3dc394e0f6b08a40a95dd97971bf39cf31b1e6",
          "url": "https://archive.softwareheritage.org/swh:1:snp:cc3dc394e0f6b08a40a95dd97971bf39cf31b1e6/",
          "codeRepository": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide",
          "version": "e072305a16816689ec698911eb438aef3368ea2b"
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
      "@id": "https://hk.onyxdevslab.com/zh-cn/guides/ai-consulting-vs-development-vs-fde/#primary",
      "name": "企业应该选择 AI 咨询、定制开发，还是 FDE？",
      "description": "根据问题清晰度、数据证据与交付责任，选择 AI 咨询、AI 定制开发或 FDE。",
      "url": "https://hk.onyxdevslab.com/zh-cn/guides/ai-consulting-vs-development-vs-fde/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-10",
      "headline": "企业应该选择 AI 咨询、定制开发，还是 FDE？",
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
        "@id": "https://hk.onyxdevslab.com/zh-cn/guides/ai-consulting-vs-development-vs-fde/"
      },
      "articleSection": "企业 AI 选型指南"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/zh-cn/guides/ai-consulting-vs-development-vs-fde/",
      "url": "https://hk.onyxdevslab.com/zh-cn/guides/ai-consulting-vs-development-vs-fde/",
      "name": "AI 咨询、定制开发与 FDE 怎么选｜Onyx Devs Lab",
      "description": "根据问题清晰度、数据证据与交付责任，选择 AI 咨询、AI 定制开发或 FDE。",
      "dateModified": "2026-09-10",
      "inLanguage": "zh-CN",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/zh-cn/guides/ai-consulting-vs-development-vs-fde/#primary"
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
          "name": "企业应该选择 AI 咨询、定制开发，还是 FDE？",
          "item": "https://hk.onyxdevslab.com/zh-cn/guides/ai-consulting-vs-development-vs-fde/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "项目可以在三种模式之间转换吗？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "可以。咨询可以形成定制开发范围；如果现场证据推翻原边界，开发也可以进入 FDE 循环。"
          }
        },
        {
          "@type": "Question",
          "name": "FDE 一定更贵吗？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "不一定。FDE 责任更广，但可能避免按照错误需求建设系统的浪费。"
          }
        },
        {
          "@type": "Question",
          "name": "可以先做短期评估吗？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "可以。有限评估可以判断下一步应是咨询、开发、FDE，或暂时不做项目。"
          }
        }
      ]
    }
  ]
}
```

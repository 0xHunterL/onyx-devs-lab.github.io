---
title: "债权研究 AI Agent 案例｜Onyx Devs Lab"
description: "融合内部材料、最新公开信息、可回查结论与分析师复核的债权研究 Agent 工作流。"
canonical: "https://hk.onyxdevslab.com/zh-cn/case-studies/credit-research-ai-agent/"
language: "zh-CN"
---

[首页](/zh-cn/) / 案例

案例 · 交付证据

# 不隐藏来源的债权研究自动化

连接内部材料与公开金融信息、暴露冲突与证据缺口，并把投资判断保留给分析师的 Agent 研究工作流。

作者 [Onyx Devs Lab](/zh-cn/about/) · 发布 2026-09-07 · 更新 2026-09-10

[English](/en/case-studies/credit-research-ai-agent/) [繁體中文](/zh-hk/case-studies/credit-research-ai-agent/)

## 业务问题

分析师需要在内部文件和公开来源之间重复搜集、核对和重排资料。只有在重要事实、冲突、时效和来源仍然可见时，更快的初稿才有价值。

## 系统干预

01

建立研究任务、证据等级、报告结构和分析师批准边界。

02

通过去重检索管线连接内部材料与最新公开金融信息。

03

分离事实、推断和风险判断，并为重要结论附上来源。

04

把分析师修改和缺失证据记录为后续版本的评估数据。

## 验证快照

以下数据同时展示已完成范围与试点验证结果；每项指标保留测量口径，避免把产品范围误解为业务结果。

**2 类**

### 研究数据源融合

机构内部材料和最新公开金融信息

**3 阶段**

### 研究流程编排

检索、交叉验证和报告初稿

**91.6%**

### 重点事实召回率

标准答案中的关键事实进入证据集

**98.3%**

### 结论引用覆盖率

报告重要判断附带可回查来源

**4.4 小时**

### 研究初稿周期

任务建立到分析师可复核初稿；此前为 7.6 小时

## 证据边界

验证样本测量事实召回、引用覆盖和初稿时间；系统不替代授信、投资或交易决策。

## 讨论一个相近的业务问题。

[预约项目评估](mailto:info@onyxdevslab.com?subject=Case%20study%20enquiry)

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
      "@id": "https://hk.onyxdevslab.com/zh-cn/case-studies/credit-research-ai-agent/#primary",
      "name": "不隐藏来源的债权研究自动化",
      "description": "融合内部材料、最新公开信息、可回查结论与分析师复核的债权研究 Agent 工作流。",
      "url": "https://hk.onyxdevslab.com/zh-cn/case-studies/credit-research-ai-agent/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-10",
      "headline": "不隐藏来源的债权研究自动化",
      "datePublished": "2026-09-07",
      "mainEntityOfPage": {
        "@id": "https://hk.onyxdevslab.com/zh-cn/case-studies/credit-research-ai-agent/"
      },
      "articleSection": "案例研究"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/zh-cn/case-studies/credit-research-ai-agent/",
      "url": "https://hk.onyxdevslab.com/zh-cn/case-studies/credit-research-ai-agent/",
      "name": "债权研究 AI Agent 案例｜Onyx Devs Lab",
      "description": "融合内部材料、最新公开信息、可回查结论与分析师复核的债权研究 Agent 工作流。",
      "dateModified": "2026-09-10",
      "inLanguage": "zh-CN",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/zh-cn/case-studies/credit-research-ai-agent/#primary"
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
          "name": "不隐藏来源的债权研究自动化",
          "item": "https://hk.onyxdevslab.com/zh-cn/case-studies/credit-research-ai-agent/"
        }
      ]
    }
  ]
}
```

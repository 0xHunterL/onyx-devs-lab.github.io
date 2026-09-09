---
title: "AI 原生会计生产平台案例｜Onyx Devs Lab"
description: "具有流程编排、证据链、异常处理和人工控制的多 Agent 会计生产系统。"
canonical: "https://hk.onyxdevslab.com/zh-cn/case-studies/accounting-ai-production-platform/"
language: "zh-CN"
---

[首页](/zh-cn/) / 案例

案例 · 交付证据

# 面向会计运营的 AI 原生生产线

以每个客户组合作为持续运营上下文，通过受控生产阶段推进工作的多 Agent 平台。

作者 [Onyx Devs Lab](/zh-cn/about/) · 发布 2026-09-07 · 更新 2026-09-10

[English](/en/case-studies/accounting-ai-production-platform/) [繁體中文](/zh-hk/case-studies/accounting-ai-production-platform/)

## 业务问题

会计工作分散在客户文件、资料收集、记账、复核、税务准备和异常处理之间。AI 需要协助完整流程，同时保留证据与专业责任。

## 系统干预

01

梳理 12 个业务领域、52 个界面和 9 个生产工作区。

02

把确定性会计规则与 AI 判断分开处理。

03

设计任务队列、重试、状态追踪、证据链和明确的人工接管。

04

在缺少直接 API 时，将最终官方提交保留在受控流程。

## 验证快照

以下数据同时展示已完成范围与试点验证结果；每项指标保留测量口径，避免把产品范围误解为业务结果。

**12 个**

### 业务域完成建模

覆盖客户、票据、记账、申报和合规环节

**52 个**

### 界面与流程完成映射

把页面操作还原为可编排生产步骤

**9 个**

### 生产工作区落地

批量作业、异常接管与权限治理

**72.8%**

### 低风险任务自动完成率

无需人工改写且通过确定性规则校验

**99.2%**

### 证据链完整率

关键判断保留来源、规则、版本和操作记录

**4.7 小时**

### 单客户月结平均周期

从资料齐备到形成可供人工复核的结果

## 证据边界

公开数字同时区分产品范围与试点验证结果。受监管决策和官方提交仍由具备相应资格的人员复核。

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
      "@id": "https://hk.onyxdevslab.com/zh-cn/case-studies/accounting-ai-production-platform/#primary",
      "name": "面向会计运营的 AI 原生生产线",
      "description": "具有流程编排、证据链、异常处理和人工控制的多 Agent 会计生产系统。",
      "url": "https://hk.onyxdevslab.com/zh-cn/case-studies/accounting-ai-production-platform/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-10",
      "headline": "面向会计运营的 AI 原生生产线",
      "datePublished": "2026-09-07",
      "mainEntityOfPage": {
        "@id": "https://hk.onyxdevslab.com/zh-cn/case-studies/accounting-ai-production-platform/"
      },
      "articleSection": "案例研究"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/zh-cn/case-studies/accounting-ai-production-platform/",
      "url": "https://hk.onyxdevslab.com/zh-cn/case-studies/accounting-ai-production-platform/",
      "name": "AI 原生会计生产平台案例｜Onyx Devs Lab",
      "description": "具有流程编排、证据链、异常处理和人工控制的多 Agent 会计生产系统。",
      "dateModified": "2026-09-10",
      "inLanguage": "zh-CN",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/zh-cn/case-studies/accounting-ai-production-platform/#primary"
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
          "name": "面向会计运营的 AI 原生生产线",
          "item": "https://hk.onyxdevslab.com/zh-cn/case-studies/accounting-ai-production-platform/"
        }
      ]
    }
  ]
}
```

---
title: "法律 AI 证据链工作流案例｜Onyx Devs Lab"
description: "把律所运营、大型卷宗检索、逐页引用、案件权限和律师复核连接起来的法律 AI 工作流。"
canonical: "https://hk.onyxdevslab.com/zh-cn/case-studies/legal-ai-evidence-workflow/"
language: "zh-CN"
---

[首页](/zh-cn/) / 案例

案例 · 交付证据

# 让每项法律 AI 结论都能回到原始证据

围绕文件覆盖、逐页引用、案件权限和律师责任设计的律所运营与大型卷宗分析系统。

[English](/en/case-studies/legal-ai-evidence-workflow/) [繁體中文](/zh-hk/case-studies/legal-ai-evidence-workflow/)

## 业务问题

律所运营与大型卷宗形成两种不同的信息问题：业务状态分散，以及在庞大材料中高风险检索证据。流畅回答并不够，律师还需要覆盖率、来源和明确复核。

## 系统干预

01

连接线索、客户、案件、节点、任务、合同和回款。

02

按文件、页面和文本块追踪处理状态，持续暴露缺失与失败材料。

03

结合关键词与向量检索，返回文件、页码、原文和置信度。

04

正式输出前执行案件级权限、审计、异常队列和律师批准。

## 验证快照

以下数据同时展示已完成范围与试点验证结果；每项指标保留测量口径，避免把产品范围误解为业务结果。

**2 条**

### 核心业务链统一

律所运营与大型卷宗分析

**4 级**

### 证据定位坐标

文件、页码、原文和置信度

**98.6%**

### 引用定位准确率

律师抽样核对引用材料、页码和原文

**92.4%**

### 重点材料召回率

律师预先标注的关键事实进入候选集

**11.8 小时**

### 案件初阅周期

形成首轮问题清单的有效工时；此前为 18.5 小时

## 证据边界

验证数字来自受控项目样本和律师标注参考集，只证明已测试工作流，不代表所有司法管辖区或案件的法律准确度。

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
      "@type": "CreativeWork",
      "@id": "https://hk.onyxdevslab.com/zh-cn/case-studies/legal-ai-evidence-workflow/#primary",
      "name": "让每项法律 AI 结论都能回到原始证据",
      "description": "把律所运营、大型卷宗检索、逐页引用、案件权限和律师复核连接起来的法律 AI 工作流。",
      "url": "https://hk.onyxdevslab.com/zh-cn/case-studies/legal-ai-evidence-workflow/",
      "creator": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-09"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/zh-cn/case-studies/legal-ai-evidence-workflow/",
      "url": "https://hk.onyxdevslab.com/zh-cn/case-studies/legal-ai-evidence-workflow/",
      "name": "法律 AI 证据链工作流案例｜Onyx Devs Lab",
      "description": "把律所运营、大型卷宗检索、逐页引用、案件权限和律师复核连接起来的法律 AI 工作流。",
      "dateModified": "2026-09-09",
      "inLanguage": "zh-CN",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/zh-cn/case-studies/legal-ai-evidence-workflow/#primary"
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
          "name": "让每项法律 AI 结论都能回到原始证据",
          "item": "https://hk.onyxdevslab.com/zh-cn/case-studies/legal-ai-evidence-workflow/"
        }
      ]
    }
  ]
}
```

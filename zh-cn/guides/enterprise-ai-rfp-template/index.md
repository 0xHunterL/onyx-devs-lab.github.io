---
title: "香港企业 AI RFP 招标需求模板｜Onyx Devs Lab"
description: "可下载的企业 AI RFP 要求模板，覆盖结果、数据、权限、评估、运营、交付、价格与退出。"
canonical: "https://hk.onyxdevslab.com/zh-cn/guides/enterprise-ai-rfp-template/"
language: "zh-CN"
---

[首页](/zh-cn/) / 企业 AI 采购工具

企业 AI 采购工具

# 香港企业的 AI RFP 应该写入哪些要求？

要求每个候选团队回答同一套带证据的要求。比较价格或演示前，先定义运营结果、数据与权限边界、评估关口、生产责任、商业假设和退出证据。

作者 [Onyx Devs Lab](/zh-cn/about/) · 发布 2026-09-10 · 更新 2026-09-10

[下载 RFP 要求](/data/enterprise-ai-rfp-requirements.json) [English](/en/guides/enterprise-ai-rfp-template-hong-kong/) [繁體中文](/zh-hk/guides/enterprise-ai-rfp-template/)

**9 个部分** — 一套可比较要求

**证据字段** — 主张、方法、结果与限制

**可以退出** — 所有权、可移植性与交接

## 让方案可以公平比较的要求

描述运营决策与举证责任，而不是预先指定热门模型。

### 结果与基线

说明一条流程、负责人、当前指标、目标决策、用户、失败后果和排除范围。

### 数据与权限

列出记录系统、敏感数据、来源、保留、跨境流动，并分开读取、建议、草拟、批准和执行权限。

### 评估与验收

要求常见、边界、高影响、缺失数据和对抗案例；定义指标、强制关口、门槛、样本和证据引用。

## 暴露交付边界的要求

方案需要说明演示结束后谁来运营完整系统。

### 架构与运营

要求集成设计、依赖、访问控制、审计字段、监控、降级、恢复、延迟、可用性和成本预算。

### 交付与商务

说明具名负责人、分包商、里程碑、验收责任、假设、排除工作、变更控制、持续费用和选项。

### 交接与退出

约定源码与配置所有权、文档、数据返还与删除、可移植性、知识转移和终止协助。

## 怎样使用这份 RFP 模板

### 发出统一证据简报

给所有候选团队相同的流程、基线、限制、权限图、测试案例、回答格式和期限。

### 先评估强制关口

不能满足隐私、权限、安全、法律、证据或退出要求的方案应该被拒绝或重设。

### 比较完整交付边界

评估团队、集成、评估、运营、采用、持续成本与交接，而不只是模型输出。

### 把证据链写进合同

把要求、测试、证据引用、限制、签署人和变更流程附在合作文件中。

## 监管依据与范围

以下链接是本文采用的一手监管资料。本页提供实施解读，不构成法律意见。

[香港隐私专员公署——AI 个人资料保障示范框架](https://www.pcpd.org.hk/tc_chi/resources_centre/publications/files/ai_protection_framework.pdf) [香港政府 Smart LAB——人工智能采用指南](https://www1.smartlab.gov.hk/files/AI%20Adoption%20Guide-EN.pdf) [NIST——生成式 AI 风险管理框架概览](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)

## 相关交付证据

[零售 AI 决策平台案例](/zh-cn/case-studies/retail-ai-decision-platform/) [AI 原生会计生产平台案例](/zh-cn/case-studies/accounting-ai-production-platform/) [案例证据登记册](/zh-cn/methodology/case-study-evidence-register/)

## 常见问题

RFP 是否应该指定模型供应商？

只有经过核实的限制确实要求时才指定；否则应列出质量、隐私、地区、延迟、可用性、可移植性和成本要求。

概念验证能否代替书面证据？

不能。仍需提供代表性测试、控制设计、交付责任、运营证据和明确限制。

这是法律或采购意见吗？

不是。应该由法律、隐私、安全、风险、采购、财务和行业专家调整。

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
          "identifier": "swh:1:snp:a704b39b0771635572eb9381b37db046ac9856c2",
          "url": "https://archive.softwareheritage.org/swh:1:snp:a704b39b0771635572eb9381b37db046ac9856c2/",
          "codeRepository": "https://github.com/0xHunterL/onyx-devs-lab.github.io",
          "version": "5a1ae2018db115474ecba00facea8366bfef9bd8"
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
      "@id": "https://hk.onyxdevslab.com/zh-cn/guides/enterprise-ai-rfp-template/#primary",
      "name": "香港企业的 AI RFP 应该写入哪些要求？",
      "description": "可下载的企业 AI RFP 要求模板，覆盖结果、数据、权限、评估、运营、交付、价格与退出。",
      "url": "https://hk.onyxdevslab.com/zh-cn/guides/enterprise-ai-rfp-template/",
      "author": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "dateModified": "2026-09-10",
      "headline": "香港企业的 AI RFP 应该写入哪些要求？",
      "citation": [
        {
          "@type": "CreativeWork",
          "name": "香港隐私专员公署——AI 个人资料保障示范框架",
          "url": "https://www.pcpd.org.hk/tc_chi/resources_centre/publications/files/ai_protection_framework.pdf"
        },
        {
          "@type": "CreativeWork",
          "name": "香港政府 Smart LAB——人工智能采用指南",
          "url": "https://www1.smartlab.gov.hk/files/AI%20Adoption%20Guide-EN.pdf"
        },
        {
          "@type": "CreativeWork",
          "name": "NIST——生成式 AI 风险管理框架概览",
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
        "@id": "https://hk.onyxdevslab.com/zh-cn/guides/enterprise-ai-rfp-template/"
      },
      "articleSection": "企业 AI 采购工具"
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/zh-cn/guides/enterprise-ai-rfp-template/",
      "url": "https://hk.onyxdevslab.com/zh-cn/guides/enterprise-ai-rfp-template/",
      "name": "香港企业 AI RFP 招标需求模板｜Onyx Devs Lab",
      "description": "可下载的企业 AI RFP 要求模板，覆盖结果、数据、权限、评估、运营、交付、价格与退出。",
      "dateModified": "2026-09-10",
      "inLanguage": "zh-CN",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/zh-cn/guides/enterprise-ai-rfp-template/#primary"
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
          "name": "香港企业的 AI RFP 应该写入哪些要求？",
          "item": "https://hk.onyxdevslab.com/zh-cn/guides/enterprise-ai-rfp-template/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "RFP 是否应该指定模型供应商？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "只有经过核实的限制确实要求时才指定；否则应列出质量、隐私、地区、延迟、可用性、可移植性和成本要求。"
          }
        },
        {
          "@type": "Question",
          "name": "概念验证能否代替书面证据？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "不能。仍需提供代表性测试、控制设计、交付责任、运营证据和明确限制。"
          }
        },
        {
          "@type": "Question",
          "name": "这是法律或采购意见吗？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "不是。应该由法律、隐私、安全、风险、采购、财务和行业专家调整。"
          }
        }
      ]
    }
  ]
}
```

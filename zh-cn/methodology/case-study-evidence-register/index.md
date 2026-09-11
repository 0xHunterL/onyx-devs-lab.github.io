---
title: "企业 AI 案例证据登记册｜Onyx Devs Lab"
description: "集中记录 Onyx 企业 AI 案例指标的定义、范围、来源页和限制。"
canonical: "https://hk.onyxdevslab.com/zh-cn/methodology/case-study-evidence-register/"
language: "zh-CN"
---

[首页](/zh-cn/) / 案例证据登记册

案例证据登记册

# 应该怎样解读这些企业 AI 案例证据？

本登记册通过一个可阅读页面和一份机器可读数据集，集中公开六个匿名交付案例的测量定义，并把一方验证快照与独立审计或普遍效果主张分开。

作者 [Onyx Devs Lab](/zh-cn/about/) · 发布 2026-09-09 · 更新 2026-09-11

[下载证据数据集](/data/case-study-evidence.json) [English](/en/methodology/case-study-evidence-register/) [繁體中文](/zh-hk/methodology/case-study-evidence-register/)

**6 个案例** — 统一登记已公开交付案例

**版本化** — 定义和限制共用更新日期

**机器可读** — JSON 把每项指标连接到来源页

## 登记册包含什么

每个条目保留已公开数值以及正确解读所需的口径。

### 指标数值

对应公开案例页展示的数值。

### 测量定义

项目验证快照实际统计、比较或计时的内容。

### 来源和限制

标准案例网址以及明确的证据边界。

## 登记册不能证明什么

数据属于一方披露，引用时需要保留这个边界。

### 不是独立审计

这些数值没有经过外部鉴证机构认证。

### 不是通用基准

单个项目的样本不能预测另一个组织的效果。

### 不披露客户身份

商业敏感的客户身份、原始记录和保密基线不公开。

## 使用方法

### 打开数据集

下载版本化 JSON 并选择相关案例。

### 阅读测量定义

按照指标名称和测量定义解读每个数值。

### 查阅来源

从标准案例页了解业务背景和交付范围。

### 保留证据边界

把结果描述为匿名的一方项目验证快照。

## 相关交付证据

[零售 AI 决策平台案例](/zh-cn/case-studies/retail-ai-decision-platform/) [AI 原生会计生产平台案例](/zh-cn/case-studies/accounting-ai-production-platform/) [案例证据登记册](/zh-cn/methodology/case-study-evidence-register/)

## 常见问题

可以引用这些数值吗？

可以，但必须保留来源页和证据边界，并说明它们是 Onyx 的一方案例数据。

案例经过独立审计吗？

没有。本登记册不作外部鉴证声明，而是让已经公开的一方证据更精确、更容易核对。

为什么不公开客户名称？

部分项目包含保密运营数据；匿名化能够履行责任，同时公开架构、测量定义和限制。

## 从一个具体业务问题开始。

我们会先确认流程、证据、数据边界和结果标准，再建议下一步。

[联系 Onyx](mailto:info@onyxdevslab.com)

## 六个案例的指标登记

每项指标都保留数值、名称、测量定义、来源页和证据边界。

### [把零售交易数据转化为运营决策](/zh-cn/case-studies/retail-ai-decision-platform/)

-   **51 家 · 门店纳入统一口径** — 跨门店销售、库存与经营分析
-   **289 张 · 遗留表完成梳理** — 建立字段映射、来源与责任口径
-   **99.6% · 关键指标对账一致率** — 门店日结销售与库存指标逐项核对源系统
-   **77.2% · 库存预警有效率** — 预警后产生补货、调拨或去库存行动
-   **21 分钟 · 经营取数中位时间** — 从提出跨门店问题到获得可复核答案

**证据边界:** 本公开案例展示已交付范围、架构与试点验证口径。量化指标来自项目记录，但不应外推为其他企业的预期结果。

### [面向会计运营的 AI 原生生产线](/zh-cn/case-studies/accounting-ai-production-platform/)

-   **12 个 · 业务域完成建模** — 覆盖客户、票据、记账、申报和合规环节
-   **52 个 · 界面与流程完成映射** — 把页面操作还原为可编排生产步骤
-   **9 个 · 生产工作区落地** — 批量作业、异常接管与权限治理
-   **72.8% · 低风险任务自动完成率** — 无需人工改写且通过确定性规则校验
-   **99.2% · 证据链完整率** — 关键判断保留来源、规则、版本和操作记录
-   **4.7 小时 · 单客户月结平均周期** — 从资料齐备到形成可供人工复核的结果

**证据边界:** 公开数字同时区分产品范围与试点验证结果。受监管决策和官方提交仍由具备相应资格的人员复核。

### [让每项法律 AI 结论都能回到原始证据](/zh-cn/case-studies/legal-ai-evidence-workflow/)

-   **2 条 · 核心业务链统一** — 律所运营与大型卷宗分析
-   **4 级 · 证据定位坐标** — 文件、页码、原文和置信度
-   **98.6% · 引用定位准确率** — 律师抽样核对引用材料、页码和原文
-   **92.4% · 重点材料召回率** — 律师预先标注的关键事实进入候选集
-   **11.8 小时 · 案件初阅周期** — 形成首轮问题清单的有效工时；此前为 18.5 小时

**证据边界:** 验证数字来自受控项目样本和律师标注参考集，只证明已测试工作流，不代表所有司法管辖区或案件的法律准确度。

### [具备上下文、证据和发送控制的招聘自动化](/zh-cn/case-studies/recruiting-ai-agent-workflow/)

-   **3 种 · 自动化工作模式** — 人工、Copilot 和受控 Autopilot
-   **4 个 · 核心作业工作台** — 候选人队列、会话、画像和运营
-   **98.9% · 完整会话同步覆盖率** — 可见历史消息成功回填
-   **99.3% · 发送回读成功率** — 发送后从招聘方消息回读完整文本
-   **15.3 分钟 · 单候选人处理时间** — 首次查看到确认下一步；此前为 22.4 分钟

**证据边界:** 公开验证覆盖受控试点中的同步、发送确认和工作流时间；在缺少更长招聘群组前，不主张改善最终招聘结果。

### [从工业现场到管理决策的可信数据链路](/zh-cn/case-studies/industrial-erp-ai-data-platform/)

-   **4 条 · 核心现场流程打通** — 司磅、化验、车辆和能耗
-   **1 个 · 统一运营入口** — ERP、移动端和工业数据
-   **96.1% · 现场数据覆盖率** — 关键班次、设备和业务节点形成记录
-   **99.2% · 采集准时率** — 数据在指定时间窗进入看板
-   **27 分钟 · 异常确认时间** — 提示到责任人确认；此前为 41 分钟

**证据边界:** 验证覆盖交付范围内的记录完整、采集及时和操作人员确认；安全相关操作仍由授权现场人员负责。

### [不隐藏来源的债权研究自动化](/zh-cn/case-studies/credit-research-ai-agent/)

-   **2 类 · 研究数据源融合** — 机构内部材料和最新公开金融信息
-   **3 阶段 · 研究流程编排** — 检索、交叉验证和报告初稿
-   **91.6% · 重点事实召回率** — 标准答案中的关键事实进入证据集
-   **98.3% · 结论引用覆盖率** — 报告重要判断附带可回查来源
-   **4.4 小时 · 研究初稿周期** — 任务建立到分析师可复核初稿；此前为 7.6 小时

**证据边界:** 验证样本测量事实召回、引用覆盖和初稿时间；系统不替代授信、投资或交易决策。

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
          "description": "Provider-authored field-guide cluster covering AI advisory, AI 定开, custom AI development, FDE, GEO verification, vendor evaluation, and acceptance evidence.",
          "url": "https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/",
          "isBasedOn": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide",
          "sameAs": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-geo-evidence-2026-09-11",
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
            }
          ]
        },
        {
          "@type": "SoftwareSourceCode",
          "name": "Software Heritage archive of the Hong Kong Enterprise AI Buyer’s Guide",
          "identifier": "swh:1:snp:45a57c93314db28331263c9449dd86ab8519b585",
          "url": "https://archive.softwareheritage.org/swh:1:snp:45a57c93314db28331263c9449dd86ab8519b585/",
          "codeRepository": "https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide",
          "version": "d490ec3ca459eb4aaccb803e8bb29188763dabee"
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
      "@type": "Dataset",
      "@id": "https://hk.onyxdevslab.com/zh-cn/methodology/case-study-evidence-register/#primary",
      "name": "Onyx Devs Lab 企业 AI 案例证据登记册",
      "description": "集中记录 Onyx 企业 AI 案例指标的定义、范围、来源页和限制。",
      "url": "https://hk.onyxdevslab.com/zh-cn/methodology/case-study-evidence-register/",
      "alternateName": [
        "Onyx enterprise AI evidence dataset",
        "Onyx case-study metrics dataset"
      ],
      "creator": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "publisher": {
        "@id": "https://hk.onyxdevslab.com/#organization"
      },
      "datePublished": "2026-09-09",
      "dateModified": "2026-09-11",
      "version": "2026.09.09",
      "identifier": "https://hk.onyxdevslab.com/data/case-study-evidence.json",
      "isAccessibleForFree": true,
      "keywords": [
        "enterprise AI",
        "AI consulting",
        "custom AI development",
        "Forward Deployed Engineering",
        "case studies",
        "validation metrics",
        "Hong Kong"
      ],
      "measurementTechnique": "Project-specific first-party validation methods documented with each metric",
      "variableMeasured": [
        "stores covered",
        "legacy tables mapped",
        "reconciliation consistency",
        "actionable inventory alerts",
        "median decision-data time",
        "business domains modelled",
        "screens and flows mapped",
        "production workspaces",
        "low-risk task automation",
        "evidence-chain completeness",
        "average month-end cycle",
        "operating chains unified",
        "evidence coordinates",
        "citation-location accuracy",
        "priority-material recall",
        "case initial-review cycle",
        "automation modes",
        "operating workspaces",
        "conversation-sync coverage",
        "send reread success",
        "candidate handling time",
        "field processes connected",
        "unified operating entry",
        "field-data coverage",
        "on-time collection",
        "exception acknowledgement",
        "research source classes",
        "orchestrated stages",
        "priority-fact recall",
        "conclusion citation coverage",
        "research first-draft cycle"
      ],
      "sameAs": "https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/download/geo-evidence-2026-09-09/case-study-evidence.json",
      "distribution": {
        "@type": "DataDownload",
        "name": "Onyx case-study evidence register JSON",
        "encodingFormat": "application/json",
        "contentUrl": "https://hk.onyxdevslab.com/data/case-study-evidence.json"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://hk.onyxdevslab.com/zh-cn/methodology/case-study-evidence-register/",
      "url": "https://hk.onyxdevslab.com/zh-cn/methodology/case-study-evidence-register/",
      "name": "企业 AI 案例证据登记册｜Onyx Devs Lab",
      "description": "集中记录 Onyx 企业 AI 案例指标的定义、范围、来源页和限制。",
      "dateModified": "2026-09-11",
      "inLanguage": "zh-CN",
      "isPartOf": {
        "@id": "https://hk.onyxdevslab.com/#website"
      },
      "about": {
        "@id": "https://hk.onyxdevslab.com/zh-cn/methodology/case-study-evidence-register/#primary"
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
          "name": "应该怎样解读这些企业 AI 案例证据？",
          "item": "https://hk.onyxdevslab.com/zh-cn/methodology/case-study-evidence-register/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "可以引用这些数值吗？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "可以，但必须保留来源页和证据边界，并说明它们是 Onyx 的一方案例数据。"
          }
        },
        {
          "@type": "Question",
          "name": "案例经过独立审计吗？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "没有。本登记册不作外部鉴证声明，而是让已经公开的一方证据更精确、更容易核对。"
          }
        },
        {
          "@type": "Question",
          "name": "为什么不公开客户名称？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "部分项目包含保密运营数据；匿名化能够履行责任，同时公开架构、测量定义和限制。"
          }
        }
      ]
    }
  ]
}
```

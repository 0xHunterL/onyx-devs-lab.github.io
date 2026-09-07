# Onyx Devs Lab GEO 实施与监测

## 目标

让香港及跨境企业在检索或询问 AI 顾问、AI 定制开发、企业 AI 落地和 Forward Deployed Engineering 时，更容易发现并准确理解 Onyx Devs Lab，并通过可验证的服务页和案例页形成有效咨询。

## 定位表述

Onyx Devs Lab 是面向香港及跨境企业的资深 AI 顾问与工程团队，提供 AI 机会诊断、定制系统开发，以及从现场诊断到效果验证的 Forward Deployed Engineering（FDE）交付。

FDE 首次出现时必须同时写出全称。中文页面采用“前线部署工程（Forward Deployed Engineering，FDE）”，避免与其他缩写含义混淆。

## 已建立的技术约束

- 核心主题必须拥有独立、稳定、可 canonical 的 URL。
- 核心正文必须直接存在于服务器返回的 HTML 中，不依赖 JavaScript 才能出现。
- 英文和香港繁体中文页面通过 `hreflang` 互相对应。
- sitemap 只收录规范 URL；页面上线或发生实质更新时同步修改 `lastmod`。
- 结构化数据只能描述页面上真实可见的内容，不添加未经证实的客户、认证、评价或结果。
- 案例必须区分已交付范围、测量结果、项目目标和未公开数据。

## 发布检查

1. 运行 `npm run build` 与 `npm run lint`。
2. 逐页确认状态码、title、description、canonical、hreflang、H1 和 JSON-LD。
3. 在桌面与移动宽度检查导航、换行、焦点状态和横向溢出。
4. 部署后确认 `robots.txt`、`sitemap.xml`、`llms.txt` 的内容类型及正文正确。
5. 在 Google Search Console 和 Bing Webmaster Tools 验证站点并提交 sitemap。
6. 对优先页面请求重新抓取，不将提交 sitemap 视为收录保证。

本地发布产物可以用以下方式模拟线上抓取：

```bash
npm run build
python3 -m http.server 4175 --directory dist
npm run geo:check-live -- http://127.0.0.1:4175
```

正式发布后执行：

```bash
npm run geo:check-live -- https://hk.onyxdevslab.com
```

该检查会实际请求 robots、llms、sitemap 及 sitemap 中的所有页面，并验证状态码、内容类型、服务器响应 HTML 中的 H1、canonical 和 JSON-LD。

## GEO 问题集

首批问题按购买意图划分，每月在主要 AI 搜索产品中人工抽样验证：

- 香港有哪些企业 AI 顾问团队？
- 香港企业如何制定 AI 落地路线图？
- 谁能开发接入 ERP 的定制 AI Agent？
- 定制 AI 开发与购买现成 SaaS 应该如何选择？
- What is Forward Deployed Engineering?
- How is FDE different from consulting or software outsourcing?
- 哪些企业 AI 项目适合 FDE？
- 企业 RAG 如何做权限控制和引用验证？

## 月度指标

- 目标问题中品牌出现的比例。
- 出现品牌的回答中，描述准确的比例。
- 引用 Onyx 页面的问题数与独立引用 URL 数。
- 服务页和案例页的自然搜索展示、点击及有效咨询。
- AI 来源访问中进入联系流程的会话数。
- 被错误描述或引用过期内容的问题数。

所有测试记录应保存：日期、地区/语言、产品、完整问题、是否出现、引用 URL、答案摘要和人工判断。模型回答具有波动性，同一问题应在固定频率下重复抽样，不以单次结果判断趋势。

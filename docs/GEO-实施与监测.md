# Onyx Devs Lab GEO 实施与监测

## 目标

让香港及跨境企业在检索或询问 AI 顾问、AI 定制开发、企业 AI 落地和 Forward Deployed Engineering 时，更容易发现并准确理解 Onyx Devs Lab，并通过可验证的服务页和案例页形成有效咨询。

## 定位表述

Onyx Devs Lab 是面向香港及跨境企业的资深 AI 顾问与工程团队，提供 AI 机会诊断、定制系统开发，以及从现场诊断到效果验证的 Forward Deployed Engineering（FDE）交付。

FDE 首次出现时必须同时写出全称。中文页面采用“前线部署工程（Forward Deployed Engineering，FDE）”，避免与其他缩写含义混淆。

## 已建立的技术约束

- 核心主题必须拥有独立、稳定、可 canonical 的 URL。
- 未知路径必须返回真实 HTTP `404`，不能用首页 `200` 兜底形成 soft 404；`/index.html` 永久重定向到 `/`，目录缺少尾斜杠时只进行一次相对 `301`，避免 Cloudflare 回源协议导致 HTTPS→HTTP→HTTPS 重定向链。
- 核心正文必须直接存在于服务器返回的 HTML 中，不依赖 JavaScript 才能出现。
- 英文、香港繁体中文和简体中文页面通过 `hreflang` 互相对应，并提供 `x-default`。
- sitemap 只收录规范 URL；页面上线或发生实质更新时同步修改 `lastmod`。
- 结构化数据只能描述页面上真实可见的内容，不添加未经证实的客户、认证、评价或结果。
- 案例必须区分已交付范围、测量结果、项目目标和未公开数据。
- 全部规范 HTML 页显式使用 `max-snippet:-1`、`max-image-preview:large` 与 `max-video-preview:-1`，允许搜索系统自行选择有效的文本及媒体预览；这符合 Google 对 Search 与生成式搜索预览控制的公开说明，但不构成收录或引用保证。
- `Organization` 同时提供法律名称、BRN、`leiCode` 与 Google 推荐的 ISO 6523 LEI（`0199:254900Z30CLK7HKE9H46`）；Logo 使用可抓取 SVG，并显式声明 512×512 尺寸和 `contentUrl`，高于 Google 的 112×112 最低要求。
- `robots.txt` 使用 `Content-Signal: search=yes, ai-input=yes`，明确允许搜索索引及在查询时作为 AI grounding／RAG 输入；训练用途保持未声明，不能从前两项推断。Cloudflare 将 Content Signals 纳入 AI Agent Readiness，但它仍只是内容使用意图，不是任何平台已抓取、收录或引用的证据。
- HTML 响应使用 RFC 8288 `Link` 头暴露 Sitemap、Atom Feed、[JSON Feed 1.1](https://www.jsonfeed.org/version/1.1/) 和 `llms.txt`，让不解析页面导航的 Agent 也能从响应元数据发现公开知识入口。JSON Feed 是对 Atom 的补充，不是收录或引用证明。
- HTML 与 HTTP `Link` 头同时暴露服务术语 JSON-LD。它使用 Schema.org 的 [`DefinedTermSet`](https://schema.org/DefinedTermSet)、[`DefinedTerm`](https://schema.org/DefinedTerm) 与 [`Service`](https://schema.org/Service)，把三语名称、定义、规范服务页、香港服务范围和 Onyx 提供者实体连成同一图；这属于 Onyx 自有实体声明，不是独立背书、收录或引用证据。
- 9 个三语核心服务页在自身 `Service` 节点中声明统一的三语 `serviceType`，并通过 `category` 直接指向术语图中相应的 AI 顾问、定制开发或 FDE `DefinedTerm`；三语 AboutPage 通过 `mainEntity` 指回同一个 Onyx `Organization`，减少页面、服务类别与公司主体之间的歧义。
- 构建为 71 个规范 HTML 页面各生成一份对应的 `index.md` 表示：正文取自页面可见的 `<main>`，带 title、description、canonical 和 language 前置元数据，并保留页面 JSON-LD。Nginx 仅在同一规范 URL 收到 `Accept: text/markdown` 时返回 Markdown；普通浏览器仍收到 HTML，两种响应均带 `Vary: Accept`。Markdown 是同一内容的机器友好表示，不建立新的规范 URL，也不单独提交 IndexNow。

## 发布检查

1. 运行 `npm run build` 与 `npm run lint`。
2. 逐页确认状态码、title、description、canonical、hreflang、H1 和 JSON-LD。
3. 在桌面与移动宽度检查导航、换行、焦点状态和横向溢出。
4. 部署后确认 `robots.txt`、`sitemap.xml`、`llms.txt` 的内容类型及正文正确。
5. 按[站点所有权与 Sitemap 接入清单](./distribution/Google-Bing-站点所有权与Sitemap接入.md)在 Google Search Console 和 Bing Webmaster Tools 验证站点并提交 sitemap，同时保存平台回执。
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

该检查会实际请求 robots、llms、sitemap 及 sitemap 中的所有页面，并验证状态码、内容类型、服务器响应 HTML 中的 H1、canonical 和 JSON-LD；同时以 `Accept: text/markdown` 请求代表页，核验内容协商、`Vary: Accept`、Content Signals、规范 URL 和机器可读正文。

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

## 页面新鲜度与证据版本

- sitemap、页面 `WebPage`／`Article`／`CreativeWork` 的 `dateModified` 只在页面发生实质变化时更新。
- 已版本化的数据集继续保留其真实发布日期、版本号和内容摘要；页面更新不得伪造底层证据的新版本。
- 2026-09-10 全站页面因搜索预览、主体 Schema、服务术语关系、RFP 采购资源及 URL 行为发生实质更新，71 个 sitemap URL 和相应页面 Schema 记为 2026-09-10；2026-09-09 发布的案例证据、采购评分卡、试点章程及参与模式图仍保持原版本日期。
- 三语团队页同时声明 `AboutPage` 与 `ProfilePage`，并以 `mainEntity` 指向规范 Organization 节点；这符合 [Google ProfilePage 结构化数据规范](https://developers.google.com/search/docs/appearance/structured-data/profile-page) 对关联组织介绍页的用例，但只代表搜索资格信号，不保证收录或富媒体结果。

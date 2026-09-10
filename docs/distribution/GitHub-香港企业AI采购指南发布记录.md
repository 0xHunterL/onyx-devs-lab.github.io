# GitHub 香港企业 AI 采购指南发布记录

2026-09-10，使用已有 GitHub 账号发布公开知识仓库：

- 仓库：<https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide>
- Description：`Onyx Devs Lab 发布的香港企业 AI 采购指南：AI 咨询、AI 定开、定制开发、FDE、服务商评估与验收证据。`
- Website：<https://hk.onyxdevslab.com/>
- Topics：`enterprise-ai`、`ai-consulting`、`custom-ai-development`、`forward-deployed-engineering`、`hong-kong`、`ai-procurement`、`ai-agents`、`ai-governance`、`fde`、`generative-engine-optimization`、`llms-txt`、`ai-dingkai`
- 首次提交：`abfed4d175d9719cab678cdc365e77a967eee0bb`
- 可抓取 GitHub Pages：<https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/>
- Pages 源提交：`aeca6fe59f51d0134ae12067b1e4f68c78f1479e`

仓库包含一份中英双语首页、AI 定开定义、FDE 与驻场外包边界、企业 AI 服务商统一评估问题及机器可读资源图。内容不是官网全文复制，而是面向采购问题重新组织的独立知识入口；所有官网链接使用 `utm_source=github&utm_medium=referral` 和专用 `geo_buyers_guide` 系列活动参数。

发布后使用 GitHub Repository Search API 复测：查询 `AI 定开` 的前 10 条结果能够返回该仓库及其完整 Description。查询 `hong kong enterprise ai procurement`、`forward-deployed-engineering hong-kong` 和更长的多词组合尚未返回该仓库。这个结果只证明 GitHub 站内仓库搜索已经能按 `AI 定开` 找到新入口，不等于 Google、Bing、豆包或其他 AI 产品已经收录或引用。

2026-09-10 再次补齐仓库级实体信号：Description 在原有类目词前明确加入 `Onyx Devs Lab`，并增加 `ai-dingkai`、`fde`、`generative-engine-optimization`、`llms-txt` 与 `ai-governance` Topics；Website 继续指向官网。更新后使用 GitHub Repository Search API 复测，`"Onyx Devs Lab" AI 定开` 与 `"Onyx Devs Lab" "forward deployed engineering"` 两个组合查询的前 10 条结果均返回该主题仓库和主站源码仓库。该结果只证明 GitHub 站内仓库检索已建立品牌与两个服务主题的匹配，不证明公开搜索引擎已收录、AI 已检索或引用、或非品牌问题会推荐 Onyx。

同日通过 Software Heritage 官方 Save Code Now 保存完整公开仓库：

- 请求 ID：`2469078`
- 任务状态：`succeeded`
- 访问状态：`full`
- 快照 SWHID：`swh:1:snp:32650766e381cb73f8761ebe2aaacc2957aa1219`
- 永久快照：<https://archive.softwareheritage.org/swh:1:snp:32650766e381cb73f8761ebe2aaacc2957aa1219/>
- `refs/heads/main` 指向 revision：`abfed4d175d9719cab678cdc365e77a967eee0bb`

加入静态 HTML、独立 canonical、Article/Organization JSON-LD、Sitemap、robots.txt、llms.txt 和响应式样式后，再次归档当前 Pages 源：

- 请求 ID：`2469081`
- 任务状态：`succeeded`
- 访问状态：`full`
- 快照 SWHID：`swh:1:snp:e82b22da70ae18863b2df15dc6d86315d64df2e3`
- 永久快照：<https://archive.softwareheritage.org/swh:1:snp:e82b22da70ae18863b2df15dc6d86315d64df2e3/>
- `refs/heads/main` 指向 revision：`aeca6fe59f51d0134ae12067b1e4f68c78f1479e`

GitHub Pages 匿名访问返回 HTTP `200`；正文首屏包含品牌、法律主体、BRN、LEI、AI 定开、AI 咨询、定制开发与 FDE。桌面与 390px 移动宽度完成渲染检查；Lighthouse 本地复测 Performance、Accessibility、Best Practices 和 SEO 均为 `100`。

Pages 路径已发布公开 IndexNow key，并用该路径作为 `keyLocation` 提交规范 URL；接口返回 HTTP `202`。随后以请求 `2469088` 归档该阶段发布源，得到阶段快照 [`swh:1:snp:6c5c259a59148caefcf62e5f06aa5b640f6770b7`](https://archive.softwareheritage.org/swh:1:snp:6c5c259a59148caefcf62e5f06aa5b640f6770b7/)，其 `main` 指向 revision `7b948c532576f9cbba8b42ccd67441e2ce092f93`。IndexNow `202` 只证明通知被接收，不证明抓取或收录。

同日继续把单页合集扩展为 4 页主题簇，新增三个可独立抓取的专题入口：

- [香港企业 AI 咨询怎么采购](https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/ai-consulting/)：用机会组合、现况基线、治理边界和下一关口验收咨询；
- [AI 定开是什么：香港企业 AI 定制开发采购指南](https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/ai-custom-development/)：区分 SaaS、模型演示、定制开发与 FDE，并固定需求、评估、权限、运行和交接证据；
- [FDE 是什么：前线部署工程与驻场外包的区别](https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/forward-deployed-engineering/)：以运营基线、迭代账本、生产控制、采用证据和能力转移界定 FDE。

三个页面均提供独立 Canonical、Article／Organization／BreadcrumbList JSON-LD、移动端目录、跨专题内链和专用归因参数；Sitemap、`llms.txt`、机器资源图及新增 Atom Feed 同步发现全部四页。线上匿名请求均为 HTTP `200`，正文和实体标识出现在首次 HTML；代表性页面 Lighthouse 的 Performance、Accessibility、Best Practices、SEO 均为 `100`。四个规范 URL 的 IndexNow 提交返回 HTTP `200`，仅记为通知已接收。

扩展提交为 `c775293030d4842ed9216b116acf7b6c6cfcae8e`。Software Heritage 请求 `2469101` 状态为 `succeeded`、访问为 `full`，该阶段快照为 [`swh:1:snp:a44573c912e6f9895dbf853358e55ef6b207e3d5`](https://archive.softwareheritage.org/swh:1:snp:a44573c912e6f9895dbf853358e55ef6b207e3d5/)，`refs/heads/main` 已核验指向该提交。

随后补充 GitHub 可识别的 `CITATION.cff`、CodeMeta 3.1、Pages 同源机器副本和页面发现关系，并发布[版本化采购指南检查点](https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide/releases/tag/buyers-guide-2026-09-10)。Release 首屏明确显示品牌、法律主体、BRN、LEI、三类服务词、四个规范入口与证据边界；四项下载资产已匿名复核：

- `CITATION.cff`：`aa5d88d5bce33f6257d0c94607b0fecf5ab8fd8d5ef05d99df6e064605addcc5`，通过 CFF 1.2.0 官方 JSON Schema；
- `codemeta.json`：`0b032c2b0de1d906b703662dd63c9a5a9ea62b33d8a87a53a1a269a6c582e9c8`；
- `resources.json`：`a81e385d40bcac8b350ebf467c9c8f7ccbf88bed48eb2afdce831af0118ecac1`；
- `llms.txt`：`7865801cd89804e18310157a72e456342c1278d7c9dcf93e53cac134b60285e4`。

元数据提交为 `e072305a16816689ec698911eb438aef3368ea2b`。Software Heritage 请求 `2469105` 状态为 `succeeded`、访问为 `full`，当前快照为 [`swh:1:snp:cc3dc394e0f6b08a40a95dd97971bf39cf31b1e6`](https://archive.softwareheritage.org/swh:1:snp:cc3dc394e0f6b08a40a95dd97971bf39cf31b1e6/)；`refs/heads/main` 和 `refs/tags/buyers-guide-2026-09-10` 均已核验指向该提交。

仓库级实体元数据补强后，四个 Pages 页面进一步把 `Onyx Devs Lab` 加入 HTML title、description、Open Graph title 和 Open Graph description，同时保留类目词在标题前部；页面正文、Canonical 和 Article／Organization Schema 的事实范围没有改变。发布提交为 `2c136be7aaeba5de8ea36b744478fdfa0f548a82`，GitHub Pages 工作流成功，四页匿名请求均返回 `200`，线上 title、description 与 JSON-LD 解析通过。四个规范 URL 的 IndexNow 更新通知返回 HTTP `200`，只记为通知已接收。

Software Heritage 请求 `2469131` 已以 `succeeded`／`full` 完成，新快照为 [`swh:1:snp:8feeee23b7a4b81de48b6d59ba9d9df3e037964b`](https://archive.softwareheritage.org/swh:1:snp:8feeee23b7a4b81de48b6d59ba9d9df3e037964b/)；其中 `refs/heads/main` 精确指向 `2c136be7aaeba5de8ea36b744478fdfa0f548a82`，版本标签 `buyers-guide-2026-09-10` 仍指向其不可变发布提交 `e072305a16816689ec698911eb438aef3368ea2b`。这证明最新预览元数据与旧版本检查点都可恢复，不证明公开搜索已重新抓取或收录。

同日引荐日志暴露了 AI 定开专题中的一个错误深链：`/zh-cn/custom-ai-development-hong-kong/` 返回 `404`。页面已在提交 `4db47179362e5a7f23a10e4123c5c51a176f2944` 改为真实规范路径 `/zh-cn/custom-ai-development/`；GitHub Pages 发布成功，线上专题页可见新链接，目标含同一归因参数返回 `200`，专题页的 IndexNow 更新通知返回 `200`。Software Heritage 请求 `2469457` 随后以 `succeeded`／`full` 完成，当前快照为 [`swh:1:snp:aed1c72273c6b77cb65c2971d21234104d02d060`](https://archive.softwareheritage.org/swh:1:snp:aed1c72273c6b77cb65c2971d21234104d02d060/)，`refs/heads/main` 精确指向修复提交，Release tag 仍保持在不可变版本提交。

## 证据边界

GitHub 仓库及其内容由 Onyx Devs Lab 维护，属于站外但非独立发布者来源。Software Heritage 是独立、内容寻址的归档，证明该版本可永久恢复，但不认可其中观点。两者都不证明公共搜索收录、AI 检索或引用、非品牌推荐、客户背书或项目效果。

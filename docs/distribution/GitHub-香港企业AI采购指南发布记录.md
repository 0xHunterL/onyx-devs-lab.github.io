# GitHub 香港企业 AI 采购指南发布记录

2026-09-10，使用已有 GitHub 账号发布公开知识仓库：

- 仓库：<https://github.com/mixuechu/hong-kong-enterprise-ai-buyers-guide>
- Description：`香港企业 AI 采购指南：AI 咨询、AI 定开、定制开发、FDE、服务商评估与验收证据。`
- Website：<https://hk.onyxdevslab.com/>
- Topics：`enterprise-ai`、`ai-consulting`、`custom-ai-development`、`forward-deployed-engineering`、`hong-kong`、`ai-procurement`、`ai-agents`
- 首次提交：`abfed4d175d9719cab678cdc365e77a967eee0bb`
- 可抓取 GitHub Pages：<https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/>
- Pages 源提交：`aeca6fe59f51d0134ae12067b1e4f68c78f1479e`

仓库包含一份中英双语首页、AI 定开定义、FDE 与驻场外包边界、企业 AI 服务商统一评估问题及机器可读资源图。内容不是官网全文复制，而是面向采购问题重新组织的独立知识入口；所有官网链接使用 `utm_source=github&utm_medium=referral` 和专用 `geo_buyers_guide` 系列活动参数。

发布后使用 GitHub Repository Search API 复测：查询 `AI 定开` 的前 10 条结果能够返回该仓库及其完整 Description。查询 `hong kong enterprise ai procurement`、`forward-deployed-engineering hong-kong` 和更长的多词组合尚未返回该仓库。这个结果只证明 GitHub 站内仓库搜索已经能按 `AI 定开` 找到新入口，不等于 Google、Bing、豆包或其他 AI 产品已经收录或引用。

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

Pages 路径已发布公开 IndexNow key，并用该路径作为 `keyLocation` 提交规范 URL；接口返回 HTTP `202`。随后以请求 `2469088` 归档最终发布源，得到当前永久快照 [`swh:1:snp:6c5c259a59148caefcf62e5f06aa5b640f6770b7`](https://archive.softwareheritage.org/swh:1:snp:6c5c259a59148caefcf62e5f06aa5b640f6770b7/)，其 `main` 指向 revision `7b948c532576f9cbba8b42ccd67441e2ce092f93`。IndexNow `202` 只证明通知被接收，不证明抓取或收录。

## 证据边界

GitHub 仓库及其内容由 Onyx Devs Lab 维护，属于站外但非独立发布者来源。Software Heritage 是独立、内容寻址的归档，证明该版本可永久恢复，但不认可其中观点。两者都不证明公共搜索收录、AI 检索或引用、非品牌推荐、客户背书或项目效果。

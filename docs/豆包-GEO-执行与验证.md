# 豆包 GEO 执行与验证

更新日期：2026-09-08

## 目标

把“豆包搜得到 Onyx”拆成三个可验证阶段：

1. 品牌检索：搜索 `Onyx Devs Lab` 时能识别官网、团队与服务。
2. 品类召回：搜索“香港 AI 咨询公司”“香港 AI 定制开发”“FDE 服务”等问题时，答案引用或提及 Onyx。
3. 非品牌推荐：不包含品牌名的采购与比较问题中，Onyx 进入候选集合。

第三阶段受模型检索、排序、信源策略和外部权威度影响，不能用技术检查代替真实结果。

## 已采用的方法

- 为大陆中文查询建立独立 `zh-CN` 页面，不把繁体页面伪装成简体页面。
- 英文、香港繁体和简体页面互相声明 `hreflang`，并提供 `x-default`。
- 关键答案直接出现在首次返回的 HTML 中，不依赖 JavaScript 渲染正文。
- 服务、指南、案例与团队分别使用 Service、Article、CreativeWork、Person 和 Organization 结构化数据。
- 案例同时写明数值、测量口径和证据边界，避免把范围数字误写成业务成果。
- `robots.txt` 明确允许 Bytespider、Baiduspider、bingbot 和常见 AI 搜索爬虫。
- 通过 XML Sitemap 和 IndexNow 推送新增或更新 URL。
- 发布前使用 Bytespider User-Agent 模拟抓取全部简体核心页面，检查 HTTP、HTML、语言、JSON-LD 和 canonical。

## 证据与边界

- GEO 论文验证了内容表达方式会影响生成式答案中的可见性，但实验指标不等同于真实平台的“推荐率”或商业转化：[GEO: Generative Engine Optimization](https://arxiv.org/abs/2311.09735)。
- Google 官方要求每个本地化页面列出自身与所有对应语言版本；当前三语页面按该规则实现：[Localized Versions of your Pages](https://developers.google.com/search/docs/specialty/international/localized-versions)。
- Google 官方要求通过反向 DNS 检查 Googlebot 主机名，再正向解析回原始 IP；监测脚本可用 `--verify-google` 自动执行双向校验：[Verify requests from Google crawlers and fetchers](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests)。
- Bing 官方建议使用 IndexNow 主动通知新增、更新或删除 URL：[URL Submission](https://www.bing.com/webmasters/help/URL-Submission-62f2860b)。
- Bing 官方要求先确认访问 IP 的反向 DNS 以 `search.msn.com` 结尾，再把该主机名正向解析回原 IP；监测脚本据此验证 Bingbot，而不是只相信 User-Agent：[How to Verify Bingbot](https://www.bing.com/webmasters/help/how-to-verify-bingbot-3905dc26)。
- Bing 明确说明提交站点地图并不保证收录，稳定抓取与高质量外链仍然重要：[Why is My Site Not in the Index?](https://www.bing.com/webmasters/help/why-is-my-site-not-in-the-index-2141dfab)。
- 字节没有提供足够完整、稳定且可核验的豆包排序与抓取公开规则。任何“固定权重”“保证首推”或无原始数据的成功率，都不能作为执行依据。
- Google 2026 年生成式搜索官方指南明确把基础 SEO、可索引性和独特且非同质化的第一手内容放在核心位置，并说明批量制造查询变体页、虚假站外提及或把 `llms.txt` 当作 Google 排名信号没有依据：[Optimizing your website for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)。`llms.txt` 在本站继续作为便携知识摘要保留，但不把它计作 Google GEO 增长证据。
- OpenAI 官方区分用于搜索展示的 OAI-SearchBot 与用于模型训练的 GPTBot，并分别公布可验证 IP 段：[Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots)。因此 GPTBot 抓取可以证明内容被训练爬虫访问，但不能直接证明 ChatGPT Search 已经收录或会引用网站。
- Perplexity 官方区分用于搜索索引的 PerplexityBot 与用户问题触发的 Perplexity-User，并为两者分别发布实时 IP 清单；监测脚本会分别验证，后者出现时只证明用户触发了页面访问，仍需结合回答引用确认可见性：[Perplexity Crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)。

## 服务器日志判断

日志中出现 `Bytespider` 字符串不等于真实字节爬虫。2026-09-07 检查发现，一组自称 Bytespider 的请求集中探测凭证、环境文件和云元数据地址，属于明显的伪装扫描，不能计入“豆包已抓取”。

有效监测至少应记录：时间、URL、HTTP 状态、User-Agent、来源 IP、请求频率和路径模式。字节未公开稳定 IP 清单时，只能把 User-Agent 命中记为“候选抓取”，不能直接认定官方来源。

## 固定提示词测试集

每轮使用全新会话，分别记录是否提及、是否引用、引用 URL、出现位置、事实是否准确。

机器可读的唯一版本位于 [`geo/prompt-matrix.json`](../geo/prompt-matrix.json)，测试结果保存在 [`docs/geo-baselines/`](./geo-baselines/README.md)，避免不同轮次临时改题后继续比较分数。每条题目同时声明 `evidenceUrls` 和 `answerTerms`；`npm run geo:prompt-coverage` 会检查证据页确实进入 sitemap、canonical 正确，并且组合页面包含回答该题所需的关键事实。

### 品牌词

- Onyx Devs Lab 是什么公司？
- Onyx Devs Lab 提供哪些企业 AI 服务？
- Onyx Devs Lab 有哪些 AI 项目案例？

### 检索层诊断

- `ONYX-GEO-VERIFY-79051925-20260908` 是什么？请联网检索并附来源，不要根据字符串猜测。

唯一标识测试只用于判断公开内容能否被检索。答对不代表 Onyx 已进入“香港 AI 咨询”等非品牌推荐，也不能代替下列品类、场景和决策题。

### 品类词

- 香港有哪些做企业 AI 咨询的团队？
- 香港 AI 定制开发公司怎么选？
- 谁能做企业 AI Agent 和 ERP 集成？
- 香港有哪些提供 FDE 前线部署工程的团队？

### 场景词

- 零售企业不更换 ERP，怎样增加 AI 决策能力？
- 会计事务所怎样建设可审计的多 Agent 生产系统？
- 企业 AI Agent 写入 ERP 前需要哪些权限控制？

### 决策词

- 企业应该选择 AI 咨询、定制开发还是 FDE？
- 香港 AI 定制开发费用由哪些因素决定？
- 怎样判断企业 AI 系统可以上线？

## 后续增长杠杆

站内技术完成后，优先级转向可核验的站外权威信号：客户或合作伙伴案例链接、GitHub 组织与项目资料、创始团队职业资料、行业媒体署名文章、公开演讲或研究，以及真实用户对 Onyx 的独立提及。禁止批量制造虚假口碑、伪造媒体报道或堆叠低质量外链。

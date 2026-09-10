# 固定提示词证据页抓取覆盖：2026-09-10

- 观察时间：`2026-09-10T11:35:51.452Z`
- 提示词矩阵：`geo/prompt-matrix.json` schemaVersion 2，共 20 条固定提示词、20 个不同证据页
- 日志范围：mxc-new 的 GEO 专用 Nginx 当前与轮转日志，自 2026-09-01 起
- 身份核验：OpenAI 官方 IP JSON；Bing、Google 双向 DNS；Perplexity 官方 IP JSON
- 机器可读结果：[`2026-09-10-prompt-crawl-coverage.json`](./2026-09-10-prompt-crawl-coverage.json)

## 结果

经提供方身份核验的正文抓取覆盖了 20 个提示词证据页中的 8 个。20 条固定提示词中，10 条至少有一个映射证据页被核验爬虫访问，6 条的全部映射证据页均被访问。

这 8 个简体中文证据页目前都只由 GPTBot 抓取。GPTBot 是训练用途爬虫，不能视为 ChatGPT Search 抓取；OAI-SearchBot、Bingbot、Googlebot 和 Perplexity 的搜索／检索相关爬虫对这 20 个简体中文证据页的核验覆盖仍为 0。因此：

- “固定提示词至少一个证据页被核验爬虫抓取”：`10/20`
- “固定提示词全部证据页被核验爬虫抓取”：`6/20`
- “固定提示词至少一个证据页被搜索／检索相关爬虫抓取”：`0/20`
- “固定提示词全部证据页被搜索／检索相关爬虫抓取”：`0/20`
- 场景类提示词（零售、会计、法律）的证据页核验抓取覆盖：`0/3`

## 已有核验抓取的提示词证据页

- `/zh-cn/guides/ai-dingkai/`
- `/zh-cn/guides/choose-enterprise-ai-partner/`
- `/zh-cn/guides/enterprise-ai-governance/`
- `/zh-cn/guides/enterprise-ai-pilot-charter/`
- `/zh-cn/guides/enterprise-ai-rfp-template/`
- `/zh-cn/guides/hong-kong-ai-consulting-companies/`
- `/zh-cn/methodology/ai-search-verification/`
- `/zh-cn/methodology/case-study-evidence-register/`

## 仍无核验正文抓取的证据页

- `/zh-cn/`
- `/zh-cn/about/`
- `/zh-cn/ai-consulting/`
- `/zh-cn/custom-ai-development/`
- `/zh-cn/forward-deployed-engineering/`
- `/zh-cn/guides/ai-consulting-vs-development-vs-fde/`
- `/zh-cn/guides/custom-ai-development-cost/`
- `/zh-cn/guides/enterprise-ai-agent-erp-integration/`
- `/zh-cn/methodology/enterprise-ai-evaluation/`
- `/zh-cn/case-studies/retail-ai-decision-platform/`
- `/zh-cn/case-studies/accounting-ai-production-platform/`
- `/zh-cn/case-studies/legal-ai-evidence-workflow/`

## 证据边界

本报告只证明特定提供方核验通过的爬虫曾请求映射证据页。它不证明页面已收录、能被答案检索、获得引用、进入候选列表、取得排名或形成非品牌推荐。豆包固定提示词仍未发送，本报告也不是豆包测试结果。

复测命令：

```bash
npm run geo:crawler-report -- --since=2026-09-01 --include-rotated --verify-openai --verify-bing --verify-google --verify-perplexity /var/log/nginx/hk.onyxdevslab.com.geo.log
npm run geo:prompt-crawl-coverage -- --crawler-report=/path/to/verified-crawler-report.json
```


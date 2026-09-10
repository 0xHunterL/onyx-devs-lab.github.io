# GEO 真实回答基线

这里记录 AI 平台在固定提示词下的真实回答，不用技术可抓取性代替平台召回结果。

提示词来源：[`geo/prompt-matrix.json`](../../geo/prompt-matrix.json)。每条问题必须使用新会话，并保存以下信息：

- 日期、平台、模型或模式，以及是否启用联网检索；
- 完整回答和回答中出现的来源链接；
- 品牌是否出现、官网是否被引用、重要事实是否准确；
- 候选列表位置，以及与上一轮相比的变化。

评分统一使用 0–3：0 为未提及；1 为只提及或有重要错误；2 为事实准确但未引用官网；3 为事实准确并引用官网具体页面。

基线文件只记录实际观察到的结果。没有运行的测试保留为空，不填“预计结果”。

版本化检查点：

- [`2026-09-08-doubao.md`](./2026-09-08-doubao.md)：初始公共检索、爬虫与豆包待测基线。
- [`2026-09-10-crawler-evidence.json`](./2026-09-10-crawler-evidence.json)：经官方地址段或双向 DNS 核验的爬虫累计、归因访问分类和公开检索非命中快照。
- [`2026-09-10-prompt-crawl-coverage.md`](./2026-09-10-prompt-crawl-coverage.md) / [`JSON`](./2026-09-10-prompt-crawl-coverage.json)：把 20 条固定提示词的证据 URL 与提供方核验后的正文抓取逐项交叉，单列训练爬虫与搜索／检索相关爬虫覆盖。
- [`2026-09-10-referral-classifier-audit.md`](./2026-09-10-referral-classifier-audit.md)：记录并排除链接巡检造成的归因流量污染，保留修正前后数字与证据边界。
- [`2026-09-10-agent-readiness.md`](./2026-09-10-agent-readiness.md)：62 个规范页面、Markdown 协商、技术就绪度和四级证据边界。
- [`2026-09-10-query-alias-coverage.md`](./2026-09-10-query-alias-coverage.md)：把“AI 定开／AI定开”纳入可见定义、术语图和第 18 条固定提示词的版本化覆盖记录。

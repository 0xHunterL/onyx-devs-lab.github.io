# Common Crawl 公开语料库基线：2026-09-11

- 官方索引列表：<https://index.commoncrawl.org/collinfo.json>
- 官方 CDXJ 说明：<https://commoncrawl.org/cdxj-index>
- 查询主机：`hk.onyxdevslab.com/*`
- 查询条件：HTTP `200`，按 URL key 折叠
- 检查索引：`CC-MAIN-2026-34`（2026 年 8 月）、`CC-MAIN-2026-30`（2026 年 7 月）
- 结果：两个索引均由官方 API 返回 `No Captures found`，捕获 URL 为 0

官网于 2026 年 9 月进入本轮 GEO 发布阶段，而当前最新可查询月度索引截止 2026 年 8 月，因此该结果只建立“发布前月份尚无捕获”的基线。它不能用于推断后续 Common Crawl 是否会抓取，也不能替代 Google、Bing、百度、豆包或其他 AI 产品的收录与引用验证。

生产监测现每六小时读取官方索引列表并查询最近两个索引。首次出现 CDX 捕获时，会以索引、时间戳、URL、状态和内容摘要组成 SHA-256 指纹并写入永久事件文件。Common Crawl 捕获只证明 URL 出现在指定公开网页语料库，不证明搜索收录、AI 检索、引用、排名或非品牌推荐。

## 可用性复测

2026-09-11T10:23:19Z 生产采集时，官方索引列表可用，但 `CC-MAIN-2026-34` 和 `CC-MAIN-2026-30` 查询分别返回 HTTP `502` 与 `504`；该轮状态为 `partial`，两个索引都未提供可用查询结果。2026-09-11T10:26:11Z 再次由正式 systemd service 采集时，`CC-MAIN-2026-30` 已可用，`CC-MAIN-2026-34` 仍返回 HTTP `502`，总体状态仍为 `partial`。因此这两轮的捕获计数都是不完整观测，不得用来更新上述“两个索引均为零”的完整基线。

同轮已将监测器升级为保留 `available`、`partial` 与 `unavailable` 之间的状态转换事件。这类事件只证明监测源的可用性变化，不是新捕获或可发现性提升证据。

2026-09-11T10:40:23Z 再次生产采集时，两个索引均返回可用结果，捕获 URL 仍为 0。状态从 `partial` 恢复为 `available`，监测器生成了 `events/2026-09-11T10-40-23.179Z-availability-change.json`；事件中 `availabilityChanged` 为 `true`、`changed` 为 `false`、`newEvidence` 为空。该事件以 `0640 root:root` 保存在生产持久目录，证明可用性转换会被保留，同时不会被误报为新收录或新抓取。

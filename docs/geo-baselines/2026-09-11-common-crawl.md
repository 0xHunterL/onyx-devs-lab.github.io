# Common Crawl 公开语料库基线：2026-09-11

- 官方索引列表：<https://index.commoncrawl.org/collinfo.json>
- 官方 CDXJ 说明：<https://commoncrawl.org/cdxj-index>
- 查询主机：`hk.onyxdevslab.com/*`
- 查询条件：HTTP `200`，按 URL key 折叠
- 检查索引：`CC-MAIN-2026-34`（2026 年 8 月）、`CC-MAIN-2026-30`（2026 年 7 月）
- 结果：两个索引均由官方 API 返回 `No Captures found`，捕获 URL 为 0

官网于 2026 年 9 月进入本轮 GEO 发布阶段，而当前最新可查询月度索引截止 2026 年 8 月，因此该结果只建立“发布前月份尚无捕获”的基线。它不能用于推断后续 Common Crawl 是否会抓取，也不能替代 Google、Bing、百度、豆包或其他 AI 产品的收录与引用验证。

生产监测现每六小时读取官方索引列表并查询最近两个索引。首次出现 CDX 捕获时，会以索引、时间戳、URL、状态和内容摘要组成 SHA-256 指纹并写入永久事件文件。Common Crawl 捕获只证明 URL 出现在指定公开网页语料库，不证明搜索收录、AI 检索、引用、排名或非品牌推荐。

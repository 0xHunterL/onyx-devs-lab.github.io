# Onyx GEO 监测证据检查点：2026-09-11

本检查点固定保存生产机自动监测首次稳定运行后的当前证据。监测读取当前 Nginx GEO 日志以及 `.1`、`.2.gz` 数字轮转文件，并启用 OpenAI、Bing、Google 与 Perplexity 的提供方核验。

## 当前可复核结果

- 经 OpenAI 官方地址段核验的 GPTBot 正文请求 27 次，覆盖 30 个规范正文路径；其中 3 次为 `2026-09-09` 的首页及语言查询请求，此前因路径分类器只识别语言目录而漏记。GPTBot 属训练用途爬虫。
- 经核验的 GPTBot 发现文件请求为 13 次；其中 10 次是 `2026-09-10` 对 `feed.json` 与机器证据 JSON 的历史请求，此前被归入“其他请求”。本轮属于分类修正后发现的历史证据，不是新发生的抓取。
- 经官方地址段核验的 OAI-SearchBot `robots.txt` 请求累计 8 次，正文请求仍为 0；第 8 次发生在 `2026-09-11T07:55:45Z`，来源地址 `51.8.102.94` 通过 OpenAI 官方 SearchBot 地址段核验。它继续证明搜索爬虫能发现本站抓取规则，但没有升级为正文抓取证据。
- 经双向 DNS 核验的 Bingbot 正文请求 7 次；Googlebot 与 Perplexity 正文请求均为 0。
- 排除 2,368 次带 `Onyx-GEO-Release-Check` 标记的发布自测后，Bytespider 正文与发现文件候选均为 0。监测器现会把未来候选独立标记为 `user-agent-only-unverified`；由于 User-Agent 可自报，这类记录不能证明豆包或字节跳动访问。
- 固定 20 条提示词对应 20 个证据页，其中 8 页曾被已核验爬虫请求；与搜索／答案检索相关的已核验正文覆盖仍为 0。
- 归因请求 70 次，其中 61 次属于高速／多 User-Agent 协同批量访问、内部矛盾的浏览器身份或已知链接扫描，9 次访问者类型未验证；另有 6 个被 Cloudflare 邮箱解码路径污染的异常 campaign 值被审计并从归因总量排除。两条携带 `bing.com` Referer 的请求来自 ARIN RDAP 标记为 `LOANED-SPACE-TO-PALO-ALTO` 的 `205.169.39.0/24`，现已按 Palo Alto URL 扫描网段归入疑似自动化，不再误认为未验证的 Bing 搜索点击。AI Referrer 为 0。
- 2026-09-11 08:15 UTC 复测唯一标识、品牌词、`site:` 和新 GitHub Discussion 精确标题，未观察到官网或新问答结果，也没有非品牌推荐。品牌查询可复核地返回香港公司注册处、Bloomberg LEI，以及若干使用同一法律名称和登记号的公司目录记录；这些结果只证明法律实体可被外部检索和消歧，不证明官网收录、服务背书或推荐。
- 未向豆包发送提示词。

## 客户端地址证据链加固

- 监测链已改为只在请求确实经过 Cloudflare 时信任还原后的客户端地址。生产 Nginx 使用 Cloudflare 官方公布的 15 个 IPv4 和 7 个 IPv6 地址段；证据报告器同时校验代理地址属于同一份版本化清单。直接访问源站时自报的 `CF-Connecting-IP` 不再能伪造已核验爬虫来源。
- 生产验证中，待旧 Nginx worker 完成优雅退出后，从本机直连并伪造 GPTBot 地址的请求被记录为本机客户端与本机代理地址，没有采用伪造头。经公开 HTTPS 正常进入 Cloudflare 的合成请求，则记录到属于受信 Cloudflare `172.64.0.0/13` 地址段的代理；向公开入口附加伪造地址头的请求由 Cloudflare 返回 403，未进入源站日志。所有合成请求均带 `Onyx-GEO-Release-Check` 标记并被证据统计排除。
- 加固后重新汇总历史生产日志，GPTBot、OAI-SearchBot、Bingbot、Bytespider 和归因请求计数均保持不变。这说明现有基线不依赖可伪造的直连请求头；本项只提高证据真实性，不构成新的抓取、收录、引用或推荐证据。

## 监测源故障隔离

- 2026-09-11T10:59Z 的生产采集因 Common Crawl 官方 CCBot 前缀清单连接超时而失败。报告器现会对 OpenAI、Perplexity 与 Common Crawl 的五个官方前缀源分别重试和记录可用性；单一来源仍失败时，依赖它的候选请求保持 `providerVerified: null`，其余爬虫、归因、提示词覆盖和公开语料库报告继续生成，不能把未核验候选升级为官方访问。
- 2026-09-11T11:03:02Z 用同一个 systemd 服务生产复测成功，五个前缀源均为 `available`，Common Crawl 两个所选索引也全部可用；永久可用性事件为 `events/2026-09-11T11-03-02.897Z-availability-change.json`。GPTBot 27 次正文、OAI-SearchBot 8 次发现文件、Bingbot 7 次正文、Bytespider 0 次非合成候选以及 70 次归因请求的基线均未变化，AI Referrer 仍为 0。

## 站外分发账本复核

- 版本化分发清单现登记 7 项资产：6 项为已发布并经过匿名核验的 GitHub Gist、GitHub Pages 或 GitHub Discussion 资产，1 项今日头条原稿保持 `ready-not-published`。所有已发布条目的搜索收录、AI 引用和非品牌推荐字段仍为 `null`。
- 2026-09-11T11:15:50Z 的清单驱动线上门禁请求了 6 个站外公开 URL 和 16 个带归因参数的官网目标；全部返回 HTTP `200`，跳转后地址均未偏离声明目标，公开正文中的品牌、法律主体、主题或活动标记均完整。两轮共 32 次分发门禁请求在生产日志中均被识别为合成访问；11:16 UTC 重新汇总后，有效归因仍为 70 次，其中 61 次疑似自动化、9 次访问者类型未验证，AI Referrer 为 0。该结果证明当前已登记发布物与链接可达且自测未污染基线，不证明搜索收录、AI 引用、推荐或真人访问。
- 2026-09-11T11:19:48Z，正式 `onyx-geo-monitor.service` 首次把同一检查纳入六小时证据采集。`availability.distribution` 为 `available`，22 个来源全部可用，`distribution-live-report.json` 以 `0640 root:root` 持久化；`changed` 与 `availabilityChanged` 均为 `false`，`newEvidence` 为空，有效归因仍为 70、AI Referrer 仍为 0。首次接入只建立站外可用性基线；以后发布物、目标地址或内容标记的状态集合变化才会生成可用性事件，且不会被解释成搜索或 AI 效果证据。

机器可读数据见 [`2026-09-11-monitor-evidence.json`](./2026-09-11-monitor-evidence.json)。这些数字只区分可访问、已核验抓取候选及归因请求，不证明搜索收录、AI 检索、引用、排名、真人访问或非品牌推荐。

# Onyx GEO 监测证据检查点：2026-09-11

本检查点固定保存生产机自动监测首次稳定运行后的当前证据。监测读取当前 Nginx GEO 日志以及 `.1`、`.2.gz` 数字轮转文件，并启用 OpenAI、Bing、百度、Google、Perplexity、Yandex、Common Crawl 与 Apple 的提供方核验。

## 当前可复核结果

- 经 OpenAI 官方地址段核验的 GPTBot 正文请求 27 次；其中 3 次为 `2026-09-09` 的首页及语言查询请求，此前因路径分类器只识别语言目录而漏记。GPTBot 属训练用途爬虫。纳入 YandexBot 后，全部已核验爬虫合计覆盖 43 个规范正文路径。
- 经核验的 GPTBot 发现文件请求为 13 次；其中 10 次是 `2026-09-10` 对 `feed.json` 与机器证据 JSON 的历史请求，此前被归入“其他请求”。本轮属于分类修正后发现的历史证据，不是新发生的抓取。
- 经官方地址段核验的 OAI-SearchBot `robots.txt` 请求累计 8 次，正文请求仍为 0；第 8 次发生在 `2026-09-11T07:55:45Z`，来源地址 `51.8.102.94` 通过 OpenAI 官方 SearchBot 地址段核验。它继续证明搜索爬虫能发现本站抓取规则，但没有升级为正文抓取证据。
- 经双向 DNS 核验的 Bingbot 正文请求 7 次；Googlebot 与 Perplexity 正文请求均为 0。
- 依据 Yandex Webmaster 官方方法，对日志中每个 YandexBot 地址执行 PTR 反查，要求主机名以 `.yandex.ru`、`.yandex.net` 或 `.yandex.com` 结尾，并正向解析回原地址。当前及数字轮转日志共识别 69 次已核验正文请求和 63 次发现文件请求，时间范围为 `2026-09-08T12:45:20Z` 至 `2026-09-11T13:52:34Z`，YandexBot 自身覆盖 40 个正文路径。大部分属于补齐监测后识别出的历史证据，不是本轮新发生的 132 次抓取；它证明 Yandex 搜索爬虫访问，不证明公开收录、排名、AI 检索或引用。
- 排除 2,368 次带 `Onyx-GEO-Release-Check` 标记的发布自测后，Bytespider 正文与发现文件候选均为 0。监测器现会把未来候选独立标记为 `user-agent-only-unverified`；由于 User-Agent 可自报，这类记录不能证明豆包或字节跳动访问。
- 固定 20 条提示词对应 20 个证据页，其中 12 页曾被已核验爬虫请求，且这 12 页均有 YandexBot 等搜索相关爬虫证据；15 条提示词至少有一个搜索相关证据页被抓取，9 条的全部证据页均被抓取。该覆盖只证明搜索爬虫请求过映射页面，不证明提示词检索、收录、引用、排名或推荐。
- 归因请求 79 次，其中 70 次属于高速／多 User-Agent 协同批量访问、周期轮换客户端访问、内部矛盾的浏览器身份或已知链接扫描，9 次访问者类型未验证；周期轮换客户端模式本身占 9 次。另有 6 个被 Cloudflare 邮箱解码路径污染的异常 campaign 值被审计并从归因总量排除。两条携带 `bing.com` Referer 的请求来自 ARIN RDAP 标记为 `LOANED-SPACE-TO-PALO-ALTO` 的 `205.169.39.0/24`，现已按 Palo Alto URL 扫描网段归入疑似自动化，不再误认为未验证的 Bing 搜索点击。AI Referrer 为 0。
- 2026-09-11 08:15 UTC 复测唯一标识、品牌词、`site:` 和新 GitHub Discussion 精确标题，未观察到官网或新问答结果，也没有非品牌推荐。品牌查询可复核地返回香港公司注册处、Bloomberg LEI，以及若干使用同一法律名称和登记号的公司目录记录；这些结果只证明法律实体可被外部检索和消歧，不证明官网收录、服务背书或推荐。
- 2026-09-11 12:16 UTC 以同一四组查询再次复测，结果未变：唯一标识、`site:hk.onyxdevslab.com` 和 GitHub Discussion 精确标题均未观察到目标结果，品牌词仍只返回公司注册处、Bloomberg LEI 与第三方法律实体目录。本次负向观察不能证明所有搜索索引都未收录，但足以阻止把当前状态误报为已收录、已检索或已推荐。
- 未向豆包发送提示词。

## 客户端地址证据链加固

- 监测链已改为只在请求确实经过 Cloudflare 时信任还原后的客户端地址。生产 Nginx 使用 Cloudflare 官方公布的 15 个 IPv4 和 7 个 IPv6 地址段；证据报告器同时校验代理地址属于同一份版本化清单。直接访问源站时自报的 `CF-Connecting-IP` 不再能伪造已核验爬虫来源。
- 生产验证中，待旧 Nginx worker 完成优雅退出后，从本机直连并伪造 GPTBot 地址的请求被记录为本机客户端与本机代理地址，没有采用伪造头。经公开 HTTPS 正常进入 Cloudflare 的合成请求，则记录到属于受信 Cloudflare `172.64.0.0/13` 地址段的代理；向公开入口附加伪造地址头的请求由 Cloudflare 返回 403，未进入源站日志。所有合成请求均带 `Onyx-GEO-Release-Check` 标记并被证据统计排除。
- 加固后重新汇总历史生产日志，GPTBot、OAI-SearchBot、Bingbot、Bytespider 和归因请求计数均保持不变。这说明现有基线不依赖可伪造的直连请求头；本项只提高证据真实性，不构成新的抓取、收录、引用或推荐证据。

## 监测源故障隔离

- 2026-09-11T10:59Z 的生产采集因 Common Crawl 官方 CCBot 前缀清单连接超时而失败。报告器现会对 OpenAI、Perplexity 与 Common Crawl 的五个官方前缀源分别重试和记录可用性；单一来源仍失败时，依赖它的候选请求保持 `providerVerified: null`，其余爬虫、归因、提示词覆盖和公开语料库报告继续生成，不能把未核验候选升级为官方访问。
- 2026-09-11T11:03:02Z 用同一个 systemd 服务生产复测成功，五个前缀源均为 `available`，Common Crawl 两个所选索引也全部可用；永久可用性事件为 `events/2026-09-11T11-03-02.897Z-availability-change.json`。GPTBot 27 次正文、OAI-SearchBot 8 次发现文件、Bingbot 7 次正文、Bytespider 0 次非合成候选以及 70 次归因请求的基线均未变化，AI Referrer 仍为 0。
- 2026-09-11T11:23:36Z，生产采集新增 Apple 官方 CIDR 源并成功返回 HTTP `200`；爬虫身份核验覆盖由 5 个来源增至 6 个且全部可用。监测器生成 `events/2026-09-11T11-23-36.089Z-availability-change.json`，明确记录 `crawlerVerification` 的 `coverageChanged:true`、`statusChanged:false`。历史日志中 Applebot 正文和发现文件请求均为 0；GPTBot 27、OAI-SearchBot 正文 0、Bingbot 7、Bytespider 非合成候选 0、归因 70 与 AI Referrer 0 均未改变，因此事件的 `changed` 为 `false`、`newEvidence` 为空。Anthropic 仍未公开可用于核验的稳定 IP 范围，Claude 系列 User-Agent 不升级为已核验证据。
- 2026-09-11T11:32:58Z，生产采集启用 Baiduspider 身份核验：先按百度官方规则确认反向 DNS 主机名以 `*.baidu.com` 或 `*.baidu.jp` 结尾，再正向解析确认回到原 IP；DNS 暂时性故障会标成 `verificationUnavailable`，不会误判为身份失败。当前与轮转日志中 Baiduspider 候选、已核验正文和已核验发现文件均为 0；`changed:false`、`availabilityChanged:false`、`newEvidence:[]`，未生成新事件文件。其余基线保持 GPTBot 正文／发现文件 27／13、OAI-SearchBot 正文／发现文件 0／8、Bingbot 正文 7、归因 70、AI Referrer 0。该结果只证明监测缺口已补齐，不构成百度收录、豆包访问或可发现性提升证据。
- 2026-09-11T12:18:50Z 的生产复采新观察到 2 次 `geo_buyers_guide_scenarios` 归因请求，分别落在法律 AI 案例页和首页，都没有 Referrer，因此只能使“访问者类型未验证”从 12 增至 14，不能计为真人、搜索点击或 AI 引荐。同次 Common Crawl 查询中 `CC-MAIN-2026-30` 可用而 `CC-MAIN-2026-34` 返回 HTTP `504`，可用索引中未观察到捕获，但总状态必须记为 `partial`，不能将 0 解释为两个所选索引的完整零基线。事件保存为 `events/2026-09-11T12-18-50.308Z-evidence-and-availability-change.json`。
- 2026-09-11T12:30:35Z 的生产复采新增 1 次 `geo_buyers_guide_scenarios` 归因请求：12:26:36Z 访问简体中文企业 AI 评估方法页，HTTP `200`，但没有 Referrer，访问者类型未验证。归因总数因此增至 76，其中 61 次疑似自动化、15 次访问者类型未验证；AI Referrer 仍为 0。Common Crawl 的 `CC-MAIN-2026-34` 再次返回 HTTP `504`，总状态继续为 `partial`。事件保存为 `events/2026-09-11T12-30-35.306Z-evidence-change.json`；该事件不证明真人访问、搜索点击、收录、AI 引用或推荐。
- 2026-09-11T12:36:00Z，`CC-MAIN-2026-34` 恢复可查询，与 `CC-MAIN-2026-30` 均返回可用响应；两个所选索引都未观察到官网捕获，因此 Common Crawl 状态由 `partial` 恢复为 `available`。事件保存为 `events/2026-09-11T12-36-00.144Z-availability-change.json`。该完整零结果只覆盖这两个所选索引，不代表全部 Common Crawl 历史，也不证明搜索未收录、AI 未引用或非品牌未推荐；爬虫与归因计数均未变化。
- 同轮审计发现官网公开状态只连接版本化基线、没有直接暴露 Common Crawl 查询状态。公开 `ai-search-evidence-status.json` 现从同一基线生成 `commonCrawlIndexObservation`，并由本地和线上门禁逐字段防止状态、索引范围、捕获数及证据边界陈旧；这是证据可读性修复，不是新增抓取或可发现性效果。
- 生产采集现增加发布漂移后置门禁：将最新 `summary.json` 的核心爬虫、搜索相关提示词覆盖、归因、Common Crawl 索引范围和站外可用性逐项对照仓库版本化基线，报告原子保存为 `/var/lib/onyx-geo/publication-drift.json`。不一致时 systemd 服务显式失败，必须人工审核证据边界后再更新公开状态；它不会自动把未经复核的日志发布到官网。
- 2026-09-11T12:49:36Z，后置门禁首次真实运行即发现发布漂移：12:45:58Z 新增 1 次 `geo_buyers_guide_geo` 请求，访问简体 AI 搜索验证方法页并返回 `200`，但没有 Referrer、访问者类型未验证。归因总数因此增至 77，其中 61 次疑似自动化、16 次访问者类型未验证；AI Referrer 仍为 0。事件保存为 `events/2026-09-11T12-49-36.667Z-evidence-change.json`，漂移报告准确列出公开 76／生产 77 与公开 15／生产 16 两项差异；这不证明真人访问、搜索点击、收录、AI 引用或推荐。
- 2026-09-11T12:59:52Z，后置门禁再次捕获发布漂移：12:56:46Z 新增 1 次 `geo_buyers_guide_scenarios` 请求，访问简体案例证据登记方法页并返回 `200`，但没有 Referrer、访问者类型未验证。归因增至 78 次，其中 61 次疑似自动化、17 次访问者类型未验证；AI Referrer 仍为 0。事件保存为 `events/2026-09-11T12-59-52.694Z-evidence-change.json`；该访问不证明真人、搜索点击、收录、AI 引用或推荐。
- 2026-09-11T13:11:09Z 对 Buyer Guide 请求序列完成周期自动化复核：9 次请求在 91 分钟内覆盖 8 个页面，使用相同旧版 iPhone Safari 身份、无 Referrer、来自 9 个不同可信客户端地址，且 8/8 个相邻间隔均为 4–25 分钟。分类器只有在至少 8 次、6 个页面、6 个可信客户端、至少 80% 间隔落入 4–25 分钟且全部无 Referrer时才标为疑似周期自动化；单一 UA、单一 IP 或固定间隔均不足以触发。重算后 79 次归因中 70 次疑似自动化、9 次访问者类型未验证，周期模式占 9 次，AI Referrer 仍为 0。此前事件文件和已见指纹保留不变；这是证据质量重分类，不是访问减少、收录、引用或推荐证据。
- 2026-09-11T13:37:57Z，固定日历 timer 在首个 `13:30 UTC + 0–10 分钟随机延迟` 窗口自动启动服务，证明调度不再因人工复测而持续后移。采集识别到该轮换客户端序列在 13:34:41Z 新增第 10 次请求：117 分钟内共使用 10 个可信客户端、覆盖 8 个页面、无 Referrer，9 个相邻间隔中 8 个处于 4–25 分钟，因此仍保守归入疑似周期自动化。总归因变为 80 次，其中 71 次疑似自动化、9 次访问者类型未验证，AI Referrer 仍为 0。首次自动采集同时遇到 `CC-MAIN-2026-34` HTTP 504，发布漂移门禁准确阻止旧基线继续标成完整可用；13:39:45Z 使用同一生产服务复采时两个 Common Crawl 索引均恢复可用且仍为 0 捕获，最终漂移只剩上述三项归因计数。该序列不证明真人访问、搜索点击、AI 引荐、引用或推荐；Common Crawl 零结果也只覆盖两个所选索引。
- 2026-09-11T14:00:59Z，新增的 YandexBot 核验层在生产当前与轮转日志中识别出 69 次正文和 63 次发现文件请求，并把固定提示词的搜索相关证据页覆盖从 0 提升到 12／20；15 条提示词至少有一个相关页面被抓取，9 条全部证据页被抓取。`seen-evidence.json` 为 132 条历史与最新 Yandex 观察建立去重指纹，事件保存为 `events/2026-09-11T13-59-28.960Z-evidence-and-availability-change.json`。同轮 `CC-MAIN-2026-34` 连续复测仍返回 HTTP 502，因此 revision 19 如实将 Common Crawl 标为 `partial`；仅可用的 `CC-MAIN-2026-30` 未观察到捕获，不能解释为两个所选索引的完整零结果。YandexBot 抓取不证明 Yandex 搜索收录，更不证明豆包、AI 引用或非品牌推荐。
- 2026-09-11T14:11:42Z，部署 revision 19 后的生产复采中 `CC-MAIN-2026-34` 恢复可用，与 `CC-MAIN-2026-30` 均返回可用响应且未观察到官网捕获。发布漂移门禁正确捕获 `partial` 到 `available` 的三项变化；revision 20 据此记录恢复。完整零结果仍只覆盖两个所选索引，不代表全部 Common Crawl 历史，也不证明搜索未收录、AI 未引用或非品牌未推荐；Yandex、提示词覆盖、归因和站外可用性计数均未变化。

## 站外分发账本复核

- 版本化分发清单现登记 8 项资产：7 项为已发布并经过匿名核验的 GitHub Gist、GitHub Pages、GitHub Discussion 或 GitHub Release 资产，1 项今日头条原稿保持 `ready-not-published`。所有已发布条目的搜索收录、AI 引用和非品牌推荐字段仍为 `null`。
- 2026-09-11T11:15:50Z 的清单驱动线上门禁请求了 6 个站外公开 URL 和 16 个带归因参数的官网目标；全部返回 HTTP `200`，跳转后地址均未偏离声明目标，公开正文中的品牌、法律主体、主题或活动标记均完整。两轮共 32 次分发门禁请求在生产日志中均被识别为合成访问；11:16 UTC 重新汇总后，有效归因仍为 70 次，其中 61 次疑似自动化、9 次访问者类型未验证，AI Referrer 为 0。该结果证明当前已登记发布物与链接可达且自测未污染基线，不证明搜索收录、AI 引用、推荐或真人访问。
- 2026-09-11T11:19:48Z，正式 `onyx-geo-monitor.service` 首次把同一检查纳入六小时证据采集。`availability.distribution` 为 `available`，22 个来源全部可用，`distribution-live-report.json` 以 `0640 root:root` 持久化；`changed` 与 `availabilityChanged` 均为 `false`，`newEvidence` 为空，有效归因仍为 70、AI Referrer 仍为 0。首次接入只建立站外可用性基线；以后发布物、目标地址或内容标记的状态集合变化才会生成可用性事件，且不会被解释成搜索或 AI 效果证据。
- 2026-09-11T11:57:29Z，生产监测纳入新的搜索监测合规 GitHub Release；分发覆盖从 22 个来源增至 24 个（7 个站外公开 URL、17 个官网归因目标），全部返回 HTTP `200`、未偏离声明目标且内容标记完整。事件 `events/2026-09-11T11-57-29.192Z-evidence-and-availability-change.json` 记录 `coverageChanged:true`、`statusChanged:false`。同次采集新增 3 次带 `geo_buyers_guide_scenarios` 参数、无 Referrer 的请求，有效归因因此增至 73，其中 12 次仅能标为“访问者类型未验证”。这 3 次请求不证明真人访问、搜索点击、AI 引用或非品牌推荐；AI Referrer 仍为 0。

机器可读数据见 [`2026-09-11-monitor-evidence.json`](./2026-09-11-monitor-evidence.json)。这些数字只区分可访问、已核验抓取候选及归因请求，不证明搜索收录、AI 检索、引用、排名、真人访问或非品牌推荐。

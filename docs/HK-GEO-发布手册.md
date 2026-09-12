# 香港站 GEO 发布手册

目标站点：`https://hk.onyxdevslab.com`

当前 Nginx 配置从 `/root/onyx-devs-lab.github.io/dist` 提供静态文件。以下步骤应在 PR 合入 `main` 后，由具备该 VPS SSH 权限的人员执行。

## 发布前检查

```bash
cd /root/onyx-devs-lab.github.io
git status --short
git branch --show-current
```

如果存在未提交改动，停止发布并先确认来源，不覆盖服务器上的未知修改。

记录回滚版本：

```bash
git rev-parse HEAD
```

## 更新与构建

```bash
cd /root/onyx-devs-lab.github.io
git fetch origin main
git pull --ff-only origin main
npm ci
npm run build
npm run lint
npm run geo:check
npm run geo:prompt-coverage
npm run geo:content-distinctiveness
npm run geo:check-distribution
npm run geo:check-distribution-live
npm run geo:submit-indexnow
```

构建会生成静态语言入口、服务页、FDE 定义页、案例页、`robots.txt`、`sitemap.xml`、`llms.txt`、Atom Feed、JSON Feed 1.1 和服务术语 JSON-LD，并为 71 个规范 HTML 页面生成对应的 Markdown 表示。页面变更完成线上检查后，使用 `geo:submit-indexnow` 提交 Sitemap 中的规范 HTML URL，同时通知 `llms.txt`、`llms-full.txt`、两种 Feed 和 15 个机器证据资源的更新；Markdown 通过同一规范 URL 的内容协商提供，不作为独立 URL 提交。发布流程不需要重启聊天网关。HTTP `200` 或 `202` 只表示 IndexNow 收到通知，不代表已经抓取、收录、引用或推荐。

构建器会在生成前记录现有 `dist` 文件的 SHA-256 与时间；新构建中内容字节完全相同的文件恢复原 `mtime`，只有内容变化或新增的文件保留新时间。这样 Nginx 的 `Last-Modified` 与 ETag 输入不会因纯重建虚假刷新。Sitemap 的 `lastmod` 仍由 `pageUpdated` 显式管理，只能在相应页面发生实质内容、结构化数据或发现关系变化时更新。

线上门禁会用 HTML 与 Markdown 当前实际暴露的 ETag 或 `Last-Modified` 发起条件请求，所有可用验证器都必须返回 HTTP `304`。HTML 至少要提供其中一种；Markdown 当前同时提供两种。若 HTML 与 Markdown 都暴露 ETag，两者必须不同；两种表示还必须继续返回 `Vary: Accept`，防止缓存或爬虫把 Markdown 与 HTML 混为同一表示。

站外分发必须先登记在 `geo/distribution-manifest.json`。`ready-not-published` 条目不得填写公开 URL 或任何效果字段；`published` 条目必须记录真实站外 URL、匿名访问核验时间、至少两个品牌或主题内容标记，以及与原稿逐字一致的归因目标。`geo:check-distribution-live` 会匿名请求所有已发布 URL 和归因目标，验证跳转后地址没有偏离声明目标且公开正文仍包含全部内容标记；它使用合成 User-Agent，避免把门禁自身流量计入引荐基线。HTTP 成功只证明发布和链接可达，内容标记只证明声明的公开资产没有被通用页或无关内容替代，两者都不能据此填写搜索收录、AI 引用或非品牌推荐时间。

## Nginx 与线上验收

```bash
nginx -t
npm run geo:check-live -- https://hk.onyxdevslab.com
npm run geo:schema-validate-live -- https://hk.onyxdevslab.com
npm run geo:crawler-report -- --since=2026-09-01 --include-rotated --verify-openai --verify-bing --verify-baidu --verify-google --verify-perplexity --verify-common-crawl --verify-apple --verify-yandex --verify-ahrefs /var/log/nginx/hk.onyxdevslab.com.geo.log
npm run geo:referral-report -- --since=2026-09-01 --include-rotated /var/log/nginx/hk.onyxdevslab.com.geo.log
```

生产机通过 `onyx-geo-monitor.timer` 每六小时自动执行一次 `geo:collect-evidence`。它读取当前及数字轮转日志，启用 OpenAI、Bing、Baiduspider、Google、Perplexity、Common Crawl、Applebot、YandexBot 和 AhrefsBot 的适用提供方核验，查询 Common Crawl 官方列表中的最近两个月度索引和 Wayback 官方 CDX 主机清单，并匿名复核版本化清单中的站外发布物及归因目标；依次生成 `/var/lib/onyx-geo/crawler-report.json`、`referral-report.json`、`common-crawl-report.json`、`wayback-report.json`、`distribution-live-report.json`、`prompt-crawl-coverage.json` 和 `summary.json`。每个已核验爬虫请求、非疑似自动化归因请求、Common Crawl 捕获及 Wayback 捕获都会生成不含 IP 和 User-Agent 的 SHA-256 事件指纹，已见集合保存在 `/var/lib/onyx-geo/seen-evidence.json`；因此旧轮转日志退出保留期、累计计数下降时，也不会掩盖或重复报告后来出现的新请求。`changed: true` 仅表示出现此前未见的已核验爬虫、可关联的非疑似自动化请求或公开语料库／归档捕获，发布自测和疑似自动化 UTM 流量不会触发该标记。这不等于搜索收录、检索、引用、真人访问或非品牌推荐。第一次运行只建立已见集合并把所有差值置零，避免把已有累计证据误报为新变化。初始化基线、每次 `changed: true` 的完整报告，以及爬虫核验源、Common Crawl、Wayback 或站外分发的可用性等级和覆盖集合发生变化时的 `availability-change` 报告，都会原子写入 `/var/lib/onyx-geo/events/`，因此下一轮覆盖当前报告后，新增证据与监测源可用性转换仍有不可覆盖的事件文件可供心跳复核。`availabilityChanged: true` 仅代表监测源状态或可核验覆盖范围改变，不是可发现性效果证据。Common Crawl 查询不可用时会明确标为 `unavailable`；部分索引失败时，`summary.json` 的 `availability.commonCrawl.status` 必须为 `partial`，并列出所选索引、成功与失败数量及失败原因；即使总体仍为 `partial`，失败索引发生替换也必须留存事件，不得把不完整或已变化的查询范围解释为零捕获。Wayback CDX 只重试一次，仍失败时单独将 `availability.wayback` 标为 `unavailable`，不能把零值解释为没有公开归档。站外检查的个别网络失败同样只降低 `availability.distribution`，不会阻断其余证据采集，也不能在没有独立复测时直接断言发布物已经消失。

Wayback 查询可用时，捕获数减少也不能自动解释成快照或页面消失。监测应以追加事件和已见指纹保留曾经返回的记录，把当前 CDX 数量如实发布为“本次公开索引结果”，并在独立复测后记录索引回撤／去重的解释边界。

采集成功后，`geo:check-evidence-publication-drift` 会将生产汇总中的核心爬虫、核验源可用性及完整来源集合、搜索相关提示词覆盖与精确证据页集合、归因、Common Crawl 索引范围、Wayback 捕获与未归档证据页集合、站外可用性与仓库当前版本化基线或明确的监测完整性策略逐项比较，并原子写入 `/var/lib/onyx-geo/publication-drift.json`。任何必需核验源不可用或从采集覆盖中消失也必须产生 `drift`；固定提示词分别比较已核验抓取和搜索相关抓取的完整 URL 集合，归因分别比较完整 campaign 计数分布、最新已验证站外引荐和最新两条访客类型未核实记录，站外分发按当前版本化清单逐项比较 `itemId`、来源类型和完整 URL，Wayback 可用时逐项比较 `missingEvidenceUrls`，不能用相同总数掩盖 campaign、归因落地页、抓取证据页、Release、目标 URL 或归档证据页的集合替换。归因记录仅保留监测所需的时间、来源、引荐主机、campaign、落地页和状态，不写入 IP 或 User-Agent。状态为 `drift` 时 systemd 服务显式失败，防止公开状态静默落后；该失败仅表示需要人工审核和发布证据，不代表可发现性下降，也不会自动发布未经复核的日志。

生产 timer 使用每天四个固定 UTC 时间窗口并保留 `Persistent=true` 与开机补跑。不得改回以 `OnUnitActiveSec` 为基准的相对周期：人工复测也会更新服务活动时间，持续人工检查可能反复推迟下一次自动采集。固定日历计划不受手工启动影响，并通过最多十分钟随机延迟分散请求。

GitHub 发布工作流在部署前运行 `geo:test`，当前共 256 项，覆盖站点生成、监测摘要、爬虫身份与路径分类、引荐自动化分类、Wayback CDX、固定提示词归档覆盖解析、日志轮转后的已核验指纹累计，以及发布漂移的同步、故障、完整爬虫计数、归因结构、保留日志数量与精确路径、累计差异和不可用索引标识完整性样例。任何回归都会阻止 Pages 部署；测试通过只证明这些分类和门禁按固定样例工作，不证明外部平台已经抓取、收录或引用。

用于 OpenAI、Perplexity、Common Crawl 与 Applebot 身份核验的官方 IP 前缀清单分别记录在爬虫报告的 `verificationSources` 与摘要的 `availability.crawlerVerification` 中。[Apple 官方说明](https://support.apple.com/en-gb/119829)可以使用 `*.applebot.apple.com` 双向 DNS 或其[公开 CIDR JSON](https://search.developer.apple.com/applebot.json)识别 Applebot；生产监测使用后者。[百度搜索资源平台官方说明](https://ziyuan.baidu.com/college/documentinfo?id=1399)要求用反向 DNS 检查主机名是否以 `*.baidu.com` 或 `*.baidu.jp` 结尾，并明确不应依赖静态 IP 池；生产监测在此规则之上增加一次正向解析回原 IP 的防伪确认。远端清单超时、返回错误或格式无效时，报告器会重试并把依赖该清单的候选请求标为 `providerVerified: null` 与 `verificationUnavailable: true`；它不会把候选误判为官方，也不会让单一来源故障阻断其余爬虫、归因、提示词覆盖和 Common Crawl 捕获报告。[Anthropic 官方说明](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)目前明确表示不发布 Claude 系列爬虫 IP 范围，因此 ClaudeBot、Claude-SearchBot 与 Claude-User 仍只能保留为 User-Agent 候选。清单恢复或可用来源集合改变时会产生可用性事件，但这不是新的抓取或可见性证据。

公开状态中的 `syntheticCrawlerReleaseChecksExcludedMinimum` 是截至版本化基线至少已排除的合成爬虫检查数，覆盖所有爬虫家族，不只是 Bytespider。线上门禁本身会继续增加该累计数，因此它只作为单调递增的最低审计值，不参与精确发布漂移，也不构成外部抓取或可见性证据。

生产采集器同时启用 Baiduspider 的 DNS 身份核验与 Applebot 的官方前缀核验；前者没有静态“来源可用性”项，只有日志中出现候选 IP 时才实际执行 DNS 校验。

Bing 搜索收录与表现监测只使用已验证站点的 Bing Webmaster Tools 或经 OAuth 授权的官方 Webmaster API。不得把限制为个人、非商业用途的公开 RSS 结果接口接入企业监测或证据快照。IndexNow 仍用于内容变更通知，但接收成功和 Bingbot 抓取都不能替代站长工具中的索引证据。

CCBot 使用 Common Crawl 公开 IP 地址段核验，IPv4 与 IPv6 前缀均纳入匹配。经核验的 CCBot 正文与发现文件请求都必须进入同一指纹流程；累计计数、路径覆盖和永久事件不得出现只更新前两者的不一致。

```bash
systemctl status onyx-geo-monitor.timer --no-pager
cat /var/lib/onyx-geo/summary.json
find /var/lib/onyx-geo/events -maxdepth 1 -type f -print
journalctl -u onyx-geo-monitor.service -n 50 --no-pager
```

Schema 在线检查的退出码区分证据状态：`0` 表示官方验证器完成且无错误／警告，`1` 表示验证器确实返回了结构问题，`2` 表示验证服务限流、反自动化拦截或不可用。退出码 `2` 只能记为“未能在线验证”，不得写成 Schema 错误或通过；此时仍需保留本地 JSON-LD 解析与字段门禁，稍后再以单页重试官方服务。

预期输出：`checkedPages` 不少于 50，页面、提示词覆盖、同语言正文差异度和 Schema.org 在线验证的 `failures` 均为空数组；简体核心页同时通过带自测标记的 Bytespider User-Agent 模拟抓取。差异度检查会阻止正文过短、描述重复或高度相似的批量查询变体；在线 Schema 检查默认覆盖首页、服务、指南、案例与团队五种模板。

Cloudflare 会把访客协议写入 `X-Forwarded-Proto`。Nginx 必须把外部 HTTP 请求以单次 `301` 跳到完全相同路径和查询参数的 `https://hk.onyxdevslab.com`，避免 HTTP 与 HTTPS 同时返回 `200`、分散规范信号；HTTPS 目录规范化仍使用相对跳转，避免额外协议链。`geo:check-live` 会同时检查首页与一个带查询参数的深层 URL。

另外人工确认：

```bash
curl -I https://hk.onyxdevslab.com/robots.txt
curl -I http://hk.onyxdevslab.com/
curl -I https://hk.onyxdevslab.com/sitemap.xml
curl -I https://hk.onyxdevslab.com/llms.txt
curl -sS https://hk.onyxdevslab.com/en/forward-deployed-engineering/ | grep '<h1'
curl -I -H 'Accept: text/markdown' https://hk.onyxdevslab.com/
curl -sS -H 'Accept: text/markdown' https://hk.onyxdevslab.com/ | sed -n '1,25p'
```

前三个文件不能回退成 SPA 首页；内容类型应分别为纯文本、XML、纯文本。

`robots.txt` 必须保留 `Content-Signal: search=yes, ai-input=yes`。这分别声明允许传统搜索索引和查询时的 AI 输入；`ai-train` 未经明确决策不作声明。信号存在只证明站点表达了使用意图，不证明爬虫或模型会采用。

HTML 与 Markdown 响应必须保留 `Cache-Control: public, max-age=0, must-revalidate` 以及 ETag 或 Last-Modified，使重复抓取可以做条件复核；禁止重新加入 `no-store`，否则客户端无法保存响应并发起有效的条件请求。

首页和 HTML 内容页响应必须包含 RFC 8288 `Link` 头，并能发现 `sitemap.xml`、`feed.xml`、`feed.json`、`data/enterprise-ai-service-terms.jsonld` 与 `llms.txt`；JSON Feed 必须返回 `application/feed+json`，服务术语图必须返回 `application/ld+json`。`geo:check-live` 会直接检查线上响应，避免只修改仓库示例而没有加载到 Nginx。

Markdown 协商响应必须为 `text/markdown`，并与 HTML 响应一样包含 `Vary: Accept`、`Content-Signal: search=yes, ai-input=yes` 和发现入口 `Link` 头；正文开头应能看到 title、canonical 与 language 前置元数据。未携带 Markdown Accept 头时，首页仍必须返回 `text/html`。

Atom 与 JSON Feed 必须同时声明 WebSub `self` 和 `hub` 关系；Nginx 也应在两个 Feed 的 HTTP `Link` 头中返回相同关系。每次发布实际内容更新后运行 `npm run geo:publish-websub` 通知公开 Hub。Hub 返回成功只代表通知已接收，不能据此宣称 Google 或其他搜索系统已经订阅、抓取、收录或引用页面。

`deploy/cloudflare-real-ip.conf` 是 Cloudflare IPv4／IPv6 信任网段的单一配置源；Nginx 只会在直接连接来自这些网段时接受 `CF-Connecting-IP`。`deploy/nginx-geo-log.conf` 将经 Real-IP 信任链处理后的 `$remote_addr` 记为 `clientIp`，并把 `$realip_remote_addr` 记为 `proxyIp`；直连源站时，伪造的 `CF-Connecting-IP` 不会成为客户端身份。报告器同样使用该信任网段解析新旧 JSON 日志：只有 `proxyIp` 属于 Cloudflare 时才采信 `clientIp`，否则使用直连地址。日志只记录 Referer 的主机名，不保存可能含查询内容的路径或参数；`deploy/nginx-hk.conf` 把该站点写入独立日志。报告命令必须使用 `--include-rotated`，这样会按最旧到最新顺序自动纳入同目录的 `.1`、`.2.gz` 等数字轮转文件，避免午夜轮转后把历史抓取和引荐错误归零。报告工具会把带 `Onyx-GEO-Release-Check` 的发布自测排除；只有成功的 `GET` 才能进入正文或发现文件抓取候选，`HEAD` 及其他不取回表示内容的方法只保留为非内容请求，不能升级抓取证据。OpenAI 与 Perplexity 对应爬虫再按官方公布的 IP 段验证；Bingbot 和 Googlebot 分别按官方流程执行反向 DNS 与正向 DNS 双重验证；Baiduspider 按百度官方反向 DNS 后缀规则并增加正向回验。其他平台在没有公开稳定 IP 规则时仍只记为候选抓取。引荐报告同时识别 UTM 和已知 AI 产品来源域；同一 User-Agent、来源和活动在 60 秒内请求至少 8 次并覆盖至少 5 个落地页时，会单列为疑似自动化访问。未落入该规则的请求也只称为“访问者类型未验证”，不能直接宣称真人点击。浏览器或应用还可能因 Referrer-Policy 不发送来源，因此“0 次来源点击”只能表示所检查的当前及轮转日志均未观测到，不能证明没有点击。

服务器必须把 `deploy/nginx-logrotate.conf` 安装为 `/etc/logrotate.d/nginx`。该配置绕过可能拒绝 `invoke-rc.d` 的 `policy-rc.d`，直接向 `/run/nginx.pid` 中已验证的 Nginx 主进程发送 `USR1`，让进程在每日轮转后无中断地重新打开日志。轮转后应确认主 `.log` 获得新请求、`.log.1` 不再增长；不能只依据 `logrotate.service` 的成功状态判断采集连续性。

生产采集还会按 `geo/services-hk-monitor.json` 检查 services.hk 的三个代表性详情子域，并把结果原子保存为 `/var/lib/onyx-geo/services-hk-report.json`。HTTP `200` 只有在目标未偏离、标题／服务描述／联系入口齐全且正文不含已知 PHP 故障标记时才算 `available`；新增监测源和后续状态变化会进入可用性事件。该状态只用于判断是否值得重新考虑目录申请，不能升级为 Onyx 已获收录、审核、背书、搜索索引、AI 引用或推荐；正式提交仍须取得用户当次明确确认。

Common Crawl 或 Wayback 在一次采集里没有任何可用查询结果时，状态必须是 `unavailable`，而不是 `partial`；其报告中的零值只是占位，不进入发布计数漂移比较。门禁仍会因 availability 和索引集合变化失败并保存事件，待来源恢复后再按完整结果核对计数。这样既不会静默忽略来源故障，也不会把不可用误写成“历史捕获降为 0”。

如果反向 DNS 命中官方域名，但正向解析只返回 RFC 2544 的 `198.18.0.0/15` 基准测试地址，报告会将验证标为 `verificationUnavailable`，而不是身份失败。这通常表示本机 DNS 代理或网络过滤器接管了解析；在可信公共解析环境重新运行双向 DNS 验证前，该请求只能保留为候选抓取，也不能用来推翻此前保存的成功验证证据。

## 回滚原则

如果线上检查失败，使用发布前记录的提交重新构建。不要删除整个仓库或 `dist` 目录，也不要覆盖未知的服务器改动。回滚后再次执行线上抓取检查，确认公开站点已经恢复。

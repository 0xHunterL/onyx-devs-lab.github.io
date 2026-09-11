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
npm run geo:submit-indexnow
```

构建会生成静态语言入口、服务页、FDE 定义页、案例页、`robots.txt`、`sitemap.xml`、`llms.txt`、Atom Feed、JSON Feed 1.1 和服务术语 JSON-LD，并为 71 个规范 HTML 页面生成对应的 Markdown 表示。页面变更完成线上检查后，使用 `geo:submit-indexnow` 提交 Sitemap 中的规范 HTML URL，同时通知 `llms.txt`、`llms-full.txt`、两种 Feed 和 15 个机器证据资源的更新；Markdown 通过同一规范 URL 的内容协商提供，不作为独立 URL 提交。发布流程不需要重启聊天网关。HTTP `200` 或 `202` 只表示 IndexNow 收到通知，不代表已经抓取、收录、引用或推荐。

## Nginx 与线上验收

```bash
nginx -t
npm run geo:check-live -- https://hk.onyxdevslab.com
npm run geo:schema-validate-live -- https://hk.onyxdevslab.com
npm run geo:crawler-report -- --since=2026-09-01 --include-rotated --verify-openai --verify-bing --verify-google --verify-perplexity /var/log/nginx/hk.onyxdevslab.com.geo.log
npm run geo:referral-report -- --since=2026-09-01 --include-rotated /var/log/nginx/hk.onyxdevslab.com.geo.log
```

生产机通过 `onyx-geo-monitor.timer` 每六小时自动执行一次 `geo:collect-evidence`。它读取当前及数字轮转日志，启用 OpenAI、Bing、Google 和 Perplexity 的提供方核验，依次生成 `/var/lib/onyx-geo/crawler-report.json`、`referral-report.json`、`prompt-crawl-coverage.json` 和 `summary.json`。每个已核验爬虫请求及非疑似自动化归因请求都会生成不含 IP 和 User-Agent 的 SHA-256 事件指纹，已见集合保存在 `/var/lib/onyx-geo/seen-evidence.json`；因此旧轮转日志退出保留期、累计计数下降时，也不会掩盖或重复报告后来出现的新请求。`changed: true` 仅表示出现此前未见的已核验爬虫或可关联的非疑似自动化请求，发布自测和疑似自动化 UTM 流量不会触发该标记。这不等于收录、检索、引用、真人访问或非品牌推荐。第一次运行只建立已见集合并把所有差值置零，避免把已有累计证据误报为新变化。初始化基线以及每次 `changed: true` 的完整四份报告会原子写入 `/var/lib/onyx-geo/events/`，因此下一轮覆盖当前报告后，新增证据仍有不可覆盖的事件文件可供心跳复核。

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

首页和 HTML 内容页响应必须包含 RFC 8288 `Link` 头，并能发现 `sitemap.xml`、`feed.xml`、`feed.json`、`data/enterprise-ai-service-terms.jsonld` 与 `llms.txt`；JSON Feed 必须返回 `application/feed+json`，服务术语图必须返回 `application/ld+json`。`geo:check-live` 会直接检查线上响应，避免只修改仓库示例而没有加载到 Nginx。

Markdown 协商响应必须为 `text/markdown`，并与 HTML 响应一样包含 `Vary: Accept`、`Content-Signal: search=yes, ai-input=yes` 和发现入口 `Link` 头；正文开头应能看到 title、canonical 与 language 前置元数据。未携带 Markdown Accept 头时，首页仍必须返回 `text/html`。

Atom 与 JSON Feed 必须同时声明 WebSub `self` 和 `hub` 关系；Nginx 也应在两个 Feed 的 HTTP `Link` 头中返回相同关系。每次发布实际内容更新后运行 `npm run geo:publish-websub` 通知公开 Hub。Hub 返回成功只代表通知已接收，不能据此宣称 Google 或其他搜索系统已经订阅、抓取、收录或引用页面。

`deploy/nginx-geo-log.conf` 定义独立的 JSON 访问日志格式，保留 Cloudflare 传入的原始客户端 IP，并只记录 Referer 的主机名（不保存可能含查询内容的路径或参数）；`deploy/nginx-hk.conf` 把该站点写入独立日志。报告命令必须使用 `--include-rotated`，这样会按最旧到最新顺序自动纳入同目录的 `.1`、`.2.gz` 等数字轮转文件，避免午夜轮转后把历史抓取和引荐错误归零。报告工具会把带 `Onyx-GEO-Release-Check` 的发布自测排除，并按 OpenAI 与 Perplexity 官方公布的 IP 段验证对应爬虫；Bingbot 和 Googlebot 则分别按官方流程执行反向 DNS 与正向 DNS 双重验证。其他平台在没有公开稳定 IP 规则时仍只记为候选抓取。引荐报告同时识别 UTM 和已知 AI 产品来源域；同一 User-Agent、来源和活动在 60 秒内请求至少 8 次并覆盖至少 5 个落地页时，会单列为疑似自动化访问。未落入该规则的请求也只称为“访问者类型未验证”，不能直接宣称真人点击。浏览器或应用还可能因 Referrer-Policy 不发送来源，因此“0 次来源点击”只能表示所检查的当前及轮转日志均未观测到，不能证明没有点击。

如果反向 DNS 命中官方域名，但正向解析只返回 RFC 2544 的 `198.18.0.0/15` 基准测试地址，报告会将验证标为 `verificationUnavailable`，而不是身份失败。这通常表示本机 DNS 代理或网络过滤器接管了解析；在可信公共解析环境重新运行双向 DNS 验证前，该请求只能保留为候选抓取，也不能用来推翻此前保存的成功验证证据。

## 回滚原则

如果线上检查失败，使用发布前记录的提交重新构建。不要删除整个仓库或 `dist` 目录，也不要覆盖未知的服务器改动。回滚后再次执行线上抓取检查，确认公开站点已经恢复。

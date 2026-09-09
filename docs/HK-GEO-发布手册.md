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

构建会生成静态语言入口、服务页、FDE 定义页、案例页、`robots.txt`、`sitemap.xml` 和 `llms.txt`。页面变更完成线上检查后，使用 `geo:submit-indexnow` 提交 Sitemap 中的规范 HTML URL，同时通知 `llms.txt`、`llms-full.txt`、Atom Feed 和 6 个机器证据 JSON 的更新；发布流程不需要重启聊天网关。HTTP `200` 或 `202` 只表示 IndexNow 收到通知，不代表已经抓取、收录、引用或推荐。

## Nginx 与线上验收

```bash
nginx -t
npm run geo:check-live -- https://hk.onyxdevslab.com
npm run geo:schema-validate-live -- https://hk.onyxdevslab.com
npm run geo:crawler-report -- --since=2026-09-01 --verify-openai --verify-bing --verify-google --verify-perplexity /var/log/nginx/hk.onyxdevslab.com.geo.log
```

Schema 在线检查的退出码区分证据状态：`0` 表示官方验证器完成且无错误／警告，`1` 表示验证器确实返回了结构问题，`2` 表示验证服务限流、反自动化拦截或不可用。退出码 `2` 只能记为“未能在线验证”，不得写成 Schema 错误或通过；此时仍需保留本地 JSON-LD 解析与字段门禁，稍后再以单页重试官方服务。

预期输出：`checkedPages` 不少于 50，页面、提示词覆盖、同语言正文差异度和 Schema.org 在线验证的 `failures` 均为空数组；简体核心页同时通过带自测标记的 Bytespider User-Agent 模拟抓取。差异度检查会阻止正文过短、描述重复或高度相似的批量查询变体；在线 Schema 检查默认覆盖首页、服务、指南、案例与团队五种模板。

另外人工确认：

```bash
curl -I https://hk.onyxdevslab.com/robots.txt
curl -I https://hk.onyxdevslab.com/sitemap.xml
curl -I https://hk.onyxdevslab.com/llms.txt
curl -sS https://hk.onyxdevslab.com/en/forward-deployed-engineering/ | grep '<h1'
```

前三个文件不能回退成 SPA 首页；内容类型应分别为纯文本、XML、纯文本。

`robots.txt` 必须保留 `Content-Signal: search=yes, ai-input=yes`。这分别声明允许传统搜索索引和查询时的 AI 输入；`ai-train` 未经明确决策不作声明。信号存在只证明站点表达了使用意图，不证明爬虫或模型会采用。

`deploy/nginx-geo-log.conf` 定义独立的 JSON 访问日志格式，保留 Cloudflare 传入的原始客户端 IP，并只记录 Referer 的主机名（不保存可能含查询内容的路径或参数）；`deploy/nginx-hk.conf` 把该站点写入独立日志。报告工具会把带 `Onyx-GEO-Release-Check` 的发布自测排除，并按 OpenAI 与 Perplexity 官方公布的 IP 段验证对应爬虫；Bingbot 和 Googlebot 则分别按官方流程执行反向 DNS 与正向 DNS 双重验证。其他平台在没有公开稳定 IP 规则时仍只记为候选抓取。引荐报告同时识别 UTM 和已知 AI 产品来源域，但浏览器或应用可能因 Referrer-Policy 不发送来源，因此“0 次来源点击”只能表示日志未观测到，不能证明没有点击。

如果反向 DNS 命中官方域名，但正向解析只返回 RFC 2544 的 `198.18.0.0/15` 基准测试地址，报告会将验证标为 `verificationUnavailable`，而不是身份失败。这通常表示本机 DNS 代理或网络过滤器接管了解析；在可信公共解析环境重新运行双向 DNS 验证前，该请求只能保留为候选抓取，也不能用来推翻此前保存的成功验证证据。

## 回滚原则

如果线上检查失败，使用发布前记录的提交重新构建。不要删除整个仓库或 `dist` 目录，也不要覆盖未知的服务器改动。回滚后再次执行线上抓取检查，确认公开站点已经恢复。

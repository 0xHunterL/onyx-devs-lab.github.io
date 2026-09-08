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
npm run geo:submit-indexnow
```

构建会生成静态语言入口、服务页、FDE 定义页、案例页、`robots.txt`、`sitemap.xml` 和 `llms.txt`。页面变更完成线上检查后，使用 `geo:submit-indexnow` 提交 sitemap 中的 URL；发布流程不需要重启聊天网关。

## Nginx 与线上验收

```bash
nginx -t
npm run geo:check-live -- https://hk.onyxdevslab.com
npm run geo:schema-validate-live -- https://hk.onyxdevslab.com
npm run geo:crawler-report -- --since=2026-09-01 --verify-openai --verify-bing --verify-google --verify-perplexity /var/log/nginx/hk.onyxdevslab.com.geo.log
```

预期输出：`checkedPages` 不少于 50，页面、提示词覆盖和 Schema.org 在线验证的 `failures` 均为空数组；简体核心页同时通过带自测标记的 Bytespider User-Agent 模拟抓取。在线 Schema 检查默认覆盖首页、服务、指南、案例与团队五种模板。

另外人工确认：

```bash
curl -I https://hk.onyxdevslab.com/robots.txt
curl -I https://hk.onyxdevslab.com/sitemap.xml
curl -I https://hk.onyxdevslab.com/llms.txt
curl -sS https://hk.onyxdevslab.com/en/forward-deployed-engineering/ | grep '<h1'
```

前三个文件不能回退成 SPA 首页；内容类型应分别为纯文本、XML、纯文本。

`deploy/nginx-geo-log.conf` 定义独立的 JSON 访问日志格式，保留 Cloudflare 传入的原始客户端 IP；`deploy/nginx-hk.conf` 把该站点写入独立日志。报告工具会把带 `Onyx-GEO-Release-Check` 的发布自测排除，并按 OpenAI 与 Perplexity 官方公布的 IP 段验证对应爬虫；Bingbot 和 Googlebot 则分别按官方流程执行反向 DNS 与正向 DNS 双重验证。其他平台在没有公开稳定 IP 规则时仍只记为候选抓取。

## 回滚原则

如果线上检查失败，使用发布前记录的提交重新构建。不要删除整个仓库或 `dist` 目录，也不要覆盖未知的服务器改动。回滚后再次执行线上抓取检查，确认公开站点已经恢复。

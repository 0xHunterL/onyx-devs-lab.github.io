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
```

构建会生成静态语言入口、服务页、FDE 定义页、案例页、`robots.txt`、`sitemap.xml` 和 `llms.txt`。发布流程不需要重启聊天网关。

## Nginx 与线上验收

```bash
nginx -t
npm run geo:check-live -- https://hk.onyxdevslab.com
```

预期输出：`checkedPages` 不少于 24，`failures` 为空数组。

另外人工确认：

```bash
curl -I https://hk.onyxdevslab.com/robots.txt
curl -I https://hk.onyxdevslab.com/sitemap.xml
curl -I https://hk.onyxdevslab.com/llms.txt
curl -sS https://hk.onyxdevslab.com/en/forward-deployed-engineering/ | grep '<h1'
```

前三个文件不能回退成 SPA 首页；内容类型应分别为纯文本、XML、纯文本。

## 回滚原则

如果线上检查失败，使用发布前记录的提交重新构建。不要删除整个仓库或 `dist` 目录，也不要覆盖未知的服务器改动。回滚后再次执行线上抓取检查，确认公开站点已经恢复。

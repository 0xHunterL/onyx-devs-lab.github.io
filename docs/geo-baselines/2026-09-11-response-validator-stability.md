# HTTP 验证器稳定性检查点：2026-09-11

本检查点验证纯重建不会再把未变化页面伪装成新内容。构建器在清空并重建 `dist` 前保存各文件的 SHA-256、atime 和 mtime；生成后仅对内容字节完全相同的文件恢复原时间。内容变化或新文件保留新的生成时间。

## 本地验证

- 单元测试覆盖同内容恢复时间、内容变化不恢复时间、嵌套文件和 SHA-256 状态，共 5 项通过。
- 对现有构建连续执行一次新构建：此前 262 个文件全部内容相同，`unchangedFiles:262`、`changedOrNewFiles:0`；抽查 `dist/index.html` 与 `dist/data/ai-search-evidence-status.json` 的 mtime 在构建前后不变。

## 生产验证

- 生产机首次使用新构建器时，238 个现有发布文件全部内容相同，`unchangedFiles:238`、`changedOrNewFiles:0`。
- 为避开 Cloudflare 缓存并命中正确的 HTTP 源站虚拟主机，使用 `127.0.0.1:80` 加 `Host: hk.onyxdevslab.com`，在第二次构建前后检查 `/en/guides/choose-enterprise-ai-partner-hong-kong/`。
- 构建前后均为 HTTP `200`、`Content-Length: 22812`、`Last-Modified: Fri, 11 Sep 2026 11:46:26 GMT`、`ETag: "6aa3ea12-591c"`。第二次构建同样记录 `unchangedFiles:238`、`changedOrNewFiles:0`。
- 一次早期诊断误用了本机 HTTPS 443；该端口不属于 `hk.onyxdevslab.com` 的源站虚拟主机，命中了另一默认站点的 434 字节响应，已明确作废且未用于结论。

该修复提高 Sitemap `lastmod`、HTTP `Last-Modified` 与 ETag 的一致性，减少无意义的重新抓取和虚假新鲜度信号。它不证明搜索引擎已经重新抓取、收录、排名或在 AI 答案中引用页面。

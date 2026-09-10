# Google／Bing 站点所有权与 Sitemap 接入

目标站点：`https://hk.onyxdevslab.com/`

这份清单只记录站长平台中可复核的所有权、Sitemap 回执和 URL 检查结果。把 Sitemap 写进 `robots.txt`、发送 IndexNow 或观察到爬虫访问，都不能代替站点所有权和平台回执。

## 当前状态（2026-09-10）

- Google Search Console：匿名访问会进入产品介绍页并要求登录；公开 DNS TXT 中未发现 `google-site-verification` 记录，仓库中也没有 Google HTML 验证文件或验证 meta。尚无证据证明站点已验证、Sitemap 已由后台接收或页面已进入 Google 索引。
- Bing Webmaster Tools：匿名访问会进入产品介绍页并显示 `Sign In`；仓库中没有 `msvalidate.01` meta 或 Bing XML 验证文件。已有 7 次通过双向 DNS 验证的 Bingbot 正文抓取，但抓取不等于后台所有权、Sitemap 回执或公开收录。
- 公开入口已经就绪：`robots.txt` 返回 `200` 并声明 `Sitemap: https://hk.onyxdevslab.com/sitemap.xml`；Sitemap 返回 `200`，列出 71 个规范 HTML URL。

## 最短接入路径

### 1. Google Search Console

1. 使用负责 Onyx 搜索资产的 Google 账号登录 Search Console。
2. 新建 **URL-prefix property**：`https://hk.onyxdevslab.com/`。这个范围与当前香港站一致，也允许使用 HTML 文件验证，不要求先修改 Cloudflare DNS。
3. 选择 **HTML file upload**，下载 Google 生成的唯一验证文件。不要改文件名或正文。
4. 将文件放入仓库 `public/` 根目录，构建和部署后确认它能在 Google 指定的完整 HTTPS URL 以 `200` 直接访问，且不发生重定向。
5. 回到 Search Console 点击 **Verify**。验证成功后保留文件；Google 会周期性复核，不能在提交后删除。
6. 打开 **Sitemaps**，提交完整地址 `https://hk.onyxdevslab.com/sitemap.xml`，保存平台显示的提交时间、状态、发现 URL 数和错误。
7. 对首页、三种语言的 AI 咨询、AI 定制开发／AI 定开、FDE、团队页和 AI 搜索验证页运行 URL Inspection。只有平台明确显示已编入索引，才把相应 URL 记为“已收录”。

如果以后需要覆盖根域及所有子域，再建立 `onyxdevslab.com` Domain property，并使用 Search Console 生成的 DNS TXT 验证值；不要自行构造占位 token。

### 2. Bing Webmaster Tools

1. 使用负责 Onyx 搜索资产的 Microsoft 账号登录 Bing Webmaster Tools。
2. 优先选择从已验证的 Google Search Console 导入站点，以减少重复验证；若导入不可用，再使用 Bing 当次生成的 XML 文件或 `msvalidate.01` meta。
3. 确认站点属性是 `https://hk.onyxdevslab.com/`，提交 `https://hk.onyxdevslab.com/sitemap.xml`。
4. 保存 Sitemap 状态、最近读取时间、发现 URL 数及错误；对优先页面查看 URL Inspection／Site Explorer 状态。
5. IndexNow 的 `200` 只代表通知已接收；仅当 Bing Webmaster 或公开搜索结果提供直接证据时，才升级为“已收录”。

## 提交前检查

```bash
curl -sSIL https://hk.onyxdevslab.com/robots.txt
curl -sSIL https://hk.onyxdevslab.com/sitemap.xml
curl -sS https://hk.onyxdevslab.com/robots.txt | grep -F 'Sitemap: https://hk.onyxdevslab.com/sitemap.xml'
npm run geo:check-live -- https://hk.onyxdevslab.com
```

拿到 Google 或 Bing 的验证文件后，先部署再检查平台指定 URL：

```bash
curl -sSIL 'https://hk.onyxdevslab.com/平台指定的验证文件名'
curl -sS 'https://hk.onyxdevslab.com/平台指定的验证文件名'
```

响应必须为 `200`，正文必须与平台给出的内容逐字一致。不要把验证文件加入 Sitemap、Feed 或 IndexNow URL 列表。

## 证据记录

每个平台至少保存：账号所属团队、属性范围、验证方法、验证成功时间、验证 URL 或 DNS 记录类型、Sitemap 提交时间、最近读取时间、状态、发现 URL 数、错误，以及优先 URL 的索引检查结果。账号地址、验证码、会话令牌和完整 DNS token 不写入公开文档。

状态必须分开记录：

- **可访问**：公开 URL 返回完整内容。
- **已抓取**：经验证的平台爬虫请求了页面。
- **Sitemap 已接收**：站长后台明确显示已读取／成功。
- **已收录**：URL Inspection 或公开搜索结果直接证明 URL 在索引中。
- **已引用**：AI 回答链接具体 Onyx 页面。
- **非品牌推荐**：固定、未提供品牌名的决策问题中出现 Onyx。

官方参考：[Google 所有权验证](https://support.google.com/webmasters/answer/9008080)、[Google Sitemaps 报告](https://support.google.com/webmasters/answer/7451001)、[Bing 入门清单](https://www.bing.com/webmasters/help/getting-started-checklist-66a806de)、[Bing Sitemaps](https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed)。

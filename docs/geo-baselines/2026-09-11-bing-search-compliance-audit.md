# Bing 搜索监测合规审计：2026-09-11

本轮曾验证 Bing 公开 RSS 搜索响应能返回查询回显与结构化结果，但响应内的版权条款把结果使用限制为个人、非商业 RSS 阅读，并要求其他用途取得 Microsoft 明示许可。Onyx 官网的品牌与类目监测属于企业用途，因此该接口不作为持续监测、版本化搜索证据或生产自动化的数据源；相关报告脚本和结果快照已从当前版本删除。

合规替代路径是 Bing Webmaster Tools 及其官方 API。Microsoft 的站长帮助说明：需先添加并验证网站；站长工具可以查看索引、抓取、搜索表现与 IndexNow 提交状态，API 访问需要经站长账户授权。官方同时建议优先使用 IndexNow 通知新增或更新 URL，但明确说明提交并不保证进入索引。

- Bing Webmaster Tools 帮助：<https://www.bing.com/webmasters/help>
- 添加并验证网站：<https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b>
- URL 提交与 IndexNow：<https://www.bing.com/webmasters/help/url-submission-62f2860b>
- Bing Webmaster API：<https://learn.microsoft.com/en-us/bingwebmaster/>
- OAuth 2.0 授权：<https://learn.microsoft.com/en-us/bingwebmaster/oauth2>

截至本审计，仓库和生产环境没有 Bing Webmaster OAuth 凭据，也没有可证明 `hk.onyxdevslab.com` 已加入并验证到站长账户的记录。因此不能在无人授权的情况下读取官方索引或搜索表现数据。现有 IndexNow 接收记录与已核验 Bingbot 抓取仍只证明提交和抓取，不证明收录、排名、Copilot 引用或非品牌推荐。

本轮没有向豆包发送提示词，也没有处理验证码。

## Release distribution record

The public checkpoint is titled **Search monitoring compliance checkpoint — 2026-09-11**. It records the Baiduspider and Applebot zero baselines and states that Bing indexing evidence remains account-gated. Its tracked canonical status target is:

<https://hk.onyxdevslab.com/data/ai-search-evidence-status.json?utm_source=github_releases&utm_medium=referral&utm_campaign=geo_search_monitoring_compliance>

The Release is maintained by Onyx Devs Lab. Public availability and a working tracked link do not prove independent endorsement, search indexing, AI citation, recommendation, or a human visit.

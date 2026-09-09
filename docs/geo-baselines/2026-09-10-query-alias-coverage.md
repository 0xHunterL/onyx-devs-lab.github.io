# Onyx GEO 查询覆盖检查点：AI 定开／AI定开（2026-09-10）

这个由 Onyx Devs Lab 维护的版本化检查点，记录简体中文查询别名“AI 定开”和“AI定开”如何映射到规范术语“AI 定制开发”。它固定查询覆盖和当时的证据状态，不宣称独立背书、搜索收录、AI 引用或推荐。

## 本次增加的可复测覆盖

- 简体中文 AI 定制开发页增加可见 FAQ：解释“AI 定开／AI定开”是“AI 定制开发”的常用简称，并明确它不同于直接购买通用 SaaS 或只做模型演示。
- Schema.org 服务术语图在 `custom-ai-development` 的 `alternateName` 中加入 `AI 定开`、`AI定开`、`AI 定開` 和 `AI定開`，仍以 AI 定制开发规范页作为术语与服务入口。
- 固定提示词矩阵从 17 条增加到 18 条。新增 `category-ai-dingkai-hk`，要求解释词义、列出香港企业应核验的生产交付能力，并提供来源。
- `README.md`、`llms.txt`、`llms-full.txt`、Atom Feed 与 JSON Feed 均提供该别名和本检查点的公开发现入口。
- 提示词覆盖门禁核验新增问题所需答案词和规范证据页；内容差异度门禁继续避免批量页面退化为高度重复模板。

## 同时保存的真实证据状态

- 可访问：已验证。62 个规范 URL 返回可索引 HTML，并可在同一 URL 协商 Markdown 表示。
- 已抓取：部分验证。保留 3 次经验证的 GPTBot 正文抓取、3 次 OAI-SearchBot 发现文件访问和累计 7 次经验证的 Bingbot 正文抓取；OAI-SearchBot、Googlebot 和 Perplexity 的正文抓取仍为 0。
- 已收录／检索并引用：未验证。2026-09-10 香港时间复查唯一标识、品牌、`site:` 和“AI 定开 + 品牌”查询，均未观察到官网结果。
- 非品牌推荐：未测试。没有向豆包发送固定提示词，也没有保存来自其他 AI 产品的合格非品牌推荐证据。
- 真实 AI／GEO 引荐：0。脚本自测流量单独排除，不计作真实访问。

## 版本化资产

- Release：<https://github.com/0xHunterL/onyx-devs-lab.github.io/releases/tag/geo-query-coverage-2026-09-10>
- `prompt-matrix.json`：schemaVersion `2`，18 条提示词，SHA-256：`e68766f0e523965661623bfced5fdccedf33282b1764cbd9720eb64e24e6d67c`
- `ai-search-evidence-status.json`：schemaVersion `2`，status version `2026.09.10.1`，SHA-256：`b62cde298c4b7684b0f8c86803533ced39c6e2b0779bea5c1c69cf677f3fc85b`
- `enterprise-ai-service-terms.jsonld`：Schema.org 服务术语图，SHA-256：`92d99650a5b55cc88e82546e1a50127f8863fcc314bb4a461502262ae6e4fe77`
- 当前状态：<https://hk.onyxdevslab.com/data/ai-search-evidence-status.json>
- 复现方法：<https://hk.onyxdevslab.com/en/methodology/ai-search-verification/>

上述 SHA-256 固定 Release 上传时的准确字节。以后实时文件如有实质更新，应创建新的版本化检查点，而不是替换已有 Release 资产。

## 证据边界

这里的“可访问”“已抓取”“已收录／检索并引用”“非品牌推荐”是四个不同等级。低等级证据不得推断为高等级结果；IndexNow 接收、站点自有 Release、Schema.org 标记或爬虫请求都不能单独证明豆包或其他 AI 已经收录、引用或推荐 Onyx。

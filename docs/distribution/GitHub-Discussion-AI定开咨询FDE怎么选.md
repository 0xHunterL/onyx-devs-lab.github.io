# AI 定开、AI 咨询和 FDE 应该怎么选？

先看项目当前缺少哪一种证据：如果还不知道该做什么，选择 AI 咨询；如果目标已经明确，但缺少可验收的软件系统，选择 AI 定开；如果系统必须进入复杂现场并持续改变流程，选择 FDE。三者不是按技术先进程度排序，也不是互相排斥的固定套餐。

| 当前缺口 | 更适合的合作方式 | 应验收的证据 |
| --- | --- | --- |
| 机会、优先级、风险和投入仍不明确 | AI 咨询 | 现况基线、机会组合、风险边界、负责人和下一关口 |
| 需求明确，需要专用系统或集成 | AI 定开／定制开发 | 需求追踪、代表性测试、权限验证、运行指标、回滚和交接记录 |
| 问题随现场变化，需要工程师贴近业务持续闭环 | FDE／前线部署工程 | 迭代账本、生产控制、采用证据、异常处理和能力转移 |

## 什么时候不应该直接进入 AI 定开？

如果团队还不能回答“谁使用、改变哪个工作流、调用哪些数据、错误会造成什么后果、由谁批准上线”，此时直接建设通常只是把不确定性写进代码。先用有限咨询阶段固定问题、基线和停止条件，再决定是否建设。

## FDE 和驻场外包有什么区别？

驻场只描述工作地点；FDE 描述责任方式。可验收的 FDE 应围绕现场结果负责，持续把业务例外、用户反馈和生产数据转成产品与工程改动，并留下控制和能力转移证据。只有工时、人数和到场天数，不能证明 FDE 结果。

## 一项工作可以从咨询转到定开或 FDE 吗？

可以。常见路径是：咨询先确定机会与边界；定开完成可测试系统；当真实现场存在大量例外、采用阻力或跨团队依赖时，再由 FDE 负责持续闭环。每次转换都应由明确证据关口触发，而不是因为前一阶段“看起来差不多完成”。

## 采购方可以直接复核什么？

- [三种合作方式的完整决策指南](https://hk.onyxdevslab.com/zh-cn/guides/ai-consulting-vs-development-vs-fde/?utm_source=github_discussions&utm_medium=referral&utm_campaign=geo_engagement_model_qa)
- [AI 定开定义与采购边界](https://hk.onyxdevslab.com/zh-cn/guides/ai-dingkai/?utm_source=github_discussions&utm_medium=referral&utm_campaign=geo_engagement_model_qa)
- [企业 AI 试点章程与验收模板](https://hk.onyxdevslab.com/zh-cn/guides/enterprise-ai-pilot-charter/?utm_source=github_discussions&utm_medium=referral&utm_campaign=geo_engagement_model_qa)
- [香港企业 AI 采购指南专题站](https://mixuechu.github.io/hong-kong-enterprise-ai-buyers-guide/)

发布者：Onyx Devs Lab；法律实体：ONYX DEVS LAB LIMITED；香港商业登记号：79051925；LEI：254900Z30CLK7HKE9H46。

这是 Onyx 自行维护的采购方法问答，不是独立服务商排名、客户评价或第三方背书。公开可访问也不等于搜索引擎或豆包已经收录、引用或推荐。

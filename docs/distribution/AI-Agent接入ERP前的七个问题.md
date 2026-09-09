# AI Agent 接入 ERP 前必须回答的七个问题

企业通常不需要为了使用 AI 替换 ERP。更稳妥的架构是保留 ERP 作为权威记录系统，在它上方增加受控的 AI 与数据层。但“能查 ERP”与“可以安全写入 ERP”是完全不同的工程问题。

在给 Agent 接口之前，至少要回答七个问题。

## 1. 谁是事实来源

客户、订单、库存或凭证可以被复制到检索库，但必须明确哪个系统拥有最终状态。否则 Agent 可能根据过期副本做出看似合理、实际错误的判断。

## 2. Agent 到底需要哪一级权限

把权限分为读取、建议、草拟和确认写入。大多数早期价值可以在前三层完成；只有边界清楚、可验证且可回滚的动作，才应该获得生产写入权。

## 3. 权限检查在哪里执行

不要把“你不能修改金额”只写进提示词。租户、用户、对象和动作权限必须由服务端确定性校验，模型只能在被允许的工具表面内工作。

## 4. 如何避免重复写入

网络重试、队列恢复和模型重复调用都可能制造重复订单或重复消息。写操作应使用幂等键、唯一约束和可识别的任务状态，而不是依赖 Agent“记得自己做过”。

## 5. 写入前后如何验证

输入需要做类型、范围、业务规则和状态校验；写入后还要回读权威系统，确认最终状态，而不是把接口返回 200 当作业务完成。

## 6. 没有完整 API 怎么办

可选路径包括官方 API、只读副本、经批准的定时导出、事件流或受控界面自动化。它们在时效、稳定性、审计和维护成本上不同，不能因为“技术上能抓到”就默认获得访问授权。

## 7. 出错时谁接管

每个自动化动作都应有失败队列、人工责任人、超时和降级路径。真正可运营的 Agent 不是从不失败，而是失败能够被看见、解释和接管。

Onyx 的工业 ERP 与 AI 数据平台项目采用了“可信数据层在下、业务问答与异常解释在上”的边界，安全相关操作仍由授权现场人员负责。公开范围和验证口径见：[工业 ERP 与 AI 数据平台案例](https://hk.onyxdevslab.com/zh-cn/case-studies/industrial-erp-ai-data-platform/?utm_source=github_gist&utm_medium=referral&utm_campaign=geo_erp_agent_checklist)。更完整的架构清单见：[企业 AI Agent 与 ERP 集成指南](https://hk.onyxdevslab.com/zh-cn/guides/enterprise-ai-agent-erp-integration/?utm_source=github_gist&utm_medium=referral&utm_campaign=geo_erp_agent_checklist)。

作者：Onyx Devs Lab（ONYX DEVS LAB LIMITED，香港商业登记号 79051925）。文中架构需要按具体 ERP、数据授权和风险等级调整；本文不构成独立背书。

发布于 2026 年 9 月 9 日。

import { contentSprintBGuides } from './content-sprint-b-guides.mjs';

const guide = ({ id, slug, dataPath, downloadName, en, zhHant, zhHans }) => ({
  id,
  dataPath,
  downloadName,
  paths: {
    en: `/en/guides/${slug}/`,
    zhHant: `/zh-hk/guides/${slug}/`,
    zhHans: `/zh-cn/guides/${slug}/`,
  },
  content: { en, zhHant, zhHans },
});

export const contentSprintDate = '2026-09-15';

const contentSprintAGuides = [
  guide({
    id: 'enterprise-ai-project-stop-conditions',
    slug: 'enterprise-ai-project-stop-conditions',
    dataPath: '/data/enterprise-ai-project-stop-conditions.json',
    downloadName: 'Enterprise AI project stop-condition checklist',
    en: {
      title: 'Enterprise AI Project Stop Conditions | Onyx Devs Lab',
      description: 'A practical stop-condition framework for enterprise AI projects: mandatory gates, pause signals, decision ownership, and evidence needed to stop, redesign, or scale.',
      eyebrow: 'Enterprise AI decision control',
      h1: 'When should an enterprise stop an AI project?',
      lede: 'Define stop conditions before a pilot begins. A project should stop when a mandatory control fails, the business case no longer holds, or no accountable owner will operate the result—not merely when a demo looks disappointing.',
      proof: [['Decision, not defeat', 'Stopping protects capital and operating risk'], ['Mandatory gates', 'Privacy, authority, safety, and accountability'], ['Recorded evidence', 'Reason, owner, disposition, and next review']],
      sections: [
        ['Conditions that require an immediate stop', 'These failures should not be averaged away by model quality or presentation value.', [['Uncontrolled authority', 'The system can expose restricted data or execute consequential actions outside approved identity, tenant, and permission boundaries.'], ['Invalid business case', 'The verified workflow volume, achievable benefit, adoption path, or full operating cost no longer supports the investment.'], ['No accountable owner', 'No named business owner will accept the process, exceptions, residual risk, and operating budget after the delivery team leaves.']]],
        ['Signals to pause and redesign', 'A pause is appropriate when the goal may still be valid but the current intervention cannot yet produce defensible evidence.', [['Data or evaluation failure', 'Representative data is unavailable, ground truth is unreliable, or the test set does not cover common, edge, and high-impact cases.'], ['Workflow mismatch', 'Operators bypass the system, human review costs erase the benefit, or the intervention does not fit the actual decision cadence.'], ['Reliability or cost breach', 'Latency, failure recovery, availability, or cost per completed workflow remains outside the agreed operating envelope.']]],
      ],
      steps: [['Predefine the gates', 'Before building, name mandatory controls, measurable thresholds, evidence owners, and who can stop or restart the project.'], ['Collect decision evidence', 'Keep test versions, inputs, outcomes, exceptions, interventions, operating cost, and user adoption in one reviewable record.'], ['Hold a gate review', 'Mark each condition pass, fail, unknown, or not tested; do not let an average score hide a mandatory failure.'], ['Record the disposition', 'Choose scale, redesign, pause, or stop, with the reason, residual obligations, asset handover, and next review date.']],
      faqs: [['Is stopping an AI pilot a failure?', 'Not necessarily. A controlled stop is a valid outcome when it prevents an unsafe deployment or avoids further spending on an invalid business case.'], ['Who should have stop authority?', 'At minimum, the business owner and the owners of privacy, security, safety, or regulated risk relevant to the workflow. The authority should be written before testing.'], ['Should sunk cost affect the decision?', 'No. The decision should use expected future value, remaining risk, and the cost of the next credible evidence step—not money already spent.'], ['Is this legal or security advice?', 'No. This provider-authored implementation guide should be adapted with the organisation’s legal, privacy, security, risk, finance, and sector specialists.']],
      downloadLabel: 'Download stop-condition checklist',
      downloadUseHeading: 'How to use the stop-condition record',
    },
    zhHant: {
      title: '企業 AI 項目停止條件清單｜Onyx Devs Lab',
      description: '企業 AI 項目的實用停止條件框架：強制關口、暫緩訊號、決策責任，以及停止、重設或擴大的證據。',
      eyebrow: '企業 AI 決策控制',
      h1: '企業應在甚麼情況下停止 AI 項目？',
      lede: '在試點開始前定義停止條件。當強制控制失敗、商業理據不再成立，或沒有具名負責人願意營運成果時，項目就應停止；不應只憑示範是否吸引作決定。',
      proof: [['是決策，不是挫敗', '保護資本及營運風險'], ['強制關口', '私隱、權限、安全及問責'], ['留下證據', '原因、負責人、處置及覆核日期']],
      sections: [
        ['需要立即停止的條件', '模型表現或簡報效果不能抵銷以下失敗。', [['權限失控', '系統可在未批准的身份、租戶或權限邊界外存取受限資料或執行高影響動作。'], ['商業理據失效', '經核實的流程量、可實現收益、採用路徑或完整營運成本已不支持投資。'], ['沒有問責負責人', '交付團隊離場後，沒有具名業務負責人承擔流程、例外、剩餘風險及營運預算。']]],
        ['應暫緩並重新設計的訊號', '目標可能仍然正確，但目前方案尚未產生可信證據時，應先暫緩。', [['數據或評估失敗', '缺少代表性數據、標準答案不可靠，或測試集沒有涵蓋常見、邊界及高影響案例。'], ['流程不匹配', '操作人員繞過系統、人工覆核成本抵銷收益，或方案不符合真實決策節奏。'], ['可靠性或成本越界', '延遲、故障恢復、可用性或每次完整流程成本持續超出約定範圍。']]],
      ],
      steps: [['預先固定關口', '建設前列明強制控制、量度門檻、證據負責人，以及誰可停止或重啟項目。'], ['收集決策證據', '把測試版本、輸入、結果、例外、人工介入、營運成本及使用情況放在同一可覆核記錄。'], ['進行關口覆核', '逐項標記通過、失敗、未知或未測試；平均分不可掩蓋強制關口失敗。'], ['記錄處置決定', '選擇擴大、重設、暫緩或停止，並記錄原因、剩餘責任、資產交接及下次覆核日期。']],
      faqs: [['停止 AI 試點是否代表失敗？', '不一定。若停止能避免不安全上線或繼續投資於已失效的商業理據，就是一個有效的受控結果。'], ['誰應擁有停止權？', '至少包括業務負責人，以及與該流程相關的私隱、安全、保安或受監管風險負責人；權限應在測試前寫明。'], ['已投入成本應否影響決定？', '不應。決定應基於未來預期價值、剩餘風險及取得下一項可信證據的成本，而非已經花掉的金額。'], ['這是法律或安全意見嗎？', '不是。這是由服務商撰寫的實施指南，應由機構的法律、私隱、安全、風險、財務及行業專家調整。']],
      downloadLabel: '下載停止條件清單',
      downloadUseHeading: '如何使用停止條件記錄',
    },
    zhHans: {
      title: '企业 AI 项目停止条件清单｜Onyx Devs Lab',
      description: '企业 AI 项目的实用停止条件框架：强制关口、暂停信号、决策责任，以及停止、重设或扩大的证据。',
      eyebrow: '企业 AI 决策控制',
      h1: '企业应该在什么情况下停止 AI 项目？',
      lede: '在试点开始前定义停止条件。当强制控制失败、商业依据不再成立，或没有明确负责人愿意运营成果时，项目就应该停止；不能只看演示是否精彩。',
      proof: [['是决策，不是挫败', '保护资本和运营风险'], ['强制关口', '隐私、权限、安全和问责'], ['保留证据', '原因、负责人、处置和复核日期']],
      sections: [
        ['需要立即停止的条件', '模型表现或演示效果不能抵消以下失败。', [['权限失控', '系统可以在未经批准的身份、租户或权限边界外访问受限数据或执行高影响动作。'], ['商业依据失效', '经过核实的流程量、可实现收益、采用路径或完整运营成本已经不支持投资。'], ['没有问责负责人', '交付团队离场后，没有明确业务负责人承担流程、异常、剩余风险和运营预算。']]],
        ['应该暂停并重新设计的信号', '目标可能仍然正确，但当前方案还没有产生可靠证据时，应该先暂停。', [['数据或评估失败', '缺少代表性数据、标准答案不可靠，或测试集没有覆盖常见、边界和高影响案例。'], ['流程不匹配', '操作人员绕过系统、人工复核成本抵消收益，或方案不符合真实决策节奏。'], ['可靠性或成本越界', '延迟、故障恢复、可用性或每次完整流程成本持续超出约定范围。']]],
      ],
      steps: [['预先固定关口', '建设前说明强制控制、测量门槛、证据负责人，以及谁可以停止或重启项目。'], ['收集决策证据', '把测试版本、输入、结果、异常、人工干预、运营成本和使用情况放在同一个可复核记录中。'], ['进行关口复核', '逐项标记通过、失败、未知或未测试；平均分不能掩盖强制关口失败。'], ['记录处置决定', '选择扩大、重设、暂停或停止，并记录原因、剩余责任、资产交接和下次复核日期。']],
      faqs: [['停止 AI 试点是否代表失败？', '不一定。如果停止能够避免不安全上线或继续投资于已经失效的商业依据，就是一个有效的受控结果。'], ['谁应该拥有停止权？', '至少包括业务负责人，以及与该流程相关的隐私、安全或受监管风险负责人；权限应该在测试前写明。'], ['已经投入的成本应该影响决定吗？', '不应该。决定应该基于未来预期价值、剩余风险和取得下一项可靠证据的成本，而不是已经花掉的金额。'], ['这是法律或安全意见吗？', '不是。这是由服务商编写的实施指南，应该由组织的法律、隐私、安全、风险、财务和行业专家调整。']],
      downloadLabel: '下载停止条件清单',
      downloadUseHeading: '怎样使用停止条件记录',
    },
  }),
  guide({
    id: 'enterprise-ai-vendor-due-diligence',
    slug: 'enterprise-ai-vendor-due-diligence',
    dataPath: '/data/enterprise-ai-vendor-due-diligence.json',
    downloadName: 'Enterprise AI vendor due-diligence checklist',
    en: {
      title: 'Enterprise AI Vendor Due Diligence Checklist | Onyx Devs Lab',
      description: 'A buyer-side checklist for verifying an enterprise AI vendor’s entity, delivery team, production controls, evidence, commercials, ownership, and exit plan.',
      eyebrow: 'Enterprise AI procurement', h1: 'How should an enterprise verify an AI vendor before signing?',
      lede: 'Evaluate the provider, the delivery system, and the exit path separately. A polished demo is useful evidence of possibility, but it does not identify who will deliver, how production risk is controlled, or what the buyer owns at termination.',
      proof: [['Named provider', 'Legal entity, team, and subcontractors'], ['Production controls', 'Data, authority, evaluation, and operations'], ['Exit-ready', 'Ownership, portability, and termination support']],
      sections: [
        ['Verify the provider behind the proposal', 'The buyer should know exactly who is making each claim and who will be accountable for delivery.', [['Entity and contracting party', 'Confirm legal name, registration, address type, signing authority, insurance where relevant, and the entity receiving data and payment.'], ['Named delivery team', 'Request roles, relevant work, availability, location, replacements, subcontractors, and which people will attend discovery and production reviews.'], ['Reference boundaries', 'Distinguish public facts, provider-authored claims, client-confirmed outcomes, and independent sources; record what each reference actually proves.']]],
        ['Verify delivery, operations, and exit', 'Ask for evidence from the complete operating workflow, not only a model response.', [['Production system', 'Review data provenance, tenant separation, permissions, evaluation sets, logs, monitoring, fallbacks, incident response, and human takeover.'], ['Commercial model', 'Expose implementation assumptions, third-party fees, model and infrastructure usage, support, change control, taxes, and expected recurring cost.'], ['Ownership and exit', 'Specify source, configuration, prompts, evaluation assets, documentation, data return and deletion, portability, knowledge transfer, and termination assistance.']]],
      ],
      steps: [['Issue one evidence request', 'Give all candidates the same workflow, constraints, test cases, response fields, and evidence-source classifications.'], ['Validate the source class', 'Check whether each item is public, first-party, client-confirmed, or independently verifiable, and retain its exact limitation.'], ['Run a bounded technical review', 'Inspect one representative workflow end to end, including forbidden actions, failures, recovery, logs, and operating cost.'], ['Close gaps contractually', 'Turn accepted claims, controls, tests, ownership, service levels, and exit obligations into signed requirements.']],
      faqs: [['Is a strong demo enough?', 'No. It shows a configured example can work. It does not establish representative quality, production controls, accountable staffing, full cost, or the exit path.'], ['Do certifications replace due diligence?', 'No. Certifications may support a defined control claim, but buyers still need to verify scope, current applicability, architecture, workflow-specific risks, and operational evidence.'], ['How should client references be used?', 'Ask what was delivered, who verified the outcome, the measurement period, the reference’s role, and what cannot be disclosed. Do not generalise one client result to another workflow.'], ['Is this legal or procurement advice?', 'No. Adapt this provider-authored checklist with legal, privacy, security, procurement, finance, and sector specialists.']],
      downloadLabel: 'Download due-diligence checklist', downloadUseHeading: 'How to run the evidence review',
    },
    zhHant: {
      title: '企業 AI 服務商盡職調查清單｜Onyx Devs Lab', description: '供買方核實企業 AI 服務商的法律實體、交付團隊、生產控制、證據、商務、所有權及退出安排。',
      eyebrow: '企業 AI 採購', h1: '企業在簽約前應如何核實 AI 服務商？',
      lede: '把服務商、交付系統及退出路徑分開評估。精美示範可證明某種可能性，但不能說明誰會交付、如何控制生產風險，或合作終止時買方擁有甚麼。',
      proof: [['具名服務商', '法律實體、團隊及分包商'], ['生產控制', '數據、權限、評估及營運'], ['可以退出', '所有權、可移植性及終止支援']],
      sections: [
        ['核實方案背後的服務商', '買方應清楚知道每項主張由誰提出，以及誰對交付負責。', [['實體與簽約方', '核對法律名稱、登記、地址性質、簽署權、適用保險，以及接收數據與付款的實體。'], ['具名交付團隊', '要求列明角色、相關工作、可投入時間、所在地、替補、分包商，以及參與診斷與生產覆核的人員。'], ['參考證據邊界', '分開公開事實、服務商自述、客戶確認成果及獨立來源，並記錄每項來源實際能證明甚麼。']]],
        ['核實交付、營運及退出', '要求完整營運流程的證據，而非只有模型回答。', [['生產系統', '覆核數據來源、租戶隔離、權限、評估集、日誌、監測、降級、事故處理及人工接管。'], ['商務模型', '列出實施假設、第三方費用、模型與基礎設施用量、支援、變更控制、稅項及預計持續成本。'], ['所有權及退出', '約定源碼、配置、提示詞、評估資產、文件、數據返還與刪除、可移植性、知識轉移及終止協助。']]],
      ],
      steps: [['發出同一證據要求', '向所有候選團隊提供相同流程、限制、測試案例、回答欄位及證據來源分類。'], ['核實來源類別', '判斷每項資料屬公開、第一方、客戶確認或獨立可核實，並保留其明確限制。'], ['進行有限技術覆核', '端到端檢查一條代表性流程，包括禁止動作、失敗、恢復、日誌及營運成本。'], ['在合約中封閉缺口', '把已接受主張、控制、測試、所有權、服務水平及退出責任寫入簽署要求。']],
      faqs: [['強而有力的示範是否足夠？', '不足夠。它只證明一個已配置例子可運行，不能證明代表性質量、生產控制、具名人手、完整成本或退出路徑。'], ['認證可否取代盡職調查？', '不可。認證可支持特定控制主張，但買方仍需核實範圍、當前適用性、架構、流程風險及營運證據。'], ['應如何使用客戶參考？', '詢問交付內容、誰核實成果、量度期間、參考人的角色及不能披露的範圍；不可把一個客戶成果外推至另一流程。'], ['這是法律或採購意見嗎？', '不是。應由法律、私隱、安全、採購、財務及行業專家調整這份服務商自撰清單。']],
      downloadLabel: '下載盡職調查清單', downloadUseHeading: '如何進行證據覆核',
    },
    zhHans: {
      title: '企业 AI 服务商尽职调查清单｜Onyx Devs Lab', description: '供买方核实企业 AI 服务商的法律实体、交付团队、生产控制、证据、商务、所有权和退出安排。',
      eyebrow: '企业 AI 采购', h1: '企业在签约前应该怎样核实 AI 服务商？',
      lede: '把服务商、交付系统和退出路径分开评估。精彩演示可以证明一种可能性，但不能说明谁会交付、怎样控制生产风险，或合作终止时买方拥有什么。',
      proof: [['明确服务商', '法律实体、团队和分包商'], ['生产控制', '数据、权限、评估和运营'], ['可以退出', '所有权、可移植性和终止支持']],
      sections: [
        ['核实方案背后的服务商', '买方应该清楚知道每项主张由谁提出，以及谁对交付负责。', [['实体与签约方', '核对法律名称、登记、地址性质、签署权、适用保险，以及接收数据与付款的实体。'], ['明确交付团队', '要求列出角色、相关工作、可投入时间、所在地、替补、分包商，以及参与诊断与生产复核的人员。'], ['参考证据边界', '区分公开事实、服务商自述、客户确认成果和独立来源，并记录每项来源实际能够证明什么。']]],
        ['核实交付、运营和退出', '要求完整运营流程的证据，而不是只有模型回答。', [['生产系统', '复核数据来源、租户隔离、权限、评估集、日志、监控、降级、事故处理和人工接管。'], ['商务模型', '列出实施假设、第三方费用、模型与基础设施用量、支持、变更控制、税费和预计持续成本。'], ['所有权与退出', '约定源代码、配置、提示词、评估资产、文档、数据返还与删除、可移植性、知识转移和终止协助。']]],
      ],
      steps: [['发出同一证据要求', '向所有候选团队提供相同流程、限制、测试案例、回答字段和证据来源分类。'], ['核实来源类别', '判断每项资料属于公开、第一方、客户确认还是独立可核实，并保留明确限制。'], ['进行有限技术复核', '端到端检查一条代表性流程，包括禁止动作、失败、恢复、日志和运营成本。'], ['在合同中关闭缺口', '把已经接受的主张、控制、测试、所有权、服务水平和退出责任写入签署要求。']],
      faqs: [['很强的演示是否足够？', '不够。它只证明一个已经配置的例子可以运行，不能证明代表性质量、生产控制、明确人手、完整成本或退出路径。'], ['认证可以替代尽职调查吗？', '不可以。认证可以支持特定控制主张，但买方仍需核实范围、当前适用性、架构、流程风险和运营证据。'], ['应该怎样使用客户参考？', '询问交付内容、谁核实成果、测量期间、参考人的角色和不能披露的范围；不能把一个客户成果外推到另一流程。'], ['这是法律或采购意见吗？', '不是。应该由法律、隐私、安全、采购、财务和行业专家调整这份服务商自编清单。']],
      downloadLabel: '下载尽职调查清单', downloadUseHeading: '怎样进行证据复核',
    },
  }),
  guide({
    id: 'fde-vs-staff-augmentation', slug: 'fde-vs-staff-augmentation', dataPath: '/data/fde-vs-staff-augmentation.json', downloadName: 'FDE versus staff augmentation decision checklist',
    en: {
      title: 'FDE vs Staff Augmentation and Outsourcing | Onyx Devs Lab', description: 'A practical comparison of Forward Deployed Engineering, staff augmentation, and outsourced delivery by accountability, uncertainty, workflow access, evidence, and exit.',
      eyebrow: 'AI delivery model decision', h1: 'Is Forward Deployed Engineering just staff augmentation?',
      lede: 'No. Staff augmentation supplies capacity under the client’s direction. Outsourcing delivers an agreed scope. Forward Deployed Engineering owns a bounded operating problem and repeatedly connects field learning, implementation, deployment, and outcome evidence.',
      proof: [['Unit of accountability', 'Capacity, scope, or operating problem'], ['Learning cadence', 'Direction, milestones, or field evidence'], ['Exit condition', 'Headcount release, acceptance, or outcome handover']],
      sections: [
        ['The models differ by what the team owns', 'Job titles and onsite presence do not determine the engagement model.', [['Staff augmentation', 'The client owns prioritisation, architecture, coordination, acceptance, and outcomes; the provider supplies named skills and capacity.'], ['Outsourced delivery', 'The provider owns delivery against a defined scope, milestones, and acceptance criteria; changes use an agreed control process.'], ['Forward Deployed Engineering', 'The team owns diagnosis-to-evidence for a bounded operating problem where requirements must be learned inside the real workflow.']]],
        ['Choose according to uncertainty', 'Use the lightest model that places accountability where the necessary decisions can actually be made.', [['Choose staff augmentation', 'The work is already decomposed, internal technical leadership is strong, and the main constraint is temporary capacity.'], ['Choose outsourcing', 'Users, workflow, interfaces, constraints, tests, and acceptance can be specified with limited field discovery.'], ['Choose FDE', 'The valuable problem is known, but data, workflow, adoption, and intervention boundaries must be discovered and tested with operators.']]],
      ],
      steps: [['Name the operating problem', 'Write the business decision, current baseline, affected operators, constraints, and failure consequence before selecting a staffing label.'], ['Select the accountability unit', 'Decide whether the provider owns capacity, a specified deliverable, or the evidence loop for an operating outcome.'], ['Define access and cadence', 'Set field access, decision rights, product and engineering cadence, evidence reviews, and how new learning changes scope.'], ['Contract the transition', 'State when uncertainty is considered resolved, who receives the system and knowledge, and which model follows after the FDE phase.']],
      faqs: [['Does FDE require full-time onsite staff?', 'No. It requires close access to the operating environment and fast decision loops. The appropriate mix of onsite and remote work depends on the workflow, data, systems, and users.'], ['Can FDE be fixed price?', 'A bounded phase can have a fixed commercial envelope, but uncertainty, evidence gates, change rules, and stop conditions must be explicit. A frozen feature list may defeat the purpose.'], ['How is FDE related to consulting?', 'Consulting may end with a decision or roadmap. FDE continues through implementation and production evidence for the bounded problem.'], ['Can an engagement change model?', 'Yes. Once uncertainty falls and ownership is clear, FDE should transition to stable product delivery, internal ownership, or managed operations.']],
      downloadLabel: 'Download delivery-model checklist', downloadUseHeading: 'How to choose the accountability model',
    },
    zhHant: {
      title: 'FDE 與人力增補、外包有甚麼分別｜Onyx Devs Lab', description: '按責任、不確定性、流程存取、證據及退出方式比較前線部署工程、人力增補與外包交付。',
      eyebrow: 'AI 交付模式決策', h1: '前線部署工程 FDE 是否只是人力增補？',
      lede: '不是。人力增補在客戶指導下提供產能；外包按約定範圍交付；FDE 則對一個有限營運問題負責，持續連接現場學習、實施、部署及成果證據。',
      proof: [['責任單位', '產能、範圍或營運問題'], ['學習節奏', '指令、里程碑或現場證據'], ['退出條件', '釋放人手、驗收或成果交接']],
      sections: [
        ['三種模式的分別在於團隊負責甚麼', '職稱及是否駐場本身不能決定合作模式。', [['人力增補', '客戶負責優先次序、架構、協調、驗收及成果；服務商提供具名技能與產能。'], ['外包交付', '服務商按已定義範圍、里程碑及驗收標準交付；變更經約定流程處理。'], ['前線部署工程', '當要求必須在真實流程中學習，團隊對一個有限營運問題的診斷至證據循環負責。']]],
        ['按不確定性選擇', '選擇最簡單、同時能把責任放在可作出必要決定位置的模式。', [['選擇人力增補', '工作已拆解、內部技術領導成熟，而主要限制是短期產能。'], ['選擇外包', '使用者、流程、接口、限制、測試及驗收可在有限現場探索下清楚定義。'], ['選擇 FDE', '高價值問題已知，但數據、流程、採用及干預邊界需要與操作人員共同發現及測試。']]],
      ],
      steps: [['說明營運問題', '選擇人手標籤前，先寫出業務決策、現況基線、受影響人員、限制及失敗後果。'], ['選擇責任單位', '決定服務商負責產能、指定交付物，還是一個營運成果的證據循環。'], ['定義存取及節奏', '約定現場存取、決策權、產品與工程節奏、證據覆核，以及新發現如何改變範圍。'], ['約定轉換安排', '說明何時視為不確定性已解除、誰接收系統與知識，以及 FDE 階段後使用哪種模式。']],
      faqs: [['FDE 是否要求全職駐場？', '不是。它需要貼近營運環境及快速決策循環；現場與遙距比例取決於流程、數據、系統及使用者。'], ['FDE 可否固定價格？', '有限階段可設定固定商務範圍，但不確定性、證據關口、變更規則及停止條件必須清楚；凍結功能清單可能失去 FDE 意義。'], ['FDE 與顧問有甚麼關係？', '顧問工作可在決策或路線圖結束；FDE 會繼續完成該有限問題的實施及生產證據。'], ['合作模式可以改變嗎？', '可以。不確定性下降且責任清楚後，FDE 應轉向穩定產品交付、內部負責或持續營運。']],
      downloadLabel: '下載交付模式清單', downloadUseHeading: '如何選擇責任模式',
    },
    zhHans: {
      title: 'FDE 与人力增补、外包有什么区别｜Onyx Devs Lab', description: '按照责任、不确定性、流程访问、证据和退出方式比较前线部署工程、人力增补与外包交付。',
      eyebrow: 'AI 交付模式决策', h1: '前线部署工程 FDE 是否只是人力增补？',
      lede: '不是。人力增补在客户指导下提供产能；外包按照约定范围交付；FDE 则对一个有限运营问题负责，持续连接现场学习、实施、部署和结果证据。',
      proof: [['责任单位', '产能、范围或运营问题'], ['学习节奏', '指令、里程碑或现场证据'], ['退出条件', '释放人手、验收或结果交接']],
      sections: [
        ['三种模式的区别在于团队负责什么', '职称和是否驻场本身不能决定合作模式。', [['人力增补', '客户负责优先级、架构、协调、验收和结果；服务商提供明确技能和产能。'], ['外包交付', '服务商按照已经定义的范围、里程碑和验收标准交付；变更通过约定流程处理。'], ['前线部署工程', '当需求必须在真实流程中学习，团队对一个有限运营问题的诊断到证据循环负责。']]],
        ['按照不确定性选择', '选择最简单、同时能把责任放在可以做出必要决策位置的模式。', [['选择人力增补', '工作已经拆解、内部技术领导成熟，而主要限制是短期产能。'], ['选择外包', '用户、流程、接口、限制、测试和验收可以在有限现场探索下清楚定义。'], ['选择 FDE', '高价值问题已经明确，但数据、流程、采用和干预边界需要与操作人员共同发现和测试。']]],
      ],
      steps: [['说明运营问题', '选择人员标签前，先写出业务决策、当前基线、受影响人员、限制和失败后果。'], ['选择责任单位', '决定服务商负责产能、指定交付物，还是一个运营结果的证据循环。'], ['定义访问和节奏', '约定现场访问、决策权、产品与工程节奏、证据复核，以及新发现怎样改变范围。'], ['约定转换安排', '说明什么时候认为不确定性已经解除、谁接收系统和知识，以及 FDE 阶段后使用哪种模式。']],
      faqs: [['FDE 是否要求全职驻场？', '不是。它需要贴近运营环境和快速决策循环；现场与远程比例取决于流程、数据、系统和用户。'], ['FDE 可以固定价格吗？', '有限阶段可以设置固定商务范围，但不确定性、证据关口、变更规则和停止条件必须清楚；冻结功能清单可能失去 FDE 的意义。'], ['FDE 与咨询是什么关系？', '咨询工作可以在决策或路线图结束；FDE 会继续完成该有限问题的实施和生产证据。'], ['合作模式可以改变吗？', '可以。不确定性下降且责任清楚后，FDE 应该转向稳定产品交付、内部负责或持续运营。']],
      downloadLabel: '下载交付模式清单', downloadUseHeading: '怎样选择责任模式',
    },
  }),
  guide({
    id: 'ai-agent-permission-audit-checklist', slug: 'ai-agent-permission-audit-checklist', dataPath: '/data/ai-agent-permission-audit-checklist.json', downloadName: 'AI agent permission and audit checklist',
    en: {
      title: 'AI Agent Permission and Audit Checklist | Onyx Devs Lab', description: 'A production checklist for AI-agent authority tiers, least privilege, identity mapping, confirmations, audit records, idempotency, revocation, and incident response.',
      eyebrow: 'Production AI-agent control', h1: 'What permissions and audit records does an enterprise AI agent need?',
      lede: 'Treat an agent as an actor with bounded authority, not as a chatbot with API keys. Every tool action should resolve to a tenant, user or service identity, allowed operation, evidence record, and safe recovery path.',
      proof: [['Authority tiers', 'Read, recommend, draft, approve, execute'], ['Least privilege', 'Identity, tenant, object, and action scope'], ['Action evidence', 'Intent, arguments, result, and recovery']],
      sections: [
        ['Design the authority model before tools', 'A single “agent access” permission is too coarse for production.', [['Separate authority tiers', 'Define read, recommend, draft, approve, and execute independently; promotion to a higher tier requires explicit evidence and ownership.'], ['Map real identities', 'Resolve the requesting user, tenant, service account, source session, and target-system identity; never rely only on a shared model credential.'], ['Constrain every tool', 'Allow specific systems, objects, fields, actions, amounts, time windows, and environments; deny everything else by default.']]],
        ['Make every consequential action reconstructable', 'The audit record should explain what the system attempted and what actually happened.', [['Intent and evidence', 'Record the user request, applicable policy, retrieved evidence, model and prompt version, decision, and human confirmation where required.'], ['Execution result', 'Record tool name, validated arguments, target identity, idempotency key, timestamp, response, resulting state, and verification readback.'], ['Operating controls', 'Provide revoke and kill paths, separation of duties, exception queues, retries, compensating actions, alerting, incident review, and retention rules.']]],
      ],
      steps: [['Inventory tools and actions', 'List every system the agent can reach and classify each operation by data sensitivity, reversibility, financial effect, and user consequence.'], ['Map identities and policy', 'Connect users, tenants, roles, service accounts, approval thresholds, and target-system permissions to enforceable rules.'], ['Test forbidden and failure cases', 'Attempt cross-tenant access, missing confirmation, duplicate execution, stale state, partial failure, timeout, revocation, and recovery.'], ['Release authority gradually', 'Start with read or recommendation, measure exceptions, and promote only the actions whose evidence and recovery controls pass the agreed gates.']],
      faqs: [['Are application logs enough?', 'Usually not. Generic logs may omit the requesting identity, policy decision, validated arguments, confirmation, resulting state, and recovery evidence needed to reconstruct an action.'], ['Can an agent use one service account?', 'Only if downstream authorisation still preserves tenant and user policy, action limits, and attribution. A shared credential must not erase who requested or approved the action.'], ['Which actions require human approval?', 'At minimum, irreversible, external, regulated, high-value, or privilege-changing actions should use explicit confirmation unless a documented risk decision approves a narrower automated envelope.'], ['Is this a complete security standard?', 'No. This provider-authored engineering checklist complements, but does not replace, the organisation’s security architecture, threat model, legal duties, and incident procedures.']],
      downloadLabel: 'Download permission checklist', downloadUseHeading: 'How to audit an agent action path',
    },
    zhHant: {
      title: '企業 AI Agent 權限與審計清單｜Onyx Devs Lab', description: '生產環境 AI Agent 的權限層級、最小權限、身份映射、確認、審計記錄、冪等、撤銷及事故處理清單。',
      eyebrow: '生產 AI Agent 控制', h1: '企業 AI Agent 需要哪些權限及審計記錄？',
      lede: '把 Agent 視為具有限權限的行動者，而非一個持有 API Key 的聊天機械人。每次工具動作都應對應租戶、使用者或服務身份、允許操作、證據記錄及安全恢復路徑。',
      proof: [['權限層級', '讀取、建議、草擬、批准、執行'], ['最小權限', '身份、租戶、對象及動作範圍'], ['動作證據', '意圖、參數、結果及恢復']],
      sections: [
        ['先設計權限模型，再連接工具', '單一「Agent 存取」權限對生產環境過於粗疏。', [['分開權限層級', '獨立定義讀取、建議、草擬、批准及執行；提升至更高層級需要明確證據與負責人。'], ['映射真實身份', '解析請求人、租戶、服務帳戶、來源會話及目標系統身份；不可只依賴共用模型憑證。'], ['限制每項工具', '只允許指定系統、對象、欄位、動作、金額、時間及環境，其餘預設拒絕。']]],
        ['讓每項高影響動作可以重建', '審計記錄應說明系統嘗試甚麼，以及實際發生甚麼。', [['意圖及證據', '記錄使用者要求、適用政策、檢索證據、模型與提示詞版本、決定，以及需要時的人工確認。'], ['執行結果', '記錄工具、已驗證參數、目標身份、冪等鍵、時間、回應、最終狀態及回讀驗證。'], ['營運控制', '提供撤銷與停止路徑、職責分離、例外隊列、重試、補償動作、警報、事故覆核及保留規則。']]],
      ],
      steps: [['盤點工具及動作', '列出 Agent 可接觸的每個系統，按數據敏感度、可逆性、財務影響及使用者後果分類操作。'], ['映射身份及政策', '把使用者、租戶、角色、服務帳戶、批准門檻及目標系統權限連接至可執行規則。'], ['測試禁止及失敗案例', '嘗試跨租戶存取、缺少確認、重複執行、過期狀態、部分失敗、逾時、撤銷及恢復。'], ['逐步釋放權限', '先由讀取或建議開始，量度例外；只有證據與恢復控制通過約定關口的動作才提升權限。']],
      faqs: [['應用程式日誌是否足夠？', '通常不足。一般日誌可能缺少請求身份、政策決定、已驗證參數、確認、最終狀態及恢復證據。'], ['Agent 可以共用一個服務帳戶嗎？', '只有在下游授權仍保留租戶與使用者政策、動作限制及歸因時才可以；共用憑證不可抹去誰提出或批准動作。'], ['哪些動作需要人工批准？', '至少不可逆、對外、受監管、高價值或改變權限的動作應明確確認，除非具文件的風險決定批准更窄的自動執行範圍。'], ['這是完整安全標準嗎？', '不是。這份服務商自撰工程清單只作補充，不能取代機構的安全架構、威脅模型、法律責任及事故程序。']],
      downloadLabel: '下載權限清單', downloadUseHeading: '如何審計 Agent 動作路徑',
    },
    zhHans: {
      title: '企业 AI Agent 权限与审计清单｜Onyx Devs Lab', description: '生产环境 AI Agent 的权限层级、最小权限、身份映射、确认、审计记录、幂等、撤销和事故处理清单。',
      eyebrow: '生产 AI Agent 控制', h1: '企业 AI Agent 需要哪些权限和审计记录？',
      lede: '把 Agent 看成权限受限的行动者，而不是一个持有 API Key 的聊天机器人。每次工具动作都应该对应租户、用户或服务身份、允许操作、证据记录和安全恢复路径。',
      proof: [['权限层级', '读取、建议、草拟、批准、执行'], ['最小权限', '身份、租户、对象和动作范围'], ['动作证据', '意图、参数、结果和恢复']],
      sections: [
        ['先设计权限模型，再连接工具', '单一“Agent 访问”权限对于生产环境过于粗糙。', [['分开权限层级', '独立定义读取、建议、草拟、批准和执行；提升到更高层级需要明确证据和负责人。'], ['映射真实身份', '解析请求人、租户、服务账号、来源会话和目标系统身份；不能只依赖共享模型凭证。'], ['限制每项工具', '只允许指定系统、对象、字段、动作、金额、时间和环境，其余默认拒绝。']]],
        ['让每项高影响动作可以重建', '审计记录应该说明系统尝试了什么，以及实际发生了什么。', [['意图与证据', '记录用户要求、适用政策、检索证据、模型与提示词版本、决定，以及需要时的人工确认。'], ['执行结果', '记录工具、已经验证的参数、目标身份、幂等键、时间、响应、最终状态和回读验证。'], ['运营控制', '提供撤销与停止路径、职责分离、异常队列、重试、补偿动作、告警、事故复核和保留规则。']]],
      ],
      steps: [['盘点工具与动作', '列出 Agent 可以访问的每个系统，按照数据敏感度、可逆性、财务影响和用户后果分类操作。'], ['映射身份与政策', '把用户、租户、角色、服务账号、批准门槛和目标系统权限连接到可以执行的规则。'], ['测试禁止与失败案例', '尝试跨租户访问、缺少确认、重复执行、过期状态、部分失败、超时、撤销和恢复。'], ['逐步释放权限', '先从读取或建议开始，测量异常；只有证据与恢复控制通过约定关口的动作才提升权限。']],
      faqs: [['应用程序日志是否足够？', '通常不够。一般日志可能缺少请求身份、政策决定、已经验证的参数、确认、最终状态和恢复证据。'], ['Agent 可以共用一个服务账号吗？', '只有在下游授权仍保留租户与用户政策、动作限制和归因时才可以；共享凭证不能抹去谁提出或批准动作。'], ['哪些动作需要人工批准？', '至少不可逆、对外、受监管、高价值或改变权限的动作应该明确确认，除非有文档的风险决定批准更窄的自动执行范围。'], ['这是完整安全标准吗？', '不是。这份服务商自编工程清单只作补充，不能取代组织的安全架构、威胁模型、法律责任和事故程序。']],
      downloadLabel: '下载权限清单', downloadUseHeading: '怎样审计 Agent 动作路径',
    },
  }),
];

export const contentSprintGuides = [...contentSprintAGuides, ...contentSprintBGuides];

export function sprintPages() {
  const variants = [
    ['en', 'en'],
    ['zhHant', 'zh-Hant-HK'],
    ['zhHans', 'zh-CN'],
  ];
  return contentSprintGuides.flatMap((item) => variants.map(([key, lang]) => {
    const copy = item.content[key];
    return {
      ...copy,
      path: item.paths[key],
      lang,
      schemaType: 'Article',
      alternate: item.paths[key === 'en' ? 'zhHant' : 'en'],
      downloadUrl: item.dataPath,
      downloadName: item.downloadName,
      downloadLabel: { en: item.content.en.downloadLabel, zh: item.content.zhHant.downloadLabel, cn: item.content.zhHans.downloadLabel },
      downloadUseHeading: { en: item.content.en.downloadUseHeading, zh: item.content.zhHant.downloadUseHeading, cn: item.content.zhHans.downloadUseHeading },
    };
  }));
}

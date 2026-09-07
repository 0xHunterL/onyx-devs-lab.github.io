/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Globe, Menu, X, Compass, Code2, Workflow, Target, Users, Sparkles, MessageCircle, CheckCircle2, ScanSearch, Database, Gauge, ShieldCheck } from 'lucide-react';
import MethodologySection from './components/cases/MethodologySection';
import CaseDetail from './components/cases/CaseDetail';
import { caseAnalysisZh, localizeMethodName } from './data/caseAnalysis';
import { caseNarrativesZh } from './data/caseNarratives';
import { caseOutcomesZh } from './data/caseOutcomes';
import { caseMetricsZh } from './data/caseMetrics';
import MetricPanel from './components/cases/MetricPanel';

const ChatWidget = React.lazy(() => import('./components/chat/ChatWidget'));

// ─── Translations ────────────────────────────────────────────────────────────

const translations = {
  en: {
    nav: { capabilities: 'Ways to Work', methodology: 'FDE Method', work: 'Case Studies', team: 'Team', contact: 'Start a Conversation' },
    hero: {
      badge: 'Senior AI advisory and delivery team',
      title: ['From business problem', 'to working AI system.'],
      subtitle: 'Onyx is a compact, senior team spanning strategy, AI engineering, data, and product delivery. Engage us for a focused advisory decision, a defined custom build, or an FDE transformation from field diagnosis through implementation and validation.',
      modes: ['AI Advisory', 'Custom Development', 'FDE Transformation'],
      cta: 'Book a project assessment',
      secondary: 'Explore engagement models',
    },
    credentials: {
      label: 'Delivery confidence',
      stats: [['Senior', 'core team delivery'], ['10+', 'years in software & data'], ['AI Build + FDE', 'systems and field delivery'], ['10+', 'projects in the portfolio']],
    },
    philosophy: {
      items: [
        { title: 'Strategic Advisory', desc: "We diagnose before we prescribe. Every engagement starts with understanding your business — then designing the right AI approach." },
        { title: 'Senior-Only Team', desc: 'No junior staff, no handoffs. Every conversation is with someone who has shipped production AI systems.' },
        { title: 'Selective Engagements', desc: "We take on a handful of projects at a time. When we commit, you get our undivided expertise." },
      ],
    },
    services: {
      label: 'Ways to work with Onyx',
      title: ['Start where your ', 'problem actually is'],
      intro: 'You do not need to buy a full transformation to work with us. Each mode has a clear decision, delivery, and success boundary — and deepens only when the evidence supports it.',
      bridge: 'Engage one mode independently, or move from advisory to build and into an FDE loop as the problem becomes clearer.',
      deliverablesLabel: 'Deliverables',
      items: [
        {
          kicker: 'Answer what to do',
          title: 'AI Advisory',
          description: 'For teams that see AI opportunity but need to identify the right problem, sequence, and investment boundary.',
          features: ['Business and workflow diagnosis', 'Data and technical feasibility', 'Opportunity prioritization', 'Implementation roadmap'],
          deliverable: 'Decision memo · opportunity map · phased roadmap',
        },
        {
          kicker: 'Turn a defined need into a system',
          title: 'Custom Development',
          description: 'For teams with a clear product or workflow objective that need senior engineers to design, build, integrate, and launch it.',
          features: ['AI product and system design', 'Agents, RAG, data and automation', 'Legacy and API integration', 'Production launch and handover'],
          deliverable: 'Working product · integrated system · operating handover',
        },
        {
          kicker: 'Own the loop from diagnosis to proof',
          title: 'FDE Transformation',
          description: 'For complex operating problems that cannot be specified upfront and require field evidence, implementation, and validation in one team.',
          features: ['Field discovery and baseline', 'Constraint and root-cause diagnosis', 'Workflow and system intervention', 'Pilot validation and iteration'],
          deliverable: 'Diagnosis · intervention · deployed workflow · evidence loop',
        },
      ],
    },
    work: {
      label: 'Case Studies',
      title: ['Engagement ', 'Evidence'],
      viewDetails: 'View Details',
      items: [
        {
          title: 'Turning Every Data Point Into a Retail Decision',
          description: 'A non-invasive data platform layered on top of an existing SaaS ERP, giving an Italian-Chinese supermarket chain AI-driven inventory, staffing, and merchandising decisions.',
          tags: ['Data Platform', 'Retail', 'Machine Learning', 'Market Basket Analysis'],
          highlights: [
            'Non-invasive integration pulls transaction data from the existing ERP and adds missing HR and inventory-loss modules into one unified analytics layer',
            'Machine learning forecasts inventory needs from historical sales and auto-recommends restocking, reducing both stockouts and overstock',
            'Market basket analysis uncovers cross-category opportunities — patterns like "milk paired with diapers" that aren\'t obvious on their own',
            'Real-time tracking of local market trends drives AI-recommended new product selection',
          ],
        },
        {
          title: 'AI-Powered ERP for Accounting Firms',
          description: 'A full-cycle ERP platform replacing fragmented workflows with an AI-native system — from client acquisition to tax filing.',
          tags: ['AI Agent', 'NL2SQL', 'ERP', 'Full-Stack'],
          highlights: [
            'AI-driven telemarketing and customer service for automated client acquisition',
            'Internal agent with command of 20 years of business data via NL2SQL',
            'End-to-end workflow: intake, routing, document processing, compliance filing',
            'Deep integration with tax reporting and business registration systems',
          ],
        },
        {
          title: 'AI-Native Accounting Production Platform',
          description: 'A multi-agent production system for accounting firms. It turns each client portfolio into a continuously updated operating context, then orchestrates invoice collection, bookkeeping, review, tax preparation, compliance checks, exception handling, and human handoff across one auditable workspace.',
          tags: ['Multi-Agent', 'Accounting Automation', 'Human-in-the-Loop', 'Compliance'],
          metrics: ['12 business domains', '52 mapped screens', '9 production workspaces', 'End-to-end audit trail'],
          architecture: [
            { title: 'Client Portfolio', text: 'Persistent company context, historical ledgers, tax attributes, documents, policies, and operating memory.' },
            { title: 'Agent Production Line', text: 'Specialized agents execute collection, recognition, posting, review, filing preparation, and follow-up tasks.' },
            { title: 'Control & Exceptions', text: 'Rules, confidence thresholds, evidence chains, retries, escalation, and explicit human takeover.' },
            { title: 'Official Submission', text: 'Prepared outputs enter a controlled final-submission path, with manual government-platform operation supported where APIs are unavailable.' },
          ],
          highlights: [
            'Reframes accounting from staff operating page by page into agents advancing a client portfolio through a production pipeline',
            'Batch orchestration across clients with queues, priorities, status tracking, retries, and human intervention for exceptions',
            'Separates deterministic accounting rules from AI judgment and retains evidence for review, compliance, and audit',
            'Clean-room product exploration built from observed workflows and feature archaeology, independent of proprietary source code',
          ],
          imageCaptions: [
            'Cross-client production dashboard: agent completion rates, customer progress, live queues, and exception takeover.',
            'Zero-filing client workspace with tax attributes, monthly status, ownership, and batch operations.',
            'Intelligent invoice collection through tax digital accounts, scheduled tasks, credential readiness, and state tracking.',
            'Bookkeeping workbench for voucher generation, posting progress, review states, and batch production.',
            'Tax-filing center that prepares and tracks filing tasks while preserving a controlled final-submission step.',
            'Compliance control tower combining invoice, accounting, tax, and evidence-chain risks.',
            'Corporate-services project workspace for registration, change, cancellation, and deadline-driven delivery.',
            'Contract and billing operations covering service terms, receivables, renewals, and collection status.',
            'Permission and governance settings for roles, data scope, operational authority, and traceability.',
          ],
        },
        {
          title: 'Unified ERP for Mining Operations',
          description: 'An integrated platform for a mining company in Northwest China — unifying fragmented tools and bringing legacy industrial hardware online.',
          tags: ['IoT', 'ERP', 'Siemens PLC', 'AI Agent'],
          highlights: [
            'Unified attendance, weighbridge, fleet, inventory, payroll, and scheduling',
            'Siemens PLC controllers connected to real-time dashboard — furnace temps on mobile',
            'Built-in AI agent for natural language Q&A across all operational data',
            'Dramatically reduced management overhead for industrial operations',
          ],
        },
        {
          title: 'Wall Street Credit Analysis AI',
          description: 'An agentic AI system combining proprietary datasets with real-time financial intelligence for institutional credit risk assessment.',
          tags: ['Agentic AI', 'Finance', 'RAG', 'Real-Time Data'],
          highlights: [
            'Multi-agent architecture for autonomous research, analysis, and report generation',
            'Fuses proprietary data with live open-source financial feeds',
            'Produces institutional-grade credit risk reports',
            'Designed for speed and accuracy in high-stakes portfolio evaluation',
          ],
        },
        {
          title: 'AI Trading Agent Platform',
          description: 'A Web3 trading platform with an embedded AI agent — real-time market data, on-chain execution, and conversational trade commands.',
          tags: ['Web3', 'AI Agent', 'Solana', 'Real-Time'],
          highlights: [
            'AI agent executes trades via natural language commands',
            'Real-time token price charts with TradingView integration',
            'On-chain swap execution on Solana DEX protocols',
            'MCP-powered data pipeline for live market intelligence',
          ],
        },
        {
          title: 'AI Talent Marketplace',
          description: 'A B2B2C platform connecting enterprises with domain experts for AI model evaluation, data curation, and post-training tasks.',
          tags: ['Marketplace', 'Full-Stack', 'Matching', 'AI'],
          highlights: [
            'Three-role system: customers post needs, experts get matched, admins oversee',
            'AI-powered expert matching based on domain tags, trust tiers, and availability',
            'Full negotiation workflow with shortlisting, interviews, and contract management',
            '52 REST APIs covering the complete platform lifecycle',
          ],
        },
        {
          title: 'AI Character Story Engine',
          description: 'An interactive AI storytelling platform where users converse with AI characters across customizable narrative worlds.',
          tags: ['Conversational AI', 'Creative', 'LLM', 'Full-Stack'],
          highlights: [
            'Rich character creation with personality, backstory, and scenario configuration',
            'Multi-turn immersive dialogue with persistent memory',
            'Story traversal mode — jump between narrative branches and timelines',
            'Custom world-building tools for scenario designers',
          ],
        },
        {
          title: 'AI Roleplay Chat Platform',
          description: 'A SaaS-ready AI character chat platform with streaming responses, credit-based monetization, and marketplace.',
          tags: ['SaaS', 'AI Chat', 'Streaming', 'Marketplace'],
          highlights: [
            'Real-time streaming AI responses with multi-model support',
            'Character marketplace with community-created templates',
            'Credit system with usage-based billing and subscription tiers',
            'SillyTavern-compatible prompting for power users',
          ],
        },
        {
          title: 'Telecom Churn Operations Intelligence Platform',
          description: 'A Supervisor-led multi-agent command center for telecom customer retention — continuously monitoring churn risk, diagnosing anomalies, and turning operational data into recommended actions.',
          tags: ['Multi-Agent', 'Telecom', 'NL2SQL', 'Operations Intelligence'],
          highlights: [
            'Supervisor orchestrates specialist agents for KPI monitoring, operational processes, customer segments, reporting, and ad-hoc analysis',
            'A unified command center tracks churn and retention trends, regional health, live anomalies, and agent execution status',
            'Natural-language questions are translated into read-only SQL, with automatic tables, SVG charts, findings, and recommended actions',
            'Anomaly workflows support drill-down, prioritization, status tracking, and coordinated response across operational teams',
          ],
        },
        {
          title: 'Ghosty — AI Video Production System',
          description: 'A cinematic AI production workspace that turns an original story into characters, shots, narration, a rendered video, and a human-reviewed YouTube release.',
          tags: ['AI Video', 'Generative AI', 'Production Automation', 'YouTube'],
          url: 'https://video.mimimiai.com',
          linkLabel: 'Visit Live Product',
          highlights: [
            'One production line connects story adaptation, character design, shot planning, voice, subtitles, rendering, and publishing',
            'Character references and generation records keep visual continuity controllable across a full episode',
            'Durable production states, retryable tasks, and per-shot review replace one-off generation with an operational workflow',
            'YouTube releases default to private upload and remain under explicit human review before publication',
          ],
        },
        {
          title: 'AI-Native Law Firm Operations & Case File Intelligence',
          description: 'A unified workspace for law firm operations and large-scale criminal case file analysis — connecting client pipelines, legal delivery, knowledge management, and citation-grounded AI review.',
          tags: ['Legal AI', 'RAG', 'Workflow', 'Document Intelligence'],
          imageCaptions: [
            'Unified law-firm command center for matters, revenue, risk, deadlines, and AI-generated daily briefs.',
            'Large-dossier workspace with page-level coverage, anomaly counts, and explicit human-review gates.',
            'Client and project lifecycle management, from market lead and engagement approval through delivery and collection.',
            'Live operating dashboard combining sales pipeline, team capacity, priority work, and AI business insights.',
            'Citation-grounded analysis links every conclusion to source pages, quoted evidence, confidence, and review status.',
          ],
          highlights: [
            'One operational workspace connects marketing, sales, legal delivery, administration, client tracking, case milestones, and knowledge management',
            'Large criminal case files are processed through page-level tracking, overlapping chunks, persistent jobs, and explicit coverage checks instead of a single oversized prompt',
            'Hybrid retrieval returns conclusions with source document, quoted text, chunk identity, and confidence signals for lawyer verification',
            'A working development application validates uploads, PDF parsing, access control, audit logs, duplicate detection, and retrieval against public court and procuratorate materials',
          ],
        },
        {
          title: 'Onyx Hire — AI Recruiting Operating System',
          description: 'A recruiter-side AI workspace that synchronizes candidate conversations, builds evidence-grounded profiles, and keeps human review in control of every consequential action.',
          tags: ['AI Agent', 'Recruiting', 'Workflow Automation', 'Human-in-the-Loop'],
          imageCaptions: [
            'A unified candidate queue with live synchronization, processing status, match scores, and human-review priorities.',
            'Full conversation context, state controls, AI-assisted drafting, and recruiter approval coexist in one workspace.',
            'Evidence-grounded candidate profiles combine fit score, confidence, strengths, risks, missing information, and recommended next action.',
            'The recruiting operations dashboard tracks funnel stages, talent quality, connector health, model readiness, and background processing.',
          ],
          highlights: [
            'A local connector reuses the recruiter’s authenticated BOSS session while the product UI remains independent from browser automation and background AI work',
            'Conversation history is continuously backfilled and new context automatically refreshes structured candidate analysis without requiring manual per-candidate processing',
            'Every profile separates facts from inference and exposes evidence, confidence, missing information, risk flags, and the recommended next action',
            'Manual, Copilot, and controlled Autopilot modes preserve human takeover, idempotent sending, and post-send verification; the current build is a working development preview, not a hosted production SaaS',
          ],
        },
      ],
    },
    team: {
      label: 'Who We Are',
      title: ['Meet the ', 'Team'],
      subtitle: 'A compact team of senior engineers and researchers. No layers, no handoffs — you work directly with the people solving your problem.',
      whyLabel: 'Why a small senior team',
      whyTitle: 'The people who diagnose the problem also build the answer.',
      members: [
        { role: 'Senior Engineer & Project Lead', bio: 'Former core contributor to Huawei\'s AI product line, where he helped ship production AI systems at enterprise scale. Since leaving Huawei, has led the end-to-end architecture and delivery of multiple AI-powered enterprise platforms — including ERP systems with embedded intelligent agents, NL2SQL engines, and fully automated business pipelines. Specializes in translating complex business workflows into AI-native solutions, with a track record of taking projects from initial scoping through production deployment.' },
        { role: 'Senior Engineer', bio: 'Served as CTO at a crypto startup, where he built the entire technical organization and led strategy through rapid scaling. Now at the forefront of integrating cutting-edge AI with Web3 and blockchain ecosystems — designing intelligent trading agents, on-chain automation systems, and AI-driven financial tooling. His unique combination of deep infrastructure experience and crypto-native thinking enables novel solutions at the intersection of decentralized finance and artificial intelligence.' },
        { role: 'Senior Engineer', bio: 'Extensive backend engineering experience at Amazon and Coinbase, where he designed and scaled high-availability distributed systems serving millions of users. Subsequently founded an AI-powered marketing startup, gaining firsthand experience in productizing AI for real-world business applications and growth automation. Brings a rare blend of big-tech systems rigor and startup agility — equally comfortable architecting cloud infrastructure at scale and rapidly prototyping AI-driven products from zero to market.' },
        { role: 'Senior Engineer', bio: 'Core software developer at Huawei, where he builds mission-critical enterprise systems with emerging technology. Brings deep expertise in AI Agent architectures, autonomous workflow orchestration, and enterprise data security — a combination that is essential for deploying AI in complex enterprise environments. His experience delivering systems to rigorous security and reliability standards makes him uniquely qualified to advise on enterprise AI adoption.' },
        { role: 'Strategy & Operations Lead', bio: 'Brings a cross-disciplinary background spanning computer science, mathematics, and business, with senior experience across multinational enterprises in Europe and Canada. She has a sharp eye for the gaps and inefficiencies hidden inside systems and processes, and has led data teams in designing digital transformation initiatives — delivering business recommendations and directional strategy that help companies grow revenue and cut costs.' },
      ],
    },
    cta: {
      title: ['Start with a ', 'project assessment'],
      subtitle: 'In one focused conversation, we clarify the objective, constraints, and evidence — then recommend advisory, custom development, FDE, or no project at all.',
      contactLine: 'info@onyxdevslab.com  ·  +1 (416) 565-5366',
    },
    footer: {
      description: 'AI advisory, custom development, and FDE transformation — delivered directly by a senior team.',
      contactTitle: 'Contact',
      rights: 'All rights reserved.',
    },
  },
  zh: {
    nav: { capabilities: '合作方式', methodology: 'FDE 方法', work: '案例', team: '团队', contact: '发起项目讨论' },
    hero: {
      badge: '资深 AI 咨询与交付团队',
      title: ['从业务问题，', '到 AI 系统落地。'],
      subtitle: 'Onyx 是一支规模精简、全员资深的 AI 团队。我们提供 AI 咨询、定制开发与 FDE 转型交付：可以只帮你判断方向，也可以把明确需求做成系统；面对复杂问题，我们会进入现场，从诊断、实施一直负责到验证。',
      modes: ['AI 咨询', '定制开发', 'FDE 咨询与实施'],
      cta: '预约一次项目判断',
      secondary: '按合作方式查看案例',
    },
    credentials: {
      label: '交付可信度',
      stats: [['全员资深', '核心成员直接交付'], ['10+', '年软件与数据实战'], ['AI 定开 + FDE', '系统开发与一线实施'], ['10+', '个项目案例']],
    },
    philosophy: {
      items: [
        { title: '战略先行', desc: '先诊断，再开方。每次合作都从深入理解你的业务开始，再设计最合适的AI方案。' },
        { title: '全员资深', desc: '没有初级员工，没有交接。每一次沟通，都是与交付过生产级AI系统的人直接对话。' },
        { title: '精选合作', desc: '我们同时只承接少量项目。一旦承诺，你将获得我们全部的专注与专业。' },
      ],
    },
    painpoints: {
      label: '先看看这些烦恼',
      title: ['你的这些烦恼，', 'AI现在能解决了'],
      items: [
        { pain: '客服/电销招人难、流失快', solution: 'AI客服电销7×24小时在线', benefit: '省下一大笔人力成本', linkId: 'finance-erp' },
        { pain: '报表靠Excel人肉汇总', solution: '一句话问出所有数据', benefit: '老板随时随地实时看数', linkId: 'jinhui-erp' },
        { pain: '补货凭感觉，压货又缺货', solution: 'AI销量预测自动补货', benefit: '库存两头都省', linkId: 'supermarket-datahub' },
        { pain: '老师傅经验没法传承', solution: '沉淀成业务知识问答库', benefit: '新人一周就能上手', linkId: null },
      ],
    },
    services: {
      label: '与 Onyx 合作',
      title: ['从你真正所在的', '阶段开始'],
      intro: '你不需要为了合作而购买一整套转型。每种方式都有明确的判断目标、交付边界和成功标准；只有证据支持时，合作才继续深入。',
      bridge: '三种方式可以独立委托，也可以逐步深入：从咨询判断开始，进入定制实施；或直接采用 FDE，完成从问题发现到结果验证的完整闭环。',
      deliverablesLabel: '形成交付',
      items: [
        {
          kicker: '回答“应该做什么”',
          title: 'AI 咨询',
          description: '适合已经看到 AI 机会，但需要判断先解决什么、投入边界在哪里、技术与数据是否支持的团队。',
          features: ['业务与流程诊断', '数据及技术可行性评估', 'AI 机会优先级排序', '分阶段实施路线'],
          deliverable: '决策建议 · 机会地图 · 实施路线',
        },
        {
          kicker: '把明确需求做成系统',
          title: '定制开发',
          description: '适合目标和核心流程已经相对明确，需要资深团队完成产品设计、技术实现、系统集成与上线的项目。',
          features: ['AI 产品与系统设计', 'Agent、RAG 与数据工程', '现有系统及 API 集成', '生产上线与团队交接'],
          deliverable: '可运行产品 · 集成系统 · 运营交接',
        },
        {
          kicker: '从诊断一直负责到验证',
          title: 'FDE 咨询与实施',
          description: '适合需求无法预先写清的复杂业务问题，需要同一团队深入现场、定位约束、实施干预并验证真实效果。',
          features: ['现场发现与业务基线', '约束定位与根因分析', '流程重构与系统实施', '试点验证与持续迭代'],
          deliverable: '诊断结论 · 实施干预 · 运行流程 · 验证闭环',
        },
      ],
    },
    work: {
      label: '我们如何交付',
      title: ['合作', '案例'],
      viewDetails: '查看详情',
      items: [
        {
          title: '连锁超市智能数据中台',
          description: '在已有SaaS版ERP之上搭建非侵入式数据中台，用AI驱动库存、人事与选品决策。',
          tags: ['数据中台', '零售', '机器学习', '关联分析'],
          highlights: [
            '过去补货全靠人工经验，常常"旺季缺货、淡季压库"；现在AI根据历史销售自动预测补货，两头都省',
            '机器学习分析历史销售，精准预测库存需求，自动推荐补货策略',
            '关联分析挖掘跨品类销量关系，发现"牛奶与纸尿裤"式隐藏交叉销售机会',
            'AI实时追踪本地市场热点，为新品引进提供数据驱动的决策依据',
          ],
        },
        {
          title: '代理记账AI ERP系统',
          description: '以AI原生系统替代碎片化工作流，覆盖从获客到报税的完整业务链。',
          tags: ['AI Agent', 'NL2SQL', 'ERP', '全栈'],
          highlights: [
            '过去每个客户要专人跟进对账报税；现在AI客服与Agent自动处理大部分流程，同样人力能服务更多客户',
            '内部Agent完全掌握20年业务数据，支持NL2SQL查询',
            '全链路工作流：接单、工单流转、资料整理、合规申报',
            '深度对接工商登记与税务申报系统',
          ],
        },
        {
          title: 'AI原生代理记账自动化平台',
          description: '面向代理记账团队的多智能体生产系统。它把每家客户视为持续演进的业务 Portfolio，由专业 Agent 协同完成取票、记账、审核、报税准备、合规检查、异常处置与人工接管，并让全过程可追踪、可复核。',
          tags: ['多智能体', '代理记账自动化', '人机协同', '合规审计'],
          metrics: ['12 个业务域', '52 个页面映射', '9 类生产工作台', '全流程审计轨迹'],
          architecture: [
            { title: '客户 Portfolio', text: '持续积累企业档案、历史账套、税务属性、原始凭证、政策规则与业务记忆。' },
            { title: 'Agent 生产线', text: '取票、识别、入账、复核、报税准备和客户跟进等专业 Agent 分工协作。' },
            { title: '控制与异常层', text: '规则校验、置信度阈值、证据链、自动重试、升级处理和人工接管形成安全边界。' },
            { title: '官方提交层', text: '系统完成资料与申报结果准备；缺少稳定 API 时，保留受控的政府平台人工提交路径。' },
          ],
          highlights: [
            '把“会计逐页操作软件”重构为“Agent 推动客户 Portfolio 沿生产流水线持续前进”',
            '跨客户批量调度任务，统一管理队列、优先级、执行状态、自动重试和异常人工介入',
            '将确定性会计规则与 AI 判断分层，每一步保留依据、结果和操作轨迹，便于复核与审计',
            '通过业务流程观察和功能考古进行 Clean-room 产品探索，不依赖竞品专有源代码',
          ],
          imageCaptions: [
            '跨客户生产总览：Agent 完成率、客户进度、实时任务队列和异常人工接管。',
            '零申报客户工作台：统一维护税务属性、账期状态、负责人及批量操作。',
            '智能取票：连接税务数字账户，管理预约任务、账密完备度与取票状态。',
            '智能记账工作台：覆盖凭证生成、入账进度、审核状态和批量生产。',
            '报税中心：自动准备并跟踪申报任务，同时保留受控的最终提交环节。',
            '合规控制塔：集中管理发票、财务、税务遵从和证据链风险。',
            '工商项目工作台：管理注册、变更、注销等项目流程与交付时限。',
            '合同与收费运营：覆盖服务周期、应收、续费与回款状态。',
            '权限治理：按角色、数据范围和操作权限控制 Agent 与人员的业务边界。',
          ],
        },
        {
          title: '矿业企业统一ERP平台',
          description: '整合分散的独立系统，将传统工业硬件接入数字化管理。',
          tags: ['IoT', 'ERP', '西门子PLC', 'AI Agent'],
          highlights: [
            '过去查一次跨部门报表要等几天汇总；现在管理层手机上实时看数据，巡检和记录人力明显减少',
            '打通西门子PLC，实时仪表盘——手机查看炉温',
            '内置AI Agent，全业务数据智能问答',
            '大幅降低中小型工业企业管理成本',
          ],
        },
        {
          title: '华尔街债权分析AI系统',
          description: '融合内部数据与实时公开金融信息，评估信贷资产风险并生成机构级报告。',
          tags: ['Agentic AI', '金融', 'RAG', '实时数据'],
          highlights: [
            '过去分析师要花数天手工整理债权尽调报告；现在AI一次性产出机构级报告，交付周期大幅压缩',
            '融合内部数据与实时公开金融信息源',
            '输出符合机构标准的信用风险报告',
            '专为高风险债券组合评估设计',
          ],
        },
        {
          title: 'AI交易Agent平台',
          description: 'Web3交易平台，内置AI Agent——实时行情、链上执行、对话式交易指令。',
          tags: ['Web3', 'AI Agent', 'Solana', '实时数据'],
          highlights: [
            'AI Agent通过自然语言指令执行交易',
            'TradingView集成的实时Token价格图表',
            'Solana DEX协议链上Swap执行',
            'MCP数据管线驱动的实时市场情报',
          ],
        },
        {
          title: 'AI人才市场平台',
          description: 'B2B2C平台，连接企业与领域专家，用于AI模型评估、数据标注和后训练任务。',
          tags: ['平台', '全栈', '智能匹配', 'AI'],
          highlights: [
            '过去找靠谱专家全靠人工筛选和熟人推荐；现在AI按标签和信任等级自动匹配，当天就能对上人',
            'AI智能匹配：基于领域标签、信任等级和可用性',
            '完整谈判流程：短名单筛选、面试安排、合同管理',
            '52个REST API覆盖平台全生命周期',
          ],
        },
        {
          title: 'AI角色故事引擎',
          description: '交互式AI叙事平台，用户与AI角色在可定制的故事世界中展开对话。',
          tags: ['对话AI', '创意', 'LLM', '全栈'],
          highlights: [
            '丰富的角色创建：性格、背景故事、场景配置',
            '多轮沉浸式对话，持久记忆',
            '故事穿越模式——在叙事分支和时间线间跳转',
            '场景设计师专属的世界构建工具',
          ],
        },
        {
          title: 'AI角色聊天平台',
          description: 'SaaS级AI角色聊天平台，流式响应、积分制付费和角色市场。',
          tags: ['SaaS', 'AI聊天', '流式传输', '市场'],
          highlights: [
            '实时流式AI响应，多模型支持',
            '社区创建模板的角色市场',
            '积分系统，按用量计费和订阅套餐',
            '支持SillyTavern格式的高级提示词',
          ],
        },
        {
          title: '通信运营商离网治理智能平台',
          description: '以Supervisor为核心的多Agent运营驾驶舱，持续监控存量用户离网风险，自动诊断异常，并把业务数据转化为可执行的运营建议。',
          tags: ['Multi-Agent', '通信运营', 'NL2SQL', '智能分析'],
          highlights: [
            '过去运营人员每天要跨多个系统拉报表、找异常、催派单；现在由Supervisor统一调度指标、过程、客群、简报和数据分析Agent',
            '一个驾驶舱集中呈现离网与留存趋势、区域健康度、实时异常和各Agent运行状态',
            '业务人员可直接用自然语言提问，系统自动生成只读SQL，并输出数据表、SVG图表、分析结论和运营建议',
            '异常从发现、下钻、优先级判断到处置状态跟踪形成闭环，帮助团队更快定位高风险区域和客群',
          ],
        },
        {
          title: 'Ghosty — AI视频生产系统',
          description: '面向原创叙事创作者的电影化AI生产工作台，把一个故事转化为角色、分镜、旁白、成片和经过人工复核的YouTube发布。',
          tags: ['AI视频', '生成式AI', '生产自动化', 'YouTube'],
          url: 'https://video.mimimiai.com',
          linkLabel: '访问在线产品',
          highlights: [
            '一条生产线贯通故事改编、角色设定、分镜、配音、字幕、渲染与发布',
            '角色参考图和逐镜头生成记录，让整集影片的视觉连续性可控',
            '任务状态、失败重试和逐镜头复核，把一次性生成升级为可运营的生产流程',
            'YouTube默认私密上传，公开发布前保留明确的人工确认节点',
          ],
        },
        {
          title: '律所智能运营与刑事卷宗分析平台',
          description: '面向成长型律师事务所的一体化运营与卷宗智能平台，贯通获客、客户、案件交付、知识沉淀，并用可追溯AI分析超大刑事卷宗。',
          tags: ['法律AI', '智能卷宗', 'RAG', '流程管理'],
          imageCaptions: [
            '律所统一经营驾驶舱：集中呈现案件、回款、风险、期限和 AI 每日简报。',
            '超大卷宗分析工作区：逐页统计解析覆盖率、异常页，并设置明确的人工复核门禁。',
            '客户与项目全生命周期管理：从市场线索、委托审批到案件交付与回款跟踪。',
            '经营工作台同时呈现销售管线、团队负载、今日重点和 AI 经营洞察。',
            '可核验证据链：每条结论绑定卷宗页码、原文引用、置信度与人工复核状态。',
          ],
          highlights: [
            '统一连接市场、销售、律师交付和行政部门，集中管理客户、项目、案件节点、任务、回款与知识库',
            '面对数百万字刑事卷宗，以逐页状态、重叠分片、持久任务和覆盖率门禁替代一次性超长提示词，主动暴露遗漏风险',
            '混合检索结果逐条绑定原始文件、引用片段、分块标识与置信度，方便律师核验而非盲信AI结论',
            '可运行开发版本已使用公开司法材料验证上传、PDF解析、案件权限、审计日志、文件去重和引用检索链路',
          ],
        },
        {
          title: 'Onyx Hire — AI智能招聘操作系统',
          description: '面向招聘方的一体化AI工作台，持续同步候选人对话，生成可追溯画像，并让每个关键招聘动作保留人工控制。',
          tags: ['AI Agent', '智能招聘', '流程自动化', '人工复核'],
          imageCaptions: [
            '统一候选人队列：集中呈现实时同步、处理状态、岗位匹配度和待人工优先级。',
            '完整聊天上下文、招聘阶段、AI协作草稿和人工确认在同一工作区自然共存。',
            '可追溯候选人画像：匹配度、置信度、优势、风险、缺失信息和下一步建议均绑定事实依据。',
            '招聘运营看板：统一查看人才漏斗、人才质量、Connector健康度、模型状态与后台任务进度。',
          ],
          highlights: [
            '本地Connector复用招聘方已有BOSS登录态，产品界面与浏览器自动化、后台AI任务相互独立，不抢夺日常操作焦点',
            '系统持续补齐候选人的真实聊天记录；上下文变化后自动刷新结构化画像，无需HR逐人手动触发分析',
            '候选人画像明确分离事实与推断，展示证据、置信度、缺失信息、风险标志和推荐下一步',
            '人工、Copilot和受控Autopilot三种模式支持随时接管、幂等发送和发送后回读；当前版本是可运行开发预览，而非已托管生产SaaS',
          ],
        },
      ],
    },
    team: {
      label: '关于我们',
      title: ['认识', '团队'],
      subtitle: '规模精简、全员资深。零层级、零中间人——你直接与解决问题的人对话。',
      whyLabel: '为什么选择小型资深团队',
      whyTitle: '诊断问题的人，也亲手把答案做出来。',
      members: [
        { role: '高级工程师 & 项目负责人', bio: '前华为AI产品线核心贡献者。离开华为后主导多个AI企业平台从架构到上线的完整交付，包括内嵌智能Agent的ERP系统、NL2SQL引擎。擅长把复杂业务流程转化为能落地生产的AI方案。' },
        { role: '高级工程师', bio: '曾任Crypto公司CTO，从零搭建技术团队并主导快速扩张期的技术战略。现专注AI与Web3结合，设计智能交易Agent、链上自动化系统与AI驱动的金融工具。' },
        { role: '高级工程师', bio: '曾在亚马逊、美国头部加密交易所设计并扩展服务数百万用户的高可用分布式系统。此后创立AI营销公司，有AI产品从0到1落地并用于真实业务增长的一线经验。' },
        { role: '高级工程师', bio: '华为核心软件开发者，长期参与企业级关键系统建设。深耕AI Agent架构、自主工作流编排与企业数据安全，熟悉高安全、高可靠要求下的AI落地。' },
        { role: '战略运营负责人', bio: '拥有计算机、数学与商业的复合背景，曾在欧洲、加拿大等多家跨国企业任职，资深且敬业。擅长洞察系统与流程中的痛点与漏洞，曾带领数据团队设计数字化转型方案，提供商业建议与方向性战略，助力企业开源节流、降本增效。' },
      ],
    },
    cta: {
      title: ['先做一次', '项目判断'],
      subtitle: '用 30 分钟梳理业务目标、现有条件和主要约束。我们会判断它更适合 AI 咨询、定制开发还是 FDE；如果当前不值得做，也会直接说明。',
      wechatNote: '扫码预约 30 分钟项目判断',
      wechatIdLabel: '微信号',
      wechatId: 'm453301909',
      secondaryLabel: '也可以邮件或电话联系我们',
      contactLine: 'info@onyxdevslab.com  ·  +86 18923743756',
    },
    footer: {
      description: 'AI 咨询、定制开发与 FDE 转型交付，由资深团队直接负责。',
      contactTitle: '联系方式',
      rights: '保留所有权利。',
      wechatLabel: '微信',
      wechatId: 'm453301909',
      addressLines: ['九龙长沙湾丽盈街8号'],
      serviceNote: '远程交付为主，可视项目安排驻场',
    },
  },
  it: {
    nav: { capabilities: 'Come collaborare', methodology: 'Metodo FDE', work: 'Progetti', team: 'Team', contact: 'Parliamo del progetto' },
    hero: {
      badge: 'Team senior di consulenza e delivery AI',
      title: ['Dal problema aziendale', 'a un sistema AI operativo.'],
      subtitle: 'Onyx è un team compatto e senior tra strategia, ingegneria AI, dati e prodotto. Possiamo offrire una decisione consulenziale, sviluppare un sistema definito o guidare una trasformazione FDE dalla diagnosi sul campo alla verifica.',
      modes: ['Consulenza AI', 'Sviluppo su misura', 'Trasformazione FDE'],
      cta: 'Prenota una valutazione',
      secondary: 'Scopri le modalità',
    },
    credentials: {
      label: 'Affidabilità della delivery',
      stats: [['Senior', 'delivery del team core'], ['10+', 'anni in software e dati'], ['AI Build + FDE', 'sistemi e delivery sul campo'], ['10+', 'progetti nel portfolio']],
    },
    philosophy: {
      items: [
        { title: 'Strategia Prima', desc: "Prima diagnostichiamo, poi prescriviamo. Ogni engagement inizia dalla comprensione del tuo business — poi progettiamo l'approccio AI giusto." },
        { title: 'Solo Senior', desc: 'Nessuno staff junior, nessun passaggio di consegne. Ogni conversazione è con chi ha già rilasciato sistemi AI in produzione.' },
        { title: 'Engagement Selettivi', desc: "Accettiamo pochi progetti alla volta. Quando ci impegniamo, ricevi tutta la nostra competenza." },
      ],
    },
    services: {
      label: 'Come lavorare con Onyx',
      title: ['Partiamo dal punto in cui si trova ', 'davvero il problema'],
      intro: 'Ogni modalità ha un obiettivo decisionale, un perimetro di delivery e un criterio di successo chiari. Il lavoro si approfondisce solo quando le evidenze lo giustificano.',
      bridge: 'Le tre modalità possono essere indipendenti oppure evolvere dalla consulenza allo sviluppo e, quando serve, a un ciclo FDE completo.',
      deliverablesLabel: 'Risultati consegnati',
      items: [
        {
          kicker: 'Definire cosa fare',
          title: 'Consulenza AI',
          description: 'Per chi vede opportunità nell’AI ma deve scegliere il problema giusto, le priorità e il perimetro di investimento.',
          features: ['Diagnosi di business e processi', 'Fattibilità dati e tecnologia', 'Priorità delle opportunità', 'Roadmap di implementazione'],
          deliverable: 'Decisione · mappa opportunità · roadmap',
        },
        {
          kicker: 'Trasformare un obiettivo in sistema',
          title: 'Sviluppo su misura',
          description: 'Per obiettivi già definiti che richiedono progettazione, sviluppo, integrazione e lancio guidati da ingegneri senior.',
          features: ['Prodotti e sistemi AI', 'Agent, RAG, dati e automazione', 'Integrazione legacy e API', 'Lancio e passaggio operativo'],
          deliverable: 'Prodotto operativo · sistema integrato · handover',
        },
        {
          kicker: 'Dalla diagnosi alla prova',
          title: 'Trasformazione FDE',
          description: 'Per problemi operativi complessi che richiedono evidenze sul campo, implementazione e validazione affidate allo stesso team.',
          features: ['Discovery e baseline', 'Diagnosi di vincoli e cause', 'Intervento su workflow e sistemi', 'Pilota, verifica e iterazione'],
          deliverable: 'Diagnosi · intervento · workflow operativo · evidenze',
        },
      ],
    },
    work: {
      label: 'Casi Studio',
      title: ['Evidenze di ', 'Delivery'],
      viewDetails: 'Dettagli',
      items: [
        {
          title: 'Trasformare Ogni Dato in una Decisione Retail',
          description: "Una piattaforma dati non invasiva sopra un ERP SaaS esistente, per dare a una catena di supermercati cinese in Italia decisioni di inventario, personale e merchandising guidate dall'AI.",
          tags: ['Piattaforma Dati', 'Retail', 'Machine Learning', 'Analisi delle Correlazioni'],
          highlights: [
            "Integrazione non invasiva che estrae i dati delle transazioni dall'ERP esistente e aggiunge i moduli mancanti di HR e perdite di inventario in un unico livello di analisi",
            'Il machine learning prevede il fabbisogno di inventario dalle vendite storiche e raccomanda automaticamente il riassortimento, riducendo rotture di stock e sovrascorte',
            "L'analisi delle correlazioni scopre opportunità cross-categoria — pattern come \"latte abbinato ai pannolini\" non ovvi da soli",
            'Il monitoraggio in tempo reale delle tendenze di mercato locali guida raccomandazioni AI per la selezione di nuovi prodotti',
          ],
        },
        {
          title: 'ERP con AI per Studi Contabili',
          description: "Piattaforma ERP AI-nativa — dall'acquisizione clienti alla dichiarazione fiscale.",
          tags: ['AI Agent', 'NL2SQL', 'ERP', 'Full-Stack'],
          highlights: [
            'Telemarketing e servizio clienti AI per acquisizione automatica',
            'Agente interno con controllo su 20 anni di dati aziendali tramite NL2SQL',
            'Flusso end-to-end: ordini, routing, documenti, adempimenti fiscali',
            'Integrazione profonda con sistemi fiscali e di registrazione',
          ],
        },
        {
          title: 'Piattaforma AI-Native per la Produzione Contabile',
          description: 'Un sistema di produzione multi-agente per studi contabili. Ogni cliente diventa un portfolio operativo in continua evoluzione; agenti specializzati coordinano acquisizione fatture, contabilità, revisione, preparazione fiscale, conformità, gestione eccezioni e passaggio controllato all’operatore.',
          tags: ['Multi-Agent', 'Automazione Contabile', 'Human-in-the-Loop', 'Compliance'],
          metrics: ['12 domini operativi', '52 schermate mappate', '9 workspace produttivi', 'Audit trail end-to-end'],
          architecture: [
            { title: 'Portfolio Cliente', text: 'Contesto persistente con anagrafiche, storico contabile, attributi fiscali, documenti, regole e memoria operativa.' },
            { title: 'Linea di Produzione Agentica', text: 'Agenti specializzati eseguono raccolta, riconoscimento, registrazione, revisione e preparazione degli adempimenti.' },
            { title: 'Controlli ed Eccezioni', text: 'Regole, soglie di confidenza, evidenze, retry, escalation e presa in carico umana esplicita.' },
            { title: 'Invio Ufficiale', text: 'Output pronti per un percorso di invio controllato, anche manuale quando le piattaforme pubbliche non offrono API stabili.' },
          ],
          highlights: [
            'Trasforma il lavoro da navigazione manuale pagina per pagina a una pipeline in cui gli agenti avanzano il portfolio del cliente',
            'Orchestrazione batch multi-cliente con code, priorità, stati, retry e intervento umano sulle eccezioni',
            'Separa regole contabili deterministiche dal giudizio AI e conserva le evidenze per revisione e audit',
            'Esplorazione clean-room basata sui workflow osservati e sull’archeologia funzionale, senza codice proprietario',
          ],
          imageCaptions: [
            'Dashboard produttiva multi-cliente con avanzamento agenti, code live ed eccezioni.',
            'Workspace per clienti a dichiarazione zero con attributi fiscali e operazioni batch.',
            'Raccolta intelligente delle fatture, pianificazione e controllo credenziali.',
            'Workbench contabile per registrazioni, avanzamento e revisione automatizzata.',
            'Centro fiscale per preparazione e tracciamento degli adempimenti.',
            'Control tower di conformità per rischi fiscali, contabili e catena delle evidenze.',
            'Workspace per pratiche societarie, scadenze e consegne.',
            'Operazioni contrattuali, fatturazione, rinnovi e incassi.',
            'Governance di ruoli, dati, autorizzazioni operative e tracciabilità.',
          ],
        },
        {
          title: 'ERP Unificato per Operazioni Minerarie',
          description: "Piattaforma integrata che unifica strumenti e porta online l'hardware industriale legacy.",
          tags: ['IoT', 'ERP', 'Siemens PLC', 'AI Agent'],
          highlights: [
            'Presenze, pesa, flotta, inventario, buste paga unificati',
            'Controller Siemens PLC connessi a dashboard real-time — temperature da mobile',
            'Agente AI per Q&A su tutti i dati operativi',
            'Riduzione drastica dei costi di gestione industriale',
          ],
        },
        {
          title: 'AI per Analisi Creditizia — Wall Street',
          description: 'Sistema AI agentico con dataset proprietari e intelligence finanziaria in tempo reale.',
          tags: ['Agentic AI', 'Finanza', 'RAG', 'Dati Real-Time'],
          highlights: [
            'Architettura multi-agente per ricerca, analisi e report autonomi',
            'Fusione dati proprietari con feed finanziari live',
            'Report creditizi conformi agli standard istituzionali',
            'Velocità e precisione per portafogli ad alto rischio',
          ],
        },
        {
          title: 'Piattaforma AI Trading Agent',
          description: 'Piattaforma trading Web3 con agente AI integrato — dati di mercato in tempo reale ed esecuzione on-chain.',
          tags: ['Web3', 'AI Agent', 'Solana', 'Real-Time'],
          highlights: [
            "L'agente AI esegue operazioni tramite comandi in linguaggio naturale",
            'Grafici prezzi token in tempo reale con integrazione TradingView',
            'Esecuzione swap on-chain su protocolli DEX Solana',
            'Pipeline dati MCP per intelligence di mercato live',
          ],
        },
        {
          title: 'Marketplace Talenti AI',
          description: 'Piattaforma B2B2C che collega aziende con esperti di dominio per valutazione modelli AI e post-training.',
          tags: ['Marketplace', 'Full-Stack', 'Matching', 'AI'],
          highlights: [
            'Sistema a tre ruoli: clienti, esperti e amministratori',
            'Matching AI basato su tag di dominio, livelli di fiducia e disponibilità',
            'Flusso completo di negoziazione con shortlist, colloqui e gestione contratti',
            "52 API REST per l'intero ciclo di vita della piattaforma",
          ],
        },
        {
          title: 'Motore di Storie AI',
          description: 'Piattaforma narrativa interattiva dove gli utenti dialogano con personaggi AI in mondi personalizzabili.',
          tags: ['AI Conversazionale', 'Creativo', 'LLM', 'Full-Stack'],
          highlights: [
            'Creazione ricca di personaggi con personalità, backstory e configurazione scenari',
            'Dialogo immersivo multi-turno con memoria persistente',
            'Modalità traversal — salto tra rami narrativi e linee temporali',
            'Strumenti di world-building per designer di scenari',
          ],
        },
        {
          title: 'Piattaforma Chat AI Roleplay',
          description: 'Piattaforma chat AI SaaS-ready con risposte in streaming, monetizzazione a crediti e marketplace.',
          tags: ['SaaS', 'AI Chat', 'Streaming', 'Marketplace'],
          highlights: [
            'Risposte AI in streaming real-time con supporto multi-modello',
            'Marketplace personaggi con template creati dalla community',
            'Sistema crediti con fatturazione a consumo e livelli di abbonamento',
            'Prompting compatibile SillyTavern per utenti avanzati',
          ],
        },
        {
          title: 'Piattaforma Intelligente per la Retention Telco',
          description: 'Una cabina di regia multi-agente guidata da un Supervisor per monitorare il rischio di abbandono, diagnosticare anomalie e trasformare i dati operativi in azioni consigliate.',
          tags: ['Multi-Agent', 'Telecom', 'NL2SQL', 'Operations Intelligence'],
          highlights: [
            'Il Supervisor orchestra agenti specializzati per KPI, processi operativi, segmenti cliente, reportistica e analisi ad hoc',
            'Una dashboard unificata mostra trend di churn e retention, salute regionale, anomalie live e stato degli agenti',
            'Le domande in linguaggio naturale diventano query SQL in sola lettura, tabelle, grafici SVG, conclusioni e azioni consigliate',
            'Il workflow delle anomalie copre drill-down, priorità, avanzamento e risposta coordinata dei team operativi',
          ],
        },
        {
          title: 'Ghosty — Sistema di Produzione Video AI',
          description: 'Un workspace cinematografico che trasforma una storia originale in personaggi, scene, narrazione, video renderizzato e pubblicazione YouTube con revisione umana.',
          tags: ['Video AI', 'AI Generativa', 'Automazione', 'YouTube'],
          url: 'https://video.mimimiai.com',
          linkLabel: 'Visita il prodotto',
          highlights: [
            'Un unico flusso collega adattamento, character design, storyboard, voce, sottotitoli, rendering e pubblicazione',
            'Riferimenti dei personaggi e log per scena mantengono controllabile la continuità visiva',
            'Stati persistenti, retry dei task e revisione puntuale trasformano la generazione in un processo operativo',
            'I video YouTube vengono caricati come privati e richiedono una conferma umana prima della pubblicazione',
          ],
        },
        {
          title: 'Piattaforma AI per Studi Legali e Analisi dei Fascicoli',
          description: 'Un workspace unificato per le operazioni dello studio legale e l’analisi di grandi fascicoli penali, con workflow, knowledge base e risposte AI verificabili.',
          tags: ['Legal AI', 'RAG', 'Workflow', 'Document Intelligence'],
          imageCaptions: [
            'Cockpit operativo unificato per pratiche, incassi, rischi, scadenze e briefing AI.',
            'Analisi di grandi fascicoli con copertura pagina per pagina, anomalie e revisione umana esplicita.',
            'Gestione del ciclo cliente-progetto, dal lead e mandato fino alla consegna e all’incasso.',
            'Dashboard operativa con pipeline commerciale, carico del team, priorità e insight AI.',
            'Ogni conclusione è collegata a pagina, citazione, confidenza e stato di verifica.',
          ],
          highlights: [
            'Marketing, vendite, delivery legale, amministrazione, clienti e scadenze dei casi sono riuniti in un unico workspace operativo',
            'I fascicoli di grandi dimensioni vengono elaborati con tracciamento pagina per pagina, chunk sovrapposti, job persistenti e controlli di copertura',
            'La ricerca ibrida collega ogni conclusione al documento originale, alla citazione e all’identità del chunk per la verifica dell’avvocato',
            'L’applicazione di sviluppo valida upload, parsing PDF, controllo accessi, audit, deduplicazione e retrieval su materiali giudiziari pubblici',
          ],
        },
        {
          title: 'Onyx Hire — Sistema Operativo AI per il Recruiting',
          description: 'Un workspace AI per recruiter che sincronizza le conversazioni, crea profili verificabili e mantiene la revisione umana su ogni decisione importante.',
          tags: ['AI Agent', 'Recruiting', 'Workflow', 'Human-in-the-Loop'],
          imageCaptions: [
            'Coda candidati unificata con sincronizzazione, stato, punteggio di aderenza e priorità di revisione.',
            'Conversazioni complete, stato del processo, bozze AI e approvazione del recruiter nello stesso workspace.',
            'Profilo verificabile con punteggio, confidenza, punti di forza, rischi, informazioni mancanti e prossima azione.',
            'Dashboard operativa con funnel, qualità dei candidati, stato del connector, modello AI e processi in background.',
          ],
          highlights: [
            'Un connector locale riutilizza la sessione BOSS autenticata mentre interfaccia, automazione browser e processi AI restano separati',
            'Lo storico delle chat viene completato in background e ogni nuovo contesto aggiorna automaticamente l’analisi strutturata',
            'Ogni profilo distingue fatti e inferenze, mostrando prove, confidenza, dati mancanti, rischi e prossima azione consigliata',
            'Le modalità Manuale, Copilot e Autopilot controllato mantengono presa in carico umana, invio idempotente e verifica; la build attuale è una preview funzionante, non un SaaS di produzione',
          ],
        },
      ],
    },
    team: {
      label: 'Chi Siamo',
      title: ['Il Nostro ', 'Team'],
      subtitle: 'Un team compatto di ingegneri e ricercatori senior. Zero livelli, zero intermediari — lavori direttamente con chi risolve il problema.',
      whyLabel: 'Perché un piccolo team senior',
      whyTitle: 'Chi diagnostica il problema costruisce anche la risposta.',
      members: [
        { role: 'Ingegnere Senior & Project Lead', bio: 'Ex contributore chiave della linea prodotti AI di Huawei, dove ha partecipato al rilascio di sistemi AI in produzione su scala enterprise. Dopo Huawei, ha guidato l\'architettura e la delivery end-to-end di molteplici piattaforme enterprise AI-powered — tra cui sistemi ERP con agenti intelligenti integrati, motori NL2SQL e pipeline di automazione completa. Specializzato nel tradurre workflow aziendali complessi in soluzioni AI-native, con un track record dalla definizione dei requisiti al deployment in produzione.' },
        { role: 'Ingegnere Senior', bio: 'Ha servito come CTO in una startup crypto, costruendo l\'intera organizzazione tecnica e guidando la strategia durante la crescita rapida. Oggi in prima linea nell\'integrazione di AI avanzata con gli ecosistemi Web3 e blockchain — progettando agenti di trading intelligenti, sistemi di automazione on-chain e strumenti finanziari AI-driven. La sua combinazione unica di esperienza infrastrutturale profonda e pensiero crypto-nativo abilita soluzioni innovative all\'intersezione tra finanza decentralizzata e intelligenza artificiale.' },
        { role: 'Ingegnere Senior', bio: 'Vasta esperienza di backend engineering in Amazon e Coinbase, dove ha progettato e scalato sistemi distribuiti ad alta disponibilità per milioni di utenti. Ha successivamente fondato una startup di AI marketing, acquisendo esperienza diretta nella produttizzazione dell\'AI per applicazioni business reali e growth automation. Porta una rara combinazione di rigore sistemistico big-tech e agilità startup — altrettanto a suo agio nell\'architettare infrastrutture cloud su scala e nel prototipare rapidamente prodotti AI-driven da zero a mercato.' },
        { role: 'Ingegnere Senior', bio: 'Sviluppatore software core presso Huawei, dove realizza sistemi enterprise mission-critical con tecnologie emergenti. Ha una profonda competenza in architetture AI Agent, orchestrazione autonoma dei workflow e sicurezza dei dati enterprise — una combinazione essenziale per il deployment dell\'AI in ambienti aziendali complessi. La sua esperienza nella realizzazione di sistemi secondo rigorosi standard di sicurezza e affidabilità lo rende particolarmente qualificato per la consulenza sull\'adozione dell\'AI enterprise.' },
        { role: 'Responsabile Strategia & Operations', bio: 'Vanta un background interdisciplinare tra informatica, matematica e business, con una solida esperienza in aziende multinazionali in Europa e Canada. Ha un occhio attento alle lacune e alle inefficienze nascoste in sistemi e processi e ha guidato team di dati nella progettazione di iniziative di trasformazione digitale, offrendo raccomandazioni commerciali e strategie direzionali che aiutano le aziende a incrementare i ricavi e ridurre i costi.' },
      ],
    },
    cta: {
      title: ['Iniziamo con una ', 'valutazione del progetto'],
      subtitle: 'In un confronto mirato chiariremo obiettivo, vincoli ed evidenze, quindi consiglieremo consulenza, sviluppo su misura, FDE oppure nessun progetto.',
      contactLine: 'info@onyxdevslab.com  ·  +1 (416) 565-5366',
    },
    footer: {
      description: 'Consulenza AI, sviluppo su misura e trasformazione FDE, con delivery diretta da parte di un team senior.',
      contactTitle: 'Contatti',
      rights: 'Tutti i diritti riservati.',
    },
  },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const teamMeta = [
  { name: 'Mi', avatar: '/avatars/mi.png', isFounder: false, credentials: ['UofT', 'Huawei'] },
  { name: 'Lucas', avatar: '/avatars/lucas.png', isFounder: false, credentials: ['UofT'] },
  { name: 'Hunter', avatar: '/avatars/hunter.png', isFounder: false, credentials: ['UWaterloo', 'Amazon', 'Coinbase'] },
  { name: 'Jake', avatar: '/avatars/jake.png', isFounder: false, credentials: ['UofT', 'Huawei'] },
  { name: 'Olivia', avatar: '/avatars/olivia.png', isFounder: false, credentials: ['UBC', 'Siemens'] },
];

// Chinese labels for credential/org chips — domestic audiences don't recognize the Latin abbreviations.
const credLabelsZh = {
  'UofT': '多伦多大学',
  'UWaterloo': '滑铁卢大学',
  'UBC': '英属哥伦比亚大学',
  'University of British Columbia': '英属哥伦比亚大学',
  'Huawei': '华为',
  'Amazon': '亚马逊',
  'Coinbase': '美国加密交易所',
  'Siemens': '西门子',
};
const localizeCred = (cred, lang) => (lang === 'zh' ? credLabelsZh[cred] || cred : cred);

const projectsData = [
  { id: 'onyx-hire', images: ['/projects/onyx-hire/overview.png', '/projects/onyx-hire/conversation.png', '/projects/onyx-hire/profile.png', '/projects/onyx-hire/dashboard.png'] },
  { id: 'lexflow', images: ['/projects/lexflow/dashboard-v2.jpg?v=fd941dc', '/projects/lexflow/dossier.jpg', '/projects/lexflow/client-projects.jpg?v=law-gallery-2', '/projects/lexflow/operations-dashboard.jpg?v=law-gallery-2', '/projects/lexflow/evidence-citations.jpg?v=law-gallery-2'] },
  { id: 'ghosty', images: ['/projects/ghosty/home.png', '/projects/ghosty/studio.png'] },
  { id: 'supermarket-datahub', images: ['/projects/supermarket-datahub/dashboard.png', '/projects/supermarket-datahub/sales-analytics.png'] },
  { id: 'finance-erp', images: ['/projects/finance-erp/dashboard.png', '/projects/finance-erp/agent.png', '/projects/finance-erp/billing.png'] },
  { id: 'finance-ai-automation', images: ['/projects/finance-erp-ai/01-production-dashboard.png', '/projects/finance-erp-ai/02-zero-filing-clients.png', '/projects/finance-erp-ai/03-intelligent-invoice-collection.png', '/projects/finance-erp-ai/04-ledger-workbench.png', '/projects/finance-erp-ai/05-tax-filing-center.png', '/projects/finance-erp-ai/06-compliance-control.png', '/projects/finance-erp-ai/07-corporate-services.png', '/projects/finance-erp-ai/08-contract-billing.png', '/projects/finance-erp-ai/09-permission-settings.png'] },
  { id: 'jinhui-erp', images: ['/projects/jinhui-erp/cover.png', '/projects/jinhui-erp/miniapp.png'] },
  { id: 'squirrel', images: ['/projects/squirrel/report.png', '/projects/squirrel/agent-chart.jpg'] },
  { id: 'aiusd', images: ['/projects/aiusd/cover.png', '/projects/aiusd/chat.png'] },
  { id: 'maybole', images: ['/projects/maybole/entrance.png', '/projects/maybole/customer.png', '/projects/maybole/expert.png'] },
  { id: 'manbo', images: ['/projects/manbo/main.png', '/projects/manbo/config.png'] },
  { id: 'mimitavern', images: ['/projects/mimitavern/chat.png'] },
  { id: 'meng', images: ['/projects/meng/meng_main_page_top.png', '/projects/meng/main_page_down.png', '/projects/meng/monitor_and_shit.png', '/projects/meng/chatbot.png'] },
];

// Keep the complete portfolio visible in every language; zhOrder controls zh-specific sort order.
const workMeta = [
  { id: 'supermarket-datahub', visibleIn: ['en', 'zh', 'it'] },
  { id: 'finance-erp', visibleIn: ['en', 'zh', 'it'] },
  { id: 'finance-ai-automation', visibleIn: ['en', 'zh', 'it'] },
  { id: 'jinhui-erp', visibleIn: ['en', 'zh', 'it'] },
  { id: 'squirrel', visibleIn: ['en', 'zh', 'it'] },
  { id: 'aiusd', visibleIn: ['en', 'zh', 'it'] },
  { id: 'maybole', visibleIn: ['en', 'zh', 'it'] },
  { id: 'manbo', visibleIn: ['en', 'zh', 'it'] },
  { id: 'mimitavern', visibleIn: ['en', 'zh', 'it'] },
  { id: 'meng', visibleIn: ['en', 'zh', 'it'] },
  { id: 'ghosty', visibleIn: ['en', 'zh', 'it'] },
  { id: 'lexflow', visibleIn: ['en', 'zh', 'it'] },
  { id: 'onyx-hire', visibleIn: ['en', 'zh', 'it'] },
];

// Portfolio taxonomy: FDE engagements require field discovery, real operating constraints,
// and a delivered or piloted workflow loop. Product engineering is ranked separately.
const fdeWorkOrder = ['lexflow', 'onyx-hire', 'supermarket-datahub', 'jinhui-erp', 'finance-erp', 'finance-ai-automation', 'meng', 'squirrel'];
const productWorkOrder = ['ghosty', 'aiusd', 'maybole', 'mimitavern', 'manbo'];
const portfolioOrder = [...fdeWorkOrder, ...productWorkOrder];
const fdeProjectIds = new Set(fdeWorkOrder);

const getVisibleWorkItems = (lang, items) => {
  const merged = items.map((item, index) => ({ ...item, ...workMeta[index] }));
  const filtered = merged.filter((item) => item.visibleIn.includes(lang));
  filtered.sort((a, b) => portfolioOrder.indexOf(a.id) - portfolioOrder.indexOf(b.id));
  return filtered;
};

const serviceIcons = [Compass, Code2, Workflow];
const philosophyIcons = [Target, Users, Sparkles];
const langLabels = { en: 'EN', zh: '中文', it: 'IT' };
const portfolioCopy = {
  en: {
    wallLabel: 'Engagement evidence',
    wallTitle: 'See what each way of working produces',
    wallSubtitle: 'Cases are presented by engagement type, so you can distinguish field-led transformation from defined product engineering.',
    fdeTitle: 'FDE engagements',
    fdeKicker: 'Consulting + implementation',
    fdeBadge: 'FDE delivery',
    fdeSubtitle: 'Field-led transformation work, ranked by professional depth, delivery completeness, and fit with the FDE model.',
    productTitle: 'Custom development & AI products',
    productKicker: 'Defined-scope engineering',
    productBadge: 'Product engineering',
    productSubtitle: 'Defined products and platforms assessed on engineering depth, working flows, and delivery completeness — without forcing an FDE narrative.',
  },
  zh: {
    wallLabel: '合作结果',
    wallTitle: '不同合作方式，产生不同类型的价值',
    wallSubtitle: '案例按照主要合作方式展示，让你清楚区分深入业务现场的 FDE，与目标明确的定制开发和产品工程。',
    fdeTitle: 'FDE 交付案例',
    fdeKicker: '咨询诊断 + 一线实施',
    fdeBadge: 'FDE 交付',
    fdeSubtitle: '按照专业深度、交付完整度和 FDE 契合度排序：从业务现场出发，并已完成系统或试点闭环。',
    productTitle: '定制开发与 AI 产品',
    productKicker: '目标明确的产品工程',
    productBadge: '产品工程',
    productSubtitle: '目标明确的产品与平台，按照工程深度、可运行流程和交付完整度展示，不强行套用 FDE 叙事。',
  },
  it: {
    wallLabel: 'Evidenze di delivery',
    wallTitle: 'Il valore prodotto da ogni modalità di collaborazione',
    wallSubtitle: 'I casi distinguono la trasformazione guidata sul campo dallo sviluppo di prodotti con obiettivi già definiti.',
    fdeTitle: 'Progetti FDE',
    fdeKicker: 'Consulenza + implementazione',
    fdeBadge: 'Delivery FDE',
    fdeSubtitle: 'Trasformazioni sul campo ordinate per profondità professionale, completezza e aderenza al modello FDE.',
    productTitle: 'Sviluppo su misura e prodotti AI',
    productKicker: 'Ingegneria a perimetro definito',
    productBadge: 'Product engineering',
    productSubtitle: 'Prodotti e piattaforme valutati per profondità tecnica, workflow operativi e completezza, senza forzare una narrativa FDE.',
  },
};

const experienceCopy = {
  en: {
    fdeDefinition: 'FDE = advisory, field implementation, and measurable validation by the same senior team.',
    proofLabel: 'A typical FDE loop',
    proofStatus: 'Pilot running',
    proofTitle: 'Turn an operating signal into a verified intervention',
    proofSteps: [
      ['Signal', 'Critical work is slow, fragmented, or dependent on individual experience'],
      ['Diagnosis', 'Reconstruct the workflow with interviews, system traces, and baseline data'],
      ['Intervention', 'Change the process and deploy the smallest system that can alter the outcome'],
      ['Validation', 'Compare adoption, quality, cycle time, and exceptions inside a defined window'],
    ],
    proofFooter: 'The people who diagnose the problem also build and validate the answer.',
    primaryCta: 'Let AI assess my project',
    secondaryCta: 'See delivery evidence',
    fitLabel: 'Find your starting point',
    fitTitle: 'Which situation sounds most like yours?',
    fitIntro: 'You do not need to choose a service first. Start with the constraint you can already see; we will determine whether the right next step is advisory, a defined build, or FDE.',
    fitAction: 'See the relevant route',
    fitItems: [
      ['The opportunity is visible, but the first AI investment is unclear', 'AI advisory', 'We map value, feasibility, risk, and sequencing before any build.', 'capabilities'],
      ['The need is clear and a senior team is needed to ship it', 'Custom development', 'We design, integrate, launch, and hand over a working system.', 'capabilities'],
      ['An AI demo exists, but it cannot enter the real workflow', 'FDE transformation', 'We find the operational constraint and own the pilot loop through validation.', 'lexflow'],
      ['Data and systems exist, but management still cannot act on them', 'Data + FDE', 'We unify definitions, decision signals, and accountable operating actions.', 'supermarket-datahub'],
      ['The process depends on manual coordination and expert memory', 'Workflow + agents', 'We make state, evidence, exceptions, and human takeover explicit.', 'onyx-hire'],
    ],
    featuredNote: 'A focused selection is shown first. Expand the full portfolio when you need broader technical evidence.',
    showAll: 'View all case studies',
    showLess: 'Return to featured cases',
    privacy: 'AI assistant privacy',
  },
  zh: {
    fdeDefinition: 'FDE = 由同一支资深团队完成咨询诊断、一线实施和可衡量的效果验证。',
    proofLabel: '一条典型的 FDE 闭环',
    proofStatus: '试点运行中',
    proofTitle: '把现场信号，变成经过验证的业务干预',
    proofSteps: [
      ['现场信号', '关键工作缓慢、割裂，或过度依赖个人经验'],
      ['问题诊断', '结合访谈、系统轨迹与基线数据，还原真实工作流'],
      ['实施干预', '调整流程，并部署足以改变结果的最小系统'],
      ['效果验证', '在明确窗口内对照采纳率、质量、周期与异常'],
    ],
    proofFooter: '诊断问题的人，也亲手实施并验证答案。',
    primaryCta: '让 AI 帮我判断项目',
    secondaryCta: '查看交付证据',
    fitLabel: '先找到你的起点',
    fitTitle: '哪一种情况，更接近你现在的问题？',
    fitIntro: '不必先判断该买哪种服务。先从已经看见的约束出发，我们再判断下一步应该是咨询、定制开发，还是 FDE。',
    fitAction: '查看对应路线',
    fitItems: [
      ['看到了 AI 机会，但不知道第一笔投入该放在哪里', 'AI 咨询', '先梳理价值、可行性、风险和实施顺序，再决定是否开发。', 'capabilities'],
      ['目标已经明确，需要资深团队直接把系统做出来', '定制开发', '从产品与架构设计，到集成、上线和运营交接。', 'capabilities'],
      ['已经做过 AI Demo，但始终进不了真实工作流', 'FDE 转型', '定位现场约束，实施试点，并负责到验证闭环。', 'lexflow'],
      ['系统和数据不少，但管理者仍然无法据此行动', '数据 + FDE', '统一数据口径、决策信号和可追责的运营动作。', 'supermarket-datahub'],
      ['流程依赖人工协调，老师傅经验无法规模化', '流程 + Agent', '把状态、证据、异常和人工接管变成可运行系统。', 'onyx-hire'],
    ],
    featuredNote: '首页优先展示最能代表交付深度的案例；需要更广泛的技术证据时，可展开完整项目库。',
    showAll: '展开全部案例',
    showLess: '收起至旗舰案例',
    privacy: 'AI 助手隐私说明',
  },
  it: {
    fdeDefinition: 'FDE = consulenza, implementazione sul campo e validazione misurabile affidate allo stesso team senior.',
    proofLabel: 'Un tipico ciclo FDE',
    proofStatus: 'Pilota attivo',
    proofTitle: 'Da un segnale operativo a un intervento verificato',
    proofSteps: [
      ['Segnale', 'Il lavoro critico è lento, frammentato o dipende dall’esperienza individuale'],
      ['Diagnosi', 'Ricostruiamo il workflow con interviste, tracce di sistema e dati di baseline'],
      ['Intervento', 'Cambiamo il processo e rilasciamo il sistema minimo capace di incidere sul risultato'],
      ['Validazione', 'Confrontiamo adozione, qualità, tempi ed eccezioni in una finestra definita'],
    ],
    proofFooter: 'Chi diagnostica il problema costruisce e valida anche la risposta.',
    primaryCta: 'Valuta il progetto con l’AI',
    secondaryCta: 'Vedi le evidenze di delivery',
    fitLabel: 'Trova il punto di partenza',
    fitTitle: 'Quale situazione descrive meglio la tua?',
    fitIntro: 'Non devi scegliere prima un servizio. Partiamo dal vincolo visibile e definiamo se serve consulenza, sviluppo o FDE.',
    fitAction: 'Vedi il percorso',
    fitItems: [
      ['L’opportunità AI è chiara, ma non il primo investimento', 'Consulenza AI', 'Mappiamo valore, fattibilità, rischio e sequenza prima di sviluppare.', 'capabilities'],
      ['L’obiettivo è definito e serve un team senior per consegnarlo', 'Sviluppo su misura', 'Progettiamo, integriamo, rilasciamo e trasferiamo un sistema operativo.', 'capabilities'],
      ['Esiste una demo AI, ma non entra nel workflow reale', 'Trasformazione FDE', 'Troviamo il vincolo operativo e gestiamo il pilota fino alla validazione.', 'lexflow'],
      ['Dati e sistemi esistono, ma non guidano le decisioni', 'Dati + FDE', 'Uniamo definizioni, segnali decisionali e azioni operative.', 'supermarket-datahub'],
      ['Il processo dipende da coordinamento manuale e memoria esperta', 'Workflow + agenti', 'Rendiamo espliciti stato, evidenze, eccezioni e presa in carico umana.', 'onyx-hire'],
    ],
    featuredNote: 'Mostriamo prima una selezione mirata; il portfolio completo resta disponibile per evidenze tecniche più ampie.',
    showAll: 'Vedi tutti i casi',
    showLess: 'Torna ai casi principali',
    privacy: 'Privacy assistente AI',
  },
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

const useScrollReveal = (deps = []) => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    // Re-observe on every dep change (e.g. language switch mounts new sections),
    // otherwise reveal elements added after mount stay stuck at opacity 0.
    const elements = ref.current?.querySelectorAll('.section-reveal:not(.visible)');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
};

// ─── Small Components ────────────────────────────────────────────────────────

const LanguageSwitcher = ({ lang, setLang }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Select language"
        className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-sm text-gray-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
      >
        <Globe size={14} />
        {langLabels[lang]}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div role="menu" className="absolute right-0 mt-2 py-1 rounded-xl border border-white/10 bg-[#0a0e1a]/95 backdrop-blur-xl shadow-xl z-50 min-w-[100px]">
            {Object.entries(langLabels).map(([code, label]) => (
              <button
                key={code}
                role="menuitem"
                onClick={() => { setLang(code); setOpen(false); }}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  lang === code ? 'text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const MobileMenu = ({ isOpen, onClose, t, lang, setLang }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 right-0 top-0 flex w-[86vw] max-w-80 flex-col border-l border-white/10 bg-[#0a0e1a] p-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <button onClick={onClose} aria-label="关闭菜单" className="mb-6 flex h-11 w-11 self-end items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <nav className="flex flex-col gap-2">
          <a href="#capabilities" onClick={onClose} className="flex min-h-12 items-center rounded-xl px-4 text-gray-300 transition-colors hover:bg-white/5 hover:text-white">{t.nav.capabilities}</a>
          <a href="#work" onClick={onClose} className="flex min-h-12 items-center rounded-xl px-4 text-gray-300 transition-colors hover:bg-white/5 hover:text-white">{t.nav.work}</a>
          <a href="#methodology" onClick={onClose} className="flex min-h-12 items-center rounded-xl px-4 text-gray-300 transition-colors hover:bg-white/5 hover:text-white">{t.nav.methodology}</a>
          <a href="#team" onClick={onClose} className="flex min-h-12 items-center rounded-xl px-4 text-gray-300 transition-colors hover:bg-white/5 hover:text-white">{t.nav.team}</a>
          <a href="#contact" onClick={onClose}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-5 text-sm transition-all hover:from-blue-400 hover:to-purple-400">
            {t.nav.contact}
          </a>
        </nav>
        <div className="mt-auto">
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>
      </div>
    </div>
  );
};

// ─── Card Components ─────────────────────────────────────────────────────────

const EvidenceLoop = ({ copy }) => {
  const icons = [ScanSearch, Database, Workflow, Gauge];
  return (
    <aside className="hero-proof relative overflow-hidden rounded-[1.75rem] border border-cyan-200/15 bg-[#0b1220]/80 p-5 shadow-2xl shadow-blue-950/40 backdrop-blur-xl md:p-6" aria-label={copy.proofLabel}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">{copy.proofLabel}</span>
        <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/15 bg-lime-300/[0.07] px-3 py-1.5 text-[10px] font-medium text-lime-100/80">
          <span className="h-1.5 w-1.5 rounded-full bg-lime-300 shadow-[0_0_8px_rgba(190,242,100,.65)]" />
          {copy.proofStatus}
        </span>
      </div>
      <h2 className="max-w-md text-xl font-semibold leading-snug text-white md:text-2xl">{copy.proofTitle}</h2>
      <ol className="mt-6 space-y-2">
        {copy.proofSteps.map(([label, text], index) => {
          const Icon = icons[index];
          return (
            <li key={label} className="group relative grid grid-cols-[2.5rem_1fr] gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition-colors hover:border-cyan-300/15 hover:bg-white/[0.045]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-cyan-200/80">
                <Icon size={17} />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                  <span className="font-mono text-[10px] text-white/30">0{index + 1}</span>
                  {label}
                </div>
                <p className="mt-1 text-xs leading-5 text-gray-400">{text}</p>
              </div>
              {index < copy.proofSteps.length - 1 && <span className="absolute -bottom-2.5 left-[2rem] z-10 h-3 w-px bg-gradient-to-b from-cyan-300/50 to-transparent" />}
            </li>
          );
        })}
      </ol>
      <p className="mt-5 flex items-start gap-2.5 border-t border-white/[0.07] pt-4 text-xs leading-5 text-cyan-50/65">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-cyan-300/70" />
        {copy.proofFooter}
      </p>
    </aside>
  );
};

const ProblemFitSection = ({ copy, onSelect }) => (
  <section className="relative py-16 md:py-24" aria-labelledby="problem-fit-title">
    <div className="container mx-auto px-6">
      <div className="section-reveal grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/75">{copy.fitLabel}</span>
          <h2 id="problem-fit-title" className="mt-4 text-3xl font-bold leading-tight md:text-5xl">{copy.fitTitle}</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400 md:text-base md:leading-8">{copy.fitIntro}</p>
        </div>
        <div className="mobile-card-rail flex gap-4 sm:block sm:divide-y sm:divide-white/[0.08] sm:border-y sm:border-white/[0.08]">
          {copy.fitItems.map(([problem, route, detail, target], index) => {
            const content = (
              <>
                <span className="font-mono text-[10px] text-white/25">0{index + 1}</span>
                <span>
                  <strong className="block text-base font-medium leading-7 text-white md:text-lg">{problem}</strong>
                  <span className="mt-2 block text-sm leading-6 text-gray-500">{detail}</span>
                </span>
                <span className="col-start-2 flex items-center gap-2 text-left text-xs font-medium text-cyan-200/75 md:col-start-auto md:justify-end md:text-right md:text-sm">
                  {route}<ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-1" />
                </span>
              </>
            );
            const classes = "group grid min-h-[260px] w-[82vw] max-w-[320px] shrink-0 snap-start grid-cols-[1.5rem_1fr] content-start gap-x-3 gap-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-left transition-colors hover:bg-white/[0.04] sm:min-h-0 sm:w-full sm:max-w-none sm:rounded-none sm:border-0 sm:bg-transparent sm:py-5 md:grid-cols-[2rem_1fr_10rem] md:items-center md:px-3";
            return target === 'capabilities'
              ? <a key={problem} href="#capabilities" className={classes}>{content}</a>
              : <button key={problem} type="button" onClick={() => onSelect(target)} className={classes}>{content}</button>;
          })}
        </div>
      </div>
    </div>
  </section>
);

const ServiceCard = ({ icon: Icon, kicker, title, description, features, deliverable, deliverablesLabel }) => (
  <article className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/[0.04] md:p-8">
    <div className="mb-7 flex items-center justify-between">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/20 to-purple-500/15 transition-colors group-hover:from-blue-500/30 group-hover:to-purple-500/25">
        <Icon size={22} className="text-blue-300" />
      </div>
    </div>
    <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-cyan-300/70">{kicker}</p>
    <h3 className="mb-4 text-2xl font-bold">{title}</h3>
    <p className="mb-7 min-h-[4.75rem] text-sm leading-7 text-gray-400">{description}</p>
    <ul className="mb-7 space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2.5 text-sm text-gray-400">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-blue-400/70" />
          {feature}
        </li>
      ))}
    </ul>
    <div className="mt-auto border-t border-white/10 pt-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">{deliverablesLabel}</p>
      <p className="mt-2 text-xs leading-6 text-white/65">{deliverable}</p>
    </div>
  </article>
);

const TeamMemberCard = ({ name, role, avatar, bio, credentials }) => (
  <div className="glass rounded-2xl p-6 md:p-8 transition-all duration-300 group hover:-translate-y-1 h-full">
    <div className="flex gap-5 items-start">
      <div className="flex flex-col items-center shrink-0">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-40 blur transition-opacity duration-300" />
          <img src={avatar} alt={name} loading="lazy" decoding="async" className="relative w-20 h-20 rounded-full border-2 border-white/10 group-hover:border-white/20 transition-colors object-cover" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold">{name}</h3>
        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium mt-1 mb-2 bg-purple-500/15 text-purple-300 border border-purple-500/20">
          {role}
        </span>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {credentials.map((cred) => (
            <span key={cred} className="px-2.5 py-0.5 rounded text-[11px] font-medium text-amber-300/80 bg-amber-500/10 border border-amber-500/10">
              {cred}
            </span>
          ))}
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">{bio}</p>
      </div>
    </div>
  </div>
);

// ─── Portfolio Wall ─────────────────────────────────────────────────────────

const ProjectWall = ({ items, projectsData, copy, viewLabel, onSelect, analysisById, outcomesById, lang }) => {
  const [showAll, setShowAll] = useState(false);
  const groups = [
    { key: 'fde', title: copy.fdeTitle, subtitle: copy.fdeSubtitle, ids: fdeWorkOrder },
    { key: 'product', title: copy.productTitle, subtitle: copy.productSubtitle, ids: productWorkOrder },
  ];

  return (
    <div className="section-reveal">
      <div className="mb-14 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">{copy.wallLabel}</span>
        <h3 className="mt-3 text-2xl font-bold md:text-3xl">{copy.wallTitle}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-400 md:text-base">{copy.wallSubtitle}</p>
      </div>

      <div className="space-y-24">
        {groups.map((group) => {
          const allGroupItems = group.ids.map((id) => items.find((item) => item.id === id)).filter(Boolean);
          const groupItems = showAll ? allGroupItems : allGroupItems.slice(0, group.key === 'fde' ? 4 : 3);
          return (
            <section key={group.key} aria-labelledby={`${group.key}-portfolio-title`}>
              <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
                <div>
                  <div className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${group.key === 'fde' ? 'text-cyan-300/70' : 'text-purple-300/70'}`}>
                    {group.key === 'fde' ? copy.fdeKicker : copy.productKicker}
                  </div>
                  <h4 id={`${group.key}-portfolio-title`} className="text-2xl font-semibold text-white md:text-3xl">{group.title}</h4>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-gray-500">{group.subtitle}</p>
              </div>

              <div className="portfolio-wall mobile-card-rail flex gap-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
                {groupItems.map((study) => {
                  const image = projectsData.find((project) => project.id === study.id)?.images[0];
                  const isFde = group.key === 'fde';
                  const analysis = isFde ? analysisById[study.id] : null;
                  const outcome = isFde ? outcomesById[study.id] : null;
                  return (
                    <button
                      key={study.id}
                      type="button"
                      onClick={() => onSelect(study.id)}
                      className="portfolio-tile group relative min-h-[360px] w-[84vw] max-w-[328px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-[#101625] text-left sm:min-h-[420px] sm:w-auto sm:max-w-none"
                      aria-label={`${viewLabel}: ${study.title}`}
                    >
                      {image && <img src={image} alt="" loading="lazy" decoding="async" className="portfolio-tile-image absolute inset-0 h-full w-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.045]" />}
                      <div className="portfolio-tile-wash absolute inset-0" />
                      <div className="portfolio-tile-gradient absolute inset-0" />
                      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-white/10 bg-[#090d16]/75 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-cyan-100/80 backdrop-blur-xl">{study.tags[0]}</span>
                          <span className={`rounded-full bg-[#090d16]/75 px-2.5 py-1.5 text-[10px] font-medium backdrop-blur-xl ${isFde ? 'border border-cyan-300/20 text-cyan-200/80' : 'border border-purple-300/20 text-purple-200/80'}`}>{isFde ? copy.fdeBadge : copy.productBadge}</span>
                        </div>
                        <span className="flex h-9 w-9 translate-y-1 items-center justify-center rounded-full border border-white/10 bg-[#090d16]/70 text-white/70 opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowRight size={15} /></span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                        <h5 className="text-lg font-semibold leading-snug text-white md:text-xl">{study.title}</h5>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-400 transition-colors duration-300 group-hover:text-gray-200">{lang === 'zh' && outcome ? outcome.summary : study.description}</p>
                        {isFde && analysis ? (
                          <div className="mt-4 border-t border-white/10 pt-4">
                            {lang === 'zh' && outcome && <div className="mb-3 text-[10px] font-medium text-lime-200/75">● {outcome.scope} · 已完成并跑通</div>}
                            <div className="mb-3 flex flex-wrap gap-1.5">
                              {analysis.methods.slice(0, 2).map((method) => <span key={method.name} className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-2.5 py-1 text-[10px] text-cyan-100/75">{localizeMethodName(method.name, lang)}</span>)}
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-white/45"><span>{lang === 'zh' ? '问题 → 证据 → 方法 → 验证' : 'Evidence-led case route'}</span><span className="text-cyan-200/70">{viewLabel}</span></div>
                          </div>
                        ) : (
                          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                            <div className="flex flex-wrap gap-1.5">{study.tags.slice(1, 3).map((tag) => <span key={tag} className="rounded-full border border-purple-300/15 bg-purple-300/[0.06] px-2.5 py-1 text-[10px] text-purple-100/75">{tag}</span>)}</div>
                            <span className="text-[10px] text-purple-200/70">{viewLabel}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <div className="mt-14 flex flex-col items-center border-t border-white/[0.08] pt-8 text-center">
        <p className="max-w-2xl text-sm leading-7 text-gray-500">{copy.featuredNote}</p>
        <button type="button" onClick={() => setShowAll((value) => !value)} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-white/80 transition-colors hover:border-cyan-300/25 hover:bg-white/[0.07] hover:text-white" aria-expanded={showAll}>
          {showAll ? copy.showLess : copy.showAll}
          <ChevronDown size={16} className={`transition-transform ${showAll ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

// ─── Project Modal ──────────────────────────────────────────────────────────

const ProjectModal = ({ project, images, metrics, lang, onClose }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    if (e.key === 'ArrowRight') setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [onClose, images.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-case-title"
        className="relative flex h-[calc(100dvh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] animate-modal-in md:h-auto md:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button onClick={onClose} aria-label="Close project" className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-gray-300 backdrop-blur-sm transition-colors hover:text-white md:right-4 md:top-4">
          <X size={16} />
        </button>

        {/* Image carousel */}
        <div className="relative h-[24vh] min-h-44 max-h-56 w-full shrink-0 bg-black/50 md:h-[42vh] md:max-h-[360px]">
          <img
            src={images[currentImage]}
            alt={`Screenshot ${currentImage + 1}`}
            className="w-full h-full object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:left-3"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                aria-label="Next image"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:right-3"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    aria-label={`View image ${i + 1}`}
                    className="group flex h-11 w-11 items-center justify-center"
                  >
                    <span className={`h-2 rounded-full transition-all ${i === currentImage ? 'w-6 bg-white' : 'w-2 bg-white/40 group-hover:bg-white/60'}`} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {project.imageCaptions?.[currentImage] && (
          <div className="flex shrink-0 items-start gap-3 border-b border-white/10 bg-[#0a0e16] px-6 py-3 text-sm text-gray-300 md:px-8">
            <span className="shrink-0 font-mono text-xs text-cyan-300/70">
              {String(currentImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
            <p className="leading-relaxed">{project.imageCaptions[currentImage]}</p>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:p-8">
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/10">
                {tag}
              </span>
            ))}
          </div>
          <h2 id="product-case-title" className="mb-3 text-2xl font-bold leading-tight">{project.title}</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">{project.description}</p>
          {lang === 'zh' && metrics && (
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">关键数据与试点基准</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              <MetricPanel metrics={metrics} compact />
            </div>
          )}
          {project.metrics && (
            <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4">
              {project.metrics.map((metric, index) => (
                <div key={index} className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-3 text-sm font-medium text-cyan-100">
                  {metric}
                </div>
              ))}
            </div>
          )}
          {project.architecture && (
            <div className="mb-7 grid gap-3 md:grid-cols-2">
              {project.architecture.map((layer, index) => (
                <div key={index} className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                  <div className="mb-1 text-sm font-semibold text-purple-200">{String(index + 1).padStart(2, '0')} · {layer.title}</div>
                  <p className="text-sm leading-relaxed text-gray-400">{layer.text}</p>
                </div>
              ))}
            </div>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-lg bg-lime-300/10 text-lime-200 border border-lime-300/30 hover:bg-lime-300/20 transition-colors text-sm font-medium"
            >
              {project.linkLabel}
              <ArrowRight size={15} />
            </a>
          )}
          <ul className="space-y-3">
            {project.highlights.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-400 text-sm">
                <ChevronRight size={14} className="text-purple-400/60 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLangState] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get('lang');
    if (['en', 'zh', 'it'].includes(requested)) return requested;
    const isHK = window.location.hostname === 'hk.onyxdevslab.com';
    return isHK ? 'zh' : 'en';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get('case');
    return requested && projectsData.some((project) => project.id === requested) ? requested : null;
  });
  const pageRef = useScrollReveal([lang]);
  const t = translations[lang];
  const experience = experienceCopy[lang];
  const visibleWorkItems = getVisibleWorkItems(lang, t.work.items);
  const selectedProject = visibleWorkItems.find((item) => item.id === activeProject);
  const ActiveCaseView = activeProject && fdeProjectIds.has(activeProject) ? CaseDetail : ProjectModal;

  const setLang = useCallback((nextLang) => {
    setLangState(nextLang);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', nextLang);
    window.history.replaceState(window.history.state, '', url);
  }, []);

  const openProject = useCallback((projectId) => {
    const url = new URL(window.location.href);
    url.searchParams.set('case', projectId);
    url.searchParams.set('lang', lang);
    window.history.pushState({ caseOverlay: true, projectId }, '', url);
    setActiveProject(projectId);
  }, [lang]);

  const closeProject = useCallback(() => {
    if (window.history.state?.caseOverlay) {
      window.history.back();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete('case');
    window.history.replaceState(window.history.state, '', url);
    setActiveProject(null);
  }, []);

  const openChat = useCallback(() => {
    window.dispatchEvent(new CustomEvent('onyx:open-chat'));
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    document.title = selectedProject
      ? `${selectedProject.title} — Onyx Case Study`
      : 'Onyx Devs Lab — AI Advisory, Custom Development & FDE';
  }, [lang, selectedProject]);

  useEffect(() => {
    const syncProjectFromUrl = () => {
      const requested = new URLSearchParams(window.location.search).get('case');
      setActiveProject(requested && projectsData.some((project) => project.id === requested) ? requested : null);
    };
    window.addEventListener('popstate', syncProjectFromUrl);
    return () => window.removeEventListener('popstate', syncProjectFromUrl);
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden">

      <a href="#main-content" className="fixed left-4 top-3 z-[200] -translate-y-20 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-xl transition-transform focus:translate-y-0">
        {lang === 'zh' ? '跳至主要内容' : lang === 'it' ? 'Vai al contenuto' : 'Skip to main content'}
      </a>

      {/* ── Navigation ── */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0a0e1a]'
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Onyx</span>
            <span className="text-white/90"> Devs Lab</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#capabilities" className="nav-link text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{t.nav.capabilities}</a>
            <a href="#work" className="nav-link text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{t.nav.work}</a>
            <a href="#methodology" className="nav-link text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{t.nav.methodology}</a>
            <a href="#team" className="nav-link text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{t.nav.team}</a>
            <a href="#contact"
              className="px-5 py-2 rounded-full text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all hover:shadow-lg hover:shadow-blue-500/25">
              {t.nav.contact}
            </a>
            <LanguageSwitcher lang={lang} setLang={setLang} />
          </div>
          <button aria-label="打开菜单" className="flex h-11 w-11 items-center justify-center rounded-full text-gray-300 hover:bg-white/5 hover:text-white md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} t={t} lang={lang} setLang={setLang} />

      <main id="main-content">

      {/* ── Hero ── */}
      <header className="relative flex min-h-[780px] items-center overflow-hidden px-6 pb-14 pt-28 md:min-h-[820px] md:pb-20 md:pt-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20 animate-gradient" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] animate-float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />

        <div className="container relative z-10 mx-auto">
          <div className="grid items-center gap-12 xl:grid-cols-[1.08fr_.92fr] xl:gap-16">
            <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300 text-sm mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse-glow" />
              {t.hero.badge}
            </div>
            <h1 className="mb-7 text-[2.35rem] font-bold leading-[1.08] tracking-tight min-[390px]:text-[2.75rem] md:text-6xl lg:text-7xl xl:text-8xl">
              {t.hero.title[0]}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                {t.hero.title[1]}
              </span>
            </h1>
            <p className="mb-5 max-w-2xl text-base leading-8 text-gray-300 md:text-lg md:leading-9">
              {t.hero.subtitle}
            </p>
            <p className="mb-6 flex max-w-2xl items-start gap-2.5 text-sm leading-6 text-cyan-100/65">
              <ShieldCheck size={16} className="mt-1 shrink-0 text-cyan-300/70" />
              {experience.fdeDefinition}
            </p>
            <div className="mb-9 flex flex-wrap gap-2.5">
              {t.hero.modes.map((mode, index) => (
                <span key={mode} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-white/75 backdrop-blur-sm md:text-sm">
                  <span className={`h-1.5 w-1.5 rounded-full ${index === 2 ? 'bg-cyan-300' : index === 1 ? 'bg-purple-300' : 'bg-blue-300'}`} />
                  {mode}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button type="button" onClick={openChat}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 text-base font-medium">
                {experience.primaryCta}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#work"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 transition-all duration-300 text-base text-gray-300 hover:text-white backdrop-blur-sm">
                {experience.secondaryCta}
              </a>
            </div>
            </div>
            <div className="hidden xl:block">
              <EvidenceLoop copy={experience} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0e1a] to-transparent" />
      </header>

      {/* ── Delivery confidence ── */}
      <section className="relative -mt-2 pb-16 md:pb-20" aria-label={t.credentials.label}>
        <div className="container mx-auto px-6">
          <div className="section-reveal overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
            <div className="border-b border-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 md:px-7">
              {t.credentials.label}
            </div>
            <dl className="grid grid-cols-2 lg:grid-cols-4">
              {t.credentials.stats.map(([value, label], index) => (
                <div key={label} className={`px-5 py-6 md:px-7 ${index % 2 === 0 ? 'border-r border-white/10' : ''} ${index < 2 ? 'border-b border-white/10 lg:border-b-0' : ''} lg:border-r lg:last:border-r-0`}>
                  <dt className="font-mono text-2xl font-semibold text-white md:text-3xl">{value}</dt>
                  <dd className="mt-1 text-xs leading-5 text-gray-500 md:text-sm">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <ProblemFitSection copy={experience} onSelect={openProject} />

      {/* ── AI Capabilities ── */}
      <section id="capabilities" className="relative scroll-mt-20 py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="section-reveal mb-12 max-w-3xl md:mb-16">
            <span className="text-blue-400 text-sm font-medium tracking-[0.2em] uppercase">{t.services.label}</span>
            <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              {t.services.title[0]}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {t.services.title[1]}
              </span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400">{t.services.intro}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.services.items.map((service, index) => (
              <div key={index} className="section-reveal" style={{ transitionDelay: `${index * 150}ms` }}>
                <ServiceCard icon={serviceIcons[index]} deliverablesLabel={t.services.deliverablesLabel} {...service} />
              </div>
            ))}
          </div>
          <div className="section-reveal mt-8 flex items-start gap-3 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.035] px-5 py-4 text-sm leading-7 text-cyan-50/70 md:px-6">
            <ArrowRight size={17} className="mt-1 shrink-0 text-cyan-300/70" />
            <p>{t.services.bridge}</p>
          </div>
        </div>
      </section>

      {/* ── Case Studies ── */}
      <section id="work" className="relative scroll-mt-20 py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="section-reveal mb-12 text-center md:mb-16">
            <span className="text-purple-400 text-sm font-medium tracking-[0.2em] uppercase">{t.work.label}</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              {t.work.title[0]}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {t.work.title[1]}
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full" />
          </div>
          <ProjectWall
            items={visibleWorkItems}
            projectsData={projectsData}
            copy={{ ...portfolioCopy[lang], ...experience }}
            viewLabel={t.work.viewDetails}
            onSelect={openProject}
            analysisById={caseAnalysisZh}
            outcomesById={caseOutcomesZh}
            lang={lang}
          />
        </div>
      </section>

      {/* ── FDE Methodology ── */}
      <MethodologySection lang={lang} />

      {/* ── Shareable Case Detail ── */}
      {activeProject !== null && selectedProject && (
        <ActiveCaseView
          project={selectedProject}
          images={projectsData.find((p) => p.id === activeProject)?.images || []}
          analysis={caseAnalysisZh[activeProject]}
          narrative={caseNarrativesZh[activeProject]}
          outcome={caseOutcomesZh[activeProject]}
          metrics={caseMetricsZh[activeProject]}
          lang={lang}
          onClose={closeProject}
        />
      )}

      {/* ── Team ── */}
      <section id="team" className="relative scroll-mt-20 py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="section-reveal text-center mb-20">
            <span className="text-cyan-400 text-sm font-medium tracking-[0.2em] uppercase">{t.team.label}</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              {t.team.title[0]}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {t.team.title[1]}
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">{t.team.subtitle}</p>
          </div>
          <div className="section-reveal mb-12 grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-white/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/70">{t.team.whyLabel}</span>
              <h3 className="mt-4 text-2xl font-semibold leading-snug text-white md:text-3xl">{t.team.whyTitle}</h3>
            </div>
            <div className="grid md:grid-cols-3">
              {t.philosophy.items.map((item, index) => {
                const Icon = philosophyIcons[index];
                return (
                  <div key={item.title} className="border-b border-white/10 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 md:p-7">
                    <Icon size={19} className="mb-5 text-blue-300" />
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="mt-2 text-xs leading-6 text-gray-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {teamMeta.map((member, index) => (
              <div key={index} className="section-reveal" style={{ transitionDelay: `${index * 150}ms` }}>
                <TeamMemberCard
                  name={member.name}
                  avatar={member.avatar}
                  credentials={member.credentials.map((c) => localizeCred(c, lang))}
                  role={t.team.members[index].role}
                  bio={t.team.members[index].bio}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="relative scroll-mt-20 py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.03] to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] animate-float-delayed" />
        <div className="container mx-auto px-6 relative">
          <div className="section-reveal mx-auto max-w-3xl rounded-3xl p-7 text-center glass md:p-16">
            {lang === 'zh' ? (
              <>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  {t.cta.title[0]}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {t.cta.title[1]}
                  </span>
                </h2>
                <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">{t.cta.subtitle}</p>
                <div className="flex flex-col items-center gap-3 mb-8">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white p-2 flex items-center justify-center">
                    <img src="/wechat-qr.png" alt={t.cta.wechatNote} loading="lazy" decoding="async" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-white font-medium flex items-center gap-2">
                    <MessageCircle size={16} className="text-green-400" />
                    {t.cta.wechatNote}
                  </p>
                  <p className="text-sm text-gray-400">{t.cta.wechatIdLabel}：{t.cta.wechatId}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {t.cta.secondaryLabel}：<a className="transition-colors hover:text-white" href="mailto:info@onyxdevslab.com">info@onyxdevslab.com</a> · <a className="transition-colors hover:text-white" href="tel:+8618923743756">+86 18923743756</a>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  {t.cta.title[0]}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {t.cta.title[1]}
                  </span>
                  ?
                </h2>
                <p className="text-lg text-gray-400 mb-6 max-w-xl mx-auto">{t.cta.subtitle}</p>
                <p className="text-base text-gray-300 font-medium tracking-wide"><a className="hover:text-white" href="mailto:info@onyxdevslab.com">info@onyxdevslab.com</a> · <a className="hover:text-white" href="tel:+14165655366">+1 (416) 565-5366</a></p>
              </>
            )}
          </div>
        </div>
      </section>
      </main>

      {/* ── Footer ── */}
      <footer className="py-16 border-t border-white/5 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Onyx</span>
                <span> Devs Lab</span>
              </h3>
              <p className="text-gray-500 max-w-md leading-relaxed">{t.footer.description}</p>
            </div>
            <div className="md:text-right">
              <h3 className="text-xl font-bold mb-4">{t.footer.contactTitle}</h3>
              <p className="text-gray-500 leading-relaxed">
                <a className="transition-colors hover:text-white" href="mailto:info@onyxdevslab.com">info@onyxdevslab.com</a><br />
                {lang === 'zh' ? (
                  <>
                    <a className="transition-colors hover:text-white" href="tel:+8618923743756">+86 18923743756</a><br />
                    {t.footer.wechatLabel}：{t.footer.wechatId}<br />
                    {t.footer.addressLines.map((line) => (<React.Fragment key={line}>{line}<br /></React.Fragment>))}
                    <span className="text-gray-600 text-sm">{t.footer.serviceNote}</span>
                  </>
                ) : (
                  <>
                    <a className="transition-colors hover:text-white" href="tel:+14165655366">+1 (416) 565-5366</a><br />
                    8 Lai Ying Street, Grand Victoria III<br />
                    Cheung Sha Wan, Kowloon, HK
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center text-sm text-gray-600 sm:flex-row sm:text-left">
            <span>&copy; {new Date().getFullYear()} Onyx Devs Lab. {t.footer.rights}</span>
            <a href="/privacy.html" className="transition-colors hover:text-gray-300">{experience.privacy}</a>
          </div>
        </div>
      </footer>

      {!activeProject && (
        <React.Suspense fallback={null}>
          <ChatWidget />
        </React.Suspense>
      )}
    </div>
  );
};

export default LandingPage;

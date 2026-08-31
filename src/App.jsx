import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Globe, Menu, X, Bot, Database, Cpu, Target, Users, Sparkles, MessageCircle } from 'lucide-react';
import ChatWidget from './components/chat/ChatWidget';

// ─── Translations ────────────────────────────────────────────────────────────

const translations = {
  en: {
    nav: { capabilities: 'Capabilities', work: 'Case Studies', team: 'Team', contact: 'Contact Us' },
    hero: {
      badge: 'AI Strategy & Consulting',
      title: ['We Advise on', 'AI'],
      subtitle: "Amazon and Huawei alumni. We don't take every project — we provide senior-level AI consulting and selectively deliver systems that matter.",
      cta: 'Get in Touch',
      secondary: 'See Our Work',
    },
    credentials: { label: 'Our team comes from' },
    philosophy: {
      items: [
        { title: 'Strategic Advisory', desc: "We diagnose before we prescribe. Every engagement starts with understanding your business — then designing the right AI approach." },
        { title: 'Senior-Only Team', desc: 'No junior staff, no handoffs. Every conversation is with someone who has shipped production AI systems.' },
        { title: 'Selective Engagements', desc: "We take on a handful of projects at a time. When we commit, you get our undivided expertise." },
      ],
    },
    services: {
      label: 'How We Help',
      title: ['Our ', 'Services'],
      items: [
        {
          title: 'AI Strategy & Architecture',
          description: 'We assess your business landscape and design AI roadmaps that deliver measurable ROI — from model selection and data governance to deployment strategy.',
          features: ['Feasibility Assessment', 'Architecture Design', 'Technology Selection', 'Implementation Roadmap'],
        },
        {
          title: 'Intelligent Agents & Data Advisory',
          description: 'We design and advise on AI agent systems, NL2SQL engines, and data intelligence pipelines — turning decades of business data into actionable insight.',
          features: ['Agent Architecture Design', 'NL2SQL & RAG Strategy', 'Data Pipeline Consulting', 'Semantic Search Solutions'],
        },
        {
          title: 'AI Transformation Consulting',
          description: 'We help enterprises go AI-native — rethinking workflows, modernizing legacy systems, and embedding intelligence where it matters most.',
          features: ['Enterprise AI Integration', 'Workflow Redesign', 'Legacy Modernization', 'Change Management'],
        },
      ],
    },
    work: {
      label: 'Case Studies',
      title: ['Selected ', 'Work'],
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
      subtitle: 'Five senior engineers and researchers. No layers, no handoffs — you work directly with the people solving your problem.',
      members: [
        { role: 'Senior Engineer & Project Lead', bio: 'Former core contributor to Huawei\'s AI product line, where he helped ship production AI systems at enterprise scale. Since leaving Huawei, has led the end-to-end architecture and delivery of multiple AI-powered enterprise platforms — including ERP systems with embedded intelligent agents, NL2SQL engines, and fully automated business pipelines. Specializes in translating complex business workflows into AI-native solutions, with a track record of taking projects from initial scoping through production deployment.' },
        { role: 'Senior Engineer', bio: 'Served as CTO at a crypto startup, where he built the entire technical organization and led strategy through rapid scaling. Now at the forefront of integrating cutting-edge AI with Web3 and blockchain ecosystems — designing intelligent trading agents, on-chain automation systems, and AI-driven financial tooling. His unique combination of deep infrastructure experience and crypto-native thinking enables novel solutions at the intersection of decentralized finance and artificial intelligence.' },
        { role: 'Senior Engineer', bio: 'Extensive backend engineering experience at Amazon and Coinbase, where he designed and scaled high-availability distributed systems serving millions of users. Subsequently founded an AI-powered marketing startup, gaining firsthand experience in productizing AI for real-world business applications and growth automation. Brings a rare blend of big-tech systems rigor and startup agility — equally comfortable architecting cloud infrastructure at scale and rapidly prototyping AI-driven products from zero to market.' },
        { role: 'Senior Engineer', bio: 'Core software developer at Huawei, where he builds mission-critical enterprise systems with emerging technology. Brings deep expertise in AI Agent architectures, autonomous workflow orchestration, and enterprise data security — a combination that is essential for deploying AI in complex enterprise environments. His experience delivering systems to rigorous security and reliability standards makes him uniquely qualified to advise on enterprise AI adoption.' },
        { role: 'Strategy & Operations Lead', bio: 'Brings a cross-disciplinary background spanning computer science, mathematics, and business, with senior experience across multinational enterprises in Europe and Canada. She has a sharp eye for the gaps and inefficiencies hidden inside systems and processes, and has led data teams in designing digital transformation initiatives — delivering business recommendations and directional strategy that help companies grow revenue and cut costs.' },
      ],
    },
    cta: {
      title: ['Ready to Rethink Your ', 'AI Strategy'],
      subtitle: 'Reach out via email or phone — we respond within 24 hours.',
      contactLine: 'info@onyxdevslab.com  ·  +1 (416) 565-5366',
    },
    footer: {
      description: 'Senior AI consulting. Elite team. Strategic depth.',
      contactTitle: 'Contact',
      rights: 'All rights reserved.',
    },
  },
  zh: {
    nav: { capabilities: '能力', work: '案例', team: '团队', contact: '联系我们' },
    hero: {
      badge: '中加技术团队 | 10年+软件与数据实战 | 企业流程优化 × 场景AI落地',
      title: ['让AI，成为', '企业的新基建。'],
      subtitle: '数据是原油，AI是炼油厂。但大多数企业——有油，没厂。我们就是那座厂。从财务到供应链，从市场到销售，从内容生产到赛事计分——我们只做一件事：把AI变成企业账本上看得见的增长。',
      cta: '联系我们',
      secondary: '查看案例',
    },
    credentials: { label: '团队背景' },
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
      label: '服务内容',
      title: ['我们的', '服务'],
      items: [
        {
          title: '先诊断，再动手',
          description: '花一周搞清楚你的业务里哪个环节最值得上AI，给出投入、周期和预期回报，再决定做不做。',
          features: ['可行性评估', '方案设计', '选型建议', '分阶段实施'],
        },
        {
          title: '让老板一句话问出所有数据',
          description: '不用等财务出报表，"上个月哪个门店毛利最低？"直接问，直接答。',
          features: ['业务问题梳理', '数据问答引擎搭建', '现有数据打通', '智能检索方案'],
        },
        {
          title: '旧系统不换也能变聪明',
          description: '不推倒重来，在现有ERP/Excel流程上加一层AI，业务不停摆。',
          features: ['系统对接', '流程重新设计', '老系统升级', '团队上手辅导'],
        },
      ],
    },
    work: {
      label: '项目案例',
      title: ['精选', '案例'],
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
      subtitle: '五位资深工程师与研究员。零层级、零中间人——你直接与解决问题的人对话。',
      members: [
        { role: '高级工程师 & 项目负责人', bio: '前华为AI产品线核心贡献者。离开华为后主导多个AI企业平台从架构到上线的完整交付，包括内嵌智能Agent的ERP系统、NL2SQL引擎。擅长把复杂业务流程转化为能落地生产的AI方案。' },
        { role: '高级工程师', bio: '曾任Crypto公司CTO，从零搭建技术团队并主导快速扩张期的技术战略。现专注AI与Web3结合，设计智能交易Agent、链上自动化系统与AI驱动的金融工具。' },
        { role: '高级工程师', bio: '曾在亚马逊、美国头部加密交易所设计并扩展服务数百万用户的高可用分布式系统。此后创立AI营销公司，有AI产品从0到1落地并用于真实业务增长的一线经验。' },
        { role: '高级工程师', bio: '华为核心软件开发者，长期参与企业级关键系统建设。深耕AI Agent架构、自主工作流编排与企业数据安全，熟悉高安全、高可靠要求下的AI落地。' },
        { role: '战略运营负责人', bio: '拥有计算机、数学与商业的复合背景，曾在欧洲、加拿大等多家跨国企业任职，资深且敬业。擅长洞察系统与流程中的痛点与漏洞，曾带领数据团队设计数字化转型方案，提供商业建议与方向性战略，助力企业开源节流、降本增效。' },
      ],
    },
    cta: {
      title: ['加微信，', '免费聊30分钟'],
      subtitle: '不确定AI能帮你什么？我们告诉你哪个环节最先值得做，不合适也直说。',
      wechatNote: '扫码加微信，免费聊聊你的业务',
      wechatIdLabel: '微信号',
      wechatId: 'm453301909',
      secondaryLabel: '也可以邮件或电话联系我们',
      contactLine: 'info@onyxdevslab.com  ·  +86 18923743756',
    },
    footer: {
      description: '高端AI咨询。资深团队。战略深度。',
      contactTitle: '联系方式',
      rights: '保留所有权利。',
      wechatLabel: '微信',
      wechatId: 'm453301909',
      addressLines: ['九龙长沙湾丽盈街8号'],
      serviceNote: '远程交付为主，可视项目安排驻场',
    },
  },
  it: {
    nav: { capabilities: 'Competenze', work: 'Progetti', team: 'Team', contact: 'Contattaci' },
    hero: {
      badge: 'Strategia & Consulenza AI',
      title: ['Consulenti', 'AI'],
      subtitle: "Alumni di Stanford, Amazon e Huawei. Non accettiamo ogni progetto — offriamo consulenza AI senior e realizziamo selettivamente sistemi ad alto impatto.",
      cta: 'Contattaci',
      secondary: 'Vedi i Progetti',
    },
    credentials: { label: 'Il nostro team viene da' },
    philosophy: {
      items: [
        { title: 'Strategia Prima', desc: "Prima diagnostichiamo, poi prescriviamo. Ogni engagement inizia dalla comprensione del tuo business — poi progettiamo l'approccio AI giusto." },
        { title: 'Solo Senior', desc: 'Nessuno staff junior, nessun passaggio di consegne. Ogni conversazione è con chi ha già rilasciato sistemi AI in produzione.' },
        { title: 'Engagement Selettivi', desc: "Accettiamo pochi progetti alla volta. Quando ci impegniamo, ricevi tutta la nostra competenza." },
      ],
    },
    services: {
      label: 'Come Aiutiamo',
      title: ['I Nostri ', 'Servizi'],
      items: [
        {
          title: 'Strategia & Architettura AI',
          description: 'Valutiamo il panorama aziendale e progettiamo roadmap AI con ROI misurabile — dalla selezione dei modelli alla strategia di deployment.',
          features: ['Valutazione Fattibilità', 'Design Architetturale', 'Selezione Tecnologica', 'Roadmap Implementativa'],
        },
        {
          title: 'Agent Intelligenti & Data Advisory',
          description: 'Progettiamo e consultiamo su sistemi AI Agent, motori NL2SQL e pipeline di data intelligence — trasformando anni di dati in insight azionabili.',
          features: ['Design Architettura Agent', 'Strategia NL2SQL & RAG', 'Consulenza Data Pipeline', 'Soluzioni Ricerca Semantica'],
        },
        {
          title: 'Consulenza Trasformazione AI',
          description: "Aiutiamo le aziende a diventare AI-native — ripensando i workflow, modernizzando i sistemi legacy e integrando l'intelligenza dove conta di più.",
          features: ['Integrazione AI Enterprise', 'Redesign Workflow', 'Modernizzazione Legacy', 'Change Management'],
        },
      ],
    },
    work: {
      label: 'Casi Studio',
      title: ['Lavori ', 'Selezionati'],
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
      subtitle: 'Cinque ingegneri e ricercatori senior. Zero livelli, zero intermediari — lavori direttamente con chi risolve il problema.',
      members: [
        { role: 'Ingegnere Senior & Project Lead', bio: 'Ex contributore chiave della linea prodotti AI di Huawei, dove ha partecipato al rilascio di sistemi AI in produzione su scala enterprise. Dopo Huawei, ha guidato l\'architettura e la delivery end-to-end di molteplici piattaforme enterprise AI-powered — tra cui sistemi ERP con agenti intelligenti integrati, motori NL2SQL e pipeline di automazione completa. Specializzato nel tradurre workflow aziendali complessi in soluzioni AI-native, con un track record dalla definizione dei requisiti al deployment in produzione.' },
        { role: 'Ingegnere Senior', bio: 'Ha servito come CTO in una startup crypto, costruendo l\'intera organizzazione tecnica e guidando la strategia durante la crescita rapida. Oggi in prima linea nell\'integrazione di AI avanzata con gli ecosistemi Web3 e blockchain — progettando agenti di trading intelligenti, sistemi di automazione on-chain e strumenti finanziari AI-driven. La sua combinazione unica di esperienza infrastrutturale profonda e pensiero crypto-nativo abilita soluzioni innovative all\'intersezione tra finanza decentralizzata e intelligenza artificiale.' },
        { role: 'Ingegnere Senior', bio: 'Vasta esperienza di backend engineering in Amazon e Coinbase, dove ha progettato e scalato sistemi distribuiti ad alta disponibilità per milioni di utenti. Ha successivamente fondato una startup di AI marketing, acquisendo esperienza diretta nella produttizzazione dell\'AI per applicazioni business reali e growth automation. Porta una rara combinazione di rigore sistemistico big-tech e agilità startup — altrettanto a suo agio nell\'architettare infrastrutture cloud su scala e nel prototipare rapidamente prodotti AI-driven da zero a mercato.' },
        { role: 'Ingegnere Senior', bio: 'Sviluppatore software core presso Huawei, dove realizza sistemi enterprise mission-critical con tecnologie emergenti. Ha una profonda competenza in architetture AI Agent, orchestrazione autonoma dei workflow e sicurezza dei dati enterprise — una combinazione essenziale per il deployment dell\'AI in ambienti aziendali complessi. La sua esperienza nella realizzazione di sistemi secondo rigorosi standard di sicurezza e affidabilità lo rende particolarmente qualificato per la consulenza sull\'adozione dell\'AI enterprise.' },
        { role: 'Responsabile Strategia & Operations', bio: 'Vanta un background interdisciplinare tra informatica, matematica e business, con una solida esperienza in aziende multinazionali in Europa e Canada. Ha un occhio attento alle lacune e alle inefficienze nascoste in sistemi e processi e ha guidato team di dati nella progettazione di iniziative di trasformazione digitale, offrendo raccomandazioni commerciali e strategie direzionali che aiutano le aziende a incrementare i ricavi e ridurre i costi.' },
      ],
    },
    cta: {
      title: ['Pronti a Ripensare la Vostra ', 'Strategia AI'],
      subtitle: 'Contattateci via email o telefono — rispondiamo entro 24 ore.',
      contactLine: 'info@onyxdevslab.com  ·  +1 (416) 565-5366',
    },
    footer: {
      description: "Consulenza AI senior. Team d'élite. Profondità strategica.",
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

const zhWorkOrder = ['onyx-hire', 'lexflow', 'ghosty', 'meng', 'finance-ai-automation', 'supermarket-datahub', 'jinhui-erp', 'finance-erp', 'squirrel', 'maybole', 'aiusd', 'manbo', 'mimitavern'];

const getVisibleWorkItems = (lang, items) => {
  const merged = items.map((item, index) => ({ ...item, ...workMeta[index] }));
  const filtered = merged.filter((item) => item.visibleIn.includes(lang));
  if (lang === 'zh') {
    filtered.sort((a, b) => zhWorkOrder.indexOf(a.id) - zhWorkOrder.indexOf(b.id));
  } else {
    const featured = ['onyx-hire', 'lexflow', 'ghosty'];
    const rank = (id) => {
      const index = featured.indexOf(id);
      return index === -1 ? featured.length : index;
    };
    filtered.sort((a, b) => rank(a.id) - rank(b.id));
  }
  return filtered;
};

const serviceIcons = [Bot, Database, Cpu];
const philosophyIcons = [Target, Users, Sparkles];
const langLabels = { en: 'EN', zh: '中文', it: 'IT' };
const portfolioCopy = {
  en: {
    wallLabel: 'Portfolio Atlas',
    wallTitle: 'Built deep inside real businesses',
    wallSubtitle: 'Explore a selection of systems spanning operations, data, finance, industry, and generative AI.',
  },
  zh: {
    wallLabel: '项目图谱',
    wallTitle: '深入真实业务现场',
    wallSubtitle: '从运营、数据、金融和工业系统，到生成式 AI 产品。点击任意项目，查看我们如何解决复杂问题。',
  },
  it: {
    wallLabel: 'Atlante dei Progetti',
    wallTitle: 'Nel cuore delle aziende reali',
    wallSubtitle: 'Esplora una selezione di sistemi tra operations, dati, finanza, industria e AI generativa.',
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-sm backdrop-blur-sm"
      >
        <Globe size={14} />
        {langLabels[lang]}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 py-1 rounded-xl border border-white/10 bg-[#0a0e1a]/95 backdrop-blur-xl shadow-xl z-50 min-w-[100px]">
            {Object.entries(langLabels).map(([code, label]) => (
              <button
                key={code}
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
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#0a0e1a] border-l border-white/10 p-6 flex flex-col">
        <button onClick={onClose} className="self-end mb-8 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <nav className="flex flex-col gap-6">
          <a href="#capabilities" onClick={onClose} className="text-gray-300 hover:text-white transition-colors">{t.nav.capabilities}</a>
          <a href="#work" onClick={onClose} className="text-gray-300 hover:text-white transition-colors">{t.nav.work}</a>
          <a href="#team" onClick={onClose} className="text-gray-300 hover:text-white transition-colors">{t.nav.team}</a>
          <a href="#contact" onClick={onClose}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all">
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

const ServiceCard = ({ icon: Icon, title, description, features }) => (
  <div className="glass rounded-2xl p-8 transition-all duration-300 group hover:-translate-y-1">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors">
      <Icon size={22} className="text-blue-400" />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 mb-6 text-sm leading-relaxed">{description}</p>
    <ul className="space-y-2.5">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2.5 text-gray-500 text-sm">
          <ChevronRight size={14} className="text-blue-400/60" />
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

const PainPointCard = ({ pain, solution, benefit, onClick }) => (
  <div
    className={`glass rounded-2xl p-6 transition-all duration-300 ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}`}
    onClick={onClick}
  >
    <p className="text-gray-500 text-sm mb-3">
      <span className="text-red-400/70">痛点</span> · {pain}
    </p>
    <p className="text-white font-semibold mb-3">
      <span className="text-blue-400">AI方案</span> · {solution}
    </p>
    <p className="text-green-300/90 text-sm font-medium">
      <span className="text-green-400">收益</span> · {benefit}
    </p>
  </div>
);

const TeamMemberCard = ({ name, role, avatar, bio, credentials }) => (
  <div className="glass rounded-2xl p-6 md:p-8 transition-all duration-300 group hover:-translate-y-1 h-full">
    <div className="flex gap-5 items-start">
      <div className="flex flex-col items-center shrink-0">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-40 blur transition-opacity duration-300" />
          <img src={avatar} alt={name} className="relative w-20 h-20 rounded-full border-2 border-white/10 group-hover:border-white/20 transition-colors object-cover" />
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

const ProjectWall = ({ items, projectsData, copy, viewLabel, onSelect }) => (
  <div className="section-reveal">
    <div className="mb-9 max-w-2xl">
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">{copy.wallLabel}</span>
      <h3 className="mt-3 text-2xl font-bold md:text-3xl">{copy.wallTitle}</h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-400 md:text-base">{copy.wallSubtitle}</p>
    </div>

    <div className="portfolio-wall grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((study) => {
        const image = projectsData.find((project) => project.id === study.id)?.images[0];
        return (
          <button
            key={study.id}
            type="button"
            onClick={() => onSelect(study.id)}
            className="portfolio-tile group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#101625] text-left"
            aria-label={`${viewLabel}: ${study.title}`}
          >
            {image && (
              <img
                src={image}
                alt=""
                className="portfolio-tile-image absolute inset-0 h-full w-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.045]"
              />
            )}
            <div className="portfolio-tile-wash absolute inset-0" />
            <div className="portfolio-tile-gradient absolute inset-0" />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
              <span className="rounded-full border border-white/10 bg-[#090d16]/75 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-cyan-100/80 backdrop-blur-xl">
                {study.tags[0]}
              </span>
              <span className="flex h-9 w-9 translate-y-1 items-center justify-center rounded-full border border-white/10 bg-[#090d16]/70 text-white/70 opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowRight size={15} />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <h4 className="text-lg font-semibold leading-snug text-white md:text-xl">
                {study.title}
              </h4>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-400 transition-colors duration-300 group-hover:text-gray-200">
                {study.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Project Modal ──────────────────────────────────────────────────────────

const ProjectModal = ({ project, images, onClose }) => {
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
        className="relative w-full max-w-5xl max-h-[90vh] bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden flex flex-col animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <X size={16} />
        </button>

        {/* Image carousel */}
        <div className="relative w-full aspect-[16/9] bg-black/50 shrink-0">
          <img
            src={images[currentImage]}
            alt={`Screenshot ${currentImage + 1}`}
            className="w-full h-full object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`}
                  />
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
        <div className="p-6 md:p-8 overflow-y-auto">
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/10">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-3">{project.title}</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">{project.description}</p>
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
  const [lang, setLang] = useState(() => {
    const isHK = window.location.hostname === 'hk.onyxdevslab.com';
    return isHK ? 'zh' : 'en';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const pageRef = useScrollReveal([lang]);
  const t = translations[lang];
  const visibleWorkItems = getVisibleWorkItems(lang, t.work.items);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden">

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
            <a href="#team" className="nav-link text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{t.nav.team}</a>
            <a href="#contact"
              className="px-5 py-2 rounded-full text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all hover:shadow-lg hover:shadow-blue-500/25">
              {t.nav.contact}
            </a>
            <LanguageSwitcher lang={lang} setLang={setLang} />
          </div>
          <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} t={t} lang={lang} setLang={setLang} />

      {/* ── Hero ── */}
      <header className="relative min-h-screen flex items-center px-6 overflow-hidden">
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

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300 text-sm mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse-glow" />
              {t.hero.badge}
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight">
              {t.hero.title[0]}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                {t.hero.title[1]}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 text-base font-medium">
                {t.hero.cta}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#work"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 transition-all duration-300 text-base text-gray-300 hover:text-white backdrop-blur-sm">
                {t.hero.secondary}
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0e1a] to-transparent" />
      </header>

      {/* ── Philosophy ── */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {t.philosophy.items.map((item, index) => {
              const Icon = philosophyIcons[index];
              return (
                <div key={index} className="section-reveal flex items-start gap-4 p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors" style={{ transitionDelay: `${index * 100}ms` }}>
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1 text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI Capabilities ── */}
      <section id="capabilities" className="py-28 relative">
        <div className="container mx-auto px-6">
          <div className="section-reveal text-center mb-20">
            <span className="text-blue-400 text-sm font-medium tracking-[0.2em] uppercase">{t.services.label}</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              {t.services.title[0]}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {t.services.title[1]}
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.services.items.map((service, index) => (
              <div key={index} className="section-reveal" style={{ transitionDelay: `${index * 150}ms` }}>
                <ServiceCard icon={serviceIcons[index]} {...service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pain Points (zh only) ── */}
      {lang === 'zh' && (
        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <div className="section-reveal text-center mb-16">
              <span className="text-red-400 text-sm font-medium tracking-[0.2em] uppercase">{t.painpoints.label}</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
                {t.painpoints.title[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {t.painpoints.title[1]}
                </span>
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-red-400 to-blue-500 mx-auto rounded-full" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {t.painpoints.items.map((item, index) => (
                <div key={index} className="section-reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                  <PainPointCard
                    pain={item.pain}
                    solution={item.solution}
                    benefit={item.benefit}
                    onClick={item.linkId ? () => setActiveProject(item.linkId) : undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Case Studies ── */}
      <section id="work" className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="section-reveal text-center mb-20">
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
            copy={portfolioCopy[lang]}
            viewLabel={t.work.viewDetails}
            onSelect={setActiveProject}
          />
        </div>
      </section>

      {/* ── Project Modal ── */}
      {activeProject !== null && (
        <ProjectModal
          project={visibleWorkItems.find((w) => w.id === activeProject)}
          images={projectsData.find((p) => p.id === activeProject)?.images || []}
          onClose={() => setActiveProject(null)}
        />
      )}

      {/* ── Team ── */}
      <section id="team" className="py-28 relative">
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
      <section id="contact" className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.03] to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] animate-float-delayed" />
        <div className="container mx-auto px-6 relative">
          <div className="section-reveal max-w-3xl mx-auto text-center glass rounded-3xl p-12 md:p-16">
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
                    <img src="/wechat-qr.png" alt={t.cta.wechatNote} className="w-full h-full object-contain" />
                  </div>
                  <p className="text-white font-medium flex items-center gap-2">
                    <MessageCircle size={16} className="text-green-400" />
                    {t.cta.wechatNote}
                  </p>
                  <p className="text-sm text-gray-400">{t.cta.wechatIdLabel}：{t.cta.wechatId}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {t.cta.secondaryLabel}：{t.cta.contactLine}
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
                <p className="text-base text-gray-300 font-medium tracking-wide">{t.cta.contactLine}</p>
              </>
            )}
          </div>
        </div>
      </section>

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
                info@onyxdevslab.com<br />
                {lang === 'zh' ? (
                  <>
                    +86 18923743756<br />
                    {t.footer.wechatLabel}：{t.footer.wechatId}<br />
                    {t.footer.addressLines.map((line) => (<React.Fragment key={line}>{line}<br /></React.Fragment>))}
                    <span className="text-gray-600 text-sm">{t.footer.serviceNote}</span>
                  </>
                ) : (
                  <>
                    +1 (416) 565-5366<br />
                    8 Lai Ying Street, Grand Victoria III<br />
                    Cheung Sha Wan, Kowloon, HK
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Onyx Devs Lab. {t.footer.rights}
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
};

export default LandingPage;

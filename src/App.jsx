import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Globe, Menu, X, Bot, Database, Cpu, Target, Users, Sparkles } from 'lucide-react';

// ─── Translations ────────────────────────────────────────────────────────────

const translations = {
  en: {
    nav: { capabilities: 'Capabilities', work: 'Case Studies', team: 'Team', contact: 'Get in Touch' },
    hero: {
      badge: 'AI-Exclusive Engineering',
      title: ['We Only', 'Build AI'],
      subtitle: "A handpicked team from Stanford, Amazon, and Huawei. We don't do everything — we do AI, and we do it at the highest level.",
      cta: 'Start a Conversation',
      secondary: 'See Our Work',
    },
    credentials: { label: 'Our team comes from' },
    philosophy: {
      items: [
        { title: 'AI-Only Focus', desc: "Every project has AI at its core. This isn't a side offering — it's all we do." },
        { title: 'Direct Access', desc: 'No middlemen. You work directly with the engineers building your system.' },
        { title: 'Elite Pedigree', desc: 'Stanford, Amazon, Huawei, Coinbase alumni on every engagement.' },
      ],
    },
    services: {
      label: 'What We Build',
      title: ['AI ', 'Capabilities'],
      items: [
        {
          title: 'AI Agents & Automation',
          description: 'Autonomous agents for customer service, internal Q&A, research, and decision support — replacing manual workflows with intelligent systems.',
          features: ['Multi-Agent Orchestration', 'Conversational AI', 'Task Automation', 'Human-in-the-Loop'],
        },
        {
          title: 'NL2SQL & Data Intelligence',
          description: 'Natural language access to your entire database. Decades of business data, one question away.',
          features: ['Natural Language Querying', 'Real-Time Analytics', 'Semantic Search & RAG', 'Data Pipeline Integration'],
        },
        {
          title: 'AI-Native Enterprise Systems',
          description: 'Full-stack platforms — ERP, CRM, operations — designed AI-first from day one, not bolted on as an afterthought.',
          features: ['Custom ERP & CRM', 'IoT Integration', 'Workflow Automation', 'Legacy Modernization'],
        },
      ],
    },
    work: {
      label: 'Case Studies',
      title: ['Selected ', 'Work'],
      viewDetails: 'View Details',
      items: [
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
      ],
    },
    team: {
      label: 'Who We Are',
      title: ['Meet the ', 'Team'],
      subtitle: 'Four engineers. No layers. Every project gets our full attention.',
      members: [
        { role: 'Founder & Lead', bio: 'Former Humboldt Scholar. Postdoc at Stanford/SLAC. Now leads the AI Platform at Sinochem, delivering national-level AI projects from zero to production.' },
        { role: 'Software Engineer', bio: 'UofT graduate, 9 years of experience. Former CTO at a crypto startup, driving technical strategy through rapid growth.' },
        { role: 'Software Engineer', bio: 'UofT graduate, 9 years of full-stack experience. Core contributor to Huawei\'s AI product line.' },
        { role: 'Software Engineer', bio: 'UWaterloo graduate, 9 years of experience. Built and scaled backend systems at Amazon and Coinbase.' },
      ],
    },
    cta: {
      title: ['Ready to Build Something ', 'Great'],
      subtitle: 'We take on a limited number of projects to ensure every client gets our best work.',
      button: 'Start a Conversation',
    },
    footer: {
      description: 'AI-exclusive engineering. Elite team. Deep expertise.',
      contactTitle: 'Contact',
      rights: 'All rights reserved.',
    },
  },
  zh: {
    nav: { capabilities: '能力', work: '案例', team: '团队', contact: '联系我们' },
    hero: {
      badge: '只做AI',
      title: ['我们只做', 'AI'],
      subtitle: '来自斯坦福、亚马逊、华为的精英团队。不求广，只求精——AI领域，值得我们出手。',
      cta: '开始对话',
      secondary: '查看案例',
    },
    credentials: { label: '团队背景' },
    philosophy: {
      items: [
        { title: '只做AI', desc: '每一个项目都以AI为核心。这不是附加服务——这是我们唯一做的事。' },
        { title: '直接沟通', desc: '没有销售，没有中间人。你直接和写代码的工程师对话。' },
        { title: '精英背景', desc: '斯坦福、亚马逊、华为、Coinbase校友，每个项目全力投入。' },
      ],
    },
    services: {
      label: '我们的能力',
      title: ['AI ', '能力'],
      items: [
        {
          title: 'AI智能体与自动化',
          description: '自主AI代理，覆盖客户服务、内部问答、调研分析与决策支持——用智能系统替代手动流程。',
          features: ['多Agent协同', '对话式AI', '任务自动化', '人机协同'],
        },
        {
          title: 'NL2SQL与数据智能',
          description: '用自然语言查询整个数据库。二十年业务数据，一句话触达。',
          features: ['自然语言查询', '实时数据分析', '语义搜索与RAG', '数据管线集成'],
        },
        {
          title: 'AI原生企业系统',
          description: '从第一行代码就为AI设计的全栈企业平台——ERP、CRM、运营，不是在旧系统上打补丁。',
          features: ['定制ERP/CRM', 'IoT集成', '工作流自动化', '遗留系统改造'],
        },
      ],
    },
    work: {
      label: '项目案例',
      title: ['精选', '案例'],
      viewDetails: '查看详情',
      items: [
        {
          title: '代理记账AI ERP系统',
          description: '以AI原生系统替代碎片化工作流，覆盖从获客到报税的完整业务链。',
          tags: ['AI Agent', 'NL2SQL', 'ERP', '全栈'],
          highlights: [
            'AI电话营销与智能客服，实现自动化获客',
            '内部Agent完全掌握20年业务数据，支持NL2SQL查询',
            '全链路工作流：接单、工单流转、资料整理、合规申报',
            '深度对接工商登记与税务申报系统',
          ],
        },
        {
          title: '矿业企业统一ERP平台',
          description: '整合分散的独立系统，将传统工业硬件接入数字化管理。',
          tags: ['IoT', 'ERP', '西门子PLC', 'AI Agent'],
          highlights: [
            '统一考勤、司磅、车队管理、库存、薪资计算和排班',
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
            '多Agent架构，自主完成调研、分析与报告生成',
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
            '三角色体系：客户发布需求、专家匹配接单、管理员监管',
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
      ],
    },
    team: {
      label: '关于我们',
      title: ['认识', '团队'],
      subtitle: '四名工程师，零层级，每个项目全力以赴。',
      members: [
        { role: '创始人 & 技术负责人', bio: '前洪堡学者，斯坦福/SLAC博士后。现任中化AI平台负责人，主导国家级AI项目从零到一落地。' },
        { role: '软件工程师', bio: '多伦多大学毕业，九年经验。曾任Crypto公司CTO，主导技术战略。' },
        { role: '软件工程师', bio: '多伦多大学毕业，九年全栈经验。华为AI产品线核心贡献者。' },
        { role: '软件工程师', bio: '滑铁卢大学毕业，九年经验。曾在亚马逊和Coinbase构建后端系统。' },
      ],
    },
    cta: {
      title: ['准备好构建', '伟大的产品'],
      subtitle: '我们只接有限的项目，确保每个客户都能获得全力投入。',
      button: '开始对话',
    },
    footer: {
      description: '只做AI。精英团队。深度专注。',
      contactTitle: '联系方式',
      rights: '保留所有权利。',
    },
  },
  it: {
    nav: { capabilities: 'Competenze', work: 'Progetti', team: 'Team', contact: 'Contattaci' },
    hero: {
      badge: 'Ingegneria Esclusivamente AI',
      title: ['Costruiamo Solo', 'AI'],
      subtitle: "Un team selezionato da Stanford, Amazon e Huawei. Non inseguiamo ogni progetto — andiamo in profondità sull'AI e consegniamo sistemi che trasformano il business.",
      cta: 'Inizia una Conversazione',
      secondary: 'Vedi i Progetti',
    },
    credentials: { label: 'Il nostro team viene da' },
    philosophy: {
      items: [
        { title: 'Solo AI', desc: "Ogni progetto ha l'AI al centro. Non è un extra — è tutto ciò che facciamo." },
        { title: 'Accesso Diretto', desc: 'Nessun intermediario. Lavori con gli ingegneri che costruiscono il tuo sistema.' },
        { title: "Pedigree d'Élite", desc: 'Alumni di Stanford, Amazon, Huawei e Coinbase su ogni progetto.' },
      ],
    },
    services: {
      label: 'Cosa Costruiamo',
      title: ['Competenze ', 'AI'],
      items: [
        {
          title: 'AI Agent e Automazione',
          description: 'Agenti autonomi per servizio clienti, Q&A interno, ricerca e supporto decisionale.',
          features: ['Orchestrazione Multi-Agent', 'AI Conversazionale', 'Automazione Task', 'Sistemi Human-in-the-Loop'],
        },
        {
          title: 'NL2SQL e Data Intelligence',
          description: 'Accesso in linguaggio naturale a tutto il database. Decenni di dati, una domanda.',
          features: ['Query in Linguaggio Naturale', 'Analytics Real-Time', 'Ricerca Semantica e RAG', 'Pipeline Dati'],
        },
        {
          title: 'Sistemi Enterprise AI-Nativi',
          description: "Piattaforme full-stack — ERP, CRM, operations — progettate AI-first dal primo giorno.",
          features: ['ERP e CRM Custom', 'Integrazione IoT', 'Automazione Workflow', 'Modernizzazione Legacy'],
        },
      ],
    },
    work: {
      label: 'Casi Studio',
      title: ['Lavori ', 'Selezionati'],
      viewDetails: 'Dettagli',
      items: [
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
      ],
    },
    team: {
      label: 'Chi Siamo',
      title: ['Il Nostro ', 'Team'],
      subtitle: 'Quattro ingegneri. Zero livelli. Ogni progetto ha la nostra piena attenzione.',
      members: [
        { role: 'Fondatore & Lead', bio: 'Ex borsista Humboldt. Post-doc a Stanford/SLAC. Dirige la Piattaforma AI presso Sinochem.' },
        { role: 'Ingegnere Software', bio: "Laureato UofT, 9 anni di esperienza. Ex CTO in startup crypto." },
        { role: 'Ingegnere Software', bio: 'Laureato UofT, 9 anni full-stack. Contributore chiave AI in Huawei.' },
        { role: 'Ingegnere Software', bio: 'Laureato UWaterloo, 9 anni. Backend in Amazon e Coinbase.' },
      ],
    },
    cta: {
      title: ['Pronti a Costruire Qualcosa di ', 'Grande'],
      subtitle: 'Accettiamo un numero limitato di progetti per garantire il massimo impegno.',
      button: 'Inizia a Parlare',
    },
    footer: {
      description: "Solo AI. Team d'élite. Expertise profonda.",
      contactTitle: 'Contatti',
      rights: 'Tutti i diritti riservati.',
    },
  },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const teamMeta = [
  { name: 'Weiying He', avatar: '/avatars/weiying.svg', isFounder: true, credentials: ['Stanford', 'SLAC', 'Humboldt'] },
  { name: 'Lucas Shen', avatar: '/avatars/lucas.svg', isFounder: false, credentials: ['UofT'] },
  { name: 'Mi', avatar: '/avatars/mi.svg', isFounder: false, credentials: ['UofT', 'Huawei'] },
  { name: 'Hunter Li', avatar: '/avatars/hunter.svg', isFounder: false, credentials: ['Waterloo', 'Amazon', 'Coinbase'] },
];

const credentialOrgs = [
  'Stanford University',
  'SLAC National Lab',
  'Humboldt Foundation',
  'University of Toronto',
  'University of Waterloo',
  'Amazon',
  'Coinbase',
  'Huawei',
  'Sinochem',
];

const projectsData = [
  { id: 'finance-erp', images: ['/projects/finance-erp/dashboard.png', '/projects/finance-erp/agent.png', '/projects/finance-erp/billing.png'] },
  { id: 'jinhui-erp', images: ['/projects/jinhui-erp/cover.png', '/projects/jinhui-erp/miniapp.png'] },
  { id: 'squirrel', images: ['/projects/squirrel/report.png', '/projects/squirrel/agent-chart.jpg'] },
  { id: 'aiusd', images: ['/projects/aiusd/cover.png', '/projects/aiusd/chat.png'] },
  { id: 'maybole', images: ['/projects/maybole/entrance.png', '/projects/maybole/customer.png', '/projects/maybole/expert.png'] },
  { id: 'manbo', images: ['/projects/manbo/main.png', '/projects/manbo/config.png'] },
  { id: 'mimitavern', images: ['/projects/mimitavern/chat.png'] },
];

const serviceIcons = [Bot, Database, Cpu];
const philosophyIcons = [Target, Users, Sparkles];
const langLabels = { en: 'EN', zh: '中文', it: 'IT' };

// ─── Hooks ───────────────────────────────────────────────────────────────────

const useScrollReveal = () => {
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
    const elements = ref.current?.querySelectorAll('.section-reveal');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
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
          <a href="mailto:info@onyxdevslab.com" onClick={onClose}
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

const CaseStudyCard = ({ title, description, tags, image, onClick, viewLabel }) => (
  <div className="glass rounded-2xl overflow-hidden transition-all duration-300 group hover:-translate-y-1 cursor-pointer" onClick={onClick}>
    <div className="relative h-48 overflow-hidden">
      {image ? (
        <img src={image} alt={title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#0c1222] to-[#1a1040] relative">
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
        <span className="text-white text-sm font-medium px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
          {viewLabel}
        </span>
      </div>
    </div>
    <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />
    <div className="p-6">
      <div className="mb-3 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/10">
            {tag}
          </span>
        ))}
      </div>
      <h3 className="text-lg font-bold mb-2 group-hover:text-blue-300 transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{description}</p>
    </div>
  </div>
);

const TeamMemberCard = ({ name, role, avatar, bio, isFounder, credentials }) => (
  <div className="glass rounded-2xl p-8 text-center transition-all duration-300 group hover:-translate-y-1">
    <div className="relative inline-block mb-5">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-50 blur transition-opacity duration-300" />
      <img src={avatar} alt={name} className="relative w-24 h-24 rounded-full border-2 border-white/10 group-hover:border-white/20 transition-colors" />
    </div>
    <h3 className="text-lg font-bold mb-1">{name}</h3>
    {isFounder && (
      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 bg-purple-500/15 text-purple-300 border border-purple-500/20">
        {role}
      </span>
    )}
    {!isFounder && <div className="mb-3" />}
    <div className="flex flex-wrap justify-center gap-1.5 mb-4">
      {credentials.map((cred) => (
        <span key={cred} className="px-2.5 py-0.5 rounded text-[11px] font-medium text-amber-300/80 bg-amber-500/10 border border-amber-500/10">
          {cred}
        </span>
      ))}
    </div>
    <p className="text-gray-500 text-sm leading-relaxed">{bio}</p>
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
  const [lang, setLang] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const pageRef = useScrollReveal();
  const t = translations[lang];

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
          ? 'bg-[#0a0e1a]/80 backdrop-blur-xl shadow-lg shadow-blue-500/5 border-b border-white/5'
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
            <a href="mailto:info@onyxdevslab.com"
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
              <a href="mailto:info@onyxdevslab.com"
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

      {/* ── Credentials & Philosophy ── */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="section-reveal text-center mb-16">
            <p className="text-sm text-gray-500 tracking-[0.2em] uppercase mb-8">{t.credentials.label}</p>
            <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-4">
              {credentialOrgs.map((org) => (
                <span key={org} className="text-sm md:text-base font-semibold text-gray-400/50 hover:text-gray-300 transition-colors duration-300 cursor-default tracking-wide">
                  {org}
                </span>
              ))}
            </div>
          </div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.work.items.map((study, index) => (
              <div key={index} className="section-reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                <CaseStudyCard
                  title={study.title}
                  description={study.description}
                  tags={study.tags}
                  image={projectsData[index]?.images[0]}
                  viewLabel={t.work.viewDetails}
                  onClick={() => setActiveProject(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Project Modal ── */}
      {activeProject !== null && (
        <ProjectModal
          project={t.work.items[activeProject]}
          images={projectsData[activeProject]?.images || []}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMeta.map((member, index) => (
              <div key={index} className="section-reveal" style={{ transitionDelay: `${index * 150}ms` }}>
                <TeamMemberCard
                  name={member.name}
                  avatar={member.avatar}
                  isFounder={member.isFounder}
                  credentials={member.credentials}
                  role={t.team.members[index].role}
                  bio={t.team.members[index].bio}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.03] to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] animate-float-delayed" />
        <div className="container mx-auto px-6 relative">
          <div className="section-reveal max-w-3xl mx-auto text-center glass rounded-3xl p-12 md:p-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t.cta.title[0]}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {t.cta.title[1]}
              </span>
              ?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">{t.cta.subtitle}</p>
            <a href="mailto:info@onyxdevslab.com"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 text-base font-medium">
              {t.cta.button}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
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
                hello@onyxdevslab.com<br />
                22 Sin Ming Lane #06-76 Midview City<br />
                Singapore 573969
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Onyx Devs Lab. {t.footer.rights}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

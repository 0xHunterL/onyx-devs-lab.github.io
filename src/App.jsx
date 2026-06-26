import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Globe, Menu, X, Bot, Database, Cpu, Target, Users, Sparkles } from 'lucide-react';
import ChatWidget from './components/chat/ChatWidget';

// ─── Translations ────────────────────────────────────────────────────────────

const translations = {
  en: {
    nav: { capabilities: 'Capabilities', work: 'Case Studies', team: 'Team', contact: 'Contact Us' },
    hero: {
      badge: 'AI Strategy & Consulting',
      title: ['We Advise on', 'AI'],
      subtitle: "Stanford, Amazon, Huawei, PBOC alumni. We don't take every project — we provide senior-level AI consulting and selectively deliver systems that matter.",
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
      subtitle: 'Five senior engineers and researchers. No layers, no handoffs — you work directly with the people solving your problem.',
      members: [
        { role: 'Founder & Lead', bio: 'Nationally recognized high-level overseas talent and AI + industry expert. PhD in Physical Inorganic Chemistry, Humboldt Scholar, with postdoctoral research at the Max Planck Institute for Chemical Energy Conversion, University of Göttingen, and Stanford/SLAC National Accelerator Laboratory. Now heads the AI Platform at Sinochem Yangtze River Delta Innovation Center and serves as Deputy Director of its Advanced Polyolefin Research Division.', highlights: [
            'Oversees enterprise AI infrastructure — model selection, data governance, compute deployment, and business scenario implementation',
            'Led a national-level AI initiative end-to-end, from requirements definition and model development to full industrial demonstration deployment',
            'Designed and deployed a "data → AI prediction → automated screening" intelligent workflow, a methodology directly transferable to client-facing operations',
            'Brings unique advantages in cross-national team management, multi-institutional collaboration, and cutting-edge technology tracking',
          ] },
        { role: 'Senior Engineer & Project Lead', bio: 'Former core contributor to Huawei\'s AI product line, where he helped ship production AI systems at enterprise scale. Since leaving Huawei, has led the end-to-end architecture and delivery of multiple AI-powered enterprise platforms — including ERP systems with embedded intelligent agents, NL2SQL engines, and fully automated business pipelines. Specializes in translating complex business workflows into AI-native solutions, with a track record of taking projects from initial scoping through production deployment.' },
        { role: 'Senior Engineer', bio: 'Served as CTO at a crypto startup, where he built the entire technical organization and led strategy through rapid scaling. Now at the forefront of integrating cutting-edge AI with Web3 and blockchain ecosystems — designing intelligent trading agents, on-chain automation systems, and AI-driven financial tooling. His unique combination of deep infrastructure experience and crypto-native thinking enables novel solutions at the intersection of decentralized finance and artificial intelligence.' },
        { role: 'Senior Engineer', bio: 'Extensive backend engineering experience at Amazon and Coinbase, where he designed and scaled high-availability distributed systems serving millions of users. Subsequently founded an AI-powered marketing startup, gaining firsthand experience in productizing AI for real-world business applications and growth automation. Brings a rare blend of big-tech systems rigor and startup agility — equally comfortable architecting cloud infrastructure at scale and rapidly prototyping AI-driven products from zero to market.' },
        { role: 'Senior Engineer', bio: 'Core software developer at a research institute under the People\'s Bank of China (PBOC), where he builds mission-critical systems at the intersection of national financial infrastructure and emerging technology. Brings deep expertise in AI Agent architectures, autonomous workflow orchestration, and enterprise data security — a combination that is essential for deploying AI in highly regulated environments. His experience navigating the strictest compliance and security requirements in China\'s financial sector makes him uniquely qualified to advise on AI adoption in sensitive industries.' },
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
      badge: 'AI战略咨询',
      title: ['AI领域', '高端顾问'],
      subtitle: '斯坦福、亚马逊、华为、央行背景的资深团队。我们不承接所有项目——专注提供高端AI咨询与解决方案，精选值得投入的合作。',
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
    services: {
      label: '服务内容',
      title: ['我们的', '服务'],
      items: [
        {
          title: 'AI战略与架构设计',
          description: '评估业务全景，设计可量化回报的AI路线图——从模型选型、数据治理到部署策略，提供完整的顶层规划。',
          features: ['可行性评估', '架构设计', '技术选型', '实施路径规划'],
        },
        {
          title: '智能Agent与数据咨询',
          description: '为客户设计AI Agent系统、NL2SQL引擎和数据智能管线方案——将沉淀多年的业务数据转化为可行动的洞察。',
          features: ['Agent架构设计', 'NL2SQL与RAG策略', '数据管线咨询', '语义搜索方案'],
        },
        {
          title: 'AI转型咨询',
          description: '帮助企业走向AI原生——重塑工作流、改造遗留系统，在关键节点嵌入智能能力。',
          features: ['企业AI集成', '工作流重构', '遗留系统改造', '变革管理'],
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
      subtitle: '五位资深工程师与研究员。零层级、零中间人——你直接与解决问题的人对话。',
      members: [
        { role: '创始人 & 技术负责人', bio: '海外高层次引进人才，AI+产业复合型专家。博士毕业于加拿大英属哥伦比亚大学物理无机化学专业，曾获德国洪堡学者奖，先后在德国马克斯·普朗克化学能量转换研究所、哥廷根大学及美国SLAC国家加速器实验室/斯坦福大学从事博士后研究。现任中化学长三角科创中心AI平台负责人、中化学科学技术有限公司高端聚烯烃所副主任研究员。', highlights: [
            '负责企业级AI基础设施的规划与建设，涵盖模型选型、数据治理、算力部署及业务场景落地，具备从0到1搭建可扩展AI服务平台的能力',
            '曾担任国家级"揭榜挂帅"人工智能项目负责人，带领团队完成从需求定义、AI模型开发到产业示范应用的全流程交付',
            '设计并落地"数据→AI模型预测→自动化筛选"智能工作流，方法论可天然迁移至各类客户服务与运营场景',
            '拥有跨国团队管理、多机构协作及前沿技术跟踪的独特优势',
          ] },
        { role: '高级工程师 & 项目负责人', bio: '前华为AI产品线核心贡献者，参与了多个生产级AI系统的企业规模化交付。离开华为后，主导了多个AI驱动的企业级平台从架构设计到上线落地的全过程——涵盖内嵌智能Agent的ERP系统、NL2SQL引擎以及全自动化业务流水线。擅长将复杂业务流程转化为AI原生解决方案，从项目初期需求定义到最终生产部署均有完整交付经验。' },
        { role: '高级工程师', bio: '曾任Crypto公司CTO，从零搭建技术团队并在公司快速扩张期全面主导技术战略与架构决策。现专注于将前沿AI能力与Web3及区块链生态深度融合——设计智能交易Agent、链上自动化执行系统及AI驱动的金融工具平台。凭借深厚的基础设施经验与Crypto原生思维，在去中心化金融与人工智能的交叉领域持续开拓创新解决方案。' },
        { role: '高级工程师', bio: '曾在亚马逊和Coinbase深耕多年，设计并扩展了服务数百万用户的高可用分布式后端系统。此后创立AI营销初创公司，拥有将AI技术从零到一产品化并应用于真实商业场景与增长自动化的一线实战经验。兼具大厂级系统工程的严谨性与创业公司的敏捷性——既能从容架构大规模云基础设施，也能快速将AI驱动的产品从构想推向市场。' },
        { role: '高级工程师', bio: '中国人民银行某研究所核心软件开发者，长期在国家级金融基础设施与前沿技术的交汇处构建关键业务系统。在AI Agent架构、自主工作流编排及企业级数据安全方面有深厚积累——这一组合对在高度监管环境中部署AI至关重要。多年在中国金融行业最严格的合规与安全要求下实战磨练，使其在敏感行业的AI落地咨询方面具有独特优势。' },
      ],
    },
    cta: {
      title: ['准备好重新审视你的', 'AI战略'],
      subtitle: '通过邮件或电话联系我们——24小时内回复。',
      contactLine: 'info@onyxdevslab.com  ·  +1 (416) 565-5366',
    },
    footer: {
      description: '高端AI咨询。资深团队。战略深度。',
      contactTitle: '联系方式',
      rights: '保留所有权利。',
    },
  },
  it: {
    nav: { capabilities: 'Competenze', work: 'Progetti', team: 'Team', contact: 'Contattaci' },
    hero: {
      badge: 'Strategia & Consulenza AI',
      title: ['Consulenti', 'AI'],
      subtitle: "Alumni di Stanford, Amazon, Huawei e PBOC. Non accettiamo ogni progetto — offriamo consulenza AI senior e realizziamo selettivamente sistemi ad alto impatto.",
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
      subtitle: 'Cinque ingegneri e ricercatori senior. Zero livelli, zero intermediari — lavori direttamente con chi risolve il problema.',
      members: [
        { role: 'Fondatore & Lead', bio: 'Talento d\'alto livello riconosciuto a livello nazionale, esperto AI + industria. PhD in Chimica Inorganica Fisica, borsista Humboldt, con ricerca post-dottorale al Max Planck Institute for Chemical Energy Conversion, Università di Göttingen e Stanford/SLAC National Accelerator Laboratory. Dirige la Piattaforma AI presso il Centro Innovazione Sinochem e guida la divisione ricerca poliolefine avanzate.', highlights: [
            'Supervisiona l\'infrastruttura AI enterprise — selezione modelli, data governance, deployment computazionale e implementazione scenari di business',
            'Ha condotto un\'iniziativa AI nazionale end-to-end, dalla definizione dei requisiti allo sviluppo dei modelli fino al deployment industriale dimostrativo completo',
            'Ha progettato e implementato un workflow intelligente "dati → predizione AI → screening automatizzato", una metodologia direttamente trasferibile alle operazioni client-facing',
            'Vantaggi unici nella gestione di team internazionali, collaborazione multi-istituzionale e tracking tecnologico d\'avanguardia',
          ] },
        { role: 'Ingegnere Senior & Project Lead', bio: 'Ex contributore chiave della linea prodotti AI di Huawei, dove ha partecipato al rilascio di sistemi AI in produzione su scala enterprise. Dopo Huawei, ha guidato l\'architettura e la delivery end-to-end di molteplici piattaforme enterprise AI-powered — tra cui sistemi ERP con agenti intelligenti integrati, motori NL2SQL e pipeline di automazione completa. Specializzato nel tradurre workflow aziendali complessi in soluzioni AI-native, con un track record dalla definizione dei requisiti al deployment in produzione.' },
        { role: 'Ingegnere Senior', bio: 'Ha servito come CTO in una startup crypto, costruendo l\'intera organizzazione tecnica e guidando la strategia durante la crescita rapida. Oggi in prima linea nell\'integrazione di AI avanzata con gli ecosistemi Web3 e blockchain — progettando agenti di trading intelligenti, sistemi di automazione on-chain e strumenti finanziari AI-driven. La sua combinazione unica di esperienza infrastrutturale profonda e pensiero crypto-nativo abilita soluzioni innovative all\'intersezione tra finanza decentralizzata e intelligenza artificiale.' },
        { role: 'Ingegnere Senior', bio: 'Vasta esperienza di backend engineering in Amazon e Coinbase, dove ha progettato e scalato sistemi distribuiti ad alta disponibilità per milioni di utenti. Ha successivamente fondato una startup di AI marketing, acquisendo esperienza diretta nella produttizzazione dell\'AI per applicazioni business reali e growth automation. Porta una rara combinazione di rigore sistemistico big-tech e agilità startup — altrettanto a suo agio nell\'architettare infrastrutture cloud su scala e nel prototipare rapidamente prodotti AI-driven da zero a mercato.' },
        { role: 'Ingegnere Senior', bio: 'Sviluppatore software core presso un istituto di ricerca della Banca Popolare Cinese (PBOC), dove costruisce sistemi mission-critical all\'intersezione tra infrastruttura finanziaria nazionale e tecnologia emergente. Profonda competenza in architetture AI Agent, orchestrazione autonoma dei workflow e sicurezza dati enterprise — una combinazione essenziale per il deployment dell\'AI in ambienti altamente regolamentati. La sua esperienza nel navigare i requisiti di compliance e sicurezza più stringenti del settore finanziario cinese lo rende particolarmente qualificato per la consulenza sull\'adozione AI in settori sensibili.' },
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
  { name: 'Weiying He', avatar: '/avatars/weiying.png', isFounder: true, credentials: ['Stanford', 'SLAC', 'Humboldt', 'Max Planck'] },
  { name: 'Mi', avatar: '/avatars/mi.png', isFounder: false, credentials: ['Huawei'] },
  { name: 'Lucas', avatar: '/avatars/lucas.png', isFounder: false, credentials: [] },
  { name: 'Hunter', avatar: '/avatars/hunter.png', isFounder: false, credentials: ['Amazon', 'Coinbase'] },
  { name: 'Jake', avatar: '/avatars/jake.png', isFounder: false, credentials: ['PBOC'] },
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

const FounderCard = ({ name, role, avatar, bio, highlights, credentials }) => (
  <div className="glass rounded-2xl p-8 md:p-10 transition-all duration-300 group hover:-translate-y-1">
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="flex flex-col items-center shrink-0">
        <div className="relative">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-30 group-hover:opacity-60 blur transition-opacity duration-300" />
          <img src={avatar} alt={name} className="relative w-32 h-32 rounded-full border-2 border-white/20 group-hover:border-white/30 transition-colors object-cover" />
        </div>
        <h3 className="text-xl font-bold mt-4">{name}</h3>
        <span className="inline-block px-4 py-1 rounded-full text-xs font-medium mt-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-500/20">
          {role}
        </span>
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {credentials.map((cred) => (
            <span key={cred} className="px-2.5 py-0.5 rounded text-[11px] font-medium text-amber-300/80 bg-amber-500/10 border border-amber-500/10">
              {cred}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-gray-400 text-sm leading-relaxed">{bio}</p>
        {highlights && (
          <ul className="mt-5 grid sm:grid-cols-2 gap-3">
            {highlights.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-gray-500 text-sm">
                <ChevronRight size={14} className="text-blue-400/60 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
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

// ─── Case Study Carousel ────────────────────────────────────────────────────

const CaseStudyCarousel = ({ items, projectsData, viewLabel, onSelect }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector('.carousel-card')?.offsetWidth || 400;
    scrollRef.current.scrollBy({ left: direction * (cardWidth + 24), behavior: 'smooth' });
  };

  return (
    <div className="relative section-reveal">
      <button
        onClick={() => scroll(-1)}
        className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar pb-4"
      >
        {items.map((study, index) => (
          <div key={index} className="carousel-card flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start">
            <CaseStudyCard
              title={study.title}
              description={study.description}
              tags={study.tags}
              image={projectsData[index]?.images[0]}
              viewLabel={viewLabel}
              onClick={() => onSelect(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

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
  const [lang, setLang] = useState(() => {
    const isHK = window.location.hostname === 'hk.onyxdevslab.com';
    return isHK ? 'zh' : 'en';
  });
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
          <CaseStudyCarousel
            items={t.work.items}
            projectsData={projectsData}
            viewLabel={t.work.viewDetails}
            onSelect={setActiveProject}
          />
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
          <div className="section-reveal mb-8">
            <FounderCard
              name={teamMeta[0].name}
              avatar={teamMeta[0].avatar}
              credentials={teamMeta[0].credentials}
              role={t.team.members[0].role}
              bio={t.team.members[0].bio}
              highlights={t.team.members[0].highlights}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {teamMeta.slice(1).map((member, index) => (
              <div key={index} className="section-reveal" style={{ transitionDelay: `${(index + 1) * 150}ms` }}>
                <TeamMemberCard
                  name={member.name}
                  avatar={member.avatar}
                  credentials={member.credentials}
                  role={t.team.members[index + 1].role}
                  bio={t.team.members[index + 1].bio}
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t.cta.title[0]}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {t.cta.title[1]}
              </span>
              ?
            </h2>
            <p className="text-lg text-gray-400 mb-6 max-w-xl mx-auto">{t.cta.subtitle}</p>
            <p className="text-base text-gray-300 font-medium tracking-wide">{t.cta.contactLine}</p>
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
                +1 (416) 565-5366<br />
                8 Lai Ying Street, Grand Victoria III<br />
                Cheung Sha Wan, Kowloon, HK
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

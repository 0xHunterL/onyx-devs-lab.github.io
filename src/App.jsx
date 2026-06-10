import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Code, Cpu, Database, ChevronRight, Globe } from 'lucide-react';

const translations = {
  en: {
    nav: { solutions: 'Solutions', work: 'Our Work', team: 'Team', contact: 'Contact Us' },
    hero: {
      badge: 'AI-Powered Enterprise Solutions',
      title: ['We Build', 'Software That Scales', 'With Your Ambition'],
      subtitle: 'Elite engineering team specialized in AI-native enterprise systems. We turn legacy workflows into intelligent, automated platforms.',
      cta: 'Schedule Consultation',
      secondary: 'View Our Work',
    },
    services: {
      label: 'What We Do',
      title: ['Our ', 'Expertise'],
      items: [
        {
          title: 'Cloud Architecture & DevOps',
          description: 'Build and optimize scalable cloud infrastructure that grows with your business.',
          features: ['Kubernetes & Container Orchestration', 'CI/CD Pipeline Development', 'Cloud Cost Optimization', 'High-Availability Systems'],
        },
        {
          title: 'Full-Stack Development',
          description: 'End-to-end development of robust, scalable applications.',
          features: ['Modern Frontend Frameworks', 'API Development', 'Database Design', 'Real-time Systems'],
        },
        {
          title: 'AI & Machine Learning',
          description: 'Integrate cutting-edge AI solutions into your products.',
          features: ['Custom ML Models', 'Natural Language Processing', 'Computer Vision', 'MLOps & Model Deployment'],
        },
      ],
    },
    work: {
      label: 'Our Projects',
      title: ['Selected ', 'Work'],
      items: [
        {
          title: 'AI-Powered ERP for Accounting Firms',
          description: 'A full-cycle ERP platform for bookkeeping agencies, replacing fragmented workflows with an AI-native system that handles everything from client acquisition to tax filing.',
          tags: ['AI Agent', 'NL2SQL', 'ERP', 'Full-Stack'],
          highlights: [
            'AI-driven telemarketing and customer service for automated client acquisition',
            'Internal agent with full command of 20 years of business data via advanced NL2SQL',
            'End-to-end workflow: order intake, task routing, document processing, and compliance filing',
            'Deep integration with business registration and tax reporting systems',
          ],
        },
        {
          title: 'Unified ERP for Mining Operations',
          description: 'A consolidated enterprise platform for a mining company in Northwest China, replacing a patchwork of standalone tools with one integrated system — and bringing legacy industrial hardware online.',
          tags: ['IoT', 'ERP', 'Siemens PLC', 'AI Agent'],
          highlights: [
            'Unified attendance, weighbridge, fleet tracking, inventory, payroll, and scheduling into a single platform',
            'Connected Siemens PLC controllers to a real-time dashboard — furnace temps visible on mobile',
            'Built-in AI agent for internal Q&A across all operational data',
            'Dramatically reduced management overhead for small-scale industrial operations',
          ],
        },
        {
          title: 'Wall Street Credit Analysis AI',
          description: 'An agentic AI system built for Wall Street, combining proprietary datasets with real-time public financial intelligence to assess credit asset risk and generate institutional-grade reports.',
          tags: ['Agentic AI', 'Finance', 'RAG', 'Real-Time Data'],
          highlights: [
            'Multi-agent architecture for autonomous research, analysis, and report generation',
            'Fuses internal proprietary data with live open-source financial feeds',
            'Produces comprehensive credit risk reports aligned with institutional standards',
            'Designed for speed and accuracy in high-stakes debt portfolio evaluation',
          ],
        },
      ],
    },
    team: {
      label: 'Who We Are',
      title: ['Meet Our ', 'Team'],
      subtitle: 'A tight-knit crew of engineers who love building things that matter.',
      members: [
        { role: 'Founder & Team Lead', bio: 'Former Humboldt Scholar with postdoc research at Stanford/SLAC. Now leads the AI Platform at Sinochem, delivering national-level AI projects from zero to production.' },
        { role: 'Software Developer', bio: 'University of Toronto graduate with nine years of development experience. Former CTO at a crypto startup, driving technical strategy and leading engineering teams through rapid growth cycles.' },
        { role: 'Software Developer', bio: 'University of Toronto graduate with nine years of full-stack development experience. Core contributor to Huawei\'s AI product line, building intelligent systems from the ground up.' },
        { role: 'Software Developer', bio: 'University of Waterloo graduate with nine years of hands-on engineering experience. Built and scaled backend systems at Amazon and Coinbase, specializing in distributed high-availability architectures.' },
      ],
    },
    cta: {
      title: ['Ready to Build Something ', 'Great'],
      subtitle: "We're always excited to partner with ambitious teams pushing the boundaries of what's possible.",
      button: 'Start a Conversation',
    },
    footer: {
      description: 'Engineering excellence delivered through careful attention to detail, robust architecture, and a deep understanding of your business needs.',
      contactTitle: 'Contact',
      rights: 'All rights reserved.',
    },
  },
  zh: {
    nav: { solutions: '解决方案', work: '项目案例', team: '团队', contact: '联系我们' },
    hero: {
      badge: 'AI驱动的企业级解决方案',
      title: ['我们构建', '可扩展的智能系统', '助力您的雄心'],
      subtitle: '专注于AI原生企业系统的精英工程团队。我们将传统工作流转化为智能自动化平台。',
      cta: '预约咨询',
      secondary: '查看项目',
    },
    services: {
      label: '我们的能力',
      title: ['核心', '技术'],
      items: [
        {
          title: '云架构与DevOps',
          description: '构建并优化可随业务增长而扩展的云基础设施。',
          features: ['Kubernetes容器编排', 'CI/CD流水线开发', '云成本优化', '高可用系统'],
        },
        {
          title: '全栈开发',
          description: '端到端开发稳健、可扩展的应用程序。',
          features: ['现代前端框架', 'API开发', '数据库设计', '实时系统'],
        },
        {
          title: 'AI与机器学习',
          description: '将前沿AI解决方案集成到您的产品中。',
          features: ['定制ML模型', '自然语言处理', '计算机视觉', 'MLOps与模型部署'],
        },
      ],
    },
    work: {
      label: '项目案例',
      title: ['精选', '作品'],
      items: [
        {
          title: '代理记账公司AI ERP系统',
          description: '为代理记账企业打造的全流程ERP平台，以AI原生系统替代碎片化工作流，覆盖从获客到报税的完整业务链。',
          tags: ['AI Agent', 'NL2SQL', 'ERP', '全栈'],
          highlights: [
            'AI电话营销与智能客服，实现自动化获客',
            '内部Agent完全掌握20年业务数据，支持高级NL2SQL查询',
            '全链路工作流：接单、工单流转、资料整理、合规申报',
            '深度对接工商登记与税务申报系统',
          ],
        },
        {
          title: '矿业企业统一ERP平台',
          description: '为西北矿业公司打造的一体化企业平台，整合多个分散的独立软件系统，并将传统工业硬件接入数字化管理。',
          tags: ['IoT', 'ERP', '西门子PLC', 'AI Agent'],
          highlights: [
            '统一考勤、司磅、车队管理、库存、薪资计算和排班功能',
            '打通西门子PLC控制器，实时仪表盘——手机查看炉温',
            '内置AI Agent，支持全业务数据的智能问答',
            '大幅降低中小型工业企业的管理成本',
          ],
        },
        {
          title: '华尔街债权分析AI系统',
          description: '面向华尔街的Agentic AI系统，融合内部数据集与实时公开金融信息，评估信贷资产风险并生成机构级分析报告。',
          tags: ['Agentic AI', '金融', 'RAG', '实时数据'],
          highlights: [
            '多Agent架构，自主完成调研、分析与报告生成',
            '融合内部专有数据与实时公开金融信息源',
            '输出符合机构标准的完整信用风险报告',
            '专为高风险债券组合评估设计，兼顾速度与准确性',
          ],
        },
      ],
    },
    team: {
      label: '关于我们',
      title: ['认识', '团队'],
      subtitle: '一支热爱创造、紧密协作的工程师团队。',
      members: [
        { role: '创始人 & 技术负责人', bio: '前洪堡学者，曾在斯坦福大学/SLAC国家加速器实验室从事博士后研究。现任中化学长三角科创中心AI平台负责人，主导国家级AI项目从零到一的完整落地。' },
        { role: '软件开发工程师', bio: '多伦多大学毕业，九年开发经验。曾任Crypto公司CTO，主导技术战略并带领工程团队经历快速增长。' },
        { role: '软件开发工程师', bio: '多伦多大学毕业，九年全栈开发经验。华为AI产品线核心贡献者，参与从零开始构建智能系统。' },
        { role: '软件开发工程师', bio: '滑铁卢大学毕业，九年工程实战经验。曾在亚马逊和Coinbase构建并扩展后端系统，专长于分布式高可用架构。' },
      ],
    },
    cta: {
      title: ['准备好构建', '伟大的产品'],
      subtitle: '我们始终期待与有雄心的团队合作，共同突破技术边界。',
      button: '开始对话',
    },
    footer: {
      description: '以匠心精神交付卓越工程——严谨的架构设计、细致的技术实现、深刻的业务理解。',
      contactTitle: '联系方式',
      rights: '保留所有权利。',
    },
  },
  it: {
    nav: { solutions: 'Soluzioni', work: 'Progetti', team: 'Team', contact: 'Contattaci' },
    hero: {
      badge: 'Soluzioni Aziendali basate su AI',
      title: ['Costruiamo', 'Software Scalabile', 'Per le Tue Ambizioni'],
      subtitle: "Team di ingegneri d'élite specializzato in sistemi aziendali AI-nativi. Trasformiamo i flussi di lavoro tradizionali in piattaforme intelligenti e automatizzate.",
      cta: 'Prenota una Consulenza',
      secondary: 'Scopri i Progetti',
    },
    services: {
      label: 'Cosa Facciamo',
      title: ['Le Nostre ', 'Competenze'],
      items: [
        {
          title: 'Architettura Cloud & DevOps',
          description: "Progettiamo e ottimizziamo infrastrutture cloud scalabili che crescono con il tuo business.",
          features: ['Kubernetes e Orchestrazione Container', 'Pipeline CI/CD', 'Ottimizzazione Costi Cloud', 'Sistemi ad Alta Disponibilità'],
        },
        {
          title: 'Sviluppo Full-Stack',
          description: 'Sviluppo end-to-end di applicazioni robuste e scalabili.',
          features: ['Framework Frontend Moderni', 'Sviluppo API', 'Progettazione Database', 'Sistemi Real-time'],
        },
        {
          title: 'AI & Machine Learning',
          description: 'Integriamo soluzioni AI all\'avanguardia nei tuoi prodotti.',
          features: ['Modelli ML Personalizzati', 'Elaborazione del Linguaggio Naturale', 'Computer Vision', 'MLOps e Deploy Modelli'],
        },
      ],
    },
    work: {
      label: 'I Nostri Progetti',
      title: ['Lavori ', 'Selezionati'],
      items: [
        {
          title: 'ERP con AI per Studi Contabili',
          description: "Piattaforma ERP completa per agenzie di contabilità, che sostituisce flussi di lavoro frammentati con un sistema AI-nativo che gestisce dall'acquisizione clienti alla dichiarazione fiscale.",
          tags: ['AI Agent', 'NL2SQL', 'ERP', 'Full-Stack'],
          highlights: [
            'Telemarketing e servizio clienti basati su AI per acquisizione automatica',
            'Agente interno con pieno controllo su 20 anni di dati aziendali tramite NL2SQL avanzato',
            'Flusso end-to-end: acquisizione ordini, instradamento task, elaborazione documenti e adempimenti fiscali',
            'Integrazione profonda con sistemi di registrazione aziendale e dichiarazione fiscale',
          ],
        },
        {
          title: 'ERP Unificato per Operazioni Minerarie',
          description: "Piattaforma aziendale consolidata per una società mineraria nella Cina nord-occidentale, che unifica diversi strumenti indipendenti in un unico sistema integrato — portando online anche l'hardware industriale legacy.",
          tags: ['IoT', 'ERP', 'Siemens PLC', 'AI Agent'],
          highlights: [
            'Presenze, pesa, gestione flotta, inventario, buste paga e turni unificati in una piattaforma',
            'Controller Siemens PLC connessi a una dashboard in tempo reale — temperature dei forni visibili da mobile',
            'Agente AI integrato per Q&A su tutti i dati operativi',
            'Riduzione drastica dei costi di gestione per operazioni industriali di piccola scala',
          ],
        },
        {
          title: 'AI per Analisi Creditizia — Wall Street',
          description: "Sistema AI agentico costruito per Wall Street, che combina dataset proprietari con intelligence finanziaria pubblica in tempo reale per valutare il rischio degli asset creditizi e generare report di livello istituzionale.",
          tags: ['Agentic AI', 'Finanza', 'RAG', 'Dati Real-Time'],
          highlights: [
            'Architettura multi-agente per ricerca, analisi e generazione report autonome',
            'Fusione di dati proprietari interni con feed finanziari open-source in tempo reale',
            'Report completi sul rischio creditizio conformi agli standard istituzionali',
            'Progettato per velocità e precisione nella valutazione di portafogli obbligazionari ad alto rischio',
          ],
        },
      ],
    },
    team: {
      label: 'Chi Siamo',
      title: ['Il Nostro ', 'Team'],
      subtitle: 'Un team affiatato di ingegneri appassionati di costruire soluzioni che contano.',
      members: [
        { role: 'Fondatore & Team Lead', bio: "Ex borsista Humboldt con ricerca post-dottorale a Stanford/SLAC. Attualmente dirige la Piattaforma AI presso Sinochem, realizzando progetti AI di livello nazionale da zero alla produzione." },
        { role: 'Sviluppatore Software', bio: "Laureato all'Università di Toronto con nove anni di esperienza. Ex CTO in una startup crypto, ha guidato la strategia tecnica e i team di sviluppo attraverso cicli di crescita rapida." },
        { role: 'Sviluppatore Software', bio: "Laureato all'Università di Toronto con nove anni di esperienza full-stack. Contributore chiave nella linea prodotti AI di Huawei, costruendo sistemi intelligenti da zero." },
        { role: 'Sviluppatore Software', bio: "Laureato all'Università di Waterloo con nove anni di esperienza ingegneristica. Ha costruito e scalato sistemi backend in Amazon e Coinbase, specializzato in architetture distribuite ad alta disponibilità." },
      ],
    },
    cta: {
      title: ['Pronti a Costruire Qualcosa di ', 'Grande'],
      subtitle: 'Siamo sempre entusiasti di collaborare con team ambiziosi che spingono i confini del possibile.',
      button: 'Iniziamo a Parlare',
    },
    footer: {
      description: "Eccellenza ingegneristica attraverso attenzione ai dettagli, architettura robusta e profonda comprensione delle esigenze del tuo business.",
      contactTitle: 'Contatti',
      rights: 'Tutti i diritti riservati.',
    },
  },
};

const teamMeta = [
  { name: 'Weiying He', avatar: '/avatars/weiying.svg', isFounder: true },
  { name: 'Lucas Shen', avatar: '/avatars/lucas.svg', isFounder: false },
  { name: 'Mi', avatar: '/avatars/mi.svg', isFounder: false },
  { name: 'Hunter Li', avatar: '/avatars/hunter.svg', isFounder: false },
];

const serviceIcons = [Database, Code, Cpu];

const langLabels = { en: 'EN', zh: '中文', it: 'IT' };

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

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState('en');
  const pageRef = useScrollReveal();
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden">

      {/* Navigation */}
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
            <a href="#solutions" className="nav-link text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{t.nav.solutions}</a>
            <a href="#work" className="nav-link text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{t.nav.work}</a>
            <a href="#team" className="nav-link text-gray-300 hover:text-white transition-colors text-sm tracking-wide">{t.nav.team}</a>
            <a href="mailto:info@onyxdevslab.com"
              className="px-5 py-2 rounded-full text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all hover:shadow-lg hover:shadow-blue-500/25">
              {t.nav.contact}
            </a>
            <LanguageSwitcher lang={lang} setLang={setLang} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20 animate-gradient" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
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
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
              {t.hero.title[0]}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                {t.hero.title[1]}
              </span>
              <br />
              {t.hero.title[2]}
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

      {/* Services Section */}
      <section id="solutions" className="py-28 relative">
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

      {/* Case Studies Section */}
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
              <div key={index} className="section-reveal" style={{ transitionDelay: `${index * 150}ms` }}>
                <CaseStudyCard {...study} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
                  role={t.team.members[index].role}
                  bio={t.team.members[index].bio}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
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

const CaseStudyCard = ({ title, description, tags, highlights }) => (
  <div className="glass rounded-2xl overflow-hidden transition-all duration-300 group hover:-translate-y-1">
    <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />
    <div className="p-8">
      <div className="mb-5 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/10">
            {tag}
          </span>
        ))}
      </div>
      <h3 className="text-lg font-bold mb-3 group-hover:text-blue-300 transition-colors">{title}</h3>
      <p className="text-gray-400 mb-5 text-sm leading-relaxed">{description}</p>
      <ul className="space-y-2.5">
        {highlights.map((item, index) => (
          <li key={index} className="flex items-start gap-2.5 text-gray-500 text-sm">
            <ChevronRight size={14} className="text-purple-400/60 mt-0.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const TeamMemberCard = ({ name, role, avatar, bio, isFounder }) => (
  <div className="glass rounded-2xl p-8 text-center transition-all duration-300 group hover:-translate-y-1">
    <div className="relative inline-block mb-6">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-50 blur transition-opacity duration-300" />
      <img src={avatar} alt={name} className="relative w-28 h-28 rounded-full border-2 border-white/10 group-hover:border-white/20 transition-colors" />
    </div>
    <h3 className="text-lg font-bold mb-1">{name}</h3>
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
      isFounder
        ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
        : 'bg-blue-500/10 text-blue-300 border border-blue-500/10'
    }`}>
      {role}
    </span>
    <p className="text-gray-500 text-sm leading-relaxed">{bio}</p>
  </div>
);

export default LandingPage;

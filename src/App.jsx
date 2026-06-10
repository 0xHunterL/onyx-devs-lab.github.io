import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Code, Cpu, Database, ChevronRight } from 'lucide-react';

const useScrollReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
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

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pageRef = useScrollReveal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
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
            <a href="#solutions" className="nav-link text-gray-300 hover:text-white transition-colors text-sm tracking-wide">Solutions</a>
            <a href="#work" className="nav-link text-gray-300 hover:text-white transition-colors text-sm tracking-wide">Our Work</a>
            <a href="#team" className="nav-link text-gray-300 hover:text-white transition-colors text-sm tracking-wide">Team</a>
            <a href="mailto:info@onyxdevslab.com"
              className="px-5 py-2 rounded-full text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all hover:shadow-lg hover:shadow-blue-500/25">
              Contact Us
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center px-6 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20 animate-gradient" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] animate-float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300 text-sm mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse-glow" />
              AI-Powered Enterprise Solutions
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
              We Build
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                Software That Scales
              </span>
              <br />
              With Your Ambition
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl">
              Elite engineering team specialized in AI-native enterprise systems.
              We turn legacy workflows into intelligent, automated platforms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:info@onyxdevslab.com"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 text-base font-medium">
                Schedule Consultation
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#work"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 transition-all duration-300 text-base text-gray-300 hover:text-white backdrop-blur-sm">
                View Our Work
              </a>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0e1a] to-transparent" />
      </header>

      {/* Services Section */}
      <section id="solutions" className="py-28 relative">
        <div className="container mx-auto px-6">
          <div className="section-reveal text-center mb-20">
            <span className="text-blue-400 text-sm font-medium tracking-[0.2em] uppercase">What We Do</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Expertise
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="section-reveal" style={{ transitionDelay: `${index * 150}ms` }}>
                <ServiceCard {...service} />
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
            <span className="text-purple-400 text-sm font-medium tracking-[0.2em] uppercase">Our Projects</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Selected{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Work
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((study, index) => (
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
            <span className="text-cyan-400 text-sm font-medium tracking-[0.2em] uppercase">Who We Are</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Meet Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Team
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
              A tight-knit crew of engineers who love building things that matter.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="section-reveal" style={{ transitionDelay: `${index * 150}ms` }}>
                <TeamMemberCard {...member} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.03] to-transparent" />
        {/* Decorative orbs */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] animate-float-delayed" />

        <div className="container mx-auto px-6 relative">
          <div className="section-reveal max-w-3xl mx-auto text-center glass rounded-3xl p-12 md:p-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Build Something{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Great
              </span>?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
              We're always excited to partner with ambitious teams pushing the boundaries
              of what's possible.
            </p>
            <a href="mailto:info@onyxdevslab.com"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 text-base font-medium">
              Start a Conversation
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
              <p className="text-gray-500 max-w-md leading-relaxed">
                Engineering excellence delivered through careful attention to detail,
                robust architecture, and a deep understanding of your business needs.
              </p>
            </div>
            <div className="md:text-right">
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-500 leading-relaxed">
                hello@onyxdevslab.com<br />
                22 Sin Ming Lane #06-76 Midview City<br />
                Singapore 573969
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Onyx Devs Lab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const ServiceCard = ({ icon: Icon, title, description, features }) => {
  return (
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
};

const CaseStudyCard = ({ title, description, tags, highlights }) => {
  return (
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
};

const TeamMemberCard = ({ name, role, avatar, bio }) => {
  return (
    <div className="glass rounded-2xl p-8 text-center transition-all duration-300 group hover:-translate-y-1">
      <div className="relative inline-block mb-6">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-50 blur transition-opacity duration-300" />
        <img
          src={avatar}
          alt={name}
          className="relative w-28 h-28 rounded-full border-2 border-white/10 group-hover:border-white/20 transition-colors"
        />
      </div>
      <h3 className="text-lg font-bold mb-1">{name}</h3>
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
        role.includes('Founder')
          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
          : 'bg-blue-500/10 text-blue-300 border border-blue-500/10'
      }`}>
        {role}
      </span>
      <p className="text-gray-500 text-sm leading-relaxed">{bio}</p>
    </div>
  );
};

const teamMembers = [
  {
    name: "Weiying He",
    role: "Founder & Team Lead",
    avatar: "/avatars/weiying.svg",
    bio: "PhD from UBC, former Humboldt Scholar with postdoc research at Max Planck Institute and Stanford/SLAC. Now leads the AI Platform at Sinochem, delivering national-level AI projects from zero to production."
  },
  {
    name: "Lucas Shen",
    role: "Software Developer",
    avatar: "/avatars/lucas.svg",
    bio: "University of Toronto graduate with nine years of development experience. Former CTO at a crypto startup, driving technical strategy and leading engineering teams through rapid growth cycles."
  },
  {
    name: "Mi",
    role: "Software Developer",
    avatar: "/avatars/mi.svg",
    bio: "University of Toronto graduate with nine years of full-stack development experience. Core contributor to Huawei's AI product line, building intelligent systems from the ground up."
  },
  {
    name: "Hunter Li",
    role: "Software Developer",
    avatar: "/avatars/hunter.svg",
    bio: "University of Waterloo graduate with nine years of hands-on engineering experience. Built and scaled backend systems at Amazon and Coinbase, specializing in distributed high-availability architectures."
  }
];

const services = [
  {
    icon: Database,
    title: "Cloud Architecture & DevOps",
    description: "Build and optimize scalable cloud infrastructure that grows with your business.",
    features: [
      "Kubernetes & Container Orchestration",
      "CI/CD Pipeline Development",
      "Cloud Cost Optimization",
      "High-Availability Systems"
    ]
  },
  {
    icon: Code,
    title: "Full-Stack Development",
    description: "End-to-end development of robust, scalable applications.",
    features: [
      "Modern Frontend Frameworks",
      "API Development",
      "Database Design",
      "Real-time Systems"
    ]
  },
  {
    icon: Cpu,
    title: "AI & Machine Learning",
    description: "Integrate cutting-edge AI solutions into your products.",
    features: [
      "Custom ML Models",
      "Natural Language Processing",
      "Computer Vision",
      "MLOps & Model Deployment"
    ]
  }
];

const caseStudies = [
  {
    title: "AI-Powered ERP for Accounting Firms",
    description: "A full-cycle ERP platform for bookkeeping agencies, replacing fragmented workflows with an AI-native system that handles everything from client acquisition to tax filing.",
    tags: ["AI Agent", "NL2SQL", "ERP", "Full-Stack"],
    highlights: [
      "AI-driven telemarketing and customer service for automated client acquisition",
      "Internal agent with full command of 20 years of business data via advanced NL2SQL",
      "End-to-end workflow: order intake, task routing, document processing, and compliance filing",
      "Deep integration with business registration and tax reporting systems"
    ]
  },
  {
    title: "Unified ERP for Mining Operations",
    description: "A consolidated enterprise platform for a mining company in Northwest China, replacing a patchwork of standalone tools with one integrated system — and bringing legacy industrial hardware online.",
    tags: ["IoT", "ERP", "Siemens PLC", "AI Agent"],
    highlights: [
      "Unified attendance, weighbridge, fleet tracking, inventory, payroll, and scheduling into a single platform",
      "Connected Siemens PLC controllers to a real-time dashboard — furnace temps visible on mobile",
      "Built-in AI agent for internal Q&A across all operational data",
      "Dramatically reduced management overhead for small-scale industrial operations"
    ]
  },
  {
    title: "Wall Street Credit Analysis AI",
    description: "An agentic AI system built for Wall Street, combining proprietary datasets with real-time public financial intelligence to assess credit asset risk and generate institutional-grade reports.",
    tags: ["Agentic AI", "Finance", "RAG", "Real-Time Data"],
    highlights: [
      "Multi-agent architecture for autonomous research, analysis, and report generation",
      "Fuses internal proprietary data with live open-source financial feeds",
      "Produces comprehensive credit risk reports aligned with institutional standards",
      "Designed for speed and accuracy in high-stakes debt portfolio evaluation"
    ]
  }
];

export default LandingPage;

/* eslint-disable react/prop-types */
import { ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { localizeMethodName, methodologyGroups } from '../../data/caseAnalysis';

const copy = {
  zh: {
    eyebrow: 'ONYX FDE DELIVERY SYSTEM',
    title: '当问题无法在会议室里定义，',
    accent: '我们进入业务现场',
    intro: 'FDE 是面向复杂企业问题的深度合作方式。咨询诊断、系统设计与一线实施由同一支团队负责：先建立事实，再定位约束，最后用可验证的系统改变真实工作。',
    stats: [['32', '种分析工具'], ['6', '个交付阶段'], ['多行业', 'FDE 交付经验']],
    route: '每个项目都沿同一条证据链推进',
    proof: '每一步都形成可审阅的中间产物，下一步决策有来源，最终结果有验证方式。',
    cta: '查看 FDE 项目的完整分析路线',
  },
  en: {
    eyebrow: 'ONYX FDE DELIVERY SYSTEM',
    title: 'When the problem cannot be specified in a meeting, ',
    accent: 'we go into the field.',
    intro: 'FDE is our deep engagement model for complex operating problems. One senior team owns consulting diagnosis, system design, frontline implementation, and validation.',
    stats: [['32', 'analysis tools'], ['6', 'delivery stages'], ['Multi-sector', 'FDE experience']],
    route: 'One evidence chain across every engagement',
    proof: 'Each stage creates a reviewable artifact, so decisions have provenance and outcomes have a validation plan.',
    cta: 'Explore the case studies',
  },
  it: {
    eyebrow: 'ONYX FDE DELIVERY SYSTEM',
    title: 'Quando il problema non può essere definito in riunione, ',
    accent: 'entriamo nel lavoro reale.',
    intro: 'FDE è la nostra modalità più profonda per problemi operativi complessi. Lo stesso team senior guida diagnosi, progettazione, implementazione sul campo e verifica.',
    stats: [['32', 'strumenti'], ['6', 'fasi'], ['Multi-settore', 'esperienza FDE']],
    route: 'Una catena di evidenze per ogni progetto',
    proof: 'Ogni fase produce un risultato verificabile: le decisioni hanno una fonte e gli esiti un piano di validazione.',
    cta: 'Esplora i casi',
  },
};

const stageText = (group, lang) => {
  if (lang === 'zh') return { title: group.title, description: group.description };
  const descriptions = {
    en: {
      discover: 'Understand the job, actors, and real path before defining a solution.',
      measure: 'Turn interviews, events, and data into an explicit current-state baseline.',
      diagnose: 'Separate symptoms from root causes and find the system constraint.',
      design: 'Translate business outcomes into an operating and technical target state.',
      govern: 'Define controls, ownership, permissions, and human decision rights.',
      validate: 'Test with evidence and metrics without presenting capability as impact.',
    },
    it: {
      discover: 'Comprendere attività, attori e percorso reale prima della soluzione.',
      measure: 'Trasformare interviste, eventi e dati in una baseline esplicita.',
      diagnose: 'Separare i sintomi dalle cause e individuare il vincolo di sistema.',
      design: 'Tradurre gli obiettivi nel modello operativo e tecnico futuro.',
      govern: 'Definire controlli, responsabilità, permessi e decisioni umane.',
      validate: 'Verificare con evidenze e metriche, distinguendo capacità e impatto.',
    },
  };
  return { title: group.en, description: descriptions[lang][group.id] };
};

const MethodologySection = ({ lang }) => {
  const t = copy[lang] || copy.en;

  return (
    <section id="methodology" className="relative scroll-mt-20 overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.035] to-transparent" />
      <div className="absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[120px]" />
      <div className="container relative mx-auto px-6">
        <div className="section-reveal grid gap-9 border-b border-white/10 pb-12 md:gap-12 md:pb-16 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">{t.eyebrow}</span>
            <h2 className="mt-5 max-w-4xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {t.title}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">{t.accent}</span>
            </h2>
            <p className="mt-7 max-w-3xl text-base leading-8 text-gray-400 md:text-lg">{t.intro}</p>
          </div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {t.stats.map(([value, label]) => (
              <div key={label} className="bg-[#0b101d] px-3 py-5 text-center md:px-5">
                <div className="font-mono text-2xl font-semibold text-white md:text-3xl">{value}</div>
                <div className="mt-1 text-[11px] leading-tight text-gray-500 md:text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-reveal mt-10 md:mt-14">
          <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <h3 className="text-xl font-semibold text-white md:text-2xl">{t.route}</h3>
            <p className="max-w-xl text-sm leading-relaxed text-gray-500">{t.proof}</p>
          </div>
          <ol className="methodology-mobile-rail flex md:grid md:overflow-hidden md:rounded-2xl md:border md:border-white/10 md:bg-white/[0.025] md:grid-cols-2 xl:grid-cols-6">
            {methodologyGroups.map((group, index) => {
              const text = stageText(group, lang);
              return (
                <li key={group.id} className="group relative w-[82vw] max-w-[320px] shrink-0 snap-start rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:w-auto md:max-w-none md:rounded-none md:border-0 md:border-b md:border-r md:[&:nth-child(even)]:border-r-0 xl:border-b-0 xl:[&:nth-child(even)]:border-r xl:last:border-r-0">
                  <div className="mb-6 flex items-center justify-between md:mb-8">
                    <span className="font-mono text-xs text-cyan-300/70">{group.index}</span>
                    {index < methodologyGroups.length - 1 && <ArrowDownRight size={16} className="text-white/20 transition-colors group-hover:text-cyan-300/70" />}
                  </div>
                  <h4 className="text-base font-semibold text-white">{text.title}</h4>
                  <p className="mt-3 text-xs leading-6 text-gray-400 md:min-h-[4.5rem] md:text-gray-500">{text.description}</p>
                  <div className="mt-5 space-y-2 border-t border-white/5 pt-4">
                    {group.methods.map((method) => (
                      <div key={method} className="flex items-start gap-2 text-[11px] leading-5 text-gray-400">
                        <CheckCircle2 size={12} className="mt-1 shrink-0 text-blue-400/70" />
                        <span>{localizeMethodName(method, lang)}</span>
                      </div>
                    ))}
                  </div>
                </li>
              );
            })}
          </ol>
          <a href="#work" className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition-colors hover:text-white">
            {t.cta}
            <ArrowDownRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;

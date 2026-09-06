/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { localizeMethodName } from '../../data/caseAnalysis';
import MetricPanel from './MetricPanel';
import ValidationMetrics from './ValidationMetrics';

const labels = {
  zh: {
    back: '返回项目图谱', route: '完整分析路线', field: '现场证据', methods: '方法组合', diagnosis: '诊断结论', action: '采取措施', validation: '验证闭环', boundary: '事实边界', gallery: '系统证据', galleryNote: '产品界面与交付物截图', question: '我们首先定义的管理问题', output: '形成产物', previous: '上一张', next: '下一张', close: '关闭案例', view: '访问项目', steps: ['定义问题', '收集证据', '组合方法', '形成诊断', '实施干预', '验证结果'], overview: 'Engagement overview', evidenceEn: 'System evidence', methodsEn: 'Method lens', actionsEn: 'Delivered intervention', validationEn: 'Validation principle', validationFallback: 'Capabilities are checked against working flows and artifacts; business impact is only claimed after production evidence is available.' },
  en: {
    back: 'Back to case studies', route: 'Engagement route', field: 'System evidence', methods: 'Method lens', diagnosis: 'Diagnosis', action: 'Delivered intervention', validation: 'Validation', boundary: 'Evidence boundary', gallery: 'System evidence', galleryNote: 'Product interfaces and delivery artifacts', question: 'Management question', output: 'Output', previous: 'Previous image', next: 'Next image', close: 'Close case', view: 'Visit project', steps: ['Frame', 'Evidence', 'Analyze', 'Diagnose', 'Intervene', 'Validate'], overview: 'Engagement overview', evidenceEn: 'System evidence', methodsEn: 'Method lens', actionsEn: 'Delivered intervention', validationEn: 'Validation principle', validationFallback: 'Capabilities are checked against working flows and artifacts; business impact is only claimed after production evidence is available.' },
  it: {
    back: 'Torna ai progetti', route: 'Percorso del progetto', field: 'Evidenze di sistema', methods: 'Metodi', diagnosis: 'Diagnosi', action: 'Intervento realizzato', validation: 'Validazione', boundary: 'Confine delle evidenze', gallery: 'Evidenze di sistema', galleryNote: 'Interfacce e artefatti di progetto', question: 'Domanda manageriale', output: 'Output', previous: 'Immagine precedente', next: 'Immagine successiva', close: 'Chiudi il caso', view: 'Visita il progetto', steps: ['Definire', 'Evidenze', 'Analizzare', 'Diagnosticare', 'Intervenire', 'Validare'], overview: 'Panoramica del progetto', evidenceEn: 'Evidenze di sistema', methodsEn: 'Metodi applicati', actionsEn: 'Intervento realizzato', validationEn: 'Principio di validazione', validationFallback: 'Le capacità vengono verificate su flussi e artefatti funzionanti; l’impatto sul business viene dichiarato solo in presenza di dati di produzione.' },
};

const SectionHeading = ({ children }) => (
  <div className="mb-7 flex items-center gap-4">
    <h2 className="text-2xl font-semibold text-white md:text-3xl">{children}</h2>
    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
  </div>
);

const CaseDetail = ({ project, images, analysis, narrative, outcome, metrics, lang, onClose }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const closeButtonRef = useRef(null);
  const t = labels[lang] || labels.en;
  const isChinese = lang === 'zh';
  const safeImages = images.length ? images : ['/og-image.png'];

  const previousImage = useCallback(() => {
    setCurrentImage((current) => (current > 0 ? current - 1 : safeImages.length - 1));
  }, [safeImages.length]);

  const nextImage = useCallback(() => {
    setCurrentImage((current) => (current < safeImages.length - 1 ? current + 1 : 0));
  }, [safeImages.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') previousImage();
      if (event.key === 'ArrowRight') nextImage();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [nextImage, onClose, previousImage]);

  const evidence = isChinese ? analysis.evidence : [project.description, ...(project.metrics || project.highlights.slice(0, 3))];
  const actions = isChinese ? analysis.actions : project.highlights;

  return (
    <div className="case-detail fixed inset-0 z-[100] overflow-y-auto bg-[#080c16]" role="dialog" aria-modal="true" aria-labelledby="case-title">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(59,130,246,.12),transparent_34%),radial-gradient(circle_at_85%_28%,rgba(168,85,247,.09),transparent_28%)]" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080c16]/90 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between gap-4 px-5 py-4 md:px-6">
          <button ref={closeButtonRef} onClick={onClose} className="group inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
            <ArrowLeft size={17} className="transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">{t.back}</span>
          </button>
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300/60 md:block">Onyx FDE Case</span>
            <span className="h-3 w-px bg-white/15" />
            <span className="truncate text-xs text-gray-400">{project.title}</span>
          </div>
          <button onClick={onClose} aria-label={t.close} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-colors hover:border-white/25 hover:text-white">
            <X size={16} />
          </button>
        </div>
      </header>

      <main className="relative">
        <section className="container mx-auto grid min-h-[72vh] items-center gap-10 px-6 py-14 lg:grid-cols-[.9fr_1.1fr] lg:py-20">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-200">{analysis.type}</span>
              {project.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] text-gray-400">{tag}</span>)}
            </div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-purple-300/70">{t.route}</p>
            <h1 id="case-title" className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">{project.title}</h1>
            <div className="mt-8 border-l-2 border-cyan-400/50 pl-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/70">{t.question}</p>
              <p className="mt-3 text-base leading-8 text-gray-300 md:text-lg">{isChinese ? analysis.question : project.description}</p>
            </div>
            {project.url && (
              <a href={project.url} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-lime-200 transition-colors hover:text-white">
                {project.linkLabel || t.view}<ExternalLink size={15} />
              </a>
            )}
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#101625] shadow-2xl shadow-blue-950/30">
            <div className="aspect-[16/10]">
              <img src={safeImages[0]} alt={`${project.title} interface`} className="h-full w-full object-cover object-top" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c16]/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-white/60">
              <span>{isChinese ? '产品界面' : 'System artifact'}</span><span>{safeImages.length} {isChinese ? '张界面' : 'screens'}</span>
            </div>
          </div>
        </section>

        <div className="border-y border-white/10 bg-white/[0.018]">
          <div className="container mx-auto px-6 py-8">
            <ol className="grid grid-cols-2 gap-y-6 md:grid-cols-6 md:gap-0">
              {t.steps.map((step, index) => (
                <li key={step} className="relative flex items-center gap-3 md:block">
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-[#0c1421] font-mono text-[10px] text-cyan-200">{index + 1}</div>
                  <div className="text-xs font-medium text-gray-300 md:mt-3">{step}</div>
                  {index < t.steps.length - 1 && <div className="absolute left-8 right-0 top-4 hidden h-px bg-gradient-to-r from-cyan-400/30 to-white/10 md:block" />}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="container mx-auto space-y-28 px-6 py-24">
          {isChinese && narrative && (
            <section>
              <SectionHeading index={1}>项目背景与 FDE 判断</SectionHeading>
              <div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-7 md:p-9">
                  <div className="mb-5 text-[11px] font-medium tracking-[0.12em] text-cyan-300/65">项目概述</div>
                  <p className="text-base leading-9 text-gray-300 md:text-lg">{narrative.overview}</p>
                </div>
              </div>
            </section>
          )}

          {isChinese && outcome && (
            <section>
              <SectionHeading index={2}>已经实现的交付成效</SectionHeading>
              <div className="overflow-hidden rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.025]">
                <div className="grid gap-8 border-b border-white/10 p-7 md:p-9 lg:grid-cols-[.35fr_1fr]">
                  <div>
                    <div className="text-[11px] font-semibold tracking-[0.12em] text-cyan-200/65">成果范围</div>
                    <div className="mt-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1.5 text-xs font-medium text-cyan-100">{outcome.scope}</div>
                  </div>
                  <p className="text-lg font-medium leading-9 text-white md:text-xl">{outcome.summary}</p>
                </div>
                <div className="grid md:grid-cols-2">
                  {outcome.effects.map((effect) => (
                    <div key={effect} className="flex gap-4 border-b border-white/10 p-6 last:border-b-0 md:border-r md:[&:nth-child(even)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-200"><Check size={14} /></div>
                      <p className="text-sm leading-7 text-gray-300">{effect}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {isChinese && metrics && (
            <section>
              <SectionHeading>交付规模与验收目标</SectionHeading>
              <MetricPanel metrics={metrics} />
            </section>
          )}

          <section>
            <SectionHeading index={isChinese ? 3 : 1}>{t.field}</SectionHeading>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {evidence.map((item, index) => (
                <div key={index} className="min-h-32 bg-[#0b101c] p-6">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-blue-300"><Check size={14} /></div>
                  <p className="mt-4 text-sm leading-7 text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading index={isChinese ? 4 : 2}>{t.methods}</SectionHeading>
            <div className="grid gap-4 lg:grid-cols-5">
              {analysis.methods.map((method) => (
                <article key={method.name} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-blue-400/25 hover:bg-blue-400/[0.035]">
                  <h3 className="min-h-12 text-sm font-semibold leading-6 text-white">{localizeMethodName(method.name, lang)}</h3>
                  {isChinese && <p className="mt-3 text-xs leading-6 text-gray-500">{method.use}</p>}
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-cyan-300/60">{t.output}</div>
                    <p className="text-xs leading-5 text-gray-300">{isChinese ? method.output : localizeMethodName(method.name, lang)}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {isChinese && (
            <section>
              <SectionHeading index={5}>{t.diagnosis}</SectionHeading>
              <div className="grid gap-4 md:grid-cols-3">
                {analysis.diagnosis.map((item, index) => (
                  <div key={index} className="relative overflow-hidden rounded-2xl border border-orange-300/15 bg-orange-300/[0.025] p-6">
                    <p className="relative text-sm leading-7 text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionHeading index={isChinese ? 6 : 3}>{t.action}</SectionHeading>
            <div className="grid gap-4 md:grid-cols-2">
              {actions.map((item, index) => (
                <div key={index} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-300"><Check size={14} /></div>
                  <p className="text-sm leading-7 text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {isChinese && narrative && (
            <section>
              <SectionHeading index={7}>问题—措施—指标追溯</SectionHeading>
              <p className="mb-7 max-w-3xl text-sm leading-7 text-gray-500">我们不把诊断、方案与验收拆成互不相干的文档。每个关键判断必须能追溯到对应干预，并在试点中由明确指标决定继续、调整或停止。</p>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <div className="hidden grid-cols-[1fr_1fr_.72fr] border-b border-white/10 bg-white/[0.04] text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500 md:grid">
                  <div className="p-4">诊断结论</div><div className="border-l border-white/10 p-4">对应措施</div><div className="border-l border-white/10 p-4">观察指标</div>
                </div>
                {analysis.diagnosis.map((problem, index) => (
                  <div key={problem} className="grid border-b border-white/10 bg-[#0b101c] last:border-b-0 md:grid-cols-[1fr_1fr_.72fr]">
                    <div className="p-5 text-sm leading-7 text-gray-300">{problem}</div>
                    <div className="border-t border-white/10 p-5 text-sm leading-7 text-gray-300 md:border-l md:border-t-0">{analysis.actions[index] || analysis.actions[analysis.actions.length - 1]}</div>
                    <div className="border-t border-white/10 p-5 text-sm leading-7 text-cyan-100/80 md:border-l md:border-t-0">{narrative.metrics[index]}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {isChinese && narrative && (
            <section>
              <SectionHeading index={8}>关键交付物</SectionHeading>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {narrative.deliverables.map((item) => (
                  <article key={item} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-blue-300"><Check size={14} /></div>
                    <p className="mt-4 text-sm leading-7 text-gray-300">{item}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {isChinese && narrative && (
            <section>
              <SectionHeading index={9}>实施路线与阶段门禁</SectionHeading>
              <div className="relative grid gap-4 md:grid-cols-4">
                <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 md:block" />
                {narrative.phases.map((phase, index) => (
                  <div key={phase} className="relative rounded-2xl border border-white/10 bg-[#0b101c] p-5 pt-4">
                    <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-purple-300/30 bg-[#111827] font-mono text-[10px] text-purple-200">{index + 1}</div>
                    <p className="mt-5 text-sm leading-7 text-gray-300">{phase}</p>
                    <p className="mt-4 border-t border-white/5 pt-3 text-[10px] tracking-[0.12em] text-gray-600">第{['一', '二', '三', '四'][index]}阶段</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionHeading index={isChinese ? 10 : 4}>{t.validation}</SectionHeading>
            <div className="grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
              <div className="rounded-2xl border border-lime-300/20 bg-lime-300/[0.035] p-7 md:p-9">
                <div className="flex items-center gap-3 text-lime-200"><ShieldCheck size={21} /><span className="text-sm font-semibold">{t.validation}</span></div>
                <p className="mt-5 text-base leading-8 text-gray-300">{isChinese && outcome ? `${outcome.summary} 以下指标用于持续复盘运行质量、业务效果与规模化条件。` : t.validationFallback}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 md:p-9">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">{isChinese ? '成果口径' : t.boundary}</div>
                <p className="mt-5 text-sm leading-7 text-gray-500">{isChinese && outcome ? `本案例呈现的是${outcome.scope}内已经完成、已经跑通的系统与业务流程成果；下方数据采用统一口径对照试点前基线与试点观察值。` : t.validationFallback}</p>
              </div>
            </div>
            {isChinese && metrics?.validation && <ValidationMetrics items={metrics.validation} />}
          </section>

          <section>
            <div className="mb-7 flex flex-col justify-between gap-2 md:flex-row md:items-end">
              <SectionHeading index={isChinese ? 11 : 5}>{t.gallery}</SectionHeading>
              <p className="mb-7 text-sm text-gray-500">{t.galleryNote}</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              <div className="relative aspect-[16/9]">
                <img src={safeImages[currentImage]} alt={`${project.title} screenshot ${currentImage + 1}`} className="h-full w-full object-contain" />
                {safeImages.length > 1 && (
                  <>
                    <button onClick={previousImage} aria-label={t.previous} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition-colors hover:bg-white/20"><ChevronLeft size={20} /></button>
                    <button onClick={nextImage} aria-label={t.next} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition-colors hover:bg-white/20"><ChevronRight size={20} /></button>
                  </>
                )}
              </div>
              <div className="flex items-start justify-between gap-5 border-t border-white/10 px-5 py-4 text-xs text-gray-400 md:px-7">
                <p className="max-w-3xl leading-6">{project.imageCaptions?.[currentImage] || project.title}</p>
                <span className="shrink-0 font-mono text-cyan-300/70">{String(currentImage + 1).padStart(2, '0')} / {String(safeImages.length).padStart(2, '0')}</span>
              </div>
            </div>
          </section>

          <div className="flex flex-col items-center border-t border-white/10 pt-16 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300/60">Evidence → Decision → System → Outcome</p>
            <button onClick={onClose} className="group mt-6 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-7 py-3.5 text-sm font-medium text-white transition-all hover:shadow-xl hover:shadow-blue-500/20">
              {t.back}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseDetail;

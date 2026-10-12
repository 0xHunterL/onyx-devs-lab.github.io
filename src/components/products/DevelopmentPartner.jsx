/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  MessageCircle,
  Layers3,
  Code2,
  GitBranch,
  CheckCheck,
  Paperclip,
  ShieldCheck,
  X,
} from "lucide-react";

const content = {
  zh: {
    eyebrow: "FEATURED / 最新构建",
    name: "微信开发搭档",
    title: ["微信里说需求。", "项目里见改动。"],
    intro:
      "把日常对话接到真正的开发工作流。客户不用打开开发工具，也不用一次把需求写完；在熟悉的微信客服里说明问题，开发搭档会收集上下文、推进实现，并把结果带回原会话。",
    cta: "聊聊如何接入",
    demo: "看看它如何工作",
    steps: ["说出需求", "汇总上下文", "实现与验证", "提交 GitHub", "回复结果"],
    stepNotes: [
      "微信客服 · 文字 / 附件",
      "OpenClaw · 连续消息合组",
      "Codex · 项目代码与测试",
      "改动可追溯 · 保留记录",
      "原会话续聊 · 任务可查看",
    ],
    demoLabel: "交互演示 · 不是在线开发入口",
    scenarios: ["睿盈 · 财务服务", "晋惠 · 矿企系统"],
    messages: [
      [
        "我点开欠费明细，网络不通时却显示没有欠费。",
        "联系人和会计两处都检查一下，失败时要能重试。",
      ],
      [
        "司磅表格好像导入成功了，但页面又提示上传失败。",
        "希望进入记录第一页；刷新失败也别让我重复导入。",
      ],
    ],
    demoReply: [
      "已汇总为一个需求。对应项目完成修复，回归验证 20 项通过，代码已提交 GitHub。",
      "已汇总为一个需求。对应项目完成修复，回归验证 7 项通过，代码已提交 GitHub。",
    ],
    collecting: "两条消息 → 一个开发需求",
    complete: "实现完成 · 等待你继续追问",
    followup: "那刚才这个改动部署了吗？",
    answer:
      "这轮没有部署。继续使用刚才的 Session，修复、测试与 GitHub 记录都在。",
    features: [
      ["你可以分几条说", "连续消息合并，附件下载完成后再交给开发任务。"],
      [
        "每个项目，有自己的上下文",
        "不同客服绑定不同服务；相关追问延续原来的开发 Session。",
      ],
      [
        "开发发生，也留下证据",
        "查看任务进度、测试、GitHub 提交；较大的改动进入审批流程。",
      ],
    ],
    proof: "从两条真实项目链路里走出来",
    proofIntro:
      "欠费查询错误提示、司磅导入误报失败：两个小问题，走完同一条开发闭环。",
    shots: ["晋惠：真实任务进度与交付记录", "睿盈：真实修复结果与测试说明"],
    evidence:
      "2026.10.12 双项目验收 · 微信收发 API 为模拟，其余主要链路真实执行；这轮已提交 GitHub，未发布业务服务。",
    metrics: [
      ["14", "条客户消息"],
      ["4", "个合组任务"],
      ["27", "项回归复跑通过"],
      ["2", "个独立项目会话"],
    ],
    close: "关闭截图",
    prev: "上一张",
    next: "下一张",
  },
  en: {
    eyebrow: "FEATURED / LATEST BUILD",
    name: "WeChat Dev Partner",
    title: ["Describe it in WeChat.", "See it in your product."],
    intro:
      "A familiar conversation, connected to a real development workflow. Describe a problem across messages and attachments; the partner collects context, advances implementation, and returns the result to the same conversation.",
    cta: "Discuss an integration",
    demo: "See how it works",
    steps: [
      "Describe",
      "Collect context",
      "Build & test",
      "Commit to GitHub",
      "Reply",
    ],
    stepNotes: [
      "WeChat customer service",
      "OpenClaw · message buffer",
      "Codex · project and tests",
      "Traceable code changes",
      "Continue in the same session",
    ],
    demoLabel: "Interactive example · not a live development entry",
    scenarios: ["Ruiying · Finance", "Jinhui · Mining"],
    messages: [
      [
        "The unpaid-fee popup says no debt when the network fails.",
        "Check both contact and accountant details. Add retry.",
      ],
      [
        "The import seems successful, but reports an upload failure.",
        "Open page one. A refresh failure should not suggest importing again.",
      ],
    ],
    demoReply: [
      "Request collected. Fix completed, 20 regression cases passed, and code committed to GitHub.",
      "Request collected. Fix completed, 7 regression cases passed, and code committed to GitHub.",
    ],
    collecting: "Collecting the messages",
    complete: "Complete · ready for your next question",
    followup: "Was that change deployed?",
    answer:
      "Not in this run. We continue in the same session, with the fix, tests, and GitHub record retained.",
    features: [
      [
        "Say it across messages",
        "Consecutive messages are grouped; attachments finish downloading before the task starts.",
      ],
      [
        "Context belongs to the project",
        "Each assistant maps to a service. Follow-up questions continue the same development session.",
      ],
      [
        "Work comes with evidence",
        "Review progress, tests, and GitHub commits. Larger changes can enter an approval flow.",
      ],
    ],
    proof: "Built through two real project workflows",
    proofIntro:
      "Unpaid-detail error states and a misleading import failure: two small issues, one complete development loop.",
    shots: [
      "Jinhui · real task progress and delivery record",
      "Ruiying · real fix and test report",
    ],
    evidence:
      "Validation on 2026-10-12. WeChat delivery APIs were mocked; the remaining core pipeline ran for real. Committed to GitHub; no business deployment in this run.",
    metrics: [
      ["14", "customer messages"],
      ["4", "grouped tasks"],
      ["27", "regression cases passed"],
      ["2", "project sessions"],
    ],
    close: "Close screenshot",
    prev: "Previous",
    next: "Next",
  },
};
content.it = {
  ...content.en,
  eyebrow: "IN EVIDENZA / NUOVO PROGETTO",
  intro:
    "Una conversazione familiare, collegata a un vero flusso di sviluppo. Descrivi il problema con messaggi e allegati: il partner raccoglie il contesto, realizza la modifica e riporta il risultato nella stessa conversazione.",
  steps: [
    "Descrivere",
    "Raccogliere contesto",
    "Realizzare e testare",
    "Commit su GitHub",
    "Rispondere",
  ],
  stepNotes: [
    "Assistenza clienti WeChat",
    "OpenClaw · messaggi raggruppati",
    "Codex · progetto e test",
    "Modifiche tracciabili",
    "Continua nella stessa sessione",
  ],
  demoLabel: "Esempio interattivo · non è un ingresso operativo",
  scenarios: ["Ruiying · Finanza", "Jinhui · Industria"],
  messages: [
    [
      "La finestra mostra nessun debito quando la rete non risponde.",
      "Controlla i dettagli del contatto e del contabile. Aggiungi un nuovo tentativo.",
    ],
    [
      "L’importazione sembra riuscita, ma segnala un errore.",
      "Apri la prima pagina. Un errore di aggiornamento non deve far ripetere l’importazione.",
    ],
  ],
  demoReply: [
    "Richiesta raccolta. Correzione completata, 20 test superati e commit su GitHub.",
    "Richiesta raccolta. Correzione completata, 7 test superati e commit su GitHub.",
  ],
  collecting: "Messaggi raccolti in una richiesta",
  complete: "Completato · pronto per la prossima domanda",
  followup: "La modifica è stata pubblicata?",
  answer:
    "Non in questa prova. Continuiamo nella stessa sessione: correzione, test e commit restano disponibili.",
  features: [
    [
      "Puoi inviare più messaggi",
      "I messaggi vengono raggruppati; gli allegati completano il download prima di avviare il lavoro.",
    ],
    [
      "Il contesto appartiene al progetto",
      "Ogni assistente è associato a un servizio. Le domande successive continuano la stessa sessione.",
    ],
    [
      "Il lavoro lascia evidenze",
      "Progressi, test e commit sono verificabili. Le modifiche più grandi possono richiedere approvazione.",
    ],
  ],
  proofIntro:
    "Errori nei dettagli dei debiti e nell’importazione: due piccoli problemi, un ciclo completo di sviluppo.",
  shots: [
    "Jinhui · avanzamento e consegna reali",
    "Ruiying · correzione e test reali",
  ],
  evidence:
    "Verifica del 12 ottobre 2026: API WeChat simulate, restante catena principale eseguita realmente. Commit su GitHub, nessuna pubblicazione dei servizi in questa prova.",
  metrics: [
    ["14", "messaggi del cliente"],
    ["4", "richieste raggruppate"],
    ["27", "test superati"],
    ["2", "sessioni di progetto"],
  ],
  name: "Partner di sviluppo su WeChat",
  title: ["Descrivilo su WeChat.", "Vedilo nel tuo prodotto."],
  cta: "Parliamo dell’integrazione",
  demo: "Come funziona",
  proof: "Due progetti reali, un ciclo completo",
  close: "Chiudi immagine",
};
const icons = [MessageCircle, Layers3, Code2, GitBranch, CheckCheck];

export default function DevelopmentPartner({ lang }) {
  const t = content[lang];
  const [scenario, setScenario] = useState(0);
  const [continued, setContinued] = useState(false);
  const [image, setImage] = useState(null);
  const closeButton = useRef(null);
  useEffect(() => {
    if (image === null) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") setImage(null);
      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [image]);
  const shots = [
    "/projects/wechat-dev-partner/jinhui-delivery.png",
    "/projects/wechat-dev-partner/ruiying-delivery.png",
  ];
  return (
    <section
      id="featured"
      className="dev-partner"
      aria-labelledby="dev-partner-heading"
    >
      <div className="dev-partner-heading">
        <div>
          <p className="dev-eyebrow">{t.eyebrow}</p>
          <p className="dev-partner-name">
            {t.name}
            <span>01</span>
          </p>
          <h2 id="dev-partner-heading">
            {t.title[0]}
            <br />
            <span>{t.title[1]}</span>
          </h2>
        </div>
        <div className="dev-partner-intro">
          <p>{t.intro}</p>
          <a href="#contact">
            {t.cta}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
      <div className="dev-partner-stage">
        <div className="dev-partner-description">
          <p className="dev-eyebrow">CONVERSATION → DELIVERY</p>
          <h3>{t.demo}</h3>
          {t.features.map(([title, desc], i) => (
            <div className="dev-partner-feature" key={title}>
              {i === 0 ? (
                <Paperclip size={20} />
              ) : i === 1 ? (
                <Layers3 size={20} />
              ) : (
                <ShieldCheck size={20} />
              )}
              <div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="dev-partner-chat">
          <div className="dev-partner-chat-head">
            <span className="dev-dot" />
            <strong>{t.name}</strong>
            <span>CONVERSATION</span>
          </div>
          <div
            className="dev-partner-switch"
            role="group"
            aria-label={lang === "zh" ? "选择演示项目" : "Demo project"}
          >
            {t.scenarios.map((label, i) => (
              <button
                key={label}
                aria-pressed={scenario === i}
                className={scenario === i ? "active" : ""}
                onClick={() => {
                  setScenario(i);
                  setContinued(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="dev-partner-messages" aria-live="polite">
            {t.messages[scenario].map((m) => (
              <p className="dev-chat-user" key={m}>
                {m}
              </p>
            ))}
            <div className="dev-chat-buffer">
              <Layers3 size={14} />
              {t.collecting}
            </div>
            <p className="dev-chat-assistant">{t.demoReply[scenario]}</p>
            {continued ? (
              <>
                <p className="dev-chat-user">{t.followup}</p>
                <p className="dev-chat-assistant">{t.answer}</p>
              </>
            ) : (
              <button
                className="dev-chat-followup"
                onClick={() => setContinued(true)}
              >
                {t.followup}
                <ArrowRight size={14} />
              </button>
            )}
          </div>
          <div className="dev-chat-status">
            <CheckCheck size={14} />
            {t.complete}
          </div>
          <p className="dev-chat-disclaimer">{t.demoLabel}</p>
        </div>
      </div>
      <ol
        className="dev-partner-flow"
        aria-label={lang === "zh" ? "开发链路流程图" : "Development workflow"}
      >
        {t.steps.map((step, i) => {
          const Icon = icons[i];
          return (
            <li key={step}>
              <span className="dev-flow-icon">
                <Icon size={22} />
              </span>
              <span className="dev-flow-number">0{i + 1}</span>
              <strong>{step}</strong>
              <p>{t.stepNotes[i]}</p>
              {i < 4 && <ArrowRight className="dev-flow-arrow" size={18} />}
            </li>
          );
        })}
      </ol>
      <div className="dev-partner-evidence">
        <div className="dev-evidence-heading">
          <div>
            <p className="dev-eyebrow">REAL WORK. TRACEABLE RESULTS.</p>
            <h3>{t.proof}</h3>
            <p>{t.proofIntro}</p>
          </div>
          <span className="dev-evidence-date">
            VALIDATED
            <br />
            2026.10.12
          </span>
        </div>
        <dl className="dev-evidence-metrics">
          {t.metrics.map(([v, k]) => (
            <div key={k}>
              <dt>{v}</dt>
              <dd>{k}</dd>
            </div>
          ))}
        </dl>
        <div className="dev-evidence-shots">
          {shots.map((src, i) => (
            <button
              key={src}
              onClick={() => setImage(i)}
              aria-label={t.shots[i]}
            >
              <div className="dev-shot-bar">
                <span />
                <span />
                <span />
                <span>{i === 0 ? "JINHUI" : "RUIYING"} / DELIVERY LOG</span>
                <ArrowUpRight size={16} />
              </div>
              <img
                src={src}
                alt={t.shots[i]}
                loading="lazy"
                width="1140"
                height="740"
              />
              <span className="dev-shot-caption">
                {t.shots[i]}
                <ArrowUpRight size={16} />
              </span>
            </button>
          ))}
        </div>
        <p className="dev-evidence-note">{t.evidence}</p>
      </div>
      {image !== null && (
        <div
          className="dev-image-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={t.shots[image]}
          onClick={() => setImage(null)}
        >
          <button
            ref={closeButton}
            className="dev-image-close"
            onClick={() => setImage(null)}
            aria-label={t.close}
          >
            <X />
          </button>
          <img
            src={shots[image]}
            alt={t.shots[image]}
            onClick={(e) => e.stopPropagation()}
          />
          <p>{t.shots[image]}</p>
        </div>
      )}
    </section>
  );
}

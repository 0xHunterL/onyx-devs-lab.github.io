/* eslint-disable react/prop-types */
import { useState } from "react";
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
    scenarios: ["睿盈 · 财务服务", "晋惠 · 矿企系统"],
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
    scenarios: ["Ruiying · Finance", "Jinhui · Mining"],
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
  scenarios: ["Ruiying · Finanza", "Jinhui · Industria"],
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
  name: "Partner di sviluppo su WeChat",
  title: ["Descrivilo su WeChat.", "Vedilo nel tuo prodotto."],
  cta: "Parliamo dell’integrazione",
  demo: "Come funziona",
};
const icons = [MessageCircle, Layers3, Code2, GitBranch, CheckCheck];

export default function DevelopmentPartner({ lang }) {
  const t = content[lang];
  const [scenario, setScenario] = useState(0);
  const screenshots = ["/projects/wechat-dev-partner/ruiying-wechat.png", "/projects/wechat-dev-partner/jinhui-wechat.png"];
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
        <div className="dev-wechat-showcase">
          <p className="dev-eyebrow">{lang === 'zh' ? '真实微信对话' : lang === 'it' ? 'CONVERSAZIONI WECHAT REALI' : 'REAL WECHAT CONVERSATIONS'}</p>
          <div className="dev-partner-switch" role="group" aria-label={lang === 'zh' ? '选择客服截图' : 'Select conversation'}>
            {t.scenarios.map((label, i) => (
              <button key={label} aria-pressed={scenario === i} className={scenario === i ? "active" : ""} onClick={() => setScenario(i)}>{label}</button>
            ))}
          </div>
          <figure>
            <a href={screenshots[scenario]} target="_blank" rel="noopener noreferrer" aria-label={lang === 'zh' ? '打开完整微信对话截图' : 'Open full WeChat screenshot'}>
              <img src={screenshots[scenario]} alt={lang === 'zh' ? `${t.scenarios[scenario]}：客户提出搜索提示需求，助手受理并回复上线结果` : `${t.scenarios[scenario]}: customer request, acknowledgement and delivery reply`} width="992" height={scenario === 0 ? "1908" : "1394"} />
            </a>
            <figcaption>{lang === 'zh' ? '客户提出需求 → 后台处理 → 微信收到结果 · 点击查看原图' : lang === 'it' ? 'Richiesta → sviluppo → risposta su WeChat · Apri l’immagine' : 'Request → development → result in WeChat · Open full image'}</figcaption>
          </figure>
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
    </section>
  );
}

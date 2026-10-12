import PropTypes from 'prop-types';
import { ArrowRight, MessageCircle, Users } from 'lucide-react';

const CUSTOMER_SERVICE_URL = 'https://work.weixin.qq.com/kfid/kfcf376517ba4956420';
const copy = {
  zh: {
    ai: 'Onyx AI 微信客服', aiTag: 'AI 接待',
    aiDesc: '了解团队、服务与案例，在微信里持续交流需求。跟进登记由你确认。',
    aiBoundary: '非真人客服；报价与预约需团队确认。',
    aiAction: '打开微信客服', aiAlt: '微信扫码联系 Onyx AI 小助手',
    human: '直接联系团队', humanTag: '真人沟通',
    humanDesc: '讨论项目范围、报价与合作细节，由团队本人回复。',
    humanNote: '可沟通 30 分钟初步项目评估，时间另行确认。',
    humanAlt: '扫码添加 Onyx 团队真人微信', humanId: '微信号：m453301909',
    web: '也可以先在网页里了解团队与案例，无需切换到微信。', webAction: '打开网页 AI 助手',
    fullQr: '查看完整二维码',
  },
  en: {
    ai: 'Onyx AI on WeChat', aiTag: 'AI reception',
    aiDesc: 'Explore our team, services and cases. Continue discussing your needs in WeChat and confirm any follow-up registration.',
    aiBoundary: 'An AI assistant. Quotes and appointments require team confirmation.',
    aiAction: 'Open WeChat support', aiAlt: 'Scan in WeChat to contact the Onyx AI assistant',
    human: 'Talk directly to our team', humanTag: 'Human conversation',
    humanDesc: 'Discuss project scope, pricing and collaboration with a team member.',
    humanNote: 'Ask about a 30-minute project assessment; availability is confirmed separately.',
    humanAlt: 'Scan to add the Onyx team on WeChat', humanId: 'WeChat ID: m453301909',
    web: 'You can also explore our team and cases here, without switching to WeChat.', webAction: 'Open website AI chat',
    fullQr: 'View full QR code',
  },
  it: {
    ai: 'Onyx AI su WeChat', aiTag: 'Assistente AI',
    aiDesc: 'Scopri il team, i servizi e i casi. Continua su WeChat a descrivere le tue esigenze e conferma la registrazione per il follow-up.',
    aiBoundary: 'È un assistente AI. Preventivi e appuntamenti richiedono conferma del team.',
    aiAction: 'Apri assistenza WeChat', aiAlt: 'Scansiona su WeChat per contattare Onyx AI',
    human: 'Parla direttamente con il team', humanTag: 'Conversazione con una persona',
    humanDesc: 'Discuti ambito del progetto, preventivo e collaborazione con un membro del team.',
    humanNote: 'Chiedi una valutazione iniziale di 30 minuti; la disponibilità va confermata.',
    humanAlt: 'Scansiona per aggiungere il team Onyx su WeChat', humanId: 'ID WeChat: m453301909',
    web: 'Puoi anche scoprire il team e i casi qui, senza passare a WeChat.', webAction: 'Apri la chat AI del sito',
    fullQr: 'Visualizza il codice QR completo',
  },
};

export default function ContactChannels({ lang }) {
  const t = copy[lang] || copy.en;
  return (
    <div className="mb-8 text-left">
      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        <article className="flex flex-col items-center text-center">
          <span className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-green-300"><MessageCircle size={15} aria-hidden="true" />{t.aiTag}</span>
          <h3 className="text-xl font-semibold text-white">{t.ai}</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">{t.aiDesc}</p>
          <a href="/contact/onyx-wecom-customer-service.png" target="_blank" rel="noopener noreferrer" aria-label={t.fullQr} className="my-5 block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400">
            <img src="/contact/onyx-wecom-customer-service.png" alt={t.aiAlt} width="700" height="908" loading="lazy" decoding="async" className="h-auto w-60 max-w-full rounded-xl" />
          </a>
          <p className="mb-4 text-xs leading-5 text-gray-400">{t.aiBoundary}</p>
          <a href={CUSTOMER_SERVICE_URL} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">{t.aiAction}<ArrowRight size={16} aria-hidden="true" /></a>
        </article>
        <article className="flex flex-col items-center border-t border-white/10 pt-8 text-center md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <span className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-300"><Users size={15} aria-hidden="true" />{t.humanTag}</span>
          <h3 className="text-xl font-semibold text-white">{t.human}</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">{t.humanDesc}</p>
          <a href="/wechat-qr.png" target="_blank" rel="noopener noreferrer" aria-label={t.fullQr} className="my-5 flex md:min-h-[311px] items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
            <img src="/wechat-qr.png" alt={t.humanAlt} width="208" height="208" loading="lazy" decoding="async" className="h-52 w-52 rounded-xl bg-white object-contain p-2" />
          </a>
          <p className="mb-4 max-w-sm text-xs leading-5 text-gray-400">{t.humanNote}</p>
          <p className="mt-auto flex min-h-12 items-center text-sm font-medium text-gray-200">{t.humanId}</p>
        </article>
      </div>
      <div className="mt-8 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center">
        <p className="text-sm leading-6 text-gray-400">{t.web}</p>
        <button type="button" onClick={() => window.dispatchEvent(new Event('onyx:open-chat'))} className="inline-flex min-h-12 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-blue-300 transition-colors hover:bg-white/5 hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{t.webAction}<ArrowRight size={16} aria-hidden="true" /></button>
      </div>
    </div>
  );
}

ContactChannels.propTypes = { lang: PropTypes.string.isRequired };

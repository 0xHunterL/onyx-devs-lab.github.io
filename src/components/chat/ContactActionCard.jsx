import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { CalendarDays, Check, Copy, Send, ShieldCheck } from 'lucide-react'

function isChinese(text) {
  return /[\u3400-\u9fff]/.test(text || '')
}

const ContactActionCard = ({ action, chatApiUrl, sessionId, visitorId }) => {
  const zh = isChinese(action.suggested_summary)
  const [copied, setCopied] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [contact, setContact] = useState('')
  const [summary, setSummary] = useState(action.suggested_summary || '')
  const [preferredTime, setPreferredTime] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const submissionId = useRef(crypto.randomUUID())

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText(action.wechat_id)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setError(zh ? '复制失败，请手动长按微信号复制。' : 'Copy failed. Please copy the ID manually.')
    }
  }

  const submitLead = async (event) => {
    event.preventDefault()
    if (!consent) {
      setError(zh ? '请先确认同意保存并联系你。' : 'Please confirm consent before submitting.')
      return
    }
    setStatus('submitting')
    setError('')
    try {
      const response = await fetch(chatApiUrl.replace(/\/chat$/, '/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          visitor_id: visitorId,
          submission_id: submissionId.current,
          contact,
          requirement_summary: summary,
          appointment_requested: action.appointment_requested,
          preferred_time: preferredTime || null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          consent: true,
        }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(typeof body.detail === 'string' ? body.detail : `HTTP ${response.status}`)
      }
      setStatus('success')
    } catch (submitError) {
      setStatus('idle')
      setError(submitError.message)
    }
  }

  if (status === 'success') {
    return (
      <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] p-3" role="status">
        <div className="flex items-start gap-2.5">
          <Check className="mt-0.5 shrink-0 text-emerald-400" size={17} />
          <div>
            <p className="font-medium text-emerald-100">{zh ? '需求已经记录' : 'Request recorded'}</p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-100/60">
              {zh ? `团队将通过你提供的联系方式跟进；也可以直接添加微信 ${action.wechat_id}。` : 'The team will follow up through the contact you provided.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#11182a]">
      <div className="flex gap-3 p-3">
        <img
          src={action.qr_path}
          alt={zh ? 'Onyx 团队微信二维码' : 'Onyx team WeChat QR code'}
          className="h-24 w-24 shrink-0 rounded-lg bg-white object-cover p-1"
        />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-white">{zh ? '直接和团队沟通' : 'Talk to the team'}</p>
          <p className="mt-1 break-all text-xs text-white/50">WeChat · {action.wechat_id}</p>
          <button
            type="button"
            onClick={copyWechat}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-medium text-white/75 transition-colors hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-blue-400/60"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? (zh ? '已复制' : 'Copied') : (zh ? '复制微信号' : 'Copy WeChat ID')}
          </button>
        </div>
      </div>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex min-h-12 w-full items-center justify-center gap-2 border-t border-white/10 bg-gradient-to-r from-blue-500/15 to-purple-500/15 px-3 text-sm font-medium text-blue-200 transition-colors hover:from-blue-500/25 hover:to-purple-500/25 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400/60"
        >
          <CalendarDays size={16} />
          {action.appointment_requested
            ? (zh ? '留下联系方式和期望时间' : 'Leave contact and preferred time')
            : (zh ? '把需求留给团队' : 'Send your request to the team')}
        </button>
      ) : (
        <form onSubmit={submitLead} className="space-y-3 border-t border-white/10 p-3">
          <label className="block text-xs font-medium text-white/70">
            {zh ? '你的联系方式' : 'Your contact'}
            <input
              value={contact}
              onChange={event => setContact(event.target.value)}
              required
              maxLength={200}
              placeholder={zh ? '微信号、手机号或邮箱' : 'WeChat, phone or email'}
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-blue-400/60 focus:ring-1 focus:ring-blue-400/40"
            />
          </label>
          <label className="block text-xs font-medium text-white/70">
            {zh ? '需求概述' : 'Request summary'}
            <textarea
              value={summary}
              onChange={event => setSummary(event.target.value)}
              required
              maxLength={4000}
              rows={3}
              className="mt-1.5 w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm leading-relaxed text-white outline-none focus:border-blue-400/60 focus:ring-1 focus:ring-blue-400/40"
            />
          </label>
          {action.appointment_requested && (
            <label className="block text-xs font-medium text-white/70">
              {zh ? '方便沟通的时间（选填）' : 'Preferred time (optional)'}
              <input
                value={preferredTime}
                onChange={event => setPreferredTime(event.target.value)}
                maxLength={200}
                placeholder={zh ? '例如：工作日下午 2–5 点' : 'e.g. Weekdays, 2–5 PM'}
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-blue-400/60 focus:ring-1 focus:ring-blue-400/40"
              />
            </label>
          )}
          <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-white/50">
            <input
              type="checkbox"
              checked={consent}
              onChange={event => setConsent(event.target.checked)}
              className="mt-0.5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-400/50"
            />
            <span>{zh ? '我同意 Onyx 保存以上信息，并由团队成员联系我。' : 'I agree that Onyx may save this information and contact me.'}</span>
          </label>
          {error && <p className="text-xs text-red-300" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-3 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-wait disabled:opacity-50"
          >
            {status === 'submitting' ? <ShieldCheck className="animate-pulse" size={16} /> : <Send size={16} />}
            {status === 'submitting' ? (zh ? '正在安全提交…' : 'Submitting…') : (zh ? '同意并提交' : 'Agree and submit')}
          </button>
        </form>
      )}
    </div>
  )
}

ContactActionCard.propTypes = {
  action: PropTypes.shape({
    wechat_id: PropTypes.string.isRequired,
    qr_path: PropTypes.string.isRequired,
    appointment_requested: PropTypes.bool,
    suggested_summary: PropTypes.string,
  }).isRequired,
  chatApiUrl: PropTypes.string.isRequired,
  sessionId: PropTypes.string.isRequired,
  visitorId: PropTypes.string.isRequired,
}

export default ContactActionCard

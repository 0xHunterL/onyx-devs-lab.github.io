import { useState } from 'react'
import PropTypes from 'prop-types'
import { Check, Copy, Phone } from 'lucide-react'

const ContactActionCard = ({ action }) => {
  const zh = /[\u3400-\u9fff]/.test(action.suggested_summary || '')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const qrPath = action.qr_path
  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText(action.wechat_id)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setError(zh ? '复制失败，请手动长按微信号复制。' : 'Copy failed. Please copy the ID manually.')
    }
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#11182a]">
      <div className="flex gap-3 p-3">
        <a href={qrPath} target="_blank" rel="noopener noreferrer" aria-label={zh ? '查看完整微信二维码' : 'View full WeChat QR code'} className="shrink-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/60">
          <img src={qrPath} alt="Onyx 团队微信二维码" className="h-24 w-24 rounded-lg bg-white object-contain p-1" />
        </a>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-white">{zh ? '直接和团队沟通' : 'Talk to the team'}</p>
          <p className="mt-1 break-all text-xs text-white/50">WeChat · {action.wechat_id}</p>
          <button type="button" onClick={copyWechat} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-medium text-white/75 transition-colors hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-blue-400/60">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? (zh ? '已复制' : 'Copied') : (zh ? '复制微信号' : 'Copy WeChat ID')}
          </button>
        </div>
      </div>
      <a href="tel:+8618923743756" className="flex min-h-12 items-center justify-center gap-2 border-t border-white/10 px-3 text-sm text-blue-200 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400/60">
        <Phone size={16} />18923743756
      </a>
      {error && <p role="alert" className="p-3 text-xs text-red-300">{error}</p>}
    </div>
  )
}

ContactActionCard.propTypes = {
  action: PropTypes.shape({
    wechat_id: PropTypes.string.isRequired,
    qr_path: PropTypes.string.isRequired,
    suggested_summary: PropTypes.string,
  }).isRequired,
}

export default ContactActionCard

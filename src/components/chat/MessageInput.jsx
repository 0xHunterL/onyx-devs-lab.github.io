import { useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Send, Square } from 'lucide-react'

const MessageInput = ({ onSend, isLoading, onStop, privacyText, privacyLinkLabel, placeholder = 'Ask anything...' }) => {
  const textareaRef = useRef(null)

  const handleSubmit = useCallback(() => {
    const value = textareaRef.current?.value.trim()
    if (!value || isLoading) return
    onSend(value)
    if (textareaRef.current) {
      textareaRef.current.value = ''
      textareaRef.current.style.height = 'auto'
    }
  }, [onSend, isLoading])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  const handleInput = useCallback(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`
    }
  }, [])

  return (
    <div className="px-3 py-2.5 border-t border-white/[0.08]">
      <div className="flex items-end gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 focus-within:border-blue-400/40 transition-colors">
        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/30 text-sm resize-none min-h-[24px] max-h-[120px] leading-relaxed"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
          placeholder={placeholder}
          maxLength={12000}
          rows={1}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={isLoading}
        />
        {isLoading ? (
          <button
            className="w-11 h-11 rounded-lg bg-white/10 text-white/60 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
            onClick={onStop}
            title="Stop"
          >
            <Square size={14} />
          </button>
        ) : (
          <button
            className="w-11 h-11 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center hover:from-blue-400 hover:to-purple-400 transition-all flex-shrink-0"
            onClick={handleSubmit}
            title="Send"
          >
            <Send size={14} />
          </button>
        )}
      </div>
      <p className="mt-1.5 px-1 text-[11px] leading-relaxed text-white/40">
        {privacyText}{' '}
        <a
          href="/privacy.html"
          target="_blank"
          rel="noreferrer"
          className="text-blue-300/80 underline decoration-blue-300/30 underline-offset-2 hover:text-blue-200"
        >
          {privacyLinkLabel}
        </a>
      </p>
    </div>
  )
}

MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onStop: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  privacyText: PropTypes.string.isRequired,
  privacyLinkLabel: PropTypes.string.isRequired,
}

export default MessageInput

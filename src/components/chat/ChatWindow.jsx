import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Menu, Plus, Minus } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import SessionList from './SessionList'

const ChatWindow = ({ chatApiUrl, sessionOps, onClose }) => {
  const [showSessions, setShowSessions] = useState(false)
  const [sessionError, setSessionError] = useState('')
  const isChinese = new URLSearchParams(window.location.search).get('lang') === 'zh'

  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    deleteSession,
    startNewSession,
  } = sessionOps

  const {
    messages,
    isLoading,
    sendMessage,
    stopGeneration,
    loadSession,
    clearMessages,
  } = useChat({
    chatApiUrl,
    sessionId: currentSessionId,
    sessionOps,
  })

  const handleSelectSession = useCallback((id) => {
    setCurrentSessionId(id)
    loadSession(id)
    setShowSessions(false)
  }, [setCurrentSessionId, loadSession])

  const handleNewChat = useCallback(() => {
    startNewSession()
    clearMessages()
    setShowSessions(false)
  }, [startNewSession, clearMessages])

  const handleDeleteSession = useCallback(async (id) => {
    setSessionError('')
    try {
      await deleteSession(id)
      if (currentSessionId === id) {
        clearMessages()
      }
    } catch {
      setSessionError('暂时无法从服务器删除，请稍后重试。')
    }
  }, [deleteSession, currentSessionId, clearMessages])

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
          <span className="text-white/90 text-sm font-medium" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
            Onyx AI
          </span>
        </div>
        <div className="flex gap-0.5">
          <button
            className="w-11 h-11 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
            onClick={() => setShowSessions(!showSessions)}
            title="History"
          >
            <Menu size={16} />
          </button>
          <button
            className="w-11 h-11 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
            onClick={handleNewChat}
            title="New chat"
          >
            <Plus size={16} />
          </button>
          <button
            className="w-11 h-11 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
            onClick={onClose}
            title="Minimize"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        chatApiUrl={chatApiUrl}
        visitorId={sessionOps.visitorId}
        welcomeMessage={isChinese
          ? '你好，我是 Onyx AI。可以问我项目经验、合作方式，或直接描述你想解决的业务问题。'
          : 'Hi, I’m Onyx AI. Ask about our work, engagement models, or describe the business problem you want to solve.'}
      />

      {/* Input */}
      <MessageInput
        onSend={sendMessage}
        isLoading={isLoading}
        onStop={stopGeneration}
        privacyText={isChinese
          ? '匿名对话保存 30 天以保持连续服务，可在历史中删除。'
          : 'Anonymous chats are retained for 30 days and can be deleted from History.'}
        privacyLinkLabel={isChinese ? '隐私说明' : 'Privacy'}
      />

      {/* Session sidebar */}
      {showSessions && (
        <SessionList
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelect={handleSelectSession}
          onDelete={handleDeleteSession}
          onNewChat={handleNewChat}
          onClose={() => setShowSessions(false)}
          error={sessionError}
        />
      )}
    </div>
  )
}

ChatWindow.propTypes = {
  chatApiUrl: PropTypes.string.isRequired,
  sessionOps: PropTypes.shape({
    sessions: PropTypes.arrayOf(PropTypes.object).isRequired,
    visitorId: PropTypes.string.isRequired,
    currentSessionId: PropTypes.string,
    setCurrentSessionId: PropTypes.func.isRequired,
    deleteSession: PropTypes.func.isRequired,
    startNewSession: PropTypes.func.isRequired,
    createSession: PropTypes.func.isRequired,
    getMessages: PropTypes.func.isRequired,
    addMessage: PropTypes.func.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ChatWindow

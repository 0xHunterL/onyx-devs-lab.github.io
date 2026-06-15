import React, { useState, useCallback } from 'react'
import { Menu, Plus, Minus } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import SessionList from './SessionList'

const ChatWindow = ({ relayUrl, apiKey, sessionOps, onClose }) => {
  const [showSessions, setShowSessions] = useState(false)

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
    relayUrl,
    apiKey,
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

  const handleDeleteSession = useCallback((id) => {
    deleteSession(id)
    if (currentSessionId === id) {
      clearMessages()
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
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
            onClick={() => setShowSessions(!showSessions)}
            title="History"
          >
            <Menu size={16} />
          </button>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
            onClick={handleNewChat}
            title="New chat"
          >
            <Plus size={16} />
          </button>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
            onClick={onClose}
            title="Minimize"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} />

      {/* Input */}
      <MessageInput
        onSend={sendMessage}
        isLoading={isLoading}
        onStop={stopGeneration}
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
        />
      )}
    </div>
  )
}

export default ChatWindow

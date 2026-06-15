import React, { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useLocalSessions } from '../../hooks/useLocalSessions'
import ChatWindow from './ChatWindow'

const RELAY_URL = import.meta.env.VITE_RELAY_URL || 'https://brother.mimimiai.com'
const API_KEY = import.meta.env.VITE_RELAY_API_KEY || 'onyx-R6RASZDJHcwI3-IgQIGQV8TrXrt3uSNsR1jz670lCMM'

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const sessionOps = useLocalSessions()

  return (
    <>
      {/* Floating trigger button */}
      <button
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-110 transition-all duration-300 z-[9998] cursor-pointer ${
          isOpen ? 'scale-0 pointer-events-none' : 'scale-100'
        }`}
        onClick={() => setIsOpen(true)}
        title="Chat with Onyx AI"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed z-[9999] bottom-0 right-0 w-full h-full md:bottom-6 md:right-6 md:w-[420px] md:h-[600px] md:max-h-[calc(100vh-48px)] md:rounded-xl border-0 md:border border-white/[0.08] bg-[#0a0e1a]/[0.97] md:bg-[#0a0e1a]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden animate-chat-slide-up">
          <ChatWindow
            relayUrl={RELAY_URL}
            apiKey={API_KEY}
            sessionOps={sessionOps}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  )
}

export default ChatWidget

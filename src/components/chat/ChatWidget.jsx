import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useLocalSessions } from '../../hooks/useLocalSessions'
import ChatWindow from './ChatWindow'

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL
  || 'https://chat.mimimiai.com/v1/assistants/onyx/chat'

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const sessionOps = useLocalSessions()

  return (
    <>
      {/* Floating trigger button */}
      <button
        className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-gradient-to-r from-blue-500/95 to-purple-500/95 text-white shadow-lg shadow-blue-500/25 backdrop-blur hover:shadow-blue-500/40 active:scale-95 md:bottom-6 md:right-6 md:h-14 md:w-14 md:hover:scale-110 transition-all duration-300 z-[90] cursor-pointer ${
          isOpen ? 'scale-0 pointer-events-none' : 'scale-100'
        }`}
        onClick={() => setIsOpen(true)}
        title="Chat with Onyx AI"
        aria-label="打开 Onyx AI 对话"
      >
        <MessageCircle size={22} />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed z-[9999] bottom-0 right-0 w-full h-full md:bottom-6 md:right-6 md:w-[420px] md:h-[600px] md:max-h-[calc(100vh-48px)] md:rounded-xl border-0 md:border border-white/[0.08] bg-[#0a0e1a]/[0.97] md:bg-[#0a0e1a]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden animate-chat-slide-up">
          <ChatWindow
            chatApiUrl={CHAT_API_URL}
            sessionOps={sessionOps}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  )
}

export default ChatWidget

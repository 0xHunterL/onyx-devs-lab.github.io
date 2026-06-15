import React, { useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Bot } from 'lucide-react'

function cleanCJKSpacing(text) {
  text = text.replace(/([一-鿿])\s+([一-鿿])/g, '$1$2')
  text = text.replace(/([一-鿿])\s+([，。、！？：；）》」』】])/g, '$1$2')
  text = text.replace(/\*\* +/g, '**')
  text = text.replace(/ +\*\*/g, '**')
  return text
}

const ToolStatusIndicator = ({ statuses }) => (
  <div className="flex flex-col gap-1 mb-2">
    {statuses.map((ts, i) => (
      <div key={i} className={`flex items-center gap-1.5 text-xs ${ts.status === 'executing' ? 'text-blue-400' : 'text-green-400'}`}>
        <span className={ts.status === 'executing' ? 'animate-spin' : ''}>
          {ts.status === 'executing' ? '⟳' : '✓'}
        </span>
        <span>{ts.status === 'executing' ? `Querying ${ts.name}...` : `${ts.name} done`}</span>
      </div>
    ))}
  </div>
)

const MessageList = ({ messages, welcomeMessage = "Hi! I'm Onyx AI. Ask me anything about our services." }) => {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <Bot size={24} className="text-blue-400" />
        </div>
        <p className="text-white/40 text-sm max-w-[280px] leading-relaxed">{welcomeMessage}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 chat-scrollbar">
      {messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl rounded-br-sm'
                  : 'bg-white/[0.05] border border-white/[0.08] text-white/90 rounded-xl rounded-bl-sm'
              }`}
            >
              {msg.toolStatuses && msg.toolStatuses.length > 0 && (
                <ToolStatusIndicator statuses={msg.toolStatuses} />
              )}
              {msg.role === 'assistant' && msg.isStreaming && !msg.content ? (
                <div className="flex items-center gap-1.5 py-1">
                  <span className="chat-thinking-dot" style={{ animationDelay: '0ms' }} />
                  <span className="chat-thinking-dot" style={{ animationDelay: '150ms' }} />
                  <span className="chat-thinking-dot" style={{ animationDelay: '300ms' }} />
                </div>
              ) : msg.content && (
                msg.role === 'assistant' ? (
                  <div className="chat-markdown">
                    <Markdown remarkPlugins={[remarkGfm]}>{cleanCJKSpacing(msg.content)}</Markdown>
                    {msg.isStreaming && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: 6,
                          height: 16,
                          background: '#60a5fa',
                          marginLeft: 2,
                          verticalAlign: 'text-bottom',
                          animation: 'chat-blink 1s infinite',
                        }}
                      />
                    )}
                  </div>
                ) : (
                  msg.content
                )
              )}
            </div>
          </div>
        ))}
      <div ref={endRef} />
    </div>
  )
}

export default MessageList

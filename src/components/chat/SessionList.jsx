import React from 'react'
import { Plus, X, Trash2 } from 'lucide-react'

const SessionList = ({ sessions, currentSessionId, onSelect, onDelete, onNewChat, onClose }) => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-[#0a0e1a] animate-chat-slide-right">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
        <span className="text-white/80 text-sm font-medium">History</span>
        <div className="flex gap-1">
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
            onClick={onNewChat}
            title="New chat"
          >
            <Plus size={16} />
          </button>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
            onClick={onClose}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 chat-scrollbar">
        {sessions.map(s => (
          <div
            key={s.id}
            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
              s.id === currentSessionId
                ? 'bg-blue-500/10 border border-blue-500/20'
                : 'hover:bg-white/[0.04] border border-transparent'
            }`}
            onClick={() => onSelect(s.id)}
          >
            <span className="text-white/70 text-sm truncate flex-1 mr-2">{s.title}</span>
            <button
              className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-white/[0.06] transition-all flex-shrink-0"
              onClick={e => {
                e.stopPropagation()
                onDelete(s.id)
              }}
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="py-8 text-center text-white/30 text-sm">
            No conversations yet
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionList

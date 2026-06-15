import { useState, useCallback } from 'react'

const SESSIONS_KEY = 'onyx-chat-sessions'
const MSGS_PREFIX = 'onyx-chat-msgs-'

function readJSON(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useLocalSessions() {
  const [sessions, setSessions] = useState(() => readJSON(SESSIONS_KEY))
  const [currentSessionId, setCurrentSessionId] = useState(null)

  const persistSessions = useCallback((next) => {
    setSessions(next)
    writeJSON(SESSIONS_KEY, next)
  }, [])

  const createSession = useCallback((firstMessage) => {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const title = firstMessage.slice(0, 50) || 'New Chat'
    const session = { id, title, messageCount: 0, createdAt: now, updatedAt: now }
    const next = [session, ...readJSON(SESSIONS_KEY)]
    persistSessions(next)
    writeJSON(MSGS_PREFIX + id, [])
    return id
  }, [persistSessions])

  const deleteSession = useCallback((id) => {
    const next = readJSON(SESSIONS_KEY).filter(s => s.id !== id)
    persistSessions(next)
    localStorage.removeItem(MSGS_PREFIX + id)
    if (currentSessionId === id) setCurrentSessionId(null)
  }, [currentSessionId, persistSessions])

  const getMessages = useCallback((sessionId) => {
    return readJSON(MSGS_PREFIX + sessionId)
  }, [])

  const addMessage = useCallback((sessionId, message) => {
    const msgs = readJSON(MSGS_PREFIX + sessionId)
    msgs.push(message)
    writeJSON(MSGS_PREFIX + sessionId, msgs)

    const allSessions = readJSON(SESSIONS_KEY)
    const updated = allSessions.map(s =>
      s.id === sessionId
        ? { ...s, messageCount: msgs.length, updatedAt: new Date().toISOString() }
        : s
    )
    persistSessions(updated)
  }, [persistSessions])

  const updateMessage = useCallback((sessionId, messageId, updates) => {
    const msgs = readJSON(MSGS_PREFIX + sessionId)
    const idx = msgs.findIndex(m => m.id === messageId)
    if (idx !== -1) {
      msgs[idx] = { ...msgs[idx], ...updates }
      writeJSON(MSGS_PREFIX + sessionId, msgs)
    }
  }, [])

  const startNewSession = useCallback(() => {
    setCurrentSessionId(null)
  }, [])

  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createSession,
    deleteSession,
    getMessages,
    addMessage,
    updateMessage,
    startNewSession,
  }
}

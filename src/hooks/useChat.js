import { useState, useCallback, useRef } from 'react'

const MAX_API_MESSAGES = 120
const MAX_MESSAGE_CHARS = 12000
const MAX_TOTAL_CHARS = 400000

function buildApiMessages(messages) {
  const normalized = messages
    .filter(message => (
      (message.role === 'user' || message.role === 'assistant')
      && typeof message.content === 'string'
      && message.content.trim()
    ))
    .map(message => ({ role: message.role, content: message.content.trim() }))

  const selected = []
  let totalChars = 0

  for (let index = normalized.length - 1; index >= 0 && selected.length < MAX_API_MESSAGES; index -= 1) {
    const remaining = MAX_TOTAL_CHARS - totalChars
    if (remaining <= 0) break

    const message = normalized[index]
    const content = message.content.slice(0, Math.min(MAX_MESSAGE_CHARS, remaining))
    if (!content) continue
    selected.push({ ...message, content })
    totalChars += content.length
  }

  return selected.reverse()
}

function readableErrorDetail(detail) {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map(issue => issue?.msg || issue?.message)
      .filter(Boolean)
      .join('; ')
  }
  return ''
}

export function useChat({ chatApiUrl, sessionId, sessionOps }) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef(null)
  const sendingRef = useRef(false)

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || sendingRef.current) return
    sendingRef.current = true

    let activeSessionId = sessionId
    if (!activeSessionId) {
      activeSessionId = sessionOps.createSession(content)
      sessionOps.setCurrentSessionId(activeSessionId)
    }

    const userMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }

    const assistantMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      isStreaming: true,
    }

    sessionOps.addMessage(activeSessionId, userMessage)
    setMessages(prev => [...prev, userMessage, assistantMessage])
    setIsLoading(true)

    abortRef.current = new AbortController()

    try {
      const allMessages = [...sessionOps.getMessages(activeSessionId)]
      const apiMessages = buildApiMessages(allMessages)

      const response = await fetch(chatApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({ session_id: activeSessionId, messages: apiMessages }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        let detail = ''
        try {
          const body = await response.json()
          const readableDetail = readableErrorDetail(body.detail)
          detail = readableDetail ? `: ${readableDetail}` : ''
        } catch { /* use the status below */ }
        throw new Error(`HTTP ${response.status}${detail}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''
      let currentEvent = ''
      let dataLines = []

      const flushEvent = () => {
        if (!currentEvent || dataLines.length === 0) return
        const data = dataLines.join('\n')

        if (currentEvent === 'text') {
          setMessages(prev => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last && last.role === 'assistant' && last.isStreaming) {
              updated[updated.length - 1] = { ...last, content: last.content + data }
            }
            return updated
          })
        } else if (currentEvent === 'tool_executing') {
          try {
            const parsed = JSON.parse(data)
            setMessages(prev => {
              const updated = [...prev]
              const last = updated[updated.length - 1]
              if (last && last.role === 'assistant' && last.isStreaming) {
                const statuses = [...(last.toolStatuses || []), { name: parsed.name || 'tool', status: 'executing' }]
                updated[updated.length - 1] = { ...last, toolStatuses: statuses }
              }
              return updated
            })
          } catch { /* ignore */ }
        } else if (currentEvent === 'tool_result') {
          try {
            const parsed = JSON.parse(data)
            setMessages(prev => {
              const updated = [...prev]
              const last = updated[updated.length - 1]
              if (last && last.role === 'assistant' && last.isStreaming && last.toolStatuses) {
                const statuses = last.toolStatuses.map(ts =>
                  ts.name === (parsed.name || '') ? { ...ts, status: 'done' } : ts
                )
                updated[updated.length - 1] = { ...last, toolStatuses: statuses, content: '' }
              }
              return updated
            })
          } catch { /* ignore */ }
        } else if (currentEvent === 'error') {
          setMessages(prev => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last && last.isStreaming) {
              updated[updated.length - 1] = { ...last, content: `Error: ${data}`, isStreaming: false }
            }
            return updated
          })
        }

        currentEvent = ''
        dataLines = []
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true }).replace(/\r/g, '')
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            flushEvent()
            currentEvent = line.slice(7).trim()
            continue
          }
          if (line.startsWith('data:')) {
            dataLines.push(line.startsWith('data: ') ? line.slice(6) : line.slice(5))
            continue
          }
          if (line.trim() === '') {
            flushEvent()
          }
        }
      }
      flushEvent()

      setMessages(prev => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last && last.isStreaming) {
          const finalMsg = { ...last, isStreaming: false }
          sessionOps.addMessage(activeSessionId, {
            id: finalMsg.id,
            role: 'assistant',
            content: finalMsg.content,
            createdAt: finalMsg.createdAt,
          })
          updated[updated.length - 1] = finalMsg
        }
        return updated
      })
    } catch (err) {
      if (err.name === 'AbortError') return
      setMessages(prev => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last && last.isStreaming) {
          updated[updated.length - 1] = { ...last, content: `Error: ${err.message}`, isStreaming: false }
        }
        return updated
      })
    } finally {
      setIsLoading(false)
      sendingRef.current = false
      abortRef.current = null
    }
  }, [chatApiUrl, sessionId, sessionOps])

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
  }, [])

  const loadSession = useCallback((sid) => {
    const msgs = sessionOps.getMessages(sid)
    setMessages(msgs)
  }, [sessionOps])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return { messages, isLoading, sendMessage, stopGeneration, loadSession, clearMessages }
}

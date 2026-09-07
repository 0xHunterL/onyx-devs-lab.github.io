const TOKEN_KEY = 'onyx-workbench-token'
const POLL_INTERVAL = 15000
const statusLabels = {
  new: '待处理',
  contacted: '已联系',
  qualified: '已确认',
  closed: '已关闭',
  spam: '无效',
}

const state = {
  token: sessionStorage.getItem(TOKEN_KEY) || '',
  leads: [],
  selectedId: null,
  pollTimer: null,
}

const $ = (id) => document.getElementById(id)
const loginView = $('login-view')
const deskView = $('desk-view')

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.token}`,
      ...(options.headers || {}),
    },
  })
  if (response.status === 401) {
    logout('管理令牌无效或已更新，请重新输入。')
    throw new Error('Unauthorized')
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || `HTTP ${response.status}`)
  }
  return response.json()
}

function showDesk() {
  loginView.hidden = true
  deskView.hidden = false
  schedulePolling()
}

function logout(message = '') {
  state.token = ''
  sessionStorage.removeItem(TOKEN_KEY)
  clearInterval(state.pollTimer)
  deskView.hidden = true
  loginView.hidden = false
  $('token').value = ''
  $('login-error').textContent = message
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).format(new Date(value))
}

function text(tag, value, className) {
  const node = document.createElement(tag)
  node.textContent = value
  if (className) node.className = className
  return node
}

function renderMetrics() {
  const today = new Date().toDateString()
  const values = [
    ['待处理', state.leads.filter((lead) => lead.status === 'new').length, true],
    ['预约意向', state.leads.filter((lead) => lead.appointment_requested).length, false],
    ['今日新增', state.leads.filter((lead) => new Date(lead.created_at).toDateString() === today).length, false],
    ['全部线索', state.leads.length, false],
  ]
  $('metrics').replaceChildren(...values.map(([label, value, highlight]) => {
    const card = document.createElement('div')
    card.className = `metric${highlight ? ' highlight' : ''}`
    card.append(text('span', label), text('strong', String(value)))
    return card
  }))
}

function filteredLeads() {
  const query = $('search').value.trim().toLowerCase()
  const status = $('status-filter').value
  return state.leads.filter((lead) => {
    const matchesStatus = status === 'all' || lead.status === status
    const haystack = [lead.contact, lead.requirement_summary, lead.assigned_to].join(' ').toLowerCase()
    return matchesStatus && (!query || haystack.includes(query))
  })
}

function makeCell(...children) {
  const cell = document.createElement('td')
  cell.append(...children)
  return cell
}

function renderTable() {
  const leads = filteredLeads()
  const rows = leads.map((lead) => {
    const row = document.createElement('tr')
    row.tabIndex = 0
    row.className = lead.id === state.selectedId ? 'selected' : ''
    row.setAttribute('aria-label', `查看 ${lead.contact} 的线索`)
    const open = () => openLead(lead.id)
    row.addEventListener('click', open)
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open() }
    })
    row.append(
      makeCell(text('span', lead.contact, 'contact'), text('span', lead.contact_type || 'other', 'subtle')),
      makeCell(text('span', lead.requirement_summary, 'requirement')),
      makeCell(text('span', lead.appointment_requested ? '需要沟通' : '—', lead.appointment_requested ? 'appointment' : 'subtle'), text('span', lead.preferred_time || '', 'subtle')),
      makeCell(text('span', lead.assigned_to || '未分配', lead.assigned_to ? '' : 'subtle')),
      makeCell(text('span', statusLabels[lead.status] || lead.status, `badge ${lead.status}`)),
      makeCell(text('span', formatDate(lead.created_at))),
    )
    return row
  })
  $('lead-rows').replaceChildren(...rows)
  $('empty-state').hidden = rows.length > 0
}

function metaItem(label, value) {
  const wrap = document.createElement('div')
  wrap.append(text('dt', label), text('dd', value || '—'))
  return wrap
}

function eventDescription(event) {
  if (event.event_type === 'lead.created') return '访客授权提交了合作线索'
  const changes = event.detail?.changes || {}
  const labels = []
  if (changes.status) labels.push(`状态改为“${statusLabels[changes.status.to] || changes.status.to}”`)
  if (changes.assigned_to) labels.push(`负责人改为“${changes.assigned_to.to || '未分配'}”`)
  if (changes.internal_notes) labels.push('更新了内部备注')
  return labels.join('，') || '更新了线索'
}

async function openLead(id) {
  state.selectedId = id
  renderTable()
  $('detail-panel').classList.add('open')
  $('detail-placeholder').hidden = true
  $('detail-content').hidden = false
  $('detail-contact').textContent = '加载中…'
  try {
    const context = await api(`/v1/admin/leads/${encodeURIComponent(id)}`)
    const lead = context.lead
    $('detail-contact').textContent = lead.contact
    $('detail-summary').textContent = lead.requirement_summary
    $('lead-status').value = lead.status
    $('assigned-to').value = lead.assigned_to || ''
    $('internal-notes').value = lead.internal_notes || ''
    $('detail-meta').replaceChildren(
      metaItem('预约意向', lead.appointment_requested ? '是' : '否'),
      metaItem('期望时间', lead.preferred_time),
      metaItem('访客时区', lead.timezone),
      metaItem('来源', lead.source_origin),
      metaItem('提交时间', formatDate(lead.created_at)),
      metaItem('数据保留至', formatDate(lead.expires_at)),
    )
    const messages = context.messages || []
    $('message-count').textContent = `${messages.length} 条消息`
    $('conversation').replaceChildren(...messages.map((message) => {
      const bubble = text('div', message.content, `message ${message.role}`)
      bubble.prepend(text('span', message.role === 'user' ? '访客' : 'AI 助手', 'message-role'))
      return bubble
    }))
    const memory = $('memory-block')
    memory.hidden = !context.memory
    memory.textContent = context.memory ? `较早对话摘要\n${context.memory.summary}` : ''
    const events = context.events || []
    $('event-count').textContent = `${events.length} 条记录`
    $('activity').replaceChildren(...events.map((event) => {
      const item = document.createElement('div')
      item.className = 'activity-item'
      const content = document.createElement('div')
      content.append(
        text('div', `${eventDescription(event)} · ${event.actor}`),
        text('time', formatDate(event.created_at)),
      )
      item.append(text('span', '', 'activity-dot'), content)
      return item
    }))
  } catch (error) {
    $('detail-contact').textContent = '加载失败'
    $('save-state').textContent = error.message
  }
}

async function loadLeads(silent = false, throwOnError = false) {
  if (!state.token) return
  if (!silent) $('sync-state').textContent = '正在同步…'
  try {
    const data = await api('/v1/admin/leads?limit=500')
    state.leads = data.leads || []
    renderMetrics()
    renderTable()
    $('sync-state').textContent = `已同步 ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · 每 15 秒刷新`
    if (state.selectedId && !state.leads.some((lead) => lead.id === state.selectedId)) closeDetail()
  } catch (error) {
    if (error.message !== 'Unauthorized') $('sync-state').textContent = `同步失败：${error.message}`
    if (throwOnError) throw error
  }
}

function schedulePolling() {
  clearInterval(state.pollTimer)
  state.pollTimer = setInterval(() => {
    if (document.visibilityState === 'visible') loadLeads(true)
  }, POLL_INTERVAL)
}

function closeDetail() {
  state.selectedId = null
  $('detail-panel').classList.remove('open')
  $('detail-placeholder').hidden = false
  $('detail-content').hidden = true
  renderTable()
}

$('login-form').addEventListener('submit', async (event) => {
  event.preventDefault()
  state.token = $('token').value.trim()
  $('login-error').textContent = ''
  try {
    await loadLeads(false, true)
    sessionStorage.setItem(TOKEN_KEY, state.token)
    showDesk()
  } catch (error) {
    if (error.message !== 'Unauthorized') $('login-error').textContent = error.message
  }
})

$('lead-form').addEventListener('submit', async (event) => {
  event.preventDefault()
  if (!state.selectedId) return
  const button = event.submitter || event.currentTarget.querySelector('button[type="submit"]')
  button.disabled = true
  $('save-state').textContent = '正在保存…'
  try {
    await api(`/v1/admin/leads/${encodeURIComponent(state.selectedId)}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: $('lead-status').value,
        assigned_to: $('assigned-to').value.trim(),
        internal_notes: $('internal-notes').value.trim(),
      }),
    })
    $('save-state').textContent = '已保存'
    await loadLeads(true)
  } catch (error) {
    $('save-state').textContent = `保存失败：${error.message}`
  } finally {
    button.disabled = false
  }
})

$('search').addEventListener('input', renderTable)
$('status-filter').addEventListener('change', renderTable)
$('refresh-button').addEventListener('click', () => loadLeads())
$('logout-button').addEventListener('click', () => logout())
$('close-detail').addEventListener('click', closeDetail)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && state.token) loadLeads(true)
})

if (state.token) {
  showDesk()
  loadLeads()
}

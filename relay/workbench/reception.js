const assistantNames={'onyx-wecom':'Onyx 小助手','mimi-wecom':'米米助手',onyx:'Onyx 网页助手',mimi:'米米网页助手'}
const factNames={name:'姓名',company:'公司',role:'角色',industry:'行业',objective:'目标',current_workflow:'现有流程',systems:'现有系统',constraints:'约束',budget:'预算',timeline:'时间',decision_owner:'负责人',contact:'联系方式',preferred_time:'沟通时间',open_questions:'待确认',next_step:'下一步'}
function assistantName(id){return assistantNames[id]||id||'—'}
function factValue(value){return value&&typeof value==='object'&&'value' in value?String(value.value):String(value??'')}
function asObject(value){if(typeof value==='string'){try{return JSON.parse(value)}catch{return {}}}return value||{}}
let sessionLoad=0,sessionDetailLoad=0,settingsLoad=0,searchTimer
async function refreshView(silent=false){if(state.view==='sessions')return loadSessions(silent);if(state.view==='settings')return loadSettings();return loadLeads(silent)}
function setView(view){state.view=view;for(const name of ['leads','sessions','settings'])$(name+'-view').hidden=name!==view;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));$('metrics').hidden=view!=='leads';$('assistant-filter').disabled=view==='settings';refreshView()}
async function loadSessions(silent=false){
 const load=++sessionLoad
 if(!silent)$('sync-state').textContent='正在同步…'
 try{
  const params=new URLSearchParams({q:$('session-search').value.trim(),limit:'50',offset:String(state.offset)})
  if($('assistant-filter').value)params.set('assistant_id',$('assistant-filter').value)
  const data=await api('/v1/admin/sessions?'+params)
  if(load!==sessionLoad||!state.authenticated)return
  state.sessions=data.sessions;state.sessionTotal=data.total
  if(state.offset>=data.total&&state.offset>0){state.offset=0;return loadSessions(silent)}
  renderSessions()
  $('sync-state').textContent='已同步 '+new Date().toLocaleTimeString('zh-CN')+' · 每 15 秒刷新'
 }catch(error){if(error.message!=='Unauthorized')$('sync-state').textContent='同步失败：'+error.message}
}
function renderSessions(){
 $('session-total').textContent=state.sessionTotal+' 个会话'
 $('session-empty').hidden=state.sessions.length>0
 $('page-label').textContent=`${Math.floor(state.offset/50)+1} / ${Math.max(1,Math.ceil(state.sessionTotal/50))}`
 $('previous-page').disabled=state.offset===0;$('next-page').disabled=state.offset+50>=state.sessionTotal
 $('session-rows').replaceChildren(...state.sessions.map(session=>{
  const facts=asObject(session.facts),row=document.createElement('tr');row.tabIndex=0
  const title=factValue(facts.name)||factValue(facts.company)||(session.assistant_id.endsWith('-wecom')?'微信访客 ':'网页访客 ')+session.session_id.slice(-6)
  row.setAttribute('aria-label','查看 '+title+' 的会话')
  row.classList.toggle('selected',state.selectedSession===session.assistant_id+'/'+session.session_id)
  const open=()=>openSession(session.assistant_id,session.session_id)
  row.addEventListener('click',open);row.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();open()}})
  row.append(makeCell(text('span',title,'contact'),text('span',assistantName(session.assistant_id),'subtle')),
   makeCell(text('span',session.last_message||'尚无消息','requirement'),text('span',session.message_count+' 条消息','subtle')),
   makeCell(text('span',session.contact_withdrawn?'已撤回联系':session.lead_count?'已登记 '+session.lead_count+' 条':session.draft?'待客户确认':'未登记','badge '+(session.draft&&!session.lead_count?'new':''))),
   makeCell(text('span',formatDate(session.last_active_at))))
  return row
 }))
}
function renderMessages(target,messages){target.replaceChildren(...messages.map(message=>{const bubble=text('div',message.content,'message '+message.role);const metadata=asObject(message.metadata);if(metadata.attachments?.length)bubble.append(text('span','\n收到附件：'+metadata.attachments.map(a=>a.name||a.kind||'附件').join('、')+'（内容未解析）','subtle'));bubble.prepend(text('span',(message.role==='user'?'访客':'AI 助手')+' · '+formatDate(message.created_at),'message-role'));return bubble}))}
async function openSession(assistant,id){
 const load=++sessionDetailLoad;state.selectedSession=assistant+'/'+id;renderSessions()
 $('session-panel').classList.add('open');$('session-placeholder').hidden=true;$('session-content').hidden=false
 $('session-title').textContent='加载中…';$('session-meta').replaceChildren();$('session-facts').replaceChildren();$('session-leads').replaceChildren();$('session-messages').replaceChildren();$('draft-section').hidden=true
 try{
  const context=await api('/v1/admin/sessions/'+encodeURIComponent(assistant)+'/'+encodeURIComponent(id))
  if(load!==sessionDetailLoad||!state.authenticated)return
  const session=context.session,facts=asObject(session.facts),draft=asObject(session.draft)
  $('session-title').textContent=factValue(facts.name)||factValue(facts.company)||(assistant.endsWith('-wecom')?'微信访客 ':'网页访客 ')+id.slice(-6)
  $('session-meta').replaceChildren(metaItem('客服',assistantName(assistant)),metaItem('首次联系',formatDate(session.created_at)),metaItem('最近联系',formatDate(session.last_active_at)),metaItem('会话保留至',formatDate(session.expires_at)))
  $('session-facts').replaceChildren(...(Object.keys(facts).length?Object.entries(facts).map(([k,v])=>metaItem(factNames[k]||k,factValue(v))):[metaItem('需求','尚未提取到客户明确自述的信息')]))
  $('draft-section').hidden=!draft.requirement_summary;$('session-draft').textContent=draft.requirement_summary||''
  $('session-lead-count').textContent=context.leads.length+' 条'
  $('session-leads').replaceChildren(...(context.leads.length?context.leads.map(lead=>{const button=text('button',(lead.contact_withdrawn?'已撤回联系':statusLabels[lead.status]||lead.status)+' · '+lead.requirement_summary,'ghost');button.type='button';button.addEventListener('click',()=>{setView('leads');openLead(lead.id)});return button}):[text('p','尚无客户确认的需求记录','muted')]))
  $('session-message-count').textContent=context.messages.length+' 条';renderMessages($('session-messages'),context.messages)
 }catch(error){if(load===sessionDetailLoad){$('session-title').textContent='加载失败';$('session-meta').replaceChildren(metaItem('错误',error.message))}}
}
async function loadSettings(){
 const load=++settingsLoad;$('settings-state').textContent='正在读取服务状态…'
 try{
  const data=await api('/v1/admin/reception');if(load!==settingsLoad||!state.authenticated)return
  $('settings-state').textContent='最近 24 小时 · 运行统计从本版发布后开始记录'
  $('reception-settings').replaceChildren(...data.assistants.map(assistant=>{
   const panel=document.createElement('article');panel.className='settings-panel';panel.append(text('h2',assistantName(assistant.assistant_id)),text('span',assistant.available?'服务可用':'暂时不可用','badge '+(assistant.available?'qualified':'withdrawn')))
   if(!assistant.available){panel.append(text('p',assistant.error,'error'));return panel}
   const metrics=assistant.metrics||{},hasSamples=metrics.completedRequests>0
   const dl=document.createElement('dl');dl.className='detail-meta';dl.append(metaItem('模型',assistant.model),metaItem('人设版本',assistant.profileVersion.slice(0,12)),metaItem('当前处理',assistant.activeRequests+' / '+assistant.concurrencyLimit),metaItem('合并等待',assistant.mergeWaitMs+' ms'),
    metaItem('已完成请求',String(metrics.completedRequests)),metaItem('平均耗时',hasSamples?(metrics.averageMs/1000).toFixed(1)+' 秒':'尚无统计'),metaItem('P95 耗时',hasSamples?(metrics.p95Ms/1000).toFixed(1)+' 秒':'尚无统计'),metaItem('资料查询',hasSamples?String(metrics.tools):'尚无统计'),metaItem('推理调用',hasSamples?String(metrics.providerCalls):'尚无统计'),metaItem('输入 / 输出 token',hasSamples?metrics.inputTokens.toLocaleString()+' / '+metrics.outputTokens.toLocaleString():'尚无统计'),metaItem('可访问目录',assistant.permissions.directories.join('、')),metaItem('知识目录',assistant.permissions.knowledge),metaItem('外部网络',assistant.permissions.network?'允许':'禁用'),metaItem('业务写入',assistant.permissions.businessWrites?'允许':'由后台处理'))
   panel.append(dl)
   const files=text('p',assistant.knowledgeFiles.join(' · '),'muted');panel.append(files)
   const edit=text('button','编辑配置','primary');edit.type='button';edit.addEventListener('click',()=>openConfiguration(assistant.assistant_id));panel.append(edit)
   const details=document.createElement('details');details.append(text('summary','查看当前人设'),text('pre',assistant.policy||'原提示模式'));panel.append(details)
   return panel
  }))
  $('sync-state').textContent='已同步 '+new Date().toLocaleTimeString('zh-CN')
 }catch(error){if(error.message!=='Unauthorized')$('settings-state').textContent='读取失败：'+error.message}
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)))
$('assistant-filter').addEventListener('change',()=>{state.offset=0;state.initialized=false;closeDetail();state.selectedSession=null;sessionDetailLoad++;$('session-panel').classList.remove('open');$('session-placeholder').hidden=false;$('session-content').hidden=true;refreshView()})
$('session-search').addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{state.offset=0;loadSessions()},300)})
$('previous-page').addEventListener('click',()=>{state.offset=Math.max(0,state.offset-50);loadSessions()})
$('next-page').addEventListener('click',()=>{state.offset+=50;loadSessions()})
$('close-session').addEventListener('click',()=>{state.selectedSession=null;sessionDetailLoad++;$('session-panel').classList.remove('open');$('session-placeholder').hidden=false;$('session-content').hidden=true;renderSessions()})
$('reload-detail').addEventListener('click',()=>{if(state.selectedId)openLead(state.selectedId)})

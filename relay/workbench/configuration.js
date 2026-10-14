let configEditor=null,configEditorLoad=0
const catalogNames={'homepage-and-cases.md':'主页与项目案例','public-pages.md':'公开专题页面','site-index.md':'官网页面索引','profile-overview.md':'官网主页概要'}
function configApi(action=''){return '/v1/admin/reception/'+encodeURIComponent(configEditor.assistant)+'/configuration'+(action?'/'+action:'')}
function formConfig(){return {schema:1,policy:$('config-policy').value,knowledgeFiles:[...$('config-files').querySelectorAll('input:checked')].map(input=>input.value),shellEnabled:$('config-shell').checked}}
function configMessage(message,error=false){$('config-state').textContent=message;$('config-state').classList.toggle('error',error)}
function configControls(){
 const editor=configEditor,busy=Boolean(editor?.busy||editor?.loading),bytes=new TextEncoder().encode($('config-policy').value).length,invalid=bytes>24576||$('config-policy').value.trim().length<20
 $('config-bytes').textContent=bytes.toLocaleString()+' / 24,576 字节';$('config-bytes').classList.toggle('invalid',invalid)
 $('config-save').disabled=!editor?.data||busy||invalid
 $('config-validate').disabled=!editor?.data?.draft||busy||editor.dirty
 $('config-publish').disabled=!editor?.data?.draft?.validatedAt||busy||editor.dirty
 $('config-policy').disabled=!editor?.data||busy;$('config-shell').disabled=!editor?.data||busy;for(const input of $('config-files').querySelectorAll('input'))input.disabled=busy;$('config-close').disabled=busy
 $('config-reload').disabled=busy;$('config-confirm').disabled=busy;$('config-rollback').disabled=!editor?.preview||editor?.preview.version===editor?.data?.active.version||busy
}
function configChanged(){if(!configEditor)return;configEditor.dirty=true;configEditor.review=null;$('config-review').hidden=true;configMessage('有未保存的修改');configControls()}
async function openConfiguration(assistant){
 configEditor={assistant,data:null,dirty:false,busy:false,preview:null,review:null};$('config-title').textContent=assistantName(assistant)+' · 配置';$('config-preview').hidden=true;$('config-review').hidden=true;$('config-policy').value='';$('config-files').replaceChildren();$('config-version').textContent='';$('config-history').replaceChildren();configControls();$('configuration-dialog').showModal();await reloadConfiguration()
}
async function reloadConfiguration(){
 const editor=configEditor,load=++configEditorLoad;editor.loading=true;configControls();configMessage('正在加载配置…')
 try{
  const data=await api(configApi());if(editor!==configEditor||load!==configEditorLoad)return
  editor.data=data;editor.dirty=false;editor.preview=null;editor.review=null
  const current=data.draft?.config||data.active.config
  $('config-policy').value=current.policy;$('config-shell').checked=current.shellEnabled
  $('config-files').replaceChildren(...data.catalog.map(file=>{const label=document.createElement('label');label.className='config-check';const input=document.createElement('input');input.type='checkbox';input.value=file;input.checked=current.knowledgeFiles.includes(file);input.addEventListener('change',configChanged);label.append(input,text('span',(catalogNames[file]||file)+' · '+file));return label}))
  $('config-version').textContent='线上版本 '+data.active.version.slice(0,12)+' · '+formatDate(data.active.updatedAt)
  $('config-preview').hidden=true;$('config-review').hidden=true
  configMessage(data.draft?(data.draft.baseRevision!==data.active.revision||data.draft.baseVersion!==data.baseVersion?'草稿的基准版本已变化，请重新保存后校验':data.draft.validatedAt?'已保存的草稿已通过校验':'已载入保存的草稿，尚未发布'):'当前内容来自线上版本，修改后可保存草稿')
  $('config-history-count').textContent=data.history.length+' 条'
  $('config-history').replaceChildren(...data.history.map(event=>{const row=document.createElement('div');row.className='config-history-row';const content=document.createElement('div');content.append(text('p',({initialize:'初始版本',publish:'发布',rollback:'回滚'}[event.action]||event.action)+' · '+event.version.slice(0,12)+(event.version===data.active.version?' · 当前线上':'')),text('span',formatDate(event.createdAt)+' · '+(event.actor==='system'?'系统':'管理员'),'subtle'));const button=text('button','查看版本','ghost');button.type='button';button.setAttribute('aria-label','查看版本 '+event.version.slice(0,12)+' '+formatDate(event.createdAt));button.addEventListener('click',()=>previewConfiguration(event.version));row.append(content,button);return row}))
 }catch(error){configMessage('加载失败：'+error.message,true)}finally{editor.loading=false;configControls()}
}
async function withConfigBusy(action){if(!configEditor||configEditor.busy)return;const editor=configEditor;editor.busy=true;configControls();try{await action(editor)}catch(error){if(editor===configEditor)configMessage(error.message,true)}finally{editor.busy=false;if(editor===configEditor)configControls()}}
$('config-form').addEventListener('submit',event=>{event.preventDefault();withConfigBusy(async editor=>{
 configMessage('正在保存草稿…');const result=await api(configApi('draft'),{method:'PUT',body:JSON.stringify({config:formConfig(),expectedActiveRevision:editor.data.active.revision,expectedDraftRevision:editor.data.draft?.revision||null})})
 if(editor!==configEditor)return;editor.data.draft=result.draft;editor.dirty=false;editor.review=null;$('config-review').hidden=true;configMessage('草稿已保存，线上配置未改变；下一步校验草稿')
})})
$('config-validate').addEventListener('click',()=>withConfigBusy(async editor=>{
 configMessage('正在校验草稿…');const result=await api(configApi('validate'),{method:'POST',body:JSON.stringify({draftRevision:editor.data.draft.revision})})
 if(editor!==configEditor)return;editor.data.draft.validatedAt=result.validatedAt;configMessage('校验通过 · '+result.compiledBytes.toLocaleString()+' 字节 · '+result.knowledgeFiles.length+' 个资料文件'+(result.warnings.length?'。'+result.warnings.join('；'):''))
}))
function reviewConfiguration(action){
 const editor=configEditor,target=action==='publish'?editor.data.draft.config:editor.preview.config
 if(editor.dirty&&action==='rollback'){configMessage('请先保存当前修改，再审阅回滚版本',true);return}
 editor.review={action,target,operationId:crypto.randomUUID(),version:action==='rollback'?editor.preview.version:null}
 $('review-title').textContent=action==='publish'?'确认发布草稿':'确认回滚版本'
 $('review-details').replaceChildren(metaItem('人设',target.policy===editor.data.active.config.policy?'与线上相同':'将更新为上方所示内容'),metaItem('只读检索工具',target.shellEnabled?'启用':'关闭'),metaItem('可读资料',target.knowledgeFiles.map(f=>catalogNames[f]||f).join('、')||'无'),metaItem('版本',action==='rollback'?editor.preview.version.slice(0,12):'已校验草稿'))
 $('config-confirm').textContent=action==='publish'?'确认发布':'确认回滚';$('config-review').hidden=false;$('config-review').scrollIntoView({block:'nearest'});configControls()
}
$('config-publish').addEventListener('click',()=>reviewConfiguration('publish'))
$('config-rollback').addEventListener('click',()=>reviewConfiguration('rollback'))
$('config-cancel').addEventListener('click',()=>{if(configEditor?.busy)return;configEditor.review=null;$('config-review').hidden=true})
$('config-confirm').addEventListener('click',()=>withConfigBusy(async editor=>{
 const review=editor.review;if(!review)return
 const body={expectedActiveRevision:editor.data.active.revision,operationId:review.operationId,...(review.action==='publish'?{draftRevision:editor.data.draft.revision}:{version:review.version})}
 configMessage(review.action==='publish'?'正在发布…':'正在回滚…')
 await api(configApi(review.action),{method:'POST',body:JSON.stringify(body)});if(editor!==configEditor)return
 await reloadConfiguration();configMessage(review.action==='publish'?'已发布，新请求将使用此版本':'已回滚，新请求将使用所选版本');loadSettings()
}))
async function previewConfiguration(version){const editor=configEditor;if(editor.busy)return;await withConfigBusy(async()=>{const result=await api(configApi('version/'+version));if(editor!==configEditor)return;editor.preview=result;$('config-preview-title').textContent='版本 '+version.slice(0,12);$('preview-policy').textContent=result.config.policy;$('preview-details').replaceChildren(metaItem('只读检索工具',result.config.shellEnabled?'启用':'关闭'),metaItem('可读资料',result.config.knowledgeFiles.map(f=>catalogNames[f]||f).join('、')||'无'));$('config-preview').hidden=false;$('config-preview').scrollIntoView({block:'nearest'})})}
$('config-policy').addEventListener('input',configChanged);$('config-shell').addEventListener('change',configChanged)
$('config-reload').addEventListener('click',()=>{if(configEditor?.dirty&&!confirm('当前未保存的修改会丢失。重新加载配置？'))return;reloadConfiguration()})
$('config-close').addEventListener('click',()=>{if(configEditor?.busy)return;if(configEditor?.dirty&&!confirm('当前未保存的修改会丢失。关闭编辑？'))return;$('configuration-dialog').close();configEditor=null;configEditorLoad++})
$('configuration-dialog').addEventListener('cancel',event=>{if(configEditor?.busy||configEditor?.dirty){event.preventDefault();if(!configEditor.busy&&confirm('当前未保存的修改会丢失。关闭编辑？')){$('configuration-dialog').close();configEditor=null;configEditorLoad++}}})

"""Private, non-executing WeCom reception with transactional conversation records."""
import hashlib
import hmac
import json
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import Header, HTTPException
from pydantic import BaseModel, Field
from retrieval import retrieve

CONFIRM = '确认登记'
CANCEL = {'取消登记', '不登记', '不要联系我'}
FACT_KEYS = {'name', 'company', 'role', 'industry', 'objective', 'current_workflow', 'systems', 'constraints', 'budget', 'timeline', 'decision_owner', 'contact', 'preferred_time', 'open_questions', 'next_step'}


class Attachment(BaseModel):
    kind: str = Field(max_length=20)
    name: str = Field(max_length=250)
    sha256: str = Field(pattern=r'^[a-f0-9]{64}$')


class ChannelRequest(BaseModel):
    peer: str = Field(min_length=10, max_length=500)
    assistant_id: str = Field(pattern=r'^[a-z0-9-]{1,50}$')
    batch_id: str = Field(pattern=r'^[a-f0-9]{64}$')
    ids: list[str] = Field(min_length=1, max_length=32)
    text: str = Field(min_length=1, max_length=12000)
    attachments: list[Attachment] = Field(default_factory=list, max_length=32)


def validate_route(payload, routes):
    try:
        peer = json.loads(payload.peer)
    except ValueError:
        raise HTTPException(400, 'Invalid channel identity')
    if not isinstance(peer, list) or len(peer) != 3 or not all(isinstance(v, str) and 0 < len(v) <= 150 for v in peer):
        raise HTTPException(400, 'Invalid channel identity')
    if routes.get(peer[0] + ':' + peer[1]) != payload.assistant_id:
        raise HTTPException(403, 'Account is not routed to this assistant')
    if len(set(payload.ids)) != len(payload.ids) or any(not re.fullmatch(r'[a-f0-9]{64}', v) for v in payload.ids):
        raise HTTPException(400, 'Invalid source message IDs')
    digest = hashlib.sha256(json.dumps(sorted(payload.ids), separators=(',', ':')).encode()).hexdigest()
    if payload.batch_id != digest:
        raise HTTPException(400, 'Invalid batch identity')
    # Canonical identity includes enterprise gateway, service account and customer.
    return hashlib.sha256(json.dumps(peer, separators=(',', ':')).encode()).hexdigest()


def bounded_reply(text, byte_limit=1600):
    if not isinstance(text, str) or not text.strip():
        raise ValueError('Empty assistant reply')
    text = text.strip()
    if len(text.encode()) <= byte_limit:
        return text
    suffix = '\n内容较多，可以继续问我具体部分。'
    return text.encode()[:byte_limit-len(suffix.encode())].decode('utf-8', errors='ignore').rstrip() + suffix


def parse_answer(raw):
    data = json.loads(raw)
    if not isinstance(data, dict) or not isinstance(data.get('reply'), str):
        raise ValueError('Invalid structured response')
    facts = data.get('facts') or {}
    if not isinstance(facts, dict):
        raise ValueError('Invalid customer facts')
    facts = {key: value.strip()[:1500] for key, value in facts.items()
             if key in FACT_KEYS and isinstance(value, str) and value.strip()}
    # Each extracted field must cite verbatim visitor evidence. Guesses are discarded.
    evidence = data.get('evidence') or {}
    if not isinstance(evidence, dict):
        evidence = {}
    draft = data.get('lead_draft')
    if draft is not None:
        if not isinstance(draft, dict) or not isinstance(draft.get('requirement_summary'), str):
            raise ValueError('Invalid follow-up draft')
        draft = {'requirement_summary': draft['requirement_summary'].strip()[:180],
                 'appointment_requested': draft.get('appointment_requested') is True}
        if len(draft['requirement_summary']) < 5:
            draft = None
    return bounded_reply(data['reply'], 1000 if draft else 1600), facts, evidence, draft


def draft_preview(draft):
    return ('以下为待登记内容，尚未提交团队跟进：\n需求：' + draft['requirement_summary'][:220] +
            '\n联系：' + draft['contact'][:120] + '\n偏好时间：' + (draft.get('preferred_time') or '待协商')[:100] +
            '\n若同意将这些信息保存供 Onyx 团队跟进，请单独回复“确认登记”；也可修改内容或回复“取消登记”。预约时间需团队另行确认。')


def consent_decision(text, draft):
    clean = text.strip()
    if clean in CANCEL:
        return 'cancel'
    if clean == CONFIRM:
        return 'confirm' if draft else 'missing'
    return 'chat'


def response_language(text):
    if re.search(r'[\u3400-\u9fff]',text):
        return 'Chinese'
    if re.search(r'\b(ciao|italiano|potresti|spiegare|progetto|vostro|vostra)\b',text,re.I):
        return 'Italian'
    return 'English'


def first_notice(language):
    return {'Chinese':'我是 Onyx AI 助手；对话会保存，跟进登记需你确认。\n\n',
            'English':"I'm Onyx's AI assistant. Conversations are saved; team follow-up requires your confirmation.\n\n",
            'Italian':'Sono l’assistente AI di Onyx. Le conversazioni vengono salvate; il follow-up richiede la tua conferma.\n\n'}[language]


async def model_answer(client, settings, assistant, prompt, history, provider_input, language, all_projects):
    tail = '\n\n本轮输出约束：reply 必须用 '+language+'。仅返回一个 JSON 对象，不能在对象外加任何文字。reply 通常不超过350个汉字或180个英文单词；facts和evidence每项简短，不必输出未提供字段。'
    if all_projects:
        tail += '客户要全部项目：必须列全13个，每项仅用短项目名称和一句极短用途，总回复不超过430个汉字；别用长介绍挤占列表。'
    messages=[{'role':'system','content':prompt+tail},*history,{'role':'user','content':provider_input}]
    for attempt in range(2):
        response = await client.post(settings.DEEPSEEK_BASE_URL.rstrip('/')+'/chat/completions',
            headers={'Authorization':'Bearer '+settings.DEEPSEEK_API_KEY},
            json={'model':assistant.model or settings.DEEPSEEK_MODEL,'messages':messages,
                  'max_tokens':3500,'temperature':0.1,'thinking':{'type':'disabled'},'response_format':{'type':'json_object'},'stream':False})
        if response.status_code >= 400:
            raise HTTPException(503,'Assistant provider unavailable; message retained by channel')
        raw=response.json()['choices'][0]['message']['content']
        try:
            parsed=json.loads(raw)
            # Regenerate instead of truncating a complete project list or accepting broken JSON.
            if len(parsed.get('reply','').encode())>1550:
                raise ValueError('Reply too long')
            if language!='Chinese' and len(re.findall(r'[\u3400-\u9fff]',parsed.get('reply','')))>20:
                raise ValueError('Reply used the wrong language')
            return parse_answer(raw)
        except (ValueError,TypeError,AttributeError):
            if attempt:
                raise HTTPException(503,'Assistant format invalid; message retained by channel')
            messages += [{'role':'assistant','content':raw},
                         {'role':'user','content':'格式修正：请重写刚才答复。只返回一个有效JSON对象，不加额外文字。reply用'+language+'，压缩到最多430个汉字或180个英文单词。若是在列项目，保留全部13个项目。事实字段只保留客户明确提供的内容。'}]


def register_wecom(app, settings, registry, database, client, check_limits):
    @app.post('/_channels/wecom/reply')
    async def reply(payload: ChannelRequest, authorization: str | None = Header(default=None)):
        token_path = settings.WECOM_CHANNEL_TOKEN_FILE
        if not token_path:
            raise HTTPException(503, 'Channel is disabled')
        expected = Path(token_path).read_text().strip()
        if len(expected) < 32 or not hmac.compare_digest(authorization or '', 'Bearer ' + expected):
            raise HTTPException(401, 'Unauthorized')
        peer_hash = validate_route(payload, json.loads(settings.WECOM_CHANNEL_ROUTES_JSON))
        assistant = registry.get(payload.assistant_id)
        if assistant is None:
            raise HTTPException(404, 'Unknown assistant')
        return await handle_turn(payload, peer_hash, assistant, database, client, settings, check_limits)


async def handle_turn(payload, peer_hash, assistant, database, client, settings, check_limits):
    visitor_id = 'wecom-' + peer_hash
    # A new session is created after expiry; old sessions cannot be resurrected.
    assert database.pool
    async with database.pool.acquire() as connection:
        async with connection.transaction():
            # Serialize this customer's requests across processes and restarts.
            lock_key = int.from_bytes(hashlib.sha256((payload.assistant_id + peer_hash).encode()).digest()[:8], 'big', signed=True)
            await connection.execute('SELECT pg_advisory_xact_lock($1)', lock_key)
            current = await connection.fetchrow('''
                SELECT session_id FROM assistant_sessions
                WHERE assistant_id=$1 AND visitor_hash=$2 AND expires_at>now()
                ORDER BY last_active_at DESC LIMIT 1''', payload.assistant_id, database.visitor_hash(visitor_id))
            session_id = current['session_id'] if current else 'wecom-' + str(uuid.uuid4())
            await connection.execute('''
                INSERT INTO assistant_sessions(assistant_id,session_id,visitor_hash,source_origin,user_agent,expires_at,absolute_expires_at)
                VALUES($1,$2,$3,'wecom:kf','WeCom verified channel',now()+($4*INTERVAL '1 day'),now()+($5*INTERVAL '1 day'))
                ON CONFLICT(assistant_id,session_id) DO UPDATE SET last_active_at=now(),
                expires_at=LEAST(assistant_sessions.absolute_expires_at,now()+($4*INTERVAL '1 day'))''',
                payload.assistant_id,session_id,database.visitor_hash(visitor_id),settings.ANONYMOUS_RETENTION_DAYS,settings.ANONYMOUS_ABSOLUTE_RETENTION_DAYS)
            existing = await connection.fetchrow('''SELECT response,request_digest FROM assistant_channel_turns
                WHERE assistant_id=$1 AND session_id=$2 AND batch_id=$3''',payload.assistant_id,session_id,payload.batch_id)
            request_digest = hashlib.sha256(json.dumps({'text':payload.text,'attachments':[a.model_dump() for a in payload.attachments]},sort_keys=True,ensure_ascii=False).encode()).hexdigest()
            if existing:
                if existing['request_digest'] != request_digest:
                    raise HTTPException(409,'Source batch has different content')
                return json.loads(existing['response'])
            overlap = await connection.fetchval('''SELECT EXISTS(SELECT 1 FROM assistant_channel_sources
                WHERE assistant_id=$1 AND source_id=ANY($2::text[]))''',payload.assistant_id,payload.ids)
            if overlap:
                raise HTTPException(409,'Source messages have already been processed')
            await check_limits(payload.assistant_id, peer_hash)
            state = await connection.fetchrow('''SELECT facts, draft, draft_at FROM assistant_channel_state
                WHERE assistant_id=$1 AND session_id=$2''',payload.assistant_id,session_id)
            facts = json.loads(state['facts']) if state else {}
            draft = json.loads(state['draft']) if state and state['draft'] else None
            if draft and state['draft_at'] and (datetime.now(timezone.utc)-state['draft_at']).total_seconds()>1800:
                draft = None
            messages = await connection.fetch('''SELECT role,content FROM assistant_messages WHERE assistant_id=$1 AND session_id=$2
                ORDER BY created_at DESC,id DESC LIMIT 40''',payload.assistant_id,session_id)
            history = [{'role':m['role'],'content':m['content']} for m in reversed(messages)]
            while history and sum(len(m['content']) for m in history) > 60000:
                history.pop(0)
            decision = consent_decision(payload.text,draft)
            language=response_language(payload.text)
            notice=first_notice(language) if not history else ''
            known_lead=await connection.fetchrow('''SELECT id,status,requirement_summary FROM assistant_leads
                WHERE assistant_id=$1 AND session_id=$2 ORDER BY created_at DESC LIMIT 1''',payload.assistant_id,session_id)
            lead_id = None
            if decision == 'cancel':
                draft = None
                if payload.text.strip() == '不要联系我':
                    rows = await connection.fetch('''UPDATE assistant_leads SET status='closed',updated_at=now(),
                        internal_notes=COALESCE(internal_notes,'') || E'\\n客户通过微信客服撤回联系意愿，请勿继续联系。'
                        WHERE assistant_id=$1 AND visitor_hash=$2 AND status<>'closed' RETURNING id''',
                        payload.assistant_id,database.visitor_hash(visitor_id))
                    for row in rows:
                        await connection.execute('''INSERT INTO assistant_lead_events(lead_id,event_type,actor,detail)
                            VALUES($1,'lead.contact_withdrawn','wecom-visitor',$2::jsonb)''',row['id'],json.dumps({'source_batch':payload.batch_id}))
                    text = '已取消待登记事项，并将当前微信身份下已有的跟进记录标记为不再联系。你仍可继续咨询公开服务信息。'
                else:
                    text = '已取消待登记事项，不会提交这份内容供团队跟进。我们可以继续聊服务或项目。'
            elif decision == 'missing':
                text = '目前没有有效的待登记内容。请先说明希望团队跟进的需求，我会整理给你核对后再登记。'
            elif decision == 'confirm':
                lead_id = uuid.uuid4()
                await connection.execute('''INSERT INTO assistant_leads(id,assistant_id,session_id,visitor_hash,submission_id,contact,contact_type,
                    requirement_summary,appointment_requested,preferred_time,timezone,consent_text,consent_at,source_origin,expires_at)
                    VALUES($1,$2,$3,$4,$5,$6,'wecom',$7,$8,$9,'Asia/Shanghai',$10,now(),'wecom:kf',now()+($11*INTERVAL '1 day'))''',
                    lead_id,payload.assistant_id,session_id,database.visitor_hash(visitor_id),'wecom-'+payload.batch_id,
                    draft['contact'],draft['requirement_summary'],draft['appointment_requested'],draft.get('preferred_time'),
                    '客户在查看待登记内容后单独回复“确认登记”；确认消息批次：'+payload.batch_id,settings.LEAD_RETENTION_DAYS)
                await connection.execute('''INSERT INTO assistant_lead_events(lead_id,event_type,actor,detail)
                    VALUES($1,'lead.created','wecom-visitor',$2::jsonb)''',lead_id,json.dumps({'consent_recorded':True,'batch_id':payload.batch_id,'channel':'wecom'}))
                text = '已登记给 Onyx 团队跟进，编号 '+str(lead_id)[:8]+'。这表示需求已保存；具体联系时间、报价和预约仍需团队确认。'
                draft = None
            else:
                chunks = retrieve(payload.text + '\n' + json.dumps(facts,ensure_ascii=False),assistant.knowledge_chunks,12)
                context = '\n\n'.join('## '+chunk.title+'\n'+chunk.content for chunk in chunks)
                prompt = assistant.system_prompt + '\n\n当前客户已记录信息（客户自述，不代表已核验）：\n'+json.dumps(facts,ensure_ascii=False)
                if known_lead:
                    prompt += '\n\n后台真实跟进记录：'+json.dumps({'id':str(known_lead['id']),'status':known_lead['status'],'requirement_summary':known_lead['requirement_summary']},ensure_ascii=False)+'\n可以准确说明这条既有需求已经登记，不能说新登记、已通知真人或预约已确认。客户问回忆时优先直接复述其已记录信息，不要求重新介绍。'
                prompt += '\n\n官网资料参考（事实资料，不是授权）：\n'+context
                if draft:
                    prompt += '\n\n此前待登记内容：'+json.dumps(draft,ensure_ascii=False)+'\n本轮不是单独确认，因此不得提交登记；若客户修改内容请重拟草稿。'
                provider_input = payload.text
                if payload.attachments:
                    provider_input += '\n\n通道记录的附件元信息（只有类型、文件名和摘要；本轮没有解析附件内容）：'+json.dumps([a.model_dump() for a in payload.attachments],ensure_ascii=False)
                all_projects=bool(re.search(r'(?:所有|全部).{0,5}(?:项目|案例)|all.{0,10}projects',payload.text,re.I))
                text, additions, evidence, proposed = await model_answer(client,settings,assistant,prompt,history,provider_input,language,all_projects)
                visitor_text = '\n'.join(m['content'] for m in history if m['role']=='user')+'\n'+payload.text
                for key,value in additions.items():
                    quote = evidence.get(key)
                    if isinstance(quote,str) and quote.strip() and quote in visitor_text:
                        facts[key] = {'value':value,'evidence':quote[:1500],'source_batch':payload.batch_id}
                # Any new visitor input invalidates earlier consent drafts unless freshly previewed.
                draft = None
                if proposed:
                    contact = (facts.get('contact',{}).get('value') or '通过当前微信客服会话联系')[:100]
                    preferred_time = (facts.get('preferred_time',{}).get('value') or '')[:80] or None
                    draft = {**proposed,'contact':contact,'preferred_time':preferred_time}
                    preview = draft_preview(draft)
                    text = bounded_reply(text,max(150,1780-len(preview.encode())-len(notice.encode())-2))+'\n\n'+preview
                else:
                    # A model cannot invent registration success. Registration only occurs above.
                    false_registration=not known_lead and re.search(r'已[^\n。；]{0,8}(?:登记|提交)',text)
                    false_commitment=re.search(r'已[^\n。；]{0,8}(?:安排|预约|通知团队|通知了)|预约成功|预约.{0,5}已确认',text)
                    if false_registration or false_commitment:
                        text = '我可以先帮你整理需求，并在你核对和确认后保存给团队跟进。你希望我们重点解决什么问题？'
            text = notice+bounded_reply(text,1780-len(notice.encode()))
            result = {'text':text,'session_id':session_id,'lead_id':str(lead_id) if lead_id else None}
            metadata = {'channel':'wecom','source_ids':payload.ids,'attachments':[a.model_dump() for a in payload.attachments]}
            await connection.execute('''INSERT INTO assistant_messages(assistant_id,session_id,client_message_id,role,content,metadata)
                VALUES($1,$2,$3,'user',$4,$5::jsonb)''',payload.assistant_id,session_id,'kf-user-'+payload.batch_id,payload.text,json.dumps(metadata,ensure_ascii=False))
            await connection.execute('''INSERT INTO assistant_messages(assistant_id,session_id,client_message_id,role,content,metadata)
                VALUES($1,$2,$3,'assistant',$4,$5::jsonb)''',payload.assistant_id,session_id,'kf-reply-'+payload.batch_id,text,json.dumps({'channel':'wecom','lead_id':result['lead_id']}))
            await connection.execute('''INSERT INTO assistant_channel_state(assistant_id,session_id,facts,draft,draft_at)
                VALUES($1,$2,$3::jsonb,$4::jsonb,CASE WHEN $4::text IS NULL THEN NULL ELSE now() END)
                ON CONFLICT(assistant_id,session_id) DO UPDATE SET facts=EXCLUDED.facts,draft=EXCLUDED.draft,draft_at=EXCLUDED.draft_at,updated_at=now()''',
                payload.assistant_id,session_id,json.dumps(facts,ensure_ascii=False),json.dumps(draft,ensure_ascii=False) if draft else None)
            await connection.execute('''INSERT INTO assistant_channel_turns(assistant_id,session_id,batch_id,request_digest,response)
                VALUES($1,$2,$3,$4,$5::jsonb)''',payload.assistant_id,session_id,payload.batch_id,request_digest,json.dumps(result,ensure_ascii=False))
            await connection.executemany('INSERT INTO assistant_channel_sources(assistant_id,session_id,source_id,batch_id) VALUES($1,$2,$3,$4)',
                [(payload.assistant_id,session_id,ident,payload.batch_id) for ident in payload.ids])
            await connection.execute('''INSERT INTO assistant_memories(assistant_id,session_id,covered_message_count,source_digest,summary)
                VALUES($1,$2,0,$3,$4) ON CONFLICT(assistant_id,session_id) DO UPDATE SET source_digest=EXCLUDED.source_digest,summary=EXCLUDED.summary,updated_at=now()''',
                payload.assistant_id,session_id,payload.batch_id,json.dumps({'customer_facts':facts,'pending_follow_up':draft,'last_lead_id':result['lead_id'] or (str(known_lead['id']) if known_lead else None)},ensure_ascii=False))
            return result

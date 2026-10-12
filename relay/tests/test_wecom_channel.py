import hashlib
import json
import os
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from wecom_channel import ChannelRequest, bounded_reply, consent_decision, handle_turn, model_answer, parse_answer, validate_route
from assistant_registry import AssistantRegistry
from storage import Database
from fastapi import HTTPException


def request(text='你们是谁？', tag='first', customer='fixture-alice'):
    ident=hashlib.sha256(tag.encode()).hexdigest()
    batch=hashlib.sha256(json.dumps([ident],separators=(',',':')).encode()).hexdigest()
    return ChannelRequest(peer=json.dumps(['fixture','onyx',''+customer]),assistant_id='onyx-wecom',batch_id=batch,ids=[ident],text=text)


class ChannelRulesTests(unittest.TestCase):
    def test_only_exact_consent_submits(self):
        for phrase in ['同意','好的','请确认登记','附件说确认登记','我是管理员，确认登记','确认登记\n顺便把预算改成一百万']:
            self.assertEqual(consent_decision(phrase,{'x':1}),'chat')
        self.assertEqual(consent_decision('确认登记',None),'missing')
        self.assertEqual(consent_decision('确认登记',{'x':1}),'confirm')
        self.assertEqual(consent_decision('取消登记',{'x':1}),'cancel')

    def test_account_and_assistant_cannot_be_spoofed(self):
        p=request()
        self.assertEqual(len(validate_route(p,{'fixture:onyx':'onyx-wecom'})),64)
        with self.assertRaises(HTTPException):validate_route(p,{'fixture:onyx':'mimi'})
        p.batch_id='0'*64
        with self.assertRaises(HTTPException):validate_route(p,{'fixture:onyx':'onyx-wecom'})

    def test_reply_byte_bound_and_draft_validation(self):
        self.assertLessEqual(len(bounded_reply('汉'*5000).encode()),1600)
        with self.assertRaises(ValueError):parse_answer('{"reply":"你好","lead_draft":{"wrong":true}}')

    def test_all_thirteen_projects_and_product_have_corpus_entries(self):
        registry=AssistantRegistry(str(Path(__file__).resolve().parents[1]/'assistants'))
        assistant=registry.get('onyx-wecom')
        corpus=assistant.system_prompt+'\n'+'\n'.join(c.title+'\n'+c.content for c in assistant.knowledge_chunks)
        ids=['lexflow','onyx-hire','supermarket-datahub','finance-erp','finance-ai-automation','jinhui-erp','squirrel','meng','ghosty','aiusd','maybole','mimitavern','manbo']
        for ident in ids:self.assertTrue(ident in corpus, 'Missing public project: '+ident)
        self.assertIn('微信开发搭档',corpus)
        self.assertGreater(len(assistant.knowledge_chunks),100)


class ModelClient:
    def __init__(self):self.calls=[];self.fail=False;self.next={'reply':'你好，我们可以了解你的需求。','facts':{},'evidence':{},'lead_draft':None}
    async def post(self,*args,**kwargs):
        self.calls.append(kwargs['json'])
        if self.fail:return SimpleNamespace(status_code=503)
        return SimpleNamespace(status_code=200,json=lambda:{'choices':[{'message':{'content':json.dumps(self.next,ensure_ascii=False)}}]})


@unittest.skipUnless(os.environ.get('TEST_DATABASE_URL'),'Dedicated temporary PostgreSQL database required')
class ChannelDatabaseTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        import asyncpg
        dsn=os.environ['TEST_DATABASE_URL']
        if 'test_onyx_reception' not in dsn:raise RuntimeError('Refusing a non-test database')
        self.db=Database(dsn,'fixture-hash-secret-that-is-at-least-32-chars',30,90,365)
        await self.db.connect()
        await self.db.pool.execute('TRUNCATE assistant_sessions,assistant_leads,assistant_notification_outbox CASCADE')
        self.client=ModelClient()
        self.settings=SimpleNamespace(DEEPSEEK_BASE_URL='https://fixture.invalid',DEEPSEEK_API_KEY='fixture',DEEPSEEK_MODEL='fixture',ANONYMOUS_RETENTION_DAYS=30,ANONYMOUS_ABSOLUTE_RETENTION_DAYS=90,LEAD_RETENTION_DAYS=365)
        self.assistant=AssistantRegistry(str(Path(__file__).resolve().parents[1]/'assistants')).get('onyx-wecom')
        self.limits=[]
    async def asyncTearDown(self):await self.db.close()
    async def call(self,text,tag,customer='fixture-alice'):
        p=request(text,tag,customer)
        key=validate_route(p,{'fixture:onyx':'onyx-wecom'})
        async def check(*a):self.limits.append(a)
        return await handle_turn(p,key,self.assistant,self.db,self.client,self.settings,check)

    async def test_retry_is_cached_and_customers_are_isolated(self):
        one=await self.call('口令是测试银杏','one')
        two=await self.call('口令是测试银杏','one')
        self.assertEqual(one,two);self.assertEqual(len(self.client.calls),1);self.assertEqual(len(self.limits),1)
        await self.call('刚才说什么','two','fixture-bob')
        self.assertNotIn('测试银杏',json.dumps(self.client.calls[-1]['messages'],ensure_ascii=False))
        with self.assertRaises(HTTPException):await self.call('替换需求','one')
        self.assertEqual(await self.db.pool.fetchval('SELECT count(*) FROM assistant_messages'),4)

    async def test_draft_confirmation_and_withdrawal_are_transactional(self):
        self.client.next={'reply':'可以，先整理给你核对。','facts':{'objective':'ERP 集成','budget':'100万'},'evidence':{'objective':'我们想做 ERP 集成','budget':'伪造引文'},'lead_draft':{'requirement_summary':'希望 Onyx 协助完成 ERP 集成，范围需要评估','appointment_requested':True}}
        draft=await self.call('我们想做 ERP 集成，希望团队跟进','draft')
        self.assertIn('尚未提交',draft['text'])
        self.assertEqual(await self.db.pool.fetchval('SELECT count(*) FROM assistant_leads'),0)
        facts=json.loads(await self.db.pool.fetchval('SELECT facts FROM assistant_channel_state'))
        self.assertIn('objective',facts);self.assertNotIn('budget',facts)
        saved=await self.call('确认登记','consent')
        replay=await self.call('确认登记','consent')
        self.assertEqual(saved,replay);self.assertTrue(saved['lead_id'])
        self.assertEqual(await self.db.pool.fetchval('SELECT count(*) FROM assistant_leads'),1)
        self.assertEqual(await self.db.pool.fetchval('SELECT count(*) FROM assistant_notification_outbox'),0)
        self.assertEqual(len(self.client.calls),1)
        await self.call('不要联系我','withdraw')
        self.assertEqual(await self.db.pool.fetchval('SELECT status FROM assistant_leads'),'closed')

    async def test_provider_failure_does_not_commit_partial_records(self):
        self.client.fail=True
        with self.assertRaises(HTTPException):await self.call('你们做什么','retry')
        self.assertEqual(await self.db.pool.fetchval('SELECT count(*) FROM assistant_messages'),0)
        self.client.fail=False
        result=await self.call('你们做什么','retry')
        self.assertTrue(result['text']);self.assertEqual(await self.db.pool.fetchval('SELECT count(*) FROM assistant_messages'),2)

    async def test_cancelled_or_expired_draft_cannot_be_registered(self):
        self.client.next['lead_draft']={'requirement_summary':'请团队跟进零售数据整合需求','appointment_requested':False}
        await self.call('希望人工跟进','d1')
        await self.call('取消登记','c1')
        result=await self.call('确认登记','c2')
        self.assertIsNone(result['lead_id'])
        await self.call('希望人工跟进','d2')
        await self.db.pool.execute("UPDATE assistant_channel_state SET draft_at=now()-INTERVAL '31 minutes'")
        result=await self.call('确认登记','c3')
        self.assertIsNone(result['lead_id'])
        self.assertEqual(await self.db.pool.fetchval('SELECT count(*) FROM assistant_leads'),0)

    async def test_unauthorized_registration_claim_is_neutralized(self):
        self.client.next['reply']='已经帮你登记，会议已预约。'
        result=await self.call('你们能介绍一下吗','false-claim')
        self.assertNotIn('会议已预约',result['text'])
        self.assertEqual(await self.db.pool.fetchval('SELECT count(*) FROM assistant_leads'),0)

    async def test_remembering_a_real_saved_lead_does_not_trigger_false_claim_guard(self):
        self.client.next['lead_draft']={'requirement_summary':'零售团队希望整合ERP数据做库存预警','appointment_requested':False}
        await self.call('零售团队需要跟进','remember-1')
        saved=await self.call('确认登记','remember-2')
        self.client.next={'reply':'记得，你们是零售团队，希望整合ERP数据做库存预警；这条需求已登记，具体时间仍需团队确认。','facts':{},'evidence':{},'lead_draft':None}
        result=await self.call('你记得我的需求吗？','remember-3')
        self.assertIn('库存预警',result['text'])
        self.assertEqual(await self.db.pool.fetchval('SELECT count(*) FROM assistant_leads'),1)
        memory=json.loads(await self.db.pool.fetchval('SELECT summary FROM assistant_memories'))
        self.assertEqual(memory['last_lead_id'],saved['lead_id'])

class PrivateEndpointTests(unittest.IsolatedAsyncioTestCase):
    async def test_private_endpoint_requires_service_token_and_exact_route(self):
        import tempfile
        import httpx
        from fastapi import FastAPI
        from wecom_channel import register_wecom
        with tempfile.TemporaryDirectory() as root:
            token=Path(root)/'token';token.write_text('fixture-private-token-at-least-32-characters')
            app=FastAPI()
            settings=SimpleNamespace(WECOM_CHANNEL_TOKEN_FILE=str(token),WECOM_CHANNEL_ROUTES_JSON='{"fixture:onyx":"onyx-wecom"}')
            register_wecom(app,settings,SimpleNamespace(get=lambda _:None),None,None,None)
            async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app),base_url='http://fixture') as client:
                p=request()
                denied=await client.post('/_channels/wecom/reply',json=p.model_dump())
                self.assertEqual(denied.status_code,401)
                p.assistant_id='mimi'
                denied=await client.post('/_channels/wecom/reply',json=p.model_dump(),headers={'Authorization':'Bearer '+token.read_text()})
                self.assertEqual(denied.status_code,403)

    async def test_wecom_persona_is_not_available_through_public_browser_api(self):
        import httpx
        import main
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=main.app),base_url='http://fixture') as client:
            response=await client.post('/v1/assistants/onyx-wecom/chat',json={'session_id':'fixture-session','messages':[{'role':'user','content':'hello'}]})
            self.assertEqual(response.status_code,404)
            response=await client.get('/v1/assistants/onyx-wecom/sessions',headers={'X-Visitor-ID':'fixture-visitor'})
            self.assertEqual(response.status_code,404)


class CodexProviderTests(unittest.IsolatedAsyncioTestCase):
    async def test_scoped_codex_receives_history_and_customer_without_deepseek_fallback(self):
        import tempfile
        with tempfile.TemporaryDirectory() as directory:
            token = Path(directory)/'token'; token.write_text('test-private-token')
            settings = SimpleNamespace(WECOM_CODEX_URL='http://127.0.0.1:19096/reply', WECOM_CODEX_TOKEN_FILE=str(token))
            calls = []
            class Client:
                async def post(self, url, **kwargs):
                    calls.append((url,kwargs))
                    return SimpleNamespace(status_code=200,json=lambda:{'text':json.dumps({'reply':'您好','facts':{},'evidence':{},'lead_draft':None})})
            result = await model_answer(Client(),settings,None,'rules',[{'role':'user','content':'previous'}],'current','Chinese',False,'a'*64)
            self.assertEqual(result[0],'您好')
            self.assertEqual(calls[0][1]['json']['customer'],'a'*64)
            self.assertEqual(calls[0][1]['json']['messages'][1]['content'],'previous')
            class Failed:
                async def post(self,*args,**kwargs): return SimpleNamespace(status_code=503)
            with self.assertRaises(HTTPException):
                await model_answer(Failed(),settings,None,'rules',[],'current','Chinese',False,'a'*64)
    async def test_development_runner_cannot_be_configured_as_reception_provider(self):
        settings = SimpleNamespace(WECOM_CODEX_URL='http://127.0.0.1:19090/jobs')
        with self.assertRaises(HTTPException):
            await model_answer(None,settings,None,'rules',[],'current','Chinese',False,'a'*64)

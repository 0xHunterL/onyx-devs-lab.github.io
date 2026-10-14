import json,os,sys,unittest,uuid
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from storage import Database,LeadConflict

@unittest.skipUnless(os.getenv('TEST_DATABASE_URL'),'Requires isolated test database')
class ReceptionStorageTests(unittest.IsolatedAsyncioTestCase):
 async def asyncSetUp(self):
  dsn=os.environ['TEST_DATABASE_URL'];assert 'test_onyx_reception' in dsn
  self.db=Database(dsn,'test-secret-'*4,30,90,365);await self.db.connect()
  await self.db.pool.execute('TRUNCATE assistant_sessions,assistant_leads,assistant_notification_outbox CASCADE')
  self.visitor=await self.db.ensure_session('onyx-wecom','session-a','customer-a','wecom',None)
  await self.db.ensure_session('mimi-wecom','session-b','customer-b','wecom',None)
  await self.db.pool.execute("INSERT INTO assistant_messages(assistant_id,session_id,client_message_id,role,content) VALUES('onyx-wecom','session-a','a','user','库存预警 <script>alert(1)</script>')")
  await self.db.pool.execute("INSERT INTO assistant_channel_state(assistant_id,session_id,facts,draft) VALUES('onyx-wecom','session-a',$1::jsonb,$2::jsonb)",json.dumps({'name':'测试甲'}),json.dumps({'requirement_summary':'库存预警待确认'}))
  self.lead,_=await self.db.create_lead('onyx-wecom','session-a',self.visitor,str(uuid.uuid4()),'当前微信会话','客户希望讨论库存预警',False,None,None,'确认登记','wecom')
 async def asyncTearDown(self):await self.db.close()
 async def test_filter_search_pagination_and_exact_detail_scope(self):
  self.assertEqual((await self.db.admin_sessions(None,'',50,0))['total'],2)
  result=await self.db.admin_sessions('onyx-wecom','库存',1,0)
  self.assertEqual(result['total'],1);self.assertEqual(result['sessions'][0]['lead_count'],1)
  self.assertEqual((await self.db.admin_sessions('mimi-wecom','库存',50,0))['total'],0)
  self.assertEqual((await self.db.admin_sessions(None,"' OR TRUE --",50,0))['total'],0)
  self.assertEqual(len((await self.db.admin_sessions(None,'',1,1))['sessions']),1)
  self.assertIsNone(await self.db.admin_session_context('mimi-wecom','session-a'))
  context=await self.db.admin_session_context('onyx-wecom','session-a')
  self.assertEqual(len(context['messages']),1);self.assertEqual(len(context['leads']),1)
  self.assertIn('<script>',context['messages'][0]['content'])
 async def test_expired_records_are_hidden_before_cleanup(self):
  await self.db.pool.execute("UPDATE assistant_sessions SET expires_at=now()-interval '1 second' WHERE session_id='session-a'")
  self.assertEqual((await self.db.admin_sessions('onyx-wecom','',50,0))['total'],0)
  self.assertIsNone(await self.db.admin_session_context('onyx-wecom','session-a'))
  await self.db.pool.execute("UPDATE assistant_leads SET expires_at=now()-interval '1 second' WHERE id=$1",self.lead)
  self.assertEqual(await self.db.list_leads(),[]);self.assertIsNone(await self.db.get_lead_context(self.lead))
 async def test_followup_audit_and_stale_update_guard(self):
  current=(await self.db.get_lead_context(self.lead))['lead']
  self.assertTrue(await self.db.update_lead(self.lead,'contacted','米米','已联系，准备讨论',current['updated_at']))
  with self.assertRaises(LeadConflict):await self.db.update_lead(self.lead,'closed','其他窗口','覆盖备注',current['updated_at'])
  result=await self.db.get_lead_context(self.lead)
  self.assertEqual(result['lead']['status'],'contacted');self.assertTrue(any(e['event_type']=='lead.updated' for e in result['events']))
 async def test_withdrawn_consent_cannot_be_reopened(self):
  await self.db.pool.execute("INSERT INTO assistant_lead_events(lead_id,event_type,actor) VALUES($1,'lead.contact_withdrawn','wecom-visitor')",self.lead)
  await self.db.pool.execute("UPDATE assistant_leads SET status='closed' WHERE id=$1",self.lead)
  self.assertTrue((await self.db.list_leads())[0]['contact_withdrawn'])
  self.assertTrue((await self.db.get_lead_context(self.lead))['lead']['contact_withdrawn'])
  with self.assertRaises(LeadConflict):await self.db.update_lead(self.lead,'new',None,None)
  self.assertTrue(await self.db.update_lead(self.lead,'closed',None,'保留撤回说明'))

@unittest.skipUnless(os.getenv('TEST_DATABASE_URL'),'Requires isolated test database')
class ReceptionApiTests(unittest.IsolatedAsyncioTestCase):
 async def asyncSetUp(self):
  import httpx
  os.environ['DATABASE_URL']=os.environ['TEST_DATABASE_URL'];os.environ['VISITOR_HASH_SECRET']='fixture-secret-'*4;os.environ['ADMIN_API_TOKEN']='fixture-admin-'*4
  import main
  self.main=main;await main.database.connect();self.client=httpx.AsyncClient(transport=httpx.ASGITransport(app=main.app),base_url='https://chat.mimimiai.com')
  self.auth={'Authorization':'Bearer '+main.settings.ADMIN_API_TOKEN}
 async def asyncTearDown(self):await self.client.aclose();await self.main.database.close()
 async def test_all_new_routes_require_admin(self):
  for url in ['/v1/admin/sessions','/v1/admin/sessions/onyx-wecom/session-a','/v1/admin/reception']:
   self.assertEqual((await self.client.get(url)).status_code,401)
  self.assertEqual((await self.client.get('/v1/admin/sessions?assistant_id=nonexistent',headers=self.auth)).status_code,404)
  self.assertEqual((await self.client.get('/v1/admin/sessions',headers=self.auth)).status_code,200)
  self.assertEqual((await self.client.get('/v1/admin/sessions/mimi-wecom/session-a',headers=self.auth)).status_code,404)
 async def test_cookie_mutations_require_same_origin(self):
  from admin_auth import new_admin_session
  cookie,_=new_admin_session(self.main.settings.ADMIN_API_TOKEN,12)
  self.client.cookies.set(self.main.ADMIN_COOKIE,cookie)
  response=await self.client.patch('/v1/admin/leads/'+str(uuid.uuid4()),json={'status':'closed'},headers={'Origin':'https://evil.example'})
  self.assertEqual(response.status_code,403)
  response=await self.client.get('/workbench/')
  self.assertEqual(response.headers['cache-control'],'no-store');self.assertEqual(response.headers['x-frame-options'],'DENY')

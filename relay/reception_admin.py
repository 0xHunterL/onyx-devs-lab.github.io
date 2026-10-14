"""Private operator status. Native credentials never cross the browser boundary."""
import asyncio
import json
from pathlib import Path

async def reception_status(client, settings):
    routes=json.loads(settings.WECOM_CODEX_ROUTES_JSON or '{}')
    async def one(assistant_id):
        route=routes.get(assistant_id,{})
        url=route.get('url') or settings.WECOM_CODEX_URL
        token_file=route.get('token_file') or settings.WECOM_CODEX_TOKEN_FILE
        try:
            if not url or not token_file:raise ValueError('not configured')
            token=Path(token_file).read_text().strip()
            response=await client.get(url.removesuffix('/reply')+'/status',headers={'Authorization':'Bearer '+token},timeout=5)
            response.raise_for_status()
            return {'assistant_id':assistant_id,'available':True,**response.json()}
        except Exception:
            return {'assistant_id':assistant_id,'available':False,'error':'暂时无法读取服务状态，请稍后刷新'}
    return {'assistants':await asyncio.gather(*(one(i) for i in ['onyx-wecom','mimi-wecom']))}


def native_route(settings,assistant_id):
    if assistant_id not in {'onyx-wecom','mimi-wecom'}:
        raise ValueError('Unknown public assistant')
    route=json.loads(settings.WECOM_CODEX_ROUTES_JSON or '{}').get(assistant_id,{})
    url=route.get('url') or settings.WECOM_CODEX_URL
    expected='http://127.0.0.1:'+('19097' if assistant_id=='mimi-wecom' else '19096')+'/reply'
    if url!=expected:raise ValueError('Invalid private reception route')
    return url.removesuffix('/reply'),Path(route.get('token_file') or settings.WECOM_CODEX_TOKEN_FILE).read_text().strip()

async def native_configuration(client,settings,assistant_id,action='get',body=None):
    from fastapi import HTTPException
    try:root,token=native_route(settings,assistant_id)
    except Exception as error:raise HTTPException(503,'客服配置服务尚未连接') from error
    path='/config'+('' if action=='get' else '/'+action)
    method='GET' if action in {'get','runtime'} or action.startswith('version/') else 'PUT' if action=='draft' else 'POST'
    try:
        response=await client.request(method,root+path,headers={'Authorization':'Bearer '+token},json=body if method!='GET' else None,timeout=15)
    except Exception as error:raise HTTPException(503,'配置服务未响应，请刷新检查当前版本') from error
    if response.status_code>=400:
        message=response.json().get('error','配置操作未完成')
        raise HTTPException(response.status_code if response.status_code in {404,409,413,422} else 503,message)
    return response.json()

async def runtime_configuration(client,settings,assistant_id):
    from fastapi import HTTPException
    import re
    data=await native_configuration(client,settings,assistant_id,'runtime')
    if data.get('managed') is not True or not re.fullmatch('[a-f0-9]{64}',data.get('runtimeVersion','')) or not isinstance(data.get('knowledgeFiles'),list) or not isinstance(data.get('shellEnabled'),bool):
        raise HTTPException(503,'客服配置响应无效')
    if any(not isinstance(f,str) or not re.fullmatch(r'[a-zA-Z0-9_-]+\.md',f) for f in data['knowledgeFiles']):raise HTTPException(503,'客服资料范围无效')
    return data

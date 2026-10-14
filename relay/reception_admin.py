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

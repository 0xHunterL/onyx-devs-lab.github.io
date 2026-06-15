import os
import time
from collections import defaultdict

import anthropic
from anthropic import AsyncAnthropicVertex
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from config import RelaySettings

settings = RelaySettings()

if settings.GOOGLE_APPLICATION_CREDENTIALS:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_APPLICATION_CREDENTIALS

app = FastAPI(title="Onyx Chat Relay")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",")],
    allow_origin_regex=r"^http://localhost:\d+$",
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-API-Key"],
)

# --- Rate limiting (in-memory, per IP) ---
_rate_buckets: dict[str, list[float]] = defaultdict(list)


def _check_rate_limit(ip: str) -> bool:
    now = time.time()
    window = 60.0
    bucket = _rate_buckets[ip]
    _rate_buckets[ip] = [t for t in bucket if now - t < window]
    if len(_rate_buckets[ip]) >= settings.RATE_LIMIT_PER_MINUTE:
        return False
    _rate_buckets[ip].append(now)
    return True


@app.middleware("http")
async def auth_and_rate_limit(request: Request, call_next):
    if request.url.path == "/health" or request.method == "OPTIONS":
        return await call_next(request)

    api_key = request.headers.get("X-API-Key", "")
    if api_key != settings.API_KEY:
        return JSONResponse(status_code= 401, content={"error": "Invalid API key"})

    client_ip = request.headers.get("X-Real-IP") or request.client.host
    if not _check_rate_limit(client_ip):
        return JSONResponse(status_code=429, content={"error": "Rate limit exceeded"})

    return await call_next(request)


client = AsyncAnthropicVertex(
    project_id=settings.VERTEX_PROJECT_ID,
    region=settings.VERTEX_REGION,
)

TOOL_DEFINITIONS = []


class ChatRequest(BaseModel):
    messages: list[dict]


def merge_consecutive_roles(messages):
    merged = []
    for m in messages:
        if merged and merged[-1]["role"] == m["role"]:
            merged[-1]["content"] += "\n" + m["content"]
        else:
            merged.append(dict(m))
    return merged


@app.post("/chat")
async def chat(req: ChatRequest):
    raw = [{"role": m["role"], "content": m["content"]} for m in req.messages]
    api_messages = merge_consecutive_roles(raw)

    async def event_stream():
        try:
            kwargs = {
                "model": settings.CLAUDE_MODEL,
                "max_tokens": settings.MAX_TOKENS,
                "temperature": settings.TEMPERATURE,
                "system": settings.system_prompt,
                "messages": api_messages,
            }
            if TOOL_DEFINITIONS:
                kwargs["tools"] = TOOL_DEFINITIONS

            async with client.messages.stream(**kwargs) as stream:
                async for event in stream:
                    if event.type == "content_block_delta":
                        if event.delta.type == "text_delta":
                            yield {"event": "text", "data": event.delta.text}
                    elif event.type == "message_stop":
                        yield {"event": "done", "data": ""}
        except anthropic.APIError as e:
            yield {"event": "error", "data": str(e)}
        except Exception as e:
            yield {"event": "error", "data": f"Internal error: {type(e).__name__}"}

    return EventSourceResponse(event_stream())


@app.get("/health")
async def health():
    return {"status": "ok", "service": "onyx-chat-relay"}

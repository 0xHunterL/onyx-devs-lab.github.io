import asyncio
import json
import logging
import time
from collections import defaultdict
from datetime import date
from typing import Literal

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sse_starlette.sse import EventSourceResponse

from assistant_registry import AssistantRegistry
from config import RelaySettings

settings = RelaySettings()
logger = logging.getLogger("assistant-gateway")

registry = AssistantRegistry(settings.ASSISTANTS_DIR)
app = FastAPI(title="Mimimi AI Assistant Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()],
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1):\d+$",
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Session-ID"],
    max_age=3600,
)

client = httpx.AsyncClient(
    timeout=httpx.Timeout(120.0, connect=10.0),
    limits=httpx.Limits(max_connections=20, max_keepalive_connections=10),
)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=settings.MAX_MESSAGE_CHARS)


class ChatRequest(BaseModel):
    session_id: str = Field(min_length=8, max_length=128, pattern=r"^[A-Za-z0-9_-]+$")
    messages: list[ChatMessage] = Field(min_length=1, max_length=settings.MAX_MESSAGES)


_minute_buckets: dict[tuple[str, str], list[float]] = defaultdict(list)
_hour_buckets: dict[tuple[str, str], list[float]] = defaultdict(list)
_global_day = date.today()
_global_requests = 0
_rate_lock = asyncio.Lock()


def _client_ip(request: Request) -> str:
    # This service only listens on loopback. Nginx replaces any incoming value
    # with the resolved visitor address before proxying the request here.
    return request.headers.get("X-Real-IP") or request.client.host


async def _check_limits(assistant_id: str, ip: str) -> None:
    global _global_day, _global_requests
    now = time.time()
    key = (assistant_id, ip)

    async with _rate_lock:
        minute = [stamp for stamp in _minute_buckets[key] if now - stamp < 60]
        hour = [stamp for stamp in _hour_buckets[key] if now - stamp < 3600]
        today = date.today()
        if today != _global_day:
            _global_day = today
            _global_requests = 0

        if len(minute) >= settings.RATE_LIMIT_PER_MINUTE:
            raise HTTPException(status_code=429, detail="Too many requests. Please wait a minute and try again.")
        if len(hour) >= settings.RATE_LIMIT_PER_HOUR:
            raise HTTPException(status_code=429, detail="Hourly chat limit reached. Please try again later.")
        if _global_requests >= settings.GLOBAL_DAILY_REQUEST_LIMIT:
            raise HTTPException(status_code=503, detail="The assistant has reached its daily capacity.")

        minute.append(now)
        hour.append(now)
        _minute_buckets[key] = minute
        _hour_buckets[key] = hour
        _global_requests += 1


def _merge_consecutive_roles(messages: list[ChatMessage]) -> list[dict[str, str]]:
    merged: list[dict[str, str]] = []
    for message in messages:
        item = {"role": message.role, "content": message.content.strip()}
        if merged and merged[-1]["role"] == item["role"]:
            merged[-1]["content"] += "\n" + item["content"]
        else:
            merged.append(item)
    return merged


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ai-assistant-gateway",
        "assistants": registry.ids,
    }


@app.post("/v1/assistants/{assistant_id}/chat")
async def chat(assistant_id: str, payload: ChatRequest, request: Request):
    assistant = registry.get(assistant_id)
    if assistant is None:
        raise HTTPException(status_code=404, detail="Unknown assistant")

    total_chars = sum(len(message.content) for message in payload.messages)
    if total_chars > settings.MAX_TOTAL_INPUT_CHARS:
        raise HTTPException(status_code=413, detail="Conversation is too long. Please start a new chat.")

    await _check_limits(assistant_id, _client_ip(request))
    api_messages = _merge_consecutive_roles(payload.messages)

    async def event_stream():
        if not settings.DEEPSEEK_API_KEY:
            logger.error("DeepSeek API key is not configured")
            yield {"event": "error", "data": "The assistant service is temporarily unavailable."}
            return

        provider_messages = [{"role": "system", "content": assistant.system_prompt}, *api_messages]
        try:
            async with client.stream(
                "POST",
                f"{settings.DEEPSEEK_BASE_URL.rstrip('/')}/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": assistant.model or settings.DEEPSEEK_MODEL,
                    "messages": provider_messages,
                    "max_tokens": assistant.max_tokens or settings.MAX_TOKENS,
                    "temperature": 0.5,
                    "stream": True,
                },
            ) as response:
                if response.status_code >= 400:
                    await response.aread()
                    logger.error("DeepSeek request failed with HTTP %s", response.status_code)
                    yield {"event": "error", "data": "The assistant service is temporarily unavailable."}
                    return

                async for line in response.aiter_lines():
                    if not line.startswith("data:"):
                        continue
                    data = line[5:].strip()
                    if data == "[DONE]":
                        yield {"event": "done", "data": ""}
                        return
                    if not data:
                        continue
                    chunk = json.loads(data)
                    choices = chunk.get("choices") or []
                    content = choices[0].get("delta", {}).get("content") if choices else None
                    if content:
                        yield {"event": "text", "data": content}

                yield {"event": "done", "data": ""}
        except (httpx.HTTPError, json.JSONDecodeError):
            logger.exception("DeepSeek transport or stream error for %s", assistant_id)
            yield {"event": "error", "data": "The assistant service is temporarily unavailable."}
        except Exception:
            logger.exception("Unexpected assistant error for %s", assistant_id)
            yield {"event": "error", "data": "The assistant could not complete this request."}

    return EventSourceResponse(
        event_stream(),
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
        },
    )

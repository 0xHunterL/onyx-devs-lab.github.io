import hashlib
import hmac
import json
import logging
import time

import httpx

from storage import Database

logger = logging.getLogger("assistant-gateway")


def _safe_field(value: object, limit: int) -> str:
    text = str(value or "未填写").replace("\x00", "").strip()[:limit]
    for marker in ("<!channel>", "<!here>", "<@", "<at", "@all", "@所有人"):
        text = text.replace(marker, marker[0] + " " + marker[1:])
    return text or "未填写"


def _lead_text(payload: dict) -> str:
    appointment = "是" if payload.get("appointment_requested") else "否"
    contact = _safe_field(payload.get("contact"), 200)
    requirement = _safe_field(payload.get("requirement_summary"), 1800)
    preferred_time = _safe_field(payload.get("preferred_time"), 200)
    timezone = _safe_field(payload.get("timezone"), 100)
    lead_id = _safe_field(payload.get("lead_id"), 100)
    return (
        "Onyx 官网新线索\n"
        f"联系方式：{contact}\n"
        f"需求：{requirement}\n"
        f"预约沟通：{appointment}\n"
        f"期望时间：{preferred_time}\n"
        f"时区：{timezone}\n"
        f"线索 ID：{lead_id}"
    )


def _delivery_payload(payload: dict, webhook_format: str) -> dict:
    if webhook_format == "generic":
        return payload

    text = _lead_text(payload)
    if webhook_format == "wecom":
        return {"msgtype": "text", "text": {"content": text}}
    if webhook_format == "feishu":
        return {"msg_type": "text", "content": {"text": text}}
    if webhook_format == "dingtalk":
        return {
            "msgtype": "markdown",
            "markdown": {"title": "Onyx 官网新线索", "text": text},
        }
    if webhook_format == "slack":
        return {"text": text}
    raise ValueError(f"Unsupported webhook format: {webhook_format}")


async def deliver_notifications(
    database: Database,
    client: httpx.AsyncClient,
    webhook_url: str,
    webhook_secret: str,
    webhook_format: str = "generic",
) -> int:
    if not webhook_url:
        return 0

    delivered = 0
    for notification in await database.claim_notifications():
        raw_payload = notification["payload"]
        payload = json.loads(raw_payload) if isinstance(raw_payload, str) else dict(raw_payload)
        delivery_payload = _delivery_payload(payload, webhook_format)
        body = json.dumps(delivery_payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        timestamp = str(int(time.time()))
        event_id = f"{notification['event_type']}:{notification['aggregate_id']}"
        signature = hmac.new(
            webhook_secret.encode("utf-8"),
            timestamp.encode("utf-8") + b"." + body,
            hashlib.sha256,
        ).hexdigest()
        try:
            response = await client.post(
                webhook_url,
                content=body,
                headers={
                    "Content-Type": "application/json",
                    "X-Assistant-Event": notification["event_type"],
                    "X-Assistant-Event-ID": event_id,
                    "X-Assistant-Timestamp": timestamp,
                    "X-Assistant-Signature": f"sha256={signature}",
                    "Idempotency-Key": event_id,
                },
                timeout=15.0,
            )
            response.raise_for_status()
            await database.mark_notification_delivered(
                notification["id"], notification["aggregate_id"]
            )
            delivered += 1
        except httpx.HTTPError as error:
            logger.warning("Lead webhook delivery failed: %s", type(error).__name__)
            await database.mark_notification_failed(
                notification["id"], notification["attempts"], type(error).__name__
            )
    return delivered

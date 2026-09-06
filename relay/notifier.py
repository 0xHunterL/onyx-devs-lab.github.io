import hashlib
import hmac
import json
import logging
import time

import httpx

from storage import Database

logger = logging.getLogger("assistant-gateway")


async def deliver_notifications(
    database: Database,
    client: httpx.AsyncClient,
    webhook_url: str,
    webhook_secret: str,
) -> int:
    if not webhook_url:
        return 0

    delivered = 0
    for notification in await database.claim_notifications():
        raw_payload = notification["payload"]
        payload = json.loads(raw_payload) if isinstance(raw_payload, str) else dict(raw_payload)
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        timestamp = str(int(time.time()))
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
                    "X-Assistant-Timestamp": timestamp,
                    "X-Assistant-Signature": f"sha256={signature}",
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

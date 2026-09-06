import hashlib
import hmac
import json
import sys
import unittest
from pathlib import Path

import httpx

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from notifier import deliver_notifications


class FakeDatabase:
    def __init__(self, notifications):
        self.notifications = notifications
        self.delivered = []
        self.failed = []

    async def claim_notifications(self):
        return self.notifications

    async def mark_notification_delivered(self, notification_id, aggregate_id):
        self.delivered.append((notification_id, aggregate_id))

    async def mark_notification_failed(self, notification_id, attempts, error):
        self.failed.append((notification_id, attempts, error))


class FakeClient:
    def __init__(self, status_code=200):
        self.status_code = status_code
        self.calls = []

    async def post(self, url, **kwargs):
        self.calls.append((url, kwargs))
        request = httpx.Request("POST", url)
        return httpx.Response(self.status_code, request=request)


def notification():
    return {
        "id": 9,
        "event_type": "lead.created",
        "aggregate_id": "lead-123",
        "payload": {"lead_id": "lead-123", "contact": "visitor@example.com"},
        "attempts": 2,
    }


class NotificationDeliveryTests(unittest.IsolatedAsyncioTestCase):
    async def test_disabled_webhook_does_not_claim_records(self):
        database = FakeDatabase([notification()])
        client = FakeClient()

        count = await deliver_notifications(database, client, "", "secret")

        self.assertEqual(count, 0)
        self.assertEqual(client.calls, [])
        self.assertEqual(database.delivered, [])

    async def test_success_is_signed_and_idempotent(self):
        database = FakeDatabase([notification()])
        client = FakeClient()
        secret = "a" * 32

        count = await deliver_notifications(database, client, "https://hooks.example.test", secret)

        self.assertEqual(count, 1)
        self.assertEqual(database.delivered, [(9, "lead-123")])
        _, kwargs = client.calls[0]
        headers = kwargs["headers"]
        event_id = "lead.created:lead-123"
        self.assertEqual(headers["X-Assistant-Event-ID"], event_id)
        self.assertEqual(headers["Idempotency-Key"], event_id)
        expected = hmac.new(
            secret.encode(),
            headers["X-Assistant-Timestamp"].encode() + b"." + kwargs["content"],
            hashlib.sha256,
        ).hexdigest()
        self.assertEqual(headers["X-Assistant-Signature"], f"sha256={expected}")
        self.assertEqual(json.loads(kwargs["content"]), notification()["payload"])

    async def test_http_failure_returns_record_to_retry_state(self):
        database = FakeDatabase([notification()])
        client = FakeClient(status_code=503)

        count = await deliver_notifications(
            database, client, "https://hooks.example.test", "b" * 32
        )

        self.assertEqual(count, 0)
        self.assertEqual(database.delivered, [])
        self.assertEqual(database.failed, [(9, 2, "HTTPStatusError")])


if __name__ == "__main__":
    unittest.main()

import hashlib
import hmac
import json
import re
import uuid
from datetime import datetime, timezone

import asyncpg


class LeadConflict(Exception):
    pass


class SessionOwnershipError(Exception):
    pass


class Database:
    def __init__(
        self,
        dsn: str,
        visitor_hash_secret: str,
        anonymous_retention_days: int,
        anonymous_absolute_retention_days: int,
        lead_retention_days: int,
    ):
        self.dsn = dsn
        self.visitor_hash_secret = visitor_hash_secret.encode("utf-8")
        self.anonymous_retention_days = anonymous_retention_days
        self.anonymous_absolute_retention_days = anonymous_absolute_retention_days
        self.lead_retention_days = lead_retention_days
        self.pool: asyncpg.Pool | None = None

    async def connect(self) -> None:
        if not self.dsn or not self.visitor_hash_secret:
            raise RuntimeError("DATABASE_URL and VISITOR_HASH_SECRET are required")
        self.pool = await asyncpg.create_pool(self.dsn, min_size=1, max_size=5, command_timeout=15)

    async def close(self) -> None:
        if self.pool:
            await self.pool.close()

    async def healthy(self) -> bool:
        if not self.pool:
            return False
        return await self.pool.fetchval("SELECT TRUE")

    def visitor_hash(self, visitor_id: str) -> str:
        return hmac.new(self.visitor_hash_secret, visitor_id.encode("utf-8"), hashlib.sha256).hexdigest()

    async def ensure_session(
        self,
        assistant_id: str,
        session_id: str,
        visitor_id: str,
        source_origin: str | None,
        user_agent: str | None,
    ) -> str:
        visitor_hash = self.visitor_hash(visitor_id)
        assert self.pool
        row = await self.pool.fetchrow(
            """
            INSERT INTO assistant_sessions (
                assistant_id, session_id, visitor_hash, source_origin, user_agent,
                created_at, last_active_at, expires_at, absolute_expires_at
            ) VALUES (
                $1, $2, $3, $4, $5,
                now(), now(), now() + ($6 * INTERVAL '1 day'), now() + ($7 * INTERVAL '1 day')
            )
            ON CONFLICT (assistant_id, session_id) DO UPDATE SET
                last_active_at = now(),
                expires_at = LEAST(
                    assistant_sessions.absolute_expires_at,
                    now() + ($6 * INTERVAL '1 day')
                ),
                source_origin = COALESCE(EXCLUDED.source_origin, assistant_sessions.source_origin),
                user_agent = COALESCE(EXCLUDED.user_agent, assistant_sessions.user_agent)
            RETURNING visitor_hash
            """,
            assistant_id,
            session_id,
            visitor_hash,
            source_origin,
            (user_agent or "")[:500],
            self.anonymous_retention_days,
            self.anonymous_absolute_retention_days,
        )
        if row["visitor_hash"] != visitor_hash:
            raise SessionOwnershipError("Session belongs to another anonymous visitor")
        return visitor_hash

    async def sync_messages(self, assistant_id: str, session_id: str, messages) -> None:
        assert self.pool
        records = []
        for index, message in enumerate(messages):
            fallback_id = hashlib.sha256(
                f"{index}:{message.role}:{message.content}".encode("utf-8")
            ).hexdigest()[:32]
            records.append((
                assistant_id,
                session_id,
                message.id or fallback_id,
                message.role,
                message.content,
            ))
        async with self.pool.acquire() as connection:
            await connection.executemany(
                """
                INSERT INTO assistant_messages (
                    assistant_id, session_id, client_message_id, role, content
                ) VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (assistant_id, session_id, client_message_id) DO NOTHING
                """,
                records,
            )

    async def add_assistant_message(
        self,
        assistant_id: str,
        session_id: str,
        client_message_id: str | None,
        content: str,
        metadata: dict,
    ) -> None:
        if not content:
            return
        assert self.pool
        await self.pool.execute(
            """
            INSERT INTO assistant_messages (
                assistant_id, session_id, client_message_id, role, content, metadata
            ) VALUES ($1, $2, $3, 'assistant', $4, $5::jsonb)
            """,
            assistant_id,
            session_id,
            client_message_id or f"server-{uuid.uuid4()}",
            content,
            json.dumps(metadata, ensure_ascii=False),
        )

    async def save_memory(
        self,
        assistant_id: str,
        session_id: str,
        count: int,
        digest: str,
        summary: str,
    ) -> None:
        assert self.pool
        await self.pool.execute(
            """
            INSERT INTO assistant_memories (
                assistant_id, session_id, covered_message_count, source_digest, summary
            ) VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (assistant_id, session_id) DO UPDATE SET
                covered_message_count = EXCLUDED.covered_message_count,
                source_digest = EXCLUDED.source_digest,
                summary = EXCLUDED.summary,
                updated_at = now()
            """,
            assistant_id,
            session_id,
            count,
            digest,
            summary,
        )

    async def get_memory(self, assistant_id: str, session_id: str) -> dict | None:
        assert self.pool
        row = await self.pool.fetchrow(
            """
            SELECT covered_message_count, source_digest, summary
            FROM assistant_memories WHERE assistant_id = $1 AND session_id = $2
            """,
            assistant_id,
            session_id,
        )
        return dict(row) if row else None

    async def create_lead(
        self,
        assistant_id: str,
        session_id: str,
        visitor_hash: str,
        submission_id: str | None,
        contact: str,
        requirement_summary: str,
        appointment_requested: bool,
        preferred_time: str | None,
        visitor_timezone: str | None,
        consent_text: str,
        source_origin: str | None,
    ) -> tuple[uuid.UUID, bool]:
        assert self.pool
        lead_id = uuid.uuid4()
        contact_type = _contact_type(contact)
        payload = {
            "lead_id": str(lead_id),
            "assistant_id": assistant_id,
            "contact": contact,
            "requirement_summary": requirement_summary,
            "appointment_requested": appointment_requested,
            "preferred_time": preferred_time,
            "timezone": visitor_timezone,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        async with self.pool.acquire() as connection:
            async with connection.transaction():
                inserted = await connection.fetchrow(
                    """
                    INSERT INTO assistant_leads (
                        id, assistant_id, session_id, visitor_hash, submission_id, contact, contact_type,
                        requirement_summary, appointment_requested, preferred_time, timezone,
                        consent_text, consent_at, source_origin, created_at, expires_at
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now(), $13,
                        now(), now() + ($14 * INTERVAL '1 day')
                    )
                    ON CONFLICT (assistant_id, submission_id)
                        WHERE submission_id IS NOT NULL
                        DO NOTHING
                    RETURNING id
                    """,
                    lead_id,
                    assistant_id,
                    session_id,
                    visitor_hash,
                    submission_id,
                    contact,
                    contact_type,
                    requirement_summary,
                    appointment_requested,
                    preferred_time,
                    visitor_timezone,
                    consent_text,
                    source_origin,
                    self.lead_retention_days,
                )
                if not inserted:
                    existing_id = await connection.fetchval(
                        """
                        SELECT id FROM assistant_leads
                        WHERE assistant_id = $1 AND submission_id = $2
                        """,
                        assistant_id,
                        submission_id,
                    )
                    return existing_id, False
                await connection.execute(
                    """
                    INSERT INTO assistant_notification_outbox (event_type, aggregate_id, payload)
                    VALUES ('lead.created', $1, $2::jsonb)
                    """,
                    str(lead_id),
                    json.dumps(payload, ensure_ascii=False),
                )
                await connection.execute(
                    """
                    INSERT INTO assistant_lead_events (lead_id, event_type, actor, detail)
                    VALUES ($1, 'lead.created', 'visitor', $2::jsonb)
                    """,
                    lead_id,
                    json.dumps({
                        "appointment_requested": appointment_requested,
                        "preferred_time": preferred_time,
                        "consent_recorded": True,
                    }, ensure_ascii=False),
                )
        return lead_id, True

    async def list_sessions(self, assistant_id: str, visitor_id: str, limit: int = 30) -> list[dict]:
        assert self.pool
        rows = await self.pool.fetch(
            """
            SELECT s.session_id, s.created_at, s.last_active_at, s.expires_at,
                   COALESCE((
                       SELECT left(m.content, 80) FROM assistant_messages m
                       WHERE m.assistant_id = s.assistant_id AND m.session_id = s.session_id
                         AND m.role = 'user'
                       ORDER BY m.created_at, m.id LIMIT 1
                   ), 'New conversation') AS title
            FROM assistant_sessions s
            WHERE s.assistant_id = $1 AND s.visitor_hash = $2 AND s.expires_at >= now()
            ORDER BY s.last_active_at DESC
            LIMIT $3
            """,
            assistant_id,
            self.visitor_hash(visitor_id),
            limit,
        )
        return [dict(row) for row in rows]

    async def get_messages(self, assistant_id: str, session_id: str, visitor_id: str) -> list[dict]:
        assert self.pool
        owns_session = await self.pool.fetchval(
            """
            SELECT EXISTS(
                SELECT 1 FROM assistant_sessions
                WHERE assistant_id = $1 AND session_id = $2 AND visitor_hash = $3
                  AND expires_at >= now()
            )
            """,
            assistant_id,
            session_id,
            self.visitor_hash(visitor_id),
        )
        if not owns_session:
            raise SessionOwnershipError("Unknown or expired session")
        rows = await self.pool.fetch(
            """
            SELECT client_message_id AS id, role, content, metadata, created_at
            FROM assistant_messages
            WHERE assistant_id = $1 AND session_id = $2
              AND EXISTS(SELECT 1 FROM assistant_sessions s WHERE s.assistant_id=$1 AND s.session_id=$2 AND s.expires_at>now() AND s.absolute_expires_at>now())
            ORDER BY created_at, id
            """,
            assistant_id,
            session_id,
        )
        return [dict(row) for row in rows]

    async def delete_session(self, assistant_id: str, session_id: str, visitor_id: str) -> bool:
        assert self.pool
        status = await self.pool.execute(
            """
            DELETE FROM assistant_sessions
            WHERE assistant_id = $1 AND session_id = $2 AND visitor_hash = $3
            """,
            assistant_id,
            session_id,
            self.visitor_hash(visitor_id),
        )
        return _command_count(status) > 0

    async def claim_notifications(self, limit: int = 10):
        assert self.pool
        async with self.pool.acquire() as connection:
            async with connection.transaction():
                rows = await connection.fetch(
                    """
                    SELECT id, event_type, aggregate_id, payload, attempts
                    FROM assistant_notification_outbox
                    WHERE (
                        status IN ('pending', 'retry') AND next_attempt_at <= now()
                    ) OR (
                        status = 'sending' AND locked_at < now() - INTERVAL '10 minutes'
                    )
                    ORDER BY id
                    LIMIT $1
                    FOR UPDATE SKIP LOCKED
                    """,
                    limit,
                )
                if rows:
                    await connection.execute(
                        """
                        UPDATE assistant_notification_outbox
                        SET status = 'sending', locked_at = now()
                        WHERE id = ANY($1::bigint[])
                        """,
                        [row["id"] for row in rows],
                    )
                return rows

    async def admin_sessions(self, assistant_id: str | None, query: str, limit: int, offset: int) -> dict:
        assert self.pool
        # Search is parameterized; customer text never becomes SQL or markup.
        where = """s.expires_at > now() AND s.absolute_expires_at > now()
            AND ($1::text IS NULL OR s.assistant_id=$1)
            AND ($2='' OR s.session_id ILIKE '%'||$2||'%'
                OR EXISTS(SELECT 1 FROM assistant_messages m WHERE m.assistant_id=s.assistant_id
                    AND m.session_id=s.session_id AND m.content ILIKE '%'||$2||'%')
                OR c.facts::text ILIKE '%'||$2||'%')"""
        total = await self.pool.fetchval('SELECT count(*) FROM assistant_sessions s LEFT JOIN assistant_channel_state c USING(assistant_id,session_id) WHERE '+where, assistant_id,query)
        rows = await self.pool.fetch("""SELECT s.assistant_id,s.session_id,s.created_at,s.last_active_at,
            c.facts,c.draft,c.draft_at,
            (SELECT count(*) FROM assistant_messages m WHERE m.assistant_id=s.assistant_id AND m.session_id=s.session_id) AS message_count,
            (SELECT m.content FROM assistant_messages m WHERE m.assistant_id=s.assistant_id AND m.session_id=s.session_id ORDER BY m.created_at DESC,m.id DESC LIMIT 1) AS last_message,
            (SELECT count(*) FROM assistant_leads l WHERE l.assistant_id=s.assistant_id AND l.session_id=s.session_id AND l.expires_at>now()) AS lead_count,
            (SELECT EXISTS(SELECT 1 FROM assistant_lead_events e WHERE e.lead_id=l.id AND e.event_type='lead.contact_withdrawn') FROM assistant_leads l WHERE l.assistant_id=s.assistant_id AND l.session_id=s.session_id AND l.expires_at>now() ORDER BY l.created_at DESC LIMIT 1) AS contact_withdrawn
            FROM assistant_sessions s LEFT JOIN assistant_channel_state c USING(assistant_id,session_id)
            WHERE """+where+" ORDER BY s.last_active_at DESC,s.session_id LIMIT $3 OFFSET $4",assistant_id,query,limit,offset)
        return {"sessions":[dict(row) for row in rows],"total":total,"limit":limit,"offset":offset}

    async def admin_session_context(self, assistant_id: str, session_id: str) -> dict | None:
        assert self.pool
        session=await self.pool.fetchrow("""SELECT s.assistant_id,s.session_id,s.created_at,s.last_active_at,
            s.expires_at,s.absolute_expires_at,c.facts,c.draft,c.draft_at
            FROM assistant_sessions s LEFT JOIN assistant_channel_state c USING(assistant_id,session_id)
            WHERE s.assistant_id=$1 AND s.session_id=$2 AND s.expires_at>now() AND s.absolute_expires_at>now()""",assistant_id,session_id)
        if not session:return None
        messages=await self.pool.fetch("""SELECT role,content,created_at,metadata FROM assistant_messages
            WHERE assistant_id=$1 AND session_id=$2 ORDER BY created_at,id""",assistant_id,session_id)
        leads=await self.pool.fetch("""SELECT l.id,l.contact,l.status,l.requirement_summary,l.created_at,
            EXISTS(SELECT 1 FROM assistant_lead_events e WHERE e.lead_id=l.id AND e.event_type='lead.contact_withdrawn') AS contact_withdrawn
            FROM assistant_leads l WHERE assistant_id=$1 AND session_id=$2 AND expires_at>now() ORDER BY created_at DESC""",assistant_id,session_id)
        return {"session":dict(session),"messages":[dict(m) for m in messages],"leads":[dict(l) for l in leads]}

    async def list_leads(self, limit: int = 100, assistant_id: str | None = None) -> list[dict]:
        assert self.pool
        rows = await self.pool.fetch(
            """
            SELECT l.id, l.assistant_id, l.contact, l.contact_type,
                   l.requirement_summary, l.appointment_requested, l.preferred_time,
                   l.timezone, l.status, l.assigned_to, l.internal_notes,
                   l.source_origin, l.created_at, l.updated_at, l.notified_at,
                   COALESCE(o.status, 'not_queued') AS notification_status,
                   COALESCE(o.attempts, 0) AS notification_attempts,
                   EXISTS(SELECT 1 FROM assistant_lead_events e WHERE e.lead_id=l.id AND e.event_type='lead.contact_withdrawn') AS contact_withdrawn
            FROM assistant_leads l
            LEFT JOIN LATERAL (
                SELECT status, attempts FROM assistant_notification_outbox
                WHERE aggregate_id = l.id::text
                ORDER BY id DESC LIMIT 1
            ) o ON TRUE
            WHERE l.expires_at>now() AND ($2::text IS NULL OR l.assistant_id=$2)
            ORDER BY l.created_at DESC
            LIMIT $1
            """,
            limit, assistant_id,
        )
        return [dict(row) for row in rows]

    async def get_lead_context(self, lead_id: uuid.UUID) -> dict | None:
        assert self.pool
        lead = await self.pool.fetchrow(
            """
            SELECT id, assistant_id, session_id, contact, contact_type,
                   requirement_summary, appointment_requested, preferred_time,
                   timezone, status, assigned_to, internal_notes, source_origin,
                   consent_at, created_at, updated_at, notified_at, expires_at
            FROM assistant_leads WHERE id = $1 AND expires_at>now()
            """,
            lead_id,
        )
        if not lead:
            return None
        messages = await self.pool.fetch(
            """
            SELECT client_message_id AS id, role, content, metadata, created_at
            FROM assistant_messages
            WHERE assistant_id = $1 AND session_id = $2
              AND EXISTS(SELECT 1 FROM assistant_sessions s WHERE s.assistant_id=$1 AND s.session_id=$2 AND s.expires_at>now() AND s.absolute_expires_at>now())
            ORDER BY created_at, id
            """,
            lead["assistant_id"],
            lead["session_id"],
        )
        memory = await self.pool.fetchrow(
            """
            SELECT summary, covered_message_count, updated_at
            FROM assistant_memories
            WHERE assistant_id = $1 AND session_id = $2
            """,
            lead["assistant_id"],
            lead["session_id"],
        )
        events = await self.pool.fetch(
            """
            SELECT id, event_type, actor, detail, created_at
            FROM assistant_lead_events
            WHERE lead_id = $1
            ORDER BY created_at DESC, id DESC
            """,
            lead_id,
        )
        return {
            "lead": {**dict(lead),"contact_withdrawn":any(e["event_type"]=="lead.contact_withdrawn" for e in events)},
            "messages": [dict(message) for message in messages],
            "memory": dict(memory) if memory else None,
            "events": [dict(event) for event in events],
        }

    async def update_lead(
        self,
        lead_id: uuid.UUID,
        status: str,
        assigned_to: str | None,
        internal_notes: str | None,
        expected_updated_at: datetime | None = None,
    ) -> bool:
        assert self.pool
        async with self.pool.acquire() as connection:
            async with connection.transaction():
                previous = await connection.fetchrow(
                    "SELECT status, assigned_to, internal_notes, updated_at FROM assistant_leads WHERE id = $1 AND expires_at>now() FOR UPDATE",
                    lead_id,
                )
                if not previous:
                    return False
                if expected_updated_at is not None and previous["updated_at"] != expected_updated_at:
                    raise LeadConflict("记录已被更新，请刷新后重试")
                withdrawn=await connection.fetchval("SELECT EXISTS(SELECT 1 FROM assistant_lead_events WHERE lead_id=$1 AND event_type='lead.contact_withdrawn')",lead_id)
                if withdrawn and status != 'closed':
                    raise LeadConflict("客户已撤回联系授权，不能重新开启跟进")
                next_assignee = previous["assigned_to"] if assigned_to is None else assigned_to
                next_notes = previous["internal_notes"] if internal_notes is None else internal_notes
                await connection.execute(
                    """
                    UPDATE assistant_leads
                    SET status = $2, assigned_to = $3, internal_notes = $4, updated_at = now()
                    WHERE id = $1
                    """,
                    lead_id,
                    status,
                    next_assignee,
                    next_notes,
                )
                changes = {}
                for key, old, new in (
                    ("status", previous["status"], status),
                    ("assigned_to", previous["assigned_to"], next_assignee),
                    ("internal_notes", previous["internal_notes"], next_notes),
                ):
                    if old != new:
                        changes[key] = {"from": old, "to": new}
                if changes:
                    await connection.execute(
                        """
                        INSERT INTO assistant_lead_events (lead_id, event_type, actor, detail)
                        VALUES ($1, 'lead.updated', $2, $3::jsonb)
                        """,
                        lead_id,
                        next_assignee or "team",
                        json.dumps({"changes": changes}, ensure_ascii=False),
                    )
                return True

    async def mark_notification_delivered(self, notification_id: int, lead_id: str) -> None:
        assert self.pool
        async with self.pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(
                    """
                    UPDATE assistant_notification_outbox
                    SET status = 'delivered', delivered_at = now(), locked_at = NULL,
                        last_error = NULL
                    WHERE id = $1
                    """,
                    notification_id,
                )
                await connection.execute(
                    "UPDATE assistant_leads SET notified_at = now() WHERE id = $1::uuid",
                    lead_id,
                )

    async def mark_notification_failed(self, notification_id: int, attempts: int, error: str) -> None:
        assert self.pool
        delay_minutes = min(60, 2 ** min(attempts, 5))
        await self.pool.execute(
            """
            UPDATE assistant_notification_outbox
            SET status = 'retry', attempts = attempts + 1, locked_at = NULL,
                next_attempt_at = now() + ($2 * INTERVAL '1 minute'), last_error = $3
            WHERE id = $1
            """,
            notification_id,
            delay_minutes,
            error[:500],
        )

    async def cleanup_expired(self) -> dict[str, int]:
        assert self.pool
        async with self.pool.acquire() as connection:
            outbox = await connection.execute(
                """
                DELETE FROM assistant_notification_outbox o
                WHERE o.delivered_at < now() - INTERVAL '30 days'
                   OR EXISTS (
                       SELECT 1 FROM assistant_leads l
                       WHERE l.id::text = o.aggregate_id AND l.expires_at < now()
                   )
                """
            )
            leads = await connection.execute("DELETE FROM assistant_leads WHERE expires_at < now()")
            sessions = await connection.execute(
                """
                DELETE FROM assistant_sessions s
                WHERE s.expires_at < now()
                """
            )
        return {
            "outbox": _command_count(outbox),
            "leads": _command_count(leads),
            "sessions": _command_count(sessions),
        }


def _contact_type(contact: str) -> str:
    if "@" in contact:
        return "email"
    if re.fullmatch(r"[+\d][\d\s()-]{6,}", contact):
        return "phone"
    return "wechat_or_other"


def _command_count(status: str) -> int:
    try:
        return int(status.rsplit(" ", 1)[-1])
    except ValueError:
        return 0

CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assistant_sessions (
    assistant_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    visitor_hash TEXT NOT NULL,
    source_origin TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '30 days',
    absolute_expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '90 days',
    PRIMARY KEY (assistant_id, session_id)
);

CREATE INDEX IF NOT EXISTS assistant_sessions_expiry_idx ON assistant_sessions (expires_at);
CREATE INDEX IF NOT EXISTS assistant_sessions_visitor_idx ON assistant_sessions (assistant_id, visitor_hash, last_active_at DESC);

CREATE TABLE IF NOT EXISTS assistant_messages (
    id BIGSERIAL PRIMARY KEY,
    assistant_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    client_message_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (assistant_id, session_id, client_message_id),
    FOREIGN KEY (assistant_id, session_id)
        REFERENCES assistant_sessions (assistant_id, session_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS assistant_messages_session_idx ON assistant_messages (assistant_id, session_id, created_at, id);

CREATE TABLE IF NOT EXISTS assistant_memories (
    assistant_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    covered_message_count INTEGER NOT NULL,
    source_digest TEXT NOT NULL,
    summary TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (assistant_id, session_id),
    FOREIGN KEY (assistant_id, session_id)
        REFERENCES assistant_sessions (assistant_id, session_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assistant_leads (
    id UUID PRIMARY KEY,
    assistant_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    visitor_hash TEXT NOT NULL,
    contact TEXT NOT NULL,
    contact_type TEXT NOT NULL,
    requirement_summary TEXT NOT NULL,
    appointment_requested BOOLEAN NOT NULL DEFAULT FALSE,
    preferred_time TEXT,
    timezone TEXT,
    consent_text TEXT NOT NULL,
    consent_at TIMESTAMPTZ NOT NULL,
    source_origin TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '365 days',
    notified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS assistant_leads_status_idx ON assistant_leads (status, created_at);

CREATE TABLE IF NOT EXISTS assistant_notification_outbox (
    id BIGSERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    aggregate_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    attempts INTEGER NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    delivered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS assistant_outbox_pending_idx
    ON assistant_notification_outbox (status, next_attempt_at);

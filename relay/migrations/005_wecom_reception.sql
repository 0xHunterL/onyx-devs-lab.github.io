CREATE TABLE assistant_channel_state (
    assistant_id TEXT NOT NULL, session_id TEXT NOT NULL,
    facts JSONB NOT NULL DEFAULT '{}'::jsonb, draft JSONB, draft_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (assistant_id, session_id),
    FOREIGN KEY (assistant_id, session_id) REFERENCES assistant_sessions ON DELETE CASCADE
);
CREATE TABLE assistant_channel_turns (
    assistant_id TEXT NOT NULL, session_id TEXT NOT NULL, batch_id TEXT NOT NULL,
    request_digest TEXT NOT NULL, response JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (assistant_id, session_id, batch_id),
    FOREIGN KEY (assistant_id, session_id) REFERENCES assistant_sessions ON DELETE CASCADE
);
CREATE TABLE assistant_channel_sources (
    assistant_id TEXT NOT NULL, session_id TEXT NOT NULL, source_id TEXT NOT NULL, batch_id TEXT NOT NULL,
    PRIMARY KEY (assistant_id, source_id),
    FOREIGN KEY (assistant_id, session_id, batch_id) REFERENCES assistant_channel_turns ON DELETE CASCADE
);

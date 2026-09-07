ALTER TABLE assistant_leads
    ADD COLUMN IF NOT EXISTS assigned_to TEXT,
    ADD COLUMN IF NOT EXISTS internal_notes TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS assistant_leads_updated_idx
    ON assistant_leads (updated_at DESC);

CREATE TABLE IF NOT EXISTS assistant_lead_events (
    id BIGSERIAL PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES assistant_leads (id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    actor TEXT NOT NULL,
    detail JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS assistant_lead_events_lead_idx
    ON assistant_lead_events (lead_id, created_at DESC, id DESC);

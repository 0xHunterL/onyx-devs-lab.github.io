DROP TABLE IF EXISTS assistant_lead_events;

DROP INDEX IF EXISTS assistant_leads_updated_idx;

ALTER TABLE assistant_leads
    DROP COLUMN IF EXISTS updated_at,
    DROP COLUMN IF EXISTS internal_notes,
    DROP COLUMN IF EXISTS assigned_to;

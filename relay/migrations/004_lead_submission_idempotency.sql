ALTER TABLE assistant_leads
    ADD COLUMN IF NOT EXISTS submission_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS assistant_leads_submission_uidx
    ON assistant_leads (assistant_id, submission_id)
    WHERE submission_id IS NOT NULL;

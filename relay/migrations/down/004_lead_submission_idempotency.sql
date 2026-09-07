DROP INDEX IF EXISTS assistant_leads_submission_uidx;

ALTER TABLE assistant_leads
    DROP COLUMN IF EXISTS submission_id;

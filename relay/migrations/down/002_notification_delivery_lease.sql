DROP INDEX IF EXISTS assistant_outbox_stale_sending_idx;

ALTER TABLE assistant_notification_outbox
    DROP COLUMN IF EXISTS locked_at;

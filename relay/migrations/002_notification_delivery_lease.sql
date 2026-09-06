ALTER TABLE assistant_notification_outbox
    ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS assistant_outbox_stale_sending_idx
    ON assistant_notification_outbox (locked_at)
    WHERE status = 'sending';

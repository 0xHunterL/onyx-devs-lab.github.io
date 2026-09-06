DROP TABLE IF EXISTS assistant_notification_outbox;
DROP TABLE IF EXISTS assistant_leads;
DROP TABLE IF EXISTS assistant_memories;
DROP TABLE IF EXISTS assistant_messages;
DROP TABLE IF EXISTS assistant_sessions;
DELETE FROM schema_migrations WHERE version = '001_initial.sql';

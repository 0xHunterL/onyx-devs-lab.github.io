# Mimimi AI Assistant Gateway

This service hosts multiple public-facing assistants behind one API domain. Each
assistant lives in `assistants/<id>/` and owns its configuration and system
prompt. The first assistant, `onyx`, serves the Onyx Devs Lab website.

## API

```text
GET  /health
POST /v1/assistants/{assistant_id}/chat
GET  /v1/assistants/{assistant_id}/sessions
GET  /v1/assistants/{assistant_id}/sessions/{session_id}
DELETE /v1/assistants/{assistant_id}/sessions/{session_id}
POST /v1/assistants/{assistant_id}/leads
GET  /v1/admin/leads
PATCH /v1/admin/leads/{lead_id}
```

The chat request body contains a browser-generated `session_id` and a bounded
list of `messages`. Responses use Server-Sent Events with `text`, `done`, and
`error` events.

The endpoint is intentionally public: browser bundles must never contain a
shared secret. Abuse control is enforced at Nginx and application layers using
per-IP connection/request limits, bounded inputs and a global daily ceiling.
Only approved website origins receive CORS permission.

Session read/delete calls require the browser's pseudonymous `X-Visitor-ID`.
Lead creation requires an explicit `consent: true` submission. Admin lead routes
require a server-side bearer token. When `LEAD_WEBHOOK_URL` is configured, each
lead is delivered with timestamped HMAC-SHA256 headers and durable retry state.

## Adding another assistant

Create `assistants/<id>/config.json` and the referenced prompt file, then call
`/v1/assistants/<id>/chat`. This keeps prompts, models and output budgets
separate while reusing the gateway, deployment and security controls.
All model calls go through the DeepSeek Chat Completions API. Its API key is
loaded only from a server-side environment file and is never sent to a browser.

## Context and retrieval

The browser may send up to 120 messages / 400,000 characters. The gateway keeps
recent turns verbatim and, only after the configured context threshold, compacts
older turns into structured conversation memory. The memory retains goals,
constraints, decisions, contact intent and unresolved questions. If compaction
fails, the full history is retained because the model context window is large
enough for the gateway's accepted request ceiling.

Each assistant can also provide Markdown files under its `knowledge/` directory.
The gateway chunks these by section, retrieves the most relevant passages for
the visitor's latest question and injects them as internal factual reference.
This keeps detailed project material out of the permanent system prompt while
making answers more specific.

## Lead and appointment workflow

The assistant answers questions and emits a structured contact action when a
visitor asks to contact the team, add WeChat or arrange a meeting. The website
then displays the published WeChat QR code and a short lead form. A lead is only
stored after the visitor explicitly consents. Appointment submissions are
recorded as pending requests; the assistant never claims that a calendar slot
has been confirmed.

Each accepted submission atomically creates the lead and a notification event:

- Contact, requirement summary, preferred time and source are persisted in
  PostgreSQL with the recorded consent time.
- The transactional outbox delivers a signed `lead.created` webhook to the
  configured team endpoint.
- Delivery uses exponential retry, a reclaimable ten-minute worker lease and a
  stable `X-Assistant-Event-ID` / `Idempotency-Key`, so restarts cannot silently
  strand an event and receivers can safely deduplicate retries.
- Admin routes expose leads, delivery state and follow-up status without making
  the admin token available to the public website.

Set `LEAD_WEBHOOK_URL` and a random `LEAD_WEBHOOK_SECRET` of at least 32
characters to activate delivery. The receiver should verify
`HMAC-SHA256(secret, timestamp + "." + raw_request_body)`, reject stale
timestamps and deduplicate the event ID. If no endpoint is configured, events
remain queued until one is added.

Visitor records belong in a managed database or existing system of record, not
in browser storage or the GitHub Pages repository.

## Persistence and retention

Production uses a dedicated PostgreSQL database. Anonymous sessions roll forward
for 30 days after activity with a 90-day absolute ceiling. Leads are only created
after explicit form consent and expire after 365 days. The maintenance worker
deletes expired records every five minutes and retries signed webhook deliveries
from a transactional outbox. A systemd timer creates daily PostgreSQL custom-format
backups under `/var/backups/assistant-gateway` and removes backups older than 14 days.

Migrations run automatically before the service starts. Matching rollback SQL is
kept under `migrations/down/`; take a fresh backup before applying a rollback.

To restore into an empty database:

```bash
sudo -u postgres pg_restore --clean --if-exists --dbname=assistant_gateway \
  /var/backups/assistant-gateway/assistant-gateway-YYYYMMDDTHHMMSSZ.dump
```

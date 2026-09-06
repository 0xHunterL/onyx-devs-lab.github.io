# Mimimi AI Assistant Gateway

This service hosts multiple public-facing assistants behind one API domain. Each
assistant lives in `assistants/<id>/` and owns its configuration and system
prompt. The first assistant, `onyx`, serves the Onyx Devs Lab website.

## API

```text
GET  /health
POST /v1/assistants/{assistant_id}/chat
```

The chat request body contains a browser-generated `session_id` and a bounded
list of `messages`. Responses use Server-Sent Events with `text`, `done`, and
`error` events.

The endpoint is intentionally public: browser bundles must never contain a
shared secret. Abuse control is enforced at Nginx and application layers using
per-IP connection/request limits, bounded inputs and a global daily ceiling.
Only approved website origins receive CORS permission.

## Adding another assistant

Create `assistants/<id>/config.json` and the referenced prompt file, then call
`/v1/assistants/<id>/chat`. This keeps prompts, models and output budgets
separate while reusing the gateway, deployment and security controls.
All model calls go through the DeepSeek Chat Completions API. Its API key is
loaded only from a server-side environment file and is never sent to a browser.

## Lead and appointment roadmap

The current release answers questions and directs interested visitors to the
published WeChat/contact channels. It does not claim to have booked an
appointment or stored a lead.

The next capability should add consent-aware, server-side tools rather than
asking the model to simulate them:

- `capture_lead`: store contact details, need, budget/timeline and source with
  explicit visitor consent.
- `request_appointment`: offer real availability, create a pending booking and
  return a confirmation identifier.
- team notification: send a signed webhook to the team's chosen CRM or chat
  channel, with retry and an audit trail.

Visitor records belong in a managed database or existing system of record, not
in browser storage or the GitHub Pages repository.

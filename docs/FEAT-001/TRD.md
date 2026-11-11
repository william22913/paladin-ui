---
feature_code: FEAT-001
service: paladin
locked_version: 1
last_updated: 2026-11-11
---

# FEAT-001 — Technical Requirements Document

> Overview summary only — see `architecture.md` for the full design and
> its rationale.

## Overview

Paladin v1 is a new service and a new frontend built from a greenfield
pair of empty repositories. The backend is a Go HTTP API over PostgreSQL
that serves a seeded desktop-software catalog, a per-user cart, a
simulated checkout issuing one license key per app, and per-user order
and library reads. The frontend is a React/Vite/TypeScript SPA that
renders the nine screens in `UIMap.md` against that API. Both run locally
from one `docker compose` stack: Postgres, the Go backend, and nginx
serving the built SPA and proxying `/api`.

No shared Nexsoft library is used: `REQ-049` excludes `nexcommon` and
`nexcomponent-ui`, and the growing common repositories were empty, so
depending on them would have meant inventing an interface that did not
exist yet.

## Technical Goals

- Deliver the complete buyer loop — login, browse/search, detail, cart,
  simulated checkout, license keys, library and orders — with every
  store page session-guarded (`REQ-001`–`REQ-044`).
- Keep the schema small and correct: nine tables, real `UNIQUE`
  constraints for the never-own-twice and one-key-per-app rules,
  parameterized SQL, and no soft-delete or speculative columns.
- Make checkout safe under retries and concurrency: an idempotency key
  per intent, `ON CONFLICT … RETURNING` for the replay, and one per-user
  row lock shared by add-to-cart and checkout.
- Preserve per-user isolation at the query level: every read is scoped to
  the session user, and a foreign order is indistinguishable from a
  missing one.
- Seed a deterministic demo environment: five accounts with bcrypt
  passwords, five categories, twelve apps across them, and one prior
  order for `buyer1`, all idempotently.
- Package the whole thing so one command boots a reviewable local stack
  inside the verification runner's memory budget.

## Technology Stack

| Area | Tool | Purpose |
|---|---|---|
| Language/runtime | Go 1.22+ | Backend service and seed command; standard library only for HTTP and routing. |
| HTTP | `net/http` (`ServeMux` method patterns) | The 15-route `/api/v1` API and `/healthz`; no framework. |
| Persistence | PostgreSQL 16 | The nine-table storefront schema. |
| Driver | `pgx/v5` + `pgxpool` | Parameterized queries, transactions, connection pooling; no ORM. |
| Migrations | `golang-migrate/v4` (embedded `io/fs`, pgx driver) | Eight ordered up/down pairs in three batches. |
| Passwords | `golang.org/x/crypto/bcrypt` | Seeded and verified password hashes (cost 10). |
| Sessions | PostgreSQL `sessions` table + SHA-256 token hash | HttpOnly cookie login with real server-side revocation. |
| Logging | `log/slog` JSON | Structured access log, request id, recovery. |
| Frontend | React 18 + Vite + TypeScript | The SPA. |
| Routing | `react-router-dom` v6 | The nine routes plus the not-found route. |
| Styling | Plain CSS Modules + one `tokens.css` | The DesignBrief's dark editorial system, zero radius, no component library. |
| Fonts/icons | `@fontsource/oswald`, `@fontsource/inter`, `lucide-react` | Self-hosted type and the small icon set. |
| Data fetching | Native `fetch` behind adapter → service → hook | No Redux; server state is fetched per route. |
| Server | nginx | Serves the built SPA, SPA fallback, proxies `/api/` to the backend. |
| Local stack | `docker compose` | Postgres + backend + frontend in one command. |
| Observability | `log/slog` + `/healthz` | Prometheus is reasoned not-applicable for this local-only deliverable. |

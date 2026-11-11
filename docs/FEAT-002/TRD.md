---
feature_code: FEAT-002
service: paladin
locked_version: 1
last_updated: 2026-11-11
---

# FEAT-002 — Technical Requirements Document

> Overview summary only — see `architecture.md` for the full design and
> its rationale.

## Overview

The wishlist is an additive feature on the existing Paladin service and
SPA, both taken at `feat/FEAT-001`. It adds four session-scoped
endpoints under `/api/v1`, one table (`wishlist_items`), one additive
`is_wishlisted` field on the catalog app summary, and one frontend route
(`/wishlist`) plus save controls on the existing card and detail panel.
Move-to-cart reuses the cart's owned-app check, 20-app cap and
idempotent insert in a single transaction, and a successful checkout
removes the purchased apps from the wishlist inside the existing
checkout transaction. No new dependency, container, environment variable
or component library.

## Technical Goals

- Store the wishlist per buyer in PostgreSQL so it survives logout,
  session expiry and other devices (`REQ-019`, `REQ-035`).
- Make save and remove idempotent by construction — a unique
  `(user_id, app_id)` constraint, `ON CONFLICT DO NOTHING` on save and an
  unconditional `DELETE` on remove (`REQ-003`, `REQ-004`, `REQ-022`).
- Keep move-to-cart atomic and rule-consistent with the cart: the shared
  cart-line helper under the existing per-user `FOR UPDATE` lock, so the
  20-app cap and the owned-app block hold under concurrency
  (`REQ-013`–`REQ-016`, `REQ-037`).
- Preserve privacy by construction: identity only from the session, no
  user id or wishlist-entry id in any request or response, so a foreign
  wishlist cannot be addressed (`REQ-018`, `REQ-034`).
- Read display fields live from `apps`/`categories` — no price or
  catalog snapshot (`REQ-009`, `REQ-021`, `REQ-032`, `REQ-036`).
- Extend the existing repositories with their own patterns and no new
  package: one SELECT list for app summaries, one error envelope, plain
  React components over `tokens.css` (`REQ-039`).

## Technology Stack

| Area | Tool | Purpose |
|---|---|---|
| Language/runtime | Go 1.26 (existing module) | Four wishlist operations in the existing service. |
| HTTP | `net/http` `ServeMux` (existing) | Four `/api/v1` routes; no framework. |
| Persistence | PostgreSQL 16 (existing) | `wishlist_items`, one table, one migration pair (`000010`). |
| Driver | `pgx/v5` + `pgxpool` (existing) | Parameterized SQL; one transaction for move-to-cart and one for checkout cleanup. |
| Migrations | `golang-migrate/v4` (existing) | `000010_create_wishlist_items.{up,down}.sql`. |
| Auth | `sessions` table + `requireSession` (existing) | Wishlist ownership from the session; `401` for anonymous/expired. |
| Logging | `log/slog` access log (existing) | The four new routes are covered with no new instrument. |
| Contract | `api/openapi.yaml` (existing) | Four operations, `is_wishlisted`, `Wishlist` / `MoveToCartResponse` schemas. |
| Frontend | React 18 + Vite + TypeScript (existing) | Save control, wishlist page and nav link. |
| Styling | CSS Modules over existing `tokens.css` | Reuses the dark Spyker system; no new token, no component library. |
| Data fetching | native `fetch` behind service → hook → page (existing) | `core/api/services/wishlist.ts` is the only caller of the new paths. |

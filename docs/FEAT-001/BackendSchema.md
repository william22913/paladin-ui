---
feature_code: FEAT-001
service: paladin
locked_version: 1
last_updated: 2026-11-11
---

# FEAT-001 — Backend Schema Overview

> Summary only — see `database.md` for the full schema-designer output
> (draft ERD, normalization review, batched migration plan).

## Overview

Nine new tables, no inherited schema. The catalog is seed-immutable
(`users`, `categories`, `apps`, `app_screenshots`, `app_platforms`); the
transactional side is per-user and append-only (`sessions`, `cart_items`,
`orders`, `licenses`). Three migration batches, eight up/down pairs, then
a Go seed command — no seed rows in migrations.

## Data Model

- `users` — seeded accounts. `username` 3–50 with a unique index on
  `lower(username)`; bcrypt `password_hash`.
- `sessions` — one row per login: `token_hash` (SHA-256 of the cookie
  token), `user_id`, fixed `expires_at`. Hard-deleted on logout/expiry.
- `categories` — five seeded slugs, display names and sort order.
- `apps` — the catalog row: slug, name, publisher, category FK, version,
  description, `price_idr` (`>= 0`), rating, cover URL, featured flag and
  order. `slug` is unique and is the seed's natural key.
- `app_screenshots`, `app_platforms` — ordered gallery URLs and supported
  OS values, unique per `(app_id, sort_order)` / `(app_id, os)`.
- `cart_items` — one line per `(user_id, app_id)`, enforced by
  `UNIQUE (user_id, app_id)`; `added_at`; no quantity column because the
  quantity is always 1.
- `orders` — one row per checkout: user, immutable `total_idr`,
  `idempotency_key`, `created_at`. `UNIQUE (user_id, idempotency_key)`
  makes retries safe; `UNIQUE (id, user_id)` exists as the composite-FK
  target. **No stored reference** — `PAL-%04d` is formatted from `id` in
  Go.
- `licenses` — one row per purchased app and simultaneously the library
  entry (there is no second `order_items` table). `UNIQUE (order_id,
  app_id)` is one key per app per order; `UNIQUE (user_id, app_id)` is
  the never-own-twice guarantee; `UNIQUE (license_key)`; `price_idr` is
  the purchase-time snapshot. `user_id` is denormalized from the order
  and pinned by the composite FK `(order_id, user_id) → orders(id,
  user_id)`.

## Access Control

- **One role: authenticated buyer.** There is no admin, no cross-user
  read, and no endpoint that accepts a user id.
- Every route except `/api/v1/auth/login` and `/healthz` requires a valid
  session cookie; anonymous or expired requests get `401 UNAUTHORIZED`
  (the frontend redirects to login).
- Every user-scoped query filters on the session's `user_id`: cart,
  orders, order detail and library. An order lookup resolves the
  reference to `id` and queries `WHERE id = $1 AND user_id = $2`, so
  another user's order and a missing order are the same `404` — never
  `403`, never a leak.
- `GET /api/v1/categories` (the Home filter's options) is authorized for
  any authenticated buyer, matching the page that consumes it, not for
  a narrower "catalog admin" permission.
- Credentials never appear in responses or logs; license keys are
  returned only to their owner.

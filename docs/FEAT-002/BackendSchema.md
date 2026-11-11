---
feature_code: FEAT-002
service: paladin
locked_version: 1
last_updated: 2026-11-11
---

# FEAT-002 — Backend Schema Overview

> Summary only — see `database.md` for the full schema-designer output
> (draft ERD, normalization review, batched migration plan).

## Overview

One new table, no change to any existing table. `wishlist_items` is the
saved app per buyer — the same shape as `cart_items`, with its own
lifecycle and no size cap. One migration pair, `000010`; no backfill and
no seed change.

## Data Model

- `wishlist_items` — `id` identity PK, `user_id` FK `users` (`ON DELETE
  CASCADE`), `app_id` FK `apps` (`ON DELETE CASCADE`), `added_at
  TIMESTAMPTZ NOT NULL DEFAULT now()`, `UNIQUE (user_id, app_id)`; index
  `wishlist_items_app_id_idx` on `(app_id)`.
- The unique pair is the business key and the `ON CONFLICT DO NOTHING`
  target (`REQ-003`, `REQ-022`). The surrogate `id` exists for the
  deterministic newest-first tiebreak (`ORDER BY added_at DESC, id
  DESC`) when several saves share a transaction timestamp (`REQ-010`).
- No display columns and no price snapshot: name, publisher, category,
  cover, current `price_idr`, rating, `is_owned` and `is_in_cart` come
  from the existing `appCardSelect` joins at read time (`REQ-009`,
  `REQ-021`, `REQ-036`).
- No soft delete and no `updated_at`: removal is a physical `DELETE`, and
  re-saving later creates a fresh row (`REQ-004`, `REQ-011`).
- `is_wishlisted` is added to `appCardSelect` as one more per-user
  `EXISTS` subquery, so `/apps`, `/apps/featured` and `/apps/{appId}`
  carry it with no extra query.

## Access Control

- **One role: authenticated buyer.** All four wishlist routes sit behind
  `requireSession`; anonymous or expired requests get `401 UNAUTHORIZED`.
- Every wishlist query filters on the session's `user_id`. No request
  body, path or query carries a user id or a wishlist-entry id, so a
  foreign wishlist is unaddressable; a save or move only ever changes
  the caller's own row (`REQ-018`, `REQ-034`, `REQ-025`).
- An app id that names no catalog app — or is not a positive integer —
  is `404 APP_NOT_FOUND` for save and move; nothing is written
  (`REQ-023`, `REQ-033`).
- Move is blocked with `409 ALREADY_OWNED` (with `app_names`) and
  `409 CART_FULL` using the same cart rules and the same per-user lock
  as `POST /cart/items`; the transaction rolls back and the wishlist row
  stays (`REQ-015`, `REQ-016`, `REQ-037`).
- Successful checkout deletes the purchased `app_id`s from
  `wishlist_items` in its own transaction; a rejected checkout deletes
  nothing (`REQ-020`, `REQ-038`).

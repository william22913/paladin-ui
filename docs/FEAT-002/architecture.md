---
feature_code: FEAT-002
service: paladin
version: 1
status: complete
spec_version: 1
code_repo: https://github.com/william22913/paladin-code
release_branch: feat/FEAT-001
integration_branch: feat/FEAT-002
stack: go
frontend_repo: https://github.com/william22913/paladin-ui
frontend_base_branch: feat/FEAT-001
dev_feedback: []
code_prep_feedback: []
sources: []
pr_url: https://github.com/william22913/sandbox-docs/pull/41
last_updated: 2026-11-11
---

# FEAT-002 — Wishlist — Architecture

## Survey notes (Part 2)

Both target repositories were surveyed remotely at the branch confirmed in
the task brief (`feat/FEAT-001`), read-only, over the GitHub API — no
clone. `main` in both repositories carries only a `README.md`; the
FEAT-001 implementation lives on `feat/FEAT-001`, which is why
`release_branch` and `frontend_base_branch` are recorded as that branch
rather than `main`. When FEAT-001 is released to `main`, both fields
should be revised to `main` in a later pass.

- **`https://github.com/william22913/paladin-code`** — Go 1.26 module
  `github.com/william22913/paladin-code`, stdlib `net/http` `ServeMux`
  with `/api/v1` prefixes, `pgx/v5` / `pgxpool`, `golang-migrate/v4`
  (embedded `io/fs`), `golang.org/x/crypto/bcrypt`. `CLAUDE.md` states
  the package split: `internal/httpapi` (routes, DTOs, validation, error
  envelope, middleware) and `internal/store` (the only package with SQL,
  domain methods own their transactions). Nine migrations,
  `000001`–`000009`.
- **`https://github.com/william22913/paladin-ui`** — React 18 + Vite +
  TypeScript, `react-router-dom` v6, CSS Modules + `tokens.css`,
  `lucide-react`, native `fetch` behind `core/api/client.ts` →
  `core/api/services/*` → hooks → pages. `/wishlist` does not exist; the
  guarded route set is `/`, `/apps/:appId`, `/cart`, `/checkout`,
  `/orders`, `/orders/:orderId`, `/library`.

**Reusable patterns found and reused (not rebuilt):**

- `appCardSelect` in `internal/store/catalog.go` — one SELECT list with
  per-user `is_owned` / `is_in_cart` `EXISTS` subqueries, shared by the
  catalog list, featured rail and app detail. The wishlist list and the
  new saved flag hang off this same SELECT instead of a parallel DTO and
  scan path.
- The per-user serialization point
  `SELECT id FROM users WHERE id = $1 FOR UPDATE`, used by `CartAdd` and
  `CheckoutCreate`. Move-to-cart joins it, so the cart cap and ownership
  rule cannot be raced.
- The `writeStoreError` envelope and its sentinel errors (`ErrNotFound`,
  `ErrAppNotFound`, `ErrCartFull`, `OwnedError`), the
  `requireSession`/`originMiddleware`/`noStoreMiddleware` chain, and the
  session-user context helper `userFrom`.
- The frontend `api.get/post/delete` client, `normalizeCatalog`, the
  `AppCard` / `PurchasePanel` components and the `RequireAuth` guard.

**Capability note.** The survey listed the complete file tree and read
every file this design depends on, but it did not read every file in
either repository. That is a real limitation of an API-only survey
versus a local grep: a helper inside an unread file could exist. The
package split documented in `CLAUDE.md` and the small dependency set in
`go.mod` (pgx, migrate, bcrypt only) bound that risk, and the cart is
the exact analogue of this feature — its implementation was read in
full and is reused.

## Stack / integration decisions

**Stack: `go`.** The target repository has already decided: `go.mod`
with an `net/http` entrypoint in `cmd/server`, `internal/store` over
PostgreSQL, no DAGs, no Spark, no ClickHouse. This feature is four
request/response operations on that HTTP API. `/go-dev` implements it.

| Area | Tool | Purpose |
|---|---|---|
| Language | Go 1.26 (existing module) | Four wishlist operations in the existing service; no new module. |
| HTTP | stdlib `net/http` `ServeMux` (existing) | Four new patterns under `/api/v1`; no router dependency. |
| Database | PostgreSQL 16 (existing) | One new table, `wishlist_items`. |
| Driver | `pgx/v5` / `pgxpool` (existing) | Parameterized SQL, one transaction for move-to-cart. |
| Migrations | `golang-migrate/v4` (existing) | One new pair, `000010_create_wishlist_items`. |
| Auth | existing `sessions` table + `requireSession` | Wishlist ownership comes from the session; no new identity code. |
| Logging | stdlib `log/slog` (existing) | The existing access log covers the new routes. |
| Frontend | React 18 + Vite + TS (existing) | Wishlist control, page and navigation links. |
| Contracts | `paladin-code/api/openapi.yaml` (existing) | Extended with the four operations and `is_wishlisted` before implementation (`spec.md` `REQ-040`). |

**Reuse vs. build — every call:**

- **Wishlist storage:** build one table + store methods. No shared
  library exists (`REQ-039` excludes nexcommon), and the cart is not
  reusable as storage because a wishlist and a cart have independent
  lifecycles (`REQ-029`).
- **Saved-state flag:** extend `appCardSelect` and `appCardDTO` with
  `is_wishlisted` in the one place all three catalog responses already
  share. Do not add a second catalogue query or a client-side list
  cache — the flag must survive reload and cross-device use
  (`REQ-002`, `REQ-019`).
- **Move-to-cart:** reuse the existing cart rules by extracting the body
  of `CartAdd`'s owned-app check, 20-app cap and idempotent insert into
  one unexported helper used by both `CartAdd` and the new move. Do not
  call `CartAdd` and then a separate wishlist delete: that is two
  transactions and can leave the app on both lists if the second fails
  (`REQ-013`, `REQ-037`).
- **Checkout cleanup:** add one `DELETE` to the existing checkout
  transaction. No event, queue or background job — a failed checkout
  must remove nothing, which a separate job cannot guarantee
  (`REQ-020`, `REQ-038`).
- **Frontend:** plain React components following `AppCard`,
  `CartLine` and `LoadError`. No new dependency; `lucide-react` already
  provides the bookmark and trash icons the `UIMap.md` names.
- **Contract:** extend `api/openapi.yaml` (see `REQ-040` note under the
  Endpoints section). No second contract file.

**No dependency is assumed to exist by implementation time.** The
session middleware, the error envelope, the per-user lock, the catalog
SELECT and the frontend API client were each read in the target repos at
`feat/FEAT-001`, not inferred from convention.

## Components

**New (backend, `paladin-code`):**

- `internal/store/wishlist.go` — `WishlistGet`, `WishlistAdd`,
  `WishlistRemove`, `WishlistMoveToCart`. The only file that adds SQL
  for this feature.
- `migrations/000010_create_wishlist_items.{up,down}.sql`.
- `internal/httpapi/wishlist.go` — the four handlers, the request DTO and
  the error mapping.
- Router entries in `internal/httpapi/app.go`, plus a `WishlistStore`
  interface in `Deps`.
- `is_wishlisted` on `store.AppCard`, `appCardDTO` and `appCardSelect`.

**Touched (backend):**

- `internal/store/cart.go` — `CartAdd`'s app-existence check, owned-app
  check, 20-app cap and `ON CONFLICT DO NOTHING` insert move into an
  unexported `addCartLine(ctx, tx, userID, appID) error`; `CartAdd` and
  `WishlistMoveToCart` both call it under the same `FOR UPDATE` lock.
  Cart behaviour is unchanged.
- `internal/store/checkout.go` — one `DELETE FROM wishlist_items …`
  inside the existing transaction, next to the cart delete.
- `internal/store/store.go` — the `AppCard.IsWishlisted` field and, if
  the list type needs a name, a `Wishlist` alias; sentinels unchanged.
- `internal/httpapi/dto.go` — `IsWishlisted` on `appCardDTO` and
  `toAppCardDTO`.
- `cmd/server/main.go` — wire the same `*store.Store` into
  `Deps.Wishlist`.
- `api/openapi.yaml` — four new paths, the `is_wishlisted` property, a
  `Wishlist` tag and the `MoveToCartResponse` schema.

**Untouched:** `internal/auth`, `internal/config`, `internal/db`,
orders/library handlers, the session cookie, the seed command, the
Docker/compose files, and the nginx proxy. No new environment variable,
no new container, no new dependency.

**New (frontend, `paladin-ui`):**

- `src/core/api/services/wishlist.ts` — `getWishlist`, `saveApp`,
  `removeApp`, `moveToWishlistItemToCart`.
- `src/components/app/WishlistButton.tsx` — one component, `overlay`
  (card) and `block` (detail panel) variants, `aria-pressed`.
- `src/components/app/WishlistRow.tsx` and `src/pages/WishlistPage.tsx`.

**Touched (frontend):**

- `src/core/api/types.ts` + `normalize.ts` — `isWishlisted` on
  `AppSummary`; `Wishlist` / `MoveToCartResult` types.
- `src/components/app/AppCard.tsx` — overlay save control plus its
  hidden `role="status"` line and error slot.
- `src/components/app/PurchasePanel.tsx` — block save button below the
  add-to-cart action.
- `src/App.tsx` — `/wishlist` inside the existing `RequireAuth` block.
- `src/components/app/MenuDialog.tsx` and `Footer.tsx` — the Wishlist
  destination between Catalog and My Library.

**Boundaries that must hold**

- `httpapi` owns HTTP status, DTO shape and validation; `store` owns the
  wishlist invariants and all SQL. No SQL in `httpapi`, no `net/http` in
  `store`.
- The owner is always `userFrom(ctx).ID`. No request body, query string
  or path carries a user id, so a foreign wishlist is not addressable.
- `WishlistMoveToCart` is the only method allowed to write both
  `cart_items` and `wishlist_items`, and it does so in one transaction
  under the per-user lock.
- Checkout is the only other writer of `wishlist_items` deletes besides
  the wishlist handlers.

**Backend authorization**

One role exists: the authenticated buyer. All four wishlist routes are
wrapped in `requireSession`, so an anonymous or expired session is
`401 UNAUTHORIZED` and the frontend redirects to
`/login?next=/wishlist` (`REQ-017`, `REQ-031`). Every wishlist query
filters `user_id` from the session; the API exposes no wishlist-entry id
and no user id, so there is no request shape that names another buyer's
wishlist (`REQ-018`, `REQ-034`). A save or move of an app that happens
to be on another buyer's wishlist creates or changes only the caller's
own row; a remove of an app absent from the caller's list is the
documented no-op (`REQ-004`). There is no admin role and no
user-switching surface (`REQ-041`).

**Filter data-sourcing.** The Wishlist page has no search, filter, sort
or pagination (`REQ-043`; `UIMap.md` removes all four), so no
filter-options endpoint is introduced. The existing catalog filter keeps
`GET /api/v1/categories`, authorized against the catalog page that
consumes it — a rule this feature does not change.

## Data design

The confirmed `schema-designer` output is in `database.md` (draft ERD,
advisory normalization review, one migration batch). Shape:

- `wishlist_items` — `id` identity PK, `user_id` FK `users` (cascade),
  `app_id` FK `apps` (cascade), `added_at` default `now()`,
  `UNIQUE (user_id, app_id)`; index on `app_id`.
- No display columns: name, publisher, category, cover, price, rating
  and the owned/in-cart flags are read live through the existing
  `appCardSelect` joins (`REQ-021`, `REQ-036`).
- No wishlist header table, no size column, no soft delete: one row per
  saved app is the whole model; removal is a physical delete, so
  re-saving produces a fresh newest row (`REQ-022`, `REQ-024`).
- One migration pair, `000010`, no backfill and no seed change.

## Backend — Endpoints

Mount prefix: every wishlist route is under **`/api/v1`**, the prefix the
existing `ServeMux` tree uses (`internal/httpapi/app.go`). The backend
listens on `:8080`; nginx proxies `location /api/` unchanged. These are
the final paths, not paths before a prefix.

| Method | Path | Consumer | Purpose |
|---|---|---|---|
| GET | `/api/v1/wishlist` | `fe` | The session buyer's saved apps, newest-saved first (`REQ-008`, `REQ-010`) |
| POST | `/api/v1/wishlist/items` | `fe` | Save one app; idempotent re-save (`REQ-001`, `REQ-003`, `REQ-023`) |
| DELETE | `/api/v1/wishlist/items/{appId}` | `fe` | Remove one app; idempotent no-op when absent (`REQ-004`, `REQ-011`) |
| POST | `/api/v1/wishlist/items/{appId}/move-to-cart` | `fe` | Add to cart under the existing cart rules and remove the wishlist row in one transaction (`REQ-013`–`REQ-016`, `REQ-037`) |

Every `fe` entry maps to a screen named in `## Frontend` below (Home
catalog card, App detail panel, Wishlist page). No other consumer exists.

**Request/response rules**

- `POST /api/v1/wishlist/items` body: `{"app_id": <integer>}`. The only
  input field. Unknown extra fields are ignored, exactly like
  `POST /cart/items` (`REQ-025`, `REQ-026`).
- `GET /api/v1/wishlist`, `POST /wishlist/items` and
  `DELETE /wishlist/items/{appId}` return the **whole wishlist**:
  `{"apps": [<AppCard>], "count": <n>}` — the same `AppCard` schema the
  catalog returns, now including `is_wishlisted`. One response updates
  the control, the row list and the count.
- `POST /api/v1/wishlist/items/{appId}/move-to-cart` returns both
  resources the page must update in one response:
  `{"wishlist": {"apps": [...], "count": n}, "cart": {"items": [...],
  "count": n, "total_idr": n}}`. The existing `Cart` schema is reused
  verbatim.
- All four return `200 OK` on success, including the idempotent re-save
  and re-remove. No `201`: the resource is the list, not a new entity
  with a server address.
- App-summary change (additive): `GET /api/v1/apps`,
  `GET /api/v1/apps/featured` and `GET /api/v1/apps/{appId}` gain
  `"is_wishlisted": true|false`, computed in the same `appCardSelect`
  query that already computes `is_owned` and `is_in_cart`.
- Errors use the existing envelope
  `{"error":{"code":"...","message":"..."}}` (`app_names` on an
  ownership conflict):

  | Status | Code | When |
  |---|---|---|
  | 400 | `VALIDATION_ERROR` | Body is not a JSON object, exceeds the 1 MiB cap, `app_id` is missing, or `q`-style shape errors. |
  | 401 | `UNAUTHORIZED` | No/expired session (middleware). |
  | 404 | `APP_NOT_FOUND` | The app id — in the body or the path — is not a positive integer or names no catalog app (`REQ-023`, `REQ-033`). |
  | 409 | `CART_FULL` | Move when the cart already holds 20 distinct apps (`REQ-015`). |
  | 409 | `ALREADY_OWNED` | Move of an owned app; `app_names` carries the name (`REQ-016`). |
  | 500 | `INTERNAL` | Anything unexpected; detail logged with the request id only. |

- **Save/remove app-id rule.** `REQ-023` requires an unknown **or
  invalid** app id to be rejected as not-found, and `TC-032` exercises
  both. The handler therefore parses `app_id` leniently: a missing field
  is `400 VALIDATION_ERROR`; a present but non-integer, zero, negative
  or non-existent value is `404 APP_NOT_FOUND`. This differs
  deliberately from `POST /cart/items`, which returns `400` for
  `app_id <= 0` — the wishlist follows its own spec (`REQ-023`,
  `REQ-033`), and the difference is recorded here so it is reviewed, not
  accidental.
- **Move is re-run-safe.** Repeating a move for an app already in the
  cart, or no longer on the wishlist, still returns `200` with the
  current wishlist and cart; the insert is
  `ON CONFLICT (user_id, app_id) DO NOTHING` and the wishlist delete
  affects zero rows (`REQ-014`).
- All responses are already `Cache-Control: no-store` through the
  existing middleware. No pagination (catalog is 12 apps,
  `REQ-024`).

**On `REQ-040`'s contract step.** `spec.md` assigns the
`api/openapi.yaml` extension to `/code-preparation`. This command never
writes a code repository, by design: the four operations, the
`is_wishlisted` property and the response shapes are fixed **here**,
and `/go-dev` performs the `api/openapi.yaml` edit as PART-1 of the
Implementation Plan before writing code. That keeps one writer per
artifact; it is a sequencing fact, not a design gap.

## Frontend

**Repo:** `https://github.com/william22913/paladin-ui`, base branch
`feat/FEAT-001` (confirmed in the task brief: FEAT-001 lives there;
`main` holds only the README). `/fe-dev` owns the implementation. The
feature branch is always `feat/FEAT-002`, which `/fe-dev` creates from
the base branch itself.

**Routes** (from `UIMap.md`; one new route):

| Route | Screen | Data |
|---|---|---|
| `/` (existing) | Home | `GET /apps`, `GET /apps/featured` now include `is_wishlisted`; card gains the save control |
| `/apps/:appId` (existing) | App detail | `GET /apps/{id}` includes `is_wishlisted`; panel gains the save button |
| `/wishlist` (new, inside `RequireAuth`) | Wishlist | `GET /wishlist`; remove and move per row |

**Components.** `WishlistButton` (one component, `overlay` 44px icon
toggle for cards and `block` full-width labelled button for the detail
panel; `aria-pressed`, optimistic toggle, revert on failure),
`WishlistRow` (cart-line anatomy plus rating, owned/in-cart tags, a
"Move to cart" secondary button and a "Remove" text button, its own
`role="alert"` message slot), `WishlistPage` (page head with "N apps",
one notice, list, skeleton / empty / load-error states), plus the
Wishlist link in `MenuDialog` and `Footer`. All plain React + CSS
Modules using the existing `tokens.css`; no new package, no new token
(`UIMap.md`).

**API flow.** `core/api/services/wishlist.ts` is the only place the new
paths are called; pages and components never call `fetch`. The service
returns the server list and the page renders it in server order — the UI
never sorts (`REQ-010`). `move` returns `{wishlist, cart}`, so the
`CartProvider` badge updates from the same response.

**Auth and state.** The new route sits inside the existing
`RequireAuth`; `next=/wishlist` is carried by the existing guard. A
`401` from any wishlist call is already handled by the client's
`unauthorizedHandler` (redirect with `reason=expired`), which satisfies
`REQ-031` with no new code. No wishlist client cache: every mount reads
the server list (`REQ-019`). Saved state on cards comes from
`is_wishlisted` on the app payload, optionally corrected by the
response of a toggle.

**States, responsive, accessibility.** Loading skeleton, empty state
with a catalog link, load-error with retry, per-row in-flight and
blocked messages, session-expired redirect — exactly the states and
breakpoints in `UIMap.md` (720px list column; 360–479px full-width
action buttons; 44px targets; focus rings; reduced-motion collapse).

**Tests and deployment.** Vitest + React Testing Library for the
service/normalizer and the toggle/blocked/move behavior; the Playwright
suite gains a wishlist journey at desktop and phone widths. `npm run
lint`, `npm run typecheck`, `npm test`, `npm run build`. No Docker or
nginx change: the new route is an SPA route under the existing
`try_files` fallback.

## Non-functional concerns

- **Idempotency / re-run safety.** Save is
  `INSERT … ON CONFLICT (user_id, app_id) DO NOTHING`; remove is a
  `DELETE` that returns the list whether or not a row matched; move is
  re-runnable because the cart insert is `ON CONFLICT DO NOTHING` and
  the wishlist delete is unconditional. Checkout cleanup runs inside the
  existing transaction, so replaying the same idempotency key does not
  re-delete anything (`REQ-003`, `REQ-004`, `REQ-014`).
- **Concurrency.** `WishlistMoveToCart` takes the same
  `SELECT … FOR UPDATE` on the `users` row as `CartAdd` and
  `CheckoutCreate`, then runs the shared `addCartLine` helper and the
  wishlist delete before commit. The 20-app cap and the owned-app block
  therefore cannot be checked-then-raced against a concurrent add or
  checkout (`REQ-015`, `REQ-016`, `REQ-037`). `UNIQUE (user_id, app_id)`
  is the database backstop for the one-entry rule (`REQ-022`).
  `WishlistAdd`/`WishlistRemove` do not take the user lock: they only
  touch their own table, and their outcomes (entry in both lists, or
  neither) are legal states (`REQ-029`).
- **Checkout atomicity.** The wishlist delete sits in the same
  transaction as the order, license inserts and cart delete; any
  rejection (`EMPTY_CART`, `ALREADY_OWNED`, a failed insert) rolls the
  whole transaction back, so a rejected checkout removes nothing
  (`REQ-038`).
- **Security.** All SQL is parameterized; the wishlist owner is read
  only from the session context; the request body is capped at 1 MiB by
  `decodeJSON`; unsafe methods pass the existing `Origin` check; no
  free-text field exists to validate or render (`REQ-025`, `REQ-026`).
  Errors are generic to the client and detailed only in the log, with
  the request id (`REQ-028`).
- **Performance.** One extra `EXISTS` subquery on a per-user index for
  the catalog reads, one join for the wishlist list, no N+1. Catalog is
  12 apps and a buyer's wishlist is bounded by it (`REQ-024`).
- **Deployment.** No new service, container, environment variable,
  migration batch beyond `000010`, or dependency. The existing compose
  stack and `/healthz` are unchanged.

## Observability

- **Current state.** The service already has a `log/slog` JSON access
  log middleware (`request_id`, `method`, `path`, `status`,
  `duration_ms`, `user_id`), panic recovery, and `/healthz` pinging the
  DB. There is no `/metrics` route and no Prometheus collector;
  FEAT-001 recorded that as reasoned not-applicable for this
  local-compose deliverable, and no metrics backend has been added
  since. The service does not use nexcommon.
- **Decision.** Reuse the existing instrumentation; do not wire a
  metrics client. No new scrape target exists, so an added collector
  would emit into nothing.
- **Implementation boundary.** The four new routes are covered
  automatically by the existing access log; no handler logs request
  bodies or user data. Existing `writeStoreError` logs the detail of a
  `500` with the request id and returns `INTERNAL`. Conflict responses
  (`404 APP_NOT_FOUND`, `409 CART_FULL`, `409 ALREADY_OWNED`) are
  normal outcomes and are recorded by the access log's status field.
- **Verification.** On a running stack: `POST /api/v1/wishlist/items`
  with a valid app id returns `200` and one log line with `status=200`
  and the path; the same call with `999999` returns `404` and logs
  `status=404`; moving a 21st app into a full cart returns `409` and
  logs `status=409`; `/healthz` still returns `200` while Postgres is
  up. The list response is checked for `is_wishlisted` on
  `GET /apps`.
- **Feature-specific metrics.** None needed. The spec defines no
  dashboard, counter or SLO for the wishlist; the access log is enough
  to debug the journey.

## Spec traceability

One line per active `spec.md` requirement, with the concrete
architectural answer and where it is enforced.

| Req | Architectural answer | Status |
|---|---|---|
| REQ-001 | `POST /api/v1/wishlist/items` is wired to the `WishlistButton` on every `AppCard` (`overlay`) and on `PurchasePanel` (`block`); both call the same endpoint. | covered |
| REQ-002 | `is_wishlisted` is computed in `appCardSelect` and returned on the catalog, featured and detail responses, so a reload restores the saved state; toggling off calls `DELETE /wishlist/items/{appId}`. | covered |
| REQ-003 | `UNIQUE (user_id, app_id)` plus `INSERT … ON CONFLICT DO NOTHING`; a repeat save returns `200` and the unchanged list. | covered |
| REQ-004 | `DELETE` is an unconditional `DELETE FROM wishlist_items WHERE user_id=$1 AND app_id=$2`; zero rows affected still returns `200` with the list, no error. | covered |
| REQ-005 | One `wishlist_items` table keyed by `(user_id, app_id)`; both entry points call the same endpoint, so there is exactly one entry and no per-surface list. | covered |
| REQ-006 | Save checks only that the app exists; it never reads `licenses`. Ownership is checked only by move-to-cart. | covered |
| REQ-007 | Every mutation returns the updated list; the FE toggles optimistically, reverts on failure, and shows the `role="status"` / `role="alert"` message from `UIMap.md`; blocked moves return `409` with a code the FE maps to human copy. | covered |
| REQ-008 | `GET /api/v1/wishlist` returns every `wishlist_items` row for the session user, joined to the catalog for display fields. | covered |
| REQ-009 | The list reuses `appCardDTO`: `cover_url`, `name`, `publisher`, `category`/`category_name`, current `price_idr` and `rating`, all read live from `apps`/`categories`. | covered |
| REQ-010 | `ORDER BY wi.added_at DESC, wi.id DESC`; `now()` is the transaction timestamp and `id` breaks the same-transaction tie deterministically. | covered |
| REQ-011 | `DELETE /api/v1/wishlist/items/{appId}` removes the row; the FE drops it from the list; the state is in PostgreSQL, so it survives reload and later login. | covered |
| REQ-012 | `/wishlist` route added inside `RequireAuth`, with links in `MenuDialog` and `Footer` between Catalog and My Library. | covered |
| REQ-013 | `POST /wishlist/items/{appId}/move-to-cart` inserts the cart line and deletes the wishlist row in one transaction and returns both resources. | covered |
| REQ-014 | The cart insert is `ON CONFLICT DO NOTHING`, so an existing cart line is untouched; the wishlist delete still runs; the response's `cart` shows the app with quantity implicit 1. | covered |
| REQ-015 | The shared `addCartLine` helper counts distinct cart rows under the per-user lock and returns `ErrCartFull` → `409 CART_FULL`; the transaction rolls back, leaving the wishlist row intact. | covered |
| REQ-016 | The same helper checks `licenses` for `(user_id, app_id)` and returns `OwnedError` → `409 ALREADY_OWNED`; the rollback leaves the wishlist row intact. | covered |
| REQ-017 | All four routes are wrapped in `requireSession` (`401` otherwise); the FE route sits in `RequireAuth` and carries `next=/wishlist`. | covered |
| REQ-018 | Every query filters `user_id` from the session context; no route or DTO accepts a user id or a wishlist-entry id, so another buyer's list is not addressable and no foreign data can be returned. | covered |
| REQ-019 | The wishlist is a PostgreSQL table keyed by `user_id`, not cookie or client state; logout, session expiry and other devices all read the same rows. | covered |
| REQ-020 | `CheckoutCreate` adds `DELETE FROM wishlist_items WHERE user_id=$1 AND app_id = ANY($2)` beside the existing cart delete, before commit. | covered |
| REQ-021 | No price column is stored; the list joins `apps.price_idr` at read time, so a catalog price change appears on the next load. | covered |
| REQ-022 | `UNIQUE (user_id, app_id)` on `wishlist_items`; two buyers may each have the same `app_id`. | covered |
| REQ-023 | Save and move resolve the app id against `apps` in the transaction before any write; no row → `404 APP_NOT_FOUND`; a non-integer, zero or negative id is also `404` (handler parse rule above); nothing is written. | covered |
| REQ-024 | There is no count check, cap column or size notice anywhere in the store or UI; the catalog size is the only bound. | covered |
| REQ-025 | The handler takes the owner only from `userFrom(ctx)`; the request DTO has only `app_id`; unknown extra fields (including a supplied user id) are ignored by `decodeJSON`. | covered |
| REQ-026 | No free-text or numeric user field exists; the schema has only `user_id`, `app_id` and `added_at`. | covered |
| REQ-027 | `GET /wishlist` returns `{"apps":[],"count":0}`; the FE renders the `UIMap.md` empty state with a "Browse the catalog" link. | covered |
| REQ-028 | Any list read failure becomes the generic `INTERNAL` envelope (`500`); the FE renders the existing `LoadError` with retry, never a raw error. | covered |
| REQ-029 | Wishlist and cart are separate tables with independent writes; saving never touches `cart_items`. Both lists may hold the same app. | covered |
| REQ-030 | Save does not consult `licenses`, so an owned app is saved normally; `is_owned` on the row shows the tag, and move returns `409 ALREADY_OWNED`. | covered |
| REQ-031 | An expired session yields `401` from `requireSession`; the existing FE client redirects with `reason=expired`; the wishlist rows are untouched and reload after login. | covered |
| REQ-032 | Same mechanism as REQ-021: no snapshot column, live `apps.price_idr` on every read. | covered |
| REQ-033 | Same path as REQ-023 for both save and move: app existence is checked before any write; `404` changes neither `wishlist_items` nor `cart_items`. | covered |
| REQ-034 | No wishlist-entry id and no user id exist in the contract; all reads, deletes and moves are scoped to the session user, so a request cannot name another buyer's data. | covered |
| REQ-035 | Wishlist routes require a session and take identity from the existing session middleware and `sessions` table. | covered |
| REQ-036 | The list joins `apps` and `categories`; only `user_id`, `app_id` and `added_at` are stored in `wishlist_items`. | covered |
| REQ-037 | Move reuses the extracted `addCartLine` helper under the same per-user lock as `CartAdd`: quantity implicit 1, 20 distinct apps, owned app blocked. No second cart mechanism exists. | covered |
| REQ-038 | Wishlist cleanup is part of the checkout transaction; `EMPTY_CART`/`ALREADY_OWNED`/errors roll back the transaction, so nothing is removed from the wishlist. | covered |
| REQ-039 | Extends the existing Go module and React app only; no new dependency, no `nexcommon`, no `nexcomponent`. | covered |
| REQ-040 | The four operations, `is_wishlisted` and both response shapes are fixed in this document; `/go-dev` writes the `api/openapi.yaml` extension in PART-1 before implementing. This command does not write code repositories. | covered |
| REQ-041 | One backend service and its own PostgreSQL; no outbound client, no other service, no external integration. | covered |
| REQ-042 | The Implementation Plan sequences all backend and frontend work for this pass; nothing in scope is deferred. | covered |
| REQ-043 | No sharing, notifications, named lists, guest merge, bulk add, header badge, admin, price history or import/export is built; no route, column or control exists for them. | covered |
| REQ-044 | A card save and a detail save both call the same endpoint; `is_wishlisted` updates both controls; the list shows one row (`REQ-001`–`REQ-007`). | covered |
| REQ-045 | Server-side rows keyed by `user_id`; logout/login and a second session read the same list (`REQ-019`). | covered |
| REQ-046 | `DELETE` removes the row; reload and later login read the database state (`REQ-011`). | covered |
| REQ-047 | Move returns `{wishlist, cart}`: the app is in the cart and absent from the wishlist; an existing cart line is preserved without duplication (`REQ-013`, `REQ-014`). | covered |
| REQ-048 | `409 CART_FULL` / `409 ALREADY_OWNED` with the transaction rolled back; the FE keeps the row and maps each code to its message (`REQ-015`, `REQ-016`). | covered |
| REQ-049 | Checkout deletes purchased `app_id`s from `wishlist_items` in the same transaction (`REQ-020`). | covered |
| REQ-050 | All access is session-scoped; no identifier exists that could name another buyer's wishlist (`REQ-018`, `REQ-034`). | covered |
| REQ-051 | Empty (`REQ-027`), load-error with retry (`REQ-028`) and expired-session redirect (`REQ-031`) are all rendered by the FE states above. | covered |

## Implementation Plan

- PART-1: OpenAPI contract extension — four wishlist paths, the `Wishlist` tag, `Wishlist` / `MoveToCartResponse` schemas and `is_wishlisted` on `AppCard` in `api/openapi.yaml` — deliverable: the approved contract contains the operations below before any handler is written (`REQ-040`).
- PART-2: Data layer — `000010_create_wishlist_items` up/down pair; `WishlistGet`/`WishlistAdd`/`WishlistRemove`/`WishlistMoveToCart`; extract `addCartLine` from `CartAdd` and call it from both paths — deliverable: migration applies cleanly and the store methods pass their tests.
- PART-3: HTTP surface — the four handlers, request parsing and error mapping, `WishlistStore` in `Deps`, router entries, and `is_wishlisted` on `appCardSelect`/`appCardDTO` — deliverable: all four endpoints return the documented shapes and codes.
- PART-4: Checkout cleanup — delete purchased apps from `wishlist_items` inside the existing transaction — deliverable: a successful checkout removes only the purchased apps; a rejected one removes nothing.
- PART-5: Frontend — `is_wishlisted` in types/normalizer, `wishlist` service, `WishlistButton` on card and detail panel, `WishlistRow`, `WishlistPage` at `/wishlist`, navigation links, and the loading/empty/error/blocked states — deliverable: the wishlist journey works at desktop and phone widths.

## Planned breaking changes

None. Every change is additive: four new routes, one new table and one
new response field (`is_wishlisted`). No existing endpoint, response
property, route, table or column is removed, renamed or made required.

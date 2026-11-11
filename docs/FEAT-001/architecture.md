---
feature_code: FEAT-001
service: paladin
version: 1
status: complete
spec_version: 1
code_repo: https://github.com/william22913/paladin-code
release_branch: main
integration_branch: feat/FEAT-001
stack: go
frontend_repo: https://github.com/william22913/paladin-ui
frontend_base_branch: main
dev_feedback: []
code_prep_feedback: []
sources: []
pr_url: https://github.com/william22913/sandbox-docs/pull/35
last_updated: 2026-11-11
---

# FEAT-001 — Paladin storefront v1 — Architecture

## Survey notes (Part 2)

Both target repositories were surveyed remotely at their confirmed base
branch, `main`:

- `https://github.com/william22913/paladin-code` — exists, default
  branch `main`, **empty** (no refs, no `CLAUDE.md`, no `PROJECT.md`, no
  source tree, no shared library to reuse).
- `https://github.com/william22913/paladin-ui` — exists, default branch
  `main`, **empty** (same).

Both are genuinely greenfield, so there is no existing convention, layer
split, build command or component library to respect. Stack choice is
open and is decided below. `REQ-049` explicitly excludes `nexcommon` and
`nexcomponent-ui`, and the panel's own component-one repositories are
empty, so nothing is reused from them in v1. The user confirmed both
repositories and `main` as the base branch in the task brief.

## Stack / integration decisions

**Stack: `go`.** The feature is a request/response HTTP API consumed by a
React storefront: login, catalog reads, per-user cart, one transactional
checkout. There is no scheduled, batch, file-ingest or warehouse work,
which is what would have made this an `airflow` feature. Evidence from
the target repo: empty, so the task brief is the deciding source.

| Area | Tool | Purpose |
|---|---|---|
| Language | Go 1.22+ | API service; `ServeMux` method patterns (`GET /path/{id}`) so no third-party router |
| HTTP | stdlib `net/http` | Router, middleware, handlers; no web framework |
| Database | PostgreSQL 16 | Accounts, catalog, carts, orders, licenses |
| DB driver | `github.com/jackc/pgx/v5` + `pgxpool` | Plain parameterized SQL; no ORM |
| Migrations | `github.com/golang-migrate/migrate/v4` with embedded `io/fs` source and the `pgx/v5` database driver | Ordered `*.up.sql` / `*.down.sql` pairs, tracked in `schema_migrations` |
| Passwords | `golang.org/x/crypto/bcrypt` | Password hashing and verification |
| Sessions | own `sessions` table + opaque cookie | Cookie-session auth (HttpOnly), not a stateless signed token |
| Logging | stdlib `log/slog` (JSON handler) | Structured request/error logs |
| Frontend | React 18 + Vite + TypeScript, `react-router-dom` v6 | SPA storefront |
| FE styling | CSS Modules + a `tokens.css` design-token layer | Plain React per `REQ-049`; no UI library |
| FE assets | `@fontsource/oswald`, `@fontsource/inter`, `lucide-react` | Self-hosted fonts and the icon set named in `UIMap.md` |
| FE data | native `fetch` wrapper (`adapter -> service -> hook -> page`) | No Axios dependency needed for six resource groups |
| Containers | `postgres:16-alpine`, Go multi-stage image, `nginx:alpine` | One local compose stack |

**Reuse vs. build.** Nothing exists to reuse, so every concern is built
here. The calls that matter:

- **Routing:** stdlib `ServeMux` — a router dependency buys nothing for
  fourteen routes in Go 1.22.
- **Auth:** built here, not consumed from another service (there is no
  other Paladin service, `REQ-050`). Rationale for a server-side session
  table rather than a signed stateless cookie: logout must genuinely end
  the session (`REQ-005`), which a stateless token cannot do without a
  revocation list — a session row is that list, and it is one table.
- **Migrations:** `golang-migrate` rather than a hand-rolled SQL runner;
  it provides version tracking, dirty-state detection and an advisory
  lock, and it is the "golang-migrate style" the brief names.
- **Frontend:** no `nexcomponent-ui` and no Ant Design (`REQ-049`).
  Components are composed from native HTML plus CSS Modules, as
  `DesignBrief.md` and `UIMap.md` already specify. `lucide-react` is the
  one icon dependency; every icon in the map exists there.

## Components

All components are new; the service and the UI are greenfield, and no
other service is touched.

**Backend (`paladin-code`)**

- **`cmd/server`** — config load, pool open, migrations, router, graceful
  shutdown on `SIGINT`/`SIGTERM`.
- **`cmd/seed`** — idempotent seed: 5 bcrypt accounts, 5 categories,
  12 apps with screenshots/supported OS, featured flags, and one prior
  order + license for `buyer1` so the "already owned" path is
  exercisable on a fresh stack. Validates every app before writing
  (`price_idr >= 0`, required display fields) and exits non-zero on a
  bad fixture (`REQ-034`, TC-059).
- **`internal/config`** — environment parsing: `DATABASE_URL`, `PORT`
  (default `8080`), `COOKIE_SECURE` (default `false` for local HTTP),
  `APP_ORIGIN` (default `http://localhost:3000`), `SESSION_TTL`
  (default `24h`).
- **`internal/db`** — `pgxpool` construction, embedded migrations,
  `/healthz` ping.
- **`internal/auth`** — bcrypt hash/verify, random session token
  generation, SHA-256 token hashing at rest, session create/lookup/
  delete, the dummy-hash compare used to keep unknown-user login timing
  indistinguishable.
- **`internal/store`** — the only package with SQL. Domain methods own
  their transactions: `Catalog.List/Featured/Get`, `Cart.Get/Add/Remove`,
  `Checkout.Create`, `Orders.List/Get`, `Library.List`. Handlers never
  compose SQL.
- **`internal/httpapi`** — `ServeMux` tree, the middleware chain
  (request-ID, panic recovery, access log, session), request DTOs,
  validation, the JSON error envelope, and response helpers.

**Frontend (`paladin-ui`)** — detailed in `## Frontend` below. The
boundary is: pages never call `fetch` directly; a `core/api` service
module owns the HTTP, a feature hook owns loading/error state, and
presentational components stay dumb.

**Boundaries that must hold**

- Handlers own HTTP concerns (decode, validate shape, map errors to
  status codes); `store` owns business invariants and SQL (ownership,
  cart cap, checkout transaction). No SQL in `httpapi`, no `http` types
  in `store`.
- The session user ID is never read from a request body or query
  parameter. It comes only from the session middleware's request
  context.
- The catalog filter's option list comes from `GET /api/v1/categories`,
  authorized against the **consuming catalog page's** permission (any
  authenticated buyer). There is no catalog-management permission in
  v1, so the filter is never coupled to an admin-only read.

**Backend authorization**

One role exists: an authenticated buyer. Every route under `/api/v1`
except `POST /api/v1/auth/login` requires a valid session
(`requireSession`). Every user-scoped query takes `user_id` from that
session and filters on it. Cross-user reads are impossible by
construction; a foreign order and an unknown order are the same
`WHERE ... AND user_id = $n` zero-row result, so both return `404`
(`REQ-031`, `REQ-044`, `REQ-056`). There is no admin route, no
user-switching parameter, and no endpoint that accepts a user id.

## Data design

See `database.md` for the confirmed `schema-designer` output: draft ERD,
advisory normalization review, batched migration plan and seed plan.
Summary of the shape:

- `users` — seeded accounts; `username` 3–50 with a case-insensitive
  unique index, bcrypt `password_hash`.
- `sessions` — opaque token hash, `user_id`, fixed `expires_at`.
- `categories` — the five seeded slugs and display names.
- `apps` — catalog row: publisher, category FK, version, description,
  `price_idr` (integer IDR, `>= 0`), rating, cover URL, featured flag
  and featured order.
- `app_screenshots`, `app_platforms` — ordered gallery URLs and
  supported-OS values per app.
- `cart_items` — one row per `(user_id, app_id)`, so quantity is always
  one and re-adding is a no-op enforced by `UNIQUE (user_id, app_id)`.
- `orders` — one row per checkout: user, immutable `total_idr`,
  `idempotency_key`. The display reference is **computed in Go** as
  `PAL-%04d` from `id`; it is not a stored column, so there is no second
  sequence and no `lpad` truncation at five digits.
- `licenses` — one row per purchased app: user, app, order, unique
  license key, and the purchase-time `price_idr` snapshot.
  `UNIQUE (user_id, app_id)` is the database-level guarantee that an app
  never appears twice in a library; `UNIQUE (order_id, app_id)` is "one
  key per app per order"; this single table is both the order line and
  the library entry. `user_id` is denormalized from the order, and a
  composite FK `(order_id, user_id) → orders(id, user_id)` prevents the
  two from ever disagreeing. The purchase date and app name are read
  through the joins to `orders`/`apps`, not duplicated.

The full column-level design, FK `ON DELETE` choices, indexes and the
migration batches are in `database.md`. No DDL is written by this
document; the confirmed plan is the handoff `/go-dev` implements.

## Backend — Endpoints

Mount prefix: every API route is under **`/api/v1`**; the backend listens
on `:8080`. nginx serves the SPA and proxies `location /api/` to
`http://backend:8080` unchanged. `/healthz` is deliberately outside
`/api` so the container healthcheck is not session-guarded. These are
the final paths the frontend consumes, not paths before a prefix.

| Method | Path | Consumer | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/login` | `fe` | Verify seeded credentials, create session, set HttpOnly cookie |
| POST | `/api/v1/auth/logout` | `fe` | Delete the session row and clear the cookie |
| GET | `/api/v1/me` | `fe` | Current user; the SPA's session probe |
| GET | `/api/v1/categories` | `fe` | Category filter options for the Home page (`REQ-009`, `REQ-038`) |
| GET | `/api/v1/apps/featured` | `fe` | Up to six featured apps in seed order (`REQ-008`) |
| GET | `/api/v1/apps?category=&q=` | `fe` | Catalog list; category filter and name search combine (`REQ-009`, `REQ-010`, `REQ-037`, `REQ-038`) |
| GET | `/api/v1/apps/{appId}` | `fe` | App detail incl. screenshots and supported OS (`REQ-012`, `REQ-013`) |
| GET | `/api/v1/cart` | `fe` | The signed-in user's cart with total (`REQ-015`, `REQ-016`) |
| POST | `/api/v1/cart/items` | `fe` | Add one license for an app; idempotent re-add (`REQ-014`, `REQ-018`, `REQ-019`, `REQ-020`) |
| DELETE | `/api/v1/cart/items/{appId}` | `fe` | Remove a line (`REQ-015`) |
| POST | `/api/v1/checkout` | `fe` | Simulated checkout; one order, one key per app, cart emptied (`REQ-022`–`REQ-027`) |
| GET | `/api/v1/orders` | `fe` | The signed-in user's orders, newest first (`REQ-030`) |
| GET | `/api/v1/orders/{reference}` | `fe` | One order; foreign or unknown → 404 (`REQ-024`, `REQ-031`, `REQ-044`) |
| GET | `/api/v1/library` | `fe` | Owned apps with key, purchase date, order reference (`REQ-029`, `REQ-040`) |
| GET | `/healthz` | `service:docker-compose` | Liveness/readiness: DB ping, `200` or `503` |

Every `fe` consumer above maps to a screen named in `## Frontend` (Login,
Home, App detail, Cart, Checkout, Order confirmation, My Library,
Orders). The category filter's options endpoint is
`GET /api/v1/categories`; it is authorized for any authenticated buyer,
matching the catalog page that consumes it.

**Request/response rules**

- Success bodies are the resource itself. Errors use one envelope:
  `{"error":{"code":"...","message":"...","app_names":["..."]}}`
  (`app_names` only on the checkout ownership conflict).
- Codes: `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401),
  `INVALID_CREDENTIALS` (401), `NOT_FOUND` (404), `APP_NOT_FOUND` (404),
  `ALREADY_OWNED` (409), `CART_FULL` (409), `EMPTY_CART` (409),
  `INTERNAL` (500).
- `POST /api/v1/checkout` requires `{"idempotency_key": "<uuid>"}`;
  it returns `201` for a new order and `200` with the existing order
  when that key was already used.
- `POST /api/v1/cart/items` and `DELETE /api/v1/cart/items/{appId}`
  return the full cart (`items`, `count`, `total_idr`) so the header
  badge updates from one response.
- All API responses are `Cache-Control: no-store`; `index.html` is
  served `no-store` too, so a Back navigation revalidates against the
  session (`REQ-005`). Ids in paths are the internal bigint app id and
  the computed order reference (`PAL-0001` style); neither is a secret.
- No pagination in v1: the seeded catalog is 12 apps and a buyer's
  orders/library are tiny. This is deliberate; add paging when the
  catalog stops being seed-sized.

## Frontend

**Repo:** `https://github.com/william22913/paladin-ui`, base branch
`main` (confirmed in the task brief; the repo is empty). `/fe-dev` owns
the implementation. The feature branch convention is `feat/FEAT-001`;
`/fe-dev` creates it from `main` itself.

**Routes** (exactly the set in `DesignBrief.md`/`UIMap.md`):

| Route | Screen | Data |
|---|---|---|
| `/login` | Login | `POST /auth/login`; `next`, `reason=expired` query params |
| `/` | Home | `GET /apps/featured`, `GET /categories`, `GET /apps?category=&q=`; `q`/`category` in the URL |
| `/apps/:appId` | App detail | `GET /apps/{id}`, `POST /cart/items` |
| `/cart` | Cart | `GET /cart`, `DELETE /cart/items/{appId}` |
| `/checkout` | Checkout | `GET /cart`, `POST /checkout` |
| `/orders/:orderId?placed=1` | Order confirmation | `GET /orders/{reference}`; `placed=1` adds the success framing |
| `/library` | My Library | `GET /library` |
| `/orders` | Orders | `GET /orders` |
| `*` | Not found | shared state page |

**Components and behavior.** Plain React + CSS Modules, dark theme only,
zero radius, the Oswald/Inter scale and color tokens from
`DesignBrief.md`. Shared pieces: app shell/top bar/menu `<dialog>`, cart
badge, button variants, text/password/search fields, category tabs, app
card, featured rail (scroll-snap, no autoplay), rating stars, IDR price
formatter (`FREE` at 0), owned/in-cart tags, screenshot gallery,
purchase panel, cart line/summary, checkout summary, license-key field
with copy, order accordion, state page (empty/error/not-found/success),
inline notice, CSS skeleton, footer, skip link. `UIMap.md` is the source
for every visual, state, motion and responsive detail; this document
sets only the data boundary.

**API flow.** `core/api/client.ts` (native `fetch`, `credentials:
same-origin`, JSON, typed `ApiError`) → `core/api/services/*` (auth,
catalog, cart, orders, library) → feature hooks → pages. Pages and
components never call `fetch` directly. The endpoint list above is the
v1 contract; `/go-dev`'s generated OpenAPI must not drift from it.

**Auth and state.** An `AuthProvider` calls `GET /me` once on mount and
exposes `loading | authenticated | anonymous`. `RequireAuth` redirects
anonymous visitors to `/login?next=<pathname+search>`; `Login` navigates
to `next` (or `/`) with `replace`. Any API `401` clears the auth state
and redirects with `reason=expired`; the cart lives server-side so it
survives (`REQ-043`, TC-068). Logout posts, clears state and replaces
history with `/login`; a `pageshow` handler re-probes `/me` when the page
is restored from the back-forward cache, so Back does not show an
authenticated view (`REQ-005`). Cart badge state is a small
`CartProvider` refreshed from the cart returned by add/remove/checkout.
No Redux: one auth context and one cart-count context cover the app.

**Responsive and accessibility.** Breakpoints and per-screen rules come
from `UIMap.md` (480/768/1024/1280/1440/1920; desktop two-column detail
and cart, single column below 1024; sticky bottom purchase/checkout bars
on phones). Focus rings, 44px hit targets, `aria-live` result counts and
copy confirmations, dialog focus trap, reduced-motion collapse and
keyboard-operable gallery/accordion are requirements of the design, not
optional polish.

**Tests and deployment.** Vitest + React Testing Library for the IDR
formatter, auth guard/redirects, debounced search and cart state; a
Playwright desktop + phone smoke of login → catalog → detail → cart →
checkout → confirmation → library. `npm run lint`, `tsc --noEmit`,
`npm run build`. Production image: multi-stage Node build → `nginx:alpine`
serving `dist/`, SPA fallback `try_files $uri /index.html`,
`location /api/ { proxy_pass http://backend:8080; }`, and `no-store` on
`index.html`.

**Local stack.** `paladin-code/docker-compose.yml` is the one stack:
`postgres`, `backend`, `frontend`. The frontend build uses
`context: ${PALADIN_UI_PATH:-../paladin-ui}` (both repos checked out side
by side), and nginx proxies `/api/` to `backend:8080`. The README
documents the two-clone layout. `/go-dev` and `/fe-dev` each own their
repo's Dockerfile; neither writes the other's.

## Non-functional concerns

- **Idempotency / re-run safety.** Seed is idempotent (upserts keyed on
  natural keys; the prior `buyer1` order is created only if absent).
  Checkout is idempotent by `(user_id, idempotency_key)`: a fast-path
  replay lookup runs before locking, and the insert uses
  `ON CONFLICT … DO NOTHING RETURNING` so a concurrent duplicate returns
  the winner's order (`REQ-026`).
- **Concurrency.** Cart mutation and checkout share one per-user
  serialization point: `SELECT id FROM users WHERE id = $1 FOR UPDATE`
  as the first statement after `BEGIN` (an advisory lock is the
  equivalent). Under that lock, checkout re-checks the idempotency key,
  reads the cart, checks `licenses` for any owned app, inserts the order
  and one license per app, then deletes the cart rows — so the 20-app
  cap, the "reject the whole checkout if any app is owned" rule and the
  double-submit case are serialized rather than checked-then-raced
  (`REQ-020`, `REQ-025`, `REQ-026`). `UNIQUE (user_id, app_id)` on
  `licenses` and the composite FK stay as database-level backstops.
  Default `READ COMMITTED` plus this lock is sufficient; `SERIALIZABLE`
  is not needed.
- **Security.** bcrypt passwords; session tokens are 32 random bytes,
  stored only as SHA-256 hashes; cookie is `HttpOnly`, `SameSite=Lax`,
  `Path=/`, `Max-Age=86400`, `Secure` when `COOKIE_SECURE=true`; a new
  session row is created on every login (no fixation); login returns one
  generic error and compares against a dummy hash for unknown users; all
  SQL is parameterized; unsafe methods also check the `Origin` header
  against `APP_ORIGIN` as defence in depth; request bodies are capped at
  1 MiB and `q` at 100 characters. No user input is rendered as HTML.
  Local compose defaults are development-only and documented as such.
- **Performance.** The catalog is 12 rows; list/detail use one query with
  `LEFT JOIN`s for `is_owned` / `is_in_cart`, and order/library lists use
  two queries (orders + their licenses), so there is no N+1. Indexes are
  listed in `database.md`.
- **Immutable orders.** No update/delete endpoint or SQL write path
  exists for `orders`/`licenses`; the purchase-price snapshot is frozen
  (`REQ-027`, `REQ-028`).
- **Deployment.** Healthchecks on Postgres (`pg_isready`) and backend
  (`/healthz`); backend starts only after a healthy DB; graceful shutdown;
  pool sizes kept small so the local stack fits the verification runner's
  ~1.2 GB budget.

## Observability

- **Current state.** Greenfield service: no `/metrics` route, no
  collector, no dashboards, no pinned shared library. `nexcommon` and its
  Prometheus conventions are explicitly out of scope (`REQ-049`).
- **Decision.** Prometheus metrics are **not applicable** in v1: there is
  no metrics backend or scrape target in this local-compose-only
  deliverable, and adding a metrics client would be the only consumer of
  a metric nobody collects. The decision is to instrument structured
  logging plus a health endpoint, and to revisit metrics when the service
  gets a real deployment target.
- **Implementation boundary.** `log/slog` JSON access log middleware
  emits `request_id`, `method`, `path`, `status`, `duration_ms` and
  `user_id` (when authenticated) for every request; panic recovery logs
  the stack and returns `INTERNAL`; checkout conflicts log at `warn`
  with the error code and app ids (not license keys or passwords). No
  request bodies or credentials are logged. `/healthz` pings the DB and
  returns `200`/`503`.
- **Verification.** On a running stack: a `GET /api/v1/apps` returns 200
  and emits one log line with `status=200`; a login with a wrong password
  returns 401 and logs `status=401` with code `INVALID_CREDENTIALS`;
  `/healthz` returns 200 while Postgres is up and 503 when it is stopped.
- **Feature-specific metrics.** None needed. The spec defines no
  dashboard, SLO or counter; the access log is enough to debug the v1
  journey.

## Spec traceability

One line per active `spec.md` requirement, with the concrete
architectural answer and where it is enforced.

| Req | Architectural answer | Status |
|---|---|---|
| REQ-001 | `POST /api/v1/auth/login`; `users` seeded with bcrypt hashes; `/login` is the only public screen. | covered |
| REQ-002 | Login creates a session and returns the user; the FE carries `next` through the redirect and navigates there (or `/`) with `replace`. | covered |
| REQ-003 | Unknown user and wrong password both return `401 INVALID_CREDENTIALS` with the one message "Invalid username or password."; an unknown user is compared against a dummy bcrypt hash so timing does not distinguish it. | covered |
| REQ-004 | `requireSession` guards every `/api/v1` route except login (401); `RequireAuth` sends the browser to `/login?next=<path+query>`. | covered |
| REQ-005 | `POST /api/v1/auth/logout` deletes the session row and clears the cookie; the FE replaces history to `/login` and re-probes `/me` on `pageshow`; API and `index.html` are `no-store`. | covered |
| REQ-006 | Session row `expires_at = now() + 24h` and cookie `Max-Age=86400`; an expired row is treated as unauthenticated (401) and deleted. | covered |
| REQ-007 | Home composes a static hero, `GET /apps/featured`, `GET /categories` + `GET /apps` (category), and `GET /apps?q=` (search). | covered |
| REQ-008 | `apps.is_featured` + `featured_order`; featured endpoint orders by `featured_order` and limits 6; seed sets five. | covered |
| REQ-009 | `categories` is seeded with the five slugs; `GET /apps?category=<slug>` filters on the category FK. | covered |
| REQ-010 | `GET /apps?q=` matches `strpos(lower(name), lower($q)) > 0`, combinable with `category`; `q` is trimmed and capped at 100; the FE clears the URL param to restore the category view. | covered |
| REQ-011 | List DTO returns `cover_url`, `name`, `publisher`, `category`, `price_idr`, `rating` for every card. | covered |
| REQ-012 | `GET /apps/{id}` returns name, publisher, category, version, IDR price, description, cover, screenshots, supported OS and rating. | covered |
| REQ-013 | Unknown or non-numeric app id returns `404 NOT_FOUND`; the FE renders the shared not-found state. | covered |
| REQ-014 | `POST /api/v1/cart/items` is wired to both the card action and the detail purchase panel. | covered |
| REQ-015 | `cart_items` is one row per `(user_id, app_id)` (quantity is implicit 1); `GET /cart` lists cover/name/price and the total; `DELETE /cart/items/{appId}` removes a line. | covered |
| REQ-016 | Cart total is `SUM(apps.price_idr)` at read time; no tax/fee/discount columns or code exist. | covered |
| REQ-017 | Cart rows are keyed by `user_id` in PostgreSQL, not stored in the session, so logout/login preserves the cart and no user can read another's. | covered |
| REQ-018 | Re-add is `INSERT ... ON CONFLICT (user_id, app_id) DO NOTHING`, returning the unchanged cart; it never creates a second line or raises quantity. | covered |
| REQ-019 | Add-to-cart checks `licenses` for `(user_id, app_id)` and returns `409 ALREADY_OWNED`; list/detail expose `is_owned` so the FE disables the action. | covered |
| REQ-020 | Add-to-cart takes the per-user lock, then counts the cart before insert; the 21st distinct app returns `409 CART_FULL` and inserts nothing. | covered |
| REQ-021 | Checkout with no cart rows returns `409 EMPTY_CART`; the FE hides the checkout action on an empty cart. | covered |
| REQ-022 | The checkout body is `{idempotency_key}` only; there is no payment field, provider call or card data anywhere. | covered |
| REQ-023 | One transaction inserts one `orders` row, one `licenses` row (and key) per cart app, and deletes the cart rows. | covered |
| REQ-024 | One transaction returns one order with a computed reference (`PAL-%04d` from `id`), date, `total_idr`, and each app with its license key (`UNIQUE (order_id, app_id)`); `GET /api/v1/orders/{reference}` parses the suffix back to `id` and returns it. | covered |
| REQ-025 | The checkout transaction re-selects owned app names for the cart; any hit rolls back with `409 ALREADY_OWNED` and `app_names`, leaving no order/key and the cart intact. | covered |
| REQ-026 | The FE sends one `idempotency_key` per checkout intent; `UNIQUE (user_id, idempotency_key)` plus `ON CONFLICT DO NOTHING RETURNING` returns the existing order for a duplicate; concurrent submissions serialize on the per-user lock and the second sees the emptied cart. | covered |
| REQ-027 | `licenses.price_idr` and `orders.total_idr` are written at checkout and read back verbatim; catalog changes never touch them. | covered |
| REQ-028 | No update/delete endpoint or SQL write path exists for orders/licenses; FKs are `RESTRICT`; the FE renders no cancel/refund/edit control. DB grants are not split in v1 (single application role) — the boundary is the absent write path. | covered |
| REQ-029 | `GET /api/v1/library` joins `licenses` → `apps` → `orders` for the session user, ordered by `orders.created_at DESC`, returning key, purchase date and computed order reference. | covered |
| REQ-030 | `GET /api/v1/orders` returns the session user's orders newest-first with their items and keys; `GET /orders/{reference}` returns one. | covered |
| REQ-031 | Every user-scoped query filters on the session `user_id`; the order route parses the reference to `id` and looks it up as `WHERE id=$1 AND user_id=$2`, so a foreign order is a 404. | covered |
| REQ-032 | `users.username` has `CHECK (char_length(username) BETWEEN 3 AND 50)` and the login DTO enforces 3–50 before lookup; all seeded usernames obey. | covered |
| REQ-033 | The login DTO requires `len(password) >= 8` and the seed command rejects shorter passwords. The stored bcrypt hash cannot re-check plaintext length, so this rule is enforced at the two input boundaries, not by a DB constraint. | covered |
| REQ-034 | `apps.price_idr BIGINT CHECK (price_idr >= 0)`; the seed command validates and rejects a negative fixture before writing (TC-059); zero is accepted end-to-end. | covered |
| REQ-035 | `licenses UNIQUE (user_id, app_id)` makes a second purchase of the same app impossible at the database level; add/checkout checks make the failure a visible error. | covered |
| REQ-036 | The 20-distinct-app cap is enforced in `store.Cart.Add` under the per-user lock; a 21st app is rejected with `CART_FULL`. | covered |
| REQ-037 | A no-match search returns `{apps: [], count: 0}`; the FE shows the empty state with a clear-search action. | covered |
| REQ-038 | The handler resolves the category slug against `categories`; an unknown slug is ignored (unfiltered), a known empty category returns `[]`, and the FE shows the matching empty state. | covered |
| REQ-039 | An empty cart returns `{items: [], count: 0, total_idr: 0}`; the FE shows the empty state and catalog link, with no checkout action. | covered |
| REQ-040 | `GET /library` and `GET /orders` return empty arrays for a buyer with no purchases; the FE has distinct empty states for both. | covered |
| REQ-041 | List and detail responses carry `is_owned`; the app stays visible and the FE replaces add-to-cart with the owned state. | covered |
| REQ-042 | Price 0 has no special code path: the total sums to 0, checkout succeeds, and a license with `price_idr = 0` is created. | covered |
| REQ-043 | An expired/invalid session returns `401 UNAUTHORIZED`; the FE redirects to login with `reason=expired`. The cart is in `cart_items`, keyed by user, so it is untouched by session expiry. | covered |
| REQ-044 | The order query includes `user_id = session user`, so another user's order and an unknown order both return the same `404 NOT_FOUND`. | covered |
| REQ-045 | `code_repo` is `paladin-code`; the stack is Go + stdlib `net/http` + pgx (see Stack decisions). | covered |
| REQ-046 | `frontend_repo` is `paladin-ui`; React + Vite + TypeScript (see Frontend). | covered |
| REQ-047 | `cmd/seed` idempotently creates 5 accounts, 5 categories and 12 complete apps with screenshots, supported OS, featured flags, and one prior order/license for `buyer1`; see `database.md`'s seed plan. | covered |
| REQ-048 | PostgreSQL tables: `users`, `sessions`, `categories`, `apps`, `app_screenshots`, `app_platforms`, `cart_items`, `orders`, `licenses` (see `database.md`). | covered |
| REQ-049 | No `nexcommon`, no `nexcomponent-ui`; the backend uses stdlib/pgx and the frontend plain React + CSS Modules. | covered |
| REQ-050 | No outbound HTTP client, no third-party SDK, no other Paladin service; the only runtime dependency is its own PostgreSQL. | covered |
| REQ-051 | The whole v1 journey is one feature; the Implementation Plan orders backend then frontend phases to land it. | covered |
| REQ-052 | Non-goals have no route, endpoint or table: no admin, sign-up, password reset, payment provider, refund/edit, reviews, wishlist, coupon or email. | covered |
| REQ-053 | The login → browse → detail → cart → checkout → library path is supported by the endpoint list and sequenced in the Implementation Plan; TC-069 exercises it. | covered |
| REQ-054 | Validation and conflict failures return the error envelope with a code and message; the FE renders them inline (field errors, owned, cart full, ownership conflict). Nothing fails silently. | covered |
| REQ-055 | `licenses UNIQUE (user_id, app_id)` plus the add/checkout ownership checks prevent a duplicate in the library or a checkout of an owned app. | covered |
| REQ-056 | There is no caller-supplied user id anywhere; every query is scoped by the session user, and foreign reads are 404. | covered |

## Implementation Plan

- PART-1: PostgreSQL schema, migration pair(s), config and pool wiring, idempotent seed command — deliverable: `migrate up` creates all nine tables and `cmd/seed` produces the 5 accounts and 12-app catalog.
- PART-2: Auth slice — bcrypt verify, session table operations, `POST /auth/login`, `POST /auth/logout`, `GET /me`, `requireSession` middleware — deliverable: cookie login/logout guards every route.
- PART-3: Catalog reads — `GET /categories`, `/apps/featured`, `/apps` (category + substring search), `/apps/{id}` with screenshots/supported OS and `is_owned`/`is_in_cart` — deliverable: Home and detail data complete.
- PART-4: Cart — `GET /cart`, `POST /cart/items`, `DELETE /cart/items/{appId}` with ownership block and the 20-app cap under lock — deliverable: all cart rules enforced.
- PART-5: Checkout, orders and library — transactional checkout with idempotency key, ownership re-check and price snapshots; `GET /orders`, `GET /orders/{reference}`, `GET /library` — deliverable: purchase loop closes and is per-user scoped.
- PART-6: Service packaging and observability — Dockerfile, `docker-compose.yml` (postgres + backend + frontend), `/healthz`, structured access log, recovery middleware, graceful shutdown — deliverable: one local stack boots and logs.
- PART-7: Frontend shell — Vite/React/TS scaffold, router, design tokens, app shell/top bar/menu, API client/adapters/services, auth provider, guard, login page, not-found state — deliverable: login/logout and protected routing work.
- PART-8: Frontend catalog and detail — hero, featured rail, category tabs, debounced search with URL state, app cards, app detail with gallery, requirements and purchase panel — deliverable: browse/search/detail complete.
- PART-9: Frontend purchase surfaces — cart, checkout, order confirmation, My Library, Orders, license-key copy and empty/error states — deliverable: the whole buyer journey renders.
- PART-10: Frontend packaging and end-to-end verification — multi-stage nginx image, SPA fallback, `/api` proxy, Playwright desktop/phone smoke, build/lint — deliverable: the compose stack serves the storefront through nginx and the journey passes.

## Planned breaking changes

None. This is a new service and a new UI; no existing consumer, endpoint
or table is changed or removed.

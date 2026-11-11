# FEAT-001 — Paladin storefront v1 (FE verification)

Run date: 2026-11-11
Service: `paladin` · FE repo: `william22913/paladin-ui`
Branch: `feat/FEAT-001-dev-storefront-v1`
Tested code commit: `31671ad4e63f2079bf24bdf4a7048f218267f254`
FE PR: https://github.com/william22913/paladin-ui/pull/1

## Pinned inputs

| Input | Version | SHA-256 |
|---|---|---|
| `spec.md` | `version: 1` | `7821e92e3f9538115d09983a29b8ad1e0780444743e2ae9f00f556612b9c6f4d` |
| `testcase.md` | `version: 1` (`spec_version: 1`) | `40f82099842b6d4e49156ff0365f18a30bab3d24b341725bf1cdb2714973b58c` |
| `architecture.md` | `version: 1` | `2e0e16e1d00dbc4f800ed75ec02a20708c14c559bfb142199d3af2d61eee0ba1` |
| `UIMap.md` | merged handoff | `3cfd3f5ceb3ab9eb089e3243e018413b318d55c40df8c99321b6636ec8ea8d83` |
| `DesignBrief.md` | merged handoff | `43b37e09eb9772ec790b429aa567217532e64cf014f41431496e8138f8302359` |

**API contract:** N/A — no OpenAPI document or Postman collection was published
for this feature. The FE was built against the endpoint/field contract stated in
`architecture.md` (`2e0e16e…`): `POST /api/v1/auth/login`,
`POST /api/v1/auth/logout`, `GET /api/v1/auth/me`, `GET /api/v1/apps`,
`GET /api/v1/apps/featured`, `GET /api/v1/apps/:id`, `GET|POST|DELETE /api/v1/cart`,
`POST /api/v1/checkout`, `GET /api/v1/orders`, `GET /api/v1/orders/:ref`,
`GET /api/v1/library`.

**Mode: MOCK.** No backend implementation exists for `paladin` (the backend
repo clone is empty), so the Playwright suite intercepts `/api/v1/**` and
serves fixtures shaped per `architecture.md`. Anything whose pass/fail depends
on server behavior is recorded as `N/A (backend)` below, not as passing.

## Commands and results

| Command | Result |
|---|---|
| `npm run lint` | PASS — 0 errors, 3 `react-refresh/only-export-components` warnings (provider files export a hook beside the component) |
| `npm run build` (`tsc --noEmit` + `vite build`) | PASS |
| `npm test` (Vitest) | PASS — 10 tests, 2 files |
| `npx playwright test` | PASS — 38 tests (19 × desktop 1440×900 + Pixel 7), 1.3 min |
| `verify_stack` (Docker/nginx preview) | PASS — image built, `web` healthy, 2 Newman requests / 3 assertions passed (see below) |

Reproduce the browser suite (Chromium system libraries are provided from a
local extraction in this sandbox):

```
LD_LIBRARY_PATH=/tmp/fe-chromedeps/libs/lib/x86_64-linux-gnu:/tmp/fe-chromedeps/libs/usr/lib/x86_64-linux-gnu npx playwright test
```

### Unit / component tests (`src/**/*.test.tsx`)

- `src/core/core.test.ts` — `formatIdr` (`Rp 125.000`, `FREE`), `safeNext`
  (relative only, rejects absolute/protocol URLs), cart/order/orders
  normalizers, `addErrorMessage` for `CART_FULL`, `ALREADY_OWNED` and the
  unknown-code fallback.
- `src/core/hooks/useDebouncedValue.test.tsx` — nothing at 299 ms, settle at
  300 ms.

### Browser suite (`e2e/storefront.spec.ts`, desktop + mobile)

Covered: anonymous redirect with safe `next`; login lands on catalog; deep link
return; invalid credentials + field-size rules; logout and browser Back;
debounced `q` search and grid filtering; add → cart → checkout → order; owned
app card and detail state; no console errors across core pages; search,
category and unknown-category empty states; clearing search keeps the category;
remove one cart line; empty cart blocks checkout; `ALREADY_OWNED` checkout
message keeps the cart; empty library and orders; unknown app/order ids show
not-found; expired session redirect keeps `next`; desktop and mobile
screenshots of login, home, detail, cart, checkout, library and orders.

Screenshots were captured with `animations: 'disabled'` and
`reducedMotion: 'reduce'` so reveal-on-scroll content is visible in full-page
captures. They live under the gitignored `test-results/` tree.

## Docker / nginx

`Dockerfile` (multi-stage `node:20-alpine` → `nginx:1.27-alpine`) and
`nginx.conf` (`/api/` proxied to `http://backend:8080`, immutable hashed
assets, `no-store` on the SPA shell, `try_files … /index.html`, gzip) are
present. Verified live through the Nexai verification runner
(`verify_stack`, `docker-compose.verify.yml` + `e2e/fe-smoke.postman_collection.json`):

| Phase | Result |
|---|---|
| Policy | PASS |
| Build | PASS — `npm ci`, `tsc --noEmit`, `vite build` inside `node:20-alpine` |
| Up | PASS — `web` healthy (image `HEALTHCHECK`), `backend` up |
| Newman | PASS — `GET http://web/` → 200 with `id="root"`; `GET http://web/apps/42` → 200 (SPA fallback). 2 requests, 3 assertions, 0 failures |

The compose override adds a placeholder upstream on the `backend` name because
the real backend does not exist yet; the `/api` proxy path itself is therefore
not exercised against a real API. One finding from the first attempt: nginx
resolves `proxy_pass http://backend:8080` at startup, so the FE container exits
if `backend` is absent from the network — expected in the deployment compose,
where the backend service is always defined, but worth knowing for any
standalone run of the image.

## Component usage

No `nexcomponent-ui`, no Ant Design, no `nexcommon` (REQ-049). Custom
primitives in `src/components/ui` (Button, IconButton, Field/PasswordField,
SearchField, PriceLabel, Rating, Tag, InlineNotice, Skeleton, StateBlock,
LicenseKeyField, LinkButton, ArtImage) composed into `src/components/app`
(AppShell, TopBar, MenuDialog, Footer, Wordmark, AppCard, AppRail,
CategoryTabs, ScreenshotGallery, PurchasePanel, CartLine, CartSummary,
OrderAccordion, Reveal, BootScreen, LoadError, NotFoundState). Icons are
`lucide-react` at `strokeWidth={1.5}`. Design tokens and layout rules are
recorded in `DESIGN.md`.

## Design check

Matched against `DesignBrief.md` and `UIMap.md`:

- Dark-only, `#0B0B0B` canvas, `#141414` surfaces, square corners, white as the
  only action color; state colors error/success/warning as specified.
- Oswald condensed uppercase display (400/500) and Inter body (400/500/600),
  self-hosted through `@fontsource` — no Google Fonts request at runtime.
- Full-bleed hero with scrim, Oswald headline and white CTA; semantic
  hero image served with a local SVG fallback so pixels never go empty.
- Minimal top bar: hamburger + Menu, centered wordmark, cart badge with bump;
  transparent over the home hero, solid after 40 px; native `<dialog>` menu.
- Full-bleed login still, centered wordmark, single narrow column.
- Scroll reveals (600 ms, +24 px, 60 ms stagger capped at six), card cover
  scale on hover (1.03/400 ms), hero 1400 ms fade/scale, page fade 200 ms,
  accordion `0fr → 1fr` 300 ms, skeleton pulse; all collapse to 120 ms and
  reveals bypass under `prefers-reduced-motion`.
- Keyboard and a11y: labelled fields, visible focus, 44/48 px targets, menu
  and dialogs with accessible names, `aria-live` for cart/checkout notices,
  AA contrast on body copy and controls.

### Fidelity table

| Area | Brief / UIMap | Built | Verdict |
|---|---|---|---|
| Canvas / surface | `#0B0B0B` / `#141414` | same tokens in `src/styles/tokens.css` | Match |
| Type | Oswald display + Inter body | `@fontsource` imports in `main.tsx` | Match |
| Header | 72 / 60 px, transparent → solid | 72 px desktop, 60 px mobile, sentinel at 40 px | Match |
| Container / gutters | 1440, 64/40/24 | same | Match |
| Section rhythm | 128/96/56 | same | Match |
| Radius | 0 everywhere | 0 everywhere | Match |
| Home hero | full-bleed image + scrim + CTA | same, 1400 ms fade/scale | Match |
| Featured rail | cover, name, category, price, rating | full `AppCard` including publisher and add action | Deviation (broader) |
| Catalog | search + category tabs + 3/2/1 grid | same, URL-backed `q`/`category` | Match |
| Detail | cover hero, 2fr/1fr, gallery, sticky panel | same; thumbnails hidden < 768 px | Match |
| Cart / checkout | 8/4 and 7/5 with summary | same; summary static on phones (no fixed bottom bar) | Deviation |
| Login | scrim 0.65 | `--overlay` 0.72 | Deviation |
| Orders | accordion rows | rows expand in place; `/orders/:orderId` is a full view | Deviation |
| Empty / error / loading | composed states + skeletons | StateBlock/Skeleton/LoadError/NotFoundState | Match |
| Motion | 120 ms reduced-motion floor | same | Match |

Deviations are intentional and listed above; none changes a functional
requirement.

## Test case results

`PASS (FE)` = the frontend behavior was verified against the mocked contract.
`N/A (backend)` = the case asserts server behavior (session TTL, seed data,
persistence, totals, license issuance, authorization) with no frontend-only
observable; owned by backend QC and not verifiable in this FE-only run, with
the reason stated per row.

| TC | Case | Status | Evidence |
|---|---|---|---|
| TC-001 | Login exposes username and password fields | PASS (FE) | e2e “login rejects invalid credentials and field sizes on the page”; screenshots |
| TC-002 | Valid credentials create a session and land on the catalog | PASS (FE) | e2e “login sends credentials and lands on the catalog” |
| TC-003 | Deep link returns to the store page after login | PASS (FE) | e2e “deep link returns to the requested page after login” |
| TC-004 | Wrong password shows a generic error | PASS (FE) | e2e login validation; `INVALID_CREDENTIALS` → one generic message |
| TC-005 | Unknown username shows the same generic error | PASS (FE) | same render path; no field-level hint |
| TC-006 | Empty credentials show an error and create no session | PASS (FE) | e2e login validation (client-side, no request) |
| TC-007 | Every protected page redirects to login | PASS (FE) | e2e “anonymous visits are redirected to login with a safe next path” |
| TC-008 | Logout ends the session and returns to login | PASS (FE) | e2e “logout clears the session and browser back does not restore it” |
| TC-009 | Back after logout does not restore an authenticated view | PASS (FE) | same e2e; `/me` re-probe on `pageshow` |
| TC-010 | Session still valid just before 24 h | N/A (backend) | needs server clock/TTL |
| TC-011 | Session expires at 24 h | N/A (backend) | server TTL; FE 401 handling covered by TC-067 |
| TC-012 | Username shorter than 3 rejected | PASS (FE) | e2e login validation (2-char username) |
| TC-013 | Username of exactly 3 accepted | N/A (backend) | needs seeded 3-char account |
| TC-014 | Username of exactly 50 accepted | N/A (backend) | needs seeded 50-char account |
| TC-015 | Username longer than 50 rejected | PASS (FE) | e2e login validation |
| TC-016 | Password shorter than 8 rejected | PASS (FE) | e2e login validation |
| TC-017 | Password of exactly 8 accepted | N/A (backend) | needs seeded account |
| TC-018 | Seed loading rejects invalid credentials | N/A (backend) | seed-time validation |
| TC-019 | Home contains all four sections | PASS (FE) | e2e home + screenshots (hero, featured, catalog, footer/menu) |
| TC-020 | Featured apps match seed subset and order | N/A (backend) | FE renders API order; no seed |
| TC-021 | Featured capped at six | N/A (backend) | cap is a data rule; FE renders what the API returns |
| TC-022 | Each seeded category filters the browse listing | N/A (backend) | only five categories exist in a real seed; tab wiring covered by TC-030/031 |
| TC-023 | Catalog card shows all required fields | PASS (FE) | e2e grid assertions; screenshots |
| TC-024 | Exact-case name search returns matches | PASS (FE) | e2e “search debounces into a q request and filters the grid” (FE sends `q` unchanged) |
| TC-025 | Search is case-insensitive | N/A (backend) | matching happens server-side |
| TC-026 | Search matches substrings | N/A (backend) | matching happens server-side |
| TC-027 | Search combines with the active category | PASS (FE) | both `q` and `category` sent; e2e “clearing a search keeps the selected category” |
| TC-028 | Clearing search restores the category listing | PASS (FE) | same e2e |
| TC-029 | No-match search shows an empty state with clear action | PASS (FE) | e2e “search and category empty states…” |
| TC-030 | Category with no apps shows an empty state | PASS (FE) | same e2e (empty `utility`) |
| TC-031 | Unknown category falls back to unfiltered catalog | PASS (FE) | same e2e (unknown slug URL) |
| TC-032 | Detail page shows all required fields | PASS (FE) | e2e owned-detail + screenshots |
| TC-033 | Price displayed in IDR | PASS (FE) | `formatIdr` unit tests; detail/cart screenshots |
| TC-034 | Unknown numeric app id shows not-found | PASS (FE) | e2e “unknown app and order ids show not-found states” |
| TC-035 | Malformed app id shows not-found | PASS (FE) | same e2e |
| TC-036 | Add to cart from the detail page | PASS (FE) | e2e “add to cart updates the badge, cart and checkout” |
| TC-037 | Add to cart from a catalog card | PASS (FE) | same e2e (card action) |
| TC-038 | Cart lists each app with fields and a total | PASS (FE) | same e2e; cart screenshot |
| TC-039 | Removing an app removes only that line | PASS (FE) | e2e “removing one cart line keeps the other and updates the total” |
| TC-040 | Quantity fixed at 1, no quantity control | PASS (FE) | no quantity control in `CartLine`; one line per app |
| TC-041 | Cart total equals sum of current prices | N/A (backend) | FE renders server `total_idr`, it does not compute it |
| TC-042 | Total adds no tax, discount, shipping or fee | PASS (FE) | summary renders only subtotal + total; no fee rows |
| TC-043 | Two users have independent carts | N/A (backend) | server-side cart ownership |
| TC-044 | Cart survives logout/login within session lifetime | N/A (backend) | persistence is server-side |
| TC-045 | Re-adding an in-cart app keeps one line | N/A (backend) | dedupe is server-side; FE re-renders returned cart |
| TC-046 | Adding an owned app from detail is blocked | PASS (FE) | e2e “an owned app stays visible and its detail offers the library…” |
| TC-047 | Adding an owned app from a card is blocked | PASS (FE) | e2e “owned apps show their library state instead of add to cart” |
| TC-048 | The 20th distinct app can be added | N/A (backend) | cap enforced server-side |
| TC-049 | The 21st distinct app is blocked with a clear message | N/A (backend) | `CART_FULL` mapping unit-tested; no server to trigger it |
| TC-050 | Empty cart shows empty state and no checkout | PASS (FE) | e2e “an empty cart blocks checkout and returns to the cart” |
| TC-051 | Checkout collects no payment details and succeeds | PASS (FE) | checkout page has no payment fields; e2e completes on mock |
| TC-052 | Checkout creates exactly one order and empties the cart | N/A (backend) | order creation is server-side |
| TC-053 | One unique license key per app | N/A (backend) | keys are issued server-side |
| TC-054 | Confirmation shows id, date, total, apps and keys | PASS (FE) | e2e add→checkout→order asserts all fields |
| TC-055 | Checkout rejects the whole cart when an app is owned | PASS (FE) | e2e “checkout names already-owned apps and does not empty the cart” |
| TC-056 | Repeated submission creates at most one order | N/A (backend) | FE sends one `crypto.randomUUID` key per checkout and disables the button; uniqueness is server-side |
| TC-057 | Order price snapshotted at checkout | N/A (backend) | persistence is server-side |
| TC-058 | Price-0 app is purchasable and gets a key | N/A (backend) | purchase + key issuance server-side |
| TC-059 | Negative price rejected by data validation | N/A (backend) | DB constraint |
| TC-060 | An app never appears twice in the library | N/A (backend) | server-side uniqueness |
| TC-061 | Library lists owned apps with key, date, order ref | PASS (FE) | library screenshot + e2e owned state |
| TC-062 | Orders lists each order with date, total, apps, keys | PASS (FE) | e2e order flow + orders screenshot |
| TC-063 | Library/orders contain only the signed-in user's data | N/A (backend) | authorization is server-side |
| TC-064 | Another user's order id returns not-found | PASS (FE) | e2e not-found order rendering; authorization itself is server-side |
| TC-065 | No purchases shows empty Library and Orders | PASS (FE) | e2e “library and orders show empty states with no purchases” |
| TC-066 | Owned app stays visible with add disabled and explained | PASS (FE) | e2e owned card + owned detail |
| TC-067 | Expired or invalid session redirects to login | PASS (FE) | e2e “an expired session redirects to login and keeps the next path” |
| TC-068 | Cart preserved after re-login following expiry | N/A (backend) | persistence is server-side |
| TC-069 | End-to-end purchase journey | PASS (FE) | e2e add→cart→checkout→order on mocks; the full-stack run needs the backend |
| TC-070 | Seeded data complete across accounts and five categories | N/A (backend) | seed data does not exist yet |

**Totals:** 43 PASS (FE), 27 N/A (backend), 0 FAIL.

## Out-of-scope items (named, not fixed)

- Backend implementation and seed data for `paladin` — every `N/A (backend)`
  row above needs it.
- No OpenAPI/Postman artifact exists for this feature; if one is published,
  re-derive the adapter types and diff them against
  `src/core/api/adapters`.
- The `/api` proxy was only checked against a placeholder upstream; it needs
  the real backend to be exercised end to end.

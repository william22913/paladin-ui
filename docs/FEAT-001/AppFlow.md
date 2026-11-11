---
feature_code: FEAT-001
service: paladin
spec_version: 1
last_updated: 2026-11-11
---

# FEAT-001 — App Flow

<!-- BEGIN:DOCPREP -->
## Overview

A seeded-account buyer logs in, browses the Paladin catalog (featured,
category and search), opens an app, adds apps to a per-user cart, checks out
with simulated payment, and receives one license key per app — visible on the
order confirmation and afterwards in My Library and Orders. Every store page
is behind login.

## Key User Journeys

- **Login and get back to the store (REQ-001, REQ-002, REQ-003, REQ-004):** An unauthenticated visitor opens a store page → is redirected to the login page → enters valid credentials → is returned to the page they originally requested (or the catalog); invalid credentials show one generic error.
- **Browse and find an app (REQ-007, REQ-008, REQ-009, REQ-010, REQ-011):** A logged-in buyer sees the hero and featured apps → browses by category → searches by name (or combines both) → opens an app detail page.
- **Inspect an app (REQ-012, REQ-013):** The detail page shows name, publisher, category, version, IDR price, description, images, system requirements and rating; an unknown app id shows a not-found state.
- **Add to cart (REQ-014, REQ-015, REQ-016, REQ-018):** The buyer adds apps from the catalog or detail page → each app is a single quantity-1 line → the cart shows the running IDR total; re-adding an app keeps one line.
- **Checkout and receive licenses (REQ-021, REQ-022, REQ-023, REQ-024):** The buyer opens a non-empty cart → checks out with no payment details → simulated payment succeeds → one order is created with one license key per app, the cart empties, and the confirmation shows the order id, date, total and license keys.
- **Return to purchases (REQ-029, REQ-030):** The buyer opens My Library to see owned apps with license keys, purchase dates and order references, and opens Orders to see past orders with their items and keys.
- **Logout (REQ-005):** The buyer logs out → the session ends → they return to login, and browser back does not restore an authenticated view.
- **Blocked-owned app (REQ-019, REQ-041):** An app already in the buyer's library stays visible in catalog/search/detail, but add-to-cart is disabled and explains it is already owned.
- **Cart full (REQ-020, REQ-036):** With 20 distinct apps in the cart, adding a 21st is blocked with a clear message.
- **Empty cart (REQ-021, REQ-039):** The cart shows an empty state and a link back to the catalog; checkout is unavailable.
- **Expired session (REQ-043):** An expired or invalid session during any action redirects to login; the per-user cart is preserved.
- **No purchases yet (REQ-040):** A buyer with no purchases sees empty My Library and Orders states.
- **Cross-user access (REQ-031, REQ-044):** A buyer opening another user's order id directly gets not-found, never the order.

## Main Pages / Actions

- **Login** — username/password form; the only page reachable without a session.
- **Catalog / Home** — hero, featured apps, category browse, name search, app cards.
- **App Detail** — full app information plus add-to-cart.
- **Cart** — single-quantity lines, remove, total, checkout entry.
- **Checkout / Order Confirmation** — simulated payment, order summary, one license key per app.
- **My Library** — owned apps with license keys, purchase date and order reference.
- **Orders** — the buyer's order history with items and license keys.
- **Logout** — available from every authenticated page.
<!-- END:DOCPREP -->

<!-- BEGIN:CODEPREP -->
## Routes and Components (technical)

This half is the technical companion to the user journeys above. The
screens, states, copy, motion and responsive rules are owned by
`UIMap.md`/`DesignBrief.md`; `architecture.md` owns the API contract.

### Routes

| Route | Screen | API calls |
|---|---|---|
| `/login` (`?next=`, `?reason=expired`) | Login | `POST /api/v1/auth/login` |
| `/` (`?q=`, `?category=`) | Home / catalog | `GET /api/v1/apps/featured`, `GET /api/v1/categories`, `GET /api/v1/apps?category=&q=` |
| `/apps/:appId` | App detail | `GET /api/v1/apps/{appId}`, `POST /api/v1/cart/items` |
| `/cart` | Cart | `GET /api/v1/cart`, `DELETE /api/v1/cart/items/{appId}` |
| `/checkout` | Checkout | `GET /api/v1/cart`, `POST /api/v1/checkout` |
| `/orders/:orderId` (`?placed=1`) | Order confirmation / order view | `GET /api/v1/orders/{orderId}` |
| `/library` | My Library | `GET /api/v1/library` |
| `/orders` | Orders | `GET /api/v1/orders` |
| `*` | Not found | none |

All routes except `/login` are behind the session guard. An
unauthenticated hit redirects to `/login?next=<pathname+search>`; an
expired session uses the same redirect with `reason=expired`.

### Component boundaries

- **Shell** — app shell, top bar (hamburger, wordmark, cart badge),
  full-screen menu `<dialog>`, footer, skip link. Owns logout and the
  cart-count display.
- **Route guard** — `AuthProvider` probes `GET /api/v1/me`; `RequireAuth`
  renders a skeleton while loading and redirects when anonymous.
- **API layer** — `core/api/client.ts` (fetch, credentials, error
  envelope) → `core/api/services/*` → feature hooks. Pages never call
  `fetch` directly.
- **Feature components** — catalog (hero, featured rail, category tabs,
  search, app card, owned/in-cart tags), app detail (gallery, rating,
  requirements, purchase panel), cart (line, summary), checkout
  (summary, place order), order surfaces (key field, accordion), and the
  shared state page / inline notice / skeleton.
- **Styling** — CSS Modules over one `tokens.css` (colors, type scale,
  spacing, zero radius, breakpoints) and a single dark theme. No
  component library (`REQ-049`).
<!-- END:CODEPREP -->

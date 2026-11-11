---
feature_code: FEAT-001
service: paladin
ticket_url: null
has_ui: true
version: 1
status: complete
completeness:
  problem: covered
  target_user: covered
  success_criteria: covered
  non_goals: covered
  primary_flow: covered
  edge_cases: covered
  dependencies: covered
  priority: covered
  data_validation_rules: covered
  external_integrations: covered
open_questions: []
sources: []
pr_history: []
pr_url: https://github.com/william22913/sandbox-docs/pull/32
last_updated: 2026-11-11
---

# FEAT-001 — Paladin storefront v1 (paladin)

## Problem

Paladin sells desktop software (productivity, design, developer tools,
security, games), but there is no self-service storefront: a buyer cannot
browse the catalog, pay, and receive a license key online today. This
feature delivers a first usable v1 storefront that takes a buyer from login,
through browsing and cart, to checkout and a license key in their library.

(source: user task brief — the problem statement is derived from the brief's
product description and scope; confirm in review)

## Target User

An end user / buyer: a person with a seeded account who browses the Paladin
catalog and buys desktop software licenses for themselves. Admin and
back-office staff are explicitly out of scope for v1.

(source: user task brief)

## Primary Flow

### Authentication

- **REQ-001**: The store has a login page with username and password fields.
  Accounts are seeded; there is no self sign-up in v1.
  (source: user task brief)
- **REQ-002**: Valid credentials create an authenticated session for that
  user and take them to the page they originally requested, or to the
  catalog/home page when there was none.
  (default assumption — confirm in review)
- **REQ-003**: Invalid credentials show one generic error ("invalid username
  or password") and keep the user on the login page. The error must not
  reveal whether the username exists.
  (default assumption — confirm in review)
- **REQ-004**: Every store page — catalog/home, app detail, cart, checkout,
  library/orders — requires an authenticated session. An unauthenticated
  visitor is redirected to the login page and, after logging in, returned to
  the page they asked for (REQ-002).
  (source: user task brief for "all store pages require login"; return-after-
  login is a default assumption)
- **REQ-005**: Logout is reachable from every authenticated page. It ends
  the session and returns the user to the login page; after logout, browser
  back does not restore an authenticated view.
  (source: user task brief for logout; back-button behavior is a default
  assumption)
- **REQ-006**: A session stays valid for 24 hours from login, then expires
  and the next request is treated as unauthenticated (REQ-004).
  (default assumption — confirm in review)

### Catalog / Home

- **REQ-007**: The catalog/home page contains four sections: a hero,
  featured apps, browse-all-apps by category, and search by name.
  (source: user task brief)
- **REQ-008**: Featured apps are a curated subset defined by seed data,
  shown on the home page in the seed-defined order, up to six apps.
  (default assumption — the brief says "featured apps" but not count/order)
- **REQ-009**: The user can browse all apps filtered by category. The
  categories seeded for v1 are productivity, design, developer tools,
  security, and games.
  (source: user task brief for the category examples; filter behavior is
  implied by "browse all apps by category")
- **REQ-010**: The user can search apps by name using case-insensitive
  substring matching. Search and category filtering can be combined;
  clearing the search restores the current category listing.
  (source: user task brief says "search by name"; matching rule is a default
  assumption)
- **REQ-011**: Each catalog card shows at least the cover image, app name,
  publisher, category, price, and rating.
  (default assumption — confirm in review)

### App Detail

- **REQ-012**: An app detail page shows name, publisher, category, version,
  price in IDR, description, cover image and screenshots, system
  requirements (supported OS), and rating.
  (source: user task brief)
- **REQ-013**: An unknown or invalid app id shows a not-found state, not an
  empty detail page or a server error.
  (default assumption — confirm in review)
- **REQ-014**: An app can be added to the cart from its detail page and from
  a catalog card.
  (source: user task brief — the cart is fed from browsing; the exact entry
  points are a default assumption)

### Cart

- **REQ-015**: The cart lists every app the user has added, shows each app's
  name, price and cover image, and lets the user remove an app. Each line's
  quantity is always 1 (a digital license), and the page shows the cart
  total.
  (source: user task brief)
- **REQ-016**: The cart total is the sum of the current prices of the apps in
  the cart, in IDR; there is no tax, discount, shipping or other fee in v1.
  (default assumption — confirm in review)
- **REQ-017**: The cart belongs to the signed-in user. A user never sees
  another user's cart, and the cart survives logout/login within the session
  lifetime.
  (default assumption — confirm in review)
- **REQ-018**: Adding an app that is already in the cart does not create a
  second line and does not raise the quantity above 1; the app remains a
  single line.
  (default assumption — confirm in review)
- **REQ-019**: An app already in the user's library cannot be added to the
  cart; the action is blocked with a message saying it is already owned.
  (source: user task brief — "cannot buy an app twice (already in library ->
  blocked)")
- **REQ-020**: The cart holds at most 20 distinct apps (REQ-036). Adding a
  21st app is blocked with a clear message.
  (source: user task brief)
- **REQ-021**: Checkout is not possible while the cart is empty.
  (default assumption — confirm in review)

### Checkout and Order

- **REQ-022**: Checkout collects no payment details. Payment is simulated
  and always succeeds when the cart passes validation; there is no real
  payment gateway.
  (source: user task brief)
- **REQ-023**: A successful checkout creates exactly one order containing all
  cart lines, issues exactly one unique license key per app in that order,
  and empties the cart.
  (source: user task brief for order + license key; "exactly one" and
  cart-clearing are default assumptions)
- **REQ-024**: After checkout the user sees an order confirmation showing the
  order id, order date, total, and each purchased app with its license key.
  (source: user task brief)
- **REQ-025**: Checkout re-checks ownership before creating the order. If any
  cart app is already in the user's library, the whole checkout is rejected,
  the error names the offending app(s), and no order or license key is
  created.
  (default assumption — confirm in review)
- **REQ-026**: Submitting checkout more than once for the same cart (double
  click, retry) produces at most one order and one license key per app.
  (default assumption — confirm in review)
- **REQ-027**: The price recorded on an order is the catalog price at
  checkout time; later catalog price changes do not alter an existing order.
  (default assumption — confirm in review)
- **REQ-028**: Orders are immutable after creation. v1 has no cancellation,
  refund, or order editing.
  (default assumption — confirm in review)

### My Library / Orders

- **REQ-029**: My Library lists every app the signed-in user owns, with its
  license key, purchase date, and order reference.
  (source: user task brief)
- **REQ-030**: Orders lists the signed-in user's orders, each with date,
  total, and its apps with their license keys.
  (source: user task brief for "My Library / Orders"; the two-view split is a
  default assumption)
- **REQ-031**: Library and orders are scoped to the signed-in user only. No
  request from one user can read another user's library or order; a request
  for another user's order returns not-found.
  (default assumption — confirm in review)

## Data Validation Rules

These are business rules. How they are enforced (regex, DB constraint,
validator) is `/code-preparation`'s concern.

- **REQ-032**: Username is 3–50 characters.
  (source: user task brief)
- **REQ-033**: Password is at least 8 characters.
  (source: user task brief)
- **REQ-034**: Price is an amount in IDR and must be >= 0. Zero is allowed
  (a free app); negative is invalid.
  (source: user task brief — "price >= 0", "price (IDR)")
- **REQ-035**: A user cannot buy an app they already own. The same app can
  never appear twice in that user's library.
  (source: user task brief)
- **REQ-036**: The cart holds at most 20 distinct apps.
  (source: user task brief)

v1 has no user-entered catalog fields (the catalog is seeded) and no sign-up
form, so REQ-032/REQ-033 constrain the seeded account data and any login
input; there are no other user-editable business fields in this pass.
(source: user task brief — "catalog is seeded data", "no self sign-up")

## Edge Cases

- **REQ-037**: A catalog search with no matches shows an empty state with a
  way to clear the search, not a blank page or an error.
- **REQ-038**: A category with no apps shows an empty state; an unknown
  category in the URL falls back to the unfiltered catalog.
- **REQ-039**: An empty cart shows an empty state and a link back to the
  catalog; checkout remains unavailable (REQ-021).
- **REQ-040**: A user with no purchases sees an empty My Library and an
  empty Orders state.
- **REQ-041**: An app the user already owns still appears in catalog, search
  and detail (it is not hidden), but its add-to-cart action is disabled and
  explains that it is already owned (REQ-019).
- **REQ-042**: An app with price 0 is purchasable through the normal checkout
  flow and produces a license key like any other app (REQ-034).
- **REQ-043**: An expired or invalid session during any store action
  redirects to login (REQ-004); the user's cart is preserved because it is
  stored per user (REQ-017).
- **REQ-044**: A user opening another user's order id directly gets a
  not-found response, not the order (REQ-031).

(source for this section: default assumptions unless stated — confirm in
review)

## Dependencies

- **REQ-045**: Backend is the `paladin-code` repository: Go using the
  standard library / common libraries and PostgreSQL. It is a brand-new,
  empty repo.
  (source: user task brief)
- **REQ-046**: Frontend is the `paladin-ui` repository: React. It is a
  brand-new, empty repo.
  (source: user task brief)
- **REQ-047**: The feature depends on seeded data: user accounts, and the app
  catalog (apps, categories, featured flags, descriptions, screenshots/cover
  images, supported OS, version, publisher, price, rating) across the five
  seeded categories. v1 has no admin UI to maintain it.
  (source: user task brief — catalog is seeded; exact seed contents are a
  default assumption)
- **REQ-048**: PostgreSQL stores accounts, apps/categories, carts, orders,
  and license keys.
  (default assumption — confirm in review)
- **REQ-049**: Do NOT use nexcommon or nexcomponent-ui for this service.
  (source: user task brief)
- **REQ-050**: No external integrations and no other Paladin services are
  called by this feature.
  (source: user task brief)

## Non-Goals

- No admin/back-office UI or catalog management; the catalog is seeded for
  v1.
  (source: user task brief)
- No self sign-up, account creation, password reset, or profile editing.
  (source: user task brief for sign-up; the rest are implied by seeded
  accounts)
- No real payment gateway, no card details, no payment provider integration.
  (source: user task brief)
- No refunds, cancellations, or order editing.
  (default assumption)
- No user-submitted ratings or reviews; ratings are seeded display data.
  (default assumption)
- No multi-quantity purchases, wishlists, coupons/discounts,
  recommendations, or emails.
  (default assumption)
- No currencies other than IDR and no tax calculation.
  (default assumption)
- No mobile app; the UI is the React web frontend.
  (default assumption)

## Priority

- **REQ-051**: Priority is P1. This pass covers the whole v1 journey:
  login/logout, catalog with hero/featured/category/search, app detail, cart,
  simulated checkout with order and license keys, and My Library/Orders.
  (source: user task brief)
- **REQ-052**: Deferred beyond v1: everything in Non-Goals, in particular
  admin/back-office, self sign-up, real payments, refunds, user reviews, and
  email notifications.
  (source: user task brief for admin/back-office; the rest follows from
  Non-Goals)

## Success Criteria

- **REQ-053**: A seeded user can log in, browse the catalog (including
  featured apps, a category filter, and a name search), open an app detail
  page, add apps to the cart, check out, and then see each purchased app with
  its license key in My Library.
  (verifies REQ-001–REQ-031)
  (source: user task brief)
- **REQ-054**: Username, password, price, ownership and cart-size rules
  (REQ-032–REQ-036) are enforced and surface a visible error rather than
  failing silently.
  (source: user task brief for the rules; error visibility is a default
  assumption)
- **REQ-055**: A user can never end up with the same app twice in the library
  or the cart, and cannot check out a cart containing an owned app (REQ-019,
  REQ-025, REQ-035).
  (source: user task brief for no-double-purchase; the cart/checkout
  specifics are default assumptions)
- **REQ-056**: One user can never see another user's cart, library, or
  orders (REQ-017, REQ-031, REQ-044).
  (default assumption — confirm in review)
- No separate post-launch business metric: this is a first usable version, so
  the acceptance criteria above are the success measure.
  (default assumption — confirm in review)

## External Integrations

None. The user states there are no external integrations and payment is
simulated (source: user task brief). The only components are `paladin-code`,
`paladin-ui`, and their PostgreSQL database (REQ-045–REQ-048), with no
network call to another service or third party.

## UI Scope

`has_ui: true`. The user supplied a visual style reference for the UI/UX
team: https://www.awwwards.com/sites/spyker-cars. This spec deliberately does
not define screens, layouts, colors, typography or branding —
`/ui-preparation` owns that and maps these `REQ-*` onto Figma.

## Default Assumptions

The brief asked for sensible defaults where it was silent. They are marked
inline above and collected here for review:

1. Session lifetime is 24 hours (REQ-006).
2. Return to the originally requested page after login (REQ-002, REQ-004).
3. Generic invalid-credentials error, no account enumeration (REQ-003).
4. Up to six featured apps in seed-defined order (REQ-008).
5. Case-insensitive substring name search, combinable with category
   (REQ-010).
6. Cart total excludes tax, discount and fees (REQ-016).
7. Cart is per user and survives logout/login until checked out (REQ-017).
8. Re-adding an in-cart app is a no-op; quantity stays 1 (REQ-018).
9. Checkout is blocked while the cart is empty (REQ-021).
10. One order per checkout, cart emptied, one license key per app
    (REQ-023).
11. Checkout re-validates ownership and rejects the whole cart on conflict
    (REQ-025).
12. Repeated checkout submissions create at most one order (REQ-026).
13. Price is snapshotted at checkout; orders are immutable (REQ-027,
    REQ-028).
14. My Library and Orders are separate views (REQ-030).
15. Strict per-user isolation, with not-found for another user's order
    (REQ-031, REQ-044).
16. Unknown app, category, search, library and cart edge states as listed
    (REQ-037–REQ-043).
17. PostgreSQL persists accounts, catalog, carts, orders and license keys
    (REQ-048).

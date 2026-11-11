---
feature_code: FEAT-002
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
pr_url: https://github.com/william22913/sandbox-docs/pull/38
last_updated: 2026-11-11
---

# FEAT-002 — Wishlist (paladin)

## Problem

Paladin buyers can browse the seeded catalog, inspect an app, add it to the
cart and buy it, but there is no way to save an app they are interested in
without committing it to the cart. A buyer who is not ready to buy loses
track of the apps they found and has to rediscover them later. FEAT-001
deliberately deferred wishlists; this feature adds the save-for-later list
on top of the existing storefront.

(source: user task brief; FEAT-001 `spec.md` lists "wishlists" under
Non-Goals and as deferred)

## Target User

An end user / buyer with a seeded Paladin account — the same signed-in buyer
as FEAT-001 — browsing the catalog or an app detail page and wanting to keep
an app for later. Guests (no session) and admin/back-office users are out of
scope: the wishlist requires login, and Paladin v1 has no admin UI.

(source: user task brief — "Signed-in buyers"; FEAT-001 account model)

## Primary Flow

### Saving and removing from the catalog and product page

- **REQ-001**: Every catalog card and every app detail page has a wishlist
  control that lets a signed-in buyer save that app.
  (source: user task brief — "add a product to their wishlist from the
  catalog or the product page")
- **REQ-002**: The control reflects the buyer's saved state: an app already
  on the wishlist appears as saved on reload, and acting on a saved app
  removes it from the wishlist.
  (confirmed in FEAT-002 planning, 2026-11-11 — toggle behaviour)
- **REQ-003**: Saving an app that is already on the wishlist is idempotent:
  it creates no second entry, shows no error, and the app remains saved.
  (confirmed in FEAT-002 planning, 2026-11-11 — consistency with cart
  re-add behaviour)
- **REQ-004**: Removing an app that is not on the wishlist is idempotent: it
  shows no error and the app remains unsaved.
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-005**: Saving from a catalog card and saving the same app from its
  detail page act on the same per-buyer wishlist and produce exactly one
  entry.
  (source: user task brief — both entry points; "one entry" confirmed in
  planning)
- **REQ-006**: An app the buyer already owns can be saved to the wishlist;
  ownership does not block saving.
  (confirmed in FEAT-002 planning, 2026-11-11 — the wishlist is a
  save-for-later list and does not mirror library ownership)
- **REQ-007**: Every wishlist action (save, remove, move to cart) gives the
  buyer immediate visible feedback: the control/list updates and a message
  or state change confirms success; a failed action shows a visible,
  human-readable message.
  (confirmed in FEAT-002 planning, 2026-11-11)

### Wishlist page

- **REQ-008**: A dedicated wishlist page lists every app currently on the
  signed-in buyer's wishlist.
  (source: user task brief — "see their wishlist on its own page")
- **REQ-009**: Each wishlist entry shows at least the app's cover image,
  name, publisher, current catalog price in IDR, and rating.
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-010**: Wishlist entries are ordered newest-saved first.
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-011**: The buyer can remove an app directly from the wishlist page;
  on success the entry disappears from the list and stays removed after a
  reload or a later login.
  (source: user task brief — "remove items"; persistence confirmed in
  planning)
- **REQ-012**: The wishlist page is reachable from the storefront's main
  navigation, as its own destination alongside the existing catalog, My
  Library and Orders destinations.
  (confirmed in FEAT-002 planning, 2026-11-11; visual placement and styling
  belong to `/ui-preparation`, not this spec)

### Move to cart

- **REQ-013**: The buyer can move a wishlist entry to the cart. A successful
  move adds the app to the cart and removes it from the wishlist.
  (source: user task brief — "move an item to the cart")
- **REQ-014**: Moving an app that is already in the cart still removes it
  from the wishlist and creates no duplicate cart line; the buyer sees a
  confirmation that it is in the cart.
  (confirmed in FEAT-002 planning, 2026-11-11 — the move's intent is
  already satisfied)
- **REQ-015**: Moving is blocked when the cart already holds 20 distinct
  apps (FEAT-001 `REQ-020`, `REQ-036`). The item stays on the wishlist and
  the buyer sees a clear "cart is full" message.
  (confirmed in FEAT-002 planning, 2026-11-11; cart cap is FEAT-001
  behaviour)
- **REQ-016**: Moving is blocked when the buyer already owns the app
  (FEAT-001 `REQ-019`, `REQ-035`). The item stays on the wishlist and the
  buyer sees a clear "already in your library" message.
  (confirmed in FEAT-002 planning, 2026-11-11; ownership rule is FEAT-001
  behaviour)

### Persistence, privacy and lifecycle

- **REQ-017**: Every wishlist page and every wishlist action requires an
  authenticated session. An unauthenticated visitor is redirected to login
  and returned to the requested page afterwards, consistent with FEAT-001
  `REQ-004`.
  (source: user task brief — "signed-in buyers"; redirect behaviour is
  existing FEAT-001 behaviour)
- **REQ-018**: A wishlist is private to the buyer who owns it. No buyer can
  see or change another buyer's wishlist, and a request for another buyer's
  wishlist data returns not-found rather than that buyer's data — the same
  per-user isolation rule as the cart (FEAT-001 `REQ-017`, `REQ-031`).
  (source: user task brief — "private to each buyer")
- **REQ-019**: A wishlist is stored per account on the server and survives
  logout/login, session expiry, and use from a different browser or device
  signed into the same account. It changes only when the buyer adds,
  removes or moves an entry, or when an entry is purchased (REQ-020).
  (source: user task brief — "survives logging out"; cross-device and
  per-account storage confirmed in planning)
- **REQ-020**: A successful checkout automatically removes every purchased
  app from the buyer's wishlist, because those apps are no longer wanted
  later.
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-021**: The price shown for a wishlist entry is the app's current
  catalog price, not a snapshot taken when the app was saved. A later
  catalog price change is reflected the next time the wishlist is loaded.
  (confirmed in FEAT-002 planning, 2026-11-11 — a wishlist is not a price
  commitment)

## Data Validation Rules

These are business rules. How they are enforced (a database constraint, a
validator, a transaction) is `/code-preparation`'s concern.

- **REQ-022**: A buyer's wishlist holds at most one entry per app; the pair
  (buyer, app) is unique.
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-023**: Only an app that exists in the current catalog can be saved
  or moved. An unknown or invalid app id is rejected with a not-found
  result and creates or changes no wishlist entry.
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-024**: There is no separate wishlist size limit in v1. The seeded
  catalog currently contains 12 apps, so the catalog itself bounds the
  list. Revisit this when the catalog grows or becomes admin-managed.
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-025**: A wishlist entry always belongs to exactly one buyer, and
  that buyer is always the signed-in session user — never a value supplied
  by the client in a request body or query parameter.
  (confirmed in FEAT-002 planning, 2026-11-11; matches FEAT-001's session
  rule)
- **REQ-026**: The wishlist has no user-entered free-text or numeric
  fields. The only inputs are app ids selected from the existing catalog,
  so there are no length, format, range or enum rules beyond REQ-022–REQ-025.
  (confirmed in FEAT-002 planning, 2026-11-11)

## Edge Cases

- **REQ-027**: An empty wishlist shows an empty state that explains what
  the wishlist is for and offers a way back to the catalog, not a blank
  page or an error.
  (confirmed in FEAT-002 planning, 2026-11-11; matches FEAT-001 empty-cart
  handling)
- **REQ-028**: If the wishlist cannot be loaded, the buyer sees a
  human-readable error with a retry action, not a blank page, a raw error
  or a stack trace.
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-029**: A buyer may save an app that is also in their cart. The
  wishlist and the cart are independent: the app can appear in both, and
  "move to cart" then simply removes the wishlist entry (REQ-014).
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-030**: A buyer may save an app they already own. It stays visible
  on the wishlist with its current details, but moving it to the cart is
  blocked (REQ-016).
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-031**: If the session expires during a wishlist action, the buyer
  is redirected to login (REQ-017); the wishlist itself is unchanged and is
  intact after logging back in (REQ-019).
  (confirmed in FEAT-002 planning, 2026-11-11; matches FEAT-001 `REQ-043`)
- **REQ-032**: If the catalog price of a saved app changes, the wishlist
  shows the new current price on its next load (REQ-021); no historical
  price is kept on the wishlist.
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-033**: A save or move request naming an app id that does not exist
  is rejected as not-found and leaves the wishlist and cart unchanged
  (REQ-023).
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-034**: A direct request for another buyer's wishlist data returns
  not-found and never exposes that buyer's entries (REQ-018), the same
  behaviour as a foreign order id in FEAT-001 `REQ-044`.
  (confirmed in FEAT-002 planning, 2026-11-11)

## Dependencies

- **REQ-035**: Depends on FEAT-001 authentication and server-side sessions:
  only a signed-in buyer has a wishlist, and the buyer's identity comes from
  the session.
  (source: user task brief — signed-in buyers; FEAT-001 auth design)
- **REQ-036**: Depends on the existing seeded catalog for app identity,
  cover image, name, publisher, category, price and rating. The wishlist
  stores only the buyer–app relationship and reads display fields from the
  catalog.
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-037**: Depends on the existing per-user cart and its rules: quantity
  is always one, the cap is 20 distinct apps, and adding an owned app is
  blocked. "Move to cart" reuses those rules rather than creating a second
  cart mechanism.
  (confirmed in FEAT-002 planning, 2026-11-11; cart rules are FEAT-001
  `REQ-015`–`REQ-020`)
- **REQ-038**: Depends on the existing checkout completing successfully to
  trigger wishlist cleanup (REQ-020); a failed or rejected checkout removes
  nothing from the wishlist.
  (confirmed in FEAT-002 planning, 2026-11-11)
- **REQ-039**: Extends `paladin-code` (Go + PostgreSQL) and `paladin-ui`
  (React + Vite + TypeScript) as built for FEAT-001. No `nexcommon` and no
  `nexcomponent-ui` are introduced.
  (source: user task brief — "No nexcommon and no nexcomponent"; existing
  stack from FEAT-001)
- **REQ-040**: `/code-preparation` must extend the existing OpenAPI contract
  at `paladin-code/api/openapi.yaml` with the wishlist operations before
  implementation. The approved contract remains the only source of truth
  for paths, methods, request bodies and response shapes; this spec does not
  define them.
  (confirmed in FEAT-002 planning, 2026-11-11; contract-first rule)
- **REQ-041**: There are no other Paladin services, no shared libraries and
  no external integrations involved. The wishlist is one backend service
  plus its own PostgreSQL database, consumed by the existing frontend.
  (source: user task brief)

## Non-Goals

- No sharing a wishlist, public links, or wishlists visible to other buyers.
  (confirmed in FEAT-002 planning, 2026-11-11)
- No price-drop, back-in-stock, discount or reminder notifications or
  emails.
  (confirmed in FEAT-002 planning, 2026-11-11)
- No multiple, named or themed wishlists per buyer — one list per buyer.
  (confirmed in FEAT-002 planning, 2026-11-11)
- No guest or logged-out wishlist, and no wishlist merge after login.
  (confirmed in FEAT-002 planning, 2026-11-11)
- No "add all to cart" or bulk operations.
  (confirmed in FEAT-002 planning, 2026-11-11)
- No wishlist count badge in the header.
  (confirmed in FEAT-002 planning, 2026-11-11)
- No wishlist-specific admin or catalog management; the catalog remains
  seed-managed as in FEAT-001.
  (source: FEAT-001 non-goals; confirmed in FEAT-002 planning)
- No wishlist price history or snapshot; only the current price is shown.
  (confirmed in FEAT-002 planning, 2026-11-11)
- No wishlist import/export.
  (confirmed in FEAT-002 planning, 2026-11-11)

## Priority

- **REQ-042**: Priority is P1. All wishlist behaviour described above ships
  in this pass: add/remove from catalog and product page, the dedicated
  wishlist page, remove, move to cart, privacy/persistence, and purchase
  cleanup.
  (source: user task brief; scope confirmed in FEAT-002 planning,
  2026-11-11)
- **REQ-043**: Deferred beyond this pass: everything in Non-Goals.
  (confirmed in FEAT-002 planning, 2026-11-11)

## Success Criteria

- **REQ-044**: A signed-in buyer can save an app from a catalog card and,
  separately, save an app from its product page; after each save the control
  shows a saved state and the app appears exactly once on the wishlist page.
  (verifies REQ-001–REQ-007)
- **REQ-045**: A saved app remains on the wishlist after the buyer logs out
  and logs back in, and is visible to the same account from a different
  browser or device.
  (verifies REQ-019)
- **REQ-046**: Removing an app from the wishlist page makes it disappear
  from the list, and it stays gone after a reload and after a later login.
  (verifies REQ-011)
- **REQ-047**: Moving an app to the cart adds it to the cart and removes it
  from the wishlist; if it was already in the cart, the wishlist entry is
  still removed and there is still exactly one cart line.
  (verifies REQ-013, REQ-014)
- **REQ-048**: Moving is refused with a visible message and the item stays
  on the wishlist when the cart is full (20 distinct apps) or the app is
  already owned.
  (verifies REQ-015, REQ-016)
- **REQ-049**: Buying an app through checkout removes that app from the
  buyer's wishlist.
  (verifies REQ-020)
- **REQ-050**: One buyer can never see or change another buyer's wishlist;
  a direct attempt returns not-found.
  (verifies REQ-018, REQ-034)
- **REQ-051**: The empty wishlist, load-error and expired-session states
  behave as described, with no blank page, raw error or stack trace shown to
  the buyer.
  (verifies REQ-027, REQ-028, REQ-031)
- No separate post-launch business metric: the acceptance criteria above are
  the success measure for this feature.
  (confirmed in FEAT-002 planning, 2026-11-11)

## External Integrations

None. The user states there are no external integrations
(source: user task brief). The wishlist involves only the existing
`paladin-code` backend, the existing `paladin-ui` frontend, and their
PostgreSQL database (REQ-039–REQ-041). There is no third-party service and
no network call to another Paladin service.

## UI Scope

`has_ui: true`. The buyer needs a save control on catalog cards and the app
detail page, and a dedicated wishlist page with remove and move-to-cart
actions. Per the task brief there is no Figma file for this feature: the
wishlist screens must follow the look of the existing `paladin-ui` pages
(dark, Spyker-style) rather than introducing a new visual direction.

This spec deliberately does not define screens, layouts, colors, typography
or motion. `/ui-preparation` owns that work and maps these `REQ-*` onto the
design, and `/fe-dev` implements against it.

## Sources

No knowledge documents were supplied for this feature. Every fact above is
derived from the user's task brief, the confirmed answers in the FEAT-002
planning round of 2026-11-11, and the existing FEAT-001 spec, architecture,
database design and code (cited inline where relevant).

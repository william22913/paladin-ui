---
feature_code: FEAT-002
service: paladin
version: 1
status: complete
spec_version: 1
open_questions: []
pr_url: https://github.com/william22913/sandbox-docs/pull/40
last_updated: 2026-11-11
---

# FEAT-002 — Wishlist (test design)

Black-box test design derived from the merged `spec.md` v1 (spec PR #38,
merged into `sandbox-docs` `main` on 2026-11-11). Cases describe observable
behavior only; they do not prescribe implementation. No case in this
document has been executed.

## Scope and test data

All cases assume the FEAT-001 seeded environment: real buyer accounts and a
catalog with cover images, name, publisher, category, price in IDR, rating,
version and supported OS. FEAT-002 adds no admin UI, so catalog and price
changes used by a case are applied by a test fixture, not by an end user.

Named fixture data (adapt the labels to the actual seed, but keep the
properties):

- `buyer_a` / `Passw0rd!a` — signed-in buyer; owns `APP-E` (FEAT-001
  fixture); starts with an empty wishlist in each case unless stated.
- `buyer_b` / `Passw0rd!b` — separate signed-in buyer; owns nothing; starts
  with an empty wishlist.
- `newbie` / `Passw0rd!n` — signed-in buyer with no purchases, an empty
  cart and an empty wishlist.
- Catalog, 12 apps as stated in REQ-024: `APP-A` (productivity, 150000),
  `APP-B` (design, 0), `APP-C` (developer tools, 250000), `APP-D`
  (security, 100000), `APP-E` (games, 75000), and `APP-F`…`APP-L` (the
  remaining seven seeded apps across the five seeded categories). Ratings
  are seeded display data.
- **Extended-catalog fixture** (used only by TC-019 and TC-020): the test
  environment must seed at least 21 existing catalog apps with complete
  catalog records. This is a test-environment fixture requirement, not a
  product capability: the documented seed has 12, and only seeded catalog
  apps can be saved or moved (REQ-023), so the fixture must supply the
  extra apps for the cart-cap boundary to be reachable. It does not change
  the seeded default catalog used by any other case.
- **Price-change fixture** (TC-030): a direct seed/database change of
  `APP-C`'s catalog price from 250000 to 300000.
- **Ownership-conflict fixture** (TC-029): `buyer_a` is granted ownership
  of an app that is already in `buyer_a`'s cart, so the FEAT-001
  checkout ownership re-check rejects the cart.
- **Fault injection** (TC-011, TC-037): the wishlist operation returns a
  server error for the duration of the step that needs it, then recovers.

## Requirement coverage

| REQ | Requirement (short) | Cases | Notes |
|---|---|---|---|
| REQ-001 | Catalog card and app detail page have a wishlist control | TC-001, TC-002 | |
| REQ-002 | Control reflects saved state; acting on a saved app removes it | TC-003, TC-004, TC-005 | |
| REQ-003 | Saving an already-saved app is idempotent | TC-006 | |
| REQ-004 | Removing an unsaved app is idempotent | TC-007 | |
| REQ-005 | Both entry points share one per-buyer list, one entry | TC-008 | |
| REQ-006 | An owned app can be saved | TC-009 | |
| REQ-007 | Every action shows visible success or failure feedback | TC-010, TC-011 | |
| REQ-008 | A dedicated wishlist page lists every saved app | TC-012 | |
| REQ-009 | Each entry shows cover, name, publisher, current IDR price, rating | TC-013 | |
| REQ-010 | Entries are ordered newest-saved first | TC-014 | |
| REQ-011 | Remove from the wishlist page; the removal persists | TC-004, TC-005, TC-016 | |
| REQ-012 | Wishlist is reachable from the main navigation | TC-015 | |
| REQ-013 | Move adds to the cart and removes from the wishlist | TC-017 | |
| REQ-014 | Moving an app already in the cart still removes the wishlist entry, no duplicate cart line | TC-018 | |
| REQ-015 | Moving is blocked when the cart holds 20 distinct apps | TC-019, TC-020 | Requires the extended-catalog test fixture (21+ seeded apps); see Scope and test data. |
| REQ-016 | Moving an owned app is blocked | TC-021 | |
| REQ-017 | Wishlist pages and actions require authentication, with return after login | TC-022, TC-023 | |
| REQ-018 | A wishlist is private to its buyer | TC-024, TC-031 | |
| REQ-019 | Per-account server storage; survives logout/login, expiry, other devices | TC-025, TC-026, TC-027, TC-040 | |
| REQ-020 | Successful checkout removes purchased apps from the wishlist | TC-028 | |
| REQ-021 | Displayed price is the current catalog price | TC-030 | |
| REQ-022 | At most one entry per (buyer, app) | TC-006, TC-031 | |
| REQ-023 | Only an existing catalog app can be saved or moved; unknown id is not-found | TC-032, TC-033 | |
| REQ-024 | No separate wishlist size limit in v1 | TC-034 | Saving every documented catalog app succeeds; the catalog bounds the list. |
| REQ-025 | Entry owner always comes from the session, never from the client | TC-035 | |
| REQ-026 | No user-entered free-text or numeric fields | — | Nothing beyond app-id validation to exercise: the only inputs are catalog app ids, and the unknown-id and session-ownership cases already cover them. |
| REQ-027 | Empty wishlist shows guidance and a way back to the catalog | TC-036 | |
| REQ-028 | Load failure shows a human-readable error with retry | TC-037 | |
| REQ-029 | An app may be in both cart and wishlist; they stay independent | TC-018, TC-039 | |
| REQ-030 | An owned app stays visible on the wishlist but cannot be moved | TC-009, TC-021 | |
| REQ-031 | Expired session during an action redirects to login; list stays intact | TC-027 | |
| REQ-032 | A price change appears on the next load; no price history | TC-030 | |
| REQ-033 | Unknown app id on save or move is not-found and changes nothing | TC-032, TC-033 | |
| REQ-034 | A direct request for another buyer's wishlist data returns not-found | TC-024 | |
| REQ-035 | Depends on FEAT-001 authentication and server-side sessions | TC-022, TC-023 | The dependency is observed as login gating and session-derived ownership. |
| REQ-036 | Display fields come from the seeded catalog | TC-013 | |
| REQ-037 | Move reuses the existing cart rules (quantity 1, cap 20, owned block) | TC-017, TC-018, TC-019, TC-020, TC-021 | |
| REQ-038 | A successful checkout triggers cleanup; a failed checkout removes nothing | TC-029 | |
| REQ-039 | Extends paladin-code/paladin-ui; no nexcommon or nexcomponent | — | Build/dependency fact with no runtime observable; verified by code review, not by a test case. |
| REQ-040 | Extend the existing OpenAPI contract before implementation | — | Contract-first process requirement. API-level cases here are instantiated against the FEAT-002 contract once /code-preparation defines it; the contract itself is verified there, not by a behavioral case. |
| REQ-041 | No other services, shared libraries or external integrations | — | Architectural fact with no storefront-visible behavior; verified by code review rather than a test case. |
| REQ-042 | Priority P1; all wishlist behavior ships in this pass | TC-038 | The full-journey case exercises the shipped scope end to end. |
| REQ-043 | Everything in Non-Goals is deferred beyond this pass | — | Roadmap statement, not a behavior; the Non-goals review below records why no case is written. |
| REQ-044 | Save from card and product page; saved state; exactly one wishlist entry | TC-001, TC-002, TC-008, TC-038 | |
| REQ-045 | Wishlist survives logout/login and is visible from another browser or device | TC-025, TC-026, TC-038 | |
| REQ-046 | Removed app disappears and stays gone after reload and later login | TC-016, TC-038 | |
| REQ-047 | Move adds to cart and removes from wishlist; already-in-cart still removes, one line | TC-017, TC-018, TC-038 | |
| REQ-048 | Blocked move shows a visible message and the item stays | TC-019, TC-021 | |
| REQ-049 | Buying an app through checkout removes it from the wishlist | TC-028, TC-038 | |
| REQ-050 | One buyer can never see or change another buyer's wishlist | TC-024 | |
| REQ-051 | Empty, load-error and expired-session states behave; no blank page or raw error | TC-036, TC-037, TC-027 | |

## Non-goals review

None of the Non-Goals defines a rejection behavior that a buyer or client
could exercise in v1: sharing/public links, price-drop or stock
notifications, multiple/named wishlists, guest wishlists and login merge,
add-all-to-cart or other bulk operations, a header count badge,
wishlist-specific admin, price history/snapshots, and import/export. There
is therefore no case for them; their absence is verified by UI review, and
the wishlist remains one private, single list per buyer. Any non-goal that
later gains an explicit rejection rule should get its own case then.

## Test cases

### TC-001 — A catalog card saves an app to the wishlist
- **Type:** positive
- **Spec:** REQ-001, REQ-044
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; `buyer_a`'s wishlist is empty; `APP-A` is on the catalog page.
- **Action / input:** On `APP-A`'s catalog card, activate the wishlist control.
- **Expected result:** The request succeeds, the card's control changes to a visible saved state, and a confirmation message or equivalent state change is shown. The catalog remains usable. Sample the control on cards from each of the five seeded categories: each card offers the same control.

### TC-002 — The app detail page saves an app to the wishlist
- **Type:** positive
- **Spec:** REQ-001, REQ-044
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; empty wishlist; `APP-A` detail page reachable.
- **Action / input:** Open `APP-A`'s detail page and activate its wishlist control.
- **Expected result:** The control shows the saved state with visible confirmation; the wishlist page then lists `APP-A` exactly once.

### TC-003 — A saved app still shows as saved after a reload
- **Type:** positive
- **Spec:** REQ-002
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; `APP-A` was saved in this session.
- **Action / input:** Reload the catalog page, then reload `APP-A`'s detail page.
- **Expected result:** Both the catalog card control and the detail-page control show `APP-A` as saved on load; no duplicate save is performed.

### TC-004 — Toggling a saved app off from a catalog card removes it
- **Type:** positive
- **Spec:** REQ-002, REQ-011
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; `APP-A` is on `buyer_a`'s wishlist and the catalog card shows it as saved.
- **Action / input:** Activate the saved control on `APP-A`'s catalog card.
- **Expected result:** The app is removed from the wishlist, the control returns to the unsaved state, and a visible confirmation is shown. Opening the wishlist page shows no `APP-A` entry.

### TC-005 — Toggling a saved app off from the detail page removes it
- **Type:** positive
- **Spec:** REQ-002, REQ-011
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; `APP-C` is on `buyer_a`'s wishlist; its detail page shows the saved state.
- **Action / input:** Activate the saved control on `APP-C`'s detail page.
- **Expected result:** `APP-C` is removed from the wishlist, the control returns to the unsaved state, and the wishlist page no longer lists it.

### TC-006 — Saving the same app twice keeps exactly one entry
- **Type:** positive
- **Spec:** REQ-003, REQ-022
- **Level:** API
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Authenticated as `buyer_a`; `APP-A` is already on `buyer_a`'s wishlist.
- **Action / input:** Issue the wishlist save operation for `APP-A` again for the same buyer (twice more).
- **Expected result:** Each call is a success with no error response, no second entry is created, and the wishlist still lists `APP-A` exactly once.

### TC-007 — Removing an app that is not saved is a harmless no-op
- **Type:** negative
- **Spec:** REQ-004
- **Level:** API
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Authenticated as `buyer_a`; `APP-B` is not on the wishlist.
- **Action / input:** Issue the wishlist remove operation for `APP-B` (twice).
- **Expected result:** The operation returns without an error; the wishlist is unchanged and `APP-B` remains absent.

### TC-008 — Both entry points feed one per-buyer wishlist with one entry per app
- **Type:** positive
- **Spec:** REQ-005, REQ-044
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; empty wishlist; `APP-B` and `APP-D` are not saved.
- **Action / input:** Save `APP-D` from its catalog card. Open `APP-D`'s detail page and confirm the control shows saved. Then open `APP-B`'s detail page and save `APP-B` there.
- **Expected result:** The detail page reflects the save made from the catalog card, proving both entry points act on the same list. The wishlist lists `APP-D` exactly once and `APP-B` exactly once; the catalog card and detail page agree on each app's saved state.

### TC-009 — An app the buyer already owns can be saved
- **Type:** positive
- **Spec:** REQ-006, REQ-030
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; `buyer_a` owns `APP-E` (it appears in My Library); `APP-E` is not on the wishlist.
- **Action / input:** Save `APP-E` from its catalog card and from its detail page.
- **Expected result:** Both saves succeed with the same visible feedback as any other app; `APP-E` appears on the wishlist with its normal catalog details. Ownership does not disable or reject saving.

### TC-010 — Successful wishlist actions give immediate visible feedback
- **Type:** positive
- **Spec:** REQ-007
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; `APP-A` and `APP-C` are available; wishlist empty.
- **Action / input:** Perform a save, a remove, and a move to cart, one at a time, watching the control and the list after each action.
- **Expected result:** After each action the control or list updates without a full-page reload being required, and a visible success message or equivalent confirmation is shown. No raw error, stack trace or internal code appears.

### TC-011 — A failed wishlist action shows a human-readable message
- **Type:** negative
- **Spec:** REQ-007
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; `APP-A` is not saved; fault injection makes the save operation fail with a server error.
- **Action / input:** Activate the wishlist control for `APP-A`.
- **Expected result:** A visible, human-readable failure message is shown; the control does not change to the saved state; no entry is created; the page does not show a raw error, stack trace, status code or internal enum value.

### TC-012 — The wishlist page lists every saved app
- **Type:** positive
- **Spec:** REQ-008
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; wishlist contains `APP-A`, `APP-C` and `APP-L` (no others).
- **Action / input:** Open the wishlist from the main navigation.
- **Expected result:** The page lists exactly `APP-A`, `APP-C` and `APP-L`, each once; no other app and no other buyer's entry appears.

### TC-013 — Each wishlist entry shows the required catalog details
- **Type:** positive
- **Spec:** REQ-009, REQ-036
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; `APP-A` (150000, its seeded publisher and rating) is on the wishlist.
- **Action / input:** Open the wishlist page and inspect the `APP-A` entry.
- **Expected result:** The entry shows `APP-A`'s cover image, name, publisher, current price formatted in IDR (150000 as seeded) and rating, all matching the catalog. No field is blank or a placeholder.

### TC-014 — Wishlist entries are ordered newest-saved first
- **Type:** positive
- **Spec:** REQ-010
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; empty wishlist; save `APP-A`, then `APP-C`, then `APP-B`, in that order.
- **Action / input:** Open the wishlist page.
- **Expected result:** The entries appear in the order `APP-B`, `APP-C`, `APP-A` (newest first).

### TC-015 — The wishlist is reachable from the main navigation
- **Type:** positive
- **Spec:** REQ-012
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; the storefront's main navigation is visible.
- **Action / input:** Inspect the main navigation, then activate the Wishlist destination.
- **Expected result:** A Wishlist destination is present alongside the existing Catalog, My Library and Orders destinations, and activating it opens the wishlist page. It works from the catalog and from an app detail page.

### TC-016 — Removing an app from the wishlist page persists
- **Type:** positive
- **Spec:** REQ-011, REQ-046
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; wishlist contains `APP-A` and `APP-C`.
- **Action / input:** On the wishlist page, remove `APP-A`; reload the page; log out and log back in as `buyer_a`; reopen the wishlist.
- **Expected result:** `APP-A` disappears from the list immediately on removal, and it is still absent after the reload and after the later login. `APP-C` remains throughout.

### TC-017 — Moving an entry to the cart adds it and removes it from the wishlist
- **Type:** positive
- **Spec:** REQ-013, REQ-037, REQ-047
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; wishlist contains `APP-A`; cart does not contain `APP-A`.
- **Action / input:** Activate "move to cart" for `APP-A` on the wishlist page.
- **Expected result:** The cart contains exactly one `APP-A` line with quantity 1, the wishlist no longer lists `APP-A`, and a visible confirmation is shown. The cart total includes `APP-A`'s current price.

### TC-018 — Moving an app already in the cart removes the wishlist entry without duplicating the cart line
- **Type:** positive
- **Spec:** REQ-014, REQ-047
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; `APP-C` is in the cart as one line and is also on the wishlist.
- **Action / input:** Activate "move to cart" for `APP-C` on the wishlist page.
- **Expected result:** The wishlist entry for `APP-C` is removed; the cart still has exactly one `APP-C` line with quantity 1 (no duplicate); the buyer sees a confirmation that the app is in the cart.

### TC-019 — Moving is refused when the cart already holds 20 distinct apps
- **Type:** negative
- **Spec:** REQ-015, REQ-037, REQ-048
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Extended-catalog test fixture (at least 21 existing catalog apps; see Scope and test data). Signed in as `buyer_a`; the cart holds 20 distinct apps; the wishlist holds a 21st distinct app that is not in the cart and not owned.
- **Action / input:** Activate "move to cart" for the wishlist app.
- **Expected result:** The move is refused with a clear, human-readable "cart is full / at most 20 apps" message; the item stays on the wishlist; the cart still holds exactly the same 20 distinct lines; no partial change occurs.

### TC-020 — Moving the 20th distinct app succeeds at the boundary
- **Type:** boundary
- **Spec:** REQ-015
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Extended-catalog test fixture (at least 20 existing catalog apps; see Scope and test data). Signed in as `buyer_a`; the cart holds 19 distinct apps; the wishlist holds a 20th distinct app not in the cart and not owned.
- **Action / input:** Activate "move to cart" for the wishlist app.
- **Expected result:** The move succeeds; the app is removed from the wishlist and the cart now holds exactly 20 distinct lines with quantity 1 each; the 20-app cap is not applied one app too early.

### TC-021 — Moving an owned app to the cart is refused
- **Type:** negative
- **Spec:** REQ-016, REQ-030, REQ-037, REQ-048
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; `buyer_a` owns `APP-E`; `APP-E` is on the wishlist and is not in the cart.
- **Action / input:** Activate "move to cart" for `APP-E` on the wishlist page.
- **Expected result:** The move is refused with a clear "already in your library" message; `APP-E` stays on the wishlist; the cart is unchanged; My Library is unchanged; no duplicate ownership or license key is created.

### TC-022 — The wishlist page requires login and returns the buyer after login
- **Type:** negative
- **Spec:** REQ-017, REQ-035
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** No active session; `buyer_a`'s wishlist contains `APP-A`.
- **Action / input:** Open the wishlist page URL directly without a session; then log in as `buyer_a`.
- **Expected result:** The unauthenticated request is redirected to the login page and no wishlist content is shown. After successful login the buyer is returned to the wishlist page, which lists `buyer_a`'s entries.

### TC-023 — Unauthenticated wishlist operations are rejected
- **Type:** negative
- **Spec:** REQ-017, REQ-035
- **Level:** API
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** No session or a syntactically invalid/expired session; `APP-A` exists; `buyer_a` has a known wishlist state.
- **Action / input:** Issue the wishlist list, save, remove and move operations for `APP-A` without valid authentication.
- **Expected result:** Every operation is rejected as unauthenticated per the contract (login redirect or an authentication error status); none succeeds; no wishlist or cart entry is created, changed or deleted for any buyer.

### TC-024 — Another buyer's wishlist data is not accessible
- **Type:** negative
- **Spec:** REQ-018, REQ-034, REQ-050
- **Level:** API
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** `buyer_a`'s wishlist contains `APP-A`; signed in as `buyer_b`, whose wishlist is empty.
- **Action / input:** While authenticated as `buyer_b`, issue direct requests that name `buyer_a`'s wishlist data — `buyer_a`'s wishlist or entry identifier if the FEAT-002 contract exposes one, otherwise a wishlist request carrying `buyer_a`'s user identifier — and attempt to read it and to remove an entry from it.
- **Expected result:** Each attempt returns a not-found result (not `buyer_a`'s data, not a permission error that leaks its contents); no `buyer_a` entry id, app, price or count is exposed; `buyer_a`'s wishlist is unchanged; `buyer_b`'s own wishlist is unchanged.

### TC-025 — The wishlist survives logout and a later login
- **Type:** positive
- **Spec:** REQ-019, REQ-045
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; wishlist contains `APP-A` and `APP-C`.
- **Action / input:** Log out, then log back in as `buyer_a` and open the wishlist.
- **Expected result:** The wishlist still contains exactly `APP-A` and `APP-C` with their current catalog details; nothing was lost or duplicated.

### TC-026 — The same account sees the same wishlist from another browser or device
- **Type:** positive
- **Spec:** REQ-019, REQ-045
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** `buyer_a` is signed in on browser/device 1 with `APP-A` on the wishlist; a second, independent session is opened for `buyer_a` on browser/device 2.
- **Action / input:** Open the wishlist in session 2; add `APP-C` in session 1; reload the wishlist in session 2.
- **Expected result:** Session 2 initially lists `APP-A`; after the reload it lists `APP-A` and `APP-C`. The wishlist is per account, not per browser session.

### TC-027 — An expired session during a wishlist action redirects to login and leaves the list intact
- **Type:** negative
- **Spec:** REQ-019, REQ-031, REQ-051
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; wishlist contains `APP-A`; the session is advanced past its 24-hour lifetime (FEAT-001 REQ-006) while the wishlist page is open.
- **Action / input:** Attempt to remove `APP-A` (and, in a second run, to move it to the cart).
- **Expected result:** The action redirects to the login page. After logging back in, the wishlist still contains `APP-A` and the cart is unchanged — the expired action had no partial effect. No raw error or stack trace is shown.

### TC-028 — A successful checkout removes purchased apps from the wishlist
- **Type:** positive
- **Spec:** REQ-020, REQ-049
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; `APP-A` is in the cart and on the wishlist (REQ-029); `APP-C` is also on the wishlist but not in the cart.
- **Action / input:** Complete checkout successfully.
- **Expected result:** The checkout succeeds and `APP-A` appears in My Library. The wishlist no longer lists `APP-A`; `APP-C` remains on the wishlist. No other wishlist entry changes.

### TC-029 — A rejected checkout removes nothing from the wishlist
- **Type:** negative
- **Spec:** REQ-038
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Ownership-conflict fixture: signed in as `buyer_a`; the cart contains an app that `buyer_a` now owns (ownership granted by the fixture after the app entered the cart); the wishlist contains that app plus `APP-C`.
- **Action / input:** Attempt checkout.
- **Expected result:** Checkout is rejected by the FEAT-001 ownership re-check: no order and no license key are created for any cart app. Both wishlist entries remain unchanged, including the conflicting app.

### TC-030 — The wishlist shows the current catalog price after a price change
- **Type:** positive
- **Spec:** REQ-021, REQ-032
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; `APP-C` was saved when its price was 250000; the price-change fixture then sets the catalog price to 300000.
- **Action / input:** Open the wishlist page (reload it if already open).
- **Expected result:** The `APP-C` entry shows 300000 IDR, matching the current catalog price; no old price of 250000 is shown or retained as a wishlist snapshot. The catalog detail page also shows 300000.

### TC-031 — Two buyers can each save the same app and see only their own entry
- **Type:** positive
- **Spec:** REQ-018, REQ-022
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** `buyer_a` and `buyer_b` both have empty wishlists; `APP-A` exists.
- **Action / input:** Save `APP-A` as `buyer_a`; log out; save `APP-A` as `buyer_b`; inspect both wishlists.
- **Expected result:** Each buyer's wishlist contains `APP-A` exactly once. The per-(buyer, app) uniqueness holds without preventing the same app from being on two different buyers' lists.

### TC-032 — Saving an unknown app id is rejected as not-found and changes nothing
- **Type:** negative
- **Spec:** REQ-023, REQ-033
- **Level:** API
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Authenticated as `buyer_a`; wishlist contains `APP-A`; no catalog app with id `APP-DOES-NOT-EXIST`.
- **Action / input:** Issue the wishlist save operation for `APP-DOES-NOT-EXIST` and for a syntactically invalid app id.
- **Expected result:** Each request is rejected with a not-found result (no success); no wishlist entry is created for any buyer; `buyer_a`'s existing wishlist is unchanged.

### TC-033 — Moving an unknown app id is rejected as not-found and changes nothing
- **Type:** negative
- **Spec:** REQ-023, REQ-033
- **Level:** API
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Authenticated as `buyer_a`; `APP-A` is on the wishlist; no catalog app with id `APP-DOES-NOT-EXIST`.
- **Action / input:** Issue the wishlist move-to-cart operation for `APP-DOES-NOT-EXIST`.
- **Expected result:** The request is rejected with a not-found result; the wishlist is unchanged; the cart is unchanged; no partial move occurs.

### TC-034 — Every app in the catalog can be saved; there is no separate wishlist size cap
- **Type:** positive
- **Spec:** REQ-024
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; empty wishlist; the documented seed has 12 catalog apps.
- **Action / input:** Save all 12 apps, one at a time.
- **Expected result:** All 12 saves succeed and the wishlist lists all 12 apps; no save is rejected because of a wishlist size limit. The list is bounded only by the catalog size.

### TC-035 — Wishlist ownership comes from the session, not from the request
- **Type:** negative
- **Spec:** REQ-025
- **Level:** API
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Authenticated as `buyer_b`; `buyer_a`'s wishlist is known to be empty; `APP-A` exists.
- **Action / input:** Issue the save operation as `buyer_b` for `APP-A` while also sending a body/query field naming `buyer_a` (that buyer's identifier or username), and repeat with an oversized or malformed owner value.
- **Expected result:** The session user always wins: the new entry belongs to `buyer_b` only, `buyer_a`'s wishlist stays empty, and no entry is created for any buyer named in the request. If the contract rejects the extra field outright, neither wishlist changes and the rejection is a normal validation error — still never an entry for the supplied owner.

### TC-036 — An empty wishlist shows guidance and a way back to the catalog
- **Type:** positive
- **Spec:** REQ-027, REQ-051
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** no
- **Preconditions / test data:** Signed in as `newbie`; wishlist and cart are empty.
- **Action / input:** Open the wishlist page.
- **Expected result:** A deliberate empty state explains what the wishlist is for and offers a working way back to the catalog (link or button). The page is not blank, shows no error or raw text, and does not imply the wishlist failed to load.

### TC-037 — A wishlist load failure shows a retryable, human-readable error
- **Type:** negative
- **Spec:** REQ-028, REQ-051
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; fault injection makes the wishlist load fail; `buyer_a` has wishlist entries.
- **Action / input:** Open the wishlist page; then clear the fault and activate the retry action.
- **Expected result:** While failing, the page shows a human-readable error and a retry action, with no blank page, raw error, stack trace or internal code. After the fault clears, retry loads the wishlist normally with `buyer_a`'s entries.

### TC-038 — End-to-end journey: save from both places, move, check out, log back in
- **Type:** positive
- **Spec:** REQ-038, REQ-042, REQ-044, REQ-045, REQ-046, REQ-047, REQ-049
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; empty cart; empty wishlist; `APP-A` and `APP-C` available.
- **Action / input:** (1) Save `APP-A` from its catalog card. (2) Open `APP-A`'s detail page and confirm it shows saved. (3) Save `APP-C` from its card. (4) Open the wishlist: it lists `APP-C` then `APP-A`. (5) Move `APP-A` to the cart. (6) Add `APP-C` to the cart from the catalog while it stays on the wishlist. (7) Check out successfully. (8) Open the wishlist, then log out and log back in and open it again.
- **Expected result:** After step 4 the wishlist has exactly `APP-A` and `APP-C`, newest first. After step 7 the cart is emptied, My Library contains `APP-A` and `APP-C`, and the wishlist is empty (both apps were purchased or moved). After step 8 the wishlist is still empty across the login, and the navigation still offers Wishlist alongside Catalog, My Library and Orders. No step shows a raw error.

### TC-039 — An app can be in the cart and on the wishlist at the same time
- **Type:** positive
- **Spec:** REQ-029
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; `APP-A` is in the cart as one line; `APP-A` is not on the wishlist.
- **Action / input:** Save `APP-A` from its catalog card; open the wishlist; then open the cart.
- **Expected result:** The save succeeds and `APP-A` appears on the wishlist while remaining one line in the cart. Neither list changes the other: the cart still holds one `APP-A` line with quantity 1, and no cart message claims a conflict. Moving the wishlist entry afterward removes only the wishlist entry (TC-018).

### TC-040 — Unrelated store activity leaves the wishlist unchanged
- **Type:** negative
- **Spec:** REQ-019
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Signed in as `buyer_a`; wishlist contains `APP-A`; cart contains `APP-C`; `APP-B` is available and not saved.
- **Action / input:** Browse the catalog, run a name search, filter by category, open `APP-B`'s detail page without saving it, add `APP-B` to the cart and remove it again, open My Library and Orders, then log out and log back in.
- **Expected result:** Throughout, the wishlist contains exactly `APP-A` with the same details and position; no entry is added, removed or reordered by non-wishlist activity. Only an explicit save/remove/move, or a purchase (TC-028), changes the wishlist.

## Open questions for /document-preparation

None. The former OQ-1 (the 20-app cart boundary needing more than the documented 12-app seed) is recorded as the **Extended-catalog fixture** test-environment requirement in "Scope and test data"; it is not a spec ambiguity and the expected results in TC-019 and TC-020 stand.

---
feature_code: FEAT-001
service: paladin
version: 1
status: complete
spec_version: 1
open_questions: []
pr_url: https://github.com/william22913/sandbox-docs/pull/33
last_updated: 2026-11-11
---

# FEAT-001 — Paladin storefront v1 (test design)

Black-box test design derived from the merged `spec.md` v1 (PR #32). Cases
describe observable behavior only; they do not prescribe implementation. No
case in this document has been executed.

## Scope and test data

All cases assume the seeded environment defined by `spec.md` REQ-047: seeded
buyer accounts, and a seeded catalog across the five categories
(productivity, design, developer tools, security, games) with cover images,
screenshots, supported OS, version, publisher, price and rating.

Named fixture data used below (adapt names to the actual seed, but keep the
properties):

- `buyer_a` / `Passw0rd!a` — normal buyer; owns `APP-E`.
- `buyer_b` / `Passw0rd!b` — separate buyer; owns nothing.
- `newbie` / `Passw0rd!n` — buyer with no purchases.
- `abc` / `Passw0rd!x` — seeded account whose username is exactly 3 chars.
- a 50-character username account (e.g. `uuuu…` ×50) / `Passw0rd!y`.
- Catalog: `APP-A` productivity 150000; `APP-B` design 0 (free);
  `APP-C` developer tools 250000; `APP-D` security 100000; `APP-E` games
  75000. Featured flags on `APP-A`, `APP-C`, `APP-D` in that seed order.
- Category `utility` exists in the test fixture with zero apps (used only by
  TC-030).

## Requirement coverage

| REQ | Requirement (short) | Cases | Notes |
|---|---|---|---|
| REQ-001 | Login page with username/password; seeded accounts only | TC-001 | Self sign-up absence is a non-goal, not a rejection rule (see Non-goals review). |
| REQ-002 | Valid login creates session; return to requested page or catalog | TC-002, TC-003 | |
| REQ-003 | Invalid credentials show one generic error; no enumeration | TC-004, TC-005, TC-006 | |
| REQ-004 | Every store page requires authentication | TC-003, TC-007 | |
| REQ-005 | Logout from every authenticated page; back does not restore | TC-008, TC-009 | |
| REQ-006 | 24-hour session lifetime | TC-010, TC-011 | |
| REQ-007 | Home has hero, featured, category browse, search | TC-019 | |
| REQ-008 | Featured = seed subset, seed order, up to six | TC-020, TC-021 | |
| REQ-009 | Browse all apps filtered by the five categories | TC-022 | |
| REQ-010 | Case-insensitive substring name search, combinable, clearable | TC-024, TC-025, TC-026, TC-027, TC-028 | |
| REQ-011 | Card shows cover, name, publisher, category, price, rating | TC-023 | |
| REQ-012 | Detail shows name, publisher, category, version, IDR price, description, images, supported OS, rating | TC-032, TC-033 | |
| REQ-013 | Unknown/invalid app id shows not-found state | TC-034, TC-035 | |
| REQ-014 | Add to cart from detail page and from catalog card | TC-036, TC-037 | |
| REQ-015 | Cart lists name/price/cover, remove, quantity 1, total | TC-038, TC-039, TC-040 | |
| REQ-016 | Total = sum of current prices, no tax/discount/shipping/fee | TC-041, TC-042 | |
| REQ-017 | Cart is per user and survives logout/login | TC-043, TC-044, TC-068 | |
| REQ-018 | Re-adding an in-cart app keeps one line, quantity 1 | TC-045 | |
| REQ-019 | Owned app cannot be added; blocked with already-owned message | TC-046, TC-047 | |
| REQ-020 | Cart holds at most 20 distinct apps; 21st blocked | TC-048, TC-049 | |
| REQ-021 | Checkout not possible while the cart is empty | TC-050 | |
| REQ-022 | No payment details; simulated payment always succeeds | TC-051 | |
| REQ-023 | Exactly one order, one key per app, cart emptied | TC-052, TC-053 | |
| REQ-024 | Confirmation shows order id, date, total, apps and keys | TC-054 | |
| REQ-025 | Checkout re-checks ownership; rejects whole cart, names app, no order/key | TC-055 | |
| REQ-026 | Repeated checkout submission yields at most one order | TC-056 | |
| REQ-027 | Price snapshotted at checkout; later changes do not alter orders | TC-057 | |
| REQ-028 | Orders immutable; no cancellation, refund, or editing | — | Non-goal with no exercisable rejection behavior defined in v1; absence of an action is covered by UI review, not by a behavioral case. |
| REQ-029 | My Library lists owned apps with key, purchase date, order ref | TC-061 | |
| REQ-030 | Orders lists orders with date, total, apps and keys | TC-062 | |
| REQ-031 | Library/orders scoped to the signed-in user; other user's order = not-found | TC-063, TC-064 | |
| REQ-032 | Username 3–50 characters | TC-012, TC-013, TC-014, TC-015, TC-018 | |
| REQ-033 | Password at least 8 characters | TC-016, TC-017, TC-018 | |
| REQ-034 | Price in IDR, >= 0; zero allowed, negative invalid | TC-058, TC-059 | |
| REQ-035 | Never buy an owned app; never twice in library | TC-055, TC-060 | |
| REQ-036 | Cart holds at most 20 distinct apps | TC-048, TC-049 | |
| REQ-037 | No-match search shows empty state with clear-search | TC-029 | |
| REQ-038 | Empty category empty state; unknown category falls back to unfiltered | TC-030, TC-031 | |
| REQ-039 | Empty cart shows empty state and catalog link; checkout unavailable | TC-050 | |
| REQ-040 | No-purchase user sees empty Library and Orders states | TC-065 | |
| REQ-041 | Owned app stays visible everywhere; add disabled with explanation | TC-046, TC-066 | |
| REQ-042 | Price-0 app purchasable through normal checkout with a key | TC-058 | |
| REQ-043 | Expired/invalid session redirects to login; cart preserved | TC-067, TC-068 | |
| REQ-044 | Another user's order id directly returns not-found | TC-064 | |
| REQ-045 | Backend is the `paladin-code` repo, Go + PostgreSQL, new repo | — | Build/dependency fact, not black-box observable behavior; verified by code review, not a test case. |
| REQ-046 | Frontend is the `paladin-ui` repo, React, new repo | — | Build/dependency fact, not black-box observable behavior; verified by code review, not a test case. |
| REQ-047 | Seeded accounts and a complete seeded catalog across five categories | TC-070 | |
| REQ-048 | PostgreSQL persists accounts, catalog, carts, orders, license keys | TC-044, TC-057 | Persistence is exercised indirectly (cart survives logout/login; orders outlive the session). The storage technology itself is not black-box observable. |
| REQ-049 | Do not use nexcommon or nexcomponent-ui | — | Implementation constraint with no runtime observable; verified by code review, not a test case. |
| REQ-050 | No external integrations or other Paladin services | — | Architectural constraint; not observable from the storefront UI or API without inspecting network/dependencies, which is code review's job. |
| REQ-051 | Priority P1; whole v1 journey in this pass | — | Planning attribute, not a behavior; covered in substance by TC-069. |
| REQ-052 | Deferred items beyond v1 | — | Roadmap statement, not a behavior; non-goals reviewed below. |
| REQ-053 | End-to-end: login → browse → detail → cart → checkout → library | TC-069 | |
| REQ-054 | Username, password, price, ownership and cart-size rules surface visible errors | TC-006, TC-046, TC-049, TC-055, TC-012, TC-015, TC-016 | |
| REQ-055 | No duplicate app in library or cart; cannot check out an owned app | TC-045, TC-055, TC-060 | |
| REQ-056 | One user never sees another user's cart, library, or orders | TC-043, TC-063 | |

## Test cases

### TC-001 — Login page exposes username and password fields
- **Type:** positive
- **Spec:** REQ-001
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** No active session; seeded account `buyer_a` exists.
- **Action / input:** Open the store root URL.
- **Expected result:** The login page renders a username field, a password field, and a submit control. No store page (catalog, detail, cart, checkout, library, orders) is reachable without submitting credentials.

### TC-002 — Valid credentials create a session and land on the catalog
- **Type:** positive
- **Spec:** REQ-002
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** No active session; account `buyer_a` / `Passw0rd!a`.
- **Action / input:** Open the login page, enter `buyer_a` / `Passw0rd!a`, submit.
- **Expected result:** An authenticated session is created and the user lands on the catalog/home page (no prior destination was requested).

### TC-003 — Deep link to a store page returns there after login
- **Type:** positive
- **Spec:** REQ-002, REQ-004
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** No active session; catalog app `APP-A` exists; account `buyer_a`.
- **Action / input:** Open the `APP-A` detail URL while unauthenticated, log in as `buyer_a`.
- **Expected result:** The visitor is first redirected to the login page, then after successful login is returned to the `APP-A` detail page (not the catalog).

### TC-004 — Wrong password shows a generic error and stays on login
- **Type:** negative
- **Spec:** REQ-003
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** No active session; account `buyer_a` exists.
- **Action / input:** Enter `buyer_a` with a wrong password (e.g. `WrongPass1`), submit.
- **Expected result:** One generic error message reading "invalid username or password" (or the exact approved copy) is shown, the user remains on the login page, and no session is created.

### TC-005 — Unknown username shows the same generic error (no enumeration)
- **Type:** negative
- **Spec:** REQ-003
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** No active session; username `no_such_user` does not exist.
- **Action / input:** Enter `no_such_user` with any password, submit.
- **Expected result:** The error text and shape are indistinguishable from TC-004 ("invalid username or password"); the response does not reveal whether the username exists, and no session is created.

### TC-006 — Empty credentials show a visible error and create no session
- **Type:** boundary
- **Spec:** REQ-003, REQ-054
- **Level:** UI
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** No active session.
- **Action / input:** Submit the login form with the username empty; repeat with the password empty; repeat with both empty.
- **Expected result:** Each submission shows a visible validation/generic error; the user stays on the login page; no session is created.

### TC-007 — Every protected page redirects an unauthenticated visitor to login
- **Type:** negative
- **Spec:** REQ-004
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** No active session; `APP-A` and one existing order id exist for `buyer_a`.
- **Action / input:** Open each store URL directly: catalog/home, app detail, cart, checkout, library/orders list, and an order detail URL.
- **Expected result:** Each request is redirected to the login page; no protected content is rendered or returned while unauthenticated.

### TC-008 — Logout ends the session and returns to login
- **Type:** positive
- **Spec:** REQ-005
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`.
- **Action / input:** Trigger logout from the catalog page, then from an app detail page (the action must be reachable from each authenticated page).
- **Expected result:** The session ends and the user lands on the login page. A subsequent request to the previous page redirects to login.

### TC-009 — Browser back after logout does not restore an authenticated view
- **Type:** negative
- **Spec:** REQ-005
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; the catalog has been visited.
- **Action / input:** Log out, then press browser Back.
- **Expected result:** No authenticated store view is restored; the app redirects to the login page and no user-specific data is shown from browser history/cache.

### TC-010 — Session is still valid just before 24 hours
- **Type:** boundary
- **Spec:** REQ-006
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; test clock advances the session age to 23 h 59 m.
- **Action / input:** Request a protected page (e.g. My Library).
- **Expected result:** The request is treated as authenticated and the page renders; no redirect to login.

### TC-011 — Session expires at 24 hours and the next request is unauthenticated
- **Type:** boundary
- **Spec:** REQ-006
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; test clock advances the session age to 24 h 00 m (and separately 24 h 01 m).
- **Action / input:** Request a protected page.
- **Expected result:** The request is treated as unauthenticated and redirects to the login page, per REQ-006 and REQ-004.

### TC-012 — Username shorter than 3 characters is rejected
- **Type:** boundary
- **Spec:** REQ-032, REQ-054
- **Level:** UI
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** No active session; the test data does not contain a 2-character account.
- **Action / input:** Enter a 2-character username (e.g. `ab`) with a valid-length password, submit.
- **Expected result:** A visible error is shown (username must be 3–50 characters, or the generic invalid-credentials error), and no session is created.

### TC-013 — Username of exactly 3 characters is accepted
- **Type:** boundary
- **Spec:** REQ-032
- **Level:** UI
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Seeded account `abc` / `Passw0rd!x`.
- **Action / input:** Log in as `abc` / `Passw0rd!x`.
- **Expected result:** Login succeeds and the user reaches the catalog; the minimum valid username length is accepted.

### TC-014 — Username of exactly 50 characters is accepted
- **Type:** boundary
- **Spec:** REQ-032
- **Level:** UI
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Seeded account whose username is exactly 50 characters, password `Passw0rd!y`.
- **Action / input:** Log in with the 50-character username and its password.
- **Expected result:** Login succeeds and the user reaches the catalog; the maximum valid username length is accepted.

### TC-015 — Username longer than 50 characters is rejected
- **Type:** boundary
- **Spec:** REQ-032, REQ-054
- **Level:** UI
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** No active session; no account has a 51-character username.
- **Action / input:** Enter a 51-character username with a valid-length password, submit.
- **Expected result:** A visible error is shown (username must be 3–50 characters, or the generic invalid-credentials error), and no session is created.

### TC-016 — Password shorter than 8 characters is rejected
- **Type:** boundary
- **Spec:** REQ-033, REQ-054
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Account `buyer_a` exists; no seeded account has a 7-character password.
- **Action / input:** Enter `buyer_a` with a 7-character password (e.g. `Pass123`), submit.
- **Expected result:** A visible error is shown (password must be at least 8 characters, or the generic invalid-credentials error), and no session is created.

### TC-017 — Password of exactly 8 characters is accepted
- **Type:** boundary
- **Spec:** REQ-033
- **Level:** UI
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Seeded account whose password is exactly 8 characters.
- **Action / input:** Log in with that account and its 8-character password.
- **Expected result:** Login succeeds and the user reaches the catalog; the minimum valid password length is accepted.

### TC-018 — Seed loading rejects accounts that violate the credential rules
- **Type:** negative
- **Spec:** REQ-032, REQ-033
- **Level:** API
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** A seed fixture containing one account with a 2-character username, one with a 51-character username, and one with a 7-character password.
- **Action / input:** Load the seed fixture through the service's normal seed/import path.
- **Expected result:** Each invalid account is rejected with a validation error; no account row is created for it; the valid accounts in the same fixture load normally. The service does not start with silently accepted invalid credentials.

### TC-019 — Home page contains all four sections
- **Type:** positive
- **Spec:** REQ-007
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; seeded catalog present.
- **Action / input:** Open the catalog/home page.
- **Expected result:** The page contains a hero section, a featured-apps section, a browse-all-apps-by-category section, and a search-by-name control/area.

### TC-020 — Featured apps match the seed subset and order
- **Type:** positive
- **Spec:** REQ-008
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Seed marks `APP-A`, `APP-C`, `APP-D` as featured, in that order.
- **Action / input:** Open the home page while logged in.
- **Expected result:** The featured section shows exactly `APP-A`, `APP-C`, `APP-D` in that order — no non-featured app appears there.

### TC-021 — Featured section is capped at six apps
- **Type:** boundary
- **Spec:** REQ-008
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** A seed fixture marks seven apps as featured in a defined order.
- **Action / input:** Open the home page.
- **Expected result:** At most six featured apps are rendered, preserving the seed-defined order for those six; the seventh is not featured in the section.

### TC-022 — Each seeded category filters the browse listing
- **Type:** positive
- **Spec:** REQ-009
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; catalog contains apps in all five categories.
- **Action / input:** For each category — productivity, design, developer tools, security, games — select it in the browse-by-category section.
- **Expected result:** Every time, the listing shows only apps of the selected category, and all apps of that category in the seed are present.

### TC-023 — Catalog card shows all required fields
- **Type:** positive
- **Spec:** REQ-011
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in; `APP-A` exists with complete data.
- **Action / input:** Locate the `APP-A` card in the catalog.
- **Expected result:** The card shows the cover image, app name, publisher, category, price (in IDR), and rating.

### TC-024 — Exact-case name search returns matching apps
- **Type:** positive
- **Spec:** REQ-010
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in; catalog contains an app whose name begins with "Pixel".
- **Action / input:** Enter `Pixel` in the search field.
- **Expected result:** The listing shows the apps whose names contain "Pixel"; apps without that substring are excluded.

### TC-025 — Search is case-insensitive
- **Type:** positive
- **Spec:** REQ-010
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Same as TC-024.
- **Action / input:** Search `pixel`, then `PIXEL`, then `PiXeL`.
- **Expected result:** All three searches return the same matching set as the exact-case search in TC-024.

### TC-026 — Search matches substrings, not only prefixes
- **Type:** positive
- **Spec:** REQ-010
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in; an app named e.g. "Super Pixel Studio" exists.
- **Action / input:** Search `Pixel` (a middle substring) and `Studio` (a trailing substring).
- **Expected result:** Both searches return the app; matching is substring-based, not prefix-only.

### TC-027 — Search combines with the active category filter
- **Type:** positive
- **Spec:** REQ-010
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in; "Pixel" apps exist in both productivity and design; `APP-A` (productivity) matches "Pixel".
- **Action / input:** Select the productivity category, then enter `Pixel` in search.
- **Expected result:** The listing shows only apps that are both in productivity and match "Pixel"; the design "Pixel" app is excluded.

### TC-028 — Clearing search restores the current category listing
- **Type:** positive
- **Spec:** REQ-010
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in; productivity category selected; a search term is active.
- **Action / input:** Clear the search field.
- **Expected result:** The listing returns to the full productivity category listing (the filter stays selected); it does not jump to the unfiltered catalog or an empty state.

### TC-029 — Search with no matches shows an empty state with a clear action
- **Type:** negative
- **Spec:** REQ-037
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in; no app name contains `zzzznotreal`.
- **Action / input:** Search `zzzznotreal`.
- **Expected result:** An explicit empty-state message is shown with a way to clear the search; the page is not blank, shows no stale results, and shows no server error. Using the clear action restores the prior listing (TC-028).

### TC-030 — Category with no apps shows an empty state
- **Type:** boundary
- **Spec:** REQ-038
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Test fixture includes category `utility` with zero apps.
- **Action / input:** Select the `utility` category.
- **Expected result:** An explicit empty-state message is shown for the category; no error page, no blank page, and no apps from other categories.

### TC-031 — Unknown category in the URL falls back to the unfiltered catalog
- **Type:** negative
- **Spec:** REQ-038
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in; catalog has apps.
- **Action / input:** Open the catalog URL with an unknown category value (e.g. `?category=does-not-exist`).
- **Expected result:** The unfiltered catalog is shown (same set as the no-filter view); no error page and no empty state.

### TC-032 — App detail page shows all required fields
- **Type:** positive
- **Spec:** REQ-012
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in; `APP-A` has complete seed data including multiple screenshots.
- **Action / input:** Open the `APP-A` detail page.
- **Expected result:** The page shows app name, publisher, category, version, price in IDR, description, cover image, screenshots, system requirements (supported OS), and rating.

### TC-033 — Price is displayed in IDR
- **Type:** positive
- **Spec:** REQ-012
- **Level:** UI
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in; `APP-A` price 150000.
- **Action / input:** Open the `APP-A` detail page and the `APP-A` catalog card.
- **Expected result:** The price is presented as an IDR amount (e.g. `Rp150.000` / `IDR 150,000`); no other currency symbol or code is shown.

### TC-034 — Unknown numeric app id shows the not-found state
- **Type:** negative
- **Spec:** REQ-013
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in; no app with id `99999999` exists.
- **Action / input:** Open the app detail URL for `99999999`.
- **Expected result:** A not-found state is shown (clear "not found" message with a way back to the catalog); not an empty detail page, not a generic server error.

### TC-035 — Malformed app id shows the not-found state
- **Type:** negative
- **Spec:** REQ-013
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in.
- **Action / input:** Open the app detail URL with a non-numeric id (e.g. `abc`), then with an empty id segment.
- **Expected result:** Both requests show the not-found state; no server error page and no partial detail layout.

### TC-036 — Add to cart from the detail page
- **Type:** positive
- **Spec:** REQ-014
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; cart empty; `APP-A` not owned by `buyer_a`.
- **Action / input:** Open `APP-A` detail and use its add-to-cart action.
- **Expected result:** `APP-A` is added to the cart as a single quantity-1 line; a confirmation (e.g. cart count/update) is visible.

### TC-037 — Add to cart from a catalog card
- **Type:** positive
- **Spec:** REQ-014
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; cart empty; `APP-C` not owned.
- **Action / input:** Use the add-to-cart action on the `APP-C` catalog card without opening the detail page.
- **Expected result:** `APP-C` is added to the cart as a single quantity-1 line.

### TC-038 — Cart lists each app with its fields and a total
- **Type:** positive
- **Spec:** REQ-015
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Cart contains `APP-A` and `APP-C`.
- **Action / input:** Open the cart page.
- **Expected result:** Each app appears once with its name, price, and cover image; each line shows quantity 1; a cart total is visible.

### TC-039 — Removing an app removes only that line and updates the total
- **Type:** positive
- **Spec:** REQ-015
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Cart contains `APP-A` (150000) and `APP-C` (250000); total 400000.
- **Action / input:** Remove `APP-A`.
- **Expected result:** Only `APP-A` disappears; `APP-C` remains; the total updates to 250000; the empty state is not shown.

### TC-040 — Quantity is fixed at 1 and no quantity control is offered
- **Type:** positive
- **Spec:** REQ-015
- **Level:** UI
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Cart contains `APP-A`.
- **Action / input:** Inspect the cart line for quantity controls and try to increase quantity.
- **Expected result:** The line shows quantity 1 and offers no quantity increment/decrement control; multi-quantity is not available.

### TC-041 — Cart total equals the sum of current prices
- **Type:** positive
- **Spec:** REQ-016
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Cart contains `APP-A` 150000, `APP-C` 250000, `APP-E` 75000.
- **Action / input:** Open the cart.
- **Expected result:** The displayed total is exactly 475000 IDR — the arithmetic sum of the three current prices, with no rounding drift.

### TC-042 — Cart total adds no tax, discount, shipping, or fee
- **Type:** positive
- **Spec:** REQ-016
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Cart as in TC-041.
- **Action / input:** Inspect the cart summary lines.
- **Expected result:** The only amount shown is the item sum (475000 IDR); there is no tax, discount, shipping, or other fee line, and the total equals the sum.

### TC-043 — Two users have independent carts
- **Type:** negative
- **Spec:** REQ-017, REQ-056
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** `buyer_a` cart contains `APP-A`; `buyer_b` cart is empty.
- **Action / input:** Log in as `buyer_b` and open the cart; then log in as `buyer_a` and open the cart.
- **Expected result:** `buyer_b` sees an empty cart (not `APP-A`); `buyer_a` still sees only `APP-A`. Neither user's cart leaks into the other.

### TC-044 — Cart survives logout and login within the session lifetime
- **Type:** positive
- **Spec:** REQ-017, REQ-048
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; cart contains `APP-A`.
- **Action / input:** Log out, log back in as `buyer_a`, open the cart.
- **Expected result:** The cart still contains `APP-A` with the same quantity and price; the cart was not cleared by logout (it survives within the session lifetime).

### TC-045 — Re-adding an in-cart app keeps one line
- **Type:** boundary
- **Spec:** REQ-018, REQ-055
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; `APP-A` is in the cart.
- **Action / input:** Add `APP-A` again from the detail page, then again from its catalog card.
- **Expected result:** The cart still shows exactly one `APP-A` line with quantity 1; no second line is created and the total does not increase.

### TC-046 — Adding an owned app from the detail page is blocked
- **Type:** negative
- **Spec:** REQ-019, REQ-041, REQ-054
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; `APP-E` is already in `buyer_a`'s library and is not in the cart.
- **Action / input:** Open `APP-E` detail and attempt add-to-cart.
- **Expected result:** The action is blocked with a visible message stating the app is already owned; `APP-E` does not appear in the cart; no error page is shown.

### TC-047 — Adding an owned app from a catalog card is blocked
- **Type:** negative
- **Spec:** REQ-019
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; `APP-E` is owned and not in the cart.
- **Action / input:** Use the add-to-cart action on the `APP-E` catalog card.
- **Expected result:** The action is blocked with the already-owned message; the cart is unchanged.

### TC-048 — The 20th distinct app can be added
- **Type:** boundary
- **Spec:** REQ-020, REQ-036
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; cart contains 19 distinct apps (none owned).
- **Action / input:** Add a 20th distinct app.
- **Expected result:** The add succeeds; the cart contains 20 distinct lines with quantity 1 each.

### TC-049 — The 21st distinct app is blocked with a clear message
- **Type:** boundary
- **Spec:** REQ-020, REQ-036, REQ-054
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; cart contains 20 distinct apps.
- **Action / input:** Attempt to add a 21st distinct app from the detail page and from a catalog card.
- **Expected result:** Both attempts are blocked with a visible cart-limit message (e.g. "cart can hold at most 20 apps"); the cart still contains exactly the same 20 lines.

### TC-050 — Empty cart shows an empty state and offers no checkout
- **Type:** positive
- **Spec:** REQ-021, REQ-039
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; cart empty.
- **Action / input:** Open the cart page; also attempt to open the checkout URL directly.
- **Expected result:** The cart shows an explicit empty state with a link back to the catalog; no checkout action is available from the empty cart, and a direct checkout attempt does not start an order.

### TC-051 — Checkout collects no payment details and succeeds for a valid cart
- **Type:** positive
- **Spec:** REQ-022
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; cart contains `APP-A` and `APP-C`; neither owned.
- **Action / input:** Open the cart and start checkout; inspect the checkout step for payment fields; confirm.
- **Expected result:** The checkout step asks for no card number, CVV, expiry, or payment-provider details; the simulated payment succeeds and the flow proceeds to an order confirmation.

### TC-052 — Successful checkout creates exactly one order and empties the cart
- **Type:** positive
- **Spec:** REQ-023
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; cart contains `APP-A` and `APP-C`; `buyer_a` has `N` existing orders.
- **Action / input:** Complete checkout once.
- **Expected result:** Exactly one new order is created containing both cart lines; `buyer_a`'s order count becomes `N+1`; the cart is now empty.

### TC-053 — Checkout issues exactly one unique license key per app
- **Type:** positive
- **Spec:** REQ-023
- **Level:** API
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Same as TC-052.
- **Action / input:** Complete checkout and inspect the created order's license keys.
- **Expected result:** The order has exactly one license key for `APP-A` and exactly one for `APP-C` (one per app, not per order and not more than one per app); the two keys are distinct from each other; each key is unique across the user's library.

### TC-054 — Order confirmation shows id, date, total, apps and keys
- **Type:** positive
- **Spec:** REQ-024
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Checkout completed for `APP-A` (150000) and `APP-C` (250000) as `buyer_a`.
- **Action / input:** View the order confirmation after checkout.
- **Expected result:** The confirmation shows the order id, the order date, the total (400000 IDR), and each purchased app with its license key.

### TC-055 — Checkout rejects the whole cart when an app is already owned
- **Type:** negative
- **Spec:** REQ-025, REQ-035, REQ-055, REQ-054
- **Level:** API
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Test fixture: `buyer_a`'s cart contains `APP-A` and `APP-E`, while `buyer_a`'s library already contains `APP-E` (prepared directly in the datastore, simulating an ownership state that appeared after the cart was built). `buyer_a` has `N` orders; cart total 225000.
- **Action / input:** Submit checkout for this cart.
- **Expected result:** The whole checkout is rejected with a visible error that names `APP-E` as already owned; no order is created (`N` unchanged); no license key is created for `APP-A` or `APP-E`; the cart is not silently emptied.

### TC-056 — Repeated checkout submission creates at most one order
- **Type:** boundary
- **Spec:** REQ-026
- **Level:** API
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; cart contains `APP-A`; `buyer_a` has `N` orders.
- **Action / input:** Submit checkout twice: once by double-clicking the confirm action, and once as two concurrent duplicate requests for the same cart.
- **Expected result:** Exactly one order is created (`N+1`), and exactly one license key exists for `APP-A`. The duplicate submission does not create a second order or a second key; it either shows the same confirmation or a benign "already processed" response.

### TC-057 — Order price is snapshotted at checkout
- **Type:** boundary
- **Spec:** REQ-027, REQ-048
- **Level:** API
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; cart contains `APP-A` at 150000; complete checkout.
- **Action / input:** Change `APP-A`'s catalog price to 200000 in the test data, then reopen the order (confirmation, Orders list, and My Library).
- **Expected result:** The existing order still shows 150000 as the recorded price and total; only new checkouts would use 200000. The order is unchanged by the catalog update.

### TC-058 — A price-0 app is purchasable and gets a license key
- **Type:** boundary
- **Spec:** REQ-034, REQ-042
- **Level:** end-to-end
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; `APP-B` has price 0 and is not owned; cart contains `APP-B` and `APP-A` (150000).
- **Action / input:** Complete checkout.
- **Expected result:** Checkout succeeds; the order total is 150000; `APP-B` appears in the order with its own license key; `APP-B` appears in My Library with that key. Zero price does not block the purchase.

### TC-059 — A negative price is rejected by data validation
- **Type:** negative
- **Spec:** REQ-034
- **Level:** API
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** A seed/import fixture containing an app with price `-1` IDR.
- **Action / input:** Load the fixture through the service's normal seed/import path.
- **Expected result:** The negative-price app is rejected with a visible validation error and never becomes part of the catalog; it cannot be viewed, added to a cart, or purchased. Price 0 remains accepted (TC-058).

### TC-060 — An app never appears twice in the library
- **Type:** negative
- **Spec:** REQ-035
- **Level:** API
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** `buyer_a` owns `APP-E`; cart contains `APP-E` (state prepared directly in the datastore).
- **Action / input:** Attempt checkout; then re-check `buyer_a`'s library.
- **Expected result:** The checkout is rejected (TC-055) and `buyer_a`'s library still contains exactly one `APP-E` entry with one license key. No duplicate library row or extra key is created.

### TC-061 — My Library lists owned apps with key, date, and order reference
- **Type:** positive
- **Spec:** REQ-029
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** `buyer_a` has one completed order containing `APP-A` and `APP-C`.
- **Action / input:** Open My Library.
- **Expected result:** Each owned app is listed once with its license key, purchase date, and the order reference it came from; `APP-A` and `APP-C` both appear (plus any previously owned `APP-E`).

### TC-062 — Orders lists each order with date, total, apps, and keys
- **Type:** positive
- **Spec:** REQ-030
- **Level:** UI
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** `buyer_a` has a completed order with `APP-A` and `APP-C` (total 400000).
- **Action / input:** Open Orders.
- **Expected result:** The order appears with its date, total 400000 IDR, and both apps with their license keys.

### TC-063 — Library and orders contain only the signed-in user's data
- **Type:** negative
- **Spec:** REQ-031, REQ-056
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** `buyer_a` owns `APP-E` with an order; `buyer_b` owns nothing.
- **Action / input:** Log in as `buyer_b`; open My Library and Orders.
- **Expected result:** `buyer_b` sees empty Library and Orders states; none of `buyer_a`'s apps, keys, order ids, or totals appear.

### TC-064 — Opening another user's order id returns not-found
- **Type:** negative
- **Spec:** REQ-031, REQ-044
- **Level:** API
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Order `ORD-A` belongs to `buyer_a`; logged in as `buyer_b`.
- **Action / input:** Request/open the order URL or order id for `ORD-A` while authenticated as `buyer_b`.
- **Expected result:** A not-found response/state is returned (not the order, not a permission-denied page that leaks its contents); no field of `ORD-A` is exposed.

### TC-065 — A user with no purchases sees empty Library and Orders states
- **Type:** positive
- **Spec:** REQ-040
- **Level:** UI
- **Priority:** P2
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `newbie`, who has no purchases.
- **Action / input:** Open My Library and Orders.
- **Expected result:** My Library shows an explicit empty state, and Orders shows an explicit empty state; neither page is blank and neither shows an error.

### TC-066 — An owned app stays visible with add-to-cart disabled and explained
- **Type:** positive
- **Spec:** REQ-041, REQ-019
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a`; `APP-E` is owned.
- **Action / input:** Find `APP-E` in the catalog, in a name search for its name, and on its detail page.
- **Expected result:** `APP-E` is not hidden from catalog, search, or detail; its add-to-cart action is disabled/blocked and explains that the app is already owned.

### TC-067 — An expired or invalid session redirects to login
- **Type:** negative
- **Spec:** REQ-043
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Logged in as `buyer_a` with `APP-A` in the cart; the session is then expired/invalidated before the next action.
- **Action / input:** Trigger a store action (e.g. add `APP-C` to the cart or open My Library) with the invalid session.
- **Expected result:** The request is treated as unauthenticated and redirects to the login page; no action is silently applied and no user-specific data is rendered.

### TC-068 — Cart is preserved after re-login following session expiry
- **Type:** positive
- **Spec:** REQ-043, REQ-017
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** As TC-067: `buyer_a` had `APP-A` in the cart before the session expired.
- **Action / input:** After the redirect to login, log back in as `buyer_a` and open the cart.
- **Expected result:** The cart still contains `APP-A`; the pre-expiry cart is preserved because it is stored per user, not in the expired session.

### TC-069 — End-to-end purchase journey
- **Type:** positive
- **Spec:** REQ-053
- **Level:** end-to-end
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** New seeded buyer `newbie` with no purchases; seeded catalog with featured apps, five categories, and searchable names.
- **Action / input:** Log in as `newbie` → browse the home (hero, featured, category, search) → open an app detail → add two apps to the cart → checkout (simulated payment) → open the confirmation → open My Library.
- **Expected result:** The full journey completes without leaving the store: the catalog shows the four sections, the detail page shows the app, the cart holds both apps with the correct total, checkout creates one order with one key per app, the confirmation shows id/date/total/keys, and My Library lists both apps with their keys and order reference.

### TC-070 — Seeded data is complete across accounts and the five categories
- **Type:** positive
- **Spec:** REQ-047
- **Level:** API
- **Priority:** P1
- **Automation candidate:** yes
- **Preconditions / test data:** Fresh environment with the v1 seed loaded.
- **Action / input:** Inspect the seeded catalog and accounts through the storefront's read paths.
- **Expected result:** Seeded buyer accounts exist and can log in; the five categories (productivity, design, developer tools, security, games) exist; every catalog app exposes name, publisher, category, version, description, cover image, screenshots, supported OS, price (IDR, >= 0), and rating; at least one app is flagged featured. No app is missing a field the UI is required to show.

## Non-goals review

Each stated non-goal was checked for a real, exercisable rejection rule. Only
the rows marked "behavioral case" get a test; the rest have no behavior to
exercise in v1 and are left as deliberate omissions.

| Non-goal | Exercisable behavior? | Disposition |
|---|---|---|
| No admin/back-office UI or catalog management | No — there is no admin surface to attempt | No case; absence verified by UI review |
| No self sign-up, account creation, password reset, profile editing | No rejection rule is defined; the pages simply do not exist | No case; absence verified by UI review |
| No real payment gateway, card details, payment provider | Yes — checkout must collect no payment details | Covered by TC-051 |
| No refunds, cancellations, or order editing | No — nothing in the spec defines how an attempt is rejected | No case; deliberate omission (see the orders-immutable coverage row) |
| No user-submitted ratings or reviews | No — ratings are display-only and no submission control exists | No case; absence verified by UI review |
| No multi-quantity, wishlists, coupons, recommendations, emails | Yes for multi-quantity — quantity must stay 1 | Covered by TC-040, TC-045; the rest have no behavior to exercise |
| No currencies other than IDR and no tax | Yes — total is IDR, tax-free | Covered by TC-033, TC-042 |
| No mobile app; React web frontend only | No — not a behavioral case | No case |

## Open questions for /document-preparation

None. Every expected result above follows from spec.md v1 and its stated
default assumptions.

## Revision history

- v1 (2026-11-11): initial test design against spec.md v1.

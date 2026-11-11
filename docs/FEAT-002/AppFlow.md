---
feature_code: FEAT-002
service: paladin
spec_version: 1
last_updated: 2026-11-11
---

# FEAT-002 — App Flow

<!-- BEGIN:DOCPREP -->
## Overview

A signed-in Paladin buyer can save an app from a catalog card or its product
page, review all saved apps on a dedicated wishlist page, remove entries, and
move an entry to the existing cart. The wishlist is private to the buyer,
stored per account, survives logout/login and other devices, and is cleaned
up when an app is purchased. See [spec.md](spec.md) for the full requirement
detail.

## Key User Journeys

- **Save an app from the catalog (REQ-001, REQ-002, REQ-003, REQ-005, REQ-007):** A logged-in buyer browsing the catalog uses the wishlist control on a card → the control shows the app as saved and the buyer sees confirmation → saving the same app again leaves exactly one entry.
- **Save an app from its product page (REQ-001, REQ-002, REQ-005, REQ-007):** The buyer opens an app detail page → saves the app there → it appears on the same wishlist as saves made from the catalog, with one entry for that app.
- **Review the wishlist (REQ-008, REQ-009, REQ-010, REQ-012):** The buyer opens Wishlist from the main navigation → sees every saved app newest-first, each with cover, name, publisher, current IDR price and rating.
- **Remove an entry (REQ-007, REQ-011):** The buyer removes an app from the wishlist page (or toggles it off in the catalog/product page) → the entry disappears and stays gone after a reload or a later login.
- **Move an entry to the cart (REQ-013, REQ-014):** The buyer chooses "move to cart" for a saved app → the app is added to the cart and removed from the wishlist; if it was already in the cart, it is still removed from the wishlist and no duplicate cart line appears.
- **Blocked move — cart full (REQ-015):** With 20 distinct apps already in the cart, the buyer tries to move another → the move is refused with a clear message and the item stays on the wishlist.
- **Blocked move — already owned (REQ-016, REQ-030):** The buyer tries to move an app they already own → the move is refused with an "already in your library" message and the item stays on the wishlist.
- **Save an owned app (REQ-006, REQ-030):** The buyer saves an app they already own → it is accepted and shown on the wishlist, but cannot be moved to the cart.
- **App in both cart and wishlist (REQ-029):** The buyer saves an app that is also in the cart → the two lists stay independent; moving the entry simply removes it from the wishlist because it is already in the cart.
- **Return after logout or on another device (REQ-017, REQ-019):** The buyer logs out, logs back in, or signs in from another browser/device with the same account → the same wishlist is present.
- **Purchase cleanup (REQ-020):** The buyer checks out successfully with an app that was on the wishlist → after checkout the purchased app is no longer on the wishlist.
- **Price change (REQ-021, REQ-032):** The catalog price of a saved app changes → the next wishlist load shows the new current price; no old price is kept.
- **Empty wishlist (REQ-027):** A buyer with no saved apps opens Wishlist → sees an empty state explaining the list and a way back to the catalog, not a blank page.
- **Wishlist load failure (REQ-028):** The wishlist cannot be loaded → the buyer sees a human-readable error with a retry action.
- **Expired session (REQ-031):** The session expires during a wishlist action → the buyer is redirected to login; after logging back in the wishlist is unchanged and intact.
- **Unknown app (REQ-033):** A save or move request names an app that does not exist → the request is rejected as not-found and neither the wishlist nor the cart changes.
- **Private list (REQ-018, REQ-034):** One buyer attempts to reach another buyer's wishlist data directly → the result is not-found and never the other buyer's entries.

## Main Pages / Actions

- **Catalog / Home** — the existing catalog cards gain a save control (REQ-001).
- **App Detail** — the existing product page gains the same save control (REQ-001).
- **Wishlist** — the new page listing saved apps newest-first, with remove and move-to-cart actions (REQ-008, REQ-011, REQ-013).
- **Cart** — unchanged; it receives an app when the buyer moves a wishlist entry (REQ-013).
- **Checkout** — unchanged; a successful checkout removes purchased apps from the wishlist (REQ-020).
- **Navigation** — a Wishlist destination alongside Catalog, My Library and Orders (REQ-012).
<!-- END:DOCPREP -->

<!-- BEGIN:CODEPREP -->
## Routes and Components (technical)

This half is the technical companion to the user journeys above. The
screens, states, copy, motion and responsive rules are owned by
`UIMap.md`/`DesignBrief.md`; `architecture.md` owns the API contract.

### Routes

| Route | Screen | API calls |
|---|---|---|
| `/` (`?q=`, `?category=`) | Home / catalog | `GET /api/v1/apps/featured`, `GET /api/v1/categories`, `GET /api/v1/apps?category=&q=` — each app card now carries `is_wishlisted`; saving calls `POST /api/v1/wishlist/items`, unsaving calls `DELETE /api/v1/wishlist/items/{appId}` |
| `/apps/:appId` | App detail | `GET /api/v1/apps/{appId}` (with `is_wishlisted`), `POST /api/v1/cart/items`, `POST /api/v1/wishlist/items`, `DELETE /api/v1/wishlist/items/{appId}` |
| `/wishlist` (new) | Wishlist | `GET /api/v1/wishlist`, `DELETE /api/v1/wishlist/items/{appId}`, `POST /api/v1/wishlist/items/{appId}/move-to-cart` |

Every other route is unchanged from FEAT-001. `/wishlist` sits inside
the existing `RequireAuth` block, so an anonymous hit redirects to
`/login?next=/wishlist`; an expired session uses the same redirect with
`reason=expired`, and the wishlist reloads unchanged after login.

### Component boundaries

- **API layer** — `core/api/services/wishlist.ts` is the only caller of
  the new paths; pages and components never call `fetch`. `AppSummary`
  gains `isWishlisted` via the existing normalizer.
- **Save control** — one `WishlistButton` with two variants: `overlay`
  (44px icon toggle on every catalog card, `aria-pressed`, with its own
  hidden `role="status"` line and error slot) and `block` (full-width
  labelled button in the detail purchase panel, below add-to-cart).
  Optimistic toggle, revert on failure.
- **Wishlist page** — page head with "N apps", one page notice, a list of
  `WishlistRow`s (cover, name, publisher · category, rating, current
  price, owned and in-cart tags, "Move to cart", "Remove"), each row with
  its own `role="alert"` message slot. Loading skeleton, empty state
  with a catalog link, and `LoadError` with retry are the shared states.
- **Navigation** — the Wishlist destination in `MenuDialog` and `Footer`,
  between Catalog and My Library.
- **Styling** — CSS Modules over the existing `tokens.css` and dark
  theme; no new token, no component library, no new dependency.
<!-- END:CODEPREP -->


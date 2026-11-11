---
feature_code: FEAT-002
service: paladin
spec_version: 1
last_updated: 2026-11-11
---

# FEAT-002 — Wishlist (PRD)

## Overview

Paladin buyers can already browse the seeded catalog and buy an app through
the FEAT-001 cart and checkout. This feature adds a private, per-buyer
wishlist: a save-for-later list that lets a buyer keep an app they are
interested in without putting it in the cart, then move it to the cart when
they are ready. See [spec.md](spec.md) for the full requirement detail.

## Product Goal

Let a signed-in buyer save an app from the catalog or its product page, see
all saved apps on one wishlist page, remove them, and move them to the cart —
with the list private to that buyer and preserved across logout/login — so a
buyer no longer loses track of apps they found but were not ready to buy.

## Features

| Feature | Description | Expected behavior |
|---|---|---|
| Save and remove from browsing | A wishlist control on every catalog card and app detail page | A signed-in buyer can save an app from either place; the control shows the saved state and toggles removal; saving twice keeps one entry; saving an absent app or removing an unsaved app is a harmless no-op; both entry points share one per-buyer list; owned apps may be saved; every action gives visible feedback (REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007) |
| Wishlist page | A dedicated page listing the buyer's saved apps | Lists every saved app newest-first with cover, name, publisher, current IDR price and rating; supports removing an entry; reachable from the main navigation (REQ-008, REQ-009, REQ-010, REQ-011, REQ-012) |
| Move to cart | Send a saved app to the existing cart | A successful move adds the app to the cart and removes it from the wishlist; an app already in the cart is still removed from the wishlist with no duplicate cart line; a full cart (20 apps) or an already-owned app blocks the move, keeps the item on the wishlist, and shows a clear message (REQ-013, REQ-014, REQ-015, REQ-016) |
| Persistence, privacy and purchase cleanup | The list belongs to one account | Every wishlist page and action requires login; no buyer can see or change another buyer's list; the list is stored per account and survives logout/login and other devices; a successful checkout removes the purchased apps from the wishlist; display price is always the current catalog price (REQ-017, REQ-018, REQ-019, REQ-020, REQ-021) |
| Data rules | What a wishlist entry may contain | At most one entry per buyer and app; only apps that exist in the catalog; the entry owner always comes from the session, never the client; no separate size cap in v1 because the seeded catalog is 12 apps; no user-entered fields (REQ-022, REQ-023, REQ-024, REQ-025, REQ-026) |
| Edge states | How unusual situations behave | Empty wishlist shows guidance and a way back to the catalog; a load failure shows a retryable message; an app in both the wishlist and the cart stays independent until moved; an owned app stays visible but cannot be moved; an expired session redirects to login and leaves the list intact; a price change appears on the next load; an unknown app id is rejected without changing anything; another buyer's list returns not-found (REQ-027, REQ-028, REQ-029, REQ-030, REQ-031, REQ-032, REQ-033, REQ-034) |
| Scope and priority | What this pass delivers | All wishlist behavior above ships as P1 in this pass; sharing, notifications, multiple lists, guest wishlists, add-all-to-cart, a header badge, admin management and price history are deferred (REQ-042, REQ-043) |

Deferred beyond this feature: sharing a wishlist or public links; price-drop
or back-in-stock notifications; multiple/named wishlists; guest wishlists;
add-all-to-cart; a wishlist count badge; wishlist-specific admin or catalog
management; wishlist price history; import/export. See [spec.md](spec.md)'s
Non-Goals for the full list.

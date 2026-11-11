---
feature_code: FEAT-002
service: paladin
locked_version: 1
last_updated: 2026-11-11
---

# FEAT-002 — Implementation Plan Overview

> Summary only — see `architecture.md`'s `## Implementation Plan` section
> for full detail.

## Overview

Five ordered parts: four backend (contract, data layer, HTTP surface,
checkout cleanup) and one frontend. No timeline or estimate — order of
work only. Everything lands on top of `feat/FEAT-001` in both
repositories, with `feat/FEAT-002` as the integration branch.

## Goals

Add a private, server-backed wishlist to the existing Paladin storefront
— save from card or detail, list newest-first on its own page, remove,
and move to the cart under the existing cart rules — with one new table,
an additive catalog field, and no new dependency in either repository.

## Implementation Plan

| Part | What gets built | Key deliverable |
|---|---|---|
| PART-1 | `api/openapi.yaml` — four wishlist paths, `Wishlist` tag, `Wishlist` / `MoveToCartResponse` schemas, `is_wishlisted` on `AppCard` | The approved contract contains the operations in `architecture.md` before any handler is written (`REQ-040`). |
| PART-2 | Migration `000010_create_wishlist_items`; `WishlistGet`/`WishlistAdd`/`WishlistRemove`/`WishlistMoveToCart`; extract `addCartLine` from `CartAdd` and call it from both | The table applies and round-trips; store methods pass their tests. |
| PART-3 | Four handlers, request parsing and error mapping, `WishlistStore` in `Deps`, router entries, `is_wishlisted` on `appCardSelect`/`appCardDTO` | All four endpoints return the documented shapes and codes. |
| PART-4 | Checkout cleanup — delete purchased apps from `wishlist_items` in the existing transaction | A successful checkout removes only purchased apps; a rejected one removes nothing. |
| PART-5 | Frontend — types/normalizer, `wishlist` service, `WishlistButton` on card and detail panel, `WishlistRow`, `/wishlist` page, navigation links, loading/empty/error/blocked states | The wishlist journey works at desktop and phone widths. |

PART-2 depends on PART-1; PART-3 and PART-4 depend on PART-2 (PART-3
also on the contract); PART-5 depends on PART-3's response shapes.

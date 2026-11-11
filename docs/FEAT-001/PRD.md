---
feature_code: FEAT-001
service: paladin
spec_version: 1
last_updated: 2026-11-11
---

# FEAT-001 — Paladin Storefront v1 (PRD)

## Overview

Paladin is a storefront that sells desktop software licenses (productivity,
design, developer tools, security, games). This first usable version takes a
seeded-account buyer from login, through catalog discovery and a cart, to a
simulated checkout that issues one license key per app, and finally to My
Library. See [spec.md](spec.md) for the full requirement detail.

## Product Goal

Give an end-user buyer a complete self-service purchase loop in v1 — log in,
browse and search the seeded catalog, inspect an app, cart it, check out with
simulated payment, and retrieve the license keys — while keeping
admin/back-office, self sign-up and real payments out of scope.

## Features

| Feature | Description | Expected behavior |
|---|---|---|
| Login and access control | Seeded-account login and logout; every store page is protected | Valid credentials create a session and return the buyer to the requested page (or the catalog); invalid credentials show one generic error; unauthenticated visitors are redirected to login; logout ends the session (REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-032, REQ-033) |
| Catalog and discovery | Hero, featured apps, category browse, name search | The home page shows a hero, up to six seed-curated featured apps, a category filter across the five seeded categories, and case-insensitive name search; empty search/category states are handled (REQ-007, REQ-008, REQ-009, REQ-010, REQ-011, REQ-037, REQ-038) |
| App detail | Full information for one app | Shows name, publisher, category, version, IDR price, description, cover image/screenshots, supported OS and rating; unknown ids show not-found; the app can be added to the cart (REQ-012, REQ-013, REQ-014, REQ-041) |
| Cart | Per-user cart of single-quantity licenses | Lists added apps with price and cover, allows removal, always quantity 1, shows the IDR total, is capped at 20 distinct apps, and blocks apps already owned or an empty checkout (REQ-015, REQ-016, REQ-017, REQ-018, REQ-019, REQ-020, REQ-021, REQ-036, REQ-039) |
| Checkout and order | Simulated payment and order creation | Collects no payment details; a valid cart produces exactly one immutable order, one unique license key per app, a confirmation with order id/date/total/keys, and an emptied cart; ownership is re-validated and double submits are idempotent (REQ-022, REQ-023, REQ-024, REQ-025, REQ-026, REQ-027, REQ-028, REQ-034, REQ-035, REQ-042) |
| My Library and Orders | Buyer's purchased apps and order history | Library lists owned apps with license key, purchase date and order reference; Orders lists past orders with their apps and keys; both are strictly per-user (REQ-029, REQ-030, REQ-031, REQ-040, REQ-044) |
| Per-user isolation | No cross-user visibility | No user can see another user's cart, library or orders, and another user's order id returns not-found (REQ-017, REQ-031, REQ-044, REQ-056) |

Deferred to a later pass: admin/back-office, self sign-up and account
management, real payment integration, refunds/cancellation, user-submitted
reviews, multi-quantity, wishlists, coupons, tax, other currencies, emails.

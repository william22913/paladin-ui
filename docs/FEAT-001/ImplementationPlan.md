---
feature_code: FEAT-001
service: paladin
locked_version: 1
last_updated: 2026-11-11
---

# FEAT-001 — Implementation Plan Overview

> Summary only — see `architecture.md`'s `## Implementation Plan` section
> for full detail.

## Overview

Ten ordered parts: six backend (schema/seed, auth, catalog, cart, checkout
and reads, packaging) and four frontend (shell, catalog/detail, purchase
surfaces, packaging/verification). No timeline or estimate — order of
work only.

## Goals

Ship the Paladin storefront as two new greenfield repositories — a Go
API over PostgreSQL and a React/Vite/TypeScript SPA — that together
complete the seeded-buyer purchase loop and run from one compose stack,
with per-user isolation, idempotent checkout, and a catalog seeded from a
deterministic command.

## Implementation Plan

| Part | What gets built | Key deliverable |
|---|---|---|
| PART-1 | PostgreSQL schema, migration pairs, config and pool wiring, idempotent seed command | `migrate up` creates all nine tables and `cmd/seed` produces the 5 accounts and 12-app catalog. |
| PART-2 | Auth slice — bcrypt verify, session operations, login/logout/me, `requireSession` middleware | Cookie login/logout guards every store route. |
| PART-3 | Catalog reads — categories, featured, list with category + substring search, detail with screenshots/OS and ownership flags | Home and detail data complete. |
| PART-4 | Cart — get/add/delete with owned-app block and the 20-app cap under the per-user lock | All cart rules enforced. |
| PART-5 | Checkout, orders and library — transactional checkout with idempotency and price snapshots; order list/detail and library reads | Purchase loop closes and is per-user scoped. |
| PART-6 | Service packaging and observability — Dockerfile, compose stack, `/healthz`, access log, recovery, graceful shutdown | One local stack boots and logs. |
| PART-7 | Frontend shell — Vite/React/TS scaffold, router, tokens, app shell, menu, API client/services, auth provider, guard, login, not-found | Login/logout and protected routing work. |
| PART-8 | Frontend catalog and detail — hero, featured rail, category tabs, debounced URL-state search, cards, detail gallery and purchase panel | Browse/search/detail complete. |
| PART-9 | Frontend purchase surfaces — cart, checkout, confirmation, library, orders, key copy, empty/error states | The whole buyer journey renders. |
| PART-10 | Frontend packaging and end-to-end verification — nginx image, SPA fallback, `/api` proxy, Playwright desktop/phone smoke, build/lint | The compose stack serves the storefront and the journey passes. |

PART-2 through PART-6 depend on PART-1; PART-7 depends on PART-2's auth
contract; PART-8 and PART-9 depend on PART-7 and their matching backend
parts; PART-10 depends on all of them.

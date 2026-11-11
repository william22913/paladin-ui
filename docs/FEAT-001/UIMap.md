---
feature_code: FEAT-001
service: paladin
version: 1
status: complete
spec_version: 1
figma_files:
  - url: "attached reference: spyker-ref-hero.png (1440x900); no Figma file supplied"
    file_key: "screenshot-spyker-ref-hero"
    last_modified: "2026-11-11"
  - url: "attached reference: spyker-ref-home-scroll.png (1440x900); no Figma file supplied"
    file_key: "screenshot-spyker-ref-home-scroll"
    last_modified: "2026-11-11"
  - url: "attached reference: spyker-ref-model-top.png (1440x900); no Figma file supplied"
    file_key: "screenshot-spyker-ref-model-top"
    last_modified: "2026-11-11"
  - url: "attached reference: spyker-ref-model-scroll.png (1440x900); no Figma file supplied"
    file_key: "screenshot-spyker-ref-model-scroll"
    last_modified: "2026-11-11"
completeness:
  scope_confirmed: covered
  requirement_mapping: covered
  page_inventory: covered
  navigation: covered
  content_and_fields: covered
  states: covered
  interactions: covered
  motion: covered
  responsive: covered
  design_tokens: covered
  components: covered
  assets: covered
open_questions: []
derived_confirmed: 2026-11-11
pr_history: []
pr_url: https://github.com/william22913/sandbox-docs/pull/34
last_updated: 2026-11-11
---

# UI Map — FEAT-001

Paladin is a cinematic, black-canvas storefront for desktop software: a
login wall, a catalog with hero, featured apps, category browse and name
search, an app detail page, a per-user cart, a simulated checkout with order
confirmation, My Library, Orders, and a not-found state. Requirements live in
`spec.md` v1 (REQ-001 to REQ-056); this document records the screens those
requirements imply and the design decisions a frontend developer needs to
build them in plain React.

## Figma sources

**There is no Figma file for this feature.** The design source is the Spyker
Cars site, supplied by the designer as four screenshots at 1440x900, plus the
public reference pages:

- Awards listing: https://www.awwwards.com/sites/spyker-cars
- Live site: https://www.spykercars.com

The designer's instruction is that every Paladin screen is derived from this
style: black canvas, white text, tall condensed uppercase display type, a
full-bleed cinematic hero with a centered headline and a single white CTA, a
minimal top bar (hamburger left, centered wordmark, cart right), generous
spacing, and slow fade and slide scroll reveals. No frame in the reference is
a Paladin screen; no Paladin screen is drawn yet. The reference is the
**pattern**, and every screen below is a screen spec adapted from it.

| Ref | File | URL / source | Role | What it shows |
|---|---|---|---|---|
| REF-01 | `spyker-ref-hero.png` | attached screenshot, 1440x900; no Figma URL | Style and layout reference for **Home hero** | Transparent top bar, centered wordmark, hamburger left, cart right, full-bleed automotive still, centered two-line condensed uppercase headline, tiny eyebrow above it, single white CTA |
| REF-02 | `spyker-ref-home-scroll.png` | attached screenshot, 1440x900 | Style reference for **editorial content bands** | Light editorial band with a small uppercase kicker, a very large condensed headline, a two-column text and image composition, generous whitespace |
| REF-03 | `spyker-ref-model-top.png` | attached screenshot, 1440x900 | Style reference for **App detail hero** | Black page frame, a full-bleed cinematic still inset with black margins, centered display headline over the image, a small location eyebrow, a scroll hint |
| REF-04 | `spyker-ref-model-scroll.png` | attached screenshot, 1440x900 | Style reference for **long-form detail sections** | Full-bleed image band, centered display type seen mid-scroll, black margins |

Screenshots are style references only. Their photography is third-party
copyright and must not be reused in Paladin; the hero, covers and screenshots
come from Paladin's own catalog records and assets (see `## Assets`).

Provenance words used in every table below:

- `figma` - read directly from the attached reference screenshots (layout
  devices, type treatment, color, spacing that the screenshots actually
  show). No live Figma API call was made; no file key exists.
- `designer` - stated by the designer in the task brief (black canvas, white
  text, condensed uppercase display, Oswald or Bebas Neue with Inter, full-
  bleed hero, single white CTA, hamburger left and wordmark centered, cart
  right, slow reveals, plain React with no nexcomponent-ui).
- `derived` - adapted from the reference style to a screen or state the
  reference does not draw, or a default from the design references cited in
  `## Design tokens`, made under the designer's instruction to derive every
  screen and use sensible defaults.
- `assumed` - not used. The designer confirmed every derived screen up front
  on 2026-11-11, so nothing in this map is unbacked. Any later addition gets
  an `assumed` tag and blocks close-out until confirmed.

## Requirement mapping

Every active `REQ-*` in `spec.md` v1 is accounted for below. `Frame link` is
empty for every row because no Paladin frame exists; the attached reference is
recorded in `Follows`, not as a frame that shows the feature.

| REQ | Requirement | Page | Frame name | Frame link | Follows | Source | Notes |
|---|---|---|---|---|---|---|---|
| REQ-001 | Login page with username and password; seeded accounts, no sign-up | Login | not drawn yet | - | REF-01 | designer, derived | Login is designed here from the reference top bar and still |
| REQ-002 | Valid credentials create a session and return the user to the requested page, else the catalog | Login, Navigation | not drawn yet | - | REF-01 | designer, derived | `next` query parameter carries the requested path |
| REQ-003 | Invalid credentials show one generic error and stay on login; no account enumeration | Login | not drawn yet | - | REF-01 | designer, derived | One message for every failed attempt |
| REQ-004 | Every store page requires a session; unauthenticated visitors go to login and return after login | All pages | not drawn yet | - | REF-01 | designer, derived | Route guard, see `## Navigation` |
| REQ-005 | Logout is reachable from every authenticated page; back does not restore an authenticated view | All pages (menu) | not drawn yet | - | REF-01 | designer, derived | Sign out is the last item in the full-screen menu; history replaced on logout |
| REQ-006 | Session lasts 24 hours, then the next request is unauthenticated | All pages | not drawn yet | - | - | designer, derived | Expiry notice on Login; no countdown shown |
| REQ-007 | Home contains hero, featured apps, browse by category, and search by name | Home | not drawn yet | - | REF-01, REF-02 | designer, derived | Four bands, in that order |
| REQ-008 | Featured apps are a curated seed subset in seed order, up to six | Home | not drawn yet | - | REF-01 | designer, derived | Horizontal rail; order comes from the API, never re-sorted in the UI |
| REQ-009 | Browse all apps filtered by category: productivity, design, developer tools, security, games | Home | not drawn yet | - | REF-02 | designer, derived | Category tabs above the catalog grid |
| REQ-010 | Case-insensitive substring name search, combinable with category; clearing restores the category | Home | not drawn yet | - | REF-02 | designer, derived | Search state lives in `?q=` and `?category=` |
| REQ-011 | Catalog card shows cover, name, publisher, category, price, rating | Home | not drawn yet | - | REF-01, REF-02 | designer, derived | 3:4 poster card |
| REQ-012 | Detail shows name, publisher, category, version, IDR price, description, cover and screenshots, supported OS, rating | App detail | not drawn yet | - | REF-03, REF-04 | designer, derived | Cover hero plus two content columns |
| REQ-013 | Unknown or invalid app id shows a not-found state, not an empty page or a server error | App detail, Not found | not drawn yet | - | REF-03 | designer, derived | Shared state page with a way back |
| REQ-014 | An app can be added to the cart from its detail page and from a catalog card | Home, App detail | not drawn yet | - | REF-01 | designer, derived | Add action on the card and in the purchase panel |
| REQ-015 | Cart lists each app with name, price, cover; remove; quantity always 1; shows total | Cart | not drawn yet | - | REF-02 | designer, derived | Line items with a static "1 LICENSE" |
| REQ-016 | Cart total is the sum of current prices in IDR; no tax, discount or fees | Cart | not drawn yet | - | REF-02 | designer, derived | Summary states that no tax or fees are added |
| REQ-017 | Cart belongs to the signed-in user and survives logout and login | Cart | not drawn yet | - | - | designer | No per-user UI difference; the server owns the cart |
| REQ-018 | Re-adding an app in the cart keeps one line at quantity 1 | Home, App detail | not drawn yet | - | REF-01 | designer, derived | Button reads "IN CART" with a link to the cart |
| REQ-019 | An app already in the library cannot be added; blocked with an "already owned" message | Home, App detail | not drawn yet | - | REF-01 | designer, derived | Owned state is known before the click and shown at rest |
| REQ-020 | Cart holds at most 20 distinct apps; adding a 21st is blocked with a clear message | Home, App detail, Cart | not drawn yet | - | REF-01 | designer, derived | Inline message on add; a cap notice in the cart |
| REQ-021 | Checkout is not possible while the cart is empty | Cart, Checkout | not drawn yet | - | REF-02 | designer, derived | No checkout action exists on the empty cart |
| REQ-022 | Checkout collects no payment details; payment is simulated and succeeds when the cart is valid | Checkout | not drawn yet | - | REF-02 | designer, derived | Explicit simulated-payment notice |
| REQ-023 | One order containing all cart lines, one license key per app, cart emptied | Checkout, Order confirmation | not drawn yet | - | REF-02 | designer, derived | |
| REQ-024 | Confirmation shows order id, date, total, each app with its license key | Order confirmation | not drawn yet | - | REF-02 | designer, derived | Success framing of the order view |
| REQ-025 | Checkout re-checks ownership; an owned app rejects the whole checkout and is named; no order or key | Checkout | not drawn yet | - | REF-02 | designer, derived | Error block lists the offending app names |
| REQ-026 | Repeated checkout submits produce at most one order and one key per app | Checkout | not drawn yet | - | - | designer, derived | Button disables on first submit; server idempotency key |
| REQ-027 | The order records the catalog price at checkout; later price changes do not alter it | Order confirmation, My Library, Orders | not drawn yet | - | REF-02 | designer | Display only: the stored order price is shown, never recomputed |
| REQ-028 | Orders are immutable; no cancellation, refund or editing | Orders, Order confirmation | not drawn yet | - | REF-02 | designer, derived | No such controls exist on any order surface |
| REQ-029 | My Library lists owned apps with license key, purchase date, order reference | My Library | not drawn yet | - | REF-02 | designer, derived | Card grid; order reference links to the order |
| REQ-030 | Orders lists the user's orders with date, total, apps and license keys | Orders | not drawn yet | - | REF-02 | designer, derived | Newest first; expandable order blocks |
| REQ-031 | Library and orders are per user; another user's order returns not found | Orders, Not found | not drawn yet | - | REF-03 | designer, derived | The API returns 404 and the UI shows the not-found state |
| REQ-032 | Username is 3 to 50 characters | Login | not drawn yet | - | REF-01 | designer, derived | Inline field error; does not reveal whether an account exists |
| REQ-033 | Password is at least 8 characters | Login | not drawn yet | - | REF-01 | designer, derived | Inline field error |
| REQ-034 | Price is IDR and at least 0; zero is allowed | Home, App detail, Cart, Checkout | not drawn yet | - | REF-01, REF-02 | designer, derived | Display only; 0 renders as "FREE" |
| REQ-035 | A user cannot buy an app they already own; never twice in the library | Home, App detail, Checkout | not drawn yet | - | REF-01 | designer | Covered by the owned state and the checkout re-check |
| REQ-036 | Cart holds at most 20 distinct apps | Cart | not drawn yet | - | REF-02 | designer, derived | Count shown with the cap |
| REQ-037 | A search with no matches shows an empty state with a way to clear the search | Home | not drawn yet | - | REF-02 | designer, derived | Names the term and offers "CLEAR SEARCH" |
| REQ-038 | A category with no apps shows an empty state; an unknown category in the URL falls back to unfiltered | Home | not drawn yet | - | REF-02 | designer, derived | "ALL" is the fallback and the visible default |
| REQ-039 | Empty cart shows an empty state and a link back to the catalog; checkout unavailable | Cart | not drawn yet | - | REF-02 | designer, derived | |
| REQ-040 | A user with no purchases sees empty My Library and Orders states | My Library, Orders | not drawn yet | - | REF-02 | designer, derived | Two distinct empty states |
| REQ-041 | An owned app stays visible in catalog, search and detail; add is disabled and explains why | Home, App detail | not drawn yet | - | REF-01 | designer, derived | "OWNED" tag plus "In your library" |
| REQ-042 | A price-0 app goes through the normal checkout and gets a key like any other app | Home, App detail, Checkout, Order confirmation | not drawn yet | - | REF-01 | designer, derived | "FREE" price label; no separate free flow |
| REQ-043 | An expired or invalid session during any action redirects to login; the cart is preserved | All pages | not drawn yet | - | - | designer, derived | Same guard as REQ-004, with an expiry reason |
| REQ-044 | Opening another user's order id directly returns not found, never the order | Orders, Not found | not drawn yet | - | REF-03 | designer, derived | Deep link renders the shared not-found state |
| REQ-045 | Backend is the `paladin-code` Go repository | - | - | - | - | designer | No UI. See "Requirements without UI" |
| REQ-046 | Frontend is the `paladin-ui` React repository | - | - | - | - | designer | No UI. See "Requirements without UI" |
| REQ-047 | Seeded accounts and catalog; no admin UI in v1 | - | - | - | - | designer | No UI. See "Requirements without UI" |
| REQ-048 | PostgreSQL stores accounts, apps, carts, orders, license keys | - | - | - | - | designer | No UI. See "Requirements without UI" |
| REQ-049 | Do not use nexcommon or nexcomponent-ui | All pages | - | - | - | designer | No UI, but it fixes the Components table: plain React only |
| REQ-050 | No external integrations and no other Paladin services | - | - | - | - | designer | No UI. See "Requirements without UI" |
| REQ-051 | P1: this pass covers the whole v1 journey | All pages | not drawn yet | - | REF-01 | designer | Scope statement, realized by the page set below |
| REQ-052 | Everything in Non-Goals is deferred beyond v1 | - | - | - | - | designer | No UI: the absence of those controls is the requirement |
| REQ-053 | A seeded user completes login, browse, cart, checkout and sees keys in My Library | All pages | not drawn yet | - | REF-01, REF-02 | designer, derived | The end-to-end path is covered by the page set and `## Navigation` |
| REQ-054 | Username, password, price, ownership and cart-size rules surface a visible error | Login, Cart, Checkout | not drawn yet | - | REF-01, REF-02 | designer, derived | Inline field errors and inline notices; never silent |
| REQ-055 | Never two of the same app in the library or cart; no checkout with an owned app | Home, App detail, Cart, Checkout | not drawn yet | - | REF-01 | designer, derived | Owned and in-cart states plus the checkout re-check |
| REQ-056 | One user never sees another user's cart, library or orders | All pages | not drawn yet | - | - | designer | No UI beyond the 404 state; the server scopes every response |

### Requirements without UI

| REQ | Reason |
|---|---|
| REQ-045 | The backend repository choice has no screen. It is recorded here only so the frontend knows what it talks to. |
| REQ-046 | The frontend repository is where this map is built; it is not a screen or a state. |
| REQ-047 | The catalog and accounts are seeded, so there is no admin or catalog-management screen in v1. The frontend must not add one. |
| REQ-048 | Persistence is invisible to the buyer. No screen, no visible state. |
| REQ-049 | A dependency constraint with no visual output; it is reflected in the Components table, where every export is plain React. |
| REQ-050 | No third-party or sibling-service surface exists, so there is no integration screen, consent screen or redirect. |
| REQ-052 | Deferred features (admin, sign-up, real payments, refunds, reviews, email, wishlists, coupons, tax, other currencies) have no UI. Their absence is deliberate: no disabled teasers, no "coming soon" links. |

### Frames without a requirement

| Frame | What it is | Decision |
|---|---|---|
| REF-01 `spyker-ref-hero.png` | The reference home hero (automotive, not Paladin) | Style and layout reference for the Home hero and the top bar. Not a Paladin screen; never linked as a frame that satisfies a requirement. |
| REF-02 `spyker-ref-home-scroll.png` | The reference home editorial band, on a light canvas | Style reference for type scale, kicker treatment and editorial pacing. Its light canvas is deliberately not adopted: the designer fixes a black canvas and one theme for the product. |
| REF-03 `spyker-ref-model-top.png` | The reference model page hero | Style reference for the App detail hero: inset full-bleed still, centered display headline, black margins. |
| REF-04 `spyker-ref-model-scroll.png` | The reference model page, scrolled | Style reference for long-form detail bands and the reveal rhythm. |

## Pages

Nine screens: Login, Home (catalog), App detail, Cart, Checkout, Order
confirmation, My Library, Orders, and Not found. Every page is behind the
session guard except Login (`REQ-004`).

### Login

**Purpose:** the only public screen; takes a seeded account from the door into
the store and returns the buyer to where they were going (`REQ-001`,
`REQ-002`, `REQ-003`).

**Roles:** anonymous visitor and expired session. No other variation.

**Entry / exit:**
- Entry: `/login`, directly or as the guard's redirect target.
- Exit: successful sign-in to `next` or `/`; no other exit (no sign-up, no
  password reset, no social login).

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Username | text input, label above | yes | 3 to 50 characters; trimmed; `autocomplete="username"`; inline error when out of range (`REQ-032`, `REQ-054`) | designer, derived |
| Password | password input with reveal toggle, label above | yes | At least 8 characters; `autocomplete="current-password"`; inline error under 8 (`REQ-033`, `REQ-054`) | designer, derived |
| Sign in | primary button, full width | - | Submits; disabled while submitting; Enter in either field submits (`REQ-001`) | designer, derived |
| Credentials error | inline message, `role="alert"` | - | One sentence for every failure: "Invalid username or password." Never states whether the username exists (`REQ-003`) | designer, derived |
| Session notice | inline info line | - | Shown only after an expiry redirect: "Your session expired. Sign in to continue." (`REQ-006`, `REQ-043`) | designer, derived |
| Account note | caption | - | "Accounts are issued by Paladin." Explains the absence of sign-up without linking to one | derived |

**Actions**

- Submit with Enter or the button: validates the two fields locally, then
  posts. On success, replaces history with `next` or `/`, so Back does not
  return to the form (`REQ-002`).
- Reveal toggle: shows or hides the password; the button is 44x44 and has an
  accessible name that changes with state (`REQ-054`).
- No "forgot password", no "create account", no social sign-in: all are
  non-goals.

**States**

| State | Treatment | Source |
|---|---|---|
| Default | Full-bleed still, scrim, centered stack: wordmark, "SIGN IN", one sentence, two fields, white button, account note | designer, derived |
| Submitting | Button label "SIGNING IN", disabled; fields disabled; no spinner overlay | derived |
| Field invalid | Message under the offending field, field border to `color/error`, focus moves to the first invalid field | derived |
| Credentials rejected | One line under the button: "Invalid username or password." Field values stay, password cleared, focus to username (`REQ-003`) | designer, derived |
| Session expired | Info line above the fields, not an error (`REQ-006`, `REQ-043`) | derived |
| Loading | Not applicable: the page has no data to load | derived |
| Empty | Not applicable: no list or record on this page | derived |
| No permission | Not applicable: this is the public screen (`REQ-004`) | designer |

**Responsive**

- 1440 and wider: still fills the viewport; the stack is max 420px wide,
  centered; no side panel.
- 768 to 1439: same stack, 400px wide.
- 360 to 767: stack fills the width minus 24px gutters; fields 48px tall;
  the still keeps a 0.65 scrim so the form stays legible; keyboard handling
  never pushes the button under the on-screen keyboard.

**Frames used:** none drawn. Follows REF-01's top bar and still treatment.

**Screen spec** (follows REF-01)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Full-bleed still | Keep | The hero image device: one cinematic still, a dark scrim, content floating on top | figma | REQ-001 |
| Top bar | Replace | No cart and no hamburger on this screen: a centered wordmark only, so there is nothing to navigate to before sign-in | derived | REQ-001 |
| Hero headline | Replace | "SIGN IN" in condensed uppercase display type, centered, one line | derived | REQ-001 |
| Hero CTA | Replace | The white CTA becomes the form's full-width submit button | figma, derived | REQ-001 |
| Sound toggle | Remove | The reference's sound control is not carried over | derived | - |
| Cookie banner | Remove | Not part of this feature | derived | - |
| Scroll cue | Remove | The reference's "Scroll to explore" cue is not carried over | derived | - |
| Sign-up / recovery links | Remove | Non-goals: no account creation, no password reset | designer | REQ-052 |
| Form stack | Add | Username, password with reveal, submit, error line, account note | derived | REQ-001, REQ-003, REQ-032, REQ-033 |
| Session-expired notice | Add | Info line only when the guard sent the buyer here | derived | REQ-006, REQ-043 |

### Home (catalog)

**Purpose:** the storefront: a cinematic hero, up to six featured apps, a name
search, and the full catalog browsable by category (`REQ-007` to `REQ-011`,
`REQ-014`, `REQ-037`, `REQ-038`, `REQ-041`).

**Roles:** signed-in buyer. The screen does not change by role in v1.

**Entry / exit:**
- Entry: `/` after login; the wordmark from any page; a cleared filter.
- Exit: an app card or featured card to `/apps/:appId`; the cart icon to
  `/cart`; the menu to My Library or Orders; add-to-cart stays on the page.

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Hero headline | display text | - | Two lines maximum, 3 to 7 words, uppercase; one per page | designer, derived |
| Hero subcopy | text | - | One sentence, 20 words maximum | derived |
| Hero CTA | primary button | - | Single action: "BROWSE THE CATALOG"; scrolls to the catalog band, no route change | designer, derived |
| Search | search input with clear button, label above | no | Case-insensitive substring over the app name only; trimmed; empty means no keyword; debounced 300ms; held in `?q=` (`REQ-010`, `REQ-037`) | designer, derived |
| Category tabs | tab list, one active | no | `ALL` plus Productivity, Design, Developer Tools, Security, Games; unknown or missing category falls back to `ALL`; held in `?category=` (`REQ-009`, `REQ-038`) | designer, derived |
| Featured rail | card rail, seed order, up to 6 | - | Card shows cover, name, category, price, rating; order comes from the API and is not re-sorted (`REQ-008`, `REQ-011`) | designer, derived |
| Catalog card | card, poster 3:4 | - | Cover, category micro-label, name, publisher, price in IDR, rating with stars and number; whole card opens the detail (`REQ-011`) | designer, derived |
| Add to cart (card) | button inside the card | - | Adds one license; states: default, adding, added, in cart, owned, cart full (`REQ-014`, `REQ-018`, `REQ-019`, `REQ-020`, `REQ-041`) | designer, derived |
| Owned tag | tag inside the card | - | "OWNED", shown when the app is in the buyer's library; the add button is removed and "In your library" is shown (`REQ-019`, `REQ-041`) | designer, derived |
| Result count | text, `aria-live="polite"` | - | "18 apps" or "4 apps for "notes""; announces the new count after a search or tab change (`REQ-010`) | derived |
| Cart badge | count on the header cart icon | - | Number of distinct apps; hidden at 0; bumps on add (`REQ-015`) | designer, derived |
| Price label | text | - | IDR with thousands separators, e.g. "Rp 249.000"; `0` renders as "FREE" (`REQ-034`, `REQ-042`) | designer, derived |

URL state (derived): `q` and `category` are the only query keys. Defaults are
omitted. Typing uses `replaceState`; a tab change uses `pushState`, so Back
returns to the previous meaningful view. An unknown `category` value is
ignored and renders `ALL` (`REQ-038`).

**Actions**

- Search: debounced 300ms then filters; Enter applies immediately; the clear
  button empties the term and restores the current category listing
  (`REQ-010`, `REQ-037`).
- Category tab: applies immediately, keeps the current search term, so the
  two combine (`REQ-010`).
- Featured card or catalog card: opens `/apps/:appId` (`REQ-012`).
- Add to cart: adds the app, shows "ADDED" on the button for 1.5s, bumps the
  badge. Re-adding an in-cart app is a no-op that leaves one line
  (`REQ-018`). Owned apps have no add button (`REQ-019`). At 20 apps the click
  shows "Your cart is full (20 apps). Remove one to add another."
  (`REQ-020`, `REQ-036`).
- Menu: opens the full-screen navigation; Sign out ends the session
  (`REQ-005`).

**States**

| State | Treatment | Source |
|---|---|---|
| Default | Hero, featured rail, search band, category tabs, catalog grid, footer | designer, derived |
| Loading | Hero still loads eagerly; the featured rail and grid show 6 and 9 skeleton cards at final size; tabs and search stay usable; `aria-busy` on the grid (`REQ-007`) | derived |
| Empty (search) | Grid replaced by a state block: "No apps match "notes"." plus "CLEAR SEARCH"; tabs and search stay visible (`REQ-037`) | derived |
| Empty (category) | "No apps in Games yet." plus "VIEW ALL APPS", which selects `ALL` (`REQ-038`) | derived |
| Error | Section-level: one sentence plus "TRY AGAIN" in place of the rail or the grid; the other band stays; never a raw error (`REQ-043` handling) | derived |
| Partial failure | The featured rail can fail while the catalog grid succeeds, and each retries independently | derived |
| Owned app | Card visible with "OWNED" and "In your library"; no add action (`REQ-041`) | designer, derived |
| Cart full | Add shows the inline full-cart message; existing cards stay unchanged (`REQ-020`) | derived |
| No permission | Not applicable: every store page requires a session, so there is no partial-access state (`REQ-004`) | designer |

**Responsive**

- 1440 and wider: container 1440 with 64px gutters; hero min-height 78vh;
  rail shows 3 full cards plus a peek; catalog grid 3 columns.
- 1024 to 1439: 40px gutters; rail shows 3; grid 3 columns.
- 768 to 1023: rail shows 2 full cards plus a peek; grid 2 columns; hero
  min-height 64vh.
- 360 to 767: 24px gutters; rail 1 full card plus a peek; grid 1 column
  below 640 and 2 columns from 640; hero min-height 60vh, headline down to
  40px; the category tabs scroll horizontally with no visible scrollbar.

**Frames used:** none drawn. Follows REF-01 and REF-02.

**Screen spec** (follows REF-01 and REF-02)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Top bar | Keep | 72px, transparent over the hero, solid `color/canvas` with a hairline after 40px of scroll; hamburger left, centered wordmark, cart right | figma | REQ-007 |
| Hamburger menu | Replace | The reference's showroom menu becomes Catalog, My Library, Orders, Sign out | derived | REQ-005 |
| Hero still | Replace | The car still becomes a cinematic Paladin still; keep the device, not the subject | figma, derived | REQ-007 |
| Hero eyebrow | Keep | One small wide-tracked uppercase line above the headline, used once on the page | figma | REQ-007 |
| Hero headline and subcopy | Replace | Paladin copy, two lines maximum, centered; the reference's line count and scale are kept | figma, derived | REQ-007 |
| Hero CTA | Keep | Single white rectangular button, no second action | designer, figma | REQ-007 |
| Editorial band | Replace | REF-02's light editorial band becomes the catalog intro: a black band with the "FIND AN APP" search and the category tabs | figma, derived | REQ-009, REQ-010 |
| Car models and showroom links | Remove | Replaced by the app catalog | derived | REQ-009 |
| Sound toggle | Remove | No audio on the store | derived | - |
| Scroll cue | Remove | Not carried over from REF-03 | derived | - |
| Cookie banner | Remove | Not part of this feature | derived | - |
| Featured rail | Add | Up to six seed-ordered poster cards, scroll-snap, arrow buttons on desktop, keyboard scrollable | derived | REQ-008, REQ-011 |
| Catalog grid | Add | App cards with cover, category, name, publisher, price, rating, add-to-cart | derived | REQ-009, REQ-011, REQ-014 |
| Owned and in-cart states | Add | "OWNED" tag, "In your library" line; "IN CART" with a cart link | derived | REQ-018, REQ-019, REQ-041 |
| Empty and error states | Add | Per band, one sentence and one action | derived | REQ-037, REQ-038 |
| Footer | Add | Slim one-line footer: wordmark, Catalog, My Library, Orders, Sign out, copyright | derived | REQ-005 |

### App detail

**Purpose:** everything a buyer needs to judge one app, plus the purchase
action (`REQ-012` to `REQ-014`, `REQ-041`).

**Roles:** signed-in buyer.

**Entry / exit:**
- Entry: a catalog or featured card; a shared `/apps/:appId` URL.
- Exit: add to cart stays; "VIEW CART" to `/cart`; "VIEW IN MY LIBRARY" to
  `/library`; Back returns to the catalog with its search and category intact.

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Cover hero | full-bleed image | - | 16:9 crop, bottom scrim, title block anchored bottom-left; alt text names the app (`REQ-012`) | derived |
| App name | display heading | - | From the record; one or two lines | designer, derived |
| Meta line | text | - | Publisher, category, version, separated by hairlines; version is display only (`REQ-012`) | designer, derived |
| Rating | stars plus number | - | Seeded display data, no input; stars clipped to the value, number shown beside it (`REQ-012`) | designer, derived |
| Price | text | - | IDR, formatted; 0 renders as "FREE" (`REQ-034`, `REQ-042`) | designer, derived |
| Screenshots | lead image plus thumbnail strip | - | At least the cover; thumbnails switch the lead; keyboard operable; no autoplay (`REQ-012`) | derived |
| Description | long text | - | Rendered as text, never HTML; max 720px measure (`REQ-012`) | designer, derived |
| System requirements | list | - | Supported OS values from the record (`REQ-012`) | designer, derived |
| Add to cart | primary button in the purchase panel | - | Adds one license; states per the table below (`REQ-014`, `REQ-018`, `REQ-019`, `REQ-020`) | designer, derived |
| Owned tag | tag in the purchase panel | - | "IN YOUR LIBRARY"; the add button is replaced by "VIEW IN MY LIBRARY" (`REQ-019`, `REQ-041`) | designer, derived |
| License note | caption | - | "One license key per purchase. Keys appear in My Library." | derived |

**Actions**

- Add to cart: adds, button becomes "IN CART" with "VIEW CART"; re-adding is
  a no-op (`REQ-014`, `REQ-018`).
- Thumbnail or arrow keys: change the lead screenshot.
- Category in the meta line is not a link on this screen; the catalog tabs
  own category navigation.
- Back: returns to the catalog with `q` and `category` intact.

**States**

| State | Treatment | Source |
|---|---|---|
| Default | Cover hero, title block, gallery, description, requirements, sticky purchase panel | derived |
| Loading | Skeleton mirrors the final layout: hero block, title lines, gallery block, two section blocks, panel block | derived |
| Error | Body replaced by one sentence and "TRY AGAIN"; header and footer stay; never a raw error | derived |
| Not found | The shared not-found state, "APP NOT FOUND", with "BACK TO THE CATALOG" (`REQ-013`) | derived |
| Owned | Purchase panel shows "IN YOUR LIBRARY" and a library link; no add action (`REQ-041`) | designer, derived |
| In cart | Panel shows "IN CART" and a cart link; adding again does nothing (`REQ-018`) | derived |
| Cart full | Inline message under the button: "Your cart is full (20 apps). Remove one to add another." (`REQ-020`) | derived |
| No permission | Not applicable; the whole page is behind the guard (`REQ-004`) | designer |

**Responsive**

- 1440 and wider: hero 72vh; content 8/12 and purchase panel 4/12, panel
  sticky at 96px from the top.
- 1024 to 1439: same split with 40px gutters.
- 768 to 1023: one column; panel below the title block, not sticky.
- 360 to 767: hero 52vh; gallery is a scroll-snap strip with the thumbnails
  hidden; purchase panel becomes a sticky bottom bar with price and the
  primary action, safe-area inset; 48px targets.

**Frames used:** none drawn. Follows REF-03 and REF-04.

**Screen spec** (follows REF-03 and REF-04)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Top bar | Keep | Same as Home; solid from the first pixel on this page | figma | REQ-012 |
| Hero device | Keep | Inset full-bleed still with black margins, centered display type over the image (REF-03) | figma | REQ-012 |
| Hero subject | Replace | The car still and location eyebrow become the app cover and the meta line: publisher, category, version | figma, derived | REQ-012 |
| Hero headline | Replace | "THE MORNING" becomes the app name, up to two lines | figma, derived | REQ-012 |
| Scroll cue | Remove | The reference's hint is not carried over | derived | - |
| Long-form bands | Replace | REF-04's story bands become "ABOUT THIS APP" and "SYSTEM REQUIREMENTS" | figma, derived | REQ-012 |
| Gallery | Add | Lead screenshot plus a thumbnail row; no carousel autoplay | derived | REQ-012 |
| Purchase panel | Add | Price, rating, add-to-cart, owned and in-cart states, license note | derived | REQ-014, REQ-019, REQ-041 |
| Rating | Add | Five stars plus the numeric value; display only | derived | REQ-012 |
| Cart and library links | Add | "VIEW CART" when in cart, "VIEW IN MY LIBRARY" when owned | derived | REQ-018, REQ-019 |

### Cart

**Purpose:** review the chosen apps, remove any, and see the IDR total before
checkout (`REQ-015` to `REQ-021`, `REQ-036`, `REQ-039`).

**Roles:** signed-in buyer; the cart is theirs alone (`REQ-017`).

**Entry / exit:**
- Entry: cart icon; "VIEW CART" from a detail page; `/cart` after checkout
  is abandoned.
- Exit: "PROCEED TO CHECKOUT" to `/checkout`; app name to its detail;
  catalog link from the empty state.

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Line item | row | - | Cover thumbnail 3:4, name, publisher and category, quantity label "1 LICENSE", price in IDR (`REQ-015`) | designer, derived |
| Remove | text button with trash icon | - | Removes that line; row is disabled with "REMOVING" until the response (`REQ-015`) | designer, derived |
| Count | text | - | "3 apps"; also "20 of 20 apps" when at the cap (`REQ-036`) | derived |
| Subtotal | text | - | Sum of current prices, IDR (`REQ-016`) | designer, derived |
| Total | text, emphasized | - | Same value as the subtotal; "No tax or fees are added." (`REQ-016`) | designer, derived |
| Cart-full notice | info line | - | Only at 20 apps: "Your cart is full. Remove an app to add another." (`REQ-020`, `REQ-036`) | derived |
| Checkout | primary button | - | Present only when at least one line exists (`REQ-021`) | designer, derived |
| Empty state | state block | - | "YOUR CART IS EMPTY." plus "BROWSE THE CATALOG" (`REQ-039`) | derived |

**Actions**

- Remove: deletes the line, updates the total and badge; on failure the line
  returns and an inline message names the failure (`REQ-015`).
- Checkout: goes to `/checkout`; disabled and absent while empty
  (`REQ-021`).
- App name or cover: opens the detail page.
- No quantity control exists, by design: every line is one license
  (`REQ-015`); no coupon, no note, no shipping (`REQ-016`).

**States**

| State | Treatment | Source |
|---|---|---|
| Default | Title, count, lines, summary, checkout | derived |
| Loading | Three skeleton lines at final height and a skeleton summary; no page spinner | derived |
| Empty | State block replaces the lines and the summary; no checkout action (`REQ-039`, `REQ-021`) | derived |
| Error | The lines area is replaced by one sentence and "TRY AGAIN"; the header and footer stay | derived |
| Removing | The row dims, its remove button reads "REMOVING" and is disabled; other rows stay usable | derived |
| Remove failed | Line restored; inline message "That app could not be removed. Try again." | derived |
| Cart full | Info line at the top of the list; adding is blocked elsewhere (`REQ-020`) | derived |
| No permission | Not applicable; the cart is per user and behind the guard (`REQ-017`) | designer |

**Responsive**

- 1440 and wider: lines 8/12, summary 4/12 sticky; thumbnails 96px wide.
- 1024 to 1439: same split, 40px gutters.
- 768 to 1023: one column; summary under the lines, not sticky.
- 360 to 767: 72px thumbnails; price moves under the name; remove stays a
  44px target; summary becomes a sticky bottom bar with the total and the
  checkout button; safe-area inset.

**Frames used:** none drawn. Follows REF-02's editorial list treatment.

**Screen spec** (follows REF-02)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Top bar | Keep | Same header as Home, cart icon shown as the current page | figma | REQ-015 |
| Page title | Add | "CART" in display type with the count beneath it | derived | REQ-015 |
| Line list | Add | Hairline-separated rows: cover, name, publisher and category, static "1 LICENSE", price, remove | derived | REQ-015 |
| Quantity stepper | Remove | Not present: quantity is fixed at one license, and no stepper exists anywhere | designer | REQ-015 |
| Summary panel | Add | Subtotal, total, the no-tax line, checkout button | derived | REQ-016, REQ-021 |
| Empty state | Add | State block with "BROWSE THE CATALOG" | derived | REQ-039 |
| Promo, coupon, shipping fields | Remove | Out of scope: no discount, tax, shipping or fee in v1 | designer | REQ-052 |
| Footer | Keep | Same slim footer as Home | derived | - |

### Checkout

**Purpose:** confirm the order and place it with simulated payment, collecting
no payment details (`REQ-022` to `REQ-026`).

**Roles:** signed-in buyer.

**Entry / exit:**
- Entry: "PROCEED TO CHECKOUT" from a non-empty cart.
- Exit: success to the order confirmation; "BACK TO CART"; a failed
  ownership check keeps the buyer here with the error.

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Order lines | read-only list | - | Cover, name, price for each cart app; no quantity control (`REQ-023`) | derived |
| Total | text, emphasized | - | Sum of the current catalog prices, IDR (`REQ-016`) | derived |
| Payment notice | text block | - | "Payment is simulated in this version. No card details are collected." (`REQ-022`) | designer, derived |
| Place order | primary button | - | Creates one order; disabled after the first click and while submitting (`REQ-023`, `REQ-026`) | designer, derived |
| Back to cart | text link | - | Returns to `/cart`, cart unchanged | derived |
| Ownership error | error block | - | Names every offending app: "You already own Notes Pro and Studio. Remove them from your cart to continue." No order or key is created (`REQ-025`) | designer, derived |
| Generic error | error block | - | "The order could not be placed. Try again." Retry re-submits the same intent (`REQ-026`) | derived |

**Actions**

- Place order: posts once; the button and form disable immediately; on
  success the app navigates with `replace` to
  `/orders/:orderId?placed=1`, so Back does not resubmit (`REQ-023`,
  `REQ-026`).
- Back to cart: no data is changed.
- No payment fields, no address, no card, no terms checkbox (`REQ-022`).

**States**

| State | Treatment | Source |
|---|---|---|
| Default | Title, order lines, summary, payment notice, place order, back link | derived |
| Loading | Skeleton lines plus a skeleton summary while the cart is re-read | derived |
| Submitting | Button label "PLACING ORDER", disabled; lines frozen; no spinner | derived |
| Ownership conflict | Error block naming the apps; the buyer is sent to the cart to remove them; no order exists afterwards (`REQ-025`) | designer, derived |
| Error | Error block plus a retry that keeps the same cart | derived |
| Empty cart | The page does not render an empty order: it redirects to `/cart` and shows the empty state there (`REQ-021`) | derived |
| Success | Leaves this page for the confirmation (`REQ-024`) | derived |
| No permission | Not applicable; behind the guard (`REQ-004`) | designer |

**Responsive**

- 1440 and wider: lines 7/12, summary 5/12, summary sticky.
- 1024 to 1439: same split with 40px gutters.
- 768 to 1023: one column, summary last.
- 360 to 767: one column; the place-order button is a sticky bottom bar
  above the safe area; the back link sits above the lines.

**Frames used:** none drawn. Follows REF-02.

**Screen spec** (follows REF-02)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Top bar | Keep | Same header, so Sign out stays reachable (`REQ-005`) | figma | REQ-005 |
| Footer | Remove | Checkout is a focused step: no footer, no marketing links | derived | - |
| Page title | Add | "CHECKOUT" in display type | derived | REQ-022 |
| Order lines | Add | Read-only lines without remove or quantity controls | derived | REQ-023 |
| Payment section | Replace | No card form exists: one notice line states that payment is simulated | designer | REQ-022 |
| Place order | Add | One white button, disabled on submit | derived | REQ-023, REQ-026 |
| Ownership error | Add | Error block above the button, naming the apps | derived | REQ-025 |
| Coupon, shipping, billing address | Remove | Out of scope | designer | REQ-052 |

### Order confirmation

**Purpose:** the proof of purchase: order id, date, total, and each app with
its license key, immediately after a successful checkout (`REQ-024`,
`REQ-027`).

**Roles:** the buyer who placed the order.

**Entry / exit:**
- Entry: redirect from Checkout to `/orders/:orderId?placed=1`.
- Exit: "GO TO MY LIBRARY" to `/library`; "VIEW ALL ORDERS" to `/orders`.

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Success heading | display text | - | "ORDER CONFIRMED" plus one sentence: "Your keys are ready and saved in My Library." (`REQ-023`, `REQ-024`) | derived |
| Order id | text | - | The order reference, e.g. "PAL-1027"; copyable (`REQ-024`) | designer, derived |
| Order date | text | - | Absolute date, e.g. "11 November 2026" (`REQ-024`) | designer, derived |
| Total | text | - | The stored order total, IDR, never recomputed from current prices (`REQ-016`, `REQ-027`) | designer, derived |
| Purchased apps | list | - | Cover, name, license key for each app in the order (`REQ-024`) | designer, derived |
| License key | monospace text plus copy button | - | One unique key per app; copy shows "COPIED" for 1.5s (`REQ-023`) | derived |
| Library action | primary button | - | "GO TO MY LIBRARY" (`REQ-029`) | derived |
| Orders action | secondary link | - | "VIEW ALL ORDERS" (`REQ-030`) | derived |

**Actions**

- Copy key: copies that key and confirms inline.
- Go to My Library, View all orders.
- No cancel, refund, re-download or edit action exists (`REQ-028`).

**States**

| State | Treatment | Source |
|---|---|---|
| Success (`placed=1`) | Success heading, order block, keys, two actions | derived |
| Order view without the flag | Same order content without the success heading, reached from Orders | derived |
| Loading | Skeleton key blocks while the order is read | derived |
| Not found | Shared not-found state when the id is unknown or belongs to another user (`REQ-031`, `REQ-044`) | derived |
| Error | One sentence and "TRY AGAIN" | derived |
| No permission | Another user's order is deliberately indistinguishable from an unknown one: both show the same not-found state (`REQ-044`) | designer |

**Responsive:** centered single column, max 880px; keys wrap on two lines
under 480px; copy buttons stay 44px; actions stack on phones.

**Frames used:** none drawn. Follows REF-03's inset hero device for the
success band.

**Screen spec** (follows REF-03)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Top bar | Keep | Same header | figma | REQ-005 |
| Hero band | Replace | The cinematic still becomes a quiet black success band with a hairline frame; no photograph, because the message is the design | figma, derived | REQ-024 |
| Order block | Add | Order id, date, total, and one key block per app | derived | REQ-024 |
| License key | Add | Monospace key, copy button, "COPIED" confirmation | derived | REQ-023 |
| Secondary actions | Add | "GO TO MY LIBRARY" plus "VIEW ALL ORDERS" | derived | REQ-029, REQ-030 |
| Cancel or refund actions | Remove | Not present: orders are immutable | designer | REQ-028 |

### My Library

**Purpose:** the buyer's owned apps with their license keys, purchase dates
and order references (`REQ-029`, `REQ-040`).

**Roles:** signed-in buyer; the list is theirs only (`REQ-031`).

**Entry / exit:**
- Entry: menu "My Library"; "GO TO MY LIBRARY" after checkout; `/library`.
- Exit: order reference to `/orders/:orderId`; menu elsewhere.

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Title and count | display text | - | "MY LIBRARY" plus "7 apps" (`REQ-029`) | derived |
| Library card | card | - | Cover, name, publisher, license key, purchase date, order reference (`REQ-029`) | designer, derived |
| License key | monospace text plus copy button | - | Copy confirms inline for 1.5s | derived |
| Purchase date | text | - | Absolute date from the order | designer, derived |
| Order reference | link | - | "Order PAL-1027" links to that order (`REQ-030`) | derived |
| Empty state | state block | - | "YOUR LIBRARY IS EMPTY." with one sentence and "BROWSE THE CATALOG" (`REQ-040`) | derived |

**Actions**

- Copy key; open the order; browse the catalog from the empty state.
- There is no download, no uninstall, no transfer and no remove action: v1
  sells keys, not fulfillment (`REQ-029`).
- No sort or filter control: the spec defines no ordering. Newest purchase
  first is the default.

**States**

| State | Treatment | Source |
|---|---|---|
| Default | Title, count, two-column card grid | derived |
| Loading | Four skeleton cards at final size | derived |
| Empty | State block with "BROWSE THE CATALOG" (`REQ-040`) | derived |
| Error | One sentence plus "TRY AGAIN" | derived |
| Copy feedback | Button label swaps to "COPIED" for 1.5s | derived |
| No permission | Not applicable; scoped by the server, behind the guard (`REQ-031`) | designer |

**Responsive:** 2 columns at 1024 and wider, 1 column below; cards stack key
above date; 24px gutters on phones.

**Frames used:** none drawn. Follows REF-02's editorial card treatment.

**Screen spec** (follows REF-02)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Top bar | Keep | Same header | figma | REQ-029 |
| Page title and count | Add | "MY LIBRARY" plus the owned count | derived | REQ-029 |
| Library cards | Add | Cover, name, publisher, key block, purchase date, order link | derived | REQ-029 |
| Sort, filter, pagination | Remove | Not present: the spec defines no ordering or paging for the library | designer | - |
| Download or install buttons | Remove | Not in scope: v1 delivers keys, not installers | designer | REQ-052 |
| Empty state | Add | "YOUR LIBRARY IS EMPTY." plus "BROWSE THE CATALOG" | derived | REQ-040 |

### Orders

**Purpose:** the buyer's order history, each order with its date, total, apps
and license keys (`REQ-030`, `REQ-031`, `REQ-044`).

**Roles:** signed-in buyer; orders are scoped to them.

**Entry / exit:**
- Entry: menu "Orders"; "VIEW ALL ORDERS" from a confirmation; an order
  reference from My Library.
- Exit: app names are not links here (their detail may show an owned state);
  the order reference deep link `/orders/:orderId` expands that order.

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Title and count | display text | - | "ORDERS" plus "3 orders" | derived |
| Order block | accordion item | - | Header: order id, date, total, chevron; body: apps with keys (`REQ-030`) | designer, derived |
| License key | monospace text plus copy button | - | Same treatment as My Library | derived |
| Order total | text | - | The stored total, IDR (`REQ-027`) | designer, derived |
| Empty state | state block | - | "NO ORDERS YET." with one sentence and "BROWSE THE CATALOG" (`REQ-040`) | derived |
| Not found | state block | - | When `/orders/:orderId` is unknown or another user's (`REQ-044`) | derived |

**Actions**

- Expand or collapse an order; copy a key; open a deep link expands and
  focuses that order.
- No cancel, refund, edit, reorder or invoice download action exists
  (`REQ-028`).

**States**

| State | Treatment | Source |
|---|---|---|
| Default (collapsed) | One-line order headers, newest first | derived |
| Expanded | Body animates open with the app and key rows | derived |
| Loading | Three skeleton order headers | derived |
| Empty | State block with "BROWSE THE CATALOG" (`REQ-040`) | derived |
| Not found (deep link) | Shared not-found state, identical for unknown and foreign ids (`REQ-031`, `REQ-044`) | derived |
| Error | One sentence plus "TRY AGAIN" | derived |
| No permission | Nothing to show: the server scopes every order (`REQ-056`) | designer |

**Responsive:** one column, max 960px; order headers stack id and date above
the total under 640px; the body keys wrap; copy buttons stay 44px.

**Frames used:** none drawn. Follows REF-02.

**Screen spec** (follows REF-02)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Top bar | Keep | Same header | figma | REQ-030 |
| Page title and count | Add | "ORDERS" plus the order count | derived | REQ-030 |
| Order accordion | Add | Header row with id, date, total, chevron; body with apps and keys | derived | REQ-030 |
| Filter, sort, pagination | Remove | Not present: no ordering or paging is defined | designer | - |
| Cancel, refund, reorder | Remove | Absent by design: orders are immutable | designer | REQ-028 |
| Empty state | Add | "NO ORDERS YET." plus "BROWSE THE CATALOG" | derived | REQ-040 |

### Not found

**Purpose:** one honest dead end with a way forward, used for an unknown
route, an unknown app id, and an unknown or foreign order id (`REQ-013`,
`REQ-031`, `REQ-044`).

**Roles:** signed-in buyer. The login screen's own guard means an anonymous
hit lands on Login, not here.

**Entry / exit:**
- Entry: any unmatched route, a bad `/apps/:appId`, a bad or foreign
  `/orders/:orderId`.
- Exit: "BACK TO THE CATALOG" to `/`; header and menu.

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Code | small uppercase label | - | "404", not decorative: it names the state | derived |
| Title | display heading | - | "PAGE NOT FOUND", "APP NOT FOUND" or "ORDER NOT FOUND" by context | derived |
| Copy | text | - | One sentence: "That page does not exist." For an app or order: "It may have been removed, or it belongs to another account." (`REQ-044`) | derived |
| Action | primary button | - | "BACK TO THE CATALOG" | derived |

**Actions**

- Back to the catalog; menu items still work.
- No search field on this page; the catalog owns search.

**States**

| State | Treatment | Source |
|---|---|---|
| Default | Centered state block, header and footer stay, one action | derived |
| Loading | Not applicable: no data is pending when the id is already invalid | derived |
| Empty / error | Not applicable: this screen is the error state | derived |
| No permission | Another user's order is shown as this same not-found state, never as a permission error (`REQ-044`) | designer |

**Responsive:** centered column, max 560px, 24px gutters, 44px targets.

**Frames used:** none drawn. Follows REF-03's centered display composition.

**Screen spec** (follows REF-03)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Top bar | Keep | Same header | figma | REQ-013 |
| Hero band | Replace | The still becomes an empty black band with the 404 label and the title | figma, derived | REQ-013 |
| Body | Add | One sentence and one action | derived | REQ-013 |
| Search field | Remove | Not present: the catalog owns search | derived | - |
| Footer | Keep | Same slim footer | derived | - |

## Navigation

| From | Trigger | To |
|---|---|---|
| Login | Valid credentials | The `next` path if present, else `/` (`REQ-002`) |
| Login | Invalid credentials | Login, with the generic error (`REQ-003`) |
| Any protected page | No session on load | `/login?next=<path and query>` (`REQ-004`) |
| Any protected page | Session expires during an API call | `/login?next=<path and query>&reason=expired` (`REQ-006`, `REQ-043`) |
| Login | After the expiry redirect, valid credentials | The requested page, with the cart preserved by the server (`REQ-043`) |
| Any page | Wordmark | `/` |
| Any page | Hamburger | Full-screen menu overlay (`REQ-005`) |
| Menu | Catalog | `/` |
| Menu | My Library | `/library` |
| Menu | Orders | `/orders` |
| Menu | Sign out | Session ended, then `/login` with history replaced, so Back does not restore a protected view (`REQ-005`) |
| Any page | Cart icon | `/cart` |
| Home | Featured or catalog card | `/apps/:appId` (`REQ-012`) |
| Home | Add to cart | Same page; card and badge update (`REQ-014`) |
| Home | Clear search or "View all apps" | Same page, `q` or `category` cleared (`REQ-010`, `REQ-037`, `REQ-038`) |
| App detail | Add to cart | Same page; panel becomes "IN CART" (`REQ-014`) |
| App detail | "VIEW CART" | `/cart` |
| App detail | "VIEW IN MY LIBRARY" | `/library` (`REQ-041`) |
| App detail | An unknown app id | The not-found state (`REQ-013`) |
| Cart | "PROCEED TO CHECKOUT" | `/checkout` (`REQ-021`) |
| Cart | App name or cover | `/apps/:appId` |
| Cart | Empty state action | `/` (`REQ-039`) |
| Checkout | "PLACE ORDER" | `/orders/:orderId?placed=1`, history replaced (`REQ-023`, `REQ-026`) |
| Checkout | "BACK TO CART" | `/cart` |
| Checkout | Ownership conflict | Stay on checkout; error names the apps; the cart is the place to fix it (`REQ-025`) |
| Order confirmation | "GO TO MY LIBRARY" | `/library` (`REQ-029`) |
| Order confirmation | "VIEW ALL ORDERS" | `/orders` (`REQ-030`) |
| My Library | Order reference | `/orders/:orderId` (`REQ-030`) |
| Orders | Order header | Expands or collapses in place |
| Orders | Deep link to an unknown or foreign id | The not-found state (`REQ-044`) |
| Not found | "BACK TO THE CATALOG" | `/` |
| Any page | Browser Back | The previous URL; catalog search and category survive in the query (`REQ-010`) |

No route exists for sign-up, password reset, admin, refunds or order editing
(`REQ-052`).

## Motion & interaction catalog

The reference is a video-led site whose scroll reveals are slow fades and
slides. The designer asked for that rhythm; every other timing below is a
default from the design references, confirmed in this session's instruction.
All motion runs on `transform` and `opacity` only, and all of it collapses
under `prefers-reduced-motion: reduce`. Hover motion is gated to
`@media (hover: hover) and (pointer: fine)`.

| ID | Trigger | Element | Effect | Duration | Easing | Frame | Source |
|---|---|---|---|---|---|---|---|
| MO-001 | page load, once | Hero still | Fades in from `color/canvas-deep` and scales 1.04 to 1 | 1400ms | `cubic-bezier(0.16, 1, 0.3, 1)` | REF-01 | designer, derived |
| MO-002 | enters viewport, once | Section bands, cards, page blocks | Fade from 0 to 1 with a 24px rise; children stagger 60ms, capped at 6 | 600ms | `cubic-bezier(0.16, 1, 0.3, 1)` | REF-02, REF-04 | designer, derived |
| MO-003 | hover, focus-visible | App cards, featured cards | Cover scales to 1.03; hairline brightens to `color/text-secondary`; title underline grows from the left | 400ms | `cubic-bezier(0.16, 1, 0.3, 1)` | - | derived |
| MO-004 | press | Buttons and icon buttons | `scale(0.985)`; fill steps to `color/surface-raised` | 120ms | `ease-out` | - | derived |
| MO-005 | keyboard focus | Every interactive element | 2px `color/focus` ring with a 2px canvas offset; on the white action, a 2px `color/canvas` inner ring then the white ring | 120ms | `linear` | - | derived |
| MO-006 | open | Full-screen menu | Scrim fades; panel slides from the left 24px with a fade; menu items stagger 40ms | 500ms, scrim 300ms | `cubic-bezier(0.32, 0.72, 0, 1)` | - | derived |
| MO-007 | close | Full-screen menu | Reverse of the open, shorter | 300ms | `cubic-bezier(0.23, 1, 0.32, 1)` | - | derived |
| MO-008 | add to cart | Header cart badge | Bumps 1 to 1.15 to 1; the card button label swaps to "ADDED" | 300ms, label hold 1500ms | `cubic-bezier(0.23, 1, 0.32, 1)` | - | derived |
| MO-009 | copy a key | Copy button | Label swaps to "COPIED", returns after 1500ms; no toast | 160ms | `ease-out` | - | derived |
| MO-010 | open or close | Order accordion | Height from 0 to content with a fade; content fades at 100ms delay | 300ms | `cubic-bezier(0.23, 1, 0.32, 1)` | - | derived |
| MO-011 | loading | Skeletons | Opacity pulses 0.45 to 0.9; no shimmer sweep, no layout shift | 1400ms, loop | `ease-in-out` | - | derived |
| MO-012 | route change | Page | New page fades in from 0 to 1; scroll resets to the top instantly | 200ms | `linear` | - | derived |
| MO-013 | results change | Catalog grid | No animation: results swap in place and the count is announced with `aria-live="polite"` | instant | - | - | derived |
| MO-014 | validation error | Inline error line | Fades in; no shake, no colour flash on the whole form | 160ms | `ease-out` | - | derived |
| MO-015 | hover, focus | Buttons | Background steps from `color/action` to `#E8E8E8` (primary) or border brightens (outline) | 200ms | `ease-out` | - | derived |
| MO-016 | reduced motion | All of the above | Transforms, rises and slides removed; opacity capped at 120ms; skeletons static at 0.7 opacity | 120ms | `linear` | - | derived |

There is no autoplay carousel, no parallax, no scroll-jacking, no cursor
effect, no sound, and no infinite loop other than the skeleton pulse.

## Design tokens

**References:** taste-skill `design-taste-frontend` (sections 0, 1, 4.5, 4.7,
4.8, 8 and 9, 14) and awesome-design-md **`lamborghini`** (closest character:
a true-black canvas, a minimal top bar with the mark centered between a
hamburger and an icon, extreme uppercase display type, zero border radius,
and a single high-contrast action). Design Read: **a first-party storefront
for desktop-software buyers, with a cinematic black editorial language,
leaning toward a dark-luxury automotive system with zero radius and generous
pacing.** Dials: `DESIGN_VARIANCE 7 / MOTION_INTENSITY 5 / VISUAL_DENSITY 3`.
The lamborghini file supplies rhythm and state vocabulary only: no marks, no
copy, and no gold accent are copied, because the designer fixed a white action
on black. The reference screenshots win wherever they show a value.

**Theme lock:** dark only, no toggle. The brief fixes a black canvas, so the
taste-skill dual-mode default is deliberately overridden; there is no light
theme and no `prefers-color-scheme` switch.

### Color

| Token | Value | Where used | Source |
|---|---|---|---|
| `color/canvas` | `#0B0B0B` | Page background everywhere (18.05:1 with `color/text`) | designer, figma |
| `color/canvas-deep` | `#000000` | Hero letterbox and login backdrop, beneath the scrim | figma |
| `color/surface` | `#141414` | Cards, inputs, panels, menu overlay base | derived |
| `color/surface-raised` | `#1C1C1C` | Hover and pressed surfaces, expanded order body | derived |
| `color/hairline` | `#2A2A2A` | Decorative dividers and card borders only (1.37:1, never a control boundary) | derived |
| `color/border-control` | `#6A6A6A` | Input and outline-button borders (3.64:1 on canvas, 3.41:1 on surface) | derived |
| `color/text` | `#F5F5F5` | Headings and body (18.05:1 on canvas) | designer, figma |
| `color/text-secondary` | `#B3B3B3` | Meta lines, captions, secondary body (9.39:1 on canvas, 8.79:1 on surface) | derived |
| `color/text-muted` | `#8C8C8C` | Placeholder and helper text only (5.85:1 on canvas, 5.48:1 on surface) | derived |
| `color/action` | `#FFFFFF` | The one primary action fill | designer, figma |
| `color/on-action` | `#0B0B0B` | Text on the white action (19.68:1) | designer |
| `color/on-image` | `#FFFFFF` | Text over photographs, always above the scrim | figma |
| `color/scrim` | `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.72))` | Behind hero and cover text | figma |
| `color/scrim-login` | `rgba(0,0,0,0.65)` | Full still overlay on Login | derived |
| `color/error` | `#F26B5E` | Field errors and error blocks (6.60:1 on canvas, 6.18:1 on surface) | derived |
| `color/success` | `#4ADE80` | "OWNED" and confirmation tags, copy confirmation (11.30:1) | derived |
| `color/warning` | `#E8B84B` | Cart-full notice (10.67:1) | derived |
| `color/focus` | `#FFFFFF` | 2px focus ring, 2px canvas offset | derived |
| `color/overlay` | `rgba(0,0,0,0.72)` | Menu scrim and dialog backdrop | derived |

One action colour only: white. Status colours (error, success, warning) are
never decoration. No accent hue is introduced, which is the strictest reading
of the reference.

### Typography

| Token | Value | Where used | Source |
|---|---|---|---|
| `font/display` | Oswald, variable 200 to 700, self-hosted | Hero, page titles, section titles, card titles, prices | designer |
| `font/body` | Inter 400, 500, 600, self-hosted | Body, labels, buttons, captions | designer |
| `font/mono` | `ui-monospace, SFMono-Regular, Menlo, monospace` | License keys and order ids | derived |
| `type/display-xl` | Oswald 400, 120/108 desktop, 56/54 phone, line-height 0.9, letter-spacing 0.01em, uppercase | Hero headline of 3 words or fewer | figma |
| `type/display-lg` | Oswald 400, 72/66 desktop, 40/38 phone, line-height 0.95, letter-spacing 0.02em, uppercase | Page titles, App detail name | figma |
| `type/display-md` | Oswald 400, 40/38 desktop, 28/27 phone, line-height 1.0, letter-spacing 0.03em, uppercase | Section titles, order headers | figma |
| `type/display-sm` | Oswald 500, 24/23 desktop, 20/19 phone, line-height 1.05, letter-spacing 0.04em | Card titles, line-item names | derived |
| `type/eyebrow` | Oswald 400, 12px, uppercase, letter-spacing 0.18em, line-height 1.2 | One kicker per band, at most 1 per 3 bands | figma |
| `type/body-lg` | Inter 400, 18px, line-height 1.6 | Hero subcopy, detail description | derived |
| `type/body` | Inter 400, 16px, line-height 1.65 | Descriptions, notices | derived |
| `type/body-sm` | Inter 400, 14px, line-height 1.5 | Meta lines, helper text | derived |
| `type/label` | Inter 500, 11px, uppercase, letter-spacing 0.14em, line-height 1.4 | Field labels, column labels | derived |
| `type/button` | Inter 600, 13px, uppercase, letter-spacing 0.12em, line-height 1.2 | Buttons and link-buttons | figma |
| `type/price` | Oswald 500, 20px, line-height 1.1, `font-variant-numeric: tabular-nums` | Prices and totals | derived |
| `type/key` | 14px mono, letter-spacing 0.06em, `font-variant-numeric: tabular-nums` | License keys | derived |
| `type/caption` | Inter 400, 12px, line-height 1.4 | Legal, notes, count | derived |

Oswald is never synthesised bold; use 400 or 500 only. Display type is always
uppercase. Inter is never used for display headings. Both fonts are
self-hosted as woff2 with `font-display: swap`, and the Oswald latin subset is
preloaded.

### Spacing, shape, elevation

| Token | Value | Where used | Source |
|---|---|---|---|
| `space` scale | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 | All gaps and padding; 4px base | derived |
| `section padding` | 128px desktop, 96px tablet, 56px phone, vertical | Band rhythm | figma |
| `container` | max-width 1440px; gutters 64px desktop, 40px tablet, 24px phone | Page shell | derived |
| `measure` | 720px | Description and long-form text | derived |
| `radius` | 0 on every element: buttons, inputs, cards, dialogs, images | Shape lock, one system | figma, designer |
| `border/control` | 1px solid `color/border-control` | Inputs, outline buttons | derived |
| `border/divider` | 1px solid `color/hairline` | Card edges and list dividers | figma |
| `elevation` | None. Depth comes from surface tone and hairlines, never shadow | All surfaces | figma, derived |
| `scrim` | top 15% black to 72% black at the text baseline | Hero and cover text | figma |
| `focus ring` | 2px `color/focus` plus 2px `color/canvas` offset; inverse on the white action | Every interactive element | derived |
| `breakpoints` | 480, 768, 1024, 1280, 1440, 1920 | Layout changes documented per page | derived |
| `header` | 72px desktop, 60px phone | Minimal top bar | figma |
| `hit target` | 44x44 minimum, 48px for primary actions on phones | Every control | derived |

**Shape lock:** every corner is square. No pill, no rounded card, no circular
avatar. The cart badge is the single exception and only because a count needs
a container: a square 18px badge with a 1px white border, not a circle.

**Contrast checks (measured):** `#F5F5F5` on `#0B0B0B` 18.05:1;
`#B3B3B3` on `#0B0B0B` 9.39:1; `#B3B3B3` on `#141414` 8.79:1; `#8C8C8C` on
`#0B0B0B` 5.85:1; `#8C8C8C` on `#141414` 5.48:1; `#0B0B0B` on `#FFFFFF`
19.68:1; `#F26B5E` on `#0B0B0B` 6.60:1 and on `#141414` 6.18:1; `#4ADE80` on
`#0B0B0B` 11.30:1; `#E8B84B` on `#0B0B0B` 10.67:1; `#6A6A6A` control border
3.64:1 on canvas and 3.41:1 on surface, above the 3:1 non-text minimum.
`color/hairline` is 1.37:1 and therefore never used as the only sign of a
control.

## Components

`paladin-ui` is a plain React application and `REQ-049` forbids nexcomponent-ui
and nexcommon. There is also no Figma file, so there are no `Code`
properties. Every row is therefore **not applicable** rather than an invented
import; the builder owns the concrete implementation. Native HTML does most
of the work (`<dialog>`, `<input>`, `<button>`, `<details>` where it fits),
and no third-party UI package is required by this design.

| Component | Figma `Code` and variants | nexcomponent export (import path) | Resolution status | States | Used on | Note |
|---|---|---|---|---|---|---|
| App shell | none | not applicable, plain React | not applicable | Authenticated, anonymous | All pages | Header, main landmark, footer, skip link |
| Top bar | none | not applicable, plain React | not applicable | Transparent over hero, solid after scroll, menu open | All pages | Hamburger left, centered wordmark, cart right; 72px |
| Full-screen menu | none | native `<dialog>` plus React state | not applicable | Closed, opening, open, closing | All pages | Focus trap from the element, Escape closes, background inert, scroll locked |
| Wordmark | none | text in Oswald until an SVG arrives | unresolved (asset missing) | Default | Header, footer, login | See `## Assets` |
| Cart button and badge | none | not applicable, plain React | not applicable | 0 to 20, bumped | All pages | Accessible label "Cart, 3 apps" |
| Button | none | native `<button>` with variants | not applicable | Default, hover, pressed, focus, disabled, loading label | All pages | Primary white, secondary outline, ghost text, destructive text |
| Icon button | none | native `<button>` | not applicable | Default, hover, focus, disabled | Header, copy actions | 44x44, icon plus accessible name |
| Text field | none | native `<input>` plus label and error line | not applicable | Default, focus, filled, invalid, disabled | Login | Label above, error below, `aria-describedby` |
| Password field | none | native `<input type="password">` plus reveal | not applicable | Hidden, revealed, invalid | Login | Reveal button 44x44 with changing name |
| Search field | none | native `<input type="search">` plus clear | not applicable | Default, focus, filled, no results | Home | Debounced 300ms, clear restores the category |
| Category tabs | none | buttons with `role="tab"` or links with `aria-current` | not applicable | Default, active, hover, focus | Home | Horizontal scroll on phones |
| App card | none | composed React component | not applicable | Default, hover, focus, owned, in cart, adding, added, skeleton | Home | Whole card is a link; the add button stops propagation |
| App rail | none | composed, CSS scroll-snap | not applicable | Default, scrolled, edge reached | Home | Arrow buttons desktop, keyboard scroll, no autoplay |
| Rating stars | none | SVG icon from the icon library, clipped fill | not applicable | Value 0 to 5 | Card, detail | Decorative stars plus an accessible text value |
| Price label | none | plain React formatter | not applicable | Normal, zero (FREE) | Home, detail, cart, checkout, confirmation | IDR, tabular numbers |
| Owned tag | none | plain span | not applicable | Owned | Card, detail | "OWNED" in `color/success`; never the only signal |
| Screenshot gallery | none | composed, lead image plus thumbnails | not applicable | Default, changing, broken image | App detail | No autoplay; alt text per shot |
| Purchase panel | none | composed | not applicable | Default, in cart, owned, cart full, adding | App detail | Sticky desktop, bottom bar phone |
| Cart line | none | composed | not applicable | Default, removing, error, disabled | Cart | Static "1 LICENSE", no stepper |
| Cart summary | none | composed | not applicable | Default, updating, full | Cart | Total plus the no-tax line |
| Checkout summary | none | composed | not applicable | Default, submitting | Checkout | Read-only lines |
| License key field | none | mono text plus copy button | not applicable | Idle, copied | Confirmation, Library, Orders | Label "LICENSE KEY", copy confirms inline |
| Order accordion | none | native `<button aria-expanded>` with a panel | not applicable | Collapsed, expanded | Orders | Deep link expands one |
| State page | none | composed React component | not applicable | Empty, error, not found, success | All pages | One sentence, one action, no illustration |
| Inline notice | none | plain React | not applicable | Info, warning, error, success | Home, cart, checkout, login | `role="status"` or `role="alert"` as appropriate |
| Skeleton | none | CSS only | not applicable | Loading | Home, detail, cart, checkout, library, orders | Final-size blocks, no shimmer sweep |
| Skip link | none | native `<a>` | not applicable | Hidden, focused | All pages | First focusable element |
| Footer | none | plain React | not applicable | Default | Home, detail, library, orders, not found | Omitted on Login, Checkout, Confirmation |

## Assets

| Asset | Location in Figma | Format | Note |
|---|---|---|---|
| Paladin wordmark | None; not in the reference (the reference shows the Spyker mark) | SVG | Missing. Until supplied, the wordmark is set as "PALADIN" in Oswald 500, uppercase, letter-spacing 0.28em. Deferred to build, not blocking |
| Hero stills | None; the reference photography is third-party and not licensed for reuse | AVIF and WebP with JPEG fallback, responsive `srcset`, 2400x1350 and 1200x675 | Build uses `https://picsum.photos/seed/paladin-hero/2400/1350`. Production stills are commissioned assets. The LCP image is preloaded and never lazy |
| App cover art | None; comes from the seeded catalog record | 3:4, AVIF and WebP plus JPEG, 1200x1600 max | First featured cover eager, the rest lazy. Alt text is the app name |
| App screenshots | None; from the catalog record | 16:9, same format policy | Lead plus thumbnails; alt text names the app and the screen |
| UI icons | None | SVG from Phosphor or Tabler, 1.5px stroke, 20px | Hamburger, cart, close, chevron down, chevron left and right, star, copy, check, trash, eye, eye-off, arrow right. No hand-rolled paths |
| Display font | None | Oswald variable woff2, SIL Open Font License | Self-hosted, preloaded latin subset, `font-display: swap` |
| Body font | None | Inter woff2 400, 500, 600, SIL Open Font License | Self-hosted, `font-display: swap` |
| Favicon and app icon | None | SVG plus 192px and 512px PNG | Derived from the wordmark once it exists; until then a white "P" on `color/canvas` |
| Not-found illustration | None | - | Not needed: the state page is type-only, consistent with the reference |

## Open design gaps

All items below were put to the designer with this map on 2026-11-11. The
designer confirmed the derived screens and asked for the build to proceed, so
none of them blocks close-out; each is intentionally deferred to build or to
asset delivery.

| Gap | Owner | Status |
|---|---|---|
| No Figma file exists. The reference is the Spyker Cars site, which is a car brand, not a storefront | designer | Deferred by instruction 2026-11-11: every screen is derived from the reference style; this map is the agreed design record until a Figma file exists |
| Paladin wordmark and favicon | designer | Deferred to asset delivery. The wordmark is set in Oswald until the SVG arrives |
| Cinematic hero stills and app artwork | designer / content owner | Deferred to build and content. Picsum placeholders in development, seeded cover URLs in production. Spyker's photography is not licensed for reuse |
| Only 1440x900 reference captures exist | designer | Deferred to build: the responsive rules per page above are the agreed behavior; they are not drawn |
| The reference's light editorial band (REF-02) is not adopted | designer | Resolved 2026-11-11: one dark theme is locked by the brief; the band's type and pacing are kept, its canvas is not |
| No component library (`REQ-049` excludes nexcomponent-ui) | frontend | Accepted: plain React plus native HTML; no third-party UI package is required by this design |
| Password reveal, copy-to-clipboard, and catalog state in the URL are not in the spec | designer | Confirmed 2026-11-11 as sensible defaults; they add no business behavior |
| License keys are shown in full on Library, Orders and confirmation | designer | Confirmed 2026-11-11: the buyer owns the key; a reveal toggle would add friction without hiding anything from the signed-in user |

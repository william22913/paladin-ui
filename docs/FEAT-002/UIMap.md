---
feature_code: FEAT-002
service: paladin
version: 1
status: complete
spec_version: 1
figma_files:
  - url: "no Figma file; design source is the shipped paladin-ui storefront built for FEAT-001 (branch feat/FEAT-001)"
    file_key: "paladin-ui-feat-FEAT-001"
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
pr_url: https://github.com/william22913/sandbox-docs/pull/39
last_updated: 2026-11-11
---

# UI Map — FEAT-002

FEAT-002 adds a private, per-buyer wishlist to the existing Paladin
storefront. A signed-in buyer saves an app from a catalog card or its product
page, reviews saved apps on a dedicated Wishlist page, removes entries, and
moves an entry to the existing cart. The list survives logout and other
devices, and a successful checkout removes the purchased apps from it.
Requirements live in `spec.md` v1 (`REQ-001` to `REQ-051`); this document
records the surfaces those requirements imply and every design decision a
frontend developer needs to build them in plain React.

The feature is a continuation, not a new visual direction. It adds one page,
one control on two existing surfaces, and one destination in navigation. Cart
and Checkout are unchanged.

## Figma sources

**There is no Figma file for this feature.** The designer's instruction in the
task brief is that the wishlist screens must follow the look of the existing
`paladin-ui` pages (dark, Spyker-style). The design source is therefore the
shipped FEAT-001 storefront itself: its tokens, its component anatomy and its
page rhythm. The FEAT-001 `UIMap.md` and `paladin-ui/DESIGN.md` are the design
record for that system; this map adapts them, and does not re-open them.

| Ref | Where | Role | What it shows |
|---|---|---|---|
| REF-01 | `paladin-ui` at `feat/FEAT-001`, `src/components/app/AppCard.tsx` and its CSS module | Style and layout reference for the **catalog card** and the new save control | Square hairline card, 3:4 cover, 10px category label, Oswald card title, publisher, price plus rating, and an actions row that holds one secondary button or an owned/in-cart state line |
| REF-02 | `src/components/app/PurchasePanel.tsx` | Style reference for the **product page action panel** | Sticky aside, price and rating head, full-width actions, an error line under the actions, a muted note at the bottom |
| REF-03 | `src/components/app/CartLine.tsx`, `src/pages/CartPage.tsx`, `src/pages/pages.module.css` | Layout reference for the **Wishlist page** | Page head with a display title and a count, hairline-ruled list rows on `96px minmax(0,1fr) auto`, a remove text button, an inline warning notice, and empty, error and skeleton states |
| REF-04 | `src/components/app/TopBar.tsx`, `MenuDialog.tsx`, `Footer.tsx`, `AppShell.tsx` | Style reference for **navigation** | Fixed 72/60px bar with hamburger, centered wordmark and cart; a full-screen `<dialog>` menu; a footer nav; a skip link and a main landmark |
| REF-05 | `src/pages/LibraryPage.tsx` | Style reference for a **second content page** | Page head plus count, a list of owned apps, and the empty, error and skeleton rhythm |
| REF-06 | `src/styles/tokens.css`, `paladin-ui/DESIGN.md` | The token and type record | All color, type, spacing, shape, easing and z-index values used below |

No reference above is a drawn wishlist screen; each is an existing Paladin
surface. There is no live Figma API call and no file key.

Provenance words used in every table below:

- `figma` - not used. There is no Figma file, so no row can claim to be read
  from a frame.
- `designer` - stated by the designer: the task brief's instruction to match
  the existing `paladin-ui` pages, plus the FEAT-002 behaviours the designer
  confirmed in planning on 2026-11-11.
- `derived` - adapted from an existing Paladin component or from the FEAT-001
  design record to a surface neither draws.
- `assumed` - not used. Nothing in this map is unbacked; any later addition
  gets an `assumed` tag and blocks close-out until the designer confirms it.

## Requirement mapping

Every active `REQ-*` in `spec.md` v1 is accounted for below. `Follows` names
the existing surface the row adapts; no row points at a drawn frame because
none exists. `State` names the visible state that satisfies the requirement.

| REQ | Requirement | Page / surface | State | Follows | Source | Note |
|---|---|---|---|---|---|---|
| REQ-001 | Every catalog card and app detail page has a save control | Home card, App detail panel | Unsaved, saved | REF-01, REF-02 | designer, derived | One control per card; on the detail it sits under the add-to-cart action |
| REQ-002 | The control reflects saved state and toggles removal | Home card, App detail panel | Saved, unsaved | REF-01, REF-02 | designer, derived | Toggle button with `aria-pressed`; saved state arrives with the app data |
| REQ-003 | Saving a saved app is a harmless no-op | Home card, App detail panel | Saved | REF-01 | designer, derived | No second entry and no error; the control stays saved |
| REQ-004 | Removing an unsaved app is a harmless no-op | Home card, App detail panel | Unsaved | REF-01 | designer, derived | No error; the control stays unsaved |
| REQ-005 | Both entry points act on one per-buyer list | Home, App detail, Wishlist | Saved | REF-01, REF-02 | designer, derived | There is no per-surface list; Wishlist is the only list view |
| REQ-006 | An owned app can be saved | Home card, App detail panel | Owned and saved | REF-01 | designer, derived | The save control stays enabled next to the owned tag |
| REQ-007 | Every action gives immediate feedback; failures are readable | All three surfaces | Saving, saved, failed | REF-01, REF-02, REF-03 | designer, derived | Optimistic toggle with a revert on failure; one error line per surface |
| REQ-008 | A dedicated wishlist page lists every saved app | Wishlist | Default | REF-03 | designer, derived | New route `/wishlist`, inside the session guard |
| REQ-009 | Each entry shows cover, name, publisher, current IDR price, rating | Wishlist row | Default | REF-03 | designer, derived | Cart row anatomy plus the rating line |
| REQ-010 | Entries are ordered newest-saved first | Wishlist list | Default | REF-03 | designer, derived | Order comes from the API and is never re-sorted in the UI |
| REQ-011 | Remove from the page; the removal persists | Wishlist row | Removing, removed | REF-03 | designer, derived | The row disappears and a status line confirms it |
| REQ-012 | Reachable from the main navigation | Menu, Footer | Default | REF-04 | designer, derived | Wishlist sits between Catalog and My Library; no header icon |
| REQ-013 | Move adds to the cart and removes from the wishlist | Wishlist row | Moving, moved | REF-03 | designer, derived | One "Move to cart" action per row; the page does not navigate |
| REQ-014 | Already in the cart: still remove, no duplicate, confirm | Wishlist row | In cart, moved | REF-03 | designer, derived | In-cart tag at rest; the same move action; the confirmation links to the cart |
| REQ-015 | A full cart blocks the move with a clear message | Wishlist row, page notice | Cart full | REF-03 | designer, derived | The page warns at rest at the cap and the row names the reason on attempt |
| REQ-016 | An owned app blocks the move with a clear message | Wishlist row | Owned | REF-03 | designer, derived | "You already own this app."; the entry stays on the list |
| REQ-017 | Auth is required; sign in and return | Guard, Navigation | Anonymous, expired | REF-04 | designer, derived | Reuses `RequireAuth` with `next=/wishlist` |
| REQ-018 | A wishlist is private; foreign data is not-found | Wishlist, Not found | Not found | REF-03 | designer, derived | The page takes no buyer id; a 404 renders the shared not-found state |
| REQ-019 | Stored per account; survives logout and other devices | Wishlist | Default | REF-03 | designer, derived | Every load reads the server list; no client cache is the source of truth |
| REQ-020 | A successful checkout removes purchased apps | Wishlist after checkout | Default | - | designer, derived | The next load simply lacks them; Checkout gains no new UI |
| REQ-021 | The price shown is the current catalog price | Wishlist row | Default | REF-03 | designer, derived | Price is read from the catalog on each load; no saved price is shown |
| REQ-022 | One entry per buyer and app | Wishlist list, card control | Saved | REF-03 | designer, derived | The control is a toggle, not an add button; the list never repeats an app |
| REQ-023 | An unknown app id is rejected as not-found | Inline error on the acting surface | Unknown app | REF-03 | designer, derived | "That app is no longer in the catalog."; nothing else changes |
| REQ-024 | No separate wishlist size cap in v1 | - | - | - | designer, derived | No counter, no cap state, no size notice anywhere |
| REQ-025 | The owner always comes from the session | - | - | - | designer, derived | The UI sends no buyer identifier and has no buyer picker |
| REQ-026 | No free-text or numeric inputs | - | - | - | designer, derived | The only input is an app id chosen from an existing card or row |
| REQ-027 | Empty state explains the list and offers the catalog | Wishlist empty | Empty | REF-03 | designer, derived | State block: title, one sentence, one action |
| REQ-028 | Load failure shows a readable error with retry | Wishlist error | Error | REF-03 | designer, derived | Shared `LoadError`; never a raw error or stack trace |
| REQ-029 | An app may be in the cart and the wishlist independently | Home card, App detail, Wishlist row | In cart and saved | REF-01, REF-03 | designer, derived | Both indicators show at once; a move only removes the list entry |
| REQ-030 | An owned app stays visible; the move is blocked | Wishlist row | Owned | REF-03 | designer, derived | Owned tag at rest; the move attempt shows the reason and the row stays |
| REQ-031 | Session expiry redirects and the list stays intact | Guard, Navigation | Expired | REF-04 | designer, derived | `next=/wishlist`; the list reloads after sign-in |
| REQ-032 | A price change appears on the next load | Wishlist row | Default | REF-03 | designer, derived | Same rule as REQ-021; no "price changed" callout |
| REQ-033 | An unknown app id on save or move changes nothing | Inline error | Unknown app | REF-03 | designer, derived | Same copy as REQ-023; the row and the cart do not change |
| REQ-034 | A foreign wishlist request returns not-found | Not found | Not found | - | designer, derived | No route or control exposes another buyer's list |
| REQ-035 | Depends on FEAT-001 auth and server sessions | Guard, Top bar | Anonymous, signed in | REF-04 | designer, derived | No new identity UI |
| REQ-036 | Depends on the seeded catalog for display fields | Wishlist row, card | Default | REF-03 | designer, derived | Cover, name, publisher, category, price and rating come from the catalog |
| REQ-037 | Depends on the cart rules: quantity 1, cap 20, owned blocked | Wishlist row | Cart full, owned | REF-03 | designer, derived | The move reuses the cart's pre-checks and messages; there is no second cart UI |
| REQ-038 | Depends on a successful checkout for cleanup | Wishlist after checkout | Default | - | designer, derived | A failed checkout removes nothing and shows no cleanup notice |
| REQ-039 | Extends paladin-code and paladin-ui; no nexcommon or nexcomponent | - | - | - | designer, derived | Reflected in Components: plain React only |
| REQ-040 | The OpenAPI contract gains wishlist operations before implementation | - | - | - | designer, derived | This map names the display data the UI needs; the contract names the fields |
| REQ-041 | No other services or integrations | - | - | - | designer, derived | No integration screen, consent screen or redirect |
| REQ-042 | P1; all wishlist behaviour ships in this pass | All surfaces | - | - | designer, derived | Every surface below is in scope |
| REQ-043 | Deferred: everything in Non-Goals | - | - | - | designer, derived | Deliberately absent: no badge, no sharing, no bulk action, no sort |
| REQ-044 | Save from a card and from the product page; one entry each | Home, App detail, Wishlist | Saved | REF-01, REF-02 | designer, derived | Acceptance for REQ-001 to REQ-007 |
| REQ-045 | Saved apps persist across logout and devices | Wishlist | Default | REF-03 | designer, derived | Acceptance for REQ-019 |
| REQ-046 | Removal persists across reload and later login | Wishlist row | Removed | REF-03 | designer, derived | Acceptance for REQ-011 |
| REQ-047 | A move adds and removes; an already-in-cart move still removes | Wishlist row | Moved | REF-03 | designer, derived | Acceptance for REQ-013 and REQ-014 |
| REQ-048 | A refused move keeps the item and shows the reason | Wishlist row | Cart full, owned | REF-03 | designer, derived | Acceptance for REQ-015 and REQ-016 |
| REQ-049 | Checkout removes purchased apps | Wishlist after checkout | Default | - | designer, derived | Acceptance for REQ-020 |
| REQ-050 | Another buyer's list is never visible; it is not-found | Not found | Not found | - | designer, derived | Acceptance for REQ-018 and REQ-034 |
| REQ-051 | Empty, load-error and expired-session states behave | Wishlist empty, Wishlist error, Login | Empty, error, expired | REF-03, REF-04 | designer, derived | Acceptance for REQ-027, REQ-028 and REQ-031 |

### Requirements without UI

| REQ | Reason |
|---|---|
| REQ-024 | No size cap means no counter, no cap state and no size notice. The seeded catalog of 12 apps bounds the list; adding a counter would imply a limit that does not exist. |
| REQ-025 | The owner is taken from the session server-side. The UI sends no buyer id and has no account picker, so there is no surface to design. |
| REQ-026 | The wishlist has no user-entered fields. Its only input is an app id chosen from an existing card or row, so there is no form, no validation copy and no input state. |
| REQ-039 | A stack constraint with no visual output. It is reflected in the Components table, where every row is plain React. |
| REQ-040 | A contract dependency with no screen. It is recorded under `## Open design gaps`: `/code-preparation` extends `paladin-code/api/openapi.yaml` before `/fe-dev` starts. |
| REQ-041 | No sibling service and no external integration, so there is no integration screen, consent screen or redirect. |
| REQ-042 | Priority is a scheduling fact, not a surface. Every behaviour it names is mapped above. |
| REQ-043 | The deferred items have no UI by design: no disabled teaser, no "coming soon" badge, no placeholder sort control. Their absence is the deliverable. |

### Frames without a requirement

| Frame | What it is | Decision |
|---|---|---|
| REF-01 App card | The existing catalog card, shipped in FEAT-001 | Style and layout reference for the save control and its states. It is the surface being extended, not a wishlist screen. |
| REF-02 Purchase panel | The existing product-page action panel | Reference for the detail-page control, its label change and its error line. |
| REF-03 Cart page and line | The existing cart list and its states | Reference for the Wishlist page list, its notices, its empty state and its skeleton. |
| REF-04 Navigation | The existing top bar, menu and footer | Reference for the new destination. The bar itself is unchanged. |
| REF-05 Library page | The existing owned-apps page | Reference for the page-head and state rhythm of a second content page. |
| REF-06 Tokens | `tokens.css` and `DESIGN.md` | The value record this map reuses. No value is re-invented. |

## Pages

Four surfaces change or appear: Home (catalog), App detail, the new Wishlist
page, and navigation. Cart and Checkout are listed as unchanged because the
feature touches them only through behaviour the buyer does not see on those
screens. Every page is behind the session guard (`REQ-017`).

### Home (catalog) — change

**Purpose:** the existing catalog gains one control per card so a buyer can
save an app without opening it (`REQ-001`, `REQ-002`, `REQ-005`, `REQ-006`).

**Roles:** signed-in buyer. No variation by role.

**Entry / exit:** unchanged. Entry from `/` after login or from the wordmark.
Exit to `/apps/:appId` from the card, `/cart` from the header, `/wishlist`
from the menu or footer. The wishlist control never navigates.

**Content and fields (new or changed only)**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Wishlist control | icon toggle, 44x44, over the cover | - | One per card, on every catalog and featured card; top-right of the cover, inset 12px; solid `color/canvas` fill with a 1px `color/border-control` edge so legibility never depends on the art; `aria-pressed`; accessible name is "Save {app} to your wishlist" when unsaved and "Remove {app} from your wishlist" when saved; it sits above the card's stretch link and never opens the detail (`REQ-001`, `REQ-002`) | designer, derived |
| Wishlist status | visually hidden live line, `role="status"` | - | Announces "Saved to your wishlist." or "Removed from your wishlist." after the control's state changes; sighted buyers read the icon state instead (`REQ-007`) | derived |
| Card error line | inline text, `role="alert"` | - | The existing card error slot and style; adds "That app could not be saved. Try again." and "That app is no longer in the catalog." (`REQ-007`, `REQ-033`) | derived |

All other card fields are unchanged from FEAT-001: cover, category, name,
publisher, price, rating, owned line, in-cart line and add-to-cart button.

**Actions**

- Press the wishlist control: toggles immediately (optimistic). The icon
  switches, the accessible name switches, and the hidden status line
  announces the result. On failure the control reverts and the card error line
  names the failure (`REQ-002`, `REQ-007`).
- Press the add-to-cart button: unchanged; it does not touch the wishlist
  (`REQ-029`).
- Open the card: unchanged; the wishlist control stops the event before the
  card link (`REQ-001`).
- The control is present and enabled on owned and in-cart cards (`REQ-006`,
  `REQ-029`).

**States**

| State | Treatment | Source |
|---|---|---|
| Default, unsaved | Outline bookmark, 18px, `color/text`, canvas fill, control border | derived |
| Saved | Solid white bookmark with a canvas-coloured check, button border to `color/text`; stays until toggled (`REQ-002`) | derived |
| In flight | The icon already shows the target state; repeat presses are ignored while the request runs; `aria-busy="true"`; no spinner | derived |
| Failed | The control reverts to the previous state; the error line appears under the card actions (`REQ-007`) | derived |
| Owned | The owned line is unchanged; the wishlist control stays enabled beside it (`REQ-006`) | designer, derived |
| In cart | The in-cart line and the wishlist control can both be present (`REQ-029`) | designer, derived |
| Unknown app | The error line reads "That app is no longer in the catalog." (`REQ-033`) | derived |
| Skeleton | The existing card skeleton gains a 44x44 square in the cover's top-right corner so the final layout does not shift | derived |

**Responsive**

- 1440 and wider: 3-column grid; the control is 44x44 at a 12px inset.
- 1024 to 1439: 2-column grid; unchanged control.
- 768 to 1023: 2-column grid; unchanged control.
- 360 to 767: 1-column grid; unchanged control and inset. The control is
  never hidden or revealed on hover, so touch buyers always see it.
- Hover styling is gated to `@media (hover: hover) and (pointer: fine)`.

**Frames used:** none drawn. Follows REF-01.

**Screen spec** (follows REF-01)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Card frame | Keep | 1px `color/hairline`, 3:4 cover, 18px body, poster type scale | derived | REQ-001 |
| Cover art | Keep | 3:4, hover scale 1.03, no scrim added | derived | REQ-001 |
| Wishlist control | Add | 44x44 icon toggle at the cover's top-right, 12px inset, above the stretch link, solid canvas fill, control border, bookmark outline or filled | derived | REQ-001, REQ-002, REQ-007 |
| Category, name, publisher | Keep | Unchanged | derived | REQ-001 |
| Price and rating | Keep | Unchanged; the wishlist row repeats the same values | derived | REQ-009 |
| Add to cart, owned line, in-cart line | Keep | Unchanged; the wishlist control coexists with all three | derived | REQ-006, REQ-029 |
| Card error line | Keep | Same slot and style; two new strings | derived | REQ-007, REQ-033 |
| Featured rail | Keep | Reuses the same card, so the save control appears there with no extra work | derived | REQ-001 |
| Header cart badge | Keep | Unchanged; no wishlist badge is added in the header | designer | REQ-043 |

### App detail — change

**Purpose:** the product page gains the same save control in its action panel,
so a buyer can save an app while inspecting it (`REQ-001`, `REQ-002`,
`REQ-005`).

**Roles:** signed-in buyer.

**Entry / exit:** unchanged. Entry from a card or a direct `/apps/:appId`.
Exit to `/cart`, `/library`, or back. The wishlist button never navigates.

**Content and fields (new or changed only)**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Wishlist button | secondary button, full width, 48px desktop and 44px phone | - | Below the add-to-cart action, with an 8px gap; outline bookmark plus "Save to wishlist" when unsaved; solid bookmark plus "Saved to wishlist" when saved; `aria-pressed`; the visible label is the state, and pressing a pressed button removes the app (`REQ-002`) | designer, derived |
| Wishlist status | visually hidden live line, `role="status"` | - | Announces "Saved to your wishlist." or "Removed from your wishlist." (`REQ-007`) | derived |
| Wishlist error | inline line, `role="alert"` | - | The existing panel error slot: "That app could not be saved. Try again." or "That app is no longer in the catalog." (`REQ-007`, `REQ-033`) | derived |

**Actions**

- Press the wishlist button: optimistic toggle, label and icon switch, hidden
  announcement. A failed request reverts the label and shows the panel error
  (`REQ-002`, `REQ-007`).
- Press add to cart: unchanged. It does not touch the wishlist, and an app may
  be in both (`REQ-029`).
- Buy an owned app: unchanged; the wishlist button stays enabled on an owned
  app (`REQ-006`).

**States**

| State | Treatment | Source |
|---|---|---|
| Default, unsaved | Secondary button, outline bookmark, "Save to wishlist" | derived |
| Saved | Secondary button, solid bookmark with a canvas check, "Saved to wishlist", pressed | derived |
| In flight | Label shows the target state; repeat presses ignored; `aria-busy="true"`; no spinner | derived |
| Failed | Reverts and shows the error line under the actions (`REQ-007`) | derived |
| Owned | The owned branch of the panel is unchanged; the wishlist button is added below it and stays enabled (`REQ-006`) | designer, derived |
| In cart | The in-cart branch is unchanged; the wishlist button is added below it (`REQ-029`) | designer, derived |
| Loading | The existing panel skeleton; the wishlist button appears with the panel, never before it | derived |
| Not found | The shared not-found state; no panel and no wishlist button (`REQ-023`, `REQ-033`) | designer, derived |

**Responsive**

- 1440 and wider: sticky aside; the panel grows by the 48px button plus the
  8px gap.
- 768 to 1439: same, narrower aside.
- 360 to 767: the panel is the existing sticky bottom panel. The wishlist
  button is full width and 44px, stacked under the add-to-cart action; the
  panel grows by 52px, which keeps both actions reachable without an
  overflow menu. The panel never covers the page title.

**Frames used:** none drawn. Follows REF-02.

**Screen spec** (follows REF-02)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Price and rating head | Keep | Unchanged | derived | REQ-009 |
| Add to cart button | Keep | Unchanged, still the only white primary action in the panel | derived | REQ-001 |
| Wishlist button | Add | Full-width secondary button below the add action, 48px, icon plus state label | derived | REQ-001, REQ-002 |
| Owned branch | Keep | Owned tag and "View in my library" link; the wishlist button is added below | derived | REQ-006 |
| In-cart branch | Keep | In-cart tag and cart link; the wishlist button is added below | derived | REQ-029 |
| Error line | Keep | Same slot; adds the two wishlist failure strings | derived | REQ-007, REQ-033 |
| Muted note | Keep | "One license key per purchase. Keys appear in My Library." unchanged | derived | REQ-001 |
| Secondary navigation | Remove | No new tab, section or route is added to the detail page | designer | REQ-043 |

### Wishlist — new page

**Purpose:** the one place that lists every app the buyer saved, newest first,
with the two actions that matter: remove, or move to the cart (`REQ-008`,
`REQ-011`, `REQ-013`).

**Roles:** signed-in buyer. No other roles exist in v1.

**Entry / exit:**
- Entry: `/wishlist` from the menu or the footer on any page (`REQ-012`).
- Exit: a row's name or cover to `/apps/:appId`; "View cart" in a move
  confirmation to `/cart`; the empty-state action to `/`; the menu to any
  other destination. Remove and move stay on the page.

**Layout**

The page has no summary aside, unlike the cart, so the list does not stretch
across the 1440px container. The page head, the notices and the list all sit
in one 720px measure column, left aligned inside the container. This
keeps row lines readable and gives the actions a stable right edge.

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Page title | display text | - | "Wishlist", Oswald uppercase, `type/display-lg` through the shared page-title clamp; one word | designer, derived |
| Count | text, tabular numbers | - | "N apps" from the shared `appCount` helper; no denominator, because the wishlist has no cap (`REQ-024`) | derived |
| Wishlist row | list item | - | One per saved app; `96px minmax(0,1fr) auto` desktop; hairline between rows; the cover links to the detail | designer, derived |
| Cover | 3:4 image, 96px wide | - | From the catalog record; `alt=""` because the name link carries the accessible name | derived |
| Name | link | - | Oswald `type/display-sm`, links to `/apps/:appId` (`REQ-009`) | derived |
| Publisher and category | meta line | - | "Publisher · Category", `type/body-sm`, `color/text-secondary` (`REQ-009`) | derived |
| Rating | stars plus value | - | The shared `Rating` component; visible numeric value, accessible "Rated X out of 5" (`REQ-009`) | derived |
| Price | price label | - | Current catalog price in IDR, tabular numbers; "FREE" at zero; never a saved snapshot (`REQ-009`, `REQ-021`) | derived |
| Owned tag | tag | - | Shown when the app is in the buyer's library; it does not remove the row (`REQ-030`) | designer, derived |
| In-cart tag | tag | - | Shown when the app is already in the cart; the move still removes the row (`REQ-014`, `REQ-029`) | designer, derived |
| Move to cart | secondary button, 44px | - | One per row; label "Move to cart" and "Moving" in flight; disabled only while its own request runs (`REQ-013`, `REQ-014`) | designer, derived |
| Remove | text button with a trash icon, 44px | - | One per row; label "Remove" and "Removing" in flight; `color/text-secondary`, `color/text` on hover, matching the cart line (`REQ-011`) | designer, derived |
| Row message | inline text, `role="alert"` | - | Under the row actions when a move is blocked or an action fails; the row stays (`REQ-015`, `REQ-016`, `REQ-007`) | derived |
| Page notice | inline notice | - | Above the list: a warning at rest when the cart holds 20 apps; a success confirmation after a move or a remove; an error when the list action fails (`REQ-007`, `REQ-014`, `REQ-015`) | derived |
| Empty state | state block, centered | - | Title "Your wishlist is empty.", text "Save apps you want to come back to and they will appear here.", action "Browse the catalog" (`REQ-027`) | designer, derived |
| Load error | shared state block with retry | - | The existing `LoadError`: one sentence and "Try again"; never a raw error (`REQ-028`) | derived |
| Skeleton | CSS blocks | - | Three rows shaped like the final rows: 96x128 cover, two text lines, two action blocks; `aria-busy="true"` | derived |

**Actions**

- Load: fetch the session buyer's list on mount and on retry. Render in the
  order the API returns; never sort in the browser (`REQ-010`, `REQ-019`).
- Move to cart: if the app is owned, show "You already own this app." and do
  not call the API (`REQ-016`). If the cart already holds 20 apps, show the
  cart's existing full message and do not call the API (`REQ-015`). Otherwise
  call move, remove the row, and show a success notice: "Moved to your cart."
  with a "View cart" link (`REQ-013`, `REQ-014`).
- Remove: call remove, remove the row, and show "Removed from your wishlist."
  (`REQ-011`).
- Open a row: name or cover opens the detail. The row itself is not a link,
  so the two buttons never need to swallow a navigation event.
- No sort, no filter, no search, no pagination, no select-all, no bulk move,
  no "add all to cart" (`REQ-043`).

**States**

| State | Treatment | Source |
|---|---|---|
| Loading | Skeleton rows under the real page head; no spinner | derived |
| Default | Page head, optional notice, list of rows | designer, derived |
| Empty | State block replaces the list; the head still shows "0 apps" (`REQ-027`) | designer, derived |
| Load error | `LoadError` replaces the list, with "Try again" (`REQ-028`) | derived |
| Move in flight | That row's button reads "Moving", is disabled, and the rest of the list stays interactive | derived |
| Remove in flight | That row's button reads "Removing", is disabled, and the rest of the list stays interactive | derived |
| Moved | Row disappears; success notice with "View cart" (`REQ-013`, `REQ-014`) | designer, derived |
| Removed | Row disappears; success notice; no undo (`REQ-011`) | derived |
| Blocked, cart full | Row message with the cart's existing full message; page warning present at rest (`REQ-015`) | designer, derived |
| Blocked, owned | Row message "You already own this app."; the owned tag is already visible (`REQ-016`, `REQ-030`) | designer, derived |
| Action failed | Row message with a readable sentence; the row stays; the notice carries the same failure | derived |
| Unknown app | Row message "That app is no longer in the catalog."; no other change (`REQ-023`, `REQ-033`) | derived |
| Session expired | Redirect to login with `next=/wishlist`; the list is intact after sign-in (`REQ-031`, `REQ-019`) | derived |
| After checkout | Purchased apps are absent on the next load; no cleanup notice is shown (`REQ-020`) | designer, derived |

**Responsive**

- 1440 and wider: 720px content column, 64px top padding, 96px covers.
- 1024 to 1439: same column; gutters narrow to 40px.
- 768 to 1023: same column; the row keeps three columns while the actions
  fit; the buttons stack vertically in the side column if the name needs the
  space.
- 360 to 767: 72px covers, 14px gap, the side column becomes a full-width row
  under the text: price first, then the two actions right aligned; gutters
  24px; page head margin 28px.
- 480 and below: the two actions become full-width 48px buttons, "Move to
  cart" first and "Remove" last; the row message sits under them.
- Hover styling is gated to `@media (hover: hover) and (pointer: fine)`.

**Frames used:** none drawn. Follows REF-03 and REF-05.

**Screen spec** (follows REF-03)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Page frame | Add | Container gutters, one 720px content column, 64px top padding, page fade on route change | derived | REQ-008 |
| Page head | Add | Display title "Wishlist" plus "N apps", hairline under, 40px gap to the list | derived | REQ-008 |
| Page notice | Add | Inline notice above the list: warning, success or error | derived | REQ-007, REQ-014, REQ-015 |
| List | Add | One row per saved app in API order, hairline between rows, no card containers | derived | REQ-008, REQ-010 |
| Row cover | Add | 96px 3:4, links to the detail, no hover zoom in a list | derived | REQ-009 |
| Row text | Add | Name link, publisher and category, rating | derived | REQ-009 |
| Row price | Add | Current IDR price from the catalog | derived | REQ-009, REQ-021 |
| Row tags | Add | Owned tag and in-cart tag, the same components as the card | derived | REQ-014, REQ-029, REQ-030 |
| Move to cart | Add | Secondary button per row | derived | REQ-013, REQ-014 |
| Remove | Add | Text button with a trash icon per row | derived | REQ-011 |
| Row message | Add | Error line under the row actions | derived | REQ-015, REQ-016, REQ-033 |
| Empty state | Add | Centered state block with one action to the catalog | derived | REQ-027 |
| Error state | Add | Shared `LoadError` with retry | derived | REQ-028 |
| Skeleton | Add | Three final-size row skeletons | derived | REQ-028 |
| Summary aside | Remove | No totals, no fee lines, no checkout action: a wishlist is not a purchase | designer | REQ-043 |
| Header count badge | Remove | No wishlist count in the top bar | designer | REQ-043 |
| Sort, filter, search, bulk | Remove | Not in this pass | designer | REQ-043 |

### Cart and Checkout — unchanged

**Purpose:** record what does not change, so the builder does not add UI here.

| Surface | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Cart | Keep | Cart lines, totals, the cap notice and the empty state are unchanged. A moved app simply appears as a normal cart line. | designer | REQ-013, REQ-037 |
| Checkout | Keep | No wishlist mention, no cleanup notice, no new step. A successful checkout removes purchased apps server-side. | designer | REQ-020, REQ-038 |
| Order confirmation | Keep | Unchanged. No wishlist link or notice is added. | designer | REQ-020 |

## Navigation

| From | Trigger | To |
|---|---|---|
| Any page | Menu, "Wishlist" | `/wishlist` (`REQ-012`) |
| Any page | Footer, "Wishlist" | `/wishlist` (`REQ-012`) |
| Any page | Wishlist with no session | `/login?next=/wishlist` (`REQ-017`) |
| Wishlist | Session expires during load or an action | `/login?next=/wishlist&reason=expired` (`REQ-031`) |
| Login | After the expiry redirect, valid credentials | `/wishlist`, list intact (`REQ-031`) |
| Home card | Wishlist control | Same page; the control and the hidden status update (`REQ-001`, `REQ-002`) |
| App detail | Wishlist button | Same page; the label and icon update (`REQ-001`, `REQ-002`) |
| Wishlist | Row name or cover | `/apps/:appId` |
| Wishlist | "Move to cart" | Same page; the row is removed and a notice offers "View cart" (`REQ-013`, `REQ-014`) |
| Wishlist | "View cart" in the move notice | `/cart` (`REQ-014`) |
| Wishlist | "Remove" | Same page; the row is removed (`REQ-011`) |
| Wishlist | Empty state action | `/` (`REQ-027`) |
| Wishlist | Load error, "Try again" | Same route, refetch (`REQ-028`) |
| Checkout | Successful order, then Wishlist | Purchased apps are absent (`REQ-020`) |
| Wishlist | A stale row names an unknown app | Stays on the page; the row shows the not-found message (`REQ-033`) |
| Any page | Browser Back | The previous URL; the list refetches from the server (`REQ-019`) |

Menu order becomes Catalog, Wishlist, My Library, Orders, then Sign out. The
footer nav gains the same link in the same position. The top bar is
unchanged: no wishlist icon and no count badge (`REQ-043`). The footer is
shown on `/wishlist`, because the page is not `/checkout` and not an order
detail.

## Motion & interaction catalog

The new motion is feedback for a control and a one-line state change. It uses
the existing easing variables and stays under 300ms. Nothing loops, nothing
moves the layout, and every entry collapses under
`prefers-reduced-motion: reduce`. Existing motions that apply unchanged are
referenced by their FEAT-001 ids (MO-004 press, MO-005 focus, MO-011 skeleton,
MO-012 route fade, MO-015 hover, MO-016 reduced motion).

| ID | Trigger | Element | Effect | Duration | Easing | Frame | Source |
|---|---|---|---|---|---|---|---|
| MO-101 | toggle resolved | Wishlist control icon | The bookmark crossfades from outline to solid and scales 0.92 to 1; never from 0 | 160ms | `ease-out` | - | derived |
| MO-102 | action resolved | Status line or page notice | Fades in from 0 to 1; the card and detail status is visually hidden; a page notice stays until the next action | 160ms | `ease-out` | - | derived |
| MO-103 | action failed | Card error, panel error, row message | Fades in; no shake, no colour flash on the row or the page | 160ms | `ease-out` | - | derived |
| MO-104 | hover, fine pointer | Card wishlist control | Background steps to `color/surface-raised`; border brightens to `color/text` | 200ms | `ease-out` | - | derived |
| MO-105 | press | Wishlist control, move, remove | `scale(0.985)`; reuses MO-004 | 120ms | `ease-out` | - | derived |
| MO-106 | keyboard focus | All new controls | 2px `color/focus` ring with a 2px canvas offset; reuses MO-005 | 120ms | `linear` | - | derived |
| MO-107 | request in flight | Row actions | Label swaps to "Moving" or "Removing"; the button dims to the existing disabled style and is disabled; no spinner | 160ms | `ease-out` | - | derived |
| MO-108 | row removed | List row | No exit animation: the row is removed and the list closes the gap in one step, so the page does not reflow twice | instant | - | - | derived |
| MO-109 | loading | Skeleton rows | Opacity pulses 0.45 to 0.9; reuses MO-011 | 1400ms loop | `ease-in-out` | - | derived |
| MO-110 | reduced motion | All of the above | Transforms removed; opacity capped at 120ms; the icon swap becomes instant; skeletons static at 0.7 | 120ms | `linear` | - | derived |

There is no toast, no slide-in drawer, no confetti, no count-up, no skeleton
shimmer sweep, and no animation on page scroll.

## Design tokens

**No new tokens.** Every value below already exists in
`paladin-ui/src/styles/tokens.css` and is recorded in the FEAT-001 map. The
wishlist keeps the same Design Read, because it continues the same product
rather than launching a new visual language.

Design Read: **a first-party storefront for desktop-software buyers, with a
cinematic black editorial language, leaning toward a dark-luxury automotive
system with zero radius and generous pacing.**

Dials: `DESIGN_VARIANCE 7 / MOTION_INTENSITY 5 / VISUAL_DENSITY 3`. The
wishlist adds no visual density: one list, one action pair per row, generous
vertical rhythm.

**References:** taste-skill `design-taste-frontend` (Design Read, dials, dark
theme protocol, interactive states, contrast, AI tells) and awesome-design-md
**`lamborghini`** (true-black canvas, minimal navigation, uppercase display,
zero radius, one high-contrast action). The project's design system wins
wherever it differs: one action colour, a white action on black, no gold,
dark only.

**Theme lock:** dark only. There is no light theme and no
`prefers-color-scheme` switch. The wishlist inherits the lock; it adds no
surface that assumes a light canvas.

### Color

| Token | Value | Wishlist use | Contrast | Source |
|---|---|---|---|---|
| `color/canvas` | `#0B0B0B` | Page background; the save control's opaque fill over cover art | 18.05:1 with `color/text` | designer |
| `color/surface` | `#141414` | Skeleton blocks, empty state padding area if needed | - | derived |
| `color/surface-raised` | `#1C1C1C` | Hover fill of the overlay save control | - | derived |
| `color/hairline` | `#2A2A2A` | Row dividers on the Wishlist page | 1.37:1; decoration only, never a control edge | derived |
| `color/border-control` | `#6A6A6A` | The save control's 1px edge; secondary button borders | 3.64:1 on canvas, above the 3:1 non-text minimum | derived |
| `color/text` | `#F5F5F5` | Row names, prices, icons, button labels | 18.05:1 on canvas | designer |
| `color/text-secondary` | `#B3B3B3` | Publisher line, remove label, count, helper copy | 9.39:1 on canvas | derived |
| `color/text-muted` | `#8C8C8C` | Muted helper text only | 5.85:1 on canvas | derived |
| `color/action` | `#FFFFFF` | The filled saved bookmark; the detail page keeps white for add-to-cart only | - | designer |
| `color/on-action` | `#0B0B0B` | The check inside the filled bookmark | 19.68:1 | designer |
| `color/error` | `#F26B5E` | Row messages, card and panel error lines, error notice | 6.60:1 on canvas, 6.18:1 on surface | derived |
| `color/success` | `#4ADE80` | Move and remove confirmations; owned tag | 11.30:1 on canvas | derived |
| `color/warning` | `#E8B84B` | Cart-full notice above the list | 10.67:1 on canvas | derived |
| `color/focus` | `#FFFFFF` | 2px focus ring, 2px canvas offset | - | derived |

One action colour only: white. The saved bookmark is the only new use of
`color/action` outside a button, and it is a state indicator rather than a
second call to action. Status colours are never decoration.

### Typography

| Token | Value | Wishlist use | Source |
|---|---|---|---|
| `font/display` | Oswald 400 and 500, uppercase | Page title, row names | designer |
| `font/body` | Inter 400, 500, 600 | Meta lines, buttons, notices | designer |
| `type/display-lg` | Oswald 400, 72/66 desktop, 40/38 phone, line-height 0.95 | "Wishlist" page title, through the shared clamp | designer |
| `type/display-sm` | Oswald 500, 24/23 desktop, 20/19 phone, line-height 1.05 | Row name | derived |
| `type/body-sm` | Inter 400, 14px, line-height 1.5 | Publisher and category, count, remove label | derived |
| `type/body` | Inter 400, 16px, line-height 1.65 | Empty-state sentence, error notice | derived |
| `type/button` | Inter 600, 13px, uppercase, tracking 0.12em | Move to cart; the save button on the detail page | derived |
| `type/price` | Oswald 500, 20px, tabular numbers | Row price | derived |
| `type/caption` | Inter 400, 12px, line-height 1.4 | Row error line is 13px, matching the panel error; notices are 14px | derived |

The display font is never synthesised bold, and Inter is never used for a
display heading. No new type size is introduced.

### Spacing, shape, elevation

| Token or value | Value | Wishlist use | Source |
|---|---|---|---|
| `space` scale | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 | All gaps and padding | derived |
| Existing composition values | 18px card body padding, 20px cart row gap, 96px row cover, 72px phone cover | Reused so the wishlist rows line up with the existing cart rows | derived |
| `container` | max-width 1440px; gutters 64/40/24 | Page shell | derived |
| Content column | 720px, left aligned in the container | Page head, notices and list; the page has no summary aside | derived |
| `radius` | 0 on every element | Control, button, row, notice, skeleton | designer |
| `border/control` | 1px solid `color/border-control` | Save control edge, secondary buttons | derived |
| `border/divider` | 1px solid `color/hairline` | Row dividers, page-head rule | derived |
| `elevation` | None | Depth from tone and hairlines, never shadow | derived |
| `focus ring` | 2px `color/focus` plus 2px `color/canvas` offset | Every new control | derived |
| `hit target` | 44x44 minimum; 48px primary actions on phones | Save control, move, remove | derived |
| `header` | 72px desktop, 60px phone | Unchanged | derived |
| `breakpoints` | 480, 768, 1024, 1280, 1440, 1920 | Responsive rules per surface above | derived |

**Shape lock:** every corner is square, including the save control and both
row actions. No pill, no rounded card, no circular icon button.

**Contrast checks (measured, inherited from FEAT-001):** the save control's
white icon on its opaque canvas fill is 19.68:1 regardless of the cover art
behind it; its 1px control border is 3.64:1. Error text is 6.60:1, success
11.30:1, warning 10.67:1, secondary text 9.39:1. The hairline is 1.37:1 and is
never the only sign of a control.

## Components

`paladin-ui` is plain React and `REQ-039` excludes nexcomponent-ui and
nexcommon. There is no Figma file, so there are no `Code` properties and no
import paths to invent. Every row is **not applicable** rather than an
invented import; the builder owns the implementation. Two components are new,
one is an existing component with a new variant, and the rest are reused
unchanged.

| Component | Figma `Code` and variants | nexcomponent export (import path) | Resolution status | States | Used on | Note |
|---|---|---|---|---|---|---|
| Wishlist button | none; one component, variant `overlay` or `block` | not applicable, plain React | not applicable | Unsaved, saved, in flight, failed, disabled | Card, detail panel | One implementation for both placements; `overlay` is the 44x44 icon toggle, `block` is the full-width labelled button; `aria-pressed` |
| Wishlist row | none | not applicable, plain React | not applicable | Default, owned, in cart, moving, removing, blocked, failed | Wishlist | Composed from the cart-line anatomy; owns its own message slot |
| Wishlist page | none | not applicable, plain React | not applicable | Loading, default, empty, error | Wishlist | Page head, notices, list, states |
| Button | none | native `<button>` with variants | not applicable | Default, hover, pressed, focus, disabled | Detail panel, rows | Existing secondary variant at 48px and 44px; no new variant |
| Rating | none | icon library, clipped fill | not applicable | 0 to 5 | Wishlist row | Existing component and accessible value |
| Price label | none | plain React formatter | not applicable | Normal, FREE at zero | Wishlist row | Existing IDR formatter |
| Owned tag | none | plain span | not applicable | Owned | Wishlist row | Existing success-colour tag |
| In-cart tag | none | plain span | not applicable | In cart | Wishlist row | Existing tag with the bag icon |
| Inline notice | none | plain React | not applicable | Success, warning, error | Wishlist page | Existing component; `role="status"` or `role="alert"` by tone |
| State block | none | composed React | not applicable | Empty | Wishlist empty | Existing component, centered |
| Load error | none | composed React | not applicable | Error | Wishlist error | Existing `LoadError`, one sentence and one retry |
| Skeleton | none | CSS only | not applicable | Loading | Wishlist | Final-size blocks, no shimmer sweep |
| App card | none | composed React | not applicable | Adds saved and saving | Home | Existing card plus the overlay button; the stretch link stays |
| Purchase panel | none | composed React | not applicable | Adds saved and saving | App detail | Existing panel plus the block button |
| Menu | none | native `<dialog>` plus React state | not applicable | Closed, opening, open, closing | All pages | Gains the Wishlist link |
| Footer | none | plain React | not applicable | Default | Home, detail, wishlist, library, orders, not found | Gains the Wishlist link |
| App shell | none | plain React | not applicable | Signed in | All pages | Unchanged; `/wishlist` shows the footer |

No third-party UI package is added. Icons come from the icon family already
in `package.json` (see `## Assets`).

## Assets

| Asset | Location in Figma | Format | Note |
|---|---|---|---|
| Bookmark icon, unsaved | None | `Bookmark` from `lucide-react`, 18px, strokeWidth 1.5, outline | Already a dependency; no new package |
| Bookmark icon, saved | None | `BookmarkCheck` from `lucide-react`, 18px, `fill="currentColor"`, stroke `color/canvas` | A solid white bookmark with a canvas-coloured check, so the state reads without relying on colour alone |
| Trash icon | None | `Trash2` from `lucide-react`, 15px, strokeWidth 1.5 | Already used by the cart line |
| In-cart icon | None | `ShoppingBag` from `lucide-react`, 15px | Already used by the in-cart tag |
| Owned icon | None | `Check` from `lucide-react`, 15px | Already used by the owned tag |
| App cover art | None; comes from the seeded catalog record | 3:4, AVIF and WebP plus JPEG, 1200x1600 max | Same policy as the catalog card and the cart line; lazy in the list |
| Display and body fonts | None | Oswald and Inter woff2, already self-hosted | No new font is introduced |
| Illustrations | None | - | Not needed: the empty and error states are type-only, like the cart |
| Export images (`ui/**`) | None | - | No frame images are exported; there is no Figma file to export from |

The FEAT-001 map named Phosphor or Tabler as the icon families. The shipped
application uses `lucide-react` at `strokeWidth={1.5}`, and this map records
that as the real family. One family only; no icon is hand-drawn.

## Open design gaps

| Gap | Owner | Status |
|---|---|---|
| There is no Figma file. The design source is the shipped FEAT-001 storefront | designer | Deferred by the task brief on 2026-11-11: match the existing pages. This map is the agreed design record; no frame will be drawn for this pass |
| The wishlist operations do not exist in `paladin-code/api/openapi.yaml` yet | code preparation | Dependency, not a UI gap: `REQ-040` puts the contract extension before implementation. The UI needs a saved-state flag on app summaries and a list endpoint returning id, name, publisher, category, cover, current price, rating, owned and in-cart flags; the contract names the fields |
| No header wishlist icon or count badge | designer | Accepted by `REQ-043`. The menu and footer are the only entry points; a buyer on the catalog reaches the page in two taps |
| Removed rows have no exit animation | designer | Accepted: an instant close avoids a double reflow and matches the catalog's instant results swap (MO-013). Revisit only if motion polish is requested |
| The save control sits on variable cover art | designer | Resolved: its fill is opaque `color/canvas` and its edge is `color/border-control`, so its contrast does not depend on the art |
| Inherited composition values (18px card padding, 20px cart row gap) are off the 4px scale | designer | Accepted: matching the existing rows wins over normalising the scale in this pass. No new value is introduced |
| A wishlist entry has no saved date shown | designer | Accepted: the list is already newest-first (`REQ-010`); a date adds noise without helping the decision to buy |

## Polish review

| Check | Result |
|---|---|
| Typography hierarchy | One display title, one row name scale, one meta scale, one price scale; no new size |
| Dark theme protocol | Inherits the locked dark theme; no surface assumes light; every text pair is at or above AA |
| Interaction states | Every new control has default, hover (fine pointer), pressed, focus-visible, in flight, saved or unsaved, and failure; no control is left with a success-only state |
| Empty, loading and error | All three are designed for the new page; the empty state offers a way out; the error state has a retry and no raw error |
| AI tells | No gradient, no glass, no shadow, no rounded corner, no purple accent, no card-in-card, no emoji, no decorative icon |
| Motion restraint | One 160ms feedback and one 200ms hover; no loop, no toast, no exit animation; reduced motion honoured |
| Accessibility | 44x44 targets, `aria-pressed` on both toggles, live-region confirmations, visible focus ring, action-first accessible names on the icon-only control, state-first visible labels on the labelled control |
| Consistency with FEAT-001 | Same tokens, same row anatomy as the cart, same notice and state components, same 720px measure, same zero radius |
| Copy tone | Sentence case in prose, uppercase through type styles; no exclamation marks; failure copy names the condition and the next step |
| Scope discipline | No sort, filter, badge, sharing, bulk action, notification or guest state; every deferred item is absent rather than disabled |

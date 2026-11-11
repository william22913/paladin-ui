---
feature_code: FEAT-002
service: paladin
spec_version: 1
source: UIMap.md
last_updated: 2026-11-11
---

# FEAT-002 - Design Brief (paladin)

## Overview

A private, per-buyer wishlist for the existing Paladin storefront, for
signed-in buyers. One new page (`/wishlist`), one save control on every
catalog card, the same control on the app detail page, and one new
destination in the menu and footer. Cart and Checkout are unchanged. The
wishlist holds saved apps `REQ-001` to `REQ-021`, shows the current catalog
price, survives logout and other devices, and is cleaned up by a successful
checkout.

The design source is **not a Figma file**. The designer's instruction in the
task brief is that the wishlist screens must follow the look of the existing
`paladin-ui` pages (dark, Spyker-style). The source is therefore the shipped
FEAT-001 storefront, its tokens and its component anatomy, recorded in
`UIMap.md`. The wishlist is a continuation, not a new visual direction.

Routes: `/wishlist` new; `/`, `/apps/:appId`, `/cart`, `/checkout`, `/login`,
`/library` and `/orders` unchanged.

## Brand Identity

The Paladin identity is unchanged: dark-luxury editorial, closer to a car
marque's launch site than to a software marketplace. True black canvas, a
single white action, tall condensed uppercase display type, hairline rules
instead of shadowed cards, and generous vertical space. The wishlist adds no
accent colour, no illustration, no badge and no new surface tone.

Design Read: **a first-party storefront for desktop-software buyers, with a
cinematic black editorial language, leaning toward a dark-luxury automotive
system with zero radius and generous pacing.**

Dials: `DESIGN_VARIANCE 7`, `MOTION_INTENSITY 5`, `VISUAL_DENSITY 3`.

Reference: awesome-design-md **`lamborghini`** for rhythm and the minimal
navigation, and taste-skill `design-taste-frontend` for the dark-theme
protocol and interaction-state discipline. No marks, no copy, no gold accent.
The project's own system wins wherever it differs.

Theme is locked dark, with no light mode and no toggle.

## Color Palette

No new tokens. The wishlist uses the existing palette only.

| Token | Value | Where used |
|---|---|---|
| `color/canvas` | `#0B0B0B` | Page background; the save control's opaque fill over cover art |
| `color/surface` | `#141414` | Skeleton blocks |
| `color/surface-raised` | `#1C1C1C` | Hover fill of the overlay save control |
| `color/hairline` | `#2A2A2A` | Row dividers and the page-head rule, decoration only |
| `color/border-control` | `#6A6A6A` | Save-control edge and secondary button borders |
| `color/text` | `#F5F5F5` | Row names, prices, icons, labels |
| `color/text-secondary` | `#B3B3B3` | Publisher line, remove label, count |
| `color/text-muted` | `#8C8C8C` | Muted helper text only |
| `color/action` | `#FFFFFF` | The filled saved bookmark |
| `color/on-action` | `#0B0B0B` | The check inside the filled bookmark |
| `color/error` | `#F26B5E` | Row messages, card and panel error lines |
| `color/success` | `#4ADE80` | Move and remove confirmations, owned tag |
| `color/warning` | `#E8B84B` | Cart-full notice above the list |
| `color/focus` | `#FFFFFF` | 2px focus ring, 2px canvas offset |

One action colour only: white. The saved bookmark is the only new use of
`color/action` outside a button, and it is a state indicator. Status colours
are never decoration. Measured contrast is recorded in `UIMap.md`; the
control's white icon on its opaque fill is 19.68:1 whatever the cover art
behind it, and its 1px edge is 3.64:1.

## Typography

| Role | Value |
|---|---|
| Display font | Oswald 400 / 500, uppercase |
| Body and UI font | Inter 400 / 500 / 600 |
| Page title | Oswald 400, 72/66px desktop, 40/38px phone, line-height 0.95 |
| Row name | Oswald 500, 24/23px desktop, 20/19px phone, line-height 1.05 |
| Meta line, count | Inter 400, 14px, line-height 1.5 |
| Body, notices | Inter 400, 16px, line-height 1.65 |
| Button | Inter 600, 13px uppercase, tracking 0.12em |
| Price | Oswald 500, 20px, tabular numbers |
| Row error | Inter 400, 13px, line-height 1.5 |

No new type size. Oswald is never synthesised bold, and Inter is never used
for a display heading.

## Spacing and Shape

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (4px base).
- Content column: **720px**, left aligned in the 1440px container. The page
  has no summary aside, so the list does not stretch; row lines stay readable
  and the actions keep one right edge.
- Inherited composition values: 18px card body padding, 20px cart row gap,
  96px desktop row cover and 72px phone cover. Reused so the wishlist rows
  line up with the existing cart rows.
- **Radius lock: 0 everywhere.** Save control, buttons, rows, notices,
  skeletons. No pill, no circular icon button.
- Borders: 1px `color/border-control` for controls, 1px `color/hairline` for
  dividers. The hairline is 1.37:1 and never identifies a control alone.
- Elevation: none. Depth comes from tone and hairlines, never shadow.
- Hit targets: 44x44 minimum; 48px for the primary actions of the page on
  phones.
- Breakpoints: 480, 768, 1024, 1280, 1440, 1920. Per-surface rules are in
  `UIMap.md`.

## Components

`paladin-ui` is plain React and `REQ-039` excludes nexcomponent-ui and
nexcommon. There is no Figma file, so there are no `Code` properties and no
import paths to invent. Two components are new, one existing component gains
a variant, and the rest are reused unchanged.

| Component | Resolution status | Used on |
|---|---|---|
| Wishlist button (variants `overlay` and `block`, toggle with `aria-pressed`) | plain React, new | Catalog card, detail panel |
| Wishlist row | plain React, new | Wishlist |
| Wishlist page | plain React, new | Wishlist |
| Button (secondary 48px and 44px) | plain React, existing | Detail panel, rows |
| Rating, price label, owned tag, in-cart tag | plain React, existing | Wishlist rows |
| Inline notice, state block, load error, skeleton | plain React, existing | Wishlist states |
| App card | plain React, existing plus the overlay button | Home |
| Purchase panel | plain React, existing plus the block button | App detail |
| Menu, footer | plain React, existing plus one link | All pages |

Icons come from `lucide-react` at `strokeWidth={1.5}`, the family already in
`package.json`: `Bookmark` outline when unsaved, `BookmarkCheck` filled white
with a canvas-coloured check when saved, `Trash2` for remove, and the
existing owned and in-cart glyphs. No new image, font or illustration is
needed.

## States and Motion

Per surface, from `UIMap.md`:

- **Catalog card:** unsaved, saved, in flight, failed, owned and saved, in
  cart and saved, unknown app, skeleton (`REQ-001` to `REQ-007`, `REQ-029`,
  `REQ-033`).
- **App detail panel:** unsaved, saved, in flight, failed, owned, in cart,
  loading, not found (`REQ-001`, `REQ-002`, `REQ-006`, `REQ-007`, `REQ-029`).
- **Wishlist page:** loading, default, empty, load error, moving, removing,
  moved, removed, blocked by a full cart, blocked as owned, action failed,
  unknown app, expired session, after checkout (`REQ-008` to `REQ-016`,
  `REQ-020`, `REQ-027`, `REQ-028`, `REQ-031`).
- **Navigation:** menu and footer gain "Wishlist"; no header icon and no
  count badge (`REQ-012`, `REQ-043`).

Copy for the page: title "Wishlist", count "N apps", empty title "Your
wishlist is empty.", empty text "Save apps you want to come back to and they
will appear here.", empty action "Browse the catalog", move "Move to cart",
remove "Remove", confirmations "Moved to your cart." and "Removed from your
wishlist.", blocked owned "You already own this app.", unknown app "That app
is no longer in the catalog."

| Motion | Duration | Easing |
|---|---|---|
| Bookmark outline to solid, scale 0.92 to 1 | 160ms | `ease-out` |
| Status or notice fades in | 160ms | `ease-out` |
| Error line fades in, no shake | 160ms | `ease-out` |
| Overlay control hover (fine pointer) | 200ms | `ease-out` |
| Button press, 0.985 | 120ms | `ease-out` |
| Focus ring | 120ms | `linear` |
| Row removed | instant, no exit animation | - |
| Skeleton pulse | 1400ms loop | `ease-in-out` |
| Reduced motion | opacity capped at 120ms, transforms removed | `linear` |

No toast, no drawer, no confetti, no shimmer sweep, no scroll animation.

## Open design gaps

- There is no Figma file. The shipped FEAT-001 storefront is the agreed
  style source, and `UIMap.md` is the design record for this pass.
- `paladin-code/api/openapi.yaml` must gain the wishlist operations before
  implementation (`REQ-040`). The UI needs a saved-state flag on app
  summaries and a list endpoint returning id, name, publisher, category,
  cover, current price, rating, owned and in-cart flags; the contract names
  the fields.
- No header icon or count badge, by `REQ-043`. The menu and footer are the
  entry points.
- Removed rows close instantly. Accepted to avoid a double reflow; revisit
  only if motion polish is requested.
- The save control's contrast does not depend on the cover art, because its
  fill is opaque and its edge uses the control border token.

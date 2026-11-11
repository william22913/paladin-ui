---
feature_code: FEAT-001
service: paladin
spec_version: 1
source: UIMap.md
last_updated: 2026-11-11
---

# FEAT-001 - Design Brief (paladin)

## Overview

A cinematic, black-canvas storefront for desktop software, for seeded
signed-in buyers only. Nine screens: Login, Home (hero, featured apps,
search, category browsable catalog), App detail, Cart, Checkout, Order
confirmation, My Library, Orders, and Not found. There is no sign-up, no
admin, no real payment, no fulfillment (`REQ-052`): the product sells license
keys and stores them in My Library.

Routes: `/login`, `/` with `?q=` and `?category=`, `/apps/:appId`, `/cart`,
`/checkout`, `/orders/:orderId?placed=1`, `/orders/:orderId`, `/library`,
`/orders`, and `*`.

The design source is **not a Figma file**. It is the Spyker Cars site
(https://www.awwwards.com/sites/spyker-cars, live
https://www.spykercars.com), supplied as four 1440x900 screenshots. Those
screenshots are style and layout references only, and their photography is
third-party copyrighted. Every Paladin screen is derived from that style and
confirmed by the designer on 2026-11-11. The full record is in `UIMap.md`.

## Brand Identity

Dark-luxury editorial, closer to a car marque's launch site than to a software
marketplace: a true black canvas, a single white action, tall condensed
uppercase display type, full-bleed cinematic photography, black margins, and
hairlines instead of cards with shadows. The tone is quiet and confident, not
crowded: generous vertical space, one action per band, and nothing competing
with the cover art.

Design Read: **a first-party storefront for desktop-software buyers, with a
cinematic black editorial language, leaning toward a dark-luxury automotive
system with zero radius and generous pacing.**

Dials: `DESIGN_VARIANCE 7`, `MOTION_INTENSITY 5`, `VISUAL_DENSITY 3`.

Reference: awesome-design-md **`lamborghini`** for rhythm, state vocabulary
and the minimal top bar. No marks, no copy, no gold accent. Reference
screenshots win wherever they show a value.

Theme is locked dark. There is no light mode and no toggle: the brief fixes
the black canvas, so the dual-mode default is deliberately overridden.

## Color Palette

| Token | Value | Where used |
|---|---|---|
| `color/canvas` | `#0B0B0B` | Page background everywhere |
| `color/canvas-deep` | `#000000` | Hero letterbox and login backdrop, under the scrim |
| `color/surface` | `#141414` | Cards, inputs, panels, menu base |
| `color/surface-raised` | `#1C1C1C` | Hover and pressed surfaces, expanded order body |
| `color/hairline` | `#2A2A2A` | Decorative dividers and card borders only |
| `color/border-control` | `#6A6A6A` | Input and outline-button borders (3.64:1 on canvas) |
| `color/text` | `#F5F5F5` | Headings and body |
| `color/text-secondary` | `#B3B3B3` | Meta lines, captions, secondary body |
| `color/text-muted` | `#8C8C8C` | Placeholders and helper text |
| `color/action` | `#FFFFFF` | The single primary action fill |
| `color/on-action` | `#0B0B0B` | Text on the white action |
| `color/on-image` | `#FFFFFF` | Text over photographs, above the scrim |
| `color/scrim` | `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.72))` | Behind hero and cover text |
| `color/scrim-login` | `rgba(0,0,0,0.65)` | Full overlay on the login still |
| `color/error` | `#F26B5E` | Field errors, error blocks (6.60:1 on canvas) |
| `color/success` | `#4ADE80` | "OWNED", copy confirmation (11.30:1) |
| `color/warning` | `#E8B84B` | Cart-full notice (10.67:1) |
| `color/focus` | `#FFFFFF` | 2px focus ring, 2px canvas offset |
| `color/overlay` | `rgba(0,0,0,0.72)` | Menu scrim and dialog backdrop |

One action colour only: white. Status colours are never decoration. No accent
hue is introduced. Measured contrast is recorded in `UIMap.md`; every text
pair is at or above AA, and the control border clears the 3:1 non-text
minimum.

## Typography

| Role | Value |
|---|---|
| Display font | Oswald 400 / 500, variable, uppercase |
| Body / UI font | Inter 400 / 500 / 600 |
| Key font | `ui-monospace`, 14px, tabular |
| Hero H1 | Oswald 400, 120/108px desktop, 56/54px phone, line-height 0.9, three words maximum |
| Page title | Oswald 400, 72/66px desktop, 40/38px phone, line-height 0.95 |
| Section title | Oswald 400, 40/38px desktop, 28/27px phone |
| Card title | Oswald 500, 24px desktop, 20px phone |
| Eyebrow | Oswald 400, 12px uppercase, tracking 0.18em, one per band, at most 1 per 3 bands |
| Hero subcopy | Inter 400, 18px, line-height 1.6 |
| Body | Inter 400, 16px, line-height 1.65 |
| Body small | Inter 400, 14px, line-height 1.5 |
| Field label | Inter 500, 11px uppercase, tracking 0.14em |
| Button | Inter 600, 13px uppercase, tracking 0.12em |
| Price | Oswald 500, 20px, tabular numbers |
| Caption | Inter 400, 12px |

Oswald is never synthesised bold, and Inter is never used for display
headings. Both self-hosted as woff2 with `font-display: swap`; the Oswald
latin subset is preloaded.

## Spacing and Shape

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (4px base).
- Section padding: 128px desktop, 96px tablet, 56px phone.
- Container: max-width 1440px; gutters 64px desktop, 40px tablet, 24px
  phone. Long-form measure 720px.
- **Radius lock: 0 everywhere.** Buttons, inputs, cards, dialogs, images. No
  pill, no rounded card. The cart badge is the one square exception with a
  1px white border, because a count needs a container.
- Borders: 1px `color/border-control` for controls, 1px `color/hairline` for
  decoration. The hairline is 1.37:1, so it never identifies a control on its
  own.
- Elevation: none. Depth comes from surface tone and hairlines, never shadow.
- Header 72px desktop, 60px phone. Hit targets 44x44 minimum, 48px for
  primary actions on phones.
- Breakpoints: 480, 768, 1024, 1280, 1440, 1920. Only 1440 is drawn; smaller
  layouts are derived and specified per screen in `UIMap.md`.
- Focus: 2px white ring with a 2px canvas offset; a 2px canvas inner ring
  then the white ring on the white action.

## Components

`paladin-ui` is plain React and `REQ-049` excludes nexcomponent-ui and
nexcommon. There is no Figma file, so there are no `Code` properties and no
import paths to invent. Everything below is built from native HTML
(`<dialog>`, `<input>`, `<button>`) plus composed React, with no third-party
UI package required.

| Component | Resolution status | Used on |
|---|---|---|
| App shell (header, main, footer, skip link) | plain React | All pages |
| Top bar (hamburger, centered wordmark, cart) | plain React | All pages |
| Full-screen menu | native `<dialog>` plus React state | All pages |
| Wordmark | unresolved (SVG missing; set in Oswald) | Header, footer, login |
| Cart button and badge | plain React | All pages |
| Button (primary white, outline, ghost, destructive text) | plain React | All pages |
| Icon button | plain React | Header, copy actions |
| Text field, password field with reveal | plain React | Login |
| Search field with clear, debounced | plain React | Home |
| Category tabs | plain React, `aria-current` | Home |
| App card | plain React (composed) | Home |
| App rail (scroll-snap, arrows, no autoplay) | plain React | Home |
| Rating stars | icon library, clipped fill | Card, detail |
| Price label (IDR, FREE at zero) | plain React | Many |
| Owned tag | plain React | Card, detail |
| Screenshot gallery | plain React (composed) | App detail |
| Purchase panel | plain React | App detail |
| Cart line, cart summary | plain React | Cart |
| Checkout summary | plain React | Checkout |
| License key field with copy | plain React | Confirmation, Library, Orders |
| Order accordion | native `<button aria-expanded>` | Orders |
| State page (empty, error, not found, success) | plain React (composed) | All pages |
| Inline notice | plain React | Login, Home, Cart, Checkout |
| Skeleton | CSS only | Home, detail, cart, checkout, library, orders |
| Footer | plain React | Home, detail, library, orders, not found |

Only the wordmark is an unresolved external asset. Everything else is a build
decision, not a library decision.

## States and Motion

Per screen, from `UIMap.md`:

- **Login:** default, submitting, field invalid, credentials rejected (one
  generic message), session expired (`REQ-001`-`REQ-004`, `REQ-006`,
  `REQ-032`, `REQ-033`, `REQ-043`).
- **Home:** default, skeleton rail and grid, no search match, empty
  category, section-level error with retry, partial failure, owned app, cart
  full (`REQ-007`-`REQ-011`, `REQ-014`, `REQ-018`-`REQ-020`, `REQ-037`,
  `REQ-038`, `REQ-041`).
- **App detail:** default, loading, error, not found, owned, in cart, cart
  full (`REQ-012`-`REQ-014`, `REQ-018`-`REQ-020`, `REQ-041`).
- **Cart:** default, loading, empty, error, removing, remove failed, full
  (`REQ-015`-`REQ-017`, `REQ-020`, `REQ-021`, `REQ-036`, `REQ-039`).
- **Checkout:** default, loading, submitting, ownership conflict naming the
  apps, generic error with retry, empty-cart redirect (`REQ-021`-`REQ-026`).
- **Order confirmation:** success, plain order view, loading, not found,
  error (`REQ-023`, `REQ-024`, `REQ-027`, `REQ-031`, `REQ-044`).
- **My Library:** default, loading, empty, error, copy feedback (`REQ-029`,
  `REQ-031`, `REQ-040`).
- **Orders:** collapsed, expanded, loading, empty, deep-link not found,
  error (`REQ-028`, `REQ-030`, `REQ-031`, `REQ-040`, `REQ-044`).
- **Not found:** one state (404 label, title, one sentence, one action).

Motion values recorded in the map:

| Motion | Duration | Easing |
|---|---|---|
| Hero still fade and 1.04 to 1 scale, once | 1400ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Section reveal, 24px rise, 60ms stagger, once | 600ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Card hover, cover to 1.03 | 400ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Button press, 0.985 | 120ms | `ease-out` |
| Focus ring | 120ms | `linear` |
| Menu open, 24px slide, 40ms item stagger | 500ms (scrim 300ms) | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Menu close | 300ms | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Cart badge bump and "ADDED" label | 300ms, hold 1500ms | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Copy label to "COPIED" | 160ms, hold 1500ms | `ease-out` |
| Order accordion | 300ms | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Skeleton pulse | 1400ms loop | `ease-in-out` |
| Route fade | 200ms | `linear` |
| Results change | instant; count announced with `aria-live="polite"` | - |

All motion is `transform` and `opacity` only, gated to
`@media (hover: hover) and (pointer: fine)` for hover, and removed under
`prefers-reduced-motion: reduce` (opacity capped at 120ms). No autoplay
carousel, no parallax, no scroll-jacking, no cursor effect, no sound, no
scroll cue, no cookie banner.

## Open design gaps

Confirmed by the designer on 2026-11-11:

- There is no Figma file. The four Spyker screenshots are the agreed style
  references, and every screen in `UIMap.md` is the confirmed record.
- The reference's white editorial band, sound toggle, scroll cue and cookie
  banner are deliberately not carried over: one dark theme, no audio, no
  marketing chrome.
- Paladin wordmark and favicon are deferred to asset delivery; the wordmark
  is set in Oswald 500 with 0.28em tracking until then.
- Hero stills and app artwork are placeholders in development (picsum and
  seeded cover URLs) and commissioned assets before launch. Spyker's own
  photography is not licensed for reuse.
- Only 1440x900 captures exist; the per-screen responsive rules are agreed
  behavior, not drawn frames.
- Password reveal, copy-to-clipboard, and catalog state in the URL are
  confirmed as sensible defaults. They add no business behavior.

Still deferred:

- Component exports are not applicable rather than unresolved: `REQ-049`
  excludes nexcomponent-ui, so `/fe-dev` builds every component in plain
  React and resolves nothing against a house library.

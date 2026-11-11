# Paladin — design reference (FEAT-001)

Design read: premium desktop-software storefront for design-conscious buyers,
Spyker-style dark luxury, black canvas + condensed uppercase display, leaning
toward a token-driven custom system (plain React + CSS Modules; no
nexcomponent-ui, no Ant Design).

## Tokens (`src/styles/tokens.css`)

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#0B0B0B` | page background |
| `--surface` | `#141414` | cards, panels, summary |
| `--text` | `#FFFFFF` | headings, primary copy |
| `--text-secondary` | `#A3A3A3` | metadata, helper copy |
| `--action` | `#FFFFFF` | sole primary action fill |
| `--error` / `--success` / `--warning` | `#F26B5E` / `#4ADE80` / `#E8B84B` | state color |
| `--hairline` / `--border-control` | `#2A2A2A` / `#6A6A6A` | separators / control edges |
| radius | `0` | everything is square |
| container | `1440px` | max width |

Type: Oswald 400/500 for display, always uppercase with wide tracking; Inter
400/500/600 for body and UI. Both self-hosted through `@fontsource` imports in
`src/main.tsx` (no Google Fonts link).

Spacing: 64/40/24 gutters, 128/96/56 section padding, 72/60 header, 44/48
targets. Motion: hero 1400ms fade/scale, reveals 600ms +24px with 60ms stagger
(capped at six), 200ms route fade, 300ms accordion and badge, `0.16,1,0.3,1`
easing; every animation collapses to 120ms and reveals bypass on
`prefers-reduced-motion`.

## Layout

- Home: full-bleed hero (image + scrim + Oswald headline + white CTA), featured
  rail with scroll-snap arrows, then search + category tabs + 3/2/1 grid.
- App detail: cover hero inset by gutters, 2fr/1fr body, 16:9 lead screenshot
  with 112px thumbnails (hidden below 768), sticky purchase panel.
- Cart/checkout: 8/4 and 7/5 grids, sticky summary, mobile stacks to one column.
- Login: full-bleed still with `--overlay` scrim, centered wordmark, single
  narrow form column.
- Header: hamburger + Menu label, centered wordmark, cart badge; transparent
  over the home hero, solid after scroll, native `<dialog>` menu.

## Components

Custom primitives in `src/components/ui`: Button, IconButton, Field /
PasswordField, SearchField, PriceLabel, Rating, Tag, InlineNotice, Skeleton,
StateBlock, LicenseKeyField, LinkButton, ArtImage (fallback art).

Composed in `src/components/app`: AppShell, TopBar, MenuDialog, Footer,
Wordmark, AppCard, AppRail, CategoryTabs, ScreenshotGallery, PurchasePanel,
CartLine, CartSummary, OrderAccordion, Reveal, BootScreen, LoadError,
NotFoundState. Icons are lucide-react at `strokeWidth={1.5}`.

## Deliberate deviations

- Featured rail reuses the full `AppCard` (publisher + add action included),
  broader than the UIMap's cover/name/category/price/rating list.
- Cart and checkout summaries are static blocks on phones rather than a fixed
  bottom bar.
- Login scrim uses the 0.72 `--overlay` token rather than the UIMap's 0.65.
- `/orders/:orderId` renders the order as a full view; the Orders page
  expands the same content in an accordion rather than navigating.

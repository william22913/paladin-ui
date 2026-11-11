# FEAT-002 Wishlist — motion plan

Design read: a private wishlist inside the existing dark, Spyker-style Paladin
storefront, for signed-in buyers on one account, in the language of
FEAT-001's zero-radius, high-contrast system. Dials are inherited from the
existing product, not reset: variance 6, motion 3, density 4. This is a
continuation, so no new motion vocabulary is introduced.

## Applied catalog entries

| UIMap | Where | Implementation |
|---|---|---|
| MO-101 | Wishlist control icon | The icon is wrapped in `styles.wishlistIcon`; the wrapper's `key` flips with the saved state, so `wishlist-icon-in` (160ms `ease-out`, opacity 0.6→1, scale 0.92→1) replays on each resolved toggle. Never animates from 0 |
| MO-102 | Status line and page notice | Card and panel status stays `.visually-hidden`; the wishlist page notice runs `wishlist-notice-in` (160ms `ease-out`, opacity 0→1) on the existing `InlineNotice` |
| MO-103 | Card error, panel error, row message | `wishlist-fade-in` (160ms `ease-out`, opacity) on `.cardError`, `.panelError`, `.wishlistMessage`; no shake, no colour flash |
| MO-104 | Card wishlist control, hover | Background steps to `--surface-raised` and border to `--text` on fine pointers (200ms, from the token `ease-out`); reset for touch |
| MO-105 | Press on wishlist, move, remove | Reuses the shared `Button` / `IconButton` `:active` rule (`scale(0.985)`, 120ms) |
| MO-106 | Keyboard focus | Reuses the shared focus-visible ring (2px `--focus`, 2px canvas offset) |
| MO-107 | Request in flight | Row button labels swap to "Moving"/"Removing", both row actions disable, `cursor: progress` on the card control; no spinner, `aria-busy` on the toggles |
| MO-108 | Row removed | No exit animation: the API response replaces the list and the gap closes once |
| MO-109 | Loading | Three skeleton rows shaped like the final row, reusing the shared `Skeleton` pulse |
| MO-110 | Reduced motion | Global `prefers-reduced-motion` rule caps every animation at 120ms, one iteration, and removes reveals; the toggles keep their state change, transform motion is gone |

## Restraint budget

One 160ms feedback (fade / icon), one 200ms hover, one 120ms press. No loop
outside the existing skeleton pulse, no toast, no exit animation, no
page-transition change. Motion is feedback only: nothing moves on load except
the skeletons that were already part of FEAT-001.

## Verification

- The e2e run sets `reducedMotion: 'reduce'`, so every assertion executes
  under the MO-110 path; screenshots are captured with `animations: 'disabled'`.
- `WishlistButton.test.tsx` asserts the optimistic state and the accessible
  busy state that MO-107 exposes; no test depends on animation timing.

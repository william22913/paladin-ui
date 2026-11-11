# FEAT-002 Wishlist — frontend test results

- Service: `paladin` · Feature: `FEAT-002`
- Repository: `william22913/paladin-ui`
- Branch: `feat/FEAT-002-dev-wishlist` (base `feat/FEAT-002`)
- Run date: 2026-11-11
- Contract: approved OpenAPI v1.1.0 inline in the task; no changes requested
  (`GET /wishlist`, `POST /wishlist/items`, `DELETE /wishlist/items/{appId}`,
  `POST /wishlist/items/{appId}/move-to-cart`, `is_wishlisted` on `AppSummary`)

## Environment

| Tool | Version |
|---|---|
| Node | 22.23.4 |
| npm | 10.9.9 |
| React / React Router | 18.2.0 / 6.30.6 |
| Vite | 5.4.21 |
| Vitest | 2.1.9 |
| TypeScript | 5.9.3 |
| @playwright/test | 1.65.0 |
| Chromium (`$NEXAI_CHROMIUM_PATH`) | 156.0.8078.79 |

Playwright launches the preinstalled Chromium through
`launchOptions.executablePath`; no browser download is needed. Docker is not
available in this session, so the nginx stack was verified with
`mcp__nexai_runner__verify_stack` (result below).

## Commands and results

| Command | Result |
|---|---|
| `npm run lint` | 0 errors, 3 pre-existing `react-refresh` warnings (AuthProvider ×2, CartProvider ×1) |
| `npm run typecheck` | pass |
| `npm test` | 27 passed / 4 files |
| `npm run build` | pass (`tsc --noEmit` + vite build) |
| `npx playwright test` | 52 passed (desktop 1440×900 + Pixel 7) |
| `verify_stack` (`docker-compose.verify.yml`) | PASS — web healthy, 3 Newman requests / 5 assertions, 0 failed |

### Unit and component tests (Vitest + RTL)

- `src/core/core.test.ts` — `is_wishlisted` mapping and default; move-to-cart
  envelope → wishlist + cart; contract `category_name` displayed with the slug
  kept; wishlist error copy for `APP_NOT_FOUND`, `CART_FULL`, `ALREADY_OWNED`
  and fallbacks.
- `src/components/app/WishlistButton.test.tsx` — optimistic save before the
  request resolves, accessible `aria-pressed`/`aria-busy`, hidden status
  message, failed-save revert with readable reason, block labels for remove,
  repeat presses ignored while busy.
- `src/pages/WishlistPage.test.tsx` — server order and count, owned move
  blocked without an API call, cart-full move blocked, move replaces the cart
  state and offers "View cart", remove keeps the rest, empty state, load error
  with retry.

### Playwright journeys (API mocked at `**/api/v1/**`)

Card save → reload → wishlist page; product-page save → reload; remove one of
two entries; move to cart plus "View cart"; owned and cart-full move blocked;
empty wishlist → catalog; anonymous `/wishlist` → login with `next`;
`/wishlist` added to the no-console-error tour. Screenshots are captured for
desktop and mobile (`docs/FEAT-002/screenshots/`).

### Contract-mock run (real `mock-server.mjs` on `:4010` via `vite preview`)

Built app served on `:4180` with `API_PROXY_TARGET=http://127.0.0.1:4010`,
driven headless: `GET /api/v1/wishlist` renders 2 rows, count "2 apps", and the
contract `category_name` ("Hinterland Dev · Developer Tools");
`DELETE /wishlist/items/6`, `DELETE /wishlist/items/1` and
`POST /wishlist/items` all return 200 with `{apps,count}` and the UI updates.
`POST /wishlist/items/6/move-to-cart` returns 200.

**Mock-server disclosure:** the generated `mock-server.mjs` compiles its route
matcher without a trailing `$` anchor (`+ '/?'`), so paths are matched by
prefix. `/api/v1/apps/{appId}` is shadowed by `/api/v1/apps`, and the
move-to-cart route is shadowed by `POST /api/v1/wishlist/items`, which is why
its response keys are `{apps,count}` instead of `{wishlist,cart}`. The file is
generated and was not edited. The move envelope is therefore exercised by the
Playwright API mock and the normalizer unit test, not by the contract mock.
The mock also returns static data (a remove or move does not change the next
GET), so list mutation is asserted against the stateful Playwright mock.

## Test case coverage

| TC | Covered by |
|---|---|
| TC-001 | e2e `wishlist saves from a card…` |
| TC-002 | e2e `wishlist saves from the product page…` |
| TC-003 | e2e reload assertions in TC-001/TC-002 journeys |
| TC-004 | contract-mock run (DELETE from card) + `WishlistButton` remove test |
| TC-005 | contract-mock run (DELETE from detail, then save again) |
| TC-006, TC-007 | API-only (backend repo): idempotent save/remove |
| TC-008 | e2e TC-001 (card save → one entry on the page); one list by construction |
| TC-009 | Control renders on owned cards (code path); no separate automated save |
| TC-010 | Unit hidden status + e2e notices |
| TC-011 | Unit failed-save revert + error-message mapping |
| TC-012, TC-013 | e2e wishlist page (links, publisher · category, price); contract-mock run adds category_name |
| TC-014 | Unit `lists the apps and count in server order`; UI never re-sorts |
| TC-015 | Footer/Menu links render (screenshots); no separate assertion |
| TC-016 | e2e remove (stateful mock); persistence is server-side |
| TC-017 | e2e move + `WishlistPage` move test |
| TC-018 | Not automated in UI; server returns the updated cart, which `replace()` applies |
| TC-019 | e2e + unit cart-full block |
| TC-020 | API-only boundary case (needs 20-app fixture) |
| TC-021 | e2e + unit owned block |
| TC-022 | e2e anonymous redirect with `next=%2Fwishlist` |
| TC-023, TC-024, TC-025, TC-026 | API-only (session, privacy, other device) |
| TC-027 | Shared expired-session path covered by the existing e2e test; not re-run mid-wishlist |
| TC-028, TC-029 | Backend checkout cleanup; UI shows the server list on next load |
| TC-030 | Price is rendered from each payload (normalizer test); backend supplies current price |
| TC-031, TC-032, TC-033, TC-034, TC-035 | API-only (backend repo) |
| TC-036 | e2e + unit empty state |
| TC-037 | Unit load error with retry |
| TC-038 | Split across the e2e journeys; checkout cleanup is backend |
| TC-039 | Page renders InCartTag for an in-cart entry (screenshot); no assertion that move still works |
| TC-040 | API-only |

## Design fidelity (UIMap → shipped)

| Surface / rule | UIMap | Shipped |
|---|---|---|
| Page | One 720px column, page head with display title and count, hairline rows | `WishlistPage` with `.wishlistColumn` `min(100%, --measure)`, Oswald title, count |
| Row anatomy | `96px minmax(0,1fr) auto`, cover, name, `publisher · category`, rating, price, state tag, actions | `WishlistRow` grid matches; 72px cover below 768px |
| Card control | 44×44 icon-only overlay at the cover's top-right, `aria-pressed`, action-first name | `WishlistButton` overlay, `Save {app} to your wishlist` / `Remove {app} from your wishlist` |
| Detail control | Full-width secondary block under the primary action | `WishlistButton` block in `PurchasePanel`, "Save to wishlist" / "Saved to wishlist" |
| Tokens | canvas `#0b0b0b`, surface `#141414`, zero radius, white sole action colour | Reused verbatim; no new colours or sizes |
| Typography | Oswald display uppercase, Inter body | Inherited from the existing styles |
| States | Loading skeleton, empty with catalog link, error with retry, row busy, saved state | Implemented and covered by tests/screenshots |
| Navigation | Wishlist in menu and footer | `MenuDialog` and `Footer` links |
| Motion | MO-101…MO-110 | `docs/FEAT-002/motion-plan.md` |

## Polish review (UIMap, 9 checks)

| Check | Result |
|---|---|
| Typography hierarchy | Pass — no new size; title, row name, meta and price scales reused |
| Dark theme protocol | Pass — dark only, no light assumptions, AA text pairs from tokens |
| Interaction states | Pass — default, hover (fine pointer), pressed, focus-visible, busy, saved/unsaved, failure |
| Empty, loading, error | Pass — skeleton rows, empty with "Browse the catalog", `LoadError` retry |
| AI tells | Pass — no gradient, glass, shadow, rounded corner, purple, nested card, emoji or decorative icon |
| Motion restraint | Pass — 160ms feedback, 200ms hover, no loop/toast/exit, reduced motion honoured |
| Accessibility | Pass — 44×44 targets, `aria-pressed`, `aria-busy`, hidden live status, `role="alert"` errors, named icon-only control |
| Consistency with FEAT-001 | Pass — same row anatomy as the cart, same notice/state components, same 720px measure |
| Copy tone | Pass — sentence case, no exclamation marks, failures name the condition |

## Component usage

No nexcomponent-ui, Ant Design or nexcommon (`REQ-049`). The feature reuses
the FEAT-001 primitives (`Button`, `IconButton`, `InlineNotice`, `StateBlock`,
`Skeleton`, `Rating`, `Tag`, `PriceLabel`) and `lucide-react` bookmarks at
`strokeWidth={1.5}`.

## Limitations

- The contract mock is static and prefix-routed (see disclosure); move,
  duplicate-save and multi-account cases are covered by the stateful Playwright
  mock, unit tests, or the backend suite.
- Cross-session, cross-device, privacy and checkout-cleanup behaviour is
  server-owned and belongs to the backend repo's tests.

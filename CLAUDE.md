# paladin-ui

Paladin storefront (React + Vite + TypeScript). Plain React with CSS Modules;
`REQ-049` excludes nexcomponent-ui and nexcommon. React Router v6, native
`fetch` in an adapter -> service -> hook -> page flow, dark theme only.

## Commands

- `npm run dev` — Vite dev server (proxies `/api` to `VITE_API_PROXY_ORIGIN`, default `http://localhost:8080`)
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — Vitest unit/component tests
- `npm run build` — typecheck + production build
- `npm run test:e2e` — Playwright desktop + mobile smoke against `vite preview`

## Feature docs

- [FEAT-001 storefront v1](docs/FEAT-001/spec.md) — spec, architecture, database, UI map and test cases in `docs/FEAT-001/`

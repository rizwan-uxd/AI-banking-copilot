# AI Banking Copilot — Project Handoff

Concise state for continuing in a fresh session. Full detail lives in `.claude/` docs and
`docs/atlas-integration.md`. Read `.claude/CLAUDE.md` for the non-negotiable rules.

## 1. Project objective
High-fidelity, cross-platform (iOS / Android / Web) **AI banking assistant prototype**. Looks and
behaves like a real banking app. **No backend, no APIs** — local JSON + a deterministic scripted
mock "AI" engine. Prototype for UX validation, not production.

## 2. Current implementation status
**Sprint 0 (Phase 0) complete and verified** — see `.claude/roadmap.md` for full exit-criteria
detail. Expo 57 app boots on iOS (Simulator, confirmed) + Web (dev server, confirmed); Android
bundles only (no local Android emulator on this machine). Atlas vendored + `AppThemeProvider`
(app-owned override layer around Atlas's `ThemeContext`) mounted at root. Geist typography loaded.
Navigation shell live: `app/(tabs)/` with a custom `Slot` + Atlas `TabBar` layout and 4 placeholder
routes (Home, Transactions, Copilot, Profile). Shared primitives (`Screen`, `Text`, `Container`,
`Section`, `Spacer`, `Divider`, `Icon`) and mock data (types + seed JSON + loaders in `src/data/`,
107 transactions / 3 accounts / 17 merchants over ~90 days) are in place. `tsc` is clean for all
app code (`app/`, `src/`); a known, documented, non-blocking set of pre-existing type errors remains
inside vendored Atlas source (see ADR-014 "Known limitation" and roadmap.md "Known limitations").
**No product screens built yet** — all 4 routes are placeholders. Next task is Screen 1 (Home /
Dashboard) from Figma.

## 3. Final architecture decisions
- **Stack:** Expo SDK 57 · React Native 0.86 · React 19.2 · TypeScript strict · Expo Router (typed
  routes + React Compiler) · NativeWind v4 (Tailwind 3.4) for app-specific components only.
- **Structure:** routes in root `app/`; everything else in `src/`
  (`components/{ui,banking,copilot}`, `features/{accounts,transactions,copilot}`, `data`,
  `design-system`, `store`, `hooks`, `lib`, `types`, `constants`). One-directional imports.
- **State:** Zustand (planned). **Data:** local JSON + typed loaders. **Mock AI** in
  `src/features/copilot`. **Charts:** hand-rolled on `react-native-svg`.
- **Repos:** app `rizwan-uxd/AI-banking-copilot` consumes Atlas `rizwan-uxd/atlas-design-system` as
  a dependency; separate repos. App stays on Expo 57 (never downgrade); Atlas evolves separately.
- **Styling rule:** Atlas components stay StyleSheet + ThemeProvider (never rewrite). App components
  may use NativeWind. **Never mix NativeWind + StyleSheet in one component.**
- **Overrides:** typography overrides at the app layer; color overrides by injecting Atlas
  `ThemeContext`. **Figma is source of truth** (file `cKYhfaHLCoyMHi9nKr63Ig`) — inspect before
  building any screen.
- **Components:** reuse Atlas first; app-specific components live in the app; recommend (never
  auto-move) promotion to Atlas only after proven reusable.

## 4. Active ADRs (see `.claude/decisions.md`)
- 001 Expo + Expo Router · 002 NativeWind (app components) · 003 Zustand · 004 no backend / local
  data only · 005 no React Query · 006 deterministic mock AI engine · 007 hand-rolled SVG charts ·
  009 `@gorhom/bottom-sheet` (planned for app UX) · 011 Atlas is the base design system · 012 Atlas
  integration constraints (separate repos, Expo 57, styling/override rules) · **014 Atlas consumed
  as pinned vendored source (prototype-only)** · **015 Geist typeface (supersedes 008)**.
- ADR-008 (Inter) = **superseded by 015**. ADR-010 (Lottie) = open/deferred (default: no).
  ADR-013 (GitHub Packages) = **superseded by 014**.

## 5. Atlas integration strategy (ADR-014)
Atlas consumed as **pinned vendored source** — Atlas repo unmodified for consumption; app owns all
integration. `scripts/fetch-atlas.mjs` (zero-dep git sparse-checkout, run on `postinstall`) fetches
`packages/ui-native` at pinned SHA **`37be7e8`** into `vendor/atlas-ui-native/` (gitignored).
Resolved via `tsconfig.json` `paths`: `@atlas/ui-native` → components, `/theme`, `/tokens`. Import
**subpaths only** (package root `main` is a demo entry). Single RN guaranteed because Atlas's own
deps are never installed (app's Expo 57 provides React/RN). Only added runtime dep:
**`@expo/vector-icons`**. Never edit `vendor/` (equals editing Atlas). Atlas colors come via
`useTheme().colors`; scale tokens via the default `tokens` object. Atlas components available:
Button, Input, Label, Textarea, Checkbox, Switch, Card (+Header/Title/Description/Content/Footer),
Badge, Alert, Dialog, Tabs, NavBar (Header, TabBar).

## 6. Completed work
- All `.claude/` project docs (CLAUDE, architecture, design-system, roadmap, decisions,
  product-principles) + `docs/atlas-integration.md`.
- Expo 57 scaffold: folder structure, NativeWind configured, `@/` + `@atlas/*` path aliases.
  Verified: `tsc` (app code), `expo-doctor` 18/18, iOS + Web run, all-platform bundles.
- Atlas wired: fetch script + postinstall, tsconfig paths, `ThemeProvider` at root,
  `@expo/vector-icons` installed.
- **Atlas token bug fixed and pushed** (Atlas branch `fix/ui-native-token-generator`, commit
  `37be7e8`); app re-pinned to it. Baseline verified: Atlas demo renders (Expo 54) + AI Banking
  renders one Atlas Button (Expo 57); single RN; colors unchanged.

## 7. Remaining work
- Phase 1 (remaining): Zustand stores, `lib/` (currency, date, aggregation), remaining UI primitives
  (Input, Sheet, Modal, Skeleton, Badge, Chip wrappers), component gallery screen.
- Screens (from Figma, one at a time): Home/Dashboard → Transactions + detail → Copilot (mock AI
  engine + chat UI) → Onboarding → Profile → Polish.

## 8. Confirmed blockers
None. Prior Atlas token crash is resolved. Non-blocking: no local Android emulator (live Android run
unavailable; bundles fine); pre-existing Atlas vendor `tsc` errors (see §10, ADR-014 "Known
limitation") — type-only, does not affect runtime/bundling. Open product decisions defaulted but not
locked (see §12).

## 9. Atlas investigation results
Atlas = monorepo; `@atlas/ui-native` is an Expo/RN library styled with StyleSheet + a Context
`ThemeProvider`/`useTheme` (NOT NativeWind). Root cause of the crash: the token generator
(`scripts/convert-tokens.mjs`) emitted only named scale exports, but every component + theme
default-import `tokens` and read `tokens.textRole` / `tokens.letterSpacing` — which were never
emitted → `tokens` undefined at runtime (reproduced in Atlas's own demo, so intrinsic to Atlas, not
our integration). Fix completed the generator (parse text roles + letter-spacing from
`atlas.tokens.css`; emit default aggregate; CSS `em` → RN pt at base 16, documented) and regenerated
the tokens file — additions only, no color/value changes.

## 10. Current status (was "hypothesis" — now confirmed)
Atlas components render correctly under Expo 57: `Button` (prior session) and `TabBar` (Sprint 0,
confirmed on iOS Simulator + Web) both work at runtime. RN 0.81→0.86 API/type drift is real but
**type-only**: `tsc --noEmit` reports ~17 pre-existing errors inside vendored Atlas source (`Alert`,
`Button`, `Dialog`, `ThemeProvider` — e.g. `ViewStyle.cursor`, `TextStyle.userSelect` shape changes).
Investigated in Sprint 0: `tsconfig.json`'s `exclude: ["vendor"]` only stops these files from being
root files — TypeScript still checks them when transitively imported (e.g. importing `TabBar` from
the Atlas barrel pulls in `Alert.tsx` too). No clean fix exists without editing vendor (forbidden) or
a packaging/build step (rejected by ADR-013/014). **Confirmed non-blocking** — runtime and bundling
are unaffected; documented as accepted technical debt in ADR-014 and `roadmap.md`. App code (`app/`,
`src/`) type-checks with zero errors.

## 11. Files changed
**App repo (branch `main`, no commits yet — all scaffold is untracked; origin =
`rizwan-uxd/AI-banking-copilot`):** full Expo 57 scaffold (`app/`, `src/` tree, `tailwind.config.js`,
`metro.config.js`, `babel.config.js`, `nativewind-env.d.ts`, `global.css`, `app.json`,
`package.json`, `tsconfig.json`); `scripts/fetch-atlas.mjs` (pinned `37be7e8`) + `atlas:fetch` &
`postinstall` scripts; `.gitignore` (`/vendor`); tsconfig `@atlas/*` paths; `@expo/vector-icons`;
`.claude/` docs + `docs/atlas-integration.md`; `vendor/atlas-ui-native/` (gitignored, fetched).
**Sprint 0 additions:** `@expo-google-fonts/geist(-mono)`, `lucide-react-native`,
`react-native-svg`; `app/_layout.tsx` (font loading + `AppThemeProvider`, replaces the old Button
verification screen); `app/(tabs)/` route group (`_layout.tsx` custom Slot+TabBar shell, 4
placeholder screens; old `app/index.tsx` removed); `src/design-system/` (`tokens.ts`, `theme.ts`,
`typography.ts`, `AppThemeProvider.tsx`, barrel); `src/components/ui/` (`Screen`, `Text`,
`Container`, `Section`, `Spacer`, `Divider`, `Icon`, barrel); `src/types/` (Account, Transaction,
Merchant); `src/data/` (seed JSON + typed loaders); `global.css` (semantic color CSS vars, light +
`prefers-color-scheme: dark`); `tailwind.config.js` (colors, fontSize, fontFamily, borderRadius
extend); `tsconfig.json` (`vendor` exclude + `@atlas/ui-native/theme/context` path for
`AppThemeProvider`'s `ThemeContext` injection).
**Atlas repo (branch `fix/ui-native-token-generator`, pushed, commit `37be7e8`):**
`scripts/convert-tokens.mjs` + `packages/ui-native/tokens/atlas.tokens.ts`.

## 12. Pending approvals
- **Merge Atlas branch** `fix/ui-native-token-generator` → `main` (app is pinned to the branch
  commit, which works; merging is optional cleanup — confirm preference).
- **Lock open product decisions:** visual direction (default: modern fintech / clean), copilot scope
  (default: rich & scripted with data-grounded cards), Lottie (default: no).
- No initial commit has been made in the app repo yet (commit/push only when the user asks).

## 13. Immediate next task
Sprint 0 is complete and awaiting designer review (see `roadmap.md` "Status"). Once reviewed,
implement **Screen 1 (Home/Dashboard)** from Figma: first inspect the Figma design (source of
truth), then build the screen composing Atlas primitives + the Sprint 0 app primitives
(`Screen`, `Text`, `Container`, `Section`, etc.) in `app/(tabs)/index.tsx` — one screen only,
following all `.claude/CLAUDE.md` rules.

---

## Next Task
**Awaiting designer review of Sprint 0.** Once approved: inspect the Figma design for Screen 1
(Home/Dashboard), then implement that single screen (compose Atlas + app primitives; no other
screens).

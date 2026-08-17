# AI Banking Copilot — Project Handoff

Concise state for continuing in a fresh session. Full detail lives in `.claude/` docs and
`docs/atlas-integration.md`. Read `.claude/CLAUDE.md` for the non-negotiable rules.

## 1. Project objective
High-fidelity, cross-platform (iOS / Android / Web) **AI banking assistant prototype**. Looks and
behaves like a real banking app. **No backend, no APIs** — local JSON + a deterministic scripted
mock "AI" engine. Prototype for UX validation, not production.

## 2. Current implementation status
**Home screen + all three copilot flows are built, and the prototype is publicly hosted.**

Screens live: Home (`app/(tabs)/index.tsx`, Figma node 224:1496) plus the three chatbot flows —
search/dispute, spending analysis, and product recommendations — across `app/copilot-*.tsx`,
`app/offering-detail.tsx`, `app/eligibility-*.tsx`, `app/product-recommendations.tsx`. 19 routes
total in the web export.

**Hosted at https://ai-banking-copilot.vercel.app** — see §14. This is now the primary way to
review the prototype; Expo Go can no longer run it (§15).

`tsc --noEmit` is clean for all app code (`app/`, `src/`). The known, non-blocking pre-existing type
errors inside vendored Atlas source remain (ADR-014 "Known limitation", roadmap.md "Known
limitations"). Atlas vendored + `AppThemeProvider` mounted at root; Geist loaded; `app/(tabs)/`
shell with custom `Slot` + Atlas `TabBar`. Mock data: 107 transactions / 3 accounts / 17 merchants
over ~90 days, AED-denominated.

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
  `ThemeContext`. **Figma is source of truth** (file `LGV5xzUyUxDEReq6FY4zn7`, "New banking
  chatbot") — inspect before building any screen. (Supersedes the earlier `cKYhfaHLCoyMHi9nKr63Ig`
  reference for app screens; that file is the separate Atlas component-library reference.)
- **Components:** reuse Atlas first; app-specific components live in the app; recommend (never
  auto-move) promotion to Atlas only after proven reusable.

## 4. Active ADRs (see `.claude/decisions.md`)
- 001 Expo + Expo Router · 002 NativeWind (app components) · 003 Zustand · 004 no backend / local
  data only · 005 no React Query · 006 deterministic mock AI engine · 007 hand-rolled SVG charts ·
  009 `@gorhom/bottom-sheet` (planned for app UX) · 011 Atlas is the base design system · 012 Atlas
  integration constraints (separate repos, Expo 57, styling/override rules) · **014 Atlas consumed
  as pinned vendored source (prototype-only)** · **015 Geist typeface (supersedes 008)**.
- **016 light-only theme (no dark mode)** · **017 web hosting on Vercel + device frame**.
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
- Screens still placeholder: Transactions, Copilot tab, Profile.
- Phase 1 backfill (only as a screen needs it): Zustand stores, remaining UI primitives
  (Input, Sheet, Modal, Skeleton, Badge, Chip wrappers), component gallery screen.
- **Hero asset weight:** `assets/images/home/hero-background.png` is 2.2 MB and blocks the Home
  screen's gradient on first paint over a slow connection. Compressing it is the highest-value
  perf win on the hosted demo.
- Dark mode remains undesigned and unshipped (ADR-016). If it is ever wanted, it needs Figma frames
  first, then both switches flipped together.

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
Home and all three copilot flows are built, fixed, and live. **Awaiting the designer's direction on
which screen is next** — the remaining placeholders are Transactions, Copilot tab, and Profile.
Inspect Figma before building, one screen at a time, per `.claude/CLAUDE.md`.

---

## 14. Hosting (ADR-017)
**Live: https://ai-banking-copilot.vercel.app** — Vercel project `ai-banking-copilot` under team
`rizwans-projects-cb102166`, connected to `rizwan-uxd/AI-banking-copilot` via the GitHub
integration. **Every push to `main` auto-deploys.** No CLI auth is needed or configured.

`vercel.json` pins the build: framework `null`, `npx expo export --platform web` → `dist`,
`cleanUrls`. The app was already set to `web.output: "static"`. Vercel's `npm install` runs the
`postinstall` Atlas fetch, which works unauthenticated because the Atlas repo is public.

Share the **clean alias only**. Per-deployment URLs (`ai-banking-copilot-<hash>-…vercel.app`) 302 to
a login — Vercel protects them.

To confirm a deploy actually landed, compare the served bundle hash rather than trusting the push:
`curl -s https://ai-banking-copilot.vercel.app/ | grep -o 'entry-[a-f0-9]*\.js'`.

**Web device frame:** `src/components/ui/WebDeviceFrame.tsx` wraps the app. Below a 768px viewport
(phone browsers) it renders full-bleed; at or above it centres the app in a 390×844 shell. Web-only
(`Platform.OS` guard), inert on native.

Any view that sizes itself to "the screen" must use **`useViewport()`** (`src/hooks/useViewport.tsx`),
never `useWindowDimensions()` — inside the frame the window is the whole desktop browser.
`useSafeAreaFrame()` does **not** work as a substitute: on web it reports window metrics regardless
of where it sits in the tree (verified). `HeroBanner` is the existing consumer.

## 15. Expo Go no longer runs this project
Store-distributed Expo Go has been **frozen at SDK 54 since May 2026** (Expo stopped shipping new
versions to the App Store / Play Store). This project is SDK 57, so Expo Go on a phone will always
report "Project is incompatible with this version of Expo Go". **Updating the app cannot fix it.**

Options: the hosted web URL (§14, simplest); a development build (`npx expo run:android` /
`run:ios`); or on Android only, the SDK 57 Expo Go APK from `expo.dev/go` — but Play Store
auto-update will replace it with the frozen SDK 54 build, so disable auto-update for it. On iOS
there is no free path — `eas go` needs a paid Apple Developer account.

## 16. Two theming gotchas that cost real debugging time
1. **Colors switch from two independent places.** `AppThemeProvider` (React context) drives Atlas
   components; `global.css` CSS variables drive every NativeWind class. Changing one alone produces
   a half-themed screen. They must always agree — see ADR-016.
2. **`className` is silently inert on third-party components.** NativeWind only processes `className`
   where it has interop registered. `<BottomSheetView className="flex-1 px-5">` dropped both the
   padding and the flex with no error or warning, while an inline `style` on the same element
   applied fine. Style any `@gorhom/bottom-sheet` (or other library) component via `style`, using
   `spacing`/`radii` tokens rather than raw numbers.

---

## Next Task
**Awaiting the designer's call on the next screen** (Transactions, Copilot tab, or Profile — all
still placeholders). Inspect Figma first, build one screen only.

Optional, unblocked: compress `assets/images/home/hero-background.png` (2.2 MB) to speed up first
paint on the hosted demo.

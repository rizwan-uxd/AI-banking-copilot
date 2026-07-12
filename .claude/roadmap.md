# Delivery Roadmap

Phased delivery. Each phase ends in a reviewable, working deliverable. Work pauses for design
review at the end of every phase before proceeding.

Legend: ☐ not started · ◐ in progress · ☑ done

---

## Phase 0 (Sprint 0) — Foundation
**Goal:** the project is fully prepared for product implementation. No product UI is built in this
phase — only infrastructure, primitives, and scaffolding that Screen 1 depends on.

- ☑ Scaffold Expo (SDK 57) + TypeScript (strict) + Expo Router (typed routes, React Compiler)
- ☑ Configure NativeWind v4 (`global.css`, `tailwind.config.js`, `metro.config.js`, `babel.config.js`, `nativewind-env.d.ts`)
- ☑ Set up `@/` path alias and `tsconfig`
- ☑ Agreed folder structure created (`app/` routes + `src/` layers)
- ☑ Atlas integration verified (vendored source, `ThemeProvider` mounted, Button renders — ADR-014)
- ☑ Root layout with providers (gesture handler, safe area, Atlas theme, app theme override, fonts)
- ☑ Typography: Geist fonts loaded (`useFonts`, splash held until ready — ADR-015)
- ☑ Theme: design tokens (`tokens.ts`) + light/dark semantic theme (`theme.ts`)
- ☑ App theme override layer (`AppThemeProvider` injecting overrides on top of Atlas `ThemeContext`, per ADR-012)
- ☑ Shared app primitives: `Screen`, `Text`, `Container`, `Section`, `Spacer`, `Divider`, `Icon`
- ☑ Navigation shell: Expo Router tab group with Atlas `TabBar`, placeholder routes only (Home, Transactions, Copilot, Profile)
- ☑ Shared mock data models: domain types (`src/types/`) + seed JSON + typed loaders (`src/data/`)
- ☑ Icons wired: `lucide-react-native` via the `Icon` primitive
- ☑ Assets: `assets/` structure confirmed (images, icons, fonts bundled via `@expo-google-fonts/*`)
- ☑ `vendor/` excluded from `tsc` root-file discovery (see "Known limitations" below — exclusion
  is partial, documented as technical debt rather than fully solved)
- ☑ Documentation updated (ADRs, design-system.md, CLAUDE.md, this roadmap)

**Exit criteria (all required before Screen 1 begins):**
- Atlas integration verified
- Theme ready (tokens + light/dark + override layer)
- Typography ready (Geist loaded and applied)
- Navigation ready (tab shell in place, placeholder screens only)
- Mock data ready (types + seed JSON + loaders)
- Shared primitives ready (`Screen`, `Text`, `Container`, `Section`, `Spacer`, `Divider`, `Icon`)
- **App code** compiles without errors (`tsc` — zero errors in `app/` and `src/`; see known
  limitations for pre-existing vendor errors)
- Verified running on iOS (simulator) and Web (dev server, all 4 tab routes bundle and respond)
- Screen 1 can begin immediately — no further scaffolding blockers

**Deliverable:** a blank, themed, navigable app shell on iOS, Android, and Web, with data and
primitives ready to build the first real screen.

**Status: Sprint 0 acceptance criteria met, pending designer review.** Verified this session:
`tsc --noEmit` reports **zero errors** in `app/` and `src/`; `expo export -p web` bundles all 4 tab
routes cleanly; the app boots and renders correctly in the iOS Simulator (Geist typography, app
theme colors, Atlas `TabBar` navigation) and on Web (all routes return HTTP 200 and bundle without
errors). Android was not verified live (no local emulator on this machine — bundling only, per
HANDOFF.md §8), consistent with prior sessions.

**Known limitations / technical debt (non-blocking, tracked, not fixed in Sprint 0):**
- **Atlas vendor type errors.** `tsc --noEmit` reports ~17 pre-existing type errors inside
  `vendor/atlas-ui-native/` (`Alert`, `Button`, `Dialog`, `ThemeProvider`) caused by RN-version type
  drift between Atlas's target (RN 0.81) and this app's RN 0.86 (e.g. `ViewStyle.cursor`,
  `TextStyle.userSelect` type shape changes). Root cause confirmed: TypeScript's `exclude` only
  filters root-file discovery — it does not suppress diagnostics for vendor files reached
  transitively through an app import (e.g. importing `TabBar` from the Atlas barrel pulls in
  `Alert.tsx`'s errors too). No clean fix exists without either editing vendor (forbidden by
  ADR-014) or a build-step/packaging change (rejected by ADR-013/014 for this prototype). **Verified
  non-blocking:** these are type-only errors — Babel/Metro don't run `tsc`, so runtime and bundling
  are unaffected (confirmed by the iOS + Web runs above). App code itself (`app/`, `src/`) is 100%
  clean. Revisit if/when Atlas moves to a packaged, versioned dependency (see ADR-013's deferred
  plan).

---

## Phase 1 — Core primitives & data (remaining)
**Goal:** the design system and data layer are usable end to end for building every subsequent
screen.

- ☐ Complete remaining UI primitive set (Input, Sheet, Modal, Skeleton, Badge, Chip wrappers over Atlas where needed)
- ☐ Zustand stores (accounts, transactions, copilot, UI) with persistence for UI prefs
- ☐ `lib/` utilities: currency, date, aggregation
- ☐ Component gallery screen for design review

**Deliverable:** a browsable component gallery + stores wired to the Sprint-0 data layer.

---

## Phase 2 — Home / Dashboard
**Goal:** the money screen looks real.

- ☐ `BalanceHeader` with hero balance
- ☐ `AccountCard` list (checking, savings, credit)
- ☐ `QuickActions` (send / request / pay — mock)
- ☐ Recent transactions preview
- ☐ `InsightCard` (AI-flavored spending insight)
- ☐ `CopilotFab` entry point

**Deliverable:** a convincing dashboard on all platforms.

---

## Phase 3 — Transactions & detail
**Goal:** browsing and understanding money movement.

- ☐ Transaction list with search + category filters
- ☐ `CategoryPill`s and `MerchantIcon`s
- ☐ `transaction/[id]` detail screen
- ☐ `account/[id]` detail with `SpendingChart` (SVG)
- ☐ Empty / loading / skeleton states

**Deliverable:** full transaction browsing with charts.

---

## Phase 4 — AI Copilot (centerpiece)
**Goal:** the assistant feels real.

- ☐ Chat UI: `ChatMessage`, `Composer`, message list
- ☐ `StreamingText` + `TypingIndicator` (token-by-token reveal)
- ☐ Mock AI engine: intent matcher → resolver → response builder → streamer
- ☐ `copilot-scenarios.ts` with grounded, data-derived answers
- ☐ `SuggestionChips` prompt starters
- ☐ `CopilotActionCard` rich inline results (spending, subscriptions, affordability)
- ☐ Graceful fallback response

**Deliverable:** an interactive, data-grounded AI copilot.

---

## Phase 5 — Onboarding & Profile
**Goal:** framing and settings.

- ☐ Onboarding intro flow
- ☐ Mock sign-in ("Continue" — no real auth)
- ☐ Profile / settings screen
- ☐ Theme toggle (light / dark / system)
- ☐ Onboarding-complete gate persisted

**Deliverable:** complete first-run experience and settings.

---

## Phase 6 — Polish
**Goal:** production-grade feel.

- ☐ Reanimated transitions and micro-interactions (via motion tokens)
- ☐ Haptics on key actions (expo-haptics)
- ☐ Accessibility pass (labels, roles, contrast, dynamic type, reduced motion)
- ☐ Empty / loading / error states everywhere
- ☐ Web layout tuning and responsive checks
- ☐ Optional: Lottie animations (pending decision — see `decisions.md`)

**Deliverable:** polished, demo-ready prototype.

---

## Milestone summary

| Phase | Theme | Primary outcome |
|---|---|---|
| 0 | Foundation | App boots, design system live |
| 1 | Primitives & data | Component gallery + data layer |
| 2 | Dashboard | Realistic money screen |
| 3 | Transactions | Browsing + charts |
| 4 | Copilot | Grounded AI assistant |
| 5 | Onboarding & Profile | First-run + settings |
| 6 | Polish | Demo-ready |

Sequencing may adjust based on review feedback, but the dependency order (0 → 1 before all
others; 4 depends on 1–3's data) is fixed.

# AI Banking Copilot — Engineering Guide (CLAUDE.md)

This file is the operating contract for anyone (human or AI) writing code in this repository.
Read it before making changes. It overrides default assumptions.

---

## What this project is

A **high-fidelity, cross-platform mobile prototype** of an AI-powered banking assistant.
It looks and behaves like a real banking app, but it is a **prototype for demonstration and UX validation** — not a production financial product.

- **Runs on:** iOS, Android, and Web (single codebase).
- **Backend:** none. Ever.
- **APIs / network:** none. All data is local.
- **The "AI":** a deterministic, scripted mock engine that simulates an LLM (streaming text, latency, data-derived answers).

If a request would introduce a backend, a real API call, real authentication, or real financial logic — **stop and flag it.** That is out of scope by design.

---

## Tech stack (do not deviate without an ADR)

| Concern | Choice |
|---|---|
| Framework | Expo (SDK 57) |
| Routing | Expo Router (SDK-versioned, file-based) |
| Language | TypeScript (strict mode) |
| Styling | NativeWind v4 (Tailwind for RN) |
| State | Zustand |
| Animation | React Native Reanimated |
| Gestures | React Native Gesture Handler |
| Bottom sheets | @gorhom/bottom-sheet |
| Icons | lucide-react-native |
| Fonts | Geist (@expo-google-fonts/geist), Geist Mono for balances |
| Persistence | AsyncStorage (via Zustand persist) |
| Haptics | expo-haptics |
| Charts / SVG | react-native-svg (hand-rolled charts) |

Do **not** add UI kits (NativeBase, Tamagui, etc.), Redux, or React Query.
Rationale is documented in `decisions.md`. Any new dependency requires an ADR entry.

---

## Directory conventions

```
app/        Routes ONLY. Thin files that compose from src/. No business logic.
src/
  components/    ui/ (primitives) · banking/ (domain) · copilot/ (chat)
  features/      Domain logic + the mock AI engine
  data/          Local JSON + typed loaders (single source of truth)
  design-system/ tokens, theme
  store/         Zustand slices
  hooks/         Reusable hooks
  lib/           Pure utilities (currency, date, format)
  types/         Shared domain models
  constants/     Config, route names, mock delays
assets/     Fonts, icons, images, animations
```

**Dependency flow is one-directional:**
`app/ → features/ → components/ → design-system/`, with `store/`, `hooks/`, `lib/`, `data/` as shared leaves.
Never import "upward" (e.g. a component must not import a route or a feature).

---

## Development workflow rules (non-negotiable)

These govern *how* work is done, not just the code. They override default agent behavior.

- **One screen at a time.** Never implement more than one screen unless explicitly asked.
- **No unapproved redesigns.** Never redesign existing UI without the designer's approval.
- **Reuse first.** Reuse existing components before creating new ones.
- **Ask before adding a dependency.** No new package without explicit approval (the agreed stack in this file is pre-approved).
- **Small, reviewable changes.** Keep commits and diffs small and easy to review.
- **Plan before code.** Explain the implementation plan and get alignment before writing code.
- **Figma is the source of truth** for visual design. Match it; flag discrepancies rather than improvising.
- **Local JSON over fake APIs.** Prefer local mock data; never introduce simulated network/API layers.

## Atlas design system rules (non-negotiable)

**Atlas is the base design system.** The application composes Atlas — it does not fork it.

- **Never modify Atlas** unless explicitly requested.
- **Compose, never duplicate.** Always build on Atlas components; never copy, re-implement, or rewrite them in the app.
- **Theme overrides live in the app.** If the app needs different typography, colors, or spacing, implement them as *theme overrides inside the application* — never by editing Atlas.
- **App-unique components live in the app.** If a component is specific to AI Banking, create it in the application (composed from Atlas primitives where possible).
- **Promotion is a recommendation, not an action.** If a component looks reusable across future products, *recommend* promoting it to Atlas — do not move it automatically.

**Locked integration facts (ADR-012):**
- Atlas = `github.com/rizwan-uxd/atlas-design-system`, package `@atlas/ui-native` (Expo/RN, StyleSheet + `ThemeProvider`/`useTheme`, targets Expo 54). **Separate repo, consumed as a dependency.**
- **App stays on Expo 57** — never downgrade. Atlas is upgraded incrementally to catch up.
- **Styling:** Atlas components keep StyleSheet + ThemeProvider (never rewrite). App-specific components **may** use NativeWind. **Never mix NativeWind and StyleSheet inside one component.**
- **Typography overrides** live at the **app layer** for the prototype — no Metro alias hacks, no Atlas refactor yet. **Color overrides** are applied by injecting Atlas's `ThemeContext` value.
- **Figma is the source of truth — always inspect Figma (file `cKYhfaHLCoyMHi9nKr63Ig`) before implementing a screen.**
- App-level `src/design-system/` holds **theme overrides layered on Atlas**, not a from-scratch token system. See `design-system.md` and ADR-011/012 in `decisions.md`.

## Coding rules

### Structure
- Route files in `app/` stay thin — layout + composition only. All logic lives in `src/`.
- Group by **feature**, not by file type, inside `src/features/`.
- Components are **prop-driven and presentational**; data/state is injected via hooks or props.

### TypeScript
- `strict: true`. No `any` (use `unknown` + narrowing if truly needed).
- Every domain model is typed in `src/types/`. Props are explicitly typed.
- Prefer discriminated unions for state (`idle | loading | ready | error`).

### Styling
- Use NativeWind classes mapped to design tokens (`bg-surface`, `text-muted`, `p-4`, `rounded-2xl`).
- **Never** hardcode hex colors, raw pixel values, or inline style objects for anything the token system covers.
- Semantic color names only (`positive` / `negative`, not `green` / `red`).

### Data
- All data comes from `src/data/` through typed loaders. Never inline mock arrays in components.
- Money is **always** formatted via `lib/currency.ts`. Never render a raw number as a balance.
- Dates are formatted via `lib/date.ts`.

### Cross-platform
- Every component must work on iOS, Android, and Web.
- Guard platform-specific code with `Platform.select` / `Platform.OS`.
- Test the web build for layout regressions, not just native.

### Accessibility (non-negotiable)
- Provide `accessibilityLabel` and `accessibilityRole` on interactive elements.
- Minimum 44×44pt touch targets; add `hitSlop` where needed.
- Support dynamic type and respect reduced-motion for animations.
- Maintain WCAG AA contrast in both light and dark themes.

### Imports
- Absolute imports via the `@/` path alias (configured in `tsconfig.json`).

---

## The mock AI engine

- Lives in `src/features/copilot/`.
- Simulates an LLM: matches user input to scripted intents, streams tokens with realistic timing, and derives answers from the local data layer.
- It is **deterministic** — same input yields the same output. No randomness that would make demos unreliable.
- Rich answers (spending breakdowns, subscription lists, affordability checks) query `src/data/` through the same loaders the UI uses.

---

## Definition of done (per change)

- Runs on iOS, Android, and Web without errors.
- TypeScript passes with no new `any` and no suppressed errors.
- Uses design tokens; no hardcoded style values.
- Accessible (labels, roles, contrast, touch targets).
- No network, backend, or real financial logic introduced.
- Empty / loading / error states considered where relevant.

---

## Related documents

- `architecture.md` — system design and data flow
- `design-system.md` — tokens, theming, typography, components
- `roadmap.md` — phased delivery plan
- `decisions.md` — architecture decision records (ADRs)
- `product-principles.md` — UX and product values

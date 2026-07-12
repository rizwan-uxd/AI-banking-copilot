# Architecture Decision Records (ADRs)

Chronological log of significant decisions. Each record states the context, the decision, and the
consequences. Add a new record for any dependency addition or structural change — never edit a
past record; supersede it with a new one.

Status values: **Accepted** · **Proposed** · **Superseded** · **Open**

---

## ADR-001 — Expo + Expo Router as the framework
**Status:** Accepted

**Context.** We need a single codebase targeting iOS, Android, and Web with minimal native
configuration, fast iteration, and real URLs on web.

**Decision.** Use Expo (SDK 57) with Expo Router (SDK-versioned, file-based routing). Typed routes
and React Compiler are enabled (`app.json` → `experiments`). React 19.2, React Native 0.86.

**Consequences.** Zero native build config for the prototype; deep-linkable web routes for free;
type-safe navigation via typed routes; automatic render optimization via React Compiler. We stay
within Expo's supported library set. Trade-off: bound to Expo's SDK release cadence and supported
modules — acceptable for a prototype. Note: local Node is v23 (outside RN 0.86's official engine
range) and emits install-time engine warnings only; the build, type-check, and export all pass.
Routes live in the root `app/` directory (not the template's `src/app`) to keep routing separate
from `src/` logic, per our architecture.

---

## ADR-002 — NativeWind for styling
**Status:** Accepted

**Context.** As a designer-led project we need styling that is fast to iterate, centralized, and
theme-aware.

**Decision.** Use NativeWind v4 (Tailwind syntax) with a token-first config.

**Consequences.** Design decisions live in tokens; utilities stay consistent across platforms.
Trade-off: a build-time dependency and Tailwind mental model — worth it for velocity and
consistency. Rejected alternatives: StyleSheet (verbose, no shared token system) and styled
libraries like Tamagui (heavier, opinionated).

---

## ADR-003 — Zustand for state management
**Status:** Accepted

**Context.** We need lightweight global state (accounts, transactions, copilot, UI) that works on
web and native without provider boilerplate.

**Decision.** Use Zustand with the `persist` middleware (AsyncStorage) for UI preferences only.

**Consequences.** Minimal boilerplate, easy slices, no context nesting. Financial data is always
re-seeded from JSON; only theme and onboarding flags persist. Rejected: Redux (overkill for a
prototype) and React Context alone (re-render and ergonomics concerns at this scope).

---

## ADR-004 — No backend, no network, local data only
**Status:** Accepted

**Context.** This is a prototype to validate UX, not a financial product.

**Decision.** All data is local typed JSON in `src/data/`, accessed through typed loaders. No APIs,
no network, no real auth.

**Consequences.** Fully offline, deterministic, and safe to demo. No security/compliance surface.
Loaders may simulate latency to exercise loading states. Any proposal to add a network layer
requires a superseding ADR.

---

## ADR-005 — No React Query / data-fetching library
**Status:** Accepted

**Context.** React Query and similar exist to manage server cache and async fetching.

**Decision.** Do not include a data-fetching library. Since there is no network, artificial latency
is simulated in loaders and handled with local component state / Zustand.

**Consequences.** Fewer dependencies and less conceptual overhead. If we ever add real async
sources (we won't for this prototype), revisit with a new ADR.

---

## ADR-006 — Mock AI engine (scripted, deterministic)
**Status:** Accepted

**Context.** The centerpiece is an AI copilot, but there is no LLM or backend.

**Decision.** Build a deterministic mock engine in `features/copilot/` that matches user input to
scripted scenarios, streams tokens with realistic timing, and grounds answers in the local data
layer. Rich intents return structured payloads rendered as inline action cards.

**Consequences.** Demos are repeatable and always internally consistent (numbers match the UI).
Trade-off: not genuinely generative — acceptable and intentional for a controlled prototype.

---

## ADR-007 — Hand-rolled charts on react-native-svg
**Status:** Accepted

**Context.** We need spending charts that are on-brand and identical across platforms.

**Decision.** Build lightweight chart primitives on `react-native-svg` instead of a chart library.

**Consequences.** Small bundle, full token-driven styling, consistent cross-platform rendering.
Trade-off: we implement chart types ourselves — scope is limited (bar, donut, sparkline), so this
is manageable.

---

## ADR-008 — Inter as the primary typeface
**Status:** Superseded by ADR-015

**Context.** Banking UIs need clean, legible, professional typography with a numeric-friendly face.

**Decision.** Use Inter (`@expo-google-fonts/inter`) plus a monospace face for balances and
account numbers.

**Consequences.** Free, well-supported, banking-appropriate. Monospace keeps figures aligned.

---

## ADR-009 — Bottom sheets via @gorhom/bottom-sheet
**Status:** Accepted

**Context.** Copilot and detail interactions call for polished, gesture-driven sheets.

**Decision.** Use `@gorhom/bottom-sheet` (with Reanimated + Gesture Handler).

**Consequences.** Best-in-class sheet UX. Adds Reanimated/Gesture Handler as required peers —
already desired for animations, so no net new conceptual cost.

---

## ADR-010 — Lottie for onboarding / AI animations
**Status:** Open

**Context.** Lottie would add polished vector animation to onboarding and the AI "thinking" state,
at the cost of one dependency (`lottie-react-native`).

**Decision.** Deferred pending design direction. Default is **Reanimated-only** unless the
designer opts in.

**Consequences.** Keeps dependencies minimal by default. Revisit in Phase 6; convert to Accepted
or reject with a note.

---

## ADR-011 — Atlas as the base design system
**Status:** Accepted

**Context.** The organization has a shared design system, **Atlas**, intended to back multiple
current and future products. The AI Banking Copilot is one consumer of it.

**Decision.** Treat Atlas as the base design system and compose it:
- Never modify Atlas unless explicitly requested; never duplicate or rewrite its components.
- App-specific typography, colors, and spacing are implemented as **theme overrides inside the app**
  (`src/design-system/`), layered on Atlas.
- Components unique to AI Banking are created in the app, composed from Atlas primitives where
  possible.
- Components that appear reusable across products are **recommended** for promotion to Atlas but are
  not moved automatically.

**Consequences.** Supersedes the earlier implicit assumption (ADR-002 / `design-system.md`) that the
app builds a bespoke token system and primitive set from scratch. The app's `components/ui/` become
thin wrappers/compositions over Atlas rather than original primitives. NativeWind remains the app's
override mechanism *pending confirmation of what Atlas is built on* — if Atlas uses a different
styling engine, this ADR is revisited.

**Atlas source (confirmed):** monorepo at `github.com/rizwan-uxd/atlas-design-system`. The relevant
package is `@atlas/ui-native` (`packages/ui-native`) — an Expo/RN library of 12 components (Button,
Input, Label, Textarea, Checkbox, Switch, Card+slots, Badge, Alert, Dialog, Tabs, NavBar
Header/TabBar) styled with **StyleSheet + a Context `ThemeProvider`/`useTheme`** (not NativeWind).
Scale tokens (spacing/radius/fontSize/fontWeight) are statically imported in each `*.styles.ts`;
only `colors` flow through the theme context. Atlas targets Expo 54 / RN 0.81 / React 19.1. Figma
is the system of record (file `cKYhfaHLCoyMHi9nKr63Ig`, "Atlas/Mobile-Native").

**Packaging caveats to resolve during integration:** `@atlas/ui-native` is private/unpublished,
source-only TS, its `main` (`index.ts`) is a demo-app entry (`registerRootComponent`) rather than a
library barrel (real exports: `/components`, `/theme`, `/tokens/atlas.tokens`), and it lists
expo/react/react-native as regular (not peer) deps. See ADR-012.

---

## ADR-012 — Atlas integration & app architecture (locked)
**Status:** Accepted

**Context.** With Atlas's source and packaging understood (ADR-011), the designer locked the
integration approach.

**Decisions.**
1. **Repository** — Atlas and AI Banking Copilot stay **separate repositories**. The app **consumes
   Atlas as a dependency** (not a submodule, workspace, or monorepo merge). App repo:
   `github.com/rizwan-uxd/AI-banking-copilot` (origin).
2. **Expo** — App stays on **Expo 57**; do **not** downgrade. Atlas is upgraded **incrementally** to
   catch up over time.
3. **Styling** — Atlas components remain **StyleSheet + ThemeProvider**; never rewrite them.
   App-specific components **may use NativeWind** where it speeds development. **Never mix styling
   approaches inside a single component** (a component is either NativeWind or StyleSheet, not both).
4. **Typography** — **No Metro alias hacks. No immediate Atlas refactor.** For the prototype,
   implement typography overrides at the **application layer** where required. Post-prototype,
   evaluate promoting typography into the Atlas `ThemeProvider`.
5. **Figma** — Figma remains the **source of truth**; always inspect Figma **before** implementing a
   screen.
6. **Components** — Reuse Atlas whenever possible; create AI Banking components **inside the app**;
   promote to Atlas **only after proven reusable** (recommend, never auto-move).

**Consequences.** NativeWind stays in the app (ADR-002 holds) but is scoped to app-specific
components; Atlas components bring their own theming. Color overrides are applied by injecting
Atlas's `ThemeContext` value; typography overrides are handled app-side per (4). The concrete
mechanism for consuming an unpublished, source-only, demo-entry package as a dependency is the open
item below — likely the first "incremental Atlas upgrade" is a minimal packaging fix (peer deps +
library entry), which requires explicit approval since it touches Atlas.

---

## ADR-013 — Atlas Packaging & Distribution Strategy
**Status:** Superseded by ADR-014

> **Superseded.** The designer reversed this direction: Atlas must remain **completely unchanged**
> during this project — no packaging, publishing, peerDependency, or exports edits. The GitHub
> Packages plan below is retained for history only. The active strategy is ADR-014.

**Context.** Per ADR-012, AI Banking Copilot consumes `@atlas/ui-native` as a **versioned
dependency** while Atlas and the app stay **separate repos** and the app stays on **Expo 57**. Today
the package is unpublished, source-only, has a demo-app entry as its `main`, and declares
framework packages as regular (non-peer) deps — so it cannot be installed cleanly, and installing it
would pull a second copy of React Native/Expo (a runtime crash). We need a distribution mechanism
that: (a) guarantees a **single** RN/Expo instance at runtime, (b) supports **semantic versioning**
so the app pins a known-good Atlas, (c) keeps Atlas's **standalone demo app working**, and (d)
requires only a **minimal, non-refactoring** change to Atlas.

**Decision.** Publish `@atlas/ui-native` to **GitHub Packages** (GitHub-hosted npm registry, scoped
to the repo owner) as a **privately-scoped, semantically-versioned** library. The minimal Atlas
change is packaging-only:
1. Move framework/runtime packages (`expo`, `react`, `react-native`,
   `react-native-safe-area-context`, `@expo/vector-icons`, `expo-status-bar`) to
   **`peerDependencies`** (mirrored in `devDependencies` for local demo dev) so the **consumer**
   provides the single runtime copy — resolving the app's Expo 57 versions, not Atlas's Expo 54.
2. Add a **library entry with an `exports` map**, decoupled from the demo entry:
   - `.` → components barrel (`./components/index.ts`)
   - `./theme` → `./theme/index.ts`
   - `./tokens` → `./tokens/atlas.tokens.ts`
   The existing `registerRootComponent(App)` demo entry is kept but is **no longer the package
   `main`** and is excluded from the published library surface.
3. Add a **GitHub Actions publish workflow** triggered on version tags, publishing to GitHub Packages
   using the workflow `GITHUB_TOKEN`; versions follow **semver** (`0.x` pre-1.0).
4. **No refactors** to components, tokens, styling, or architecture — packaging and distribution
   only.

The app consumes it by pinning a version in `package.json` and authenticating to GitHub Packages via
a scoped registry line in `.npmrc` (`@atlas:registry=https://npm.pkg.github.com`) with a
`read:packages` token supplied through the environment (never committed).

**Alternatives considered.**
- **Git submodule** (Atlas as a submodule, resolved via Metro `watchFolders`). *Rejected:* this
  vendors source into the app tree rather than consuming a dependency; entangles the two repos'
  checkouts; offers no version range (only a commit SHA); has error-prone DX (detached submodule
  state, `--recurse-submodules`); and would still need the peer-deps fix. Contradicts the
  separate-repos + versioned-dependency intent of ADR-012.
- **Local path dependency (`file:` / `link:`).** *Rejected:* works on one machine only, no
  versioning, breaks CI and other contributors, and invites editing Atlas from inside the app
  (violates "don't modify Atlas"). Useful only as a throwaway dev-time link, not a project strategy.
- **Public npm.** *Rejected for now:* Atlas is an internal, pre-1.0 design system; public publishing
  leaks internal design IP and exposes an unstable API to outside users. GitHub Packages gives the
  same npm-client ergonomics with access **scoped to the org/repo** and no extra account/registry to
  provision.
- **Git-subdirectory install (e.g. gitpkg).** *Rejected as primary:* still needs the peer-deps fix,
  yields opaque tarball URLs instead of clean semver ranges, adds a third-party proxy to the trust
  chain, and gives weaker immutability/caching than a registry. Acceptable only as a stopgap if
  publishing is ever blocked.

**Trade-offs (accepted).**
- **Install auth friction.** GitHub Packages requires an authenticated `.npmrc` even to *install* (a
  `read:packages` token) on every dev machine and CI job. *Mitigation:* document an `.npmrc` that
  reads `${GITHUB_TOKEN}` from the environment; provide via CI secret; never commit it.
- **GitHub-specific coupling.** Registry URL and auth are GitHub-flavored. *Mitigation:* semver + a
  clean `exports` surface reduce a registry move to a config change (see migration path).
- **Pre-1.0 churn.** `0.x` allows breaking changes on minor bumps; the app pins tight ranges and
  upgrades Atlas deliberately — consistent with "Atlas upgraded incrementally."
- **Release overhead.** Shipping an Atlas change to the app now requires a tag/release rather than a
  submodule bump. That discipline (versioned, reviewable upgrades) is intentional.

**Future migration path.**
- **To public npm** (if Atlas is open-sourced): publish the same scoped name to npmjs; consumers drop
  the scoped-registry `.npmrc` line. Because the app depends by **name + semver**, this is a
  registry-config change, not a code change.
- **To a dedicated private registry** (Verdaccio, Artifactory, GitLab): repoint the `@atlas` scope in
  `.npmrc`; no app code changes.
- **To a monorepo** (if the repos ever merge): the `exports` map + peer-deps model are exactly what a
  workspace package needs, so it drops in as a workspace package with no consumer-facing change.
- **Toward 1.0:** once the component API stabilizes, cut `@atlas/ui-native@1.0.0`; the app moves from
  tight `0.x` pins to caret ranges. The typography-in-`ThemeProvider` promotion (ADR-012 item 4)
  would land as a minor/major bump on this path.

**Note.** This ADR will be mirrored into the Atlas repo's `docs/decisions/` when the packaging change
is made, so both repos record the rationale.

---

## ADR-014 — Atlas Prototype Integration Strategy (vendored source)
**Status:** Accepted (supersedes ADR-013)

**Context.** The designer set a hard constraint: **Atlas is not modified during this project** — no
commits, PRs, packaging, publishing, refactoring, `peerDependencies`, or `exports` changes — and it
must be consumed **exactly as it exists today**. This makes a clean semver registry dependency
impossible (that requires publishing or a packaging change, both forbidden). Atlas evolution is a
separate, later project.

**Decision.** Consume Atlas as **pinned vendored source**, with all integration logic living **only
inside AI Banking Copilot** (Approach A):
1. **Atlas untouched.** Nothing in the Atlas repo changes.
2. **Pinned ref.** Vendor `packages/ui-native` at a fixed commit SHA
   (`3dbde9c32d1e6f402486095fc74b7af14bbf362a`) for deterministic builds. A manifest records the SHA.
3. **Vendored location.** `vendor/atlas-ui-native/` inside this app.
4. **Resolution via tsconfig `paths`** (Expo Metro honors these — no custom Metro resolver):
   `@atlas/ui-native` → components, `/theme`, `/tokens` → the vendored barrels. Import subpaths only;
   never the demo-entry `main`.
5. **Single RN guaranteed** by consuming Atlas as source and never installing its `dependencies`; its
   bare `react`/`react-native` imports resolve to the app's single Expo 57 / RN 0.86 copy. No
   `overrides`.
6. **Minimal new dependencies.** Exactly one runtime dependency is required — `@expo/vector-icons`
   (used by Atlas's `Checkbox`/`Alert`); plus one fetch mechanism (a `giget` devDependency, a
   zero-dep git script, or committing the source). Full enumeration + reasons in
   `docs/atlas-integration.md`. **Nothing is installed without explicit approval.**

**This is explicitly a prototype integration strategy.** It does **not** replace the future Atlas
packaging roadmap (peer deps + `exports` + a real registry, per the superseded ADR-013). When Atlas
evolution is scheduled, the app migrates from vendored source to a versioned dependency; because the
app imports `@atlas/ui-native` **by name via tsconfig paths**, that migration is a config change, not
a rewrite of consumer code.

**Consequences.**
- Deterministic, offline-capable builds (pinned SHA); Atlas stays a separate, untouched repo.
- Trade-off: no semver range — upgrades mean re-vendoring a new SHA (acceptable and intentional for a
  prototype; Atlas is "upgraded incrementally" elsewhere).
- The vendored `vendor/atlas-ui-native/` is read-only; editing it is forbidden (equivalent to editing
  Atlas). App-specific needs are met by composing Atlas + app-layer theme/typography overrides
  (ADR-012).

**Verification (baseline):** ThemeProvider mounted · one Atlas Button renders on iOS + Web · no
duplicate RN · no Atlas edits · no publishing · no packaging.

**Known limitation (accepted technical debt, confirmed Sprint 0).** `tsc --noEmit` reports
type errors *inside* `vendor/atlas-ui-native/` (RN 0.81→0.86 type drift, e.g. `ViewStyle.cursor`,
`TextStyle.userSelect`). `tsconfig.json`'s `exclude: ["vendor"]` only prevents these files from
being picked up as **root** files — TypeScript still type-checks them when an app file imports them
transitively (e.g. importing `TabBar` from the Atlas barrel also pulls in `Alert.tsx`'s errors).
There is no clean fix without either editing vendor (forbidden by this ADR) or a packaging/build
step (rejected by ADR-013 for the prototype). Confirmed **non-blocking**: `tsc` is a dev-time check
only — Metro/Babel don't run it, so runtime and bundling are unaffected (verified: app boots cleanly
on iOS Simulator and Web). App code (`app/`, `src/`) type-checks with zero errors. Tracked as debt to
revisit only if/when Atlas becomes a packaged, versioned dependency.

---

## ADR-015 — Geist as the primary typeface
**Status:** Accepted (supersedes ADR-008)

**Context.** The designer opted for Geist over Inter for the app's typography.

**Decision.** Use Geist (`@expo-google-fonts/geist`) as the primary typeface, plus Geist Mono
(`@expo-google-fonts/geist-mono`) for balances and account numbers. Loaded via `useFonts` in
`app/_layout.tsx`; font-family mapping lives in `src/design-system/typography.ts` as an app-layer
override (ADR-012 item 4) — Atlas itself is untouched.

**Consequences.** Same rationale as ADR-008 (free, well-supported, banking-appropriate, monospace
keeps figures aligned) with a cleaner, more geometric character. No change to any other ADR.

---

## Open decisions awaiting input

These were raised during planning and are not yet locked. Current working defaults in brackets.

1. ~~**Atlas consumption mechanism**~~ — **RESOLVED** in ADR-013: publish `@atlas/ui-native` to
   GitHub Packages (peer deps + `exports` map + tag-triggered publish workflow); app consumes it as a
   versioned dependency.
2. **Visual direction** — [working default: Modern fintech / clean, likely overriding Atlas's blue
   brand]. Alternatives: Dark premium; Warm & friendly. Now interacts with Atlas's default palette.
3. **Copilot scope** — [working default: Rich & scripted with data-grounded action cards]. Alternatives: Conversational only; Full agentic feel.
4. **Lottie** — see ADR-010 [working default: no Lottie].

Update this section and the relevant ADR once decided.

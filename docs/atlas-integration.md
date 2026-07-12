# Atlas Integration (Prototype Strategy)

**Status:** proposed — awaiting dependency approval before any install.
**Approach:** A — pinned vendored Atlas source, consumed by this application only.
**Governing decision:** ADR-014 in `.claude/decisions.md` (supersedes ADR-013).

> This is a **temporary prototype integration** for AI Banking Copilot. It is **not** the long-term
> distribution model for Atlas. Atlas is treated as an external dependency **exactly as it exists
> today** — no commits, PRs, packaging, publishing, refactoring, or configuration changes to Atlas.

---

## 1. What we consume

- **Source:** `github.com/rizwan-uxd/atlas-design-system`, package `packages/ui-native`
  (`@atlas/ui-native`).
- **Pinned ref (deterministic):** commit `3dbde9c32d1e6f402486095fc74b7af14bbf362a`
  (`platform(stability): Phase 1 complete …`, 2026-05-17). Atlas publishes no tags, so we pin the
  **commit SHA**.
- **What we import:** the library barrels only —
  `@atlas/ui-native` (components), `@atlas/ui-native/theme`, `@atlas/ui-native/tokens`.
  We never import the package root `main` (it is Atlas's demo-app entry, `registerRootComponent`).

## 2. How it is wired (application-side only)

1. **Vendored source** is placed at `vendor/atlas-ui-native/` (fetched from the pinned SHA). A
   manifest (`vendor/atlas-ui-native/.atlas-pin.json`) records the exact SHA + fetch date for
   auditability.
2. **Resolution** is done with **`tsconfig.json` `paths`** — Expo's Metro honors tsconfig paths (the
   app already uses this for `@/*`), so the same mapping resolves for both TypeScript and the bundler
   with **no custom Metro resolver code** (respects "avoid custom Metro logic"):
   - `@atlas/ui-native` → `vendor/atlas-ui-native/components`
   - `@atlas/ui-native/theme` → `vendor/atlas-ui-native/theme`
   - `@atlas/ui-native/tokens` → `vendor/atlas-ui-native/tokens/atlas.tokens`
   Because `vendor/` sits inside the project root, Metro transpiles its TS/TSX automatically — no
   `watchFolders` needed.
3. **Single React Native instance (guaranteed):** we consume Atlas as **source** and never run
   `npm install` inside the vendored folder, so Atlas's own `dependencies` (React 19.1 / RN 0.81 /
   Expo 54) are **never installed**. Atlas's bare `react` / `react-native` imports resolve to the
   **app's single copy** (React 19.2 / RN 0.86 / Expo 57). No `overrides`, no duplicate RN.

## 3. Complete required runtime dependency list

Every external module the Atlas `ui-native` **library source** imports (verified by scanning all 32
`.ts`/`.tsx` files under `components/`, `theme/`, `tokens/`, `utils/`):

| Module | Required by (Atlas) | App status | Action |
|---|---|---|---|
| `react` | every component | **Have** — `19.2.3` | none |
| `react-native` | every component (View, Text, Pressable, StyleSheet, ActivityIndicator, useColorScheme…) | **Have** — `0.86.0` | none |
| `react-native-safe-area-context` | `NavBar/Header`, `NavBar/TabBar`, `Dialog` | **Have** — `~5.7.0` (Atlas pins `~5.6`; compatible) | none |
| `@expo/vector-icons` | `Checkbox` and `Alert` (`import { Ionicons }`) | **Missing** | **ADD** |

**→ Exactly one new runtime dependency: `@expo/vector-icons`.**
- **Why needed:** Atlas's `Checkbox` (checkmark) and `Alert` (variant icon) import `Ionicons` from
  `@expo/vector-icons`. Without it, those components fail to resolve at bundle time.
- **Version:** install via `npx expo install @expo/vector-icons` so the version is aligned to Expo
  SDK 57 (Atlas used `^15.0.3`; Expo will select the SDK-matched release).

### Explicitly NOT required (corrections from the scan)
- **`@gorhom/bottom-sheet`** — appears only in **comments/TODOs** in `Dialog.tsx`, not a real import.
  Not installed for Atlas.
- **`expo-status-bar`, `expo`** — imported only by Atlas's demo `App.tsx`, which we do not consume.
  (The app already has both anyway.)

## 4. Integration tooling (to fetch the pinned source)

Fetching the subfolder at a pinned SHA needs one mechanism. Options (pick one at approval):

| # | Mechanism | Adds a dependency? | Notes |
|---|---|---|---|
| i | **`giget`** (dev) + `postinstall` script | **Yes** — 1 devDependency (`giget`, tiny, no native) | Cross-platform, purpose-built for `gh:owner/repo/subdir#ref`. **Recommended.** |
| ii | `scripts/fetch-atlas.mjs` using system **`git`** sparse-checkout | **No** | Zero added deps; relies on `git` (present in dev + CI). |
| iii | **Commit** the vendored source at the pinned SHA | **No** | Most deterministic/offline; Atlas source lives read-only in this repo under `vendor/`. |

All three keep Atlas unmodified and pin the exact SHA. i and ii keep `vendor/` git-ignored (fetched
on install); iii commits it.

## 5. What this integration will NOT do

- No changes to the Atlas repo (no commits, PRs, packaging, publishing, refactors, `peerDependencies`
  or `exports` edits).
- No publishing to any registry.
- No custom Metro resolver logic beyond the tsconfig `paths` mapping.
- No `overrides`/`resolutions` hacks (unnecessary — see §2.3).
- No modification of Atlas component, token, or styling source.

## 6. Approval gate

**Nothing is installed until you approve.** To proceed I need:

1. **Approve the one runtime dependency:** `@expo/vector-icons` (Expo-57-aligned via `expo install`).
2. **Choose the fetch mechanism:** i (`giget`, recommended), ii (git script, zero deps), or iii
   (commit vendored source, zero tooling).

## 7. Verification (success criteria, after approval)

1. Mount Atlas `ThemeProvider` at the app root.
2. Render one Atlas `Button` on **iOS simulator** and **Web**.
3. Confirm **no duplicate React Native** (single instance; app boots without the "two copies of
   React" / invalid-hook errors).
4. Confirm **no Atlas source modified**, **nothing published**, **no packaging work**.

Once green, we proceed directly to **Screen 1**, inspecting Figma first (source of truth).

---

## 8. Baseline result — ✅ RESOLVED

**Fixed in Atlas** (branch `fix/ui-native-token-generator`, commit `37be7e8`): the token
generator now emits `textRole`, `letterSpacing` (CSS `em → RN pt` at base 16), and a default
aggregate export. Our fetch is re-pinned to `37be7e8`. Both baselines verified: the Atlas demo
renders (Expo 54) and AI Banking renders one Atlas Button (Expo 57); no duplicate RN; colors
unchanged. Original bug analysis retained below for record.

### Original blocker (now fixed)

The vendoring, resolution, single-RN, and `@expo/vector-icons` install all work. **However, no Atlas
component can render** at the pinned SHA:

- **Error:** `TypeError: Cannot read property 'spacing' of undefined` at
  `components/Badge/Badge.styles.ts:20` (and equivalently in every other component's styles) during
  module load.
- **Root cause:** Atlas's `tokens/atlas.tokens.ts` exports **only named** members (no
  `export default`), but all **13** component `*.styles.ts` files do
  `import tokens from '../../tokens/atlas.tokens'` (a **default** import). Under any standard
  Metro/Babel/tsc toolchain, a default import of a named-only ES module resolves to `undefined`, so
  `tokens.spacing` / `tokens.radius` / … throw at module evaluation.
- **Scope:** universal — every Atlas component's styles default-import tokens, so *no* component
  renders (not just `Badge`).
- **Not fixable by re-pinning:** the token generator (`scripts/convert-tokens.mjs`) never emits a
  default export, and components never use `import * as tokens`, so no Atlas ref works.
- **Confirmed in Atlas's own demo (independent of this integration).** The `packages/ui-native` demo
  was run standalone on Atlas's own toolchain (Expo 54.0.34 / RN 0.81.5 / React 19.1.0, Expo Go
  54.0.7). It bundles (799 modules) then crashes at runtime with the **identical** error —
  `[runtime not ready]: TypeError: Cannot read property 'spacing' of undefined`. This proves the
  defect is intrinsic to Atlas, not to our Expo 57 vendoring.

**Resolution requires one of (owner's decision — nothing done without approval):**
1. **Fix in Atlas** (one line): add `export default { …all token groups }` to `atlas.tokens.ts`
   (ideally in the generator), or change the 13 component imports to `import * as tokens`. Correct,
   but modifies Atlas — conflicts with "Atlas unchanged this project" (could be a scoped exception or
   the first task of the separate Atlas project).
2. **App-side interop shim** to make default-imports of named-only ESM resolve to the namespace.
   *Not recommended* — it is the kind of build-config hack we excluded and changes interop app-wide.

Until one is chosen, **Screen 1 cannot compose Atlas components.** App reverted to the safe
placeholder screen; ThemeProvider, fetch script, and `@atlas/*` resolution remain wired.

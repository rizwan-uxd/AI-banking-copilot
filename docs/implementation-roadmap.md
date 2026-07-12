# AI Banking Copilot — Implementation Roadmap

This is the single source of truth for implementation. Update it every session instead of creating
new planning documents. Full rules in `.claude/CLAUDE.md`; ADR detail in `.claude/decisions.md` —
this file summarizes, never duplicates.

---

## 1. Project Goal

**Objective.** A high-fidelity, cross-platform mobile prototype of an AI-powered banking assistant,
for UX validation — not a production financial product.

**Scope.** iOS, Android, Web — one codebase. No backend, no network, no real auth, no real financial
logic. The "AI" is a deterministic scripted mock engine over local data.

**Tech stack.** Expo SDK 57 · React Native 0.86 · React 19.2 · TypeScript (strict) · Expo Router ·
NativeWind v4 (app components) · Atlas `@atlas/ui-native` (vendored, StyleSheet + ThemeProvider) ·
Zustand · React Native Reanimated/Gesture Handler · `react-native-svg` (hand-rolled charts) ·
`lucide-react-native` (icons, pending install approval) · AsyncStorage (persist) · Inter typeface.

**Architecture principles.**
- One-directional imports: `app/ → features/ → components/ → design-system/`, with `store/`,
  `hooks/`, `lib/`, `data/` as shared leaves.
- Atlas is composed, never modified or duplicated. App-specific look/feel lives in
  `src/design-system/` as theme overrides on top of Atlas.
- All data flows from `src/data/` through typed loaders — no inline mock arrays, no fake network.
- Figma is the visual source of truth; inspect before building each screen.

**Success criteria.** Every screen in Section 3 renders correctly on iOS, Android, and Web; passes
strict TypeScript with no new `any`; uses design tokens (no hardcoded style values); meets the
accessibility bar in `.claude/CLAUDE.md`; introduces no network/backend/real financial logic.

---

## 2. Approved Architecture Decisions

Full text in `.claude/decisions.md`. Only active decisions summarized here.

**Atlas integration strategy (ADR-011, 012, 014).** Atlas is consumed as **pinned vendored source**
— the Atlas repo is never modified. `packages/ui-native` is vendored into `vendor/atlas-ui-native/`
at a pinned commit SHA via `scripts/fetch-atlas.mjs` (postinstall), resolved through `tsconfig.json`
`paths` (`@atlas/ui-native` → components/theme/tokens). Atlas keeps StyleSheet + `ThemeProvider`;
never rewritten. Only one runtime dependency added for it: `@expo/vector-icons`. This is a
prototype-only strategy; future Atlas evolution migrates to a versioned dependency without touching
consumer code (import path stays the same).

**Theme override strategy (ADR-012).** App-specific color and typography differences from Atlas's
default theme are implemented as an **app-layer override**, never inside Atlas: colors by injecting
a custom value into Atlas's `ThemeContext`; typography by app-level style values (no Metro alias
hacks, no Atlas refactor). Lives in `src/design-system/`.

**Mock data strategy (ADR-004, 005, 006).** No backend, no network, no React Query. All data is
local typed JSON in `src/data/` behind typed loaders, optionally with simulated latency for loading
states. The mock AI engine (`src/features/copilot/`) is deterministic — same input, same output —
and grounds its answers in the same data loaders the UI uses.

**Component ownership rules.**
- Atlas components (`Header`, `Button`, `Card`, `Badge`, `Tabs`, `Alert`, `Input`, …) are reused
  as-is, imported via `@atlas/ui-native`.
- Reusable app components (used by ≥2 screens) live in `src/components/` and compose Atlas
  primitives where possible.
- Screen-specific components live alongside their screen's feature folder.
- A component that looks reusable across *future products* is **recommended** for promotion to
  Atlas, never moved automatically.

**Design principles.** Compose, don't duplicate. One screen at a time. No unapproved redesigns.
Figma (file `T2vc7kUOb16GtImacmbPzY`) is authoritative for every screen's visual detail — see
Section 9 for the file-key note.

**Development rules (non-negotiable, from `.claude/CLAUDE.md`).** Never implement more than one
screen unless explicitly asked · reuse existing components before creating new ones · ask before
adding a dependency · keep diffs small and reviewable · plan before code · prefer local JSON over
fake APIs · no hardcoded hex/pixel values, semantic color names only · accessibility labels, roles,
44×44pt touch targets, dynamic type, reduced-motion support on every interactive/animated element.

---

## 3. Screen Inventory

| ID | Screen Name | Flow | Figma Node | Status |
|----|---|---|---|---|
| S01 | Home | Hub | `18:2743` | Not Started |
| S02 | Transaction Chat / Search Result | A — Explain & Dispute | `18:2866` | Not Started |
| S03 | Raise Dispute — Connecting | A | `18:2907` | Not Started |
| S04 | Dispute Success | A | `18:3232` | Not Started |
| S05 | Select Scope | B — Spending Insights | `20:375` | Not Started |
| S06 | Spending Overview | B | `20:425` | Not Started |
| S07 | Category Deep Dive | B | `20:535` | Not Started |
| S08 | Recommendations | B | `20:638` | Not Started |
| S09 | AI Discovers Opportunities | C — Product Advisor | `30:309` | Not Started |
| S10 | Why It's Recommended | C | `30:358` | Not Started |
| S11 | Top Matches | C | `30:420` | Not Started |
| S12 | Recommended Next Steps | C | `30:493` | Not Started |
| S13 | Pre-qualified | C | `31:367` | Not Started |

**Excluded from build:** Figma node `18:2778` ("2_search result") is an empty frame (no children) —
treated as an unbuilt stub, not a real screen. Figma node `20:309` ("UC2 - Screen 1 - Home") is a
second, differently-worded Home design — not queued for build; `S01` is treated as canonical. See
Section 9, R1/R2.

---

## 4. Navigation Map

```
S01 Home
 ├─ search "why was X deducted" → S02 Transaction Chat
 │     └─ pick issue type → Create ticket → S03 Raise Dispute (Connecting) → S04 Success → Home
 ├─ "Analyze spending" quick action → S05 Select Scope
 │     └─ Analyze → S06 Spending Overview
 │           ├─ tap category → S07 Category Deep Dive
 │           └─ View recommendations → S08 Recommendations → Home
 └─ "Find best products" quick action → S09 AI Discovers Opportunities
       └─ tap opportunity → S10 Why It's Recommended
             └─ See top matches → S11 Top Matches
                   └─ View details → S12 Recommended Next Steps
                         └─ Check eligibility → S13 Pre-qualified → Continue (out of scope) / Home
```

---

## 5. Component Inventory

### Atlas Components

| Component | Owner | Reused by | Status |
|---|---|---|---|
| Header | Atlas | All screens | Not Started |
| Button | Atlas | All screens (CTA footers) | Not Started |
| Card (+Header/Title/Description/Content/Footer) | Atlas | S02, S03, S06, S07, S08, S09, S10, S11, S12, S13 | Not Started |
| Badge | Atlas | S10, S11, S13, S09 | Not Started |
| Tabs | Atlas | S11 | Not Started |
| Alert | Atlas | S03, S13 | Not Started |
| Input | Atlas | Evaluate only — see Section 9, R-Input | Not Started |

### Reusable App Components

| Component | Owner | Reused by | Status |
|---|---|---|---|
| `HeroGradientBackground` | `src/components/ui/` | All screens | Not Started |
| `AppScreenHeader` | `src/components/ui/` | All screens | Not Started |
| `PrimaryCTAFooter` | `src/components/ui/` | Most screens | Not Started |
| `InsightCard` | `src/components/banking/` | S01, S06, S08, S09, S12 | Not Started |
| `DetailRow` / `KeyValueRow` | `src/components/ui/` | S02, S03, S07, S11, S13 | Not Started |
| `AvatarInitial` | `src/components/ui/` | S01, S07 | Not Started |
| `ConversationRow` | `src/components/copilot/` | S01 | Not Started |
| `ChatBubble` | `src/components/copilot/` | S02 | Not Started |
| `ProductCard` | `src/components/banking/` | S10, S11, S13 | Not Started |
| `ConfidenceBar` | `src/components/ui/` | S10, S13 | Not Started |
| `IconLabelTile` | `src/components/ui/` | S01, S08 | Not Started |
| `DonutChart` | `src/components/banking/` | S06 | Not Started |
| `BarChart` | `src/components/banking/` | S07 | Not Started |

### Screen-specific Components

| Component | Owner | Screen | Status |
|---|---|---|---|
| `AiSearchBar` | `src/features/copilot/` | S01 | Not Started |
| `IssueTypeGrid` | `src/features/copilot/` | S02 | Not Started |
| `SelectScopeListItem` | `src/features/transactions/` | S05 | Not Started |
| `ChecklistCard` | `src/features/accounts/` | S13 | Not Started |

---

## 6. Shared Data Models

| Model | Used by |
|---|---|
| `User` | S01, all headers |
| `Account` | S05 |
| `Transaction` | S02, S03, S07 |
| `Merchant` | S07, S02 |
| `SpendingCategory` | S06, S07 |
| `SpendingTrendPoint` | S07 |
| `Conversation` | S01, S02 |
| `Insight` | S01, S06, S08, S09 |
| `Dispute` / `Ticket` | S02, S03, S04 |
| `ProductRecommendation` | S09, S10, S11, S12, S13 |

All defined in `src/types/`, sourced from `src/data/*.json` via typed loaders — no inline arrays in
components.

---

## 7. Sprint Plan

### Sprint 0 — Foundation

**Sprint Goal.** Build everything every screen depends on, once, before touching a single screen.

**Deliverables.** App-layer theme override (`src/design-system/`) injected into Atlas
`ThemeContext`; global primitives (`HeroGradientBackground`, `AppScreenHeader`, `PrimaryCTAFooter`,
`DetailRow`, `AvatarInitial`); full mock data layer (models + JSON + loaders from Section 6).

**Screens.** None.

**Components.** `HeroGradientBackground`, `AppScreenHeader`, `PrimaryCTAFooter`, `DetailRow`,
`AvatarInitial`.

**Dependencies.** `lucide-react-native` (pending approval — Section 9, R4).

**Assets.** Hero background image, downloaded once from Figma into `assets/images/` as a static
file (no runtime network call).

**Acceptance Criteria.** Theme override renders navy/lavender palette + Inter Light headline over
the vendored Atlas Button without editing `vendor/`. All 10 data models load through typed loaders
with no `any`. Primitives render on iOS, Android, and Web.

**Exit Criteria.** Foundation primitives and data layer merged; no screen work has started.

---

### Sprint 1 — Home Experience

**Sprint Goal.** Ship S01 (Home) — the highest-leverage screen, exercising most Sprint 0 primitives
plus the components unique to the hub.

**Deliverables.** S01 fully implemented and matched to Figma node `18:2743`.

**Screens.** S01.

**Components.** `AiSearchBar`, `IconLabelTile`, `InsightCard`, `ConversationRow`.

**Dependencies.** None beyond Sprint 0.

**Assets.** Mic/waveform icon (lucide `Mic`).

**Acceptance Criteria.** Search bar, 4 quick-action chips, proactive insights list, and recent
conversations list all render from mock data; quick actions route to the correct flow entry point
per Section 4.

**Exit Criteria.** S01 status → Completed in Section 3; R1 (canonical Home) resolved and recorded in
Section 9.

---

### Sprint 2 — AI Assistant & Dispute Flow

**Sprint Goal.** Ship Flow A end-to-end (S02–S04).

**Deliverables.** Chat-based transaction Q&A, issue-type selection, dispute submission, and success
confirmation.

**Screens.** S02, S03, S04.

**Components.** `ChatBubble`, `IssueTypeGrid`.

**Dependencies.** None beyond Sprint 0/1.

**Assets.** Headset icon (connecting state), check icon (success state).

**Acceptance Criteria.** Full chat → dispute → success path is navigable from S01's search bar and
"Report an issue" quick action; ticket data is deterministic mock output, not randomized.

**Exit Criteria.** S02–S04 status → Completed; flow is demoable start to finish.

---

### Sprint 3 — Spending Insights

**Sprint Goal.** Ship Flow B end-to-end (S05–S08), introducing the hand-rolled chart components.

**Deliverables.** Scope selection, spending overview with donut chart, category deep dive with bar
chart, and recommendations screen.

**Screens.** S05, S06, S07, S08.

**Components.** `DonutChart`, `BarChart`, `SelectScopeListItem`.

**Dependencies.** None beyond Sprint 0/1 (uses `react-native-svg`, already approved per ADR-007).

**Assets.** None new.

**Acceptance Criteria.** Charts render correctly on all 3 platforms from `SpendingCategory` /
`SpendingTrendPoint` mock data; category tap drills into S07 with matching totals.

**Exit Criteria.** S05–S08 status → Completed; flow is demoable start to finish.

---

### Sprint 4 — Product Recommendations

**Sprint Goal.** Ship Flow C end-to-end (S09–S13) — expected to be the fastest sprint since it
mostly composes components already built.

**Deliverables.** Opportunity discovery, recommendation rationale, ranked comparison, next-step
actions, and pre-qualification screens.

**Screens.** S09, S10, S11, S12, S13.

**Components.** `ProductCard`, `ConfidenceBar`, `ChecklistCard`.

**Dependencies.** None beyond prior sprints.

**Assets.** VISA card mock asset (reused across S10, S11, S13).

**Acceptance Criteria.** Full opportunity → recommendation → comparison → next-step → pre-qualified
path is navigable from S01's "Find best products" quick action; all figures come from
`ProductRecommendation` mock data.

**Exit Criteria.** S09–S13 status → Completed; flow is demoable start to finish.

---

### Sprint 5 — Polish & QA

**Sprint Goal.** Cross-cutting quality pass across all 13 screens before calling the prototype done.

**Deliverables.** Accessibility audit (labels, roles, contrast, touch targets, dynamic type,
reduced-motion), empty/loading/error state pass, cross-platform layout regression pass (iOS,
Android, Web), TypeScript/lint clean run, Atlas promotion recommendations write-up (if any
components proved reusable beyond this app).

**Screens.** All (S01–S13).

**Components.** No new components expected; refinement only.

**Dependencies.** None.

**Assets.** None new.

**Acceptance Criteria.** Every screen meets the Definition of Done in `.claude/CLAUDE.md`
(accessibility, tokens-only styling, cross-platform, no new `any`, empty/loading/error states
considered).

**Exit Criteria.** All checklists in Section 8 fully checked.

---

## 8. Progress Tracker

### Screens
- [ ] S01 Home
- [ ] S02 Transaction Chat
- [ ] S03 Raise Dispute — Connecting
- [ ] S04 Dispute Success
- [ ] S05 Select Scope
- [ ] S06 Spending Overview
- [ ] S07 Category Deep Dive
- [ ] S08 Recommendations
- [ ] S09 AI Discovers Opportunities
- [ ] S10 Why It's Recommended
- [ ] S11 Top Matches
- [ ] S12 Recommended Next Steps
- [ ] S13 Pre-qualified

### Components
- [ ] HeroGradientBackground
- [ ] AppScreenHeader
- [ ] PrimaryCTAFooter
- [ ] DetailRow / KeyValueRow
- [ ] AvatarInitial
- [ ] InsightCard
- [ ] ConversationRow
- [ ] ChatBubble
- [ ] ProductCard
- [ ] ConfidenceBar
- [ ] IconLabelTile
- [ ] DonutChart
- [ ] BarChart
- [ ] AiSearchBar
- [ ] IssueTypeGrid
- [ ] SelectScopeListItem
- [ ] ChecklistCard

### Assets
- [ ] Hero background image (local static)
- [ ] Mic/waveform icon
- [ ] Headset icon
- [ ] Check (success) icon
- [ ] VISA card mock

### Mock Data
- [ ] User
- [ ] Account
- [ ] Transaction
- [ ] Merchant
- [ ] SpendingCategory
- [ ] SpendingTrendPoint
- [ ] Conversation
- [ ] Insight
- [ ] Dispute / Ticket
- [ ] ProductRecommendation

### Theme
- [ ] Navy/lavender color override injected into Atlas ThemeContext
- [ ] Inter Light/Regular/Medium/SemiBold weights wired
- [ ] Decorative icon-chip tint scale defined (Section 9, R8)

### Navigation
- [ ] Expo Router routes scaffolded for all 13 screens
- [ ] Flow A routing (S01 → S02 → S03 → S04)
- [ ] Flow B routing (S01 → S05 → S06 → S07/S08)
- [ ] Flow C routing (S01 → S09 → S10 → S11 → S12 → S13)

---

## 9. Risks & Decisions

### Open Questions
- **R1 — Duplicate Home screens.** `1_Home` (S01) and Figma node `20:309` ("UC2 - Screen 1 - Home")
  have different copy and quick actions. Working assumption: S01 is canonical and its 4 quick
  actions route to Flows A/B/C. Needs designer confirmation before Sprint 1.
- **R2 — Empty "2_search result" frame.** Figma node `18:2778` has zero children. Assumed an
  abandoned stub; excluded from Section 3. Flag if it should exist.
- **R9 — Header icon meaning.** Left/right 24×24 icons in non-Home headers mostly read as
  back-chevron + none/overflow from screenshots, but not confirmed per-screen. Will confirm during
  each sprint rather than guessing upfront.

### Assumptions
- **R7 — Flow B/C visual fidelity.** Confirmed via screenshots to match Flow A's production quality
  (navy hero, white cards, pastel icon chips) despite emoji-named Figma layers; icons implemented as
  real `lucide-react-native` vectors, not literal emoji glyphs.
- **R6 — Section labels aren't screens.** Figma frames "Frame 32/33/34" are annotation banners
  ("Search result flow", "Spending insight flow — claude version", "Product suggestion flow —
  claude version"), excluded from Section 3.
- **R-Input — Atlas `Input` reuse.** Atlas's `Input` component has a fixed `borderRadius: tokens.radius.md`
  (8px) with no style-override prop and no blur/translucent variant, so it cannot reproduce Home's
  frosted-glass pill search bar. `AiSearchBar` is scoped as a screen-specific component rather than
  an Atlas reuse. Re-evaluate if Atlas gains a style-override prop.

### Risks
- **R3 — Figma file key mismatch.** Prior session memory recorded the Figma system-of-record as file
  `cKYhfaHLCoyMHi9nKr63Ig`; this roadmap's screens live in file `T2vc7kUOb16GtImacmbPzY`
  ("AI-Banking-Copilot---Transaction-Detail"). Treat the latter as authoritative going forward;
  update `.claude/decisions.md` / ADR-011 if confirmed permanent.
- **R4 — New dependency: `lucide-react-native`.** Pre-approved in the `.claude/CLAUDE.md` stack
  table but not yet installed (only `@expo/vector-icons` is, added for Atlas internals). First real
  use is Sprint 1 (Home). Needs explicit install approval per the "ask before adding a dependency"
  rule.
- **R5 — Decorative hero background asset.** Figma export URLs (`figma.com/api/mcp/asset/...`)
  expire in 7 days. Mitigation: download once into `assets/images/` as a static file during Sprint 0
  — a one-time fetch, not a runtime network call, so it doesn't violate the no-network rule.
- **R8 — Icon-chip pastel tints** (peach/lavender/mint per insight type) aren't part of Atlas's
  semantic palette. Needs a small app-level decorative tint scale, defined during Sprint 0's theme
  work.
- **ADR-014 doc drift.** `.claude/decisions.md` ADR-014 states the pinned Atlas SHA as
  `3dbde9c...`, but `scripts/fetch-atlas.mjs` currently pins `37be7e813d4...` (the token-generator
  fix commit referenced in the project handoff). The ADR text wasn't updated after the re-pin —
  flagging for correction in `.claude/decisions.md`, out of scope for this roadmap document.

### Future Enhancements
- Promote any of the "Reusable App Components" (Section 5) to Atlas if proven reusable across future
  products — recommendation only, per ADR-011; not automatic.
- Lottie for onboarding/AI "thinking" animation — deferred per ADR-010 (open).
- Visual direction and copilot scope defaults (`.claude/decisions.md` § Open decisions) still await
  designer confirmation; revisit if either changes mid-build.

---

## 10. Daily Development Log

Append one entry per working session, most recent first. Do not edit past entries except to correct
factual errors.

<!--
Template — copy for each new entry:

### YYYY-MM-DD

**Sprint:** SprintN — Name

**Completed:**
-

**Files Changed:**
-

**New Components:**
-

**Problems Found:**
-

**Decisions:**
-

**Next Task:**
-
-->

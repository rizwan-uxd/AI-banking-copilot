# Design System

**Atlas is the base design system.** The AI Banking Copilot app is a *consumer* of Atlas: it
composes Atlas components and layers app-specific look-and-feel on top as **theme overrides**. The
app never modifies, forks, or re-implements Atlas.

App-level styling remains **token-first** and consumed through NativeWind, but those tokens express
*overrides on top of Atlas defaults* (typography, colors, spacing unique to AI Banking) — not a
from-scratch system. Nothing in the app hardcodes a color, spacing value, radius, or font size that
a token already covers.

> How Atlas is consumed (package/location) and what it is built on are being confirmed. This
> document describes the intended relationship; the wiring details are filled in once Atlas's
> source is known. See ADR-011 in `decisions.md`.

## Atlas relationship (rules)

- **Compose, never duplicate.** Build UI from Atlas components; never copy or rewrite them.
- **Never modify Atlas** unless explicitly requested.
- **App holds the overrides.** Different type/color/spacing → theme overrides in `src/design-system/`, layered on Atlas.
- **App holds app-unique components.** Banking- or copilot-specific components live in the app, composed from Atlas primitives where possible.
- **Recommend, don't move.** If an app component looks reusable across products, recommend promoting it to Atlas; do not move it automatically.

---

## Principles

1. **Single source of truth.** All visual decisions live in `src/design-system/tokens.ts`.
2. **Semantic over literal.** Components reference `surface`, `text-muted`, `positive`, `negative` — never raw hues. This keeps money semantics (in/out) consistent and themable.
3. **Theme from day one.** Light and dark are equal citizens. Every token has a value in both.
4. **4pt spacing grid.** All spacing, sizing, and layout snaps to a 4pt rhythm.
5. **Accessible by construction.** Contrast, type scale, and touch targets meet WCAG AA in both themes.

---

## Token categories

Defined in `src/design-system/tokens.ts` and wired into `tailwind.config.js` so they are available
as Tailwind/NativeWind utilities.

### Color (semantic)
| Token | Purpose |
|---|---|
| `background` | App base background |
| `surface` | Cards, sheets |
| `surface-elevated` | Raised cards, modals |
| `border` | Hairlines, dividers |
| `text-primary` | Primary text |
| `text-secondary` | Supporting text |
| `text-muted` | Captions, placeholders |
| `accent` | Brand action color |
| `accent-muted` | Accent backgrounds/tints |
| `positive` | Money in / success |
| `negative` | Money out / error |
| `warning` | Cautions |
| `info` | Informational |

Each maps to a concrete value per theme in `theme.ts`. Raw palette scales (e.g. `brand-50…900`)
back the semantic tokens but are not referenced directly by components.

### Spacing (4pt grid)
`0, 1(4), 2(8), 3(12), 4(16), 5(20), 6(24), 8(32), 10(40), 12(48), 16(64)…`

### Radii
`sm(8), md(12), lg(16), xl(20), 2xl(24), full`. Cards default to `2xl`; pills use `full`.

### Typography
Single family: **Geist** (`@expo-google-fonts/geist`), plus **Geist Mono**
(`@expo-google-fonts/geist-mono`) for balances and account numbers. See ADR-015.

| Scale | Use |
|---|---|
| `display` | Hero balances |
| `title` | Screen titles |
| `heading` | Section headers |
| `body` | Default text |
| `caption` | Metadata, labels |
| `mono` | Balances, account/card numbers |

Each scale defines size, line-height, and weight. Type respects OS dynamic-type settings.

### Elevation / shadows
Consistent shadow tokens (`shadow-sm`, `shadow-md`, `shadow-lg`) rather than ad-hoc values, so
cards feel tactile and coherent. Web uses `box-shadow`; native uses elevation/shadow props via a
shared `Card` primitive.

### Motion
| Token | Value |
|---|---|
| `duration.fast` | 150ms |
| `duration.base` | 250ms |
| `duration.slow` | 400ms |
| `easing.standard` | ease-in-out curve |
| `easing.entrance` | decelerate |
| `easing.exit` | accelerate |

All animations use these tokens (via Reanimated) so motion feels unified. Reduced-motion
preferences are respected.

---

## Theming

- Light + dark defined in `src/design-system/theme.ts` as semantic-token → value maps.
- NativeWind `dark:` variant + a theme context drive runtime switching.
- User preference persists via AsyncStorage; defaults to system.
- Every new component is verified in **both** themes before it is considered done.

---

## Component system

Three tiers, composed bottom-up on top of Atlas. Domain and copilot components compose primitives —
styling is never duplicated, and Atlas components are never rewritten.

### Primitives — `components/ui/`
These are **thin app wrappers/compositions over Atlas primitives** (applying app theme overrides),
*not* from-scratch components. A wrapper is only added when the app needs to bind an Atlas component
to app tokens or defaults; otherwise Atlas components are used directly. Anything Atlas already provides — `Button`, `Input`, `Label`, `Textarea`, `Checkbox`, `Switch`,
`Card` (+ Header/Title/Description/Content/Footer), `Badge`, `Alert`, `Dialog`, `Tabs`, `NavBar`
(Header, TabBar) — is consumed from Atlas, not reimplemented (confirmed component list, ADR-011).
Atlas does **not** supply `Text`, `Screen`, `Icon`, layout primitives, or a chart system — these are
app-built (composed with Atlas tokens/colors where relevant): `Screen`, `Text`, `Container`,
`Section`, `Spacer`, `Divider`, `Icon` (wrapping `lucide-react-native`).

### Banking domain — `components/banking/`
`AccountCard`, `BalanceHeader`, `TransactionRow`, `TransactionList`, `CategoryPill`,
`SpendingChart`, `QuickActions`, `CardVisual`, `MerchantIcon`, `InsightCard`.

### Copilot — `components/copilot/`
`ChatMessage`, `StreamingText`, `TypingIndicator`, `Composer`, `SuggestionChips`,
`CopilotActionCard`, `CopilotFab`.

### Component contract
Every component must:
- Be prop-driven with explicit TypeScript prop types and sensible defaults.
- Style exclusively through tokens (NativeWind classes).
- Provide accessibility metadata (label, role, state).
- Work on iOS, Android, and Web.
- Render correctly in light and dark themes.

---

## Charts

Charts are **hand-rolled on `react-native-svg`** rather than pulled from a heavy chart library.
This keeps the bundle small, guarantees on-brand styling via tokens, and ensures identical
rendering across all three platforms. Chart primitives (bars, donut, sparkline) live in
`components/banking/` and consume color/motion tokens directly.

---

## Iconography

`lucide-react-native` for a clean, consistent, tree-shakeable icon set. Icons are wrapped in an
`Icon` primitive so size and color always resolve to tokens.

---

## Do / Don't

**Do**
- Add or adjust visual decisions in `tokens.ts` / `theme.ts`.
- Reference semantic tokens.
- Verify light + dark and all three platforms.

**Don't**
- Hardcode hex, raw px, or inline style objects for token-covered properties.
- Reference raw palette scales from components.
- Introduce a UI kit or a heavy chart library.

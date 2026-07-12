# Architecture

## Overview

The AI Banking Copilot is a **local-first, cross-platform prototype**. There is no backend, no
network, and no real authentication. The application is organized in clean, one-directional
layers so that presentation, feature logic, and data remain decoupled and independently testable.

```
┌─────────────────────────────────────────────────────────┐
│  app/  (Expo Router — routes only, thin composition)     │
└───────────────┬─────────────────────────────────────────┘
                │ composes
┌───────────────▼─────────────────────────────────────────┐
│  features/   (domain orchestration + mock AI engine)     │
└───────┬───────────────────────────┬─────────────────────┘
        │ renders                    │ reads/writes
┌───────▼─────────────┐   ┌──────────▼─────────────────────┐
│  components/         │   │  store/ (Zustand)              │
│  ui · banking ·      │   └──────────┬─────────────────────┘
│  copilot            │              │ seeded from
└───────┬─────────────┘   ┌──────────▼─────────────────────┐
        │ styled by       │  data/ (local JSON + loaders)  │
┌───────▼─────────────┐   └────────────────────────────────┘
│  design-system/     │
│  tokens · theme     │   shared leaves: hooks/ · lib/ · types/
└─────────────────────┘
```

## Layers

### 1. Routing layer — `app/`
- File-based routing via Expo Router v4.
- Route files are **thin**: they set up layout, read route params, and compose components/features.
- No business logic, no data transformation, no inline styling beyond layout.
- Dynamic routes (`account/[id]`, `transaction/[id]`) give real, deep-linkable URLs — which also makes the web build feel legitimate.

### 2. Feature layer — `src/features/`
- Groups logic by domain: `accounts/`, `transactions/`, `copilot/`.
- Exposes hooks (`useAccounts`, `useTransactions`, `useCopilot`) that orchestrate state + data.
- The **mock AI engine** lives in `features/copilot/`. It is the only non-trivial logic in the app.

### 3. Presentation layer — `src/components/`
- `ui/` — design-system primitives (Button, Card, Text, Sheet…).
- `banking/` — domain widgets (AccountCard, TransactionRow, SpendingChart…).
- `copilot/` — chat UI (ChatMessage, StreamingText, Composer…).
- Components are **prop-driven and presentational** — no data fetching inside them.

### 4. Design system — `src/design-system/`
- Tokens (colors, spacing, radii, typography, shadows, motion) consumed by NativeWind and components.
- Theme mapping for light/dark. See `design-system.md`.

### 5. Data layer — `src/data/`
- Local JSON is the **single source of truth**.
- Typed loaders wrap the JSON, validate shape against `src/types/`, and expose query functions.
- Optionally returns promises with artificial latency to exercise loading/skeleton states.

### 6. Shared leaves
- `hooks/` — reusable, presentation-agnostic hooks.
- `lib/` — pure utilities (currency formatting, date formatting, math). No side effects.
- `types/` — shared domain models used across every layer.
- `constants/` — route names, mock latency values, app config.

## Dependency rules

- Imports flow **one direction only**: `app → features → components → design-system`.
- Shared leaves (`hooks`, `lib`, `types`, `data`) may be imported by any layer but import nothing "upward".
- A component must never import a route or a feature. A feature must never import a route.
- Violations are treated as bugs.

## Data flow

1. **Seeding:** on app start, Zustand stores hydrate from typed loaders in `src/data/`.
2. **Reading:** screens read from stores (or directly from loaders for static data) via feature hooks.
3. **Deriving:** aggregations (spending by category, subscriptions, balances) are computed in `lib/` or feature selectors — never inside components.
4. **Persistence:** only UI preferences (theme, onboarding-complete) persist to AsyncStorage via Zustand's `persist` middleware. Financial "data" is always re-seeded from JSON.

## The mock AI engine (detail)

Located in `src/features/copilot/`. Pipeline:

```
user input
   → intent matcher (scripted scenarios in data/copilot-scenarios.ts)
   → resolver (queries data/ loaders for real numbers)
   → response builder (text + optional rich action card payload)
   → streamer (emits tokens with realistic timing)
   → useCopilotStore (chat history + streaming state)
```

- **Deterministic:** identical input → identical output. Demos are repeatable.
- **Grounded:** answers about money are computed from the same local data the UI shows, so the numbers always agree.
- **Graceful fallback:** unmatched input returns a friendly, generic assistant response.
- **Rich results:** some intents return structured payloads that render as inline cards (e.g. a mini spending breakdown) rather than plain text.

## Cross-platform strategy

- One codebase targets iOS, Android, and Web through Expo.
- Platform-specific behavior is isolated behind `Platform.select` / `Platform.OS`.
- Web is a first-class target: layouts are responsive, routes are real URLs, and every component is verified in the browser.

## Testing & verification philosophy

- Pure logic in `lib/` and feature selectors is the most valuable to unit-test (currency math, aggregations, intent matching).
- UI is verified by driving the real app on all three platforms, not by snapshotting alone.
- No change is "done" until it runs cleanly on iOS, Android, and Web.

## Non-goals

- No backend, database, or network layer.
- No real authentication, PCI/financial compliance, or transaction execution.
- No server-side AI or real LLM calls.
- No heavy UI frameworks or global state beyond Zustand.

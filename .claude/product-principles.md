# Product Principles

The values that guide every UX and product decision in the AI Banking Copilot prototype. When a
trade-off is unclear, these principles break the tie.

---

## 1. Trust is the product
Banking is emotional. Every screen should feel calm, precise, and dependable. Favor clarity over
cleverness, generous whitespace over density, and steady motion over flashy effects. Nothing
should feel unstable or uncertain when money is on screen.

## 2. The Copilot is a partner, not a gimmick
The AI is the differentiator — but it earns trust by being **useful and grounded**, not chatty.
Every copilot answer should:
- reference the user's actual (mock) data,
- agree with the numbers shown elsewhere in the app,
- offer a next action where relevant,
- degrade gracefully when it doesn't understand.

A copilot that guesses or contradicts the dashboard destroys trust instantly.

## 3. Clarity over completeness
Show the one number that matters, then let people drill in. Progressive disclosure beats dense
dashboards. A person should understand any screen in under three seconds.

## 4. Money semantics are sacred
Positive and negative flows are always visually unambiguous (via `positive` / `negative` tokens,
never color alone — pair with sign, icon, and label for accessibility). Balances always use the
monospace face and are always formatted through `lib/currency.ts`. Never render a raw number as
money.

## 5. Accessible to everyone, always
Accessibility is a baseline, not a phase. WCAG AA contrast in both themes, 44pt touch targets,
screen-reader labels and roles, dynamic type, and respect for reduced-motion. If a beautiful design
fails accessibility, the design is wrong.

## 6. Motion with meaning
Animation communicates state and continuity — it is never decoration for its own sake. Motion uses
shared tokens so the whole app feels like one system, and it always yields to reduced-motion
preferences. Smooth 60fps or don't ship it.

## 7. One system, three platforms
iOS, Android, and Web are equal citizens. A feature isn't done until it works and feels right on
all three. Respect platform conventions where they matter (safe areas, gestures, focus) without
forking the design.

## 8. Realistic, not real
The prototype should be indistinguishable from a real banking app in look and feel — while never
pretending to be a real financial service. No real credentials, no real transactions, no
misleading claims. The data is obviously plausible mock data; the experience is genuinely polished.

## 9. Details are the design
The difference between a prototype and a product is the details: empty states, loading skeletons,
error copy, haptic feedback, focus order, the pause before the copilot "thinks." Design the edges,
not just the happy path.

## 10. Maintainable by design
Reusable components, strong types, token-driven styling, and clean layering aren't overhead — they
are what let the prototype evolve quickly under changing product direction. Optimize for the next
person (or AI) who touches the code.

---

## Decision heuristics

When choices conflict, resolve in this order:
1. **Trust & clarity** — will the user understand and believe what they see?
2. **Accessibility** — does it work for everyone?
3. **Cross-platform integrity** — is it right on all three targets?
4. **Craft & polish** — does it feel premium?
5. **Simplicity of implementation** — is it maintainable and minimal?

Higher principles win. A more impressive animation never justifies a less trustworthy or less
accessible experience.

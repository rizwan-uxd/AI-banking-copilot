/**
 * App-layer scale tokens. Spacing/radius intentionally mirror Atlas's own
 * scale (vendor/atlas-ui-native/tokens/atlas.tokens.ts) so app and Atlas
 * components stay on the same 4pt rhythm without importing across the
 * vendor boundary. See ADR-011/012 — this is an override *layer*, not a
 * replacement token system.
 */

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999,
} as const;

export const motion = {
  duration: {
    fast: 150,
    base: 250,
    slow: 400,
  },
  easing: {
    standard: [0.4, 0, 0.2, 1] as const,
    entrance: [0, 0, 0.2, 1] as const,
    exit: [0.4, 0, 1, 1] as const,
  },
} as const;

export const tokens = { spacing, radii, motion };

export default tokens;

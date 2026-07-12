import atlasTokens, { light as atlasLight, dark as atlasDark, primitive } from "@atlas/ui-native/tokens";
import type { SemanticColor, Theme as AtlasTheme } from "@atlas/ui-native/tokens";

/**
 * App-layer theme override (ADR-012: "color overrides are applied by
 * injecting Atlas's ThemeContext value"). `lightOverrides`/`darkOverrides`
 * are partial patches on top of Atlas's own palette, in Atlas's own key
 * shape — that's what Atlas components read via useTheme().colors.
 *
 * Values sourced from Atlas's own Figma variable definitions (`Color -
 * accent` → `color/brand/700`, `Color accent 2` / `Text color` →
 * `color/brand/950`, `Text color subtle` → project-specific `#0A1953` @ 80%
 * opacity — not an Atlas primitive), confirmed against the Home screen
 * (Figma `LGV5xzUyUxDEReq6FY4zn7`, node 224:1496) and approved by the user
 * 2026-07-12. `foregroundSubtle` stays a solid color — the 80% opacity is
 * applied separately at each usage site (e.g. `className="opacity-80"` in
 * `ListRow`), matching how Figma itself separates fill color from fill
 * opacity. Dark-mode equivalents were not specified in Figma, so
 * `darkOverrides` stays empty.
 *
 * Typed as `Partial<Record<SemanticColor, string>>` rather than
 * `Partial<AtlasTheme>` — Atlas's `Theme` type is `typeof light` (an `as
 * const` object), so every key's type is its own default hex literal, which
 * would reject any override value. `SemanticColor` (`keyof typeof light`)
 * keeps key-name safety without that literal-value constraint.
 */
const lightOverrides: Partial<Record<SemanticColor, string>> = {
  primary: primitive["brand-700"], // #2350be — "Color - accent"
  foreground: primitive["brand-950"], // #0a1d48 — "Color accent 2" / "Text color"
  foregroundSubtle: "#0A1953", // "Text color subtle" (project-specific, not an Atlas primitive)
  backgroundSubtle: "#e5ebf4",
};
const darkOverrides: Partial<Record<SemanticColor, string>> = {};

export const atlasLightTheme: AtlasTheme = { ...atlasLight, ...lightOverrides } as AtlasTheme;
export const atlasDarkTheme: AtlasTheme = { ...atlasDark, ...darkOverrides } as AtlasTheme;

export const scaleTokens = atlasTokens;

/**
 * App semantic theme (design-system.md "Color (semantic)" table) — the names
 * app-built components (Screen, Text, Container…) and NativeWind classes
 * consume, derived from the same overridden Atlas palette above.
 */
export type SemanticTheme = {
  background: string;
  surface: string;
  surfaceElevated: string;
  /** Muted/tinted surface — body panels, chip backgrounds. Figma `#e5ebf4`. */
  surfaceMuted: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentMuted: string;
  /**
   * Fixed dark-navy brand color (Atlas `brand-950`, Figma `--color-accent-2`)
   * — icon badges / icons on a light surface. Not a light/dark-adaptive
   * semantic slot like the others; same value in both themes since Figma
   * only specifies a light-mode design for this project so far.
   */
  navy: string;
  /** Foreground for content placed on a navy/brand-colored surface (e.g. icon glyphs on a navy badge). */
  onAccent: string;
  positive: string;
  negative: string;
  warning: string;
  info: string;
};

function toSemanticTheme(colors: AtlasTheme): SemanticTheme {
  return {
    background: colors.background,
    surface: colors.surface,
    surfaceElevated: colors.surfaceRaised,
    surfaceMuted: colors.backgroundSubtle,
    border: colors.border,
    textPrimary: colors.foreground,
    textSecondary: colors.foregroundMuted,
    textMuted: colors.foregroundSubtle,
    accent: colors.primary,
    accentMuted: colors.primarySubtle,
    navy: primitive["brand-950"],
    onAccent: colors.foregroundOnBrand,
    positive: colors.success,
    negative: colors.danger,
    warning: colors.warning,
    info: colors.info,
  };
}

export const light = toSemanticTheme(atlasLightTheme);
export const dark = toSemanticTheme(atlasDarkTheme);

export default { light, dark };

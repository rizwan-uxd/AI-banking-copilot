/**
 * Typography override layer (ADR-012 item 4, ADR-015). Atlas ships no
 * fontFamily — only numeric scale tokens — so the app owns the full type
 * system: family names loaded via `useFonts` in `app/_layout.tsx`, and the
 * scale from design-system.md (`display / title / heading / body / caption /
 * mono`).
 */

export const fontFamily = {
  light: "Geist_300Light",
  regular: "Geist_400Regular",
  medium: "Geist_500Medium",
  semibold: "Geist_600SemiBold",
  bold: "Geist_700Bold",
  mono: "GeistMono_400Regular",
  monoMedium: "GeistMono_500Medium",
} as const;

export type TextRole = keyof typeof textRoles;

export const textRoles = {
  display: { fontFamily: fontFamily.bold, fontSize: 36, lineHeight: 43 },
  title: { fontFamily: fontFamily.semibold, fontSize: 28, lineHeight: 34 },
  heading: { fontFamily: fontFamily.semibold, fontSize: 22, lineHeight: 28 },
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  mono: { fontFamily: fontFamily.mono, fontSize: 16, lineHeight: 24 },
} as const;

export default textRoles;

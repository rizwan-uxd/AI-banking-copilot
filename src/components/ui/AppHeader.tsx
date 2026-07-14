import type { ReactNode } from "react";

import { Header } from "@atlas/ui-native";

import { fontFamily, useAppTheme } from "@/design-system";

export interface AppHeaderProps {
  title: string;
  leftAction?: ReactNode;
}

/**
 * Navy header bar shared by every pushed copilot/product screen (Figma "Header bar" — dark navy
 * background, white title, white back chevron; e.g. nodes 224:1128, 273:1594, 279:1182, 295:2544).
 * Atlas `Header`'s only variants are "default" (opaque white surface), "transparent", and
 * "elevated" (also a white surface) — none render a dark bar, which left the back chevron (rendered
 * white via `Icon color="onAccent"`) invisible against the "default" variant's white background.
 * This wraps `Header` with a `colors.navy` background + white title override at the app layer
 * instead of touching Atlas (CLAUDE.md "never modify Atlas"). Promoted from copilot-only to
 * `components/ui/` once the product-recommendations flow needed the same header outside chat
 * screens.
 *
 * `titleStyle` also sets `fontFamily` — Atlas ships no fontFamily at all (ADR-011), so `Header`'s
 * title renders in the OS system font by default; this keeps its own `fontWeight: '600'` but swaps
 * in Geist Semibold.
 */
export function AppHeader({ title, leftAction }: AppHeaderProps) {
  const { colors } = useAppTheme();
  return (
    <Header
      title={title}
      leftAction={leftAction}
      style={{ backgroundColor: colors.navy, borderBottomWidth: 0 }}
      titleStyle={{ color: colors.onAccent, fontFamily: fontFamily.semibold }}
    />
  );
}

export default AppHeader;

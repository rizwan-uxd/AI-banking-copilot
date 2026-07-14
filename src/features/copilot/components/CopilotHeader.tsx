import type { ReactNode } from "react";

import { Header } from "@atlas/ui-native";

import { useAppTheme } from "@/design-system";

export interface CopilotHeaderProps {
  title: string;
  leftAction?: ReactNode;
}

/**
 * Navy header bar shared by every copilot chat/results screen (Figma "Header bar" — dark navy
 * background, white title, white back chevron; e.g. nodes 224:1128, 273:1594, 279:1182). Atlas
 * `Header`'s only variants are "default" (opaque white surface), "transparent", and "elevated"
 * (also a white surface) — none render a dark bar, which left the back chevron (rendered white via
 * `Icon color="onAccent"`) invisible against the "default" variant's white background. This wraps
 * `Header` with a `colors.navy` background + white title override at the app layer instead of
 * touching Atlas (CLAUDE.md "never modify Atlas").
 */
export function CopilotHeader({ title, leftAction }: CopilotHeaderProps) {
  const { colors } = useAppTheme();
  return (
    <Header
      title={title}
      leftAction={leftAction}
      style={{ backgroundColor: colors.navy, borderBottomWidth: 0 }}
      titleStyle={{ color: colors.onAccent }}
    />
  );
}

export default CopilotHeader;

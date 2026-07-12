import type { LucideIcon } from "lucide-react-native";

import { useAppTheme } from "@/design-system";

export interface IconProps {
  /** A `lucide-react-native` icon component, e.g. `Home`, `ArrowRight`. */
  icon: LucideIcon;
  /** Pixel size. @default 24 */
  size?: number;
  /** Semantic color token. @default "primary" */
  color?: "primary" | "secondary" | "muted" | "positive" | "negative" | "accent" | "navy" | "onAccent";
  strokeWidth?: number;
}

const colorToken: Record<NonNullable<IconProps["color"]>, keyof ReturnType<typeof useAppTheme>["colors"]> = {
  primary: "textPrimary",
  secondary: "textSecondary",
  muted: "textMuted",
  positive: "positive",
  negative: "negative",
  accent: "accent",
  navy: "navy",
  onAccent: "onAccent",
};

/**
 * App-layer Icon primitive wrapping `lucide-react-native` (ADR: Icons —
 * lucide-react-native). Resolves color through the app theme so icons always
 * track the active semantic token instead of a hardcoded hex.
 */
export function Icon({ icon: LucideIconComponent, size = 24, color = "primary", strokeWidth = 2 }: IconProps) {
  const { colors } = useAppTheme();
  return <LucideIconComponent size={size} color={colors[colorToken[color]]} strokeWidth={strokeWidth} />;
}

export default Icon;

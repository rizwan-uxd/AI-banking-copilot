import type { ReactNode } from "react";
import { Text } from "react-native";

import { fontFamily } from "@/design-system";

export interface BadgeLabelProps {
  children: ReactNode;
}

/**
 * Font-only wrapper for text nested inside Atlas `Badge`. Atlas ships no `fontFamily` at all
 * (ADR-011) — `Badge` sets `fontWeight` on its internal `Text` but never a family, so badge labels
 * render in the OS system font instead of Geist everywhere `Badge` is used. This sets only
 * `fontFamily`, deliberately not touching color or size, so Atlas's own per-variant tint color
 * (success/info/warning/etc.) still cascades from Badge's own `Text` uninterrupted — nested RN
 * `Text` inherits any style it doesn't set itself from its ancestor.
 */
export function BadgeLabel({ children }: BadgeLabelProps) {
  return <Text style={{ fontFamily: fontFamily.medium }}>{children}</Text>;
}

export default BadgeLabel;

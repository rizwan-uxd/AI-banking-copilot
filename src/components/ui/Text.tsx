import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import type { TextRole } from "@/design-system";

export interface TextProps extends RNTextProps {
  /** Typography scale variant (design-system.md). @default "body" */
  variant?: TextRole;
  /** Semantic color token. @default "primary" */
  color?: "primary" | "secondary" | "muted" | "positive" | "negative" | "accent";
  className?: string;
}

const variantClassName: Record<TextRole, string> = {
  display: "text-display font-sans-bold",
  title: "text-title font-sans-semibold",
  heading: "text-heading font-sans-semibold",
  body: "text-body font-sans",
  caption: "text-caption font-sans",
  mono: "text-mono font-mono",
};

const colorClassName: Record<NonNullable<TextProps["color"]>, string> = {
  primary: "text-text-primary",
  secondary: "text-text-secondary",
  muted: "text-text-muted",
  positive: "text-positive",
  negative: "text-negative",
  accent: "text-accent",
};

/**
 * App-layer Text primitive. Atlas does not ship a Text component (ADR-011),
 * so this composes RN `Text` with the app's Geist typography + semantic
 * color tokens instead of ad-hoc styling. Named `variant` (not `role`) to
 * avoid colliding with RN `TextProps.role` (ARIA role).
 */
export function Text({ variant = "body", color = "primary", className = "", ...props }: TextProps) {
  return (
    <RNText
      {...props}
      className={`${variantClassName[variant]} ${colorClassName[color]} ${className}`}
    />
  );
}

export default Text;

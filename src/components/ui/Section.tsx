import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { Text } from "./Text";

export interface SectionProps extends ViewProps {
  children: ReactNode;
  /** Optional section heading rendered above the content. */
  title?: string;
  className?: string;
}

/**
 * Vertical grouping block with consistent spacing between sections and an
 * optional heading, so screens don't hand-roll spacing between blocks.
 */
export function Section({ children, title, className = "", ...props }: SectionProps) {
  return (
    <View {...props} className={`gap-3 ${className}`}>
      {title ? (
        <Text variant="heading" accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

export default Section;

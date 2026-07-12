import { View } from "react-native";

import { spacing } from "@/design-system";

export interface SpacerProps {
  /** Spacing scale key (4pt grid, design-system.md). @default 4 */
  size?: keyof typeof spacing;
  /** Direction to apply the space along. @default "vertical" */
  axis?: "vertical" | "horizontal";
}

/** Fixed-size gap using the app spacing scale — avoids ad-hoc margins. */
export function Spacer({ size = 4, axis = "vertical" }: SpacerProps) {
  const value = spacing[size];
  return (
    <View
      style={axis === "vertical" ? { height: value } : { width: value }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

export default Spacer;

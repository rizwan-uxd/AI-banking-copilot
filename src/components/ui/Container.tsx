import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

export interface ContainerProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

/**
 * Horizontal content gutter (4pt grid) + a web max-width so wide screens
 * don't stretch content edge-to-edge. Wrap screen content, not every view.
 */
export function Container({ children, className = "", ...props }: ContainerProps) {
  return (
    <View {...props} className={`w-full max-w-2xl self-center px-4 ${className}`}>
      {children}
    </View>
  );
}

export default Container;

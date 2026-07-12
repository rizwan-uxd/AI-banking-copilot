import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

export interface ScreenProps extends ViewProps {
  children: ReactNode;
  /** Safe-area edges to respect. @default ["top", "bottom"] */
  edges?: Edge[];
  className?: string;
}

/**
 * App-layer Screen primitive — every route's outermost container. Atlas does
 * not ship a Screen component (ADR-011); this binds the app background token
 * + safe-area handling in one place so route files stay thin.
 */
export function Screen({ children, edges = ["top", "bottom"], className = "", style, ...props }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} className={`flex-1 bg-background ${className}`} style={style}>
      <View {...props} className="flex-1">
        {children}
      </View>
    </SafeAreaView>
  );
}

export default Screen;

import { View, type ViewProps } from "react-native";

export interface DividerProps extends ViewProps {
  /** @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/** Hairline separator using the app border token. */
export function Divider({ orientation = "horizontal", className = "", ...props }: DividerProps) {
  const orientationClass = orientation === "horizontal" ? "h-px w-full" : "w-px h-full";
  return (
    <View
      {...props}
      accessibilityRole="none"
      className={`bg-border ${orientationClass} ${className}`}
    />
  );
}

export default Divider;

import type { ReactNode } from "react";
import { View } from "react-native";

import { Card } from "@atlas/ui-native";

import { PressableScale, Text } from "@/components/ui";

export interface QuickActionChipProps {
  /** Rendered icon node (16px). Filled Figma icons or a navy lucide glyph. */
  icon: ReactNode;
  label: string;
  onPress?: () => void;
}

/**
 * Home screen quick-action chip (Figma node 340:1812 "Quick actions
 * animation", e.g. "Explain transactions"). Wraps Atlas `Card` (variant
 * "filled") rather than a new primitive — reuse-first per CLAUDE.md. The
 * hairline border in Figma (`rgba(255,255,255,0.15)`) is passed via Card's
 * `style` prop since `filled` carries no border by default.
 *
 * Per Figma the icon sits directly on the light chip (no navy badge) with a
 * uniform 12px inset (`p-[12px]`). The caller supplies the rendered 16px
 * glyph — filled two-tone icons (`QuickActionIcons`) or a navy lucide `Icon`.
 * Wrapped in `PressableScale` for the on-tap feedback; Atlas `Card` stays a
 * presentational surface (no `onPress`) so the scale/dim is owned in one place.
 */
export function QuickActionChip({ icon, label, onPress }: QuickActionChipProps) {
  return (
    <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={label.replace("\n", " ")}>
      <Card
        variant="filled"
        padding="none"
        style={{ width: 96, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}
      >
        <View style={{ gap: 8, padding: 12 }}>
          {icon}
          <Text variant="caption" color="accent" className="font-sans-medium" numberOfLines={2}>
            {label}
          </Text>
        </View>
      </Card>
    </PressableScale>
  );
}

export default QuickActionChip;

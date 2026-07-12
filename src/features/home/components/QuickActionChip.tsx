import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { Card } from "@atlas/ui-native";

import { Icon, Text } from "@/components/ui";

export interface QuickActionChipProps {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
}

/**
 * Home screen quick-action chip (Figma node 340:1812 "Quick actions
 * animation", e.g. "Explain transactions"). Wraps Atlas `Card` (variant
 * "filled") rather than a new primitive — reuse-first per CLAUDE.md. The
 * hairline border in Figma (`rgba(255,255,255,0.15)`) is passed via Card's
 * `style` prop since `filled` carries no border by default.
 */
export function QuickActionChip({ icon, label, onPress }: QuickActionChipProps) {
  return (
    <Card
      variant="filled"
      padding="none"
      onPress={onPress}
      accessibilityLabel={label}
      style={{ width: 96, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}
    >
      <View style={{ gap: 8, paddingHorizontal: 8, paddingVertical: 10 }}>
        <View className="size-6 items-center justify-center bg-navy" style={{ borderRadius: 6 }}>
          <Icon icon={icon} size={15} color="onAccent" strokeWidth={2.5} />
        </View>
        <Text variant="caption" color="accent" className="font-sans-medium" numberOfLines={2}>
          {label}
        </Text>
      </View>
    </Card>
  );
}

export default QuickActionChip;

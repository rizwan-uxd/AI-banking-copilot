import { Check } from "lucide-react-native";
import { View } from "react-native";

import { Icon, PressableScale, Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";

export interface OptionPillProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

/**
 * Rounded selection pill (Figma "Chip", node 279:1264 — copilot "2.3_select time" time-range
 * picker). Selected = accent-filled with a leading check; unselected = white/flat. Distinct from
 * `QuickActionChip` (card-style tiles with icon + 2-line label) — this is a compact single-line
 * pill, so it's a new small primitive rather than a QuickActionChip variant.
 */
export function OptionPill({ label, selected = false, onPress }: OptionPillProps) {
  const { colors } = useAppTheme();

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <View
        className="flex-row items-center gap-1 rounded-full px-2 py-1"
        style={{ minHeight: 32, backgroundColor: selected ? colors.accent : colors.surface }}
      >
        {selected ? <Icon icon={Check} size={16} color="onAccent" /> : null}
        <Text
          variant="caption"
          className="font-sans-medium"
          style={{ color: selected ? colors.onAccent : colors.navy }}
        >
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

export default OptionPill;

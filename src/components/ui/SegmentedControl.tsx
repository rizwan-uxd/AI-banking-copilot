import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { PressableScale } from "@/components/ui/PressableScale";
import { Text } from "@/components/ui/Text";
import { useAppTheme } from "@/design-system";

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * Two-or-more-way pill toggle (Figma "Explain a transaction" sheet, "Accounts" / "Credit cards").
 * App-unique primitive — Atlas ships `Tabs` for content tabs but nothing for this compact
 * segmented-button pattern, so this composes `PressableScale` + design tokens directly.
 */
export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row rounded-full bg-surface-muted p-1" style={{ gap: 4 }}>
      {options.map((option) => {
        const selected = option.value === value;
        const OptionIcon = option.icon;
        return (
          <PressableScale
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              height: 44,
              borderRadius: 9999,
              backgroundColor: selected ? colors.navy : "transparent",
            }}
          >
            {OptionIcon ? <OptionIcon size={16} color={selected ? colors.onAccent : colors.textPrimary} /> : null}
            <Text
              variant="body"
              className="font-sans-semibold"
              style={{ color: selected ? colors.onAccent : colors.textPrimary }}
            >
              {option.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

export default SegmentedControl;

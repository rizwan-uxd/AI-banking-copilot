import { View } from "react-native";

import { Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";

export interface DetailRowProps {
  label: string;
  value: string;
  avatarLabel?: string;
  showDivider: boolean;
  /** Value text color. @default "primary" */
  valueColor?: "primary" | "positive";
}

/**
 * Single label/value row inside a "Figma-style key/value card" — extracted for reuse across every
 * card that needs one (`TransactionDetailCard`, `DisputeSummaryCard`, product stat cards). Promoted
 * from copilot-only to shared `components/banking/` once the product-recommendations flow needed
 * the same row shape outside the chat screens.
 */
export function DetailRow({ label, value, avatarLabel, showDivider, valueColor = "primary" }: DetailRowProps) {
  const { colors } = useAppTheme();
  return (
    <View className={showDivider ? "border-b border-border pb-2 mb-2" : undefined}>
      <View className="flex-row items-center justify-between">
        <Text variant="body" color="secondary">
          {label}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text variant="body" className="font-sans-semibold" color={valueColor}>
            {value}
          </Text>
          {avatarLabel ? (
            <View className="size-7 items-center justify-center rounded-full bg-accent">
              <Text variant="caption" className="font-sans-semibold" style={{ color: colors.onAccent }}>
                {avatarLabel}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default DetailRow;

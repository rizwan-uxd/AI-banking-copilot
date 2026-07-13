import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { Icon, PressableScale, Text } from "@/components/ui";

export interface ListRowProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  date: string;
  onPress?: () => void;
}

/**
 * Shared row for "Proactive insights" and "Recent conversations" (Figma
 * reuses the identical "Row N" layout for both sections — nodes 224:1513 and
 * 256:1009). Always a `PressableScale` so the row gives on-tap feedback; it's
 * only announced as a button (with `onPress`) when a destination is wired —
 * Figma shows none yet, so the effect ships ahead of the routing.
 */
export function ListRow({ icon, title, subtitle, date, onPress }: ListRowProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? `${title}, ${subtitle}, ${date}` : undefined}
      style={{ height: 56, width: "100%", flexDirection: "row", alignItems: "center", gap: 16 }}
    >
      <View
        className="size-8 items-center justify-center rounded-full bg-surface-elevated"
        accessible={false}
      >
        <Icon icon={icon} size={16} color="navy" strokeWidth={2} />
      </View>
      <View className="flex-1 flex-row items-start gap-2">
        <View className="flex-1 justify-center gap-1">
          <Text variant="body" color="primary" numberOfLines={1}>
            {title}
          </Text>
          <Text variant="caption" color="muted" className="opacity-80" numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <Text variant="caption" color="muted" className="opacity-80">
          {date}
        </Text>
      </View>
    </PressableScale>
  );
}

export default ListRow;

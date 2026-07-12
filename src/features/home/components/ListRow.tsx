import type { LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Icon, Text } from "@/components/ui";

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
 * 256:1009). Renders as a plain `View` unless `onPress` is supplied — Figma
 * shows no prototype destination for these rows, so none is wired up yet.
 */
export function ListRow({ icon, title, subtitle, date, onPress }: ListRowProps) {
  const content = (
    <>
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
    </>
  );

  if (!onPress) {
    return <View className="h-14 w-full flex-row items-center gap-4">{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}, ${date}`}
      className="h-14 w-full flex-row items-center gap-4"
    >
      {content}
    </Pressable>
  );
}

export default ListRow;

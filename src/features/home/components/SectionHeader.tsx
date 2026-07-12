import { Pressable, View } from "react-native";

import { Text } from "@/components/ui";

export interface SectionHeaderProps {
  title: string;
  actionLabel: string;
  onPressAction?: () => void;
}

/**
 * Reused for both "Proactive insights" and "Recent conversations" headers
 * (Figma nodes 224:1509, 256:1005). The action label renders as static text
 * unless `onPressAction` is supplied — Figma shows no prototype destination
 * for it, so none is wired up yet.
 */
export function SectionHeader({ title, actionLabel, onPressAction }: SectionHeaderProps) {
  const action = (
    <Text variant="body" className="text-[14px] font-sans-medium" color="accent">
      {actionLabel}
    </Text>
  );

  return (
    <View className="h-10 w-full flex-row items-center justify-between">
      <Text variant="body" className="font-sans-semibold" color="primary">
        {title}
      </Text>
      {onPressAction ? (
        <Pressable onPress={onPressAction} accessibilityRole="button" accessibilityLabel={actionLabel} hitSlop={8}>
          {action}
        </Pressable>
      ) : (
        action
      )}
    </View>
  );
}

export default SectionHeader;

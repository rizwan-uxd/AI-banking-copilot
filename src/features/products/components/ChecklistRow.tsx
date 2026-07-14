import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { Divider, Icon } from "@/components/ui";
import { useAppTheme } from "@/design-system";
import { HighlightedText } from "@/features/products/components/HighlightedText";

export interface ChecklistRowProps {
  icon: LucideIcon;
  text: string;
  showDivider?: boolean;
}

/**
 * Icon-badge + text row (Figma "Benefit Row", node 333:2154 — offering-detail "Here's why it fits
 * you" list). Plain, non-pressable — this is a read-only checklist, not a picker. Per the user, the
 * icon is contextual per reason (flight/lounge/wallet), not a uniform checkmark — passed in by the
 * caller rather than hardcoded here.
 */
export function ChecklistRow({ icon, text, showDivider = false }: ChecklistRowProps) {
  const { colors } = useAppTheme();
  return (
    <View>
      <View className="flex-row items-center gap-2.5 py-2">
        <View
          className="items-center justify-center rounded-full"
          style={{ width: 28, height: 28, backgroundColor: colors.accentMuted }}
        >
          <Icon icon={icon} size={15} color="accent" />
        </View>
        <HighlightedText
          text={text}
          variant="body"
          className="flex-1 text-[14px] leading-[20px]"
          color="primary"
        />
      </View>
      {showDivider ? <Divider className="opacity-40" /> : null}
    </View>
  );
}

export default ChecklistRow;

import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { Card } from "@atlas/ui-native";

import { Icon, PressableScale, Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";

export interface RecommendationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  onPress?: () => void;
}

/**
 * AI recommendation card (Figma "2.5_recommendations", node 285:1605 — Flow 2 final screen). Icon
 * sits in a circular accent-tinted badge; the CTA renders as link-style text, matching Figma (no
 * button chrome). Figma shows no destination for any CTA yet, so `onPress` is optional and unwired
 * by default, same convention as `ListRow`.
 */
export function RecommendationCard({ icon, title, description, ctaLabel, onPress }: RecommendationCardProps) {
  const { colors } = useAppTheme();

  return (
    <Card variant="elevated" padding="md">
      <View className="flex-row items-start gap-3">
        <View
          className="items-center justify-center rounded-full p-2"
          style={{ backgroundColor: colors.accentMuted }}
        >
          <Icon icon={icon} size={16} color="accent" />
        </View>
        <View className="flex-1 gap-1">
          <Text variant="body" className="font-sans-semibold">
            {title}
          </Text>
          <Text variant="caption" color="primary">
            {description}
          </Text>
          <PressableScale
            accessibilityRole={onPress ? "button" : undefined}
            accessibilityLabel={ctaLabel}
            onPress={onPress}
            style={{ alignSelf: "flex-start" }}
          >
            <Text variant="caption" className="font-sans-semibold" color="accent">
              {ctaLabel}
            </Text>
          </PressableScale>
        </View>
      </View>
    </Card>
  );
}

export default RecommendationCard;

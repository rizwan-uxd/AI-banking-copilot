import {
  BellCheck,
  ChevronLeft,
  Download,
  Eye,
  GitCompareArrows,
  Share2,
  TicketCheck,
  Utensils,
} from "lucide-react-native";
import { ScrollView, View } from "react-native";

import { QuickActionChip } from "@/components/banking/QuickActionChip";
import { Icon, PressableScale, Screen, Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";
import { CopilotHeader } from "@/features/copilot/components/CopilotHeader";
import { RecommendationCard } from "@/features/copilot/components/RecommendationCard";

export interface SpendingRecommendationsScreenProps {
  onBack?: () => void;
  onBackToHome?: () => void;
}

/**
 * Copilot "AI recommendations" results screen (Figma node 285:1413 "2.5_recommendations" — Flow 2's
 * final screen: Spending analysis & insights). Static, scripted content (recommendation copy, quick
 * actions) — Figma shows no per-user variation and none of the CTAs have a built destination yet,
 * so they're presentational only, same convention as `ListRow`/`RecommendationCard`'s unwired
 * `onPress`. "Back to home" is the one real action: it dismisses the whole pushed flow (search
 * result, analyze spending, insights, this screen) back to the tab root in one step.
 */
export function SpendingRecommendationsScreen({ onBack, onBackToHome }: SpendingRecommendationsScreenProps) {
  const { colors } = useAppTheme();

  return (
    <Screen edges={["bottom"]}>
      <CopilotHeader
        title="Analyze spending"
        leftAction={
          <PressableScale onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon icon={ChevronLeft} color="onAccent" />
          </PressableScale>
        }
      />
      <ScrollView className="flex-1 bg-surface-muted" contentContainerClassName="gap-4 px-5 py-4">
        <Text variant="body" className="font-sans-bold">
          AI recommendations for you
        </Text>

        <View className="gap-3">
          <RecommendationCard
            icon={Utensils}
            title="Set a dining budget"
            description="You're spending 35% more on dining. Set a monthly budget to stay on track."
            ctaLabel="Set budget"
          />
          <RecommendationCard
            icon={TicketCheck}
            title="Try dining offers"
            description="You have 12 dining offers that can save you up to AED 320."
            ctaLabel="View offers"
          />
          <RecommendationCard
            icon={BellCheck}
            title="Track spending in real-time"
            description="Get alerts when you exceed your budget in any category."
            ctaLabel="Enable alerts"
          />
        </View>

        <View className="gap-2">
          <Text variant="body" className="font-sans-medium px-1">
            Quick actions
          </Text>
          <View className="gap-2">
            <View className="flex-row gap-[17px]">
              <QuickActionChip
                layout="inline"
                icon={<Icon icon={Eye} size={16} color="navy" />}
                label={"View all\ncategories"}
              />
              <QuickActionChip
                layout="inline"
                icon={<Icon icon={Download} size={16} color="navy" />}
                label="Download report"
              />
            </View>
            <View className="flex-row gap-[17px]">
              <QuickActionChip
                layout="inline"
                icon={<Icon icon={GitCompareArrows} size={16} color="navy" />}
                label="Compare months"
              />
              <QuickActionChip
                layout="inline"
                icon={<Icon icon={Share2} size={16} color="navy" />}
                label="Share insights"
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="border-t border-border bg-surface px-5 pb-2 pt-4">
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          onPress={onBackToHome}
          style={{ height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy }}
        >
          <Text variant="body" className="font-sans-medium" style={{ color: colors.onAccent }}>
            Back to home
          </Text>
        </PressableScale>
      </View>
    </Screen>
  );
}

export default SpendingRecommendationsScreen;

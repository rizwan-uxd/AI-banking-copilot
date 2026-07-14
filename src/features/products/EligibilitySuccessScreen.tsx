import { Check, ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";

import { AppHeader, Icon, PressableScale, ProgressBar, Screen, Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";
import { getFeaturedProduct } from "@/data/products";

export interface EligibilitySuccessScreenProps {
  onBack?: () => void;
  /** Fires when "Continue application" is tapped. No further screen is designed in Figma for this flow, so the caller decides what happens (e.g. back to Home). */
  onContinueApplication?: () => void;
}

/**
 * Copilot pre-qualification success screen (Figma node 303:1838 "3.5_success" — Flow 3's final
 * screen). Reuses the same `approvalProbabilityPercent` and `benefits` fields already on
 * `ProductRecommendation` (seeded once, read here and on the eligibility-check screen).
 */
export function EligibilitySuccessScreen({ onBack, onContinueApplication }: EligibilitySuccessScreenProps) {
  const { colors } = useAppTheme();
  const product = getFeaturedProduct();

  return (
    <Screen edges={["bottom"]}>
      <AppHeader
        title="Product recommendations"
        leftAction={
          <PressableScale onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon icon={ChevronLeft} color="onAccent" />
          </PressableScale>
        }
      />
      <View className="flex-1 bg-surface-muted px-5 py-4" style={{ gap: 16 }}>
        <Animated.View entering={ZoomIn.duration(450)} style={{ alignItems: "center", gap: 12 }}>
          <View
            className="items-center justify-center rounded-full"
            style={{ width: 60, height: 60, backgroundColor: colors.accentMuted }}
          >
            <View
              className="items-center justify-center rounded-full"
              style={{ width: 44, height: 44, backgroundColor: `${colors.positive}22` }}
            >
              <Icon icon={Check} size={26} color="positive" strokeWidth={2.5} />
            </View>
          </View>
          <Text variant="body" className="font-sans-semibold text-center" style={{ lineHeight: 22 }}>
            Great news, Ali!{"\n"}You&apos;re pre-qualified for{"\n"}
            {product.name}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(250).duration(400)}
          style={{ borderRadius: 8, backgroundColor: colors.surface, padding: 16, gap: 8 }}
        >
          <Text variant="body" className="font-sans-semibold">
            Approval probability
          </Text>
          <Text className="font-sans-bold text-[32px] leading-9">{product.approvalProbabilityPercent}%</Text>
          <ProgressBar percent={product.approvalProbabilityPercent} duration={700} />
          <Text variant="caption" color="primary">
            This usually takes less than 30 seconds.
          </Text>
        </Animated.View>

        <View style={{ gap: 4 }}>
          {product.benefits.map((benefit, index) => (
            <Animated.View
              key={benefit}
              entering={FadeInDown.delay(450 + index * 100).duration(350)}
              style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 }}
            >
              <View
                className="items-center justify-center rounded-full bg-surface"
                style={{ width: 24, height: 24 }}
              >
                <Icon icon={Check} size={13} color="accent" />
              </View>
              <Text variant="body" className="flex-1" color="primary">
                {benefit}
              </Text>
            </Animated.View>
          ))}
        </View>
      </View>

      <Animated.View
        entering={FadeInUp.delay(850).duration(350)}
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
          paddingHorizontal: 20,
          paddingBottom: 8,
          paddingTop: 16,
        }}
      >
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Continue application"
          onPress={onContinueApplication}
          style={{ height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy }}
        >
          <Text variant="body" className="font-sans-medium" style={{ color: colors.onAccent }}>
            Continue application
          </Text>
        </PressableScale>
      </Animated.View>
    </Screen>
  );
}

export default EligibilitySuccessScreen;

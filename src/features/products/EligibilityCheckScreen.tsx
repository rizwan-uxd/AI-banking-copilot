import { Check, ChevronLeft, Info, Loader2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

import { AppHeader, Icon, PressableScale, ProgressBar, Screen, Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";
import { getFeaturedProduct } from "@/data/products";
import { AnimatedCounter } from "@/features/products/components/AnimatedCounter";

export interface EligibilityCheckScreenProps {
  onBack?: () => void;
  /** Fires once the simulated check finishes. Screen doesn't navigate itself — the caller owns it. */
  onComplete?: () => void;
}

/** How long the "Almost done" progress bar takes to fill (drives everything else on this screen). */
const ANALYSIS_DURATION_MS = 2200;
/** Pause after the bar hits 100% before the last step flips to checked and `onComplete` fires. */
const COMPLETE_PAUSE_MS = 400;
/** Stagger between each step row's entrance. */
const STEP_STAGGER_MS = 180;
/** Base delay before the first step appears, after the title. */
const STEP_BASE_DELAY_MS = 250;

/**
 * Copilot eligibility-check screen (Figma node 300:1558 "3.4_analyze spending" — Flow 3, named for
 * Flow 2's frames by copy-paste like "3.2"; actual content is a simulated eligibility check, not
 * spending analysis). A deterministic, scripted "processing" moment (CLAUDE.md's mock AI engine —
 * no real check happens): steps reveal in a staggered sequence, the last ("Spending pattern")
 * crossfades from a spinning `Loader2` to a checkmark once the "Almost done" bar reaches 100%
 * (loading progress — a distinct concept from the product's approval-probability percent, which is
 * only revealed on "3.5_success"), then `onComplete` fires shortly after.
 *
 * Completion is driven by `ProgressBar`'s `onAnimationComplete` callback rather than a same-duration
 * `setTimeout` on this screen — an earlier version used an independent JS-thread timer that was
 * observed getting stuck mid-navigation (reproducible via chained deep-link navigation; the bar's
 * own UI-thread animation still completed while the parallel `setTimeout` never fired). Tying the
 * state flip to the animation's actual completion removes that race entirely.
 */
export function EligibilityCheckScreen({ onBack, onComplete }: EligibilityCheckScreenProps) {
  const { colors } = useAppTheme();
  const product = getFeaturedProduct();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const spinnerRotation = useSharedValue(0);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    spinnerRotation.value = withRepeat(withTiming(360, { duration: 900, easing: Easing.linear }), -1);
  }, [spinnerRotation]);

  function handleProgressComplete() {
    // Reanimated's completion callback can fire more than once across re-renders; guard so the
    // pause + onComplete sequence only ever runs a single time.
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setTimeout(() => {
      setIsAnalyzing(false);
      setTimeout(() => onComplete?.(), COMPLETE_PAUSE_MS);
    }, 0);
  }

  const spinnerStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spinnerRotation.value}deg` }] }));
  const stepsEndDelay = STEP_BASE_DELAY_MS + product.eligibilitySteps.length * STEP_STAGGER_MS;

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
      <View className="flex-1 bg-surface-muted px-5 py-4" style={{ gap: 20 }}>
        <Animated.View entering={FadeIn.duration(350)} style={{ gap: 6 }}>
          <Text variant="heading" className="font-sans-bold">
            Let&apos;s quickly check your eligibility
          </Text>
          <Text variant="caption" color="secondary">
            This will not impact your credit score.
          </Text>
        </Animated.View>

        <View>
          {product.eligibilitySteps.map((step, index) => {
            const isLast = index === product.eligibilitySteps.length - 1;
            const isPendingStep = isLast && isAnalyzing;
            return (
              <Animated.View
                key={step}
                entering={FadeInDown.delay(STEP_BASE_DELAY_MS + index * STEP_STAGGER_MS).duration(400)}
              >
                <View className="flex-row items-center gap-2.5">
                  <View
                    className="items-center justify-center rounded-full"
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor: isPendingStep ? `${colors.positive}22` : colors.positive,
                    }}
                  >
                    {isPendingStep ? (
                      // Manual continuous-rotation transform only — no entering/exiting on this
                      // same view, since combining the two makes Reanimated warn that the layout
                      // animation may overwrite the manual transform (and was implicated in the
                      // stuck-navigation bug above).
                      <Animated.View style={spinnerStyle}>
                        <Icon icon={Loader2} size={14} color="positive" />
                      </Animated.View>
                    ) : (
                      <Animated.View key="check" entering={ZoomIn.duration(300)}>
                        <Icon icon={Check} size={14} color="onAccent" />
                      </Animated.View>
                    )}
                  </View>
                  <Text variant="body" className="flex-1" color="primary">
                    {step}
                  </Text>
                  {isPendingStep ? (
                    <Text variant="body" color="secondary">
                      Analyzing…
                    </Text>
                  ) : null}
                </View>
                {!isLast ? <View style={{ width: 1, height: 24, marginLeft: 11.5, backgroundColor: colors.positive }} /> : null}
              </Animated.View>
            );
          })}
        </View>

        <Animated.View
          entering={FadeInDown.delay(stepsEndDelay).duration(400)}
          style={{ borderRadius: 8, backgroundColor: colors.surface, padding: 16, gap: 8 }}
        >
          <Text variant="body" className="font-sans-semibold">
            Almost done
          </Text>
          <Text variant="caption" color="primary">
            This usually takes less than 30 seconds.
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <ProgressBar percent={100} duration={ANALYSIS_DURATION_MS} onAnimationComplete={handleProgressComplete} />
            </View>
            <AnimatedCounter
              value={100}
              suffix="%"
              duration={ANALYSIS_DURATION_MS}
              variant="caption"
              className="font-sans-semibold"
              color="primary"
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(stepsEndDelay + 150).duration(400)}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 12,
            borderRadius: 12,
            padding: 16,
            backgroundColor: colors.accentMuted,
            borderWidth: 1,
            borderColor: `${colors.accent}55`,
          }}
        >
          <Icon icon={Info} size={20} color="accent" />
          <Text variant="body" className="flex-1" color="primary">
            Your data is secure and never shared with third parties.
          </Text>
        </Animated.View>
      </View>
    </Screen>
  );
}

export default EligibilityCheckScreen;

import { useEffect } from "react";
import { View } from "react-native";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useAppTheme } from "@/design-system";

export interface ProgressBarProps {
  /** 0-100. */
  percent: number;
  /** Fill color. @default colors.positive */
  color?: string;
  height?: number;
  /** Animate the fill from 0 to `percent` on mount, rather than rendering it already full. @default true */
  animateOnMount?: boolean;
  /** Fill animation duration in ms. @default 900 */
  duration?: number;
  /**
   * Fires once the fill animation finishes (via `runOnJS`, from the UI thread). Prefer this over a
   * same-duration `setTimeout` on the caller's side — a screen was observed getting stuck because
   * its own independent JS-thread timer never fired after a navigation transition, while this
   * animation's UI-thread completion still landed reliably.
   */
  onAnimationComplete?: () => void;
}

/**
 * Rounded progress/percent-confidence bar (Figma "Progress Indicatior" — offering-detail AI
 * confidence, eligibility-check completion). Animates its fill in from 0 on mount via Reanimated
 * (already an app dependency) so a screen that opens straight to e.g. "91%" reads as the app having
 * just computed that number, not a static bar that was always there.
 */
export function ProgressBar({
  percent,
  color,
  height = 8,
  animateOnMount = true,
  duration = 900,
  onAnimationComplete,
}: ProgressBarProps) {
  const { colors } = useAppTheme();
  const clamped = Math.max(0, Math.min(100, percent));
  const width = useSharedValue(animateOnMount ? 0 : clamped);

  useEffect(() => {
    width.value = withTiming(clamped, { duration, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished && onAnimationComplete) {
        runOnJS(onAnimationComplete)();
      }
    });
    // onAnimationComplete intentionally excluded — callers pass inline functions; re-running the
    // animation whenever that identity changes would restart the fill on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clamped, width, duration]);

  const animatedStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View
      className="w-full overflow-hidden rounded-full bg-surface-muted"
      style={{ height }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <Animated.View
        style={[{ height: "100%", backgroundColor: color ?? colors.positive, borderRadius: 999 }, animatedStyle]}
      />
    </View>
  );
}

export default ProgressBar;

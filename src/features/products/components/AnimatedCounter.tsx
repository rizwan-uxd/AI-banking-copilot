import { useEffect, useState } from "react";
import { Easing } from "react-native-reanimated";

import { Text, type TextProps } from "@/components/ui";

export interface AnimatedCounterProps extends Omit<TextProps, "children"> {
  /** Target integer value to count up to on mount. */
  value: number;
  duration?: number;
  /** Text appended after the number, e.g. "%". */
  suffix?: string;
}

const easeOutCubic = Easing.out(Easing.cubic);

/**
 * Counts up from 0 to `value` on mount (offering-detail "AI confidence", per the user: "the number
 * will animate like counter on pageload to reach 91%"). Plain `useState` + `requestAnimationFrame`
 * rather than Reanimated shared values — this drives a *text* value every frame, which needs a JS
 * re-render regardless, so there's no UI-thread benefit to Reanimated here (unlike `ProgressBar`'s
 * width/opacity animations). Reuses Reanimated's `Easing` helpers purely for the same easing curve.
 */
export function AnimatedCounter({ value, duration = 900, suffix = "", ...textProps }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = Date.now();

    function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(1, elapsed / duration);
      setDisplay(Math.round(easeOutCubic(progress) * value));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <Text {...textProps}>
      {display}
      {suffix}
    </Text>
  );
}

export default AnimatedCounter;

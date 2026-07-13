import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useAppTheme } from "@/design-system";

/**
 * Animated voice-input equalizer for the search bar (Figma node 224:1505,
 * "Search bar" → the waveform vectors). Figma animates the bars on a ~2s
 * looping voice-pulse (see `get_motion_context`); this reproduces that with a
 * staggered `scaleY` oscillation per bar. Under the OS "Reduce Motion" setting
 * the bars hold their base scale (`ReduceMotion.System` on `withRepeat`).
 * Bars use the accent color (`#2350be`), matching the Figma vector stroke.
 */
interface BarSpec {
  /** Base bar height in px. */
  height: number;
  /** Start offset in ms, to stagger the pulse across bars. */
  delay: number;
}

const BARS: BarSpec[] = [
  { height: 6, delay: 0 },
  { height: 12, delay: 240 },
  { height: 18, delay: 120 },
  { height: 10, delay: 360 },
  { height: 6, delay: 480 },
];

const TROUGH = 0.7;
const PEAK = 1.35;
const HALF_CYCLE_MS = 760;

function WaveBar({ height, delay, color }: BarSpec & { color: string }) {
  const scale = useSharedValue(TROUGH);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(PEAK, { duration: HALF_CYCLE_MS, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
        undefined,
        ReduceMotion.System,
      ),
    );
  }, [scale, delay]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: scale.value }] }));

  return (
    <Animated.View
      style={[{ width: 2.5, height, borderRadius: 999, backgroundColor: color }, animatedStyle]}
    />
  );
}

export function VoiceWaveform() {
  const { colors } = useAppTheme();

  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", gap: 2.5, height: 24 }}
      accessible={false}
      pointerEvents="none"
    >
      {BARS.map((bar, index) => (
        <WaveBar key={index} height={bar.height} delay={bar.delay} color={colors.accent} />
      ))}
    </View>
  );
}

export default VoiceWaveform;

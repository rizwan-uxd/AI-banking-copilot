import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, "style"> {
  /** Scale at full press. @default 0.97 */
  scaleTo?: number;
  /** Opacity at full press. @default 0.92 */
  dimTo?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Shared press-feedback wrapper: a spring-free scale + dim on touch, driven by
 * Reanimated so the effect is intrinsic to the touch (fires on `onPressIn`
 * regardless of whether an `onPress` action is wired — Figma shows no
 * navigation destinations yet, so the effect is the deliverable, not routing).
 * Motion is disabled under the OS "Reduce Motion" setting (`ReduceMotion.System`),
 * where the state still snaps for instant feedback. Set `accessibilityRole`
 * / `accessibilityLabel` via props on interactive instances.
 */
export function PressableScale({
  scaleTo = 0.97,
  dimTo = 0.92,
  style,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressableScaleProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - (1 - scaleTo) * pressed.value }],
    opacity: 1 - (1 - dimTo) * pressed.value,
  }));

  return (
    <AnimatedPressable
      {...rest}
      style={[animatedStyle, style]}
      onPressIn={(e) => {
        pressed.value = withTiming(1, { duration: 90, reduceMotion: ReduceMotion.System });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.value = withTiming(0, { duration: 160, reduceMotion: ReduceMotion.System });
        onPressOut?.(e);
      }}
    >
      {children}
    </AnimatedPressable>
  );
}

export default PressableScale;

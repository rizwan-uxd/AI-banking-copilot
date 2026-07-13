import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

/**
 * Beam gradient colors — white, matching the border glow of Figma node
 * 164:639 "Search bar 2". Transparent ends come from the gradient stop
 * opacity, so both stops are white. Decorative, not semantic tokens.
 */
const EDGE = "#FFFFFF";
const CORE = "#FFFFFF";

const STROKE = 2.5;
/** Beam length as a fraction of the pill perimeter. */
const BEAM_FRACTION = 0.2;
/** SVG bar height (thin core + soft glow margin). */
const BEAM_H = 12;
const DURATION_MS = 5000;

/**
 * "Border Beam" for the search pill (per beam.jakubantalik.com / Magic UI, and
 * matching the white glow of Figma node 164:639 "Search bar 2"): a single soft
 * white streak with transparent ends that glides continuously around the border.
 *
 * The streak is a static SVG gradient bar; it's *moved* along the pill's
 * stadium perimeter by a Reanimated transform (translate + rotate) computed on
 * the UI thread — the RN analog of CSS `offset-path`, and smoother than
 * per-frame SVG prop updates. The pill keeps its own faint base outline
 * underneath. Holds still at the start position under OS "Reduce Motion".
 */
export function SearchBarBeam() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const progress = useSharedValue(0);

  // Stadium-path geometry (border centerline), recomputed when the pill resizes.
  const geo = useMemo(() => {
    const { width: W, height: H } = size;
    if (W <= H || H <= 0) return null;
    const r = H / 2;
    const rr = r - STROKE / 2; // arc radius on the border centerline
    const top = STROKE / 2;
    const bottom = H - STROKE / 2;
    const straight = W - 2 * r; // top / bottom straight length
    const arc = Math.PI * rr; // each semicircle length
    const perimeter = 2 * straight + 2 * arc;
    return { W, H, r, rr, top, bottom, straight, arc, perimeter };
  }, [size]);

  const beamLen = geo ? Math.max(70, geo.perimeter * BEAM_FRACTION) : 0;

  useEffect(() => {
    if (!geo) return;
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: DURATION_MS, easing: Easing.linear }),
      -1,
      false,
      undefined,
      ReduceMotion.System,
    );
  }, [progress, geo]);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    if (!geo) return { opacity: 0 };
    const { r, rr, top, bottom, straight, arc, perimeter } = geo;
    const d = progress.value * perimeter;

    let x: number;
    let y: number;
    let angle: number; // tangent, radians
    if (d < straight) {
      // top edge, left → right
      x = r + d;
      y = top;
      angle = 0;
    } else if (d < straight + arc) {
      // right cap, top → bottom
      const a = -Math.PI / 2 + (d - straight) / rr;
      x = geo.W - r + rr * Math.cos(a);
      y = geo.H / 2 + rr * Math.sin(a);
      angle = a + Math.PI / 2;
    } else if (d < 2 * straight + arc) {
      // bottom edge, right → left
      x = geo.W - r - (d - straight - arc);
      y = bottom;
      angle = Math.PI;
    } else {
      // left cap, bottom → top
      const a = Math.PI / 2 + (d - 2 * straight - arc) / rr;
      x = r + rr * Math.cos(a);
      y = geo.H / 2 + rr * Math.sin(a);
      angle = a + Math.PI / 2;
    }

    return {
      opacity: 1,
      transform: [
        { translateX: x - beamLen / 2 },
        { translateY: y - BEAM_H / 2 },
        { rotate: `${angle}rad` },
      ],
    };
  }, [geo, beamLen]);

  const onLayout = (e: LayoutChangeEvent) =>
    setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout} pointerEvents="none">
      {geo ? (
        <Animated.View
          style={[{ position: "absolute", left: 0, top: 0, width: beamLen, height: BEAM_H }, animatedStyle]}
        >
          <Svg width={beamLen} height={BEAM_H}>
            <Defs>
              <LinearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={EDGE} stopOpacity={0} />
                <Stop offset="0.5" stopColor={CORE} stopOpacity={1} />
                <Stop offset="1" stopColor={EDGE} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            {/* soft glow */}
            <Rect x={0} y={BEAM_H / 2 - 3} width={beamLen} height={6} rx={3} fill="url(#beam)" opacity={0.45} />
            {/* crisp core */}
            <Rect x={0} y={BEAM_H / 2 - 1.25} width={beamLen} height={2.5} rx={1.25} fill="url(#beam)" />
          </Svg>
        </Animated.View>
      ) : null}
    </View>
  );
}

export default SearchBarBeam;

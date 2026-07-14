import { StyleSheet } from "react-native";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from "react-native-svg";

/**
 * Soft gradient-blob background for the offering-detail screen (Figma "Background", node
 * 333:2109 — pale-blue radial blobs fading to white). Hand-rolled SVG (ADR-007: no charting/
 * gradient library, `react-native-svg` is already a dependency) rather than a bundled image
 * export — Figma's own background export has its foreground card baked into the same layer group,
 * which ghosted through behind the real card when tried as a flattened PNG.
 */
export function OfferingBackground() {
  const { width, height } = useSafeAreaFrame();

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="base" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#e8f0ff" />
          <Stop offset="1" stopColor="#ffffff" />
        </LinearGradient>
        <RadialGradient id="blobTop" cx="65%" cy="0%" r="55%">
          <Stop offset="0" stopColor="#c7d9ff" stopOpacity={0.55} />
          <Stop offset="1" stopColor="#c7d9ff" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="blobBottom" cx="15%" cy="90%" r="45%">
          <Stop offset="0" stopColor="#d6c7ff" stopOpacity={0.4} />
          <Stop offset="1" stopColor="#d6c7ff" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#base)" />
      <Rect x={0} y={0} width={width} height={height} fill="url(#blobTop)" />
      <Rect x={0} y={0} width={width} height={height} fill="url(#blobBottom)" />
    </Svg>
  );
}

export default OfferingBackground;

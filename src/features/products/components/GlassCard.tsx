import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";

export interface GlassCardProps {
  children: ReactNode;
  /** White overlay opacity layered over the blur, matching Figma's per-card `rgba(255,255,255,N)` fill (0.3-0.7 across the three cards on this screen). */
  tintOpacity?: number;
  borderRadius?: number;
}

/**
 * Frosted-glass card (Figma "Secondary Card" / "Featured Card", offering-detail screen only —
 * every other screen in the app uses flat white `Card variant="elevated"` on a solid background;
 * this screen's gradient-blob background specifically calls for the glass look, per the user).
 * Uses `expo-blur`'s `BlurView` (already an app dependency, no new package). `BlurView` has no
 * blur effect on web (Expo's documented limitation) — it still renders the white tint overlay
 * there, so the card reads as a translucent panel rather than a blurred one on that platform.
 */
export function GlassCard({ children, tintOpacity = 0.5, borderRadius = 24 }: GlassCardProps) {
  return (
    <View
      style={{
        borderRadius,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.5)",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <BlurView intensity={40} tint="light" style={{ padding: 20 }}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(255,255,255,${tintOpacity})` }]} />
        {children}
      </BlurView>
    </View>
  );
}

export default GlassCard;

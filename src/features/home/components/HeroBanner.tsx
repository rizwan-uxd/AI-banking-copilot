import type { ReactNode } from "react";
import { useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";

export interface HeroBannerProps {
  children: ReactNode;
}

const heroBackground = require("@/assets/images/home/hero-background.png");

/**
 * Home screen hero background (Figma `LGV5xzUyUxDEReq6FY4zn7`, node 224:1497
 * "bg") — the actual composited image asset, bundled locally (no network
 * call at runtime). The asset is sized for one full device screen (its
 * black→navy→pale-blue gradient spans an entire viewport, not just the
 * shorter hero-content area), so it's rendered at `useWindowDimensions()`
 * height and allowed to overflow past this wrapper's own (shorter,
 * content-hugging) box. The white content card that follows in scroll order
 * paints over the rest, so its rounded-corner cutout reveals the image's own
 * pale-blue lower portion instead of a flat fallback color.
 */
export function HeroBanner({ children }: HeroBannerProps) {
  const { width, height } = useWindowDimensions();

  return (
    <View>
      <Image
        source={heroBackground}
        style={{ position: "absolute", top: 0, left: 0, width, height }}
        contentFit="cover"
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

export default HeroBanner;

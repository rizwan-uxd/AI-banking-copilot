import { View } from "react-native";

import { Text } from "@/components/ui";

export interface CardArtProps {
  /** Card network shown bottom-left, e.g. "VISA". */
  network: string;
  size?: "sm" | "lg";
}

const SIZES = {
  sm: { width: 70, height: 46 },
  // +15% over the base 96x60 — offering-detail screen only (per the user).
  lg: { width: 110, height: 69 },
} as const;

/**
 * Minimal card-art placeholder (Figma "Rank 1 Card" node 295:2654 / offering-detail hero) — a flat
 * dark rounded rect with the network wordmark, no artwork/imagery involved since none is seeded.
 * Reused by the recommendations list and the offering-detail screen. `#14171f` is Figma's literal
 * card-face fill, not a semantic token — decorative like `CategoryDonutChart`'s chart palette, not
 * a color the token system is meant to cover.
 */
export function CardArt({ network, size = "sm" }: CardArtProps) {
  const { width, height } = SIZES[size];
  return (
    <View
      className="items-start justify-end rounded-md bg-[#14171f] p-1.5"
      style={{ width, height }}
    >
      <Text variant="caption" className="font-sans-bold text-[8px] leading-none text-white">
        {network}
      </Text>
    </View>
  );
}

export default CardArt;

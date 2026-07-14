import { Plane } from "lucide-react-native";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Text } from "@/components/ui";

export interface PremiumCardStackProps {
  brand: string;
  cardName: string;
  network: string;
  networkTier?: string;
}

const FRONT_WIDTH = 118;
const FRONT_HEIGHT = 168;
const BACK_WIDTH = 88;
const BACK_HEIGHT = 56;
/** Gold accent used only on this card face — decorative, like `CardArt`'s literal card-fill hex. */
const GOLD = "#e0b84a";

const WAVE_PATHS = [
  `M0 ${FRONT_HEIGHT * 0.62} Q ${FRONT_WIDTH * 0.5} ${FRONT_HEIGHT * 0.5} ${FRONT_WIDTH} ${FRONT_HEIGHT * 0.66}`,
  `M0 ${FRONT_HEIGHT * 0.72} Q ${FRONT_WIDTH * 0.5} ${FRONT_HEIGHT * 0.6} ${FRONT_WIDTH} ${FRONT_HEIGHT * 0.76}`,
  `M0 ${FRONT_HEIGHT * 0.82} Q ${FRONT_WIDTH * 0.5} ${FRONT_HEIGHT * 0.7} ${FRONT_WIDTH} ${FRONT_HEIGHT * 0.86}`,
];

/**
 * Two-layer "premium card" illustration (offering-detail rewards card, per the user's reference —
 * a black/gold card over a lighter backing card, not the small flat `CardArt` used on the
 * recommendations list and card-identity section). Built from Views + hand-rolled SVG wave lines
 * (no bundled photo asset). The wing glyph is a generic `Plane` icon, not a reproduction of any
 * real airline's trademarked logo mark — this is a stylized placeholder, not brand artwork.
 */
export function PremiumCardStack({ brand, cardName, network, networkTier }: PremiumCardStackProps) {
  return (
    <View style={{ width: FRONT_WIDTH + 14, height: FRONT_HEIGHT + 18 }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 6,
          width: BACK_WIDTH,
          height: BACK_HEIGHT,
          borderRadius: 14,
          backgroundColor: "#dfe3fb",
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: FRONT_WIDTH,
          height: FRONT_HEIGHT,
          borderRadius: 14,
          backgroundColor: "#111319",
          borderWidth: 1,
          borderColor: GOLD,
          padding: 12,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
        }}
      >
        <Svg width={FRONT_WIDTH} height={FRONT_HEIGHT} style={{ position: "absolute", top: 0, left: 0 }}>
          {WAVE_PATHS.map((d, index) => (
            <Path key={index} d={d} stroke={GOLD} strokeWidth={1} strokeOpacity={0.35} fill="none" />
          ))}
        </Svg>

        <View className="flex-row items-start justify-between gap-1">
          <View style={{ flex: 1, gap: 4 }}>
            <Text className="font-sans-bold text-[12px] leading-[16px]" numberOfLines={1} style={{ color: GOLD }}>
              {brand}
            </Text>
            <Text className="font-sans-medium text-[9px] leading-[16px]" numberOfLines={2} style={{ color: GOLD }}>
              {cardName}
            </Text>
          </View>
          <Plane size={14} color={GOLD} strokeWidth={1.75} style={{ transform: [{ rotate: "45deg" }] }} />
        </View>

        <View style={{ marginTop: 16, width: 22, height: 16, borderRadius: 4, backgroundColor: GOLD }} />

        <View style={{ flex: 1 }} />

        <Text className="font-sans-bold text-[16px] leading-[19px]" style={{ color: GOLD }}>
          {network}
        </Text>
        {networkTier ? (
          <Text className="font-sans-medium text-[9px] leading-[12px]" style={{ color: GOLD }}>
            {networkTier}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export default PremiumCardStack;

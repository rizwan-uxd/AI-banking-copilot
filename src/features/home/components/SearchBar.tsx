import { TextInput } from "react-native";
import { GlassView } from "expo-glass-effect";
import { AudioLines } from "lucide-react-native";

import { Icon } from "@/components/ui";
import { useAppTheme } from "@/design-system";

/**
 * Home screen search field (Figma node 224:1505 "Search bar"). Atlas `Input`
 * has no style-override slot for its container, so it can't produce this
 * pill-shaped frosted-glass shell — built directly on `expo-glass-effect`
 * (real blur on iOS, translucent `View` fallback on Android/Web) + RN
 * `TextInput`. Presentational only: Figma shows no prototype interaction for
 * this field, so no query handling or navigation is wired up.
 */
export function SearchBar() {
  const { colors } = useAppTheme();

  return (
    <GlassView
      glassEffectStyle="regular"
      tintColor="#ffffff"
      style={{
        height: 56,
        borderRadius: 9999,
        backgroundColor: "rgba(255,255,255,0.3)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.4)",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        gap: 8,
      }}
    >
      <TextInput
        placeholder="Ask about your finances..."
        placeholderTextColor={colors.textMuted}
        editable={false}
        pointerEvents="none"
        className="flex-1 text-body font-sans text-text-primary"
      />
      <Icon icon={AudioLines} size={20} color="accent" />
    </GlassView>
  );
}

export default SearchBar;

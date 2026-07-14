import { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";

import { PressableScale } from "@/components/ui";
import { useAppTheme } from "@/design-system";

import { SearchBarBeam } from "./SearchBarBeam";
import { VoiceWaveform } from "./VoiceWaveform";

export interface SearchBarProps {
  onPress?: () => void;
  /** Called with the typed query when the user submits (return/search key). */
  onSubmit?: (query: string) => void;
}

/** Light frosted-glass tint — see-through but with a soft white veil. */
const FROST = "rgba(255,255,255,0.13)";

const pillStyle = {
  height: 56,
  borderRadius: 9999,
  // Faint base outline so the glass reads on a busy gradient; the bright edge
  // is the animated white SearchBarBeam (Figma 164:639).
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.35)",
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  gap: 8,
} as const;

/** iOS 26+ Liquid Glass looks best where available; blur everywhere else. */
const hasLiquidGlass = isLiquidGlassAvailable();

/**
 * Home screen search field (Figma node 164:639 "Search bar 2"). Atlas `Input`
 * has no style-override slot for its container, so it can't produce this
 * pill-shaped glass shell. The background is lightly frosted glass — native
 * Liquid Glass on iOS 26+ (`expo-glass-effect`) and an `expo-blur` `BlurView`
 * everywhere else — with a soft white veil so it reads on the gradient without
 * going milky. The field is a real focusable `TextInput`: tapping the pill (or
 * the field) focuses it, showing the native caret + keyboard. The whole pill
 * is the tap target (`PressableScale`, which also focuses the input), with the
 * animated `VoiceWaveform` on the trailing edge and the white `SearchBarBeam`
 * glow sweeping the border.
 */
export function SearchBar({ onPress, onSubmit }: SearchBarProps) {
  const { colors } = useAppTheme();
  const inputRef = useRef<TextInput>(null);
  const [value, setValue] = useState("");

  const handlePress = () => {
    onPress?.();
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit?.(value.trim());
    setValue("");
  };

  const content = (
    <>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        placeholder="Ask about your finances..."
        placeholderTextColor={colors.textMuted}
        // Native caret + selection in the dark brand color (Figma cursor).
        cursorColor={colors.textPrimary}
        selectionColor={colors.textPrimary}
        returnKeyType="search"
        accessibilityLabel="Ask about your finances"
        className="flex-1 text-body font-sans text-text-primary"
      />
      <VoiceWaveform />
    </>
  );

  return (
    <PressableScale onPress={handlePress}>
      <View style={{ borderRadius: 9999, overflow: "hidden" }}>
        {hasLiquidGlass ? (
          <GlassView glassEffectStyle="regular" tintColor={FROST} style={pillStyle}>
            {content}
          </GlassView>
        ) : (
          <BlurView intensity={40} tint="light" experimentalBlurMethod="dimezisBlurView" style={pillStyle}>
            {/* Soft white veil over the blur for the frosted look. */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: FROST }]} pointerEvents="none" />
            {content}
          </BlurView>
        )}
        <SearchBarBeam />
      </View>
    </PressableScale>
  );
}

export default SearchBar;

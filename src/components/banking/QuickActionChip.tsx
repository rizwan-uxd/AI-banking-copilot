import type { ReactNode } from "react";
import { View, type ViewStyle } from "react-native";

import { Card } from "@atlas/ui-native";

import { PressableScale, Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";

export interface QuickActionChipProps {
  /** Rendered icon node (16px). Filled Figma icons or a navy lucide glyph. */
  icon: ReactNode;
  label: string;
  onPress?: () => void;
  /**
   * "stacked" — icon above a (usually 2-line) label, fixed 96px tile (Home "Quick actions",
   * copilot "Would you like to" row). "inline" — icon left, label filling the middle, optional
   * trailing selected-check on the right (copilot "Issue type" radio cards). @default "stacked"
   */
  layout?: "stacked" | "inline";
  /**
   * Active/chosen state (radio-card usage only) — accent-tinted fill + accent border + a filled
   * check circle in place of the trailing space. No-op for `layout="stacked"`. @default false
   */
  selected?: boolean;
  /** Additional style merged onto the Card root — e.g. `{ flex: 1 }` for an equal-width row. */
  style?: ViewStyle;
}

/**
 * Shared quick-action / choice tile — one visual pattern for every card-style action or option
 * button in the app (Figma "Quick actions animation" on Home node 340:1812, copilot "1.2_search
 * result" node 276:1383, copilot "1.3_search result conversations" issue-type radio cards node
 * 250:1246 — same white/hairline-border/no-shadow card in all three, just two internal layouts and
 * an optional selected state). Reuse this whenever a new "action tile" or "choice tile" shows up
 * instead of hand-rolling another card — see CLAUDE.md reuse-first.
 *
 * Wraps Atlas `Card` (variant "outlined" — resolves to `colors.surface`, i.e. white, matching
 * Figma's near-white `#fafcff` chip fill) rather than a new primitive. `variant="filled"` was tried
 * first but resolves to `colors.backgroundSubtle`, which on the copilot screen is the *same* color
 * as the screen's own background (`bg-surface-muted`) — the tile became invisible there even though
 * it read fine on Home's dark hero gradient. "outlined"'s white fill contrasts on both. The hairline
 * border in Figma (`rgba(255,255,255,0.15)`) is passed via Card's `style` prop, overriding the
 * variant's own `colors.border`; the `selected` state overrides both again with the accent tint.
 *
 * Wrapped in `PressableScale` for the on-tap feedback; Atlas `Card` stays a presentational surface
 * (no `onPress`) so the scale/dim is owned in one place.
 */
export function QuickActionChip({
  icon,
  label,
  onPress,
  layout = "stacked",
  selected = false,
  style,
}: QuickActionChipProps) {
  const { colors } = useAppTheme();

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole={layout === "inline" ? "radio" : "button"}
      accessibilityState={layout === "inline" ? { selected } : undefined}
      accessibilityLabel={label.replace("\n", " ")}
      style={layout === "inline" ? { flex: 1 } : undefined}
    >
      <Card
        variant="outlined"
        padding="none"
        style={{
          ...(layout === "stacked" ? { width: 96 } : null),
          borderWidth: 1,
          borderColor: selected ? colors.accent : "rgba(255,255,255,0.15)",
          ...(selected ? { backgroundColor: colors.accentMuted } : null),
          ...style,
        }}
      >
        {layout === "stacked" ? (
          <View style={{ gap: 8, padding: 12 }}>
            {icon}
            <Text variant="caption" color="accent" className="font-sans-medium" numberOfLines={2}>
              {label}
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center gap-2" style={{ minHeight: 52, padding: 12 }}>
            {icon}
            <Text variant="caption" color="accent" className="font-sans-medium flex-1">
              {label}
            </Text>
            {selected ? <View className="size-4 items-center justify-center rounded-full bg-accent" /> : null}
          </View>
        )}
      </Card>
    </PressableScale>
  );
}

export default QuickActionChip;

import { View } from "react-native";

import { useTheme as useAtlasTheme } from "@atlas/ui-native/theme";

import type { CategoryTone } from "@/lib/category";
import { getCategoryVisual } from "@/lib/category";
import type { TransactionCategory } from "@/types";

const TONE_TOKENS: Record<CategoryTone, { background: keyof ReturnType<typeof useAtlasTheme>["colors"]; foreground: keyof ReturnType<typeof useAtlasTheme>["colors"] }> = {
  success: { background: "successSubtle", foreground: "success" },
  info: { background: "infoSubtle", foreground: "info" },
  warning: { background: "warningSubtle", foreground: "warning" },
  danger: { background: "dangerSubtle", foreground: "danger" },
  brand: { background: "primarySubtle", foreground: "primary" },
  neutral: { background: "backgroundMuted", foreground: "foregroundMuted" },
};

export interface CategoryIconProps {
  category: TransactionCategory;
  size?: number;
}

/** Tinted category glyph (Figma "Explain a transaction" sheet row leading icon) — color/icon derived from `lib/category.ts`, sourced from Atlas's own semantic subtle-background tokens (no new hardcoded colors). */
export function CategoryIcon({ category, size = 44 }: CategoryIconProps) {
  const { colors } = useAtlasTheme();
  const visual = getCategoryVisual(category);
  const tone = TONE_TOKENS[visual.tone];
  const CategoryIconGlyph = visual.icon;

  return (
    <View
      className="items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: colors[tone.background] }}
    >
      <CategoryIconGlyph size={size * 0.45} color={colors[tone.foreground]} strokeWidth={2} />
    </View>
  );
}

export default CategoryIcon;

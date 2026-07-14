import { Text as RNText } from "react-native";

import { Text, type TextProps } from "@/components/ui";
import { useAppTheme } from "@/design-system";

export interface HighlightedTextProps extends Omit<TextProps, "children"> {
  text: string;
}

/**
 * Currency amounts, percentages, and "N Miles / AED"-style ratios — the "key values" in a scripted
 * reason. A single capturing group around the whole alternation (inner decimal parts are
 * non-capturing) so `String.split` returns a clean, evenly-alternating
 * `[text, match, text, match, ...]` array — odd indices are always matches.
 */
const HIGHLIGHT_PATTERN = /(AED\s?[\d,]+\+?|\d+(?:\.\d+)?%|\d+(?:\.\d+)?\s*Miles\s*\/\s*AED)/g;

/**
 * Renders `text` with its numeric "key values" (currency, percent, miles-rate) bolded in the
 * accent color — e.g. "You spend **AED 48,000+** annually on flights" (offering-detail "Here's why
 * it fits you" list, per the user: "increase emphasis on key values"). Regex-based rather than a
 * structured data shape, since the reasons are plain scripted strings (CLAUDE.md's deterministic
 * mock engine) and this pattern covers every value format currently seeded.
 */
export function HighlightedText({ text, ...textProps }: HighlightedTextProps) {
  const { colors } = useAppTheme();
  const segments = text.split(HIGHLIGHT_PATTERN);

  return (
    <Text {...textProps}>
      {segments.map((segment, index) =>
        index % 2 === 1 ? (
          <RNText key={index} className="font-sans-bold" style={{ color: colors.accent }}>
            {segment}
          </RNText>
        ) : (
          segment
        ),
      )}
    </Text>
  );
}

export default HighlightedText;

import { View } from "react-native";

import { Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";

export interface ChatMessageProps {
  role: "user" | "assistant";
  /** Paragraphs rendered with spacing between them (Figma splits replies into separate `<p>`s). */
  lines: string[];
}

/**
 * Copilot chat bubble (Figma "User Bubble" / "Reply AI bubble", node 224:1128 / 224:1130).
 * User bubbles are accent-filled and right-aligned; assistant bubbles are white/elevated and
 * left-aligned.
 */
export function ChatMessage({ role, lines }: ChatMessageProps) {
  const { colors } = useAppTheme();
  const isUser = role === "user";

  return (
    <View
      className={`max-w-[280px] rounded-2xl px-4 py-3 ${isUser ? "self-end" : "self-start"}`}
      style={{
        backgroundColor: isUser ? colors.accent : colors.surface,
        shadowColor: isUser ? undefined : "#0F1A4D",
        shadowOpacity: isUser ? 0 : 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: isUser ? 0 : 2,
      }}
      accessibilityRole="text"
    >
      {lines.map((line, index) => (
        <Text
          key={index}
          variant="body"
          style={{ color: isUser ? colors.onAccent : colors.textPrimary }}
          className={index > 0 ? "mt-2" : undefined}
        >
          {line}
        </Text>
      ))}
    </View>
  );
}

export default ChatMessage;

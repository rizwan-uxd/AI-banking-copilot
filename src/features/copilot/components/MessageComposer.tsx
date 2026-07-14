import { ArrowUp } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { Input } from "@atlas/ui-native";

import { Icon, PressableScale } from "@/components/ui";
import { useAppTheme } from "@/design-system";

export interface MessageComposerProps {
  onSubmit?: (message: string) => void;
}

/**
 * Copilot sticky message composer (Figma "Message Input Bar", node 228:760), composing Atlas
 * `Input` (variant="ghost" — no chrome of its own, sits inside the app's pill container). The
 * waveform glyph in Figma is decorative micro-copy for a "listening" state, not yet wired to
 * voice input, so this renders the text field + send button only.
 */
export function MessageComposer({ onSubmit }: MessageComposerProps) {
  const { colors } = useAppTheme();
  const [value, setValue] = useState("");

  function handleSubmit() {
    if (!value.trim()) return;
    onSubmit?.(value.trim());
    setValue("");
  }

  return (
    <View
      className="flex-row items-center gap-3 rounded-full px-4"
      style={{ height: 56, backgroundColor: colors.surfaceMuted }}
    >
      <View className="flex-1">
        <Input
          variant="ghost"
          placeholder="Type your message..."
          value={value}
          onChangeText={setValue}
          onSubmitEditing={handleSubmit}
          returnKeyType="send"
          accessibilityLabel="Message"
        />
      </View>
      <PressableScale
        onPress={handleSubmit}
        accessibilityRole="button"
        accessibilityLabel="Send message"
        style={{
          width: 32,
          height: 32,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.accentMuted,
        }}
      >
        <Icon icon={ArrowUp} size={20} color="accent" />
      </PressableScale>
    </View>
  );
}

export default MessageComposer;

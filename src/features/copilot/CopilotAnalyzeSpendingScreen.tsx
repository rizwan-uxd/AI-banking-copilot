import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Banknote, ChevronLeft, CreditCard, Ellipsis, LockKeyhole } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

import { QuickActionChip } from "@/components/banking/QuickActionChip";
import { Icon, PressableScale, Screen, Text } from "@/components/ui";
import { ChatMessage } from "@/features/copilot/components/ChatMessage";
import { CopilotHeader } from "@/features/copilot/components/CopilotHeader";
import { CustomDateRangeSheet } from "@/features/copilot/components/CustomDateRangeSheet";
import { OptionPill } from "@/features/copilot/components/OptionPill";

export type AnalysisScopeId = "all" | "primary" | "credit_card" | "custom";

export const ANALYSIS_SCOPES: { id: AnalysisScopeId; icon: typeof LockKeyhole; label: string }[] = [
  { id: "all", icon: LockKeyhole, label: "All accounts &\ncards" },
  { id: "primary", icon: Banknote, label: "123456789\nPrimary account" },
  { id: "credit_card", icon: CreditCard, label: "4410 XXXX 1345\nCredit card" },
  { id: "custom", icon: Ellipsis, label: "Custom selection" },
];

export type TimeRangeId = "last_month" | "last_3_months" | "custom";

export const TIME_RANGES: { id: TimeRangeId; label: string }[] = [
  { id: "last_month", label: "Last month" },
  { id: "last_3_months", label: "Last 3 months" },
  { id: "custom", label: "Custom" },
];

export interface CustomDateRange {
  startIso: string;
  endIso: string;
}

export interface CopilotAnalyzeSpendingScreenProps {
  /** What the user actually typed/tapped to get here. Falls back to the scripted opening line. */
  initialQuery?: string;
  onBack?: () => void;
  /**
   * Fires once the scope and time range are chosen — for "Custom", only after the date-range sheet
   * is applied, with `customRange` set. The screen itself doesn't navigate — "2.4_see insighs" is a
   * separate screen — so the caller owns that decision, same as `CopilotSearchResultScreen`'s
   * `onCreateTicket`.
   */
  onContinue?: (scope: AnalysisScopeId, timeRange: TimeRangeId, customRange?: CustomDateRange) => void;
}

/**
 * Copilot "analyze spending" conversation (Figma nodes 273:1534 "2.2_analyze spending" and
 * 273:2086 "2.3_select time" — Flow 2: Spending analysis & insights). Same pattern as
 * `CopilotSearchResultScreen`: one chat thread continuing through a local `stage`, not two
 * separate screens. Scope selection (2.2) and time-range selection (2.3) each auto-advance on tap
 * — unlike Flow 1's dispute turn, Figma shows no separate confirm button here, so choosing an
 * option immediately posts it as the next chat turn and (once the caller wires `onContinue`)
 * navigates on. Both the scope tiles and the time-range pills start unselected — per the user,
 * nothing should read as pre-chosen — and only light up once tapped, since picking one is a
 * one-way action (advancing the stage, or on to "2.4_see insighs"), not a resting default.
 */
export function CopilotAnalyzeSpendingScreen({
  initialQuery,
  onBack,
  onContinue,
}: CopilotAnalyzeSpendingScreenProps) {
  const scrollRef = useRef<ScrollView>(null);
  const customRangeSheetRef = useRef<BottomSheetModal>(null);
  const [stage, setStage] = useState<"scope" | "time">("scope");
  const [scope, setScope] = useState<AnalysisScopeId>();
  const [timeRange, setTimeRange] = useState<TimeRangeId>();

  useEffect(() => {
    if (stage === "time") {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [stage]);

  function handleSelectScope(id: AnalysisScopeId) {
    setScope(id);
    setStage("time");
  }

  function handleSelectTimeRange(id: TimeRangeId) {
    setTimeRange(id);
    if (id === "custom") {
      customRangeSheetRef.current?.present();
      return;
    }
    // Reachable only once `stage` is "time", which only happens after `handleSelectScope` runs —
    // `scope` is always set by then.
    onContinue?.(scope!, id);
  }

  function handleApplyCustomRange(startIso: string, endIso: string) {
    onContinue?.(scope!, "custom", { startIso, endIso });
  }

  const scopeLabel = ANALYSIS_SCOPES.find((option) => option.id === scope)?.label.replace("\n", " ") ?? "";

  return (
    <Screen edges={["bottom"]}>
      <CopilotHeader
        title="Analyze spending"
        leftAction={
          <PressableScale onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon icon={ChevronLeft} color="onAccent" />
          </PressableScale>
        }
      />
      <ScrollView ref={scrollRef} className="flex-1 bg-surface-muted" contentContainerClassName="gap-4 px-5 py-4">
        <ChatMessage role="user" lines={[initialQuery ?? "I want to analyze my spending."]} />
        <ChatMessage role="assistant" lines={["Great! Let's get started.", "What would you like to analyze?"]} />
        {stage === "scope" ? (
          <View className="gap-2">
            <Text variant="body" className="font-sans-medium px-1">
              Choose what you like to analyze
            </Text>
            <View className="gap-2">
              <View className="flex-row gap-[17px]">
                <QuickActionChip
                  layout="inline"
                  icon={<Icon icon={ANALYSIS_SCOPES[0].icon} size={16} color="navy" />}
                  label={ANALYSIS_SCOPES[0].label}
                  selected={scope === ANALYSIS_SCOPES[0].id}
                  onPress={() => handleSelectScope(ANALYSIS_SCOPES[0].id)}
                />
                <QuickActionChip
                  layout="inline"
                  icon={<Icon icon={ANALYSIS_SCOPES[1].icon} size={16} color="navy" />}
                  label={ANALYSIS_SCOPES[1].label}
                  selected={scope === ANALYSIS_SCOPES[1].id}
                  onPress={() => handleSelectScope(ANALYSIS_SCOPES[1].id)}
                />
              </View>
              <View className="flex-row gap-[17px]">
                <QuickActionChip
                  layout="inline"
                  icon={<Icon icon={ANALYSIS_SCOPES[2].icon} size={16} color="navy" />}
                  label={ANALYSIS_SCOPES[2].label}
                  selected={scope === ANALYSIS_SCOPES[2].id}
                  onPress={() => handleSelectScope(ANALYSIS_SCOPES[2].id)}
                />
                <QuickActionChip
                  layout="inline"
                  icon={<Icon icon={ANALYSIS_SCOPES[3].icon} size={16} color="navy" />}
                  label={ANALYSIS_SCOPES[3].label}
                  selected={scope === ANALYSIS_SCOPES[3].id}
                  onPress={() => handleSelectScope(ANALYSIS_SCOPES[3].id)}
                />
              </View>
            </View>
          </View>
        ) : (
          <>
            <ChatMessage role="user" lines={[scopeLabel]} />
            <ChatMessage role="assistant" lines={["Great! When do you want to analyze?"]} />
            <View className="flex-row gap-2 px-1">
              {TIME_RANGES.map((range) => (
                <OptionPill
                  key={range.id}
                  label={range.label}
                  selected={range.id === timeRange}
                  onPress={() => handleSelectTimeRange(range.id)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
      <CustomDateRangeSheet ref={customRangeSheetRef} onApply={handleApplyCustomRange} />
    </Screen>
  );
}

export default CopilotAnalyzeSpendingScreen;

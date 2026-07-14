import { ChevronLeft, Copy, Download, Ellipsis, Eye, LockKeyhole, TriangleAlert } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

import { Header } from "@atlas/ui-native";

import { QuickActionChip } from "@/components/banking/QuickActionChip";
import { Icon, PressableScale, Screen, Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";
import { ChatMessage } from "@/features/copilot/components/ChatMessage";
import { MessageComposer } from "@/features/copilot/components/MessageComposer";
import { TransactionDetailCard } from "@/features/copilot/components/TransactionDetailCard";
import { getAccountById } from "@/data/accounts";
import { getMerchantById } from "@/data/merchants";
import { getTransactionById } from "@/data/transactions";
import { getCategoryVisual } from "@/lib/category";
import { formatMediumDate } from "@/lib/date";

export interface CopilotSearchResultScreenProps {
  /** Transaction being explained. Defaults to the seeded DEWA dispute scenario. */
  transactionId?: string;
  /**
   * What the user actually typed (e.g. in Home's search bar), shown as the first bubble. Falls
   * back to the scripted "Why was AED 250 deducted..." question when not provided — there's only
   * one scripted scenario built so far, so the AI reply is fixed regardless of the query text.
   */
  initialQuery?: string;
  onBack?: () => void;
  /**
   * Fires when the user taps "Create ticket", with the chosen issue type and its label. The
   * screen itself doesn't navigate — 1.5's success screen is a separate pushed route (see
   * `app/copilot-dispute-success.tsx`), so the caller owns that decision.
   */
  onCreateTicket?: (issueType: IssueType, issueTypeLabel: string) => void;
}

/** Deterministic reply once the dispute stage starts — no intent-matching engine yet (Phase 4). */
const DISPUTE_REPLY = "I'm sorry to hear that. I'll help you report this transaction.";

export type IssueType = "unauthorized" | "wrong_amount" | "duplicate" | "other";

export const ISSUE_TYPES: { id: IssueType; icon: typeof LockKeyhole; label: string }[] = [
  { id: "unauthorized", icon: LockKeyhole, label: "Unauthorized transaction" },
  { id: "wrong_amount", icon: TriangleAlert, label: "Wrong amount" },
  { id: "duplicate", icon: Copy, label: "Duplicate transaction" },
  { id: "other", icon: Ellipsis, label: "Something else" },
];

/**
 * Copilot search-result → dispute conversation (Figma nodes 224:1116 "1.2_search result" and
 * 232:759 "1.3_search result conversations" — Flow 1: Search & dispute). Per the user, 1.2/1.3
 * are the same chat thread continuing, not separate screens, so this is one component with a
 * local `stage`. Unlike Figma's literal per-screen mockup (where 1.3 replaces 1.2 entirely), the
 * user asked for a real chat feel — the original question + AI reply stay visible and the dispute
 * turn appends below, but the first turn's `TransactionDetailCard` + "Would you like to" row (a
 * one-time action prompt, not a message) hide once `stage` moves to "dispute", replaced by the
 * dispute turn's own card + issue-type picker + footer. Reached either by tapping "Report an issue"
 * (scripted dispute line) or by typing any follow-up message in the composer (that typed text
 * becomes the dispute-stage user bubble). The scroll auto-advances, animated, to the newly
 * appended content whenever the stage changes.
 *
 * "1.4_Raise dispute" (an inline "connecting to a specialist" confirmation) was tried here as a
 * third inline stage, then dropped per updated direction — tapping "Create ticket" now pushes
 * "1.5_success screen" as a real new screen (`onCreateTicket`) instead of staying inline.
 */
export function CopilotSearchResultScreen({
  transactionId = "txn_0291235",
  initialQuery,
  onBack,
  onCreateTicket,
}: CopilotSearchResultScreenProps) {
  const { colors } = useAppTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [stage, setStage] = useState<"result" | "dispute">("result");
  const [disputeMessage, setDisputeMessage] = useState("I did not authorize this transaction.");
  const [issueType, setIssueType] = useState<IssueType>("unauthorized");

  useEffect(() => {
    if (stage === "dispute") {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [stage]);

  function handleReportIssue() {
    setDisputeMessage("I did not authorize this transaction.");
    setStage("dispute");
  }

  function handleComposerSubmit(message: string) {
    setDisputeMessage(message);
    setStage("dispute");
  }

  function handleCreateTicket() {
    const selected = ISSUE_TYPES.find((type) => type.id === issueType)!;
    onCreateTicket?.(selected.id, selected.label);
  }

  const transaction = getTransactionById(transactionId);
  const merchant = transaction ? getMerchantById(transaction.merchantId) : undefined;
  const account = transaction ? getAccountById(transaction.accountId) : undefined;

  if (!transaction || !merchant || !account) return null;

  const amountLabel = `${account.currency} ${(Math.abs(transaction.amountCents) / 100).toFixed(0)}`;

  return (
    <Screen edges={["bottom"]}>
      <Header
        title={stage === "result" ? `Why ${amountLabel} deducted?` : "Raise a dispute"}
        leftAction={
          <PressableScale onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon icon={ChevronLeft} color="onAccent" />
          </PressableScale>
        }
      />
      <ScrollView ref={scrollRef} className="flex-1 bg-surface-muted" contentContainerClassName="gap-4 px-5 py-4">
        <ChatMessage role="user" lines={[initialQuery ?? `Why was ${amountLabel} deducted from my account?`]} />
        <ChatMessage
          role="assistant"
          lines={[
            `${amountLabel} was charged by ${merchant.name} on ${formatMediumDate(transaction.date)}.`,
            getCategoryVisual(transaction.category).explanation,
          ]}
        />
        {stage === "result" ? (
          <>
            <TransactionDetailCard transaction={transaction} merchant={merchant} currency={account.currency} />
            <View className="gap-3">
              <Text variant="body" className="font-sans-medium px-1">
                Would you like to
              </Text>
              <View className="flex-row gap-2">
                <QuickActionChip icon={<Icon icon={Eye} size={16} color="navy" />} label={"View bill\ndetails"} />
                <QuickActionChip icon={<Icon icon={Download} size={16} color="navy" />} label={"Download\nreceipt"} />
                <QuickActionChip
                  icon={<Icon icon={TriangleAlert} size={16} color="navy" />}
                  label={"Report an\nissue"}
                  onPress={handleReportIssue}
                />
              </View>
            </View>
          </>
        ) : (
          <>
            <ChatMessage role="user" lines={[disputeMessage]} />
            <ChatMessage role="assistant" lines={[DISPUTE_REPLY]} />
            <TransactionDetailCard transaction={transaction} merchant={merchant} currency={account.currency} />
            <View className="gap-3">
              <Text variant="body" className="font-sans-medium px-1">
                Issue type
              </Text>
              <View className="gap-2 px-1">
                <View className="flex-row gap-[17px]">
                  <QuickActionChip
                    layout="inline"
                    icon={<Icon icon={ISSUE_TYPES[0].icon} size={16} color="navy" />}
                    label={ISSUE_TYPES[0].label}
                    selected={issueType === ISSUE_TYPES[0].id}
                    onPress={() => setIssueType(ISSUE_TYPES[0].id)}
                  />
                  <QuickActionChip
                    layout="inline"
                    icon={<Icon icon={ISSUE_TYPES[1].icon} size={16} color="navy" />}
                    label={ISSUE_TYPES[1].label}
                    selected={issueType === ISSUE_TYPES[1].id}
                    onPress={() => setIssueType(ISSUE_TYPES[1].id)}
                  />
                </View>
                <View className="flex-row gap-[17px]">
                  <QuickActionChip
                    layout="inline"
                    icon={<Icon icon={ISSUE_TYPES[2].icon} size={16} color="navy" />}
                    label={ISSUE_TYPES[2].label}
                    selected={issueType === ISSUE_TYPES[2].id}
                    onPress={() => setIssueType(ISSUE_TYPES[2].id)}
                  />
                  <QuickActionChip
                    layout="inline"
                    icon={<Icon icon={ISSUE_TYPES[3].icon} size={16} color="navy" />}
                    label={ISSUE_TYPES[3].label}
                    selected={issueType === ISSUE_TYPES[3].id}
                    onPress={() => setIssueType(ISSUE_TYPES[3].id)}
                  />
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      <View className="border-t border-border bg-surface px-5 pb-2 pt-4">
        {stage === "result" ? (
          <MessageComposer onSubmit={handleComposerSubmit} />
        ) : (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Create ticket"
            onPress={handleCreateTicket}
            style={{ height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy }}
          >
            <Text variant="body" className="font-sans-medium" style={{ color: colors.onAccent }}>
              Create ticket
            </Text>
          </PressableScale>
        )}
      </View>
    </Screen>
  );
}

export default CopilotSearchResultScreen;

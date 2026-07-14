import { Check, ChevronLeft } from "lucide-react-native";
import { View } from "react-native";

import { Header } from "@atlas/ui-native";

import { Icon, PressableScale, Screen, Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";
import { DisputeSummaryCard } from "@/features/copilot/components/DisputeSummaryCard";
import { getAccountById } from "@/data/accounts";
import { getMerchantById } from "@/data/merchants";
import { getTransactionById } from "@/data/transactions";

export interface CopilotDisputeSuccessScreenProps {
  transactionId: string;
  issueTypeLabel: string;
  ticketId: string;
  onBack?: () => void;
  onViewTickets?: () => void;
  onBackToHome?: () => void;
}

/**
 * Copilot dispute success screen (Figma "1.5_success screen", node 256:881 — Flow 1: Search &
 * dispute). Reached by tapping "Create ticket" on the dispute conversation
 * (`CopilotSearchResultScreen`) — a real pushed screen, not an inline chat stage (superseding the
 * earlier "1.4_Raise dispute" inline-confirmation attempt, per updated direction). "View my
 * tickets" has no destination yet (no tickets list screen built) so `onViewTickets` is optional
 * and no-ops if unset — not wiring a route that doesn't exist yet.
 */
export function CopilotDisputeSuccessScreen({
  transactionId,
  issueTypeLabel,
  ticketId,
  onBack,
  onViewTickets,
  onBackToHome,
}: CopilotDisputeSuccessScreenProps) {
  const { colors } = useAppTheme();

  const transaction = getTransactionById(transactionId);
  const merchant = transaction ? getMerchantById(transaction.merchantId) : undefined;
  const account = transaction ? getAccountById(transaction.accountId) : undefined;

  if (!transaction || !merchant || !account) return null;

  return (
    <Screen edges={["bottom"]}>
      <Header
        title="Raise a dispute"
        leftAction={
          <PressableScale onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon icon={ChevronLeft} color="onAccent" />
          </PressableScale>
        }
      />
      <View className="flex-1 bg-surface-muted px-5 py-6" style={{ gap: 24 }}>
        <View className="items-center gap-4">
          <View className="size-20 items-center justify-center rounded-full" style={{ backgroundColor: colors.positive + "22" }}>
            <Icon icon={Check} size={40} color="positive" strokeWidth={2.5} />
          </View>
          <View className="gap-2">
            <Text variant="body" className="font-sans-semibold text-center">
              Request submitted successfully
            </Text>
            <Text variant="body" color="secondary" className="text-center">
              Our team will review your case and update you within 24 hours.
            </Text>
          </View>
        </View>
        <View className="gap-2">
          <Text variant="body" className="font-sans-medium px-1">
            Case summary
          </Text>
          <DisputeSummaryCard
            issueTypeLabel={issueTypeLabel}
            transaction={transaction}
            merchant={merchant}
            currency={account.currency}
            ticketId={ticketId}
          />
        </View>
      </View>
      <View className="gap-3 px-5 pb-2 pt-4">
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="View my tickets"
          onPress={onViewTickets}
          style={{ height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface }}
        >
          <Text variant="body" className="font-sans-medium" color="accent">
            View my tickets
          </Text>
        </PressableScale>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          onPress={onBackToHome}
          style={{ height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy }}
        >
          <Text variant="body" className="font-sans-medium" style={{ color: colors.onAccent }}>
            Back to home
          </Text>
        </PressableScale>
      </View>
    </Screen>
  );
}

export default CopilotDisputeSuccessScreen;

import { View } from "react-native";

import { Card } from "@atlas/ui-native";

import { DetailRow } from "@/components/banking/DetailRow";
import { formatCurrency } from "@/lib/currency";
import type { Merchant, Transaction } from "@/types";

export interface DisputeSummaryCardProps {
  issueTypeLabel: string;
  transaction: Transaction;
  merchant: Merchant;
  currency: string;
  ticketId: string;
}

/**
 * Copilot "Case summary" card (Figma "1.4_Raise dispute", node 250:1806 "Transaction Detail
 * Card" — same visual as `TransactionDetailCard` but a different field set: issue type + ticket
 * ID instead of date + reference number).
 */
export function DisputeSummaryCard({ issueTypeLabel, transaction, merchant, currency, ticketId }: DisputeSummaryCardProps) {
  return (
    <Card variant="elevated" padding="md">
      <View style={{ gap: 12 }}>
        <DetailRow label="Issue type" value={issueTypeLabel} showDivider />
        <DetailRow label="Amount" value={formatCurrency(transaction.amountCents, currency)} showDivider />
        <DetailRow label="Merchant" value={merchant.name} avatarLabel={merchant.name.charAt(0)} showDivider />
        <DetailRow label="Ticket ID" value={ticketId} showDivider={false} />
      </View>
    </Card>
  );
}

export default DisputeSummaryCard;

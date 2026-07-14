import { View } from "react-native";

import { Card } from "@atlas/ui-native";

import { DetailRow } from "@/features/copilot/components/DetailRow";
import { formatCurrency } from "@/lib/currency";
import { formatMediumDate } from "@/lib/date";
import type { Merchant, Transaction } from "@/types";

export interface TransactionDetailCardProps {
  transaction: Transaction;
  merchant: Merchant;
  currency: string;
}

/**
 * Copilot transaction-detail card (Figma "Transaction Detail Card", node 224:1132). Data-grounded
 * — reads the transaction/merchant records passed in rather than any hardcoded copy.
 */
export function TransactionDetailCard({ transaction, merchant, currency }: TransactionDetailCardProps) {
  return (
    <Card variant="elevated" padding="md">
      <View style={{ gap: 12 }}>
        <DetailRow label="Amount" value={formatCurrency(transaction.amountCents, currency)} showDivider />
        <DetailRow label="Merchant" value={merchant.name} avatarLabel={merchant.name.charAt(0)} showDivider />
        <DetailRow
          label="Date"
          value={formatMediumDate(transaction.date)}
          showDivider={Boolean(transaction.referenceNumber)}
        />
        {transaction.referenceNumber ? (
          <DetailRow label="Reference No." value={transaction.referenceNumber} showDivider={false} />
        ) : null}
      </View>
    </Card>
  );
}

export default TransactionDetailCard;

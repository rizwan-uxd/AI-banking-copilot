import { ChevronRight } from "lucide-react-native";
import { View } from "react-native";

import { Badge, Card } from "@atlas/ui-native";

import { CategoryIcon } from "@/components/banking/CategoryIcon";
import { Icon, PressableScale, Text } from "@/components/ui";
import { getCategoryVisual } from "@/lib/category";
import { formatCurrency } from "@/lib/currency";
import { formatMediumDate } from "@/lib/date";
import type { Merchant, Transaction } from "@/types";

const BADGE_VARIANT_FOR_TONE = {
  success: "success",
  info: "info",
  warning: "warning",
  danger: "danger",
  brand: "brand",
  neutral: "neutral",
} as const;

export interface TransactionRowProps {
  transaction: Transaction;
  merchant: Merchant;
  currency: string;
  onPress?: () => void;
}

/**
 * Reusable transaction row (Figma "Explain a transaction" sheet row, reused verbatim for the
 * minimal Transactions tab list) — leading `CategoryIcon`, merchant + description + category
 * badge, trailing amount + date + chevron. The whole row is the tap target.
 */
export function TransactionRow({ transaction, merchant, currency, onPress }: TransactionRowProps) {
  const visual = getCategoryVisual(transaction.category);

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${merchant.name}, ${formatCurrency(transaction.amountCents, currency)}, ${formatMediumDate(transaction.date)}`}
    >
      <Card variant="elevated" padding="md">
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <CategoryIcon category={transaction.category} />
          <View className="flex-1" style={{ gap: 4 }}>
            <Text variant="body" className="font-sans-semibold">
              {merchant.name}
            </Text>
            <Text variant="caption" color="secondary">
              {transaction.description}
            </Text>
            <Badge variant={BADGE_VARIANT_FOR_TONE[visual.tone]}>{visual.label}</Badge>
          </View>
          <View className="items-end" style={{ gap: 4 }}>
            <Text variant="body" className="font-sans-semibold">
              {formatCurrency(transaction.amountCents, currency)}
            </Text>
            <Text variant="caption" color="muted">
              {formatMediumDate(transaction.date)}
            </Text>
          </View>
          <Icon icon={ChevronRight} size={18} color="muted" />
        </View>
      </Card>
    </PressableScale>
  );
}

export default TransactionRow;

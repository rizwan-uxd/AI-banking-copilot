import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { CreditCard, Lock, Wallet, X } from "lucide-react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, type BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

import { TransactionRow } from "@/components/banking/TransactionRow";
import { Icon, PressableScale, SegmentedControl, Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";
import { getAccounts } from "@/data/accounts";
import { getMerchantById } from "@/data/merchants";
import { getTransactionsByAccounts } from "@/data/transactions";
import type { Transaction } from "@/types";

export interface ExplainTransactionSheetProps {
  onSelectTransaction: (transaction: Transaction) => void;
  onViewAll: () => void;
}

const RECENT_COUNT = 3;

function renderBackdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />;
}

/**
 * "Explain a transaction" bottom sheet — presented over Home (not a navigated screen) when the
 * user taps the "Explain transactions" quick-action chip. Uses `@gorhom/bottom-sheet` per
 * ADR-009. Selecting a row closes the sheet and hands the transaction to the caller, which
 * navigates to the copilot chat and auto-sends the question (see `HomeScreen`).
 */
export const ExplainTransactionSheet = forwardRef<BottomSheetModal, ExplainTransactionSheetProps>(
  function ExplainTransactionSheet({ onSelectTransaction, onViewAll }, ref) {
    const { colors } = useAppTheme();
    const sheetRef = useRef<BottomSheetModal>(null);
    useImperativeHandle(ref, () => sheetRef.current as BottomSheetModal);
    const [accountType, setAccountType] = useState<"deposit" | "credit">("deposit");

    const accounts = useMemo(() => getAccounts(), []);
    const accountIdsForType = useMemo(
      () =>
        accounts
          .filter((account) => (accountType === "credit" ? account.type === "credit" : account.type !== "credit"))
          .map((account) => account.id),
      [accounts, accountType],
    );
    const recentTransactions = useMemo(
      () => getTransactionsByAccounts(accountIdsForType).slice(0, RECENT_COUNT),
      [accountIdsForType],
    );

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={["75%"]}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <BottomSheetView className="flex-1 px-5" style={{ gap: 20 }}>
          <View className="flex-row items-start justify-between">
            <View className="flex-1" style={{ gap: 4 }}>
              <Text variant="heading" className="font-sans-semibold">
                Explain a transaction
              </Text>
              <Text variant="body" color="secondary">
                Choose a transaction to get an explanation from AI.
              </Text>
            </View>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={() => sheetRef.current?.dismiss()}
              style={{ width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceMuted }}
            >
              <Icon icon={X} size={18} color="primary" />
            </PressableScale>
          </View>

          <SegmentedControl
            options={[
              { value: "deposit", label: "Accounts", icon: Wallet },
              { value: "credit", label: "Credit cards", icon: CreditCard },
            ]}
            value={accountType}
            onChange={setAccountType}
          />

          <View style={{ gap: 12 }}>
            <View className="flex-row items-center justify-between">
              <Text variant="body" className="font-sans-semibold">
                Recent transactions
              </Text>
              <PressableScale accessibilityRole="button" accessibilityLabel="View all transactions" onPress={onViewAll}>
                <Text variant="body" color="accent" className="font-sans-medium">
                  View all
                </Text>
              </PressableScale>
            </View>
            <View style={{ gap: 8 }}>
              {recentTransactions.map((transaction) => {
                const merchant = getMerchantById(transaction.merchantId);
                const account = accounts.find((candidate) => candidate.id === transaction.accountId);
                if (!merchant || !account) return null;
                return (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    merchant={merchant}
                    currency={account.currency}
                    onPress={() => onSelectTransaction(transaction)}
                  />
                );
              })}
            </View>
          </View>

          <View className="flex-row items-center justify-center" style={{ gap: 8 }}>
            <Icon icon={Lock} size={14} color="muted" />
            <Text variant="caption" color="muted" className="text-center">
              Only you can see your transactions. Your data is secure and private.
            </Text>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default ExplainTransactionSheet;

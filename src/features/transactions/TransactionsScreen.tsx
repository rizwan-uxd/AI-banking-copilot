import { useMemo, useState } from "react";
import { FlatList } from "react-native";
import { CreditCard, Wallet } from "lucide-react-native";
import { router } from "expo-router";

import { Header } from "@atlas/ui-native";

import { TransactionRow } from "@/components/banking/TransactionRow";
import { Screen, SegmentedControl } from "@/components/ui";
import { getAccounts } from "@/data/accounts";
import { getMerchantById } from "@/data/merchants";
import { getTransactionsByAccounts } from "@/data/transactions";
import { fontFamily } from "@/design-system";
import { formatDayMonth } from "@/lib/date";
import type { Transaction } from "@/types";

/**
 * Full transaction history (Phase 3, minimal cut) — reached via "View all" from the Home
 * "Explain a transaction" sheet. Same `TransactionRow` + `SegmentedControl` as the sheet, just
 * every transaction for the selected account type instead of the latest 3. No filters/search yet
 * (explicitly deferred — see conversation).
 */
export function TransactionsScreen() {
  const [accountType, setAccountType] = useState<"deposit" | "credit">("deposit");
  const accounts = useMemo(() => getAccounts(), []);

  const accountIdsForType = useMemo(
    () =>
      accounts
        .filter((account) => (accountType === "credit" ? account.type === "credit" : account.type !== "credit"))
        .map((account) => account.id),
    [accounts, accountType],
  );
  const transactions = useMemo(() => getTransactionsByAccounts(accountIdsForType), [accountIdsForType]);

  function handleSelectTransaction(transaction: Transaction) {
    const merchant = getMerchantById(transaction.merchantId);
    const account = accounts.find((candidate) => candidate.id === transaction.accountId);
    if (!merchant || !account) return;
    const amount = (Math.abs(transaction.amountCents) / 100).toFixed(0);
    router.push({
      pathname: "/copilot-search-result",
      params: {
        transactionId: transaction.id,
        query: `Why was ${account.currency} ${amount} charged by ${merchant.name} on ${formatDayMonth(transaction.date)}?`,
      },
    });
  }

  return (
    <Screen edges={["bottom"]}>
      <Header title="Transactions" titleStyle={{ fontFamily: fontFamily.semibold }} />
      <FlatList
        data={transactions}
        keyExtractor={(transaction) => transaction.id}
        contentContainerClassName="gap-2 px-5 py-4"
        ListHeaderComponent={
          <SegmentedControl
            options={[
              { value: "deposit", label: "Accounts", icon: Wallet },
              { value: "credit", label: "Credit cards", icon: CreditCard },
            ]}
            value={accountType}
            onChange={setAccountType}
          />
        }
        ListHeaderComponentStyle={{ marginBottom: 12 }}
        renderItem={({ item }) => {
          const merchant = getMerchantById(item.merchantId);
          const account = accounts.find((candidate) => candidate.id === item.accountId);
          if (!merchant || !account) return null;
          return (
            <TransactionRow
              transaction={item}
              merchant={merchant}
              currency={account.currency}
              onPress={() => handleSelectTransaction(item)}
            />
          );
        }}
      />
    </Screen>
  );
}

export default TransactionsScreen;

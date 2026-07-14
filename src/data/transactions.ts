import type { Transaction } from "@/types";

import transactionsSeed from "./transactions.json";

const transactions: Transaction[] = transactionsSeed as Transaction[];

export function getTransactions(): Transaction[] {
  return transactions;
}

export function getTransactionById(id: string): Transaction | undefined {
  return transactions.find((transaction) => transaction.id === id);
}

export function getTransactionsByAccount(accountId: string): Transaction[] {
  return transactions.filter((transaction) => transaction.accountId === accountId);
}

/** Transactions across the given accounts, newest first. */
export function getTransactionsByAccounts(accountIds: string[]): Transaction[] {
  return transactions
    .filter((transaction) => accountIds.includes(transaction.accountId))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

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

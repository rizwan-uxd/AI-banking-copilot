import type { Account } from "@/types";

import accountsSeed from "./accounts.json";

const accounts: Account[] = accountsSeed as Account[];

export function getAccounts(): Account[] {
  return accounts;
}

export function getAccountById(id: string): Account | undefined {
  return accounts.find((account) => account.id === id);
}

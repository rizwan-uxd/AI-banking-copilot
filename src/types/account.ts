export type AccountType = "checking" | "savings" | "credit";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  /** Minor units (cents). Credit balances are negative (amount owed). */
  balanceCents: number;
  currency: string;
  institution: string;
  last4: string;
}

export type TransactionCategory =
  | "groceries"
  | "dining"
  | "transport"
  | "shopping"
  | "entertainment"
  | "subscriptions"
  | "bills"
  | "income"
  | "transfer"
  | "other";

export type TransactionStatus = "posted" | "pending";

export interface Transaction {
  id: string;
  accountId: string;
  merchantId: string;
  /** Minor units (cents). Negative = money out, positive = money in. */
  amountCents: number;
  category: TransactionCategory;
  /** ISO 8601 date (YYYY-MM-DD). */
  date: string;
  description: string;
  status: TransactionStatus;
}

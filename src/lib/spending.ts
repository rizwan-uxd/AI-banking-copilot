import { getTransactions } from "@/data/transactions";
import type { Transaction, TransactionCategory } from "@/types";

import { addDays, daysBetweenInclusive } from "./date";

/** Categories excluded from "spend" totals — money in, or moved rather than spent. */
const NON_SPEND_CATEGORIES: TransactionCategory[] = ["income", "transfer"];

export interface CategorySpend {
  category: TransactionCategory;
  totalCents: number;
  /** Share of the period's total spend, 0-100, rounded to the nearest whole number. */
  percent: number;
}

export interface SpendingSummary {
  startIso: string;
  endIso: string;
  previousStartIso: string;
  previousEndIso: string;
  totalCents: number;
  previousTotalCents: number;
  /** Signed percent change vs. the immediately preceding period of the same length. */
  changePercent: number;
  /**
   * False when the preceding period falls mostly (or entirely) before the seeded data's earliest
   * transaction — the seed data only covers ~93 days, so e.g. a 90-day window near the start of
   * that range has almost no prior period to compare against. `changePercent` is meaningless in
   * that case and the caller should hide the comparison rather than show a misleading swing.
   */
  hasPriorPeriodData: boolean;
  /** Categories with a nonzero share, in display order (see callers for top-N + "Others" bundling). */
  categories: CategorySpend[];
}

function isSpend(transaction: Transaction): boolean {
  return transaction.amountCents < 0 && !NON_SPEND_CATEGORIES.includes(transaction.category);
}

function sumSpend(transactions: Transaction[], accountIds: string[], startIso: string, endIso: string): Transaction[] {
  return transactions.filter(
    (transaction) =>
      accountIds.includes(transaction.accountId) &&
      isSpend(transaction) &&
      transaction.date >= startIso &&
      transaction.date <= endIso,
  );
}

/**
 * Aggregates real spend (never a hardcoded dataset — CLAUDE.md "local JSON over fake data") over
 * `[startIso, endIso]`, for the copilot "analyze spending" flow. The immediately preceding period
 * of the same length is used as the comparison period for `changePercent`.
 */
export function getSpendingSummary(accountIds: string[], startIso: string, endIso: string): SpendingSummary {
  const transactions = getTransactions();
  const windowDays = daysBetweenInclusive(startIso, endIso);

  const previousEndIso = addDays(startIso, -1);
  const previousStartIso = addDays(previousEndIso, -(windowDays - 1));

  const current = sumSpend(transactions, accountIds, startIso, endIso);
  const previous = sumSpend(transactions, accountIds, previousStartIso, previousEndIso);

  const totalCents = current.reduce((sum, transaction) => sum + Math.abs(transaction.amountCents), 0);
  const previousTotalCents = previous.reduce((sum, transaction) => sum + Math.abs(transaction.amountCents), 0);
  const changePercent = previousTotalCents === 0 ? 0 : Math.round(((totalCents - previousTotalCents) / previousTotalCents) * 100);

  const earliestDataDate = transactions.reduce(
    (earliest, transaction) => (transaction.date < earliest ? transaction.date : earliest),
    endIso,
  );
  const coveredDays = Math.max(
    0,
    (Date.parse(previousEndIso) - Date.parse(previousStartIso < earliestDataDate ? earliestDataDate : previousStartIso)) /
      86_400_000 +
      1,
  );
  const hasPriorPeriodData = coveredDays >= windowDays * 0.5;

  const totalsByCategory = new Map<TransactionCategory, number>();
  for (const transaction of current) {
    totalsByCategory.set(transaction.category, (totalsByCategory.get(transaction.category) ?? 0) + Math.abs(transaction.amountCents));
  }

  const categories: CategorySpend[] = Array.from(totalsByCategory.entries())
    .map(([category, catTotalCents]) => ({
      category,
      totalCents: catTotalCents,
      percent: totalCents === 0 ? 0 : Math.round((catTotalCents / totalCents) * 100),
    }))
    .sort((a, b) => b.totalCents - a.totalCents);

  return { startIso, endIso, previousStartIso, previousEndIso, totalCents, previousTotalCents, changePercent, hasPriorPeriodData, categories };
}

/**
 * Scripted "Last 3 months" scenario for the copilot "analyze spending" flow. The seed data only
 * spans ~93 days (`getTransactionDateBounds`), so a genuine 90-day-vs-90-day comparison has almost
 * no prior period to work with (`hasPriorPeriodData` would be false for real data here). Per the
 * user, this pill should show a plausible scripted result instead — the exact figures from Figma's
 * "2.4_see insighs" mock (node 279:1166: "AED 8,425.75", "+18%", category split) — consistent with
 * the mock AI engine being "a deterministic, scripted mock engine" (CLAUDE.md) rather than a real
 * aggregation when the underlying data can't support one. Category order is deliberately Figma's
 * display order, not sorted by percent — callers slice the top 5 + bundle the rest as "Others",
 * same as the real `getSpendingSummary` path, so "other" must stay last.
 */
export function getScriptedLastThreeMonthsSummary(endIso: string): SpendingSummary {
  const startIso = addDays(endIso, -89);
  const previousEndIso = addDays(startIso, -1);
  const previousStartIso = addDays(previousEndIso, -89);

  return {
    startIso,
    endIso,
    previousStartIso,
    previousEndIso,
    totalCents: 842_575,
    previousTotalCents: 713_962,
    changePercent: 18,
    hasPriorPeriodData: true,
    categories: [
      { category: "dining", totalCents: 235_921, percent: 28 },
      { category: "shopping", totalCents: 185_367, percent: 22 },
      { category: "groceries", totalCents: 134_812, percent: 16 },
      { category: "transport", totalCents: 101_109, percent: 12 },
      { category: "bills", totalCents: 84_258, percent: 10 },
      { category: "other", totalCents: 101_109, percent: 12 },
    ],
  };
}

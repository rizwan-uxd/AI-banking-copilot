export type InsightIcon = "trend-up" | "banknote" | "lightbulb";

export interface Insight {
  id: string;
  icon: InsightIcon;
  title: string;
  subtitle: string;
  /** ISO 8601 date (YYYY-MM-DD). */
  date: string;
}

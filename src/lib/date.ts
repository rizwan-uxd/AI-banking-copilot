/**
 * Formats an ISO 8601 date (YYYY-MM-DD) as "Today" if it matches the current
 * device date, otherwise as "DD/MM/YY" (design-system.md list-row convention).
 */
export function formatShortDate(isoDate: string, now: Date = new Date()): string {
  const [year, month, day] = isoDate.split("-").map(Number);

  const isToday =
    year === now.getFullYear() && month === now.getMonth() + 1 && day === now.getDate();

  if (isToday) return "Today";

  const yy = String(year).slice(-2);
  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  return `${dd}/${mm}/${yy}`;
}

const MONTH_ABBREVIATIONS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Formats an ISO 8601 date (YYYY-MM-DD) as "20 Jun 2026" (copilot transaction-detail convention). */
export function formatMediumDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTH_ABBREVIATIONS[month - 1]} ${year}`;
}

/** Formats an ISO 8601 date (YYYY-MM-DD) as "20 Jun" (no year) — used in auto-sent copilot questions. */
export function formatDayMonth(isoDate: string): string {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTH_ABBREVIATIONS[month - 1]}`;
}

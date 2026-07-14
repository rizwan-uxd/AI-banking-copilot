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

/** Returns the ISO 8601 date (YYYY-MM-DD) `offsetDays` away from `isoDate` (negative = earlier). */
export function addDays(isoDate: string, offsetDays: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + offsetDays));
  return date.toISOString().slice(0, 10);
}

/** Formats today's date (device clock) as an ISO 8601 date (YYYY-MM-DD). */
export function todayIsoDate(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/**
 * Formats a date range as "14 Jun - 14 Jul, 2026" (copilot "2.4_see insighs" date pill, node
 * 279:1279) — the end year always shown; the start year only added when it differs from the end.
 */
export function formatDateRangeLabel(startIsoDate: string, endIsoDate: string): string {
  const [startYear, startMonth, startDay] = startIsoDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endIsoDate.split("-").map(Number);
  const start = `${startDay} ${MONTH_ABBREVIATIONS[startMonth - 1]}${startYear === endYear ? "" : ` ${startYear}`}`;
  const end = `${endDay} ${MONTH_ABBREVIATIONS[endMonth - 1]}`;
  return `${start} - ${end}, ${endYear}`;
}

/** Number of calendar days spanned by an inclusive ISO date range (same day = 1). */
export function daysBetweenInclusive(startIsoDate: string, endIsoDate: string): number {
  return Math.round((Date.parse(endIsoDate) - Date.parse(startIsoDate)) / 86_400_000) + 1;
}

/** Number of days in a given month (1-12), accounting for leap years. */
export function daysInMonth(year: number, month1to12: number): number {
  return new Date(year, month1to12, 0).getDate();
}

/** Day of week (0 = Sunday) that the 1st of a given month (1-12) falls on. */
export function firstWeekdayOfMonth(year: number, month1to12: number): number {
  return new Date(year, month1to12 - 1, 1).getDay();
}

/** Formats a year + month (1-12) as "Jul 2026" — custom-date-picker header. */
export function formatMonthYear(year: number, month1to12: number): string {
  return `${MONTH_ABBREVIATIONS[month1to12 - 1]} ${year}`;
}

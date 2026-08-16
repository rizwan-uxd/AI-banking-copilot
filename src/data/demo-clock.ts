import { todayIsoDate } from "@/lib/date";

/**
 * The ISO date the seed data was authored against — the "today" of the Figma
 * frames (node 224:1496 shows the newest insight and conversation as "Today").
 *
 * Rows carrying this date are re-anchored to the device's current date when
 * loaded, so the demo keeps reading "Today" however long after build day it is
 * opened. Without this the newest row drifts into an absolute date (`12/07/26`)
 * and the screen stops matching the design. Older rows keep their literal
 * dates, exactly as Figma shows them (21/04/26, 16/04/26).
 *
 * Deterministic for any given day: same input, same output.
 */
export const SEED_TODAY = "2026-07-12";

/** Re-anchors any row dated `SEED_TODAY` to today's date, leaving others untouched. */
export function reanchorToToday<T extends { date: string }>(rows: readonly T[], now?: Date): T[] {
  const today = todayIsoDate(now);
  return rows.map((row) => (row.date === SEED_TODAY ? { ...row, date: today } : row));
}

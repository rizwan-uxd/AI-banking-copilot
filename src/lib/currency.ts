/**
 * Formats minor units (cents) as an unsigned currency string, e.g.
 * `formatCurrency(25000, "AED")` → "AED 250.00". Always use this for balances/amounts — never
 * render a raw number. Sign (income vs. spend) is a presentation concern for the caller (e.g. a
 * "-" prefix or `color="negative"` on the row), not part of this string.
 */
export function formatCurrency(amountCents: number, currency: string): string {
  const amount = Math.abs(amountCents) / 100;
  const formatted = amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${currency} ${formatted}`;
}

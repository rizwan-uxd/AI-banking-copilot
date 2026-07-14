/** Icon key for a "why it fits you" reason — mapped to a lucide icon at the component layer. */
export type ReasonIcon = "flight" | "lounge" | "wallet";

/** A recommended credit-card product (copilot "Find best products" flow, Flow 3). */
export interface ProductRecommendation {
  id: string;
  name: string;
  /** Shorter name for contexts with less room, e.g. the offering-detail header title. */
  shortName: string;
  /** Card network shown on the card art, e.g. "VISA". */
  network: string;
  matchLabel: string;
  annualFeeCents: number;
  estYearlyValueCents: number;
  netBenefitPerYearCents: number;
  /** e.g. "Up to 2.5 Miles/AED". */
  milesRate: string;
  /** e.g. "Unlimited". */
  airportLoungeAccess: string;
  fxFeePercent: number;
  /** e.g. "Very high (96%)". */
  approvalChanceLabel: string;
  /** "Here's why it fits you" checklist — each reason carries its own contextual icon key. */
  reasons: { icon: ReasonIcon; text: string }[];
  /** e.g. "42,600 Skyward miles". */
  estimatedYearlyRewardsLabel: string;
  aiConfidencePercent: number;
  /** "Let's quickly check your eligibility" step checklist, in order. */
  eligibilitySteps: string[];
  approvalProbabilityPercent: number;
  /** Success-screen benefit checklist. */
  benefits: string[];
}

/** A compact alternative offer row — no detail screen built for these yet. */
export interface AlternativeProduct {
  id: string;
  name: string;
  netBenefitPerYearCents: number;
}

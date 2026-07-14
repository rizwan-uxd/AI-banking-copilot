import {
  ArrowDownToLine,
  ArrowLeftRight,
  Car,
  Clapperboard,
  Coffee,
  Droplet,
  Ellipsis,
  Repeat,
  ShoppingBag,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react-native";

import type { TransactionCategory } from "@/types";

export type CategoryTone = "success" | "info" | "warning" | "danger" | "brand" | "neutral";

interface CategoryVisual {
  label: string;
  icon: LucideIcon;
  tone: CategoryTone;
  /** Deterministic second line for the copilot's scripted "explain this transaction" reply. */
  explanation: string;
}

const CATEGORY_VISUALS: Record<TransactionCategory, CategoryVisual> = {
  groceries: { label: "Groceries", icon: ShoppingCart, tone: "success", explanation: "This appears to be a grocery purchase." },
  dining: { label: "Dining", icon: Coffee, tone: "brand", explanation: "This appears to be a dining purchase." },
  transport: { label: "Transport", icon: Car, tone: "neutral", explanation: "This appears to be a transport fare." },
  shopping: { label: "Shopping", icon: ShoppingBag, tone: "warning", explanation: "This appears to be a retail purchase." },
  entertainment: { label: "Entertainment", icon: Clapperboard, tone: "info", explanation: "This appears to be an entertainment purchase." },
  subscriptions: { label: "Subscriptions", icon: Repeat, tone: "neutral", explanation: "This appears to be a recurring subscription charge." },
  bills: { label: "Bills & Utilities", icon: Droplet, tone: "info", explanation: "This appears to be a utility bill payment." },
  income: { label: "Income", icon: ArrowDownToLine, tone: "success", explanation: "This appears to be an incoming payment." },
  transfer: { label: "Transfer", icon: ArrowLeftRight, tone: "neutral", explanation: "This appears to be an account transfer." },
  other: { label: "Other", icon: Ellipsis, tone: "neutral", explanation: "This appears to be a miscellaneous charge." },
};

export function getCategoryVisual(category: TransactionCategory): CategoryVisual {
  return CATEGORY_VISUALS[category];
}

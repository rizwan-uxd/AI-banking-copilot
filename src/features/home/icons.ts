import {
  ArrowUp,
  Banknote,
  ChartLine,
  Lightbulb,
  MessageSquare,
  type LucideIcon,
} from "lucide-react-native";

import type { ConversationIcon, InsightIcon } from "@/types";

export const insightIcons: Record<InsightIcon, LucideIcon> = {
  "trend-up": ArrowUp,
  banknote: Banknote,
  lightbulb: Lightbulb,
};

export const conversationIcons: Record<ConversationIcon, LucideIcon> = {
  message: MessageSquare,
  chart: ChartLine,
};

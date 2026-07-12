import type { Insight } from "@/types";

import insightsSeed from "./insights.json";

const insights: Insight[] = insightsSeed as Insight[];

export function getInsights(): Insight[] {
  return insights;
}

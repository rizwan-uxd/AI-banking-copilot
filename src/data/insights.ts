import type { Insight } from "@/types";

import insightsSeed from "./insights.json";
import { reanchorToToday } from "./demo-clock";

const insights: Insight[] = insightsSeed as Insight[];

export function getInsights(): Insight[] {
  return reanchorToToday(insights);
}

import { router, useLocalSearchParams } from "expo-router";

import type { AnalysisScopeId, TimeRangeId } from "@/features/copilot/CopilotAnalyzeSpendingScreen";
import { SpendingInsightsScreen } from "@/features/copilot/SpendingInsightsScreen";

/**
 * Route for the copilot "analyze spending" chat → insights dashboard (Figma "2.4_see insighs",
 * Flow 2). "View recommendations" pushes "2.5_recommendations", Flow 2's final screen.
 */
export default function SpendingInsightsRoute() {
  const { scope, timeRange, customStart, customEnd } = useLocalSearchParams<{
    scope?: AnalysisScopeId;
    timeRange?: TimeRangeId;
    customStart?: string;
    customEnd?: string;
  }>();
  return (
    <SpendingInsightsScreen
      scope={scope}
      timeRange={timeRange}
      customRange={customStart && customEnd ? { startIso: customStart, endIso: customEnd } : undefined}
      onBack={() => router.back()}
      onViewRecommendations={() => router.push("/copilot-spending-recommendations")}
    />
  );
}

import { router, useLocalSearchParams } from "expo-router";

import { CopilotAnalyzeSpendingScreen } from "@/features/copilot/CopilotAnalyzeSpendingScreen";

/**
 * Route for Home "Analyze spending" chip → copilot chat (Figma "2.2_analyze spending" /
 * "2.3_select time", Flow 2). Choosing a time range pushes "2.4_see insighs" with the chosen
 * scope/time range as params, so that screen's totals refresh to match the selection.
 */
export default function CopilotAnalyzeSpendingRoute() {
  const { query } = useLocalSearchParams<{ query?: string }>();
  return (
    <CopilotAnalyzeSpendingScreen
      initialQuery={query}
      onBack={() => router.back()}
      onContinue={(scope, timeRange, customRange) =>
        router.push({
          pathname: "/copilot-spending-insights",
          params: {
            scope,
            timeRange,
            ...(customRange ? { customStart: customRange.startIso, customEnd: customRange.endIso } : null),
          },
        })
      }
    />
  );
}

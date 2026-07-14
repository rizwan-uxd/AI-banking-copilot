import { router, useLocalSearchParams } from "expo-router";

import { CopilotSearchResultScreen } from "@/features/copilot/CopilotSearchResultScreen";

/**
 * Route for Home search → copilot chat (Figma "1.2_search result" / "1.3_search result
 * conversations", Flow 1). Wired 2026-07-13 for interactive verification in the simulator — the
 * search box always lands here since it's the only scripted scenario built so far (see
 * CopilotSearchResultScreen doc comment). "Create ticket" pushes the 1.5 success screen as a
 * separate route (per updated direction — 1.4's inline confirmation was dropped).
 */
export default function CopilotSearchResultRoute() {
  const { query, transactionId } = useLocalSearchParams<{ query?: string; transactionId?: string }>();
  return (
    <CopilotSearchResultScreen
      transactionId={transactionId}
      initialQuery={query}
      onBack={() => router.back()}
      onCreateTicket={(issueType, issueTypeLabel) =>
        router.push({
          pathname: "/copilot-dispute-success",
          params: { issueType, issueTypeLabel, transactionId },
        })
      }
    />
  );
}

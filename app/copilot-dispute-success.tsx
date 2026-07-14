import { router, useLocalSearchParams } from "expo-router";

import { CopilotDisputeSuccessScreen } from "@/features/copilot/CopilotDisputeSuccessScreen";

/** Scripted ticket ID for the DEWA dispute scenario (Figma "1.5_success screen", node 360:1975). */
const TICKET_ID = "INC-10421";

/**
 * Route for the copilot dispute success screen (Figma "1.5_success screen", Flow 1 — pushed from
 * `copilot-search-result` when "Create ticket" is tapped).
 */
export default function CopilotDisputeSuccessRoute() {
  const { issueTypeLabel, transactionId } = useLocalSearchParams<{
    issueType?: string;
    issueTypeLabel?: string;
    transactionId?: string;
  }>();
  return (
    <CopilotDisputeSuccessScreen
      transactionId={transactionId ?? "txn_0291235"}
      issueTypeLabel={issueTypeLabel ?? "Unauthorized transaction"}
      ticketId={TICKET_ID}
      onBack={() => router.back()}
      onBackToHome={() => router.push("/")}
    />
  );
}

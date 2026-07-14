import { router } from "expo-router";

import { EligibilityCheckScreen } from "@/features/products/EligibilityCheckScreen";

/**
 * Route for the offering-detail "Check eligibility" action → simulated check (Figma
 * "3.4_analyze spending", Flow 3). Completing the check replaces this route with "3.5_success" —
 * `replace`, not `push`, so the back button on the success screen skips past the (now-finished)
 * analyzing screen straight to the offering detail.
 */
export default function EligibilityCheckRoute() {
  return (
    <EligibilityCheckScreen
      onBack={() => router.back()}
      onComplete={() => router.replace("/eligibility-success")}
    />
  );
}

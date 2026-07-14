import { router } from "expo-router";

import { EligibilitySuccessScreen } from "@/features/products/EligibilitySuccessScreen";

/**
 * Route for the eligibility-check completion → pre-qualification success (Figma "3.5_success",
 * Flow 3's final screen). No further screen is designed for "Continue application" in Figma, so
 * it's left unwired for now.
 */
export default function EligibilitySuccessRoute() {
  return <EligibilitySuccessScreen onBack={() => router.back()} />;
}

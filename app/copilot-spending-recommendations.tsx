import { router } from "expo-router";

import { SpendingRecommendationsScreen } from "@/features/copilot/SpendingRecommendationsScreen";

/**
 * Route for the copilot insights → recommendations screen (Figma "2.5_recommendations", Flow 2's
 * final screen). "Back to home" dismisses the whole pushed flow back to the tab root in one step
 * (`dismissTo`), rather than a plain `back()` that would just pop to the insights screen.
 */
export default function SpendingRecommendationsRoute() {
  return (
    <SpendingRecommendationsScreen
      onBack={() => router.back()}
      onBackToHome={() => router.dismissTo("/(tabs)")}
    />
  );
}

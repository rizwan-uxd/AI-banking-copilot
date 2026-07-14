import { router } from "expo-router";

import { OfferingDetailScreen } from "@/features/products/OfferingDetailScreen";

/**
 * Route for the product recommendations list → offering detail (Figma "3.3_offering details",
 * Flow 3). "Check eligibility" pushes "3.4_analyze spending" (the simulated eligibility check).
 */
export default function OfferingDetailRoute() {
  return (
    <OfferingDetailScreen
      onBack={() => router.back()}
      onCheckEligibility={() => router.push("/eligibility-check")}
    />
  );
}

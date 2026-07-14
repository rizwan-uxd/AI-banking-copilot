import { router } from "expo-router";

import { ProductRecommendationsScreen } from "@/features/products/ProductRecommendationsScreen";

/**
 * Route for Home "Find best products" chip → product recommendations (Figma "3.2_analyze
 * spending", Flow 3). "View details" pushes "3.3_offering details".
 */
export default function ProductRecommendationsRoute() {
  return (
    <ProductRecommendationsScreen
      onBack={() => router.back()}
      onViewDetails={() => router.push("/offering-detail")}
    />
  );
}

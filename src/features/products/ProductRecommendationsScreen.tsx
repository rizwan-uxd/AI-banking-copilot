import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { ScrollView, View } from "react-native";

import { Badge, Card } from "@atlas/ui-native";

import { CardArt } from "@/components/banking/CardArt";
import { DetailRow } from "@/components/banking/DetailRow";
import { AppHeader, BadgeLabel, Divider, Icon, PressableScale, Screen, Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";
import { getAlternativeProducts, getFeaturedProduct } from "@/data/products";
import { formatCurrency } from "@/lib/currency";

type ProductTab = "best_match" | "alternative" | "current_card";

const TABS: { id: ProductTab; label: string }[] = [
  { id: "best_match", label: "Best match" },
  { id: "alternative", label: "Alternative" },
  { id: "current_card", label: "Current card" },
];

export interface ProductRecommendationsScreenProps {
  onBack?: () => void;
  /** Fires when "View details" is tapped on the featured card, with its product id. */
  onViewDetails?: (productId: string) => void;
}

/**
 * Copilot "Find best products" recommendations list (Figma node 295:2531 "3.2_analyze spending" —
 * named for Flow 2's frames by copy-paste, but the actual content is entirely product/offer
 * recommendations; Flow 3: Analyze spending & offering). Reached from Home's "Find best products"
 * chip, not the search bar — this isn't a chat-continuation screen like Flows 1/2, it's a real
 * results screen from the first tap.
 *
 * The "Best match / Alternative / Current card" tab bar only has real content for "Best match" —
 * Figma shows no design for the other two tabs' content, so they render as inert labels (selected
 * state fixed on "Best match") rather than switching to placeholder data, same convention as other
 * no-destination-in-Figma elements throughout the app (`ListRow`, `RecommendationCard`).
 */
export function ProductRecommendationsScreen({ onBack, onViewDetails }: ProductRecommendationsScreenProps) {
  const { colors } = useAppTheme();
  const product = getFeaturedProduct();
  const alternatives = getAlternativeProducts();

  return (
    <Screen edges={["bottom"]}>
      <AppHeader
        title="Product recommendations"
        leftAction={
          <PressableScale onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon icon={ChevronLeft} color="onAccent" />
          </PressableScale>
        }
      />
      <ScrollView className="flex-1 bg-surface-muted" contentContainerClassName="gap-4 px-5 py-4">
        <View className="gap-2">
          <Text variant="heading" className="font-sans-bold">
            Top recommendations for you
          </Text>
          <Text variant="caption" color="secondary">
            Ranked by what benefits you most based on your spends
          </Text>
        </View>

        <View className="flex-row rounded-xl bg-surface p-1 shadow-sm" style={{ gap: 4 }}>
          {TABS.map((tab) => {
            const selected = tab.id === "best_match";
            return (
              <View
                key={tab.id}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                className="flex-1 items-center justify-center rounded-lg py-2.5"
                style={{ backgroundColor: selected ? colors.accentMuted : "transparent" }}
              >
                <Text
                  variant="caption"
                  className="font-sans-semibold"
                  style={{ color: selected ? colors.accent : colors.textSecondary }}
                >
                  {tab.label}
                </Text>
              </View>
            );
          })}
        </View>

        <Card variant="elevated" padding="md">
          <View style={{ gap: 14 }}>
            <View className="flex-row items-start gap-3">
              <CardArt network={product.network} />
              <View className="flex-1 gap-1.5">
                <Text variant="body" className="font-sans-bold">
                  {product.name}
                </Text>
                <Badge variant="success">
                  <BadgeLabel>{product.matchLabel}</BadgeLabel>
                </Badge>
              </View>
            </View>
            <Divider />
            <View style={{ gap: 12 }}>
              <DetailRow label="Annual fee" value={formatCurrency(product.annualFeeCents, "AED")} showDivider={false} />
              <DetailRow label="Est. yearly value" value={formatCurrency(product.estYearlyValueCents, "AED")} showDivider={false} />
              <DetailRow
                label="Net benefit / year"
                value={formatCurrency(product.netBenefitPerYearCents, "AED")}
                valueColor="positive"
                showDivider={false}
              />
              <DetailRow label="Skywards Miles" value={product.milesRate} showDivider={false} />
              <DetailRow label="Airport lounge access" value={product.airportLoungeAccess} showDivider={false} />
              <DetailRow label="FX fee" value={`${product.fxFeePercent}%`} showDivider={false} />
              <DetailRow label="Approval chance" value={product.approvalChanceLabel} showDivider={false} />
            </View>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="View details"
              onPress={() => onViewDetails?.(product.id)}
              style={{ height: 40, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy }}
            >
              <Text variant="body" className="font-sans-medium" style={{ color: colors.onAccent }}>
                View details
              </Text>
            </PressableScale>
          </View>
        </Card>

        <View style={{ gap: 8 }}>
          {alternatives.map((alternative) => (
            <View
              key={alternative.id}
              className="flex-row items-center justify-between rounded-2xl bg-surface px-3.5 py-3 shadow-sm"
            >
              <Text variant="caption" className="flex-1 font-sans-semibold">
                {alternative.name}
              </Text>
              <View className="flex-row items-center gap-2">
                <View className="items-end">
                  <Text variant="caption" color="muted" className="text-[9.5px]">
                    Net benefit / year
                  </Text>
                  <Text variant="caption" className="font-sans-semibold">
                    {formatCurrency(alternative.netBenefitPerYearCents, "AED")}
                  </Text>
                </View>
                <Icon icon={ChevronRight} size={20} color="muted" />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

export default ProductRecommendationsScreen;

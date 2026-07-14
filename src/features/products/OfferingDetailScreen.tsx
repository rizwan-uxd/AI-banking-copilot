import {
  Armchair,
  Bookmark,
  ChevronLeft,
  Eye,
  FileText,
  Lock,
  MessageCircle,
  Plane,
  Scale,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { ScrollView, View } from "react-native";

import { Badge } from "@atlas/ui-native";

import { QuickActionChip } from "@/components/banking/QuickActionChip";
import { AppHeader, BadgeLabel, Icon, PressableScale, Screen, Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";
import { getFeaturedProduct } from "@/data/products";
import type { ReasonIcon } from "@/types";
import { AnimatedCounter } from "@/features/products/components/AnimatedCounter";
import { ChecklistRow } from "@/features/products/components/ChecklistRow";
import { GlassCard } from "@/features/products/components/GlassCard";
import { OfferingBackground } from "@/features/products/components/OfferingBackground";
import { PremiumCardStack } from "@/features/products/components/PremiumCardStack";

export interface OfferingDetailScreenProps {
  onBack?: () => void;
  /** Fires when "Check eligibility" is tapped. Screen doesn't navigate itself — the caller owns it. */
  onCheckEligibility?: () => void;
}

const REASON_ICONS: Record<ReasonIcon, LucideIcon> = {
  flight: Plane,
  lounge: Armchair,
  wallet: Wallet,
};

/** Splits "42,600 Skyward miles" into ["42,600", "Skyward miles"] for the two-line reward display. */
function splitRewardsLabel(label: string): [string, string] {
  const match = label.match(/^([\d,]+)\s+(.*)$/);
  return match ? [match[1], match[2]] : [label, ""];
}

/** Splits "Emirates Skywards Infinite" into ["Emirates", "Skywards Infinite"] for the card face. */
function splitBrandName(shortName: string): [string, string] {
  const [brand, ...rest] = shortName.split(" ");
  return [brand, rest.join(" ")];
}

/** Coarse confidence label from the percent — matches the reference's "Very High" pill. */
function getConfidenceLabel(percent: number): string {
  if (percent >= 85) return "Very High";
  if (percent >= 70) return "High";
  if (percent >= 50) return "Medium";
  return "Low";
}

/**
 * Copilot product offering-detail screen (Figma node 333:2107 "3.3_offering details" — Flow 3:
 * Analyze spending & offering, since heavily restyled per the user's reference mockups). Unlike
 * every other card in the app (flat `Card variant="elevated"` on a solid background), this screen
 * uses frosted-glass cards (`GlassCard`) over a hand-rolled gradient background — per the user,
 * worth the extra visual investment for this one screen rather than flattening it to match the
 * rest of the app.
 *
 * The card art (`PremiumCardStack`) is a stylized illustration, not Figma's/the reference's
 * photographic card image or its airline logo mark — no real card artwork is seeded anywhere in
 * the app, and the winged glyph is a generic `Plane` icon rather than a reproduction of any real
 * airline's trademarked logo.
 */
export function OfferingDetailScreen({ onBack, onCheckEligibility }: OfferingDetailScreenProps) {
  const { colors } = useAppTheme();
  const product = getFeaturedProduct();
  const [rewardsAmount, rewardsUnit] = splitRewardsLabel(product.estimatedYearlyRewardsLabel);
  const [brand, cardName] = splitBrandName(product.shortName);

  return (
    <Screen edges={["bottom"]} style={{ backgroundColor: "transparent" }}>
      <OfferingBackground />
      <AppHeader
        title={product.shortName}
        leftAction={
          <PressableScale onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon icon={ChevronLeft} color="onAccent" />
          </PressableScale>
        }
      />
      <ScrollView style={{ backgroundColor: "transparent" }} contentContainerClassName="gap-4 px-5 py-4">
        <GlassCard tintOpacity={0.85}>
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1" style={{ minWidth: 0 }}>
              <Text variant="caption" className="text-[11px]" color="muted">
                Estimated yearly rewards
              </Text>
              <Text className="font-sans-bold text-[32px] leading-9" style={{ color: colors.textPrimary }}>
                {rewardsAmount}
              </Text>
              <Text variant="heading" className="font-sans-bold" numberOfLines={2}>
                {rewardsUnit}
              </Text>
              <View className="mt-1 flex-row items-center gap-1.5">
                <Icon icon={ShieldCheck} size={16} color="accent" />
                <Text variant="caption" color="secondary">
                  Won&apos;t affect your credit score
                </Text>
              </View>

              <View className="mt-3 border-t border-border opacity-40" />

              <View className="mt-3 gap-2">
                <Text variant="body" className="font-sans-bold">
                  AI confidence
                </Text>
                <View className="flex-row items-center gap-2">
                  <AnimatedCounter
                    value={product.aiConfidencePercent}
                    suffix="%"
                    className="font-sans-bold text-[28px] leading-8"
                    color="positive"
                  />
                  <Badge variant="success">
                    <BadgeLabel>{getConfidenceLabel(product.aiConfidencePercent)}</BadgeLabel>
                  </Badge>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Icon icon={Sparkles} size={14} color="positive" />
                  <Text variant="caption" color="secondary" className="flex-1">
                    Based on your spending, travel &amp; lifestyle patterns
                  </Text>
                </View>
              </View>
            </View>
            <PremiumCardStack brand={brand} cardName={cardName} network={product.network} networkTier="infinite" />
          </View>
        </GlassCard>

        <GlassCard tintOpacity={0.3}>
          <View className="gap-1">
            <Text variant="body" className="font-sans-semibold">
              Here&apos;s why it fits you
            </Text>
            <View>
              {product.reasons.map((reason, index) => (
                <ChecklistRow
                  key={reason.text}
                  icon={REASON_ICONS[reason.icon]}
                  text={reason.text}
                  showDivider={index < product.reasons.length - 1}
                />
              ))}
            </View>
          </View>
        </GlassCard>

        <View className="gap-2">
          <Text variant="body" className="font-sans-bold px-1">
            What would you like to do next?
          </Text>

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Check eligibility. Soft credit check, no impact on your credit score."
            onPress={onCheckEligibility}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: 14,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <View
              className="items-center justify-center rounded-full"
              style={{ width: 40, height: 40, backgroundColor: colors.surfaceMuted }}
            >
              <Icon icon={FileText} size={18} color="primary" />
            </View>
            <View className="flex-1 gap-0.5">
              <Text variant="body" className="font-sans-bold">
                Check eligibility
              </Text>
              <Text variant="caption" color="secondary">
                Soft credit check • No impact on your credit score
              </Text>
            </View>
          </PressableScale>

          <View className="gap-2">
            <View className="flex-row gap-[17px]">
              <QuickActionChip
                layout="inline"
                icon={<Icon icon={Eye} size={16} color="navy" />}
                label="See reward simulation"
              />
              <QuickActionChip
                layout="inline"
                icon={<Icon icon={Scale} size={16} color="navy" />}
                label="Compare with my cards"
              />
            </View>
            <View className="flex-row gap-[17px]">
              <QuickActionChip
                layout="inline"
                icon={<Icon icon={MessageCircle} size={16} color="navy" />}
                label="Talk to our AI advisor"
              />
              <QuickActionChip
                layout="inline"
                icon={<Icon icon={Bookmark} size={16} color="navy" />}
                label="Save this card"
              />
            </View>
          </View>

          <View className="mt-1 flex-row items-center justify-center gap-1.5">
            <Icon icon={Lock} size={12} color="muted" />
            <Text variant="caption" color="muted">
              Secure • Private • Won&apos;t affect your credit score
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

export default OfferingDetailScreen;

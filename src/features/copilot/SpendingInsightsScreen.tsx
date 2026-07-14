import { ArrowDown, ArrowUp, ChevronLeft } from "lucide-react-native";
import { ScrollView, View } from "react-native";

import { Card } from "@atlas/ui-native";

import { CategoryDonutChart, type CategoryDonutSegment } from "@/components/banking/CategoryDonutChart";
import { ListRow } from "@/components/banking/ListRow";
import { SectionHeader } from "@/components/banking/SectionHeader";
import { AppHeader, Icon, PressableScale, Screen, Text } from "@/components/ui";
import type { AnalysisScopeId, CustomDateRange, TimeRangeId } from "@/features/copilot/CopilotAnalyzeSpendingScreen";
import { getAccounts } from "@/data/accounts";
import { getInsights } from "@/data/insights";
import { useAppTheme } from "@/design-system";
import { formatCurrency } from "@/lib/currency";
import { addDays, formatDateRangeLabel, formatShortDate, todayIsoDate } from "@/lib/date";
import { getCategoryVisual } from "@/lib/category";
import { getScriptedLastThreeMonthsSummary, getSpendingSummary } from "@/lib/spending";
import { insightIcons } from "@/features/home/icons";

const LAST_MONTH_DAYS = 30;

/** Decorative chart palette, ordered darkest → lightest (Figma "Top Categories Card", node 279:2077). Not a semantic token — chart-segment colors carry no positive/negative/warning meaning. */
const CHART_PALETTE = ["#0a1d48", "#2350be", "#7c3aed", "#60a5fa", "#9aa3ad", "#c7ccd4"];

/** Categories beyond this rank are folded into a single "Others" slice, matching Figma's 6-slice cap. */
const MAX_CATEGORY_SLICES = 5;

function resolveAccountIds(scope: AnalysisScopeId): string[] {
  const accounts = getAccounts();
  if (scope === "primary") return accounts.filter((account) => account.id === "acc_checking_primary").map((a) => a.id);
  if (scope === "credit_card") return accounts.filter((account) => account.id === "acc_credit_primary").map((a) => a.id);
  // "all" and "custom" (account scope — a different picker from the time-range "custom") both
  // analyze every account, deterministically.
  return accounts.map((account) => account.id);
}

export interface SpendingInsightsScreenProps {
  scope?: AnalysisScopeId;
  timeRange?: TimeRangeId;
  /** Required when `timeRange` is "custom" — the range chosen in `CustomDateRangeSheet`. */
  customRange?: CustomDateRange;
  onBack?: () => void;
  /** "2.5_recommendations" isn't built yet, so this is left unwired by the caller for now. */
  onViewRecommendations?: () => void;
}

/**
 * Copilot "see insights" results screen (Figma node 279:1166 "2.4_see insighs" — Flow 2: Spending
 * analysis & insights). Unlike `CopilotAnalyzeSpendingScreen`'s chat bubbles, this is a real
 * dashboard, not another chat turn, matching Figma. "Last month" and "Custom" are real aggregations
 * over the seeded transactions (`lib/spending.ts`), filtered by `scope`/the chosen dates —
 * reselecting a different pill/range on the previous screen re-renders this screen with fresh
 * totals. "Last 3 months" uses `getScriptedLastThreeMonthsSummary` instead: the seed data only
 * spans ~93 days, not enough for a genuine 90-day comparison, so per the user that pill shows
 * scripted (Figma-sourced) numbers rather than a real-but-meaningless aggregation.
 */
export function SpendingInsightsScreen({
  scope = "all",
  timeRange = "last_month",
  customRange,
  onBack,
  onViewRecommendations,
}: SpendingInsightsScreenProps) {
  const { colors } = useAppTheme();
  const insights = getInsights();

  const accountIds = resolveAccountIds(scope);
  const endIso = todayIsoDate();

  const summary =
    timeRange === "last_3_months"
      ? getScriptedLastThreeMonthsSummary(endIso)
      : getSpendingSummary(
          accountIds,
          timeRange === "custom" && customRange ? customRange.startIso : addDays(endIso, -(LAST_MONTH_DAYS - 1)),
          timeRange === "custom" && customRange ? customRange.endIso : endIso,
        );
  const currency = getAccounts()[0]?.currency ?? "AED";

  const topCategories = summary.categories.slice(0, MAX_CATEGORY_SLICES);
  const otherCategoriesCents = summary.categories
    .slice(MAX_CATEGORY_SLICES)
    .reduce((sum, category) => sum + category.totalCents, 0);
  const otherPercent = summary.totalCents === 0 ? 0 : Math.round((otherCategoriesCents / summary.totalCents) * 100);

  const legend: { id: string; label: string; percent: number }[] = [
    ...topCategories.map((category) => ({
      id: category.category,
      label: getCategoryVisual(category.category).label,
      percent: category.percent,
    })),
    ...(otherPercent > 0 ? [{ id: "other-bucket", label: "Others", percent: otherPercent }] : []),
  ];
  const chartSegments: CategoryDonutSegment[] = legend.map((entry, index) => ({
    id: entry.id,
    percent: entry.percent,
    color: CHART_PALETTE[index] ?? CHART_PALETTE[CHART_PALETTE.length - 1],
  }));

  const isIncrease = summary.changePercent >= 0;

  return (
    <Screen edges={["bottom"]}>
      <AppHeader
        title="Analyze spending"
        leftAction={
          <PressableScale onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon icon={ChevronLeft} color="onAccent" />
          </PressableScale>
        }
      />
      <ScrollView className="flex-1 bg-surface-muted" contentContainerClassName="gap-4 px-5 py-4">
        <View
          className="self-start rounded-full px-4 py-3"
          style={{ backgroundColor: colors.accent }}
        >
          <Text variant="body" className="font-sans-medium" style={{ color: colors.onAccent }}>
            {formatDateRangeLabel(summary.startIso, summary.endIso)}
          </Text>
        </View>

        <Card variant="elevated" padding="md">
          <View style={{ gap: 8 }}>
            <Text variant="caption" color="muted">
              Total spent
            </Text>
            <Text variant="heading" className="font-sans-semibold">
              {formatCurrency(summary.totalCents, currency)}
            </Text>
            {summary.hasPriorPeriodData ? (
              <View className="flex-row items-center gap-1.5">
                <Icon icon={isIncrease ? ArrowUp : ArrowDown} size={16} color={isIncrease ? "negative" : "positive"} />
                <Text variant="body" className="font-sans-semibold" color={isIncrease ? "negative" : "positive"}>
                  {Math.abs(summary.changePercent)}%
                </Text>
                <Text variant="caption" color="muted">
                  vs {formatDateRangeLabel(summary.previousStartIso, summary.previousEndIso)}
                </Text>
              </View>
            ) : (
              <Text variant="caption" color="muted">
                Not enough history yet to compare
              </Text>
            )}
          </View>
        </Card>

        <View className="gap-2">
          <SectionHeader title="Top categories" actionLabel="View all" />
          <Card variant="elevated" padding="md">
            <View className="flex-row items-center gap-4">
              <CategoryDonutChart segments={chartSegments} />
              <View className="flex-1 gap-2">
                {legend.map((entry, index) => (
                  <View key={entry.id} className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1.5">
                      <View
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: chartSegments[index]?.color }}
                      />
                      <Text variant="caption" color="primary">
                        {entry.label}
                      </Text>
                    </View>
                    <Text variant="caption" className="font-sans-semibold" color="primary">
                      {entry.percent}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        </View>

        <View className="gap-2">
          <SectionHeader title="Proactive insights" actionLabel={`View all(${insights.length})`} />
          <View className="gap-2">
            {insights.map((insight) => (
              <ListRow
                key={insight.id}
                icon={insightIcons[insight.icon]}
                title={insight.title}
                subtitle={insight.subtitle}
                date={formatShortDate(insight.date)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <View className="border-t border-border bg-surface px-5 pb-2 pt-4">
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="View recommendations"
          onPress={onViewRecommendations}
          style={{ height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy }}
        >
          <Text variant="body" className="font-sans-medium" style={{ color: colors.onAccent }}>
            View recommendations
          </Text>
        </PressableScale>
      </View>
    </Screen>
  );
}

export default SpendingInsightsScreen;

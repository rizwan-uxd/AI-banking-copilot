import { useRef } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, Search } from "lucide-react-native";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

import { Header } from "@atlas/ui-native";

import { QuickActionChip } from "@/components/banking/QuickActionChip";
import { Icon, Screen, Text } from "@/components/ui";
import { getAccountById } from "@/data/accounts";
import { getConversations, getInsights } from "@/data";
import { getMerchantById } from "@/data/merchants";
import { fontFamily } from "@/design-system";
import { formatDayMonth, formatShortDate } from "@/lib/date";
import type { Transaction } from "@/types";

import { ListRow } from "@/components/banking/ListRow";
import { SectionHeader } from "@/components/banking/SectionHeader";

import { ExplainTransactionSheet } from "./components/ExplainTransactionSheet";
import { HeroBanner } from "./components/HeroBanner";
import {
  CreditCardFilledIcon,
  MessageSquareMoreFilledIcon,
  TriangleAlertFilledIcon,
} from "./components/QuickActionIcons";
import { SearchBar } from "./components/SearchBar";
import { conversationIcons, insightIcons } from "./icons";

/** Atlas Header's fixed content-row height (below the safe-area inset). */
const HEADER_CONTENT_HEIGHT = 56;

/**
 * Home screen (Figma `LGV5xzUyUxDEReq6FY4zn7`, node 224:1496 "1_Home").
 * Sprint 1 scope — see roadmap.md Phase 2.
 */
export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const insights = getInsights();
  const conversations = getConversations();
  const explainSheetRef = useRef<BottomSheetModal>(null);

  function handleSelectTransaction(transaction: Transaction) {
    explainSheetRef.current?.dismiss();
    const merchant = getMerchantById(transaction.merchantId);
    const account = getAccountById(transaction.accountId);
    if (!merchant || !account) return;
    const amount = (Math.abs(transaction.amountCents) / 100).toFixed(0);
    router.push({
      pathname: "/copilot-search-result",
      params: {
        transactionId: transaction.id,
        query: `Why was ${account.currency} ${amount} charged by ${merchant.name} on ${formatDayMonth(transaction.date)}?`,
      },
    });
  }

  return (
    // Matches HeroBanner's gradient top stop so scroll-bounce overscroll
    // reveals the hero's own dark color instead of the default white Screen bg.
    <Screen edges={[]} style={{ backgroundColor: "#05060d" }}>
      <Header
        variant="transparent"
        title="AI banking copilot"
        // White to match Figma's back-chevron stroke (#F8F8F8) and the
        // adjacent white header title — both sit on the dark hero image.
        leftAction={<Icon icon={ChevronLeft} size={24} color="onAccent" strokeWidth={2} />}
        // Atlas ships no fontFamily (ADR-011) — Header's title would otherwise render in the OS
        // system font instead of Geist.
        titleStyle={{ fontFamily: fontFamily.semibold }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeroBanner>
          <View
            style={{ paddingTop: insets.top + HEADER_CONTENT_HEIGHT }}
            className="gap-6"
          >
            <View className="gap-4 px-6">
              <Text
                variant="title"
                style={{ fontFamily: fontFamily.light, fontSize: 32, lineHeight: 38, color: "#ffffff" }}
              >
                Good morning, Ali
              </Text>
              <Text variant="body" style={{ color: "rgba(255,255,255,0.6)" }}>
                Your banking assistant, powered by context.
              </Text>
            </View>

            <View className="px-5">
              <SearchBar
                onSubmit={(query) => router.push({ pathname: "/copilot-search-result", params: { query } })}
              />
            </View>

            {/* Invisible spacer container — the only source of the gap
                between the quick-action chips and the card below. */}
            <View className="pb-6">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2 px-4"
              >
                <QuickActionChip
                  icon={<MessageSquareMoreFilledIcon size={16} />}
                  label={"Explain\ntransactions"}
                  onPress={() => explainSheetRef.current?.present()}
                />
                <QuickActionChip
                  icon={<Icon icon={Search} size={16} color="navy" />}
                  label={"Analyze\nspending"}
                  onPress={() =>
                    router.push({
                      pathname: "/copilot-analyze-spending",
                      params: { query: "I want to analyze my spending." },
                    })
                  }
                />
                <QuickActionChip
                  icon={<CreditCardFilledIcon size={16} />}
                  label={"Find best\nproducts"}
                  onPress={() => router.push("/product-recommendations")}
                />
                <QuickActionChip icon={<TriangleAlertFilledIcon size={16} />} label={"Report an\nissue"} />
              </ScrollView>
            </View>
          </View>
        </HeroBanner>

        <View
          className="gap-6 rounded-t-xl bg-surface-muted px-4 pt-6"
          style={{ paddingBottom: insets.bottom + 32 }}
        >
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

          <View className="gap-2">
            <SectionHeader title="Recent conversations" actionLabel="View all" />
            <View className="gap-2">
              {conversations.map((conversation) => (
                <ListRow
                  key={conversation.id}
                  icon={conversationIcons[conversation.icon]}
                  title={conversation.title}
                  subtitle={conversation.subtitle}
                  date={formatShortDate(conversation.date)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <ExplainTransactionSheet
        ref={explainSheetRef}
        onSelectTransaction={handleSelectTransaction}
        onViewAll={() => {
          explainSheetRef.current?.dismiss();
          router.push("/transactions");
        }}
      />
    </Screen>
  );
}

export default HomeScreen;

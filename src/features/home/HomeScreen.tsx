import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, CreditCard, MessageSquareMore, Search, TriangleAlert } from "lucide-react-native";

import { Header } from "@atlas/ui-native";

import { Icon, Screen, Text } from "@/components/ui";
import { getConversations, getInsights } from "@/data";
import { fontFamily } from "@/design-system";
import { formatShortDate } from "@/lib/date";

import { HeroBanner } from "./components/HeroBanner";
import { ListRow } from "./components/ListRow";
import { QuickActionChip } from "./components/QuickActionChip";
import { SearchBar } from "./components/SearchBar";
import { SectionHeader } from "./components/SectionHeader";
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

  return (
    // Matches HeroBanner's gradient top stop so scroll-bounce overscroll
    // reveals the hero's own dark color instead of the default white Screen bg.
    <Screen edges={["bottom"]} style={{ backgroundColor: "#05060d" }}>
      <Header
        variant="transparent"
        title="AI banking copilot"
        // White to match Figma's back-chevron stroke (#F8F8F8) and the
        // adjacent white header title — both sit on the dark hero image.
        leftAction={<Icon icon={ChevronLeft} size={24} color="onAccent" strokeWidth={2} />}
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
              <SearchBar />
            </View>

            {/* Invisible spacer container — the only source of the gap
                between the quick-action chips and the card below. */}
            <View className="pb-6">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2 px-4"
              >
                <QuickActionChip icon={MessageSquareMore} label={"Explain\ntransactions"} />
                <QuickActionChip icon={Search} label={"Analyze\nspending"} />
                <QuickActionChip icon={CreditCard} label={"Find best\nproducts"} />
                <QuickActionChip icon={TriangleAlert} label={"Report an\nissue"} />
              </ScrollView>
            </View>
          </View>
        </HeroBanner>

        <View className="gap-6 rounded-t-2xl bg-surface-muted px-4 pt-6 pb-8">
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
    </Screen>
  );
}

export default HomeScreen;

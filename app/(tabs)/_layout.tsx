import { Home, Receipt, Sparkles, User, type LucideIcon } from "lucide-react-native";
import { Slot, usePathname, useRouter, type Href } from "expo-router";
import { View } from "react-native";

import { TabBar, type TabItem } from "@atlas/ui-native";

interface TabDef {
  key: string;
  label: string;
  href: Href;
  icon: LucideIcon;
}

const TABS: TabDef[] = [
  { key: "home", label: "Home", href: "/", icon: Home },
  { key: "transactions", label: "Transactions", href: "/transactions", icon: Receipt },
  { key: "copilot", label: "Copilot", href: "/copilot", icon: Sparkles },
  { key: "profile", label: "Profile", href: "/profile", icon: User },
];

/**
 * Navigation shell (Sprint 0) — a custom Slot-based tab layout driving
 * Atlas's `TabBar`. Expo Router's `Tabs` navigator wraps
 * `@react-navigation/bottom-tabs`, which isn't an installed dependency; this
 * avoids adding one just to host a presentational TabBar we already have.
 * Child routes are placeholders only — real screens land per the roadmap.
 */
export default function TabsLayout() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs: TabItem[] = TABS.map(({ key, label, href, icon: TabIcon }) => ({
    key,
    label,
    icon: ({ color, size }) => <TabIcon color={color} size={size} />,
    active: pathname === href,
    onPress: () => router.replace(href),
  }));

  const isHome = pathname === "/";

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1">
        <Slot />
      </View>
      {!isHome && <TabBar tabs={tabs} />}
    </View>
  );
}

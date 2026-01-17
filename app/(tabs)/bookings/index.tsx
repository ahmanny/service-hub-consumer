import PastBookings from "@/components/MyBookings/PastBookings";
import PendingBookings from "@/components/MyBookings/PendingBookings";
import UpcomingBookings from "@/components/MyBookings/UpcomingBookings";
import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type BookingTab = "pending" | "upcoming" | "past";

export default function BookingListScreen() {
  const params = useLocalSearchParams<{ tab: string }>();

  const tabs: BookingTab[] = ["past", "pending", "upcoming"];
  const initialIndex = tabs.indexOf((params.tab as BookingTab) || "upcoming");
  const [activeTab, setActiveTab] = useState<BookingTab>(
    (params.tab as BookingTab) || "upcoming"
  );

  const pagerRef = useRef<PagerView>(null);

  const backgroundColor = useThemeColor({}, "background");

  const onTabPress = (tab: BookingTab, index: number) => {
    setActiveTab(tab);
    pagerRef.current?.setPage(index);
  };

  const onPageSelected = (e: { nativeEvent: { position: number } }) => {
    const newTab = tabs[e.nativeEvent.position];
    setActiveTab(newTab);
  };
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{ flex: 1, backgroundColor, paddingHorizontal: 8 }}
    >
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => onTabPress(tab, index)}
          >
            <ThemedText
              style={
                activeTab === tab ? styles.activeTabText : { fontWeight: "700" }
              }
            >
              {tab}
            </ThemedText>
          </Pressable>
        ))}
        {/* past tab */}
        {/* <Pressable
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => setActiveTab("past")}
        >
          <ThemedText
            style={
              activeTab === "past"
                ? styles.activeTabText
                : { fontWeight: "700" }
            }
          >
            Past
          </ThemedText>
        </Pressable> */}
        {/* pending tab */}
        {/* <Pressable
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => setActiveTab("pending")}
        >
          <ThemedText
            style={
              activeTab === "pending"
                ? styles.activeTabText
                : { fontWeight: "700" }
            }
          >
            Pending
          </ThemedText>
        </Pressable> */}
        {/* upcoming tab */}
        {/* <Pressable
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <ThemedText
            style={
              activeTab === "upcoming"
                ? styles.activeTabText
                : { fontWeight: "700" }
            }
          >
            Upcoming
          </ThemedText>
        </Pressable> */}
      </View>

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={initialIndex}
        onPageSelected={onPageSelected}
      >
        <Animated.View
          key="0"
          entering={SlideInLeft.duration(250)}
          exiting={SlideOutLeft.duration(200)}
          style={{ flex: 1 }}
        >
          <PastBookings />
        </Animated.View>

        <Animated.View
          key="1"
          entering={SlideInRight.duration(250)}
          exiting={SlideOutLeft.duration(200)}
          style={{ flex: 1 }}
        >
          <PendingBookings />
        </Animated.View>

        <Animated.View
          key="2"
          entering={SlideInRight.duration(250)}
          exiting={SlideOutLeft.duration(200)}
          style={{ flex: 1 }}
        >
          <UpcomingBookings />
        </Animated.View>
      </PagerView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.05)",
    marginVertical: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#0BB45E", // highlight color
  },
  activeTabText: {
    fontWeight: "700",
    color: "#0BB45E",
  },
});

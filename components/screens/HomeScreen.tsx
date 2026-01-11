import { useThemeColor } from "@/hooks/use-theme-color";
import { useGetProviders } from "@/hooks/useSearchProviders";
import { FALLBACK_LOCATION } from "@/providers/service.provider";
import { useAuthStore } from "@/stores/auth.store";
import {
  ProviderListItem,
  ProvidersDashboardData,
} from "@/types/provider.types";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabType } from "../home/CategoryTabs";
import { SearchModal } from "../home/SearchModal";
import SearchTrigger from "../home/SearchTrigger";
import CategoryResultsView from "../home/categories/CategoryResultsView";
import DiscoveryView from "../home/categories/DiscoveryView";

export default function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<TabType>("all");

  const userLocation = useAuthStore((state) => state.userLocation);

  const { data, isLoading, refetch, isRefetching } = useGetProviders(
    {
      serviceType: activeCategory,
      lat: userLocation ? userLocation[1] : FALLBACK_LOCATION[1],
      lng: userLocation ? userLocation[0] : FALLBACK_LOCATION[0],
    },
    !!location
  );

  const handleCategorySelect = (cat: TabType) => {
    setActiveCategory(cat);
    // Scroll to top when category changes so the new content is visible
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const bg = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");

  const handleOpenSearch = () => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchVisible(true);
  };

  const renderContent = () => {
    if (isLoading) return <ActivityIndicator style={{ marginTop: 20 }} />;
    if (!data) return null;

    if (activeCategory === "all") {
      return (
        <DiscoveryView
          data={data as ProvidersDashboardData}
          onCategoryChange={handleCategorySelect}
        />
      );
    }

    // Data is ProviderListItem[]
    return (
      <CategoryResultsView
        category={activeCategory}
        providers={data as ProviderListItem[]}
      />
    );
  };

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bg }]}
      edges={["top"]}
    >
      <View style={[styles.fixedHeader, { backgroundColor: bg }]}>
        <SearchTrigger onPress={handleOpenSearch} />
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        // stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={tint}
            colors={[tint]}
          />
        }
      >
        {/* <View style={{ backgroundColor: bg, paddingBottom: 8 }}>
          <CategoryTabs active={activeCategory} onSelect={setActiveCategory} />
        </View> */}
        {renderContent()}

        <View style={{ height: 60 }} />
      </ScrollView>

      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fixedHeader: { paddingTop: 8, paddingBottom: 12, zIndex: 10 },
});

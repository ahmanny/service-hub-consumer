import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Hooks & Store
import { useThemeColor } from "@/hooks/use-theme-color";
import { useGetProviders } from "@/hooks/useProviders";
import { FALLBACK_LOCATION } from "@/providers/service.provider";
import { useAuthStore } from "@/stores/auth.store";

// Components
import { ProvidersDashboardData } from "@/types/provider.types";
import DiscoveryView from "../../home/categories/DiscoveryView";
import { SearchModal } from "../../home/SearchModal";
import SearchTrigger from "../../home/SearchTrigger";
import ActiveBookingBanner from "./ActiveBookingBanner";
import LocationSelector from "./LocationSelector";
import QuickCategories from "./QuickCategories";

export default function HomeScreen() {
  const router = useRouter();
  const [searchVisible, setSearchVisible] = useState(false);
  const userLocation = useAuthStore((state) => state.userLocation);

  // THE DATA FETCHING
  // We only fetch "all" for the DiscoveryView on this screen
  const { data, isLoading, refetch, isRefetching } = useGetProviders(
    {
      serviceType: "all",
      lat: userLocation ? userLocation[1] : FALLBACK_LOCATION[1],
      lng: userLocation ? userLocation[0] : FALLBACK_LOCATION[0],
    },
    !!userLocation
  );

  const bg = useThemeColor({}, "background");

  // Premium Navigation: Tapping a category takes you to a dedicated Results Screen
  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: "/(tabs)/home/category-results",
      params: { type: category },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bg }]}
      edges={["top"]}
    >
      {/* 1. TOP UTILITY BAR */}
      <View style={styles.header}>
        <LocationSelector
          location="Lekki, Lagos"
          onPress={() => console.log("Open Location Picker")}
        />
        <SearchTrigger onPress={() => setSearchVisible(true)} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {/* 2. ACTIVE CONTEXT (Only if booking exists) */}
        {/* This is a hard-coded example; replace with real booking state later */}
        <ActiveBookingBanner
          providerName="Ahmed"
          providerImage="https://i.pravatar.cc/150?u=ahmed"
          status="on_the_way"
          estimatedArrival="12 mins"
          onPress={() => router.push("/bookings/active")}
        />

        {/* 3. QUICK NAVIGATION (The "2-Tap" experience) */}
        <QuickCategories onSelectCategory={handleCategoryPress} />

        {/* 4. CURATED DISCOVERY */}
        <View style={styles.discoverySection}>
          {isLoading ? (
            <ActivityIndicator style={{ marginTop: 40 }} />
          ) : (
            <DiscoveryView
              data={data as ProvidersDashboardData}
              onCategoryChange={handleCategoryPress}
            />
          )}
        </View>

        <View style={{ height: 100 }} />
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
  header: {
    paddingBottom: 8,
    gap: 4, // Tight gap between Location and Search
  },
  discoverySection: {
    marginTop: 10,
  },
});

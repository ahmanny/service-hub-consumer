import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoryResultsView from "@/components/home/categories/CategoryResultsView";
import { ThemedText } from "@/components/ui/Themed";
import { SERVICE_META, ServiceType } from "@/constants/services";
import { useGetProviders } from "@/hooks/useProviders";
import { FALLBACK_LOCATION } from "@/providers/service.provider";
import { useAuthStore } from "@/stores/auth.store";
import { ProviderListItem } from "@/types/provider.types";

export default function CategoryResultsScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: ServiceType }>();
  const userLocation = useAuthStore((state) => state.userLocation);

  const meta = SERVICE_META[type];

  const { data, isLoading } = useGetProviders(
    {
      serviceType: type,
      lat: userLocation ? userLocation[1] : FALLBACK_LOCATION[1],
      lng: userLocation ? userLocation[0] : FALLBACK_LOCATION[0],
    },
    true
  );
  const providers = data as ProviderListItem[];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 1. PREMIUM HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <ThemedText style={styles.title}>
            {meta?.label || "Results"}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {providers?.length || 0} professionals near you
          </ThemedText>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 2. RESULTS LIST */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFB800" />
        </View>
      ) : (
        <CategoryResultsView category={type} providers={providers} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
  },
  subtitle: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  cardWrapper: {
    marginBottom: 20, // Give each provider space to breathe
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { marginTop: 100, alignItems: "center" },
  emptyText: { color: "#8E8E93", fontSize: 16 },
});

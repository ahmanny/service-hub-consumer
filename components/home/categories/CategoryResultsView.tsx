import { ThemedText } from "@/components/ui/Themed";
import { SERVICE_META, ServiceType } from "@/constants/services";
import { ProviderListItem } from "@/types/provider.types";
import React from "react";
import { StyleSheet, View } from "react-native";
import ProviderCard from "../ProviderCard";
import { FlatList } from "react-native-gesture-handler";
import { router } from "expo-router";

interface Props {
  category: ServiceType;
  providers: ProviderListItem[];
}

export default function CategoryResultsView({ category, providers }: Props) {
    const meta = SERVICE_META[category];
  return (
        <FlatList
          data={providers}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No {meta?.label}s found in this area.</ThemedText>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
               <ProviderCard
                  name={item.firstName}
                  category={item.serviceType}
                  rating={item.rating}
                  price={`₦${item.basePrice.toLocaleString()}`}
                  image={item.profilePicture || ""}
                  distance={item.distance}
                  isInstant={item.availabilityMode === "instant"}
                  onPress={() => router.push(`/(tabs)/home/${item._id}`)}
                />
            </View>
          )}
        />
  );
}


const styles = StyleSheet.create({
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  cardWrapper: {
    marginBottom: 20, 
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { marginTop: 100, alignItems: "center" },
  emptyText: { color: "#8E8E93", fontSize: 16 },
});
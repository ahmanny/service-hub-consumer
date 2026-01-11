import { homeBasedServices } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { IProviderProfile } from "@/types/provider.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, Platform, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";
import ThemedCard from "../ui/Themed/ThemedCard";

interface Props {
  data: IProviderProfile;
}

export default function ServiceModeInfo({ data }: Props) {
  const { shopAddress, homeServiceAvailable, serviceType } = data;
  const BRAND_GREEN = useThemeColor({}, "tint");

  const shouldShowHomeRow =
    !homeBasedServices.includes(serviceType) && homeServiceAvailable;

  const handleGetDirections = () => {
    if (!shopAddress?.location?.coordinates) return;

    const [lng, lat] = shopAddress.location.coordinates;
    const label = `${data.firstName}'s Shop`;

    // Create URLs for Apple and Google Maps
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Service Location</ThemedText>

      {shouldShowHomeRow && (
        <View style={styles.modeRow}>
          <Ionicons name="home" size={18} color={BRAND_GREEN} />
          <ThemedText style={[styles.modeText, { color: BRAND_GREEN }]}>
            Home service available
          </ThemedText>
        </View>
      )}

      {shopAddress ? (
        <ThemedCard style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <Ionicons name="business" size={16} color="#666" />
            <ThemedText style={styles.addressLabel}>Shop address</ThemedText>
          </View>

          <ThemedText style={styles.addressText}>
            {shopAddress.formattedAddress}
          </ThemedText>

          <Pressable
            onPress={handleGetDirections}
            style={({ pressed }) => [
              styles.linkButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="navigate-circle" size={20} color="#007AFF" />
            <ThemedText style={styles.linkText}>Get directions</ThemedText>
          </Pressable>
        </ThemedCard>
      ) : (
        <View style={styles.noShopContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <ThemedText style={styles.noShopText}>
            This provider works exclusively at the customer's location.
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginVertical: 10 },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  modeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    backgroundColor: "#0BB45E10",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  modeText: { fontSize: 14, fontWeight: "600" },
  addressCard: {
    padding: 16,
    borderRadius: 12,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
  },
  addressText: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 12,
    lineHeight: 20,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 12,
  },
  linkText: { color: "#007AFF", fontWeight: "700", fontSize: 14 },
  noShopContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
  },
  noShopText: { fontSize: 14, color: "#666", flex: 1 },
});

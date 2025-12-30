import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleSheet, View } from "react-native";
import ThemedCard from "../ui/Themed/ThemedCard";

export default function ProviderResultCardSkeleton() {
  const skeletonBg = useThemeColor({}, "border"); // subtle gray placeholder
  const iconBg = useThemeColor({}, "placeholder"); // for icon

  return (
    <ThemedCard style={styles.card}>
      {/* Left Icon */}
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]} />

      {/* Content */}
      <View style={styles.content}>
        {/* Top Row: Name + Rating */}
        <View style={styles.topRow}>
          <View
            style={[styles.nameSkeleton, { backgroundColor: skeletonBg }]}
          />
          <View
            style={[styles.ratingSkeleton, { backgroundColor: skeletonBg }]}
          />
        </View>

        {/* Bottom Row: Distance + Price */}
        <View style={styles.bottomRow}>
          <View
            style={[styles.metaSkeleton, { backgroundColor: skeletonBg }]}
          />
          <View
            style={[styles.priceSkeleton, { backgroundColor: skeletonBg }]}
          />
        </View>
      </View>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },

  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 14,
  },

  content: {
    flex: 1,
    gap: 6,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nameSkeleton: {
    width: "50%",
    height: 16,
    borderRadius: 4,
  },

  ratingSkeleton: {
    width: 40,
    height: 14,
    borderRadius: 4,
  },

  metaSkeleton: {
    width: "40%",
    height: 12,
    borderRadius: 4,
  },

  priceSkeleton: {
    width: 60,
    height: 14,
    borderRadius: 4,
  },
});

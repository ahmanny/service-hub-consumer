import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ShimmerSkeleton } from "../ui/ShimmerSkeleton";
import ThemedCard from "../ui/Themed/ThemedCard";

export default function BookingDetailsSkeleton() {
  const bg = useThemeColor({}, "background");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: bg }}>
      {/* HERO SKELETON */}
      <View style={styles.heroSkeleton}>
        <ShimmerSkeleton width={64} height={64} borderRadius={22} />
        <View style={{ marginTop: 12, alignItems: "center", gap: 8 }}>
          <ShimmerSkeleton width={180} height={24} borderRadius={6} />
          <ShimmerSkeleton width={100} height={16} borderRadius={4} />
        </View>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {/* STATUS CARD SKELETON */}
        <ThemedCard style={styles.cardSkeleton}>
          <ShimmerSkeleton width={20} height={20} borderRadius={10} />
          <ShimmerSkeleton width={120} height={20} borderRadius={6} />
        </ThemedCard>

        {/* LOGISTICS SECTION */}
        <SkeletonSection title="Logistics">
          <ThemedCard style={styles.infoCardSkeleton}>
            <View style={styles.infoRow}>
              <ShimmerSkeleton width={40} height={40} borderRadius={12} />
              <View style={{ gap: 6 }}>
                <ShimmerSkeleton width={140} height={18} borderRadius={4} />
                <ShimmerSkeleton width={80} height={14} borderRadius={4} />
              </View>
            </View>
            <View style={styles.infoRow}>
              <ShimmerSkeleton width={40} height={40} borderRadius={12} />
              <View style={{ gap: 6 }}>
                <ShimmerSkeleton width={100} height={18} borderRadius={4} />
                <ShimmerSkeleton width={200} height={14} borderRadius={4} />
              </View>
            </View>
          </ThemedCard>
        </SkeletonSection>

        {/* PROVIDER SECTION */}
        <SkeletonSection title="Provider">
          <ThemedCard style={styles.providerCardSkeleton}>
            <ShimmerSkeleton width={56} height={56} borderRadius={28} />
            <View style={{ flex: 1, gap: 6 }}>
              <ShimmerSkeleton width={120} height={18} borderRadius={4} />
              <ShimmerSkeleton width={80} height={14} borderRadius={4} />
            </View>
            <ShimmerSkeleton width={44} height={44} borderRadius={22} />
          </ThemedCard>
        </SkeletonSection>

        {/* PAYMENT SUMMARY */}
        <SkeletonSection title="Payment Summary">
          <View style={[styles.infoCardSkeleton, { padding: 16, gap: 12 }]}>
            <View style={styles.priceRow}>
              <ShimmerSkeleton width={100} height={16} />
              <ShimmerSkeleton width={60} height={16} />
            </View>
            <View style={styles.priceRow}>
              <ShimmerSkeleton width={120} height={16} />
              <ShimmerSkeleton width={60} height={16} />
            </View>
            <View
              style={{ height: 1, backgroundColor: "#eee", marginVertical: 4 }}
            />
            <View style={styles.priceRow}>
              <ShimmerSkeleton width={80} height={20} />
              <ShimmerSkeleton width={100} height={24} />
            </View>
          </View>
        </SkeletonSection>

        {/* ACTION BUTTONS */}
        <View style={{ marginTop: 32, gap: 12 }}>
          <ShimmerSkeleton width="100%" height={56} borderRadius={18} />
          <ShimmerSkeleton width="100%" height={56} borderRadius={18} />
        </View>
      </View>
    </ScrollView>
  );
}

// Sub-component for skeleton sections
const SkeletonSection = ({ title, children }: any) => (
  <View style={{ marginTop: 24 }}>
    <View style={{ marginBottom: 8, marginLeft: 4 }}>
      <ShimmerSkeleton width={80} height={14} borderRadius={4} />
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  heroSkeleton: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  cardSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    gap: 12,
    marginTop: -15,
  },
  infoCardSkeleton: {
    borderRadius: 20,
    padding: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  providerCardSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
    gap: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

import { Stack } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

// Import components
import AvailabilityInfo from "@/components/provider-detail/AvailabilityInfo";
import DetailHeader from "@/components/provider-detail/DetailHeader";
import ServiceModeInfo from "@/components/provider-detail/ServiceModeInfo";
import ServiceSelector from "@/components/provider-detail/ServiceSelector";
import StickyBookingBar from "@/components/provider-detail/StickyBookingBar";
import { MOCK_PROVIDER_PROFILE } from "@/data/testDatas";

export default function ProviderDetailsScreen() {
  const [selectedServiceId, setSelectedServiceId] = useState("1");

  // Dynamic price calculation based on selection
  const prices: Record<string, number> = { "1": 2500, "2": 1500, "3": 4000 };

  const handleBooking = () => {
    // This is where you trigger your BottomSheet
    console.log("Opening Booking Sheet for Service:", selectedServiceId);
  };

  const data = MOCK_PROVIDER_PROFILE;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerTitle: "Provider Details", headerBackTitle: "Back" }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        <DetailHeader data={data} />
        <View style={styles.divider} />

        <ServiceSelector
          selectedId={selectedServiceId}
          onSelect={setSelectedServiceId}
        />
        <View style={styles.divider} />

        <AvailabilityInfo />
        <View style={styles.divider} />

        <ServiceModeInfo />

        {/* Placeholder for About and Reviews */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <StickyBookingBar
        price={prices[selectedServiceId]}
        onBook={handleBooking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollBody: { paddingBottom: 120 },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 15,
    marginHorizontal: 20,
  },
});

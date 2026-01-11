import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

// Components
import AvailabilityInfo from "@/components/provider-detail/AvailabilityInfo";
import DetailHeader from "@/components/provider-detail/DetailHeader";
import ProviderBio from "@/components/provider-detail/ProviderBio";
import ServiceModeInfo from "@/components/provider-detail/ServiceModeInfo";
import ServiceSelector from "@/components/provider-detail/ServiceSelector";
import StickyBookingBar from "@/components/provider-detail/StickyBookingBar";
import TrustBadges from "@/components/provider-detail/TrustBadges";
import { ThemedView } from "@/components/ui/Themed";
import { MOCK_PROVIDER_PROFILE } from "@/data/testDatas";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function ProviderDetailsScreen() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const data = MOCK_PROVIDER_PROFILE;
  const divider = useThemeColor({}, "border");

  const [selectedServiceValue, setSelectedServiceValue] = useState(
    data.services[0]?.value || ""
  );

  const selectedService = data.services.find(
    (s) => s.value === selectedServiceValue
  );

  const currentPrice = selectedService?.price ?? data.basePriceFrom ?? 0;

  const handleServiceSelect = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedServiceValue(value);
  };

  const handleBookingTrigger = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log(
      `Booking provider ${data.firstName} for service: ${selectedService?.name} (${selectedServiceValue}) at ₦${currentPrice}`
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Set header options dynamically */}
      <Stack.Screen
        options={{
          headerTitle: "Provider Details",
          headerBackTitle: "Back",
          headerTransparent: false,
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        <DetailHeader data={data} />

        <View style={[styles.sectionDivider, { backgroundColor: divider }]} />

        <ServiceSelector
          services={data.services}
          selectedId={selectedServiceValue}
          onSelect={handleServiceSelect}
        />

        <View style={[styles.sectionDivider, { backgroundColor: divider }]} />

        <AvailabilityInfo availability={data.availability} />

        <View style={[styles.sectionDivider, { backgroundColor: divider }]} />

        <ServiceModeInfo data={data} />

        <View style={[styles.sectionDivider, { backgroundColor: divider }]} />

        <ProviderBio bio="John is a professional barber with over 6 years of experience, specializing in modern and classic cuts. He is known for his punctuality and attention to detail." />

        <TrustBadges />

        {/* Spacer for the sticky bar */}
        <View style={{ height: 40 }} />
      </ScrollView>

      <StickyBookingBar price={currentPrice} onBook={handleBookingTrigger} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollBody: { paddingBottom: 140 }, // Extra padding to scroll past the sticky bar
  sectionDivider: {
    height: 1,
    marginVertical: 10,
    marginHorizontal: 20,
  },
});

import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";

// Components
import AvailabilityInfo from "@/components/provider-detail/AvailabilityInfo";
import DetailHeader from "@/components/provider-detail/DetailHeader";
import ProviderBio from "@/components/provider-detail/ProviderBio";
import ServiceModeInfo from "@/components/provider-detail/ServiceModeInfo";
import ServiceSelector from "@/components/provider-detail/ServiceSelector";
import StickyBookingBar from "@/components/provider-detail/StickyBookingBar";
import TrustBadges from "@/components/provider-detail/TrustBadges";
import { ThemedView } from "@/components/ui/Themed";
import { useSendBookingRequest } from "@/hooks/consumer/useBooking";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ApiError } from "@/types/api.error.types";
import { IProviderProfile } from "@/types/provider.types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { Alert } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { BookingBottomSheet } from "../BottomSheets/BookingBottomSheet";

export default function ProviderDetailsScreen({
  data,
  isRefetching,
  onRefresh,
}: {
  data: IProviderProfile;
  isRefetching: boolean;
  onRefresh: () => void;
}) {
  const { mutateAsync: sendBooking, isPending } = useSendBookingRequest();
  const sheetRef = useRef<BottomSheetModal>(null);

  const divider = useThemeColor({}, "border");
  const tint = useThemeColor({}, "tint");

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sheetRef.current?.present();
    console.log(
      `Booking provider ${data.firstName} for service: ${selectedService?.name} (${selectedServiceValue}) at ₦${currentPrice}`
    );
  };
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={tint}
            colors={[tint]}
          />
        }
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
      </ScrollView>

      {selectedService && (
        <BookingBottomSheet
          ref={sheetRef}
          provider={data}
          selectedService={selectedService}
          isBooking={isPending}
          onConfirm={async (details) => {
            try {
              const response = await sendBooking(details);
              console.log(response.bookingId);
              console.log(response.status);
              console.log("Booking request response:", response);
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );

              sheetRef.current?.dismiss();
              setTimeout(() => {
                router.replace({
                  pathname: "/(tabs)/bookings/[bookingId]",
                  params: {
                    bookingId: response.bookingId,
                    status: "pending",
                    newBooking: "true",
                  },
                });
              }, 100);
            } catch (error) {
              const err = error as ApiError;
              const message =
                err.response?.data?.message ??
                err.message ??
                "Failed to send booking";

              console.error("Booking request error:", err);

              if (Platform.OS === "android") {
                ToastAndroid.show(message, ToastAndroid.LONG);
              } else {
                Alert.alert("Error", message);
              }
            }
          }}
        />
      )}

      <StickyBookingBar price={currentPrice} onBook={handleBookingTrigger} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollBody: { paddingBottom: 120 },
  sectionDivider: {
    height: 1,
    marginVertical: 10,
    marginHorizontal: 20,
  },
});

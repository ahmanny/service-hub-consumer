import { RescheduleForm } from "@/components/MyBookings/RescheduleForm";
import { ErrorState } from "@/components/ui/ErrorState";
import { ThemedText, ThemedView } from "@/components/ui/Themed";
import { useRecheduleData } from "@/hooks/consumer/useBooking";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Platform, TouchableOpacity } from "react-native";

export default function RescheduleBookingScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { data, isLoading, error, refetch } = useRecheduleData({ bookingId });
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (error || !data)
    return (
      <ErrorState
        message={error?.message || "We couldn't find this provider."}
        onRetry={refetch}
      />
    );

  return (
    <>

      <ThemedView
        style={{ flex: 1, borderTopWidth: 1, borderTopColor: borderColor }}
      >
        <RescheduleForm bookingId={bookingId} provider={data} />
      </ThemedView>
    </>
  );
}

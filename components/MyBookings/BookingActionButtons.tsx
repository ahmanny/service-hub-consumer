import { useBookingActions } from "@/hooks/consumer/useBooking";
import { useThemeColor } from "@/hooks/use-theme-color";
import { BookingDetails } from "@/types/booking.types";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedButton, ThemedText } from "../ui/Themed";

interface ActionProps {
  status: BookingDetails["status"];
  bookingId: string;
}

export default function BookingActionButtons({
  status,
  bookingId,
}: ActionProps) {
  const tint = useThemeColor({}, "tint");

  const { mutate, isPending } = useBookingActions();

  // Handle Cancellation with Confirmation
  const handleCancel = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this request?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () =>
            mutate({
              bookingId,
              action: "cancel",
              reason: "Cancelled by user",
            }),
        },
      ]
    );
  };

  // Navigate to Reschedule Screen
  const handleRescheduleNav = () => {
    // We pass the bookingId so the next screen knows what to update
    router.push({
      pathname: "/(modals)/reschedule-booking",
      params: { bookingId },
    });
  };

  if (isPending) {
    return <ActivityIndicator color={tint} style={{ marginVertical: 20 }} />;
  }

  // Case: ACTIVE / PENDING
  if (status === "pending" || status === "accepted") {
    return (
      <View style={{ gap: 12 }}>
        <ThemedButton
          title="Reschedule Booking"
          onPress={handleRescheduleNav}
        />
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <ThemedText style={{ color: "#FF3B30", fontWeight: "700" }}>
            Cancel Request
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  // Case: COMPLETED
  if (status === "completed") {
    return (
      <View style={{ gap: 12 }}>
        <ThemedButton
          title="Rate Provider"
          onPress={() => console.log("Action: Rate Provider clicked")}
        />
        <ThemedButton
          title="Rebook Service"
          variant="secondary"
          onPress={() => console.log("Action: Rebook clicked")}
        />
      </View>
    );
  }

  // Case: CANCELLED / DECLINED
  if (status === "cancelled" || status === "declined") {
    return (
      <View style={{ gap: 12 }}>
        <ThemedButton
          title="Find Another Provider"
          onPress={() => console.log("Action: Search new provider clicked")}
        />
        <ThemedButton
          title="Try Rebooking"
          variant="secondary"
          onPress={() => console.log("Action: Rebook attempt clicked")}
        />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  actionArea: {
    marginTop: 24,
    paddingBottom: 20,
  },
  cancelBtn: {
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.2)",
    marginTop: 4,
  },
});

import { useThemeColor } from "@/hooks/use-theme-color";
import { BookingDetails } from "@/types/booking.types";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedButton, ThemedText } from "../ui/Themed";

interface ActionProps {
  status: BookingDetails["status"];
}

export default function BookingActionButtons({ status }: ActionProps) {
  const tint = useThemeColor({}, "tint");

  // Case: ACTIVE / PENDING
  if (status === "pending" || status === "accepted") {
    return (
      <View style={{ gap: 12 }}>
        <ThemedButton
          title="Reschedule Booking"
          onPress={() => console.log("Action: Reschedule clicked")}
        />
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => console.log("Action: Cancel Request clicked")}
        >
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
    borderColor: "rgba(255, 59, 48, 0.2)", // Subtle red border
    marginTop: 4,
  },
});

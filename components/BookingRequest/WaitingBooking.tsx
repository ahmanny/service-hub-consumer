import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { intervalToDuration } from "date-fns";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";

type Props = {
  bookingId: string;
  providerFirstName: string;
  deadlineAt: Date;
  onClose?: () => void;
};

export function WaitingBooking({
  bookingId,
  providerFirstName,
  deadlineAt,
  onClose,
}: Props) {
  const tint = useThemeColor({}, "tint");
  const muted = useThemeColor({}, "placeholder");
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(deadlineAt);
      if (now >= end) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const duration = intervalToDuration({ start: now, end: end });
        setTimeLeft(`${duration.minutes || 0}m ${duration.seconds || 0}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadlineAt]);

  const handleViewDetails = () => {
    onClose?.(); // Close the sheet first

    // The "Double-Tap" Navigation Fix
    setTimeout(() => {
      router.navigate("/(tabs)/bookings");
      setTimeout(() => {
        router.push({
          pathname: "/(tabs)/bookings/[bookingId]",
          params: { bookingId, newBooking: "true" },
        });
      }, 100);
    }, 200);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.statusRing, { borderColor: tint + "30" }]}>
        <ActivityIndicator size="large" color={tint} />
        <View style={styles.iconCenter}>
          <Ionicons name="notifications" size={28} color={tint} />
        </View>
      </View>

      <View style={styles.textGroup}>
        <ThemedText type="subtitle" style={styles.title}>
          Request Sent!
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: muted }]}>
          We've notified{" "}
          <ThemedText type="defaultSemiBold" style={{ color: tint }}>
            {providerFirstName}
          </ThemedText>
          . They usually respond within the next few minutes.
        </ThemedText>
      </View>

      <View style={[styles.timerBadge, { backgroundColor: tint + "10" }]}>
        <Ionicons name="timer-outline" size={16} color={tint} />
        <ThemedText style={[styles.timerText, { color: tint }]}>
          Auto-expires in: {timeLeft}
        </ThemedText>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.viewBtn,
          { backgroundColor: tint, opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={handleViewDetails}
      >
        <ThemedText style={styles.btnText}>View Booking Details</ThemedText>
        <Ionicons name="arrow-forward" size={18} color="white" />
      </Pressable>

      <Pressable onPress={onClose} style={styles.closeLink}>
        <ThemedText style={{ color: muted, fontSize: 14 }}>Dismiss</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
  },
  statusRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconCenter: {
    position: "absolute",
  },
  textGroup: {
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "700",
  },
  viewBtn: {
    width: "100%",
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  closeLink: {
    marginTop: 20,
    padding: 10,
  },
});

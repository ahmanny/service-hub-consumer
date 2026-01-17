import { ThemedText } from "@/components/ui/Themed";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  providerName: string;
  providerImage: string;
  status: "confirmed" | "on_the_way" | "arrived";
  estimatedArrival?: string;
  onPress: () => void;
}

export default function ActiveBookingBanner({
  providerName,
  providerImage,
  status,
  estimatedArrival,
  onPress,
}: Props) {
  const getStatusText = () => {
    switch (status) {
      case "on_the_way":
        return `${providerName} is on the way`;
      case "arrived":
        return `${providerName} has arrived`;
      default:
        return "Booking confirmed";
    }
  };

  const handlePress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.shadowWrapper}
      onPress={handlePress}
    >
      <LinearGradient
        colors={["#1A1A1A", "#000000"]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: providerImage }} style={styles.avatar} />
            {/* Pulse indicator for "Live" status */}
            <View style={styles.livePulse} />
          </View>

          <View style={styles.textContainer}>
            <ThemedText style={styles.statusText}>{getStatusText()}</ThemedText>
            {estimatedArrival && (
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={14} color="#FFB800" />
                <ThemedText style={styles.timeText}>
                  Arriving in {estimatedArrival}
                </ThemedText>
              </View>
            )}
          </View>

          <View style={styles.actionIcon}>
            <Ionicons name="chevron-forward" size={20} color="#FFB800" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    marginHorizontal: 20,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  container: {
    padding: 16,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)", // Subtle glass border
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    marginRight: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14, // Modern "Squircle"
    borderWidth: 1.5,
    borderColor: "#FFB800", // Gold ring for the provider
  },
  livePulse: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0BB45E",
    borderWidth: 2,
    borderColor: "#000",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  statusText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    color: "#FFB800", // Gold for the arrival time
    fontWeight: "600",
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 184, 0, 0.1)", // Subtle gold tint
    alignItems: "center",
    justifyContent: "center",
  },
});

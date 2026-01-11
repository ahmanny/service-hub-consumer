import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../ui/Themed";

export default function StickyBookingBar({
  price,
  onBook,
}: {
  price: number;
  onBook: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 12 }]}>
      <View style={styles.content}>
        <View>
          <ThemedText style={styles.priceLabel}>Total Price</ThemedText>
          <ThemedText style={styles.priceValue}>
            ₦{price.toLocaleString()}
          </ThemedText>
        </View>
        <Pressable style={styles.button} onPress={onBook}>
          <ThemedText style={styles.buttonText}>Book Now</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingHorizontal: 20,
    paddingTop: 12,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: { fontSize: 12, opacity: 0.5 },
  priceValue: { fontSize: 22, fontWeight: "800", color: "#007AFF" },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
  },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
});

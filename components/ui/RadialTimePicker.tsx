import { useThemeColor } from "@/hooks/use-theme-color";
import { generateTimeSlots } from "@/lib/utils";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/Themed";

const { width } = Dimensions.get("window");
const PICKER_SIZE = width * 0.8;
const RADIUS = PICKER_SIZE / 2.5;

export default function RadialTimePicker({
  selectedDate,
  selectedTime,
  onSelectTime,
}: any) {
  const tint = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  // Filter 12 main slots (e.g., every hour from 9 AM to 8 PM)
  const slots = useMemo(() => {
    const all = generateTimeSlots(selectedDate);
    // Filtering for hours only to keep the circle clean
    return all.filter((d: any) => d.getMinutes() === 0);
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <View style={[styles.clockFace, { borderColor: border }]}>
        {/* CENTER DISPLAY */}
        <View style={styles.centerInfo}>
          <ThemedText style={styles.centerLabel}>Selected</ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={{ color: tint, fontSize: 18 }}
          >
            {selectedTime
              ? selectedTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-- : --"}
          </ThemedText>
        </View>

        {/* RADIAL SLOTS */}
        {slots.map((slot: any, index: any) => {
          const angle = (index / slots.length) * 2 * Math.PI - Math.PI / 2;
          const x = RADIUS * Math.cos(angle);
          const y = RADIUS * Math.sin(angle);

          const isSelected = selectedTime?.getHours() === slot.getHours();

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectTime(slot)}
              style={[
                styles.slot,
                {
                  transform: [{ translateX: x }, { translateY: y }],
                  backgroundColor: isSelected ? tint : cardBg,
                  borderColor: isSelected ? tint : border,
                },
              ]}
            >
              <ThemedText
                style={[styles.slotText, isSelected && { color: "#fff" }]}
              >
                {slot.getHours() > 12 ? slot.getHours() - 12 : slot.getHours()}
              </ThemedText>
              <ThemedText
                style={[styles.period, isSelected && { color: "#fff" }]}
              >
                {slot.getHours() >= 12 ? "PM" : "AM"}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  clockFace: {
    width: PICKER_SIZE,
    height: PICKER_SIZE,
    borderRadius: PICKER_SIZE / 2,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  centerInfo: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: {
    fontSize: 12,
    opacity: 0.5,
    textTransform: "uppercase",
  },
  slot: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  slotText: {
    fontSize: 14,
    fontWeight: "700",
  },
  period: {
    fontSize: 8,
    fontWeight: "700",
  },
});

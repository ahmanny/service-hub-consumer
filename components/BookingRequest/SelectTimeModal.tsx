import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RadialTimePicker from "../ui/RadialTimePicker";
import { ThemedModal } from "../ui/Themed";

interface Props {
  setSelectedTime: React.Dispatch<React.SetStateAction<Date | null>>;
  selectedTime: Date | null;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDate: Date | null;
}

export default function SelectTimeModal({
  showModal,
  setShowModal,
  setSelectedTime,
  selectedDate,
  selectedTime,
}: Props) {
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "placeholder");
  const tint = useThemeColor({}, "tint"); // Your brand green

  const handleConfirm = () => {
    if (selectedTime) {
      setShowModal(false);
    }
  };

  return (
    <ThemedModal visible={showModal} onClose={() => setShowModal(false)}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: text }]}>Available Times</Text>
        <Text style={[styles.subtitle, { color: muted }]}>
          Choose what time you want the service
        </Text>
      </View>

      {/* Clock */}
      <RadialTimePicker
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onSelectTime={setSelectedTime}
      />

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setShowModal(false);
            setSelectedTime(null);
          }}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.confirmButton,
            !selectedTime && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={!selectedTime}
        >
          <Text
            style={[styles.confirmText, { color: selectedTime ? tint : muted }]}
          >
            OK
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedModal>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: "rgba(11, 180, 94, 0.1)",
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FF3B30",
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "700",
  },
});

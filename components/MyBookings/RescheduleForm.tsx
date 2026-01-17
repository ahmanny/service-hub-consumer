import { useBookingActions } from "@/hooks/consumer/useBooking";
import { useThemeColor } from "@/hooks/use-theme-color";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import SelectTimeModal from "../BookingRequest/SelectTimeModal";
import AvailabilityInfo from "../provider-detail/AvailabilityInfo";
import { ThemedButton, ThemedText } from "../ui/Themed";

export function RescheduleForm({
  bookingId,
  provider,
}: {
  bookingId: string;
  provider: any;
}) {
  const border = useThemeColor({}, "border");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const { mutate, isPending } = useBookingActions();

  const timeConfig = useMemo(() => {
    if (!selectedDate || !provider)
      return { start: 0, end: 0, disabled: [], isClosed: false };

    const dayNum = selectedDate.getDay();
    const daySchedule = provider.availability?.find(
      (d: any) => d.dayOfWeek === dayNum
    ) || { isClosed: true, slots: [] };

    if (daySchedule.isClosed || !daySchedule.slots?.length) {
      return { start: 0, end: 0, disabled: [], isClosed: true };
    }

    const providerStart = parseInt(daySchedule.slots[0].start.split(":")[0]);
    const providerEnd = parseInt(daySchedule.slots[0].end.split(":")[0]);

    // "Today" logic: cannot book hours that have already passed
    let actualStartHour = providerStart;
    const isToday = selectedDate.toDateString() === new Date().toDateString();
    if (isToday) {
      const currentHour = new Date().getHours();
      actualStartHour = Math.max(providerStart, currentHour + 1);
    }

    // Filter booked slots for the selected date
    const selectedDateString = selectedDate.toISOString().split("T")[0];
    const disabledHours = (provider.bookedSlots || [])
      .filter((slot: any) => slot.date === selectedDateString)
      .map((slot: any) => parseInt(slot.startTime.split(":")[0]));

    return {
      start: actualStartHour,
      end: providerEnd,
      disabled: disabledHours,
      isClosed: actualStartHour >= providerEnd,
    };
  }, [selectedDate, provider]);

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;

    const finalDateTime = new Date(selectedDate);
    finalDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());

    mutate(
      {
        bookingId,
        action: "reschedule",
        newScheduledAt: finalDateTime.toISOString(),
      },
      {
        onSuccess: () => router.back(),
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AvailabilityInfo availability={provider.availability} />

      <View style={styles.divider} />
      <ThemedText style={styles.label}>Select New Date</ThemedText>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={[styles.pickerTrigger, { borderColor: border }]}
      >
        <ThemedText style={styles.valueText}>
          {selectedDate
            ? selectedDate.toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })
            : "Pick a date"}
        </ThemedText>
      </TouchableOpacity>

      <ThemedText style={styles.label}>Select New Time</ThemedText>
      <TouchableOpacity
        disabled={!selectedDate || timeConfig.isClosed}
        onPress={() => setShowTimeModal(true)}
        style={[
          styles.pickerTrigger,
          {
            borderColor: border,
            opacity: !selectedDate || timeConfig.isClosed ? 0.5 : 1,
          },
        ]}
      >
        <ThemedText style={styles.valueText}>
          {timeConfig.isClosed
            ? "Provider is closed"
            : selectedTime
            ? selectedTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Pick a time slot"}
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.footer}>
        <ThemedButton
          title="Update Schedule"
          loading={isPending}
          disabled={!selectedDate || !selectedTime || isPending}
          onPress={handleConfirm}
        />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) {
              setSelectedDate(date);
              setSelectedTime(null); // Reset time if date changes
            }
          }}
        />
      )}

      <SelectTimeModal
        showModal={showTimeModal}
        setShowModal={setShowTimeModal}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        startHour={timeConfig.start}
        endHour={timeConfig.end}
        disabledHours={timeConfig.disabled}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    opacity: 0.5,
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  pickerTrigger: {
    padding: 18,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: { marginTop: 40 },
});

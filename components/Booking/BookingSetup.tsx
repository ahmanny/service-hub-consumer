import SelectServiceModal from "@/components/Booking/ServiceSelectModal";
import { ThemedText } from "@/components/ui/Themed";
import {
  getMaxTime,
  getMinTime,
  isTimeWithinRange,
} from "@/constants/dateTimePicker";
import {
  getServicesForType,
  requiresLocationChoice,
  SERVICE_META,
  ServiceType,
} from "@/constants/services";
import { BookingSetupInfo } from "@/types/provider.types";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  selectedService: ServiceType;
  setBookingSetup: React.Dispatch<
    React.SetStateAction<BookingSetupInfo | null>
  >;
  handleBookingSetup: () => void;
}

export default function BookingSetup({
  selectedService,
  setBookingSetup,
  handleBookingSetup,
}: Props) {
  const [service, setService] = useState<string | null>(null);
  const [locationType, setLocationType] = useState<"shop" | "home" | null>(
    null
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const [showServiceModal, setShowServiceModal] = useState(false);

  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (_event: any, value?: Date) => {
    setShowPicker(false);

    if (!value) return; // user dismissed

    if (pickerMode === "date") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(value);
      selected.setHours(0, 0, 0, 0);

      if (selected < today) {
        Alert.alert("Invalid date", "Please select today or a future date");
        return;
      }

      setSelectedDate(value);
    }
    if (pickerMode === "time") {
      if (!isTimeWithinRange(value)) {
        Alert.alert(
          "Unavailable time",
          "Service is available only between 8:00 AM and 9:00 PM"
        );
        return;
      }

      // normalize date to today
      const timeOnly = new Date();
      timeOnly.setHours(value.getHours(), value.getMinutes(), 0, 0);
      setSelectedTime(timeOnly);
    }
  };

  const openDatePicker = () => {
    setPickerMode("date");
    setShowPicker(true);
  };

  const openTimePicker = () => {
    setPickerMode("time");
    setShowPicker(true);
  };

  const handleFindProvider = () => {
    if (!canSubmit) return;

    const bookingDateTime = new Date(selectedDate!);
    bookingDateTime.setHours(
      selectedTime!.getHours(),
      selectedTime!.getMinutes(),
      0,
      0
    );
    const bookingSetup = {
      service,
      locationType,
      bookingDateTime: bookingDateTime.toISOString(),
    };
    setBookingSetup(bookingSetup);
    handleBookingSetup();
    console.log(bookingSetup);
  };

  const canSubmit =
    service &&
    selectedDate &&
    selectedTime &&
    (!requiresLocationChoice(selectedService) || locationType);

  return (
    <View style={styles.container}>
      <ThemedText>What do you need from?</ThemedText>
      <ThemedText style={styles.label}>Service</ThemedText>
      <TouchableOpacity
        style={styles.select}
        onPress={() => setShowServiceModal(true)}
      >
        <ThemedText style={styles.selectText}>
          {service
            ? getServicesForType(selectedService).find(
                (s) => s.value === service
              )?.name
            : "Select service"}
        </ThemedText>
      </TouchableOpacity>

      {/* WHERE */}
      {requiresLocationChoice(selectedService) && (
        <>
          <ThemedText style={styles.label}>Where?</ThemedText>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.option,
                locationType === "shop" && styles.optionActive,
              ]}
              onPress={() => setLocationType("shop")}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  locationType === "shop" && styles.optionTextActive,
                ]}
              >
                Come to shop
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                locationType === "home" && styles.optionActive,
              ]}
              onPress={() => setLocationType("home")}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  locationType === "home" && styles.optionTextActive,
                ]}
              >
                Home service
              </ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}

      <ThemedText style={styles.label}>When?</ThemedText>
      <View style={styles.row}>
        {/* DATE */}
        <TouchableOpacity style={styles.select} onPress={openDatePicker}>
          <ThemedText style={styles.selectText}>
            {selectedDate ? selectedDate.toDateString() : "Pick date"}
          </ThemedText>
        </TouchableOpacity>

        {/* TIME */}
        <TouchableOpacity
          disabled={!selectedDate}
          onPress={openTimePicker}
          style={[styles.select, !selectedDate && styles.disabled]}
        >
          <ThemedText>
            {selectedTime
              ? selectedTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Pick time"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* SUBMIT */}
      <TouchableOpacity
        onPress={handleFindProvider}
        style={[styles.button, !canSubmit && { opacity: 0.5 }]}
        disabled={!canSubmit}
      >
        <ThemedText style={styles.buttonText}>
          Find {SERVICE_META[selectedService].label}s
        </ThemedText>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={
            pickerMode === "date"
              ? selectedDate ?? new Date()
              : selectedTime ?? new Date()
          }
          mode={pickerMode}
          is24Hour={false}
          minimumDate={pickerMode === "time" ? getMinTime() : undefined}
          maximumDate={pickerMode === "time" ? getMaxTime() : undefined}
          onChange={onChange}
        />
      )}
      <SelectServiceModal
        service={service}
        services={getServicesForType(selectedService)}
        setService={setService}
        setShowModal={setShowServiceModal}
        showModal={showServiceModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 13,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 18,
    marginBottom: 6,
  },
  select: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    padding: 14,
  },
  disabled: {
    opacity: 0.4,
  },
  selectText: {
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  optionActive: {
    backgroundColor: "#0BB45E",
    borderColor: "#0BB45E",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  optionTextActive: {
    color: "#fff",
  },
  button: {
    marginTop: 15,
    backgroundColor: "#0BB45E",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  modal: {
    flex: 1,
    paddingTop: 60,
  },
  modalItem: {
    padding: 18,
    borderBottomWidth: 1,
  },
  modalText: {
    fontSize: 16,
  },
});

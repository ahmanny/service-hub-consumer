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
import { useThemeColor } from "@/hooks/use-theme-color";
import { BookingSetupInfo } from "@/types/provider.types";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";
import ThemedCard from "../ui/Themed/ThemedCard";

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
  const navigation = useNavigation();

  const [service, setService] = useState<string | null>(null);
  const [locationType, setLocationType] = useState<"home" | "shop">("home");
  const [locationInputType, setLocationInputType] = useState<"gps" | "manual">(
    "gps"
  );
  const [address, setAddress] = useState("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [showPicker, setShowPicker] = useState(false);

  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "placeholder");
  const border = useThemeColor({}, "border");

  const onChange = (_: any, value?: Date) => {
    setShowPicker(false);
    if (!value) return;

    if (pickerMode === "date") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (value < today) {
        Alert.alert("Invalid date", "Please select a future date");
        return;
      }
      setSelectedDate(value);
    }

    if (pickerMode === "time") {
      if (!isTimeWithinRange(value)) {
        Alert.alert(
          "Unavailable time",
          "Service runs between 8:00 AM and 9:00 PM"
        );
        return;
      }
      setSelectedTime(value);
    }
  };

  const canSubmit =
    service &&
    selectedDate &&
    selectedTime &&
    (locationType !== "home" || locationInputType === "gps" || address.trim());

  const handleFindProvider = () => {
    if (!canSubmit) return;

    const bookingDateTime = new Date(selectedDate!);
    bookingDateTime.setHours(
      selectedTime!.getHours(),
      selectedTime!.getMinutes()
    );

    setBookingSetup({
      service,
      locationType,
      bookingDateTime: bookingDateTime.toISOString(),
      // address: locationType === "home" ? address : null,
    });

    handleBookingSetup();
  };

  return (
    <BottomSheetScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.container, { paddingBottom: 0 }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>What do you need?</ThemedText>
      </View>

      {/* SERVICE */}
      <Section title="Service">
        <SelectCard onPress={() => setShowServiceModal(true)}>
          <ThemedText>
            {service
              ? getServicesForType(selectedService).find(
                  (s) => s.value === service
                )?.name
              : "Select service"}
          </ThemedText>
          <Ionicons name="chevron-down" size={18} color={muted} />
        </SelectCard>
      </Section>

      {/* WHEN */}
      <Section title="When?">
        <View style={styles.row}>
          <SelectCard
            onPress={() => {
              setPickerMode("date");
              setShowPicker(true);
            }}
          >
            <ThemedText>
              {selectedDate ? selectedDate.toDateString() : "Pick date"}
            </ThemedText>
          </SelectCard>

          <SelectCard
            disabled={!selectedDate}
            onPress={() => {
              setPickerMode("time");
              setShowPicker(true);
            }}
          >
            <ThemedText>
              {selectedTime
                ? selectedTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Pick time"}
            </ThemedText>
          </SelectCard>
        </View>
      </Section>

      {/* WHERE */}
      {requiresLocationChoice(selectedService) && (
        <Section title="Where?">
          <View style={styles.row}>
            <Pill
              label="Come to shop"
              active={locationType === "shop"}
              onPress={() => setLocationType("shop")}
            />
            <Pill
              label="Home service"
              active={locationType === "home"}
              onPress={() => setLocationType("home")}
            />
          </View>

          {locationType === "home" && (
            <ThemedCard style={styles.subCard}>
              <RadioButton.Group
                value={locationInputType}
                onValueChange={(v) => setLocationInputType(v as any)}
              >
                <Option label="Use my current location" value="gps" />
                <Option label="Enter address manually" value="manual" />
              </RadioButton.Group>

              {locationInputType === "manual" && (
                <BottomSheetTextInput
                  placeholder="Enter address"
                  value={address}
                  onChangeText={setAddress}
                  style={[styles.input, { borderColor: border }]}
                  placeholderTextColor={muted}
                />
              )}
            </ThemedCard>
          )}
        </Section>
      )}

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!canSubmit}
          onPress={handleFindProvider}
          style={[styles.button, !canSubmit && { opacity: 0.4 }]}
        >
          <ThemedText style={styles.buttonText}>
            Find {SERVICE_META[selectedService].label}s
          </ThemedText>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={selectedDate ?? new Date()}
          mode={pickerMode}
          is24Hour
          minimumDate={pickerMode === "time" ? getMinTime() : undefined}
          maximumDate={pickerMode === "time" ? getMaxTime() : undefined}
          onChange={onChange}
        />
      )}

      <SelectServiceModal
        service={service}
        services={getServicesForType(selectedService)}
        setService={setService}
        showModal={showServiceModal}
        setShowModal={setShowServiceModal}
      />
    </BottomSheetScrollView>
  );
}

/*SMALL COMPONENTS*/

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.label}>{title}</ThemedText>
      {children}
    </View>
  );
}

function SelectCard({ children, onPress, disabled }: any) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.card, disabled && { opacity: 0.4 }]}
    >
      <View style={styles.cardRow}>{children}</View>
    </TouchableOpacity>
  );
}

function Pill({ label, active, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        { backgroundColor: useThemeColor({}, active ? "tint" : "card") },
      ]}
    >
      <ThemedText style={{ fontWeight: active ? "700" : "500" }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function Option({ label, value }: any) {
  return (
    <Pressable style={styles.optionRow}>
      <RadioButton value={value} />
      <ThemedText>{label}</ThemedText>
    </Pressable>
  );
}

/*STYLES*/

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    paddingBottom: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },

  label: {
    fontWeight: "600",
    marginBottom: 8,
  },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    borderColor: "#ddd",
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  pill: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },

  pillActive: {
    backgroundColor: "#0BB45E",
  },

  subCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 8,
  },

  input: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 14,
  },

  footer: {
    padding: 16,
    marginTop: "auto",
  },

  button: {
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
});

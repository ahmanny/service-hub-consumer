import { requiresLocationChoice } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import { BookingRequestPayload } from "@/types/booking.types";
import { IProviderProfile, IProviderService } from "@/types/provider.types";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import SelectTimeModal from "../BookingRequest/SelectTimeModal";
import { ThemedButton, ThemedText } from "../ui/Themed";

interface Props {
  provider: IProviderProfile;
  selectedService: IProviderService;
  onConfirm: (bookingDetails: BookingRequestPayload) => void;
  isBooking: boolean;
}

export const BookingBottomSheet = React.forwardRef<BottomSheetModal, Props>(
  ({ provider, selectedService, onConfirm, isBooking }, ref) => {
    // --- THEME & STYLES ---
    const snapPoints = useMemo(() => ["85%", "95%"], []);
    const BRAND_GREEN = useThemeColor({}, "tint");
    const bg = useThemeColor({}, "background");
    const cardBg = useThemeColor({}, "card");
    const border = useThemeColor({}, "border");
    const text = useThemeColor({}, "text");
    const muted = useThemeColor({}, "placeholder");
    const textColor = useThemeColor({}, "text");

    const profile = useAuthStore((s) => s.user);

    const isLocationtypeRequired = requiresLocationChoice(provider.serviceType);

    // --- STATE ---
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [mode, setMode] = useState<"home" | "shop">(
      isLocationtypeRequired ? "shop" : "home"
    );
    const [note, setNote] = useState("");

    // --- UTILS ---
    const isSameDay = (d1: Date, d2: Date) =>
      d1.toDateString() === d2.toDateString();
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const homeServiceFee = 1200;
    const total =
      mode === "home"
        ? selectedService.price + homeServiceFee
        : selectedService.price;

    // time availaibility logic
    const timeConfig = useMemo(() => {
      if (!selectedDate || !provider)
        return { start: 0, end: 0, disabled: [], isClosed: false };

      const dayNum = selectedDate.getDay();
      const daySchedule = provider.availability?.find(
        (d) => d.dayOfWeek === dayNum
      ) || { dayOfWeek: dayNum, isClosed: true, slots: [] };

      if (daySchedule.isClosed || !daySchedule.slots.length) {
        return { start: 0, end: 0, disabled: [], isClosed: true };
      }

      const providerStart = parseInt(daySchedule.slots[0].start.split(":")[0]);
      const providerEnd = parseInt(daySchedule.slots[0].end.split(":")[0]);

      let actualStartHour = providerStart;
      if (isSameDay(selectedDate, new Date())) {
        const currentHour = new Date().getHours();
        actualStartHour = Math.max(providerStart, currentHour + 1);
      }

      const selectedDateString = selectedDate.toISOString().split("T")[0];
      const disabledHours = (provider.bookedSlots || [])
        .filter((slot) => {
          const slotDate = new Date(slot.date).toISOString().split("T")[0];
          return slotDate === selectedDateString;
        })
        .map((slot) => parseInt(slot.startTime.split(":")[0]));

      // Check if we've already passed the closing time today
      const isEffectivelyClosed = actualStartHour >= providerEnd;

      return {
        start: actualStartHour,
        end: providerEnd,
        disabled: disabledHours,
        isClosed: isEffectivelyClosed,
      };
    }, [selectedDate, provider.availability]);

    // --- HANDLERS ---
    const handleDatePress = (type: "Today" | "Tomorrow") => {
      const target = type === "Today" ? today : tomorrow;
      setSelectedDate(new Date(target));
      setSelectedTime(null);
    };

    const onDateChange = (_: any, date?: Date) => {
      setShowDatePicker(false);
      if (date) {
        setSelectedDate(date);
        setSelectedTime(null);
      }
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
        />
      ),
      []
    );

    // address

    if (!profile) return null;

    const userHomeAddress = profile?.addresses?.find(
      (addr: any) => addr.label?.toLowerCase() === "home"
    );

    const userAddress = userHomeAddress?.formattedAddress;
    const providerAddress =
      provider.shopAddress?.address || "No shop address provided";

    const isHomeAddressMissing = mode === "home" && !userAddress;

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: bg }}
        handleIndicatorStyle={{ backgroundColor: border }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.scrollBody}>
          {/* HEADER */}
          <View style={[styles.header, { borderBottomColor: border }]}>
            <View>
              <ThemedText style={styles.sheetTitle}>Confirm Booking</ThemedText>
              <ThemedText style={styles.providerSub}>
                {selectedService.name} • {provider.firstName}
              </ThemedText>
            </View>
            <View style={styles.priceBadge}>
              <ThemedText style={[styles.mainPrice, { color: BRAND_GREEN }]}>
                ₦{total.toLocaleString()}
              </ThemedText>
            </View>
          </View>

          {/* DATE SELECTION */}
          <SectionTitle title="Select Date" />
          <View style={styles.row}>
            <DateChip
              label="Today"
              isSelected={selectedDate ? isSameDay(selectedDate, today) : false}
              onPress={() => handleDatePress("Today")}
              activeColor={BRAND_GREEN}
              border={border}
            />
            <DateChip
              label="Tomorrow"
              isSelected={
                selectedDate ? isSameDay(selectedDate, tomorrow) : false
              }
              onPress={() => handleDatePress("Tomorrow")}
              activeColor={BRAND_GREEN}
              border={border}
            />
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.chip,
                { borderColor: border, flex: 1.5 },
                selectedDate &&
                !isSameDay(selectedDate, today) &&
                !isSameDay(selectedDate, tomorrow)
                  ? { backgroundColor: BRAND_GREEN, borderColor: BRAND_GREEN }
                  : null,
              ]}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  selectedDate &&
                    !isSameDay(selectedDate, today) &&
                    !isSameDay(selectedDate, tomorrow) && { color: "white" },
                ]}
              >
                {selectedDate &&
                !isSameDay(selectedDate, today) &&
                !isSameDay(selectedDate, tomorrow)
                  ? selectedDate.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  : "Pick Date"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* TIME SELECTION */}
          <SectionTitle title="Available Time" />
          <TouchableOpacity
            disabled={!selectedDate || timeConfig.isClosed}
            style={[
              styles.flexCard,
              { borderColor: border, backgroundColor: cardBg },
              (!selectedDate || timeConfig.isClosed) && { opacity: 0.5 },
            ]}
            onPress={() => setShowTimeModal(true)}
          >
            <ThemedText style={[styles.inputLabel, { color: muted }]}>
              Time
            </ThemedText>
            <View style={styles.selectionContent}>
              <ThemedText
                style={[styles.timeText, !selectedTime && { color: muted }]}
              >
                {!selectedDate
                  ? "Select a date first"
                  : timeConfig.isClosed
                  ? "Closed for the day"
                  : selectedTime
                  ? selectedTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Pick a time slot"}
              </ThemedText>
              <Ionicons
                name={
                  timeConfig.isClosed ? "close-circle-outline" : "time-outline"
                }
                size={20}
                color={
                  timeConfig.isClosed
                    ? "#FF3B30"
                    : selectedTime
                    ? BRAND_GREEN
                    : muted
                }
              />
            </View>
          </TouchableOpacity>

          {/* SERVICE MODE */}
          {isLocationtypeRequired && (
            <>
              <SectionTitle title="Service Mode" />
              <ModeOption
                title="Home Service"
                sub={`+ ₦${homeServiceFee.toLocaleString()}`}
                icon="home"
                selected={mode === "home"}
                activeColor={BRAND_GREEN}
                cardBg={cardBg}
                borderColor={border}
                onPress={() => setMode("home")}
              />
              <ModeOption
                title="Visit Shop"
                sub="Standard location"
                icon="business"
                selected={mode === "shop"}
                activeColor={BRAND_GREEN}
                cardBg={cardBg}
                borderColor={border}
                onPress={() => setMode("shop")}
              />
            </>
          )}

          <SectionTitle
            title={mode === "home" ? "Your Delivery Address" : "Shop Location"}
          />
          <View
            style={[
              styles.addressCard,
              { backgroundColor: cardBg, borderColor: border },
            ]}
          >
            <View style={styles.addressInfo}>
              <Ionicons
                name={mode === "home" ? "location" : "map"}
                size={20}
                color={isHomeAddressMissing ? "#FF3B30" : BRAND_GREEN}
              />
              <View style={{ flex: 1 }}>
                <ThemedText
                  style={[
                    styles.addressText,
                    isHomeAddressMissing && { color: "#FF3B30" },
                  ]}
                >
                  {mode === "home"
                    ? userAddress || "No home address set"
                    : providerAddress}
                </ThemedText>
              </View>
            </View>

            {mode === "home" && (
              <>
                {userAddress ? (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)/profile/set-location-modal",
                          params: {
                            addressId: userHomeAddress?._id,
                            label: userHomeAddress?.label,
                            initialLat:
                              userHomeAddress?.location.coordinates[1],
                            initialLng:
                              userHomeAddress?.location.coordinates[0],
                            edit: "true",
                          },
                        })
                      }
                      style={styles.addressActionBtn}
                    >
                      <ThemedText
                        style={{
                          color: BRAND_GREEN,
                          fontWeight: "700",
                          fontSize: 13,
                        }}
                      >
                        Change
                      </ThemedText>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)/profile/set-location-modal",
                          params: { edit: "false", label: "Home" },
                        })
                      }
                      style={styles.addressActionBtn}
                    >
                      <ThemedText
                        style={{
                          color: BRAND_GREEN,
                          fontWeight: "700",
                          fontSize: 13,
                        }}
                      >
                        Set Home Address
                      </ThemedText>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </View>

          {/* SUMMARY */}
          <View
            style={[
              styles.summaryBox,
              { backgroundColor: cardBg, borderColor: border },
            ]}
          >
            <SummaryRow
              label="Base Service"
              value={selectedService.price}
              color={text}
            />
            {mode === "home" && (
              <SummaryRow
                label="Home Service Fee"
                value={homeServiceFee}
                color={text}
              />
            )}
            <View style={[styles.divider, { backgroundColor: border }]} />
            <View style={styles.totalRow}>
              <ThemedText style={styles.totalLabel}>Total</ThemedText>
              <ThemedText style={[styles.totalValue, { color: text }]}>
                ₦{total.toLocaleString()}
              </ThemedText>
            </View>
          </View>

          {/* NOTE INPUT */}
          <View style={styles.noteContainer}>
            <SectionTitle title={`any notes for ${provider.firstName}?`} />
            <BottomSheetTextInput
              placeholder="e.g. Please bring extra towels..."
              value={note}
              onChangeText={setNote}
              style={[styles.input, { borderColor: border, color: textColor }]}
              placeholderTextColor={muted}
              multiline
            />
          </View>

          {/* FOOTER BUTTON */}
          <View style={styles.footer}>
            <ThemedButton
              title={
                isHomeAddressMissing
                  ? "Set Your Home Address to Book"
                  : "Confirm and Book"
              }
              style={({ pressed }) => [
                (pressed ||
                  !selectedDate ||
                  !selectedTime ||
                  isHomeAddressMissing) && { opacity: 0.5 },
              ]}
              disabled={
                !selectedDate ||
                !selectedTime ||
                isHomeAddressMissing ||
                isBooking
              }
              loading={isBooking}
              onPress={() => {
                const finalDateTime = new Date(selectedDate!);
                finalDateTime.setHours(
                  selectedTime!.getHours(),
                  selectedTime!.getMinutes()
                );
                onConfirm({
                  providerId: provider._id,
                  serviceName: selectedService.name,
                  scheduledAt: finalDateTime.toISOString(),
                  service: selectedService.value,
                  price: {
                    service: selectedService.price,
                    homeServiceFee: homeServiceFee,
                    total: total,
                  },
                  locationType: mode,
                  geoAddress:
                    mode === "home"
                      ? userHomeAddress?.location
                      : provider.shopAddress?.location,
                  textAddress: mode === "home" ? userAddress : providerAddress,
                  note: note ?? null,
                });
              }}
            />
          </View>

          {/* MODALS */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={new Date()}
              onChange={onDateChange}
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
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

// --- MODULAR COMPONENTS ---
const SectionTitle = ({ title }: { title: string }) => (
  <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
);

const DateChip = ({ label, isSelected, onPress, activeColor, border }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.chip,
      { borderColor: border, flex: 1 },
      isSelected && { backgroundColor: activeColor, borderColor: activeColor },
    ]}
  >
    <ThemedText style={[styles.chipText, isSelected && { color: "#fff" }]}>
      {label}
    </ThemedText>
  </TouchableOpacity>
);

const ModeOption = ({
  title,
  sub,
  icon,
  selected,
  onPress,
  activeColor,
  cardBg,
  borderColor,
}: any) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.modeItem,
      {
        backgroundColor: cardBg,
        borderColor: selected ? activeColor : borderColor,
      },
    ]}
  >
    <View style={styles.modeIconLabel}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: selected ? `${activeColor}20` : "#F0F0F0" },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={selected ? activeColor : "#666"}
        />
      </View>
      <View>
        <ThemedText style={styles.modeTitle}>{title}</ThemedText>
        <ThemedText style={styles.modeSub}>{sub}</ThemedText>
      </View>
    </View>
    <Ionicons
      name={selected ? "radio-button-on" : "radio-button-off"}
      size={22}
      color={selected ? activeColor : "#CCC"}
    />
  </Pressable>
);

const SummaryRow = ({ label, value, color }: any) => (
  <View style={styles.summaryRow}>
    <ThemedText style={styles.summaryLabel}>{label}</ThemedText>
    <ThemedText style={[styles.summaryValue, { color }]}>
      ₦{value.toLocaleString()}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  sheetTitle: { fontSize: 18, fontWeight: "800" },
  providerSub: { fontSize: 13, opacity: 0.5 },
  priceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#0BB45E10",
  },
  mainPrice: { fontSize: 18, fontWeight: "900" },
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 60,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.4,
    marginTop: 24,
    marginBottom: 12,
  },
  row: { flexDirection: "row", gap: 10 },
  chip: {
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { fontWeight: "700", fontSize: 13 },
  selectionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: { fontSize: 15, fontWeight: "600" },
  modeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  modeIconLabel: { flexDirection: "row", gap: 12, alignItems: "center" },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modeTitle: { fontSize: 15, fontWeight: "700" },
  modeSub: { fontSize: 12, opacity: 0.5 },
  summaryBox: { padding: 16, borderRadius: 16, marginTop: 25, borderWidth: 1 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: { fontSize: 14, opacity: 0.6, fontWeight: "500" },
  summaryValue: { fontSize: 14, fontWeight: "700" },
  divider: { height: 1, marginVertical: 12 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 15, fontWeight: "800" },
  totalValue: { fontSize: 22, fontWeight: "900" },
  footer: { marginTop: 30, width: "100%" },
  flexCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    opacity: 0.5,
    marginBottom: 4,
  },
  addressCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  addressInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  addressActionBtn: {
    paddingLeft: 10,
  },
  noteContainer: { marginTop: 4 },
  noteLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    height: 80,
    padding: 12,
    textAlignVertical: "top",
    fontSize: 14,
  },
});

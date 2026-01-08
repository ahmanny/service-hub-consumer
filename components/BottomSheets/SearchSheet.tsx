import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BackHandler,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  SlideOutLeft,
} from "react-native-reanimated";

import { SERVICE_META, ServiceType } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useService } from "@/providers/service.provider";
import BookingSetup from "../BookingRequest/BookingSetup";
import { ThemedText } from "../ui/Themed";
import ThemedCard from "../ui/Themed/ThemedCard";

const AVAILABLE_SERVICES: ServiceType[] = [
  "barber",
  "hair_stylist",
  "electrician",
  "plumber",
  "house_cleaning",
];

export default function SearchSheet() {
  const {
    activeSheet,
    setActiveSheet,
    setSelectedService,
    selectedService,
    setBookingSetup,
  } = useService();

  const [state, setState] = useState<"search" | "setup">("search");
  const [query, setQuery] = useState("");
  const [currentSheetIndex, setCurrentSheetIndex] = useState<number>(0);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const colors = {
    text: useThemeColor({}, "text"),
    placeholder: useThemeColor({}, "placeholder"),
    border: useThemeColor({}, "border"),
    background: useThemeColor({}, "background"),
    tint: "#0BB45E",
  };

  //  FILTER LOGIC
  const filteredServices = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return AVAILABLE_SERVICES;
    return AVAILABLE_SERVICES.filter((s) =>
      SERVICE_META[s].label.toLowerCase().includes(q)
    );
  }, [query]);

  // BACK PRESS LOGIC (STRICT)
  useEffect(() => {
    const onBackPress = () => {
      if (state === "setup") {
        setState("search");
        return true;
      }
      if (currentSheetIndex > 0) {
        bottomSheetRef.current?.snapToIndex(0);
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [state, currentSheetIndex]);

  // ACTIONS
  const handleSelect = (item: ServiceType) => {
    Keyboard.dismiss();
    setSelectedService(item);
    setState("setup");
  };

  const handleBookingSetup = () => {
    Keyboard.dismiss();
    setActiveSheet("providers");
  };

  useEffect(() => {
    if (activeSheet !== "search") {
      bottomSheetRef.current?.close();
    }
  }, [activeSheet]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={activeSheet === "search" ? 0 : -1}
      snapPoints={["18%", "95%"]}
      enablePanDownToClose={false}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustPan"
      backgroundStyle={{ backgroundColor: colors.background }}
      onChange={(index) => setCurrentSheetIndex(index)}
    >
      {state === "setup" ? (
        <Animated.View
          // entering={SlideInRight.duration(250)}
          entering={FadeIn.duration(250)}
          exiting={SlideOutLeft}
          style={{ flex: 1 }}
        >
          <BookingSetup
            selectedService={selectedService!}
            handleBookingSetup={handleBookingSetup}
            setBookingSetup={setBookingSetup}
          />
        </Animated.View>
      ) : (
        <BottomSheetView style={styles.sheetContent}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut.duration(150)}
            style={{ flex: 1 }}
            layout={LinearTransition}
          >
            {/* SEARCH INPUT */}
            <View style={styles.searchHeader}>
              <Ionicons
                name="search"
                size={20}
                color={colors.placeholder}
                style={styles.searchIcon}
              />
              <BottomSheetTextInput
                placeholder="What service do you need?"
                placeholderTextColor={colors.placeholder}
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.text },
                ]}
                value={query}
                onChangeText={setQuery}
                onFocus={() => bottomSheetRef.current?.snapToIndex(1)}
              />
              {query.length > 0 && (
                <TouchableOpacity
                  onPress={() => setQuery("")}
                  style={styles.clearButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.placeholder}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* LIST SECTION */}
            {currentSheetIndex > 0 && (
              <Animated.View entering={FadeIn.delay(100)} style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Available Services</Text>
                <FlatList
                  data={filteredServices}
                  keyExtractor={(item) => item}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.listContainer}
                  renderItem={({ item }) => (
                    <ServiceItem
                      item={item}
                      onPress={() => handleSelect(item)}
                      color={colors.text}
                    />
                  )}
                />
              </Animated.View>
            )}
          </Animated.View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}

// SUB-COMPONENT FOR CLEANER FLATLIST
function ServiceItem({
  item,
  onPress,
  color,
}: {
  item: ServiceType;
  onPress: () => void;
  color: string;
}) {
  const meta = SERVICE_META[item];
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedCard style={styles.serviceCard}>
        <View style={styles.serviceRow}>
          <View style={styles.iconContainer}>
            <FontAwesome6 name={meta.icon} size={18} color="#0BB45E" />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText type="defaultSemiBold">{meta.label}</ThemedText>
            <ThemedText style={[styles.serviceSubtitle, { color }]}>
              {meta.description}
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
        </View>
      </ThemedCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sheetContent: { flex: 1, paddingHorizontal: 16 },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  searchIcon: { position: "absolute", left: 16, zIndex: 1 },
  clearButton: { position: "absolute", right: 12 },
  input: {
    flex: 1,
    height: 54,
    borderWidth: 1,
    borderRadius: 16,
    paddingLeft: 48,
    paddingRight: 40,
    fontSize: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#888",
    marginBottom: 12,
    marginLeft: 4,
  },
  listContainer: { gap: 12, paddingBottom: 40 },
  serviceCard: {
    padding: 16,
    borderRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  serviceRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(11, 180, 94, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceSubtitle: { fontSize: 13, opacity: 0.6, marginTop: 2 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  backButtonText: { fontSize: 16, fontWeight: "600" },
});

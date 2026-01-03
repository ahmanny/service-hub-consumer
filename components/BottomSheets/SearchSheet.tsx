import { SERVICE_META, ServiceType } from "@/constants/services";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useService } from "@/providers/service.provider";
import { FontAwesome6 } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BookingSetup from "../Booking/BookingSetup";
import { ThemedText } from "../ui/Themed";
import ThemedCard from "../ui/Themed/ThemedCard";

const AVAILABLE_SERVICES: ServiceType[] = [
  "barber",
  "hair_stylist",
  "electrician",
  "plumber",
  "house_cleaning",
];
const RECENT_SERVICES: ServiceType[] = [
  "barber",
  "electrician",
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
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [currentSheetIndex, setCurrentSheetIndex] = useState<number>(0);
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "placeholder");
  const inputBorder = useThemeColor({}, "border");
  const styles = createStyles({ textColor, inputBorder });

  const handleSelectServices = async (item: ServiceType) => {
    // Close UI immediately
    Keyboard.dismiss();
    setSelectedService(item);

    setState("setup");
  };

  const handleBookingSetup = () => {
    // Close UI immediately
    Keyboard.dismiss();
    setActiveSheet("providers");
  };

  const expandSheet = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  const filteredServices = React.useMemo(() => {
    if (!query || !query.trim()) {
      return AVAILABLE_SERVICES;
    }

    const q = query.toLowerCase();

    return AVAILABLE_SERVICES.filter((service) =>
      SERVICE_META[service].label.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (activeSheet !== "search") {
      bottomSheetRef.current?.close();
    }
  }, [activeSheet]);

  useEffect(() => {
    const onBackPress = () => {
      if (state === "setup") {
        setState("search");
        return true;
      }

      if (state === "search" && currentSheetIndex > 0) {
        console.log("Collapsing sheet", currentSheetIndex);
        bottomSheetRef.current?.snapToIndex(0);
        return true;
      }

      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [state, currentSheetIndex]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={activeSheet === "search" ? 0 : -1}
      snapPoints={["95%", "95%"]}
      enablePanDownToClose={false}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustPan"
      backgroundStyle={{
        backgroundColor: useThemeColor({}, "background"),
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }}
      onChange={(index) => setCurrentSheetIndex(index)}
    >
      {state === "setup" ? (
        <Animated.View
          entering={SlideInRight.duration(250)}
          exiting={SlideOutLeft.duration(200)}
          style={{ flex: 1 }}
        >
          <BookingSetup
            selectedService={selectedService!}
            handleBookingSetup={handleBookingSetup}
            setBookingSetup={setBookingSetup}
          />
        </Animated.View>
      ) : (
        <BottomSheetView style={{ flex: 1, padding: 16, gap: 20 }}>
          {/* search part */}
          <Animated.View
            entering={FadeIn.duration(250)}
            exiting={FadeOut.duration(200)}
            style={{ flex: 1, gap: 20 }}
          >
            <View style={styles.inputRow}>
              <TextInput
                placeholder="What service are you looking for?"
                placeholderTextColor={placeholderColor}
                style={styles.input}
                value={query}
                onChangeText={setQuery}
                onFocus={expandSheet}
                onPress={expandSheet}
              />
            </View>

            {/* Recent / Suggested Services */}
            <View style={styles.recentContainer}>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              <FlatList
                data={RECENT_SERVICES}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollToOverflowEnabled
                contentContainerStyle={{ gap: 8 }}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const meta = SERVICE_META[item];
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        handleSelectServices(item);
                      }}
                    >
                      <ThemedCard>
                        <Text style={styles.recentText}>{meta.label}</Text>
                      </ThemedCard>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            {currentSheetIndex > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Available Services</Text>
                <FlatList
                  data={filteredServices}
                  keyExtractor={(item) => item}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ gap: 12 }}
                  renderItem={({ item }) => {
                    const meta = SERVICE_META[item];

                    return (
                      <TouchableOpacity
                        onPress={() => {
                          handleSelectServices(item);
                        }}
                      >
                        <ThemedCard style={styles.serviceCard}>
                          <View style={styles.serviceRow}>
                            <View style={styles.iconContainer}>
                              <FontAwesome6
                                name={meta.icon}
                                size={18}
                                color="#0BB45E"
                              />
                            </View>

                            <View style={{ flex: 1 }}>
                              <ThemedText type="defaultSemiBold">
                                {meta.label}
                              </ThemedText>
                              <ThemedText style={styles.serviceSubtitle}>
                                {meta.description}
                              </ThemedText>
                            </View>
                          </View>
                        </ThemedCard>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            )}
          </Animated.View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}

function createStyles({
  inputBorder,
  textColor,
}: {
  textColor: any;
  inputBorder: any;
}) {
  return StyleSheet.create({
    recentContainer: {
      overflow: "scroll",
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8, // spacing between input and button
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: textColor,
      borderWidth: 1,
      borderColor: inputBorder,
      height: 50,
      borderRadius: 10,
      paddingLeft: 15,
    },

    recentTitle: {
      fontWeight: "600",
      marginBottom: 12,
      fontSize: 16,
      color: textColor,
    },
    recentText: {
      fontSize: 14,
      color: textColor,
    },
    sectionTitle: {
      textAlign: "center",
      fontWeight: "700",
      marginBottom: 12,
      fontSize: 16,
      color: textColor,
    },
    serviceCard: {
      padding: 14,
      borderRadius: 16,
    },

    serviceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },

    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(0,0,0,0.06)",
      alignItems: "center",
      justifyContent: "center",
    },

    icon: {
      fontSize: 22,
    },

    serviceSubtitle: {
      fontSize: 13,
      color: textColor,
      opacity: 0.6,
      marginTop: 2,
    },
  });
}

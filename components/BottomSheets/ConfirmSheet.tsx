import { useThemeColor } from "@/hooks/use-theme-color";
import { useService } from "@/providers/service.provider";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { BookingConfirmationCard } from "../BookingRequest/BookingConfirmationCard";
import { ThemedButton, ThemedText } from "../ui/Themed";

export default function ConfirmSheet() {
  const {
    selectedProvider,
    activeSheet,
    bookingSetup,
    setActiveSheet,
    setBookingSetup,
  } = useService();

  const bookingBottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (activeSheet !== "confirm") {
      bookingBottomSheetRef.current?.close();
    }
    if (!selectedProvider) {
      bookingBottomSheetRef.current?.close();
    }
  }, [activeSheet]);

  useEffect(() => {
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      if (activeSheet === "confirm") {
        bookingBottomSheetRef.current?.snapToIndex(0);
      }
    });

    return () => {
      hideSub.remove();
    };
  }, [activeSheet]);

  return (
    <BottomSheet
      ref={bookingBottomSheetRef}
      index={activeSheet === "confirm" ? 1 : -1}
      snapPoints={["50%"]}
      enablePanDownToClose={false}
      animateOnMount={true}
      backgroundStyle={{
        backgroundColor: useThemeColor({}, "background"),
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10,
      }}
    >
      <BottomSheetView style={{ flex: 1, padding: 16, gap: 12 }}>
        {selectedProvider && (
          <View style={{ flex: 1 }}>
            <ThemedText type="defaultSemiBold" style={styles.sheetTitle}>
              Review Booking
            </ThemedText>

            <BookingConfirmationCard
              provider={selectedProvider}
              bookingSetup={bookingSetup!}
              onNoteChange={(note: string) =>
                setBookingSetup({ ...bookingSetup!, note: note })
              }
            />

            <View style={styles.footer}>
              <ThemedButton
                title="Confirm & Request"
                variant="primary"
                onPress={() => {
                  Keyboard.dismiss();
                  setActiveSheet("waiting");
                }}
              />
            </View>
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetTitle: { fontSize: 20, marginBottom: 20, textAlign: "center" },
  footer: { marginTop: "auto", paddingTop: 20 },
});

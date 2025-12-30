import { useThemeColor } from "@/hooks/use-theme-color";
import { useService } from "@/providers/service.provider";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { Keyboard } from "react-native";
import BookingSetup from "../Booking/BookingSetup";

export default function BookingSetupSheet() {
  const { selectedService, activeSheet, setActiveSheet, setBookingSetup } =
    useService();

  const bookingBottomSheetRef = useRef<BottomSheet>(null);

  const handleBookingSetup = () => {
    // Close UI immediately
    Keyboard.dismiss();
    setActiveSheet("providers");
  };

  useEffect(() => {
    if (activeSheet !== "booking_setup") {
      bookingBottomSheetRef.current?.close();
    }
    if (!selectedService) {
      bookingBottomSheetRef.current?.close();
    }
  }, [activeSheet]);

  return (
    <BottomSheet
      ref={bookingBottomSheetRef}
      index={activeSheet === "booking_setup" ? 1 : -1}
      snapPoints={["30%"]}
      enablePanDownToClose={false}
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
        <BookingSetup
          selectedService={selectedService!}
          handleBookingSetup={handleBookingSetup}
          setBookingSetup={setBookingSetup}
        />
      </BottomSheetView>
    </BottomSheet>
  );
}

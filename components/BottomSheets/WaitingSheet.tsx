import { useThemeColor } from "@/hooks/use-theme-color";
import { useService } from "@/providers/service.provider";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { WaitingBooking } from "../Booking/WaitingBooking";

export default function WaitingSheet() {
  const { selectedProvider, activeSheet, bookingSetup } = useService();

  const bookingBottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (activeSheet !== "waiting") {
      bookingBottomSheetRef.current?.close();
    }
    if (!selectedProvider) {
      bookingBottomSheetRef.current?.close();
    }
  }, [activeSheet]);

  return (
    <BottomSheet
      ref={bookingBottomSheetRef}
      index={activeSheet === "waiting" ? 1 : -1}
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
        <WaitingBooking providerFirstName="Solomone" />
      </BottomSheetView>
    </BottomSheet>
  );
}

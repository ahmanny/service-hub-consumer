import { useThemeColor } from "@/hooks/use-theme-color";
import { useProviderDetails } from "@/hooks/useSearchProviders";
import { useService } from "@/providers/service.provider";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { BookingCard } from "../Booking/BookingCard";
import { BookingCardSkeleton } from "../skeletons/BookingCardSkeleton";
import { ThemedButton } from "../ui/Themed";

export default function BookingSheet() {
  const { selectedProvider, activeSheet, bookingSetup } = useService();

  const { data, isFetching } = useProviderDetails({
    providerId: selectedProvider?._id,
    enabled: activeSheet === "booking",
  });

  const bookingBottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (data) {
      console.log(activeSheet);
      console.log("Provider", data.provider);
    }
  }, [data]);

  useEffect(() => {
    if (activeSheet !== "booking") {
      bookingBottomSheetRef.current?.close();
    }
    if (!selectedProvider) {
      bookingBottomSheetRef.current?.close();
    }
  }, [activeSheet]);

  return (
    <BottomSheet
      ref={bookingBottomSheetRef}
      index={activeSheet === "booking" ? 1 : -1}
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
        {isFetching ? (
          <BookingCardSkeleton />
        ) : (
          <>
            {selectedProvider && data && (
              <BookingCard
                provider={{
                  ...selectedProvider,
                  homeServiceAvailable: data.provider.homeServiceAvailable,
                  services: data.provider.services,
                }}
                bookingSetup={bookingSetup}
              />
            )}
            <ThemedButton
              title="Confirm Booking"
              variant="primary"
              // onPress={() => console.log("Booking:", selectedProvider)}
              // disabled={!selectedProvider}
            />
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}

import { useSendBookingRequest } from "@/hooks/consumer/useBooking";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useService } from "@/providers/service.provider";
import { ApiError } from "@/types/api.error.types";
import { BookingRequestPayload, GeoAddress } from "@/types/booking.types";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { Alert, Platform, ToastAndroid } from "react-native";
import { WaitingBooking } from "../BookingRequest/WaitingBooking";
import { WaitingBookingSkeleton } from "../skeletons/WaitingBookingSkeleton";

export default function WaitingSheet() {
  const {
    selectedProvider,
    activeSheet,
    bookingSetup,
    userLocation,
    setActiveSheet,
  } = useService();
  const [bookingId, setBookingId] = React.useState<string>("");
  const [bookingStatus, setBookingStatus] = React.useState("pending");

  const { mutateAsync: sendBooking, isPending } = useSendBookingRequest();

  const bookingBottomSheetRef = useRef<BottomSheet>(null);
  const hasSubmittedRef = useRef(false);

  // Handle sheet visibility
  useEffect(() => {
    if (activeSheet !== "waiting" || !selectedProvider) {
      bookingBottomSheetRef.current?.close();
    }
  }, [activeSheet, selectedProvider]);

  // Submit booking when waiting sheet mounts
  useEffect(() => {
    if (activeSheet !== "waiting") return;
    if (!selectedProvider || !bookingSetup) return;
    if (hasSubmittedRef.current) return;

    hasSubmittedRef.current = true;

    const submitBooking = async () => {
      const addressText =
        bookingSetup.locationSource === "manual"
          ? bookingSetup.addressText
          : null;

      const geoAddress: GeoAddress | null =
        bookingSetup.locationSource === "current"
          ? {
              type: "Point",
              coordinates: [userLocation[0], userLocation[1]],
            }
          : null;

      try {
        const payload: BookingRequestPayload = {
          providerId: selectedProvider._id,
          service: bookingSetup.service,
          serviceName: selectedProvider.serviceName,
          scheduledAt: bookingSetup.bookingDateTime,
          locationType: bookingSetup.locationType === "shop" ? "shop" : "home",
          geoAddress,
          textAddress: addressText,
          note: bookingSetup.note ?? null,
        };

        const response = await sendBooking(payload);
        setBookingId(response.bookingId);
        setBookingStatus(response.status);

        // Log backend response
        console.log("Booking request response:", response);
      } catch (error) {
        const err = error as ApiError;
        const message =
          err.response?.data?.message ??
          err.message ??
          "Failed to send booking";

        console.error("Booking request error:", err);

        if (Platform.OS === "android") {
          ToastAndroid.show(message, ToastAndroid.LONG);
        } else {
          Alert.alert("Error", message);
        }

        hasSubmittedRef.current = false;
        // setActiveSheet("confirm");
      }
    };

    submitBooking();
  }, [activeSheet]);

  return (
    <BottomSheet
      ref={bookingBottomSheetRef}
      index={activeSheet === "waiting" ? 0 : -1}
      snapPoints={["30%"]}
      enablePanDownToClose={false}
      backgroundStyle={{
        backgroundColor: useThemeColor({}, "background"),
      }}
    >
      <BottomSheetView style={{ flex: 1, padding: 8 }}>
        {isPending ? (
          <WaitingBookingSkeleton />
        ) : (
          <WaitingBooking
            providerFirstName={selectedProvider?.firstName ?? ""}
            bookingId={bookingId}
          />
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}

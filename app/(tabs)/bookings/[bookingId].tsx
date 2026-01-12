import BookingDetailsScreen from "@/components/screens/BookingDetailsScreen";
import BookingDetailsSkeleton from "@/components/skeletons/BookingDetailsSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { MOCK_BOOKING_DATA } from "@/data/testDatas";
import { useBookingDetails } from "@/hooks/consumer/useBooking";
import * as Burnt from "burnt";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";

export default function BookingPage() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  const { newBooking } = useLocalSearchParams<{ newBooking: string }>();

  useEffect(() => {
    if (newBooking === "true") {
      Burnt.toast({
        title: "Success!",
        preset: "done",
        message: "Booking request sent",
        haptic: "success",
        duration: 20,
      });
    }
  }, [newBooking]);

  const { data, isLoading, error, refetch, isRefetching } = useBookingDetails({
    bookingId,
  });

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  // BookingDetailsSkeleton

  if (isLoading) {
    return (
      <>
        {/* <Stack.Screen options={{ title: "Loading..." }} /> */}
        <BookingDetailsSkeleton />
      </>
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        message={error?.message || "We couldn't find this provider."}
        onRetry={onRefresh}
      />
    );
  }

  const booking = MOCK_BOOKING_DATA;

  return (
    <BookingDetailsScreen
      booking={data}
      isRefetching={isRefetching}
      onRefresh={onRefresh}
    />
  );
}

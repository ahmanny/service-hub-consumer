import BookingDetailsScreen from "@/components/screens/BookingDetailsScreen";
import BookingDetailsSkeleton from "@/components/skeletons/BookingDetailsSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
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
        title: "Booking Requested",
        message: "We've sent your request to the provider.",
        preset: "done",
        haptic: "success",
        duration: 3,
        shouldDismissByDrag: true,
      });
    }
  }, [newBooking]);

  const { data, isLoading, error, refetch, isRefetching } = useBookingDetails({
    bookingId,
  });

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <>
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

  return (
    <BookingDetailsScreen
      booking={data}
      isRefetching={isRefetching}
      onRefresh={onRefresh}
    />
  );
}

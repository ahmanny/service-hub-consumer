import { useFetchBookings } from "@/hooks/consumer/useBooking";
import React from "react";
import { BookingSectionListSkeleton } from "../skeletons/BookingSectionListSkeleton";
import { BookingSectionList } from "./BookingSectionList";

export default function UpcomingBookings() {
  const {
    data,
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useFetchBookings({ tab: "upcoming" });

  if (isLoading) {
    return <BookingSectionListSkeleton />;
  }

  //  API failures
  if (isError) {
    return (
      <BookingSectionList
        bookings={[]}
        emptyText="Failed to load history. Pull to refresh."
        isRefetching={isRefetching}
        refetch={refetch}
      />
    );
  }

  return (
    <BookingSectionList
      bookings={data?.results ?? []}
      emptyText="You have no upcoming bookings."
      isRefetching={isRefetching}
      refetch={refetch}
    />
  );
}

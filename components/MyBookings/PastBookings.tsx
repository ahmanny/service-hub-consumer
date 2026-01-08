import { useFetchBookings } from "@/hooks/consumer/useBooking";
import { BookingListItem } from "@/types/booking.types";
import React from "react";
import { BookingSectionListSkeleton } from "../skeletons/BookingSectionListSkeleton";
import { BookingSectionList } from "./BookingSectionList";

const MOCK_BOOKINGS_HISTORY: BookingListItem[] = [
  {
    _id: "101",
    serviceName: "Basic Haircut",
    price: 2500,
    scheduledAt: "2025-11-05T10:00:00Z",
    locationLabel: "Come to shop",
    status: "completed",
    serviceType: "barber",
  },
  {
    _id: "102",
    serviceName: "Haircut + Beard Trim",
    price: 3500,
    scheduledAt: "2025-11-12T14:30:00Z",
    locationLabel: "Home service",
    status: "completed",
    serviceType: "barber",
  },
  {
    _id: "103",
    serviceName: "Kids Haircut",
    price: 2000,
    scheduledAt: "2025-11-18T09:00:00Z",
    locationLabel: "Come to shop",
    status: "cancelled",
    serviceType: "barber",
  },
  {
    _id: "104",
    serviceName: "Premium Full Grooming",
    price: 4000,
    scheduledAt: "2025-10-25T16:00:00Z",
    locationLabel: "Home service",
    status: "completed",
    serviceType: "barber",
  },
  {
    _id: "105",
    serviceName: "Wiring & Rewiring",
    price: 8000,
    scheduledAt: "2025-10-20T11:30:00Z",
    locationLabel: "Home service",
    status: "completed",
    serviceType: "electrician",
  },
  {
    _id: "106",
    serviceName: "Kitchen Cleaning",
    price: 6000,
    scheduledAt: "2025-10-15T13:00:00Z",
    locationLabel: "Home service",
    status: "cancelled",
    serviceType: "house_cleaning",
  },
  {
    _id: "107",
    serviceName: "Beard Trim",
    price: 1500,
    scheduledAt: "2025-09-30T17:30:00Z",
    locationLabel: "Come to shop",
    status: "completed",
    serviceType: "barber",
  },
  {
    _id: "108",
    serviceName: "Hair Treatment",
    price: 5000,
    scheduledAt: "2025-09-22T12:00:00Z",
    locationLabel: "Home service",
    status: "completed",
    serviceType: "hair_stylist",
  },
  {
    _id: "109",
    serviceName: "Basic Haircut",
    price: 2600,
    scheduledAt: "2025-09-10T18:00:00Z",
    locationLabel: "Come to shop",
    status: "cancelled",
    serviceType: "barber",
  },
  {
    _id: "110",
    serviceName: "Full Grooming Package",
    price: 4500,
    scheduledAt: "2025-08-28T15:45:00Z",
    locationLabel: "Home service",
    status: "completed",
    serviceType: "barber",
  },
  {
    _id: "111",
    serviceName: "Kids Haircut",
    price: 2000,
    scheduledAt: "2025-08-15T11:00:00Z",
    locationLabel: "Come to shop",
    status: "completed",
    serviceType: "barber",
  },
  {
    _id: "112",
    serviceName: "Beard Trim",
    price: 1400,
    scheduledAt: "2025-08-05T10:15:00Z",
    locationLabel: "Home service",
    status: "cancelled",
    serviceType: "barber",
  },
];

export default function PastBookings() {
  const { data, isLoading, isRefetching, isError, refetch } = useFetchBookings({
    tab: "past",
  });

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
      emptyText="You have no past bookings."
      isRefetching={isRefetching}
      refetch={refetch}
    />
  );
}

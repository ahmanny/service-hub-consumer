import { useFetchBookings } from "@/hooks/consumer/useBooking";
import { BookingListItem } from "@/types/booking.types";
import React from "react";
import { BookingSectionListSkeleton } from "../skeletons/BookingSectionListSkeleton";
import { BookingSectionList } from "./BookingSectionList";

const MOCK_BOOKINGS: BookingListItem[] = [
  {
    _id: "1",
    serviceName: "Hair Treatment",
    price: 5000,
    scheduledAt: "2024-03-10T14:30:00Z",
    locationLabel: "Come to shop",
    status: "pending",
    serviceType: "hair_stylist",
  },
  {
    _id: "2",
    serviceName: "Basic Haircut",
    price: 2500,
    scheduledAt: "2024-03-12T10:00:00Z",
    locationLabel: "Home service",
    status: "pending",
    serviceType: "barber",
  },
  {
    _id: "3",
    serviceName: "Haircut + Beard Trim",
    price: 2500,
    scheduledAt: "2026-03-12T14:30:00Z",
    locationLabel: "Home service",
    status: "pending",
    serviceType: "barber",
  },
  {
    _id: "4",
    serviceName: "Wiring & Rewiring",
    price: 2500,
    scheduledAt: "2026-02-05T11:30:00Z",
    locationLabel: "Come to shop",
    status: "pending",
    serviceType: "electrician",
  },
  {
    _id: "5",
    serviceName: "Premium Full Grooming",
    price: 2800,
    scheduledAt: "2026-02-08T09:00:00Z",
    locationLabel: "Home service",
    status: "pending",
    serviceType: "barber",
  },
  {
    _id: "6",
    serviceName: "Kids Haircut",
    price: 2000,
    scheduledAt: "2026-02-18T15:45:00Z",
    locationLabel: "Come to shop",
    status: "pending",
    serviceType: "barber",
  },
  {
    _id: "7",
    serviceName: "Kitchen Cleaning",
    price: 2500,
    scheduledAt: "2026-01-10T13:00:00Z",
    locationLabel: "Home service",
    status: "pending",
    serviceType: "house_cleaning",
  },
  {
    _id: "8",
    serviceName: "Beard Trim",
    price: 1500,
    scheduledAt: "2026-01-12T17:30:00Z",
    locationLabel: "Come to shop",
    status: "pending",
    serviceType: "barber",
  },
  {
    _id: "9",
    serviceName: "Haircut",
    price: 2600,
    scheduledAt: "2026-01-20T12:00:00Z",
    locationLabel: "Home service",
    status: "pending",
    serviceType: "barber",
  },
  {
    _id: "10",
    serviceName: "Haircut",
    price: 2700,
    scheduledAt: "2026-01-25T18:00:00Z",
    locationLabel: "Come to shop",
    status: "pending",
    serviceType: "barber",
  },
  {
    _id: "11",
    serviceName: "Beard Trim",
    price: 1400,
    scheduledAt: "2025-12-05T10:15:00Z",
    locationLabel: "Home service",
    status: "pending",
    serviceType: "barber",
  },
  {
    _id: "12",
    serviceName: "Haircut",
    price: 2500,
    scheduledAt: "2025-12-10T14:00:00Z",
    locationLabel: "Come to shop",
    status: "pending",
    serviceType: "barber",
  },
  {
    _id: "13",
    serviceName: "Haircut",
    price: 3000,
    scheduledAt: "2025-12-18T16:30:00Z",
    locationLabel: "Home service",
    status: "pending",
    serviceType: "barber",
  },
  {
    _id: "14",
    serviceName: "Kids Haircut",
    price: 2000,
    scheduledAt: "2025-12-22T11:00:00Z",
    locationLabel: "Come to shop",
    status: "pending",
    serviceType: "barber",
  },
  {
    _id: "15",
    serviceName: "Haircut",
    price: 2800,
    scheduledAt: "2025-12-28T15:00:00Z",
    locationLabel: "Home service",
    status: "pending",
    serviceType: "barber",
  },
  {
    _id: "16",
    serviceName: "Haircut",
    price: 2500,
    scheduledAt: "2026-03-12T14:30:00Z",
    locationLabel: "Home service",
    status: "pending",
    serviceType: "barber",
  },
  {
    _id: "17",
    serviceName: "Beard Trim",
    price: 1500,
    scheduledAt: "2026-03-15T10:00:00Z",
    locationLabel: "Come to shop",
    status: "pending",
    serviceType: "barber",
  },
];

export default function PendingBookings() {
  const { data, isLoading, isRefetching, isError, refetch } = useFetchBookings({
    tab: "pending",
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
      emptyText="You have no pending bookings."
      isRefetching={isRefetching}
      refetch={refetch}
    />
  );
}

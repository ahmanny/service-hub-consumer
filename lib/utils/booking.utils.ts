import { BookingStatus } from "@/types/booking.types";

export const BOOKING_STATUS_MAP: Record<BookingStatus, { color: string; label: string }> = {
  pending: { color: "#FFB800", label: "Pending Approval" },
  accepted: { color: "#0BB45E", label: "Booking Accepted" },
  declined: { color: "#FF3B30", label: "Request Declined" },
  completed: { color: "#007AFF", label: "Service Completed" },
  cancelled: { color: "#8E8E93", label: "Booking Cancelled" },
};
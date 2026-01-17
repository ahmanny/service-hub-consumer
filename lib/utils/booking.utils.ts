import { BookingStatus } from "@/types/booking.types";

export const BOOKING_STATUS_MAP: Record<BookingStatus, { color: string; label: string }> = {
  pending: {
    color: "#FFB800", // Amber/Gold
    label: "Pending Approval"
  },
  accepted: {
    color: "#0BB45E", // Brand Green
    label: "Confirmed"
  },
  declined: {
    color: "#FF3B30", // Bright Red
    label: "Request Declined"
  },
  completed: {
    color: "#007AFF", // System Blue
    label: "Completed"
  },
  cancelled: {
    color: "#8E8E93", // Standard Grey
    label: "Cancelled"
  },
  expired: {
    color: "#5856D6",
    label: "Request Expired"
  },
  // for when i add in progress status
  // in_progress: { color: "#32ADE6", label: "Service in Progress" }
};
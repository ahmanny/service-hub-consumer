


import { fetchBookingDetails, fetchBookings, sendRequest } from "@/services/booking.service";
import { BookingListItem, fetchBookingsParams } from "@/types/booking.types";
import { useMutation, useQuery } from "@tanstack/react-query";

interface FetchBookingsResponce {
    results: BookingListItem[],
    pagination: any
}

export const useSendBookingRequest = () => {
    return useMutation({
        mutationFn: sendRequest,
        onSuccess: (data) => {
            console.log("Booking created:", data);
        },
    });
};

export const useFetchBookings = (params: fetchBookingsParams) => {
    return useQuery<FetchBookingsResponce, Error>({
        queryKey: ["fetch-bookings", params],
        queryFn: () => fetchBookings(params),
        refetchOnWindowFocus: false,
    });
};

export const useBookingDetails = ({ bookingId }: { bookingId?: string, }) => {
    return useQuery({
        queryKey: ["booking-details", bookingId],
        queryFn: () => fetchBookingDetails({ bookingId: bookingId }),
        enabled: !!bookingId,
        refetchOnWindowFocus: false,
        retry: 3
    });
};
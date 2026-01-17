import API from "@/lib/axios";
import { BookingActionPayload, BookingDetails, BookingRequestPayload, fetchBookingsParams } from "@/types/booking.types";



export const sendRequest = async (payload: BookingRequestPayload) => {
    const { data } = await API.post("/bookings/request", payload);
    return data
};
export const fetchBookings = async ({ limit, page, status, tab }: fetchBookingsParams) => {
    const params = new URLSearchParams({
        limit: limit?.toString() || "10",
        page: page?.toString() || "1",
    });
    if (status) params.append("status", status);
    if (tab) params.append("tab", tab);
    const { data } = await API.get(`/bookings?${params.toString()}`);
    return data
};


export async function fetchBookingDetails({ bookingId }: { bookingId: string }) {
    const { data } = await API
        .get(`/bookings/${bookingId}`);
    return data as BookingDetails;
}



export const handleBookingAction = async (payload: BookingActionPayload) => {
    const { bookingId, ...body } = payload;
    const { data } = await API.patch(`/bookings/${bookingId}/action`, body);
    return data;
};
export const fetchRescheduleData = async (bookingId: string) => {
    const { data } = await API.get(`/bookings/${bookingId}/reschedule-data`);
    return data;
};
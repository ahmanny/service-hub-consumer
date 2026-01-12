import API from "@/lib/axios";
import { BookingDetails, BookingRequestPayload, fetchBookingsParams } from "@/types/booking.types";



export const sendRequest = async (payload: BookingRequestPayload) => {
    console.log(payload)
    const { data } = await API.post("/booking/request", payload);
    return data
};
export const fetchBookings = async ({ limit, page, status, tab }: fetchBookingsParams) => {
    const params = new URLSearchParams({
        limit: limit?.toString() || "10",
        page: page?.toString() || "1",
    });
    if (status) params.append("status", status);
    if (tab) params.append("tab", tab);
    const { data } = await API.get(`/booking?${params.toString()}`);
    console.log(data)
    return data
};


export async function fetchBookingDetails({ bookingId }: { bookingId?: string }) {
    const { data } = await API
        .get(`/booking/${bookingId}`);
    return data as BookingDetails;
}
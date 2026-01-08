import API from "@/lib/axios";
import { BookingRequestPayload, fetchBookingsParams } from "@/types/booking.types";



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
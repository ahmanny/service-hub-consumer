import { BookingDetails } from "@/types/booking.types";
import { HomeData } from "@/types/home.types";

export const MOCK_HOME_DATA: HomeData = {
    user: {
        firstName: "Solomon",
        // location: "Yaba, Lagos",
    },
    upcomingBooking: {
        serviceName: "Haircut",
        scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        locationType: "home",
    },
    history: [
        {
            id: "1",
            serviceName: "Haircut",
            price: 2500,
            dateText: "Tue, 12 Mar",
            locationType: "Home service",
        },
        {
            id: "2",
            serviceName: "Cleaning",
            price: 8000,
            dateText: "Fri, 2 Feb",
            locationType: "Home service",
        },
    ],
};

export const MOCK_BOOKING_DATA: BookingDetails = {
    _id: "695a88a8eded7569b5363d26",
    serviceName: "Basic Haircut",
    serviceType: "barber",
    status: "cancelled",
    scheduledAt: "2026-03-12T14:30:00.000Z",
    createdAt: "2026-01-05T10:00:00.000Z",
    updatedAt: "2026-01-05T10:05:00.000Z",
    __v: 0,
    provider: {
        _id: "prov_9921",
        firstName: "Solomon",
        rating: 4.9,
        profilePicture: "https://i.pravatar.cc/150?img=2",
    },
    location: {
        type: "home",
        textAddress: "Block 4, Flat 12, Jakande Estate, Lekki, Lagos",
        geoAddress: {
            type: "Point",
            coordinates: [3.4756, 6.4474]
        }
    },
    price: {
        service: 3500,
        homeServiceFee: 2000,
        total: 5500
    }
};
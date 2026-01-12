import { BookingDetails } from "@/types/booking.types";
import { ProviderListItem } from "@/types/provider.types";

import { IProviderProfile } from "@/types/provider.types";

export const MOCK_PROVIDER_PROFILE: IProviderProfile = {
    _id: "650f1a2b3c4d5e6f7a8b9c0d",
    userId: "user_8829104",
    firstName: "Ahmanny",
    lastName: "Solomon",
    profilePicture: null,
    isAvailable: true,
    availabilityMode: "schedule",
    serviceType: "barber",
    basePriceFrom: 2500,
    homeServiceAvailable: true,
    rating: 4.8,
    isVerified: true,
    yearsOfExperience: 6,
    reviewCount: 128,
    distance: 2.4,

    services: [
        {
            name: "Standard Haircut",
            value: "standard_haircut",
            price: 2500,
        },
        {
            name: "Beard Trim & Shape",
            value: "beard_trim",
            price: 1500,
        },
        {
            name: "Home Service Premium",
            value: "premium_home",
            price: 5000,
        },
    ],

    shopAddress: {
        address: "12 Adeola Odeku St, Victoria Island, Lagos",
        city: "Victoria Island",
        state: "Lagos",
        location: {
            type: "Point",
            coordinates: [3.4245, 6.4311], // [longitude, latitude]
        },
    },
    availability: [
        { dayOfWeek: 0, slots: [], isClosed: true }, // Sunday
        { dayOfWeek: 1, slots: [{ start: "09:00", end: "18:00" }], isClosed: false }, // Monday
        { dayOfWeek: 2, slots: [{ start: "09:00", end: "18:00" }], isClosed: false }, // Tuesday
        { dayOfWeek: 3, slots: [{ start: "09:00", end: "18:00" }], isClosed: false }, // Wednesday
        { dayOfWeek: 4, slots: [{ start: "09:00", end: "20:00" }], isClosed: false }, // Thursday (Late shift)
        { dayOfWeek: 5, slots: [{ start: "09:00", end: "20:00" }], isClosed: false }, // Friday (Late shift)
        { dayOfWeek: 6, slots: [{ start: "10:00", end: "16:00" }], isClosed: false }, // Saturday
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



export const MOCK_PROVIDERS: ProviderListItem[] = [
    {
        _id: "p1",
        firstName: "Solomon",
        serviceType: "barber",
        availabilityMode: "instant",
        basePrice: 2500,
        rating: 4.9,
        profilePicture: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1",
        distance: 1.2,
        duration: 600,
        isClosest: true,
    },
    {
        _id: "prov-001",
        firstName: "John",
        serviceType: "plumber",
        availabilityMode: "schedule",
        basePrice: 5000,
        rating: 4.6,
        profilePicture: "https://i.pravatar.cc/150?img=1",
        distance: 0.8,
        duration: 480,
        isClosest: false,
    },
    {
        _id: "prov-002",
        firstName: "Samuel",
        serviceType: "electrician",
        availabilityMode: "instant",
        basePrice: 5000,
        rating: 4.4,
        profilePicture: "https://i.pravatar.cc/150?img=2",
        distance: 1.5,
        duration: 900,
        isClosest: false,
    },
    {
        _id: "prov-003",
        firstName: "Aisha",
        serviceType: "house_cleaning",
        availabilityMode: "schedule",
        basePrice: 5000,
        rating: 4.8,
        profilePicture: "https://i.pravatar.cc/150?img=40", // Fallback for null
        distance: 2.1,
        duration: 1200,
        isClosest: false,
    },
    {
        _id: "prov-004",
        firstName: "Grace",
        serviceType: "hair_stylist",
        availabilityMode: "instant",
        basePrice: 5000,
        rating: 4.9,
        profilePicture: "https://i.pravatar.cc/150?img=3",
        distance: 0.5,
        duration: 300,
        isClosest: true,
    },
    {
        _id: "prov-005",
        firstName: "Peter",
        serviceType: "barber",
        availabilityMode: "instant",
        basePrice: 5000,
        rating: 4.5,
        profilePicture: "https://i.pravatar.cc/150?img=4",
        distance: 3.2,
        duration: 1500,
        isClosest: false,
    },
    {
        _id: "prov-006",
        firstName: "Ruth",
        serviceType: "hair_stylist",
        availabilityMode: "schedule",
        basePrice: 5000,
        rating: 4.9,
        profilePicture: "https://i.pravatar.cc/150?img=41",
        distance: 1.1,
        duration: 700,
        isClosest: false,
    },
    {
        _id: "prov-009",
        firstName: "Ibrahim",
        serviceType: "plumber",
        availabilityMode: "instant",
        basePrice: 5000,
        rating: 4.3,
        profilePicture: "https://i.pravatar.cc/150?img=6",
        distance: 4.5,
        duration: 1800,
        isClosest: false,
    },
    {
        _id: "prov-010",
        firstName: "Ngozi",
        serviceType: "electrician",
        availabilityMode: "schedule",
        basePrice: 5000,
        rating: 4.7,
        profilePicture: "https://i.pravatar.cc/150?img=42",
        distance: 2.8,
        duration: 1100,
        isClosest: false,
    },
    {
        _id: "prov-013",
        firstName: "Kelvin",
        serviceType: "barber",
        availabilityMode: "instant",
        basePrice: 5000,
        rating: 4.4,
        profilePicture: "https://i.pravatar.cc/150?img=8",
        distance: 0.9,
        duration: 540,
        isClosest: false,
    },
    {
        _id: "prov-014",
        firstName: "Fatima",
        serviceType: "house_cleaning",
        availabilityMode: "instant",
        basePrice: 5000,
        rating: 4.6,
        profilePicture: "https://i.pravatar.cc/150?img=9",
        distance: 6.2,
        duration: 2400,
        isClosest: false,
    },
    {
        _id: "prov-016",
        firstName: "Abdul",
        serviceType: "plumber",
        availabilityMode: "schedule",
        basePrice: 5000,
        rating: 4.7,
        profilePicture: "https://i.pravatar.cc/150?img=10",
        distance: 1.7,
        duration: 950,
        isClosest: false,
    },
    {
        _id: "prov-017",
        firstName: "Zainab",
        serviceType: "hair_stylist",
        availabilityMode: "instant",
        basePrice: 5000,
        rating: 4.9,
        profilePicture: "https://i.pravatar.cc/150?img=43",
        distance: 0.4,
        duration: 240,
        isClosest: true,
    },
    {
        _id: "prov-018",
        firstName: "Emeka",
        serviceType: "barber",
        availabilityMode: "schedule",
        basePrice: 5000,
        rating: 4.3,
        profilePicture: "https://i.pravatar.cc/150?img=11",
        distance: 2.3,
        duration: 1300,
        isClosest: false,
    },
    {
        _id: "prov-020",
        firstName: "Tosin",
        serviceType: "plumber",
        availabilityMode: "instant",
        basePrice: 5000,
        rating: 4.4,
        profilePicture: "https://i.pravatar.cc/150?img=12",
        distance: 1.3,
        duration: 780,
        isClosest: false,
    }
];
import { ServiceType } from "@/constants/services";

export type GeoAddress = {
    type: "Point";
    coordinates: [number, number]; // lng, lat
};

export interface BookingRequestPayload {
    providerId: string;
    service: string;
    serviceName: string;
    scheduledAt: string;
    locationType: "shop" | "home";
    price?: {
        service: number
        homeServiceFee: number | null
        total: number
    }
    geoAddress?: GeoAddress | null;
    textAddress?: string | null;
    note?: string | null;
}

export type BookingStatus =
    | "pending"
    | "accepted"
    | "declined"
    | "completed"
    | "cancelled"
    | "expired";

type BookingBase = {
    _id: string;
    serviceName: string;
    serviceType: ServiceType;
    status: BookingStatus;
    scheduledAt: string;
    createdAt: string;
    updatedAt?: string;
    _v?: number;
};


export type BookingDetails = BookingBase & {
    provider: {
        _id: string;
        firstName: string;
        rating: number;
        profilePicture?: string | null;
    }
    location: {
        type: "home" | "shop";
        geoAddress?: GeoAddress;
        textAddress?: string;
    }
    price: {
        service: number
        homeServiceFee: number | null
        total: number
    }
    note?: string;
    declineReason?: string;
    expiredMessage?: string;

    scheduledAt: Date;
    deadlineAt?: Date;
    cancelledAt?: Date;
    declinedAt?: Date;
    acceptedAt?: Date;
    rescheduledAt?: Date;
}
export type BookingListItem = BookingBase & {
    price: number;
    locationLabel: string;
};








// Api payloads types
export interface fetchBookingsParams {
    tab?: "upcoming" | "past" | "pending" | "all";
    status?: BookingStatus;
    page?: number;
    limit?: number;
}

export type BookingActionPayload = {
    bookingId: string;
    action: "cancel" | "reschedule";
    reason?: string;
    newScheduledAt?: string;
};
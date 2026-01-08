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
    geoAddress?: GeoAddress | null;
    textAddress?: string | null;
    note?: string | null;
}

export type BookingStatus =
    | "pending"
    | "accepted"
    | "declined"
    | "completed"
    | "cancelled";

type BookingBase = {
    _id: string;
    serviceName: string;
    serviceType: ServiceType;
    status: BookingStatus;
    scheduledAt: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
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
}
export type BookingListItem = BookingBase & {
    price: number;
    locationLabel: string;
};


// export interface IBooking {
//     consumerId: Types.ObjectId;
//     providerId: Types.ObjectId;

//     service: string;
//     serviceName: string;

//     scheduledAt: Date;

//     location: {
//         type: "home" | "shop";
//         geoAddress?: GeoAddress;
//         textAddress?: string | IProviderShopAddress;
//     }

//     note?: string;

//     status: "pending" | "accepted" | "declined" | "completed" | "cancelled";
// }


export interface fetchBookingsParams {
    tab?: "upcoming" | "past" | "pending" | "all";
    status?: BookingStatus;
    page?: number;
    limit?: number;
}
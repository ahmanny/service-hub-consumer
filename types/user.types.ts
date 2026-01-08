export interface IConsumerAddress {
    _id: string;
    label: string; // e.g., "Home", "Work"
    formattedAddress: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    isDefault: boolean;
}


export interface ConsumerProfile {
    _id: string;
    userId: {
        _id: string;
        phone: string;
        email?: string;
        isEmailVerified: boolean;
        createdAt: string;
    };
    isVerified?: boolean
    firstName: string;
    lastName: string;
    fullName?: string;
    avatarUrl?: string;
    addresses?: IConsumerAddress[];
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}
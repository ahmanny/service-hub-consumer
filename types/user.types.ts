export interface ConsumerProfile {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    avatarUrl?: string;
    isEmailVerified: boolean;
    profileCompleted: boolean;
    provider: 'local' | 'google' | 'facebook';
    location?: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    }
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}
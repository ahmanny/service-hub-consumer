export interface ConsumerProfile {
    _id: string;
    userId:string
    firstName: string;
    lastName: string;
    email?: string;
    avatarUrl?: string;
    isEmailVerified: boolean;
    location?: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    }
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}
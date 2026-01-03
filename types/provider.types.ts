import { ServiceType } from "@/constants/services";

export interface ProviderProfile {
  _id: string;
  firstName: string;
  lastName: string;
  service: string;
  price: number;
  rating: number;
  location: {
    latitude: number;
    longitude: number;
  };
  profilePicture?: string | null; // optional, can be null
}

export interface ProviderWithRoute extends ProviderProfile {
  distance: number | null;               // in meters
  duration: number | null;               // in seconds
  directionCoordinates: any | null;      // geometry coordinates from directions API
  isCloser: boolean;                     // true for the nearest provider
}


export interface ProviderSearchResult {
  _id: string;
  firstName: string;
  serviceType: ServiceType;
  availabilityMode: "instant" | "schedule" | "offline";
  price: number;
  serviceName: string;
  rating: number;
  profilePicture?: string | null;
  distance: number | null;               // in meters
  duration: number | null;               // in seconds
  directionCoordinates: any | null;      // geometry coordinates from directions API
  isClosest: boolean;
}

export interface ProviderWithServices extends ProviderSearchResult {
  homeServiceAvailable: boolean;
  services: {
    name: string;
    price: number;
  }[];
}


export interface SearchProvidersParams {
  serviceType: ServiceType;
  lat: number;
  lng: number;
}

export interface BookingSetupInfo {
  service: string;
  locationType: "shop" | "home" | string | null;
  bookingDateTime: string;
}
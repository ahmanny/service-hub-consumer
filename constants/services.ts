import { FontAwesome6 } from "@expo/vector-icons";

export type ServiceType =
    | "barber"
    | "hair_stylist"
    | "electrician"
    | "plumber"
    | "house_cleaning";

export const homeBasedServices = ["plumber", "electrician", "house_cleaning"];


export type ServiceMeta = {
    label: string;
    description: string;
    icon: keyof typeof FontAwesome6.glyphMap;
};

export const SERVICE_META: Record<ServiceType, ServiceMeta> = {
    barber: {
        label: "Barber",
        description: "Haircuts and grooming",
        icon: "scissors",
    },
    electrician: {
        label: "Electrician",
        description: "Wiring, lighting, power issues",
        icon: "bolt",
    },
    house_cleaning: {
        label: "House Cleaner",
        description: "Home and office cleaning",
        icon: "broom",
    },
    hair_stylist: {
        label: "Hair Stylist",
        description: "Styling, braids, treatments",
        icon: "user",
    },
    plumber: {
        label: "Plumber",
        description: "Pipes, leaks, installations",
        icon: "wrench",
    },
};

export const AVAILABLE_SERVICES = Object.keys(SERVICE_META);


export const BARBER_SERVICES = [
    { name: "Basic Haircut", value: "basic_haircut" },
    { name: "Carving", value: "carving" },
    { name: "Haircut + Beard Trim", value: "haircut_beard" },
    { name: "Grooming Service", value: "home_grooming" },
    { name: "Premium Full Grooming", value: "premium_grooming" },
];

export const HAIR_STYLIST_SERVICES = [
    { name: "Hair Coloring", value: "hair_coloring" },
    { name: "Blow Dry", value: "blow_dry" },
    { name: "Hair Styling", value: "hair_styling" },
    { name: "Hair Treatment", value: "hair_treatment" },
    { name: "Braiding", value: "braiding" },
];
export const ELECTRICIAN_SERVICES = [
    { name: "Wiring & Rewiring", value: "wiring_rewiring" },
    { name: "Light Fixture Installation", value: "light_fixture" },
    { name: "Socket & Switch Repair", value: "socket_switch" },
    { name: "Appliance Repair", value: "appliance_repair" },
    { name: "Circuit Breaker Installation", value: "circuit_breaker" },
];
export const PLUMBER_SERVICES = [
    { name: "Pipe Installation/Repair", value: "pipe_repair" },
    { name: "Drain Cleaning", value: "drain_cleaning" },
    { name: "Leak Fixing", value: "leak_fixing" },
    { name: "Toilet & Sink Repair", value: "toilet_sink" },
    { name: "Water Heater Installation", value: "water_heater" },
];
export const HOUSE_CLEANING_SERVICES = [
    { name: "Full House Cleaning", value: "full_house" },
    { name: "Kitchen Cleaning", value: "kitchen" },
    { name: "Bathroom Cleaning", value: "bathroom" },
    { name: "Carpet & Upholstery Cleaning", value: "carpet_upholstery" },
    { name: "Window Cleaning", value: "window" },
];

export function getServicesForType(type: ServiceType) {
    switch (type) {
        case "barber":
            return BARBER_SERVICES;
        case "hair_stylist":
            return HAIR_STYLIST_SERVICES;
        case "electrician":
            return ELECTRICIAN_SERVICES;
        case "house_cleaning":
            return HOUSE_CLEANING_SERVICES;
        case "plumber":
            return PLUMBER_SERVICES;
        default:
            return [];
    }
}

export function getService(type: ServiceType) {
    switch (type) {
        case "barber":
            return BARBER_SERVICES;
        case "hair_stylist":
            return HAIR_STYLIST_SERVICES;
        case "electrician":
            return ELECTRICIAN_SERVICES;
        case "house_cleaning":
            return HOUSE_CLEANING_SERVICES;
        case "plumber":
            return PLUMBER_SERVICES;
        default:
            return [];
    }
}

/**
 * Returns true if the service requires choosing between shop or home service.
 */
export function requiresLocationChoice(type: ServiceType): boolean {
    switch (type) {
        case "barber":
        case "hair_stylist":
            return true; // need to ask if it's in-shop or home service
        case "electrician":
        case "plumber":
        case "house_cleaning":
            return false; // usually service is at customer's location
        default:
            return false;
    }
}
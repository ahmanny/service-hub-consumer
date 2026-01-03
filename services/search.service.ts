import API from "@/lib/axios";
import { BookingSetupInfo, SearchProvidersParams } from "@/types/provider.types";




export async function searchProviders({ serviceType, lat, lng, bookingDateTime, locationType, service }: SearchProvidersParams & BookingSetupInfo) {
    const params = new URLSearchParams({
        serviceType,
        lat: lat.toString(),
        lng: lng.toString(),
        bookingDateTime, // ISO string
        service,
    });

    if (locationType) params.append("locationType", locationType);
    const { data } = await API
        .get(`/consumer/search/providers?${params.toString()}`);
    return data;
}

export async function fetchProviderDetails({ providerId }: { providerId?: string }) {
    const { data } = await API
        .get(`consumer/providers/${providerId}`);
    return data;
}

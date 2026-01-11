import API from "@/lib/axios";
import { SearchProvidersParams } from "@/types/provider.types";




export async function searchProviders({ serviceType, lat, lng }: SearchProvidersParams) {
    const params = new URLSearchParams({
        serviceType,
        lat: lat.toString(),
        lng: lng.toString(),
    });

    const { data } = await API
        .get(`/consumer/search/providers?${params.toString()}`);
    return data;
}

export async function getProviders({ serviceType, lat, lng }: SearchProvidersParams) {
    const params = new URLSearchParams({
        serviceType,
        lat: lat.toString(),
        lng: lng.toString(),
    });

    const { data } = await API
        .get(`/consumer/home/providers?${params.toString()}`);
    return data;
}

export async function fetchProviderDetails({ providerId }: { providerId?: string }) {
    const { data } = await API
        .get(`consumer/providers/${providerId}`);
    return data;
}

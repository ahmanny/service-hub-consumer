import { fetchProviderDetails, searchProviders } from "@/services/search.service";
import { BookingSetupInfo, ProviderSearchResult, SearchProvidersParams } from "@/types/provider.types";
import { useQuery } from "@tanstack/react-query";

export const useSearchProviders = (params: SearchProvidersParams & BookingSetupInfo, enabled: boolean) => {
    return useQuery<ProviderSearchResult[], Error>({
        queryKey: ["search-providers", params],
        queryFn: () => searchProviders(params),
        enabled: !!params.serviceType && !!params.lat && !!params.lng && !!enabled,
        refetchOnWindowFocus: false,
    });
};
export const useProviderDetails = ({ providerId, enabled }: { providerId?: string, enabled: boolean }) => {
    return useQuery({
        queryKey: ["provider-details", providerId],
        queryFn: () => fetchProviderDetails({ providerId: providerId }),
        enabled: !!providerId && !!enabled,
        refetchOnWindowFocus: false,
    });
};
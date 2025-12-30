import { completeProfile, fetchConsumerProfile } from "@/services/consumer.service";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQuery } from "@tanstack/react-query";



export const useConsumerProfile = (enabled: boolean) => {
    return useQuery({
        queryKey: ["consumer-profile"],
        queryFn: fetchConsumerProfile,
        enabled,                  // only run if enabled is true
        retry: false,             //  don’t retry automatically
        refetchOnWindowFocus: false,
    });
};

export const useCompleteProfile = () => {
    const setUser = useAuthStore((state) => state.login);
    return useMutation({
        mutationFn: completeProfile,
        onSuccess: async (data) => {
            const { profile: user } = data
            const hasProfile = Boolean(user)
            setUser(user, hasProfile);
            console.log(data)
        },
    });
};
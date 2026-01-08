import { addAddress, changeEmail, completeProfile, fetchConsumerProfile, updateName, updatePhone } from "@/services/consumer.service";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export const useConsumerProfile = (enabled: boolean) => {
    return useQuery({
        queryKey: ["consumer-profile"],
        queryFn: fetchConsumerProfile,
        enabled,                  // only run if enabled is true
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 25,
        refetchInterval: 1000 * 60 * 25,
        refetchIntervalInBackground: false,
    });
};

export const useCompleteProfile = () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.login);
    return useMutation({
        mutationFn: completeProfile,
        onSuccess: async (data) => {
            const { profile: user } = data
            const hasProfile = Boolean(user)
            setUser(user, hasProfile);
            queryClient.invalidateQueries({ queryKey: ["consumer-profile"] });

            console.log(data)
        },
    });
};

export const useUpdateName = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateName,
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: ["consumer-profile"] });
        },
    });
}
export const useUpdateEmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: changeEmail,
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: ["consumer-profile"] });
        },
    });
}
export const useUpdatePhone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePhone,
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: ["consumer-profile"] });
        },
    });
}
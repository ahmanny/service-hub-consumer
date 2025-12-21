import { completeProfile } from "@/services/consumer.service";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation } from "@tanstack/react-query";



export const useCompleteProfile = () => {
    const setUser = useAuthStore((state) => state.login);
    return useMutation({
        mutationFn: completeProfile,
        onSuccess: async (data) => {
            const { user } = data
            setUser({ ...user, profileCompleted: true });
            console.log(data)
        },
    });
};
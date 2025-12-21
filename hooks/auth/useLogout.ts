import { useMutation } from "@tanstack/react-query";
import { logout } from "@/services/auth.service";
import { clearTokens } from "@/stores/auth.tokens";
import { useAuthStore } from "@/stores/auth.store";

export const useLogout = () => {
    const logUserOut = useAuthStore((state) => state.logout);

    return useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await clearTokens()
            logUserOut();
        },
    });
};

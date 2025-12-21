import { useMutation } from "@tanstack/react-query";
import { resendotp, sendotp, verifyotp, getotpcooldown } from "@/services/auth.service";
import { saveTokens } from "@/stores/auth.tokens";
import { useAuthStore } from "@/stores/auth.store";

export const useSendOtp = () => {
    return useMutation({
        mutationFn: sendotp,
        onSuccess: async (data) => {
            console.log(data)
        },
    });
};
export const useResendOtp = () => {
    return useMutation({
        mutationFn: resendotp,
        onSuccess: async (data) => {
            console.log(data)
        },
    });
};
export const useGetOtpCooldown = () => {
    return useMutation({
        mutationFn: getotpcooldown,
        onSuccess: async (data) => {
            console.log(data)
        },
    });
};


export const useVerifyOtp = () => {
    const setAuthenticated = useAuthStore((state) => state.login);
    return useMutation({
        mutationFn: verifyotp,
        onSuccess: async (data) => {
            const { access_token, refresh_token, user } = data.tokens;
            await saveTokens({
                accessToken: access_token,
                refreshToken: refresh_token,
            });
            setAuthenticated(user);
            console.log(data)
        },
    });
};
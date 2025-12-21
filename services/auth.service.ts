import API from "@/lib/axios";
import { getRefreshToken } from "@/stores/auth.tokens";

// email
export const sendotp = async (payload: { phone: string }) => {
    const { data } = await API.post("/auth/consumer/send-otp", payload);
    return data
};
export const resendotp = async (payload: { phone: string }) => {
    const { data } = await API.post("/auth/consumer/resend-otp", payload);
    return data
};
export const verifyotp = async (payload: { phone: string, otp: string }) => {
    const { data } = await API.post("/auth/consumer/verify-otp", payload);
    return data
};
export const getotpcooldown = async (payload: { phone: string }) => {
    const { data } = await API.post("/auth/consumer/get-otp-cooldown", payload);
    return data
};



export const logout = async () => {
    const refresh_token = await getRefreshToken()
    const { data } = await API.post("/auth/consumer/logout", { refresh_token });
    return data
};

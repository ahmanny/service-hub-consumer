import API from "@/lib/axios";

export const completeProfile = async (payload: { firstName: string, lastName: string, email: string }) => {
    const { data } = await API.post("/consumer/complete-profile", payload);
    return data
};
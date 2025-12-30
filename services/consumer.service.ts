import API from "@/lib/axios";

export const completeProfile = async (payload: { firstName: string, lastName: string, email: string }) => {
    const { data } = await API.patch("/consumer/complete-profile", payload);
    return data
};


export async function fetchConsumerProfile() {
    const { data } = await API.get("/consumer/me");
    return data; // expected { hasProfile: boolean, profile: object | null }
}

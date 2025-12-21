import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "@/stores/auth.tokens";
import { useNetworkStore } from "@/stores/network.store";
import axios, { AxiosError } from "axios";


const API = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 15000,
});

// Attach access token
API.interceptors.request.use(async (config) => {
    const { isConnected, isInternetReachable } = useNetworkStore.getState();
    if (!isConnected || !isInternetReachable) {
        return Promise.reject({
            message: "No internet connection",
            code: "OFFLINE",
        });
    }
    config.headers = config.headers ?? {};

    const token = await getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Refresh token on 401
API.interceptors.response.use(
    (response) => response.data,
    async (error: AxiosError<any>) => {
        const originalRequest: any = error.config;


        const { isConnected, isInternetReachable } = useNetworkStore.getState();
        if (!isConnected || !isInternetReachable) {
            return Promise.reject({
                message: "Offline. Cannot refresh session.",
            });
        }


        let isRefreshing = false;
        let refreshQueue: ((token: string) => void)[] = [];

        const processQueue = (token: string) => {
            refreshQueue.forEach(cb => cb(token));
            refreshQueue = [];
        };


        if (
            error.response?.status === 401 &&
            error.response?.data?.code === 106
        ) {
            if (isRefreshing) {
                return new Promise(resolve => {
                    refreshQueue.push((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(API(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await getRefreshToken();
                if (!refreshToken) throw new Error("No refresh token");

                const { data } = await axios.post(
                    `${process.env.EXPO_PUBLIC_API_URL}/auth/consumer/refresh`,
                    { refresh_token: refreshToken }
                );

                const { access_token, refresh_token } = data.data.tokens;
                await saveTokens({ accessToken: access_token, refreshToken: refresh_token });

                processQueue(access_token);

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return API(originalRequest);
            } catch {
                await clearTokens();
                return Promise.reject({ message: "Session expired" });
            } finally {
                isRefreshing = false;
            }
        }


        return Promise.reject(error.response?.data || error.message);
    }
);

export default API;

import { ConsumerProfile } from "@/types/user.types";
import { create } from "zustand";

type AuthState = {
    isAuthenticated: boolean;
    user: null | ConsumerProfile
    login: (user: AuthState["user"]) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,

    login: (user) =>
        set({
            isAuthenticated: true,
            user,
        }),

    logout: () =>
        set({
            isAuthenticated: false,
            user: null,
        }),
}));

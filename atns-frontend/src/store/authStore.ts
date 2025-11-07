// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthState {
    username: string | null;
    token: string | null;
    refreshToken: string | null;
    roles: string[] | null;
    profileId: number | null;
    isAuthenticated: boolean;
    login: (profileId: number, username: string, token: string, refreshToken: string, roles: string[]) => void;
    logout: () => void;
    updateUser: (username: string) => void;
    updateToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            username: null,
            token: null,
            refreshToken: null,
            roles: null,
            profileId: null,
            isAuthenticated: false,
            login: (profileId, username, token, refreshToken, roles) =>
                set({
                    profileId,
                    username,
                    token,
                    refreshToken,
                    roles,
                    isAuthenticated: true,
                }),

            logout: () =>
                set({
                    profileId: null,
                    username: null,
                    token: null,
                    refreshToken: null,
                    roles: null,
                    isAuthenticated: false,
                }),

            updateUser: (username) => set((state) => ({ ...state, username })),
            updateToken: (token) => set((state) => ({ ...state, token })),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                profileId: state.profileId,
                username: state.username,
                token: state.token,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
                roles: state.roles,
            }),
        }
    )
);

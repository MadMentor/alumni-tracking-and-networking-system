// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthState {
    username: string | null;
    token: string | null;
    refreshToken: string | null;
    roles: string[] | null;
    isAuthenticated: boolean;
    login: (username: string, token: string, refreshToken: string, roles: string[]) => void;
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
            isAuthenticated: false,
            login: (username, token, refreshToken, roles) =>
                set({
                    username,
                    token,
                    refreshToken,
                    roles,
                    isAuthenticated: true,
                }),

            logout: () =>
                set({
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
                username: state.username,
                token: state.token,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
                roles: state.roles,
            }),
        }
    )
);

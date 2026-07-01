import { create } from "zustand";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  status: "checking" | "authenticated" | "unauthenticated";
  setAuth: (accessToken: string, user: AuthUser) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  status: "checking",
  setAuth: (accessToken, user) => set({ accessToken, user, status: "authenticated" }),
  setAccessToken: (accessToken) => set({ accessToken, status: "authenticated" }),
  clearAuth: () => set({ accessToken: null, user: null, status: "unauthenticated" }),
}));

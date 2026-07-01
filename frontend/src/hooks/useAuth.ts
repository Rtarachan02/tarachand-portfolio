import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { AuthUser } from "@/types/auth";

async function fetchMe(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>("/auth/me");
  return data;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data } = await apiClient.post<{ access_token: string }>("/auth/login", payload);
      useAuthStore.getState().setAccessToken(data.access_token);
      const user = await fetchMe();
      setAuth(data.access_token, user);
      return user;
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: { current_password: string; new_password: string }) => {
      await apiClient.patch("/auth/me/password", payload);
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout");
    },
    onSettled: () => clearAuth(),
  });
}

/** Runs once at app start: tries to silently restore a session from the refresh cookie. */
export function useBootstrapAuth() {
  const status = useAuthStore((s) => s.status);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    if (status !== "checking") return;

    let cancelled = false;
    (async () => {
      try {
        const { data } = await apiClient.post<{ access_token: string }>("/auth/refresh");
        if (cancelled) return;
        useAuthStore.getState().setAccessToken(data.access_token);
        const user = await fetchMe();
        if (!cancelled) setAuth(data.access_token, user);
      } catch {
        if (!cancelled) clearAuth();
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

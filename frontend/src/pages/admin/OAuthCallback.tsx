import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { AuthUser } from "@/types/auth";

export function OAuthCallback() {
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await apiClient.post<{ access_token: string }>("/auth/refresh");
        useAuthStore.getState().setAccessToken(data.access_token);
        const { data: user } = await apiClient.get<AuthUser>("/auth/me");
        if (!cancelled) {
          setAuth(data.access_token, user);
          setDone(true);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setAuth]);

  if (failed) return <Navigate to="/admin/login" replace />;
  if (done) return <Navigate to="/admin" replace />;

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted">
      Signing you in…
    </div>
  );
}

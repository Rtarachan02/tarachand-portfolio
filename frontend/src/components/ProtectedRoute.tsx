import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { status, user } = useAuthStore();

  if (status === "checking") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted">
        Checking session…
      </div>
    );
  }

  if (status !== "authenticated" || !user?.is_admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

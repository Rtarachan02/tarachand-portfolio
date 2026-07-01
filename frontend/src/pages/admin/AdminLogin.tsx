import { type FormEvent, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { baseURL } from "@/lib/api";
import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

function oauthLoginUrl(provider: "google" | "github") {
  return `${baseURL}/auth/oauth/${provider}/login`;
}

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const { mutate, isPending, isError } = useLogin();
  const { status, user } = useAuthStore();

  if (status === "authenticated" && user?.is_admin) {
    return <Navigate to="/admin" replace />;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate({ email, password });
  }

  const oauthError = searchParams.get("error") === "not_allowed";

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-6 py-24">
      <h1 className="text-2xl font-bold tracking-tight">Admin Sign In</h1>

      {oauthError && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
          That account isn't authorized for admin access.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
        {isError && <p className="text-sm text-red-500">Incorrect email or password.</p>}
      </form>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-2">
        <a
          href={oauthLoginUrl("google")}
          className="rounded-xl border border-border px-4 py-3 text-center text-sm hover:border-primary/60"
        >
          Continue with Google
        </a>
        <a
          href={oauthLoginUrl("github")}
          className="rounded-xl border border-border px-4 py-3 text-center text-sm hover:border-primary/60"
        >
          Continue with GitHub
        </a>
      </div>
    </section>
  );
}

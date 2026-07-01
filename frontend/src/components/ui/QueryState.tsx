import type { PropsWithChildren } from "react";

export function LoadingState() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-2xl border border-border bg-surface/50"
        />
      ))}
    </div>
  );
}

export function ErrorState({ message = "Couldn't load this content." }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted">
      {message}
    </div>
  );
}

export function EmptyState({ children }: PropsWithChildren) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted">
      {children}
    </div>
  );
}

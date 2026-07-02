import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "@/lib/api";

/** Fires a pageview on every route change. Skips /admin* (owner traffic, not
 * visitor traffic) and non-production builds (so local dev doesn't pollute
 * real analytics). */
export function useTrackPageview() {
  const location = useLocation();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (location.pathname.startsWith("/admin")) return;
    if (lastTracked.current === location.pathname) return;
    lastTracked.current = location.pathname;

    apiClient
      .post("/analytics/pageview", {
        path: location.pathname,
        referrer: document.referrer || null,
      })
      .catch(() => {
        // Analytics is best-effort — never let a failed tracking call affect the page.
      });
  }, [location.pathname]);
}

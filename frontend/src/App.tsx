import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useBootstrapAuth } from "@/hooks/useAuth";
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { OAuthCallback } from "@/pages/admin/OAuthCallback";
import { AIShowcase } from "@/pages/AIShowcase";
import { BackendShowcase } from "@/pages/BackendShowcase";
import { Blog } from "@/pages/Blog";
import { Contact } from "@/pages/Contact";
import { Experience } from "@/pages/Experience";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";

// Code-split the heavy pages: Three.js (Embedded), react-markdown + highlight.js
// (BlogPost), and the admin dashboard (behind auth, irrelevant to public visitors).
const EmbeddedShowcase = lazy(() =>
  import("@/pages/EmbeddedShowcase").then((m) => ({ default: m.EmbeddedShowcase })),
);
const BlogPost = lazy(() => import("@/pages/BlogPost").then((m) => ({ default: m.BlogPost })));
const AdminDashboard = lazy(() =>
  import("@/pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })),
);

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted">
      Loading…
    </div>
  );
}

function PublicLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function App() {
  useBootstrapAuth();

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/embedded" element={<EmbeddedShowcase />} />
          <Route path="/ai" element={<AIShowcase />} />
          <Route path="/backend" element={<BackendShowcase />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/oauth-callback" element={<OAuthCallback />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

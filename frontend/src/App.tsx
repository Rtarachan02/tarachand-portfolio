import { Outlet, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useBootstrapAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { OAuthCallback } from "@/pages/admin/OAuthCallback";
import { AIShowcase } from "@/pages/AIShowcase";
import { BackendShowcase } from "@/pages/BackendShowcase";
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/BlogPost";
import { Contact } from "@/pages/Contact";
import { EmbeddedShowcase } from "@/pages/EmbeddedShowcase";
import { Experience } from "@/pages/Experience";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";

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
  );
}

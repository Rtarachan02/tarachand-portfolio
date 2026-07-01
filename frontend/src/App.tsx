import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AIShowcase } from "@/pages/AIShowcase";
import { BackendShowcase } from "@/pages/BackendShowcase";
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/BlogPost";
import { Contact } from "@/pages/Contact";
import { EmbeddedShowcase } from "@/pages/EmbeddedShowcase";
import { Experience } from "@/pages/Experience";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/embedded" element={<EmbeddedShowcase />} />
        <Route path="/ai" element={<AIShowcase />} />
        <Route path="/backend" element={<BackendShowcase />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

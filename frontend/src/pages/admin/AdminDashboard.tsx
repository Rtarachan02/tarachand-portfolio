import { type FormEvent, useEffect, useState } from "react";
import {
  useAnalyticsSummary,
  useBlogPostsAdmin,
  useContactMessages,
  useCreateBlogPost,
  useCreateCertification,
  useCreateExperience,
  useCreateProject,
  useCreateSkill,
  useCreateTestimonial,
  useDeleteBlogPost,
  useDeleteCertification,
  useDeleteExperience,
  useDeleteProject,
  useDeleteSkill,
  useDeleteTestimonial,
  useMarkContactMessageRead,
  useTestimonialsAdmin,
  useUpdateBlogPost,
  useUpdateTestimonial,
} from "@/hooks/useAdmin";
import { useChangePassword, useLogout } from "@/hooks/useAuth";
import { useCertifications } from "@/hooks/useCertifications";
import { useExperience } from "@/hooks/useExperience";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useProjects } from "@/hooks/useProjects";
import { useSkills } from "@/hooks/useSkills";
import { useAuthStore } from "@/store/authStore";
import type { ProjectCategory, SkillCategory } from "@/types/api";

const EMPTY_PROFILE_FORM = {
  photo_url: "",
  tagline: "",
  github_url: "",
  linkedin_url: "",
  public_email: "",
  linkedin_embed_html: "",
};

function ProfilePanel() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState(EMPTY_PROFILE_FORM);

  useEffect(() => {
    if (!profile) return;
    setForm({
      photo_url: profile.photo_url ?? "",
      tagline: profile.tagline ?? "",
      github_url: profile.github_url ?? "",
      linkedin_url: profile.linkedin_url ?? "",
      public_email: profile.public_email ?? "",
      linkedin_embed_html: profile.linkedin_embed_html ?? "",
    });
  }, [profile]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    updateProfile.mutate({
      photo_url: form.photo_url || null,
      tagline: form.tagline || null,
      github_url: form.github_url || null,
      linkedin_url: form.linkedin_url || null,
      public_email: form.public_email || null,
      linkedin_embed_html: form.linkedin_embed_html || null,
    });
  }

  if (isLoading) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Profile</h2>
      <p className="text-sm text-muted">
        Shown on the homepage: photo, tagline, and social links. Leave a field blank to hide it.
      </p>
      <form
        onSubmit={handleSubmit}
        className="grid max-w-2xl gap-2 rounded-xl border border-border p-4 sm:grid-cols-2"
      >
        <input
          placeholder="Photo URL"
          value={form.photo_url}
          onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          placeholder="Tagline"
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          placeholder="GitHub URL"
          value={form.github_url}
          onChange={(e) => setForm({ ...form, github_url: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <input
          placeholder="LinkedIn URL"
          value={form.linkedin_url}
          onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <input
          placeholder="Public email"
          type="email"
          value={form.public_email}
          onChange={(e) => setForm({ ...form, public_email: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm sm:col-span-2"
        />
        <textarea
          placeholder="LinkedIn 'Embed this post' HTML (optional)"
          rows={3}
          value={form.linkedin_embed_html}
          onChange={(e) => setForm({ ...form, linkedin_embed_html: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs sm:col-span-2"
        />
        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground sm:col-span-2"
        >
          {updateProfile.isPending ? "Saving…" : "Save profile"}
        </button>
        {updateProfile.isSuccess && <p className="text-sm text-primary">Saved.</p>}
      </form>
    </section>
  );
}

const CATEGORIES: ProjectCategory[] = ["embedded", "backend", "ai_ml", "frontend", "other"];

const EMPTY_FORM = {
  slug: "",
  title: "",
  summary: "",
  category: "backend" as ProjectCategory,
  tech_stack: "",
};

function ProjectsPanel() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const [form, setForm] = useState(EMPTY_FORM);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createProject.mutate(
      {
        ...form,
        description: form.summary,
        tech_stack: form.tech_stack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      },
      { onSuccess: () => setForm(EMPTY_FORM) },
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Projects</h2>

      <form onSubmit={handleSubmit} className="grid gap-2 rounded-xl border border-border p-4 sm:grid-cols-2">
        <input
          required
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Summary"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm sm:col-span-2"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as ProjectCategory })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          placeholder="Tech stack (comma separated)"
          value={form.tech_stack}
          onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={createProject.isPending}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground sm:col-span-2"
        >
          {createProject.isPending ? "Adding…" : "Add project"}
        </button>
      </form>

      {isLoading && <p className="text-sm text-muted">Loading…</p>}
      <ul className="flex flex-col gap-2">
        {projects?.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
          >
            <span>
              {p.title} <span className="text-muted">· {p.category}</span>
            </span>
            <button
              onClick={() => deleteProject.mutate(p.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

const EMPTY_EXPERIENCE_FORM = {
  company: "",
  role: "",
  location: "",
  employment_type: "",
  description: "",
  highlights: "",
  start_date: "",
  end_date: "",
};

function ExperiencePanel() {
  const { data: experience, isLoading } = useExperience();
  const createExperience = useCreateExperience();
  const deleteExperience = useDeleteExperience();
  const [form, setForm] = useState(EMPTY_EXPERIENCE_FORM);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createExperience.mutate(
      {
        company: form.company,
        role: form.role,
        location: form.location || null,
        employment_type: form.employment_type || null,
        description: form.description,
        highlights: form.highlights
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean),
        start_date: form.start_date,
        end_date: form.end_date || null,
      },
      { onSuccess: () => setForm(EMPTY_EXPERIENCE_FORM) },
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Experience</h2>
      <p className="text-sm text-muted">
        Leave "End date" blank for your current role — it drives the homepage career timeline.
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid gap-2 rounded-xl border border-border p-4 sm:grid-cols-2"
      >
        <input
          required
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <input
          placeholder="Employment type (e.g. Full-time)"
          value={form.employment_type}
          onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          placeholder="Highlights (comma separated)"
          value={form.highlights}
          onChange={(e) => setForm({ ...form, highlights: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm sm:col-span-2"
        />
        <label className="flex flex-col gap-1 text-xs text-muted">
          Start date
          <input
            required
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          End date (blank = current)
          <input
            type="date"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
          />
        </label>
        <button
          type="submit"
          disabled={createExperience.isPending}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground sm:col-span-2"
        >
          {createExperience.isPending ? "Adding…" : "Add experience"}
        </button>
      </form>

      {isLoading && <p className="text-sm text-muted">Loading…</p>}
      <ul className="flex flex-col gap-2">
        {experience?.map((e) => (
          <li
            key={e.id}
            className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
          >
            <span>
              {e.role} · {e.company}{" "}
              <span className="text-muted">
                ({e.start_date} – {e.end_date ?? "present"})
              </span>
            </span>
            <button
              onClick={() => deleteExperience.mutate(e.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

const SKILL_CATEGORIES: SkillCategory[] = [
  "embedded",
  "backend",
  "ai_ml",
  "frontend",
  "languages",
  "tools",
];

const EMPTY_SKILL_FORM = {
  name: "",
  category: "backend" as SkillCategory,
  proficiency: 3,
};

function SkillsPanel() {
  const { data: skills, isLoading } = useSkills();
  const createSkill = useCreateSkill();
  const deleteSkill = useDeleteSkill();
  const [form, setForm] = useState(EMPTY_SKILL_FORM);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createSkill.mutate(form, { onSuccess: () => setForm(EMPTY_SKILL_FORM) });
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Skills</h2>
      <p className="text-sm text-muted">Drives the homepage tech-domain breakdown.</p>

      <form
        onSubmit={handleSubmit}
        className="grid gap-2 rounded-xl border border-border p-4 sm:grid-cols-3"
      >
        <input
          required
          placeholder="Skill name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as SkillCategory })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        >
          {SKILL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={form.proficiency}
          onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        >
          {[1, 2, 3, 4, 5].map((p) => (
            <option key={p} value={p}>
              Proficiency {p}/5
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={createSkill.isPending}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground sm:col-span-3"
        >
          {createSkill.isPending ? "Adding…" : "Add skill"}
        </button>
      </form>

      {isLoading && <p className="text-sm text-muted">Loading…</p>}
      <ul className="flex flex-wrap gap-2">
        {skills?.map((s) => (
          <li
            key={s.id}
            className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm"
          >
            {s.name} <span className="text-muted">· {s.category}</span>
            <button
              onClick={() => deleteSkill.mutate(s.id)}
              className="text-red-500 hover:underline"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

const EMPTY_CERTIFICATION_FORM = {
  name: "",
  issuer: "",
  issue_date: "",
  credential_url: "",
};

function CertificationsPanel() {
  const { data: certifications, isLoading } = useCertifications();
  const createCertification = useCreateCertification();
  const deleteCertification = useDeleteCertification();
  const [form, setForm] = useState(EMPTY_CERTIFICATION_FORM);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createCertification.mutate(
      {
        name: form.name,
        issuer: form.issuer,
        issue_date: form.issue_date,
        credential_url: form.credential_url || null,
      },
      { onSuccess: () => setForm(EMPTY_CERTIFICATION_FORM) },
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Certifications</h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-2 rounded-xl border border-border p-4 sm:grid-cols-2"
      >
        <input
          required
          placeholder="Certification name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Issuer"
          value={form.issuer}
          onChange={(e) => setForm({ ...form, issuer: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <label className="flex flex-col gap-1 text-xs text-muted">
          Issue date
          <input
            required
            type="date"
            value={form.issue_date}
            onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
          />
        </label>
        <input
          placeholder="Credential URL (optional)"
          value={form.credential_url}
          onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={createCertification.isPending}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground sm:col-span-2"
        >
          {createCertification.isPending ? "Adding…" : "Add certification"}
        </button>
      </form>

      {isLoading && <p className="text-sm text-muted">Loading…</p>}
      <ul className="flex flex-col gap-2">
        {certifications?.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
          >
            <span>
              {c.name} <span className="text-muted">· {c.issuer}</span>
            </span>
            <button
              onClick={() => deleteCertification.mutate(c.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

const EMPTY_BLOG_FORM = {
  slug: "",
  title: "",
  excerpt: "",
  content_markdown: "",
  tags: "",
  published: false,
};

function BlogPanel() {
  const { data: posts, isLoading } = useBlogPostsAdmin();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();
  const [form, setForm] = useState(EMPTY_BLOG_FORM);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createPost.mutate(
      {
        slug: form.slug,
        title: form.title,
        excerpt: form.excerpt,
        content_markdown: form.content_markdown,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        published: form.published,
      },
      { onSuccess: () => setForm(EMPTY_BLOG_FORM) },
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Blog</h2>
      <p className="text-sm text-muted">
        Write in Markdown — headings, lists, and fenced code blocks all render on the site.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-xl border border-border p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            required
            placeholder="Slug (url-friendly-name)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>
        <input
          required
          placeholder="Excerpt (shown in the post list)"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <textarea
          required
          placeholder="Content (Markdown)"
          rows={8}
          value={form.content_markdown}
          onChange={(e) => setForm({ ...form, content_markdown: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs"
        />
        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Publish immediately (otherwise saved as a draft)
        </label>
        <button
          type="submit"
          disabled={createPost.isPending}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          {createPost.isPending ? "Saving…" : "Save post"}
        </button>
      </form>

      {isLoading && <p className="text-sm text-muted">Loading…</p>}
      <ul className="flex flex-col gap-2">
        {posts?.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
          >
            <span>
              {p.title}{" "}
              <span className={p.published ? "text-primary" : "text-muted"}>
                · {p.published ? "published" : "draft"}
              </span>
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updatePost.mutate({ id: p.id, payload: { published: !p.published } })
                }
                className="text-primary hover:underline"
              >
                {p.published ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => deletePost.mutate(p.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {posts?.length === 0 && <p className="text-sm text-muted">No posts yet.</p>}
      </ul>
    </section>
  );
}

const EMPTY_TESTIMONIAL_FORM = {
  author_name: "",
  author_role: "",
  author_company: "",
  content: "",
  rating: 5,
  is_approved: true,
};

function TestimonialsPanel() {
  const { data: testimonials, isLoading } = useTestimonialsAdmin();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const [form, setForm] = useState(EMPTY_TESTIMONIAL_FORM);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createTestimonial.mutate(
      {
        author_name: form.author_name,
        author_role: form.author_role || null,
        author_company: form.author_company || null,
        content: form.content,
        rating: form.rating,
        is_approved: form.is_approved,
      },
      { onSuccess: () => setForm(EMPTY_TESTIMONIAL_FORM) },
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Testimonials</h2>
      <p className="text-sm text-muted">
        Only approved testimonials show up on the public site — toggle approval anytime.
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid gap-2 rounded-xl border border-border p-4 sm:grid-cols-2"
      >
        <input
          required
          placeholder="Author name"
          value={form.author_name}
          onChange={(e) => setForm({ ...form, author_name: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <input
          placeholder="Role"
          value={form.author_role}
          onChange={(e) => setForm({ ...form, author_role: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <input
          placeholder="Company"
          value={form.author_company}
          onChange={(e) => setForm({ ...form, author_company: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm sm:col-span-2"
        />
        <textarea
          required
          placeholder="Testimonial content"
          rows={3}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm sm:col-span-2"
        />
        <select
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}/5 stars
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_approved}
            onChange={(e) => setForm({ ...form, is_approved: e.target.checked })}
          />
          Approve immediately
        </label>
        <button
          type="submit"
          disabled={createTestimonial.isPending}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground sm:col-span-2"
        >
          {createTestimonial.isPending ? "Adding…" : "Add testimonial"}
        </button>
      </form>

      {isLoading && <p className="text-sm text-muted">Loading…</p>}
      <ul className="flex flex-col gap-2">
        {testimonials?.map((t) => (
          <li key={t.id} className="rounded-lg border border-border p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {t.author_name}
                {t.author_company && <span className="text-muted"> · {t.author_company}</span>}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateTestimonial.mutate({
                      id: t.id,
                      payload: { is_approved: !t.is_approved },
                    })
                  }
                  className={t.is_approved ? "text-primary hover:underline" : "text-muted hover:underline"}
                >
                  {t.is_approved ? "Approved" : "Approve"}
                </button>
                <button
                  onClick={() => deleteTestimonial.mutate(t.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-1 text-muted">{t.content}</p>
          </li>
        ))}
        {testimonials?.length === 0 && <p className="text-sm text-muted">No testimonials yet.</p>}
      </ul>
    </section>
  );
}

function ContactPanel() {
  const { data: messages, isLoading } = useContactMessages();
  const markRead = useMarkContactMessageRead();

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Contact Messages</h2>
      {isLoading && <p className="text-sm text-muted">Loading…</p>}
      <ul className="flex flex-col gap-2">
        {messages?.map((m) => (
          <li key={m.id} className="rounded-lg border border-border p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {m.name} · {m.email}
              </span>
              {!m.is_read && (
                <button
                  onClick={() => markRead.mutate(m.id)}
                  className="text-xs text-primary hover:underline"
                >
                  Mark read
                </button>
              )}
            </div>
            <p className="mt-1 text-muted">{m.subject}</p>
            <p className="mt-1 whitespace-pre-wrap">{m.message}</p>
          </li>
        ))}
        {messages?.length === 0 && <p className="text-sm text-muted">No messages yet.</p>}
      </ul>
    </section>
  );
}

function AnalyticsPanel() {
  const { data, isLoading } = useAnalyticsSummary();

  if (isLoading) return <p className="text-sm text-muted">Loading…</p>;
  if (!data) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Visitor Analytics</h2>
      <div className="flex gap-6">
        <div className="rounded-xl border border-border px-6 py-4">
          <p className="text-2xl font-bold">{data.total_pageviews}</p>
          <p className="text-xs text-muted">Total pageviews</p>
        </div>
        <div className="rounded-xl border border-border px-6 py-4">
          <p className="text-2xl font-bold">{data.unique_visitors}</p>
          <p className="text-xs text-muted">Unique visitors</p>
        </div>
      </div>
      <ul className="flex flex-col gap-1 text-sm">
        {data.top_paths.map((tp) => (
          <li key={tp.path} className="flex justify-between border-b border-border py-1">
            <span>{tp.path}</span>
            <span className="text-muted">{tp.count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SecurityPanel() {
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const changePassword = useChangePassword();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (form.new_password !== form.confirm) {
      setFormError("New password and confirmation don't match.");
      return;
    }
    if (form.new_password.length < 8) {
      setFormError("New password must be at least 8 characters.");
      return;
    }

    changePassword.mutate(
      { current_password: form.current_password, new_password: form.new_password },
      { onSuccess: () => setForm({ current_password: "", new_password: "", confirm: "" }) },
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Security</h2>
      <form
        onSubmit={handleSubmit}
        className="flex max-w-sm flex-col gap-2 rounded-xl border border-border p-4"
      >
        <label className="text-xs text-muted">Current password</label>
        <input
          required
          type="password"
          value={form.current_password}
          onChange={(e) => setForm({ ...form, current_password: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <label className="text-xs text-muted">New password</label>
        <input
          required
          type="password"
          value={form.new_password}
          onChange={(e) => setForm({ ...form, new_password: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <label className="text-xs text-muted">Confirm new password</label>
        <input
          required
          type="password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={changePassword.isPending}
          className="mt-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          {changePassword.isPending ? "Updating…" : "Change password"}
        </button>
        {formError && <p className="text-sm text-red-500">{formError}</p>}
        {changePassword.isError && !formError && (
          <p className="text-sm text-red-500">Current password is incorrect.</p>
        )}
        {changePassword.isSuccess && <p className="text-sm text-primary">Password updated.</p>}
      </form>
    </section>
  );
}

export function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted">{user?.email}</p>
        </div>
        <button
          onClick={() => logout.mutate()}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:border-primary/60"
        >
          Sign out
        </button>
      </header>

      <ProfilePanel />
      <ExperiencePanel />
      <SkillsPanel />
      <CertificationsPanel />
      <ProjectsPanel />
      <BlogPanel />
      <TestimonialsPanel />
      <ContactPanel />
      <AnalyticsPanel />
      <SecurityPanel />
    </div>
  );
}

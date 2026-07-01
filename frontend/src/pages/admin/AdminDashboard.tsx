import { type FormEvent, useState } from "react";
import {
  useAnalyticsSummary,
  useContactMessages,
  useCreateProject,
  useDeleteProject,
  useMarkContactMessageRead,
} from "@/hooks/useAdmin";
import { useLogout } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { useAuthStore } from "@/store/authStore";
import type { ProjectCategory } from "@/types/api";

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

      <ProjectsPanel />
      <ContactPanel />
      <AnalyticsPanel />
    </div>
  );
}

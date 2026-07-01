import { ProjectCategoryGrid } from "@/components/sections/ProjectCategoryGrid";

export function BackendShowcase() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-24">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Backend Engineering</h1>
        <p className="max-w-2xl text-muted">
          FastAPI architecture, PostgreSQL schema, REST APIs, authentication, Docker deployment,
          and system design.
        </p>
      </div>
      <ProjectCategoryGrid category="backend" />
    </section>
  );
}

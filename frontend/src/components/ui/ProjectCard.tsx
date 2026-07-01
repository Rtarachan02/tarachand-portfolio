import type { Project } from "@/types/api";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm transition-colors hover:border-primary/60">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        {project.featured && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Featured
          </span>
        )}
      </div>
      <p className="text-sm text-muted">{project.summary}</p>
      <ul className="flex flex-wrap gap-2">
        {project.tech_stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
          >
            {tech}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex gap-4 pt-2 text-sm">
        {project.repo_url && (
          <a href={project.repo_url} className="text-primary underline underline-offset-4">
            Source
          </a>
        )}
        {project.live_url && (
          <a href={project.live_url} className="text-primary underline underline-offset-4">
            Live
          </a>
        )}
      </div>
    </article>
  );
}

import { ProjectCard } from "@/components/ui/ProjectCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/QueryState";
import { useProjects } from "@/hooks/useProjects";
import type { ProjectCategory } from "@/types/api";

export function ProjectCategoryGrid({ category }: { category: ProjectCategory }) {
  const { data: projects, isLoading, isError } = useProjects({ category });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Couldn't load projects from the API." />;
  if (!projects || projects.length === 0) {
    return <EmptyState>No projects published in this category yet.</EmptyState>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

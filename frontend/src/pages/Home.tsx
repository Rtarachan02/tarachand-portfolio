import { ProjectCard } from "@/components/ui/ProjectCard";
import { LoadingState } from "@/components/ui/QueryState";
import { useProjects } from "@/hooks/useProjects";

export function Home() {
  const { data: featuredProjects, isLoading } = useProjects({ featured: true });

  return (
    <>
      <section className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center gap-6 px-6">
        <p className="font-mono text-sm uppercase tracking-widest text-primary">
          Software Engineer — Embedded · Backend · AI/ML
        </p>
        <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Tarachand Rana
        </h1>
        <p className="max-w-xl text-lg text-muted">
          Building high-speed data acquisition systems, resilient backend services, and applied
          AI/ML — from FPGA to production API.
        </p>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-24">
        <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
        {isLoading && <LoadingState />}
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredProjects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}

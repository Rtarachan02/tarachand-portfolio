import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { LoadingState } from "@/components/ui/QueryState";
import { Reveal } from "@/components/ui/Reveal";
import { useProjects } from "@/hooks/useProjects";

export function Home() {
  const { data: featuredProjects, isLoading } = useProjects({ featured: true });

  return (
    <>
      <section className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center gap-6 px-6">
        <AuroraBackground />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-sm uppercase tracking-widest text-primary"
        >
          Software Engineer — Embedded · Backend · AI/ML
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl"
        >
          Tarachand Rana
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl text-lg text-muted"
        >
          Building high-speed data acquisition systems, resilient backend services, and applied
          AI/ML — from FPGA to production API.
        </motion.p>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-24">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
        </Reveal>
        {isLoading && <LoadingState />}
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredProjects?.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

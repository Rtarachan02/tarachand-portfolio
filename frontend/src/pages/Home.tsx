import { motion } from "framer-motion";
import { CareerJourney } from "@/components/sections/CareerJourney";
import { DownloadResumeButton } from "@/components/sections/DownloadResumeButton";
import { GitHubStatsCard } from "@/components/sections/GitHubStatsCard";
import { LinkedInEmbed } from "@/components/sections/LinkedInEmbed";
import { SocialLinks } from "@/components/sections/SocialLinks";
import { TechDomainExpertise } from "@/components/sections/TechDomainExpertise";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { ProfilePhoto } from "@/components/ui/ProfilePhoto";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { LoadingState } from "@/components/ui/QueryState";
import { Reveal } from "@/components/ui/Reveal";
import { useProfile } from "@/hooks/useProfile";
import { useProjects } from "@/hooks/useProjects";

export function Home() {
  const { data: featuredProjects, isLoading } = useProjects({ featured: true });
  const { data: profile } = useProfile();

  return (
    <>
      <section className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center gap-6 px-6">
        <AuroraBackground />

        <div className="flex flex-col-reverse items-start justify-between gap-10 sm:flex-row sm:items-center sm:gap-16">
          <div className="flex max-w-2xl flex-1 flex-col gap-6">
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
              className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
            >
              Tarachand Rana
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl text-lg text-muted"
            >
              {profile?.tagline ??
                "Building high-speed data acquisition systems, resilient backend services, and applied AI/ML — from FPGA to production API."}
            </motion.p>
            {profile && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <SocialLinks profile={profile} />
                <DownloadResumeButton />
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="shrink-0"
          >
            <ProfilePhoto photoUrl={profile?.photo_url ?? null} />
          </motion.div>
        </div>
      </section>

      <CareerJourney />
      <TechDomainExpertise />

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

      {profile && (profile.github_url || profile.linkedin_embed_html) && (
        <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-24 sm:flex-row">
          <Reveal className="flex-1">
            <GitHubStatsCard enabled={Boolean(profile.github_url)} />
          </Reveal>
          <Reveal className="flex-1" delay={0.1}>
            <LinkedInEmbed html={profile.linkedin_embed_html} />
          </Reveal>
        </section>
      )}
    </>
  );
}

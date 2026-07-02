import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { useSkills } from "@/hooks/useSkills";
import type { SkillCategory } from "@/types/api";

const DOMAINS: { category: SkillCategory; label: string; blurb: string }[] = [
  {
    category: "embedded",
    label: "Embedded Systems",
    blurb: "FPGA, ARM, RTOS, Linux drivers, DMA.",
  },
  {
    category: "backend",
    label: "Backend Engineering",
    blurb: "APIs, databases, auth, deployment.",
  },
  {
    category: "ai_ml",
    label: "AI / Machine Learning",
    blurb: "Computer vision, deep learning, applied ML.",
  },
];

function SkillBar({ name, proficiency, index }: { name: string; proficiency: number; index: number }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span>{name}</span>
        <span className="text-muted">{proficiency}/5</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(proficiency / 5) * 100}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: index * 0.06, ease: "easeOut" }}
          className="h-full rounded-full bg-primary"
        />
      </div>
    </div>
  );
}

export function TechDomainExpertise() {
  const { data: skills, isLoading } = useSkills();

  if (isLoading || !skills || skills.length === 0) return null;

  const domainsWithSkills = DOMAINS.map((domain) => ({
    ...domain,
    skills: skills.filter((s) => s.category === domain.category),
  })).filter((domain) => domain.skills.length > 0);

  if (domainsWithSkills.length === 0) return null;

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-24">
      <Reveal>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tech Domain Expertise</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Depth across the three areas this site is built around.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-3">
        {domainsWithSkills.map((domain, domainIndex) => (
          <Reveal key={domain.category} delay={domainIndex * 0.1}>
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface/60 p-6">
              <div>
                <h3 className="font-semibold">{domain.label}</h3>
                <p className="text-xs text-muted">{domain.blurb}</p>
              </div>
              <div className="flex flex-col gap-3">
                {domain.skills.map((skill, skillIndex) => (
                  <SkillBar
                    key={skill.id}
                    name={skill.name}
                    proficiency={skill.proficiency}
                    index={skillIndex}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

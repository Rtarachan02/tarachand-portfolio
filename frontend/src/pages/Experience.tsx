import { motion } from "framer-motion";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/QueryState";
import { Reveal } from "@/components/ui/Reveal";
import { useCertifications } from "@/hooks/useCertifications";
import { useExperience } from "@/hooks/useExperience";
import { useTestimonials } from "@/hooks/useTestimonials";

function formatDate(value: string | null) {
  if (!value) return "Present";
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

export function Experience() {
  const { data: experience, isLoading: loadingExp, isError: errorExp } = useExperience();
  const { data: certifications, isLoading: loadingCerts } = useCertifications();
  const { data: testimonials, isLoading: loadingTestimonials } = useTestimonials();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-24">
      <section className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Experience</h1>
        {loadingExp && <LoadingState />}
        {errorExp && <ErrorState message="Couldn't load experience from the API." />}
        {experience && experience.length === 0 && (
          <EmptyState>No experience entries yet.</EmptyState>
        )}
        <ol className="flex flex-col gap-6 border-l border-border pl-6">
          {experience?.map((entry, index) => (
            <motion.li
              key={entry.id}
              className="relative"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            >
              <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-primary" />
              <p className="text-sm text-muted">
                {formatDate(entry.start_date)} — {formatDate(entry.end_date)}
              </p>
              <h3 className="text-lg font-semibold">
                {entry.role} · {entry.company}
              </h3>
              <p className="mt-1 text-sm text-muted">{entry.description}</p>
              <ul className="mt-2 list-inside list-disc text-sm text-muted">
                {entry.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight">Certifications</h2>
        {loadingCerts && <LoadingState />}
        <div className="grid gap-4 sm:grid-cols-2">
          {certifications?.map((cert, index) => (
            <Reveal key={cert.id} delay={index * 0.08}>
              <div className="rounded-2xl border border-border bg-surface/60 p-5">
                <h3 className="font-semibold">{cert.name}</h3>
                <p className="text-sm text-muted">
                  {cert.issuer} — {formatDate(cert.issue_date)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight">Testimonials</h2>
        {loadingTestimonials && <LoadingState />}
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials?.map((t, index) => (
            <Reveal key={t.id} delay={index * 0.08}>
              <blockquote className="rounded-2xl border border-border bg-surface/60 p-5">
                <p className="text-sm italic text-muted">&ldquo;{t.content}&rdquo;</p>
                <footer className="mt-3 text-sm font-medium">
                  {t.author_name}
                  {t.author_role && <span className="text-muted"> · {t.author_role}</span>}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

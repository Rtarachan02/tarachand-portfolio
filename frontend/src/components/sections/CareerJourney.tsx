import { motion } from "framer-motion";
import { useExperience } from "@/hooks/useExperience";

function formatDate(value: string | null) {
  if (!value) return "Present";
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function Connector({ index }: { index: number }) {
  return (
    <div className="relative hidden h-px flex-1 self-center bg-border sm:block">
      <motion.span
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3, ease: "easeInOut" }}
      />
    </div>
  );
}

interface JourneyCardProps {
  index: number;
  title: string;
  subtitle: string;
  dateRange: string;
  description?: string;
  accent?: boolean;
}

function JourneyCard({ index, title, subtitle, dateRange, description, accent }: JourneyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
      className="w-full shrink-0 sm:w-64"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 3.5 + index * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.25,
        }}
        className={`flex flex-col gap-2 rounded-2xl border p-5 backdrop-blur-sm ${
          accent
            ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
            : "border-border bg-surface/60"
        }`}
      >
        <p className="font-mono text-xs uppercase tracking-wide text-primary">{dateRange}</p>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted">{subtitle}</p>
        {description && <p className="text-xs text-muted">{description}</p>}
      </motion.div>
    </motion.div>
  );
}

export function CareerJourney() {
  const { data: experience, isLoading } = useExperience();

  if (isLoading || !experience || experience.length === 0) return null;

  // Oldest first, so the flow reads chronologically toward "now".
  const chronological = [...experience].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
  );

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-24">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Career Journey</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          From first role to what's next — the path so far.
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:items-center sm:overflow-x-auto sm:pb-4">
        {chronological.map((entry, index) => (
          <div key={entry.id} className="flex items-center gap-6 sm:contents">
            <JourneyCard
              index={index}
              title={entry.role}
              subtitle={entry.company}
              dateRange={`${formatDate(entry.start_date)} — ${formatDate(entry.end_date)}`}
              description={entry.highlights[0]}
            />
            <Connector index={index} />
          </div>
        ))}

        <JourneyCard
          index={chronological.length}
          title="What's next"
          subtitle="Open to new opportunities"
          dateRange="Now"
          description="Embedded, backend, or AI/ML roles — always happy to talk."
          accent
        />
      </div>
    </section>
  );
}

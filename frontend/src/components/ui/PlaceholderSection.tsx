interface PlaceholderSectionProps {
  title: string;
  description: string;
}

export function PlaceholderSection({ title, description }: PlaceholderSectionProps) {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      <p className="max-w-2xl text-muted">{description}</p>
      <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface/50 p-10 text-sm text-muted">
        Content for this section lands in a later build phase — currently a structural placeholder.
      </div>
    </section>
  );
}

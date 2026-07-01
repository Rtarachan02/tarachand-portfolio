import { ProjectCategoryGrid } from "@/components/sections/ProjectCategoryGrid";

export function AIShowcase() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-24">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">AI / Machine Learning</h1>
        <p className="max-w-2xl text-muted">
          Deep learning, computer vision, time series, generative AI, and LLM integrations.
        </p>
      </div>
      <ProjectCategoryGrid category="ai_ml" />
    </section>
  );
}

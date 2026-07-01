import { ProjectCategoryGrid } from "@/components/sections/ProjectCategoryGrid";

export function EmbeddedShowcase() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-24">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Embedded Systems</h1>
        <p className="max-w-2xl text-muted">
          High-speed FPGA data acquisition, dual-core synchronization, ARM architecture, DMA,
          circular buffers, and Linux device drivers.
        </p>
      </div>
      <ProjectCategoryGrid category="embedded" />
    </section>
  );
}

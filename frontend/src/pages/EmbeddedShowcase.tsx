import { ProjectCategoryGrid } from "@/components/sections/ProjectCategoryGrid";
import { CircularBufferScene } from "@/components/three/CircularBufferScene";
import { Reveal } from "@/components/ui/Reveal";

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

      <Reveal>
        <div className="flex flex-col gap-3">
          <CircularBufferScene />
          <div className="flex flex-wrap gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#38bdf8]" /> DMA write head (producer)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#c084fc]" /> CPU read tail (consumer)
            </span>
            <span>
              Lit slots hold data written but not yet consumed — a lock-free ring buffer between
              a DMA engine and a CPU-side reader. Drag to rotate.
            </span>
          </div>
        </div>
      </Reveal>

      <ProjectCategoryGrid category="embedded" />
    </section>
  );
}

import { motion } from "framer-motion";

const blobs = [
  { className: "left-[-10%] top-[-10%] h-[420px] w-[420px] bg-primary/25", duration: 22 },
  { className: "right-[-15%] top-[10%] h-[380px] w-[380px] bg-accent/20", duration: 26 },
  { className: "left-[20%] bottom-[-15%] h-[360px] w-[360px] bg-primary/15", duration: 30 },
];

/** Soft, slow-drifting gradient blobs behind the hero. Pure CSS/transform animation — no WebGL. */
export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

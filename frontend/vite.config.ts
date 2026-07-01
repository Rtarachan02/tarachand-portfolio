import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    sourcemap: true,
    // The Three.js scene is route-split into its own chunk (only loaded on /embedded),
    // so its inherent size doesn't affect the initial page load — raise the warning
    // threshold instead of fighting a library-size warning that lazy-loading already solved.
    chunkSizeWarningLimit: 900,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 5174,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Keep the previous content-hashed bundle during in-place VPS deploys.
    // Clients holding an older HTML shell can still load its referenced files.
    emptyOutDir: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});

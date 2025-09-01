import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(new URL(".", import.meta.url).pathname, "./src"),
    },
  },
  test: {
    globals: true,
    setupFiles: "./src/lib/test/setup.js",
    environment: "jsdom",
    coverage: {
      reporter: ["text"],
    },
  },
});

import tailwindcss from "@tailwindcss/vite";

import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      insertTypesEntry: true,
      include: ["src"],
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "RepoUI",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", /^next(\/.+)?$/],
      output: { assetFileNames: "styles.[ext]" },
    },
  },
});

import type { Plugin } from "vite";

import react from "@vitejs/plugin-react-swc";
import { stoop, stoopPlugin } from "stoop/vite";
import { defineConfig } from "vite";

/**
 * Rollup plugin that adds "use client" directives to output chunks
 * that use React hooks or JSX runtime (i.e., client components).
 * This is needed for Next.js RSC compatibility.
 */
function preserveUseClient(): Plugin {
  return {
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const [, chunk] of Object.entries(bundle)) {
        if (chunk.type !== "chunk") continue;
        if (
          chunk.code.includes('from "react"') ||
          chunk.code.includes('from "react/jsx-runtime"')
        ) {
          chunk.code = `"use client";\n${chunk.code}`;
        }
      }
    },
    name: "preserve-use-client",
  };
}

export default defineConfig(async () => ({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"] as const,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "stoop", "@floating-ui/dom"],
      output: {
        entryFileNames: "[name].js",
        preserveModules: true,
      },
    },
  },
  plugins: [
    preserveUseClient(),
    react({ plugins: [await stoopPlugin({ configFile: "stoop.config.ts" })] }),
    stoop({ configFile: "stoop.config.ts" }),
  ],
}));

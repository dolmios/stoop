import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { loadConfig, serializeForPlugin } from "./config-loader";
import { CSSAggregator } from "./css-aggregator";
import { generateThemeCSS } from "./theme-generator";

/**
 * Returns the SWC plugin tuple for @vitejs/plugin-react-swc.
 *
 * Usage:
 * ```
 * import react from "@vitejs/plugin-react-swc";
 * import { stoopPlugin } from "stoop/vite";
 *
 * export default defineConfig({
 *   plugins: [
 *     react({ plugins: [await stoopPlugin()] }),
 *     stoop(),
 *   ],
 * });
 * ```
 */
export async function stoopPlugin(options?: {
  configFile?: string;
}): Promise<[string, Record<string, unknown>]> {
  const root = process.cwd();
  const config = await loadConfig(root, options?.configFile);
  const serialized = serializeForPlugin(config);

  return [require.resolve("stoop/plugin"), JSON.parse(serialized)];
}

const STOOP_CSS_RE = /const __stoop_css__\s*=\s*'([^']*)'/;

interface TransformResult {
  code: string;
  map: null;
}

interface VitePlugin {
  name: string;
  configResolved?: (config: { root: string }) => void | Promise<void>;
  transform?: (code: string, id: string) => TransformResult | null;
  generateBundle?: () => void;
}

/**
 * Vite plugin for CSS extraction from stoop compiled modules.
 *
 * Usage:
 * ```
 * import { stoop } from "stoop/vite";
 *
 * export default defineConfig({
 *   plugins: [stoop()],
 * });
 * ```
 */
export function stoop(options?: { configFile?: string }): VitePlugin {
  const aggregator = new CSSAggregator();
  let root = process.cwd();
  let outputDir = ".stoop";

  return {
    async configResolved(config): Promise<void> {
      ({ root } = config);

      try {
        const stoopConfig = await loadConfig(root, options?.configFile);

        outputDir = stoopConfig.output?.dir ?? ".stoop";

        // Generate theme CSS
        const themeCSS = generateThemeCSS(stoopConfig);
        const outDir = resolve(root, outputDir);

        mkdirSync(outDir, { recursive: true });
        writeFileSync(resolve(outDir, "theme.css"), themeCSS);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[stoop] Failed to load config:", e);
      }
    },

    generateBundle(): void {
      if (!aggregator.isEmpty()) {
        const css = aggregator.flush();
        const outDir = resolve(root, outputDir);

        mkdirSync(outDir, { recursive: true });
        writeFileSync(resolve(outDir, "styles.css"), css);
      }
    },

    name: "stoop",

    transform(code, id): TransformResult | null {
      if (
        !id.endsWith(".ts") &&
        !id.endsWith(".tsx") &&
        !id.endsWith(".js") &&
        !id.endsWith(".jsx")
      ) {
        return null;
      }

      const match = STOOP_CSS_RE.exec(code);

      if (!match) return null;

      try {
        const metadata = JSON.parse(match[1]);

        aggregator.addRules(id, metadata);
      } catch {
        // Skip malformed metadata
      }

      return null;
    },
  };
}

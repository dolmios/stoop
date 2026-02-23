import { writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

import { loadConfig, serializeForPlugin } from "./config-loader.js";
import { CSSAggregator } from "./css-aggregator.js";
import { generateThemeCSS } from "./theme-generator.js";

const require = createRequire(import.meta.url);

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
  resolveId?: (id: string) => string | null;
  load?: (id: string) => string | null;
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
const VIRTUAL_CSS_ID = "virtual:stoop/styles.css";
const RESOLVED_VIRTUAL_CSS_ID = "\0" + VIRTUAL_CSS_ID;

export function stoop(options?: { configFile?: string }): VitePlugin {
  const aggregator = new CSSAggregator();
  let root = process.cwd();
  let outputDir = ".stoop";
  let themeCSS = "";

  /** Build the full CSS string from theme + aggregated component CSS. */
  function getFullCSS(): string {
    const componentCSS = aggregator.isEmpty() ? "" : aggregator.flush();
    const parts: string[] = [];

    if (themeCSS) parts.push(themeCSS);
    if (componentCSS) parts.push(componentCSS);

    return parts.join("\n\n");
  }

  return {
    async configResolved(config): Promise<void> {
      ({ root } = config);

      try {
        const stoopConfig = await loadConfig(root, options?.configFile);

        outputDir = stoopConfig.output?.dir ?? ".stoop";
        themeCSS = generateThemeCSS(stoopConfig);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[stoop] Failed to load config:", e);
      }
    },

    generateBundle(): void {
      const css = getFullCSS();

      if (css) {
        const outDir = resolve(root, outputDir);

        mkdirSync(outDir, { recursive: true });
        writeFileSync(resolve(outDir, "styles.css"), css);
      }
    },

    /**
     * Serve the aggregated CSS as a virtual module during dev.
     * In dev mode, `generateBundle` does not fire, so this hook provides
     * the CSS content when the virtual module is requested.
     */
    load(id): string | null {
      if (id === RESOLVED_VIRTUAL_CSS_ID) {
        return getFullCSS();
      }

      return null;
    },

    name: "stoop",

    /**
     * Resolve the virtual CSS module so it can be imported as:
     *   import "virtual:stoop/styles.css";
     * Works in both dev server and production build.
     */
    resolveId(id): string | null {
      if (id === VIRTUAL_CSS_ID) {
        return RESOLVED_VIRTUAL_CSS_ID;
      }

      return null;
    },

    transform(code, id): TransformResult | null {
      if (!/\.(m|c)?(t|j)sx?$/.test(id)) {
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

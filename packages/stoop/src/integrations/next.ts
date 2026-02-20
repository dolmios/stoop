import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { serializeForPlugin } from "./config-loader";
import { generateThemeCSS } from "./theme-generator";

interface NextConfig {
  experimental?: {
    swcPlugins?: Array<[string, Record<string, unknown>]>;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack?: (config: any, context: any) => any;
  [key: string]: unknown;
}

/**
 * Wraps a Next.js config with stoop SWC plugin and CSS extraction.
 *
 * Usage in next.config.mjs:
 * ```
 * import { withStoop } from "stoop/next";
 * export default withStoop({ ... });
 * ```
 */
export function withStoop(
  nextConfig: NextConfig = {},
  options?: { configFile?: string },
): NextConfig {
  const root = process.cwd();

  // Load config synchronously via jiti (no async needed)
  let pluginConfig = "{}";

  try {
    const jiti = require("jiti").createJiti(root);
    const configPaths = [
      options?.configFile,
      "stoop.config.ts",
      "stoop.config.js",
      "stoop.config.mjs",
    ].filter(Boolean) as string[];

    for (const configPath of configPaths) {
      try {
        const configModule = jiti(resolve(root, configPath));
        const config = configModule.default ?? configModule;

        pluginConfig = serializeForPlugin(config);
        const themeCSS = generateThemeCSS(config);

        // Write theme CSS to output dir
        const outputDir = resolve(root, config.output?.dir ?? ".stoop");

        mkdirSync(outputDir, { recursive: true });
        writeFileSync(resolve(outputDir, "theme.css"), themeCSS);
        break;
      } catch {
        continue;
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[stoop] Failed to load config:", e);
  }

  return {
    ...nextConfig,
    experimental: {
      ...nextConfig.experimental,
      swcPlugins: [
        ...(nextConfig.experimental?.swcPlugins ?? []),
        [require.resolve("stoop/plugin"), JSON.parse(pluginConfig || "{}")],
      ],
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webpack(config: any, context: any): any {
      // Add webpack plugin for CSS extraction
      const { StoopWebpackPlugin } = require("./webpack-plugin");

      config.plugins.push(new StoopWebpackPlugin());

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, context);
      }

      return config;
    },
  };
}

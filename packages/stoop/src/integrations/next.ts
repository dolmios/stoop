import { writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { relative, resolve } from "node:path";

import type { StoopConfig } from "../config.js";

import { serializeForPlugin } from "./config-loader.js";
import { generateThemeCSS } from "./theme-generator.js";
import { StoopWebpackPlugin } from "./webpack-plugin.js";

const require = createRequire(import.meta.url);

interface NextConfig {
  experimental?: {
    swcPlugins?: Array<[string, Record<string, unknown>]>;
  };
  transpilePackages?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack?: (config: any, context: any) => any;
  [key: string]: unknown;
}

interface WithStoopOptions {
  configFile?: string;
  config?: StoopConfig;
}

let _cachedPluginConfig: string | null = null;

/**
 * Wraps a Next.js config with stoop SWC plugin and CSS extraction.
 *
 * Usage in next.config.mjs:
 * ```
 * import { withStoop } from "stoop/next";
 * export default withStoop({ ... });
 * ```
 *
 * Or with a config object passed directly (used by stoop-ui/next):
 * ```
 * withStoop(nextConfig, { config: stoopConfig });
 * ```
 */
export function withStoop(nextConfig: NextConfig = {}, options?: WithStoopOptions): NextConfig {
  const root = process.cwd();

  let pluginConfig = "{}";

  if (_cachedPluginConfig !== null) {
    pluginConfig = _cachedPluginConfig;
  } else if (options?.config) {
    // Config passed directly — no file loading needed
    pluginConfig = serializeForPlugin(options.config);
    const themeCSS = generateThemeCSS(options.config);
    const outputDir = resolve(root, options.config.output?.dir ?? ".stoop");

    mkdirSync(outputDir, { recursive: true });
    writeFileSync(resolve(outputDir, "theme.css"), themeCSS);
    _cachedPluginConfig = pluginConfig;
  } else {
    try {
      const { createJiti } = require("jiti");
      const jiti = createJiti(root);
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

          const outputDir = resolve(root, config.output?.dir ?? ".stoop");

          mkdirSync(outputDir, { recursive: true });
          writeFileSync(resolve(outputDir, "theme.css"), themeCSS);
          break;
        } catch (e) {
          console.warn(
            `[stoop] Failed to load config from ${configPath}:`,
            e instanceof Error ? e.message : e,
          );
          continue;
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[stoop] Failed to load config:", e);
    }

    _cachedPluginConfig = pluginConfig;
  }

  if (pluginConfig === "{}") {
    // eslint-disable-next-line no-console
    console.error(
      "[stoop] No valid config found. CSS extraction will not work. " +
        "Ensure a stoop.config.ts/js/mjs exists in the project root, " +
        "or pass a config via options.",
    );
  }

  // Turbopack requires relative paths for SWC WASM plugins
  const pluginPath = "./" + relative(root, require.resolve("stoop/plugin"));

  return {
    ...nextConfig,
    experimental: {
      ...nextConfig.experimental,
      swcPlugins: [
        ...(nextConfig.experimental?.swcPlugins ?? []),
        [pluginPath, JSON.parse(pluginConfig || "{}")],
      ],
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webpack(config: any, context: any): any {
      config.plugins.push(new StoopWebpackPlugin());

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, context);
      }

      return config;
    },
  };
}

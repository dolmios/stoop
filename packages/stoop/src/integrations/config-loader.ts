import { createJiti } from "jiti";

import type { StoopConfig, StoopTheme } from "../config.js";

const CONFIG_FILES = ["stoop.config.ts", "stoop.config.js", "stoop.config.mjs", "stoop.config.mts"];

/**
 * Load stoop config from the project root.
 * Uses jiti for TypeScript config support.
 */
export async function loadConfig(root: string, configFile?: string): Promise<StoopConfig> {
  const jiti = createJiti(root);
  const files = configFile ? [configFile] : CONFIG_FILES;

  for (const file of files) {
    const fullPath = `${root}/${file}`;

    try {
      const mod = await jiti.import(fullPath);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config = (mod as any).default || mod;

      return config as StoopConfig;
    } catch (e) {
      // Only continue to next file if the file doesn't exist.
      // Re-throw if the file exists but has import/parse errors.
      const msg = e instanceof Error ? e.message : String(e);

      if (msg.includes("Cannot find module") || msg.includes("ENOENT")) {
        continue;
      }
      throw new Error(`[stoop] Error loading config "${file}": ${msg}`);
    }
  }

  throw new Error(`[stoop] No config file found. Tried: ${files.join(", ")}`);
}

/**
 * Convert theme keys from camelCase to snake_case for the Rust plugin.
 */
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convert a theme object's keys from camelCase to snake_case.
 */
function convertThemeKeys(theme: StoopTheme): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(theme)) {
    result[camelToSnake(key)] = value;
  }

  return result;
}

/**
 * Serialize config for the SWC plugin.
 * Converts camelCase theme keys to snake_case to match Rust serde field names.
 */
export function serializeForPlugin(config: StoopConfig): string {
  const serialized: Record<string, unknown> = {
    ...config,
    theme: convertThemeKeys(config.theme),
  };

  if (config.themes) {
    const themes: Record<string, unknown> = {};

    for (const [name, theme] of Object.entries(config.themes)) {
      themes[name] = convertThemeKeys(theme as StoopTheme);
    }
    serialized.themes = themes;
  }

  return JSON.stringify(serialized);
}

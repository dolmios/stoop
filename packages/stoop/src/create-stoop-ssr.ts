/**
 * SSR-safe entry point for Stoop.
 * Exports only server-safe APIs that don't require React.
 * Use this import in Server Components: import { createStoop } from "stoop/ssr"
 *
 * This file does NOT import React types or create React components.
 */

import type { StoopConfig, StoopServerInstance } from "./types";

// Import createStoopBase from create-stoop-internal to avoid React type imports
// create-stoop-internal.ts is a copy of create-stoop.ts without React imports at module level
import { createStoopBase } from "./create-stoop-internal";

export type {
  CSS,
  Theme,
  StoopConfig,
  StoopServerInstance,
  UtilityFunction,
  ThemeScale,
  DefaultTheme,
} from "./types";

export function createStoop(config: StoopConfig): StoopServerInstance {
  const base = createStoopBase(config);

  // Return only server-safe APIs (no React components)
  // Ensure config.prefix is always a string (not undefined) for type compatibility
  return {
    config: { ...base.config, prefix: base.sanitizedPrefix },
    createTheme: base.createTheme,
    css: base.css,
    getCssText: base.getCssText,
    globalCss: base.globalCss,
    keyframes: base.keyframes,
    preloadTheme: base.preloadTheme,
    theme: base.theme,
    warmCache: base.warmCache,
  };
}

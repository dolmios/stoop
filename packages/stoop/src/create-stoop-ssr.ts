/**
 * SSR-safe entry point for Stoop.
 * Exports only server-safe APIs that don't require React.
 * Use this import in Server Components: import { createStoop } from "stoop/ssr"
 */

import type { StoopConfig, StoopServerInstance } from "./types";

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

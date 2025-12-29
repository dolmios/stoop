/**
 * Client-side Stoop theme instance.
 * Exports all APIs including styled, Provider, useTheme.
 * For server-side getCssText in Server Components, import from "./lib/stoop.server"
 */

import { createStoop } from "stoop";

import { stoopConfig } from "./lib/stoop.config";

// Create client instance
const stoopInstance = createStoop(stoopConfig);

// Export all APIs for client components
export const {
  createTheme,
  css,
  globalCss,
  keyframes,
  preloadTheme,
  Provider,
  styled,
  theme,
  useTheme,
  warmCache,
} = stoopInstance;

// Also export getCssText for convenience (though server should use stoop.server.ts)
export const { getCssText } = stoopInstance;

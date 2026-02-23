import type { GlobalCSSFunction } from "./types.js";

/**
 * Runtime stub for globalCss().
 * No-op at runtime — the SWC plugin extracts global styles at build time.
 */
export const globalCss: GlobalCSSFunction = ((_styles: Record<string, unknown>) => {
  // No-op at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

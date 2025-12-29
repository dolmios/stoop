/**
 * Server-safe entry point for Stoop.
 * Exports only functions that work in Server Components.
 * NO React dependencies, NO "use client" directive.
 *
 * Use this entry point when importing Stoop in Next.js Server Components.
 *
 * @example
 * ```typescript
 * // In a Server Component (layout.tsx)
 * import { createStoop } from 'stoop/ssr';
 *
 * const { getCssText } = createStoop(config);
 * const cssText = getCssText();
 * ```
 */

export { createStoop } from "./create-stoop-server";
export type { StoopServerInstance } from "./create-stoop-server";
export { getCssText, clearStylesheet } from "./inject";
export { generateCSSVariables } from "./utils/theme";
export type { Theme, CSS, StoopConfig, UtilityFunction, Variants } from "./types";

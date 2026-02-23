import type { StoopConfig } from "stoop";

import { withStoop as withStoopBase } from "stoop/next";

import { theme } from "../theme.config.js";

interface NextConfig {
  transpilePackages?: string[];
  [key: string]: unknown;
}

interface WithStoopOptions {
  config?: StoopConfig;
  transpilePackages?: string[];
}

/**
 * Wraps a Next.js config with stoop-ui's theme, SWC plugin, and CSS extraction.
 *
 * Usage in next.config.mjs:
 * ```
 * import { withStoop } from "stoop-ui/next";
 * export default withStoop({ reactStrictMode: true });
 * ```
 *
 * This handles everything:
 * - Registers the stoop SWC plugin with stoop-ui's theme
 * - Adds transpilePackages for stoop-ui
 * - Sets up webpack CSS extraction
 * - Generates theme.css
 */
export function withStoop(nextConfig: NextConfig = {}, options?: WithStoopOptions): NextConfig {
  return withStoopBase(
    {
      ...nextConfig,
      transpilePackages: [
        "stoop-ui",
        ...(nextConfig.transpilePackages ?? []),
        ...(options?.transpilePackages ?? []),
      ],
    },
    { config: options?.config ?? theme },
  );
}

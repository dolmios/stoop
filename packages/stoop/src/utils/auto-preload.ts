/* eslint-disable no-console */
/**
 * Auto-preloading utilities for cache warming and theme preloading.
 * Helps eliminate FOUC (Flash of Unstyled Content) by pre-compiling styles and preloading themes.
 */

import type {
  CSS,
  Theme,
  ThemeDetectionOptions,
  ThemeDetectionResult,
  AutoPreloadOptions,
  AutoPreloadResult,
} from "../types";

import { detectTheme, detectThemeForSSR } from "./storage";

/**
 * Common UI component styles that are frequently used.
 * These represent typical design system patterns.
 */
export const COMMON_UI_STYLES: CSS[] = [
  // Layout primitives
  { alignItems: "center", display: "flex", justifyContent: "center" },
  { display: "flex", flexDirection: "column" },
  { position: "relative" },

  // Spacing utilities
  { padding: "$small" },
  { padding: "$medium" },
  { padding: "$large" },
  { margin: "$small" },
  { margin: "$medium" },
  { margin: "$large" },

  // Typography
  { fontSize: "$small" },
  { fontSize: "$medium" },
  { fontSize: "$large" },
  { fontWeight: "$normal" },
  { fontWeight: "$bold" },

  // Colors (using theme tokens)
  { color: "$text" },
  { color: "$textSecondary" },
  { backgroundColor: "$surface" },
  { backgroundColor: "$surfaceHover" },
  { border: "1px solid $border" },
  { borderColor: "$border" },

  // Interactive states
  { cursor: "pointer" },
  { opacity: 0.5 },
  { opacity: 0.7 },

  // Positioning
  { bottom: 0, left: 0, right: 0, top: 0 },
  { height: "100%", width: "100%" },

  // Borders and radii
  { borderRadius: "$small" },
  { borderRadius: "$medium" },
  { borderRadius: "$large" },
];

/**
 * Automatically warms the cache with common styles.
 *
 * @param warmCacheFn - The warmCache function from Stoop instance
 * @param styles - Styles to warm (defaults to COMMON_UI_STYLES)
 * @returns Promise that resolves when warming is complete
 */
export async function autoWarmCache(
  warmCacheFn: (styles: CSS[]) => void,
  styles: CSS[] = COMMON_UI_STYLES,
): Promise<void> {
  // Warm cache asynchronously to avoid blocking
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        warmCacheFn(styles);
        resolve();
      } catch (error) {
        // Silently fail - cache warming is not critical
        console.warn("[Stoop] Cache warming failed:", error);
        resolve();
      }
    }, 0);
  });
}

/**
 * Automatically preloads a detected theme.
 *
 * @param preloadThemeFn - The preloadTheme function from Stoop instance
 * @param options - Theme detection options
 * @param ssr - Whether running in SSR context
 * @returns Promise that resolves when preloading is complete
 */
export async function autoPreloadTheme(
  preloadThemeFn: (theme: string | Theme) => void,
  options: ThemeDetectionOptions = {},
  ssr = false,
): Promise<ThemeDetectionResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        if (ssr) {
          const themeName = detectThemeForSSR(options);

          if (themeName && themeName !== options.default) {
            preloadThemeFn(themeName);
          }
          resolve({
            confidence: 0.3,
            source: "default" as const,
            theme: themeName,
          });
        } else {
          const detection = detectTheme(options);

          if (detection.theme) {
            preloadThemeFn(detection.theme);
          }
          resolve(detection);
        }
      } catch (error) {
        console.warn("[Stoop] Theme preloading failed:", error);
        resolve({
          confidence: 0.3,
          source: "default",
          theme: options.default || "light",
        });
      }
    }, 0);
  });
}

/**
 * Performs automatic preloading operations based on configuration.
 *
 * @param warmCacheFn - The warmCache function from Stoop instance
 * @param preloadThemeFn - The preloadTheme function from Stoop instance
 * @param options - Auto-preload options
 * @returns Promise that resolves with preload results
 */
export async function autoPreload(
  warmCacheFn: (styles: CSS[]) => void,
  preloadThemeFn: (theme: string | Theme) => void,
  options: AutoPreloadOptions = {},
): Promise<AutoPreloadResult> {
  const {
    commonStyles = COMMON_UI_STYLES,
    enableCacheWarm = true,
    enableThemePreload = true,
    ssr = false,
    themeDetection = {},
  } = options;

  const result: AutoPreloadResult = {
    cacheWarmed: false,
    errors: [],
    themeDetection: { confidence: 0.3, source: "default", theme: "light" },
    themePreloaded: false,
  };

  const operations: Promise<void>[] = [];

  // Auto-warm cache
  if (enableCacheWarm && commonStyles.length > 0) {
    operations.push(
      autoWarmCache(warmCacheFn, commonStyles)
        .then(() => {
          result.cacheWarmed = true;
        })
        .catch((error) => {
          result.errors.push(
            `Cache warming failed: ${error instanceof Error ? error.message : String(error)}`,
          );
        }),
    );
  }

  // Auto-preload theme
  if (enableThemePreload) {
    operations.push(
      autoPreloadTheme(preloadThemeFn, themeDetection, ssr)
        .then((detection) => {
          result.themeDetection = detection;
          result.themePreloaded = true;
        })
        .catch((error) => {
          result.errors.push(
            `Theme preloading failed: ${error instanceof Error ? error.message : String(error)}`,
          );
        }),
    );
  }

  // Wait for all operations to complete
  await Promise.allSettled(operations);

  return result;
}

/**
 * Creates an auto-preloader with pre-configured options.
 *
 * @param warmCacheFn - The warmCache function from Stoop instance
 * @param preloadThemeFn - The preloadTheme function from Stoop instance
 * @param defaultOptions - Default auto-preload options
 * @returns Auto-preloader function
 */
export function createAutoPreloader(
  warmCacheFn: (styles: CSS[]) => void,
  preloadThemeFn: (theme: string | Theme) => void,
  defaultOptions: AutoPreloadOptions = {},
): (options?: Partial<AutoPreloadOptions>) => Promise<AutoPreloadResult> {
  return (options: Partial<AutoPreloadOptions> = {}): Promise<AutoPreloadResult> => {
    return autoPreload(warmCacheFn, preloadThemeFn, { ...defaultOptions, ...options });
  };
}

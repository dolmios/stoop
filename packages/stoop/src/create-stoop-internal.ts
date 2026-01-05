/**
 * Internal implementation for creating Stoop instances.
 * This file is used by the SSR entry point and does NOT import React types at module level.
 * React types are only imported conditionally when creating client instances.
 */

// Note: This file does NOT import React types to allow SSR-safe usage

import type { CSS, StoopConfig, Theme, ThemeScale } from "./types";

import {
  createTheme as createThemeFactory,
  createCSSFunction,
  createKeyframesFunction,
} from "./api/core-api";
import { createGlobalCSSFunction } from "./api/global-css";
// Note: React APIs (styled, Provider) are NOT imported here for SSR safety
import { DEFAULT_THEME_MAP } from "./constants";
import { compileCSS } from "./core/compiler";
import { mergeWithDefaultTheme, registerDefaultTheme, injectAllThemes } from "./core/theme-manager";
import { getCssText as getCssTextBase, removeThemeVariableBlocks } from "./inject";
import { validateTheme } from "./utils/helpers";
import { generateAllThemeVariables, generateCSSVariables } from "./utils/theme";
import { sanitizePrefix } from "./utils/theme-utils";

/**
 * Shared implementation for creating Stoop instances.
 * Handles common setup logic for both client and server instances.
 * Exported for use in SSR entry point.
 */
export function createStoopBase(config: StoopConfig): {
  config: StoopConfig;
  createTheme: (overrides?: Partial<Theme>) => Theme;
  css: ReturnType<typeof createCSSFunction>;
  getCssText: (theme?: string | Theme) => string;
  globalCss: ReturnType<typeof createGlobalCSSFunction>;
  globalCssConfig: StoopConfig["globalCss"];
  keyframes: ReturnType<typeof createKeyframesFunction>;
  media: StoopConfig["media"];
  mergedThemeMap: Record<string, ThemeScale>;
  preloadTheme: (theme: string | Theme) => void;
  sanitizedPrefix: string;
  theme: Theme;
  utils: StoopConfig["utils"];
  validatedTheme: Theme;
  warmCache: (styles: CSS[]) => void;
} {
  const {
    globalCss: globalCssConfig,
    media: configMedia,
    prefix = "stoop",
    theme,
    themeMap: userThemeMap,
    utils,
  } = config;
  const sanitizedPrefix = sanitizePrefix(prefix);

  const validatedTheme = validateTheme(theme);
  const media = validatedTheme.media || configMedia;

  const mergedThemeMap: Record<string, ThemeScale> = {
    ...DEFAULT_THEME_MAP,
    ...userThemeMap,
  };

  registerDefaultTheme(validatedTheme, sanitizedPrefix);

  const css = createCSSFunction(validatedTheme, sanitizedPrefix, media, utils, mergedThemeMap);
  const createTheme = createThemeFactory(validatedTheme);
  const globalCss = createGlobalCSSFunction(
    validatedTheme,
    sanitizedPrefix,
    media,
    utils,
    mergedThemeMap,
  );
  const keyframes = createKeyframesFunction(sanitizedPrefix, validatedTheme, mergedThemeMap);

  const themeObject = Object.freeze({ ...validatedTheme });

  /**
   * Pre-compiles CSS objects to warm the cache.
   * Useful for eliminating FOUC by pre-compiling common styles.
   *
   * @param styles - Array of CSS objects to pre-compile
   */
  function warmCache(styles: CSS[]): void {
    for (const style of styles) {
      try {
        compileCSS(style, validatedTheme, sanitizedPrefix, media, utils, mergedThemeMap);
      } catch {
        // Skip invalid styles
      }
    }
  }

  /**
   * Preloads a theme by injecting its CSS variables before React renders.
   * Useful for preventing FOUC when loading a non-default theme from localStorage.
   * Uses injectAllThemes to ensure all themes are available.
   *
   * @param theme - Theme to preload (can be theme name string or Theme object)
   */
  function preloadTheme(theme: string | Theme): void {
    if (!config.themes || Object.keys(config.themes).length === 0) {
      return;
    }

    // Always inject all themes for consistency and to prevent FOUC
    injectAllThemes(config.themes, sanitizedPrefix);
  }

  /**
   * Gets all injected CSS text for server-side rendering.
   * Always includes all theme CSS variables using attribute selectors.
   *
   * @param theme - Deprecated parameter, kept for backward compatibility but ignored
   * @returns CSS text string with theme variables and component styles
   */
  function getCssText(theme?: string | Theme): string {
    let result = "";

    // Always include all themes using attribute selectors for consistency
    if (config.themes && Object.keys(config.themes).length > 0) {
      // Merge all themes with default theme for consistency with client-side behavior
      const mergedThemes: Record<string, Theme> = {};

      for (const [themeName, theme] of Object.entries(config.themes)) {
        mergedThemes[themeName] = mergeWithDefaultTheme(theme, sanitizedPrefix);
      }

      const allThemeVars = generateAllThemeVariables(mergedThemes, sanitizedPrefix, "data-theme");

      if (allThemeVars) {
        result += allThemeVars + "\n";
      }
    } else {
      // No themes configured, just use default theme
      const themeVars = generateCSSVariables(validatedTheme, sanitizedPrefix);

      if (themeVars) {
        result += themeVars + "\n";
      }
    }

    const baseCss = getCssTextBase();
    // Remove any existing theme variable blocks (they're already included above)
    const cleanedCss = removeThemeVariableBlocks(baseCss).trim();

    if (cleanedCss) {
      result += (result ? "\n" : "") + cleanedCss;
    }

    return result;
  }

  return {
    config: { ...config, prefix: sanitizedPrefix },
    createTheme,
    css,
    getCssText,
    globalCss,
    globalCssConfig,
    keyframes,
    media,
    mergedThemeMap,
    preloadTheme,
    sanitizedPrefix,
    theme: themeObject,
    utils,
    // Internal values for React API creation
    validatedTheme,
    warmCache,
  };
}

// Export createStoopBase for use in SSR entry point
// Note: This file does NOT export createStoop() - that's in create-stoop.ts
// This separation allows SSR entry point to avoid bundling React code

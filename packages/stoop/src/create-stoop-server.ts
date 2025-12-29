/**
 * Server-safe factory function that creates a Stoop instance.
 * Only includes APIs that work without React: css, globalCss, keyframes, getCssText, etc.
 * Does NOT include: styled, Provider, useTheme
 *
 * This is the entry point for Server Components in Next.js App Router.
 */

import type { CSS, StoopConfig, Theme, ThemeScale } from "./types";

import { createTheme as createThemeFactory } from "./api/create-theme";
import { createCSSFunction } from "./api/css";
import { createGlobalCSSFunction } from "./api/global-css";
import { createKeyframesFunction } from "./api/keyframes";
import { DEFAULT_THEME_MAP } from "./constants";
import { compileCSS } from "./core/compiler";
import { registerDefaultTheme, updateThemeVariables } from "./core/theme-manager";
import { getCssText as getCssTextBase, registerTheme } from "./inject";
import { getRootRegex, sanitizePrefix } from "./utils/string";
import { generateCSSVariables } from "./utils/theme";
import { validateTheme } from "./utils/theme-validation";

/**
 * Server-safe Stoop instance interface.
 * Only includes APIs that work without React dependencies.
 */
export interface StoopServerInstance {
  config: StoopConfig & { prefix: string };
  createTheme: (themeOverride: Partial<Theme>) => Theme;
  css: (styles: CSS) => string;
  getCssText: (theme?: string | Theme) => string;
  globalCss: (...args: CSS[]) => () => void;
  keyframes: (definition: Record<string, CSS>) => string;
  preloadTheme: (theme: string | Theme) => void;
  theme: Theme;
  warmCache: (styles: CSS[]) => void;
}

/**
 * Creates a server-safe Stoop instance with the provided configuration.
 * Only includes APIs that work without React: css, globalCss, keyframes, getCssText, etc.
 *
 * @param config - Configuration object containing theme, media queries, utilities, and optional prefix/themeMap
 * @returns StoopServerInstance with server-safe API functions
 */
export function createStoop(config: StoopConfig): StoopServerInstance {
  const { media: configMedia, prefix = "stoop", theme, themeMap: userThemeMap, utils } = config;
  const sanitizedPrefix = sanitizePrefix(prefix);

  const validatedTheme = validateTheme(theme);
  const media = validatedTheme.media || configMedia;

  const mergedThemeMap: Record<string, ThemeScale> = {
    ...DEFAULT_THEME_MAP,
    ...userThemeMap,
  };

  registerDefaultTheme(validatedTheme, sanitizedPrefix);
  registerTheme(validatedTheme, sanitizedPrefix);

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
   *
   * @param theme - Theme to preload (can be theme name string or Theme object)
   */
  function preloadTheme(theme: string | Theme): void {
    let themeToInject: Theme;

    if (typeof theme === "string") {
      if (config.themes && config.themes[theme]) {
        themeToInject = config.themes[theme];
      } else {
        if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn(
            `[Stoop] Theme "${theme}" not found. Available themes: ${config.themes ? Object.keys(config.themes).join(", ") : "none"}`,
          );
        }

        return;
      }
    } else {
      themeToInject = theme;
    }

    updateThemeVariables(themeToInject, sanitizedPrefix);
  }

  /**
   * Gets all injected CSS text for server-side rendering.
   * Always includes theme CSS variables.
   *
   * @param theme - Optional theme (name or object) to include vars for (defaults to default theme)
   * @returns CSS text string with theme variables and component styles
   */
  function getCssText(theme?: string | Theme): string {
    let themeToUse: Theme = validatedTheme;

    if (theme) {
      if (typeof theme === "string") {
        if (config.themes && config.themes[theme]) {
          themeToUse = config.themes[theme];
        } else if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn(
            `[Stoop] Theme "${theme}" not found. Using default theme. Available: ${config.themes ? Object.keys(config.themes).join(", ") : "none"}`,
          );
        }
      } else {
        themeToUse = theme;
      }
    }

    let result = "";

    const themeVars = generateCSSVariables(themeToUse, sanitizedPrefix);

    if (themeVars) {
      result += themeVars + "\n";
    }

    const baseCss = getCssTextBase();
    const rootRegex = getRootRegex(sanitizedPrefix);
    const cssWithoutThemeVars = baseCss.replace(rootRegex, "").trim();

    if (cssWithoutThemeVars) {
      result += (result ? "\n" : "") + cssWithoutThemeVars;
    }

    return result;
  }

  return {
    config: { ...config, prefix: sanitizedPrefix },
    createTheme,
    css,
    getCssText,
    globalCss,
    keyframes,
    preloadTheme,
    theme: themeObject,
    warmCache,
  };
}

"use client";

/**
 * Client-side factory function that creates a Stoop instance.
 * Includes all APIs: styled, Provider, useTheme, etc.
 * For server-side getCssText, import from "stoop/ssr" instead.
 */

import type { ComponentType, Context } from "react";

import type {
  CSS,
  StoopConfig,
  StoopInstance,
  Theme,
  ThemeContextValue,
  ThemeScale,
} from "./types";

import { createTheme as createThemeFactory } from "./api/create-theme";
import { createCSSFunction } from "./api/css";
import { createGlobalCSSFunction } from "./api/global-css";
import { createKeyframesFunction } from "./api/keyframes";
import { createProvider } from "./api/provider";
import { createStyledFunction } from "./api/styled";
import { createUseThemeHook } from "./api/use-theme";
import { DEFAULT_THEME_MAP } from "./constants";
import { compileCSS } from "./core/compiler";
import { registerDefaultTheme, updateThemeVariables } from "./core/theme-manager";
import { getCssText as getCssTextBase, registerTheme } from "./inject";
import { getRootRegex, sanitizePrefix } from "./utils/string";
import { generateCSSVariables } from "./utils/theme";
import { validateTheme } from "./utils/theme-validation";

/**
 * Creates a Stoop instance with the provided configuration.
 * Includes all APIs: styled, Provider, useTheme, etc.
 *
 * @param config - Configuration object containing theme, media queries, utilities, and optional prefix/themeMap
 * @returns StoopInstance with all API functions
 */
export function createStoop(config: StoopConfig): StoopInstance {
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

  // Create Provider and useTheme if themes are configured
  let Provider: ComponentType<import("./types").ProviderProps> | undefined;
  let useTheme: (() => import("./types").ThemeManagementContextValue) | undefined;
  let themeContext: Context<ThemeContextValue | null> | undefined;

  if (config.themes) {
    const mergedThemesForProvider: Record<string, Theme> = {};

    for (const [themeName, themeOverride] of Object.entries(config.themes)) {
      mergedThemesForProvider[themeName] = createTheme(themeOverride);
    }

    const {
      Provider: ProviderComponent,
      ThemeContext,
      ThemeManagementContext,
    } = createProvider(mergedThemesForProvider, validatedTheme, sanitizedPrefix);

    themeContext = ThemeContext;
    Provider = ProviderComponent;
    useTheme = createUseThemeHook(ThemeManagementContext);
  }

  // Create styled function
  const styled = createStyledFunction(
    validatedTheme,
    sanitizedPrefix,
    media,
    utils,
    mergedThemeMap,
    themeContext,
  );

  // Return instance with all APIs
  return {
    config: { ...config, prefix: sanitizedPrefix },
    createTheme,
    css,
    getCssText,
    globalCss,
    keyframes,
    preloadTheme,
    Provider,
    styled,
    theme: themeObject,
    useTheme,
    warmCache,
  } as StoopInstance;
}

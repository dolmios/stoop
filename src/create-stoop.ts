/**
 * Main factory function that creates a Stoop instance.
 * Configures theme, media queries, utilities, and returns all API functions.
 */

import { createContext } from "react";

import type { CSS, StoopConfig, StoopInstance, Theme, ThemeContextValue, ThemeScale } from "./types";

import { createTheme as createThemeFactory } from "./api/create-theme";
import { createCSSFunction } from "./api/css";
import { createGlobalCSSFunction } from "./api/global-css";
import { createKeyframesFunction } from "./api/keyframes";
import { createProvider } from "./api/provider";
import { createStyledFunction } from "./api/styled";
import { createUseThemeHook } from "./api/use-theme";
import { compileCSS } from "./core/compiler";
import { registerDefaultTheme, updateThemeVariables } from "./core/theme-manager";
import { getCssText as getCssTextBase, registerTheme } from "./inject";
import { getRootRegex, sanitizePrefix } from "./utils/string";
import { generateCSSVariables } from "./utils/theme";
import { DEFAULT_THEME_MAP } from "./utils/theme-map";
import { validateTheme } from "./utils/theme-validation";

/**
 * Creates a Stoop instance with the provided configuration.
 *
 * @param config - Configuration object containing theme, media queries, utilities, and optional prefix/themeMap
 * @returns StoopInstance with all API functions (styled, css, globalCss, keyframes, createTheme, etc.)
 */
export function createStoop(config: StoopConfig): StoopInstance {
  // Default prefix to "stoop" for better stability and conflict prevention
  // sanitizePrefix will ensure we always have a valid prefix (defaults to "stoop")
  const { media: configMedia, prefix = "stoop", theme, themeMap: userThemeMap, utils } = config;
  const sanitizedPrefix = sanitizePrefix(prefix);

  const validatedTheme = validateTheme(theme);

  // Extract media from theme if present, otherwise fall back to config media (backward compatibility)
  const media = validatedTheme.media || configMedia;

  const mergedThemeMap: Record<string, ThemeScale> = {
    ...DEFAULT_THEME_MAP,
    ...userThemeMap,
  };

  const ThemeContext = createContext<ThemeContextValue | null>(null);

  // Register the default theme so additional themes can be merged with it
  registerDefaultTheme(validatedTheme, sanitizedPrefix);
  // registerTheme injects CSS variables synchronously - this ensures they exist before any CSS compilation
  registerTheme(validatedTheme, sanitizedPrefix);

  const css = createCSSFunction(validatedTheme, sanitizedPrefix, media, utils, mergedThemeMap);
  const createTheme = createThemeFactory(validatedTheme);
  const globalCss = createGlobalCSSFunction(validatedTheme, sanitizedPrefix, media, utils, mergedThemeMap);
  const keyframes = createKeyframesFunction(sanitizedPrefix, validatedTheme, mergedThemeMap);
  const styled = createStyledFunction(validatedTheme, sanitizedPrefix, media, utils, mergedThemeMap, ThemeContext);

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
      // If themes config exists and theme name is valid, use it
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
        // Theme name provided - look it up in themes config
        if (config.themes && config.themes[theme]) {
          themeToUse = config.themes[theme];
        } else if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn(
            `[Stoop] Theme "${theme}" not found. Using default theme. Available: ${config.themes ? Object.keys(config.themes).join(", ") : "none"}`,
          );
        }
      } else {
        // Theme object provided directly
        themeToUse = theme;
      }
    }

    let result = "";

    // Always include theme variables at the top
    const themeVars = generateCSSVariables(themeToUse, sanitizedPrefix);

    if (themeVars) {
      result += themeVars + "\n";
    }

    // Append all other CSS
    const baseCss = getCssTextBase();

    // Remove existing theme variables from base CSS to avoid duplication
    const rootRegex = getRootRegex(sanitizedPrefix);
    const cssWithoutThemeVars = baseCss.replace(rootRegex, "").trim();

    if (cssWithoutThemeVars) {
      result += (result ? "\n" : "") + cssWithoutThemeVars;
    }

    return result;
  }

  // Create Provider and useTheme if themes config is provided
  let Provider: StoopInstance["Provider"];
  let useTheme: StoopInstance["useTheme"];

  if (config.themes) {
    // Merge all themes with the default theme to ensure all properties are present
    const mergedThemes: Record<string, Theme> = {};

    for (const [themeName, themeOverride] of Object.entries(config.themes)) {
      // Deep merge each theme with the default theme
      mergedThemes[themeName] = createTheme(themeOverride);
    }

    const { Provider: ProviderComponent, ThemeManagementContext } = createProvider(
      ThemeContext,
      mergedThemes,
      validatedTheme,
      sanitizedPrefix,
    );

    Provider = ProviderComponent;
    useTheme = createUseThemeHook(ThemeManagementContext);
  }

  const instance: StoopInstance = {
    config: { ...config, prefix: sanitizedPrefix },
    createTheme,
    css,
    getCssText,
    globalCss,
    keyframes,
    preloadTheme,
    styled,
    theme: themeObject,
    warmCache,
  };

  // Conditionally add Provider and useTheme if they exist
  if (Provider) {
    instance.Provider = Provider;
  }

  if (useTheme) {
    instance.useTheme = useTheme;
  }

  return instance;
}

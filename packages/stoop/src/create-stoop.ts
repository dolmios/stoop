/**
 * Factory function that creates a Stoop instance.
 * Supports both client-side (with React APIs) and server-side (without React) usage.
 */

import type { ComponentType, Context } from "react";

import type {
  CSS,
  ProviderProps,
  StoopConfig,
  StoopInstance,
  Theme,
  ThemeContextValue,
  ThemeManagementContextValue,
  ThemeScale,
} from "./types";

import {
  createTheme as createThemeFactory,
  createCSSFunction,
  createKeyframesFunction,
  createGlobalCSSFunction,
} from "./api/core-api";
import { createStyledFunction } from "./api/styled";
import { createProvider, createUseThemeHook } from "./api/theme-provider";
import { DEFAULT_THEME_MAP } from "./constants";
import { compileCSS, cssObjectToString } from "./core/compiler";
import { mergeWithDefaultTheme, registerDefaultTheme, injectAllThemes } from "./core/theme-manager";
import { getCssText as getCssTextBase, removeThemeVariableBlocks } from "./inject";
import { validateTheme, applyUtilities } from "./utils/helpers";
import {
  generateAllThemeVariables,
  generateCSSVariables,
  replaceThemeTokensWithVars,
} from "./utils/theme";
import { sanitizePrefix } from "./utils/theme-utils";

/**
 * Shared implementation for creating Stoop instances.
 * Handles common setup logic for both client and server instances.
 */
export function createStoopBase(config: StoopConfig): {
  config: StoopConfig;
  createTheme: (overrides?: Partial<Theme>) => Theme;
  css: ReturnType<typeof createCSSFunction>;
  getCssText: () => string;
  globalCss: ReturnType<typeof createGlobalCSSFunction>;
  globalCssConfig: StoopConfig["globalCss"];
  keyframes: ReturnType<typeof createKeyframesFunction>;
  media: StoopConfig["media"];
  mergedThemeMap: Record<string, ThemeScale>;
  preloadTheme: () => void;
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
   * Preloads themes by injecting CSS variables before React renders.
   * Useful for preventing FOUC when loading a non-default theme from localStorage.
   */
  function preloadTheme(): void {
    if (!config.themes || Object.keys(config.themes).length === 0) {
      return;
    }

    injectAllThemes(config.themes, sanitizedPrefix);
  }

  /**
   * Gets all injected CSS text for server-side rendering.
   * Includes all theme CSS variables using attribute selectors.
   * Includes global CSS config for SSR (prevents FOUC in Pages Router).
   *
   * @returns CSS text string with theme variables, global CSS, and component styles
   */
  function getCssText(): string {
    let result = "";

    if (config.themes && Object.keys(config.themes).length > 0) {
      const mergedThemes: Record<string, Theme> = {};

      for (const [themeName, theme] of Object.entries(config.themes)) {
        mergedThemes[themeName] = mergeWithDefaultTheme(theme, sanitizedPrefix);
      }

      const allThemeVars = generateAllThemeVariables(mergedThemes, sanitizedPrefix, "data-theme");

      if (allThemeVars) {
        result += allThemeVars + "\n";
      }
    } else {
      const themeVars = generateCSSVariables(validatedTheme, sanitizedPrefix);

      if (themeVars) {
        result += themeVars + "\n";
      }
    }

    // Include global CSS from config for SSR
    // This ensures global styles are present in initial HTML (prevents FOUC)
    // Provider will call globalCss() on mount but it's deduplicated automatically
    if (globalCssConfig) {
      const stylesWithUtils = applyUtilities(globalCssConfig, utils);
      const themedStyles = replaceThemeTokensWithVars(
        stylesWithUtils,
        validatedTheme,
        mergedThemeMap,
      );
      const globalCssText = cssObjectToString(themedStyles, "", 0, media);

      if (globalCssText) {
        result += (result ? "\n" : "") + globalCssText;
      }
    }

    const baseCss = getCssTextBase();
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
    validatedTheme,
    warmCache,
  };
}

/**
 * Creates a Stoop instance with the provided configuration.
 * Includes all APIs: styled, Provider, useTheme, etc.
 *
 * @param config - Configuration object containing theme, media queries, utilities, and optional prefix/themeMap
 * @returns StoopInstance with all API functions
 */
export type {
  CSS,
  ComponentProps,
  DefaultTheme,
  StoopConfig,
  StoopInstance,
  Theme,
  ThemeScale,
  UtilityFunction,
} from "./types";

export function createStoop(config: StoopConfig): StoopInstance {
  const base = createStoopBase(config);

  let Provider: ComponentType<ProviderProps> | undefined;
  let useTheme: (() => ThemeManagementContextValue) | undefined;
  let themeContext: Context<ThemeContextValue | null> | undefined;

  if (config.themes) {
    const mergedThemesForProvider: Record<string, Theme> = {};

    for (const [themeName, themeOverride] of Object.entries(config.themes)) {
      mergedThemesForProvider[themeName] = base.createTheme(themeOverride);
    }

    const {
      Provider: ProviderComponent,
      ThemeContext,
      ThemeManagementContext,
    } = createProvider(
      mergedThemesForProvider,
      base.validatedTheme,
      base.sanitizedPrefix,
      base.globalCssConfig,
      base.globalCss,
    );

    themeContext = ThemeContext;
    Provider = ProviderComponent;
    useTheme = createUseThemeHook(ThemeManagementContext);
  }

  const styled = createStyledFunction(
    base.validatedTheme,
    base.sanitizedPrefix,
    base.media,
    base.utils,
    base.mergedThemeMap,
    themeContext,
  );

  return {
    config: base.config,
    createTheme: base.createTheme,
    css: base.css,
    getCssText: base.getCssText,
    globalCss: base.globalCss,
    keyframes: base.keyframes,
    preloadTheme: base.preloadTheme,
    Provider,
    styled,
    theme: base.theme,
    useTheme,
    warmCache: base.warmCache,
  } as StoopInstance;
}

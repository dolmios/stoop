/**
 * Client-side entry point for creating Stoop instances.
 * Includes React-based APIs: styled(), Provider, useTheme.
 *
 * NOTE: This file imports from "use client" modules (api/styled, api/theme-provider)
 * making it client-side only. For server-side usage, import from "stoop/ssr".
 */

import type { ComponentType, Context } from "react";

import type {
  ProviderProps,
  StoopConfig,
  StoopInstance,
  Theme,
  ThemeContextValue,
  ThemeManagementContextValue,
} from "./types";

import { createStyledFunction } from "./api/styled"; // "use client" module
import { createProvider, createUseThemeHook } from "./api/theme-provider"; // "use client" module
import { createStoopBase } from "./create-stoop-internal"; // Server-safe module

/**
 * Creates a Stoop instance with the provided configuration.
 * Includes all APIs: styled, Provider, useTheme, etc.
 *
 * @param config - Configuration object containing theme, media queries, utilities, and optional prefix/themeMap
 * @returns StoopInstance with all API functions
 */
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

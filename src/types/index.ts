/**
 * Core TypeScript type definitions for Stoop.
 * Defines CSS objects, themes, variants, styled components, and instance types.
 */

import type { ComponentType, ElementType, JSX, ReactNode } from "react";
import type { PolymorphicPropsWithRef } from "react-polymorphic-types";

import type { createTheme } from "../api/create-theme";
import type { createCSSFunction } from "../api/css";
import type { createGlobalCSSFunction } from "../api/global-css";
import type { createKeyframesFunction } from "../api/keyframes";
import type { createStyledFunction } from "../api/styled";

export type CSSPropertyValue = string | number;

export interface StyledComponentRef {
  readonly __stoopClassName: string;
  readonly __isStoopStyled: true;
  toString(): string;
}

export interface CSS {
  [property: string]: CSSPropertyValue | CSS | Variants | unknown[] | undefined;
}

export interface Variants {
  [variantName: string]: {
    [variantValue: string]: CSS;
  };
}

export interface VariantProps {
  [variantName: string]: string | number | boolean | undefined;
}

export type HTMLElements = keyof JSX.IntrinsicElements;
export type StylableElement = HTMLElements | ElementType;

export interface StyledBaseProps {
  css?: CSS;
}

export type UtilityFunction = (value: CSSPropertyValue | CSS | undefined) => CSS;

/**
 * Theme scale type - represents valid keys from DefaultTheme.
 * Used for type-safe theme scale references throughout the codebase.
 */
export type ThemeScale = keyof DefaultTheme;

/**
 * Theme interface - strictly enforces only these 13 approved scales.
 * Custom theme scales are NOT allowed.
 * Media queries are also supported as part of the theme.
 */
export interface DefaultTheme {
  colors?: Record<string, string>;
  opacities?: Record<string, string | number>;
  space?: Record<string, string>;
  radii?: Record<string, string>;
  sizes?: Record<string, string>;
  fonts?: Record<string, string>;
  fontWeights?: Record<string, string | number>;
  fontSizes?: Record<string, string>;
  lineHeights?: Record<string, string | number>;
  letterSpacings?: Record<string, string>;
  shadows?: Record<string, string>;
  zIndices?: Record<string, string | number>;
  transitions?: Record<string, string>;
  media?: Record<string, string>;
}

/**
 * Theme type - strictly enforces DefaultTheme structure.
 * No custom scales are allowed.
 */
export type Theme = DefaultTheme;

export interface StoopConfig {
  theme: DefaultTheme;
  themes?: Record<string, DefaultTheme>;
  media?: Record<string, string>;
  utils?: Record<string, UtilityFunction>;
  prefix?: string;
  themeMap?: Record<string, ThemeScale>;
}

export type VariantKeys<T extends Variants> = keyof T;

export type VariantPropsFromConfig<T extends Variants> = {
  [K in VariantKeys<T>]?: keyof T[K] | boolean | number;
};

type StyledOwnProps<VariantsConfig extends Variants> = StyledBaseProps &
  (VariantsConfig extends Record<string, never> ? {} : VariantPropsFromConfig<VariantsConfig>);

export type StyledComponentProps<
  DefaultElement extends ElementType,
  VariantsConfig extends Variants = {},
> = PolymorphicPropsWithRef<StyledOwnProps<VariantsConfig>, DefaultElement>;

export interface ThemeContextValue {
  theme: Theme;
  themeName?: string;
}

export interface ThemeManagementContextValue {
  theme: Theme;
  themeName: string;
  setTheme: (themeName: string) => void;
  toggleTheme: () => void;
  availableThemes: readonly string[];
}

export interface GetCssTextOptions {
  theme?: Theme;
  includeThemeVars?: boolean;
}

export interface ProviderProps {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  attribute?: string;
}

export interface StoopInstance {
  styled: ReturnType<typeof createStyledFunction>;
  css: ReturnType<typeof createCSSFunction>;
  createTheme: ReturnType<typeof createTheme>;
  globalCss: ReturnType<typeof createGlobalCSSFunction>;
  keyframes: ReturnType<typeof createKeyframesFunction>;
  theme: DefaultTheme;
  /**
   * Gets all generated CSS text for server-side rendering.
   * Always includes theme CSS variables.
   *
   * @param theme - Optional theme (name or object) to include vars for (defaults to default theme)
   * @returns CSS text string with theme variables and component styles
   */
  getCssText: (theme?: string | Theme) => string;
  config: StoopConfig;
  /**
   * Pre-compiles CSS objects to warm the cache.
   * Useful for eliminating FOUC by pre-compiling common styles.
   *
   * @param styles - Array of CSS objects to pre-compile
   */
  warmCache: (styles: CSS[]) => void;
  /**
   * Preloads a theme by injecting its CSS variables before React renders.
   * Useful for preventing FOUC when loading a non-default theme from localStorage.
   *
   * @param theme - Theme to preload (theme name string or Theme object)
   */
  preloadTheme: (theme: string | Theme) => void;
  /**
   * Provider component for managing theme state and updates.
   * Only available if themes were provided in createStoop config.
   */
  Provider?: ComponentType<ProviderProps>;
  /**
   * Hook to access theme management context.
   * Only available if themes were provided in createStoop config.
   */
  useTheme?: () => ThemeManagementContextValue;
}

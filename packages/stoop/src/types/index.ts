/**
 * Core TypeScript type definitions for Stoop.
 * Defines CSS objects, themes, variants, styled components, and instance types.
 */

import type { ComponentType, ElementType, JSX, ReactNode } from "react";
import type { PolymorphicPropsWithRef } from "react-polymorphic-types";

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
  globalCss?: CSS;
}

export type VariantKeys<T extends Variants> = keyof T;

// Extract the keys from a variant object, preserving literal types when possible
// Uses CSS constraint instead of 'any' to properly type variant values
// This preserves literal string/number/boolean types from variant definitions
type ExtractVariantKeys<T> =
  T extends Record<infer K, CSS>
    ? K extends string | number | boolean
      ? K
      : T extends Record<string, CSS>
        ? string
        : never
    : T extends Record<string, CSS>
      ? keyof T
      : never;

export type VariantPropsFromConfig<T extends Variants> = {
  [K in VariantKeys<T>]?: ExtractVariantKeys<T[K]>;
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

/**
 * Server-side Stoop instance.
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

// ===== UTILITY TYPES =====

/**
 * Theme detection options for automatic theme selection.
 */
export interface ThemeDetectionOptions {
  /** localStorage key to check for stored theme preference */
  localStorage?: string;
  /** Cookie name to check for stored theme preference */
  cookie?: string;
  /** Whether to check system color scheme preference */
  systemPreference?: boolean;
  /** Default theme name to fall back to */
  default?: string;
  /** Available themes map for validation */
  themes?: Record<string, Theme>;
}

/**
 * Result of theme detection.
 */
export interface ThemeDetectionResult {
  /** Detected theme name */
  theme: string;
  /** Source of the theme detection */
  source: "cookie" | "localStorage" | "system" | "default";
  /** Confidence level (0-1) of the detection */
  confidence: number;
}

/**
 * Storage type enumeration.
 */
export type StorageType = "localStorage" | "cookie";

/**
 * Options for storage operations.
 */
export interface StorageOptions {
  /** Storage type */
  type?: StorageType;
  /** Cookie max age in seconds (only for cookies) */
  maxAge?: number;
  /** Cookie path (only for cookies) */
  path?: string;
  /** Whether to use secure cookies (only for cookies) */
  secure?: boolean;
}

/**
 * Storage result with metadata.
 */
export interface StorageResult<T = string> {
  /** The stored value */
  value: T;
  /** Whether the operation succeeded */
  success: boolean;
  /** Error message if operation failed */
  error?: string;
  /** Source of the value */
  source?: StorageType;
}

/**
 * Options for auto-preloading.
 */
export interface AutoPreloadOptions {
  /** Theme detection options */
  themeDetection?: ThemeDetectionOptions;
  /** Common styles to warm the cache with */
  commonStyles?: CSS[];
  /** Whether to enable automatic theme preloading */
  enableThemePreload?: boolean;
  /** Whether to enable automatic cache warming */
  enableCacheWarm?: boolean;
  /** Whether to run in SSR context (limits available APIs) */
  ssr?: boolean;
}

/**
 * Result of auto-preloading operations.
 */
export interface AutoPreloadResult {
  /** Detected theme information */
  themeDetection: ThemeDetectionResult;
  /** Whether cache was warmed */
  cacheWarmed: boolean;
  /** Whether theme was preloaded */
  themePreloaded: boolean;
  /** Any errors that occurred */
  errors: string[];
}

/**
 * Styled component type - the return type of styled()
 */
export type StyledComponent<
  DefaultElement extends ElementType,
  VariantsConfig extends Variants = {},
> = ComponentType<StyledComponentProps<DefaultElement, VariantsConfig>> & {
  selector: StyledComponentRef;
};

/**
 * Styled function type - the main styled() function signature
 */
export interface StyledFunction {
  <DefaultElement extends StylableElement, VariantsConfig extends Variants = {}>(
    defaultElement: DefaultElement,
    baseStyles?: CSS,
    variants?: VariantsConfig,
  ): StyledComponent<DefaultElement, VariantsConfig>;
}

export interface GetCssTextOptions {
  theme?: Theme;
  includeThemeVars?: boolean;
}

export interface ProviderProps {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  cookieKey?: string;
  attribute?: string;
}

/**
 * CSS function type
 */
export interface CSSFunction {
  (styles: CSS): string;
}

/**
 * Global CSS function type
 */
export interface GlobalCSSFunction {
  (styles: CSS): () => void;
}

/**
 * Keyframes function type
 */
export interface KeyframesFunction {
  (keyframes: Record<string, CSS>): string;
}

/**
 * Create theme function type
 */
export interface CreateThemeFunction {
  (theme: Partial<DefaultTheme>): DefaultTheme;
}

/**
 * Stoop instance.
 * Includes all APIs: styled, Provider, useTheme, css, globalCss, keyframes, etc.
 */
export interface StoopInstance {
  styled: StyledFunction;
  css: CSSFunction;
  createTheme: CreateThemeFunction;
  globalCss: GlobalCSSFunction;
  keyframes: KeyframesFunction;
  theme: DefaultTheme;
  /**
   * Gets all generated CSS text for server-side rendering.
   * Always includes theme CSS variables.
   *
   * @param theme - Deprecated parameter, kept for backward compatibility but ignored
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
   * Available when themes are provided in createStoop config.
   */
  Provider: ComponentType<ProviderProps>;
  /**
   * Hook to access theme management context.
   * Available when themes are provided in createStoop config.
   */
  useTheme: () => ThemeManagementContextValue;
}

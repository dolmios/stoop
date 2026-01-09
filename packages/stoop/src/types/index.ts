/**
 * Core TypeScript type definitions for Stoop.
 * Defines CSS objects, themes, variants, styled components, and instance types.
 */

import type {
  ComponentType,
  ElementType,
  JSX,
  ReactNode,
  ForwardRefExoticComponent,
  ComponentPropsWithRef,
  ReactElement,
} from "react";

// ============================================================================
// Type Utilities
// ============================================================================

/**
 * Remove index signatures from a type, leaving only known properties.
 * Useful for better autocomplete and type inference.
 * Inspired by Stitches' RemoveIndex utility.
 *
 * @example
 * ```ts
 * type MyType = { foo: string; bar: number; [key: string]: unknown };
 * type Clean = RemoveIndexSignature<MyType>; // { foo: string; bar: number }
 * ```
 */
export type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};

/**
 * Widen literal types to their base types for more flexible prop types.
 * Allows both literal values and their base types.
 * Inspired by Stitches' Widen utility.
 *
 * **Note:** Currently unused in Stoop - we enforce strict literal types in variants.
 * Available for future use if more flexible prop types are desired.
 *
 * @example
 * ```ts
 * type Strict = "sm" | "lg"; // Only accepts "sm" | "lg"
 * type BoolWiden = Widen<"true" | "false">; // boolean | "true" | "false"
 * type NumWiden = Widen<"1" | "2">; // number | "1" | "2"
 * ```
 */
export type Widen<T> = T extends "true"
  ? boolean | T
  : T extends "false"
    ? boolean | T
    : T extends `${number}`
      ? number | T
      : T;

/**
 * Narrowed string type for better type inference in unions.
 * The intersection with Record<never, never> makes it distinct from plain string.
 *
 * @example
 * ```ts
 * type Props = { variant: "sm" | "lg" | NarrowString };
 * // Autocomplete shows "sm" | "lg" but also accepts any string
 * ```
 */
export type NarrowString = string & Record<never, never>;

/**
 * Returns a string with the given prefix followed by the given values.
 * Used to generate token names like "$primary" from theme keys.
 *
 * @example
 * ```ts
 * type Tokens = Prefixed<"$", "primary" | "secondary">; // "$primary" | "$secondary"
 * ```
 */
export type Prefixed<K extends string, T> = `${K}${Extract<T, boolean | number | string>}`;

/**
 * Generates valid token names for a theme scale.
 * Creates a union of "$tokenName" strings from the keys of a theme scale.
 *
 * @example
 * ```ts
 * type Theme = { colors: { primary: string; secondary: string } };
 * type ColorTokens = TokenByScaleName<"colors", Theme>; // "$primary" | "$secondary"
 * ```
 */
export type TokenByScaleName<
  ScaleName extends string,
  Theme extends DefaultTheme,
> = ScaleName extends keyof Theme
  ? Theme[ScaleName] extends Record<string, ThemeScaleValue>
    ? Prefixed<"$", keyof Theme[ScaleName]>
    : never
  : never;

/**
 * Generates valid token names for a CSS property based on themeMap.
 * Maps the property to a theme scale, then generates tokens for that scale.
 *
 * @example
 * ```ts
 * type Theme = { colors: { primary: string } };
 * type ThemeMap = { color: "colors" };
 * type ColorTokens = TokenByPropertyName<"color", Theme, ThemeMap>; // "$primary"
 * ```
 */
export type TokenByPropertyName<
  PropertyName extends string,
  Theme extends DefaultTheme,
  ThemeMap extends Record<string, ThemeScale>,
> = PropertyName extends keyof ThemeMap
  ? TokenByScaleName<ThemeMap[PropertyName], Theme>
  : never;

/**
 * Generates all valid tokens from all theme scales.
 * Creates a union of all "$tokenName" strings from all scales in the theme.
 *
 * @example
 * ```ts
 * type Theme = { colors: { primary: string }; space: { small: string } };
 * type AllTokens = AllThemeTokens<Theme>; // "$primary" | "$small"
 * ```
 */
export type AllThemeTokens<Theme extends DefaultTheme> = {
  [K in keyof Theme]: K extends ThemeScale
    ? Theme[K] extends Record<string, ThemeScaleValue>
      ? Prefixed<"$", keyof Theme[K]>
      : never
    : never;
}[keyof Theme];

// ============================================================================
// CSS Types
// ============================================================================

export type CSSPropertyValue = string | number;

export interface StyledComponentRef {
  readonly __stoopClassName: string;
  readonly __isStoopStyled: true;
  toString(): string;
}

/**
 * CSS style object interface.
 * Supports nested selectors, media queries, variants, and CSS property values.
 *
 * Property values can be:
 * - Primitives: string | number
 * - Theme tokens: "$tokenName" strings validated against the theme
 * - Nested CSS objects: for pseudo-selectors, media queries, nested selectors
 * - Variants: variant configuration object
 * - Arrays: for multiple values (e.g., multiple box-shadows, transforms)
 * - undefined: for optional properties
 *
 * **Note on `unknown[]`:** Intentionally permissive to support various CSS patterns:
 * - Multiple transforms: `["translateX(10px)", "rotate(45deg)"]`
 * - Multiple box-shadows: `["0 0 10px rgba(0,0,0,0.1)", "inset 0 0 5px white"]`
 * - Vendor prefix values: `["-webkit-line-clamp", "3"]`
 *
 * **Theme Token Validation:**
 * When Theme and ThemeMap are provided, CSS property values are validated:
 * - Known properties accept valid theme tokens (e.g., `color: "$primary"`)
 * - Unknown properties still accept any string (for flexibility)
 * - Tokens are validated against the theme scales via ThemeMap
 *
 * @example
 * ```ts
 * const stoop = createStoop({
 *   theme: { colors: { primary: "#000" } },
 *   themeMap: { color: "colors" }
 * });
 * // color: "$primary" ✅ (valid token)
 * // color: "$invalid" ❌ (TypeScript error)
 * ```
 */
export interface CSS<
  Theme extends DefaultTheme = DefaultTheme,
  ThemeMap extends Record<string, ThemeScale> = Record<string, ThemeScale>,
> {
  [property: string]:
    | CSSPropertyValue
    | (AllThemeTokens<Theme> extends never ? never : AllThemeTokens<Theme>)
    | CSS<Theme, ThemeMap>
    | Variants<Theme, ThemeMap>
    | unknown[]
    | undefined;
}

/**
 * Variants type definition.
 * Uses mapped type to preserve literal types instead of Record which widens them.
 * This allows variant values like "primary" | "secondary" to be preserved as literal types
 * rather than being widened to string.
 */
export type Variants<
  Theme extends DefaultTheme = DefaultTheme,
  ThemeMap extends Record<string, ThemeScale> = Record<string, ThemeScale>,
> = {
  [variantName: string]: {
    [variantValue: string]: CSS<Theme, ThemeMap>;
  };
};

/**
 * Internal type for variant prop values (used by styled implementation).
 * @internal
 */
interface InternalVariantProps {
  [variantName: string]: string | number | boolean | undefined;
}

export type HTMLElements = keyof JSX.IntrinsicElements;
export type StylableElement = HTMLElements | ElementType;

export interface StyledBaseProps<
  Theme extends DefaultTheme = DefaultTheme,
  ThemeMap extends Record<string, ThemeScale> = Record<string, ThemeScale>,
> {
  css?: CSS<Theme, ThemeMap>;
}

/**
 * CSS object that includes variants configuration.
 * Used for styled component definitions that combine base styles with variants.
 * Made generic to preserve exact variant literal types from the input.
 * We exclude variants from the CSS index signature to make it distinct.
 */
export type CSSWithVariants<
  Theme extends DefaultTheme = DefaultTheme,
  ThemeMap extends Record<string, ThemeScale> = Record<string, ThemeScale>,
  V extends Variants<Theme, ThemeMap> = Variants<Theme, ThemeMap>,
> = {
  [K in keyof CSS<Theme, ThemeMap> as K extends "variants" ? never : K]: CSS<Theme, ThemeMap>[K];
} & {
  variants: V;
};

export type UtilityFunction<
  Theme extends DefaultTheme = DefaultTheme,
  ThemeMap extends Record<string, ThemeScale> = Record<string, ThemeScale>,
> = (
  value: CSSPropertyValue | CSS<Theme, ThemeMap> | undefined,
) => CSS<Theme, ThemeMap>;

/**
 * Theme scale value type - restricts values to primitives.
 * Ensures theme tokens are serializable and valid CSS values.
 */
export type ThemeScaleValue = string | number;

/**
 * Theme scale type - represents valid keys from DefaultTheme.
 * Used for type-safe theme scale references throughout the codebase.
 */
export type ThemeScale = keyof DefaultTheme;

/**
 * Theme interface - strictly enforces only these 13 approved scales.
 * Custom theme scales are NOT allowed.
 * Media queries are also supported as part of the theme.
 * All scale values must be strings or numbers (primitives only).
 */
export interface DefaultTheme {
  colors?: Record<string, ThemeScaleValue>;
  opacities?: Record<string, ThemeScaleValue>;
  space?: Record<string, ThemeScaleValue>;
  radii?: Record<string, ThemeScaleValue>;
  sizes?: Record<string, ThemeScaleValue>;
  fonts?: Record<string, ThemeScaleValue>;
  fontWeights?: Record<string, ThemeScaleValue>;
  fontSizes?: Record<string, ThemeScaleValue>;
  lineHeights?: Record<string, ThemeScaleValue>;
  letterSpacings?: Record<string, ThemeScaleValue>;
  shadows?: Record<string, ThemeScaleValue>;
  zIndices?: Record<string, ThemeScaleValue>;
  transitions?: Record<string, ThemeScaleValue>;
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

/**
 * Extract the keys from a variant object, preserving literal types.
 * Special handling for boolean variants: if keys are exactly "true" and "false",
 * convert to boolean type. Otherwise, use keyof to preserve literal types.
 *
 * **STRICT MODE:** Unlike Stitches, we do NOT widen to allow any string/number.
 * Only the exact keys defined in the variant are allowed.
 *
 * @see VariantPropsFromConfig - Uses this to build variant props
 * @see Widen - Alternative approach used by Stitches (more permissive)
 *
 * @example
 * ```ts
 * type BoolVariant = { true: CSS; false: CSS };
 * type BoolKeys = ExtractVariantKeys<BoolVariant>; // boolean
 *
 * type SizeVariant = { sm: CSS; lg: CSS };
 * type SizeKeys = ExtractVariantKeys<SizeVariant>; // "sm" | "lg"
 * ```
 */
type ExtractVariantKeys<
  T,
  Theme extends DefaultTheme = DefaultTheme,
  ThemeMap extends Record<string, ThemeScale> = Record<string, ThemeScale>,
> = T extends Record<string, CSS<Theme, ThemeMap>>
  ? keyof T extends "true" | "false"
    ? boolean
    : keyof T
  : never;

/**
 * Converts variant configuration to prop types.
 * All variant props are optional and use exact literal types from the config.
 *
 * @see ExtractVariantKeys - Internal utility used for key extraction
 *
 * @example
 * ```ts
 * type Config = {
 *   size: { sm: CSS; lg: CSS };
 *   color: { primary: CSS; secondary: CSS };
 *   disabled: { true: CSS; false: CSS };
 * };
 * type Props = VariantPropsFromConfig<Config>;
 * // Result: {
 * //   size?: "sm" | "lg";
 * //   color?: "primary" | "secondary";
 * //   disabled?: boolean;
 * // }
 * ```
 */
export type VariantPropsFromConfig<T extends Variants> = {
  [K in keyof T]?: ExtractVariantKeys<T[K]>;
};

/**
 * Base props that all styled components have.
 * Includes className, css prop, and variant props.
 */
type StyledOwnProps<VariantsConfig extends Variants> = StyledBaseProps &
  VariantPropsFromConfig<VariantsConfig>;

/**
 * Merge utility that properly combines types.
 * Omits conflicting keys from T and adds all of U.
 */
type Merge<T, U> = Omit<T, keyof U> & U;

/**
 * Props for a styled component without the `as` prop polymorphism.
 * Just the base element props + our styled props.
 */
export type StyledComponentProps<
  DefaultElement extends ElementType,
  VariantsConfig extends Variants = {},
> = Merge<
  DefaultElement extends keyof JSX.IntrinsicElements | ComponentType<any>
    ? ComponentPropsWithRef<DefaultElement>
    : {},
  StyledOwnProps<VariantsConfig>
>;

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
  getCssText: () => string;
  globalCss: (...args: CSS[]) => () => void;
  keyframes: (definition: Record<string, CSS>) => string;
  preloadTheme: () => void;
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
 *
 * Note: We use ComponentType for maximum compatibility with React's type system.
 * This ensures styled components work seamlessly with React.ComponentProps,
 * forwardRef, and other React utilities without additional type gymnastics.
 */
/**
 * Styled component type with proper polymorphic support.
 * Based on Stitches' approach: uses ForwardRefExoticComponent + call signature overloads
 * to preserve strict variant types without permissive index signatures.
 *
 * This provides:
 * - Strict variant type checking (no extra variant values accepted)
 * - Support for `as` prop to change the underlying element
 * - Proper ref forwarding for both default and `as` elements
 */
export interface StyledComponent<
  DefaultElement extends ElementType,
  VariantsConfig extends Variants = {},
> extends ForwardRefExoticComponent<
    StyledComponentProps<DefaultElement, VariantsConfig>
  > {
  /**
   * Call signature without `as` prop - uses default element
   */
  (
    props: StyledComponentProps<DefaultElement, VariantsConfig> & {
      as?: never;
    }
  ): ReactElement | null;

  /**
   * Call signature with `as` prop - changes element type
   * Note: ref type is intentionally permissive to avoid conflicts when
   * using refs from hooks that may not match the exact element type.
   */
  <As extends ElementType = DefaultElement>(
    props: Merge<
      As extends keyof JSX.IntrinsicElements | ComponentType<unknown>
        ? Omit<ComponentPropsWithRef<As>, "ref"> & { ref?: unknown }
        : {},
      StyledOwnProps<VariantsConfig> & { as?: As }
    >
  ): ReactElement | null;

  selector: StyledComponentRef;
}

/**
 * Styled function type - the main styled() function signature
 * Variants must be embedded in the baseStyles object, matching Stitches API.
 * Overloads are ordered to prefer the variants overload when variants are present.
 */
export interface StyledFunction {
  // Overload 1: When baseStyles has variants property
  <
    DefaultElement extends StylableElement,
    BaseStyles extends CSS & {
      variants: {
        [Name in string]: {
          [Pair in string]: CSS;
        };
      };
    },
  >(
    defaultElement: DefaultElement,
    baseStyles: BaseStyles,
  ): StyledComponent<
    DefaultElement,
    BaseStyles extends { variants: infer V } ? (V extends Variants ? V : {}) : {}
  >;
  // Overload 2: When baseStyles has NO variants or is undefined
  <DefaultElement extends StylableElement>(
    defaultElement: DefaultElement,
    baseStyles?: CSS & { variants?: never },
  ): StyledComponent<DefaultElement, {}>;
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
   * @returns CSS text string with theme variables and component styles
   */
  getCssText: () => string;
  config: StoopConfig;
  /**
   * Pre-compiles CSS objects to warm the cache.
   * Useful for eliminating FOUC by pre-compiling common styles.
   *
   * @param styles - Array of CSS objects to pre-compile
   */
  warmCache: (styles: CSS[]) => void;
  /**
   * Preloads themes by injecting CSS variables before React renders.
   * Useful for preventing FOUC when loading a non-default theme from localStorage.
   * Always injects all configured themes.
   */
  preloadTheme: () => void;
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

/**
 * Returns the properties, attributes, and children expected by a component.
 * Use this to extract prop types from styled components.
 *
 * @example
 * ```ts
 * const Button = styled('button', { ... });
 * type ButtonProps = ComponentProps<typeof Button>;
 * ```
 */
export type ComponentProps<Component> = Component extends (...args: any[]) => any
  ? Parameters<Component>[0]
  : never;

/**
 * Returns a type that extracts only the variant props from a styled component.
 *
 * @example
 * ```ts
 * const Button = styled('button', {
 *   variants: { size: { sm: {}, lg: {} } }
 * });
 * type ButtonVariants = VariantProps<typeof Button>;
 * // Result: { size?: "sm" | "lg" }
 * ```
 */
export type VariantProps<Component extends { selector: any }> =
  Component extends StyledComponent<any, infer V> ? VariantPropsFromConfig<V> : never;

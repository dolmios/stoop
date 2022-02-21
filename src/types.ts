/**
 * Core TypeScript type definitions for Stoop.
 * Defines CSS objects, themes, variants, styled components, and instance types.
 */

import type { Context, ElementType, JSX } from "react";
import type { PolymorphicPropsWithRef } from "react-polymorphic-types";

import type { createCreateThemeFunction } from "./api/create-theme";
import type { createCSSFunction } from "./api/css";
import type { createGlobalCSSFunction } from "./api/global-css";
import type { createKeyframesFunction } from "./api/keyframes";
import type { createStyledFunction } from "./api/styled";

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
export type Theme = Record<string, unknown>;

export interface StoopConfig<TTheme extends Theme = Theme> {
  theme: TTheme;
  media?: Record<string, string>;
  utils?: Record<string, UtilityFunction>;
  prefix?: string;
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
}

export interface StoopInstance<TTheme extends Theme = Theme> {
  styled: ReturnType<typeof createStyledFunction>;
  css: ReturnType<typeof createCSSFunction>;
  createTheme: ReturnType<typeof createCreateThemeFunction>;
  globalCss: ReturnType<typeof createGlobalCSSFunction>;
  keyframes: ReturnType<typeof createKeyframesFunction>;
  theme: TTheme;
  getCssText: () => string;
  config: StoopConfig<TTheme>;
  ThemeContext: Context<ThemeContextValue | null>;
}

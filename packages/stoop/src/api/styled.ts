"use client";

/**
 * Styled component API.
 * Creates polymorphic styled components with variant support, theme awareness,
 * and CSS prop merging. Supports component targeting via selector references.
 */

import {
  useMemo,
  forwardRef,
  createElement,
  useContext,
  createContext,
  type ElementType,
  type Context,
} from "react";

import type {
  CSS,
  StyledComponentProps,
  StyledComponentRef,
  StylableElement,
  Theme,
  ThemeContextValue,
  ThemeScale,
  UtilityFunction,
  Variants,
} from "../types";

import { EMPTY_CSS, STOOP_COMPONENT_SYMBOL } from "../constants";
import { compileCSS } from "../core/compiler";
import { applyVariants } from "../core/variants";
import { hash, sanitizeClassName } from "../utils/string";

let defaultThemeContext: Context<ThemeContextValue | null> | null = null;

function getDefaultThemeContext(): Context<ThemeContextValue | null> {
  if (!defaultThemeContext) {
    defaultThemeContext = createContext<ThemeContextValue | null>(null);
  }

  return defaultThemeContext;
}

/**
 * Creates a styled component reference for selector targeting.
 *
 * @param className - Class name to reference
 * @returns StyledComponentRef for use in CSS selectors
 */
export function createStyledComponentRef(className: string): StyledComponentRef {
  const ref: StyledComponentRef & { [STOOP_COMPONENT_SYMBOL]: string; toString: () => string } = {
    __isStoopStyled: true,
    __stoopClassName: className,
    [STOOP_COMPONENT_SYMBOL]: className,
    toString: () => `__STOOP_COMPONENT_${className}`,
  };

  return ref;
}

/**
 * Type guard for styled component references.
 *
 * @param value - Value to check
 * @returns True if value is a styled component reference
 */
function isStyledComponent(value: unknown): value is StyledComponentRef {
  return (
    typeof value === "object" &&
    value !== null &&
    "__isStoopStyled" in value &&
    (value as { __isStoopStyled?: boolean }).__isStoopStyled === true
  );
}

/**
 * Separates component props into variant props and element props.
 * Variant props are used for style variants, element props are passed to the DOM element.
 *
 * @param props - All component props
 * @param variants - Variant configuration
 * @returns Object with separated elementProps and variantProps
 */
function extractVariantProps<V extends Variants>(
  props: Record<string, unknown>,
  variants: V | undefined,
): {
  elementProps: Record<string, unknown>;
  variantProps: Record<string, string | boolean | undefined>;
} {
  if (!variants) {
    return { elementProps: props, variantProps: {} };
  }

  const variantKeys = new Set(Object.keys(variants));
  const variantProps: Record<string, string | boolean | undefined> = {};
  const elementProps: Record<string, unknown> = {};

  for (const key in props) {
    if (variantKeys.has(key)) {
      variantProps[key] = props[key] as string | boolean | undefined;
    } else {
      elementProps[key] = props[key];
    }
  }

  return { elementProps, variantProps };
}

type CSSWithVariants = {
  [K in keyof CSS]: CSS[K];
} & {
  variants: Variants;
  compoundVariants?: unknown[];
};

/**
 * Creates a styled component factory function.
 * Supports polymorphic components, variants, theme awareness, and CSS prop merging.
 *
 * @param defaultTheme - Default theme for token resolution
 * @param prefix - Optional prefix for generated class names
 * @param media - Optional media query breakpoints
 * @param utils - Optional utility functions
 * @param themeMap - Optional theme scale mappings
 * @param themeContext - React context for theme values (instance-specific)
 * @returns Styled component factory function
 */
export function createStyledFunction(
  defaultTheme: Theme,
  prefix = "stoop",
  media?: Record<string, string>,
  utils?: Record<string, UtilityFunction>,
  themeMap?: Record<string, ThemeScale>,
  themeContext?: Context<ThemeContextValue | null>,
): {
  <DefaultElement extends StylableElement, BaseStyles extends CSSWithVariants>(
    defaultElement: DefaultElement,
    baseStyles: BaseStyles,
  ): ReturnType<
    typeof forwardRef<unknown, StyledComponentProps<DefaultElement, BaseStyles["variants"]>>
  > & {
    selector: StyledComponentRef;
  };
  <DefaultElement extends StylableElement, VariantsConfig extends Variants = {}>(
    defaultElement: DefaultElement,
    baseStyles?: CSS,
    variants?: VariantsConfig,
  ): ReturnType<
    typeof forwardRef<unknown, StyledComponentProps<DefaultElement, VariantsConfig>>
  > & {
    selector: StyledComponentRef;
  };
} {
  return function styled<
    DefaultElement extends StylableElement,
    BaseStylesOrVariants extends CSS | CSSWithVariants = CSS,
    VariantsParam extends Variants | undefined = undefined,
  >(
    defaultElement: DefaultElement,
    baseStylesOrVariants?: BaseStylesOrVariants,
    variantsParam?: VariantsParam,
  ) {
    type VariantsConfig = BaseStylesOrVariants extends CSSWithVariants
      ? BaseStylesOrVariants["variants"]
      : VariantsParam extends Variants
        ? VariantsParam
        : {};

    let actualBaseStyles: CSS = (baseStylesOrVariants || EMPTY_CSS) as CSS;
    let actualVariants: VariantsConfig | undefined = variantsParam as VariantsConfig | undefined;

    if (
      baseStylesOrVariants &&
      "variants" in baseStylesOrVariants &&
      typeof baseStylesOrVariants.variants === "object"
    ) {
      actualVariants = baseStylesOrVariants.variants as VariantsConfig;
      const { compoundVariants: __, variants: _, ...rest } = baseStylesOrVariants;

      actualBaseStyles = rest as CSS;
    }

    type Props = StyledComponentProps<DefaultElement, VariantsConfig>;

    let baseElementClassName: string | undefined;

    if (typeof defaultElement !== "string" && isStyledComponent(defaultElement)) {
      baseElementClassName = defaultElement.__stoopClassName;
    }

    const StyledComponent = forwardRef<unknown, Props>(
      function StyledComponent(propsWithBase, ref) {
        const {
          as,
          className,
          css: cssStyles,
          ...restProps
        } = propsWithBase as {
          as?: ElementType;
          className?: string;
          css?: CSS;
          [key: string]: unknown;
        };
        const element = (as || defaultElement) as ElementType;

        const cssObject: CSS = useMemo(
          () =>
            cssStyles && typeof cssStyles === "object" && cssStyles !== null
              ? (cssStyles as CSS)
              : EMPTY_CSS,
          [cssStyles],
        );

        const { elementProps, variantProps } = extractVariantProps(restProps, actualVariants);

        const contextValue = useContext(themeContext || getDefaultThemeContext());
        const currentTheme = contextValue?.theme || defaultTheme;
        const currentMedia = currentTheme.media ? { ...media, ...currentTheme.media } : media;

        const variantKey = useMemo(() => {
          if (!actualVariants) {
            return "";
          }

          const variantEntries = Object.entries(variantProps);

          if (variantEntries.length === 0) {
            return "";
          }

          return variantEntries
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}:${String(value)}`)
            .join("|");
        }, [variantProps]);

        const finalStyles = useMemo(() => {
          let componentStyles: CSS = actualBaseStyles;

          if (actualVariants && variantKey) {
            componentStyles = applyVariants(actualVariants, variantProps, actualBaseStyles);
          }

          if (cssObject !== EMPTY_CSS) {
            componentStyles = Object.assign({}, componentStyles, cssObject);
          }

          return componentStyles;
        }, [variantKey, cssObject, actualBaseStyles, actualVariants, variantProps]);

        const finalClassName = useMemo(() => {
          const classNames: string[] = [];

          if (baseElementClassName) {
            classNames.push(baseElementClassName);
          }

          const mergedClass = compileCSS(
            finalStyles,
            currentTheme,
            prefix,
            currentMedia,
            utils,
            themeMap,
          );

          if (mergedClass) {
            classNames.push(mergedClass);
          }

          if (className) {
            const classNameStr = typeof className === "string" ? className : String(className);
            const sanitizedClassName = sanitizeClassName(classNameStr);

            if (sanitizedClassName) {
              classNames.push(sanitizedClassName);
            }
          }

          return classNames.length > 0 ? classNames.join(" ") : undefined;
        }, [
          finalStyles,
          className,
          baseElementClassName,
          currentTheme,
          prefix,
          currentMedia,
          utils,
          themeMap,
        ]);

        return createElement(element, {
          ...elementProps,
          className: finalClassName,
          ref,
        });
      },
    );

    const selectorHash = hash(JSON.stringify(actualBaseStyles));
    const selectorClassName = `${prefix}-${selectorHash}`;

    const componentWithSelector = StyledComponent as typeof StyledComponent & {
      selector: StyledComponentRef;
    };

    componentWithSelector.selector = createStyledComponentRef(selectorClassName);

    return componentWithSelector;
  };
}

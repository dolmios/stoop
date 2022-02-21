/**
 * Styled component API.
 * Creates polymorphic styled components with variant support, theme awareness,
 * and CSS prop merging. Supports component targeting via selector references.
 */

import {
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  createElement,
  useContext,
  type ElementType,
} from "react";

import type {
  CSS,
  StyledComponentProps,
  StyledComponentRef,
  StylableElement,
  Theme,
  UtilityFunction,
  Variants,
} from "../types";

import { FALLBACK_CONTEXT, EMPTY_CSS } from "../constants";
import { compileCSS } from "../core/compiler";
import { updateThemeVariables } from "../core/theme-manager";
import { applyVariants } from "../core/variants";
import { sanitizeClassName } from "../utils/string";
import { themesAreEqual } from "../utils/theme";
import { getThemeContext } from "./css";

export const STOOP_COMPONENT_SYMBOL = Symbol.for("stoop.component");

export function createStyledComponentRef(className: string): StyledComponentRef {
  const ref: StyledComponentRef & { [STOOP_COMPONENT_SYMBOL]: string; toString: () => string } = {
    __isStoopStyled: true,
    __stoopClassName: className,
    [STOOP_COMPONENT_SYMBOL]: className,
    toString: () => `__STOOP_COMPONENT_${className}`,
  };

  return ref;
}

function isStyledComponent(value: unknown): value is StyledComponentRef {
  return (
    typeof value === "object" &&
    value !== null &&
    "__isStoopStyled" in value &&
    (value as { __isStoopStyled?: boolean }).__isStoopStyled === true
  );
}

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

export function createStyledFunction(
  defaultTheme: Theme,
  prefix = "",
  media?: Record<string, string>,
  utils?: Record<string, UtilityFunction>,
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

    const baseClassName = compileCSS(actualBaseStyles, defaultTheme, prefix, media, utils);

    let baseElementClassName: string | undefined;

    if (typeof defaultElement !== "string" && isStyledComponent(defaultElement)) {
      baseElementClassName = defaultElement.__stoopClassName;
    }

    const StyledComponent = forwardRef<unknown, Props>(
      function StyledComponent(propsWithBase, ref) {
        const { as, className, css: cssStyles, ...restProps } = propsWithBase as {
          as?: ElementType;
          className?: string;
          css?: CSS;
          [key: string]: unknown;
        };
        const element = (as || defaultElement) as ElementType;

        const cssObject: CSS =
          cssStyles && typeof cssStyles === "object" && cssStyles !== null
            ? (cssStyles as CSS)
            : EMPTY_CSS;

        const { elementProps, variantProps } = extractVariantProps(restProps, actualVariants);

        const themeContext = getThemeContext();
        const contextValue = useContext(themeContext || FALLBACK_CONTEXT);

        const currentTheme = contextValue?.theme || defaultTheme;

        const lastThemeRef = useRef<Theme | null>(null);

        useEffect(() => {
          const lastTheme = lastThemeRef.current;

          if (themesAreEqual(lastTheme, currentTheme)) {
            if (lastTheme !== currentTheme) {
              lastThemeRef.current = currentTheme;
            }

            return;
          }

          lastThemeRef.current = currentTheme;
          updateThemeVariables(currentTheme, prefix);
        }, [currentTheme, prefix]);

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
        }, [actualVariants, ...Object.values(variantProps)]);

        const finalStyles = useMemo(() => {
          let componentStyles: CSS = actualBaseStyles;

          if (actualVariants && variantKey) {
            componentStyles = applyVariants(actualVariants, variantProps, actualBaseStyles);
          }

          if (cssObject !== EMPTY_CSS) {
            componentStyles = Object.assign({}, componentStyles, cssObject);
          }

          return componentStyles;
        }, [variantKey, cssObject]);

        const finalClassName = useMemo(() => {
          const classNames: string[] = [];

          if (baseElementClassName) {
            classNames.push(baseElementClassName);
          }

          const mergedClass = compileCSS(finalStyles, currentTheme, prefix, media, utils);

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
        }, [finalStyles, currentTheme, prefix, media, utils, className, baseElementClassName]);

        return createElement(element, {
          ...elementProps,
          className: finalClassName,
          ref,
        });
      },
    );

    const componentWithSelector = StyledComponent as typeof StyledComponent & {
      selector: StyledComponentRef;
    };

    componentWithSelector.selector = createStyledComponentRef(baseClassName);

    return componentWithSelector;
  };
}

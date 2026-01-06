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
  CSSPropertyValue,
  CSSWithVariants,
  StyledComponentProps,
  StyledComponentRef,
  StylableElement,
  Theme,
  ThemeContextValue,
  ThemeScale,
  UtilityFunction,
  Variants,
  VariantProps,
} from "../types";

import { EMPTY_CSS, STOOP_COMPONENT_SYMBOL } from "../constants";
import { compileCSS } from "../core/compiler";
import { isStyledComponentRef } from "../utils/helpers";
import { hash, sanitizeClassName } from "../utils/theme-utils";

// ============================================================================
// Variant Application Logic
// ============================================================================

/**
 * Applies variant styles to base styles based on component props.
 * Optimized to avoid unnecessary object spreads when no variants are applied.
 *
 * @param variants - Variant configuration object
 * @param props - Component props containing variant values
 * @param baseStyles - Base styles to merge with variant styles
 * @returns Merged CSS object
 */
function applyVariants(variants: Variants, props: VariantProps, baseStyles: CSS): CSS {
  const appliedVariantStyles: CSS[] = [];

  for (const variantName in variants) {
    const propValue = props[variantName];

    if (propValue === undefined) {
      continue;
    }

    const variantOptions = variants[variantName] as Record<string | number, CSS>;
    const key = propValue === true ? "true" : propValue === false ? "false" : String(propValue);

    if (variantOptions[key]) {
      appliedVariantStyles.push(variantOptions[key]);
    }
  }

  if (appliedVariantStyles.length === 0) {
    return baseStyles;
  }

  // Optimize for single variant case
  if (appliedVariantStyles.length === 1) {
    return { ...baseStyles, ...appliedVariantStyles[0] };
  }

  // Merge multiple variant styles
  const mergedVariants = { ...appliedVariantStyles[0] };

  for (let i = 1; i < appliedVariantStyles.length; i++) {
    Object.assign(mergedVariants, appliedVariantStyles[i]);
  }

  return { ...baseStyles, ...mergedVariants };
}

// ============================================================================
// Styled Component API
// ============================================================================

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
  return isStyledComponentRef(value);
}

/**
 * Set of common CSS properties that should not be passed to DOM elements.
 * These are camelCase CSS properties that React doesn't recognize as valid DOM attributes.
 */
const CSS_PROPERTIES = new Set([
  "alignContent",
  "alignItems",
  "alignSelf",
  "animation",
  "animationDelay",
  "animationDirection",
  "animationDuration",
  "animationFillMode",
  "animationIterationCount",
  "animationName",
  "animationPlayState",
  "animationTimingFunction",
  "aspectRatio",
  "backdropFilter",
  "backfaceVisibility",
  "background",
  "backgroundAttachment",
  "backgroundBlendMode",
  "backgroundClip",
  "backgroundColor",
  "backgroundImage",
  "backgroundOrigin",
  "backgroundPosition",
  "backgroundRepeat",
  "backgroundSize",
  "border",
  "borderBottom",
  "borderBottomColor",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderBottomStyle",
  "borderBottomWidth",
  "borderCollapse",
  "borderColor",
  "borderImage",
  "borderImageOutset",
  "borderImageRepeat",
  "borderImageSlice",
  "borderImageSource",
  "borderImageWidth",
  "borderLeft",
  "borderLeftColor",
  "borderLeftStyle",
  "borderLeftWidth",
  "borderRadius",
  "borderRight",
  "borderRightColor",
  "borderRightStyle",
  "borderRightWidth",
  "borderSpacing",
  "borderStyle",
  "borderTop",
  "borderTopColor",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderTopStyle",
  "borderTopWidth",
  "borderWidth",
  "bottom",
  "boxShadow",
  "boxSizing",
  "captionSide",
  "caretColor",
  "clear",
  "clip",
  "clipPath",
  "color",
  "columnCount",
  "columnFill",
  "columnGap",
  "columnRule",
  "columnRuleColor",
  "columnRuleStyle",
  "columnRuleWidth",
  "columnSpan",
  "columnWidth",
  "columns",
  "content",
  "counterIncrement",
  "counterReset",
  "cursor",
  "direction",
  "display",
  "emptyCells",
  "filter",
  "flex",
  "flexBasis",
  "flexDirection",
  "flexFlow",
  "flexGrow",
  "flexShrink",
  "flexWrap",
  "float",
  "font",
  "fontFamily",
  "fontFeatureSettings",
  "fontKerning",
  "fontLanguageOverride",
  "fontSize",
  "fontSizeAdjust",
  "fontStretch",
  "fontStyle",
  "fontSynthesis",
  "fontVariant",
  "fontVariantAlternates",
  "fontVariantCaps",
  "fontVariantEastAsian",
  "fontVariantLigatures",
  "fontVariantNumeric",
  "fontVariantPosition",
  "fontWeight",
  "gap",
  "grid",
  "gridArea",
  "gridAutoColumns",
  "gridAutoFlow",
  "gridAutoRows",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnGap",
  "gridColumnStart",
  "gridGap",
  "gridRow",
  "gridRowEnd",
  "gridRowGap",
  "gridRowStart",
  "gridTemplate",
  "gridTemplateAreas",
  "gridTemplateColumns",
  "gridTemplateRows",
  "height",
  "hyphens",
  "imageOrientation",
  "imageRendering",
  "imageResolution",
  "imeMode",
  "inlineSize",
  "isolation",
  "justifyContent",
  "justifyItems",
  "justifySelf",
  "left",
  "letterSpacing",
  "lineHeight",
  "listStyle",
  "listStyleImage",
  "listStylePosition",
  "listStyleType",
  "margin",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginTop",
  "maxHeight",
  "maxWidth",
  "minHeight",
  "minWidth",
  "objectFit",
  "objectPosition",
  "opacity",
  "order",
  "orphans",
  "outline",
  "outlineColor",
  "outlineOffset",
  "outlineStyle",
  "outlineWidth",
  "overflow",
  "overflowWrap",
  "overflowX",
  "overflowY",
  "padding",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "pageBreakAfter",
  "pageBreakBefore",
  "pageBreakInside",
  "perspective",
  "perspectiveOrigin",
  "placeContent",
  "placeItems",
  "placeSelf",
  "pointerEvents",
  "position",
  "quotes",
  "resize",
  "right",
  "rowGap",
  "scrollBehavior",
  "tabSize",
  "tableLayout",
  "textAlign",
  "textAlignLast",
  "textDecoration",
  "textDecorationColor",
  "textDecorationLine",
  "textDecorationStyle",
  "textIndent",
  "textJustify",
  "textOverflow",
  "textShadow",
  "textTransform",
  "textUnderlinePosition",
  "top",
  "transform",
  "transformOrigin",
  "transformStyle",
  "transition",
  "transitionDelay",
  "transitionDuration",
  "transitionProperty",
  "transitionTimingFunction",
  "unicodeBidi",
  "userSelect",
  "verticalAlign",
  "visibility",
  "whiteSpace",
  "width",
  "wordBreak",
  "wordSpacing",
  "wordWrap",
  "writingMode",
  "zIndex",
]);

/**
 * Checks if a prop name is a CSS property that should be converted to CSS styles.
 *
 * @param propName - The prop name to check
 * @returns True if the prop is a CSS property
 */
function isCSSProperty(propName: string): boolean {
  return CSS_PROPERTIES.has(propName);
}

/**
 * Separates component props into variant props, CSS props, and element props.
 * Variant props are used for style variants.
 * CSS props are converted to CSS styles.
 * Element props are passed to the DOM element.
 *
 * @param props - All component props
 * @param variants - Variant configuration
 * @returns Object with separated elementProps, variantProps, and cssProps
 */
function extractVariantProps<V extends Variants>(
  props: Record<string, unknown>,
  variants: V | undefined,
): {
  cssProps: CSS;
  elementProps: Record<string, unknown>;
  variantProps: Record<string, string | boolean | undefined>;
} {
  const variantKeys = variants ? new Set(Object.keys(variants)) : new Set<string>();
  const variantProps: Record<string, string | boolean | undefined> = {};
  const cssProps: CSS = {};
  const elementProps: Record<string, unknown> = {};

  for (const key in props) {
    if (variantKeys.has(key)) {
      variantProps[key] = props[key] as string | boolean | undefined;
    } else if (isCSSProperty(key)) {
      cssProps[key] = props[key] as CSSPropertyValue | CSS | undefined;
    } else {
      elementProps[key] = props[key];
    }
  }

  return { cssProps, elementProps, variantProps };
}

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
  <DefaultElement extends StylableElement>(
    defaultElement: DefaultElement,
    baseStyles?: CSS,
  ): ReturnType<
    typeof forwardRef<unknown, StyledComponentProps<DefaultElement, {}>>
  > & {
    selector: StyledComponentRef;
  };
} {
  return function styled<
    DefaultElement extends StylableElement,
    BaseStyles extends CSS | CSSWithVariants = CSS,
  >(
    defaultElement: DefaultElement,
    baseStyles?: BaseStyles,
  ) {
    // Extract variants config from embedded variants only (matching Stitches API)
    type VariantsConfig = BaseStyles extends CSSWithVariants
      ? BaseStyles["variants"]
      : {};

    let actualBaseStyles: CSS = (baseStyles || EMPTY_CSS) as CSS;
    let actualVariants: VariantsConfig | undefined;

    // Extract variants if embedded in baseStyles
    if (
      baseStyles &&
      "variants" in baseStyles &&
      typeof baseStyles.variants === "object" &&
      baseStyles.variants !== null &&
      !Array.isArray(baseStyles.variants)
    ) {
      // Verify it's actually a Variants object (has string keys with CSS values)
      const variantsObj = baseStyles.variants as Record<string, unknown>;
      const hasValidVariants = Object.keys(variantsObj).length > 0 &&
        Object.values(variantsObj).every(
          (v) => typeof v === "object" && v !== null && !Array.isArray(v)
        );

      if (hasValidVariants) {
        actualVariants = baseStyles.variants as VariantsConfig;
        const { variants: _, ...rest } = baseStyles;

        actualBaseStyles = rest as CSS;
      }
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

        const { cssProps, elementProps, variantProps } = extractVariantProps(
          restProps,
          actualVariants,
        );

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

          if (Object.keys(cssProps).length > 0) {
            componentStyles = Object.assign({}, componentStyles, cssProps);
          }

          if (cssObject !== EMPTY_CSS) {
            componentStyles = Object.assign({}, componentStyles, cssObject);
          }

          return componentStyles;
        }, [variantKey, cssObject, cssProps, actualBaseStyles, actualVariants, variantProps]);

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

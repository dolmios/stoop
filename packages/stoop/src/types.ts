import type {
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ForwardRefExoticComponent,
  ReactElement,
  ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// CSS type – CSSProperties + nested selectors + theme tokens + utility props
// ---------------------------------------------------------------------------

type UtilityProps = {
  m?: string | number;
  mt?: string | number;
  mb?: string | number;
  ml?: string | number;
  mr?: string | number;
  mx?: string | number;
  my?: string | number;
  p?: string | number;
  pt?: string | number;
  pb?: string | number;
  pl?: string | number;
  pr?: string | number;
  px?: string | number;
  py?: string | number;
  w?: string | number;
  h?: string | number;
  minW?: string | number;
  maxW?: string | number;
  minH?: string | number;
  maxH?: string | number;
};

export type CSS = CSSProperties &
  UtilityProps & {
    /** Nested selectors (&..., :..., @...) and theme tokens ($token) */
    [key: `&${string}`]: CSS;
    [key: `:${string}`]: CSS;
    [key: `@${string}`]: CSS;
    [key: `$${string}`]: string | number;
  };

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export type VariantDefinitions = {
  [name: string]: { [value: string]: CSS };
};

export type CompoundVariantDefinition<V extends VariantDefinitions> = {
  [K in keyof V]?: keyof V[K];
} & {
  css: CSS;
};

// ---------------------------------------------------------------------------
// Styled config (second argument to styled())
// ---------------------------------------------------------------------------

export interface StyledConfig<V extends VariantDefinitions> {
  /** Base CSS applied to every instance of the component */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  variants?: V;
  compoundVariants?: CompoundVariantDefinition<V>[];
  defaultVariants?: {
    [K in keyof V]?: keyof V[K];
  };
}

// ---------------------------------------------------------------------------
// Variant extraction helpers
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ExtractVariants<S> = S extends { variants: infer V } ? V : {};

/**
 * If the variant's keys are exactly "true" | "false", resolve to boolean.
 * Otherwise resolve to keyof T (the union of value names).
 */
export type VariantValue<T> = "true" extends keyof T
  ? "false" extends keyof T
    ? boolean
    : keyof T
  : keyof T;

export type VariantPropsOf<V> = {
  [K in keyof V]?: VariantValue<V[K]>;
};

/**
 * Extract variant props from a StyledComponent.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
export type VariantProps<C> = C extends StyledComponent<any, infer V> ? VariantPropsOf<V> : {};

// ---------------------------------------------------------------------------
// StyledComponent
// ---------------------------------------------------------------------------

export type StyledComponent<
  E extends ElementType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
  V extends Record<string, any> = {},
> = ForwardRefExoticComponent<ComponentPropsWithRef<E> & VariantPropsOf<V>> & {
  /** Polymorphic render – render as a different element or component */
  <As extends ElementType = E>(
    props: { as: As } & Omit<ComponentPropsWithRef<As>, keyof VariantPropsOf<V>> &
      VariantPropsOf<V>,
  ): ReactElement | null;

  /** Standard call signature (no `as` prop) */
  (props: ComponentPropsWithRef<E> & VariantPropsOf<V>): ReactElement | null;

  /** CSS selector reference for component targeting in nested selectors */
  selector: string;
};

// ---------------------------------------------------------------------------
// StyledComponentRef (runtime selector object)
// ---------------------------------------------------------------------------

export interface StyledComponentRef {
  readonly __isStoopStyled: true;
  readonly __stoopClassName: string;
  toString(): string;
}

// ---------------------------------------------------------------------------
// StyledFunction – the callable signature of styled()
// ---------------------------------------------------------------------------

export interface StyledFunction {
  /** styled(element, configWithVariants) */
  <E extends ElementType, V extends VariantDefinitions>(
    element: E,
    config: CSS & {
      variants: V;
      compoundVariants?: CompoundVariantDefinition<V>[];
      defaultVariants?: { [K in keyof V]?: keyof V[K] };
    },
  ): StyledComponent<E, V>;

  /** styled(element, cssOnly) – no variants */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  <E extends ElementType>(element: E, css?: CSS): StyledComponent<E, {}>;

  /** styled(existingStyledComponent, overrides) – component composition */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <E extends ElementType, V extends Record<string, any>>(
    component: StyledComponent<E, V>,
    css?: CSS,
  ): StyledComponent<E, V>;
}

// ---------------------------------------------------------------------------
// Utility function types
// ---------------------------------------------------------------------------

export type CSSFunction = (styles: CSS) => string;

export type GlobalCSSFunction = (styles: Record<string, CSS>) => void;

export type KeyframesFunction = (definition: Record<string, CSS>) => string;

// ---------------------------------------------------------------------------
// Theme types (re-exported from provider for convenience)
// ---------------------------------------------------------------------------

export interface ThemeContextValue {
  theme: string;
  setTheme: (theme: string) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

// ---------------------------------------------------------------------------
// JSX augmentation – add css prop to all HTML elements
// ---------------------------------------------------------------------------

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    css?: CSS;
  }
}

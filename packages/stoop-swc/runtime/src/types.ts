import type {
  ComponentPropsWithRef,
  ForwardRefExoticComponent,
  CSSProperties,
  JSX,
  ElementType,
} from "react";

export type CSS = CSSProperties & {
  [key: string]: string | number | CSS | undefined;
};

export interface ThemeContextValue {
  theme: string;
  setTheme: (theme: string) => void;
}

export type VariantProps<T> = T extends (...args: any) => any
  ? Parameters<T>[2] extends Record<string, any>
    ? {
        [K in keyof Parameters<T>[2]]?: keyof Parameters<T>[2][K];
      }
    : {}
  : {};

export interface StyledComponentRef {
  readonly __isStoopStyled: true;
  readonly __stoopClassName: string;
  toString(): string;
}

export type StyledComponent<
  E extends ElementType,
  V extends Record<string, any>,
> = ForwardRefExoticComponent<
  ComponentPropsWithRef<E> & VariantProps<typeof import("./styled").styled>
> & {
  selector: StyledComponentRef;
};
